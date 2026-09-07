import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../../auth/hooks/useAuthenticatedApi'
import { deliveryModeKeys } from '../../../pedidos/deliveryModes.queryKeys'
import { deleteEntrega } from '../entregas.api'
import { ENTREGAS_QUERY_KEY } from './useEntregasQuery'

export function useDeleteEntregaMutation() {
  const apiCaller = useAuthenticatedApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteEntrega(apiCaller, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ENTREGAS_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: deliveryModeKeys.all() })
    },
  })
}
