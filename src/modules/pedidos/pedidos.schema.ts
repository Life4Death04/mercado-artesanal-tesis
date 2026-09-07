import { z } from 'zod'

const decimalSchema = z.string().regex(/^\d+(\.\d+)?$/, 'amount must be a Decimal string')

const orderStatusSchema = z.enum(['PENDING', 'PARTIAL', 'FULFILLED', 'CANCELLED'])
const subOrderStatusSchema = z.enum(['pending', 'preparing', 'sent', 'delivered', 'cancelled'])
const paymentStatusSchema = z.enum(['PENDING', 'SUCCEEDED', 'FAILED', 'CANCELED', 'REFUNDED'])

export const orderIdSchema = z.string().min(1).max(256).refine((value) => ![...value].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127), 'order id contains unsafe characters')

export const orderSummarySchema = z.object({
  id: orderIdSchema,
  orderNumber: z.number().int().positive(),
  createdAt: z.iso.datetime(),
  totalAmount: decimalSchema,
  status: orderStatusSchema,
  producerCount: z.number().int().positive(),
})

export const orderSummariesSchema = z.array(orderSummarySchema)

export const consumerOrderSchema = z.object({
  id: orderIdSchema,
  orderNumber: z.number().int().positive(),
  createdAt: z.iso.datetime(),
  totalAmount: decimalSchema,
  status: orderStatusSchema,
  payment: z.object({ status: paymentStatusSchema }),
  subOrders: z.array(z.object({
    id: orderIdSchema,
    status: subOrderStatusSchema,
    shippingCostSnapshot: decimalSchema,
    trackingNumber: z.string().nullable(),
    deliveryMode: z.object({ type: z.enum(['PERSONAL_DELIVERY', 'PICKUP', 'SHIPPING_FLAT_RATE']) }),
    orderLines: z.array(z.object({
      id: orderIdSchema,
      quantity: z.number().int().positive(),
      unitPriceSnapshot: decimalSchema,
    })).min(1),
  })).min(1),
})

export type ConsumerOrder = z.infer<typeof consumerOrderSchema>
export type OrderSummary = z.infer<typeof orderSummarySchema>
