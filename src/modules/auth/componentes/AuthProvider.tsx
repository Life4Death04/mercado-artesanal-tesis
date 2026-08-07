import { Auth0Provider, type AppState } from '@auth0/auth0-react'
import type { ReactNode } from 'react'
import { authConfig } from '../../../lib/authConfig'
import { safeReturnTo } from '../authRedirect'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  function handleRedirectCallback(appState?: AppState) {
    window.history.replaceState(
      {},
      document.title,
      safeReturnTo(appState?.returnTo, window.location.pathname),
    )
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <Auth0Provider
      domain={authConfig.domain}
      clientId={authConfig.clientId}
      onRedirectCallback={handleRedirectCallback}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      authorizationParams={{
        audience: authConfig.audience,
        redirect_uri: authConfig.redirectUri,
        scope: 'openid profile email',
      }}
    >
      {children}
    </Auth0Provider>
  )
}
