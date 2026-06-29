import { NavLink, useLocation } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import {
  AlertTriangle,
  BarChart2,
  BarChart3,
  BookOpen,
  ExternalLink,
  Gavel,
  LayoutDashboard,
  LogOut,
  Package,
  ReceiptText,
  Shapes,
  ShoppingBag,
  ShoppingCart,
  Store,
  Truck,
  User,
  Users,
} from 'lucide-react'
import { APP_NAME } from '../../lib/branding'

type SidebarVariant = 'admin' | 'consumer' | 'producer'

type SidebarItem = {
  label: string
  to: string
  icon: LucideIcon
  end?: boolean
}

const adminItems: SidebarItem[] = [
  { label: 'Inicio', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Usuarios', to: '/admin/usuarios', icon: Users },
  { label: 'Moderación', to: '/admin/moderacion', icon: Gavel },
  { label: 'Incidencias', to: '/admin/incidencias', icon: AlertTriangle },
  { label: 'Categorías', to: '/admin/categorias', icon: Shapes },
  { label: 'Métricas globales', to: '/admin/metricas-globales', icon: BarChart3 },
]

const consumerItems: SidebarItem[] = [
  { label: 'Catálogo', to: '/productos', icon: Store },
  { label: 'Carrito', to: '/carrito', icon: ShoppingCart },
  { label: 'Mis pedidos', to: '/pedidos', icon: ReceiptText },
  { label: 'Mi perfil', to: '/perfil', icon: User },
  { label: 'Incidencias', to: '/incidencias', icon: AlertTriangle },
]

const producerItems: SidebarItem[] = [
  { label: 'Mis pedidos', to: '/productor/pedidos', icon: ShoppingBag, end: true },
  { label: 'Mi catálogo', to: '/productor/productos', icon: BookOpen },
  { label: 'Inventario', to: '/productor/inventario', icon: Package },
  { label: 'Estadísticas', to: '/productor/estadisticas', icon: BarChart2 },
  { label: 'Configuración de entregas', to: '/productor/entregas', icon: Truck },
  { label: 'Mi perfil', to: '/productor/perfil', icon: User },
]

type RoleSidebarProps = {
  variant: SidebarVariant
  /** Permite que el productor vea navegación de consumidor sin perder el botón de retorno. */
  producerConsumerMode?: boolean
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function RoleSidebar({
  variant,
  producerConsumerMode = false,
  mobileOpen = false,
  onMobileClose,
}: RoleSidebarProps) {
  const location = useLocation()
  const isProducerArea = variant === 'producer' && location.pathname.startsWith('/productor') && !producerConsumerMode
  const isProducerAsConsumer = variant === 'producer' && !isProducerArea
  const useProducerTheme = isProducerArea

  const items = variant === 'admin'
    ? adminItems
    : isProducerArea
      ? producerItems
      : consumerItems

  const subtitle = variant === 'admin'
    ? 'Admin Dashboard'
    : isProducerArea
      ? 'Área de productor'
      : isProducerAsConsumer
        ? 'Área consumidor · Productor'
        : 'Área consumidor'

  const shellClassName = useProducerTheme
    ? 'border-r border-white/12 bg-[var(--color-primary-container)] text-[var(--color-on-primary)]'
    : 'border-r border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-background)] text-[var(--color-on-surface)]'
  const brandClassName = useProducerTheme
    ? 'text-[var(--color-on-primary)]'
    : 'text-[var(--color-primary-container)]'
  const subtitleClassName = useProducerTheme
    ? 'text-[color-mix(in_srgb,var(--color-on-primary)_78%,transparent)]'
    : 'text-[var(--color-secondary)]'
  const navBaseClassName = useProducerTheme
    ? 'text-[color-mix(in_srgb,var(--color-on-primary)_82%,transparent)] hover:bg-white/10 hover:text-[var(--color-on-primary)]'
    : 'text-[var(--color-secondary)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-on-surface)]'
  const navActiveClassName = useProducerTheme
    ? 'scale-[0.98] bg-white/14 font-bold text-[var(--color-on-primary)]'
    : 'scale-[0.98] bg-[var(--color-surface-container-low)] font-bold text-[var(--color-primary-container)]'

  const content = (
    <>
      <div className="mb-12">
        <h1 className={`font-editorial text-headline-md tracking-tight ${brandClassName}`}>
          {APP_NAME}
        </h1>
        <p className={`text-label-sm mt-1 uppercase tracking-wider ${subtitleClassName}`}>
          {subtitle}
        </p>
      </div>

      <nav className="flex flex-grow flex-col gap-2" aria-label="Navegación principal">
        {items.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={`${label}-${to}`}
            to={to}
            end={end}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `text-label-md flex items-center gap-4 rounded-[var(--radius-lg)] px-4 py-3 transition-colors ${
                isActive ? navActiveClassName : navBaseClassName
               }`
            }
          >
            <Icon size={22} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <SidebarFooter
        variant={variant}
        isProducerArea={isProducerArea}
        isProducerAsConsumer={isProducerAsConsumer}
        onMobileClose={onMobileClose}
      />
    </>
  )

  return (
    <>
      <aside className={`fixed top-0 left-0 z-50 hidden h-full w-64 flex-col overflow-y-auto p-6 md:flex ${shellClassName}`}>
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[90] md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Cerrar navegación"
            onClick={onMobileClose}
            className="absolute inset-0 bg-[var(--color-inverse-surface)]/40 backdrop-blur-sm"
          />
          <aside className={`relative z-10 flex h-full w-[min(82vw,18rem)] flex-col overflow-y-auto p-6 shadow-2xl ${shellClassName}`}>
            {content}
          </aside>
        </div>
      )}
    </>
  )
}

