import { Info } from 'lucide-react'
import { EditorialSelectField, EditorialTextareaField, EditorialTextField } from './EditorialField'
import type { RegistrationWizardData } from './registrationWizard.types'

type ProducerInfoStepProps = {
  data: RegistrationWizardData
  onChange: (updates: Partial<RegistrationWizardData>) => void
}

const municipalities = ['Alicante', 'Altea', 'Dénia', 'Jijona', 'Elche']
const productTypes = [
  { slug: 'aceite-de-oliva', label: 'Aceites' },
  { slug: 'embutidos', label: 'Embutidos' },
  { slug: 'dulces-y-turrones', label: 'Turrones' },
  { slug: 'vino', label: 'Vinos' },
  { slug: 'queso', label: 'Quesos' },
  { slug: 'miel', label: 'Miel' },
]

export function ProducerInfoStep({ data, onChange }: ProducerInfoStepProps) {
  function toggleProductType(productTypeSlug: string) {
    const isSelected = data.productTypes.includes(productTypeSlug)
    onChange({
      productTypes: isSelected
        ? data.productTypes.filter((item) => item !== productTypeSlug)
        : [...data.productTypes, productTypeSlug],
    })
  }

  return (
    <main className="mx-auto flex w-full max-w-[var(--layout-container-max)] flex-1 flex-col items-center justify-center px-[var(--space-margin-mobile)] py-16 md:px-[var(--space-margin-desktop)]">
      <div className="w-full max-w-[540px]">
        <h1 className="text-display-lg mb-10 text-center text-[var(--color-on-background)]">Tu emprendimiento</h1>
        <form className="flex flex-col gap-8">
          <EditorialTextField
            id="producerName"
            name="producerName"
            label="Nombre del emprendimiento"
            hint="(Requerido)"
            placeholder="Ej. Aceites Altea"
            value={data.producerName}
            onChange={(event) => onChange({ producerName: event.target.value })}
          />
          <EditorialTextField
            id="producerNif"
            name="producerNif"
            label="NIF/CIF"
            hint="(Requerido)"
            placeholder="Ej. B12345678"
            value={data.producerNif}
            onChange={(event) => onChange({ producerNif: event.target.value.toUpperCase() })}
          />
          <EditorialSelectField
            id="municipality"
            name="municipality"
            label="Municipio de actividad"
            hint="(Requerido)"
            value={data.municipality}
            onChange={(event) => onChange({ municipality: event.target.value })}
          >
            <option value="">Seleccionar municipio</option>
            {municipalities.map((municipality) => (
              <option key={municipality} value={municipality}>
                {municipality}
              </option>
            ))}
          </EditorialSelectField>
          <EditorialTextField
            id="producerAddressLine1"
            name="producerAddressLine1"
            label="Dirección"
            hint="(Requerido)"
            placeholder="Ej. Calle Mayor 12"
            value={data.producerAddressLine1}
            onChange={(event) => onChange({ producerAddressLine1: event.target.value })}
          />
          <EditorialTextField
            id="producerAddressLine2"
            name="producerAddressLine2"
            label="Dirección adicional"
            placeholder="Ej. Local 2"
            value={data.producerAddressLine2}
            onChange={(event) => onChange({ producerAddressLine2: event.target.value })}
          />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <EditorialTextField
              id="producerPostalCode"
              name="producerPostalCode"
              label="Código postal"
              hint="(Requerido)"
              placeholder="Ej. 03001"
              value={data.producerPostalCode}
              onChange={(event) => onChange({ producerPostalCode: event.target.value })}
            />
            <EditorialTextField
              id="producerProvince"
              name="producerProvince"
              label="Provincia"
              hint="(Requerido)"
              placeholder="Ej. Alicante"
              value={data.producerProvince}
              onChange={(event) => onChange({ producerProvince: event.target.value })}
            />
          </div>
          <div>
            <p className="text-label-md mb-3 text-[var(--color-on-background)]">
              Tipos de producto <span className="font-normal text-[var(--color-outline)]">(Requerido)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {productTypes.map((productType) => {
                const isSelected = data.productTypes.includes(productType.slug)

                return (
                  <button
                    key={productType.slug}
                    type="button"
                    onClick={() => toggleProductType(productType.slug)}
                    className={[
                      'text-label-sm border px-4 py-2 transition-colors',
                      isSelected
                        ? 'border-transparent bg-[var(--color-primary-container)] text-[var(--color-surface)]'
                        : 'border-[var(--color-outline-variant)] bg-transparent text-[var(--color-on-surface-variant)] hover:border-[var(--color-on-background)]',
                    ].join(' ')}
                  >
                    {productType.label}
                  </button>
                )
              })}
            </div>
          </div>
          <EditorialTextareaField
            id="producerDescription"
            name="producerDescription"
            label="Descripción breve"
            hint="(Requerido)"
            placeholder="Cuenta la historia de tus productos..."
            rows={3}
            value={data.producerDescription}
            onChange={(event) => onChange({ producerDescription: event.target.value })}
          />
          <div className="flex items-start gap-3 border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-4 text-[var(--color-outline)]">
            <Info size={20} />
            <p className="text-label-sm leading-relaxed">
              El logotipo, la portada y las modalidades de entrega se completarán después en tu panel de productor.
            </p>
          </div>
        </form>
      </div>
    </main>
  )
}
