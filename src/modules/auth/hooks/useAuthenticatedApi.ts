import { useAuth0 } from '@auth0/auth0-react'
import { apiRequest, type ApiRequestOptions } from '../../../lib/api'
import { authConfig } from '../../../lib/authConfig'

type AuthenticatedApiOptions = Omit<ApiRequestOptions, 'accessToken'>

export function useAuthenticatedApi() {
  const { getAccessTokenSilently } = useAuth0()

  return async function authenticatedApiRequest<TResponse>(
    path: string,
    options: AuthenticatedApiOptions = {},
  ): Promise<TResponse> {
    const accessToken = await getAccessTokenSilently({
      authorizationParams: { audience: authConfig.audience },
    })

    return apiRequest<TResponse>(path, {
      ...options,
      accessToken,
    })
  }
}
