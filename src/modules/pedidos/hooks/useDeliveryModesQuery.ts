import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../auth/hooks/useAuthenticatedApi'
import { deliveryModeKeys } from '../deliveryModes.queryKeys'
import { getDeliveryModes } from '../pagos.api'

export function useDeliveryModesQuery(enabled = true) {
  const { isAuthenticated, isLoading } = useAuth0()
  const api = useAuthenticatedApi()

  return useQuery({
    queryKey: deliveryModeKeys.all(),
    enabled: enabled && isAuthenticated && !isLoading,
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: ({ signal }) => getDeliveryModes(api, signal),
  })
}
