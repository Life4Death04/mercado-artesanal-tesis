import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, Mail, MapPin, Phone } from 'lucide-react'
import { ConsumerProductCard, type ConsumerCatalogCardProduct } from '../../productos/componentes/ConsumerProductCard'

const producerProfile = {
  name: 'Finca Alicante',
  location: 'Denia, Alicante',
  email: 'info@fincaalicante.es',
  phone: '+34 965 123 456',
  story:
    'Nuestra herencia se cultiva en las laderas de Denia, donde el aire del Mediterráneo y los suelos calcáreos dan vida a productos de una pureza excepcional. Seguimos procesos ancestrales de recolección manual para garantizar que cada botella de aceite y cada racimo de uva capture la esencia misma de nuestra tierra.',
  coverImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDsKItCbKarmNtU4QmSr1L4gl0bW3gbUoZeZFU6XwTn9RU736jGyfxDjqcWzJJgTuP0zJYjBZOqpszZfgywxBaCXnkv9cRKtrGxMZ_baT_R9u6YfQAkVC1eNKS2YhR1yvVcOvdbJoyNSwSnuTBdi7lsCpDF785KUmOKFnNvMQJLUPp2hnlVkhEpL8ypyvd6dCxI1tKthoiYu44rnDLMM0OcXjdgGUKN2Dh9T4WQhyWWCW4Gyva60nuQCVuvyG7PZNXW3vi9_qjqRO8',
  logoImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAWWrkIzeok3Tp4CIELd0KwSmSIjsiZ-Vaf7G9rJgzOBWSgX6TEkHMBs7VFobCVMs0z4s5X5-zMMCAitHC19RImSILjyC5AcMirwfYNa3a4w8yna2N54_rUQBLuCzDPEVINFcBgGDvAL8XsWG59fVZ29xHDC5xd_bVX28IgpVJ5dnPSDEqdQuP6JLTpR6MAj37e8BpBjp4F5YquuRf3BQR3xlox05YTRHF1ZGHyEmTEve_0vDuprdaBv6Klum7wbdTxA6FnnXEVUQ8',
}

