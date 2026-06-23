import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { ChevronDown, ChevronLeft, ChevronRight, RefreshCcw, Search } from 'lucide-react'

type PublicationStatus = 'Publicada' | 'Reportada' | 'Retirada'

type Publication = {
  id: string
  name: string
  sku: string
  producer: string
  category: string
  date: string
  status: PublicationStatus
  imageUrl: string
}

// ---------------------------------------------------------------------------
// Mock data — 10 publicaciones
// ---------------------------------------------------------------------------

const PUBLICACIONES_INICIALES: Publication[] = [
  {
    id: 'aove-fo-001',
    name: 'Aceite de Oliva Virgen Extra',
    sku: 'AOVE-FO-001',
    producer: 'Finca El Olivar',
    category: 'Aceites',
    date: '12 Oct 2023',
    status: 'Publicada',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDY9j4yoNQwBnoSfK4ZAvTGGkpnWOgcCezjJOZrcUAFlcq9NSiWa_CEwhtgZcN8JjWNL6i_UHc2mG0QCx4VcUPzoDzmdYNEg4VRExz01zY0Pjui6GtomiZRSCgcJ89GltBWFsv7HQFRmeKzicN4D9SLEhnR4PjYZDkxquDrKuhysvqJWdereJQbOiV4uTZYg8XL8aJjHbrKIxxcERppAq9xfl1abAJ6cixQTnbd4WotxAumqx7I9oZoKTfQTY23aPwRZ2iP4DBNxwjS',
  },
  {
    id: 'qcc-lv-042',
    name: 'Queso de Cabra Curado',
    sku: 'QCC-LV-042',
    producer: 'Lácteos del Valle',
    category: 'Quesos',
    date: '10 Oct 2023',
    status: 'Reportada',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDIleSega-zuW9bGGr3B7cPbD4-26onSzevFJyu6hjbb7sfpJYc3DmnqypWec_4P0XvWWkoP-zSnmQJpWgGsWv0IJBel00rGBxk4UnGcOYra61wgNg4VKIfip8k13CSZ1k2Vc4vEd-X1US6wtBNMXwZlS83PjK_W1Ee2ob3sDZwxWmzsA6D8h3-kSOuSZXy80Ie3ZnKiV5XodVKbck63hoVTDUVW4gaA-_uW4WsENhTmCkCUxmAXCqnkXo5qlrjP-OJR1xQKopKRm21',
  },
  {
    id: 'vtr-bs-099',
    name: 'Vino Tinto Reserva',
    sku: 'VTR-BS-099',
    producer: 'Bodegas del Sol',
    category: 'Vinos',
    date: '05 Oct 2023',
    status: 'Retirada',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCGW3xRQGevsJfcYm3-lVXStEm5EqWU3y6koaGUCXx2-fNTgwI4mgaaOQl-8lBmGP31_IYYEDXSGJACrWBEoT6sKfpGjWuVy6LDuVlu5Hj5fj0Xc_wWRCXfnWxMAuZLlGO4ncpff9f3mn-osz4QsB2a1s1L2XOMLcE77Va0KGxFBOs1yBul1tpQrfzUtlnYHkKJdpf3Eyef-ckBbKl9e24R2QY7sBAM0EzwbiyIQ55F4qi_95-8jfTGLffPlaqU0UWo6GZmMNgOLSTg',
  },
  {
    id: 'maz-mg-007',
    name: 'Miel de Azahar Pura',
    sku: 'MAZ-MG-007',
    producer: 'Miel de Guadalest',
    category: 'Mieles',
    date: '02 Oct 2023',
    status: 'Publicada',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCSRCnzM4wMsBxQhB3hSRoHyVo7GTLZlDJYkKHdu1h8IbV0x8rI204EQ6h5stFSb6jlcUqFtVgT4YPzqn-Wyon9jBqD2NNPP5LmPSn3clySsW3i_Ytwxi2h2_Df9Ru-VVt6uX32BRAeVb7-ToT4IwZjflXBTCIB0w4Frk5eVN79ctWEPW601eQ8itoMFffDYcvUgPVhaZ1-zW2DCQj5aoqDw1S1UuaTFiwde-jZoXCOZwnHLXU',
  },
  {
    id: 'tal-da-031',
    name: 'Turrón de Almendra',
    sku: 'TAL-DA-031',
    producer: 'Dulces Artesanos',
    category: 'Dulces',
    date: '30 Sep 2023',
    status: 'Reportada',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBa3xANjK2EgB5yaNlw8gcPw-pY3zqpXxN9K59so5M-jXlpVsxulQD69-4SCqagHHU3k9WB4AlzLtXU9d_bWaym7koFMKvn3g4jo8cdXrXRK_bwdPDy5wXx0P7jIjFD1TfbA369Wv8Q_FK3hB0QHkiQ4DAc-2vxft4twZMKErAzLEG5JFf2wgZJbtgF3-Ti9qY49J2zsL1pDPE0F0NSrHyECC9sWFCX-Ex7p6fUKF8Ipan4Bk03Xhr1-dYZ4maLmxgjlOAMzv0nE2o',
  },
  {
    id: 'sob-es-019',
    name: 'Sobrasada Artesana',
    sku: 'SOB-ES-019',
    producer: 'Embutidos de la Sierra',
    category: 'Embutidos',
    date: '25 Sep 2023',
    status: 'Publicada',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBYs77QFQGe7CrEcNnV0iD57RGRXVyM75KeB4DGFhakPUZs2LXS4sy-Hb8oAD8WBFMj3LFFnEukuUThn7pPLkGGSCjxioW9bNyyZbX5JWBOMDouZEKlh23d8ZpQSEIsoCwO9AMiywNMIF9jx-Kzx41dTLzf9Wm_BSwQ1D4NG_2F10G7uFO3Ht9OHQFbRoXV_4LmcGRzZH4olU35glgGUsDgykQzdmzHKk67NEYWR_iie2XBsftEfCtpME',
  },
  {
    id: 'vbc-vm-055',
    name: 'Vino Blanco Chardonnay',
    sku: 'VBC-VM-055',
    producer: 'Vinos El Mediterráneo',
    category: 'Vinos',
    date: '20 Sep 2023',
    status: 'Publicada',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDCzc7FxIB6146OgThQLqG_S8TF4n3EmfBxBj9kkHTI5gvbR8i4-ubUEnKLUfrhYWCCtUzdrTOTsj8sH3PV9CUu3JbCqPv-titRJAAa7oLWfREenQO02q857nvca9gWAqe1xIrqNDVf1AkOLzYCrncQnzVfd-z9jpWBMHIFQndjRIykt433NlEipYEUzuzZ1DfJEjQJke4O3RS6_u9E4DjpCVzUVLVhr4nUZJFTWiV47Da0XesK27Msd9AphLA0mnZgA4yvX2Dk2vk',
  },
  {
    id: 'mna-ch-008',
    name: 'Mermelada de Naranja',
    sku: 'MNA-CH-008',
    producer: 'Conservas del Huerto',
    category: 'Conservas',
    date: '15 Sep 2023',
    status: 'Publicada',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuClWartENzQpyYqJqC8C4CvjIiFaKAyZP8yX1LEAVF7YfPqWK3nOXErjiWhtizxf-lyP1uoUoMfZUE3arRlSWZ6qI-Xkt4aAAxLjLEsDE10Doa5JaG507RT_rtIbU9KbleQecy5AT5L4iwCL1t8eme21sfM4I60yTk6B0YnZoaprunc9Mk5o0djAiGVqudXiCiYihnUUFD2i667ajuXszCDMyWIAWwqoiIkmvfB8ZdKsBNWs6Mz3Q5oCA-XNfOIObhgzaQ29epkSIc',
  },
  {
    id: 'alt-fo-022',
    name: 'Almendras Tostadas',
    sku: 'ALT-FO-022',
    producer: 'Finca Los Olivos',
    category: 'Frutos Secos',
    date: '10 Sep 2023',
    status: 'Retirada',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC1bOu_zOWwTGLS4PhTTQTYYnJk9xAAGe-3FxShYcVG6zxBDq6yKZq5d7YYzbsd5A83FvIiwU-8BUnq5Nxj15fA6kARpABFqdDcRWcDAygwTz8NeF3bDKHeCBrfgetMLa1UsmR8cmTuBZsFZ_ZPG79eDLXDDNCD6JXwjdIeajtS3OYQAwteEszio_ukRGOgY3qKec8IiNA5aBFwtJZKVTNIpbLcs-D3wFzQ2u2K3NCsRTuhd90z8TfpeJAtG0Vm2wvqrxxVcnWV3qk',
  },
  {
    id: 'aoe-ab-003',
    name: 'Aceite de Oliva Ecológico',
    sku: 'AOE-AB-003',
    producer: 'Aceites Benitatxell',
    category: 'Aceites',
    date: '05 Sep 2023',
    status: 'Reportada',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDy32c0G8lwPWLpv0NTciYEBJSrXDfM2jBt3PET5HklkZCqX-oAe40beY-ABTEgcBEaedthUImcxrU0X2L6cwhfnZGnfYL9_ileCXn9eO8D5q7aSZbDKse5LzYsPAHJfJ7NLki3ItaKoiBiFDdStVL4GQCFT7ziLEtOO3HAl7qJPt61TKHZm-TP2tjK9R2mAHFaZRGJFfYx5Ed36fgEskkyLRASGKpqFY7N2fDPh7d55d6rVCr-GDshS8EpdST_hswbKOu8pEG71Dg',
  },
]

