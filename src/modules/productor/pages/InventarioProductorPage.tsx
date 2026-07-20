import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ChevronRight, CircleAlert, Loader2, Minus, Pencil, Plus, Search, TriangleAlert } from 'lucide-react'
import { useInventarioQuery } from '../inventario/hooks/useInventarioQuery'
import { useUpdateStockMutation } from '../inventario/hooks/useUpdateStockMutation'
import { resolveErrorMessage } from '../../../lib/errorMessages'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const UMBRAL_STOCK_BAJO = 5

// ---------------------------------------------------------------------------
// Types (UI-only — derived from InventoryItemDTO for local display)
// ---------------------------------------------------------------------------

type StockStatus = 'En stock' | 'Stock bajo' | 'Agotado'

function getStatus(stock: number): StockStatus {
  if (stock === 0) return 'Agotado'
  if (stock <= UMBRAL_STOCK_BAJO) return 'Stock bajo'
  return 'En stock'
}

type FiltroActivo = 'Todos' | 'Stock bajo' | 'Agotados'

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export function InventarioProductorPage() {
  const { data: items = [], isLoading, isError, error } = useInventarioQuery()
  const updateStockMutation = useUpdateStockMutation()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftStock, setDraftStock] = useState<Record<string, number>>({})
  const [filtro, setFiltro] = useState<FiltroActivo>('Todos')
  const [search, setSearch] = useState('')
  const [successId, setSuccessId] = useState<string | null>(null)

  const normalizedSearch = search.trim().toLowerCase()
  const filtered = items.filter((item) => {
    const matchesSearch =
      !normalizedSearch ||
      [item.name, item.categoryName, String(item.stock)]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    const status = getStatus(item.stock)
    const matchesStatus =
      filtro === 'Todos' ||
      (filtro === 'Stock bajo' ? status === 'Stock bajo' : status === 'Agotado')
    return matchesSearch && matchesStatus
  })

  const enStock = items.filter((item) => getStatus(item.stock) === 'En stock').length
  const stockBajo = items.filter((item) => getStatus(item.stock) === 'Stock bajo').length
  const agotados = items.filter((item) => getStatus(item.stock) === 'Agotado').length

  function startEdit(itemId: string, currentStock: number) {
    setEditingId(itemId)
    setSuccessId(null)
    setDraftStock((current) => ({ ...current, [itemId]: currentStock }))
  }

  function cancelEdit() {
    setEditingId(null)
    updateStockMutation.reset()
  }

  function saveEdit(productId: string) {
    const newStock = draftStock[productId] ?? 0
    updateStockMutation.mutate(
      { productId, body: { stock: newStock } },
      {
        onSuccess: () => {
          setEditingId(null)
          setSuccessId(productId)
          // Clear the success message after 3 s
          setTimeout(() => setSuccessId((current) => (current === productId ? null : current)), 3000)
        },
      },
    )
  }

  function changeDraft(id: string, delta: number) {
    setDraftStock((current) => ({
      ...current,
      [id]: Math.max(0, (current[id] ?? 0) + delta),
    }))
  }

  function updateDraft(id: string, value: number) {
    setDraftStock((current) => ({
      ...current,
      [id]: Math.max(0, value),
    }))
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <main className="mx-auto w-full max-w-[var(--layout-container-max)] px-[var(--space-margin-mobile)] py-12 md:px-[var(--space-margin-desktop)] md:py-16">
        <section className="mb-10">
          <nav aria-label="Breadcrumb" className="text-label-sm mb-6 flex items-center gap-2 text-[var(--color-secondary)]">
            <Link to="/productor/pedidos" className="transition-colors hover:text-[var(--color-primary)]">Area Productor</Link>
            <ChevronRight size={14} strokeWidth={1.8} />
            <span className="text-[var(--color-primary)]">Inventario</span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-display-lg mb-4 text-[var(--color-primary)]">Inventario</h1>
              <p className="text-body-md max-w-2xl text-[var(--color-on-surface-variant)]">
                Supervisa disponibilidad, detecta productos con stock bajo y ajusta unidades desde una vista compacta para móvil y escritorio.
              </p>
            </div>

            <div className="border border-[color-mix(in_srgb,var(--color-outline-variant)_40%,transparent)] bg-white/45 px-5 py-4 text-right shadow-[0_18px_50px_-35px_rgba(122,46,58,0.35)]">
              <span className="text-label-sm block uppercase tracking-[0.18em] text-[var(--color-outline)]">Umbral actual</span>
              <strong className="text-headline-md text-[28px] text-[var(--color-primary)]">{UMBRAL_STOCK_BAJO} uds</strong>
            </div>
          </div>
        </section>

        {/* Global error banner — visible when the list query fails */}
        {isError ? (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-8 border border-[var(--color-error)] bg-[var(--color-error-container)] px-5 py-4 text-[var(--color-error)]"
          >
            <p className="text-body-md">{resolveErrorMessage(error)}</p>
          </div>
        ) : null}

        <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard label="En stock" value={enStock} icon={<CheckCircle2 size={24} strokeWidth={1.8} className="text-[#2E7D32]" />} iconBg="#E8F5E9" />
          <SummaryCard label="Stock bajo" value={stockBajo} icon={<TriangleAlert size={24} strokeWidth={1.8} className="text-[#EF6C00]" />} iconBg="#FFF3E0" />
          <SummaryCard label="Agotados" value={agotados} icon={<CircleAlert size={24} strokeWidth={1.8} className="text-[#C62828]" />} iconBg="#FFEBEE" />
        </section>

        <section className="mb-8 border border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-surface-container-lowest)] p-4 shadow-[0_18px_50px_-35px_rgba(122,46,58,0.35)] md:p-6" aria-label="Filtros del inventario">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              {(['Todos', 'Stock bajo', 'Agotados'] as FiltroActivo[]).map((estado) => (
                <button
                  key={estado}
                  type="button"
                  onClick={() => setFiltro(estado)}
                  className={`text-label-md rounded-full border px-4 py-2 transition-colors ${filtro === estado ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' : 'border-[var(--color-outline-variant)] bg-[var(--color-surface)] text-[var(--color-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'}`}
                >
                  {estado}
                </button>
              ))}
            </div>

            <label className="relative w-full lg:max-w-xs">
              <Search size={18} strokeWidth={1.8} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)]" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar producto o categoría..."
                className="text-body-md w-full border border-[var(--color-outline-variant)] bg-[#FAF7F0] py-3 pl-11 pr-4 text-[#1A1A1A] placeholder:text-[var(--color-outline)] focus:border-[var(--color-primary)] focus:outline-none"
              />
            </label>
          </div>
        </section>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-[var(--color-secondary)]">
            <Loader2 size={24} strokeWidth={1.8} className="animate-spin" />
            <span className="text-body-md">Cargando inventario...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((item) => {
              const status = getStatus(item.stock)
              const isEditing = editingId === item.id
              const currentDraft = draftStock[item.id] ?? item.stock
              const isThisPending = updateStockMutation.isPending && editingId === item.id
              const mutationError = updateStockMutation.isError && editingId === item.id
                ? resolveErrorMessage(updateStockMutation.error)
                : null

              return isEditing ? (
                <EditingRow
                  key={item.id}
                  itemName={item.name}
                  itemCategory={item.categoryName}
                  itemImageUrl={item.imageUrl}
                  draftStock={currentDraft}
                  isPending={isThisPending}
                  mutationError={mutationError}
                  onDecrement={() => changeDraft(item.id, -1)}
                  onIncrement={() => changeDraft(item.id, 1)}
                  onChange={(value) => updateDraft(item.id, value)}
                  onSave={() => saveEdit(item.id)}
                  onCancel={cancelEdit}
                />
              ) : (
                <NormalRow
                  key={item.id}
                  itemId={item.id}
                  itemName={item.name}
                  itemCategory={item.categoryName}
                  itemStock={item.stock}
                  itemImageUrl={item.imageUrl}
                  status={status}
                  showSuccess={successId === item.id}
                  onEdit={() => startEdit(item.id, item.stock)}
                />
              )
            })}
          </div>
        )}

        {!isLoading && filtered.length === 0 ? (
          <div className="mt-10 border border-dashed border-[var(--color-outline-variant)] p-10 text-center">
            <Search className="mx-auto mb-3 text-[var(--color-outline)]" size={28} strokeWidth={1.8} />
            <p className="text-body-md text-[var(--color-on-surface-variant)]">No hay productos que coincidan con la búsqueda o el filtro aplicado.</p>
          </div>
        ) : null}
      </main>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SummaryCard({ label, value, icon, iconBg }: { label: string; value: number; icon: React.ReactNode; iconBg: string }) {
  return (
    <div className="flex items-center justify-between rounded-[var(--radius-xl)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-5 md:p-6">
      <div>
        <p className="text-label-md mb-1 uppercase tracking-widest text-[var(--color-secondary)]">{label}</p>
        <p className="text-display-lg-mobile text-[var(--color-on-surface)]">{value}</p>
      </div>
      <div className="flex size-12 items-center justify-center rounded-full" style={{ backgroundColor: iconBg }}>
        {icon}
      </div>
    </div>
  )
}

