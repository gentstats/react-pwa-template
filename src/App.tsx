import { Button } from "@/components/ui/button"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { PWAUpdatePrompt } from "@/components/pwa-update-prompt"
import { OfflineIndicator } from "@/components/offline-indicator"
import { ProtectedRoute } from "@/components/protected-route"
import { UserProfile } from "@/components/user-profile"
import { useAuth } from "@/lib/auth"
import { usePermissions } from "@/hooks/use-permissions"

function Dashboard() {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">
          Here's what's happening in your organization today.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-card">
              <h3 className="font-semibold text-sm text-muted-foreground">TOTAL TASKS</h3>
              <p className="text-2xl font-bold mt-1">24</p>
              <p className="text-xs text-green-600 mt-1">+12% from last week</p>
            </div>
            <div className="p-4 border rounded-lg bg-card">
              <h3 className="font-semibold text-sm text-muted-foreground">COMPLETED</h3>
              <p className="text-2xl font-bold mt-1">18</p>
              <p className="text-xs text-green-600 mt-1">+8% from last week</p>
            </div>
            <div className="p-4 border rounded-lg bg-card">
              <h3 className="font-semibold text-sm text-muted-foreground">IN PROGRESS</h3>
              <p className="text-2xl font-bold mt-1">6</p>
              <p className="text-xs text-blue-600 mt-1">2 due today</p>
            </div>
          </div>

          <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" size="sm">New Task</Button>
              <Button variant="outline" size="sm">View Reports</Button>
              {hasPermission('admin_panel') && (
                <Button variant="outline" size="sm">Admin Panel</Button>
              )}
              <Button variant="outline" size="sm">Settings</Button>
            </div>
          </div>
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
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="text-lg font-semibold mb-2">🔐 Enterprise Auth</h3>
          <p className="text-muted-foreground mb-4">
            Multi-provider authentication with role-based access control and multi-tenant support.
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Google & GitHub OAuth</li>
            <li>• Role-based permissions</li>
            <li>• Multi-tenant organizations</li>
            <li>• Session management</li>
          </ul>
        </div>
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="text-lg font-semibold mb-2">📱 PWA Ready</h3>
          <p className="text-muted-foreground mb-4">
            Installable, offline-capable, with service workers and auto-updates.
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Installable on mobile & desktop</li>
            <li>• Offline functionality</li>
            <li>• Auto-updates</li>
            <li>• Push notifications</li>
          </ul>
        </div>
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="text-lg font-semibold mb-2">⚡ Modern Stack</h3>
          <p className="text-muted-foreground mb-4">
            Built with React 18, TypeScript, TanStack, and Convex backend.
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• React 18 + TypeScript</li>
            <li>• TanStack Router & Query</li>
            <li>• Convex real-time backend</li>
            <li>• ShadCN/UI components</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <OfflineIndicator />
      <PWAUpdatePrompt />
      <PWAInstallPrompt />
      
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
