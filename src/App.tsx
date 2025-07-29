import { Button } from "@/components/ui/button"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { PWAUpdatePrompt } from "@/components/pwa-update-prompt"
import { OfflineIndicator } from "@/components/offline-indicator"

function App() {
  return (
    <div className="min-h-screen bg-background">
      <OfflineIndicator />
      <PWAUpdatePrompt />
      <PWAInstallPrompt />
      
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
            <h3 className="text-lg font-semibold mb-2">PWA Ready</h3>
            <p className="text-muted-foreground">
              Installable, offline-capable, with service workers and auto-updates.
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-2">Enterprise Auth</h3>
            <p className="text-muted-foreground">
              Multi-provider authentication with role-based access control.
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-2">Modern Stack</h3>
            <p className="text-muted-foreground">
              Built with React 18, TypeScript, TanStack, and Convex backend.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
