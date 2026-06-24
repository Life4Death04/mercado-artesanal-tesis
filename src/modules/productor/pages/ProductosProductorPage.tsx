import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronLeft, ChevronRight, Eye, EyeOff, Filter, Pencil, Plus, Search, SlidersHorizontal, Trash2, TriangleAlert } from 'lucide-react'
import {
  AgregarProductoModal,
  AvisoStockModal,
  EditarProductoModal,
  EliminarProductoModal,
  PublicacionProductoModal,
} from '../componentes/CatalogoProductorModals'

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
}

const productosIniciales: ProductoCatalogo[] = [
  {
    id: 'prod-1',
    nombre: 'Aceite de Oliva Virgen Extra Coupage',
    categoria: 'Aceites',
    denominacion: 'D.O. Alicante',
    precio: '18,50EUR',
    stock: 15,
    status: 'Publicado',
    imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmn-HTPgkmzjU1O02KsCIOcA21nIIlWPRCx2yI2dnd31yatEf8Dqbbj_pdqDy9DlzqllOxTPgvfPOYmc5wi6u-8z6tH9bGbHbFP_mGo1ewuC99f5oI91WEmESl-UBfs00gHE6N_c6J-R4TYRY_evXPcFb4qBoLe-mjamQiVbi9gNu2SD1_MnP6xZxtcEWVybmp2mJ6Ily0t2e0P3Kt2abWSS1IgutzgkpJHMMktLVtXYWAnjM_sdM38c6xXuWR3vfl4fUVFMkAtC4',
  },
  {
    id: 'prod-2',
    nombre: 'Turron de Jijona Artesanal 300g',
    categoria: 'Dulces',
    denominacion: 'I.G.P. Jijona',
    precio: '12,90EUR',
    stock: 3,
    status: 'Publicado',
    imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwpcRUxi2UfppBSrCMAcTt51NRZZlO15MAeuTzzQXfz9A7N1RdQimEZVJYMwdV8AbGK0UGKqUDWrlv_qqZ2zB7GmIyZZR09nsOYyyfpp59JLdcg3kiid6xsixF6F0j67VmKJ3CP2ErDYn8bE0kHfm8s1_r7MBdDyYtVioKOMTml2BgJS7g-6GKob2dYMxUePh6M4tkiO4uP1cJ0iqbb3fFDhOjd8ryRfzy70FFlcLzrZ5Rkj-WQY5c0FwXkxlScPiCkZ9OlOqWjZQ',
  },
  {
    id: 'prod-3',
    nombre: "Vino Tinto Monastrell 'Herencia'",
    categoria: 'Vinos',
    denominacion: 'D.O. Alicante',
    precio: '24,00EUR',
    stock: 0,
    status: 'Despublicado',
    imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAL7mQ1mh2Id6cvQAygTJ0NC34fJRJiUwV_jt5FnvB-ukAzx5YcjlCh9uMkvk5QCjMOwBn7FbNBVJxEfVEL23nS5T82p58T3Q3R5uCqHYv65EraLsuyupp23ImjKTHs1qI8t5PikDUHLr-a7vNRQb8PVBIdRrw05kkeOgRpNGbWeKpFsS9jj-YGuMoxLwR5kJj9ZyAwqOpVsi9rSz2fOah-hYkJDyIrppQBLfIfh2_7lYz-yJ0vAR5uyw6p50JiT9T22LgNxJCCk-k',
  },
  {
    id: 'prod-4',
    nombre: 'Sobrasada de la Montana (Tradicional)',
    categoria: 'Embutidos',
    precio: '9,20EUR',
    stock: 42,
    status: 'Sin disponibilidad',
    imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEY3Fecj6qqT00nrb2x88DkYDCeu4A2G--2C0cKzQljqXJJYvzO9iqF8dLpRv-YXw5bGLwkLC50hP__V_vVmJS_14UHt23dBGz0CRV5AwD-fUz7YKVDAZzLyLX5nPaY_gnEyB7YuZ9Uv3s6aNoyn_T2RT3te2TqEWuU4RsEMZkl4swCG4WEGWWij9e9zhcUg5AH-F68a-wL9chzcqp6olO1HJ2YQ2MEextBE3ZHlk9c7WV-FetmqUm2nuWbYcdDjv-s6BTuaeiF-I',
  },
  {
    id: 'prod-5',
    nombre: 'Miel cruda de azahar',
    categoria: 'Dulces',
    precio: '10,40EUR',
    stock: 11,
    status: 'Publicado',
    imagen: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-6',
    nombre: 'Conserva de bonito artesana',
    categoria: 'Conservas',
    precio: '8,90EUR',
    stock: 0,
    status: 'Sin disponibilidad',
    imagen: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
  },
]

