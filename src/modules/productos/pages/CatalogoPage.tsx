import { useState } from 'react'
import {
  Boxes,
  ChevronRight,
  MapPin,
  PackageCheck,
  Search,
  SlidersHorizontal,
  WalletCards,
} from 'lucide-react'
import { resolveErrorMessage } from '../../../lib/errorMessages'
import { formatMoney } from '../../../lib/formatMoney'
import { ConsumerProductCard } from '../componentes/ConsumerProductCard'
import { useCategoriesQuery } from '../hooks/useCategoriesQuery'
import { useProductos } from '../hooks/useProductos'

type FilterOption = {
  label: string
  value: string
}

type SortOption = 'newest' | 'asc' | 'desc'

export function CatalogoPage() {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedMunicipalities, setSelectedMunicipalities] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [stockOnly, setStockOnly] = useState(false)
  const [sort, setSort] = useState<SortOption>('newest')
  const productsQuery = useProductos({ sort: sort === 'newest' ? undefined : sort })
  const categoriesQuery = useCategoriesQuery()
  const products = productsQuery.data ?? []

  const categories = (categoriesQuery.data ?? [])
    .map((category) => ({ label: category.name, value: category.id }))
    .sort((first, second) => first.label.localeCompare(second.label, 'es'))
  const municipalities = Array.from(new Set(products.map((product) => product.producer.address.city)))
    .sort((first, second) => first.localeCompare(second, 'es'))
    .map((municipality) => ({ label: municipality, value: municipality }))
  const catalogMaxPrice = Math.max(1, Math.ceil(products.reduce((highest, product) => Math.max(highest, Number(product.price)), 0)))

  const normalizedSearch = searchQuery.trim().toLocaleLowerCase('es')
  const filteredProducts = products.filter((product) => {
    const matchesSearch = !normalizedSearch || [product.name, product.category.name, product.producer.businessName, product.producer.address.city]
      .join(' ')
      .toLocaleLowerCase('es')
      .includes(normalizedSearch)
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category.id)
    const matchesMunicipality = selectedMunicipalities.length === 0 || selectedMunicipalities.includes(product.producer.address.city)
    const matchesPrice = maxPrice === null || Number(product.price) <= maxPrice
    const matchesStock = !stockOnly || product.stock > 0

    return matchesSearch && matchesCategory && matchesMunicipality && matchesPrice && matchesStock
  })

  function toggleFilter(value: string, selectedValues: string[], updateSelectedValues: (values: string[]) => void) {
    updateSelectedValues(
      selectedValues.includes(value)
        ? selectedValues.filter((selectedValue) => selectedValue !== value)
        : [...selectedValues, value],
    )
  }

  function resetFilters() {
    setSearchQuery('')
    setSelectedCategories([])
    setSelectedMunicipalities([])
    setMaxPrice(null)
    setStockOnly(false)
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)] selection:bg-[var(--color-primary-fixed)] selection:text-[var(--color-on-primary-fixed)]">
      <div className="mx-auto flex w-full max-w-[var(--layout-container-max)] flex-col gap-8 px-[var(--space-margin-mobile)] py-10 md:px-[var(--space-margin-desktop)] min-[1300px]:flex-row min-[1300px]:gap-16">
        <CatalogFilters
          categories={categories}
          categoriesError={categoriesQuery.isError}
          categoriesLoading={categoriesQuery.isLoading}
          catalogMaxPrice={catalogMaxPrice}
          filtersOpen={filtersOpen}
          maxPrice={maxPrice}
          municipalities={municipalities}
          selectedCategories={selectedCategories}
          selectedMunicipalities={selectedMunicipalities}
          stockOnly={stockOnly}
          onToggleOpen={() => setFiltersOpen((open) => !open)}
          onToggleCategory={(category) => toggleFilter(category, selectedCategories, setSelectedCategories)}
          onToggleMunicipality={(municipality) => toggleFilter(municipality, selectedMunicipalities, setSelectedMunicipalities)}
          onMaxPriceChange={setMaxPrice}
          onStockOnlyChange={setStockOnly}
          onReset={resetFilters}
          onRetryCategories={() => categoriesQuery.refetch()}
        />

        <main className="min-w-0 flex-1" aria-label="Catálogo de productos artesanales">
          <CatalogHeader />
          <SearchPanel searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <CatalogToolbar count={filteredProducts.length} sort={sort} onSortChange={setSort} />

          {productsQuery.isLoading ? <CatalogStatus message="Cargando productos artesanales..." /> : null}

          {productsQuery.isError ? (
            <CatalogStatus message={resolveErrorMessage(productsQuery.error)} error onRetry={() => productsQuery.refetch()} />
          ) : null}

          {productsQuery.isSuccess ? (
            <section className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3" aria-label="Productos disponibles">
              {filteredProducts.map((product) => (
                <ConsumerProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    category: product.category.name,
                    producer: product.producer.businessName,
                    origin: product.producer.address.city,
                    price: formatMoney(product.price),
                    stock: product.stock > 0 ? 'En stock' : 'Sin stock',
                    imageUrl: product.images[0]?.url,
                  }}
                />
              ))}
            </section>
          ) : null}

          {productsQuery.isSuccess && filteredProducts.length === 0 ? (
            <div className="mt-10 border border-dashed border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-10 text-center">
              <p className="text-body-md text-[var(--color-on-surface-variant)]">
                {products.length === 0 ? 'Todavía no hay productos disponibles en el catálogo.' : 'No hay productos que coincidan con la búsqueda o filtros aplicados.'}
              </p>
              {products.length > 0 ? (
                <button type="button" onClick={resetFilters} className="text-label-md mt-5 border border-[var(--color-primary)] px-6 py-3 uppercase tracking-wider text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)]">
                  Restablecer filtros
                </button>
              ) : null}
            </div>
          ) : null}
        </main>
      </div>
    </div>
  )
}

