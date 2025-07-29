import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/lib/auth';
import { usePermissions } from '@/hooks/use-permissions';

interface NavigationProps {
  onNavigate?: (page: string) => void;
}

export function Navigation({ onNavigate }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { hasPermission } = usePermissions();

  const handleNavigate = (page: string) => {
    onNavigate?.(page);
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { label: 'Dashboard', href: 'dashboard', permission: null },
    { label: 'Tasks', href: 'tasks', permission: 'read_tasks' as const },
    { label: 'Users', href: 'users', permission: 'read_users' as const },
    { label: 'Admin', href: 'admin', permission: 'admin_panel' as const },
  ];

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigate('dashboard')}
              className="text-xl font-bold text-foreground hover:text-primary transition-colors"
            >
              PWA Template
            </button>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-6">
              {navigationItems
                .filter(item => !item.permission || hasPermission(item.permission))
                .map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavigate(item.href)}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
            </div>
          )}

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user?.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={logout}>
                  Sign out
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => handleNavigate('login')}>
                Sign in
              </Button>
            )}

            {/* Mobile menu button */}
            {isAuthenticated && (
              <button
                className="md:hidden p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && isAuthenticated && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-4">
              {/* User info */}
              <div className="flex items-center space-x-3 px-2">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              {/* Navigation items */}
              <div className="space-y-2">
                {navigationItems
                  .filter(item => !item.permission || hasPermission(item.permission))
                  .map((item) => (
                    <button
                      key={item.href}
                      onClick={() => handleNavigate(item.href)}
                      className="w-full text-left px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
              </div>

              {/* Sign out */}
              <div className="pt-4 border-t">
                <Button variant="outline" size="sm" onClick={logout} className="w-full">
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}