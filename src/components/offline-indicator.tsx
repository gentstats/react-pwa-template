import { useOnlineStatus } from '@/hooks/use-online-status'

export function OfflineIndicator() {
  const isOnline = useOnlineStatus()

  if (isOnline) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-yellow-900 px-4 py-2 text-center text-sm font-medium z-50">
      <div className="flex items-center justify-center gap-2">
        <div className="w-2 h-2 bg-yellow-900 rounded-full animate-pulse" />
        You're currently offline. Some features may be limited.
      </div>
    </div>
  )
}