const statusFilters = ['Todos', 'Publicado', 'Despublicado', 'Sin disponibilidad'] as const
const categoryFilters = ['Todas las categorías', 'Aceites', 'Dulces', 'Vinos', 'Embutidos', 'Conservas'] as const
const pageSize = 4

export function ProductosProductorPage() {
  const [productos, setProductos] = useState(productosIniciales)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<(typeof categoryFilters)[number]>('Todas las categorías')
  const [selectedStatus, setSelectedStatus] = useState<(typeof statusFilters)[number]>('Todos')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showAgregarModal, setShowAgregarModal] = useState(false)
  const [editingTargetId, setEditingTargetId] = useState<string | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [publicationTargetId, setPublicationTargetId] = useState<string | null>(null)
  const [showStockWarningForId, setShowStockWarningForId] = useState<string | null>(null)

  const normalizedSearch = search.trim().toLowerCase()
  const filteredProducts = productos.filter((producto) => {
    const matchesSearch = !normalizedSearch || [producto.nombre, producto.categoria, producto.denominacion ?? '', producto.precio].join(' ').toLowerCase().includes(normalizedSearch)
    const matchesCategory = selectedCategory === 'Todas las categorías' || producto.categoria === selectedCategory
    const matchesStatus = selectedStatus === 'Todos' || producto.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const visibleProducts = filteredProducts.slice((safePage - 1) * pageSize, safePage * pageSize)
  const editingTarget = editingTargetId ? productos.find((producto) => producto.id === editingTargetId) ?? null : null
  const deleteTarget = deleteTargetId ? productos.find((producto) => producto.id === deleteTargetId) ?? null : null
  const publicationTarget = publicationTargetId ? productos.find((producto) => producto.id === publicationTargetId) ?? null : null
  const stockWarningTarget = showStockWarningForId ? productos.find((producto) => producto.id === showStockWarningForId) ?? null : null

  function updateSearch(value: string) {
    setSearch(value)
    setCurrentPage(1)
  }

  function updateCategory(value: (typeof categoryFilters)[number]) {
    setSelectedCategory(value)
    setCurrentPage(1)
  }

  function updateStatus(value: (typeof statusFilters)[number]) {
    setSelectedStatus(value)
    setCurrentPage(1)
  }

  function saveProductEdition(updatedProduct: ProductoCatalogo) {
    setProductos((current) => current.map((producto) => (producto.id === updatedProduct.id ? updatedProduct : producto)))
    setEditingTargetId(null)
  }

  function removeProduct(productId: string) {
    setProductos((current) => current.filter((producto) => producto.id !== productId))
    setDeleteTargetId(null)
  }

  function togglePublication(producto: ProductoCatalogo) {
    if (producto.status === 'Despublicado' && producto.stock === 0) {
      setPublicationTargetId(null)
      setShowStockWarningForId(producto.id)
      return
    }

    setProductos((current) => current.map((item) => {
      if (item.id !== producto.id) return item
      if (item.status === 'Despublicado') {
        return { ...item, status: item.stock > 0 ? 'Publicado' : 'Sin disponibilidad' }
      }
      return { ...item, status: 'Despublicado' }
    }))
    setPublicationTargetId(null)
  }

  function publishWithoutStock(productId: string) {
    setProductos((current) => current.map((item) => (item.id === productId ? { ...item, status: 'Sin disponibilidad' } : item)))
    setShowStockWarningForId(null)
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

        <section className="mb-8 border border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-surface-container-lowest)] p-4 shadow-[0_18px_50px_-35px_rgba(122,46,58,0.35)] md:p-6" aria-label="Filtros del catálogo de productor">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <Search size={18} strokeWidth={1.8} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)]" />
              <input
                type="search"
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Buscar por nombre, categoría o denominación..."
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
                  onChange={(event) => updateCategory(event.target.value as (typeof categoryFilters)[number])}
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
                {statusFilters.map((status) => {
                  const count = status === 'Todos'
                    ? productos.filter((producto) => selectedCategory === 'Todas las categorías' || producto.categoria === selectedCategory).filter((producto) => !normalizedSearch || [producto.nombre, producto.categoria, producto.denominacion ?? '', producto.precio].join(' ').toLowerCase().includes(normalizedSearch)).length
                    : productos.filter((producto) => producto.status === status).filter((producto) => selectedCategory === 'Todas las categorías' || producto.categoria === selectedCategory).filter((producto) => !normalizedSearch || [producto.nombre, producto.categoria, producto.denominacion ?? '', producto.precio].join(' ').toLowerCase().includes(normalizedSearch)).length

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

      {showAgregarModal ? <AgregarProductoModal onClose={() => setShowAgregarModal(false)} /> : null}

      {editingTarget ? (
        <EditarProductoModal
          producto={editingTarget}
          onClose={() => setEditingTargetId(null)}
          onSave={saveProductEdition}
        />
      ) : null}

      {deleteTarget ? (
        <EliminarProductoModal
          producto={deleteTarget}
          onClose={() => setDeleteTargetId(null)}
          onConfirm={() => removeProduct(deleteTarget.id)}
        />
      ) : null}

      {publicationTarget ? (
        <PublicacionProductoModal
          producto={publicationTarget}
          onClose={() => setPublicationTargetId(null)}
          onConfirm={() => togglePublication(publicationTarget)}
        />
      ) : null}

      {stockWarningTarget ? (
        <AvisoStockModal
          onClose={() => setShowStockWarningForId(null)}
          onPublish={() => publishWithoutStock(stockWarningTarget.id)}
        />
      ) : null}
    </div>
  )
}

type ProductCardProps = {
  producto: ProductoCatalogo
  onEdit: () => void
  onTogglePublication: () => void
  onDelete: () => void
}

function ProductCard({ producto, onEdit, onTogglePublication, onDelete }: ProductCardProps) {
  const isInactive = producto.status === 'Despublicado'
  const isOutOfStock = producto.stock === 0 || producto.status === 'Sin disponibilidad'
  const publicationLabel = isInactive ? 'Publicar producto' : 'Despublicar producto'

  return (
    <article className={`rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] bg-[var(--color-surface-container-lowest)] p-5 shadow-[0_10px_30px_-20px_rgba(122,46,58,0.25)] transition-all md:p-6 ${isInactive ? 'border-dashed' : ''}`}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-4 md:gap-5">
          <img src={producto.imagen} alt={producto.nombre} className={`size-24 shrink-0 rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)] object-cover md:size-28 ${isInactive ? 'grayscale-[0.55]' : ''}`} />

          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-start gap-3">
              <h2 className="text-headline-md text-[var(--color-on-surface)]">{producto.nombre}</h2>
              <StatusBadge status={producto.status} />
            </div>

            <p className="text-label-sm mb-3 uppercase tracking-[0.18em] text-[var(--color-secondary)]">
              {producto.categoria}{producto.denominacion ? ` · ${producto.denominacion}` : ''}
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-body-md text-[var(--color-on-surface)]">
              <span className="font-semibold text-[var(--color-primary)]">{producto.precio}</span>
              <span className="text-[var(--color-secondary)]">·</span>
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1 text-[var(--color-error)]">
                  <TriangleAlert size={16} strokeWidth={1.8} />
                  Sin stock
                </span>
              ) : producto.stock <= 5 ? (
                <span className="inline-flex items-center gap-1 text-amber-700">
                  <TriangleAlert size={16} strokeWidth={1.8} />
                  {producto.stock} uds
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

function StatusBadge({ status }: { status: ProductoStatus }) {
  switch (status) {
    case 'Publicado':
      return <span className="text-label-md inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs text-emerald-700"><span className="mr-2 size-1.5 rounded-full bg-emerald-500" />Publicado</span>
    case 'Despublicado':
      return <span className="text-label-md inline-flex items-center rounded-full border border-dashed border-[var(--color-outline)] bg-[var(--color-surface-container-highest)] px-3 py-1 text-xs text-[var(--color-secondary)]">Despublicado</span>
    case 'Sin disponibilidad':
      return <span className="text-label-md inline-flex items-center rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs text-[var(--color-error)]">Sin disponibilidad</span>
  }
}
