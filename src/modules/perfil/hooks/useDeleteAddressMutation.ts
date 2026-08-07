import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../auth/hooks/useAuthenticatedApi'
import { deleteAddress } from '../direcciones.api'
import { addressKeys } from '../direcciones.queryKeys'

/** Failures (e.g. owner-safe 404) never touch the cache. */
export function useDeleteAddressMutation() {
  const api = useAuthenticatedApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (addressId: string) => deleteAddress(api, addressId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: addressKeys.all }),
  })
}
