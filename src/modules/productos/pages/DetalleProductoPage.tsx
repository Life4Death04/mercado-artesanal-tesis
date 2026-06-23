import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Info,
  Minus,
  Plus,
  ShoppingBag,
  Star,
} from 'lucide-react'

const product = {
  name: 'Aceite de Oliva Virgen Extra Coupage Premium',
  category: 'Aceites',
  price: '€18.50',
  status: 'En stock',
  rating: 4.8,
  reviews: 24,
  producer: 'Finca Alicante, Denia',
  producerPath: '/productores/finca-alicante',
  mainImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCfuElsjdCbZS62hodzgbjhvWaO0oTi-YBHpgUaj2D2i_M2PkDO2dwKOTrxIh893pzaoNSsTHJulSPV2K5bCbO7aCqB9MMjlpVgR4tJFOdFIyx58_fYM4WKmDF4nXAJxLp943yqH3rQ2nFG9eNJjskyktFCGTCtxcyPtc8nCFOs6ih9ODCqh72z43T7gmtBez40v1MPSvk2N2cEffiUx3bxe6XjyGgn1TncR4OuE-DiW0af_H4AFF-Te-SZwk4C162CGmzEthwRxIeu',
  thumbnails: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBdfBYm3chUpllwWG2Lzxfdj3H-rztlHta-wREJ1sOn7s2d8Q7PGj3g6L95dc8-xgQNTWNmkb6ORxRFFjaLxTdHTmQCPfSf_dyVA61DhoXV-XO7r_feCpHtCgWQuWmy68FZFdSBTbcsX24fJXC1oW3sI_JluAkNGbK4RZgBPJRN3hiwlD440xHfOO_NOD-gDKV1yxrCrVAZQKMX8zRGNTG3EMs2-NuiaQzXtj1Qk1uGHIHsB9pJYyHJJrWMSPRSIfvUBYbWadDdesqs',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAngQ45TJIDJz0hgrmDJQ3XfbI7hVFhaEVcoA01Mx4h7KEmxTyuHJLEPKhRcn5WaO8jH9RYjjWbtba4HoTWNtAYcXbT0bKJPJI7fPKkg5ON2zxEmMj4LJklwupRZ0KQE7xL7YhOMVjDi7tSP1edrA5aV5EIt6qwp1UNL1TE5YRuZ6oA42N9ZgtTc0AuTLr7W-RZM3BqjRlPpLSjbkO3zS2O6G6B4JYav_S_Kkgi84fu3Cq4OIuzCAFOGieMAZ-Xbk6bOFRG6NrRKzH8',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDxRrZ0z6Dz3deAcpsKtuMIKEQ51nh3t1vaxFxfid_VDSPpEDgAYNntPBSGiOUNS831GuuERq4mAaDiiSYBX5X09srp5QYgZ6TCvlLEcYGSakPp5kKkq2UdHaLmTuUYT12jn9dg18AazMN7CDU0iy2yRWswuMGsL6jqleTe3FMicSSxC3QWhOV0u3QdHYGIe-dPVN70OQMfnOVDrSYt0gCjp_jX9M5U97u5xq7MuvFUcWs-2fCbOSGK7msQWTcTReWXVZl3PCaQlbFc',
  ],
  description: [
    'Este excepcional coupage es el resultado de una meticulosa selección de olivas Picual y Arbequina de cosecha temprana, cultivadas en los bancales pedregosos de la Marina Alta.',
    'En nariz, despliega intensas notas de manzana verde, hierba recién cortada y un sutil toque de almendra verde. En boca, su entrada es dulce y fluida, revelando progresivamente un picor y amargor equilibrados y elegantes, característicos de una extracción en frío impecable que preserva toda su vitalidad y antioxidantes naturales.',
  ],
}

const reviews = [
  {
    rating: 5,
    date: 'Hace 2 semanas',
    text: 'Espectacular. Se nota perfectamente el frescor de la Arbequina y el carácter de la Picual. Lo uso exclusivamente en crudo para ensaladas de tomate o pan tostado. Un lujo embotellado.',
    author: 'Carlos M.V.',
  },
  {
    rating: 4,
    date: '14 de Octubre, 2023',
    text: 'Muy equilibrado, ni muy amargo ni muy plano. El envase además es precioso, ideal para regalar a alguien que aprecie la buena gastronomía local.',
    author: 'Elena R.',
  },
  {
    rating: 5,
    date: '2 de Septiembre, 2023',
    text: 'Llevo años comprando aceites de esta almazara y nunca defraudan. El aroma a hierba recién cortada al abrir la botella te traslada directamente al campo.',
    author: 'David S.',
  },
]

