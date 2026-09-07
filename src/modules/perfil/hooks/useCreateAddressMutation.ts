import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../auth/hooks/useAuthenticatedApi'
import { createAddress } from '../direcciones.api'
import { addressKeys } from '../direcciones.queryKeys'
import type { CreateAddressInput } from '../direcciones.schema'

/** Failures never touch the cache — the confirmed server list stays visible. */
export function useCreateAddressMutation() {
  const api = useAuthenticatedApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateAddressInput) => createAddress(api, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: addressKeys.all }),
  })
}
