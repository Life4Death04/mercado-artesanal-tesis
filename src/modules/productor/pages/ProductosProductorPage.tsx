import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronLeft, ChevronRight, Eye, EyeOff, Filter, Loader2, Pencil, Plus, Search, SlidersHorizontal, Trash2, TriangleAlert } from 'lucide-react'
import { formatMoney } from '../../../lib/formatMoney'
import { resolveErrorMessage } from '../../../lib/errorMessages'
import { useProductosQuery } from '../productos/hooks/useProductosQuery'
import { useCreateProductoMutation } from '../productos/hooks/useCreateProductoMutation'
import { useUpdateProductoMutation } from '../productos/hooks/useUpdateProductoMutation'
import { useDeleteProductoMutation } from '../productos/hooks/useDeleteProductoMutation'
import {
  AgregarProductoModal,
  AvisoStockModal,
  EditarProductoModal,
  EliminarProductoModal,
  PublicacionProductoModal,
} from '../componentes/CatalogoProductorModals'
import type { ProductDTO } from '../productos/productos.schema'

// ---------------------------------------------------------------------------
// Status filter helpers
// ---------------------------------------------------------------------------

type DisplayStatus = 'Publicado' | 'Despublicado' | 'Sin disponibilidad'
type StatusFilter = 'Todos' | DisplayStatus

const STATUS_FILTERS: StatusFilter[] = ['Todos', 'Publicado', 'Despublicado', 'Sin disponibilidad']

function resolveProductStatus(producto: ProductDTO): DisplayStatus {
  if (!producto.isActive) return 'Despublicado'
  if (producto.stock === 0) return 'Sin disponibilidad'
  return 'Publicado'
}

