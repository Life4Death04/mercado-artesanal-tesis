import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ChevronRight, Heart, Minus, Plus, ShoppingBag, Sparkles, Sprout, TriangleAlert, X } from 'lucide-react'

type CartItem = {
  name: string
  unitPrice: string
  quantity: number
  total: string
  image: string
  warning?: string
  disableIncrease?: boolean
}

type ProducerGroup = {
  name: string
  location: string
  path?: string
  subtotal: string
  items: CartItem[]
}

const cartGroups: ProducerGroup[] = [
  {
    name: 'Finca Alicante',
    location: 'Denia',
    path: '/productores/finca-alicante',
    subtotal: '37.50€',
    items: [
      {
        name: 'Aceite de Oliva Virgen Extra',
        unitPrice: '18.50€ / ud',
        quantity: 1,
        total: '18.50€',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDFEQm_z3dev2jYciMF1OVkN7afLFF9JrFWmZFGNNgUs3C_g8xkbcAv1IwnimQ5FM5M5NXtE0pt8j5faLUAqR89Q-qe0z915pXuYeRisMgkK_N-npdKrl1w1Vindl_2NJoez7HC08LAZ_2oucJuo_FxxkCnEDhLjS3ACibYGlau2lY77lK9dgoyp4-PgLYt4suBajIZEh4NtvtNyQPIlxWPGscSUBHDh3stWuFoJUeP5ditGRAwrHwF-hGwTcxE1EGdNPyRio5oPu0',
      },
      {
        name: 'Miel de Azahar',
        unitPrice: '9.50€ / ud',
        quantity: 2,
        total: '19.00€',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDo6-DPtDJ2-94vFmaJCElQ_8yyIOG57vXUHTFoDeFgx-1cuPgTxf3l9XZciGW6Scq_Kb6S1YtOUGbbYg2kug-4q4ie8N_EZ2zb2BZ8zi1DhrJgSWFnsorfGsg1PN98j1e2n5dU9qS_9lY8eEkQ8f99Ah5TL6PXLr5KLMy9yh4PQTIQuP1bsfMqrFtz6Bruq9aRl8yUVuZ6gXfDW2JF9YyJa8Y7TfB3PYyXc0Ux-Rs7VF1v5CEzLtRYy_Gwmayk_OTDj_axxgyrFJc',
      },
    ],
  },
  {
    name: 'Embutidos del Sol',
    location: 'Pinoso',
    subtotal: '14.00€',
    items: [
      {
        name: 'Sobrasada Artesana',
        unitPrice: '7.00€ / ud',
        quantity: 2,
        total: '14.00€',
        warning: 'Últimas 2 unidades disponibles',
        disableIncrease: true,
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCaBbRLuHKkXdO1JevuJioqQWoRFxxGfuh6sdsyWWNCjzfRybP6TP-_srjHZw1fyF3QlaLhqi2fpiwJz0tSt_ky219YhMa4ePvtEAg8n0sMbF9PBA7fEcc2B7xJT-7T1UQARZvFyB19QOd8fyGeQZBK4dAoG2xs6qpH48-vdMGHz6I2j_X-ZvZ39koIzbVIw9aI2dtHz_c5-HqaGYRiPThrqe_QydfHnisZD3IfI-mif20B4NwkVhvCYk181c91_Vu3qSedvB9vfWk',
      },
    ],
  },
]

const orderTotal = '51.50€'

export function CarritoPage() {
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
          <h1 className="text-display-lg text-[var(--color-on-surface)]">Tu cesta</h1>
        </header>

        <div className="flex flex-col gap-[var(--space-gutter)] lg:flex-row">
          <div className="flex w-full flex-grow flex-col gap-12 lg:w-2/3">
            {cartGroups.map((group) => (
              <ProducerCartGroup key={group.name} group={group} />
            ))}

            <CartActions className="hidden lg:flex" />
          </div>

          <OrderSummary />
        </div>
      </main>

      <CartFooter />
      <MobileBottomNav />
    </div>
  )
}

function ProducerCartGroup({ group }: { group: ProducerGroup }) {
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
        <CartItemRow key={item.name} item={item} />
      ))}

      <div className="mt-2 flex items-center justify-between border-t border-[color-mix(in_srgb,var(--color-surface-variant)_85%,transparent)] pt-4">
        <span className="text-body-md text-[var(--color-on-surface-variant)]">Subtotal {group.name}</span>
        <span className="text-label-md text-[var(--color-on-surface)]">{group.subtotal}</span>
      </div>
    </section>
  )
}

function CartItemRow({ item }: { item: CartItem }) {
  return (
    <article className="group relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-[var(--radius-default)] bg-[var(--color-surface-container)] sm:h-32 sm:w-32">
        <img src={item.image} alt={item.name} className="size-full object-cover opacity-90 mix-blend-multiply transition-transform duration-700 group-hover:scale-105" />
      </div>

      <div className="flex w-full flex-grow flex-col gap-2">
        <div className="flex w-full items-start justify-between">
          <div>
            <h3 className="text-body-lg text-[var(--color-on-surface)]">{item.name}</h3>
            <p className="text-label-md mt-1 text-[var(--color-on-surface-variant)]">{item.unitPrice}</p>
            {item.warning ? (
              <span className="text-label-sm mt-2 inline-flex items-center gap-1 rounded-[var(--radius-sm)] bg-[var(--color-surface-variant)] px-2 py-1 text-[var(--color-on-surface-variant)]">
                <TriangleAlert size={12} strokeWidth={1.8} />
                {item.warning}
              </span>
            ) : null}
          </div>
          <button type="button" aria-label={`Eliminar ${item.name}`} className="-mr-2 p-2 text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-error)]">
            <X size={20} strokeWidth={1.8} />
          </button>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <QuantitySelector quantity={item.quantity} disableIncrease={item.disableIncrease} />
          <span className="text-label-md text-[var(--color-on-surface)]">{item.total}</span>
        </div>
      </div>
    </article>
  )
}

