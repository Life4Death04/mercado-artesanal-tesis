type PendingDesignPageProps = {
  actor: 'Consumidor' | 'Productor' | 'Administrador' | 'Compartida'
  title: string
  description: string
}

export function PendingDesignPage({ actor, title, description }: PendingDesignPageProps) {
  return (
    <main className="min-h-screen bg-[var(--color-background)] px-[var(--space-margin-mobile)] py-16 text-[var(--color-on-background)] md:px-[var(--space-margin-desktop)]">
      <section className="mx-auto max-w-[var(--layout-container-max)] border border-[color-mix(in_srgb,var(--color-outline)_20%,transparent)] bg-[var(--color-surface-container-lowest)] p-8 md:p-12">
        <p className="text-label-md mb-4 uppercase text-[var(--color-primary)]">{actor}</p>
        <h1 className="text-headline-lg mb-4 text-[var(--color-on-surface)]">{title}</h1>
        <p className="text-body-md max-w-2xl text-[var(--color-on-surface-variant)]">{description}</p>
      </section>
    </main>
  )
}
