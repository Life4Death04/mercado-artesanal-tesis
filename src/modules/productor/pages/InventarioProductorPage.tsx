import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ChevronRight, CircleAlert, Minus, Pencil, Plus, Search, TriangleAlert } from 'lucide-react'

type StockStatus = 'En stock' | 'Stock bajo' | 'Agotado'

type InventarioItem = {
  id: string
  nombre: string
  categoria: string
  stock: number
  imagen: string
}

const UMBRAL_STOCK_BAJO = 5

const itemsIniciales: InventarioItem[] = [
  {
    id: 'inv-1',
    nombre: 'Aceite de Oliva Virgen Extra',
    categoria: 'Aceites y Vinagres',
    stock: 15,
    imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClWartENzQpyYqJqC8C4CvjIiFaKAyZP8yX1LEAVF7YfPqWK3nOXErjiWhtizxf-lyP1uoUoMfZUE3arRlSWZ6qI-Xkt4aAAxLjLEsDE10Doa5JaG507RT_rtIbU9KbleQecy5AT5L4iwCL1t8eme21sfM4I60yTk6B0YnZoaprunc9Mk5o0djAiGVqudXiCiYihnUUFD2i667ajuXszCDMyWIAWwqoiIkmvfB8ZdKsBNWs6Mz3Q5oCA-XNfOIObhgzaQ29epkSIc',
  },
  {
    id: 'inv-2',
    nombre: 'Turron de Jijona',
    categoria: 'Dulces y Postres',
    stock: 3,
    imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBa3xANjK2EgB5yaNlw8gcPw-pY3zqpXxN9K59so5M-jXlpVsxulQD69-4SCqagHHU3k9WB4AlzLtXU9d_bWaym7koFMKvn3g4jo8cdXrXRK_bwdPDy5wXx0P7jIjFD1TfbA369Wv8Q_FK3hB0QHkiQ4DAc-2vxft4twZMKErAzLEG5JFf2wgZJbtgF3-Ti9qY49J2zsL1pDPE0F0NSrHyECC9sWFCX-Ex7p6fUKF8Ipan4Bk03Xhr1-dYZ4maLmxgjlOAMzv0nE2o',
  },
  {
    id: 'inv-3',
    nombre: 'Vino Tinto Monastrell',
    categoria: 'Vinos y Licores',
    stock: 0,
    imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1bOu_zOWwTGLS4PhTTQTYYnJk9xAAGe-3FxShYcVG6zxBDq6yKZq5d7YYzbsd5A83FvIiwU-8BUnq5Nxj15fA6kARpABFqdDcRWcDAygwTz8NeF3bDKHeCBrfgetMLa1UsmR8cmTuBZsFZ_ZPG79eDLXDDNCD6JXwjdIeajtS3OYQAwteEszio_ukRGOgY3qKec8IiNA5aBFwtJZKVTNIpbLcs-D3wFzQ2u2K3NCsRTuhd90z8TfpeJAtG0Vm2wvqrxxVcnWV3qk',
  },
  {
    id: 'inv-4',
    nombre: 'Sobrasada de la Montana',
    categoria: 'Embutidos',
    stock: 42,
    imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYs77QFQGe7CrEcNnV0iD57RGRXVyM75KeB4DGFhakPUZs2LXS4sy-Hb8oAD8WBFMj3LFFnEukuUThn7pPLkGCWGGSCjxioW9bNyyZbX5JWBOMDouZEKlh23d8ZpQSEIsoCwO9AMiywNMIF9jx-Kzx41dTLzf9Wm_BSwQ1D4NG_2F10G7uFO3Ht9OHQFbRoXV_4LmcGRzZH4olU35glgGUsDgykQzdmzHKk67NEYWR_iie2XBsftEfCtpME',
  },
]

type FiltroActivo = 'Todos' | 'Stock bajo' | 'Agotados'

function getStatus(stock: number): StockStatus {
  if (stock === 0) return 'Agotado'
  if (stock <= UMBRAL_STOCK_BAJO) return 'Stock bajo'
  return 'En stock'
}

export function InventarioProductorPage() {
  const [items, setItems] = useState<InventarioItem[]>(itemsIniciales)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftStock, setDraftStock] = useState<Record<string, number>>({})
  const [filtro, setFiltro] = useState<FiltroActivo>('Todos')
  const [search, setSearch] = useState('')

  const normalizedSearch = search.trim().toLowerCase()
  const filtered = items.filter((item) => {
    const matchesSearch = !normalizedSearch || [item.nombre, item.categoria, String(item.stock)].join(' ').toLowerCase().includes(normalizedSearch)
    const matchesStatus = filtro === 'Todos' || (filtro === 'Stock bajo' ? getStatus(item.stock) === 'Stock bajo' : getStatus(item.stock) === 'Agotado')
    return matchesSearch && matchesStatus
  })

  const enStock = items.filter((item) => getStatus(item.stock) === 'En stock').length
  const stockBajo = items.filter((item) => getStatus(item.stock) === 'Stock bajo').length
  const agotados = items.filter((item) => getStatus(item.stock) === 'Agotado').length

  function startEdit(item: InventarioItem) {
    setEditingId(item.id)
    setDraftStock((current) => ({ ...current, [item.id]: item.stock }))
  }

  function saveEdit(id: string) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, stock: draftStock[id] ?? item.stock } : item)))
    setEditingId(null)
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

        <div className="flex flex-col gap-4">
          {filtered.map((item) => {
            const status = getStatus(item.stock)
            const isEditing = editingId === item.id
            const currentDraft = draftStock[item.id] ?? item.stock

            return isEditing ? (
              <EditingRow
                key={item.id}
                item={item}
                draftStock={currentDraft}
                onDecrement={() => changeDraft(item.id, -1)}
                onIncrement={() => changeDraft(item.id, 1)}
                onChange={(value) => updateDraft(item.id, value)}
                onSave={() => saveEdit(item.id)}
              />
            ) : (
              <NormalRow key={item.id} item={item} status={status} onEdit={() => startEdit(item)} />
            )
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 border border-dashed border-[var(--color-outline-variant)] p-10 text-center">
            <Search className="mx-auto mb-3 text-[var(--color-outline)]" size={28} strokeWidth={1.8} />
            <p className="text-body-md text-[var(--color-on-surface-variant)]">No hay productos que coincidan con la búsqueda o el filtro aplicado.</p>
          </div>
        ) : null}
      </main>
    </div>
  )
}

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

