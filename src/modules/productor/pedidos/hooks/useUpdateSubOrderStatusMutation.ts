import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../../auth/hooks/useAuthenticatedApi'
import { updatePedidoStatus } from '../pedidos.api'
import { PEDIDOS_QUERY_KEY_BASE } from './usePedidosQuery'
import type { SubOrderStatus } from '../pedidos.schema'

type UpdateStatusArgs = {
  subOrderId: string
  targetStatus: SubOrderStatus
  trackingNumber?: string
}

/**
 * Mutation for PATCH /api/v1/producers/me/sub-orders/:id (status transition).
 *
 * State machine: pending → preparing → sent → delivered | (any) → cancelled
 * Invalid transitions → 409 INVALID_ORDER_TRANSITION (ApiError; surface via resolveErrorMessage).
 *
 * - Token acquisition delegated to useAuthenticatedApi() (spec R2).
 * - On HTTP 2xx: invalidates all ['producer', 'sub-orders'] queries so list and
 *   any status-filtered views reflect the updated state (spec R4).
 * - On error: cache NOT touched — last known good sub-orders stay visible (spec AC).
 * - 401 / 4xx / 5xx surface as mutation error; caller resolves via resolveErrorMessage.
 */
export function useUpdateSubOrderStatusMutation() {
  const apiCaller = useAuthenticatedApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ subOrderId, targetStatus, trackingNumber }: UpdateStatusArgs) =>
      updatePedidoStatus(apiCaller, subOrderId, {
        status: targetStatus,
        ...(trackingNumber !== undefined ? { trackingNumber } : {}),
      }),
    onSuccess: () => {
      // Invalidate all sub-order queries (covers unfiltered + any status-filtered views).
      void queryClient.invalidateQueries({ queryKey: PEDIDOS_QUERY_KEY_BASE })
    },
    // No onError cache touch — spec R4 / task AC: "failed mutations keep prior cache"
  })
}
