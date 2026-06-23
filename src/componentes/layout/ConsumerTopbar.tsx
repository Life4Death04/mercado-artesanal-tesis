import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Menu, ShoppingCart, UserCircle } from 'lucide-react'
import { BandejaNotificaciones } from '../ui/BandejaNotificaciones'

type ConsumerTopbarProps = {
  onMenuClick: () => void
}

type Breadcrumb = {
  label: string
  to?: string
}

const routeMeta = [
  {
    match: (pathname: string) => pathname === '/productos',
    title: 'Catálogo',
    breadcrumbs: [{ label: 'Área consumidor' }, { label: 'Catálogo' }],
  },
  {
    match: (pathname: string) => pathname.startsWith('/productos/'),
    title: 'Detalle de producto',
    breadcrumbs: [
      { label: 'Área consumidor' },
      { label: 'Catálogo', to: '/productos' },
      { label: 'Detalle' },
    ],
  },
  {
    match: (pathname: string) => pathname === '/carrito',
    title: 'Carrito',
    breadcrumbs: [{ label: 'Área consumidor' }, { label: 'Carrito' }],
  },
  {
    match: (pathname: string) => pathname === '/checkout',
    title: 'Checkout',
    breadcrumbs: [
      { label: 'Área consumidor' },
      { label: 'Carrito', to: '/carrito' },
      { label: 'Checkout' },
    ],
  },
  {
    match: (pathname: string) => pathname === '/pedidos',
    title: 'Mis pedidos',
    breadcrumbs: [{ label: 'Área consumidor' }, { label: 'Mis pedidos' }],
  },
  {
    match: (pathname: string) => pathname === '/perfil',
    title: 'Mi perfil',
    breadcrumbs: [{ label: 'Área consumidor' }, { label: 'Mi perfil' }],
  },
  {
    match: (pathname: string) => pathname === '/incidencias',
    title: 'Mis incidencias',
    breadcrumbs: [{ label: 'Área consumidor' }, { label: 'Mis incidencias' }],
  },
]

export function ConsumerTopbar({ onMenuClick }: ConsumerTopbarProps) {
  const location = useLocation()
  const meta = routeMeta.find((item) => item.match(location.pathname)) ?? routeMeta[0]

  return (
    <header className="sticky top-0 z-40 border-b border-[color-mix(in_srgb,var(--color-outline-variant)_55%,transparent)] bg-[var(--color-background)]/92 backdrop-blur-xl">
      <div className="flex min-h-20 items-center gap-4 px-[var(--space-margin-mobile)] py-3 md:px-8 xl:px-10">
        <button
          type="button"
          aria-label="Abrir navegación"
          onClick={onMenuClick}
          className="grid size-11 shrink-0 place-items-center rounded-full border border-[var(--color-outline-variant)] bg-[var(--color-surface)] text-[var(--color-secondary)] shadow-sm md:hidden"
        >
          <Menu size={22} strokeWidth={1.8} />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="text-headline-md truncate text-[var(--color-on-surface)] md:text-[28px]">
            {meta.title}
          </h1>
          <Breadcrumbs items={meta.breadcrumbs} />
        </div>

        {/* <label className="relative hidden w-full max-w-sm items-center lg:flex xl:max-w-md">
          <span className="sr-only">Buscar productos</span>
          <Search size={18} strokeWidth={1.8} className="absolute left-3 text-[var(--color-outline)]" />
          <input
            type="search"
            placeholder="Buscar productos artesanos..."
            className="text-label-sm w-full border-0 border-b border-[var(--color-outline)] bg-transparent py-2 pr-4 pl-10 text-[var(--color-on-surface)] transition-colors placeholder:text-[var(--color-secondary)] focus:border-[var(--color-primary)] focus:outline-none"
          />
        </label>*/}

        <div className="flex shrink-0 items-center gap-2 text-[var(--color-primary)] sm:gap-3">
          <BandejaNotificaciones />
          <Link
            to="/carrito"
            aria-label="Carrito"
            className="relative rounded-full p-2 text-[var(--color-on-surface-variant)] transition-all duration-150 hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-primary)] active:scale-95"
          >
            <ShoppingCart size={22} strokeWidth={1.8} />
            <span className="absolute top-1 right-1 grid size-4 place-items-center rounded-full bg-[var(--color-primary)] text-[10px] font-bold text-[var(--color-on-primary)] ring-2 ring-[var(--color-surface)]">
              2
            </span>
          </Link>
          <Link
            to="/perfil"
            aria-label="Mi perfil"
            className="rounded-full p-2 text-[var(--color-on-surface-variant)] transition-all duration-150 hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-primary)] active:scale-95"
          >
            <UserCircle size={23} strokeWidth={1.8} />
          </Link>
        </div>
      </div>
    </header>
  )
}

function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-1 hidden sm:block">
      <ol className="text-label-sm flex min-w-0 items-center gap-2 text-[var(--color-secondary)]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-2">
              {item.to && !isLast ? (
                <Link to={item.to} className="truncate transition-colors hover:text-[var(--color-primary)]">
                  {item.label}
                </Link>
              ) : (
                <span className={`truncate ${isLast ? 'text-[var(--color-on-surface)]' : ''}`}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight size={14} strokeWidth={1.8} className="shrink-0" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
