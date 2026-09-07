import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, ImagePlus, Loader2, Pencil, Trash2, TriangleAlert, Upload, X } from 'lucide-react'
import { resolveErrorMessage } from '../../../lib/errorMessages'
import { useCategoriesQuery } from '../../productos/hooks/useCategoriesQuery'
import { useUploadProductoImageMutation } from '../productos/hooks/useUploadProductoImageMutation'
import { createProductoFormSchema, updateProductoFormSchema } from '../productos/productos.schema'
import type {
  CreateProductoFormInput,
  CreateProductoFormValues,
  ProductDTO,
  UpdateProductoFormInput,
  UpdateProductoFormValues,
} from '../productos/productos.schema'
import type { UseMutationResult } from '@tanstack/react-query'

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
  createMutation: UseMutationResult<ProductDTO, Error, CreateProductoFormValues, unknown>
}

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

export function AgregarProductoModal({ onClose, createMutation }: AgregarProductoModalProps) {
  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesQuery()
  const [selectedAlergens, setSelectedAlergens] = useState<Set<string>>(new Set())
  const [noAlergens, setNoAlergens] = useState(false)

  // Image upload state — wired after product creation (requires productId)
  const [createdProductId, setCreatedProductId] = useState<string | null>(null)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const uploadImageMutation = useUploadProductoImageMutation()

  // useForm uses input/output generics so that:
  //   - TFieldValues (input) = z.input<schema>: RHF stores raw DOM strings in field state
  //   - TTransformedValues (output) = z.output<schema>: Zod coerces to numbers in onSubmit
  // zodResolver handles the coercion at validation time — no valueAsNumber, no resolver cast.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProductoFormInput, unknown, CreateProductoFormValues>({
    resolver: zodResolver(createProductoFormSchema),
    defaultValues: {
      stock: '0',
      allergens: [],
    },
  })

  function toggleAlergen(name: string) {
    setSelectedAlergens((prev) => {
      const next = new Set(prev)
      if (next.has(name)) {
        next.delete(name)
      } else {
        next.add(name)
      }
      return next
    })
    setNoAlergens(false)
  }

  function onSubmit(values: CreateProductoFormValues) {
    const body: CreateProductoFormValues = {
      ...values,
      allergens: noAlergens ? [] : [...selectedAlergens],
    }
    createMutation.mutate(body, {
      onSuccess: (product) => {
        if (selectedImageFile) {
          // Upload the selected image using the newly created product's id.
          // Modal stays open during the upload; onClose() is called after
          // the upload completes (or immediately if no file was selected).
          setCreatedProductId(product.id)
          uploadImageMutation.mutate(
            { productId: product.id, file: selectedImageFile },
            { onSettled: () => onClose() },
          )
        } else {
          onClose()
        }
      },
    })
  }

  function handleImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setSelectedImageFile(file)
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
          <button
            type="button"
            aria-label="Cerrar modal"
            onClick={onClose}
            className="rounded-full p-1 text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
          >
            <X size={22} strokeWidth={1.8} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Mutation error */}
          {createMutation.isError ? (
            <div role="alert" aria-live="assertive" className="mb-6 flex items-start gap-3 rounded-[var(--radius-lg)] border border-red-200 bg-red-50 px-5 py-4 text-[var(--color-error)]">
              <TriangleAlert size={18} strokeWidth={1.8} className="mt-0.5 shrink-0" />
              <p className="text-body-md">{resolveErrorMessage(createMutation.error)}</p>
            </div>
          ) : null}

          <form id="agregar-producto-form" className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
            {/* Photo upload — single-file presign/confirm flow.
                Multi-image, drag-and-drop, and progress bar are deferred. */}
            <div className="flex flex-col gap-2">
              <label className="text-label-md text-[var(--color-on-surface)]">Fotografía del producto</label>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={handleImageFileChange}
                aria-label="Seleccionar imagen del producto"
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploadImageMutation.isPending || !!createdProductId}
                className="group flex cursor-pointer flex-col items-center justify-center rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] px-4 py-10 text-center transition-colors hover:bg-[var(--color-surface-container-low)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploadImageMutation.isPending ? (
                  <>
                    <Loader2 size={40} strokeWidth={1.4} className="mb-3 animate-spin text-[var(--color-primary)]" />
                    <p className="text-body-md text-[var(--color-on-surface)]">Subiendo imagen…</p>
                  </>
                ) : selectedImageFile ? (
                  <>
                    <Upload size={40} strokeWidth={1.4} className="mb-3 text-[var(--color-primary)]" />
                    <p className="text-body-md text-[var(--color-on-surface)]">{selectedImageFile.name}</p>
                    <p className="text-label-sm mt-2 text-[var(--color-on-surface-variant)]">
                      Haz clic para cambiar la imagen
                    </p>
                  </>
                ) : (
                  <>
                    <ImagePlus size={40} strokeWidth={1.4} className="mb-3 text-[var(--color-outline)] transition-colors group-hover:text-[var(--color-primary)]" />
                    <p className="text-body-md text-[var(--color-on-surface)]">
                      Selecciona una fotografía (opcional)
                    </p>
                    <p className="text-label-sm mt-2 text-[var(--color-on-surface-variant)]">
                      JPG, PNG o WebP · máx. 5 MB
                    </p>
                  </>
                )}
              </button>
              {uploadImageMutation.isError ? (
                <p className="text-label-sm text-[var(--color-error)]">
                  {resolveErrorMessage(uploadImageMutation.error)}
                </p>
              ) : null}
            </div>

            {/* Basic fields */}
            <div className="flex flex-col gap-6">
              <FormFieldLine
                id="product-name"
                label="Nombre del producto"
                placeholder="Ej. Turrón de Jijona Artesano"
                error={errors.name?.message}
                {...register('name')}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-label-md text-[var(--color-on-surface)]" htmlFor="product-category">
                  Categoría
                </label>
                <div className="relative">
                  <select
                    id="product-category"
                    className="text-body-md w-full cursor-pointer appearance-none border-0 border-b border-[var(--color-outline)] bg-transparent py-2 text-[var(--color-on-surface)] transition-colors hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] focus:ring-0 focus:outline-none"
                    disabled={categoriesLoading}
                    {...register('categoryId')}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={18} strokeWidth={1.8} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
                </div>
                {errors.categoryId ? <p className="text-label-sm text-[var(--color-error)]">{errors.categoryId.message}</p> : null}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormFieldLine
                  id="product-price"
                  label="Precio unitario (€)"
                  placeholder="0.00"
                  type="text"
                  inputMode="decimal"
                  error={errors.price?.message}
                  {...register('price')}
                />
                <FormFieldLine
                  id="product-stock"
                  label="Stock inicial"
                  placeholder="0"
                  type="number"
                  min="0"
                  error={errors.stock?.message}
                  {...register('stock')}
                />
              </div>

              <FormTextarea
                id="product-desc"
                label="Descripción"
                placeholder="Describe la historia, el proceso de elaboración y las notas de cata..."
                rows={3}
                error={errors.description?.message}
                {...register('description')}
              />
              <FormTextarea
                id="product-ingredients"
                label="Ingredientes"
                placeholder="Enumera los ingredientes de mayor a menor cantidad..."
                rows={2}
                {...register('ingredients')}
              />
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
          <button
            type="button"
            onClick={onClose}
            className="text-label-md w-full rounded-[var(--radius-lg)] px-5 py-2.5 text-[var(--color-on-surface-variant)] transition-colors hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none sm:w-auto"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="agregar-producto-form"
            disabled={createMutation.isPending}
            className="text-label-md inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] bg-[var(--color-primary)] px-6 py-2.5 text-[var(--color-on-primary)] shadow-sm transition-colors hover:bg-[var(--color-surface-tint)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:outline-none disabled:opacity-60 sm:w-auto"
          >
            {createMutation.isPending ? <Loader2 size={16} strokeWidth={2} className="animate-spin" /> : null}
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
  producto: ProductDTO
  isPending: boolean
  onClose: () => void
  onConfirm: () => void
}

