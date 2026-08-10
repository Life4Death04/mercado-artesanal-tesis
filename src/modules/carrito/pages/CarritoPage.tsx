import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ChevronRight, Heart, ImageOff, Minus, Plus, ShoppingBag, Sparkles, Sprout, TriangleAlert, X } from 'lucide-react'
import { formatMoney, formatMoneyFromCents, moneyToCents } from '../../../lib/formatMoney'
import { resolveErrorMessage } from '../../../lib/errorMessages'
import type { Cart } from '../carrito.schema'
import { useCartQuery, useClearCartMutation, useRemoveCartItemMutation, useUpdateCartItemMutation } from '../hooks/useCart'

type CartItem = {
  id: string
  productPath: string
  name: string
  /** Display label shown next to the item (e.g. "18.50€ / ud"). */
  unitPrice: string
  /**
   * Raw Decimal string from the backend (e.g. "18.50").
   * Used only for display via formatMoney — never for arithmetic.
   */
  unitPriceDecimal: string
  quantity: number
  image?: string
  warning?: string
  disableIncrease?: boolean
}

type ProducerGroup = {
  id: string
  name: string
  location: string
  path?: string
  items: CartItem[]
}

function toCartGroups(cart: Cart): ProducerGroup[] {
  return Object.values(cart.items.reduce<Record<string, ProducerGroup>>((groups, item) => {
    const producer = item.product.producer
    const id = producer?.id ?? 'artesanos'
    const unavailable = item.isAvailable === false || item.product.isAvailable === false || item.product.stock < item.quantity
    const group = groups[id] ?? { id, name: producer?.businessName ?? producer?.name ?? 'Productos artesanales', location: producer?.province ?? '', items: [] }
    group.items.push({ id: item.id, productPath: `/productos/${item.productId}`, name: item.product.name, unitPrice: `${formatMoney(item.unitPriceSnapshot)} / ud`, unitPriceDecimal: item.unitPriceSnapshot, quantity: item.quantity, image: item.product.images[0]?.url, warning: unavailable ? 'Este producto no está disponible para la compra' : undefined, disableIncrease: unavailable || item.quantity >= item.product.stock })
    groups[id] = group
    return groups
  }, {}))
}

export function CarritoPage() {
  const cartQuery = useCartQuery()
  const updateMutation = useUpdateCartItemMutation()
  const removeMutation = useRemoveCartItemMutation()
  const clearMutation = useClearCartMutation()
  const cartGroups = cartQuery.data ? toCartGroups(cartQuery.data) : []
  const isMutating = updateMutation.isPending || removeMutation.isPending || clearMutation.isPending
  const mutationError = [updateMutation, removeMutation, clearMutation].find((mutation) => mutation.isError)?.error
  const checkoutBlocked = cartGroups.some((group) => group.items.some((item) => item.warning))
  const subtotalCents = sumCartItems(cartGroups.flatMap((group) => group.items))

  function updateItemQuantity(item: CartItem, delta: number) {
    if (delta < 0 && item.quantity === 1) removeMutation.mutate(item.id)
    else updateMutation.mutate({ itemId: item.id, quantity: item.quantity + delta })
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <main className="mx-auto flex w-full max-w-[var(--layout-container-max)] flex-grow flex-col px-[var(--space-margin-mobile)] pt-12 pb-32 md:px-[var(--space-margin-desktop)] md:py-24">
        <header className="mb-12 md:mb-16">
          <nav aria-label="Breadcrumb" className="text-label-sm mb-4 flex items-center gap-2 text-[var(--color-on-surface-variant)]/70">
            <Link to="/productos" className="transition-colors hover:text-[var(--color-primary)]">
              Catálogo
            </Link>
            <ChevronRight size={14} strokeWidth={1.8} />
            <span className="text-[var(--color-on-surface)]">Carrito</span>
          </nav>
          <h1 className="text-display-lg text-[var(--color-on-surface)]">Tu carrito</h1>
        </header>

        {cartQuery.isLoading ? <p className="text-body-md py-16 text-center text-[var(--color-on-surface-variant)]">Cargando carrito...</p> : cartQuery.isError ? <p role="alert" className="text-body-md rounded-[var(--radius-default)] bg-[var(--color-error-container)] p-4 text-[var(--color-error)]">{resolveErrorMessage(cartQuery.error)}</p> : cartGroups.length > 0 ? (
          <div className="flex flex-col gap-[var(--space-gutter)] lg:flex-row">
            <div className="flex w-full flex-grow flex-col gap-12 lg:w-2/3">
              {cartGroups.map((group) => (
                <ProducerCartGroup
                  key={group.id}
                  group={group}
                  onDecrease={(item) => updateItemQuantity(item, -1)}
                  onIncrease={(item) => updateItemQuantity(item, 1)}
                  onRemove={(item) => removeMutation.mutate(item.id)}
                />
              ))}

              <CartActions className="hidden lg:flex" disabled={isMutating} onClearCart={() => clearMutation.mutate()} />
            </div>

            <OrderSummary subtotalCents={subtotalCents} checkoutBlocked={checkoutBlocked} disabled={isMutating} onClearCart={() => clearMutation.mutate()} />
          </div>
        ) : (
          <EmptyCartState />
        )}
        {mutationError ? <p role="alert" className="text-body-md mt-6 text-[var(--color-error)]">{resolveErrorMessage(mutationError)}</p> : null}
      </main>

      <MobileBottomNav />
    </div>
  )
}

