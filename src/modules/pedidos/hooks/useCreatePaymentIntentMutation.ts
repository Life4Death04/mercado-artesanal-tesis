import { useMutation } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../auth/hooks/useAuthenticatedApi'
import { createPaymentIntent } from '../pagos.api'
import type { CreatePaymentIntentInput } from '../pagos.schema'

export function useCreatePaymentIntentMutation() {
  const api = useAuthenticatedApi()

  return useMutation({
    mutationFn: (input: CreatePaymentIntentInput) => createPaymentIntent(api, input),
  })
}
