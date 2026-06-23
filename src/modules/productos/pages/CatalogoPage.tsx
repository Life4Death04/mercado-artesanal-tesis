import { Link } from 'react-router-dom'
import { Bell, Search, ShoppingCart, SlidersHorizontal, Star } from 'lucide-react'

const categories = [
  { name: 'Aceites & Vinagres', count: 12, active: false },
  { name: 'Dulces Artesanos', count: 24, active: true },
  { name: 'Embutidos y Sobrasadas', count: 18, active: false },
  { name: 'Quesos Curados', count: 9, active: false },
  { name: 'Conservas de la Mar', count: 15, active: false },
]

const municipalities = ['Jijona', 'Pinoso', 'Villena', 'Novelda']

const products = [
  {
    id: 'turron-jijona',
    name: 'Turrón de Jijona',
    category: 'Dulces',
    origin: 'Jijona',
    price: '12,50 €',
    badge: 'Alicante D.O.',
    availability: 'Disponible',
    rating: 5,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDA7KXcRlul0jkaHFJgcWr3i48LTEm2PiN2oMy7AgIfUNdgJG-cZH5Gju7orMJUwgFTuD1WRGJagaXzVeuBWknb2Dj_U2qx7QCXwnM31dQWimVJJIXwhdeSPwhy7tCZkeBTAaaUFJ3fipqOyRhncsjeNvSVi4xcIhwlECqJV-fyq5D7h5E1hwhXPkjfY8ZTwtWessS1sFY3jbyNLyeojnfE5rIpF2pbOBNNz4zwo2PG48cVDpjD4uVjWLJkzSjpnPKdjpKsXg7Ra432',
  },
  {
    id: 'sobrasada-artesana',
    name: 'Sobrasada artesana',
    category: 'Embutidos',
    origin: 'Pinoso',
    price: '8,90 €',
    availability: 'Disponible',
    rating: 4,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBxvyosjd7_l_glyen-XjXwXTGcNwivDpxwx1iP-EOKBE1K9-WV3iVgZ838UcbdnFPp6r5L6ihWRE0FmWHkM9G_kMp5fl2pE8Y4POTd3B0kq074Vgx6kkxxH1k9OmeNQMBxe-1FZvVkQzIf2qkngU2nADjaHmwv3wGgOCN8Pjc6PGity6DBvmHUOV1Zv9g4dDELRqcvBOB24paYRHRwdLmd3ukU2KuONQDpQITOD5sCIRycRpIbDZiKsGtanvenuURVDVDGllLkrdfE',
  },
  {
    id: 'queso-curado-cabra',
    name: 'Queso curado de cabra',
    category: 'Quesos',
    origin: 'Villena',
    price: '15,20 €',
    availability: 'En Stock',
    rating: 5,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuChoi5PCyKn9PKQ0vEq3TpX6DXkPPhujYLFBKy7UNeei4zt7eaQRC19cVvBUn2cWhsl5L6TuwziAUL_410jmxcVmwml2jwZ_AD0eNdsHqvIsLuRvc1ZaG_MRtbcC1k8PyKE4PvefXaoZp-t2Y8LgAaIEBZbIxDTiYkEfnVwhTurzSWb9lhZb_Ot3BFfwTMMrdtu40QVffpBAp2CWLFtbeJW2HuvqjR8DgnihGxl4MAMIgwCnYVdRYmkGEDRvqy1T6f-BKfEJeElrkLq',
  },
  {
    id: 'pericana-montana',
    name: 'Pericana de la Montaña',
    category: 'Conservas',
    origin: 'Muro',
    price: '6,40 €',
    availability: 'Disponible',
    rating: 4,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAbLXQTLZDzSv3JEm4RCk-eNnebNNePc_RL5riv2SRUi_3BJrbiKbW24XQMn6RZ2X7G239hGvG-zBoQbFC6kA6Fnq64Ig6JLYMr-EmLhl9VHkitMI4DZtBWmtw0h_NHdED2bpBS14Dn9Dy-m-ApMDMFm6ny8gayfj1nYvyiUKtBa06W6V3wcnu-ZfmZ7JBq77Z39Vvp31nN8PuKOrAJv1BJ7uset4CeEhbiE2RmUqtHhJjex4qSls8-ABsKWpxoQ5Qk4GKC1SPobJlD',
  },
]

const secondaryFilters = ['Region', 'Category', 'Price', 'Producer']

