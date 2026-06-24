import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { RoleSidebar } from './RoleSidebar'
import { AuthenticatedTopbar } from './AuthenticatedTopbar'
import { ConsumerFooter } from './ConsumerFooter'

export function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <>
      <RoleSidebar
        variant="producer"
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <div className="flex min-h-screen flex-col pt-20 ">
      <AuthenticatedTopbar onMenuClick={() => setMobileSidebarOpen(true)} />
      <main>
      <Outlet />
      </main>
      <ConsumerFooter />
      </div>
    </>
  )
}
