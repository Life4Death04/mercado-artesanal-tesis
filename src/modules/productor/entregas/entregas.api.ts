import {
  createDeliveryModePayloadSchema,
  deliveryModeListSchema,
  deliveryModeSchema,
  updateDeliveryModePayloadSchema,
} from './entregas.schema'
import type {
  CreateDeliveryModePayload,
  DeliveryModeDTO,
  UpdateDeliveryModePayload,
} from './entregas.schema'

export const entregasEndpoints = {
  list: '/producers/me/delivery-modes',
  create: '/producers/me/delivery-modes',
  update: (id: string) => `/producers/me/delivery-modes/${id}`,
  delete: (id: string) => `/producers/me/delivery-modes/${id}`,
} as const

type ApiCaller = <TResponse>(
  path: string,
  options?: { method?: string; body?: unknown },
) => Promise<TResponse>

export async function listEntregas(apiCaller: ApiCaller): Promise<DeliveryModeDTO[]> {
  return deliveryModeListSchema.parse(await apiCaller<unknown>(entregasEndpoints.list))
}

export async function createEntrega(
  apiCaller: ApiCaller,
  payload: CreateDeliveryModePayload,
): Promise<DeliveryModeDTO> {
  const raw = await apiCaller<unknown>(entregasEndpoints.create, {
    method: 'POST',
    body: createDeliveryModePayloadSchema.parse(payload),
  })
  return deliveryModeSchema.parse(raw)
}

export async function updateEntrega(
  apiCaller: ApiCaller,
  id: string,
  payload: UpdateDeliveryModePayload,
): Promise<DeliveryModeDTO> {
  const raw = await apiCaller<unknown>(entregasEndpoints.update(id), {
    method: 'PATCH',
    body: updateDeliveryModePayloadSchema.parse(payload),
  })
  return deliveryModeSchema.parse(raw)
}

export async function deleteEntrega(apiCaller: ApiCaller, id: string): Promise<void> {
  await apiCaller<void>(entregasEndpoints.delete(id), { method: 'DELETE' })
}
