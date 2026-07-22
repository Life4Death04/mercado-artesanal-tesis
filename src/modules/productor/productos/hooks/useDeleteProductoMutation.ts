import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../../auth/hooks/useAuthenticatedApi'
import { deleteProducto } from '../productos.api'
import { PRODUCTOS_LIST_QUERY_KEY } from './useProductosQuery'

/**
 * Mutation for DELETE /api/v1/producers/me/products/:id (soft-delete).
 *
 * - Token acquisition is delegated to useAuthenticatedApi() (spec R2).
 * - Backend returns 204 No Content on success.
 * - Blocked when active (non-terminal) OrderLines reference the product
 *   (PRODUCT_HAS_ACTIVE_ORDERS 409 — surfaced via resolveErrorMessage).
 * - On HTTP 2xx: invalidates ['producer', 'products', 'list'] (spec R4).
 * - On error: cache is NOT touched — last known good list stays visible.
 */
export function useDeleteProductoMutation() {
  const apiRequest = useAuthenticatedApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteProducto(apiRequest, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PRODUCTOS_LIST_QUERY_KEY })
    },
    // No onError cache touch — spec R4: "failed save leaves cache intact"
  })
}
