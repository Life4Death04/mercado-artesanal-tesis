import { SubOrderStatusSchema } from './pedidos.schema'
import type { SubOrderListItemDTO, SubOrderDTO, UpdateSubOrderStatusPayload, SubOrderStatus } from './pedidos.schema'

// ---------------------------------------------------------------------------
// Endpoint constants
// [source: mercado-artesanal-backend/openspec/specs/order-fulfillment/spec.md]
// ---------------------------------------------------------------------------

export const pedidosEndpoints = {
  /**
   * GET /producers/me/sub-orders — paginated, filterable by status.
   * Default page size 20, cap 100. Order: createdAt DESC.
   */
  list: '/producers/me/sub-orders',
  /**
   * GET /producers/me/sub-orders/:id — single SubOrder with OrderLines.
   * Cross-producer reads return 404 (opaque).
   */
  detail: (id: string) => `/producers/me/sub-orders/${id}`,
  /**
   * PATCH /producers/me/sub-orders/:id — state machine transition.
   * Body: { status: <target>, trackingNumber?: string }
   * Invalid transitions → 409 INVALID_ORDER_TRANSITION.
   * Idempotent: sending the current status returns 200 (no DB write).
   */
  updateStatus: (id: string) => `/producers/me/sub-orders/${id}`,
} as const

// ---------------------------------------------------------------------------
// Authenticated caller type — matches return type of useAuthenticatedApi()
// ---------------------------------------------------------------------------

type ApiCaller = <TResponse>(path: string, options?: { method?: string; body?: unknown }) => Promise<TResponse>

// ---------------------------------------------------------------------------
// Raw response types from the backend
// The backend embeds OrderLines and may embed consumer/delivery info.
// ---------------------------------------------------------------------------

type RawOrderLine = {
  id: string
  subOrderId: string
  productId: string
  unitPriceSnapshot: string
  quantity: number
  product?: { name?: string; images?: Array<{ s3Key?: string; position?: number }> }
}

type RawSubOrder = {
  id: string
  orderId: string
  producerId: string
  deliveryModeId: string | null
  status: string
  shippingCostSnapshot: string
  trackingNumber: string | null
  orderLines?: RawOrderLine[]
  createdAt: string
  updatedAt: string
  // Optional embedded consumer/order info (if backend eager-loads):
  order?: {
    user?: {
      name?: string | null
      email?: string
      phone?: string | null
    }
  }
  deliveryMode?: {
    type?: string
    pickupAddress?: string | null
    shippingAddress?: string | null
  }
}

// ---------------------------------------------------------------------------
// Edge-parse helper — parses SubOrderStatus; throws if unknown value.
// Spec R6: control-flow enums parsed at hook boundary.
// ---------------------------------------------------------------------------

function parseSubOrderStatus(raw: string): SubOrderStatus {
  return SubOrderStatusSchema.parse(raw)
}

// ---------------------------------------------------------------------------
// Map raw response to typed DTO
// ---------------------------------------------------------------------------

function mapRawToSubOrder(raw: RawSubOrder): SubOrderListItemDTO {
  return {
    id: raw.id,
    orderId: raw.orderId,
    producerId: raw.producerId,
    status: parseSubOrderStatus(raw.status),
    shippingCostSnapshot: raw.shippingCostSnapshot,
    trackingNumber: raw.trackingNumber,
    orderLines: (raw.orderLines ?? []).map((line) => ({
      id: line.id,
      subOrderId: line.subOrderId,
      productId: line.productId,
      unitPriceSnapshot: line.unitPriceSnapshot,
      quantity: line.quantity,
      productName: line.product?.name,
      productImageUrl: null, // Image presigning is a separate step; not included in list
    })),
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    consumerName: raw.order?.user?.name ?? undefined,
    consumerEmail: raw.order?.user?.email ?? undefined,
    consumerPhone: raw.order?.user?.phone ?? undefined,
    deliveryType: raw.deliveryMode?.type ?? undefined,
    deliveryAddress: raw.deliveryMode?.pickupAddress ?? raw.deliveryMode?.shippingAddress ?? undefined,
  }
}

function mapRawToSubOrderDetail(raw: RawSubOrder): SubOrderDTO {
  return {
    ...mapRawToSubOrder(raw),
    deliveryModeId: raw.deliveryModeId,
    trackingNumber: raw.trackingNumber,
  }
}

// ---------------------------------------------------------------------------
// API functions — called exclusively by the hook layer (spec R5)
// ---------------------------------------------------------------------------

/**
 * Lists the authenticated producer's SubOrders, optionally filtered by status.
 *
 * Endpoint: GET /api/v1/producers/me/sub-orders[?status=<value>]
 * Edge-parses SubOrderStatus on every item to guard control-flow branches (spec R6).
 */
export async function listPedidosPage(
  apiCaller: ApiCaller,
  filter?: { status?: SubOrderStatus; page?: number; limit?: number },
): Promise<SubOrderListItemDTO[]> {
  const params = new URLSearchParams()
  if (filter?.status) params.set('status', filter.status)
  if (filter?.page) params.set('page', String(filter.page))
  if (filter?.limit) params.set('limit', String(filter.limit))
  const qs = params.size > 0 ? `?${params.toString()}` : ''
  const raw = await apiCaller<RawSubOrder[]>(`${pedidosEndpoints.list}${qs}`)

  return raw.map(mapRawToSubOrder)
}

const ALL_PEDIDOS_PAGE_SIZE = 20
const ALL_PEDIDOS_MAX_PAGES = 100

export async function listPedidos(
  apiCaller: ApiCaller,
  filter?: { status?: SubOrderStatus },
): Promise<SubOrderListItemDTO[]> {
  const byId = new Map<string, SubOrderListItemDTO>()
  let completed = false

  for (let page = 1; page <= ALL_PEDIDOS_MAX_PAGES; page += 1) {
    const items = await listPedidosPage(apiCaller, {
      ...filter,
      page,
      limit: ALL_PEDIDOS_PAGE_SIZE,
    })
    const previousSize = byId.size
    items.forEach((item) => byId.set(item.id, item))

    if (items.length < ALL_PEDIDOS_PAGE_SIZE) {
      completed = true
      break
    }
    if (byId.size === previousSize) throw new Error('La paginación de pedidos devolvió una página repetida.')
  }

  if (!completed) throw new Error('La lista de pedidos superó el límite seguro de paginación.')
  return [...byId.values()]
}

/**
 * Fetches a single SubOrder with its OrderLines.
 * Cross-producer reads return 404 (ApiError); the hook surfaces that via resolveErrorMessage.
 *
 * Endpoint: GET /api/v1/producers/me/sub-orders/:id
 */
export async function getPedido(apiCaller: ApiCaller, id: string): Promise<SubOrderDTO> {
  const raw = await apiCaller<RawSubOrder>(pedidosEndpoints.detail(id))

  return mapRawToSubOrderDetail(raw)
}

/**
 * Advances or cancels a SubOrder via the state machine.
 * Returns the updated SubOrder on 200. 409 → INVALID_ORDER_TRANSITION (ApiError).
 * Idempotent: sending current status returns 200 (spec R3 idempotency).
 *
 * Endpoint: PATCH /api/v1/producers/me/sub-orders/:id
 */
export async function updatePedidoStatus(
  apiCaller: ApiCaller,
  id: string,
  payload: UpdateSubOrderStatusPayload,
): Promise<SubOrderListItemDTO> {
  const raw = await apiCaller<RawSubOrder>(pedidosEndpoints.updateStatus(id), {
    method: 'PATCH',
    body: payload,
  })

  return mapRawToSubOrder(raw)
}
