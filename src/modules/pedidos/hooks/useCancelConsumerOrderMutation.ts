import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../auth/hooks/useAuthenticatedApi'
import { cancelConsumerOrder } from '../pedidos.api'
import { pedidosKeys } from '../pedidos.queryKeys'

export function useCancelConsumerOrderMutation() {
  const api = useAuthenticatedApi()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (orderId: string) => cancelConsumerOrder(api, orderId),
    onSuccess: (order) => {
      queryClient.setQueryData(pedidosKeys.detail(order.id), order)
      return queryClient.invalidateQueries({ queryKey: pedidosKeys.all })
    },
  })
}
