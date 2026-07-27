import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { RoleProvider } from './contexts/RoleContext.jsx'
import { PaywallProvider } from './contexts/PaywallContext.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'

// ErrorBoundary englobe TOUT, y compris les providers : une exception dans
// AuthProvider ou RoleProvider (profil illisible, session expirée…) produisait
// sinon une page entièrement blanche, sans message ni recours.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <RoleProvider>
            <PaywallProvider>
              <App />
            </PaywallProvider>
          </RoleProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
