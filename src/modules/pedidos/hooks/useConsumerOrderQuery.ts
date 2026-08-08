import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../auth/hooks/useAuthenticatedApi'
import { getConsumerOrder } from '../pedidos.api'
import { pedidosKeys } from '../pedidos.queryKeys'

export function useConsumerOrderQuery(orderId: string | null) {
  const { isAuthenticated, isLoading } = useAuth0()
  const api = useAuthenticatedApi()
  return useQuery({ queryKey: pedidosKeys.detail(orderId ?? 'missing'), enabled: orderId !== null && isAuthenticated && !isLoading, retry: false, refetchOnWindowFocus: false, queryFn: ({ signal }) => getConsumerOrder(api, orderId!, signal) })
}