export function EliminarProductoModal({ producto, isPending, onClose, onConfirm }: EliminarProductoModalProps) {
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
            <div className="min-w-0 flex-grow">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="text-label-sm rounded-full bg-[var(--color-surface-variant)] px-2 py-0.5 uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                  {producto.categoryId}
                </span>
              </div>
              <h3 className="text-headline-md truncate text-[18px] leading-6 text-[var(--color-on-surface)]">
                {producto.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 border-t border-[var(--color-outline-variant)]/50 bg-[var(--color-surface-container-low)] px-8 py-6">
          <button type="button" onClick={onClose} className="text-label-md rounded-[var(--radius-default)] border border-[var(--color-secondary)] px-6 py-2.5 text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-variant)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none">
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="text-label-md inline-flex items-center gap-2 rounded-[var(--radius-default)] bg-[var(--color-error)] px-6 py-2.5 text-[var(--color-on-error)] shadow-[0_4px_12px_rgba(186,26,26,0.2)] transition-colors hover:bg-[#a31616] focus:ring-2 focus:ring-[var(--color-error)] focus:outline-none disabled:opacity-60"
          >
            {isPending ? <Loader2 size={16} strokeWidth={2} className="animate-spin" /> : <Trash2 size={16} strokeWidth={1.8} />}
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
  isPending: boolean
  onClose: () => void
  onPublish: () => void
}

export function AvisoStockModal({ isPending, onClose, onPublish }: AvisoStockModalProps) {
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
          <button
            type="button"
            onClick={onPublish}
            disabled={isPending}
            className="text-label-md inline-flex w-full items-center justify-center gap-2 bg-[var(--color-primary)] px-6 py-3 text-[var(--color-on-primary)] shadow-[0_4px_14px_rgba(93,24,37,0.15)] transition-all duration-200 hover:bg-[var(--color-surface-tint)] hover:shadow-[0_6px_20px_rgba(93,24,37,0.25)] disabled:opacity-60 sm:w-auto"
          >
            {isPending ? <Loader2 size={16} strokeWidth={2} className="animate-spin" /> : null}
            Publicar igualmente
          </button>
        </div>
      </div>
    </ModalOverlay>
  )
}

