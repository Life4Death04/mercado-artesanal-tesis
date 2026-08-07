import { useQuery } from '@tanstack/react-query'
import { listPublicProducts } from '../productos.api'
import { productosKeys } from '../productos.queryKeys'
import type { PublicProductsQuery } from '../productos.schema'

export function useProductos(query: PublicProductsQuery = {}) {
  return useQuery({
    queryKey: productosKeys.list(query),
    queryFn: ({ signal }) => listPublicProducts(query, signal),
  })
}