const pageSize = 4

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export function ProductosProductorPage() {
  const { data: productos = [], isLoading, isError, error } = useProductosQuery()
  const createMutation = useCreateProductoMutation()
  const updateMutation = useUpdateProductoMutation()
  const deleteMutation = useDeleteProductoMutation()

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todas las categorías')
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('Todos')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showAgregarModal, setShowAgregarModal] = useState(false)
  const [editingTargetId, setEditingTargetId] = useState<string | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [publicationTargetId, setPublicationTargetId] = useState<string | null>(null)
  const [showStockWarningForId, setShowStockWarningForId] = useState<string | null>(null)
  const [mutationError, setMutationError] = useState<string | null>(null)

  // Derive unique category names from live data for the filter selector
  const categoryNames = Array.from(
    new Set(productos.map((p) => p.categoryId)),
  )
  const categoryFilters = ['Todas las categorías', ...categoryNames]

  const normalizedSearch = search.trim().toLowerCase()
  const filteredProducts = productos.filter((producto) => {
    const status = resolveProductStatus(producto)
    const matchesSearch =
      !normalizedSearch ||
      [producto.name, producto.categoryId, formatMoney(producto.price)]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    const matchesCategory =
      selectedCategory === 'Todas las categorías' || producto.categoryId === selectedCategory
    const matchesStatus = selectedStatus === 'Todos' || status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const visibleProducts = filteredProducts.slice((safePage - 1) * pageSize, safePage * pageSize)

  const editingTarget = editingTargetId
    ? productos.find((p) => p.id === editingTargetId) ?? null
    : null
  const deleteTarget = deleteTargetId
    ? productos.find((p) => p.id === deleteTargetId) ?? null
    : null
  const publicationTarget = publicationTargetId
    ? productos.find((p) => p.id === publicationTargetId) ?? null
    : null
  const stockWarningTarget = showStockWarningForId
    ? productos.find((p) => p.id === showStockWarningForId) ?? null
    : null

  function updateSearch(value: string) {
    setSearch(value)
    setCurrentPage(1)
  }

  function updateCategory(value: string) {
    setSelectedCategory(value)
    setCurrentPage(1)
  }

  function updateStatus(value: StatusFilter) {
    setSelectedStatus(value)
    setCurrentPage(1)
  }

  function handleTogglePublication(producto: ProductDTO) {
    if (!producto.isActive && producto.stock === 0) {
      setPublicationTargetId(null)
      setShowStockWarningForId(producto.id)
      return
    }

    setMutationError(null)
    updateMutation.mutate(
      { id: producto.id, body: { isActive: !producto.isActive } },
      {
        onError: (err) => setMutationError(resolveErrorMessage(err)),
        onSuccess: () => setPublicationTargetId(null),
      },
    )
  }

  function handlePublishWithoutStock(productId: string) {
    setMutationError(null)
    updateMutation.mutate(
      { id: productId, body: { isActive: true } },
      {
        onError: (err) => setMutationError(resolveErrorMessage(err)),
        onSuccess: () => setShowStockWarningForId(null),
      },
    )
  }

  function handleDeleteConfirm(productId: string) {
    setMutationError(null)
    deleteMutation.mutate(productId, {
      onError: (err) => setMutationError(resolveErrorMessage(err)),
      onSuccess: () => setDeleteTargetId(null),
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
        <Loader2 size={32} strokeWidth={1.8} className="animate-spin text-[var(--color-primary)]" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
        <div className="max-w-md text-center">
          <TriangleAlert size={36} strokeWidth={1.6} className="mx-auto mb-4 text-[var(--color-error)]" />
          <p className="text-body-md text-[var(--color-on-surface-variant)]">
            {resolveErrorMessage(error)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <main className="mx-auto w-full max-w-[var(--layout-container-max)] px-[var(--space-margin-mobile)] py-12 md:px-[var(--space-margin-desktop)] md:py-16">
        <section className="mb-10">
          <nav aria-label="Breadcrumb" className="text-label-sm mb-6 flex items-center gap-2 text-[var(--color-secondary)]">
            <Link to="/productor/pedidos" className="transition-colors hover:text-[var(--color-primary)]">Area Productor</Link>
            <ChevronRight size={14} strokeWidth={1.8} />
            <span className="text-[var(--color-primary)]">Mi catálogo</span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <h1 className="text-display-lg text-[var(--color-primary)]">Mi catálogo</h1>
                <span className="text-body-md rounded-full bg-[var(--color-secondary-container)] px-3 py-0.5 text-[var(--color-on-secondary-container)]">
                  {filteredProducts.length} productos
                </span>
              </div>
              <p className="text-body-md max-w-2xl text-[var(--color-on-surface-variant)]">
                Revisa tu catálogo, edita publicaciones activas y controla qué productos están visibles para los clientes.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAgregarModal(true)}
              className="text-label-md inline-flex items-center justify-center gap-2 rounded-[var(--radius-lg)] bg-[var(--color-primary)] px-6 py-3 text-[var(--color-on-primary)] shadow-md transition-all hover:brightness-110 active:scale-95"
            >
              <Plus size={18} strokeWidth={2} />
              Añadir producto
            </button>
          </div>
        </section>

        {/* Global mutation error banner */}
        {mutationError ? (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 flex items-start gap-3 rounded-[var(--radius-lg)] border border-red-200 bg-red-50 px-5 py-4 text-[var(--color-error)]"
          >
            <TriangleAlert size={18} strokeWidth={1.8} className="mt-0.5 shrink-0" />
            <p className="text-body-md">{mutationError}</p>
          </div>
        ) : null}

        <section className="mb-8 border border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-surface-container-lowest)] p-4 shadow-[0_18px_50px_-35px_rgba(122,46,58,0.35)] md:p-6" aria-label="Filtros del catálogo de productor">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <Search size={18} strokeWidth={1.8} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)]" />
              <input
                type="search"
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Buscar por nombre, categoría o precio..."
                className="text-body-md w-full border border-[var(--color-outline-variant)] bg-[#FAF7F0] py-3 pl-11 pr-4 text-[#1A1A1A] placeholder:text-[var(--color-outline)] focus:border-[var(--color-primary)] focus:outline-none"
              />
            </label>

            <button
              type="button"
              onClick={() => setFiltersOpen((value) => !value)}
              aria-expanded={filtersOpen}
              className="text-label-md inline-flex items-center justify-center gap-2 border border-[var(--color-outline-variant)] px-5 py-3 uppercase tracking-wider text-[var(--color-secondary)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] lg:hidden"
            >
              <SlidersHorizontal size={18} strokeWidth={1.8} />
              Filtros
            </button>
          </div>

          <div className={`${filtersOpen ? 'mt-5 grid' : 'hidden'} min-w-0 gap-4 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] pt-5 lg:mt-5 lg:grid lg:grid-cols-[minmax(0,15rem)_1fr] lg:items-end`}>
            <label className="block min-w-0">
              <span className="text-label-sm mb-2 flex items-center gap-2 uppercase tracking-[0.18em] text-[var(--color-secondary)]">
                <Filter size={16} strokeWidth={1.8} />
                Categoría
              </span>
              <div className="relative min-w-0">
                <select
                  value={selectedCategory}
                  onChange={(event) => updateCategory(event.target.value)}
                  className="text-body-md w-full min-w-0 appearance-none border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-4 py-3 pr-10 text-[var(--color-on-surface)] focus:border-[var(--color-primary)] focus:outline-none"
                >
                  {categoryFilters.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
                <ChevronDown size={18} strokeWidth={1.8} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]" />
              </div>
            </label>

            <div className="min-w-0">
              <span className="text-label-sm mb-2 flex items-center gap-2 uppercase tracking-[0.18em] text-[var(--color-secondary)]">
                <Filter size={16} strokeWidth={1.8} />
                Estado de publicación
              </span>
              <div className="flex flex-wrap gap-3 pb-1">
                {STATUS_FILTERS.map((status) => {
                  const count =
                    status === 'Todos'
                      ? filteredProducts.length
                      : productos.filter((p) => resolveProductStatus(p) === status).length

                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => updateStatus(status)}
                      className={`text-label-md max-w-full whitespace-normal rounded-full border px-4 py-2 text-left transition-all sm:whitespace-nowrap ${selectedStatus === status ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'}`}
                    >
                      {status} ({count})
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-4">
          {visibleProducts.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              onEdit={() => setEditingTargetId(producto.id)}
              onTogglePublication={() => setPublicationTargetId(producto.id)}
              onDelete={() => setDeleteTargetId(producto.id)}
            />
          ))}
        </div>

        {visibleProducts.length === 0 ? (
          <div className="mt-10 border border-dashed border-[var(--color-outline-variant)] p-10 text-center">
            <Filter className="mx-auto mb-3 text-[var(--color-outline)]" size={28} strokeWidth={1.8} />
            <p className="text-body-md text-[var(--color-on-surface-variant)]">No hay productos que coincidan con los filtros aplicados.</p>
          </div>
        ) : null}

        <section className="mt-12 flex flex-col gap-4 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-label-sm italic text-[var(--color-outline)]">Mostrando {visibleProducts.length} de {filteredProducts.length} productos filtrados</p>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button type="button" disabled={safePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className="flex size-10 items-center justify-center rounded-full border border-[var(--color-outline-variant)] text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-container-high)] disabled:cursor-not-allowed disabled:opacity-50">
              <ChevronLeft size={18} strokeWidth={1.8} />
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button key={page} type="button" onClick={() => setCurrentPage(page)} className={`text-label-md flex size-9 items-center justify-center rounded-full transition-colors ${page === safePage ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]' : 'text-[var(--color-secondary)] hover:bg-[var(--color-surface-container-high)]'}`}>
                {page}
              </button>
            ))}
            <button type="button" disabled={safePage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className="flex size-10 items-center justify-center rounded-full border border-[var(--color-outline-variant)] text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-container-high)] disabled:cursor-not-allowed disabled:opacity-50">
              <ChevronRight size={18} strokeWidth={1.8} />
            </button>
          </div>
        </section>
      </main>

      {showAgregarModal ? (
        <AgregarProductoModal
          onClose={() => setShowAgregarModal(false)}
          createMutation={createMutation}
        />
      ) : null}

      {editingTarget ? (
        <EditarProductoModal
          producto={editingTarget}
          onClose={() => setEditingTargetId(null)}
          updateMutation={updateMutation}
        />
      ) : null}

      {deleteTarget ? (
        <EliminarProductoModal
          producto={deleteTarget}
          isPending={deleteMutation.isPending}
          onClose={() => setDeleteTargetId(null)}
          onConfirm={() => handleDeleteConfirm(deleteTarget.id)}
        />
      ) : null}

      {publicationTarget ? (
        <PublicacionProductoModal
          producto={publicationTarget}
          isPending={updateMutation.isPending}
          onClose={() => setPublicationTargetId(null)}
          onConfirm={() => handleTogglePublication(publicationTarget)}
        />
      ) : null}

      {stockWarningTarget ? (
        <AvisoStockModal
          isPending={updateMutation.isPending}
          onClose={() => setShowStockWarningForId(null)}
          onPublish={() => handlePublishWithoutStock(stockWarningTarget.id)}
        />
      ) : null}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ProductCard
// ---------------------------------------------------------------------------

type ProductCardProps = {
  producto: ProductDTO
  onEdit: () => void
  onTogglePublication: () => void
  onDelete: () => void
}

function ProductCard({ producto, onEdit, onTogglePublication, onDelete }: ProductCardProps) {
  const status = resolveProductStatus(producto)
  const isInactive = status === 'Despublicado'
  const isOutOfStock = producto.stock === 0 || status === 'Sin disponibilidad'
  const publicationLabel = isInactive ? 'Publicar producto' : 'Despublicar producto'

  // Primary thumbnail from the backend image projection (images ordered by position ASC).
  // Falls back to an accessible SVG placeholder when no image has been uploaded yet.
  const thumbnailUrl = producto.images?.[0]?.url ?? null

  return (
    <article className={`rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] bg-[var(--color-surface-container-lowest)] p-5 shadow-[0_10px_30px_-20px_rgba(122,46,58,0.25)] transition-all md:p-6 ${isInactive ? 'border-dashed' : ''}`}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-4 md:gap-5">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={producto.name}
              className={`size-24 shrink-0 rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)] object-cover md:size-28 ${isInactive ? 'grayscale-[0.55]' : ''}`}
            />
          ) : (
            // Accessible placeholder when the product has no uploaded image yet
            <div
              aria-label={`Sin imagen: ${producto.name}`}
              className={`size-24 shrink-0 rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-high)] md:size-28 ${isInactive ? 'grayscale-[0.55]' : ''}`}
            />
          )}

          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-start gap-3">
              <h2 className="text-headline-md text-[var(--color-on-surface)]">{producto.name}</h2>
              <StatusBadge status={status} />
              {producto.moderationStatus !== 'OK' ? (
                <ModerationBadge status={producto.moderationStatus} />
              ) : null}
            </div>

            <p className="text-label-sm mb-3 uppercase tracking-[0.18em] text-[var(--color-secondary)]">
              {producto.categoryId}
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-body-md text-[var(--color-on-surface)]">
              <span className="font-semibold text-[var(--color-primary)]">{formatMoney(producto.price)}</span>
              <span className="text-[var(--color-secondary)]">·</span>
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1 text-[var(--color-error)]">
                  <TriangleAlert size={16} strokeWidth={1.8} />
                  Sin stock
                </span>
              ) : producto.stock <= (producto.lowStockThreshold ?? 5) ? (
                <span className="inline-flex items-center gap-1 text-amber-700">
                  <TriangleAlert size={16} strokeWidth={1.8} />
                  {producto.stock} uds (bajo)
                </span>
              ) : (
                <span className="text-[var(--color-secondary)]">{producto.stock} uds</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] pt-4 lg:border-t-0 lg:pt-0">
          <ActionBtn aria-label="Editar publicación" onClick={onEdit}>
            <Pencil size={18} strokeWidth={1.8} />
          </ActionBtn>
          <ActionBtn aria-label={publicationLabel} onClick={onTogglePublication} className="text-[var(--color-primary)]">
            {isInactive ? <Eye size={18} strokeWidth={1.8} /> : <EyeOff size={18} strokeWidth={1.8} />}
          </ActionBtn>
          <ActionBtn aria-label="Eliminar producto" onClick={onDelete} danger>
            <Trash2 size={18} strokeWidth={1.8} />
          </ActionBtn>
        </div>
      </div>
    </article>
  )
}

