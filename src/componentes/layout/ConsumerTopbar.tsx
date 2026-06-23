import { Link, useLocation } from 'react-router-dom'
import { Menu, ShoppingCart, UserCircle } from 'lucide-react'
import { BandejaNotificaciones } from '../ui/BandejaNotificaciones'

type ConsumerTopbarProps = {
  onMenuClick: () => void
}

const routeMeta = [
  {
    match: (pathname: string) => pathname === '/productos',
    title: 'Catálogo',
  },
  {
    match: (pathname: string) => pathname.startsWith('/productos/'),
    title: 'Detalle de producto',
  },
  {
    match: (pathname: string) => pathname === '/carrito',
    title: 'Carrito',
  },
  {
    match: (pathname: string) => pathname === '/checkout',
    title: 'Checkout',
  },
  {
    match: (pathname: string) => pathname === '/pedidos',
    title: 'Mis pedidos',
  },
  {
    match: (pathname: string) => pathname === '/perfil',
    title: 'Mi perfil',
  },
  {
    match: (pathname: string) => pathname === '/incidencias',
    title: 'Mis incidencias',
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
          <span className="text-headline-md block truncate text-[var(--color-on-surface)] md:text-[28px]">
            {meta.title}
          </span>
        </div>

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