export function CatalogoPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)] selection:bg-[var(--color-primary-fixed)] selection:text-[var(--color-on-primary-fixed)]">
      <nav className="sticky top-0 z-50 w-full border-b border-[var(--color-outline-variant)] bg-[var(--color-surface)]">
        <div className="mx-auto flex h-20 max-w-[var(--layout-container-max)] items-center justify-between px-[var(--space-margin-mobile)] md:px-[var(--space-margin-desktop)]">
          <Link to="/productos" className="font-editorial text-[24px] font-bold tracking-tight text-[var(--color-primary)] uppercase md:text-[32px]">
            Alicante Delicatessen
          </Link>

          <label className="relative mx-6 hidden max-w-md flex-1 items-center lg:flex">
            <span className="sr-only">Buscar productos</span>
            <Search size={18} strokeWidth={1.8} className="absolute left-3 text-[var(--color-outline)]" />
            <input
              type="search"
              placeholder="Buscar productos artesanos…"
              className="text-label-sm w-full border-0 border-b border-[var(--color-outline)] bg-transparent py-2 pr-4 pl-10 text-[var(--color-on-surface)] transition-colors placeholder:text-[var(--color-secondary)] focus:border-[var(--color-primary)] focus:outline-none"
            />
          </label>

          <div className="flex items-center gap-5 md:gap-6">
            <button type="button" aria-label="Notificaciones" className="p-2 text-[var(--color-primary)] transition-opacity active:opacity-70">
              <Bell size={21} strokeWidth={1.8} />
            </button>
            <Link to="/carrito" aria-label="Carrito" className="relative flex items-center p-2 text-[var(--color-primary)] transition-opacity active:opacity-70">
              <ShoppingCart size={22} strokeWidth={1.8} />
              <span className="absolute top-0 right-0 grid size-4 place-items-center rounded-full bg-[var(--color-primary)] text-[10px] text-[var(--color-on-primary)]">
                2
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="sticky top-20 z-40 w-full border-b border-[var(--color-outline-variant)] bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-[var(--layout-container-max)] items-center gap-6 overflow-x-auto px-[var(--space-margin-mobile)] py-4 md:px-[var(--space-margin-desktop)]">
          <div className="mr-2 flex shrink-0 items-center gap-2">
            <SlidersHorizontal size={18} strokeWidth={1.8} className="text-[var(--color-secondary)]" />
            <span className="text-label-sm uppercase tracking-widest text-[var(--color-secondary)]">Filters</span>
          </div>
          <div className="flex items-center gap-6">
            {secondaryFilters.map((filter, index) => (
              <button
                key={filter}
                type="button"
                className={`text-label-sm shrink-0 border-b pb-1 uppercase tracking-widest transition-colors ${
                  index === 0
                    ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                    : 'border-transparent text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="flex-grow" />
          <button type="button" className="text-label-sm shrink-0 uppercase tracking-widest text-[var(--color-secondary)] underline-offset-4 transition-colors hover:text-[var(--color-primary)] hover:underline">
            Reset
          </button>
        </div>
      </div>

      <main className="mx-auto grid max-w-[var(--layout-container-max)] grid-cols-1 gap-[var(--space-gutter)] px-[var(--space-margin-mobile)] py-12 md:px-[var(--space-margin-desktop)] lg:grid-cols-12">
        <aside className="space-y-10 border-b border-[var(--color-outline-variant)] pb-8 lg:col-span-3 lg:border-r lg:border-b-0 lg:pr-[var(--space-gutter)]">
          <FilterCategoryList />
          <FilterRule />
          <MunicipalityFilters />
          <FilterRule />
          <AvailabilityFilters />
        </aside>

        <section className="lg:col-span-9" aria-label="Productos disponibles">
          <div className="grid grid-cols-1 gap-x-[var(--space-gutter)] gap-y-16 md:grid-cols-2">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-20 flex justify-center">
            <button
              type="button"
              className="text-label-sm border border-[var(--color-on-background)] px-12 py-4 uppercase tracking-widest text-[var(--color-on-background)] transition-colors duration-300 hover:bg-[var(--color-on-background)] hover:text-[var(--color-surface)]"
            >
              Cargar más productos
            </button>
          </div>
        </section>
      </main>

      <footer className="mt-20 w-full border-t border-[var(--color-outline-variant)] bg-[var(--color-surface-container-highest)]">
        <div className="mx-auto flex max-w-[var(--layout-container-max)] flex-col items-start justify-between gap-8 px-[var(--space-margin-mobile)] py-12 md:flex-row md:items-center md:px-[var(--space-margin-desktop)]">
          <div className="space-y-4">
            <span className="font-editorial block text-[40px] leading-none font-bold text-[var(--color-primary)] uppercase md:text-[56px]">
              Alicante
              <br />
              Delicatessen
            </span>
            <p className="text-label-sm max-w-xs text-[var(--color-on-surface-variant)]">
              Comisarios gastronómicos de la herencia del Mediterráneo.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {['Privacy Policy', 'Terms of Service', 'Shipping & Returns', 'Contact Us', 'Wholesale'].map((item) => (
              <a key={item} href="#" className="text-label-sm text-[var(--color-on-surface-variant)] underline-offset-4 transition-colors hover:text-[var(--color-primary)] hover:underline">
                {item}
              </a>
            ))}
          </div>
          <p className="text-label-sm text-[var(--color-on-surface-variant)]">© 2024 Alicante Delicatessen.</p>
        </div>
      </footer>
    </div>
  )
}

function FilterCategoryList() {
  return (
    <section>
      <h2 className="text-label-sm mb-6 uppercase tracking-widest text-[var(--color-primary)]">Categoría</h2>
      <ul className="text-body-md space-y-4 text-[var(--color-on-surface-variant)]">
        {categories.map((category) => (
          <li key={category.name}>
            <button
              type="button"
              className={`group flex w-full items-center justify-between text-left transition-colors hover:text-[var(--color-primary)] ${
                category.active ? 'font-semibold text-[var(--color-primary)]' : ''
              }`}
            >
              <span>{category.name}</span>
              <span className="text-[10px] text-[var(--color-outline)]">{category.count}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function MunicipalityFilters() {
  return (
    <section>
      <h2 className="text-label-sm mb-6 uppercase tracking-widest text-[var(--color-primary)]">Origen (Municipios)</h2>
      <div className="text-body-md space-y-4 text-[var(--color-on-surface-variant)]">
        {municipalities.map((municipality) => (
          <label key={municipality} className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              className="size-4 rounded-none border-[var(--color-outline-variant)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <span>{municipality}</span>
          </label>
        ))}
      </div>
    </section>
  )
}

function AvailabilityFilters() {
  return (
    <section>
      <h2 className="text-label-sm mb-6 uppercase tracking-widest text-[var(--color-primary)]">Disponibilidad</h2>
      <div className="text-body-md space-y-4 text-[var(--color-on-surface-variant)]">
        {['En Stock', 'Bajo Pedido'].map((availability) => (
          <label key={availability} className="flex cursor-pointer items-center gap-3">
            <input
              type="radio"
              name="availability"
              className="size-4 border-[var(--color-outline-variant)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <span>{availability}</span>
          </label>
        ))}
      </div>
    </section>
  )
}

function FilterRule() {
  return <hr className="border-[var(--color-outline-variant)]" />
}

type Product = (typeof products)[number]

type ProductCardProps = {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group cursor-pointer">
      <Link to={`/productos/${product.id}`} className="block">
        <div className="relative mb-6 aspect-[4/5] overflow-hidden bg-[var(--color-surface-container-low)]">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="size-full object-cover grayscale-[20%] transition-all duration-700 group-hover:scale-[1.025] group-hover:grayscale-0"
          />
          {product.badge && (
            <div className="text-label-sm absolute top-4 left-4 bg-[var(--color-primary)] px-3 py-1 text-[10px] tracking-widest text-[var(--color-on-primary)] uppercase">
              {product.badge}
            </div>
          )}
          <span className="text-label-sm absolute bottom-0 left-0 w-full translate-y-full bg-[var(--color-primary)] py-4 text-center text-[var(--color-on-primary)] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            Añadir al carrito
          </span>
        </div>
      </Link>

      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-label-sm text-[10px] uppercase tracking-widest text-[var(--color-outline)]">
              {product.category} · {product.origin}
            </p>
            <h2 className="text-headline-md mt-1 text-[var(--color-on-surface)]">{product.name}</h2>
          </div>
          <span className="text-headline-md shrink-0 text-[var(--color-primary)]">{product.price}</span>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <Rating value={product.rating} />
          <span className="text-label-sm bg-[var(--color-surface-container-highest)] px-2 py-0.5 text-[10px] text-[var(--color-secondary-fixed-dim)] uppercase">
            {product.availability}
          </span>
        </div>
      </div>
    </article>
  )
}

function Rating({ value }: { value: number }) {
  return (
    <div className="flex text-[var(--color-primary)]" aria-label={`${value} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} size={16} strokeWidth={1.6} fill={index < value ? 'currentColor' : 'transparent'} />
      ))}
    </div>
  )
}
