import { useState, type ReactNode } from 'react'
import { AlertTriangle, Image, X } from 'lucide-react'

// ---------------------------------------------------------------------------
// Shared type (exported so CategoriasAdminPage can use it)
// ---------------------------------------------------------------------------

export type Category = {
  id: number
  name: string
  description: string
  products: number
}

export type CategoryModalState =
  | { type: 'create' }
  | { type: 'edit'; category: Category }
  | { type: 'delete'; category: Category }
  | null

type CategoryActionModalsProps = {
  modal: CategoryModalState
  onClose: () => void
  /** id=null means create; id≠null means edit */
  onSave: (id: number | null, name: string, description: string) => void
  onDelete: (id: number) => void
}

export function CategoryActionModals({
  modal,
  onClose,
  onSave,
  onDelete,
}: CategoryActionModalsProps) {
  if (modal?.type === 'create') {
    return (
      <CategoryFormModal
        mode="create"
        onClose={onClose}
        onSave={(name, description) => { onSave(null, name, description); onClose() }}
      />
    )
  }

  if (modal?.type === 'edit') {
    return (
      <CategoryFormModal
        mode="edit"
        category={modal.category}
        onClose={onClose}
        onSave={(name, description) => { onSave(modal.category.id, name, description); onClose() }}
      />
    )
  }

  if (modal?.type === 'delete') {
    return (
      <DeleteCategoryModal
        category={modal.category}
        onClose={onClose}
        onDelete={() => { onDelete(modal.category.id); onClose() }}
      />
    )
  }

  return null
}

// ---------------------------------------------------------------------------
// CategoryFormModal (create + edit)
// ---------------------------------------------------------------------------

type CategoryFormModalProps = {
  mode: 'create' | 'edit'
  category?: Category
  onClose: () => void
  onSave: (name: string, description: string) => void
}

function CategoryFormModal({ mode, category, onClose, onSave }: CategoryFormModalProps) {
  const isEdit = mode === 'edit'
  const [name, setName] = useState(category?.name ?? '')
  const [description, setDescription] = useState(category?.description ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSave(name.trim(), description.trim())
  }

  return (
    <ModalFrame widthClass={isEdit ? 'max-w-2xl' : 'max-w-lg'} onClose={onClose}>
      {isEdit ? (
        <>
          <header className="flex items-center justify-between border-b border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] px-8 py-6">
            <h2 className="text-headline-lg text-[var(--color-on-surface)]">Editar categoría</h2>
            <button
              type="button"
              aria-label="Cerrar modal"
              onClick={onClose}
              className="text-[var(--color-secondary)] transition-colors hover:text-[var(--color-on-surface)]"
            >
              <X size={24} strokeWidth={1.8} />
            </button>
          </header>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6 p-8">
              <EditorialInput
                label="Nombre de la categoría"
                value={name}
                onChange={setName}
                variant="underline"
                required
              />
              <EditorialTextarea
                label="Descripción"
                value={description}
                onChange={setDescription}
              />
              <ImageDropzone />
            </div>
            <div className="flex items-center justify-end gap-4 bg-[var(--color-surface-container-low)] px-8 py-6">
              <SecondaryAction onClick={onClose}>Cancelar</SecondaryAction>
              <PrimaryAction>Guardar cambios</PrimaryAction>
            </div>
          </form>
        </>
      ) : (
        <div className="p-8">
          <h2 className="text-headline-lg mb-6 text-[var(--color-on-surface)]">Nueva categoría</h2>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <EditorialInput
              label="Nombre"
              value={name}
              onChange={setName}
              required
              placeholder="Ej. Conservas Gourmet"
            />
            <EditorialTextarea
              label="Descripción"
              value={description}
              onChange={setDescription}
              placeholder="Describe el propósito de esta categoría..."
            />
            <div className="mt-4 flex items-center justify-end gap-4">
              <SecondaryAction onClick={onClose}>Cancelar</SecondaryAction>
              <PrimaryAction>Guardar</PrimaryAction>
            </div>
          </form>
        </div>
      )}
    </ModalFrame>
  )
}

// ---------------------------------------------------------------------------
// DeleteCategoryModal
// ---------------------------------------------------------------------------

type DeleteCategoryModalProps = {
  category: Category
  onClose: () => void
  onDelete: () => void
}

