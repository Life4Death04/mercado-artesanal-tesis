import { useState } from 'react'
import {
  Boxes,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  PackageCheck,
  Search,
  SlidersHorizontal,
  WalletCards,
} from 'lucide-react'
import { ConsumerProductCard, type ConsumerCatalogCardProduct } from '../componentes/ConsumerProductCard'

type FilterOption = {
  label: string
}

const categories: FilterOption[] = [
  { label: 'Aceites' },
  { label: 'Vinos' },
  { label: 'Embutidos' },
  { label: 'Turrones' },
  { label: 'Miel' },
]

const municipalities: FilterOption[] = [
  { label: 'Jijona' },
  { label: 'Pinoso' },
  { label: 'Villena' },
  { label: 'Denia' },
]

const products: ConsumerCatalogCardProduct[] = [
  {
    id: 'oro-liquido-virgen-extra',
    name: 'Oro Líquido Virgen Extra',
    category: 'Aceites',
    producer: 'Almazara El Tendre',
    origin: 'Pinoso',
    price: '18,50 €',
    stock: 'En stock',
    rating: 4,
    reviews: 24,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBs81tSMbFflR3UKUDu2xh0_c9gd5UoQyAlZy-U7-e-Z42Tgl4ZHDoU5s4PVN3xzTb3A5Ep1W3cUR80e1OnxOQ0cQ8iJLjGPLGy5zx3iz6fTrZvbQrU2AnYzUWoX0Tg0hzsDwXO7P55R4_VhCYIEVLn6ElEa-54i8FHdnAKfpI6gpeFX8vzxVbeBjvW3Muqnm2TRkgrPMuCFt8aT78aOirD42KpFz5WjyyB3AmBG-QQjSxuGI9Ahm4upZk1w_36uvxHEpmZTSHMUcs',
  },
  {
    id: 'turron-blando-artesano',
    name: 'Turrón Blando Artesano',
    category: 'Turrones',
    producer: 'Turrones Jijona S.L.',
    origin: 'Jijona',
    price: '12,00 €',
    stock: 'En stock',
    rating: 5,
    reviews: 56,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBKQWfa65s_7dCYBCU1ABVTKhXMp5dxM018mKuSdEjGhzmS3cGRsKhMn3AqLlhcfAFLff_7ShIAKdDT9Goff5Od0gEo7it_MMVETRCRYVQxDvc8mgwfsm5xfOYx5IVFsXuarXkUM1Fo-oWwX84SqSm31N7I0khMA19UjXnwO2OBS27R6p_72h2OEhZ3KsNK-E24xM-uDE1o6_3kUOcMlI8qzah-yV-h_7A8cmU7w4Xl_8CfG-LGmgC-e87wGSGgi0tHKNlURRvdhw8',
  },
  {
    id: 'tinto-crianza-monastrell',
    name: 'Tinto Crianza Monastrell',
    category: 'Vinos',
    producer: 'Bodegas Monastrell',
    origin: 'Villena',
    price: '22,00 €',
    stock: 'Sin stock',
    rating: 4,
    reviews: 18,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD2UjzXmY8KF0_4qO_MdscDSIVlv3R6d9K11EntdmKih-XDxMHoIRt8UeoIkH_vy3BXyK7EuTNrbkpvwG5SK3XXWhh76whZoBnvW0EDRxZhPzETApknTTvLXG1l0aqPSSVwB4xUJLwx6sQgJIviLCdhknPqpYJg7VxTzVnTfy5_bYsvDYwPBurNuWsjFb3cOf9ofFZ2jLKT_ZDYiSJNMqwhVebI9huuDYIazYf-Eiw81XUpznp_h1d1w9poAcoysIcCNWG_sWqsKnw',
  },
  {
    id: 'longaniza-curada-artesana',
    name: 'Longaniza Curada Artesana',
    category: 'Embutidos',
    producer: 'Cárnicas Pinoso',
    origin: 'Pinoso',
    price: '9,50 €',
    stock: 'En stock',
    rating: 5,
    reviews: 42,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCEak3TPIhCLj0X2F22kQcyCmT_ex5nXQp7flW7VG5R-BI2_zaHoIbgx6sf4aQbD2lucvwJtDAWGCwSt7tntjZj3jwlB4QD4HbwQP23rCKvURo-z379i94pEfLe9UtIvpnW4nFML-dXpymKYKYP_o3ssNSAZyXqrgQUf6uGUFOO7FSxlA7O0UpU2zflWvcnYmxj3iGPxRETa5PU7NbqWbwJOsMKe9TP0jyKsrAaif4QWmnCzhCDe8eEN5PFN-FePhKpUzm9xyNXlcU',
  },
  {
    id: 'miel-de-azahar',
    name: 'Miel de Azahar',
    category: 'Miel',
    producer: 'Apícola Marina',
    origin: 'Denia',
    price: '8,20 €',
    stock: 'En stock',
    rating: 5,
    reviews: 31,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD3TIIOQmF3_HQd85psvhUyJxgBu4gYe3bHC2-v5JgxTG2_sDSCoz4wCbvO30nvVergQ8yd4pk8OGdZJ0k24ONwWS7SEUVEOjZC7b42wlrOMju6BNVfEVvAMjCIz6C_NXWXdOl0NnxupRmkTNGkNcwmCuDui4nuQXuUZH6nDp7Vgcdfl4Pqsvev0NFsTJTrJMA1TinwPI79t9pzTsLBhgWVOZ9yWTyYqmclmF8XuaRKRpAX9YvSP2EJO1KEg9CZ-CaN_LEJgEujBAE',
  },
  {
    id: 'embutido-tradicional',
    name: 'Embutido Tradicional',
    category: 'Embutidos',
    producer: 'Cárnicas Pinoso',
    origin: 'Pinoso',
    price: '11,40 €',
    stock: 'En stock',
    rating: 4,
    reviews: 15,
    imageUrl:
      'https://images.unsplash.com/photo-1603046891726-36bfd957e0bf?auto=format&fit=crop&w=900&q=80',
  },
]

