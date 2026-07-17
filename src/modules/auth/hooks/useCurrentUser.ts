import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { authConfig } from '../../../lib/authConfig'
import { getCurrentUser, syncAuthenticatedUser } from '../auth.api'

export function useCurrentUser() {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0()

  return useQuery({
    queryKey: ['auth', 'current-user'],
    enabled: isAuthenticated && !isLoading,
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: { audience: authConfig.audience },
      })

      await syncAuthenticatedUser(accessToken)

      return getCurrentUser(accessToken)
    },
  })
}
