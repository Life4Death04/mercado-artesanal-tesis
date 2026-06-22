import type { ReactNode } from 'react'
import { ArrowLeft, X, UtensilsCrossed, Sparkle } from 'lucide-react'

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
        <header className="flex w-full justify-center py-8">
          <h1 className="text-display-lg text-[var(--color-primary)]">Alacant Artisà</h1>
        </header>
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
            <span className="text-headline-md text-[var(--color-on-background)]">Gourmet Editorial</span>
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
      <header className="border-b border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] bg-[var(--color-surface)]">
        <div className="mx-auto flex w-full max-w-[var(--layout-container-max)] items-center justify-between px-[var(--space-margin-mobile)] py-6 md:px-[var(--space-margin-desktop)]">
          <div className="flex items-center gap-3">
            <Sparkle className="hidden text-[var(--color-primary-container)] sm:block" size={24} fill="currentColor" />
            <h1 className="text-display-lg text-[var(--color-primary)]">Gourmet Artisanal</h1>
          </div>
          <button
            type="button"
            onClick={onExit}
            className="text-label-md flex items-center gap-2 text-[var(--color-outline)] transition-colors hover:text-[var(--color-on-surface)]"
          >
            <X size={16} />
            <span className="hidden md:inline">Salir</span>
          </button>
        </div>
      </header>
      {children}
    </div>
  )
}