function CatalogHeader() {
  return (
    <header className="mb-8">
      <nav aria-label="Breadcrumb" className="text-label-sm mb-4 flex items-center gap-2 text-[var(--color-on-surface-variant)]/70">
        <span>Área consumidor</span>
        <ChevronRight size={14} strokeWidth={1.8} />
        <span className="text-[var(--color-on-surface)]">Catálogo</span>
      </nav>
      <h1 className="text-display-lg text-[var(--color-on-surface)]">Catálogo</h1>
      <p className="text-body-md mt-3 max-w-2xl text-[var(--color-on-surface-variant)]">
        Explora una selección curada de productos artesanales, filtrados por origen, categoría y disponibilidad.
      </p>
    </header>
  )
}

type CatalogFiltersProps = {
  categories: FilterOption[]
  categoriesError: boolean
  categoriesLoading: boolean
  catalogMaxPrice: number
  filtersOpen: boolean
  maxPrice: number | null
  municipalities: FilterOption[]
  selectedCategories: string[]
  selectedMunicipalities: string[]
  stockOnly: boolean
  onToggleOpen: () => void
  onToggleCategory: (category: string) => void
  onToggleMunicipality: (municipality: string) => void
  onMaxPriceChange: (price: number) => void
  onStockOnlyChange: (checked: boolean) => void
  onReset: () => void
  onRetryCategories: () => void
}

