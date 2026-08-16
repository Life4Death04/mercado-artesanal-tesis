import { useAuth0 } from '@auth0/auth0-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { authConfig } from '../../../lib/authConfig'
import { getCurrentUser, syncAuthenticatedUser } from '../auth.api'
import { clearAuthenticatedCache, requiresAuthenticatedCacheIsolation } from '../authSessionCache'

export const CURRENT_USER_QUERY_KEY = ['auth', 'current-user'] as const

export function useCurrentUser() {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0()
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    enabled: isAuthenticated && !isLoading,
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: { audience: authConfig.audience },
        })

        await syncAuthenticatedUser(accessToken)

        return getCurrentUser(accessToken)
      } catch (error) {
        if (requiresAuthenticatedCacheIsolation(error)) {
          clearAuthenticatedCache(queryClient)
        }

        throw error
      }
    },
  })
}
