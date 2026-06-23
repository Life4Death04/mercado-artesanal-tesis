import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart2, BookOpen, ChevronDown, ChevronLeft, ChevronRight, Eye, EyeOff, HelpCircle, Package, Pencil, Plus, Search, ShoppingBag, Trash2, TriangleAlert, Truck, User } from 'lucide-react'
import { AgregarProductoModal, AvisoStockModal, EliminarProductoModal } from '../componentes/CatalogoProductorModals'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ProductoStatus = 'Publicado' | 'Despublicado' | 'Sin disponibilidad'

export type ProductoCatalogo = {
  id: string
  nombre: string
  categoria: string
  denominacion?: string
  precio: string
  stock: number
  status: ProductoStatus
  imagen: string
  lowStock?: boolean
  agotado?: boolean
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const productos: ProductoCatalogo[] = [
  {
    id: 'prod-1',
    nombre: 'Aceite de Oliva Virgen Extra Coupage',
    categoria: 'Aceites',
    denominacion: 'D.O. Alicante',
    precio: '18,50€',
    stock: 15,
    status: 'Publicado',
    imagen:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDmn-HTPgkmzjU1O02KsCIOcA21nIIlWPRCx2yI2dnd31yatEf8Dqbbj_pdqDy9DlzqllOxTPgvfPOYmc5wi6u-8z6tH9bGbHbFP_mGo1ewuC99f5oI91WEmESl-UBfs00gHE6N_c6J-R4TYRY_evXPcFb4qBoLe-mjamQiVbi9gNu2SD1_MnP6xZxtcEWVybmp2mJ6Ily0t2e0P3Kt2abWSS1IgutzgkpJHMMktLVtXYWAnjM_sdM38c6xXuWR3vfl4fUVFMkAtC4',
  },
  {
    id: 'prod-2',
    nombre: 'Turrón de Jijona Artesanal 300g',
    categoria: 'Dulces',
    denominacion: 'I.G.P. Jijona',
    precio: '12,90€',
    stock: 3,
    status: 'Publicado',
    lowStock: true,
    imagen:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAwpcRUxi2UfppBSrCMAcTt51NRZZlO15MAeuTzzQXfz9A7N1RdQimEZVJYMwdV8AbGK0UGKqUDWrlv_qqZ2zB7GmIyZZR09nsOYyyfpp59JLdcg3kiid6xsixF6F0j67VmKJ3CP2ErDYn8bE0kHfm8s1_r7MBdDyYtVioKOMTml2BgJS7g-6GKob2dYMxUePh6M4tkiO4uP1cJ0iqbb3fFDhOjd8ryRfzy70FFlcLzrZ5Rkj-WQY5c0FwXkxlScPiCkZ9OlOqWjZQ',
  },
  {
    id: 'prod-3',
    nombre: "Vino Tinto Monastrell 'Herencia'",
    categoria: 'Vinos',
    denominacion: 'D.O. Alicante',
    precio: '24,00€',
    stock: 0,
    status: 'Despublicado',
    agotado: true,
    imagen:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAL7mQ1mh2Id6cvQAygTJ0NC34fJRJiUwV_jt5FnvB-ukAzx5YcjlCh9uMkvk5QCjMOwBn7FbNBVJxEfVEL23nS5T82p58T3Q3R5uCqHYv65EraLsuyupp23ImjKTHs1qI8t5PikDUHLr-a7vNRQb8PVBIdRrw05kkeOgRpNGbWeKpFsS9jj-YGuMoxLwR5kJj9ZyAwqOpVsi9rSz2fOah-hYkJDyIrppQBLfIfh2_7lYz-yJ0vAR5uyw6p50JiT9T22LgNxJCCk-k',
  },
  {
    id: 'prod-4',
    nombre: 'Sobrasada de la Montaña (Tradicional)',
    categoria: 'Embutidos',
    precio: '9,20€',
    stock: 42,
    status: 'Sin disponibilidad',
    imagen:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAEY3Fecj6qqT00nrb2x88DkYDCeu4A2G--2C0cKzQljqXJJYvzO9iqF8dLpRv-YXw5bGLwkLC50hP__V_vVmJS_14UHt23dBGz0CRV5AwD-fUz7YKVDAZzLyLX5nPaY_gnEyB7YuZ9Uv3s6aNoyn_T2RT3te2TqEWuU4RsEMZkl4swCG4WEGWWij9e9zhcUg5AH-F68a-wL9chzcqp6olO1HJ2YQ2MEextBE3ZHlk9c7WV-FetmqUm2nuWbYcdDjv-s6BTuaeiF-I',
  },
]

const FILTROS_ESTADO = ['Todos', 'Publicados', 'Despublicados'] as const
const CATEGORIAS_FILTER = ['Todas las categorías', 'Aceites', 'Embutidos', 'Vinos', 'Dulces']
const NAV_ITEMS = [
  { icon: ShoppingBag, label: 'Mis pedidos', to: '/productor/pedidos', active: false },
  { icon: BookOpen, label: 'Mi catálogo', to: '/productor/productos', active: true },
  { icon: Package, label: 'Inventario', to: '/productor/inventario', active: false },
  { icon: BarChart2, label: 'Estadísticas', to: '/productor/estadisticas', active: false },
  { icon: Truck, label: 'Configuración de entregas', to: '/productor/entregas', active: false },
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function ProductosProductorPage() {
  const [filtroEstado, setFiltroEstado] = useState<(typeof FILTROS_ESTADO)[number]>('Todos')
  const [showAgregarModal, setShowAgregarModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ProductoCatalogo | null>(null)
  const [showStockWarning, setShowStockWarning] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#FAF7F0] text-[var(--color-on-surface)]">
      {/* ── Sidebar ── */}
      <aside className="hidden">
        <div className="mb-10">
          <Link to="/" className="text-headline-md italic text-[var(--color-primary)]">Alicante Gourmet</Link>
          <p className="text-body-md mt-1 italic text-[var(--color-secondary)]">Artesano de Denia</p>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {NAV_ITEMS.map(({ icon: Icon, label, to, active }) => (
            <Link
              key={label}
              to={to}
              className={`flex items-center gap-3 rounded-[var(--radius-lg)] px-4 py-3 transition-all duration-200 ${active ? 'translate-x-0.5 bg-[var(--color-secondary-container)] font-semibold text-[var(--color-primary)]' : 'text-[var(--color-secondary)] hover:bg-[var(--color-surface-container-high)]'}`}
            >
              <Icon size={20} strokeWidth={1.8} />
              <span className="text-label-md">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-[var(--color-outline-variant)] pt-6">
          <Link to="/productor/perfil" className="flex items-center gap-3 rounded-[var(--radius-lg)] px-4 py-3 text-[var(--color-secondary)] transition-all hover:bg-[var(--color-surface-container-high)]">
            <User size={20} strokeWidth={1.8} />
            <span className="text-label-md">Mi perfil</span>
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="ml-64 min-h-screen flex-1 px-[var(--space-margin-desktop)] py-12">
        {/* Header */}
        <header className="mb-16 flex items-end justify-between">
          <div>
            <nav className="mb-4">
              <span className="text-label-sm uppercase tracking-widest text-[var(--color-secondary)]">Panel de Productor</span>
            </nav>
            <div className="flex items-baseline gap-4">
              <h1 className="text-headline-md text-[var(--color-on-surface)]">Mi catálogo</h1>
              <span className="text-body-md rounded-full bg-[var(--color-secondary-container)] px-3 py-0.5 text-[var(--color-on-secondary-fixed-variant)]">
                24 productos
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAgregarModal(true)}
            className="text-label-md flex items-center gap-2 rounded-[var(--radius-lg)] bg-[var(--color-primary-container)] px-8 py-3 text-white shadow-md transition-all hover:brightness-110 active:scale-95"
          >
            <Plus size={18} strokeWidth={2} />
            Añadir producto
          </button>
        </header>

        {/* Search & Filters */}
        <section className="mb-10 flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex w-full items-center gap-4 md:w-auto">
            {/* Search */}
            <div className="group relative w-full md:w-80">
              <Search size={18} strokeWidth={1.8} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)] transition-colors group-focus-within:text-[var(--color-primary)]" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                className="text-body-md w-full border-0 border-b border-[var(--color-outline)] bg-[var(--color-surface)] py-2.5 pl-10 pr-4 transition-all focus:border-[var(--color-primary-container)] focus:ring-0 focus:outline-none"
              />
            </div>

            {/* Category filter */}
            <div className="relative min-w-[160px]">
              <select className="text-label-md w-full cursor-pointer appearance-none rounded-[var(--radius-lg)] border-0 bg-[var(--color-surface-container-low)] py-2.5 pl-4 pr-10 text-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-primary-container)] focus:outline-none">
                {CATEGORIAS_FILTER.map((c) => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown size={16} strokeWidth={1.8} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]" />
            </div>
          </div>

          {/* Status pills */}
          <div className="flex rounded-full bg-[var(--color-surface-container-high)] p-1">
            {FILTROS_ESTADO.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFiltroEstado(f)}
                className={`text-label-md rounded-full px-6 py-1.5 transition-all ${filtroEstado === f ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm' : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </section>

        {/* Product list */}
        <div className="overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-surface)] shadow-[0_4px_20px_rgba(26,26,26,0.04)]">
          <div className="flex flex-col gap-4 p-6">
            {productos.map((prod) => (
              <ProductCard
                key={prod.id}
                producto={prod}
                onDelete={() => setDeleteTarget(prod)}
                onStockWarning={() => setShowStockWarning(true)}
              />
            ))}
          </div>

          {/* Pagination footer */}
          <footer className="flex items-center justify-between border-t border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] px-8 py-6">
            <span className="text-label-sm text-[var(--color-secondary)]">Mostrando {productos.length} de 24 productos</span>
            <div className="flex items-center gap-2">
              <button type="button" disabled className="flex size-10 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)] text-[var(--color-secondary)] opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft size={18} strokeWidth={1.8} />
              </button>
              {[1, 2, 3].map((page) => (
                <button key={page} type="button" className={`text-label-md flex size-10 items-center justify-center rounded-[var(--radius-lg)] ${page === 1 ? 'bg-[var(--color-primary-container)] text-white shadow-sm' : 'border border-[var(--color-outline-variant)] text-[var(--color-secondary)] hover:bg-[var(--color-surface)]'}`}>
                  {page}
                </button>
              ))}
              <button type="button" className="flex size-10 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)] text-[var(--color-secondary)] hover:bg-[var(--color-surface)]">
                <ChevronRight size={18} strokeWidth={1.8} />
              </button>
            </div>
          </footer>
        </div>
      </main>

      {/* FAB help */}
      <button type="button" className="group fixed right-8 bottom-8 flex size-12 items-center justify-center rounded-full bg-[var(--color-secondary-container)] text-[var(--color-secondary)] shadow-lg transition-transform hover:scale-110">
        <HelpCircle size={22} strokeWidth={1.8} />
        <span className="absolute right-14 whitespace-nowrap rounded bg-[var(--color-on-surface)] px-3 py-1 text-[10px] text-[var(--color-surface)] opacity-0 transition-opacity group-hover:opacity-100">
          ¿Necesitas ayuda con tu catálogo?
        </span>
      </button>

      {/* Modals */}
      {showAgregarModal ? <AgregarProductoModal onClose={() => setShowAgregarModal(false)} /> : null}

      {deleteTarget ? (
        <EliminarProductoModal
          producto={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => setDeleteTarget(null)}
        />
      ) : null}

      {showStockWarning ? (
        <AvisoStockModal
          onClose={() => setShowStockWarning(false)}
          onPublish={() => setShowStockWarning(false)}
        />
      ) : null}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Product card
// ---------------------------------------------------------------------------

type ProductCardProps = {
  producto: ProductoCatalogo
  onDelete: () => void
  onStockWarning: () => void
}

function ProductCard({ producto, onDelete, onStockWarning }: ProductCardProps) {
  const isUnpublished = producto.status === 'Despublicado'

  return (
    <article className={`relative flex gap-6 rounded-[var(--radius-xl)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] p-6 transition-colors hover:bg-[var(--color-surface-container)] ${isUnpublished ? 'border-dashed opacity-60' : ''}`}>
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className={`size-24 rounded-[var(--radius-lg)] object-cover [border:0.5px_solid_#8A8275] ${isUnpublished ? 'grayscale-[0.5]' : ''}`}
      />

      <div className="flex-grow">
        <h4 className="text-headline-md mb-1 text-lg leading-7 text-[var(--color-on-surface)]">{producto.nombre}</h4>
        <p className="text-label-sm mb-3 uppercase tracking-wider text-[var(--color-secondary)]">
          {producto.categoria}{producto.denominacion ? ` · ${producto.denominacion}` : ''}
        </p>
        <div className="text-headline-md flex items-center gap-2 text-base">
          <span>{producto.precio}</span>
          <span className="text-[var(--color-secondary)]">·</span>
          {producto.agotado ? (
            <span className="flex items-center gap-1 font-semibold text-[var(--color-error)]">
              <TriangleAlert size={16} strokeWidth={1.8} /> Agotado
            </span>
          ) : producto.lowStock ? (
            <span className="flex items-center gap-1 font-semibold text-amber-700">
              <TriangleAlert size={16} strokeWidth={1.8} /> {producto.stock} uds
            </span>
          ) : (
            <span className="text-[var(--color-secondary)]">{producto.stock} uds</span>
          )}
        </div>
      </div>

      {/* Status badge — top right */}
      <div className="absolute top-6 right-6">
        <StatusBadge status={producto.status} />
      </div>

      {/* Actions — bottom right */}
      <div className="absolute right-6 bottom-6 flex gap-2">
        <ActionBtn aria-label="Editar producto">
          <Pencil size={18} strokeWidth={1.8} />
        </ActionBtn>

        {isUnpublished ? (
          <ActionBtn aria-label="Publicar producto" onClick={onStockWarning} className="text-[var(--color-primary)]">
            <EyeOff size={18} strokeWidth={1.8} />
          </ActionBtn>
        ) : (
          <ActionBtn aria-label="Ver producto">
            <Eye size={18} strokeWidth={1.8} />
          </ActionBtn>
        )}

        <ActionBtn aria-label="Eliminar producto" onClick={onDelete} danger>
          <Trash2 size={18} strokeWidth={1.8} />
        </ActionBtn>
      </div>
    </article>
  )
}

type ActionBtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  danger?: boolean
}

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

function StatusBadge({ status }: { status: ProductoStatus }) {
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