function ProducerCartGroup({ group, onDecrease, onIncrease, onRemove }: { group: ProducerGroup; onDecrease: (item: CartItem) => void; onIncrease: (item: CartItem) => void; onRemove: (item: CartItem) => void }) {
  const subtotalCents = sumCartItems(group.items)

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-end justify-between border-b border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] pb-2">
        <div>
          {group.path ? (
            <Link to={group.path} className="text-headline-md block text-[24px] leading-8 text-[var(--color-on-surface)] transition-colors hover:text-[var(--color-primary)]">
              {group.name}
            </Link>
          ) : (
            <h2 className="text-headline-md text-[24px] leading-8 text-[var(--color-on-surface)]">{group.name}</h2>
          )}
          <span className="text-label-sm uppercase tracking-wider text-[var(--color-on-surface-variant)]">{group.location}</span>
        </div>
      </header>

      {group.items.map((item) => (
        <CartItemRow
          key={item.id}
          item={item}
          onDecrease={() => onDecrease(item)}
          onIncrease={() => onIncrease(item)}
          onRemove={() => onRemove(item)}
        />
      ))}

      <div className="mt-2 flex items-center justify-between border-t border-[color-mix(in_srgb,var(--color-surface-variant)_85%,transparent)] pt-4">
        <span className="text-body-md text-[var(--color-on-surface-variant)]">Subtotal estimado {group.name}</span>
        <span className="text-label-md text-[var(--color-on-surface)]">{formatMoneyFromCents(subtotalCents)}</span>
      </div>
    </section>
  )
}

function CartItemRow({ item, onDecrease, onIncrease, onRemove }: { item: CartItem; onDecrease: () => void; onIncrease: () => void; onRemove: () => void }) {
  const lineTotalCents = sumCartItems([item])

  return (
    <article className="group relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
      <Link to={item.productPath} className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-[var(--radius-default)] bg-[var(--color-surface-container)] sm:h-32 sm:w-32">
        {item.image ? (
          <img src={item.image} alt={item.name} className="size-full object-cover opacity-90 mix-blend-multiply transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <span className="flex size-full flex-col items-center justify-center gap-2 px-2 text-center text-[var(--color-on-surface-variant)]" role="img" aria-label={`${item.name} no tiene imagen disponible`}>
            <ImageOff size={24} strokeWidth={1.4} aria-hidden="true" />
            <span className="text-label-sm">Sin imagen</span>
          </span>
        )}
      </Link>

      <div className="flex w-full flex-grow flex-col gap-2">
        <div className="flex w-full items-start justify-between">
          <div>
            <Link to={item.productPath} className="text-body-lg text-[var(--color-on-surface)] transition-colors hover:text-[var(--color-primary)]">
              {item.name}
            </Link>
            <p className="text-label-md mt-1 text-[var(--color-on-surface-variant)]">{item.unitPrice}</p>
            {item.warning ? (
              <span className="text-label-sm mt-2 inline-flex items-center gap-1 rounded-[var(--radius-sm)] bg-[var(--color-surface-variant)] px-2 py-1 text-[var(--color-on-surface-variant)]">
                <TriangleAlert size={12} strokeWidth={1.8} />
                {item.warning}
              </span>
            ) : null}
          </div>
          <button type="button" onClick={onRemove} aria-label={`Eliminar ${item.name}`} className="-mr-2 p-2 text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-error)]">
            <X size={20} strokeWidth={1.8} />
          </button>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <QuantitySelector quantity={item.quantity} disableIncrease={item.disableIncrease} onDecrease={onDecrease} onIncrease={onIncrease} />
          <span className="text-label-md text-[var(--color-on-surface)]" aria-label={`Total de ${item.name}: ${formatMoneyFromCents(lineTotalCents)}`}>{formatMoneyFromCents(lineTotalCents)}</span>
        </div>
      </div>
    </article>
  )
}