function parsePrice(price: string) {
  return Number(price.replace('€', '').replace(',', '.').trim())
}

export function CatalogoPage() {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedMunicipalities, setSelectedMunicipalities] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState(50)
  const [stockOnly, setStockOnly] = useState(false)

  const normalizedSearch = searchQuery.trim().toLowerCase()
  const filteredProducts = products.filter((product) => {
    const matchesSearch = !normalizedSearch || [product.name, product.category, product.producer, product.origin]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch)
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category ?? '')
    const matchesMunicipality = selectedMunicipalities.length === 0 || selectedMunicipalities.includes(product.origin ?? '')
    const matchesPrice = parsePrice(product.price) <= maxPrice
    const matchesStock = !stockOnly || product.stock === 'En stock'

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
    setMaxPrice(50)
    setStockOnly(false)
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)] selection:bg-[var(--color-primary-fixed)] selection:text-[var(--color-on-primary-fixed)]">
      <div className="mx-auto flex w-full max-w-[var(--layout-container-max)] flex-col gap-8 px-[var(--space-margin-mobile)] py-10 md:px-[var(--space-margin-desktop)] min-[1300px]:flex-row min-[1300px]:gap-16">
        <CatalogFilters
          filtersOpen={filtersOpen}
          maxPrice={maxPrice}
          selectedCategories={selectedCategories}
          selectedMunicipalities={selectedMunicipalities}
          stockOnly={stockOnly}
          onToggleOpen={() => setFiltersOpen((open) => !open)}
          onToggleCategory={(category) => toggleFilter(category, selectedCategories, setSelectedCategories)}
          onToggleMunicipality={(municipality) => toggleFilter(municipality, selectedMunicipalities, setSelectedMunicipalities)}
          onMaxPriceChange={setMaxPrice}
          onStockOnlyChange={setStockOnly}
          onReset={resetFilters}
        />

        <main className="min-w-0 flex-1" aria-label="Catálogo de productos artesanales">
          <CatalogHeader />
          <SearchPanel searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <CatalogToolbar count={filteredProducts.length} />

          <section className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3" aria-label="Productos disponibles">
            {filteredProducts.map((product) => (
              <ConsumerProductCard key={product.id} product={product} />
            ))}
          </section>

          {filteredProducts.length === 0 ? (
            <div className="mt-10 border border-dashed border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-10 text-center">
              <p className="text-body-md text-[var(--color-on-surface-variant)]">No hay productos que coincidan con la búsqueda o filtros aplicados.</p>
              <button type="button" onClick={resetFilters} className="text-label-md mt-5 border border-[var(--color-primary)] px-6 py-3 uppercase tracking-wider text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)]">
                Restablecer filtros
              </button>
            </div>
          ) : null}

          <Pagination />
        </main>
      </div>

      <CatalogFooter />
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
        Explora una selección curada de productos artesanales de Alicante, filtrados por origen, categoría y disponibilidad.
      </p>
    </header>
  )
}

