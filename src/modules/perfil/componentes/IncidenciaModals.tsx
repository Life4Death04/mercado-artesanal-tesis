import { Camera, ChevronDown, X } from 'lucide-react'

type ReportarIncidenciaModalProps = {
  initialPedidoLabel?: string
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

export function ReportarIncidenciaModal({ initialPedidoLabel, onClose }: ReportarIncidenciaModalProps) {
  const pedidoOptions = initialPedidoLabel && !pedidosAsociados.includes(initialPedidoLabel)
    ? [initialPedidoLabel, ...pedidosAsociados]
    : pedidosAsociados

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
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
      <div className="relative flex max-h-[90dvh] w-full max-w-2xl flex-col bg-[var(--color-background)] shadow-[0_20px_50px_rgba(113,89,21,0.08)]">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] px-6 py-4 md:px-8">
          <h2 className="text-headline-md text-[var(--color-on-surface)]" id="reportar-incidencia-title">
            Reportar incidencia
          </h2>
          <button
            type="button"
            aria-label="Cerrar modal"
            onClick={onClose}
            className="ml-4 shrink-0 text-[var(--color-on-surface-variant)] transition-colors hover:text-[#7A2E3A]"
          >
            <X size={22} strokeWidth={1.6} />
          </button>
        </div>

        {/* Form — scroll interno */}
        <form
          className="space-y-5 overflow-y-auto px-6 py-6 md:px-8"
          onSubmit={(e) => {
            e.preventDefault()
            onClose()
          }}
        >
          {/* Tipo de incidencia */}
          <div className="space-y-1.5">
            <label className="text-label-md block uppercase tracking-wider text-[var(--color-outline)]" htmlFor="tipo-incidencia">
              Tipo de incidencia
            </label>
            <div className="relative">
              <select
                id="tipo-incidencia"
                defaultValue=""
                className="text-body-md w-full cursor-pointer appearance-none border-0 border-b border-[var(--color-outline)] bg-transparent py-2.5 pr-10 text-[var(--color-on-surface)] transition-colors focus:border-[#7A2E3A] focus:ring-0 focus:outline-none"
              >
                <option value="" disabled>Seleccione una opción</option>
                {tiposIncidencia.map((tipo) => (
                  <option key={tipo}>{tipo}</option>
                ))}
              </select>
              <ChevronDown size={16} strokeWidth={1.6} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[var(--color-outline)]" />
            </div>
          </div>

          {/* Pedido asociado */}
          <div className="space-y-1.5">
            <label className="text-label-md block uppercase tracking-wider text-[var(--color-outline)]" htmlFor="pedido-asociado">
              Pedido asociado
            </label>
            <div className="relative">
              <select
                id="pedido-asociado"
                defaultValue={initialPedidoLabel ?? pedidoOptions[0]}
                className="text-body-md w-full cursor-pointer appearance-none border-0 border-b border-[var(--color-outline)] bg-transparent py-2.5 pr-10 text-[var(--color-on-surface)] transition-colors focus:border-[#7A2E3A] focus:ring-0 focus:outline-none"
              >
                {pedidoOptions.map((pedido) => (
                  <option key={pedido}>{pedido}</option>
                ))}
              </select>
              <ChevronDown size={16} strokeWidth={1.6} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[var(--color-outline)]" />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-1.5">
            <label className="text-label-md block uppercase tracking-wider text-[var(--color-outline)]" htmlFor="descripcion-incidencia">
              Descripción del problema
            </label>
            <textarea
              id="descripcion-incidencia"
              rows={3}
              required
              placeholder="Detalla lo sucedido con la mayor precisión posible..."
              className="text-body-md w-full resize-none border border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] bg-transparent p-3 text-[var(--color-on-surface)] placeholder:text-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] transition-colors focus:border-[#7A2E3A] focus:ring-0 focus:outline-none"
            />
          </div>

          {/* Evidencia fotográfica — fila compacta */}
          <div className="space-y-1.5">
            <span className="text-label-md block uppercase tracking-wider text-[var(--color-outline)]">
              Evidencia fotográfica <span className="normal-case tracking-normal opacity-60">(opcional)</span>
            </span>
            <div className="group flex items-center gap-4 border border-dashed border-[color-mix(in_srgb,var(--color-outline-variant)_60%,transparent)] bg-[var(--color-surface-container-low)] px-4 py-3 transition-colors hover:border-[color-mix(in_srgb,#7A2E3A_40%,transparent)]">
              <Camera size={22} strokeWidth={1.5} className="shrink-0 text-[var(--color-outline)] transition-colors group-hover:text-[#7A2E3A]" />
              <p className="text-body-md flex-1 text-[var(--color-on-surface-variant)]">
                Arrastra o selecciona imágenes
              </p>
              <button
                type="button"
                className="text-label-md shrink-0 border border-[#7A2E3A] px-4 py-1.5 uppercase tracking-wider text-[#7A2E3A] transition-all hover:bg-[#7A2E3A] hover:text-white"
              >
                Adjuntar
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-label-sm uppercase tracking-widest text-[var(--color-on-surface-variant)] underline underline-offset-4 transition-colors hover:text-[#7A2E3A]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="text-label-md w-full bg-[#7A2E3A] px-8 py-3 uppercase tracking-wider text-white transition-colors hover:bg-[#63222d] active:scale-95 sm:w-auto"
            >
              Enviar reporte
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