function SidebarFooter({
  variant,
  isProducerArea,
  isProducerAsConsumer,
  onMobileClose,
}: {
  variant: SidebarVariant
  isProducerArea: boolean
  isProducerAsConsumer: boolean
  onMobileClose?: () => void
}) {

  if (variant === 'producer') {
    return (
      <div className={`mt-auto flex flex-col gap-4 pt-6 ${isProducerArea ? 'border-t border-white/12' : 'border-t border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)]'}`}>
        {isProducerArea ? (
          <NavLink
            to="/productos"
            onClick={() => {
              window.localStorage.setItem('sidebar-owner', 'producer')
              onMobileClose?.()
            }}
            className="text-label-md flex w-full items-center justify-center gap-2 border border-white/75 bg-white px-4 py-3 text-[var(--color-on-surface)] transition-colors hover:border-white hover:bg-[var(--color-surface-container-low)]"
          >
            <span className="text-[var(--color-on-surface)]">Ver tienda</span>
            <ExternalLink className="text-[var(--color-on-surface)]" size={16} strokeWidth={1.8} />
          </NavLink>
        ) : (
          <NavLink
            to="/productor/pedidos"
            onClick={() => {
              window.localStorage.setItem('sidebar-owner', 'producer')
              onMobileClose?.()
            }}
            className="text-label-md flex w-full items-center justify-center gap-2 border border-[var(--color-primary-container)] bg-[var(--color-primary-container)] px-4 py-3 text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)]"
          >
            <span className="text-[var(--color-on-primary)]">Volver al panel productor</span>
            <ExternalLink className="text-[var(--color-on-primary)]" size={16} strokeWidth={1.8} />
          </NavLink>
        )}
        {isProducerAsConsumer && (
          <p className="text-label-sm text-center text-[var(--color-secondary)]">
            Navegando como consumidor
          </p>
        )}
        <LogoutLink onMobileClose={onMobileClose} useProducerTheme={isProducerArea} />
      </div>
    )
  }

  return (
    <div className="mt-auto border-t border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] pt-6">
      <LogoutLink onMobileClose={onMobileClose} />
    </div>
  )
}

function LogoutLink({
  onMobileClose,
  useProducerTheme = false,
}: {
  onMobileClose?: () => void
  useProducerTheme?: boolean
}) {
  return (
    <NavLink
      to="/login"
      onClick={onMobileClose}
      className={`text-label-md flex items-center gap-4 rounded-[var(--radius-lg)] px-4 py-3 transition-colors ${
        useProducerTheme
          ? 'text-[color-mix(in_srgb,var(--color-on-primary)_82%,transparent)] hover:bg-white/10 hover:text-[var(--color-on-primary)]'
          : 'text-[var(--color-secondary)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-on-surface)]'
      }`}
    >
      <LogOut size={21} strokeWidth={1.8} />
      <span>Cerrar sesión</span>
    </NavLink>
  )
}
