import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './lib/i18n'
import App from './App.tsx'
import { queryClient } from './lib/queryClient'
import { store } from './store'
import { AuthProvider } from './modules/auth/componentes/AuthProvider'
import { AuthSessionCacheGuard } from './modules/auth/componentes/AuthSessionCacheGuard'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthSessionCacheGuard />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </AuthProvider>
  </StrictMode>,
)
