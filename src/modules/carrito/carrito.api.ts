import { cartSchema, type Cart } from './carrito.schema'

export const carritoEndpoints = {
  cart: '/carrito',
  items: '/carrito/items',
  item: (itemId: string) => `/carrito/items/${itemId}`,
} as const

type ApiCaller = <TResponse>(path: string, options?: { method?: string; body?: unknown }) => Promise<TResponse>

export async function getCart(api: ApiCaller): Promise<Cart> {
  return cartSchema.parse(await api<unknown>(carritoEndpoints.cart))
}

export async function addCartItem(api: ApiCaller, productId: string, quantity: number) {
  await api(carritoEndpoints.items, { method: 'POST', body: { productId, quantity } })
}

export async function updateCartItem(api: ApiCaller, itemId: string, quantity: number) {
  await api(carritoEndpoints.item(itemId), { method: 'PATCH', body: { quantity } })
}

export async function removeCartItem(api: ApiCaller, itemId: string) {
  await api(carritoEndpoints.item(itemId), { method: 'DELETE' })
}

export async function clearCart(api: ApiCaller) {
  await api(carritoEndpoints.cart, { method: 'DELETE' })
}
