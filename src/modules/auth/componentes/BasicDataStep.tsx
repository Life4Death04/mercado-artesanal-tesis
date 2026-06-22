import { BadgeCheck, Check } from 'lucide-react'
import { EditorialTextField } from './EditorialField'
import type { RegistrationWizardData } from './registrationWizard.types'

type BasicDataStepProps = {
  data: RegistrationWizardData
  onChange: (updates: Partial<RegistrationWizardData>) => void
}

export function BasicDataStep({ data, onChange }: BasicDataStepProps) {
  return (
    <main className="flex flex-1 items-center justify-center px-[var(--space-margin-mobile)] py-16 md:px-[var(--space-margin-desktop)]">
      <section className="w-full max-w-2xl rounded-[var(--radius-xl)] border border-[color-mix(in_srgb,var(--color-outline-variant)_20%,transparent)] bg-[var(--color-surface-container-lowest)] p-8 shadow-[var(--shadow-editorial)] md:p-16">
        <div className="mb-12 text-center">
          <h2 className="text-headline-lg mb-4 text-[var(--color-on-surface)]">Tus datos</h2>
          <p className="text-body-md text-[var(--color-on-surface-variant)]">
            Por favor, confirma tu información básica para continuar.
          </p>
        </div>
        <form className="flex flex-col gap-8">
          <EditorialTextField
            id="nombre"
            name="nombre"
            label="Nombre"
            value={data.name}
            onChange={(event) => onChange({ name: event.target.value })}
          />
          <EditorialTextField
            id="email"
            name="email"
            label="Correo electrónico"
            type="email"
            value={data.email}
            disabled
            trailing={
              <span className="text-label-sm flex items-center gap-1 text-[var(--color-secondary)]">
                <BadgeCheck size={18} />
                <span className="hidden sm:inline">Verificado</span>
              </span>
            }
          />
          <label className="flex cursor-pointer items-start gap-4 pt-6">
            <span className="relative mt-0.5 grid size-6 place-items-center">
              <input
                type="checkbox"
                checked={data.consentAccepted}
                onChange={(event) => onChange({ consentAccepted: event.target.checked })}
                className="peer size-5 appearance-none rounded-[var(--radius-sm)] border border-[var(--color-outline-variant)] transition checked:border-[var(--color-primary)] checked:bg-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_20%,transparent)]"
              />
              <Check className="pointer-events-none absolute text-[var(--color-on-primary)] opacity-0 transition peer-checked:opacity-100" size={15} />
            </span>
            <span className="text-body-md text-[var(--color-on-surface-variant)]">
              He leído y acepto la{' '}
              <a className="text-[var(--color-primary-container)] underline underline-offset-4" href="#">
                política de privacidad
              </a>{' '}
              y los{' '}
              <a className="text-[var(--color-primary-container)] underline underline-offset-4" href="#">
                términos y condiciones
              </a>
              .
            </span>
          </label>
        </form>
      </section>
    </main>
  )
}
