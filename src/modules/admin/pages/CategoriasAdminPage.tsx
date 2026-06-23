import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ChevronLeft, ChevronRight, Edit3, Plus, RefreshCcw, Search, Trash2 } from 'lucide-react'
import { CategoryActionModals } from '../componentes/CategoryActionModals'
import type { Category, CategoryModalState } from '../componentes/CategoryActionModals'

// ---------------------------------------------------------------------------
// Mock data — 15 categorías
// ---------------------------------------------------------------------------

const CATEGORIAS_INICIALES: Category[] = [
  {
    id: 1,
    name: 'Aceites de Oliva',
    description:
      'Selección premium de aceites de oliva virgen extra de extracción en frío, monovarietales y coupages de fincas seleccionadas.',
    products: 142,
  },
  {
    id: 2,
    name: 'Vinos de la Región',
    description:
      'Colección curada de vinos tintos, blancos y espumosos con denominación de origen, priorizando pequeñas bodegas familiares.',
    products: 87,
  },
  {
    id: 3,
    name: 'Embutidos Artesanos',
    description:
      'Chacinas y embutidos de curación natural en secaderos de montaña, elaborados con recetas tradicionales sin aditivos.',
    products: 56,
  },
  {
    id: 4,
    name: 'Mieles y Mermeladas',
    description:
      'Dulces elaborados artesanalmente con frutas de temporada y mieles puras crudas recolectadas en parajes naturales.',
    products: 34,
  },
  {
    id: 5,
    name: 'Quesos de Cabra',
    description:
      'Quesos de pasta blanda, semicurados y añejos elaborados con leche cruda de cabra de pastoreo libre.',
    products: 48,
  },
  {
    id: 6,
    name: 'Conservas Gourmet',
    description:
      'Conservas de pescados, verduras y legumbres preparadas con técnicas tradicionales y aceites de alta calidad.',
    products: 41,
  },
  {
    id: 7,
    name: 'Frutos Secos',
    description:
      'Almendras, nueces y pistachos tostados o crudos, seleccionados por origen y cosecha.',
    products: 63,
  },
  {
    id: 8,
    name: 'Dulces Tradicionales',
    description:
      'Turrones, pasteles, confituras y elaboraciones dulces de obradores locales.',
    products: 52,
  },
  {
    id: 9,
    name: 'Panadería Artesana',
    description:
      'Panes de masa madre, cocas saladas y bollería de fermentación lenta elaborados a pequeña escala.',
    products: 28,
  },
  {
    id: 10,
    name: 'Especias y Sales',
    description:
      'Sales marinas, hierbas aromáticas y mezclas de especias para cocina mediterránea.',
    products: 19,
  },
  {
    id: 11,
    name: 'Bebidas Artesanas',
    description:
      'Licores, kombuchas, cafés y bebidas de producción local con identidad regional.',
    products: 36,
  },
  {
    id: 12,
    name: 'Productos Ecológicos',
    description:
      'Selección transversal de productos certificados o producidos bajo prácticas sostenibles.',
    products: 74,
  },
  {
    id: 13,
    name: 'Arroces y Cereales',
    description:
      'Arroces de proximidad, harinas, granos antiguos y cereales integrales de cultivo local.',
    products: 22,
  },
  {
    id: 14,
    name: 'Salsas y Aderezos',
    description:
      'Salsas preparadas, vinagretas, aliolis y aderezos para acompañar platos tradicionales.',
    products: 31,
  },
  {
    id: 15,
    name: 'Cestas y Regalos',
    description:
      'Composiciones de productos artesanales pensadas para regalos, eventos y experiencias gastronómicas.',
    products: 15,
  },
]

const POR_PAGINA = 8

