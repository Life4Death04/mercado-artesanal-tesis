import { useAuth0 } from '@auth0/auth0-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../auth/hooks/useAuthenticatedApi'
import { addCartItem, clearCart, getCart, removeCartItem, updateCartItem } from '../carrito.api'
import { cartKeys } from '../carrito.queryKeys'

function useCartInvalidation() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: cartKeys.all })
}

export function useCartQuery() {
  const { isAuthenticated, isLoading } = useAuth0()
  const api = useAuthenticatedApi()

  return useQuery({
    queryKey: cartKeys.all,
    enabled: isAuthenticated && !isLoading,
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: () => getCart(api),
  })
}

export function useAddCartItemMutation() {
  const api = useAuthenticatedApi()
  const invalidate = useCartInvalidation()
  return useMutation({ mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) => addCartItem(api, productId, quantity), onSuccess: invalidate })
}

export function useUpdateCartItemMutation() {
  const api = useAuthenticatedApi()
  const invalidate = useCartInvalidation()
  return useMutation({ mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) => updateCartItem(api, itemId, quantity), onSuccess: invalidate })
}

export function useRemoveCartItemMutation() {
  const api = useAuthenticatedApi()
  const invalidate = useCartInvalidation()
  return useMutation({ mutationFn: (itemId: string) => removeCartItem(api, itemId), onSuccess: invalidate })
}

export function useClearCartMutation() {
  const api = useAuthenticatedApi()
  const invalidate = useCartInvalidation()
  return useMutation({ mutationFn: () => clearCart(api), onSuccess: invalidate })
}