const CATEGORIAS = ['Todas', 'Aceites', 'Quesos', 'Vinos', 'Mieles', 'Dulces', 'Embutidos', 'Conservas', 'Frutos Secos']
const PRODUCTORES = [
  'Todos',
  'Aceites Benitatxell',
  'Bodegas del Sol',
  'Conservas del Huerto',
  'Dulces Artesanos',
  'Embutidos de la Sierra',
  'Finca El Olivar',
  'Finca Los Olivos',
  'Lácteos del Valle',
  'Miel de Guadalest',
  'Vinos El Mediterráneo',
]

const POR_PAGINA = 6

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function ModeracionContenidoAdminPage() {
  const [searchParams] = useSearchParams()

  // Filters — pre-fill ?q= param (comes from user detail drawer)
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [filtroCategoria, setFiltroCategoria] = useState('Todas')
  const [filtroProductor, setFiltroProductor] = useState('Todos')
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [pagina, setPagina] = useState(1)

  // Derived filtered list
  const filtrados = PUBLICACIONES_INICIALES.filter((p) => {
    const q = query.toLowerCase()
    const matchQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.producer.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    const matchCat = filtroCategoria === 'Todas' || p.category === filtroCategoria
    const matchProd = filtroProductor === 'Todos' || p.producer === filtroProductor
    const matchEst = filtroEstado === 'Todos' || p.status === filtroEstado
    return matchQuery && matchCat && matchProd && matchEst
  })

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA))
  const inicio = (pagina - 1) * POR_PAGINA
  const paginados = filtrados.slice(inicio, inicio + POR_PAGINA)

  function onFilter<T>(setter: (v: T) => void, value: T) {
    setter(value)
    setPagina(1)
  }

  function resetFiltros() {
    setQuery('')
    setFiltroCategoria('Todas')
    setFiltroProductor('Todos')
    setFiltroEstado('Todos')
    setPagina(1)
  }

  return (
    <div className="mx-[var(--space-margin-mobile)] max-w-[var(--layout-container-max)] md:mx-0">
      <header className="mb-12">
        <h1 className="text-headline-lg mb-4 text-[var(--color-on-surface)]">
          Moderación de contenido
        </h1>
        <p className="text-body-lg max-w-3xl text-[var(--color-secondary)]">
          Revisa y gestiona las publicaciones de productos para asegurar el cumplimiento de las normas.
        </p>
      </header>

      {/* Filters */}
      <section className="mb-10 flex flex-col gap-6" aria-label="Filtros de publicaciones">
        <div className="flex flex-col items-end gap-6 md:flex-row">
          {/* Search */}
          <label className="relative w-full md:flex-1">
            <span className="sr-only">Buscar</span>
            <Search
              size={20}
              strokeWidth={1.8}
              className="absolute top-1/2 left-0 -translate-y-1/2 text-[var(--color-secondary)]"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => onFilter(setQuery, e.target.value)}
              placeholder="Buscar por producto, productor o SKU..."
              className="text-body-md w-full border-0 border-b border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-transparent py-2 pr-4 pl-8 text-[var(--color-on-surface)] transition-colors placeholder:text-[var(--color-secondary)] focus:border-[var(--color-on-surface)] focus:outline-none"
            />
          </label>

          {/* Selects */}
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3 md:w-auto">
            <FilterSelect
              label="Categoría"
              value={filtroCategoria}
              options={CATEGORIAS}
              onChange={(v) => onFilter(setFiltroCategoria, v)}
            />
            <FilterSelect
              label="Productor"
              value={filtroProductor}
              options={PRODUCTORES}
              onChange={(v) => onFilter(setFiltroProductor, v)}
            />
            <FilterSelect
              label="Estado"
              value={filtroEstado}
              options={['Todos', 'Publicada', 'Reportada', 'Retirada']}
              onChange={(v) => onFilter(setFiltroEstado, v)}
            />
          </div>

          {/* Reset */}
          <button
            type="button"
            onClick={resetFiltros}
            className="text-label-md flex shrink-0 items-center gap-2 px-1 py-2 uppercase text-[var(--color-outline)] transition-colors hover:text-[var(--color-on-surface)]"
          >
            <RefreshCcw size={15} strokeWidth={1.9} />
            Restablecer
          </button>
        </div>
      </section>

      {/* Table */}
      <section className="overflow-x-auto" aria-label="Listado de publicaciones en moderación">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[color-mix(in_srgb,var(--color-on-surface)_15%,transparent)]">
              <TableHead className="w-2/5">Producto</TableHead>
              <TableHead>Productor</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="pr-4 text-right">Acciones</TableHead>
            </tr>
          </thead>
          <tbody className="text-body-md text-[var(--color-on-surface)]">
            {paginados.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-body-md px-4 py-16 text-center text-[var(--color-outline)]"
                >
                  No se encontraron publicaciones con los filtros aplicados.
                </td>
              </tr>
            ) : (
              paginados.map((publication) => (
                <PublicationRow key={publication.id} publication={publication} />
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* Pagination */}
      <footer className="mt-8 flex flex-col items-end justify-end gap-4 border-t border-[var(--color-outline-variant)] pt-6 md:flex-row md:items-center">
        <span className="text-label-md text-sm text-[var(--color-secondary)]">
          {filtrados.length === 0
            ? 'Sin resultados'
            : `Mostrando ${inicio + 1}–${Math.min(inicio + POR_PAGINA, filtrados.length)} de ${filtrados.length} publicaciones`}
        </span>
        <div className="flex gap-2">
          <PaginationButton
            icon={ChevronLeft}
            label="Página anterior"
            disabled={pagina === 1}
            onClick={() => setPagina((p) => p - 1)}
          />
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              aria-current={p === pagina ? 'page' : undefined}
              onClick={() => setPagina(p)}
              className={`grid size-8 place-items-center border text-sm transition-colors ${
                p === pagina
                  ? 'border-[var(--color-on-surface)] bg-[var(--color-on-surface)] text-[var(--color-on-primary)]'
                  : 'border-[var(--color-outline-variant)] text-[var(--color-secondary)] hover:border-[var(--color-on-surface)] hover:text-[var(--color-on-surface)]'
              }`}
            >
              {p}
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
  )
}

