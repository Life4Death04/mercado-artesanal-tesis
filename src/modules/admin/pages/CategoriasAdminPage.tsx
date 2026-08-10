import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Loader2,
  Plus,
  PowerOff,
  RefreshCcw,
  RotateCcw,
  Search,
} from 'lucide-react'
import { resolveErrorMessage } from '../../../lib/errorMessages'
import { CategoryActionModals } from '../componentes/CategoryActionModals'
import type { CategoryModalState } from '../componentes/CategoryActionModals'
import {
  useAdminCategoriesQuery,
  useCreateAdminCategoryMutation,
  useDeactivateAdminCategoryMutation,
  useUpdateAdminCategoryMutation,
} from '../catalogo/hooks/useAdminCategories'
import type {
  AdminCategory,
  CreateAdminCategoryInput,
  UpdateAdminCategoryInput,
} from '../catalogo/categorias.schema'

const POR_PAGINA = 8

type OrdenCategoria = 'Alfabético (A-Z)' | 'Más productos' | 'Recientes'

export function CategoriasAdminPage() {
  const categoriesQuery = useAdminCategoriesQuery()
  const createMutation = useCreateAdminCategoryMutation()
  const updateMutation = useUpdateAdminCategoryMutation()
  const deactivateMutation = useDeactivateAdminCategoryMutation()
  const [modal, setModal] = useState<CategoryModalState>(null)
  const [query, setQuery] = useState('')
  const [orden, setOrden] = useState<OrdenCategoria>('Alfabético (A-Z)')
  const [pagina, setPagina] = useState(1)

  const categories = categoriesQuery.data ?? []
  const filtradas = categories
    .filter((category) => {
      const normalizedQuery = query.trim().toLocaleLowerCase('es')
      return (
        !normalizedQuery ||
        category.name.toLocaleLowerCase('es').includes(normalizedQuery) ||
        (category.description ?? '').toLocaleLowerCase('es').includes(normalizedQuery)
      )
    })
    .sort((a, b) => {
      if (orden === 'Más productos') return b.productCount - a.productCount
      if (orden === 'Recientes') return Date.parse(b.createdAt) - Date.parse(a.createdAt)
      return a.name.localeCompare(b.name, 'es')
    })

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA))
  const paginaActual = Math.min(pagina, totalPaginas)
  const inicio = (paginaActual - 1) * POR_PAGINA
  const paginadas = filtradas.slice(inicio, inicio + POR_PAGINA)
  const anyMutationPending =
    createMutation.isPending || updateMutation.isPending || deactivateMutation.isPending

  function resetMutations() {
    createMutation.reset()
    updateMutation.reset()
    deactivateMutation.reset()
  }

  function openModal(nextModal: Exclude<CategoryModalState, null>) {
    resetMutations()
    setModal(nextModal)
  }

  function closeModal() {
    if (anyMutationPending) return
    resetMutations()
    setModal(null)
  }

  function resetFiltros() {
    setQuery('')
    setOrden('Alfabético (A-Z)')
    setPagina(1)
  }

  function handleCreate(input: CreateAdminCategoryInput) {
    createMutation.mutate(input, {
      onSuccess: () => {
        setModal(null)
        setOrden('Recientes')
        setPagina(1)
      },
    })
  }

  function handleUpdate(id: string, input: UpdateAdminCategoryInput) {
    updateMutation.mutate(
      { id, input },
      {
        onSuccess: () => setModal(null),
      },
    )
  }

  function handleDeactivate(id: string) {
    deactivateMutation.mutate(id, {
      onSuccess: () => {
        setModal(null)
        setPagina(1)
      },
    })
  }

  function handleReactivate(category: AdminCategory) {
    resetMutations()
    updateMutation.mutate({ id: category.id, input: { isActive: true } })
  }

  const modalPending =
    modal?.type === 'create'
      ? createMutation.isPending
      : modal?.type === 'edit'
        ? updateMutation.isPending
        : modal?.type === 'deactivate'
          ? deactivateMutation.isPending
          : false
  const modalError =
    modal?.type === 'create' && createMutation.isError
      ? resolveErrorMessage(createMutation.error)
      : modal?.type === 'edit' && updateMutation.isError
        ? resolveErrorMessage(updateMutation.error)
        : modal?.type === 'deactivate' && deactivateMutation.isError
          ? resolveErrorMessage(deactivateMutation.error)
          : null
  const reactivationError = modal === null && updateMutation.isError
    ? resolveErrorMessage(updateMutation.error)
    : null

  return (
    <>
      <div className="mx-[var(--space-margin-mobile)] max-w-[var(--layout-container-max)] md:mx-0">
        <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-display-lg mb-2 text-[var(--color-on-surface)]">Categorías de productos</h2>
            <p className="text-body-lg max-w-2xl text-[var(--color-secondary)]">
              Gestiona la clasificación principal de la revista culinaria. Asegura una navegación intuitiva y curada
              para nuestros clientes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openModal({ type: 'create' })}
            disabled={anyMutationPending}
            className="text-label-md flex items-center justify-center gap-2 self-start whitespace-nowrap rounded-[var(--radius-sm)] bg-[var(--color-primary-container)] px-6 py-3 text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60 md:self-auto"
          >
            <Plus size={18} strokeWidth={2} />
            Nueva categoría
          </button>
        </header>

        <section className="mb-8 flex flex-col items-center justify-between gap-4 border-b border-[color-mix(in_srgb,var(--color-outline-variant)_55%,transparent)] pb-4 md:flex-row">
          <label className="relative w-full md:w-96">
            <span className="sr-only">Buscar categoría</span>
            <Search
              size={22}
              strokeWidth={1.8}
              className="absolute top-1/2 left-0 -translate-y-1/2 text-[var(--color-secondary)]"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPagina(1)
              }}
              placeholder="Buscar categoría..."
              className="text-body-md w-full border-0 border-b border-[color-mix(in_srgb,var(--color-outline)_45%,transparent)] bg-transparent py-2 pr-3 pl-8 text-[var(--color-on-surface)] transition-colors placeholder:text-[var(--color-secondary)] focus:border-[var(--color-on-surface)] focus:outline-none"
            />
          </label>

          <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row md:items-center">
            <label className="text-label-md flex items-center gap-2 text-[var(--color-secondary)]">
              Orden:
              <select
                value={orden}
                onChange={(event) => {
                  setOrden(event.target.value as OrdenCategoria)
                  setPagina(1)
                }}
                className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-[var(--color-on-surface)] focus:outline-none"
              >
                <option>Alfabético (A-Z)</option>
                <option>Más productos</option>
                <option>Recientes</option>
              </select>
            </label>

            <button
              type="button"
              onClick={resetFiltros}
              className="text-label-md flex items-center gap-2 text-[var(--color-outline)] transition-colors hover:text-[var(--color-on-surface)]"
            >
              <RefreshCcw size={15} strokeWidth={1.9} />
              Restablecer
            </button>
          </div>
        </section>

        {reactivationError ? (
          <p
            role="alert"
            aria-live="assertive"
            className="text-body-md mb-6 rounded-[var(--radius-sm)] bg-[var(--color-error-container)] p-4 text-[var(--color-error)]"
          >
            {reactivationError}
          </p>
        ) : null}

        <section className="flex flex-col gap-4" aria-label="Listado de categorías" aria-busy={categoriesQuery.isLoading}>
          {categoriesQuery.isLoading ? (
            <div className="flex min-h-56 items-center justify-center gap-3 text-[var(--color-secondary)]" aria-live="polite">
              <Loader2 size={24} className="animate-spin" />
              <span className="text-body-md">Cargando categorías...</span>
            </div>
          ) : categoriesQuery.isError ? (
            <div
              role="alert"
              className="rounded-[var(--radius-lg)] border border-[var(--color-error)] bg-[var(--color-error-container)] p-8 text-center text-[var(--color-error)]"
            >
              <p className="text-body-md">{resolveErrorMessage(categoriesQuery.error)}</p>
              <button
                type="button"
                onClick={() => void categoriesQuery.refetch()}
                disabled={categoriesQuery.isFetching}
                className="text-label-md mt-5 inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-current px-5 py-2.5 disabled:cursor-wait disabled:opacity-60"
              >
                <RefreshCcw size={16} className={categoriesQuery.isFetching ? 'animate-spin' : ''} />
                {categoriesQuery.isFetching ? 'Reintentando...' : 'Reintentar'}
              </button>
            </div>
          ) : paginadas.length === 0 ? (
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-10 text-center text-[var(--color-secondary)]">
              {categories.length === 0
                ? 'Todavía no hay categorías. Crea la primera para comenzar.'
                : 'No se encontraron categorías con los filtros aplicados.'}
            </div>
          ) : (
            paginadas.map((category, index) => (
              <CategoryRow
                key={category.id}
                category={category}
                highlighted={index === 0}
                isReactivating={
                  updateMutation.isPending && updateMutation.variables?.id === category.id
                }
                actionsDisabled={anyMutationPending}
                onEdit={() => openModal({ type: 'edit', category })}
                onDeactivate={() => openModal({ type: 'deactivate', category })}
                onReactivate={() => handleReactivate(category)}
              />
            ))
          )}
        </section>

        {!categoriesQuery.isLoading && !categoriesQuery.isError ? (
          <footer className="mt-12 flex flex-col gap-6 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] pt-6 md:flex-row md:items-center md:justify-between">
            <span className="text-label-md text-[var(--color-secondary)]">
              {filtradas.length === 0
                ? 'Sin resultados'
                : `Mostrando ${inicio + 1}–${Math.min(inicio + POR_PAGINA, filtradas.length)} de ${filtradas.length} categorías`}
            </span>
            <div className="flex gap-2">
              <PaginationButton
                icon={ChevronLeft}
                label="Página anterior"
                disabled={paginaActual === 1}
                onClick={() => setPagina((currentPage) => currentPage - 1)}
              />
              {Array.from({ length: totalPaginas }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  aria-current={page === paginaActual ? 'page' : undefined}
                  onClick={() => setPagina(page)}
                  className={`text-label-md grid size-10 place-items-center rounded-[var(--radius-sm)] transition-colors ${
                    page === paginaActual
                      ? 'bg-[var(--color-on-surface)] text-[var(--color-surface)]'
                      : 'border border-[color-mix(in_srgb,var(--color-outline-variant)_55%,transparent)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <PaginationButton
                icon={ChevronRight}
                label="Página siguiente"
                disabled={paginaActual === totalPaginas}
                onClick={() => setPagina((currentPage) => currentPage + 1)}
              />
            </div>
          </footer>
        ) : null}
      </div>

      <CategoryActionModals
        modal={modal}
        onClose={closeModal}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDeactivate={handleDeactivate}
        isPending={modalPending}
        error={modalError}
      />
    </>
  )
}

type CategoryRowProps = {
  category: AdminCategory
  highlighted?: boolean
  isReactivating: boolean
  actionsDisabled: boolean
  onEdit: () => void
  onDeactivate: () => void
  onReactivate: () => void
}

function CategoryRow({
  category,
  highlighted = false,
  isReactivating,
  actionsDisabled,
  onEdit,
  onDeactivate,
  onReactivate,
}: CategoryRowProps) {
  return (
    <article>
      <div
        className={`group flex flex-col justify-between gap-4 rounded-[var(--radius-lg)] border p-6 transition-all md:flex-row md:items-center ${
          highlighted
            ? 'border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] bg-[var(--color-surface-container-low)]'
            : 'border-transparent bg-[var(--color-surface)] hover:border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] hover:bg-[var(--color-surface-container-low)]'
        } ${category.isActive ? '' : 'opacity-75'}`}
      >
        <div className="flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-3">
            <h3 className="text-headline-md text-[var(--color-on-surface)]">{category.name}</h3>
            <span
              className={`text-label-sm rounded-full px-2.5 py-1 ${
                category.isActive
                  ? 'bg-[color-mix(in_srgb,var(--color-secondary-fixed)_45%,transparent)] text-[var(--color-secondary)]'
                  : 'bg-[var(--color-error-container)] text-[var(--color-error)]'
              }`}
            >
              {category.isActive ? 'Activa' : 'Inactiva'}
            </span>
          </div>
          <p className="text-body-md max-w-3xl text-[var(--color-secondary)]">
            {category.description ?? 'Sin descripción.'}
          </p>
          <p className="text-label-sm mt-2 text-[var(--color-outline)]">Slug: {category.slug}</p>
        </div>
        <div className="flex shrink-0 items-center justify-between gap-8 md:w-1/3 md:justify-end">
          <span className="text-label-md rounded-full bg-[color-mix(in_srgb,var(--color-secondary-fixed)_45%,transparent)] px-3 py-1 text-[var(--color-secondary)]">
            {category.productCount} {category.productCount === 1 ? 'producto' : 'productos'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={`Editar ${category.name}`}
              onClick={onEdit}
              disabled={actionsDisabled}
              className="rounded-full p-2 text-[var(--color-secondary)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-secondary-fixed)_20%,transparent)] hover:text-[var(--color-primary-container)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Edit3 size={20} strokeWidth={1.8} />
            </button>
            {category.isActive ? (
              <button
                type="button"
                aria-label={`Desactivar ${category.name}`}
                onClick={onDeactivate}
                disabled={actionsDisabled}
                className="rounded-full p-2 text-[var(--color-secondary)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-error-container)_60%,transparent)] hover:text-[var(--color-error)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <PowerOff size={20} strokeWidth={1.8} />
              </button>
            ) : (
              <button
                type="button"
                aria-label={`Reactivar ${category.name}`}
                onClick={onReactivate}
                disabled={actionsDisabled}
                className="rounded-full p-2 text-[var(--color-primary-container)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-secondary-fixed)_30%,transparent)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw size={20} strokeWidth={1.8} className={isReactivating ? 'animate-spin' : ''} />
              </button>
            )}
          </div>
        </div>
      </div>
      <hr className="border-[color-mix(in_srgb,var(--color-on-surface)_10%,transparent)]" />
    </article>
  )
}

type PaginationButtonProps = {
  label: string
  icon: LucideIcon
  disabled?: boolean
  onClick: () => void
}

function PaginationButton({ label, icon: Icon, disabled = false, onClick }: PaginationButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="text-label-md grid size-10 place-items-center rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-outline-variant)_55%,transparent)] text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-container-low)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Icon size={20} strokeWidth={1.8} />
    </button>
  )
}
