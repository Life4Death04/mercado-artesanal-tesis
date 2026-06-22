import { Trash2, X } from 'lucide-react'

type DeletePublicationModalProps = {
  onClose: () => void
}

const removalReasons = [
  'Incumplimiento de normas',
  'Información alimentaria incompleta',
  'Contenido inapropiado',
  'Otro',
]

export function DeletePublicationModal({ onClose }: DeletePublicationModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Cerrar modal"
        onClick={onClose}
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-on-surface)_40%,transparent)] backdrop-blur-sm"
      />
      <section className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col border border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] bg-[var(--color-background)] shadow-[0_20px_40px_-15px_rgba(28,27,27,0.15)]">
        <button
          type="button"
          aria-label="Cerrar modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-[var(--color-outline)] transition-colors hover:text-[var(--color-on-surface)]"
        >
          <X size={24} strokeWidth={1.8} />
        </button>

        <form className="overflow-y-auto p-8 md:p-10" onSubmit={(event) => event.preventDefault()}>
          <h2 className="text-headline-lg mb-4 pr-8 text-[var(--color-on-surface)]">Eliminar publicación</h2>
          <p className="text-body-md mb-8 text-[var(--color-on-surface-variant)]">
            Indique el motivo por el cual desea retirar este producto del catálogo. Esta acción notificará
            automáticamente al productor.
          </p>

          <fieldset className="mb-8">
            <legend className="text-label-md mb-4 text-[var(--color-on-surface)]">Motivo de la retirada</legend>
            <div className="space-y-4">
              {removalReasons.map((reason) => (
                <label key={reason} className="group flex cursor-pointer items-start gap-3">
                  <input
                    type="radio"
                    name="removalReason"
                    value={reason}
                    className="mt-0.5 size-5 appearance-none rounded-full border border-[var(--color-outline-variant)] bg-transparent transition-all checked:border-[6px] checked:border-[var(--color-primary-container)] focus:ring-2 focus:ring-[var(--color-primary-container)] focus:outline-none"
                  />
                  <span className="text-body-md text-[var(--color-on-surface)] transition-colors group-hover:text-[var(--color-primary-container)]">
                    {reason}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="mb-8 block">
            <span className="text-label-md mb-3 block text-[var(--color-on-surface)]">
              Detalle adicional (opcional)
            </span>
            <textarea
              rows={4}
              placeholder="Añada comentarios específicos para el productor..."
              className="text-body-md min-h-32 w-full resize-y border-0 border-b border-[color-mix(in_srgb,var(--color-secondary)_55%,transparent)] bg-transparent px-0 py-3 text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] focus:border-[var(--color-on-surface)] focus:outline-none"
            />
          </label>

          <footer className="flex justify-end gap-4 border-t border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] pt-5">
            <button
              type="button"
              onClick={onClose}
              className="text-label-md border border-[color-mix(in_srgb,var(--color-on-surface)_20%,transparent)] px-8 py-3 text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-container-low)]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="text-label-md inline-flex items-center gap-2 bg-[var(--color-error)] px-8 py-3 text-[var(--color-on-error)] transition-opacity hover:opacity-90"
            >
              <Trash2 size={18} strokeWidth={1.8} />
              Eliminar
            </button>
          </footer>
        </form>
      </section>
    </div>
  )
}
