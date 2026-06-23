import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart2,
  BookOpen,
  CheckCircle2,
  CircleAlert,
  Minus,
  Package,
  Pencil,
  Plus,
  Search,
  ShoppingBag,
  Truck,
  TriangleAlert,
  User,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type StockStatus = 'En stock' | 'Stock bajo' | 'Agotado'

type InventarioItem = {
  id: string
  nombre: string
  categoria: string
  stock: number
  imagen: string
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const UMBRAL_STOCK_BAJO = 5

const itemsIniciales: InventarioItem[] = [
  {
    id: 'inv-1',
    nombre: 'Aceite de Oliva Virgen Extra',
    categoria: 'Aceites y Vinagres',
    stock: 15,
    imagen:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuClWartENzQpyYqJqC8C4CvjIiFaKAyZP8yX1LEAVF7YfPqWK3nOXErjiWhtizxf-lyP1uoUoMfZUE3arRlSWZ6qI-Xkt4aAAxLjLEsDE10Doa5JaG507RT_rtIbU9KbleQecy5AT5L4iwCL1t8eme21sfM4I60yTk6B0YnZoaprunc9Mk5o0djAiGVqudXiCiYihnUUFD2i667ajuXszCDMyWIAWwqoiIkmvfB8ZdKsBNWs6Mz3Q5oCA-XNfOIObhgzaQ29epkSIc',
  },
  {
    id: 'inv-2',
    nombre: 'Turrón de Jijona',
    categoria: 'Dulces y Postres',
    stock: 3,
    imagen:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBa3xANjK2EgB5yaNlw8gcPw-pY3zqpXxN9K59so5M-jXlpVsxulQD69-4SCqagHHU3k9WB4AlzLtXU9d_bWaym7koFMKvn3g4jo8cdXrXRK_bwdPDy5wXx0P7jIjFD1TfbA369Wv8Q_FK3hB0QHkiQ4DAc-2vxft4twZMKErAzLEG5JFf2wgZJbtgF3-Ti9qY49J2zsL1pDPE0F0NSrHyECC9sWFCX-Ex7p6fUKF8Ipan4Bk03Xhr1-dYZ4maLmxgjlOAMzv0nE2o',
  },
  {
    id: 'inv-3',
    nombre: 'Vino Tinto Monastrell',
    categoria: 'Vinos y Licores',
    stock: 0,
    imagen:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC1bOu_zOWwTGLS4PhTTQTYYnJk9xAAGe-3FxShYcVG6zxBDq6yKZq5d7YYzbsd5A83FvIiwU-8BUnq5Nxj15fA6kARpABFqdDcRWcDAygwTz8NeF3bDKHeCBrfgetMLa1UsmR8cmTuBZsFZ_ZPG79eDLXDDNCD6JXwjdIeajtS3OYQAwteEszio_ukRGOgY3qKec8IiNA5aBFwtJZKVTNIpbLcs-D3wFzQ2u2K3NCsRTuhd90z8TfpeJAtG0Vm2wvqrxxVcnWV3qk',
  },
  {
    id: 'inv-4',
    nombre: 'Sobrasada de la Montaña',
    categoria: 'Embutidos',
    stock: 42,
    imagen:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBYs77QFQGe7CrEcNnV0iD57RGRXVyM75KeB4DGFhakPUZs2LXS4sy-Hb8oAD8WBFMj3LFFnEukuUThn7pPLkGCWGGSCjxioW9bNyyZbX5JWBOMDouZEKlh23d8ZpQSEIsoCwO9AMiywNMIF9jx-Kzx41dTLzf9Wm_BSwQ1D4NG_2F10G7uFO3Ht9OHQFbRoXV_4LmcGRzZH4olU35glgGUsDgykQzdmzHKk67NEYWR_iie2XBsftEfCtpME',
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getStatus(stock: number): StockStatus {
  if (stock === 0) return 'Agotado'
  if (stock <= UMBRAL_STOCK_BAJO) return 'Stock bajo'
  return 'En stock'
}

const NAV_ITEMS = [
  { icon: ShoppingBag, label: 'Mis pedidos', to: '/productor/pedidos', active: false },
  { icon: BookOpen, label: 'Mi catálogo', to: '/productor/productos', active: false },
  { icon: Package, label: 'Inventario', to: '/productor/inventario', active: true },
  { icon: BarChart2, label: 'Estadísticas', to: '/productor/estadisticas', active: false },
  { icon: Truck, label: 'Configuración de entregas', to: '/productor/entregas', active: false },
]

type FiltroActivo = 'Todos' | 'Stock bajo' | 'Agotados'

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function InventarioProductorPage() {
  const [items, setItems] = useState<InventarioItem[]>(itemsIniciales)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftStock, setDraftStock] = useState<Record<string, number>>({})
  const [filtro, setFiltro] = useState<FiltroActivo>('Todos')

  // Summary counters
  const enStock = items.filter((i) => getStatus(i.stock) === 'En stock').length
  const stockBajo = items.filter((i) => getStatus(i.stock) === 'Stock bajo').length
  const agotados = items.filter((i) => getStatus(i.stock) === 'Agotado').length

  // Filtered list
  const filtered = items.filter((item) => {
    if (filtro === 'Stock bajo') return getStatus(item.stock) === 'Stock bajo'
    if (filtro === 'Agotados') return getStatus(item.stock) === 'Agotado'
    return true
  })

  function startEdit(item: InventarioItem) {
    setEditingId(item.id)
    setDraftStock((prev) => ({ ...prev, [item.id]: item.stock }))
  }

  function saveEdit(id: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, stock: draftStock[id] ?? i.stock } : i)),
    )
    setEditingId(null)
  }

  function changeDraft(id: string, delta: number) {
    setDraftStock((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 0) + delta),
    }))
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-surface)] text-[var(--color-on-surface)]">
      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col border-r border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] p-6 md:flex">
        <div className="mb-12">
          <Link to="/" className="text-headline-md font-bold text-[var(--color-primary)]">
            Alicante Gourmet
          </Link>
          <p className="text-body-md mt-2 text-[var(--color-secondary)]">Artesano de Denia</p>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {NAV_ITEMS.map(({ icon: Icon, label, to, active }) => (
            <Link
              key={label}
              to={to}
              className={`flex items-center gap-3 rounded-[var(--radius-lg)] px-4 py-3 transition-all duration-200 ${active ? 'translate-x-0.5 bg-[var(--color-secondary-container)] font-semibold text-[var(--color-primary)]' : 'text-[var(--color-secondary)] hover:bg-[var(--color-surface-container-high)]'}`}
            >
              <Icon size={20} strokeWidth={active ? 2 : 1.8} />
              <span className="text-label-md">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-[var(--color-outline-variant)] pt-4">
          <Link to="/productor/perfil" className="flex items-center gap-3 rounded-[var(--radius-lg)] px-4 py-3 text-[var(--color-secondary)] transition-all hover:bg-[var(--color-surface-container-high)]">
            <User size={20} strokeWidth={1.8} />
            <span className="text-label-md">Mi perfil</span>
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="ml-0 min-h-screen flex-1 px-[var(--space-margin-mobile)] py-12 pb-24 md:ml-64 md:px-[var(--space-margin-desktop)]">
        {/* Header */}
        <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-display-lg text-[var(--color-primary)]">Inventario</h1>
            <p className="text-body-lg mt-2 text-[var(--color-secondary)]">
              Umbral de stock bajo: {UMBRAL_STOCK_BAJO} unidades
            </p>
          </div>
          <button
            type="button"
            className="text-label-md flex items-center gap-2 self-start rounded-[var(--radius-default)] bg-[var(--color-primary)] px-6 py-3 text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-on-primary-fixed-variant)] md:self-auto"
          >
            <Plus size={18} strokeWidth={2} />
            Añadir producto
          </button>
        </header>

        {/* Summary cards */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <SummaryCard
            label="En stock"
            value={enStock}
            icon={<CheckCircle2 size={24} strokeWidth={1.8} className="text-[#2E7D32]" />}
            iconBg="#E8F5E9"
          />
          <SummaryCard
            label="Stock bajo"
            value={stockBajo}
            icon={<TriangleAlert size={24} strokeWidth={1.8} className="text-[#EF6C00]" />}
            iconBg="#FFF3E0"
          />
          <SummaryCard
            label="Agotados"
            value={agotados}
            icon={<CircleAlert size={24} strokeWidth={1.8} className="text-[#C62828]" />}
            iconBg="#FFEBEE"
          />
        </div>

        {/* Filters & search */}
        <div className="mb-8 flex flex-col items-start justify-between gap-6 border-b border-[var(--color-outline-variant)] pb-6 md:flex-row md:items-center">
          <div className="flex w-full gap-2 overflow-x-auto pb-2 md:w-auto md:pb-0" style={{ scrollbarWidth: 'none' }}>
            {(['Todos', 'Stock bajo', 'Agotados'] as FiltroActivo[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFiltro(f)}
                className={`text-label-md whitespace-nowrap rounded-full px-4 py-2 transition-colors ${filtro === f ? 'bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface)]' : 'border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] text-[var(--color-secondary)] hover:bg-[var(--color-surface-container-low)]'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search size={18} strokeWidth={1.8} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]" />
            <input
              type="text"
              placeholder="Buscar producto..."
              className="text-body-md w-full rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] py-2 pl-10 pr-4 transition-all focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none"
            />
          </div>
        </div>

        {/* Product rows */}
        <div className="flex flex-col gap-4">
          {filtered.map((item) => {
            const status = getStatus(item.stock)
            const isEditing = editingId === item.id
            const currentDraft = draftStock[item.id] ?? item.stock

            if (isEditing) {
              return (
                <EditingRow
                  key={item.id}
                  item={item}
                  draftStock={currentDraft}
                  onDecrement={() => changeDraft(item.id, -1)}
                  onIncrement={() => changeDraft(item.id, 1)}
                  onChange={(v) => setDraftStock((prev) => ({ ...prev, [item.id]: Math.max(0, v) }))}
                  onSave={() => saveEdit(item.id)}
                />
              )
            }

            return (
              <NormalRow
                key={item.id}
                item={item}
                status={status}
                onEdit={() => startEdit(item)}
              />
            )
          })}
        </div>
      </main>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Summary card
// ---------------------------------------------------------------------------

function SummaryCard({
  label,
  value,
  icon,
  iconBg,
}: {
  label: string
  value: number
  icon: React.ReactNode
  iconBg: string
}) {
  return (
    <div className="flex items-center justify-between rounded-[var(--radius-xl)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-6">
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

// ---------------------------------------------------------------------------
// Normal product row
// ---------------------------------------------------------------------------

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
    <article className={`flex flex-col items-start gap-6 rounded-[var(--radius-xl)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-4 transition-colors hover:bg-[var(--color-surface-container-low)] md:flex-row md:items-center ${isAgotado ? 'opacity-75' : ''}`}>
      <div className="flex min-w-0 flex-1 items-center gap-6">
        <img
          src={item.imagen}
          alt={item.nombre}
          className={`size-16 flex-shrink-0 rounded-[var(--radius-lg)] object-cover ${isAgotado ? 'grayscale' : ''}`}
        />
        <div className="min-w-0">
          <h3 className="text-headline-md truncate text-[24px] leading-8 text-[var(--color-on-surface)]">{item.nombre}</h3>
          <p className="text-body-md mt-1 text-[var(--color-secondary)]">{item.categoria}</p>
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-8 border-t border-[var(--color-outline-variant)] pt-4 md:w-auto md:justify-end md:border-t-0 md:pt-0">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ backgroundColor: STATUS_DOT[status] }} />
          <span className={`text-label-sm uppercase tracking-widest ${STATUS_LABEL_CLASS[status]}`}>{status}</span>
        </div>
        <div className={`text-body-lg min-w-[100px] text-right ${isAgotado ? 'text-[var(--color-secondary)]' : 'text-[var(--color-on-surface)]'}`}>
          {item.stock} unidades
        </div>
        <button
          type="button"
          aria-label={`Editar stock de ${item.nombre}`}
          onClick={onEdit}
          className="p-2 text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary)]"
        >
          <Pencil size={20} strokeWidth={1.8} />
        </button>
      </div>
    </article>
  )
}

// ---------------------------------------------------------------------------
// Editing row (inline stepper — shown when a product is being edited)
// ---------------------------------------------------------------------------

type EditingRowProps = {
  item: InventarioItem
  draftStock: number
  onDecrement: () => void
  onIncrement: () => void
  onChange: (v: number) => void
  onSave: () => void
}

function EditingRow({ item, draftStock, onDecrement, onIncrement, onChange, onSave }: EditingRowProps) {
  return (
    <article className="relative flex flex-col items-start gap-6 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-outline)] bg-[var(--color-surface-container-highest)] p-4 shadow-sm md:flex-row md:items-center">
      {/* Left orange accent bar */}
      <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#EF6C00]" />

      <div className="flex min-w-0 flex-1 items-center gap-6 pl-2">
        <img
          src={item.imagen}
          alt={item.nombre}
          className="size-16 flex-shrink-0 rounded-[var(--radius-lg)] object-cover"
        />
        <div className="min-w-0">
          <h3 className="text-headline-md truncate text-[24px] leading-8 text-[var(--color-on-surface)]">{item.nombre}</h3>
          <p className="text-body-md mt-1 text-[var(--color-secondary)]">{item.categoria}</p>
        </div>
      </div>

      <div className="flex w-full flex-col items-end gap-4 border-t border-[var(--color-outline-variant)] pl-2 pt-4 md:w-auto md:flex-row md:items-center md:border-t-0 md:pt-0">
        <div className="mr-4 hidden items-center gap-2 md:flex">
          <span className="size-2 rounded-full bg-[#EF6C00]" />
          <span className="text-label-sm uppercase tracking-widest text-[var(--color-secondary)]">Stock bajo</span>
        </div>

        {/* Stepper */}
        <div className="flex items-center overflow-hidden rounded-[var(--radius-default)] border border-[var(--color-primary)] bg-[var(--color-surface-container-lowest)]">
          <button
            type="button"
            aria-label="Reducir stock"
            onClick={onDecrement}
            className="flex size-10 items-center justify-center text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-container-high)]"
          >
            <Minus size={16} strokeWidth={2} />
          </button>
          <input
            type="number"
            value={draftStock}
            onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
            className="text-body-lg h-10 w-16 border-x border-[var(--color-outline-variant)] bg-transparent text-center text-[var(--color-on-surface)] focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            type="button"
            aria-label="Aumentar stock"
            onClick={onIncrement}
            className="flex size-10 items-center justify-center text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-container-high)]"
          >
            <Plus size={16} strokeWidth={2} />
          </button>
        </div>

        <button
          type="button"
          onClick={onSave}
          className="text-label-md h-10 rounded-[var(--radius-default)] bg-[var(--color-primary-container)] px-6 py-2 text-[var(--color-on-primary-container)] transition-colors hover:bg-[var(--color-primary)]"
        >
          Guardar
        </button>
      </div>
    </article>
  )
}
