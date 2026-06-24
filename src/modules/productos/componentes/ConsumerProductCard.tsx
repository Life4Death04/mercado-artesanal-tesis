import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'

export type ConsumerCatalogCardProduct = {
  id: string
  name: string
  category?: string
  producer?: string
  origin?: string
  price: string
  stock?: 'En stock' | 'Sin stock'
  rating?: number
  reviews?: number
  imageUrl: string
}

type ConsumerProductCardProps = {
  product: ConsumerCatalogCardProduct
}

export function ConsumerProductCard({ product }: ConsumerProductCardProps) {
  const isOutOfStock = product.stock === 'Sin stock'

  return (
    <article
      className={`group flex h-full cursor-pointer flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-primary-container)] hover:shadow-md ${
        isOutOfStock ? 'opacity-75' : ''
      }`}
    >
      <Link to={`/productos/${product.id}`} className="flex h-full flex-col">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-surface-container)]">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="size-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
          />
          {product.stock ? <StockBadge status={product.stock} /> : null}
        </div>

        <div className="flex flex-1 flex-col p-5">
          {(product.category || product.producer || product.origin) ? (
            <div className="mb-2 flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-col gap-1">
                {product.category ? (
                  <span className="text-label-sm truncate uppercase tracking-[0.2em] text-[var(--color-secondary)]">
                    {product.category}
                  </span>
                ) : null}
                {product.producer ? (
                  <span className="text-label-sm truncate font-medium text-[var(--color-on-surface)]">
                    {product.producer}
                  </span>
                ) : null}
              </div>
              {product.origin ? <span className="text-label-sm shrink-0 text-[var(--color-on-surface-variant)]">{product.origin}</span> : null}
            </div>
          ) : null}

          <h3 className="text-title-lg mb-3 text-[var(--color-on-surface)] transition-colors group-hover:text-[var(--color-primary)]">
            {product.name}
          </h3>

          {typeof product.rating === 'number' && typeof product.reviews === 'number' ? (
            <Rating value={product.rating} reviews={product.reviews} />
          ) : null}

          <div className="mt-auto flex items-center justify-between border-t border-[var(--color-outline-variant)] pt-4">
            <span className="text-lg font-semibold text-[var(--color-on-surface)]">{product.price}</span>
          </div>
        </div>
      </Link>
    </article>
  )
}

function StockBadge({ status }: { status: NonNullable<ConsumerCatalogCardProduct['stock']> }) {
  const isOutOfStock = status === 'Sin stock'

  return (
    <div className="absolute top-3 left-3 flex items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-2 py-1 shadow-sm">
      <span className={`size-1.5 rounded-full ${isOutOfStock ? 'bg-[var(--color-outline)]' : 'bg-[var(--color-primary)]'}`} />
      <span className="text-label-sm text-[10px] uppercase tracking-wider text-[var(--color-on-surface-variant)]">
        {status}
      </span>
    </div>
  )
}

function Rating({ value, reviews }: { value: number; reviews: number }) {
  return (
    <div className="mb-4 flex items-center gap-1" aria-label={`${value} de 5 estrellas, ${reviews} reseñas`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={16}
          strokeWidth={1.6}
          className={index < value ? 'text-[var(--color-secondary)]' : 'text-[var(--color-outline)]'}
          fill={index < value ? 'currentColor' : 'transparent'}
        />
      ))}
      <span className="text-label-sm ml-1 text-[var(--color-on-surface-variant)]">({reviews})</span>
    </div>
  )
}
