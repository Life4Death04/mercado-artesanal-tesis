import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, ChevronRight, ImageOff, Info, MessageSquareText, Minus, Plus, ShoppingBag } from 'lucide-react'
import { ApiError } from '../../../lib/api'
import { resolveErrorMessage } from '../../../lib/errorMessages'
import { formatMoney } from '../../../lib/formatMoney'
import { useAddCartItemMutation } from '../../carrito/hooks/useCart'
import { useProducto } from '../hooks/useProducto'
import type { PublicProduct } from '../productos.schema'

export function DetalleProductoPage() {
  const { productoId } = useParams()
  const productQuery = useProducto(productoId)
  const addCartItem = useAddCartItemMutation()
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>()
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  if (productQuery.isLoading) {
    return <DetailStatus message="Cargando producto..." />
  }

  if (!productoId || productQuery.isError) {
    const notFound = !productoId || (productQuery.error instanceof ApiError && productQuery.error.status === 404)
    return (
      <DetailStatus
        message={notFound ? 'No encontramos el producto solicitado.' : resolveErrorMessage(productQuery.error)}
        onRetry={notFound ? undefined : () => productQuery.refetch()}
      />
    )
  }

  const product = productQuery.data

  if (!product) {
    return <DetailStatus message="No encontramos el producto solicitado." />
  }

  const selectedImage = product.images.some((image) => image.url === selectedImageUrl)
    ? selectedImageUrl
    : product.images[0]?.url
  const stock = product.stock
  const selectedQuantity = stock > 0 ? Math.min(quantity, stock) : 1

  function updateQuantity(nextQuantity: number) {
    setQuantity(Math.max(1, Math.min(stock, nextQuantity)))
    setAddedToCart(false)
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--color-surface)] text-[var(--color-on-surface)] selection:bg-[var(--color-primary-container)] selection:text-[var(--color-on-primary)]">
      <main className="mx-auto max-w-[var(--layout-container-max)] px-[var(--space-margin-mobile)] py-12 md:px-[var(--space-margin-desktop)] md:py-20">
        <Breadcrumbs product={product} />

        <section className="mb-24 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-24">
          <ProductGallery product={product} selectedImage={selectedImage} onSelectImage={setSelectedImageUrl} />
          <ProductInfo
            product={product}
            quantity={selectedQuantity}
            onDecrease={() => updateQuantity(selectedQuantity - 1)}
            onIncrease={() => updateQuantity(selectedQuantity + 1)}
            onAddToCart={() => addCartItem.mutate(
              { productId: product.id, quantity: selectedQuantity },
              { onSuccess: () => setAddedToCart(true) },
            )}
            addedToCart={addedToCart}
            isAdding={addCartItem.isPending}
            error={addCartItem.isError ? resolveErrorMessage(addCartItem.error) : null}
          />
        </section>
        <EmptyReviews />
      </main>
    </div>
  )
}

function EmptyReviews() {
  return (
    <section aria-labelledby="reviews-title" className="mb-16 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_55%,transparent)] pt-12 md:pt-16">
      <div className="grid gap-8 md:grid-cols-[0.75fr_1.25fr] md:items-start">
        <div>
          <p className="text-label-sm mb-3 uppercase tracking-[0.18em] text-[var(--color-primary)]">Experiencia de compra</p>
          <h2 id="reviews-title" className="text-headline-lg text-[var(--color-on-surface)]">Valoraciones</h2>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] px-6 py-10 text-center md:px-10">
          <span className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]" aria-hidden="true">
            <MessageSquareText size={23} strokeWidth={1.6} />
          </span>
          <h3 className="text-headline-md text-[var(--color-on-surface)]">Este producto aún no tiene valoraciones</h3>
          <p className="text-body-md mx-auto mt-3 max-w-lg text-[var(--color-on-surface-variant)]">Cuando consumidores verificados compartan su experiencia, sus opiniones aparecerán aquí.</p>
        </div>
      </div>
    </section>
  )
}

