import { BadgeCheck } from 'lucide-react'
import type { RegistrationWizardData } from './registrationWizard.types'

type ReviewRegistrationStepProps = {
  data: RegistrationWizardData
}

export function ReviewRegistrationStep({ data }: ReviewRegistrationStepProps) {
  const summaryRows = [
    { label: 'Perfil', value: data.role === 'productor' ? 'Productor' : 'Consumidor' },
    { label: 'Nombre', value: data.name },
    { label: 'Correo', value: data.email, verified: true },
    ...(data.role === 'productor'
      ? [
          { label: 'Emprendimiento', value: data.producerName },
          { label: 'Municipio', value: data.municipality },
          { label: 'Productos', value: data.productTypes.join(', ') },
        ]
      : []),
    { label: 'Consentimiento', value: data.consentAccepted ? 'Aceptado' : 'Pendiente' },
  ]

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-[var(--space-margin-mobile)] py-10 md:py-16">
      <section className="flex flex-col gap-2">
        <h2 className="text-display-lg text-[var(--color-on-surface)]">Revisa y finaliza</h2>
        <p className="text-body-md text-[var(--color-outline)]">
          Por favor, verifica que todos los datos sean correctos antes de enviar tu solicitud de registro.
        </p>
      </section>

      <dl className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)] bg-[var(--color-surface)]">
        {summaryRows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-1 gap-x-6 gap-y-2 border-b border-[var(--color-surface-variant)] px-6 py-5 last:border-0 sm:grid-cols-[170px_1fr]"
          >
            <dt className="text-label-sm pt-1 uppercase tracking-widest text-[var(--color-outline)]">{row.label}</dt>
            <dd className="text-body-md flex flex-wrap items-center gap-3 text-[var(--color-on-surface)]">
              {row.value || 'No especificado'}
              {row.verified && (
                <span className="text-label-sm inline-flex items-center gap-1 rounded-[var(--radius-full)] bg-[var(--color-secondary-container)] px-2.5 py-1 text-[var(--color-on-secondary-container)]">
                  <BadgeCheck size={14} />
                  Verificado
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </main>
  )
}
