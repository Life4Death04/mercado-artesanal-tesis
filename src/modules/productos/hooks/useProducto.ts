import { useQuery } from '@tanstack/react-query'
import { getPublicProduct } from '../productos.api'
import { productosKeys } from '../productos.queryKeys'

export function useProducto(id: string | undefined) {
  return useQuery({
    queryKey: productosKeys.detail(id ?? ''),
    queryFn: ({ signal }) => getPublicProduct(id!, signal),
    enabled: Boolean(id),
    retry: false,
  })
}
