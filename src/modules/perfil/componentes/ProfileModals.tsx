import { Check, ChevronDown, X } from 'lucide-react'

type AgregarDireccionModalProps = {
  onClose: () => void
}

const provincias = ['Alicante', 'Valencia', 'Castellón', 'Murcia']

export function AgregarDireccionModal({ onClose }: AgregarDireccionModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-on-surface)]/40 p-4 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-address-title"
    >
      <div className="relative w-full max-w-[600px] overflow-hidden bg-[#FAF7F0] shadow-2xl">
        <button
          type="button"
          aria-label="Cerrar modal"
          onClick={onClose}
          className="absolute top-6 right-6 z-10 text-[var(--color-on-surface-variant)] transition-colors hover:text-[#7A2E3A]"
        >
          <X size={26} strokeWidth={1.6} />
        </button>

        <div className="border-b border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] px-10 pt-10 pb-6">
          <h2 className="text-headline-md text-[var(--color-on-surface)]" id="add-address-title">
            Añadir dirección
          </h2>
          <p className="text-body-md mt-2 text-[var(--color-on-surface-variant)]">
            Introduce los datos para el envío de tus productos gourmet.
          </p>
        </div>

        <form
          className="space-y-6 p-10"
          onSubmit={(e) => {
            e.preventDefault()
            onClose()
          }}
        >
          <div className="grid grid-cols-1 gap-[var(--space-gutter)] md:grid-cols-2">
            <FormField label="Alias (ej. Casa, Oficina)" placeholder="Casa" />
            <FormField label="Destinatario" defaultValue="Alejandro Valls" readOnly />
          </div>

          <FormField label="Calle y número" placeholder="Ej. Calle de las Castañuelas, 45" fullWidth />

          <div className="grid grid-cols-2 gap-[var(--space-gutter)]">
            <FormField label="Piso / Puerta (Opcional)" placeholder="Ej. 4º Izq" />
            <FormField label="Código Postal" placeholder="03000" maxLength={5} />
          </div>

          <div className="grid grid-cols-2 gap-[var(--space-gutter)]">
            <FormField label="Localidad" placeholder="Alicante" />
            <div className="space-y-1.5">
              <label className="text-label-sm block uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                Provincia
              </label>
              <div className="relative">
                <select
                  defaultValue="Alicante"
                  className="text-body-md w-full appearance-none border border-[var(--color-outline-variant)] bg-transparent px-4 py-3 text-[var(--color-on-surface)] transition-all focus:border-[#7A2E3A] focus:ring-0 focus:outline-none"
                >
                  {provincias.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
                <ChevronDown size={16} strokeWidth={1.8} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
              </div>
            </div>
          </div>

          <FormField label="Teléfono de contacto (Opcional)" placeholder="+34 600 000 000" type="tel" fullWidth />

          <label className="group mt-4 flex cursor-pointer items-center gap-3">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                className="peer size-5 rounded-none border border-[var(--color-outline-variant)] bg-transparent transition-all checked:border-[#7A2E3A] checked:bg-[#7A2E3A] focus:ring-0 focus:ring-offset-0"
              />
              <Check size={14} strokeWidth={2} className="pointer-events-none absolute left-0.5 text-white opacity-0 peer-checked:opacity-100" />
            </div>
            <span className="text-body-md text-[var(--color-on-surface-variant)] transition-colors group-hover:text-[var(--color-on-surface)]">
              Marcar como dirección predeterminada
            </span>
          </label>

          <div className="flex flex-col gap-4 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] pt-6 sm:flex-row-reverse">
            <button
              type="submit"
              className="text-label-md w-full bg-[#7A2E3A] px-10 py-4 uppercase tracking-widest text-white transition-all hover:brightness-110 active:scale-95 sm:w-auto"
            >
              Guardar dirección
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-label-md w-full px-10 py-4 uppercase tracking-widest text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-on-surface)] sm:w-auto"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function FormField({
  label,
  placeholder,
  defaultValue,
  readOnly = false,
  fullWidth = false,
  type = 'text',
  maxLength,
}: {
  label: string
  placeholder?: string
  defaultValue?: string
  readOnly?: boolean
  fullWidth?: boolean
  type?: string
  maxLength?: number
}) {
  return (
    <div className={`space-y-1.5 ${fullWidth ? 'col-span-full' : ''} ${readOnly ? 'opacity-80' : ''}`}>
      <label className="text-label-sm block uppercase tracking-wider text-[var(--color-on-surface-variant)]">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        readOnly={readOnly}
        maxLength={maxLength}
        className={`text-body-md w-full border border-[var(--color-outline-variant)] px-4 py-3 placeholder:text-[var(--color-outline)] transition-all focus:border-[#7A2E3A] focus:ring-0 focus:outline-none ${readOnly ? 'cursor-not-allowed bg-[var(--color-surface-container-low)]' : 'bg-transparent'}`}
      />
    </div>
  )
}
