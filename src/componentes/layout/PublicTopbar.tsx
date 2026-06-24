import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { APP_NAME } from '../../lib/branding'

type PublicTopbarProps = {
  navHrefPrefix?: '' | '/'
}

const navItems = ['Mercado', 'Productores', 'Cómo funciona', 'Impacto']

export function PublicTopbar({ navHrefPrefix = '/' }: PublicTopbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  function navHref(item: string) {
    return `${navHrefPrefix}#${item.toLowerCase().replaceAll(' ', '-')}`
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[color-mix(in_srgb,var(--color-background)_92%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-[var(--space-margin-mobile)] py-4 md:px-[var(--space-margin-desktop)]">
        <Link to="/" className="flex items-center gap-3" aria-label={`${APP_NAME} inicio`}>
          <span className="grid size-11 place-items-center border border-[var(--color-primary-container)] bg-[var(--color-primary-container)] text-[var(--color-on-primary)]">
            AA
          </span>
          <span>
            <span className="font-editorial block text-2xl leading-none text-[var(--color-primary)]">{APP_NAME}</span>
            <span className="text-label-sm uppercase tracking-[0.18em] text-[var(--color-secondary)]">Mercado artesanal</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegación principal">
          {navItems.map((item) => (
            <a key={item} href={navHref(item)} className="text-label-md text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary-container)]">
              {item}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 min-[771px]:flex">
          <Link to="/login" className="text-label-md px-4 py-2 text-[var(--color-on-surface)] transition-colors hover:text-[var(--color-primary-container)]">
            Iniciar sesión
          </Link>
          <Link to="/registro" className="text-label-md bg-[var(--color-primary-container)] px-5 py-3 !text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary)]">
            Crear cuenta
          </Link>
        </div>

        <button
          type="button"
          aria-label={mobileMenuOpen ? 'Cerrar navegación' : 'Abrir navegación'}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="text-[var(--color-primary-container)] min-[771px]:hidden"
        >
          {mobileMenuOpen ? <X size={28} strokeWidth={1.8} /> : <Menu size={28} strokeWidth={1.8} />}
        </button>
      </div>

      {mobileMenuOpen ? (
        <div className="border-t border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-background)] px-[var(--space-margin-mobile)] py-5 shadow-[0_24px_50px_-38px_rgba(28,27,27,0.45)] min-[771px]:hidden">
          <nav className="flex flex-col gap-1" aria-label="Navegación móvil">
            {navItems.map((item) => (
              <a
                key={item}
                href={navHref(item)}
                onClick={() => setMobileMenuOpen(false)}
                className="text-label-md border-b border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] py-4 text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary-container)]"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="mt-5 grid grid-cols-1 gap-3 min-[520px]:grid-cols-2">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-label-md border border-[var(--color-outline-variant)] px-5 py-3 text-center text-[var(--color-on-surface)] transition-colors hover:border-[var(--color-primary-container)]">
              Iniciar sesión
            </Link>
            <Link to="/registro" onClick={() => setMobileMenuOpen(false)} className="text-label-md bg-[var(--color-primary-container)] px-5 py-3 text-center !text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary)]">
              Crear cuenta
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}