// ---------------------------------------------------------------------------
// PublicationRow
// ---------------------------------------------------------------------------

function PublicationRow({ publication }: { publication: Publication }) {
  return (
    <tr className="border-b border-[color-mix(in_srgb,var(--color-on-surface)_10%,transparent)] transition-colors last:border-b-0 hover:bg-[color-mix(in_srgb,var(--color-surface-container-lowest)_50%,transparent)]">
      <td className="py-6 align-middle">
        <div className="flex items-center gap-4">
          <img
            src={publication.imageUrl}
            alt={publication.name}
            className="size-16 rounded-[var(--radius-sm)] bg-[var(--color-surface-dim)] object-cover"
          />
          <div>
            <p className="font-editorial text-lg text-[var(--color-on-surface)]">
              {publication.name}
            </p>
            <p className="mt-1 font-mono text-xs text-[var(--color-secondary)]">
              SKU: {publication.sku}
            </p>
          </div>
        </div>
      </td>
      <td className="py-6 text-[var(--color-secondary)]">{publication.producer}</td>
      <td className="py-6">
        <span className="rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--color-secondary-container)_35%,transparent)] px-2 py-1 text-xs text-[var(--color-on-secondary-container)]">
          {publication.category}
        </span>
      </td>
      <td className="py-6 text-sm text-[var(--color-secondary)]">{publication.date}</td>
      <td className="py-6">
        <StatusBadge status={publication.status} />
      </td>
      <td className="py-6 pr-4 text-right">
        <Link
          to={`/admin/moderacion/${publication.id}`}
          className="text-label-md inline-flex border border-[var(--color-primary-container)] px-4 py-2 text-[var(--color-primary-container)] transition-colors hover:bg-[var(--color-primary-container)] hover:text-[var(--color-on-primary)]"
        >
          Revisar
        </Link>
      </td>
    </tr>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

type FilterSelectProps = {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <label className="block">
      <span className="text-label-md mb-2 block text-[var(--color-on-surface)]">{label}</span>
      <span className="relative block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-body-md w-full cursor-pointer appearance-none border-0 border-b border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-transparent py-2 pr-8 pl-0 text-[var(--color-on-surface)] transition-colors focus:border-[var(--color-on-surface)] focus:outline-none"
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <ChevronDown
          size={20}
          strokeWidth={1.8}
          className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 text-[var(--color-on-surface)]"
        />
      </span>
    </label>
  )
}

type TableHeadProps = {
  children: string
  className?: string
}

function TableHead({ children, className = '' }: TableHeadProps) {
  return (
    <th
      className={`text-label-md pb-3 text-xs uppercase tracking-widest text-[var(--color-secondary)] ${className}`}
    >
      {children}
    </th>
  )
}

function StatusBadge({ status }: { status: PublicationStatus }) {
  const className = {
    Publicada: 'bg-[#e8f5e9] text-[#2e7d32]',
    Reportada: 'bg-[#f8bbd0] text-[#880e4f]',
    Retirada: 'bg-[#ffebee] text-[#c62828]',
  }[status]

  return (
    <span className={`text-label-sm inline-flex rounded-full px-3 py-1 ${className}`}>
      {status}
    </span>
  )
}

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
      className="grid size-8 place-items-center border border-[var(--color-outline-variant)] text-[var(--color-secondary)] transition-colors hover:border-[var(--color-on-surface)] hover:text-[var(--color-on-surface)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {Icon ? <Icon size={16} strokeWidth={1.8} /> : label}
    </button>
  )
}
