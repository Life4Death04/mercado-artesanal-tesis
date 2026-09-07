import { consumerOrderSchema, orderSummariesSchema, type ConsumerOrder, type OrderSummary } from './pedidos.schema'

export const pedidosEndpoints = {
  orders: '/pedidos',
  order: (orderId: string) => `/pedidos/${encodeURIComponent(orderId)}`,
  cancel: (orderId: string) => `/pedidos/${encodeURIComponent(orderId)}/cancelar`,
} as const

type ApiCaller = <TResponse>(path: string, options?: { method?: string; signal?: AbortSignal }) => Promise<TResponse>

export async function getConsumerOrders(api: ApiCaller, signal?: AbortSignal): Promise<OrderSummary[]> {
  return orderSummariesSchema.parse(await api<unknown>(pedidosEndpoints.orders, { signal }))
}

export async function getConsumerOrder(api: ApiCaller, orderId: string, signal?: AbortSignal): Promise<ConsumerOrder> {
  return consumerOrderSchema.parse(await api<unknown>(pedidosEndpoints.order(orderId), { signal }))
}

export async function cancelConsumerOrder(api: ApiCaller, orderId: string): Promise<ConsumerOrder> {
  return consumerOrderSchema.parse(await api<unknown>(pedidosEndpoints.cancel(orderId), { method: 'PATCH' }))
}
