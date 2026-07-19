import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../../auth/hooks/useAuthenticatedApi'
import { updateProducto } from '../productos.api'
import { PRODUCTOS_LIST_QUERY_KEY } from './useProductosQuery'
import type { UpdateProductoFormValues } from '../productos.schema'

type UpdateProductoArgs = {
  id: string
  body: UpdateProductoFormValues
}

/**
 * Mutation for PATCH /api/v1/producers/me/products/:id.
 *
 * - Token acquisition is delegated to useAuthenticatedApi() (spec R2).
 * - Covers isActive toggle (publish/unpublish), field edits, and stock updates.
 * - Backend guards isActive→false when active OrderLines exist
 *   (PRODUCT_HAS_ACTIVE_ORDERS 409 surfaces via resolveErrorMessage).
 * - On HTTP 2xx: invalidates ['producer', 'products', 'list'] (spec R4).
 * - On error: cache is NOT touched — last known good list stays visible.
 */
export function useUpdateProductoMutation() {
  const apiRequest = useAuthenticatedApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: UpdateProductoArgs) => updateProducto(apiRequest, id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PRODUCTOS_LIST_QUERY_KEY })
    },
    // No onError cache touch — spec R4: "failed save leaves cache intact"
  })
}