const catalogProducts: ConsumerCatalogCardProduct[] = [
  {
    id: 'aceite-oliva-arbequina',
    name: 'Aceite de Oliva Arbequina',
    category: 'Aceites',
    producer: 'Finca Alicante',
    origin: 'Denia',
    price: '24,50 €',
    stock: 'En stock',
    rating: 5,
    reviews: 21,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDy32c0G8lwPWLpv0NTciYEBJSrXDfM2jBt3PET5HklkZCqX-oAe40beY-ABTEgcBEaedthUImcxrU0X2L6cwhfnZGnfYL9_ileCXn9eO8D5q7aSZbDKse5LzYsPAHJfJ7NLki3ItaKoiBiFDdStVL4GQCFT7ziLEtOO3HAl7qJPt61TKHZm-TP2tjK9R2mAHFaZRGJFfYx5Ed36fgEskkyLRASGKpqFY7N2fDPh7d55d6rVCr-GDshS8EpdST_hswbKOu8pEG71Dg',
  },
  {
    id: 'vino-monastrell-reserva',
    name: 'Vino Monastrell Reserva',
    category: 'Vinos',
    producer: 'Finca Alicante',
    origin: 'Denia',
    price: '18,00 €',
    stock: 'En stock',
    rating: 4,
    reviews: 17,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDCzc7FxIB6146OgThQLqG_S8TF4n3EmfBxBj9kkHTI5gvbR8i4-ubUEnKLUfrhYWCCtUzdrTOTsj8sH3PV9CUu3JbCqPv-titRJAAa7oLWfREenQO02q857nvca9gWAqe1xIrqNDVf1AkOLzYCrncQnzVfd-z9jpWBMHIFQndjRIykt433NlEipYEUzuzZ1DfJEjQJke4O3RS6_u9E4DjpCVzUVLVhr4nUZJFTWiV47Da0XesK27Msd9AphLA0mnZgA4yvX2Dk2vk',
  },
  {
    id: 'queso-cabra-curado',
    name: 'Queso de Cabra Curado',
    category: 'Quesos',
    producer: 'Finca Alicante',
    origin: 'Denia',
    price: '12,90 €',
    stock: 'En stock',
    rating: 5,
    reviews: 11,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAFwhpvbfi4zDIedRSBjzBdkYccqdYlZwpgfR75MssAHru0YOyVvC2917fRstOOib57zwUxdgG7qyx3tX6gtDfiIBOP8RqKziYq1gwIvJqgiR3MC4NxXXV1kWAFLuA-fhpzTRHEteP4_0L0NsLba8eoyMuTTwF2NGgCTPEo-XYRHve9y6KmrA_M501yANXh_hVis0lezu-bcsR0Iobpmb5u6XoNLOZsD0WkOARpI0i6BUZMrB197_UjHL0Y7ta77g2VnsXn38Eweig',
  },
  {
    id: 'miel-azahar-pura',
    name: 'Miel de Azahar Pura',
    category: 'Miel',
    producer: 'Finca Alicante',
    origin: 'Guadalest',
    price: '9,50 €',
    stock: 'En stock',
    rating: 4,
    reviews: 14,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCSRCnzM4wMsBxQhB3hSRoHyVo7GTLZlDJYkKHdu1h8IbV0x8rI204EQ6h5stFSb6jlcUqFtVgT4YPzqn-Wyon9jBqD2NNPP5LmPSn3clySsW3i_Ytwxi2h2_Df9Ru-VVt6uX32BRAeVb7-ToT4IwZjflXBTCIB0w4Frk5eVN79ctWEPW601eQ8itoMFffDYcvUgPVhaZ1-zW2DCQj5aoqDw1S1UuaTFCZbj7wIU121yUKORz8NZHaKlch8pY0Zjl-wtSDnQfUyEL0',
  },
  {
    id: 'mermelada-higos-romero',
    name: 'Mermelada de Higos al Romero',
    category: 'Conservas',
    producer: 'Finca Alicante',
    origin: 'Denia',
    price: '7,80 €',
    stock: 'En stock',
    rating: 4,
    reviews: 10,
    imageUrl: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'sal-mediterranea-especiada',
    name: 'Sal Mediterránea Especiada',
    category: 'Despensa',
    producer: 'Finca Alicante',
    origin: 'Denia',
    price: '5,40 €',
    stock: 'En stock',
    rating: 5,
    reviews: 8,
    imageUrl: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'aceitunas-partidas-caseras',
    name: 'Aceitunas Partidas Caseras',
    category: 'Aceites',
    producer: 'Finca Alicante',
    origin: 'Denia',
    price: '6,20 €',
    stock: 'En stock',
    rating: 4,
    reviews: 13,
    imageUrl: 'https://images.unsplash.com/photo-1615485925873-6a8f8e951f10?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'vinagre-jerez-reserva',
    name: 'Vinagre de Jerez Reserva',
    category: 'Despensa',
    producer: 'Finca Alicante',
    origin: 'Denia',
    price: '11,90 €',
    stock: 'En stock',
    rating: 5,
    reviews: 9,
    imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'pack-degustacion-mediterraneo',
    name: 'Pack Degustación Mediterráneo',
    category: 'Regalos',
    producer: 'Finca Alicante',
    origin: 'Denia',
    price: '32,00 €',
    stock: 'En stock',
    rating: 5,
    reviews: 16,
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'paté-tomate-seco-almendra',
    name: 'Paté de Tomate Seco y Almendra',
    category: 'Conservas',
    producer: 'Finca Alicante',
    origin: 'Denia',
    price: '8,40 €',
    stock: 'En stock',
    rating: 4,
    reviews: 12,
    imageUrl: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=900&q=80',
  },
]

const previewLimit = 4
const expandedPageSize = 8

