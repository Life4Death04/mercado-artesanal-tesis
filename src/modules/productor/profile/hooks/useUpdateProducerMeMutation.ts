import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../../auth/hooks/useAuthenticatedApi'
import { patchProducerMe } from '../profile.api'
import { PRODUCER_ME_QUERY_KEY } from './useProducerMeQuery'
import type { ProducerProfileFormValues } from '../profile.schema'

/**
 * Mutation for PATCH /producers/me.
 *
 * - Token acquisition is delegated to useAuthenticatedApi() — no direct
 *   getAccessTokenSilently calls in this hook (spec R2).
 * - On HTTP 2xx: invalidates ['producer', 'me'] so all consumers refetch.
 * - On error: cache is NOT touched — last known good data stays visible.
 * - 401 / 4xx / 5xx surface as mutation error; caller resolves via resolveErrorMessage.
 */
export function useUpdateProducerMeMutation() {
  const apiRequest = useAuthenticatedApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: ProducerProfileFormValues) => patchProducerMe(apiRequest, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PRODUCER_ME_QUERY_KEY })
    },
    // No onError cache touch — spec: "failed save leaves cache intact"
  })
}
