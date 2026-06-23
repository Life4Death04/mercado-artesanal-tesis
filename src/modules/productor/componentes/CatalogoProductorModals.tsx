import { useState } from 'react'
import { ChevronDown, ImagePlus, Trash2, TriangleAlert, X } from 'lucide-react'
import type { ProductoCatalogo } from '../pages/ProductosProductorPage'

// ---------------------------------------------------------------------------
// Shared overlay wrapper
// ---------------------------------------------------------------------------

function ModalOverlay({ children, zIndex = 50 }: { children: React.ReactNode; zIndex?: number }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-sm sm:p-6"
      style={{ zIndex, backgroundColor: 'rgba(28, 28, 24, 0.4)' }}
    >
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Modal 1: Añadir Producto
// ---------------------------------------------------------------------------

type AgregarProductoModalProps = {
  onClose: () => void
}

const CATEGORIAS = [
  'Dulces y Turrones',
  'Vinos de Alicante DO',
  'Aceite de Oliva Virgen Extra',
  'Salazones',
  'Conservas Artesanales',
  'Embutidos',
]

const ALERGENOS = [
  'Gluten',
  'Frutos de cáscara',
  'Lactosa',
  'Huevo',
  'Soja',
  'Pescado',
  'Mostaza',
  'Apio',
]

export function AgregarProductoModal({ onClose }: AgregarProductoModalProps) {
  const [selectedAlergens, setSelectedAlergens] = useState<Set<string>>(
    new Set(['Gluten', 'Frutos de cáscara']),
  )
  const [noAlergens, setNoAlergens] = useState(false)

  function toggleAlergen(name: string) {
    setSelectedAlergens((prev) => {
      const next = new Set(prev)
      if (next.has(name)) { next.delete(name) } else { next.add(name) }
      return next
    })
    setNoAlergens(false)
  }

  return (
    <ModalOverlay>
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-outline)] bg-[var(--color-surface)] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="agregar-producto-title"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-6 py-5">
          <h2 className="text-headline-md text-[24px] text-[var(--color-primary)]" id="agregar-producto-title">
            Añadir producto
          </h2>
          <button type="button" aria-label="Cerrar modal" onClick={onClose} className="rounded-full p-1 text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none">
            <X size={22} strokeWidth={1.8} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
            {/* Photo upload */}
            <div className="flex flex-col gap-2">
              <label className="text-label-md text-[var(--color-on-surface)]">Fotografía del producto</label>
              <div className="group flex cursor-pointer flex-col items-center justify-center rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] px-4 py-10 text-center transition-colors hover:bg-[var(--color-surface-container-low)]">
                <ImagePlus size={40} strokeWidth={1.4} className="mb-3 text-[var(--color-outline)] transition-colors group-hover:text-[var(--color-primary)]" />
                <p className="text-body-md text-[var(--color-on-surface)]">
                  Arrastra una imagen o{' '}
                  <span className="font-semibold text-[var(--color-primary)] underline decoration-1 underline-offset-2">explora</span>
                </p>
                <p className="text-label-sm mt-2 text-[var(--color-on-surface-variant)]">
                  Formatos recomendados: JPG, PNG de alta resolución. Mínimo 1080x1080px.
                </p>
              </div>
            </div>

            {/* Basic fields */}
            <div className="flex flex-col gap-6">
              <FormFieldLine id="product-name" label="Nombre del producto" placeholder="Ej. Turrón de Jijona Artesano" />

              <div className="flex flex-col gap-1.5">
                <label className="text-label-md text-[var(--color-on-surface)]" htmlFor="product-category">Categoría</label>
                <div className="relative">
                  <select
                    id="product-category"
                    defaultValue=""
                    className="text-body-md w-full cursor-pointer appearance-none border-0 border-b border-[var(--color-outline)] bg-transparent py-2 text-[var(--color-on-surface)] transition-colors hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] focus:ring-0 focus:outline-none"
                  >
                    <option value="" disabled>Selecciona una categoría</option>
                    {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={18} strokeWidth={1.8} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormFieldLine id="product-price" label="Precio unitario (€)" placeholder="0.00" type="number" />
                <FormFieldLine id="product-stock" label="Stock inicial" placeholder="0" type="number" />
              </div>

              <FormTextarea id="product-desc" label="Descripción" placeholder="Describe la historia, el proceso de elaboración y las notas de cata..." rows={3} />
              <FormTextarea id="product-ingredients" label="Ingredientes" placeholder="Enumera los ingredientes de mayor a menor cantidad..." rows={2} />
            </div>

            {/* Allergens */}
            <div className="flex flex-col gap-4 border-t border-[var(--color-outline-variant)] pt-6">
              <div>
                <h3 className="text-body-lg font-semibold text-[var(--color-primary)]">Alérgenos</h3>
                <p className="text-label-sm mt-1 text-[var(--color-on-surface-variant)]">Conforme al Reglamento (UE) 1169/2011</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {ALERGENOS.map((name) => {
                  const active = selectedAlergens.has(name)
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggleAlergen(name)}
                      className={`text-label-md rounded-full border px-3 py-1.5 transition-colors focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:outline-none ${active ? 'border-[var(--color-primary-container)] bg-[var(--color-primary-container)] text-[var(--color-on-primary)]' : 'border-[var(--color-outline)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)]'}`}
                    >
                      {name}
                    </button>
                  )
                })}
              </div>
              <label className="group mt-2 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={noAlergens}
                  onChange={(e) => {
                    setNoAlergens(e.target.checked)
                    if (e.target.checked) setSelectedAlergens(new Set())
                  }}
                  className="mt-1 size-4 rounded border-[var(--color-outline)] bg-transparent text-[var(--color-primary)] transition-colors focus:ring-[var(--color-primary)]"
                />
                <span className="text-body-md text-[var(--color-on-surface)] transition-colors group-hover:text-[var(--color-on-surface-variant)]">
                  No contiene alérgenos de declaración obligatoria
                </span>
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 flex flex-col items-center justify-end gap-3 border-t border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] px-6 py-4 sm:flex-row sm:gap-4">
          <button type="button" onClick={onClose} className="text-label-md w-full rounded-[var(--radius-lg)] px-5 py-2.5 text-[var(--color-on-surface-variant)] transition-colors hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none sm:w-auto">
            Cancelar
          </button>
          <button type="button" className="text-label-md w-full rounded-[var(--radius-lg)] border border-[var(--color-outline)] px-5 py-2.5 text-[var(--color-on-surface)] transition-colors hover:border-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none sm:w-auto">
            Guardar borrador
          </button>
          <button type="submit" className="text-label-md w-full rounded-[var(--radius-lg)] bg-[var(--color-primary)] px-6 py-2.5 text-[var(--color-on-primary)] shadow-sm transition-colors hover:bg-[var(--color-surface-tint)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:outline-none sm:w-auto">
            Guardar y publicar
          </button>
        </div>
      </div>
    </ModalOverlay>
  )
}

