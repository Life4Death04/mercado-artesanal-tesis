import { LockKeyhole } from 'lucide-react'
import { APP_NAME } from '../../../lib/branding'
import { DemoAccountsSection } from './DemoAccountsSection'

export function LoginAccessCard() {
  return (
    <section className="flex flex-col justify-center bg-[var(--color-surface)] p-8 md:p-20">
      <div className="mx-auto w-full max-w-md">
        <header className="mb-4 text-center md:text-left">
          <h2 className="text-headline-lg mb-3 text-[var(--color-primary)]">
            Bienvenido a {APP_NAME}
          </h2>
          <p className="text-body-md text-[var(--color-on-surface-variant)]">
            Acceda a su cuenta para gestionar sus pedidos o descubrir nuevos productos artesanos.
          </p>
        </header>

        <div className="space-y-6">
          <DemoAccountsSection />

          <div className="border-t border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] pt-8">
            <div className="flex flex-col items-center gap-2 md:items-start">
              <p className="text-label-sm flex items-center gap-2 text-[var(--color-outline)]">
                <LockKeyhole size={16} strokeWidth={1.8} />
                Acceso seguro gestionado por Auth0
              </p>
              <div className="text-label-sm flex gap-4 text-[var(--color-outline)]">
                <a href="#" className="underline underline-offset-2 transition-colors hover:text-[var(--color-primary)]">
                  Privacidad
                </a>
                <a href="#" className="underline underline-offset-2 transition-colors hover:text-[var(--color-primary)]">
                  Términos
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
