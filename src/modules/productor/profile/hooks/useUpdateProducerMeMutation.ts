import { useAuth0 } from '@auth0/auth0-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authConfig } from '../../../../lib/authConfig'
import { patchProducerMe } from '../profile.api'
import { PRODUCER_ME_QUERY_KEY } from './useProducerMeQuery'
import type { ProducerProfileFormValues } from '../profile.schema'

/**
 * Mutation for PATCH /producers/me.
 *
 * - On HTTP 2xx: invalidates ['producer', 'me'] so all consumers refetch.
 * - On error: cache is NOT touched — last known good data stays visible.
 * - 401 / 4xx / 5xx surface as mutation error; caller resolves via resolveErrorMessage.
 */
export function useUpdateProducerMeMutation() {
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: ProducerProfileFormValues) => {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: { audience: authConfig.audience },
      })

      return patchProducerMe(accessToken, body)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PRODUCER_ME_QUERY_KEY })
    },
    // No onError cache touch — spec: "failed save leaves cache intact"
  })
}
