import type { ReactNode } from 'react'
import { ArrowLeft, LogOut, UtensilsCrossed } from 'lucide-react'
import { PublicTopbar } from '../../../componentes/layout/PublicTopbar'
import { APP_NAME } from '../../../lib/branding'
import { ConsumerFooter } from '../../../componentes/layout/ConsumerFooter'

type RegistrationWizardShellProps = {
  children: ReactNode
  variant?: 'full' | 'minimal' | 'success'
  onExit?: () => void
  onBack?: () => void
}

export function RegistrationWizardShell({
  children,
  variant = 'full',
  onExit,
  onBack,
}: RegistrationWizardShellProps) {
  if (variant === 'success') {
    return (
      <div className="font-interface flex min-h-screen flex-col bg-[var(--color-surface)] text-[var(--color-on-surface)]">
        <PublicTopbar />
        {children}
      </div>
    )
  }

  if (variant === 'minimal') {
    return (
      <div className="font-interface flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-on-background)]">
        <header className="flex w-full items-center justify-between border-b border-[var(--color-outline-variant)] px-[var(--space-margin-mobile)] py-6 md:px-[var(--space-margin-desktop)]">
          <div className="flex items-center gap-3">
            <UtensilsCrossed size={28} />
            <span className="text-headline-md text-[var(--color-on-background)]">{APP_NAME}</span>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-label-md flex items-center gap-2 uppercase text-[var(--color-outline)] transition-colors hover:text-[var(--color-on-background)]"
          >
            <ArrowLeft size={18} />
            Volver
          </button>
        </header>
        {children}
      </div>
    )
  }

  return (
    <div className="font-interface flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-on-background)]">
      <PublicTopbar />
      {onExit ? (
        <div className="mx-auto flex w-full max-w-[var(--layout-container-max)] justify-end px-[var(--space-margin-mobile)] pt-4 md:px-[var(--space-margin-desktop)]">
          <button
            type="button"
            onClick={onExit}
            className="text-label-md inline-flex items-center gap-2 text-[var(--color-outline)] transition-colors hover:text-[var(--color-on-surface)]"
          >
            <LogOut size={16} strokeWidth={1.8} />
            Salir
          </button>
        </div>
      ) : null}
      {children}
      <ConsumerFooter />
    </div>
  )
}
