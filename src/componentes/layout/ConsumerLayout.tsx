import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AuthenticatedTopbar } from './AuthenticatedTopbar'
import { ConsumerFooter } from './ConsumerFooter'
import { RoleSidebar } from './RoleSidebar'
import { useCurrentUser } from '../../modules/auth/hooks/useCurrentUser'

export function ConsumerLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const currentUserQuery = useCurrentUser()
  const isProducerBrowsingStore = currentUserQuery.data?.role === 'PRODUCER'

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <RoleSidebar
        variant={isProducerBrowsingStore ? 'producer' : 'consumer'}
        producerConsumerMode={isProducerBrowsingStore}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <div className="flex min-h-screen flex-col pt-20 md:ml-64">
        <AuthenticatedTopbar onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1">
          <Outlet />
        </main>
        <ConsumerFooter />
      </div>
    </div>
  )
}