// ---------------------------------------------------------------------------
// Modal 4: Editar Producto
// ---------------------------------------------------------------------------

type EditarProductoModalProps = {
  producto: ProductDTO
  onClose: () => void
  updateMutation: UseMutationResult<ProductDTO, Error, { id: string; body: UpdateProductoFormValues }, unknown>
}

export function EditarProductoModal({ producto, onClose, updateMutation }: EditarProductoModalProps) {
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const uploadImageMutation = useUploadProductoImageMutation()

  // Input/output generics: RHF stores raw strings in state; Zod coerces on submit.
  // No resolver cast needed — zodResolver v5 handles the input→output transformation.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProductoFormInput, unknown, UpdateProductoFormValues>({
    resolver: zodResolver(updateProductoFormSchema),
    defaultValues: {
      name: producto.name,
      description: producto.description,
      price: producto.price,
      // Coerce defaultValues to string since UpdateProductoFormInput expects DOM-compatible strings
      stock: String(producto.stock),
      ingredients: producto.ingredients ?? '',
    },
  })

  function handleImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setSelectedImageFile(file)
  }

  function onSubmit(values: UpdateProductoFormValues) {
    updateMutation.mutate(
      { id: producto.id, body: values },
      {
        onSuccess: () => {
          if (selectedImageFile) {
            uploadImageMutation.mutate(
              { productId: producto.id, file: selectedImageFile },
              { onSettled: () => onClose() },
            )
          } else {
            onClose()
          }
        },
      },
    )
  }

  return (
    <ModalOverlay zIndex={65}>
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-outline)] bg-[var(--color-surface)] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="editar-producto-title"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-6 py-5">
          <div className="flex items-center gap-3">
            <Pencil size={20} strokeWidth={1.8} className="text-[var(--color-primary)]" />
            <h2 className="text-headline-md text-[24px] text-[var(--color-primary)]" id="editar-producto-title">
              Editar publicación
            </h2>
          </div>
          <button type="button" aria-label="Cerrar modal" onClick={onClose} className="rounded-full p-1 text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-primary)]">
            <X size={22} strokeWidth={1.8} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Mutation error */}
          {updateMutation.isError ? (
            <div role="alert" aria-live="assertive" className="mb-6 flex items-start gap-3 rounded-[var(--radius-lg)] border border-red-200 bg-red-50 px-5 py-4 text-[var(--color-error)]">
              <TriangleAlert size={18} strokeWidth={1.8} className="mt-0.5 shrink-0" />
              <p className="text-body-md">{resolveErrorMessage(updateMutation.error)}</p>
            </div>
          ) : null}

          {/* Image upload — single-file, triggered before save (optional) */}
          <div className="mb-6 flex flex-col gap-2">
            <p className="text-label-md text-[var(--color-on-surface)]">Fotografía del producto</p>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handleImageFileChange}
              aria-label="Seleccionar imagen del producto"
            />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploadImageMutation.isPending}
              className="group flex cursor-pointer flex-col items-center justify-center rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] px-4 py-6 text-center transition-colors hover:bg-[var(--color-surface-container-low)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploadImageMutation.isPending ? (
                <>
                  <Loader2 size={28} strokeWidth={1.4} className="mb-2 animate-spin text-[var(--color-primary)]" />
                  <p className="text-body-md text-[var(--color-on-surface)]">Subiendo imagen…</p>
                </>
              ) : selectedImageFile ? (
                <>
                  <Upload size={28} strokeWidth={1.4} className="mb-2 text-[var(--color-primary)]" />
                  <p className="text-body-md text-[var(--color-on-surface)]">{selectedImageFile.name}</p>
                  <p className="text-label-sm mt-1 text-[var(--color-on-surface-variant)]">Haz clic para cambiar</p>
                </>
              ) : (
                <>
                  <ImagePlus size={28} strokeWidth={1.4} className="mb-2 text-[var(--color-outline)] transition-colors group-hover:text-[var(--color-primary)]" />
                  <p className="text-body-md text-[var(--color-on-surface)]">Añadir o reemplazar imagen (opcional)</p>
                  <p className="text-label-sm mt-1 text-[var(--color-on-surface-variant)]">JPG, PNG o WebP · máx. 5 MB</p>
                </>
              )}
            </button>
            {uploadImageMutation.isError ? (
              <p className="text-label-sm text-[var(--color-error)]">{resolveErrorMessage(uploadImageMutation.error)}</p>
            ) : null}
          </div>

          <form id="editar-producto-form" className="grid grid-cols-1 gap-6 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            <FormFieldLine
              id="edit-name"
              label="Nombre del producto"
              placeholder="Nombre del producto"
              error={errors.name?.message}
              {...register('name')}
            />
            <FormFieldLine
              id="edit-price"
              label="Precio (€)"
              placeholder="0.00"
              error={errors.price?.message}
              {...register('price')}
            />
            <FormFieldLine
              id="edit-stock"
              label="Stock"
              placeholder="0"
              type="number"
              min="0"
              error={errors.stock?.message}
              {...register('stock')}
            />
            <div className="sm:col-span-2">
              <FormTextarea
                id="edit-desc"
                label="Descripción"
                placeholder="Descripción del producto"
                rows={3}
                error={errors.description?.message}
                {...register('description')}
              />
            </div>
            <div className="sm:col-span-2">
              <FormTextarea
                id="edit-ingredients"
                label="Ingredientes"
                placeholder="Ingredientes"
                rows={2}
                {...register('ingredients')}
              />
            </div>
          </form>
        </div>

        <div className="sticky bottom-0 z-10 flex flex-col items-center justify-end gap-3 border-t border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] px-6 py-4 sm:flex-row sm:gap-4">
          <button type="button" onClick={onClose} className="text-label-md w-full rounded-[var(--radius-lg)] px-5 py-2.5 text-[var(--color-on-surface-variant)] transition-colors hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)] sm:w-auto">
            Cancelar
          </button>
          <button
            type="submit"
            form="editar-producto-form"
            disabled={updateMutation.isPending || uploadImageMutation.isPending}
            className="text-label-md inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] bg-[var(--color-primary)] px-6 py-2.5 text-[var(--color-on-primary)] shadow-sm transition-colors hover:bg-[var(--color-surface-tint)] disabled:opacity-60 sm:w-auto"
          >
            {(updateMutation.isPending || uploadImageMutation.isPending) ? (
              <Loader2 size={16} strokeWidth={2} className="animate-spin" />
            ) : null}
            Guardar cambios
          </button>
        </div>
      </div>
    </ModalOverlay>
  )
}

