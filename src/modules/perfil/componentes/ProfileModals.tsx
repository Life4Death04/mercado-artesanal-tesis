import { useState } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import type { Address, CreateAddressInput, UpdateAddressInput } from '../direcciones.schema'

const provincias = ['Alicante', 'Valencia', 'Castellón', 'Murcia']

type EditarDireccionModalProps = {
  address: Address
  onClose: () => void
  onSave: (updates: UpdateAddressInput) => void
  error?: string | null
  isSaving?: boolean
}

export function EditarDireccionModal({ address, onClose, onSave, error = null, isSaving = false }: EditarDireccionModalProps) {
  const [line1, setLine1] = useState(address.line1)
  const [line2, setLine2] = useState(address.line2 ?? '')
  const [postalCode, setPostalCode] = useState(address.postalCode)
  const [city, setCity] = useState(address.city)
  const [province, setProvince] = useState(address.province)
  const [isDefault, setIsDefault] = useState(address.isDefault)

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[var(--color-on-surface)]/40 p-4 backdrop-blur-[1px] sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-address-title"
    >
      <div className="relative my-auto w-full max-w-[600px] overflow-hidden bg-[#FAF7F0] shadow-2xl">
        <button
          type="button"
          aria-label="Cerrar modal"
          onClick={onClose}
          className="absolute top-6 right-6 z-10 text-[var(--color-on-surface-variant)] transition-colors hover:text-[#7A2E3A]"
        >
          <X size={26} strokeWidth={1.6} />
        </button>

        <div className="border-b border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] px-10 pt-10 pb-6">
          <h2 className="text-headline-md text-[var(--color-on-surface)]" id="edit-address-title">
            Editar dirección
          </h2>
          <p className="text-body-md mt-2 text-[var(--color-on-surface-variant)]">
            Modifica los datos de esta dirección de envío.
          </p>
        </div>

        <form
          className="space-y-6 p-10"
          onSubmit={(e) => {
            e.preventDefault()
            const normalizedLine2 = line2.trim().length > 0 ? line2 : null
            const updates: UpdateAddressInput = {}

            if (line1 !== address.line1) updates.line1 = line1
            if (normalizedLine2 !== address.line2) updates.line2 = normalizedLine2
            if (postalCode !== address.postalCode) updates.postalCode = postalCode
            if (city !== address.city) updates.city = city
            if (province !== address.province) updates.province = province
            if (isDefault !== address.isDefault) updates.isDefault = isDefault

            onSave(updates)
          }}
        >
          <FormField id="edit-address-line1" label="Calle y número" value={line1} onChange={setLine1} placeholder="Ej. Calle del Teatro, 14" fullWidth />

          <div className="grid grid-cols-2 gap-[var(--space-gutter)]">
            <FormField id="edit-address-line2" label="Piso / Puerta (Opcional)" value={line2} onChange={setLine2} placeholder="Ej. 3º Izquierda" />
            <FormField id="edit-address-postal-code" label="Código Postal" value={postalCode} onChange={setPostalCode} placeholder="03001" maxLength={5} />
          </div>

          <div className="grid grid-cols-2 gap-[var(--space-gutter)]">
            <FormField id="edit-address-city" label="Localidad" value={city} onChange={setCity} placeholder="Alicante" />
            <ProvinceField id="edit-address-province" value={province} onChange={setProvince} />
          </div>

          <DefaultAddressCheckbox checked={isDefault} onChange={setIsDefault} />

          {error ? (
            <p role="alert" className="text-label-sm text-[var(--color-error)]">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col gap-4 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] pt-6 sm:flex-row-reverse">
            <button
              type="submit"
              disabled={isSaving}
              className="text-label-md w-full bg-[#7A2E3A] px-10 py-4 uppercase tracking-widest text-white transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isSaving ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="text-label-md w-full px-10 py-4 uppercase tracking-widest text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-on-surface)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

type AgregarDireccionModalProps = {
  onClose: () => void
  onSave: (address: CreateAddressInput) => void
  error?: string | null
  isSaving?: boolean
}

export function AgregarDireccionModal({ onClose, onSave, error = null, isSaving = false }: AgregarDireccionModalProps) {
  const [line1, setLine1] = useState('')
  const [line2, setLine2] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [city, setCity] = useState('Alicante')
  const [province, setProvince] = useState('Alicante')
  const [isDefault, setIsDefault] = useState(false)

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[var(--color-on-surface)]/40 p-4 backdrop-blur-[1px] sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-address-title"
    >
      <div className="relative my-auto w-full max-w-[600px] overflow-hidden bg-[var(--color-background)] shadow-2xl">
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
            onSave({ line1, line2: line2.trim().length > 0 ? line2 : null, postalCode, city, province, isDefault })
          }}
        >
          <FormField id="add-address-line1" label="Calle y número" value={line1} onChange={setLine1} placeholder="Ej. Calle de las Castañuelas, 45" fullWidth />

          <div className="grid grid-cols-2 gap-[var(--space-gutter)]">
            <FormField id="add-address-line2" label="Piso / Puerta (Opcional)" value={line2} onChange={setLine2} placeholder="Ej. 4º Izq" />
            <FormField id="add-address-postal-code" label="Código Postal" value={postalCode} onChange={setPostalCode} placeholder="03000" maxLength={5} />
          </div>

          <div className="grid grid-cols-2 gap-[var(--space-gutter)]">
            <FormField id="add-address-city" label="Localidad" value={city} onChange={setCity} placeholder="Alicante" />
            <ProvinceField id="add-address-province" value={province} onChange={setProvince} />
          </div>

          <DefaultAddressCheckbox checked={isDefault} onChange={setIsDefault} />

          {error ? (
            <p role="alert" className="text-label-sm text-[var(--color-error)]">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col gap-4 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] pt-6 sm:flex-row-reverse">
            <button
              type="submit"
              disabled={isSaving}
              className="text-label-md w-full bg-[#7A2E3A] px-10 py-4 uppercase tracking-widest text-white transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isSaving ? 'Guardando...' : 'Guardar dirección'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="text-label-md w-full px-10 py-4 uppercase tracking-widest text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-on-surface)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DefaultAddressCheckbox({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="group mt-4 flex cursor-pointer items-center gap-3">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer size-5 rounded-none border border-[var(--color-outline-variant)] bg-transparent transition-all checked:border-[#7A2E3A] checked:bg-[#7A2E3A] focus:ring-0 focus:ring-offset-0"
        />
        <Check size={14} strokeWidth={2} className="pointer-events-none absolute left-0.5 text-white opacity-0 peer-checked:opacity-100" />
      </div>
      <span className="text-body-md text-[var(--color-on-surface-variant)] transition-colors group-hover:text-[var(--color-on-surface)]">
        Marcar como dirección predeterminada
      </span>
    </label>
  )
}

function ProvinceField({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-label-sm block uppercase tracking-wider text-[var(--color-on-surface-variant)]">
        Provincia
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="text-body-md w-full appearance-none border border-[var(--color-outline-variant)] bg-transparent px-4 py-3 text-[var(--color-on-surface)] transition-all focus:border-[#7A2E3A] focus:ring-0 focus:outline-none"
        >
          {provincias.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <ChevronDown size={16} strokeWidth={1.8} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
      </div>
    </div>
  )
}

function FormField({
  id,
  label,
  placeholder,
  value,
  onChange,
  fullWidth = false,
  maxLength,
}: {
  id: string
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  fullWidth?: boolean
  maxLength?: number
}) {
  return (
    <div className={`space-y-1.5 ${fullWidth ? 'col-span-full' : ''}`}>
      <label htmlFor={id} className="text-label-sm block uppercase tracking-wider text-[var(--color-on-surface-variant)]">
        {label}
      </label>
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={maxLength}
        className="text-body-md w-full border border-[var(--color-outline-variant)] bg-transparent px-4 py-3 placeholder:text-[var(--color-outline)] transition-all focus:border-[#7A2E3A] focus:ring-0 focus:outline-none"
      />
    </div>
  )
}
