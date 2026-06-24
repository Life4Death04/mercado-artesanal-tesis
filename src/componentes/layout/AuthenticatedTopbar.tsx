import { Link, useLocation } from 'react-router-dom'
import { Bell, ChevronRight, Menu, ShoppingCart, UserCircle } from 'lucide-react'
import { BandejaNotificaciones } from '../ui/BandejaNotificaciones'

type AuthenticatedTopbarProps = {
  onMenuClick: () => void
}

type RouteMeta = {
  match: (pathname: string) => boolean
  title: string
  breadcrumb: string
}

const consumerRouteMeta: RouteMeta[] = [
  { match: (pathname) => pathname === '/productos', title: 'Catálogo', breadcrumb: 'Catálogo' },
  { match: (pathname) => pathname.startsWith('/productos/'), title: 'Detalle de producto', breadcrumb: 'Detalle de producto' },
  { match: (pathname) => pathname === '/carrito', title: 'Carrito', breadcrumb: 'Carrito' },
  { match: (pathname) => pathname === '/checkout', title: 'Checkout', breadcrumb: 'Checkout' },
  { match: (pathname) => pathname === '/pedidos', title: 'Mis pedidos', breadcrumb: 'Mis pedidos' },
  { match: (pathname) => pathname === '/perfil', title: 'Mi perfil', breadcrumb: 'Mi perfil' },
  { match: (pathname) => pathname === '/incidencias', title: 'Mis incidencias', breadcrumb: 'Mis incidencias' },
]

const producerRouteMeta: RouteMeta[] = [
  { match: (pathname) => pathname === '/productor', title: 'Panel', breadcrumb: 'Panel' },
  { match: (pathname) => pathname === '/productor/pedidos', title: 'Mis pedidos', breadcrumb: 'Mis pedidos' },
  { match: (pathname) => pathname === '/productor/productos', title: 'Mi catálogo', breadcrumb: 'Mi catálogo' },
  { match: (pathname) => pathname === '/productor/inventario', title: 'Inventario', breadcrumb: 'Inventario' },
  { match: (pathname) => pathname === '/productor/estadisticas', title: 'Mis estadísticas', breadcrumb: 'Estadísticas' },
  { match: (pathname) => pathname === '/productor/entregas', title: 'Configuración de entregas', breadcrumb: 'Entregas' },
  { match: (pathname) => pathname === '/productor/perfil', title: 'Mi perfil de ventas', breadcrumb: 'Mi perfil' },
]

export function AuthenticatedTopbar({ onMenuClick }: AuthenticatedTopbarProps) {
  const location = useLocation()
  const isProducerArea = location.pathname.startsWith('/productor')
  const routeMeta = isProducerArea ? producerRouteMeta : consumerRouteMeta
  const meta = routeMeta.find((item) => item.match(location.pathname)) ?? routeMeta[0]
  const areaLabel = isProducerArea ? 'Área Productor' : 'Área consumidor'

  return (
    <header className="fixed top-0 right-0 z-40 flex h-20 w-full items-center gap-4 border-b border-[color-mix(in_srgb,var(--color-outline-variant)_55%,transparent)] bg-[var(--color-background)]/92 px-[var(--space-margin-mobile)] backdrop-blur-xl md:left-64 md:w-[calc(100%-16rem)] md:px-8">
      <button
        type="button"
        aria-label="Abrir navegación"
        onClick={onMenuClick}
        className="grid size-11 shrink-0 place-items-center rounded-full border border-[var(--color-outline-variant)] bg-[var(--color-surface)] text-[var(--color-secondary)] shadow-sm md:hidden"
      >
        <Menu size={22} strokeWidth={1.8} />
      </button>

      <nav aria-label="Breadcrumb" className="flex min-w-0 flex-1 items-center gap-1.5 min-[771px]:hidden">
        <Link to={isProducerArea ? '/productor' : '/productos'} className="text-label-sm shrink-0 text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary)]">
          {areaLabel}
        </Link>
        <ChevronRight size={13} strokeWidth={1.8} className="shrink-0 text-[var(--color-outline-variant)]" />
        <span className="text-label-sm truncate text-[var(--color-on-surface-variant)]">{meta.breadcrumb}</span>
      </nav>

      <div className="hidden min-w-0 flex-1 items-baseline gap-3 min-[771px]:flex">
        <Link to={isProducerArea ? '/productor' : '/productos'} className="text-label-sm shrink-0 text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary)]">
          {areaLabel}
        </Link>
        <ChevronRight size={14} strokeWidth={1.8} className="shrink-0 text-[var(--color-outline-variant)]" />
        <span className="text-headline-md truncate text-[var(--color-on-surface)] md:text-[28px]">{meta.title}</span>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {isProducerArea ? (
          <button
            type="button"
            aria-label="Notificaciones"
            className="relative rounded-full p-2 text-[var(--color-on-surface-variant)] transition-all duration-150 hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-primary)] active:scale-95"
          >
            <Bell size={22} strokeWidth={1.8} />
            <span className="absolute top-1 right-1 grid size-4 place-items-center rounded-full bg-[var(--color-primary)] text-[10px] font-bold text-[var(--color-on-primary)] ring-2 ring-[var(--color-surface)]">
              2
            </span>
          </button>
        ) : (
          <>
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
          </>
        )}
        <Link
          to={isProducerArea ? '/productor/perfil' : '/perfil'}
          aria-label={isProducerArea ? 'Mi perfil de ventas' : 'Mi perfil'}
          className="rounded-full p-2 text-[var(--color-on-surface-variant)] transition-all duration-150 hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-primary)] active:scale-95"
        >
          <UserCircle size={23} strokeWidth={1.8} />
        </Link>
      </div>
    </header>
  )
}