type CatalogFiltersProps = {
  filtersOpen: boolean
  maxPrice: number
  selectedCategories: string[]
  selectedMunicipalities: string[]
  stockOnly: boolean
  onToggleOpen: () => void
  onToggleCategory: (category: string) => void
  onToggleMunicipality: (municipality: string) => void
  onMaxPriceChange: (price: number) => void
  onStockOnlyChange: (checked: boolean) => void
  onReset: () => void
}

function CatalogFilters({
  filtersOpen,
  maxPrice,
  selectedCategories,
  selectedMunicipalities,
  stockOnly,
  onToggleOpen,
  onToggleCategory,
  onToggleMunicipality,
  onMaxPriceChange,
  onStockOnlyChange,
  onReset,
}: CatalogFiltersProps) {
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
        <FilterGroup icon={Boxes} title="Categorías" options={categories} selectedOptions={selectedCategories} onToggle={onToggleCategory} />
        <FilterGroup icon={MapPin} title="Municipios" options={municipalities} selectedOptions={selectedMunicipalities} onToggle={onToggleMunicipality} />

        <section className="border-b border-[var(--color-outline-variant)] pb-6 min-[1300px]:pt-6">
          <FilterTitle icon={WalletCards} title="Rango de precio" />
          <div className="px-2">
            <input
              aria-label="Precio máximo"
              className="h-1 w-full accent-[var(--color-primary)]"
              max="100"
              min="0"
              type="range"
              value={maxPrice}
              onChange={(event) => onMaxPriceChange(Number(event.target.value))}
            />
            <div className="text-label-sm mt-3 flex justify-between text-[var(--color-on-surface-variant)]">
              <span>0 €</span>
              <span className="font-semibold text-[var(--color-on-surface)]">Hasta {maxPrice} €</span>
              <span>100 €</span>
            </div>
          </div>
        </section>

        <section className="pb-6 min-[1300px]:pt-6">
          <FilterTitle icon={PackageCheck} title="Disponibilidad" />
          <FilterCheckbox label="Solo con stock" checked={stockOnly} onChange={onStockOnlyChange} />
        </section>

        <button
          type="button"
          onClick={onReset}
          className="text-label-md w-full border border-[var(--color-outline)] px-6 py-3 uppercase tracking-wider text-[var(--color-secondary)] transition-colors duration-300 hover:bg-[var(--color-surface-container)] hover:text-[var(--color-primary)] min-[1300px]:mt-auto"
        >
          Restablecer filtros
        </button>
      </div>
    </aside>
  )
}

function FilterGroup({ icon, title, options, selectedOptions, onToggle }: { icon: typeof Boxes; title: string; options: FilterOption[]; selectedOptions: string[]; onToggle: (option: string) => void }) {
  return (
    <section className="border-b border-[var(--color-outline-variant)] pb-6 min-[1300px]:pt-6 first:min-[1300px]:pt-0">
      <FilterTitle icon={icon} title={title} />
      <ul className="space-y-3">
        {options.map((option) => (
          <li key={option.label}>
            <FilterCheckbox label={option.label} checked={selectedOptions.includes(option.label)} onChange={() => onToggle(option.label)} />
          </li>
        ))}
      </ul>
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
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 rounded-sm border-[var(--color-outline-variant)] bg-transparent accent-[var(--color-primary)] focus:ring-[var(--color-primary)]"
      />
      <span
        className={`text-body-md transition-colors group-hover:text-[var(--color-primary-container)] ${
          checked
            ? 'font-bold text-[var(--color-primary)]'
            : 'text-[var(--color-on-surface-variant)]'
        }`}
      >
        {label}
      </span>
    </label>
  )
}

