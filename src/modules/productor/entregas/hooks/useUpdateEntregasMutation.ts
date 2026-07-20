import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../../auth/hooks/useAuthenticatedApi'
import { updateEntrega } from '../entregas.api'
import { ENTREGAS_QUERY_KEY } from './useEntregasQuery'
import type { UpdateDeliveryModePayload } from '../entregas.schema'

type UpdateEntregasArgs = {
  id: string
  payload: UpdateDeliveryModePayload
}

/**
 * Mutation for PATCH /api/v1/producers/me/delivery-modes/:id.
 *
 * - Token acquisition is delegated to useAuthenticatedApi() (spec R2).
 * - On HTTP 2xx: invalidates ['producer', 'delivery-modes'] so the page
 *   reflects persisted delivery settings without a manual refetch (spec R4).
 * - On error: cache is NOT touched — last known good settings stay visible.
 *   Spec AC: "failed mutations keep prior cache."
 * - 401 / 4xx / 5xx surface as mutation error; caller resolves via resolveErrorMessage.
 */
export function useUpdateEntregasMutation() {
  const apiCaller = useAuthenticatedApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: UpdateEntregasArgs) =>
      updateEntrega(apiCaller, id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ENTREGAS_QUERY_KEY })
    },
    // No onError cache touch — spec R4 / task AC: "failed mutations keep prior cache"
  })
}
