import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { resolveErrorMessage } from '../../../lib/errorMessages'
import { useCreateConsumerIncidentMutation } from '../../incidencias/hooks'
import { createIncidentInputSchema } from '../../incidencias/incidencias.schema'

type ReportarIncidenciaModalProps = {
  subOrderId: string
  onClose: () => void
  onCreated?: (incidentId: string) => void
}

export function ReportarIncidenciaModal({ subOrderId, onClose, onCreated }: ReportarIncidenciaModalProps) {
  const [reason, setReason] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const createMutation = useCreateConsumerIncidentMutation()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = createIncidentInputSchema.safeParse({ subOrderId, reason })
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? 'Revisa el motivo indicado.')
      return
    }

    setValidationError(null)
    createMutation.mutate(parsed.data, {
      onSuccess: (incident) => {
        onCreated?.(incident.id)
        onClose()
      },
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="reportar-incidencia-title">
      <button type="button" aria-label="Cerrar modal" onClick={onClose} className="absolute inset-0 bg-[var(--color-on-surface)]/40 backdrop-blur-sm" />
      <div className="relative flex max-h-[90dvh] w-full max-w-2xl flex-col bg-[var(--color-background)] shadow-[0_20px_50px_rgba(113,89,21,0.08)]">
        <header className="flex shrink-0 items-center justify-between border-b border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] px-6 py-4 md:px-8">
          <div>
            <h2 className="text-headline-md text-[var(--color-on-surface)]" id="reportar-incidencia-title">Reportar incidencia</h2>
            <p className="text-label-sm mt-1 text-[var(--color-outline)]">Entrega {shortReference(subOrderId)}</p>
          </div>
          <button type="button" aria-label="Cerrar modal" onClick={onClose} className="ml-4 shrink-0 text-[var(--color-on-surface-variant)] transition-colors hover:text-[#7A2E3A]">
            <X size={22} strokeWidth={1.6} />
          </button>
        </header>

        <form className="space-y-5 overflow-y-auto px-6 py-6 md:px-8" onSubmit={handleSubmit}>
          <p className="text-body-md text-[var(--color-on-surface-variant)]">Describe únicamente el problema relacionado con esta entrega. El equipo revisará el estado y los importes registrados en el pedido.</p>
          <label className="block space-y-2" htmlFor="motivo-incidencia">
            <span className="text-label-md block uppercase tracking-wider text-[var(--color-outline)]">Motivo</span>
            <textarea
              id="motivo-incidencia"
              value={reason}
              onChange={(event) => {
                setReason(event.target.value)
                setValidationError(null)
                createMutation.reset()
              }}
              rows={6}
              maxLength={2000}
              required
              aria-describedby="motivo-incidencia-ayuda motivo-incidencia-error"
              aria-invalid={validationError !== null}
              placeholder="Explica qué ocurrió con esta entrega..."
              className="text-body-md w-full resize-y border border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] bg-transparent p-3 text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] focus:border-[#7A2E3A] focus:ring-0 focus:outline-none"
            />
          </label>
          <div className="flex justify-between gap-4">
            <p id="motivo-incidencia-ayuda" className="text-label-sm text-[var(--color-outline)]">Obligatorio, máximo 2000 caracteres.</p>
            <span className="text-label-sm tabular-nums text-[var(--color-outline)]" aria-live="polite">{reason.length}/2000</span>
          </div>
          <div id="motivo-incidencia-error" className="min-h-6" aria-live="polite">
            {validationError ? <p role="alert" className="text-label-sm text-[var(--color-error)]">{validationError}</p> : null}
            {createMutation.isError ? <p role="alert" className="text-label-sm text-[var(--color-error)]">{resolveErrorMessage(createMutation.error)}</p> : null}
          </div>

          <footer className="flex flex-col gap-3 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" disabled={createMutation.isPending} onClick={onClose} className="text-label-sm uppercase tracking-widest text-[var(--color-on-surface-variant)] underline underline-offset-4 disabled:opacity-50">Cancelar</button>
            <button type="submit" disabled={createMutation.isPending} className="text-label-md w-full bg-[#7A2E3A] px-8 py-3 uppercase tracking-wider text-white transition-colors hover:bg-[#63222d] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
              {createMutation.isPending ? 'Enviando...' : 'Enviar reporte'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}

function shortReference(value: string): string {
  return value.length > 18 ? `${value.slice(0, 8)}...${value.slice(-6)}` : value
}
