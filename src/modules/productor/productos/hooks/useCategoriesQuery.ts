import { useQuery } from '@tanstack/react-query'
import { listCategorias } from '../productos.api'

export const CATEGORIES_QUERY_KEY = ['categories'] as const

/**
 * Reads the public product category taxonomy.
 * Endpoint: GET /api/v1/categories (public — no authentication required).
 *
 * - Uses plain apiRequest (not authenticated) per spec product-taxonomy:
 *   "Both endpoints MUST be public (no authentication)."
 * - Always enabled — categories are public data, no session required.
 * - Long staleTime appropriate: category list changes infrequently.
 * - Cache key: ['categories'] — shared with any future consumer category selector.
 */
export function useCategoriesQuery() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: listCategorias,
    staleTime: 5 * 60 * 1000, // 5 minutes — categories rarely change
    retry: false,
    refetchOnWindowFocus: false,
  })
}