const STATUS_DOT: Record<StockStatus, string> = {
  'En stock': '#2E7D32',
  'Stock bajo': '#EF6C00',
  Agotado: '#C62828',
}

const STATUS_LABEL_CLASS: Record<StockStatus, string> = {
  'En stock': 'text-[var(--color-secondary)]',
  'Stock bajo': 'text-[var(--color-secondary)]',
  Agotado: 'text-[#C62828]',
}

type NormalRowProps = {
  itemId: string
  itemName: string
  itemCategory: string
  itemStock: number
  itemImageUrl: string | null
  status: StockStatus
  showSuccess: boolean
  onEdit: () => void
}

function NormalRow({ itemName, itemCategory, itemStock, itemImageUrl, status, showSuccess, onEdit }: NormalRowProps) {
  const isAgotado = status === 'Agotado'

  return (
    <article className={`rounded-[var(--radius-xl)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-4 transition-colors hover:bg-[var(--color-surface-container-low)] md:p-5 ${isAgotado ? 'opacity-80' : ''}`}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4 md:gap-5">
          {itemImageUrl ? (
            <img src={itemImageUrl} alt={itemName} className={`size-16 shrink-0 rounded-[var(--radius-lg)] object-cover md:size-20 ${isAgotado ? 'grayscale' : ''}`} />
          ) : (
            <div className={`size-16 shrink-0 rounded-[var(--radius-lg)] bg-[var(--color-surface-container-high)] md:size-20 ${isAgotado ? 'grayscale' : ''}`} aria-hidden="true" />
          )}
          <div className="min-w-0">
            <h2 className="text-headline-md text-[var(--color-on-surface)] md:text-[24px] md:leading-8">{itemName}</h2>
            <p className="text-body-md mt-1 text-[var(--color-secondary)]">{itemCategory}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[var(--color-outline-variant)] pt-4 sm:flex-row sm:items-center sm:justify-between lg:w-auto lg:border-t-0 lg:pt-0">
          {showSuccess ? (
            <span
              aria-live="polite"
              className="text-label-sm rounded-full bg-[rgba(46,125,50,0.12)] px-3 py-1 text-[#2E7D32]"
            >
              Stock actualizado
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full" style={{ backgroundColor: STATUS_DOT[status] }} />
              <span className={`text-label-sm uppercase tracking-widest ${STATUS_LABEL_CLASS[status]}`}>{status}</span>
            </div>
          )}
          <div className={`text-body-lg sm:min-w-[116px] sm:text-right ${isAgotado ? 'text-[var(--color-secondary)]' : 'text-[var(--color-on-surface)]'}`}>
            {itemStock} unidades
          </div>
          <button type="button" aria-label={`Editar stock de ${itemName}`} onClick={onEdit} className="inline-flex items-center gap-2 self-start text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary)] sm:self-auto">
            <Pencil size={18} strokeWidth={1.8} />
            <span className="text-label-md sm:hidden">Editar stock</span>
          </button>
        </div>
      </div>
    </article>
  )
}

