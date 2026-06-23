import { AlertTriangle, AtSign, Eye, EyeOff, X } from 'lucide-react'
import { useState } from 'react'

// ---------------------------------------------------------------------------
// Cambiar correo electrónico modal
// ---------------------------------------------------------------------------

type CambiarCorreoModalProps = {
  correoActual: string
  onClose: () => void
}

export function CambiarCorreoModal({ correoActual, onClose }: CambiarCorreoModalProps) {
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-correo-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[var(--color-inverse-surface)]/40 backdrop-blur-[4px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 flex w-full max-w-md flex-col gap-8 rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-8 shadow-[0px_4px_20px_rgba(26,26,26,0.08)]">
        {/* Close */}
        <button
          type="button"
          aria-label="Cerrar modal"
          onClick={onClose}
          className="absolute top-5 right-5 text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-primary)]"
        >
          <X size={18} strokeWidth={1.8} />
        </button>

        {/* Header */}
        <div className="space-y-2 text-center">
          <h2
            id="modal-correo-title"
            className="text-headline-sm text-[var(--color-on-surface)]"
          >
            Cambiar correo electrónico
          </h2>
          <div className="mx-auto h-px w-12 bg-[var(--color-outline-variant)]" />
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Correo actual (read-only) */}
          <div className="flex flex-col gap-2">
            <label className="text-label-md text-[var(--color-secondary)]">Correo actual</label>
            <div className="flex items-center gap-2 rounded-[var(--radius-default)] border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] px-4 py-3">
              <AtSign size={16} strokeWidth={1.8} className="flex-shrink-0 text-[var(--color-outline)]" />
              <span className="text-body-md text-[var(--color-on-surface)] opacity-60">
                {correoActual}
              </span>
            </div>
          </div>

          {/* Nuevo correo */}
          <div className="flex flex-col gap-2">
            <label htmlFor="nuevo-correo" className="text-label-md text-[var(--color-secondary)]">
              Nuevo correo electrónico
            </label>
            <input
              id="nuevo-correo"
              name="nuevo-correo"
              type="email"
              placeholder="ejemplo@email.com"
              required
              className="border-b border-[var(--color-outline-variant)] bg-transparent py-2 text-body-md text-[var(--color-on-surface)] placeholder-[var(--color-outline-variant)] transition-colors focus:border-[var(--color-primary)] focus:outline-none"
            />
          </div>

          {/* Contraseña actual */}
          <div className="flex flex-col gap-2">
            <label htmlFor="contrasena-actual" className="text-label-md text-[var(--color-secondary)]">
              Contraseña actual
            </label>
            <div className="relative">
              <input
                id="contrasena-actual"
                name="contrasena-actual"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                className="w-full border-b border-[var(--color-outline-variant)] bg-transparent py-2 pr-8 text-body-md text-[var(--color-on-surface)] placeholder-[var(--color-outline-variant)] transition-colors focus:border-[var(--color-primary)] focus:outline-none"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[var(--color-outline-variant)] transition-colors hover:text-[var(--color-primary)]"
              >
                {showPassword ? (
                  <EyeOff size={16} strokeWidth={1.8} />
                ) : (
                  <Eye size={16} strokeWidth={1.8} />
                )}
              </button>
            </div>
            <p className="text-label-sm italic text-[var(--color-secondary)]">
              Recibirás un enlace de confirmación en tu nuevo correo para completar el cambio.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="text-label-md flex-1 rounded-[var(--radius-default)] border border-[var(--color-outline-variant)] px-6 py-3 text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-container)]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="text-label-md flex-1 rounded-[var(--radius-default)] bg-[var(--color-primary-container)] px-6 py-3 text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary)]"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Descartar cambios modal
// ---------------------------------------------------------------------------

type DescartarCambiosModalProps = {
  onClose: () => void
  onDiscard: () => void
}

export function DescartarCambiosModal({ onClose, onDiscard }: DescartarCambiosModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-descartar-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[var(--color-inverse-surface)]/40 backdrop-blur-[4px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 flex w-full max-w-[440px] flex-col items-center p-10 text-center shadow-[0px_4px_40px_rgba(26,26,26,0.08)] bg-[var(--color-surface)]">
        {/* Warning icon */}
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-fixed)]">
          <AlertTriangle
            size={24}
            strokeWidth={1.8}
            className="text-[var(--color-primary)]"
          />
        </div>

        {/* Title */}
        <h2
          id="modal-descartar-title"
          className="text-headline-sm mb-4 text-[var(--color-on-surface)]"
        >
          Descartar cambios
        </h2>

        {/* Message */}
        <p className="text-body-md mb-10 leading-relaxed text-[var(--color-on-surface)]">
          Tienes cambios sin guardar en la información de tu tienda. ¿Estás seguro de que quieres
          descartarlos?
        </p>

        {/* Actions */}
        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            autoFocus
            onClick={onClose}
            className="text-label-md w-full bg-[var(--color-primary-container)] py-4 uppercase tracking-widest text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary)]"
          >
            Seguir editando
          </button>
          <button
            type="button"
            onClick={() => { onDiscard(); onClose() }}
            className="text-label-md w-full bg-transparent py-3 uppercase tracking-widest text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary)]"
          >
            Descartar cambios
          </button>
        </div>
      </div>
    </div>
  )
}
