import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react';

// The terminal is a separate lazy chunk: the normal site bundle and routes are untouched.
const Terminal = lazy(() => import('./terminal/Terminal.tsx'))
const isTerminalRoute = /^\/terminal\/?$/.test(window.location.pathname)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isTerminalRoute ? (
      <Suspense fallback={null}>
        <Terminal />
      </Suspense>
    ) : (
      <>
        <App />
        <Analytics />
         <SpeedInsights />
      </>
    )}
  </StrictMode>,
)
