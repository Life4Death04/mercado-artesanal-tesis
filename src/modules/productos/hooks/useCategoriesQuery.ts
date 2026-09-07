import { useQuery } from '@tanstack/react-query'
import { listPublicCategories } from '../productos.api'
import { productosKeys } from '../productos.queryKeys'

export function useCategoriesQuery() {
  return useQuery({
    queryKey: productosKeys.categories,
    queryFn: ({ signal }) => listPublicCategories(signal),
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  })
}