export function PerfilProductorPublicoPage() {
  const [expandedCatalog, setExpandedCatalog] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(catalogProducts.length / expandedPageSize))
  const paginatedProducts = catalogProducts.slice((currentPage - 1) * expandedPageSize, currentPage * expandedPageSize)
  const visibleProducts = expandedCatalog ? paginatedProducts : catalogProducts.slice(0, previewLimit)

  function toggleExpandedCatalog() {
    setExpandedCatalog((current) => !current)
    setCurrentPage(1)
  }

  return (
    <main className="min-h-screen bg-[var(--color-surface)] px-[var(--space-margin-mobile)] py-10 text-[var(--color-on-surface)] md:px-[var(--space-margin-desktop)] md:py-16">
      <section className="mx-auto max-w-[var(--layout-container-max)]">
        <Link to="/productos" className="text-label-md mb-8 inline-flex items-center gap-2 text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary)]">
          <ArrowLeft size={16} strokeWidth={1.8} />
          Volver al catálogo
        </Link>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-label-sm mb-2 uppercase tracking-[0.18em] text-[var(--color-secondary)]">Perfil del productor</p>
            <h1 className="text-headline-md text-[var(--color-primary)]">Vista pública de la tienda</h1>
            <p className="text-body-md mt-2 max-w-2xl text-[var(--color-secondary)]">
              Así es como los clientes ven la marca y el catálogo dentro del mercado artesanal de Alicante.
            </p>
          </div>
        </div>

        <article className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)] bg-white shadow-[var(--shadow-editorial)]">
          <div className="relative h-64 w-full md:h-80">
            <img src={producerProfile.coverImage} alt="Olivares soleados en las montañas de Denia, Alicante" className="size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            <div className="absolute -bottom-16 left-6 size-32 rounded-full bg-white p-1 shadow-md md:left-12">
              <div className="flex size-full items-center justify-center overflow-hidden rounded-full border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)]">
                <img src={producerProfile.logoImage} alt={`Logotipo de ${producerProfile.name}`} className="size-full object-cover" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 px-6 pt-24 pb-10 md:px-12 md:pb-12 lg:grid-cols-12 lg:gap-[var(--space-gutter)]">
            <div className="lg:col-span-8">
              <h2 className="text-display-lg mb-4 text-[var(--color-primary)]">{producerProfile.name}</h2>
              <p className="text-body-lg max-w-3xl leading-relaxed text-[var(--color-on-surface)] italic">“{producerProfile.story}”</p>
            </div>

            <dl className="flex flex-col justify-center gap-4 border-t border-[var(--color-outline-variant)] pt-8 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-[var(--space-gutter)]">
              <ContactItem icon={<MapPin size={22} strokeWidth={1.7} />} label="Municipio" value={producerProfile.location} />
              <ContactItem icon={<Mail size={22} strokeWidth={1.7} />} label="Contacto público" value={producerProfile.email} />
              <ContactItem icon={<Phone size={22} strokeWidth={1.7} />} label="Teléfono" value={producerProfile.phone} />
            </dl>
          </div>
        </article>

        <section className="mt-16">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-headline-md text-[var(--color-tertiary)]">
                {expandedCatalog ? 'Catálogo completo del productor' : 'Vista previa del catálogo'}
              </h2>
              <p className="text-body-md mt-2 text-[var(--color-secondary)]">
                {expandedCatalog
                  ? `Mostrando ${visibleProducts.length} productos de la página ${currentPage} de ${totalPages}.`
                  : 'Explora una selección inicial de la tienda antes de desplegar el catálogo completo.'}
              </p>
            </div>
            <button
              type="button"
              onClick={toggleExpandedCatalog}
              className="text-label-md inline-flex w-fit items-center gap-2 border-b border-[var(--color-primary)] text-[var(--color-primary)] transition-opacity hover:opacity-70"
            >
              {expandedCatalog ? 'Mostrar vista previa' : 'Ver catálogo completo'}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-[var(--space-gutter)] sm:grid-cols-2 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <ConsumerProductCard key={product.id} product={product} />
            ))}
          </div>

          {expandedCatalog && totalPages > 1 ? (
            <nav className="mt-12 flex items-center justify-center gap-4" aria-label="Paginación catálogo productor">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="flex size-10 items-center justify-center rounded-[var(--radius-default)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={18} strokeWidth={1.8} />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`text-label-md grid size-10 place-items-center rounded-[var(--radius-default)] border transition-colors ${page === currentPage ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-on-primary)]' : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="flex size-10 items-center justify-center rounded-[var(--radius-default)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={18} strokeWidth={1.8} />
              </button>
            </nav>
          ) : null}
        </section>
      </section>
    </main>
  )
}

function ContactItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <dt className="mt-1 text-[var(--color-secondary)]">{icon}</dt>
      <dd>
        <p className="text-label-md text-[var(--color-secondary)]">{label}</p>
        <p className="text-body-md font-semibold text-[var(--color-on-surface)]">{value}</p>
      </dd>
    </div>
  )
}
