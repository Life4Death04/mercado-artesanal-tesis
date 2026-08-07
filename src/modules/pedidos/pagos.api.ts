import { deliveryModeGroupsSchema, type DeliveryModeGroup } from './pagos.schema'

export const pagosEndpoints = {
  deliveryModes: '/pagos/delivery-modes',
} as const

type ApiCaller = <TResponse>(path: string, options?: { method?: string; body?: unknown; signal?: AbortSignal }) => Promise<TResponse>

export async function getDeliveryModes(api: ApiCaller, signal?: AbortSignal): Promise<DeliveryModeGroup[]> {
  return deliveryModeGroupsSchema.parse(await api<unknown>(pagosEndpoints.deliveryModes, { signal }))
}
