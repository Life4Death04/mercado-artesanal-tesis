import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../../auth/hooks/useAuthenticatedApi'
import { updatePedidoStatus } from '../pedidos.api'
import { PEDIDOS_QUERY_KEY_BASE } from './usePedidosQuery'

type CancelArgs = {
  subOrderId: string
}

/**
 * Mutation for cancelling a SubOrder via PATCH /api/v1/producers/me/sub-orders/:id.
 *
 * Convenience wrapper over useUpdateSubOrderStatusMutation that always sends
 * { status: 'cancelled' } — separates cancel semantics from advance semantics
 * so pages can wire them to different UI flows (confirm modal vs direct click).
 *
 * Valid source states for cancellation: pending, preparing.
 * Cancelling a terminal state (delivered, cancelled) → 409 INVALID_ORDER_TRANSITION.
 *
 * - Token via useAuthenticatedApi() (spec R2).
 * - On 2xx: invalidates ['producer', 'sub-orders'] (spec R4).
 * - On error: cache untouched (spec AC).
 * - Errors surface via resolveErrorMessage at the call site.
 */
export function useCancelSubOrderMutation() {
  const apiCaller = useAuthenticatedApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ subOrderId }: CancelArgs) =>
      updatePedidoStatus(apiCaller, subOrderId, { status: 'cancelled' }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PEDIDOS_QUERY_KEY_BASE })
    },
    // No onError cache touch — spec R4 / task AC
  })
}
