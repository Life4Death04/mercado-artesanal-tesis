import { createPaymentIntentInputSchema, deliveryModeGroupsSchema, paymentIntentResponseSchema, paymentStatusSchema, type CreatePaymentIntentInput, type DeliveryModeGroup, type PaymentStatus } from './pagos.schema'

export const pagosEndpoints = {
  deliveryModes: '/pagos/delivery-modes',
  intent: '/pagos/intent',
  status: (paymentIntentId: string) => `/pagos/status/${encodeURIComponent(paymentIntentId)}`,
} as const

type ApiCaller = <TResponse>(path: string, options?: { method?: string; body?: unknown; signal?: AbortSignal }) => Promise<TResponse>

export async function getDeliveryModes(api: ApiCaller, signal?: AbortSignal): Promise<DeliveryModeGroup[]> {
  return deliveryModeGroupsSchema.parse(await api<unknown>(pagosEndpoints.deliveryModes, { signal }))
}

export async function createPaymentIntent(api: ApiCaller, input: CreatePaymentIntentInput): Promise<string> {
  const body = createPaymentIntentInputSchema.parse(input)
  const response = await api<unknown>(pagosEndpoints.intent, { method: 'POST', body })
  return paymentIntentResponseSchema.parse(response).clientSecret
}

export async function getPaymentStatus(api: ApiCaller, paymentIntentId: string, signal?: AbortSignal): Promise<PaymentStatus> {
  return paymentStatusSchema.parse(await api<unknown>(pagosEndpoints.status(paymentIntentId), { signal }))
}
