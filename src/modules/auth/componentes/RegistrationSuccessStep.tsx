import { CheckCircle, Info } from 'lucide-react'
import { APP_NAME } from '../../../lib/branding'
import type { RegistrationRole } from './registrationWizard.types'

type RegistrationSuccessStepProps = {
  role: RegistrationRole
  onPrimaryAction: () => void
}

export function RegistrationSuccessStep({ role, onPrimaryAction }: RegistrationSuccessStepProps) {
  const isProducer = role === 'productor'

  return (
    <>
      <main className="flex flex-1 items-center justify-center px-[var(--space-margin-mobile)] py-16 md:px-[var(--space-margin-desktop)]">
        <section className="flex w-full max-w-2xl flex-col items-center space-y-12 text-center">
          <div className="grid size-24 place-items-center rounded-[var(--radius-xl)] border border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] bg-[var(--color-surface-container-low)] text-[var(--color-primary)]">
            <CheckCircle size={52} strokeWidth={1.7} />
          </div>
          <div className="space-y-6">
            <h2 className="text-headline-lg text-[var(--color-on-surface)]">¡Bienvenido a la familia!</h2>
            <p className="text-body-lg mx-auto max-w-lg text-[var(--color-on-surface-variant)]">
              Tu cuenta ha sido creada con éxito. Ya puedes empezar a descubrir
              {isProducer ? ' y vender' : ''} lo mejor de nuestra tierra.
            </p>
          </div>
          <button
            type="button"
            onClick={onPrimaryAction}
            className="text-label-md bg-[var(--color-primary-container)] px-12 py-4 uppercase text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary)]"
          >
            {isProducer ? 'Empezar a vender' : 'Explorar Productos'}
          </button>
          {isProducer && (
            <div className="flex max-w-xl items-start gap-4 rounded-[var(--radius-lg)] bg-[var(--color-secondary-fixed)] p-6 text-left text-[var(--color-on-secondary-fixed)]">
              <Info className="mt-1 text-[var(--color-secondary)]" size={22} />
              <p className="text-body-md">
                Recuerda que debes completar la configuración de tu tienda (logo, portada y pagos) antes de publicar tus productos.
              </p>
            </div>
          )}
        </section>
      </main>
      <footer className="flex w-full flex-col items-center gap-6 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] bg-[var(--color-surface-container-lowest)] py-12">
        <h3 className="text-headline-md text-[var(--color-on-surface-variant)]">{APP_NAME}</h3>
        <nav className="text-label-sm flex flex-wrap justify-center gap-8 uppercase tracking-wider text-[var(--color-on-surface-variant)]">
          <a href="#" className="transition-colors hover:text-[var(--color-primary)]">Support</a>
          <a href="#" className="transition-colors hover:text-[var(--color-primary)]">Provenance</a>
          <a href="#" className="transition-colors hover:text-[var(--color-primary)]">Legal</a>
          <a href="#" className="transition-colors hover:text-[var(--color-primary)]">Privacy</a>
        </nav>
        <p className="text-label-sm mt-4 text-[var(--color-on-surface-variant)] opacity-60">
          © 2024 {APP_NAME}. Crafted for the discerning palate.
        </p>
      </footer>
    </>
  )
}
