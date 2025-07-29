import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConvexClientProvider } from './lib/convex.tsx'
import { AuthProvider } from './lib/auth.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexClientProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ConvexClientProvider>
  </StrictMode>,
)
