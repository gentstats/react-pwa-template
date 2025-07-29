import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { PWAUpdatePrompt } from "@/components/pwa-update-prompt"
import { OfflineIndicator } from "@/components/offline-indicator"
import { ProtectedRoute } from "@/components/protected-route"
import { UserProfile } from "@/components/user-profile"
import { Navigation } from "@/components/layouts/navigation"
import { useAuth } from "@/lib/auth"
import { usePermissions } from "@/hooks/use-permissions"

function Dashboard() {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">
          Here's what's happening in your organization today.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>TOTAL TASKS</CardDescription>
                <CardTitle className="text-2xl">24</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-green-600">+12% from last week</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>COMPLETED</CardDescription>
                <CardTitle className="text-2xl">18</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-green-600">+8% from last week</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>IN PROGRESS</CardDescription>
                <CardTitle className="text-2xl">6</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-blue-600">2 due today</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline" size="sm">New Task</Button>
                <Button variant="outline" size="sm">View Reports</Button>
                {hasPermission('admin_panel') && (
                  <Button variant="outline" size="sm">Admin Panel</Button>
                )}
                <Button variant="outline" size="sm">Settings</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <UserProfile />
        </div>
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-6">
          Enterprise PWA Template
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A complete enterprise-grade Progressive Web App template with React 18, 
          TypeScript, Vite, Convex, and modern tooling.
        </p>
        <div className="flex gap-4 justify-center">
          <Button>Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔐 Enterprise Auth
            </CardTitle>
            <CardDescription>
              Multi-provider authentication with role-based access control and multi-tenant support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Google & GitHub OAuth</li>
              <li>• Role-based permissions</li>
              <li>• Multi-tenant organizations</li>
              <li>• Session management</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📱 PWA Ready
            </CardTitle>
            <CardDescription>
              Installable, offline-capable, with service workers and auto-updates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Installable on mobile & desktop</li>
              <li>• Offline functionality</li>
              <li>• Auto-updates</li>
              <li>• Push notifications</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚡ Modern Stack
            </CardTitle>
            <CardDescription>
              Built with React 18, TypeScript, TanStack, and Convex backend.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• React 18 + TypeScript</li>
              <li>• TanStack Router & Query</li>
              <li>• Convex real-time backend</li>
              <li>• ShadCN/UI components</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function App() {
  const { isAuthenticated } = useAuth();

  const handleNavigate = (page: string) => {
    // TODO: Implement actual navigation/routing
    console.log('Navigate to:', page);
  };

  return (
    <div className="min-h-screen bg-background">
      <OfflineIndicator />
      <PWAUpdatePrompt />
      <PWAInstallPrompt />
      
      <Navigation onNavigate={handleNavigate} />
      
      {isAuthenticated ? (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ) : (
        <LandingPage />
      )}
    </div>
  )
}

export default App
