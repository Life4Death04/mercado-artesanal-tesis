import { ModerationStatusSchema } from './productos.schema'
import type {
  ConfirmImageFormValues,
  CreateProductoFormValues,
  PresignImageFormValues,
  PresignResponseDTO,
  ProductDTO,
  ProductImageDTO,
  ReportProductoFormValues,
  ReportResponseDTO,
  UpdateProductoFormValues,
} from './productos.schema'

// ---------------------------------------------------------------------------
// Endpoint constants
// [source: mercado-artesanal-backend/src/modules/products/routes/products.routes.ts]
// ---------------------------------------------------------------------------

export const productosEndpoints = {
  list: '/producers/me/products',
  create: '/producers/me/products',
  getById: (id: string) => `/producers/me/products/${id}`,
  update: (id: string) => `/producers/me/products/${id}`,
  delete: (id: string) => `/producers/me/products/${id}`,
  report: (id: string) => `/products/${id}/report`,
  presignImage: (id: string) => `/producers/me/products/${id}/images/presign`,
  confirmImage: (id: string) => `/producers/me/products/${id}/images/confirm`,
} as const

// ---------------------------------------------------------------------------
// Authenticated caller type — matches the return type of useAuthenticatedApi()
// ---------------------------------------------------------------------------

type ApiCaller = <TResponse>(path: string, options?: { method?: string; body?: unknown }) => Promise<TResponse>

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Edge-parses the moderationStatus field from a raw product response.
 * Guards control-flow branches against unknown enum values from the backend.
 * Spec: producer-api-client R6 (response validation at the edge for control-flow enums).
 */
function parseModerationStatus(raw: ProductDTO): ProductDTO {
  ModerationStatusSchema.parse(raw.moderationStatus)
  return raw
}

// ---------------------------------------------------------------------------
// Product API functions — called exclusively by hook layer (spec R5 layout)
// ---------------------------------------------------------------------------

/**
 * Fetches the authenticated producer's full product list.
 * Endpoint: GET /api/v1/producers/me/products
 */
export async function listProductos(apiCaller: ApiCaller): Promise<ProductDTO[]> {
  const raw = await apiCaller<ProductDTO[]>(productosEndpoints.list)
  // Edge-parse moderationStatus on each product (control-flow enum)
  return raw.map(parseModerationStatus)
}

/**
 * Creates a new product for the authenticated producer.
 * Backend publishes immediately (isActive=true, moderationStatus=OK — no DRAFT state).
 * Endpoint: POST /api/v1/producers/me/products
 *
 * NOTE: price is sent as a number string converted to number to satisfy backend DTO.
 * The backend stores Decimal; it serializes price back as a string in responses.
 */
export async function createProducto(
  apiCaller: ApiCaller,
  body: CreateProductoFormValues,
): Promise<ProductDTO> {
  const payload = {
    ...body,
    // Backend expects price as number (positive) — convert from form string
    price: Number(body.price),
  }
  const raw = await apiCaller<ProductDTO>(productosEndpoints.create, {
    method: 'POST',
    body: payload,
  })
  return parseModerationStatus(raw)
}

/**
 * Partially updates a product owned by the authenticated producer.
 * Endpoint: PATCH /api/v1/producers/me/products/:id
 */
export async function updateProducto(
  apiCaller: ApiCaller,
  id: string,
  body: UpdateProductoFormValues,
): Promise<ProductDTO> {
  const payload: Record<string, unknown> = { ...body }
  if (body.price !== undefined) {
    // Backend expects price as number
    payload.price = Number(body.price)
  }
  const raw = await apiCaller<ProductDTO>(productosEndpoints.update(id), {
    method: 'PATCH',
    body: payload,
  })
  return parseModerationStatus(raw)
}

/**
 * Soft-deletes a product owned by the authenticated producer.
 * Blocked by active order lines (PRODUCT_HAS_ACTIVE_ORDERS 409).
 * Endpoint: DELETE /api/v1/producers/me/products/:id → 204 No Content
 */
export async function deleteProducto(apiCaller: ApiCaller, id: string): Promise<void> {
  await apiCaller<void>(productosEndpoints.delete(id), { method: 'DELETE' })
}

/**
 * Reports a product. Any authenticated user may report.
 * First-report-wins; subsequent reports are idempotent 200.
 * Endpoint: POST /api/v1/products/:id/report
 */
export async function reportProducto(
  apiCaller: ApiCaller,
  id: string,
  body: ReportProductoFormValues,
): Promise<ReportResponseDTO> {
  return apiCaller<ReportResponseDTO>(productosEndpoints.report(id), {
    method: 'POST',
    body,
  })
}

// ---------------------------------------------------------------------------
// Image API functions
// ---------------------------------------------------------------------------

/**
 * Requests a presigned S3 PUT URL for a product image upload.
 * Endpoint: POST /api/v1/producers/me/products/:id/images/presign
 */
export async function presignProductoImage(
  apiCaller: ApiCaller,
  productId: string,
  body: PresignImageFormValues,
): Promise<PresignResponseDTO> {
  return apiCaller<PresignResponseDTO>(productosEndpoints.presignImage(productId), {
    method: 'POST',
    body,
  })
}

/**
 * Confirms a completed S3 image upload, creating the ProductImage row.
 * Endpoint: POST /api/v1/producers/me/products/:id/images/confirm
 */
export async function confirmProductoImage(
  apiCaller: ApiCaller,
  productId: string,
  body: ConfirmImageFormValues,
): Promise<ProductImageDTO> {
  return apiCaller<ProductImageDTO>(productosEndpoints.confirmImage(productId), {
    method: 'POST',
    body,
  })
}
