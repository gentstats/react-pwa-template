import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConvexClientProvider } from './lib/convex.tsx'
import { AuthProvider } from './lib/auth.tsx'
import { ThemeProvider } from './lib/theme.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="pwa-template-theme">
      <ConvexClientProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ConvexClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
