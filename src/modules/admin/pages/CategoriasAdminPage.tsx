import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ChevronLeft, ChevronRight, Edit3, Plus, Search, Trash2 } from 'lucide-react'
import { CategoryActionModals } from '../componentes/CategoryActionModals'
import type { CategoryModalState } from '../componentes/CategoryActionModals'

type Category = {
  id: number
  name: string
  description: string
  products: number
}

const categories: Category[] = [
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
    description: 'Quesos de pasta blanda, semicurados y añejos elaborados con leche cruda de cabra de pastoreo libre.',
    products: 48,
  },
]

export function CategoriasAdminPage() {
  const [modal, setModal] = useState<CategoryModalState>(null)

  const closeModal = () => setModal(null)

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
              placeholder="Buscar categoría..."
              className="text-body-md w-full border-0 border-b border-[color-mix(in_srgb,var(--color-outline)_45%,transparent)] bg-transparent py-2 pr-3 pl-8 text-[var(--color-on-surface)] transition-colors placeholder:text-[var(--color-secondary)] focus:border-[var(--color-on-surface)] focus:outline-none"
            />
          </label>

          <label className="text-label-md flex items-center gap-2 text-[var(--color-secondary)]">
            Orden:
            <select
              defaultValue="Alfabético (A-Z)"
              className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-[var(--color-on-surface)] focus:outline-none"
            >
              <option>Alfabético (A-Z)</option>
              <option>Más productos</option>
              <option>Recientes</option>
            </select>
          </label>
        </section>

        <section className="flex flex-col gap-4" aria-label="Listado de categorías">
          {categories.map((category, index) => (
            <CategoryRow
              key={category.id}
              category={category}
              highlighted={index === 0}
              onEdit={() => setModal({ type: 'edit', category })}
              onDelete={() => setModal({ type: 'delete', category })}
            />
          ))}
        </section>

        <footer className="mt-12 flex flex-col gap-6 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] pt-6 md:flex-row md:items-center md:justify-between">
          <span className="text-label-md text-[var(--color-secondary)]">Mostrando 1-5 de 24 categorías</span>
          <div className="flex gap-2">
            <PaginationButton icon={ChevronLeft} label="Página anterior" disabled />
            <button
              type="button"
              aria-current="page"
              className="text-label-md grid size-10 place-items-center rounded-[var(--radius-sm)] bg-[var(--color-on-surface)] text-[var(--color-surface)]"
            >
              1
            </button>
            <PaginationButton label="2" />
            <PaginationButton label="3" />
            <span className="grid size-10 place-items-center text-[var(--color-secondary)]">...</span>
            <PaginationButton icon={ChevronRight} label="Página siguiente" />
          </div>
        </footer>
      </div>

      <CategoryActionModals modal={modal} onClose={closeModal} />
    </>
  )
}

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
          <div className="flex items-center gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
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

type PaginationButtonProps = {
  label: string
  icon?: LucideIcon
  disabled?: boolean
}

function PaginationButton({ label, icon: Icon, disabled = false }: PaginationButtonProps) {
  return (
    <button
      type="button"
      aria-label={label.length > 1 ? label : `Página ${label}`}
      disabled={disabled}
      className="text-label-md grid size-10 place-items-center rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-outline-variant)_55%,transparent)] text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-container-low)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {Icon ? <Icon size={20} strokeWidth={1.8} /> : label}
    </button>
  )
}
