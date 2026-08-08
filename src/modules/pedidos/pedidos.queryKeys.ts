export const pedidosKeys = {
  all: ['consumer-orders'] as const,
  detail: (orderId: string) => ['consumer-orders', orderId] as const,
} as const
