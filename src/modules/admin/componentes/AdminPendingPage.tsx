type AdminPendingPageProps = {
  title: string
  description: string
}

export function AdminPendingPage({ title, description }: AdminPendingPageProps) {
  return (
    <section className="mx-[var(--space-margin-mobile)] max-w-3xl border border-[color-mix(in_srgb,var(--color-outline)_20%,transparent)] bg-[var(--color-surface-container-lowest)] p-8 md:mx-0 md:p-12">
      <p className="text-label-md mb-4 uppercase text-[var(--color-primary-container)]">Administrador</p>
      <h1 className="text-headline-lg mb-4 text-[var(--color-on-surface)]">{title}</h1>
      <p className="text-body-md max-w-2xl text-[var(--color-on-surface-variant)]">{description}</p>
    </section>
  )
}
