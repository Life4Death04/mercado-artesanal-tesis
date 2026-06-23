import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronLeft, ChevronRight, RefreshCcw, Search } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type IncidentStatus = 'Pendiente' | 'En revisión' | 'Resuelta'
type IncidentType = 'Reclamación' | 'Denuncia' | 'Fraude' | 'Incumplimiento'

type IncidentRow = {
  id: string
  slug: string
  type: IncidentType
  reporter: string
  reporterEmail: string
  reported: string
  reportedRole: string
  description: string
  date: string
  status: IncidentStatus
}

// ---------------------------------------------------------------------------
// Mock data — 10 incidencias
// ---------------------------------------------------------------------------

const INCIDENTS: IncidentRow[] = [
  {
    id: '#INC-2841',
    slug: 'inc-2841',
    type: 'Reclamación',
    reporter: 'Elena Ríos',
    reporterEmail: 'elena.r@email.com',
    reported: 'Cerámica Valls',
    reportedRole: 'Productor',
    description: 'El jarrón de terracota llegó con una fisura en la base, a pesar del embalaje.',
    date: '12 Oct 2023',
    status: 'Pendiente',
  },
  {
    id: '#INC-2838',
    slug: 'inc-2838',
    type: 'Denuncia',
    reporter: 'Carlos M.',
    reporterEmail: 'carlos.m@email.com',
    reported: 'Mieles del Valle',
    reportedRole: 'Productor',
    description: 'Sospecho que el producto no es 100% orgánico como indica la etiqueta.',
    date: '10 Oct 2023',
    status: 'En revisión',
  },
  {
    id: '#INC-2815',
    slug: 'inc-2815',
    type: 'Reclamación',
    reporter: 'Ana G.',
    reporterEmail: 'ana.g@email.com',
    reported: 'Textiles Oax',
    reportedRole: 'Productor',
    description: 'El pedido lleva 3 semanas de retraso y el vendedor no responde.',
    date: '05 Oct 2023',
    status: 'Resuelta',
  },
  {
    id: '#INC-2809',
    slug: 'inc-2841',
    type: 'Fraude',
    reporter: 'Pedro Torres',
    reporterEmail: 'p.torres@email.com',
    reported: 'Artesanías del Mar',
    reportedRole: 'Productor',
    description: 'El productor cobró el pedido pero nunca realizó el envío ni respondió contactos.',
    date: '02 Oct 2023',
    status: 'Pendiente',
  },
  {
    id: '#INC-2801',
    slug: 'inc-2841',
    type: 'Denuncia',
    reporter: 'María R.',
    reporterEmail: 'maria.r@email.com',
    reported: 'Dulces Castillo',
    reportedRole: 'Productor',
    description: 'El producto contiene alérgenos no declarados en la ficha técnica.',
    date: '29 Sep 2023',
    status: 'En revisión',
  },
  {
    id: '#INC-2795',
    slug: 'inc-2841',
    type: 'Reclamación',
    reporter: 'Juan S.',
    reporterEmail: 'juan.s@email.com',
    reported: 'Aceites Finca',
    reportedRole: 'Productor',
    description: 'Recibí una cantidad inferior a la indicada en el pedido confirmado.',
    date: '25 Sep 2023',
    status: 'Resuelta',
  },
  {
    id: '#INC-2788',
    slug: 'inc-2841',
    type: 'Incumplimiento',
    reporter: 'Laura V.',
    reporterEmail: 'laura.v@email.com',
    reported: 'Vinos Sierra',
    reportedRole: 'Productor',
    description: 'El productor incumplió los plazos de entrega acordados en dos pedidos consecutivos.',
    date: '20 Sep 2023',
    status: 'Pendiente',
  },
  {
    id: '#INC-2774',
    slug: 'inc-2841',
    type: 'Fraude',
    reporter: 'Diego M.',
    reporterEmail: 'diego.m@email.com',
    reported: 'Quesos del Norte',
    reportedRole: 'Productor',
    description: 'Las fotos del producto no se corresponden con el artículo recibido.',
    date: '15 Sep 2023',
    status: 'Resuelta',
  },
  {
    id: '#INC-2768',
    slug: 'inc-2841',
    type: 'Reclamación',
    reporter: 'Isabel A.',
    reporterEmail: 'isabel.a@email.com',
    reported: 'Conservas del Mar',
    reportedRole: 'Productor',
    description: 'El producto llegó caducado. La fecha de caducidad era anterior a la fecha de envío.',
    date: '10 Sep 2023',
    status: 'En revisión',
  },
  {
    id: '#INC-2755',
    slug: 'inc-2841',
    type: 'Denuncia',
    reporter: 'Roberto F.',
    reporterEmail: 'roberto.f@email.com',
    reported: 'Embutidos del Sur',
    reportedRole: 'Productor',
    description: 'El productor ofrece descuentos fuera de la plataforma para evadir comisiones.',
    date: '05 Sep 2023',
    status: 'Pendiente',
  },
]

