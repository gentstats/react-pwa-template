import { useAuth } from '@/lib/auth';
import type { UserRole } from '@/types/convex';

type Permission = 
  | 'read_users'
  | 'write_users'
  | 'delete_users'
  | 'read_organizations'
  | 'write_organizations'
  | 'delete_organizations'
  | 'read_tasks'
  | 'write_tasks'
  | 'delete_tasks'
  | 'read_audit_logs'
  | 'admin_panel'
  | 'system_config';

const rolePermissions: Record<UserRole, Permission[]> = {
  viewer: ['read_tasks'],
  user: ['read_tasks', 'write_tasks'],
  manager: [
    'read_tasks',
    'write_tasks',
    'delete_tasks',
    'read_users',
    'write_users',
  ],
  admin: [
    'read_tasks',
    'write_tasks',
    'delete_tasks',
    'read_users',
    'write_users',
    'delete_users',
    'read_organizations',
    'write_organizations',
    'delete_organizations',
    'read_audit_logs',
    'admin_panel',
    'system_config',
  ],
};

export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return rolePermissions[user.role]?.includes(permission) || false;
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  const hasMinimumRole = (minimumRole: UserRole): boolean => {
    if (!user) return false;
    
    const roleHierarchy: Record<UserRole, number> = {
      viewer: 1,
      user: 2,
      manager: 3,
      admin: 4,
    };

    const userLevel = roleHierarchy[user.role];
    const requiredLevel = roleHierarchy[minimumRole];

    return userLevel >= requiredLevel;
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasMinimumRole,
    userRole: user?.role,
    permissions: user ? rolePermissions[user.role] : [],
  };
}