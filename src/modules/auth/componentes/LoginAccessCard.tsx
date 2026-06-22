import { LockKeyhole } from 'lucide-react'
import { APP_NAME } from '../../../lib/branding'
import { GoogleIcon } from './GoogleIcon'

export function LoginAccessCard() {
  return (
    <section className="flex flex-col justify-center bg-[var(--color-surface)] p-8 md:p-20">
      <div className="mx-auto w-full max-w-md">
        <header className="mb-10 text-center md:text-left">
          <h2 className="text-headline-lg mb-3 text-[var(--color-primary)]">
            Bienvenido a {APP_NAME}
          </h2>
          <p className="text-body-md text-[var(--color-on-surface-variant)]">
            Acceda a su cuenta para gestionar sus pedidos o descubrir nuevos productos artesanos.
          </p>
        </header>

        <div className="space-y-6">
          <div className="space-y-4">
            <button
              type="button"
              className="text-label-md w-full rounded-[var(--radius-sm)] bg-[var(--color-primary-container)] px-6 py-4 text-[var(--color-on-primary)] shadow-sm transition duration-300 hover:bg-[var(--color-primary)] active:scale-[0.98]"
            >
              Iniciar sesión
            </button>

            <div className="relative flex items-center py-4">
              <div className="h-px flex-grow bg-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)]" />
              <span className="text-label-sm mx-4 shrink-0 text-[var(--color-outline)]">o</span>
              <div className="h-px flex-grow bg-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)]" />
            </div>

            <button
              type="button"
              className="text-label-md flex w-full items-center justify-center gap-3 rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-outline)_20%,transparent)] bg-transparent px-6 py-4 text-[var(--color-on-surface)] transition duration-300 hover:bg-[var(--color-surface-container)] active:scale-[0.98]"
            >
              <GoogleIcon />
              Continuar con Google
            </button>
          </div>

          <p className="text-label-md pt-4 text-center text-[var(--color-on-surface-variant)] md:text-left">
            ¿No tienes cuenta?{' '}
            <a
              href="/registro"
              className="font-bold text-[var(--color-primary-container)] underline underline-offset-4 transition-colors hover:text-[var(--color-primary)]"
            >
              Regístrate
            </a>
          </p>

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
