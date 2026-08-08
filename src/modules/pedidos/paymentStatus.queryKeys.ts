export const paymentStatusKeys = {
  detail: (paymentIntentId: string) => ['payments', 'status', paymentIntentId] as const,
}