function CatalogFilters({ categories, categoriesError, categoriesLoading, catalogMaxPrice, filtersOpen, maxPrice, municipalities, selectedCategories, selectedMunicipalities, stockOnly, onToggleOpen, onToggleCategory, onToggleMunicipality, onMaxPriceChange, onStockOnlyChange, onReset, onRetryCategories }: CatalogFiltersProps) {
  return (
    <aside className="border-[color-mix(in_srgb,var(--color-outline-variant)_85%,transparent)] min-[1300px]:sticky min-[1300px]:top-28 min-[1300px]:flex min-[1300px]:h-[calc(100dvh-9rem)] min-[1300px]:w-80 min-[1300px]:shrink-0 min-[1300px]:flex-col min-[1300px]:overflow-y-auto min-[1300px]:border-r min-[1300px]:pr-8">
      <div className="flex items-end justify-between gap-4 border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-4 min-[1300px]:mb-8 min-[1300px]:block min-[1300px]:border-0 min-[1300px]:bg-transparent min-[1300px]:p-0">
        <div>
          <h2 className="text-title-lg text-[var(--color-secondary)]">Filtros</h2>
          <p className="text-label-sm mt-1 text-[var(--color-on-surface-variant)]">Refina tu búsqueda</p>
        </div>
        <button type="button" onClick={onToggleOpen} aria-expanded={filtersOpen} className="text-label-sm flex items-center gap-2 text-[var(--color-primary)] min-[1300px]:hidden">
          <SlidersHorizontal size={17} strokeWidth={1.8} />
          {filtersOpen ? 'Ocultar' : 'Ajustar'}
        </button>
      </div>

      <div className={`${filtersOpen ? 'grid' : 'hidden'} mt-4 gap-8 border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-5 md:grid-cols-2 min-[1300px]:mt-0 min-[1300px]:flex min-[1300px]:border-0 min-[1300px]:bg-transparent min-[1300px]:p-0 min-[1300px]:flex-col min-[1300px]:gap-0`}>
        {categoriesLoading ? <FilterStatus message="Cargando categorías..." /> : categoriesError ? <FilterStatus message="No se pudieron cargar las categorías." onRetry={onRetryCategories} /> : <FilterGroup icon={Boxes} title="Categorías" options={categories} selectedOptions={selectedCategories} onToggle={onToggleCategory} />}
        <FilterGroup icon={MapPin} title="Municipios" options={municipalities} selectedOptions={selectedMunicipalities} onToggle={onToggleMunicipality} />

        <section className="border-b border-[var(--color-outline-variant)] pb-6 min-[1300px]:pt-6">
          <FilterTitle icon={WalletCards} title="Rango de precio" />
          <div className="px-2">
            <input aria-label="Precio máximo" className="h-1 w-full accent-[var(--color-primary)]" max={catalogMaxPrice} min="0" type="range" value={maxPrice ?? catalogMaxPrice} onChange={(event) => onMaxPriceChange(Number(event.target.value))} />
            <div className="text-label-sm mt-3 flex justify-between text-[var(--color-on-surface-variant)]">
              <span>0 €</span>
              <span className="font-semibold text-[var(--color-on-surface)]">{maxPrice === null ? 'Sin límite' : `Hasta ${maxPrice} €`}</span>
              <span>{catalogMaxPrice} €</span>
            </div>
          </div>
        </section>

        <section className="pb-6 min-[1300px]:pt-6">
          <FilterTitle icon={PackageCheck} title="Disponibilidad" />
          <FilterCheckbox label="Solo con stock" checked={stockOnly} onChange={onStockOnlyChange} />
        </section>

        <button type="button" onClick={onReset} className="text-label-md w-full border border-[var(--color-outline)] px-6 py-3 uppercase tracking-wider text-[var(--color-secondary)] transition-colors duration-300 hover:bg-[var(--color-surface-container)] hover:text-[var(--color-primary)] min-[1300px]:mt-auto">
          Restablecer filtros
        </button>
      </div>
    </aside>
  )
}