type OrdenCategoria = 'Alfabético (A-Z)' | 'Más productos' | 'Recientes'

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function CategoriasAdminPage() {
  const [categorias, setCategorias] = useState<Category[]>(CATEGORIAS_INICIALES)
  const [modal, setModal] = useState<CategoryModalState>(null)
  const [query, setQuery] = useState('')
  const [orden, setOrden] = useState<OrdenCategoria>('Alfabético (A-Z)')
  const [pagina, setPagina] = useState(1)

  const closeModal = () => setModal(null)

  const filtradas = categorias
    .filter((category) => {
      const q = query.toLowerCase()
      return (
        !q ||
        category.name.toLowerCase().includes(q) ||
        category.description.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      if (orden === 'Más productos') return b.products - a.products
      if (orden === 'Recientes') return b.id - a.id
      return a.name.localeCompare(b.name)
    })

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA))
  const inicio = (pagina - 1) * POR_PAGINA
  const paginadas = filtradas.slice(inicio, inicio + POR_PAGINA)

  function resetFiltros() {
    setQuery('')
    setOrden('Alfabético (A-Z)')
    setPagina(1)
  }

  function handleSave(id: number | null, name: string, description: string) {
    if (id === null) {
      const newId = Math.max(0, ...categorias.map((c) => c.id)) + 1
      setCategorias((prev) => [{ id: newId, name, description, products: 0 }, ...prev])
      setOrden('Recientes')
      setPagina(1)
      return
    }

    setCategorias((prev) =>
      prev.map((category) =>
        category.id === id ? { ...category, name, description } : category,
      ),
    )
  }

  function handleDelete(id: number) {
    setCategorias((prev) => prev.filter((category) => category.id !== id))
    setPagina(1)
  }

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
            onClick={() => setModal({ type: 'create' })}
            className="text-label-md flex items-center justify-center gap-2 self-start whitespace-nowrap rounded-[var(--radius-sm)] bg-[var(--color-primary-container)] px-6 py-3 text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary)] md:self-auto"
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
              onChange={(event) => { setQuery(event.target.value); setPagina(1) }}
              placeholder="Buscar categoría..."
              className="text-body-md w-full border-0 border-b border-[color-mix(in_srgb,var(--color-outline)_45%,transparent)] bg-transparent py-2 pr-3 pl-8 text-[var(--color-on-surface)] transition-colors placeholder:text-[var(--color-secondary)] focus:border-[var(--color-on-surface)] focus:outline-none"
            />
          </label>

          <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row md:items-center">
            <label className="text-label-md flex items-center gap-2 text-[var(--color-secondary)]">
              Orden:
              <select
                value={orden}
                onChange={(event) => { setOrden(event.target.value as OrdenCategoria); setPagina(1) }}
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

        <section className="flex flex-col gap-4" aria-label="Listado de categorías">
          {paginadas.length === 0 ? (
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-10 text-center text-[var(--color-secondary)]">
              No se encontraron categorías con los filtros aplicados.
            </div>
          ) : (
            paginadas.map((category, index) => (
              <CategoryRow
                key={category.id}
                category={category}
                highlighted={index === 0}
                onEdit={() => setModal({ type: 'edit', category })}
                onDelete={() => setModal({ type: 'delete', category })}
              />
            ))
          )}
        </section>

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
              disabled={pagina === 1}
              onClick={() => setPagina((p) => p - 1)}
            />
            {Array.from({ length: totalPaginas }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                aria-current={page === pagina ? 'page' : undefined}
                onClick={() => setPagina(page)}
                className={`text-label-md grid size-10 place-items-center rounded-[var(--radius-sm)] transition-colors ${
                  page === pagina
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
              disabled={pagina === totalPaginas}
              onClick={() => setPagina((p) => p + 1)}
            />
          </div>
        </footer>
      </div>

      <CategoryActionModals
        modal={modal}
        onClose={closeModal}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </>
  )
}

// ---------------------------------------------------------------------------
// CategoryRow
// ---------------------------------------------------------------------------

type CategoryRowProps = {
  category: Category
  highlighted?: boolean
  onEdit: () => void
  onDelete: () => void
}

function CategoryRow({ category, highlighted = false, onEdit, onDelete }: CategoryRowProps) {
  return (
    <article>
      <div
        className={`group flex flex-col justify-between gap-4 rounded-[var(--radius-lg)] border p-6 transition-all md:flex-row md:items-center ${
          highlighted
            ? 'border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] bg-[var(--color-surface-container-low)]'
            : 'border-transparent bg-[var(--color-surface)] hover:border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] hover:bg-[var(--color-surface-container-low)]'
        }`}
      >
        <div className="flex-1">
          <h3 className="text-headline-md mb-1 text-[var(--color-on-surface)]">{category.name}</h3>
          <p className="text-body-md max-w-3xl text-[var(--color-secondary)]">{category.description}</p>
        </div>
        <div className="flex shrink-0 items-center justify-between gap-8 md:w-1/3 md:justify-end">
          <span className="text-label-md rounded-full bg-[color-mix(in_srgb,var(--color-secondary-fixed)_45%,transparent)] px-3 py-1 text-[var(--color-secondary)]">
            {category.products} productos
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={`Editar ${category.name}`}
              onClick={onEdit}
              className="rounded-full p-2 text-[var(--color-secondary)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-secondary-fixed)_20%,transparent)] hover:text-[var(--color-primary-container)]"
            >
              <Edit3 size={20} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              aria-label={`Eliminar ${category.name}`}
              onClick={onDelete}
              className="rounded-full p-2 text-[var(--color-secondary)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-error-container)_60%,transparent)] hover:text-[var(--color-error)]"
            >
              <Trash2 size={20} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>
      <hr className="border-[color-mix(in_srgb,var(--color-on-surface)_10%,transparent)]" />
    </article>
  )
}

// ---------------------------------------------------------------------------
// PaginationButton
// ---------------------------------------------------------------------------

type PaginationButtonProps = {
  label: string
  icon?: LucideIcon
  disabled?: boolean
  onClick?: () => void
}

function PaginationButton({ label, icon: Icon, disabled = false, onClick }: PaginationButtonProps) {
  return (
    <button
      type="button"
      aria-label={label.length > 1 ? label : `Página ${label}`}
      disabled={disabled}
      onClick={onClick}
      className="text-label-md grid size-10 place-items-center rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-outline-variant)_55%,transparent)] text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-container-low)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {Icon ? <Icon size={20} strokeWidth={1.8} /> : label}
    </button>
  )
}
