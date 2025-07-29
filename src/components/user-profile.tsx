
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'manager':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'user':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'viewer':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-muted-foreground text-sm">{user.email}</p>
            <span 
              className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getRoleBadgeColor(user.role)}`}
            >
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          Sign out
        </Button>
      </div>
      
      <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Status</p>
            <p className={user.isActive ? 'text-green-600' : 'text-red-600'}>
              {user.isActive ? 'Active' : 'Inactive'}
            </p>
          </div>
          <div>
            <p className="font-medium">Last Login</p>
            <p>
              {user.lastLoginAt 
                ? new Date(user.lastLoginAt).toLocaleDateString()
                : 'Never'
              }
            </p>
          </div>
          <div>
            <p className="font-medium">Member Since</p>
            <p>{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-medium">Organization</p>
            <p>{user.organizationId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}