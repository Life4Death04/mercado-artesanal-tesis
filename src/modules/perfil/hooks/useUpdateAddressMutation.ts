import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../auth/hooks/useAuthenticatedApi'
import { updateAddress } from '../direcciones.api'
import { addressKeys } from '../direcciones.queryKeys'
import type { UpdateAddressInput } from '../direcciones.schema'

/** Failures (e.g. 422 default-demotion) never touch the cache. */
export function useUpdateAddressMutation() {
  const api = useAuthenticatedApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ addressId, input }: { addressId: string; input: UpdateAddressInput }) => updateAddress(api, addressId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: addressKeys.all }),
  })
}