const TIPOS: Array<'Todos' | IncidentType> = ['Todos', 'Reclamación', 'Denuncia', 'Fraude', 'Incumplimiento']
const ESTADOS: Array<'Todos' | IncidentStatus> = ['Todos', 'Pendiente', 'En revisión', 'Resuelta']

const POR_PAGINA = 6

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function IncidenciasAdminPage() {
  const [query, setQuery] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<'Todos' | IncidentType>('Todos')
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | IncidentStatus>('Todos')
  const [pagina, setPagina] = useState(1)

  // Derived filtered list
  const filtrados = INCIDENTS.filter((inc) => {
    const q = query.toLowerCase()
    const matchQuery =
      !q ||
      inc.id.toLowerCase().includes(q) ||
      inc.reporter.toLowerCase().includes(q) ||
      inc.reported.toLowerCase().includes(q) ||
      inc.reporterEmail.toLowerCase().includes(q)
    const matchTipo = filtroTipo === 'Todos' || inc.type === filtroTipo
    const matchEstado = filtroEstado === 'Todos' || inc.status === filtroEstado
    return matchQuery && matchTipo && matchEstado
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
    setFiltroTipo('Todos')
    setFiltroEstado('Todos')
    setPagina(1)
  }

  return (
    <div className="mx-[var(--space-margin-mobile)] max-w-[var(--layout-container-max)] md:mx-0">
      <header className="mb-12">
        <h1 className="text-headline-lg mb-2 text-[var(--color-on-surface)]">
          Gestión de Incidencias
        </h1>
        <p className="text-body-md max-w-2xl text-[var(--color-outline)]">
          Supervise, revise y resuelva las incidencias reportadas en la plataforma.
        </p>
      </header>

      {/* Filters */}
      <section
        className="mb-8 flex flex-col gap-4 rounded-[var(--radius-xl)] border border-[color-mix(in_srgb,var(--color-secondary)_20%,transparent)] bg-[color-mix(in_srgb,var(--color-background)_72%,transparent)] p-4 backdrop-blur-md lg:flex-row lg:items-center lg:justify-between"
        aria-label="Filtros de incidencias"
      >
        {/* Search */}
        <label className="relative min-w-[250px] flex-1">
          <span className="sr-only">Buscar incidencia</span>
          <Search
            size={20}
            strokeWidth={1.8}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--color-outline)]"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onFilter(setQuery, e.target.value)}
            placeholder="Buscar por ID, reportante o reportado..."
            className="text-body-md w-full border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-transparent py-2 pr-4 pl-10 text-[var(--color-on-surface)] transition-colors placeholder:text-[color-mix(in_srgb,var(--color-outline)_70%,transparent)] focus:border-[var(--color-on-surface)] focus:outline-none"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          {/* Tipo filter */}
          <PillSelect
            value={filtroTipo}
            options={TIPOS}
            prefix="Tipo"
            onChange={(v) => onFilter(setFiltroTipo, v as typeof filtroTipo)}
          />
          {/* Estado filter */}
          <PillSelect
            value={filtroEstado}
            options={ESTADOS}
            prefix="Estado"
            onChange={(v) => onFilter(setFiltroEstado, v as typeof filtroEstado)}
          />
          {/* Reset */}
          <button
            type="button"
            onClick={resetFiltros}
            className="text-label-md flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] px-4 py-2 text-[var(--color-outline)] transition-colors hover:text-[var(--color-on-surface)]"
          >
            <RefreshCcw size={14} strokeWidth={1.9} />
            Restablecer
          </button>
        </div>
      </section>

      {/* Table */}
      <section className="overflow-x-auto" aria-label="Listado de incidencias">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)]">
              <TableHead>ID</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Reportante</TableHead>
              <TableHead>Reportado</TableHead>
              <TableHead className="w-1/4">Descripción</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </tr>
          </thead>
          <tbody className="text-body-md">
            {paginados.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-body-md px-4 py-16 text-center text-[var(--color-outline)]"
                >
                  No se encontraron incidencias con los filtros aplicados.
                </td>
              </tr>
            ) : (
              paginados.map((incident) => (
                <tr
                  key={incident.id}
                  className="border-b border-[color-mix(in_srgb,var(--color-on-surface)_10%,transparent)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-surface-container-low)_55%,transparent)]"
                >
                  <td className="px-4 py-6 text-[18px] font-semibold text-[var(--color-on-surface)]">
                    <span className="font-editorial">{incident.id}</span>
                  </td>
                  <td className="px-4 py-6">
                    <TypeBadge type={incident.type} />
                  </td>
                  <td className="px-4 py-6">
                    <div className="font-medium text-[var(--color-on-surface)]">
                      {incident.reporter}
                    </div>
                    <div className="mt-1 text-sm text-[var(--color-outline)]">
                      {incident.reporterEmail}
                    </div>
                  </td>
                  <td className="px-4 py-6">
                    <div className="text-[var(--color-on-surface)]">{incident.reported}</div>
                    <div className="mt-1 text-sm text-[var(--color-outline)]">
                      {incident.reportedRole}
                    </div>
                  </td>
                  <td className="px-4 py-6">
                    <p className="max-w-xs truncate text-[var(--color-on-surface)]">
                      {incident.description}
                    </p>
                  </td>
                  <td className="px-4 py-6 text-[var(--color-outline)]">{incident.date}</td>
                  <td className="px-4 py-6">
                    <StatusBadge status={incident.status} />
                  </td>
                  <td className="px-4 py-6 text-right">
                    <Link
                      to={`/admin/incidencias/${incident.slug}`}
                      className={`text-label-md inline-flex px-4 py-2 transition-colors ${
                        incident.status === 'Resuelta'
                          ? 'border border-transparent text-[var(--color-outline)] hover:text-[var(--color-on-surface)]'
                          : 'border border-[var(--color-on-surface)] text-[var(--color-on-surface)] hover:bg-[var(--color-on-surface)] hover:text-[var(--color-surface)]'
                      }`}
                    >
                      {incident.status === 'Resuelta' ? 'Ver detalle' : 'Revisar'}
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* Pagination */}
      <footer className="mt-8 flex flex-col gap-6 border-t border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] pt-6 md:flex-row md:items-center md:justify-between">
        <span className="text-body-md text-[var(--color-outline)]">
          {filtrados.length === 0
            ? 'Sin resultados'
            : `Mostrando ${inicio + 1}–${Math.min(inicio + POR_PAGINA, filtrados.length)} de ${filtrados.length} incidencias`}
        </span>
        <div className="flex items-center gap-2">
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
              className={`text-label-md grid size-10 place-items-center border transition-colors ${
                p === pagina
                  ? 'border-[var(--color-on-surface)] bg-[var(--color-on-surface)] text-[var(--color-surface)]'
                  : 'border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)]'
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
// Sub-components
// ---------------------------------------------------------------------------

/** Select estilizado como pill button para mantener el diseño original */
function PillSelect({
  value,
  options,
  prefix,
  onChange,
}: {
  value: string
  options: string[]
  prefix: string
  onChange: (v: string) => void
}) {
  const label = value === 'Todos' || value === 'Todas' ? `${prefix}: Todos` : value

  return (
    <label className="relative">
      <span className="sr-only">{prefix}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-label-md cursor-pointer appearance-none rounded-full border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-transparent py-2 pl-4 pr-8 text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-container-low)] focus:outline-none"
        aria-label={prefix}
        title={label}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt === 'Todos' || opt === 'Todas' ? `${prefix}: ${opt}` : opt}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        strokeWidth={1.9}
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[var(--color-on-surface)]"
      />
    </label>
  )
}

function TypeBadge({ type }: { type: IncidentType }) {
  return (
    <span className="text-label-sm inline-block rounded-full border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-[var(--color-surface-container)] px-3 py-1 text-[var(--color-on-surface)]">
      {type}
    </span>
  )
}

function StatusBadge({ status }: { status: IncidentStatus }) {
  const className = {
    Pendiente:
      'border-[color-mix(in_srgb,var(--color-primary-container)_20%,transparent)] bg-[color-mix(in_srgb,var(--color-error-container)_30%,transparent)] text-[var(--color-primary-container)]',
    'En revisión':
      'border-[color-mix(in_srgb,var(--color-secondary)_20%,transparent)] bg-[color-mix(in_srgb,var(--color-secondary-container)_50%,transparent)] text-[var(--color-secondary)]',
    Resuelta:
      'border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)]',
  }[status]

  return (
    <span className={`text-label-sm inline-block rounded-full border px-3 py-1 ${className}`}>
      {status}
    </span>
  )
}

type TableHeadProps = { children: string; className?: string }

function TableHead({ children, className = '' }: TableHeadProps) {
  return (
    <th
      className={`text-label-md px-4 py-4 uppercase tracking-wider text-[var(--color-outline)] ${className}`}
    >
      {children}
    </th>
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
      className="text-label-md grid size-10 place-items-center border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-container-low)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {Icon ? <Icon size={18} strokeWidth={1.8} /> : label}
    </button>
  )
}