function QuantitySelector({ quantity, disableIncrease = false }: { quantity: number; disableIncrease?: boolean }) {
  return (
    <div className="flex items-center overflow-hidden rounded-[var(--radius-default)] border border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] bg-[var(--color-surface)]">
      <button type="button" aria-label="Reducir cantidad" className="flex size-8 items-center justify-center text-[var(--color-on-surface-variant)] transition-colors hover:bg-[var(--color-surface-variant)]">
        <Minus size={14} strokeWidth={1.8} />
      </button>
      <span className="text-label-md w-8 text-center text-[var(--color-on-surface)]">{quantity}</span>
      <button
        type="button"
        aria-label="Aumentar cantidad"
        disabled={disableIncrease}
        className="flex size-8 items-center justify-center text-[var(--color-on-surface-variant)] transition-colors hover:bg-[var(--color-surface-variant)] disabled:cursor-not-allowed disabled:bg-[var(--color-surface-container)] disabled:text-[var(--color-outline-variant)]"
      >
        <Plus size={14} strokeWidth={1.8} />
      </button>
    </div>
  )
}

function OrderSummary() {
  return (
    <aside className="mt-12 w-full lg:mt-0 lg:w-1/3">
      <div className="sticky top-32 flex flex-col gap-6 rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] bg-[var(--color-surface-container-lowest)] p-6 shadow-[0_4px_20px_rgba(26,26,26,0.02)] lg:p-8">
        <h2 className="text-headline-md border-b border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] pb-4 text-[24px] leading-8 text-[var(--color-on-surface)]">Resumen del pedido</h2>

        <div className="text-body-md flex flex-col gap-4">
          <div className="flex items-center justify-between text-[var(--color-on-surface)]">
            <span>Subtotal productos</span>
            <span>{orderTotal}</span>
          </div>
          <div className="flex items-center justify-between text-[var(--color-on-surface-variant)]">
            <span>
              Envío <span className="text-sm italic">(calculado en el checkout)</span>
            </span>
            <span>—</span>
          </div>
        </div>

        <div className="mt-2 flex items-end justify-between border-t border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] pt-6">
          <span className="text-body-lg text-[var(--color-on-surface)]">Total productos</span>
          <span className="text-headline-md text-[24px] leading-8 text-[var(--color-on-surface)]">{orderTotal}</span>
        </div>

        <p className="mt-2 text-center text-xs text-[var(--color-on-surface-variant)] italic">
          Impuestos incluidos. Los gastos de envío se calcularán en el siguiente paso.
        </p>

        <Link to="/checkout" className="text-label-md mt-4 flex w-full items-center justify-center gap-2 rounded-[var(--radius-default)] bg-[var(--color-primary-container)] py-4 text-center uppercase tracking-widest transition-colors duration-300 hover:bg-[var(--color-on-primary-fixed-variant)]">
          <span className="text-[var(--color-on-primary)]">Proceder a la compra</span>
          <ArrowRight className="text-[var(--color-on-primary)]" size={15} strokeWidth={1.8} />
        </Link>

        <CartActions className="flex lg:hidden" mobile />
      </div>
    </aside>
  )
}

function CartActions({ className, mobile = false }: { className: string; mobile?: boolean }) {
  return (
    <div className={`${className} ${mobile ? 'mt-4 flex-col items-center gap-4 border-t border-[color-mix(in_srgb,var(--color-surface-variant)_85%,transparent)] pt-8' : 'mt-8 items-center justify-between border-t border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] pt-8'}`}>
      <Link to="/productos" className="text-body-md flex items-center gap-2 text-[var(--color-on-surface-variant)] underline decoration-[var(--color-outline-variant)] underline-offset-4 transition-colors hover:text-[var(--color-primary)] hover:decoration-[var(--color-primary)]">
        <ArrowLeft size={15} strokeWidth={1.8} />
        Seguir comprando
      </Link>
      <button type="button" className={`text-body-md text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-error)] ${mobile ? 'mt-4 text-sm' : 'text-sm'}`}>
        Vaciar carrito
      </button>
    </div>
  )
}

function CartFooter() {
  return (
    <footer className="mt-auto hidden w-full flex-col items-center border-t border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] bg-[var(--color-surface-container)] px-[var(--space-margin-desktop)] py-16 md:flex">
      <div className="text-display-lg mb-8 text-[48px] leading-none text-[var(--color-primary)] italic">ALICANTE ORIGIN</div>
      <nav className="mb-12 flex gap-8" aria-label="Enlaces de pie de página">
        {['The Producers', 'Shipping', 'Terms of Service', 'Provenance Guide'].map((item) => (
          <a key={item} href="#" className="text-body-md text-[var(--color-on-secondary-fixed-variant)] transition-colors hover:text-[var(--color-primary)]">
            {item}
          </a>
        ))}
      </nav>
      <p className="text-body-md text-[var(--color-on-secondary-fixed-variant)]">© 2024 Alicante Origin. Artisanal Heritage & Provenance.</p>
    </footer>
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