type NormalRowProps = {
  item: InventarioItem
  status: StockStatus
  onEdit: () => void
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

function NormalRow({ item, status, onEdit }: NormalRowProps) {
  const isAgotado = status === 'Agotado'

  return (
    <article className={`rounded-[var(--radius-xl)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-4 transition-colors hover:bg-[var(--color-surface-container-low)] md:p-5 ${isAgotado ? 'opacity-80' : ''}`}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4 md:gap-5">
          <img src={item.imagen} alt={item.nombre} className={`size-16 shrink-0 rounded-[var(--radius-lg)] object-cover md:size-20 ${isAgotado ? 'grayscale' : ''}`} />
          <div className="min-w-0">
            <h2 className="text-headline-md text-[var(--color-on-surface)] md:text-[24px] md:leading-8">{item.nombre}</h2>
            <p className="text-body-md mt-1 text-[var(--color-secondary)]">{item.categoria}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[var(--color-outline-variant)] pt-4 sm:flex-row sm:items-center sm:justify-between lg:w-auto lg:border-t-0 lg:pt-0">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full" style={{ backgroundColor: STATUS_DOT[status] }} />
            <span className={`text-label-sm uppercase tracking-widest ${STATUS_LABEL_CLASS[status]}`}>{status}</span>
          </div>
          <div className={`text-body-lg sm:min-w-[116px] sm:text-right ${isAgotado ? 'text-[var(--color-secondary)]' : 'text-[var(--color-on-surface)]'}`}>
            {item.stock} unidades
          </div>
          <button type="button" aria-label={`Editar stock de ${item.nombre}`} onClick={onEdit} className="inline-flex items-center gap-2 self-start text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary)] sm:self-auto">
            <Pencil size={18} strokeWidth={1.8} />
            <span className="text-label-md sm:hidden">Editar stock</span>
          </button>
        </div>
      </div>
    </article>
  )
}

type EditingRowProps = {
  item: InventarioItem
  draftStock: number
  onDecrement: () => void
  onIncrement: () => void
  onChange: (value: number) => void
  onSave: () => void
}

function EditingRow({ item, draftStock, onDecrement, onIncrement, onChange, onSave }: EditingRowProps) {
  return (
    <article className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-outline)] bg-[var(--color-surface-container-highest)] p-4 shadow-sm md:p-5">
      <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#EF6C00]" />

      <div className="flex flex-col gap-5 pl-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4 md:gap-5">
          <img src={item.imagen} alt={item.nombre} className="size-16 shrink-0 rounded-[var(--radius-lg)] object-cover md:size-20" />
          <div className="min-w-0">
            <h2 className="text-headline-md text-[var(--color-on-surface)] md:text-[24px] md:leading-8">{item.nombre}</h2>
            <p className="text-body-md mt-1 text-[var(--color-secondary)]">{item.categoria}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[var(--color-outline-variant)] pt-4 lg:w-auto lg:border-t-0 lg:pt-0">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#EF6C00]" />
            <span className="text-label-sm uppercase tracking-widest text-[var(--color-secondary)]">Edición de stock</span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center overflow-hidden rounded-[var(--radius-default)] border border-[var(--color-primary)] bg-[var(--color-surface-container-lowest)]">
              <button type="button" aria-label="Reducir stock" onClick={onDecrement} className="flex size-10 items-center justify-center text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-container-high)]">
                <Minus size={16} strokeWidth={2} />
              </button>
              <input
                type="number"
                value={draftStock}
                onChange={(event) => onChange(parseInt(event.target.value, 10) || 0)}
                className="text-body-lg h-10 w-20 border-x border-[var(--color-outline-variant)] bg-transparent text-center text-[var(--color-on-surface)] focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button type="button" aria-label="Aumentar stock" onClick={onIncrement} className="flex size-10 items-center justify-center text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-container-high)]">
                <Plus size={16} strokeWidth={2} />
              </button>
            </div>

            <button type="button" onClick={onSave} className="text-label-md h-10 rounded-[var(--radius-default)] bg-[var(--color-primary-container)] px-6 py-2 text-[var(--color-on-primary-container)] transition-colors hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)]">
              Guardar
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
