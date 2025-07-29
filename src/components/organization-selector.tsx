import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

interface OrganizationSelectorProps {
  organizations: Organization[];
  currentOrganization?: Organization;
  onOrganizationChange: (organization: Organization) => void;
}

export function OrganizationSelector({
  organizations,
  currentOrganization,
  onOrganizationChange,
}: OrganizationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (organizations.length <= 1) {
    return null; // Don't show selector if there's only one organization
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          {currentOrganization?.logo && (
            <img
              src={currentOrganization.logo}
              alt={currentOrganization.name}
              className="w-4 h-4 rounded"
            />
          )}
          <span>{currentOrganization?.name || 'Select Organization'}</span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-md shadow-lg z-50">
          {organizations.map((org) => (
            <button
              key={org.id}
              className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center space-x-2"
              onClick={() => {
                onOrganizationChange(org);
                setIsOpen(false);
              }}
            >
              {org.logo && (
                <img
                  src={org.logo}
                  alt={org.name}
                  className="w-4 h-4 rounded"
                />
              )}
              <div>
                <p className="font-medium">{org.name}</p>
                <p className="text-xs text-muted-foreground">@{org.slug}</p>
              </div>
              {currentOrganization?.id === org.id && (
                <svg className="w-4 h-4 ml-auto text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}