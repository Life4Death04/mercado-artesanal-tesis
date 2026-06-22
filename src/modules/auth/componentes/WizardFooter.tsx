import { ArrowRight } from 'lucide-react'

type WizardFooterProps = {
  currentLabel: string
  onBack: () => void
  onNext: () => void
  nextLabel?: string
  backLabel?: string
  showSaveAndExit?: boolean
  onSaveAndExit?: () => void
}

export function WizardFooter({
  currentLabel,
  onBack,
  onNext,
  nextLabel = 'Continuar',
  backLabel = 'Atrás',
  showSaveAndExit = false,
  onSaveAndExit,
}: WizardFooterProps) {
  return (
    <footer className="mt-auto w-full border-t border-[color-mix(in_srgb,var(--color-outline-variant)_70%,transparent)] bg-[var(--color-surface)] px-[var(--space-margin-mobile)] py-6 md:px-[var(--space-margin-desktop)] md:py-8">
      <div className="mx-auto flex max-w-[var(--layout-container-max)] flex-col items-center gap-6">
        <div className="flex w-full items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="text-label-md border border-[var(--color-on-surface)] px-8 py-3 text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-variant)] active:scale-95"
          >
            {backLabel}
          </button>
          <span className="text-label-sm hidden uppercase tracking-widest text-[var(--color-on-surface-variant)] md:block">
            {currentLabel}
          </span>
          <button
            type="button"
            onClick={onNext}
            className="text-label-md flex items-center gap-2 bg-[var(--color-primary-container)] px-8 py-3 text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary)] active:scale-95"
          >
            {nextLabel}
            {nextLabel === 'Continuar' && <ArrowRight size={16} />}
          </button>
        </div>
        {showSaveAndExit && (
          <button
            type="button"
            onClick={onSaveAndExit}
            className="text-label-sm text-[var(--color-outline)] underline underline-offset-4 transition-colors hover:text-[var(--color-on-background)]"
          >
            Guardar y salir
          </button>
        )}
      </div>
    </footer>
  )
}