const relatedProducts = [
  {
    name: 'Vinagre Balsámico Artesanal',
    price: '€12.00',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA6Yyo5x3CDA-T9ps-KlsvXY3OPigCiGFsxvzegHq7z1WrZgjBn0jPHzVA1Kh4Ke91vH7N59KiyvOCIemPFV_Svb1zz0L5KLRnpzNOybDjRSahzEFsb9LLyMBT4pLpj3WftD5cD_7Tr2qMf91KFTuLjdx8OylpiRlBIk4peSGdXLYMGZ4lnfT1HVuPhKlEUT0xuVufPX6STMt7yGrzqxY0Y7DJ0zOR4t5UGDrDWTysxS5nCuf62uGZtGR28sv0JUH8AUr7Cud6aS_MD',
  },
  {
    name: 'Paté de Oliva Negra (Olivada)',
    price: '€8.50',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAL5V5yXL4X2d2_swvuZAOiSr1upp9fKzLPnOYkDVyCzaKRfdfB0oRxIET0HRgxm1thmNzlbx2wiwEj_to0ddd4kLhErGbefns3POZxU1YZTKIiRM7uJ7h1zx_SSKsyT0ek_7WE2uz8BdihHgFWjfEahLvOvees4Z2GdmyEVnRdQsQfPRoNNzQxqc1B33JnmWsWXLqePiDbnfl_6j2JkEi-k6AcEfJvZ-LAcLzJ6yKTthgQs3DSwPvSVuy8Q4yiBpJ30x9Hfq1zvMAj',
  },
  {
    name: 'AOVE Cosecha Temprana - Lata 500ml',
    price: '€22.00',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAWi89hNX2VGzzkvcT8hGnxMfGvic0bM-zacZNJFYbjwQEVKxBLQKVdQpejvqHlVVnH8-OI0CYO-GnFQcNCMk3NoYP-ipLBrZwFCkggEM4IqEO-fxF-rIx138FP3AYtEmMOAZnzCyr4-BAIMacTf_VRWy2ZKjThtIrmChXhZOOrZ8XLLjTu7Y8MbAh5GNYfoSqMKwro7glXqZMxd22Xm0g0c2NVx222rbhIYf8Gephj-jhzY2Y6azlHnkWnMvQFoYeo88yMXMD2TsgJ',
  },
  {
    name: 'Olivas Verdes Ecológicas',
    price: '€6.90',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCgqRz8XSRcEnzTdYTS_uOmEiuL_34oHAB0nLuI13Z986_N2aXKS7hljkohvNUHIwZ286RN17Dd8bO5NnoJ6V7PKkblF_r6aTOJfMsrrpfTgi9Lt3Vwn4O4m2zw3LG69yrOHiFmhgnjcXlZbIB95WuIh9NyO0BrsxchwdpeemYTmmwvgQQZ4M3fib466AE_7faZ6n-deEV1a8ggfdKObrKGSvM11EVYkgPItRDWZfWpTZ5yTn5KJehzwKVYPuNY_L4m0PLRX8NuDjUV',
  },
]

export function DetalleProductoPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--color-surface)] text-[var(--color-on-surface)] selection:bg-[var(--color-primary-container)] selection:text-[var(--color-on-primary)]">
      <main className="mx-auto max-w-[var(--layout-container-max)] px-[var(--space-margin-mobile)] py-12 md:px-[var(--space-margin-desktop)] md:py-20">
        <Breadcrumbs />

        <section className="mb-24 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-24">
          <ProductGallery />
          <ProductInfo />
        </section>

        <hr className="my-20 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)]" />

        <ReviewsSection />
        <RelatedProductsSection />
      </main>

      <ProductTemporaryFooter />
    </div>
  )
}

function Breadcrumbs() {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="text-label-sm flex flex-wrap items-center gap-2 text-[var(--color-secondary)]">
        <li>
          <Link to="/productos" className="transition-colors hover:text-[var(--color-primary)]">
            Catálogo
          </Link>
        </li>
        <li>
          <ChevronRight size={14} strokeWidth={1.8} />
        </li>
        <li>
          <a href="#" className="transition-colors hover:text-[var(--color-primary)]">
            Aceites
          </a>
        </li>
        <li>
          <ChevronRight size={14} strokeWidth={1.8} />
        </li>
        <li aria-current="page" className="text-[var(--color-on-surface)]">
          {product.name}
        </li>
      </ol>
    </nav>
  )
}

