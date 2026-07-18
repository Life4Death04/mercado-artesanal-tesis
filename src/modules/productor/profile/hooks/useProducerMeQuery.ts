import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { authConfig } from '../../../../lib/authConfig'
import { getUserMe } from '../profile.api'
import type { AuthenticatedProducerProfile } from '../profile.schema'

export const PRODUCER_ME_QUERY_KEY = ['producer', 'me'] as const

/**
 * Reads the authenticated producer's profile from GET /api/v1/users/me.
 *
 * - Enabled only when the Auth0 session is authenticated and not loading.
 * - Selects the embedded `producer` object from the full user response.
 * - On 401 / 5xx, query enters `isError` state; the page surfaces it via
 *   `resolveErrorMessage(error)`. No silent retry on 401.
 */
export function useProducerMeQuery() {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0()

  return useQuery({
    queryKey: PRODUCER_ME_QUERY_KEY,
    enabled: isAuthenticated && !isLoading,
    retry: false,
    refetchOnWindowFocus: false,
    select: (data): AuthenticatedProducerProfile | null => data.producer,
    queryFn: async () => {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: { audience: authConfig.audience },
      })

      return getUserMe(accessToken)
    },
  })
}
