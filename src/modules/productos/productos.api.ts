import { apiRequest } from '../../lib/api'
import { publicCategoriesSchema, publicProductSchema, publicProductsSchema, type PublicCategory, type PublicProduct, type PublicProductsQuery } from './productos.schema'

export const publicProductsEndpoints = {
  list: '/products',
  detail: (id: string) => `/products/${encodeURIComponent(id)}`,
  categories: '/categories',
} as const

export async function listPublicCategories(signal?: AbortSignal): Promise<PublicCategory[]> {
  return publicCategoriesSchema.parse(await apiRequest<unknown>(publicProductsEndpoints.categories, { signal }))
}

export async function listPublicProducts(query: PublicProductsQuery = {}, signal?: AbortSignal): Promise<PublicProduct[]> {
  const searchParams = new URLSearchParams()

  if (query.categoryId) searchParams.set('categoryId', query.categoryId)
  if (query.available === true) searchParams.set('available', 'true')
  if (query.sort) searchParams.set('sort', query.sort)

  const queryString = searchParams.toString()
  const response = await apiRequest<unknown>(`${publicProductsEndpoints.list}${queryString ? `?${queryString}` : ''}`, { signal })

  return publicProductsSchema.parse(response)
}

export async function getPublicProduct(id: string, signal?: AbortSignal): Promise<PublicProduct> {
  const response = await apiRequest<unknown>(publicProductsEndpoints.detail(id), { signal })
  return publicProductSchema.parse(response)
}