function DeleteCategoryModal({ category, onClose, onDelete }: DeleteCategoryModalProps) {
  return (
    <ModalFrame widthClass="max-w-md" onClose={onClose}>
      <div className="p-6">
        <div className="mb-4 flex items-center gap-4">
          <div className="grid size-14 shrink-0 place-items-center rounded-[var(--radius-xl)] bg-[var(--color-error-container)] text-[var(--color-error)]">
            <AlertTriangle size={30} strokeWidth={1.8} />
          </div>
          <h2 className="text-headline-md text-[var(--color-on-surface)]">Eliminar categoría</h2>
        </div>
        <p className="text-body-md mb-2 text-[var(--color-secondary)]">
          ¿Está seguro de que desea eliminar{' '}
          <span className="font-semibold text-[var(--color-on-surface)]">{category.name}</span>?
          Esta acción no puede deshacerse.
        </p>
        {category.products > 0 && (
          <p className="text-label-sm mb-6 text-[var(--color-error)]">
            Esta categoría tiene {category.products} productos asociados que quedarán sin
            clasificar.
          </p>
        )}
        <div className="mt-6 flex flex-col justify-end gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="text-label-md rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-outline-variant)_55%,transparent)] px-6 py-2.5 text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-container-low)]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="text-label-md rounded-[var(--radius-sm)] bg-[var(--color-error)] px-6 py-2.5 text-[var(--color-on-error)] transition-opacity hover:opacity-90"
          >
            Eliminar
          </button>
        </div>
      </div>
    </ModalFrame>
  )
}

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

function ModalFrame({
  children,
  widthClass,
  onClose,
}: {
  children: ReactNode
  widthClass: string
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Cerrar modal"
        onClick={onClose}
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-on-surface)_62%,transparent)] backdrop-blur-sm"
      />
      <div
        className={`relative flex w-full ${widthClass} flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-background)] shadow-[0_24px_70px_-28px_rgba(28,27,27,0.6)]`}
      >
        {children}
      </div>
    </div>
  )
}

function EditorialInput({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  variant = 'boxed',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  variant?: 'boxed' | 'underline'
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-label-md text-[var(--color-on-surface)]">
        {label}{' '}
        {required && <span className="text-[var(--color-error)]">*</span>}
      </span>
      <input
        type="text"
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`text-body-lg w-full bg-transparent py-2 text-[var(--color-on-surface)] transition-colors placeholder:text-[var(--color-secondary)] focus:outline-none ${
          variant === 'underline'
            ? 'border-0 border-b border-[color-mix(in_srgb,var(--color-outline)_50%,transparent)] focus:border-[var(--color-primary-container)]'
            : 'rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-outline-variant)_70%,transparent)] px-4 focus:border-[var(--color-primary-container)]'
        }`}
      />
    </label>
  )
}

function EditorialTextarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-label-md text-[var(--color-on-surface)]">{label}</span>
      <textarea
        rows={4}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-body-md w-full resize-none rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-outline-variant)_70%,transparent)] bg-transparent px-4 py-3 text-[var(--color-on-surface)] transition-colors placeholder:text-[var(--color-secondary)] focus:border-[var(--color-primary-container)] focus:outline-none"
      />
    </label>
  )
}

function ImageDropzone() {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-label-md text-[var(--color-secondary)]">
        Imagen de portada (opcional)
      </span>
      <button
        type="button"
        className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border-2 border-dashed border-[color-mix(in_srgb,var(--color-outline-variant)_75%,transparent)] p-8 text-[var(--color-secondary)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-secondary-fixed)_16%,transparent)]"
      >
        <Image size={38} strokeWidth={1.6} />
        <span className="text-label-sm">Haz clic para cambiar la imagen</span>
      </button>
    </div>
  )
}

function SecondaryAction({ children, onClick }: { children: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-label-md px-6 py-2 text-[var(--color-secondary)] transition-colors hover:text-[var(--color-on-surface)]"
    >
      {children}
    </button>
  )
}

function PrimaryAction({ children }: { children: string }) {
  return (
    <button
      type="submit"
      className="text-label-md rounded-[var(--radius-sm)] bg-[var(--color-primary-container)] px-8 py-2 text-[var(--color-on-primary)] shadow-sm transition-colors hover:bg-[var(--color-primary)]"
    >
      {children}
    </button>
  )
}
