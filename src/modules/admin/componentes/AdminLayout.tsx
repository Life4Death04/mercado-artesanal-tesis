import { NavLink, Outlet } from 'react-router-dom'
import {
  AlertTriangle,
  BarChart3,
  Bell,
  ExternalLink,
  Gavel,
  LayoutDashboard,
  LogOut,
  Menu,
  Shapes,
  Users,
} from 'lucide-react'
import { APP_NAME } from '../../../lib/branding'

const adminAvatarUrl =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD7CmrKbfpQ5OqunUkFWzvoDFntD-os9E8Kz_jUDtc-RuCxANObjxTmrBIFfshYI0kMDgtqRZUxI1UG18Yk1_MzRntvIMUgkkYYNi1PZkbyzVvYtW_Rf6x-Ts-cbRzaOYYLG-QEnvurR6tMMByTWQTVQAoD_JzcmiYoFGoM5KKTJbVHyeWuSFbS7uML5rCRGL8VTl1raxNcuubvmuPsu6oUyJppAj5vAbqEMN_8RFwN2WDVkYS3mbHm9oNxWhl37H_ZEbxjR4M-Uz4Y'

const navItems = [
  { label: 'Inicio', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Usuarios', to: '/admin/usuarios', icon: Users },
  { label: 'Moderación', to: '/admin/moderacion', icon: Gavel },
  { label: 'Incidencias', to: '/admin/incidencias', icon: AlertTriangle },
  { label: 'Categorías', to: '/admin/categorias', icon: Shapes },
  { label: 'Métricas globales', to: '/admin/metricas-globales', icon: BarChart3 },
]

export function AdminLayout() {
  return (
    <div className="font-interface min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <header className="fixed top-0 right-0 z-40 flex h-16 w-full items-center justify-between gap-6 border-b border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-background)] px-4 md:w-[calc(100%-16rem)] md:justify-end md:px-8">
        <button
          type="button"
          aria-label="Abrir navegación administrativa"
          className="text-[var(--color-secondary)] md:hidden"
        >
          <Menu size={24} strokeWidth={1.8} />
        </button>
        <div className="md:hidden">
          <p className="font-editorial text-headline-md text-[var(--color-primary-container)]">AA</p>
        </div>
        <div className="flex items-center gap-6">
          <button
            type="button"
            aria-label="Notificaciones"
            className="relative text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary-container)]"
          >
            <Bell size={22} strokeWidth={1.8} />
            <span className="absolute -top-2 -right-2 grid size-5 place-items-center rounded-full bg-[var(--color-primary-container)] text-[10px] font-bold text-[var(--color-on-primary)]">
              3
            </span>
          </button>
          <button type="button" aria-label="Perfil administrador" className="transition-opacity hover:opacity-80">
            <img
              src={adminAvatarUrl}
              alt="Perfil del administrador"
              className="size-8 rounded-full border border-[color-mix(in_srgb,var(--color-outline)_35%,transparent)] object-cover"
            />
          </button>
        </div>
      </header>

      <aside className="fixed top-0 left-0 z-50 hidden h-full w-64 flex-col overflow-y-auto border-r border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-background)] p-6 md:flex">
        <div className="mb-12">
          <h1 className="font-editorial text-headline-md text-[var(--color-primary-container)] tracking-tight">
            {APP_NAME}
          </h1>
          <p className="text-label-sm mt-1 uppercase tracking-wider text-[var(--color-secondary)]">
            Admin Dashboard
          </p>
        </div>

        <nav className="flex flex-grow flex-col gap-2" aria-label="Navegación del administrador">
          {navItems.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `text-label-md flex items-center gap-4 rounded-[var(--radius-lg)] px-4 py-3 transition-colors ${
                  isActive
                    ? 'scale-[0.98] bg-[var(--color-surface-container-low)] font-bold text-[var(--color-primary-container)]'
                    : 'text-[var(--color-secondary)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-on-surface)]'
                }`
              }
            >
              <Icon size={22} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-4 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] pt-6">
          <a
            href="/"
            className="text-label-md flex w-full items-center justify-center gap-2 border border-[color-mix(in_srgb,var(--color-on-surface)_15%,transparent)] px-4 py-3 text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-on-surface)] hover:text-[var(--color-surface)]"
          >
            Ver tienda
            <ExternalLink size={16} strokeWidth={1.8} />
          </a>
          <a
            href="/login"
            className="text-label-md flex items-center gap-4 rounded-[var(--radius-lg)] px-4 py-3 text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-on-surface)]"
          >
            <LogOut size={21} strokeWidth={1.8} />
            <span>Cerrar sesión</span>
          </a>
        </div>
      </aside>

      <main className="pt-24 pb-20 md:ml-64 md:px-[var(--space-margin-desktop)]">
        <Outlet />
      </main>
    </div>
  )
}
