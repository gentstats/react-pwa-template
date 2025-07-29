import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export function PWAUpdatePrompt() {
  const [showReload, setShowReload] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      })

      // Check for waiting service worker
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          setWaitingWorker(registration.waiting)
          setShowReload(true)
        }
      })
    }

    // Listen for the custom update available event from the SW
    const handleUpdateAvailable = () => {
      setShowReload(true)
    }

    window.addEventListener('sw-update-available', handleUpdateAvailable)
    
    return () => {
      window.removeEventListener('sw-update-available', handleUpdateAvailable)
    }
  }, [])

  const updateServiceWorker = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' })
      setShowReload(false)
    } else {
      window.location.reload()
    }
  }

  if (!showReload) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 bg-primary text-primary-foreground border rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">Update Available</h3>
          <p className="text-xs opacity-90 mb-3">
            A new version of the app is available. Refresh to update.
          </p>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="secondary"
              onClick={updateServiceWorker}
            >
              Refresh
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowReload(false)}
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            >
              Later
            </Button>
          </div>
        </div>
        <button
          onClick={() => setShowReload(false)}
          className="text-primary-foreground/70 hover:text-primary-foreground"
        >
          ✕
        </button>
      </div>
    </div>
  )
}