import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Column<T> {
  key: keyof T | 'actions';
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onAdd?: () => void;
  addButtonText?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = "Search...",
  onEdit,
  onDelete,
  onAdd,
  addButtonText = "Add New"
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter data based on search term
  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    
    return columns
      .filter(col => col.searchable !== false)
      .some(col => {
        if (col.key === 'actions') return false;
        const value = item[col.key];
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;
    
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (key: keyof T) => {
    if (sortKey !== key) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      );
    }
    
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header with search and add button */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        {onAdd && (
          <Button onClick={onAdd}>
            {addButtonText}
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
                  >
                    {column.key !== 'actions' && column.sortable !== false ? (
                      <button
                        className="flex items-center space-x-1 hover:text-foreground"
                        onClick={() => handleSort(column.key as keyof T)}
                      >
                        <span>{column.header}</span>
                        {getSortIcon(column.key as keyof T)}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {sortedData.map((item, index) => (
                <tr key={index} className="hover:bg-muted/25 transition-colors">
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-4 py-3 text-sm">
                      {column.key === 'actions' ? (
                        <div className="flex items-center space-x-2">
                          {onEdit && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEdit(item)}
                            >
                              Edit
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onDelete(item)}
                              className="text-destructive hover:text-destructive"
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      ) : column.render ? (
                        column.render(item)
                      ) : (
                        String(item[column.key] || '')
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {sortedData.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    {searchTerm ? 'No results found.' : 'No data available.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}