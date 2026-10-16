import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ContentProvider } from './content/ContentContext.jsx'
import { Router } from './router.jsx'
import { startSmoothScroll } from './motion/scroll.js'
import { prepareReveal } from './motion/reveal.jsx'

// Le back-office n'est chargé que sur /admin
const Admin = lazy(() => import('./admin/Admin.jsx'))
const isAdmin = window.location.pathname.replace(/\/+$/, '').startsWith('/admin')
if (!isAdmin) {
  startSmoothScroll()
  prepareReveal()
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdmin ? (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    ) : (
      <Router>
        <ContentProvider>
          <App />
        </ContentProvider>
      </Router>
    )}
  </StrictMode>,
)
