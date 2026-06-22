import { CheckCircle } from 'lucide-react'
import consumidorLogo from '../../../../ReferenciasUI/WizardRegistroUsuario (Consumidor y Productor)/LogoConsumidor.png'
import productorLogo from '../../../../ReferenciasUI/WizardRegistroUsuario (Consumidor y Productor)/LogoProductor.png'
import type { RegistrationRole } from './registrationWizard.types'

type ProfileTypeStepProps = {
  selectedRole: RegistrationRole
  onSelectRole: (role: RegistrationRole) => void
  email: string
}

const profileOptions = [
  {
    role: 'consumidor' as const,
    title: 'Consumidor',
    description: 'Descubrir y comprar productos artesanos de la provincia de Alicante.',
    image: consumidorLogo,
  },
  {
    role: 'productor' as const,
    title: 'Productor',
    description: 'Vender mis productos y dar a conocer mi historia a la comunidad.',
    image: productorLogo,
  },
]

export function ProfileTypeStep({ selectedRole, onSelectRole, email }: ProfileTypeStepProps) {
  return (
    <main className="mx-auto flex w-full max-w-[var(--layout-container-max)] flex-1 flex-col justify-center px-[var(--space-margin-mobile)] py-20 md:px-[var(--space-margin-desktop)]">
      <section className="mx-auto w-full max-w-4xl text-center md:text-left">
        <p className="text-label-sm mb-4 uppercase tracking-[0.2em] text-[var(--color-secondary)]">
          Conectado como: <span className="font-semibold">{email}</span>
        </p>
        <h2 className="text-display-lg mb-16 text-[var(--color-on-surface)]">
          ¿Cómo quieres usar la plataforma?
        </h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {profileOptions.map((option) => {
            const isSelected = option.role === selectedRole

            return (
              <button
                key={option.role}
                type="button"
                onClick={() => onSelectRole(option.role)}
                className={[
                  'group flex min-h-[390px] flex-col items-center border bg-[var(--color-surface-container-lowest)] p-12 text-center transition duration-500 hover:-translate-y-1 focus:outline-none',
                  isSelected
                    ? 'border-2 border-[var(--color-primary-container)] bg-[color-mix(in_srgb,var(--color-primary-container)_2%,var(--color-surface-container-lowest))]'
                    : 'border-[color-mix(in_srgb,var(--color-outline)_20%,transparent)]',
                ].join(' ')}
              >
                <span className="mb-8 grid size-24 place-items-center">
                  <img
                    src={option.image}
                    alt={`Icono ${option.title}`}
                    className="size-full object-contain grayscale transition duration-500 group-hover:grayscale-0"
                  />
                </span>
                <span className="text-headline-md mb-4 text-[var(--color-on-surface)]">{option.title}</span>
                <span className="text-body-md mx-auto max-w-xs text-[var(--color-on-surface-variant)]">
                  {option.description}
                </span>
                <span className="mt-8 text-[var(--color-primary)] opacity-0 transition-opacity group-hover:opacity-60 data-[selected=true]:opacity-100" data-selected={isSelected}>
                  <CheckCircle size={26} />
                </span>
              </button>
            )
          })}
        </div>
      </section>
    </main>
  )
}