function ProductGallery() {
  return (
    <div className="col-span-1 flex flex-col gap-[var(--space-unit)] lg:col-span-6">
      <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] bg-[var(--color-surface-container-low)]">
        <img
          src={product.mainImage}
          alt={product.name}
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-[var(--space-unit)]">
        {product.thumbnails.map((thumbnail, index) => (
          <button
            key={thumbnail}
            type="button"
            className={`aspect-square overflow-hidden rounded-[var(--radius-default)] border transition-opacity focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none ${
              index === 1
                ? 'border-[var(--color-primary)] opacity-100'
                : 'border-[color-mix(in_srgb,var(--color-outline)_20%,transparent)] opacity-60 hover:opacity-100'
            }`}
          >
            <img src={thumbnail} alt={`Vista ${index + 1} de ${product.name}`} className="size-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

function ProductInfo() {
  return (
    <div className="col-span-1 flex flex-col lg:col-span-6">
      <div className="mb-8 border-b border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] pb-8">
        <span className="text-label-md mb-2 block uppercase tracking-wider text-[var(--color-secondary)]">{product.category}</span>
        <h1 className="text-display-lg mb-4 leading-tight text-[var(--color-on-surface)]">{product.name}</h1>
        <div className="mb-6 flex items-center gap-4">
          <Rating value={4} half />
          <a href="#reviews" className="text-label-sm text-[var(--color-secondary)] underline underline-offset-4 transition-colors hover:text-[var(--color-primary)]">
            {product.rating} ({product.reviews} valoraciones)
          </a>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-headline-lg text-[var(--color-primary)]">{product.price}</span>
          <span className="text-label-sm rounded-[var(--radius-default)] border border-[color-mix(in_srgb,var(--color-secondary-fixed)_50%,transparent)] bg-[var(--color-secondary-container)] px-3 py-1 text-[var(--color-on-secondary-container)]">
            {product.status}
          </span>
        </div>
      </div>

      <div className="mb-10 flex flex-col gap-6">
        <div className="flex items-center gap-6">
          <div className="flex h-12 w-32 items-center border border-[color-mix(in_srgb,var(--color-outline)_30%,transparent)] rounded-[var(--radius-default)]">
            <button type="button" aria-label="Disminuir cantidad" className="flex flex-1 items-center justify-center text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary)]">
              <Minus size={18} strokeWidth={1.8} />
            </button>
            <span className="text-label-md w-8 text-center text-[var(--color-on-surface)]">1</span>
            <button type="button" aria-label="Aumentar cantidad" className="flex flex-1 items-center justify-center text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary)]">
              <Plus size={18} strokeWidth={1.8} />
            </button>
          </div>
          <button
            type="button"
            className="text-label-md flex h-12 flex-1 items-center justify-center gap-2 rounded-[var(--radius-default)] bg-[var(--color-primary-container)] px-6 py-3 text-[var(--color-on-primary)] transition-colors duration-200 hover:bg-[var(--color-primary)]"
          >
            <ShoppingBag size={20} strokeWidth={1.8} />
            Añadir al carrito
          </button>
        </div>
      </div>

      <div className="group mb-8 rounded-[var(--radius-default)] border border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] bg-[var(--color-surface-container-low)] p-6 transition-colors hover:bg-[var(--color-surface-container)]">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-label-sm mb-1 block text-[var(--color-secondary)]">PRODUCIDO POR</span>
            <Link to={product.producerPath} className="text-headline-md text-[var(--color-on-surface)] transition-colors group-hover:text-[var(--color-primary)]">
              {product.producer}
            </Link>
          </div>
          <Link to={product.producerPath} aria-label="Ver perfil del productor" className="flex size-10 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-outline)_20%,transparent)] text-[var(--color-secondary)] transition-colors group-hover:border-[var(--color-primary)] group-hover:text-[var(--color-primary)]">
            <ArrowRight size={18} strokeWidth={1.8} />
          </Link>
        </div>
      </div>

      <div className="mb-10 rounded-[var(--radius-default)] border border-[#b7a98f]/50 bg-[color-mix(in_srgb,var(--color-secondary-fixed)_30%,transparent)] p-6">
        <h2 className="text-label-md mb-2 flex items-center gap-2 text-[var(--color-on-surface)]">
          <Info size={18} strokeWidth={1.8} />
          Información Nutricional y Alérgenos
        </h2>
        <p className="text-body-md leading-relaxed text-[var(--color-secondary)]">
          <span className="font-medium text-[var(--color-on-surface)]">Ingredientes:</span> Aceitunas picual y arbequina.
          <br />
          <span className="font-medium text-[var(--color-on-surface)]">Alérgenos:</span> Sin alérgenos declarados
          (Reglamento UE 1169/2011).
        </p>
      </div>

      <div className="space-y-4 text-[var(--color-secondary)]">
        {product.description.map((paragraph) => (
          <p key={paragraph} className="text-body-md leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  )
}

function ReviewsSection() {
  return (
    <section className="mx-auto mb-24 max-w-4xl" id="reviews">
      <h2 className="text-headline-lg mb-12 text-center text-[var(--color-on-surface)]">Valoraciones de la comunidad</h2>
      <div className="space-y-12">
        {reviews.map((review, index) => (
          <article
            key={`${review.author}-${review.date}`}
            className={`pb-8 ${index < reviews.length - 1 ? 'border-b border-[color-mix(in_srgb,var(--color-outline-variant)_20%,transparent)]' : ''}`}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <Rating value={review.rating} />
              <span className="text-label-sm text-[var(--color-secondary)]">{review.date}</span>
            </div>
            <p className="text-body-lg mb-4 text-[var(--color-on-surface)]">“{review.text}”</p>
            <p className="text-label-md text-[var(--color-secondary)]">— {review.author}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button type="button" className="text-label-md rounded-[var(--radius-default)] border border-[color-mix(in_srgb,var(--color-outline)_30%,transparent)] px-6 py-3 text-[var(--color-primary)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-container-low)]">
          Leer más valoraciones
        </button>
      </div>
    </section>
  )
}

function RelatedProductsSection() {
  return (
    <section className="mb-20">
      <div className="mb-10 flex items-end justify-between gap-4">
        <h2 className="text-headline-lg text-[var(--color-on-surface)]">Más de este productor</h2>
        <div className="flex gap-2">
          <button type="button" aria-label="Productos anteriores" className="flex size-10 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-outline)_30%,transparent)] text-[var(--color-secondary)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]">
            <ArrowLeft size={18} strokeWidth={1.8} />
          </button>
          <button type="button" aria-label="Productos siguientes" className="flex size-10 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-outline)_30%,transparent)] text-[var(--color-secondary)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]">
            <ArrowRight size={18} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {relatedProducts.map((related) => (
          <a key={related.name} href="#" className="group flex flex-col gap-4">
            <div className="aspect-[4/5] overflow-hidden rounded-[var(--radius-default)] border border-[color-mix(in_srgb,var(--color-outline-variant)_20%,transparent)] bg-[var(--color-surface-container-low)]">
              <img src={related.imageUrl} alt={related.name} className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
            </div>
            <div>
              <h3 className="text-headline-md mb-1 text-[18px] leading-tight text-[var(--color-on-surface)] transition-colors group-hover:text-[var(--color-primary)]">
                {related.name}
              </h3>
              <p className="text-label-md text-[var(--color-secondary)]">{related.price}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

function ProductTemporaryFooter() {
  return (
    <footer className="mt-20 w-full border-t border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] bg-[var(--color-surface-container-low)]">
      <div className="mx-auto flex max-w-[var(--layout-container-max)] flex-col items-center gap-[var(--space-unit)] px-[var(--space-margin-mobile)] py-[var(--space-margin-desktop)] md:px-[var(--space-margin-desktop)]">
        <h2 className="text-headline-md mb-6 text-[var(--color-primary)]">ALACANT ARTISÀ</h2>
        <ul className="mb-8 flex flex-wrap justify-center gap-x-8 gap-y-4">
          {['Provenance', 'Shipping', 'Privacy', 'Terms', 'Contact'].map((item) => (
            <li key={item}>
              <a href="#" className="text-label-sm text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary)]">
                {item}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-body-md text-center text-[var(--color-secondary)]">
          © 2024 Alacant Artisà. Cultivating excellence in the Mediterranean.
        </p>
      </div>
    </footer>
  )
}

function Rating({ value, half = false }: { value: number; half?: boolean }) {
  return (
    <div className="flex items-center text-[var(--color-primary-container)]" aria-label={`${value} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={18}
          strokeWidth={1.6}
          fill={index < value || (half && index === 4) ? 'currentColor' : 'transparent'}
          className={half && index === 4 ? 'opacity-55' : ''}
        />
      ))}
    </div>
  )
}
