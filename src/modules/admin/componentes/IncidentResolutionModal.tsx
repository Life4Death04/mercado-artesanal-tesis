import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { resolveErrorMessage } from '../../../lib/errorMessages'
import { useResolveAdminIncidentMutation } from '../../incidencias/hooks'
import { resolveIncidentInputSchema } from '../../incidencias/incidencias.schema'

type IncidentResolutionModalProps = {
  incidentId: string
  onClose: () => void
  onResolved: () => void
}

export function IncidentResolutionModal({ incidentId, onClose, onResolved }: IncidentResolutionModalProps) {
  const [reason, setReason] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const resolveMutation = useResolveAdminIncidentMutation(incidentId)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = resolveIncidentInputSchema.safeParse({ reason })
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? 'Revisa la resolución indicada.')
      return
    }
    setValidationError(null)
    resolveMutation.mutate(parsed.data, { onSuccess: onResolved })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-resolution-title">
      <button type="button" aria-label="Cerrar modal" onClick={onClose} className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-on-surface)_60%,transparent)] backdrop-blur-[2px]" />
      <section className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface-container-lowest)] shadow-[0_0_40px_rgba(28,27,27,0.15)]">
        <header className="flex items-center justify-between border-b border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] px-6 py-5 md:px-8 md:py-6"><h2 id="modal-resolution-title" className="text-headline-lg text-[var(--color-on-surface)]">Registrar resolución</h2><button type="button" aria-label="Cerrar modal" disabled={resolveMutation.isPending} onClick={onClose} className="rounded-full p-2 text-[var(--color-secondary)] disabled:opacity-50"><X size={24} strokeWidth={1.8} /></button></header>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="px-6 py-8 md:px-8">
            <label className="block" htmlFor="resolution-reason"><span className="text-label-md mb-3 block text-[var(--color-on-surface)]">Motivo de la resolución</span><textarea id="resolution-reason" value={reason} onChange={(event) => { setReason(event.target.value); setValidationError(null); resolveMutation.reset() }} rows={6} maxLength={2000} required aria-invalid={validationError !== null} aria-describedby="resolution-help resolution-error" placeholder="Explique la conclusión comunicada al consumidor..." className="text-body-md min-h-[150px] w-full resize-y border border-[var(--color-outline-variant)] bg-transparent p-3 text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] focus:border-[var(--color-on-surface)] focus:outline-none" /></label>
            <div className="mt-2 flex justify-between gap-4"><p id="resolution-help" className="text-label-sm text-[var(--color-outline)]">Obligatorio, máximo 2000 caracteres.</p><span className="text-label-sm tabular-nums text-[var(--color-outline)]" aria-live="polite">{reason.length}/2000</span></div>
            <div id="resolution-error" className="mt-3 min-h-6" aria-live="polite">{validationError ? <p role="alert" className="text-label-sm text-[var(--color-error)]">{validationError}</p> : null}{resolveMutation.isError ? <p role="alert" className="text-label-sm text-[var(--color-error)]">{resolveErrorMessage(resolveMutation.error)}</p> : null}</div>
          </div>
          <footer className="flex items-center justify-end gap-4 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] bg-[var(--color-surface)] px-6 py-5 md:px-8"><button type="button" disabled={resolveMutation.isPending} onClick={onClose} className="text-label-md px-6 py-2.5 disabled:opacity-50">Cancelar</button><button type="submit" disabled={resolveMutation.isPending} className="text-label-md bg-[var(--color-primary-container)] px-8 py-2.5 text-[var(--color-on-primary)] disabled:cursor-not-allowed disabled:opacity-60">{resolveMutation.isPending ? 'Guardando...' : 'Resolver incidencia'}</button></footer>
        </form>
      </section>
    </div>
  )
}