function FilterStatus({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <section className="border-b border-[var(--color-outline-variant)] pb-6 min-[1300px]:pt-6 first:min-[1300px]:pt-0"><FilterTitle icon={Boxes} title="Categorías" /><p className="text-body-sm text-[var(--color-on-surface-variant)]">{message}</p>{onRetry ? <button type="button" onClick={onRetry} className="text-label-sm mt-3 text-[var(--color-primary)] underline underline-offset-4">Reintentar</button> : null}</section>
}

function FilterGroup({ icon, title, options, selectedOptions, onToggle }: { icon: typeof Boxes; title: string; options: FilterOption[]; selectedOptions: string[]; onToggle: (option: string) => void }) {
  return (
    <section className="border-b border-[var(--color-outline-variant)] pb-6 min-[1300px]:pt-6 first:min-[1300px]:pt-0">
      <FilterTitle icon={icon} title={title} />
      {options.length > 0 ? (
        <ul className="space-y-3">
          {options.map((option) => (
            <li key={option.value}>
              <FilterCheckbox label={option.label} checked={selectedOptions.includes(option.value)} onChange={() => onToggle(option.value)} />
            </li>
          ))}
        </ul>
      ) : <p className="text-body-sm text-[var(--color-on-surface-variant)]">Sin opciones disponibles</p>}
    </section>
  )
}

function FilterTitle({ icon: Icon, title }: { icon: typeof Boxes; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <Icon size={19} strokeWidth={1.8} className="text-[var(--color-primary)]" />
      <h3 className="text-label-md uppercase tracking-[0.2em] text-[var(--color-on-surface)]">{title}</h3>
    </div>
  )
}

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="group flex cursor-pointer items-center gap-3">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-4 rounded-sm border-[var(--color-outline-variant)] bg-transparent accent-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
      <span className={`text-body-md transition-colors group-hover:text-[var(--color-primary-container)] ${checked ? 'font-bold text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'}`}>{label}</span>
    </label>
  )
}

function SearchPanel({ searchQuery, onSearchChange }: { searchQuery: string; onSearchChange: (value: string) => void }) {
  return (
    <section className="mb-10">
      <label className="flex items-center rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-4 py-4 shadow-sm transition-all focus-within:border-[var(--color-primary)] focus-within:ring-1 focus-within:ring-[var(--color-primary)] md:px-6">
        <span className="sr-only">Buscar productos</span>
        <Search size={28} strokeWidth={1.7} className="mr-4 shrink-0 text-[var(--color-primary)]" />
        <input type="search" value={searchQuery} onChange={(event) => onSearchChange(event.target.value)} placeholder="Busca productos, categorías o productores..." className="text-body-lg w-full border-0 bg-transparent p-0 text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] focus:outline-none focus:ring-0" />
      </label>
    </section>
  )
}

function CatalogToolbar({ count, sort, onSortChange }: { count: number; sort: SortOption; onSortChange: (sort: SortOption) => void }) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-[var(--color-outline-variant)] pb-4 sm:flex-row sm:items-center">
      <p className="text-body-md text-[var(--color-on-surface-variant)]"><span className="font-semibold text-[var(--color-on-surface)]">{count}</span> productos encontrados</p>
      <label className="flex items-center gap-4">
        <span className="text-label-md uppercase text-[var(--color-on-surface-variant)]">Ordenar por:</span>
        <select value={sort} onChange={(event) => onSortChange(event.target.value as SortOption)} className="text-body-md border-0 border-b border-[var(--color-outline-variant)] bg-transparent pb-1 text-[var(--color-on-surface)] focus:border-[var(--color-primary)] focus:outline-none">
          <option value="newest">Novedades</option>
          <option value="asc">Precio: menor a mayor</option>
          <option value="desc">Precio: mayor a menor</option>
        </select>
      </label>
    </div>
  )
}

function CatalogStatus({ message, error = false, onRetry }: { message: string; error?: boolean; onRetry?: () => void }) {
  return (
    <div role={error ? 'alert' : 'status'} className="border border-dashed border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-10 text-center">
      <p className="text-body-md text-[var(--color-on-surface-variant)]">{message}</p>
      {onRetry ? <button type="button" onClick={onRetry} className="text-label-md mt-5 border border-[var(--color-primary)] px-6 py-3 uppercase tracking-wider text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)]">Reintentar</button> : null}
    </div>
  )
}
