import type { ReactNode } from 'react'
import { HelpCircle } from 'lucide-react'

type AuthPageShellProps = {
  children: ReactNode
}

const footerLinks = ['Privacidad', 'Términos', 'Contacto']

export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <div className="font-interface flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-on-background)]">
      <header className="border-b border-[color-mix(in_srgb,var(--color-outline-variant)_70%,transparent)] bg-[var(--color-background)]">
        <nav className="mx-auto flex w-full max-w-[var(--layout-container-max)] items-center justify-between px-[var(--space-margin-mobile)] py-4 md:px-[var(--space-margin-desktop)]">
          <div className="font-editorial text-headline-md uppercase tracking-[0.18em] text-[var(--color-primary)]">
            LA BOHÈME
          </div>
          <button
            type="button"
            aria-label="Ayuda"
            className="text-[var(--color-on-surface-variant)] transition duration-300 hover:scale-105 hover:text-[var(--color-primary)]"
          >
            <HelpCircle size={22} strokeWidth={2} />
          </button>
        </nav>
      </header>

      <main className="flex flex-1 items-center justify-center px-[var(--space-margin-mobile)] py-12 md:py-20">
        {children}
      </main>

      <footer className="mt-auto border-t border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-background)]">
        <div className="text-label-sm mx-auto flex w-full max-w-[var(--layout-container-max)] flex-col items-center justify-between gap-4 px-[var(--space-margin-mobile)] py-8 text-[var(--color-secondary)] md:flex-row md:px-[var(--space-margin-desktop)]">
          <p>© 2024 La Bohème Artisanal. Acceso seguro gestionado por Auth0.</p>
          <nav className="flex gap-6 text-[var(--color-on-tertiary-fixed-variant)]">
            {footerLinks.map((link) => (
              <a key={link} href="#" className="transition-colors hover:text-[var(--color-primary)]">
                {link}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  )
}
