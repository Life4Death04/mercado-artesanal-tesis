import { useState, type FormEvent, type ReactNode } from 'react'
import { AlertTriangle, Loader2, X } from 'lucide-react'
import {
  createAdminCategoryInputSchema,
  updateAdminCategoryInputSchema,
  type AdminCategory,
  type CreateAdminCategoryInput,
  type UpdateAdminCategoryInput,
} from '../catalogo/categorias.schema'

export type CategoryModalState =
  | { type: 'create' }
  | { type: 'edit'; category: AdminCategory }
  | { type: 'deactivate'; category: AdminCategory }
  | null

type CategoryActionModalsProps = {
  modal: CategoryModalState
  onClose: () => void
  onCreate: (input: CreateAdminCategoryInput) => void
  onUpdate: (id: string, input: UpdateAdminCategoryInput) => void
  onDeactivate: (id: string) => void
  isPending: boolean
  error?: string | null
}

export function CategoryActionModals({
  modal,
  onClose,
  onCreate,
  onUpdate,
  onDeactivate,
  isPending,
  error = null,
}: CategoryActionModalsProps) {
  if (modal?.type === 'create') {
    return (
      <CategoryFormModal
        mode="create"
        onClose={onClose}
        onSave={onCreate}
        isPending={isPending}
        error={error}
      />
    )
  }

  if (modal?.type === 'edit') {
    return (
      <CategoryFormModal
        mode="edit"
        category={modal.category}
        onClose={onClose}
        onSave={(input) => onUpdate(modal.category.id, input)}
        isPending={isPending}
        error={error}
      />
    )
  }

  if (modal?.type === 'deactivate') {
    return (
      <DeactivateCategoryModal
        category={modal.category}
        onClose={onClose}
        onDeactivate={() => onDeactivate(modal.category.id)}
        isPending={isPending}
        error={error}
      />
    )
  }

  return null
}

type CategoryFormModalProps =
  | {
      mode: 'create'
      onClose: () => void
      onSave: (input: CreateAdminCategoryInput) => void
      isPending: boolean
      error: string | null
    }
  | {
      mode: 'edit'
      category: AdminCategory
      onClose: () => void
      onSave: (input: UpdateAdminCategoryInput) => void
      isPending: boolean
      error: string | null
    }

type FormErrors = {
  name?: string
  description?: string
}

