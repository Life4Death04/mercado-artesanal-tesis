import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { loginAuthorizationParams, signupAuthorizationParams } from '../authRedirect'
import { AuthLoadingState } from './AuthLoadingState'

type Auth0RedirectProps = {
  mode: 'login' | 'signup'
  returnTo: string
}

export function Auth0Redirect({ mode, returnTo }: Auth0RedirectProps) {
  const { loginWithRedirect } = useAuth0()

  useEffect(() => {
    const authorizationParams = mode === 'signup' ? signupAuthorizationParams : loginAuthorizationParams

    void loginWithRedirect({
      appState: { returnTo },
      authorizationParams,
    })
  }, [loginWithRedirect, mode, returnTo])

  return <AuthLoadingState message="Redirigiendo a Auth0..." />
}
