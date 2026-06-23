import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCcw,
  Search,
  Trash2,
} from 'lucide-react'
import { UserActionModals } from '../componentes/UserActionModals'
import type { AdminUser, UserModalState } from '../componentes/UserActionModals'

// ---------------------------------------------------------------------------
// Mock data — 15 usuarios
// ---------------------------------------------------------------------------

const USUARIOS_INICIALES: AdminUser[] = [
  {
    id: 1,
    name: 'Carlos Ruiz',
    email: 'carlos.ruiz@email.com',
    role: 'Cliente',
    registeredAt: '12 Oct 2023',
    status: 'Activa',
    productsPublished: 0,
    totalOrders: 18,
  },
  {
    id: 2,
    name: 'Bodegas del Sol',
    email: 'contacto@bodegasdelsol.com',
    role: 'Productor',
    registeredAt: '05 Oct 2023',
    status: 'Activa',
    municipality: 'Alicante',
    productsPublished: 85,
    totalOrders: 412,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCAZtJA-VlbZT7lUw-UA4guBcCPFQrr9SvmfB9LAm_aBwlm7JyG8vpakDSkMNf9A02jJ_JJbnDnnRR72EKgZXerGuwsQtHL6PQN91WlY34FBTVRLJfuSAjKBKGij7hWCCA9744SRQlQyelTRRc6EWr22CQ-GXyl-QzDaqYW5xIQvTecAGHIxbPPHDgWQlHOphWDrhdT4oAWHHONHgFq5i22nmUaNQ0HjmRaNqz4_R_pA1hRWgr9kOAFH1ULIivEKzEQJXyyMfLwEpek',
  },
  {
    id: 3,
    name: 'Ana Martínez',
    email: 'ana.mtz@email.com',
    role: 'Cliente',
    registeredAt: '28 Sep 2023',
    status: 'Desactivada',
    productsPublished: 0,
    totalOrders: 6,
  },
  {
    id: 4,
    name: 'María Torres',
    email: 'maria.torres@email.com',
    role: 'Cliente',
    registeredAt: '15 Sep 2023',
    status: 'Activa',
    productsPublished: 0,
    totalOrders: 24,
  },
  {
    id: 5,
    name: 'Finca Los Olivos',
    email: 'info@fincalosolivos.es',
    role: 'Productor',
    registeredAt: '02 Sep 2023',
    status: 'Activa',
    municipality: 'Denia',
    productsPublished: 32,
    totalOrders: 198,
  },
  {
    id: 6,
    name: 'Roberto Sánchez',
    email: 'roberto.sanchez@email.com',
    role: 'Cliente',
    registeredAt: '20 Ago 2023',
    status: 'Activa',
    productsPublished: 0,
    totalOrders: 11,
  },
  {
    id: 7,
    name: 'Dulces Artesanos',
    email: 'hola@dulcesartesanos.com',
    role: 'Productor',
    registeredAt: '10 Ago 2023',
    status: 'Desactivada',
    municipality: 'Alcoy',
    productsPublished: 14,
    totalOrders: 53,
  },
  {
    id: 8,
    name: 'Elena García',
    email: 'elena.garcia@email.com',
    role: 'Cliente',
    registeredAt: '01 Ago 2023',
    status: 'Activa',
    productsPublished: 0,
    totalOrders: 30,
  },
  {
    id: 9,
    name: 'Vinos El Mediterráneo',
    email: 'ventas@vinosmediterraneo.com',
    role: 'Productor',
    registeredAt: '22 Jul 2023',
    status: 'Activa',
    municipality: 'Villena',
    productsPublished: 41,
    totalOrders: 267,
  },
  {
    id: 10,
    name: 'Miguel Fernández',
    email: 'miguel.fndz@email.com',
    role: 'Cliente',
    registeredAt: '14 Jul 2023',
    status: 'Activa',
    productsPublished: 0,
    totalOrders: 8,
  },
  {
    id: 11,
    name: 'Quesos de Montaña',
    email: 'info@quesosmontana.es',
    role: 'Productor',
    registeredAt: '05 Jul 2023',
    status: 'Activa',
    municipality: 'Benidorm',
    productsPublished: 9,
    totalOrders: 76,
  },
  {
    id: 12,
    name: 'Laura Jiménez',
    email: 'laura.jimenez@email.com',
    role: 'Cliente',
    registeredAt: '28 Jun 2023',
    status: 'Desactivada',
    productsPublished: 0,
    totalOrders: 3,
  },
  {
    id: 13,
    name: 'Aceites Benitatxell',
    email: 'pedidos@aceitesbenitatxell.com',
    role: 'Productor',
    registeredAt: '15 Jun 2023',
    status: 'Activa',
    municipality: 'El Poble Nou de Benitatxell',
    productsPublished: 21,
    totalOrders: 134,
  },
  {
    id: 14,
    name: 'Pablo Moreno',
    email: 'pablo.moreno@email.com',
    role: 'Cliente',
    registeredAt: '03 Jun 2023',
    status: 'Activa',
    productsPublished: 0,
    totalOrders: 15,
  },
  {
    id: 15,
    name: 'Miel de Guadalest',
    email: 'contacto@mielguadalest.es',
    role: 'Productor',
    registeredAt: '20 May 2023',
    status: 'Activa',
    municipality: 'Guadalest',
    productsPublished: 6,
    totalOrders: 48,
  },
]

