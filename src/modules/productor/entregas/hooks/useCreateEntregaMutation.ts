import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../../auth/hooks/useAuthenticatedApi'
import { deliveryModeKeys } from '../../../pedidos/deliveryModes.queryKeys'
import { createEntrega } from '../entregas.api'
import type { CreateDeliveryModePayload } from '../entregas.schema'
import { ENTREGAS_QUERY_KEY } from './useEntregasQuery'

export function useCreateEntregaMutation() {
  const apiCaller = useAuthenticatedApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateDeliveryModePayload) => createEntrega(apiCaller, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ENTREGAS_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: deliveryModeKeys.all() })
    },
  })
}