function Breadcrumbs({ product }: { product: PublicProduct }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="text-label-sm flex flex-wrap items-center gap-2 text-[var(--color-secondary)]">
        <li><Link to="/productos" className="transition-colors hover:text-[var(--color-primary)]">Catálogo</Link></li>
        <li><ChevronRight size={14} strokeWidth={1.8} /></li>
        <li>{product.category.name}</li>
        <li><ChevronRight size={14} strokeWidth={1.8} /></li>
        <li aria-current="page" className="text-[var(--color-on-surface)]">{product.name}</li>
      </ol>
    </nav>
  )
}

function ProductGallery({ product, selectedImage, onSelectImage }: { product: PublicProduct; selectedImage?: string; onSelectImage: (image: string) => void }) {
  return (
    <div className="col-span-1 flex flex-col gap-[var(--space-unit)] lg:col-span-6">
      <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] bg-[var(--color-surface-container-low)]">
        {selectedImage ? (
          <img src={selectedImage} alt={product.name} className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-4 text-[var(--color-on-surface-variant)]" role="img" aria-label={`${product.name} no tiene imagen disponible`}>
            <ImageOff size={48} strokeWidth={1.3} aria-hidden="true" />
            <span className="text-body-md">Imagen no disponible</span>
          </div>
        )}
      </div>
      {product.images.length > 1 ? (
        <div className="mt-4 grid grid-cols-3 gap-[var(--space-unit)]">
          {product.images.map((image, index) => (
            <button key={image.id} type="button" onClick={() => onSelectImage(image.url)} className={`aspect-square overflow-hidden rounded-[var(--radius-default)] border transition-opacity focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none ${image.url === selectedImage ? 'border-[var(--color-primary)] opacity-100' : 'border-[color-mix(in_srgb,var(--color-outline)_20%,transparent)] opacity-60 hover:opacity-100'}`}>
              <img src={image.url} alt={`Vista ${index + 1} de ${product.name}`} className="size-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

type ProductInfoProps = {
  product: PublicProduct
  quantity: number
  onDecrease: () => void
  onIncrease: () => void
  onAddToCart: () => void
  addedToCart: boolean
  isAdding: boolean
  error: string | null
}

function ProductInfo({ product, quantity, onDecrease, onIncrease, onAddToCart, addedToCart, isAdding, error }: ProductInfoProps) {
  const hasStock = product.stock > 0

  return (
    <div className="col-span-1 flex flex-col lg:col-span-6">
      <div className="mb-8 border-b border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] pb-8">
        <span className="text-label-md mb-2 block uppercase tracking-wider text-[var(--color-secondary)]">{product.category.name}</span>
        <h1 className="text-display-lg mb-4 leading-tight text-[var(--color-on-surface)]">{product.name}</h1>
        <div className="flex items-end justify-between gap-6">
          <span className="text-headline-lg text-[var(--color-primary)]">{formatMoney(product.price)}</span>
          <span className="text-label-sm rounded-[var(--radius-default)] border border-[color-mix(in_srgb,var(--color-secondary-fixed)_50%,transparent)] bg-[var(--color-secondary-container)] px-3 py-1 text-[var(--color-on-secondary-container)]">
            {hasStock ? `${product.stock} disponibles` : 'Sin stock'}
          </span>
        </div>
      </div>

      <div className="mb-10 flex flex-col gap-6">
        <div className="flex items-center gap-6">
          <div className="flex h-12 w-32 items-center rounded-[var(--radius-default)] border border-[color-mix(in_srgb,var(--color-outline)_30%,transparent)]">
            <button type="button" aria-label="Disminuir cantidad" onClick={onDecrease} disabled={!hasStock || quantity <= 1} className="flex flex-1 items-center justify-center text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-35">
              <Minus size={18} strokeWidth={1.8} />
            </button>
            <span className="text-label-md w-8 text-center text-[var(--color-on-surface)]">{quantity}</span>
            <button type="button" aria-label="Aumentar cantidad" onClick={onIncrease} disabled={!hasStock || quantity >= product.stock} className="flex flex-1 items-center justify-center text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-35">
              <Plus size={18} strokeWidth={1.8} />
            </button>
          </div>
          <button type="button" onClick={onAddToCart} disabled={!hasStock || isAdding} className="text-label-md flex h-12 flex-1 items-center justify-center gap-2 rounded-[var(--radius-default)] bg-[var(--color-primary-container)] px-6 py-3 text-[var(--color-on-primary)] transition-colors duration-200 hover:bg-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50">
            <ShoppingBag size={20} strokeWidth={1.8} />
            {!hasStock ? 'Producto agotado' : isAdding ? 'Añadiendo...' : addedToCart ? `Añadido (${quantity})` : `Añadir ${quantity} al carrito`}
          </button>
        </div>
        {addedToCart ? <p className="text-label-sm text-[var(--color-primary)]">Producto añadido al carrito con cantidad {quantity}.</p> : null}
        {error ? <p role="alert" className="text-label-sm text-[var(--color-error)]">{error}</p> : null}
      </div>

      <Link to={`/productores/${product.producer.id}`} className="group mb-8 block rounded-[var(--radius-default)] border border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] bg-[var(--color-surface-container-low)] p-6 transition-colors hover:bg-[var(--color-surface-container)]">
        <div className="flex items-center justify-between gap-6">
          <div>
            <span className="text-label-sm mb-1 block text-[var(--color-secondary)]">PRODUCIDO POR</span>
            <span className="text-headline-md text-[var(--color-on-surface)] transition-colors group-hover:text-[var(--color-primary)]">{product.producer.businessName}</span>
            <span className="text-body-sm mt-1 block text-[var(--color-on-surface-variant)]">{product.producer.address.city}, {product.producer.address.province}</span>
          </div>
          <span aria-label="Ver perfil del productor" className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-outline)_20%,transparent)] text-[var(--color-secondary)] transition-colors group-hover:border-[var(--color-primary)] group-hover:text-[var(--color-primary)]">
            <ArrowRight size={18} strokeWidth={1.8} />
          </span>
        </div>
      </Link>

      <div className="mb-10 rounded-[var(--radius-default)] border border-[#b7a98f]/50 bg-[color-mix(in_srgb,var(--color-secondary-fixed)_30%,transparent)] p-6">
        <h2 className="text-label-md mb-2 flex items-center gap-2 text-[var(--color-on-surface)]"><Info size={18} strokeWidth={1.8} />Información del producto</h2>
        <dl className="text-body-md grid gap-2 leading-relaxed text-[var(--color-secondary)]">
          {product.ingredients ? <div><dt className="inline font-medium text-[var(--color-on-surface)]">Ingredientes: </dt><dd className="inline">{product.ingredients}</dd></div> : null}
          <div><dt className="inline font-medium text-[var(--color-on-surface)]">Alérgenos: </dt><dd className="inline">{product.allergens.length > 0 ? product.allergens.join(', ') : 'Sin alérgenos declarados'}</dd></div>
          {product.presentation ? <div><dt className="inline font-medium text-[var(--color-on-surface)]">Presentación: </dt><dd className="inline">{product.presentation}</dd></div> : null}
          {product.weight !== null ? <div><dt className="inline font-medium text-[var(--color-on-surface)]">Peso: </dt><dd className="inline">{product.weight} g</dd></div> : null}
        </dl>
      </div>

      <p className="text-body-md whitespace-pre-line leading-relaxed text-[var(--color-secondary)]">{product.description}</p>
    </div>
  )
}

function DetailStatus({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-[var(--space-margin-mobile)] text-center" role="status">
      <h1 className="text-headline-lg text-[var(--color-on-surface)]">{message}</h1>
      <Link to="/productos" className="text-label-md mt-6 border-b border-[var(--color-primary)] pb-1 text-[var(--color-primary)]">Volver al catálogo</Link>
      {onRetry ? <button type="button" onClick={onRetry} className="text-label-md mt-5 border border-[var(--color-primary)] px-6 py-3 uppercase tracking-wider text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)]">Reintentar</button> : null}
    </main>
  )
}
