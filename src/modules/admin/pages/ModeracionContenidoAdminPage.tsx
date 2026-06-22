import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'

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

const publications: Publication[] = [
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
]

export function ModeracionContenidoAdminPage() {
  return (
    <div className="mx-[var(--space-margin-mobile)] max-w-[var(--layout-container-max)] md:mx-0">
      <header className="mb-12">
        <h1 className="text-headline-lg mb-4 text-[var(--color-on-surface)]">Moderación de contenido</h1>
        <p className="text-body-lg max-w-3xl text-[var(--color-secondary)]">
          Revisa y gestiona las publicaciones de productos para asegurar el cumplimiento de las normas.
        </p>
      </header>

      <section className="mb-10 flex flex-col items-end gap-6 md:flex-row" aria-label="Filtros de publicaciones">
        <label className="w-full md:w-1/3">
          <span className="text-label-md mb-2 block text-[var(--color-on-surface)]">Buscar</span>
          <span className="relative block">
            <Search
              size={22}
              strokeWidth={1.8}
              className="absolute top-1/2 left-0 -translate-y-1/2 text-[var(--color-secondary)]"
            />
            <input
              type="search"
              placeholder="Buscar por producto o productor..."
              className="text-body-md w-full border-0 border-b border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-transparent py-2 pr-4 pl-8 text-[var(--color-on-surface)] transition-colors placeholder:text-[var(--color-secondary)] focus:border-[var(--color-on-surface)] focus:outline-none"
            />
          </span>
        </label>

        <div className="grid w-full grid-cols-1 gap-6 md:w-auto md:flex-1 md:grid-cols-3">
          <FilterSelect label="Categoría" options={['Todas', 'Aceites', 'Quesos', 'Vinos']} />
          <FilterSelect label="Productor" options={['Todos', 'Finca El Olivar', 'Lácteos del Valle', 'Bodegas del Sol']} />
          <FilterSelect label="Estado" options={['Todos', 'Publicada', 'Reportada', 'Retirada']} />
        </div>
      </section>

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
            {publications.map((publication) => (
              <PublicationRow key={publication.id} publication={publication} />
            ))}
          </tbody>
        </table>
      </section>

      <footer className="mt-8 flex flex-col items-end justify-end gap-4 border-t border-[var(--color-outline-variant)] pt-6 md:flex-row md:items-center">
        <span className="text-label-md text-sm text-[var(--color-secondary)]">Mostrando 1-3 de 128</span>
        <div className="flex gap-2">
          <PaginationButton icon={ChevronLeft} label="Página anterior" disabled />
          <button
            type="button"
            aria-current="page"
            className="grid size-8 place-items-center border border-[var(--color-on-surface)] bg-[var(--color-on-surface)] text-[var(--color-on-primary)] transition-colors"
          >
            1
          </button>
          <PaginationButton label="2" />
          <PaginationButton label="3" />
          <PaginationButton icon={ChevronRight} label="Página siguiente" />
        </div>
      </footer>
    </div>
  )
}

type PublicationRowProps = {
  publication: Publication
}

function PublicationRow({ publication }: PublicationRowProps) {
  return (
    <tr className="group border-b border-[color-mix(in_srgb,var(--color-on-surface)_10%,transparent)] transition-colors last:border-b-0 hover:bg-[color-mix(in_srgb,var(--color-surface-container-lowest)_50%,transparent)]">
      <td className="py-6 align-middle">
        <div className="flex items-center gap-4">
          <img
            src={publication.imageUrl}
            alt={publication.name}
            className="size-16 rounded-[var(--radius-sm)] bg-[var(--color-surface-dim)] object-cover"
          />
          <div>
            <p className="font-editorial text-lg text-[var(--color-on-surface)]">{publication.name}</p>
            <p className="mt-1 font-mono text-xs text-[var(--color-secondary)]">SKU: {publication.sku}</p>
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

type FilterSelectProps = {
  label: string
  options: string[]
}

function FilterSelect({ label, options }: FilterSelectProps) {
  return (
    <label className="block">
      <span className="text-label-md mb-2 block text-[var(--color-on-surface)]">{label}</span>
      <span className="relative block">
        <select className="text-body-md w-full cursor-pointer appearance-none border-0 border-b border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-transparent py-2 pr-8 pl-0 text-[var(--color-on-surface)] transition-colors focus:border-[var(--color-on-surface)] focus:outline-none">
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
    <th className={`text-label-md pb-3 text-xs uppercase tracking-widest text-[var(--color-secondary)] ${className}`}>
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

  return <span className={`text-label-sm inline-flex rounded-full px-3 py-1 ${className}`}>{status}</span>
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
      className="grid size-8 place-items-center border border-[var(--color-outline-variant)] text-[var(--color-secondary)] transition-colors hover:border-[var(--color-on-surface)] hover:text-[var(--color-on-surface)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {Icon ? <Icon size={16} strokeWidth={1.8} /> : label}
    </button>
  )
}
