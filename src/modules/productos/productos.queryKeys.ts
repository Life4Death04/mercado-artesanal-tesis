import type { PublicProductsQuery } from './productos.schema'

export const productosKeys = {
  all: ['public-products'] as const,
  lists: () => [...productosKeys.all, 'list'] as const,
  list: (query: PublicProductsQuery = {}) => [...productosKeys.lists(), query] as const,
  details: () => [...productosKeys.all, 'detail'] as const,
  detail: (id: string) => [...productosKeys.details(), id] as const,
}
