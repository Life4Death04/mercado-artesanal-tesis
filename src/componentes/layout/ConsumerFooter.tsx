export function ConsumerFooter() {
  return (
    <footer className="mt-auto w-full border-t border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] bg-[var(--color-surface-container)] px-[var(--space-margin-mobile)] py-12 md:px-[var(--space-margin-desktop)] md:py-16">
      <div className="mx-auto flex max-w-[var(--layout-container-max)] flex-col items-center text-center md:text-left">
        <div className="text-display-lg mb-8 text-[40px] leading-none text-[var(--color-primary)] italic md:text-[48px]">ALICANTE ORIGIN</div>
        <nav className="mb-10 flex flex-wrap justify-center gap-x-8 gap-y-4 md:justify-start" aria-label="Enlaces de pie de página">
          {['The Producers', 'Shipping', 'Terms of Service', 'Provenance Guide'].map((item) => (
            <a key={item} href="#" className="text-body-md text-[var(--color-on-secondary-fixed-variant)] transition-colors hover:text-[var(--color-primary)]">
              {item}
            </a>
          ))}
        </nav>
        <p className="text-body-md text-[var(--color-on-secondary-fixed-variant)]">© 2024 Alicante Origin. Artisanal Heritage & Provenance.</p>
      </div>
    </footer>
  )
}
