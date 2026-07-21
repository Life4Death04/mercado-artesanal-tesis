import { z } from 'zod'

// ---------------------------------------------------------------------------
// SubOrderStatus enum — control-flow; edge-parsed at hook boundary.
// [source: mercado-artesanal-backend/openspec/specs/order-fulfillment/spec.md]
//
// Valid state machine:
//   pending    → preparing | cancelled
//   preparing  → sent | cancelled
//   sent       → delivered
//   delivered  → (terminal)
//   cancelled  → (terminal)
// ---------------------------------------------------------------------------

export const SubOrderStatusSchema = z.enum([
  'pending',
  'preparing',
  'sent',
  'delivered',
  'cancelled',
])
export type SubOrderStatus = z.infer<typeof SubOrderStatusSchema>

// ---------------------------------------------------------------------------
// OrderLine DTO — embedded in SubOrder detail responses
// [source: order-fulfillment/spec.md — OrderLine table]
//
// money-typing R1: unitPriceSnapshot is a Prisma Decimal → serialized as string.
// NEVER use z.number() for money fields.
// ---------------------------------------------------------------------------

export type OrderLineDTO = {
  id: string
  subOrderId: string
  productId: string
  /** Immutable historical unit price at order time — Decimal string from Prisma. */
  unitPriceSnapshot: string
  quantity: number
  /** Product name for display (denormalized by backend for convenience). */
  productName?: string
  /** Product image URL for display (may be null). */
  productImageUrl?: string | null
}

// ---------------------------------------------------------------------------
// SubOrder DTO — response shape for GET /producers/me/sub-orders[/:id]
// [source: order-fulfillment/spec.md — SubOrder entity]
//
// money-typing R1: all money fields (shippingCostSnapshot, total derived) are strings.
// ---------------------------------------------------------------------------

export type SubOrderDTO = {
  id: string
  orderId: string
  producerId: string
  deliveryModeId: string | null
  /** Edge-parsed at hook boundary via SubOrderStatusSchema. */
  status: SubOrderStatus
  /** Decimal string — display via formatMoney; NEVER parse for math. */
  shippingCostSnapshot: string
  /** Tracking number (always null in Cycle 2 — field exists for schema stability). */
  trackingNumber: string | null
  orderLines: OrderLineDTO[]
  createdAt: string
  updatedAt: string
  // Optional denormalized consumer fields (backend may embed these):
  consumerName?: string
  consumerEmail?: string
  consumerPhone?: string
  deliveryType?: string
  deliveryAddress?: string
}

// ---------------------------------------------------------------------------
// SubOrder list item — leaner shape used in the list view
// (backend may return full SubOrders; we project for the list)
// ---------------------------------------------------------------------------

export type SubOrderListItemDTO = {
  id: string
  orderId: string
  producerId: string
  status: SubOrderStatus
  /** Decimal string from Prisma. */
  shippingCostSnapshot: string
  orderLines: OrderLineDTO[]
  createdAt: string
  updatedAt: string
  // Denormalized from the order → consumer relation (if embedded by backend)
  consumerName?: string
  consumerEmail?: string
  consumerPhone?: string
  deliveryType?: string
  deliveryAddress?: string
}

// ---------------------------------------------------------------------------
// Status transition payload — PATCH /producers/me/sub-orders/:id
// [frontend-defined; mirrors backend UpdateSubOrderSchema]
// ---------------------------------------------------------------------------

export const updateSubOrderStatusSchema = z
  .object({
    status: SubOrderStatusSchema,
  })
  .strict()

export type UpdateSubOrderStatusPayload = z.infer<typeof updateSubOrderStatusSchema>

// ---------------------------------------------------------------------------
// Query filter — ?status=<value> for the list endpoint
// ---------------------------------------------------------------------------

export type SubOrderStatusFilter = SubOrderStatus | 'all'