// ---------------------------------------------------------------------------
// Modal 2: Eliminar Producto
// ---------------------------------------------------------------------------

type EliminarProductoModalProps = {
  producto: ProductoCatalogo
  onClose: () => void
  onConfirm: () => void
}

export function EliminarProductoModal({ producto, onClose, onConfirm }: EliminarProductoModalProps) {
  return (
    <ModalOverlay zIndex={55}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] shadow-[0_8px_30px_rgba(28,28,24,0.12)]"
        style={{ animation: 'modalFadeIn 0.3s ease-out forwards' }}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="eliminar-producto-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[var(--color-outline-variant)]/50 px-8 pb-6 pt-8">
          <div className="flex items-center gap-3 text-[var(--color-error)]">
            <TriangleAlert size={26} strokeWidth={1.8} />
            <h2 className="text-headline-md text-[24px] text-[var(--color-on-surface)]" id="eliminar-producto-title">
              Eliminar producto
            </h2>
          </div>
          <button type="button" aria-label="Cerrar" onClick={onClose} className="p-1 text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-on-surface)]">
            <X size={22} strokeWidth={1.8} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          <p className="text-body-md mb-6 text-[var(--color-on-surface-variant)]">
            ¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer.
          </p>

          {/* Product summary card */}
          <div className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)]/50 bg-[var(--color-surface-container-low)] p-4">
            <div className="size-20 flex-shrink-0 overflow-hidden rounded-[var(--radius-default)] border border-[var(--color-outline-variant)]/50">
              <img src={producto.imagen} alt={producto.nombre} className="size-full object-cover" />
            </div>
            <div className="min-w-0 flex-grow">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="text-label-sm rounded-full bg-[var(--color-surface-variant)] px-2 py-0.5 uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                  {producto.categoria}
                </span>
                {producto.denominacion && (
                  <span className="text-label-sm rounded-full bg-[var(--color-surface-variant)] px-2 py-0.5 uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                    {producto.denominacion}
                  </span>
                )}
              </div>
              <h3 className="text-headline-md truncate text-[18px] leading-6 text-[var(--color-on-surface)]">
                {producto.nombre}
              </h3>
              <p className="text-label-md text-[var(--color-on-surface-variant)]">{producto.precio}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 border-t border-[var(--color-outline-variant)]/50 bg-[var(--color-surface-container-low)] px-8 py-6">
          <button type="button" onClick={onClose} className="text-label-md rounded-[var(--radius-default)] border border-[var(--color-secondary)] px-6 py-2.5 text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-variant)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none">
            Cancelar
          </button>
          <button type="button" onClick={onConfirm} className="text-label-md flex items-center gap-2 rounded-[var(--radius-default)] bg-[var(--color-error)] px-6 py-2.5 text-[var(--color-on-error)] shadow-[0_4px_12px_rgba(186,26,26,0.2)] transition-colors hover:bg-[#a31616] focus:ring-2 focus:ring-[var(--color-error)] focus:outline-none">
            <Trash2 size={16} strokeWidth={1.8} />
            Eliminar
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.98) translateY(10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </ModalOverlay>
  )
}

