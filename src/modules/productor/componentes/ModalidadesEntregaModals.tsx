import { MapPin, Trash2, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { pickupPointFormSchema } from '../entregas/entregas.schema'
import type { PickupPointFormValues } from '../entregas/entregas.schema'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PuntoRecogida = {
  id: string
  nombre: string
  calle: string
  municipio: string
  codigoPostal: string
  horario: string
  indicaciones?: string
}

// ---------------------------------------------------------------------------
// Añadir punto de recogida modal — wired to RHF + Zod (spec R5, R6)
//
// Uses useForm<z.input<...>, unknown, z.output<...>> so RHF field state is
// typed as strings (raw DOM input) and onSubmit receives the validated output.
// No resolver casts — see productos.schema.ts for the established pattern.
// ---------------------------------------------------------------------------

type AgregarPuntoModalProps = {
  onClose: () => void
  onConfirm: (punto: Omit<PuntoRecogida, 'id'>) => void
}

export function AgregarPuntoModal({ onClose, onConfirm }: AgregarPuntoModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<
    { nombre: string; calle: string; municipio: string; codigoPostal: string; horario: string; indicaciones?: string | null },
    unknown,
    PickupPointFormValues
  >({
    resolver: zodResolver(pickupPointFormSchema),
    defaultValues: {
      nombre: '',
      calle: '',
      municipio: '',
      codigoPostal: '',
      horario: '',
      indicaciones: '',
    },
  })

  function onSubmit(values: PickupPointFormValues) {
    onConfirm({
      nombre: values.nombre,
      calle: values.calle,
      municipio: values.municipio,
      codigoPostal: values.codigoPostal,
      horario: values.horario,
      indicaciones: values.indicaciones ?? undefined,
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-16"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-agregar-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[var(--color-inverse-surface)]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)] shadow-2xl">
        {/* Close button */}
        <button
          type="button"
          aria-label="Cerrar modal"
          onClick={onClose}
          className="absolute top-6 right-6 text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-primary)]"
        >
          <X size={20} strokeWidth={1.8} />
        </button>

        {/* Header */}
        <div className="border-b border-[var(--color-surface-variant)] px-8 pt-10 pb-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface-container)]">
            <MapPin size={20} strokeWidth={1.8} className="text-[var(--color-primary)]" />
          </div>
          <h2
            id="modal-agregar-title"
            className="text-headline-md text-[var(--color-primary)]"
          >
            Añadir punto de recogida
          </h2>
          <p className="text-body-md mt-2 text-[var(--color-on-surface-variant)]">
            Introduce los detalles del nuevo punto de recogida para tus clientes.
          </p>
        </div>

        {/* Form body */}
        <form id="form-agregar-punto" onSubmit={handleSubmit(onSubmit)}>
          <div className="max-h-[60vh] overflow-y-auto px-8 py-8">
            <div className="flex flex-col gap-8">
              {/* Nombre */}
              <RhfInputField
                id="nombre"
                label="Nombre del punto"
                placeholder="Ej: Tienda Finca Alicante"
                registration={register('nombre')}
                error={errors.nombre?.message}
              />

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <RhfInputField
                  id="calle"
                  label="Calle y número"
                  placeholder="Av. de la Estación, 5"
                  registration={register('calle')}
                  error={errors.calle?.message}
                />
                <RhfInputField
                  id="municipio"
                  label="Municipio"
                  placeholder="Alicante"
                  registration={register('municipio')}
                  error={errors.municipio?.message}
                />
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <RhfInputField
                  id="codigoPostal"
                  label="Código postal"
                  placeholder="03003"
                  registration={register('codigoPostal')}
                  error={errors.codigoPostal?.message}
                />
                <RhfInputField
                  id="horario"
                  label="Horario de atención"
                  placeholder="Lunes a Viernes 09:00 – 20:00"
                  registration={register('horario')}
                  error={errors.horario?.message}
                />
              </div>

              {/* Indicaciones */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="indicaciones"
                  className="text-label-md uppercase tracking-widest text-[var(--color-secondary)]"
                >
                  Indicaciones adicionales{' '}
                  <span className="font-normal normal-case tracking-normal text-[var(--color-on-surface-variant)]">
                    (Opcional)
                  </span>
                </label>
                <textarea
                  id="indicaciones"
                  rows={3}
                  maxLength={1000}
                  placeholder="Instrucciones para encontrar el local, parking cercano..."
                  className="resize-none border-b border-[var(--color-outline-variant)] bg-transparent pt-2 text-body-md text-[var(--color-on-surface)] placeholder-[var(--color-secondary)] focus:border-[var(--color-primary)] focus:outline-none"
                  {...register('indicaciones')}
                />
                {errors.indicaciones ? (
                  <p className="text-body-sm text-[var(--color-error)]">
                    {errors.indicaciones.message}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 border-t border-[var(--color-surface-variant)] bg-[var(--color-surface-container-low)] px-8 py-6">
            <button
              type="button"
              onClick={onClose}
              className="text-label-md rounded-[var(--radius-default)] border border-[var(--color-outline)] px-6 py-3 text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-variant)]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="text-label-md rounded-[var(--radius-default)] bg-[var(--color-primary)] px-6 py-3 text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary-container)]"
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
// Eliminar punto de recogida modal — unchanged UX, no form submission
// ---------------------------------------------------------------------------

type EliminarPuntoModalProps = {
  nombrePunto: string
  onClose: () => void
  onConfirm: () => void
}

export function EliminarPuntoModal({ nombrePunto, onClose, onConfirm }: EliminarPuntoModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-eliminar-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[var(--color-inverse-surface)]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] shadow-2xl">
        <div className="px-6 pt-8 pb-6 sm:p-8 sm:pb-6">
          <div className="flex items-start gap-5">
            {/* Error icon */}
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-error-container)]">
              <Trash2 size={20} strokeWidth={1.8} className="text-[var(--color-error)]" />
            </div>

            {/* Content */}
            <div>
              <h3
                id="modal-eliminar-title"
                className="text-headline-sm text-[var(--color-on-surface)]"
              >
                Eliminar punto de recogida
              </h3>
              <p className="text-body-md mt-3 text-[var(--color-on-surface-variant)]">
                ¿Estás seguro de que deseas eliminar el punto de recogida{' '}
                <span className="font-semibold text-[var(--color-on-surface)]">"{nombrePunto}"</span>?
                Esta acción no se puede deshacer.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] px-6 py-4 sm:flex-row sm:justify-end sm:gap-4 sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="text-label-md rounded-[var(--radius-default)] border border-[var(--color-outline)] px-6 py-3 text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-container)]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => { onConfirm(); onClose() }}
            className="text-label-md rounded-[var(--radius-default)] bg-[var(--color-error)] px-6 py-3 text-[var(--color-on-error)] transition-colors hover:opacity-90"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

type RhfInputFieldProps = {
  id: string
  label: string
  placeholder?: string
  registration: ReturnType<ReturnType<typeof useForm>['register']>
  error?: string
}

function RhfInputField({ id, label, placeholder, registration, error }: RhfInputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-label-md uppercase tracking-widest text-[var(--color-secondary)]"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        className="border-b border-[var(--color-outline-variant)] bg-transparent text-body-lg text-[var(--color-on-surface)] placeholder-[var(--color-secondary)] focus:border-[var(--color-primary)] focus:outline-none"
        {...registration}
      />
      {error ? (
        <p className="text-body-sm text-[var(--color-error)]">{error}</p>
      ) : null}
    </div>
  )
}
