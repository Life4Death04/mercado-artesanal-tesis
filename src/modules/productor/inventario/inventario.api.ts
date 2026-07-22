import { apiRequest } from '../../../lib/api'
import type { InventoryItemDTO, UpdateStockPayload } from './inventario.schema'

// ---------------------------------------------------------------------------
// Endpoint constants
// [source: mercado-artesanal-backend/src/modules/products/routes/products.routes.ts]
//
// The backend exposes inventory through the product resource. Each product
// carries stock + lowStockThreshold fields; the list endpoint is reused with
// a projected shape for inventory display.
// ---------------------------------------------------------------------------

export const inventarioEndpoints = {
  /**
   * GET /producers/me/products — same list endpoint as catalog, but the
   * inventory view projects name, stock, lowStockThreshold, and image URL.
   */
  list: '/producers/me/products',
  /**
   * PATCH /producers/me/products/:id — partial update used to update stock.
   * Backend guards: only the owner's products; non-2xx → ApiError.
   */
  updateStock: (id: string) => `/producers/me/products/${id}`,
} as const

// ---------------------------------------------------------------------------
// Authenticated caller type — matches the return type of useAuthenticatedApi()
// ---------------------------------------------------------------------------

type ApiCaller = <TResponse>(path: string, options?: { method?: string; body?: unknown }) => Promise<TResponse>

// ---------------------------------------------------------------------------
// Raw product from backend (minimal fields needed for inventory view)
// The full product catalog response includes more fields; we project here.
//
// images shape: backend branch feature/expose-product-images-in-producer-list
// exposes images ordered by position ASC, createdAt ASC at DB level.
// s3Key is NOT included in the list projection — url is ready-to-use.
// ---------------------------------------------------------------------------

type RawProductForInventory = {
  id: string
  producerId: string
  name: string
  categoryId: string
  stock: number
  lowStockThreshold: number
  isActive: boolean
  /** Ordered image projections from the backend list endpoint; may be absent on old backend. */
  images?: Array<{ id: string; position: number; url: string }>
  createdAt: string
  updatedAt: string
}

// ---------------------------------------------------------------------------
// Inventory API functions — called exclusively by the hook layer (spec R5)
// ---------------------------------------------------------------------------

/**
 * Lists all products for the authenticated producer, projected as inventory items.
 *
 * The backend returns full product DTOs; we map to the leaner InventoryItemDTO
 * shape used by the inventory UI. imageUrl is derived from the first image in
 * position order (position 0 is the primary image).
 *
 * Endpoint: GET /api/v1/producers/me/products
 */
export async function listInventario(apiCaller: ApiCaller): Promise<InventoryItemDTO[]> {
  const raw = await apiCaller<RawProductForInventory[]>(inventarioEndpoints.list)

  return raw.map((product) => ({
    id: product.id,
    producerId: product.producerId,
    name: product.name,
    // Backend returns categoryId only; resolving to name requires /categories join.
    // For now we surface categoryId as a fallback — the inventory UI shows it in
    // the search and filter logic. A future improvement can add a taxonomy join.
    categoryName: product.categoryId,
    stock: product.stock,
    lowStockThreshold: product.lowStockThreshold,
    isActive: product.isActive,
    // Primary thumbnail from the ordered image list projection.
    // Falls back to null when no images have been uploaded yet.
    imageUrl: product.images?.[0]?.url ?? null,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }))
}

/**
 * Updates the stock for a single product owned by the authenticated producer.
 *
 * Uses PATCH /api/v1/producers/me/products/:id with only { stock } in the body.
 * Backend validates the field through UpdateProductSchema (Zod partial strict).
 *
 * Endpoint: PATCH /api/v1/producers/me/products/:id
 */
export async function updateStock(
  apiCaller: ApiCaller,
  id: string,
  payload: UpdateStockPayload,
): Promise<void> {
  await apiCaller<unknown>(inventarioEndpoints.updateStock(id), {
    method: 'PATCH',
    body: payload,
  })
}

// ---------------------------------------------------------------------------
// Public (non-authenticated) helpers
// ---------------------------------------------------------------------------

/**
 * Fetches categories to resolve categoryId → categoryName in inventory display.
 * Endpoint: GET /api/v1/categories (public — no auth)
 */
export async function listCategoriasForInventory(): Promise<Array<{ id: string; name: string }>> {
  return apiRequest<Array<{ id: string; slug: string; name: string; isActive: boolean }>>(
    '/categories',
  )
}
