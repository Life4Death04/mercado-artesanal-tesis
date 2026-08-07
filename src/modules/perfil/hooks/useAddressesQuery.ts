import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../auth/hooks/useAuthenticatedApi'
import { getAddresses } from '../direcciones.api'
import { addressKeys } from '../direcciones.queryKeys'

export function useAddressesQuery() {
  const { isAuthenticated, isLoading } = useAuth0()
  const api = useAuthenticatedApi()

  return useQuery({
    queryKey: addressKeys.all,
    enabled: isAuthenticated && !isLoading,
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: ({ signal }) => getAddresses(api, signal),
  })
}
