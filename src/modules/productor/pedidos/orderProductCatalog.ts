import type { ProductDTO } from '../productos/productos.schema'

export type OrderProductCatalog =
  | { status: 'loading' }
  | { status: 'unavailable' }
  | { status: 'ready'; products: ProductDTO[] }

export function resolveOrderProduct(
  productId: string,
  catalog: OrderProductCatalog,
): { name: string; imageUrl?: string } {
  if (catalog.status === 'loading') return { name: 'Cargando producto...' }
  if (catalog.status === 'unavailable') return { name: 'Catálogo no disponible' }

  const product = catalog.products.find((item) => item.id === productId)

  return product
    ? { name: product.name, imageUrl: product.images?.[0]?.url }
    : { name: 'Producto no disponible' }
}
