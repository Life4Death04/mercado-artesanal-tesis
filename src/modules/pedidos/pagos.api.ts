import { createPaymentIntentInputSchema, deliveryModeGroupsSchema, paymentIntentResponseSchema, type CreatePaymentIntentInput, type DeliveryModeGroup } from './pagos.schema'

export const pagosEndpoints = {
  deliveryModes: '/pagos/delivery-modes',
  intent: '/pagos/intent',
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
