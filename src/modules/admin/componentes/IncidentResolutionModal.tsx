import { X } from 'lucide-react'

type IncidentResolutionModalProps = {
  onClose: () => void
}

export function IncidentResolutionModal({ onClose }: IncidentResolutionModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Cerrar modal"
        onClick={onClose}
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-on-surface)_60%,transparent)] backdrop-blur-[2px]"
      />
      <section className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface-container-lowest)] shadow-[0_0_40px_rgba(28,27,27,0.15)]">
        <header className="flex items-center justify-between border-b border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] px-6 py-5 md:px-8 md:py-6">
          <h2 className="text-headline-lg text-[var(--color-on-surface)]">Registrar solución</h2>
          <button
            type="button"
            aria-label="Cerrar modal"
            onClick={onClose}
            className="rounded-full p-2 text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-on-surface)]"
          >
            <X size={24} strokeWidth={1.8} />
          </button>
        </header>

        <form className="flex flex-col" onSubmit={(event) => event.preventDefault()}>
          <div className="flex flex-col gap-10 px-6 py-8 md:px-8">
            <fieldset>
              <legend className="text-label-md mb-4 block text-[var(--color-on-surface)]">Estado de resolución</legend>
              <div className="space-y-4">
                <ResolutionRadio label="Resuelta" value="resuelta" />
                <ResolutionRadio label="Resuelta — Sin acción requerida" value="sin-accion" />
              </div>
            </fieldset>

            <label className="block">
              <span className="text-label-md mb-3 block text-[var(--color-on-surface)]">
                Descripción de las acciones tomadas / Justificación
              </span>
              <textarea
                name="resolutionDescription"
                rows={5}
                placeholder="Añada detalles para los usuarios involucrados..."
                className="text-body-md min-h-[150px] w-full resize-y border-0 border-b border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-transparent px-0 py-3 text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] focus:border-[var(--color-on-surface)] focus:outline-none"
              />
            </label>
          </div>

          <footer className="flex items-center justify-end gap-4 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] bg-[var(--color-surface)] px-6 py-5 md:px-8 md:py-6">
            <button
              type="button"
              onClick={onClose}
              className="text-label-md rounded-[var(--radius-lg)] px-6 py-2.5 text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-dim)]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="text-label-md rounded-[var(--radius-lg)] bg-[var(--color-primary-container)] px-8 py-2.5 text-[var(--color-on-primary)] shadow-sm transition-colors hover:bg-[var(--color-primary)]"
            >
              Guardar
            </button>
          </footer>
        </form>
      </section>
    </div>
  )
}

type ResolutionRadioProps = {
  label: string
  value: string
}

function ResolutionRadio({ label, value }: ResolutionRadioProps) {
  return (
    <label className="group flex cursor-pointer items-start gap-4">
      <input
        type="radio"
        name="resolutionState"
        value={value}
        className="mt-0.5 size-5 appearance-none rounded-full border border-[var(--color-outline)] bg-[var(--color-surface-container-lowest)] transition-all checked:border-[6px] checked:border-[var(--color-primary-container)] focus:ring-2 focus:ring-[var(--color-primary-container)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface-container-lowest)] focus:outline-none"
      />
      <span className="text-body-md text-[var(--color-on-surface)] transition-colors group-hover:text-[var(--color-primary-container)]">
        {label}
      </span>
    </label>
  )
}