type EditingRowProps = {
  itemName: string
  itemCategory: string
  itemImageUrl: string | null
  draftStock: number
  isPending: boolean
  mutationError: string | null
  onDecrement: () => void
  onIncrement: () => void
  onChange: (value: number) => void
  onSave: () => void
  onCancel: () => void
}

function EditingRow({ itemName, itemCategory, itemImageUrl, draftStock, isPending, mutationError, onDecrement, onIncrement, onChange, onSave, onCancel }: EditingRowProps) {
  return (
    <article className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-outline)] bg-[var(--color-surface-container-highest)] p-4 shadow-sm md:p-5">
      <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#EF6C00]" />

      <div className="flex flex-col gap-5 pl-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4 md:gap-5">
          {itemImageUrl ? (
            <img src={itemImageUrl} alt={itemName} className="size-16 shrink-0 rounded-[var(--radius-lg)] object-cover md:size-20" />
          ) : (
            <div className="size-16 shrink-0 rounded-[var(--radius-lg)] bg-[var(--color-surface-container-high)] md:size-20" aria-hidden="true" />
          )}
          <div className="min-w-0">
            <h2 className="text-headline-md text-[var(--color-on-surface)] md:text-[24px] md:leading-8">{itemName}</h2>
            <p className="text-body-md mt-1 text-[var(--color-secondary)]">{itemCategory}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[var(--color-outline-variant)] pt-4 lg:w-auto lg:border-t-0 lg:pt-0">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#EF6C00]" />
            <span className="text-label-sm uppercase tracking-widest text-[var(--color-secondary)]">Edición de stock</span>
          </div>

          {mutationError ? (
            <p role="alert" aria-live="assertive" className="text-body-sm text-[var(--color-error)]">
              {mutationError}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center overflow-hidden rounded-[var(--radius-default)] border border-[var(--color-primary)] bg-[var(--color-surface-container-lowest)]">
              <button
                type="button"
                aria-label="Reducir stock"
                onClick={onDecrement}
                disabled={isPending}
                className="flex size-10 items-center justify-center text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-container-high)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus size={16} strokeWidth={2} />
              </button>
              <input
                type="number"
                value={draftStock}
                onChange={(event) => onChange(parseInt(event.target.value, 10) || 0)}
                disabled={isPending}
                className="text-body-lg h-10 w-20 border-x border-[var(--color-outline-variant)] bg-transparent text-center text-[var(--color-on-surface)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                type="button"
                aria-label="Aumentar stock"
                onClick={onIncrement}
                disabled={isPending}
                className="flex size-10 items-center justify-center text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-container-high)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus size={16} strokeWidth={2} />
              </button>
            </div>

            <button
              type="button"
              onClick={onSave}
              disabled={isPending}
              className="text-label-md inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius-default)] bg-[var(--color-primary-container)] px-6 py-2 text-[var(--color-on-primary-container)] transition-colors hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? <Loader2 size={16} strokeWidth={2} className="animate-spin" /> : null}
              Guardar
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className="text-label-md h-10 rounded-[var(--radius-default)] border border-[var(--color-outline-variant)] px-4 py-2 text-[var(--color-secondary)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