function QuantitySelector({ quantity, disableIncrease = false, onDecrease, onIncrease }: { quantity: number; disableIncrease?: boolean; onDecrease: () => void; onIncrease: () => void }) {
  return (
    <div className="flex items-center overflow-hidden rounded-[var(--radius-default)] border border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] bg-[var(--color-surface)]">
      <button type="button" onClick={onDecrease} aria-label="Reducir cantidad" className="flex size-8 items-center justify-center text-[var(--color-on-surface-variant)] transition-colors hover:bg-[var(--color-surface-variant)]">
        <Minus size={14} strokeWidth={1.8} />
      </button>
      <span className="text-label-md w-8 text-center text-[var(--color-on-surface)]">{quantity}</span>
      <button
        type="button"
        onClick={onIncrease}
        aria-label="Aumentar cantidad"
        disabled={disableIncrease}
        className="flex size-8 items-center justify-center text-[var(--color-on-surface-variant)] transition-colors hover:bg-[var(--color-surface-variant)] disabled:cursor-not-allowed disabled:bg-[var(--color-surface-container)] disabled:text-[var(--color-outline-variant)]"
      >
        <Plus size={14} strokeWidth={1.8} />
      </button>
    </div>
  )
}

function OrderSummary({ subtotalCents, checkoutBlocked, disabled, onClearCart }: { subtotalCents: bigint | null; checkoutBlocked: boolean; disabled: boolean; onClearCart: () => void }) {
  return (
    <aside className="mt-12 w-full lg:mt-0 lg:w-1/3">
      <div className="sticky top-32 flex flex-col gap-6 rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] bg-[var(--color-surface-container-lowest)] p-6 shadow-[0_4px_20px_rgba(26,26,26,0.02)] lg:p-8">
        <h2 className="text-headline-md border-b border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] pb-4 text-[24px] leading-8 text-[var(--color-on-surface)]">Resumen del pedido</h2>

        <div className="text-body-md flex flex-col gap-4">
          <div className="flex items-center justify-between text-[var(--color-on-surface)]">
            <span>Subtotal estimado</span>
            <span>{formatMoneyFromCents(subtotalCents)}</span>
          </div>
          <div className="flex items-center justify-between text-[var(--color-on-surface-variant)]">
            <span>
              Envío <span className="text-sm italic">(calculado en el checkout)</span>
            </span>
            <span>—</span>
          </div>
        </div>

        <div className="mt-2 flex items-end justify-between border-t border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] pt-6">
          <span className="text-body-lg text-[var(--color-on-surface)]">Total estimado de productos</span>
          <span className="text-headline-md text-[24px] leading-8 text-[var(--color-on-surface)]">{formatMoneyFromCents(subtotalCents)}</span>
        </div>

        <p className="mt-2 text-center text-xs text-[var(--color-on-surface-variant)] italic">
          Importe orientativo según el carrito actual. El servidor recalculará el cobro junto con los gastos de envío.
        </p>

        {checkoutBlocked ? <p role="alert" className="text-label-sm text-center text-[var(--color-error)]">Revisa los productos no disponibles antes de continuar.</p> : <Link to="/checkout" className="text-label-md mt-4 flex w-full items-center justify-center gap-2 rounded-[var(--radius-default)] bg-[var(--color-primary-container)] py-4 text-center uppercase tracking-widest transition-colors duration-300 hover:bg-[var(--color-on-primary-fixed-variant)]">
          <span className="text-[var(--color-on-primary)]">Proceder a la compra</span>
          <ArrowRight className="text-[var(--color-on-primary)]" size={15} strokeWidth={1.8} />
        </Link>}

        <CartActions className="flex lg:hidden" mobile disabled={disabled} onClearCart={onClearCart} />
      </div>
    </aside>
  )
}