// ---------------------------------------------------------------------------
// Modal 3: Aviso de stock inicial (publicar sin stock)
// ---------------------------------------------------------------------------

type AvisoStockModalProps = {
  onClose: () => void
  onPublish: () => void
}

export function AvisoStockModal({ onClose, onPublish }: AvisoStockModalProps) {
  return (
    <ModalOverlay zIndex={60}>
      <div
        className="w-full max-w-lg border border-[var(--color-outline-variant)]/20 p-8 shadow-2xl md:p-10"
        style={{ background: 'rgba(252, 249, 242, 0.95)', backdropFilter: 'blur(12px)' }}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="aviso-stock-title"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-6 flex size-16 items-center justify-center rounded-full border border-[var(--color-outline-variant)]/30 bg-[var(--color-secondary-container)]">
            <TriangleAlert size={30} strokeWidth={1.6} className="text-[var(--color-secondary)]" />
          </div>
          <h2 className="text-headline-md tracking-tight text-[var(--color-on-surface)]" id="aviso-stock-title">
            Publicar sin stock
          </h2>
        </div>

        <div className="relative mb-8 overflow-hidden border border-[var(--color-outline-variant)]/50 bg-[var(--color-surface-container-low)] p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1c1c18 1px, transparent 0)', backgroundSize: '8px 8px' }}
          />
          <p className="text-body-md relative z-10 text-center leading-relaxed text-[var(--color-on-surface-variant)]">
            Este producto no tiene unidades disponibles. Si lo publicas, se mostrará como{' '}
            <span className="font-medium text-[var(--color-on-surface)]">«Sin disponibilidad»</span>{' '}
            y los clientes no podrán comprarlo hasta que repongas stock.
          </p>
        </div>

        <div className="mt-8 flex flex-col justify-end gap-4 border-t border-[var(--color-outline-variant)]/30 pt-8 sm:flex-row">
          <button type="button" onClick={onClose} className="text-label-md w-full border border-[var(--color-outline)] px-6 py-3 text-[var(--color-on-surface)] transition-colors duration-200 hover:bg-[var(--color-surface-container-high)] sm:w-auto">
            Ajustar stock
          </button>
          <button type="button" onClick={onPublish} className="text-label-md w-full bg-[var(--color-primary)] px-6 py-3 text-[var(--color-on-primary)] shadow-[0_4px_14px_rgba(93,24,37,0.15)] transition-all duration-200 hover:bg-[var(--color-surface-tint)] hover:shadow-[0_6px_20px_rgba(93,24,37,0.25)] sm:w-auto">
            Publicar igualmente
          </button>
        </div>
      </div>
    </ModalOverlay>
  )
}

// ---------------------------------------------------------------------------
// Shared small components
// ---------------------------------------------------------------------------

function FormFieldLine({ id, label, placeholder, type = 'text' }: { id: string; label: string; placeholder?: string; type?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-label-md text-[var(--color-on-surface)]" htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="text-body-md w-full border-0 border-b border-[var(--color-outline)] bg-transparent py-2 text-[var(--color-on-surface)] transition-colors placeholder:text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] focus:ring-0 focus:outline-none"
      />
    </div>
  )
}

function FormTextarea({ id, label, placeholder, rows }: { id: string; label: string; placeholder?: string; rows?: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-label-md text-[var(--color-on-surface)]" htmlFor={id}>{label}</label>
      <textarea
        id={id}
        rows={rows ?? 3}
        placeholder={placeholder}
        className="text-body-md w-full resize-y rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-3 text-[var(--color-on-surface)] transition-colors placeholder:text-[var(--color-on-surface-variant)] hover:border-[var(--color-outline)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none"
      />
    </div>
  )
}
