import type { ReactNode } from 'react'
import { PublicTopbar } from '../../../componentes/layout/PublicTopbar'
import { ConsumerFooter } from '../../../componentes/layout/ConsumerFooter'

type AuthPageShellProps = {
  children: ReactNode
}

export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <div className="font-interface flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-on-background)]">
      <PublicTopbar />

      <main className="flex flex-1 items-center justify-center px-[var(--space-margin-mobile)] py-12 md:py-20">
        {children}
      </main>

      <ConsumerFooter />
    </div>
  )
}