const POR_PAGINA = 8

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function UsuariosAdminPage() {
  const [usuarios, setUsuarios] = useState<AdminUser[]>(USUARIOS_INICIALES)
  const [modal, setModal] = useState<UserModalState>(null)

  // Filters
  const [query, setQuery] = useState('')
  const [filtroRol, setFiltroRol] = useState('Rol (Todos)')
  const [filtroEstado, setFiltroEstado] = useState('Estado (Todos)')
  const [pagina, setPagina] = useState(1)

  // Derived: filtered list
  const filtrados = usuarios.filter((u) => {
    const q = query.toLowerCase()
    const matchQuery =
      !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    const matchRol = filtroRol === 'Rol (Todos)' || u.role === filtroRol
    const matchEstado = filtroEstado === 'Estado (Todos)' || u.status === filtroEstado
    return matchQuery && matchRol && matchEstado
  })

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA))
  const inicio = (pagina - 1) * POR_PAGINA
  const paginados = filtrados.slice(inicio, inicio + POR_PAGINA)

  // Reset filters
  function resetFiltros() {
    setQuery('')
    setFiltroRol('Rol (Todos)')
    setFiltroEstado('Estado (Todos)')
    setPagina(1)
  }

  // When any filter changes, go back to page 1
  function onChangeRol(v: string) { setFiltroRol(v); setPagina(1) }
  function onChangeEstado(v: string) { setFiltroEstado(v); setPagina(1) }
  function onChangeQuery(v: string) { setQuery(v); setPagina(1) }

  // Confirm action — mutates users array
  function handleConfirm(type: 'activate' | 'deactivate' | 'delete', userId: number) {
    if (type === 'activate') {
      setUsuarios((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: 'Activa' as const } : u)),
      )
    } else if (type === 'deactivate') {
      setUsuarios((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: 'Desactivada' as const } : u)),
      )
    } else if (type === 'delete') {
      setUsuarios((prev) => prev.filter((u) => u.id !== userId))
    }
    setModal(null)
  }

  return (
    <>
      <div className="mx-[var(--space-margin-mobile)] max-w-[var(--layout-container-max)] md:mx-0">
        <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-headline-lg mb-2 text-[var(--color-on-surface)]">
              Gestión de usuarios
            </h1>
            <p className="text-body-md max-w-2xl text-[var(--color-outline)]">
              Consulta y gestiona las cuentas de clientes y productores de la plataforma.
            </p>
          </div>
        </header>

        {/* Filters */}
        <section className="mb-8 flex flex-col gap-4 lg:flex-row" aria-label="Filtros de usuarios">
          <label className="relative flex-1">
            <span className="sr-only">Buscar usuario</span>
            <Search
              size={22}
              strokeWidth={1.8}
              className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--color-outline)]"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => onChangeQuery(e.target.value)}
              placeholder="Buscar por nombre o correo..."
              className="text-body-md w-full border-0 border-b border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-transparent py-3 pr-4 pl-12 text-[var(--color-on-surface)] transition-colors placeholder:text-[var(--color-outline)] focus:border-[var(--color-on-surface)] focus:outline-none"
            />
          </label>

          <div className="flex flex-wrap items-center gap-4">
            <FilterSelect
              label="Rol"
              value={filtroRol}
              options={['Rol (Todos)', 'Cliente', 'Productor']}
              onChange={onChangeRol}
            />
            <FilterSelect
              label="Estado"
              value={filtroEstado}
              options={['Estado (Todos)', 'Activa', 'Desactivada']}
              onChange={onChangeEstado}
            />
            <button
              type="button"
              onClick={resetFiltros}
              className="text-label-md flex items-center gap-2 px-2 py-3 uppercase text-[var(--color-outline)] transition-colors hover:text-[var(--color-on-surface)]"
            >
              <RefreshCcw size={15} strokeWidth={1.9} />
              Restablecer
            </button>
          </div>
        </section>

        {/* Table */}
        <section className="overflow-x-auto" aria-label="Listado de usuarios">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[color-mix(in_srgb,var(--color-on-surface)_10%,transparent)]">
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="hidden md:table-cell">Fecha de registro</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </tr>
            </thead>
            <tbody className="text-body-md">
              {paginados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-body-md px-4 py-12 text-center text-[var(--color-outline)]">
                    No se encontraron usuarios con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                paginados.map((user) => (
                  <UserRow key={user.id} user={user} onOpenModal={setModal} />
                ))
              )}
            </tbody>
          </table>
        </section>

        {/* Pagination */}
        <footer className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[color-mix(in_srgb,var(--color-secondary)_20%,transparent)] pt-4 sm:flex-row">
          <p className="text-sm text-[var(--color-outline)]">
            {filtrados.length === 0
              ? 'Sin resultados'
              : `Mostrando ${inicio + 1}–${Math.min(inicio + POR_PAGINA, filtrados.length)} de ${filtrados.length} usuarios`}
          </p>
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
                className={`text-label-md grid size-10 place-items-center border transition-colors ${
                  p === pagina
                    ? 'border-[var(--color-on-surface)] bg-[var(--color-on-surface)] text-[var(--color-background)]'
                    : 'border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] text-[var(--color-on-surface)] hover:border-[var(--color-on-surface)]'
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

      <UserActionModals
        modal={modal}
        onClose={() => setModal(null)}
        onOpenModal={setModal}
        onConfirm={handleConfirm}
      />
    </>
  )
}

// ---------------------------------------------------------------------------
// UserRow
// ---------------------------------------------------------------------------

type UserRowProps = {
  user: AdminUser
  onOpenModal: (modal: UserModalState) => void
}

function UserRow({ user, onOpenModal }: UserRowProps) {
  const disabled = user.status === 'Desactivada'

  return (
    <tr
      className={`border-b border-[color-mix(in_srgb,var(--color-secondary)_25%,transparent)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-surface-container-low)_50%,transparent)]`}
    >
      <td className="px-4 py-5">
        <div className="flex flex-col">
          <span
            className={`font-medium ${
              disabled
                ? 'text-[color-mix(in_srgb,var(--color-on-surface)_60%,transparent)]'
                : 'text-[var(--color-on-surface)]'
            }`}
          >
            {user.name}
          </span>
          <span
            className={`mt-1 text-sm ${
              disabled
                ? 'text-[color-mix(in_srgb,var(--color-outline)_60%,transparent)]'
                : 'text-[var(--color-outline)]'
            }`}
          >
            {user.email}
          </span>
        </div>
      </td>
      <td className="px-4 py-5">
        <RoleBadge role={user.role} disabled={disabled} />
      </td>
      <td
        className={`hidden px-4 py-5 md:table-cell ${
          disabled
            ? 'text-[color-mix(in_srgb,var(--color-outline)_60%,transparent)]'
            : 'text-[var(--color-outline)]'
        }`}
      >
        {user.registeredAt}
      </td>
      <td className="px-4 py-5">
        <StatusIndicator status={user.status} />
      </td>
      <td className="px-4 py-5 text-right">
        {/* Icons always visible — color changes on hover only */}
        <div className="flex justify-end gap-3">
          <IconAction
            icon={Eye}
            label={`Ver detalle de ${user.name}`}
            onClick={() => onOpenModal({ type: 'detail', user })}
          />
          {user.status === 'Activa' ? (
            <IconAction
              icon={Ban}
              label={`Desactivar ${user.name}`}
              intent="primary"
              onClick={() => onOpenModal({ type: 'deactivate', user })}
            />
          ) : (
            <IconAction
              icon={CheckCircle2}
              label={`Activar ${user.name}`}
              intent="success"
              onClick={() => onOpenModal({ type: 'activate', user })}
            />
          )}
          <IconAction
            icon={Trash2}
            label={`Eliminar ${user.name}`}
            intent="danger"
            onClick={() => onOpenModal({ type: 'delete', user })}
          />
        </div>
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
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-body-md cursor-pointer appearance-none border-0 border-b border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-transparent py-3 pr-10 pl-4 text-[var(--color-on-surface)] focus:border-[var(--color-on-surface)] focus:outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronRight
        size={18}
        strokeWidth={1.8}
        className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rotate-90 text-[var(--color-outline)]"
      />
    </label>
  )
}

type TableHeadProps = {
  children: string
  className?: string
}

function TableHead({ children, className = '' }: TableHeadProps) {
  return (
    <th className={`text-label-md px-4 py-4 uppercase text-[var(--color-outline)] ${className}`}>
      {children}
    </th>
  )
}

function RoleBadge({ role, disabled = false }: { role: AdminUser['role']; disabled?: boolean }) {
  const className =
    role === 'Productor'
      ? 'bg-[var(--color-secondary-container)] text-[var(--color-secondary)]'
      : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface)]'

  return (
    <span
      className={`text-label-sm inline-block rounded-[var(--radius-sm)] px-3 py-1 uppercase tracking-wider ${className} ${
        disabled ? 'opacity-60' : ''
      }`}
    >
      {role}
    </span>
  )
}

function StatusIndicator({ status }: { status: AdminUser['status'] }) {
  const active = status === 'Activa'

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${
        active ? 'text-[var(--color-secondary)]' : 'text-[var(--color-outline)]'
      }`}
    >
      <span
        className={`size-2 rounded-full ${
          active ? 'bg-[var(--color-secondary)]' : 'bg-[var(--color-surface-dim)]'
        }`}
      />
      {status}
    </span>
  )
}

type IconActionProps = {
  icon: LucideIcon
  label: string
  intent?: 'default' | 'primary' | 'success' | 'danger'
  onClick: () => void
}

function IconAction({ icon: Icon, label, intent = 'default', onClick }: IconActionProps) {
  const colorClass = {
    default: 'text-[var(--color-outline)] hover:text-[var(--color-on-surface)]',
    primary: 'text-[var(--color-outline)] hover:text-[var(--color-primary-container)]',
    success: 'text-[var(--color-outline)] hover:text-[var(--color-secondary)]',
    danger: 'text-[var(--color-outline)] hover:text-[var(--color-error)]',
  }[intent]

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`p-2 transition-colors ${colorClass}`}
    >
      <Icon size={20} strokeWidth={1.8} />
    </button>
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
      className="text-label-md grid size-10 place-items-center border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] text-[var(--color-on-surface)] transition-colors hover:border-[var(--color-on-surface)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {Icon ? <Icon size={18} strokeWidth={1.8} /> : label}
    </button>
  )
}
