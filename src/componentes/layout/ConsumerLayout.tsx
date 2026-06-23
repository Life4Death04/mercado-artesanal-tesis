import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { ConsumerTopbar } from './ConsumerTopbar'
import { RoleSidebar } from './RoleSidebar'

export function ConsumerLayout() {
  const [sidebarOwner] = useState(() => window.localStorage.getItem('sidebar-owner'))
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const isProducerBrowsingStore = sidebarOwner === 'producer'

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <RoleSidebar
        variant={isProducerBrowsingStore ? 'producer' : 'consumer'}
        producerConsumerMode={isProducerBrowsingStore}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <div className="md:ml-64">
        <ConsumerTopbar onMenuClick={() => setMobileSidebarOpen(true)} />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
