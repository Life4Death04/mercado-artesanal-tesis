import { Check } from 'lucide-react'
import type { RegistrationStep, WizardStepMeta } from './registrationWizard.types'

type RegistrationStepperProps = {
  steps: WizardStepMeta[]
  currentStep: RegistrationStep
  compact?: boolean
}

export function RegistrationStepper({ steps, currentStep, compact = false }: RegistrationStepperProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep)

  if (compact) {
    return (
      <nav aria-label="Progreso de registro" className="w-full">
        <ol className="flex w-full items-start justify-between" role="list">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex
            const isActive = index === currentIndex

            return (
              <li key={step.id} className="relative flex-1">
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-4 h-px w-full bg-[var(--color-outline-variant)]" />
                )}
                <div className="relative flex flex-col items-center">
                  <span
                    className={[
                      'grid size-8 place-items-center rounded-[var(--radius-full)] ring-4 ring-[var(--color-background)]',
                      isCompleted && 'bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)]',
                      isActive && 'bg-[var(--color-primary-container)] text-[var(--color-surface)]',
                      !isCompleted && !isActive && 'border border-[var(--color-outline-variant)] bg-[var(--color-background)] text-[var(--color-outline-variant)]',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {isCompleted ? <Check size={16} /> : <span className="text-label-sm">{index + 1}</span>}
                  </span>
                  <p
                    className={[
                      'text-label-sm mt-3 uppercase tracking-widest',
                      isActive ? 'text-[var(--color-primary-container)]' : 'text-[var(--color-outline)]',
                    ].join(' ')}
                  >
                    {step.label}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </nav>
    )
  }

  return (
    <nav aria-label="Progreso de registro" className="hidden items-center gap-8 md:flex">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex
        const isActive = index === currentIndex

        return (
          <div key={step.id} className="flex items-center gap-8">
            <div
              className={[
                'text-label-md flex items-center gap-2 pb-1 uppercase tracking-widest',
                isActive && 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]',
                isCompleted && 'text-[var(--color-on-surface-variant)] opacity-60',
                !isCompleted && !isActive && 'text-[var(--color-on-surface-variant)] opacity-50',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {isCompleted && <Check size={18} />}
              {!isCompleted && index > 0 && <span>{index + 1}</span>}
              <span>{step.label}</span>
            </div>
            {index < steps.length - 1 && <div className="h-px w-10 bg-[var(--color-outline-variant)]/50" />}
          </div>
        )
      })}
    </nav>
  )
}