function CategoryFormModal(props: CategoryFormModalProps) {
  const isEdit = props.mode === 'edit'
  const [name, setName] = useState(isEdit ? props.category.name : '')
  const [description, setDescription] = useState(
    isEdit ? (props.category.description ?? '') : '',
  )
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedDescription = description.trim()
    const input = isEdit
      ? { name, description: normalizedDescription || null }
      : { name, ...(normalizedDescription ? { description: normalizedDescription } : {}) }
    const result = isEdit
      ? updateAdminCategoryInputSchema.safeParse(input)
      : createAdminCategoryInputSchema.safeParse(input)

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      setFormErrors({
        name: fieldErrors.name?.[0],
        description: fieldErrors.description?.[0],
      })
      return
    }

    setFormErrors({})
    if (props.mode === 'edit') {
      props.onSave(result.data as UpdateAdminCategoryInput)
    } else {
      props.onSave(result.data as CreateAdminCategoryInput)
    }
  }

  const titleId = isEdit ? 'edit-category-title' : 'create-category-title'

  return (
    <ModalFrame
      widthClass={isEdit ? 'max-w-2xl' : 'max-w-lg'}
      onClose={props.onClose}
      disableClose={props.isPending}
      titleId={titleId}
    >
      <header className="flex items-center justify-between border-b border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] px-8 py-6">
        <h2 id={titleId} className="text-headline-lg text-[var(--color-on-surface)]">
          {isEdit ? 'Editar categoría' : 'Nueva categoría'}
        </h2>
        <CloseButton onClose={props.onClose} disabled={props.isPending} />
      </header>

      <form className="flex flex-col" onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-6 p-8">
          <EditorialInput
            id={`${props.mode}-category-name`}
            label="Nombre de la categoría"
            value={name}
            onChange={setName}
            required
            maxLength={120}
            placeholder="Ej. Conservas Gourmet"
            error={formErrors.name}
            variant={isEdit ? 'underline' : 'boxed'}
          />
          <EditorialTextarea
            id={`${props.mode}-category-description`}
            label="Descripción (opcional)"
            value={description}
            onChange={setDescription}
            maxLength={1000}
            placeholder="Describe el propósito de esta categoría..."
            error={formErrors.description}
          />

          {props.error ? (
            <p
              role="alert"
              aria-live="assertive"
              className="text-label-sm rounded-[var(--radius-sm)] bg-[var(--color-error-container)] p-4 text-[var(--color-error)]"
            >
              {props.error}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-4 bg-[var(--color-surface-container-low)] px-8 py-6">
          <SecondaryAction onClick={props.onClose} disabled={props.isPending}>
            Cancelar
          </SecondaryAction>
          <PrimaryAction disabled={props.isPending}>
            {props.isPending ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Guardar'}
          </PrimaryAction>
        </div>
      </form>
    </ModalFrame>
  )
}

type DeactivateCategoryModalProps = {
  category: AdminCategory
  onClose: () => void
  onDeactivate: () => void
  isPending: boolean
  error: string | null
}

function DeactivateCategoryModal({
  category,
  onClose,
  onDeactivate,
  isPending,
  error,
}: DeactivateCategoryModalProps) {
  return (
    <ModalFrame
      widthClass="max-w-md"
      onClose={onClose}
      disableClose={isPending}
      titleId="deactivate-category-title"
    >
      <div className="p-6">
        <div className="mb-4 flex items-center gap-4">
          <div className="grid size-14 shrink-0 place-items-center rounded-[var(--radius-xl)] bg-[var(--color-error-container)] text-[var(--color-error)]">
            <AlertTriangle size={30} strokeWidth={1.8} />
          </div>
          <h2 id="deactivate-category-title" className="text-headline-md text-[var(--color-on-surface)]">
            Desactivar categoría
          </h2>
        </div>
        <p className="text-body-md text-[var(--color-secondary)]">
          ¿Quieres desactivar{' '}
          <span className="font-semibold text-[var(--color-on-surface)]">{category.name}</span>?
          Dejará de aparecer en el catálogo público, pero podrás reactivarla más adelante.
        </p>
        {category.productCount > 0 ? (
          <p className="text-label-sm mt-3 text-[var(--color-secondary)]">
            {category.productCount === 1
              ? 'Su producto activo asociado conservará la categoría.'
              : `Sus ${category.productCount} productos activos asociados conservarán la categoría.`}
          </p>
        ) : null}
        {error ? (
          <p
            role="alert"
            aria-live="assertive"
            className="text-label-sm mt-5 rounded-[var(--radius-sm)] bg-[var(--color-error-container)] p-4 text-[var(--color-error)]"
          >
            {error}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col justify-end gap-3 sm:flex-row">
          <SecondaryAction onClick={onClose} disabled={isPending}>
            Cancelar
          </SecondaryAction>
          <button
            type="button"
            onClick={onDeactivate}
            disabled={isPending}
            className="text-label-md inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-error)] px-6 py-2.5 text-[var(--color-on-error)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
            {isPending ? 'Desactivando...' : 'Desactivar'}
          </button>
        </div>
      </div>
    </ModalFrame>
  )
}

function ModalFrame({
  children,
  widthClass,
  onClose,
  disableClose,
  titleId,
}: {
  children: ReactNode
  widthClass: string
  onClose: () => void
  disableClose: boolean
  titleId: string
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        aria-label="Cerrar modal"
        onClick={onClose}
        disabled={disableClose}
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-on-surface)_62%,transparent)] backdrop-blur-sm disabled:cursor-wait"
      />
      <div
        className={`relative flex max-h-[90vh] w-full ${widthClass} flex-col overflow-y-auto rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-background)] shadow-[0_24px_70px_-28px_rgba(28,27,27,0.6)]`}
      >
        {children}
      </div>
    </div>
  )
}

function CloseButton({ onClose, disabled }: { onClose: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      aria-label="Cerrar modal"
      onClick={onClose}
      disabled={disabled}
      className="text-[var(--color-secondary)] transition-colors hover:text-[var(--color-on-surface)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <X size={24} strokeWidth={1.8} />
    </button>
  )
}

function EditorialInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  maxLength,
  error,
  variant = 'boxed',
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  maxLength: number
  error?: string
  variant?: 'boxed' | 'underline'
}) {
  const errorId = `${id}-error`

  return (
    <label className="flex flex-col gap-2" htmlFor={id}>
      <span className="text-label-md text-[var(--color-on-surface)]">
        {label} {required ? <span className="text-[var(--color-error)]">*</span> : null}
      </span>
      <input
        id={id}
        type="text"
        required={required}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`text-body-lg w-full bg-transparent py-2 text-[var(--color-on-surface)] transition-colors placeholder:text-[var(--color-secondary)] focus:outline-none ${
          variant === 'underline'
            ? 'border-0 border-b border-[color-mix(in_srgb,var(--color-outline)_50%,transparent)] px-0 focus:border-[var(--color-primary-container)]'
            : 'rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-outline-variant)_70%,transparent)] px-4 focus:border-[var(--color-primary-container)]'
        }`}
      />
      {error ? <span id={errorId} className="text-label-sm text-[var(--color-error)]">{error}</span> : null}
    </label>
  )
}

function EditorialTextarea({
  id,
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  error,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength: number
  error?: string
}) {
  const errorId = `${id}-error`

  return (
    <label className="flex flex-col gap-2" htmlFor={id}>
      <span className="text-label-md text-[var(--color-on-surface)]">{label}</span>
      <textarea
        id={id}
        rows={4}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="text-body-md w-full resize-none rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-outline-variant)_70%,transparent)] bg-transparent px-4 py-3 text-[var(--color-on-surface)] transition-colors placeholder:text-[var(--color-secondary)] focus:border-[var(--color-primary-container)] focus:outline-none"
      />
      <span className="text-label-sm self-end text-[var(--color-secondary)]">
        {value.length}/{maxLength}
      </span>
      {error ? <span id={errorId} className="text-label-sm text-[var(--color-error)]">{error}</span> : null}
    </label>
  )
}

function SecondaryAction({
  children,
  onClick,
  disabled,
}: {
  children: string
  onClick: () => void
  disabled: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="text-label-md px-6 py-2 text-[var(--color-secondary)] transition-colors hover:text-[var(--color-on-surface)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  )
}

function PrimaryAction({ children, disabled }: { children: string; disabled: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="text-label-md inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-primary-container)] px-8 py-2 text-[var(--color-on-primary)] shadow-sm transition-colors hover:bg-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  )
}