function sumCartItems(items: CartItem[]): bigint | null {
  return items.reduce<bigint | null>((total, item) => {
    const unitCents = moneyToCents(item.unitPriceDecimal)
    return total === null || unitCents === null ? null : total + unitCents * BigInt(item.quantity)
  }, 0n)
}

function CartActions({ className, mobile = false, disabled = false, onClearCart }: { className: string; mobile?: boolean; disabled?: boolean; onClearCart: () => void }) {
  return (
    <div className={`${className} ${mobile ? 'mt-4 flex-col items-center gap-4 border-t border-[color-mix(in_srgb,var(--color-surface-variant)_85%,transparent)] pt-8' : 'mt-8 items-center justify-between border-t border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] pt-8'}`}>
      <Link to="/productos" className="text-body-md flex items-center gap-2 text-[var(--color-on-surface-variant)] underline decoration-[var(--color-outline-variant)] underline-offset-4 transition-colors hover:text-[var(--color-primary)] hover:decoration-[var(--color-primary)]">
        <ArrowLeft size={15} strokeWidth={1.8} />
        Seguir comprando
      </Link>
      <button type="button" disabled={disabled} onClick={onClearCart} className={`text-body-md text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-error)] disabled:opacity-50 ${mobile ? 'mt-4 text-sm' : 'text-sm'}`}>
        Vaciar carrito
      </button>
    </div>
  )
}

function EmptyCartState() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] px-8 py-14 text-center shadow-[0_4px_20px_rgba(26,26,26,0.02)]">
      <ShoppingBag size={36} strokeWidth={1.6} className="text-[var(--color-primary)]" />
      <div className="space-y-3">
        <h2 className="text-headline-lg text-[var(--color-on-surface)]">Tu carrito está vacío</h2>
        <p className="text-body-md text-[var(--color-on-surface-variant)]">
          Añade productos artesanales para preparar tu próximo pedido.
        </p>
      </div>
      <Link to="/productos" className="text-label-md inline-flex items-center gap-2 rounded-[var(--radius-default)] bg-[var(--color-primary-container)] px-8 py-4 uppercase tracking-widest text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary)]">
        <span className="text-[var(--color-on-primary)]">Ir al catálogo</span>
        <ArrowRight className="text-[var(--color-on-primary)]" size={16} strokeWidth={1.8} />
      </Link>
    </section>
  )
}

function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-[var(--radius-xl)] bg-[var(--color-surface-bright)] px-4 pt-2 pb-4 shadow-[0_-4px_20px_rgba(26,26,26,0.04)] md:hidden" aria-label="Navegación móvil">
      <MobileNavItem icon={<Sparkles size={20} strokeWidth={1.8} />} label="Curation" />
      <MobileNavItem icon={<Sprout size={20} strokeWidth={1.8} />} label="Producers" />
      <MobileNavItem icon={<Heart size={20} strokeWidth={1.8} />} label="Favorites" />
      <Link to="/carrito" className="flex h-16 min-w-16 flex-col items-center justify-center rounded-full bg-[var(--color-secondary-container)] px-4 py-1 text-[var(--color-on-secondary-container)] transition-transform active:scale-90">
        <ShoppingBag size={20} strokeWidth={1.8} className="mb-1" />
        <span className="text-label-sm">Basket</span>
      </Link>
    </nav>
  )
}

function MobileNavItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <a href="#" className="flex h-16 w-16 scale-95 flex-col items-center justify-center rounded-full p-2 text-[var(--color-secondary)] transition-all hover:bg-[var(--color-secondary-fixed-dim)] active:scale-90">
      <span className="mb-1">{icon}</span>
      <span className="text-label-sm">{label}</span>
    </a>
  )
}
