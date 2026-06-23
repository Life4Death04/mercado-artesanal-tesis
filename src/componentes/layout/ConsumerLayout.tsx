import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { RoleSidebar } from './RoleSidebar'

export function ConsumerLayout() {
  const [sidebarOwner] = useState(() => window.localStorage.getItem('sidebar-owner'))
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const isProducerBrowsingStore = sidebarOwner === 'producer'

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <button
        type="button"
        aria-label="Abrir navegación"
        onClick={() => setMobileSidebarOpen(true)}
        className="fixed left-4 top-4 z-40 grid size-11 place-items-center rounded-full border border-[var(--color-outline-variant)] bg-[var(--color-background)] text-[var(--color-secondary)] shadow-sm md:hidden"
      >
        <Menu size={22} strokeWidth={1.8} />
      </button>
      <RoleSidebar
        variant={isProducerBrowsingStore ? 'producer' : 'consumer'}
        producerConsumerMode={isProducerBrowsingStore}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <main className="md:ml-64">
        <Outlet />
      </main>
    </div>
  )
}
