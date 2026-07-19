import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../../auth/hooks/useAuthenticatedApi'
import { createProducto } from '../productos.api'
import { PRODUCTOS_LIST_QUERY_KEY } from './useProductosQuery'
import type { CreateProductoFormValues } from '../productos.schema'

/**
 * Mutation for POST /api/v1/producers/me/products.
 *
 * - Token acquisition is delegated to useAuthenticatedApi() (spec R2).
 * - Backend publishes on create (isActive=true, no DRAFT state).
 * - On HTTP 2xx: invalidates ['producer', 'products', 'list'] so the
 *   catalog page reflects the new product without manual refetch.
 * - On error: cache is NOT touched — last known good list stays visible.
 * - 401 / 4xx / 5xx surface as mutation error; caller resolves via resolveErrorMessage.
 */
export function useCreateProductoMutation() {
  const apiRequest = useAuthenticatedApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateProductoFormValues) => createProducto(apiRequest, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PRODUCTOS_LIST_QUERY_KEY })
    },
    // No onError cache touch — spec R4: "failed save leaves cache intact"
  })
}
