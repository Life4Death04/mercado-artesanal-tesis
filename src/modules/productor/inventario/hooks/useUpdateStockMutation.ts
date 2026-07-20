import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../../auth/hooks/useAuthenticatedApi'
import { updateStock } from '../inventario.api'
import { INVENTARIO_QUERY_KEY } from './useInventarioQuery'
import type { UpdateStockFormValues } from '../inventario.schema'

type UpdateStockArgs = {
  productId: string
  body: UpdateStockFormValues
}

/**
 * Mutation for PATCH /api/v1/producers/me/products/:id (stock field only).
 *
 * - Token acquisition is delegated to useAuthenticatedApi() (spec R2).
 * - On HTTP 2xx: invalidates ['producer', 'inventory'] so the inventory page
 *   reflects the updated stock without a manual refetch (spec R4).
 * - On error: cache is NOT touched — last known good inventory stays visible.
 *   Spec AC: "failed mutations keep prior cache."
 * - 401 / 4xx / 5xx surface as mutation error; caller resolves via resolveErrorMessage.
 */
export function useUpdateStockMutation() {
  const apiCaller = useAuthenticatedApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, body }: UpdateStockArgs) =>
      updateStock(apiCaller, productId, { stock: body.stock }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: INVENTARIO_QUERY_KEY })
    },
    // No onError cache touch — spec R4 / task AC: "failed mutations keep prior cache"
  })
}