function SearchPanel({ searchQuery, onSearchChange }: { searchQuery: string; onSearchChange: (value: string) => void }) {
  return (
    <section className="mb-10">
      <label className="flex items-center rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-4 py-4 shadow-sm transition-all focus-within:border-[var(--color-primary)] focus-within:ring-1 focus-within:ring-[var(--color-primary)] md:px-6">
        <span className="sr-only">Buscar productos</span>
        <Search size={28} strokeWidth={1.7} className="mr-4 shrink-0 text-[var(--color-primary)]" />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Busca vinos, turrones, embutidos..."
          className="text-body-lg w-full border-0 bg-transparent p-0 text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] focus:outline-none focus:ring-0"
        />
        <button
          type="button"
          className="text-label-md ml-4 hidden rounded-[var(--radius-default)] bg-[var(--color-primary)] px-8 py-2.5 uppercase tracking-wider text-[var(--color-on-primary)] shadow-sm transition-colors hover:bg-[var(--color-primary-container)] sm:block"
        >
          Buscar
        </button>
      </label>
    </section>
  )
}

function CatalogToolbar({ count }: { count: number }) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-[var(--color-outline-variant)] pb-4 sm:flex-row sm:items-center">
      <p className="text-body-md text-[var(--color-on-surface-variant)]">
        <span className="font-semibold text-[var(--color-on-surface)]">{count}</span> productos encontrados
      </p>
      <div className="flex items-center gap-4">
        <span className="text-label-md uppercase text-[var(--color-on-surface-variant)]">Ordenar por:</span>
        <button
          type="button"
          className="flex items-center gap-2 border-b border-[var(--color-outline-variant)] pb-1 text-[var(--color-on-surface)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
        >
          <span className="text-body-md">Novedades</span>
          <ChevronDown size={20} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  )
}

function Pagination() {
  return (
    <nav className="mt-16 flex items-center justify-center gap-4 border-t border-[var(--color-outline-variant)] pt-8" aria-label="Paginación del catálogo">
      <PaginationButton icon={ChevronLeft} label="Página anterior" disabled />
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((page) => (
          <PaginationButton key={page} label={String(page)} active={page === 1} />
        ))}
        <span className="text-label-md grid size-10 place-items-center text-[var(--color-on-surface-variant)]">...</span>
        <PaginationButton label="12" />
      </div>
      <PaginationButton icon={ChevronRight} label="Página siguiente" />
    </nav>
  )
}

function PaginationButton({
  label,
  icon: Icon,
  active = false,
  disabled = false,
}: {
  label: string
  icon?: typeof ChevronLeft
  active?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={Icon ? label : `Página ${label}`}
      aria-current={active ? 'page' : undefined}
      disabled={disabled}
      className={`text-label-md grid size-10 place-items-center rounded-[var(--radius-default)] border transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        active
          ? 'border-[var(--color-primary)] bg-[var(--color-primary)] font-bold text-[var(--color-on-primary)] shadow-sm'
          : 'border-[var(--color-outline-variant)] bg-[var(--color-surface)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
      }`}
    >
      {Icon ? <Icon size={20} strokeWidth={1.8} /> : label}
    </button>
  )
}

function CatalogFooter() {
  return (
    <footer className="mt-10 border-t border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)]">
      <div className="mx-auto grid max-w-[var(--layout-container-max)] grid-cols-1 gap-12 px-[var(--space-margin-mobile)] py-16 md:grid-cols-3 md:px-[var(--space-margin-desktop)]">
        <div className="flex flex-col gap-4">
          <span className="text-headline-md tracking-tight text-[var(--color-primary)]">ARTESANÍA ALICANTE</span>
          <p className="text-body-md max-w-xs text-[var(--color-secondary)]">
            Tradición y sabor desde el corazón de la provincia.
          </p>
        </div>

        <nav className="flex flex-col gap-3" aria-label="Enlaces de tienda">
          {['Historia', 'Productores', 'Envíos'].map((item) => (
            <a key={item} href="#" className="text-body-md text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-primary)]">
              {item}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-4 md:items-end md:text-right">
          <nav className="flex flex-col gap-3 md:items-end" aria-label="Enlaces legales">
            {['Aviso Legal', 'Privacidad'].map((item) => (
              <a key={item} href="#" className="text-body-md text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-primary)]">
                {item}
              </a>
            ))}
          </nav>
          <p className="text-label-sm mt-auto pt-4 text-[var(--color-secondary)]">
            © 2024 Artesanía de Alicante. Tradición y Sabor.
          </p>
        </div>
      </div>
    </footer>
  )
}
