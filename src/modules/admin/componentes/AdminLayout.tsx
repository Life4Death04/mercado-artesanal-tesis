import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Bell, Menu } from 'lucide-react'
import { RoleSidebar } from '../../../componentes/layout/RoleSidebar'

const adminAvatarUrl =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD7CmrKbfpQ5OqunUkFWzvoDFntD-os9E8Kz_jUDtc-RuCxANObjxTmrBIFfshYI0kMDgtqRZUxI1UG18Yk1_MzRntvIMUgkkYYNi1PZkbyzVvYtW_Rf6x-Ts-cbRzaOYYLG-QEnvurR6tMMByTWQTVQAoD_JzcmiYoFGoM5KKTJbVHyeWuSFbS7uML5rCRGL8VTl1raxNcuubvmuPsu6oUyJppAj5vAbqEMN_8RFwN2WDVkYS3mbHm9oNxWhl37H_ZEbxjR4M-Uz4Y'

export function AdminLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="font-interface min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <header className="fixed top-0 right-0 z-40 flex h-16 w-full items-center justify-between gap-6 border-b border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-background)] px-4 md:w-[calc(100%-16rem)] md:justify-end md:px-8">
        <button
          type="button"
          aria-label="Abrir navegación administrativa"
          onClick={() => setMobileSidebarOpen(true)}
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

      <RoleSidebar
        variant="admin"
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main className="pt-24 pb-20 md:ml-64 md:px-[var(--space-margin-desktop)]">
        <Outlet />
      </main>
    </div>
  )
}
