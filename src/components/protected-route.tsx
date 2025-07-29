import React from 'react';
import { useAuth } from '@/lib/auth';
import { LoginForm } from '@/components/forms/login-form';
import type { UserRole } from '@/types/convex';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallback 
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoginForm />
      </div>
    );
  }

  // Check role permissions
  if (requiredRole && user) {
    const roleHierarchy: Record<UserRole, number> = {
      viewer: 1,
      user: 2,
      manager: 3,
      admin: 4,
    };

    const userLevel = roleHierarchy[user.role];
    const requiredLevel = roleHierarchy[requiredRole];

    if (userLevel < requiredLevel) {
      return (
        fallback || (
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
              <p className="text-muted-foreground">
                You don't have permission to access this resource.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Required role: {requiredRole} | Your role: {user.role}
              </p>
            </div>
          </div>
        )
      );
    }
  }

  return <>{children}</>;
}