import { Camera, ChevronDown, Image, X } from 'lucide-react'

type ReportarIncidenciaModalProps = {
  onClose: () => void
}

const tiposIncidencia = [
  'Producto dañado',
  'No recibido',
  'Retraso en entrega',
  'Producto incorrecto',
  'Error en el pago',
  'Otro',
]

const pedidosAsociados = [
  'Pedido #AG-8821 (Pendiente)',
  'Pedido #AG-8822 (Pendiente)',
  'Pedido #AG-7540 (Entregado)',
  'Otro / No listado',
]

export function ReportarIncidenciaModal({ onClose }: ReportarIncidenciaModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reportar-incidencia-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[var(--color-on-surface)]/40 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[var(--color-background)] shadow-[0_20px_50px_rgba(113,89,21,0.08)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] px-8 py-6">
          <h2 className="text-headline-md text-[var(--color-on-surface)]" id="reportar-incidencia-title">
            Reportar incidencia
          </h2>
          <button
            type="button"
            aria-label="Cerrar modal"
            onClick={onClose}
            className="text-[var(--color-on-surface-variant)] transition-colors hover:text-[#7A2E3A]"
          >
            <X size={28} strokeWidth={1.6} />
          </button>
        </div>

        {/* Form */}
        <form
          className="space-y-8 px-8 py-10"
          onSubmit={(e) => {
            e.preventDefault()
            onClose()
          }}
        >
          {/* Tipo de incidencia */}
          <div className="space-y-2">
            <label className="text-headline-md block text-[18px] text-[var(--color-on-surface)]" htmlFor="tipo-incidencia">
              Tipo de incidencia
            </label>
            <div className="relative">
              <select
                id="tipo-incidencia"
                defaultValue=""
                className="text-body-md w-full cursor-pointer appearance-none border-0 border-b border-[var(--color-outline)] bg-transparent py-3 pr-10 text-[var(--color-on-surface)] transition-colors focus:border-[#7A2E3A] focus:ring-0 focus:outline-none"
              >
                <option value="" disabled>Seleccione una opción</option>
                {tiposIncidencia.map((tipo) => (
                  <option key={tipo}>{tipo}</option>
                ))}
              </select>
              <ChevronDown size={18} strokeWidth={1.6} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[var(--color-outline)]" />
            </div>
          </div>

          {/* Pedido asociado */}
          <div className="space-y-2">
            <label className="text-headline-md block text-[18px] text-[var(--color-on-surface)]" htmlFor="pedido-asociado">
              Pedido asociado
            </label>
            <div className="relative">
              <select
                id="pedido-asociado"
                className="text-body-md w-full cursor-pointer appearance-none border-0 border-b border-[var(--color-outline)] bg-transparent py-3 pr-10 text-[var(--color-on-surface)] transition-colors focus:border-[#7A2E3A] focus:ring-0 focus:outline-none"
              >
                {pedidosAsociados.map((pedido) => (
                  <option key={pedido}>{pedido}</option>
                ))}
              </select>
              <ChevronDown size={18} strokeWidth={1.6} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[var(--color-outline)]" />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label className="text-headline-md block text-[18px] text-[var(--color-on-surface)]" htmlFor="descripcion-incidencia">
              Descripción del problema
            </label>
            <textarea
              id="descripcion-incidencia"
              rows={4}
              required
              placeholder="Por favor, detalle lo sucedido con el mayor detalle posible..."
              className="text-body-md w-full resize-none border border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] bg-transparent p-4 text-[var(--color-on-surface)] placeholder:text-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] transition-colors focus:border-[#7A2E3A] focus:ring-0 focus:outline-none"
            />
          </div>

          {/* Evidencia fotográfica */}
          <div className="space-y-4">
            <label className="text-headline-md block text-[18px] text-[var(--color-on-surface)]">
              Evidencia fotográfica
            </label>
            <div className="group flex flex-col items-center justify-center border-2 border-dashed border-[color-mix(in_srgb,var(--color-outline-variant)_60%,transparent)] bg-[var(--color-surface-container-low)] p-10 text-center transition-colors hover:border-[color-mix(in_srgb,#7A2E3A_40%,transparent)]">
              <Camera size={40} strokeWidth={1.4} className="mb-3 text-[var(--color-outline)] transition-colors group-hover:text-[#7A2E3A]" />
              <p className="text-body-md mb-6 text-[var(--color-on-surface-variant)]">
                Arrastre sus imágenes o haga clic para buscarlas
              </p>
              <button
                type="button"
                className="text-label-md border border-[#7A2E3A] px-8 py-2 uppercase tracking-wider text-[#7A2E3A] transition-all hover:bg-[#7A2E3A] hover:text-white"
              >
                Adjuntar fotos
              </button>
            </div>
            {/* Thumbnail placeholder */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              <div className="flex size-20 flex-shrink-0 items-center justify-center bg-[var(--color-surface-variant)] opacity-40">
                <Image size={24} strokeWidth={1.6} className="text-[var(--color-outline)]" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center gap-6 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] pt-6 sm:flex-row">
            <button
              type="submit"
              className="text-label-md w-full bg-[#7A2E3A] px-12 py-5 uppercase tracking-[0.2em] text-white shadow-[0_20px_50px_rgba(113,89,21,0.08)] transition-all hover:scale-[1.02] active:scale-95 sm:w-auto"
            >
              Enviar reporte
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-label-sm uppercase tracking-widest text-[var(--color-on-surface-variant)] underline underline-offset-8 transition-colors hover:text-[#7A2E3A]"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