// ---------------------------------------------------------------------------
// Modal 5: Publicación / Despublicación
// ---------------------------------------------------------------------------

type PublicacionProductoModalProps = {
  producto: ProductDTO
  isPending: boolean
  onClose: () => void
  onConfirm: () => void
}

export function PublicacionProductoModal({ producto, isPending, onClose, onConfirm }: PublicacionProductoModalProps) {
  const isCurrentlyUnpublished = !producto.isActive
  const title = isCurrentlyUnpublished ? 'Publicar producto' : 'Despublicar producto'
  const description = isCurrentlyUnpublished
    ? 'Este producto volverá a mostrarse en la tienda del productor según su disponibilidad de stock.'
    : 'El producto dejará de ser visible en la tienda, pero conservará su información para futuras publicaciones.'
  const currentStatus = !producto.isActive ? 'Despublicado' : producto.stock === 0 ? 'Sin disponibilidad' : 'Publicado'

  return (
    <ModalOverlay zIndex={58}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] shadow-[0_8px_30px_rgba(28,28,24,0.12)]"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="publicacion-producto-title"
      >
        <div className="flex items-start justify-between border-b border-[var(--color-outline-variant)]/50 px-8 pb-6 pt-8">
          <div className="flex items-center gap-3 text-[var(--color-primary)]">
            <TriangleAlert size={24} strokeWidth={1.8} />
            <h2 className="text-headline-md text-[24px] text-[var(--color-on-surface)]" id="publicacion-producto-title">
              {title}
            </h2>
          </div>
          <button type="button" aria-label="Cerrar" onClick={onClose} className="p-1 text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-on-surface)]">
            <X size={22} strokeWidth={1.8} />
          </button>
        </div>
        <div className="px-8 py-6">
          <p className="text-body-md mb-6 text-[var(--color-on-surface-variant)]">{description}</p>
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)]/50 bg-[var(--color-surface-container-low)] p-4">
            <p className="text-label-sm mb-2 uppercase tracking-wider text-[var(--color-secondary)]">Producto seleccionado</p>
            <h3 className="text-headline-md text-[var(--color-on-surface)]">{producto.name}</h3>
            <p className="text-body-md mt-1 text-[var(--color-secondary)]">Estado actual: {currentStatus}</p>
          </div>
        </div>
        <div className="flex justify-end gap-4 border-t border-[var(--color-outline-variant)]/50 bg-[var(--color-surface-container-low)] px-8 py-6">
          <button type="button" onClick={onClose} className="text-label-md rounded-[var(--radius-default)] border border-[var(--color-secondary)] px-6 py-2.5 text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-variant)]">
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="text-label-md inline-flex items-center gap-2 rounded-[var(--radius-default)] bg-[var(--color-primary)] px-6 py-2.5 text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-surface-tint)] disabled:opacity-60"
          >
            {isPending ? <Loader2 size={16} strokeWidth={2} className="animate-spin" /> : null}
            Confirmar
          </button>
        </div>
      </div>
    </ModalOverlay>
  )
}

// ---------------------------------------------------------------------------
// Shared small components
// ---------------------------------------------------------------------------

type FormFieldLineProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string
  label: string
  error?: string
}

function FormFieldLine({ id, label, error, ...inputProps }: FormFieldLineProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-label-md text-[var(--color-on-surface)]" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="text-body-md w-full border-0 border-b border-[var(--color-outline)] bg-transparent py-2 text-[var(--color-on-surface)] transition-colors placeholder:text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] focus:ring-0 focus:outline-none"
        {...inputProps}
      />
      {error ? <p className="text-label-sm text-[var(--color-error)]">{error}</p> : null}
    </div>
  )
}

type FormTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string
  label: string
  error?: string
}

function FormTextarea({ id, label, error, rows, ...textareaProps }: FormTextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-label-md text-[var(--color-on-surface)]" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        rows={rows ?? 3}
        className="text-body-md w-full resize-y rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-3 text-[var(--color-on-surface)] transition-colors placeholder:text-[var(--color-on-surface-variant)] hover:border-[var(--color-outline)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none"
        {...textareaProps}
      />
      {error ? <p className="text-label-sm text-[var(--color-error)]">{error}</p> : null}
    </div>
  )
}
