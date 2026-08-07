import { useAuth0 } from '@auth0/auth0-react'
import { useQueryClient } from '@tanstack/react-query'
import { ApiError, apiRequest, type ApiRequestOptions } from '../../../lib/api'
import { authConfig } from '../../../lib/authConfig'
import { clearAuthenticatedCache } from '../authSessionCache'

type AuthenticatedApiOptions = Omit<ApiRequestOptions, 'accessToken'>

export function useAuthenticatedApi() {
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()

  return async function authenticatedApiRequest<TResponse>(
    path: string,
    options: AuthenticatedApiOptions = {},
  ): Promise<TResponse> {
    let accessToken: string

    try {
      accessToken = await getAccessTokenSilently({
        authorizationParams: { audience: authConfig.audience },
      })
    } catch (error) {
      if (isDefinitiveAuthenticationFailure(error)) {
        clearAuthenticatedCache(queryClient)
      }

      throw error
    }

    try {
      return await apiRequest<TResponse>(path, { ...options, accessToken })
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthenticatedCache(queryClient)
      }

      throw error
    }
  }
}

function isDefinitiveAuthenticationFailure(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('error' in error)) return false

  const code = error.error
  return code === 'login_required' || code === 'consent_required'
}
