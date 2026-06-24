import { Check } from 'lucide-react'
import type { RegistrationStep, WizardStepMeta } from './registrationWizard.types'

type RegistrationStepperProps = {
  steps: WizardStepMeta[]
  currentStep: RegistrationStep
}

export function RegistrationStepper({ steps, currentStep }: RegistrationStepperProps) {
  const foundIndex = steps.findIndex((step) => step.id === currentStep)
  const currentIndex = foundIndex >= 0 ? foundIndex : steps.length - 1

  return (
    <nav aria-label="Progreso de registro" className="w-full">
      <ol className="flex w-full items-start justify-between gap-0 md:hidden" role="list">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex
          const isActive = index === currentIndex

          return (
            <li key={step.id} className="relative flex-1">
              {index < steps.length - 1 ? <div className="absolute top-4 left-1/2 h-px w-full bg-[var(--color-outline-variant)]" /> : null}
              <div className="relative flex flex-col items-center text-center">
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
                <p className={`text-label-sm mt-3 max-w-[72px] uppercase tracking-widest ${isActive ? 'text-[var(--color-primary-container)]' : 'text-[var(--color-outline)]'}`}>
                  {step.label}
                </p>
              </div>
            </li>
          )
        })}
      </ol>

      <ol className="hidden items-center justify-end gap-8 md:flex" role="list">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex
          const isActive = index === currentIndex

          return (
            <li key={step.id} className="flex items-center gap-8">
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
                {isCompleted ? <Check size={18} /> : null}
                {!isCompleted && index > 0 ? <span>{index + 1}</span> : "1"}
                <span>{step.label}</span>
              </div>
              {index < steps.length - 1 ? <div className="h-px w-10 bg-[var(--color-outline-variant)]/50" /> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
