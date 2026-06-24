import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { RoleSidebar } from './RoleSidebar'
import { AuthenticatedTopbar } from './AuthenticatedTopbar'
import { ConsumerFooter } from './ConsumerFooter'

export function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <RoleSidebar
        variant="producer"
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <div className="flex min-h-screen flex-col pt-20 md:pl-64">
        <AuthenticatedTopbar onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1">
          <Outlet />
        </main>
        <ConsumerFooter />
      </div>
    </div>
  )
}