// ---------------------------------------------------------------------------
// Small shared UI components
// ---------------------------------------------------------------------------

type ActionBtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { danger?: boolean }

function ActionBtn({ children, danger, className = '', ...rest }: ActionBtnProps) {
  return (
    <button
      type="button"
      className={`rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)] p-2 transition-colors ${danger ? 'text-[var(--color-error)] hover:bg-red-50' : 'text-[var(--color-secondary)] hover:bg-[var(--color-surface-container-high)]'} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

function StatusBadge({ status }: { status: DisplayStatus }) {
  switch (status) {
    case 'Publicado':
      return (
        <span className="text-label-md inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
          <span className="mr-2 size-1.5 rounded-full bg-emerald-500" />
          Publicado
        </span>
      )
    case 'Despublicado':
      return (
        <span className="text-label-md inline-flex items-center rounded-full border border-dashed border-[var(--color-outline)] bg-[var(--color-surface-container-highest)] px-3 py-1 text-xs text-[var(--color-secondary)]">
          Despublicado
        </span>
      )
    case 'Sin disponibilidad':
      return (
        <span className="text-label-md inline-flex items-center rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs text-[var(--color-error)]">
          Sin disponibilidad
        </span>
      )
  }
}

function ModerationBadge({ status }: { status: 'REPORTED' | 'REMOVED' }) {
  if (status === 'REPORTED') {
    return (
      <span className="text-label-md inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700">
        <TriangleAlert size={12} strokeWidth={2} />
        Reportado
      </span>
    )
  }
  return (
    <span className="text-label-md inline-flex items-center rounded-full border border-red-200 bg-red-100 px-3 py-1 text-xs text-[var(--color-error)]">
      Eliminado por moderación
    </span>
  )
}
