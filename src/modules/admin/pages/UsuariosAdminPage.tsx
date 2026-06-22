import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Ban,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCcw,
  Search,
  Trash2,
} from 'lucide-react'
import { UserActionModals } from '../componentes/UserActionModals'
import type { AdminUser, UserModalState } from '../componentes/UserActionModals'

const users: AdminUser[] = [
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
]

export function UsuariosAdminPage() {
  const [modal, setModal] = useState<UserModalState>(null)

  return (
    <>
      <div className="mx-[var(--space-margin-mobile)] max-w-[var(--layout-container-max)] md:mx-0">
        <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-headline-lg mb-2 text-[var(--color-on-surface)]">Gestión de usuarios</h1>
            <p className="text-body-md max-w-2xl text-[var(--color-outline)]">
              Consulta y gestiona las cuentas de clientes y productores de la plataforma.
            </p>
          </div>
        </header>

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
              placeholder="Buscar por nombre, correo o rol..."
              className="text-body-md w-full border-0 border-b border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-transparent py-3 pr-4 pl-12 text-[var(--color-on-surface)] transition-colors placeholder:text-[var(--color-outline)] focus:border-[var(--color-on-surface)] focus:outline-none"
            />
          </label>

          <div className="flex flex-wrap items-center gap-4">
            <FilterSelect label="Rol" options={["Rol (Todos)", 'Cliente', 'Productor']} />
            <FilterSelect label="Estado" options={["Estado (Todos)", 'Activa', 'Desactivada']} />
            <button
              type="button"
              className="text-label-md flex items-center gap-2 px-2 py-3 uppercase text-[var(--color-outline)] transition-colors hover:text-[var(--color-on-surface)]"
            >
              <RefreshCcw size={15} strokeWidth={1.9} />
              Restablecer
            </button>
          </div>
        </section>

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
              {users.map((user, index) => (
                <UserRow key={user.id} user={user} highlighted={index === 0} onOpenModal={setModal} />
              ))}
            </tbody>
          </table>
        </section>

        <footer className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[color-mix(in_srgb,var(--color-secondary)_20%,transparent)] pt-4 sm:flex-row">
          <p className="text-sm text-[var(--color-outline)]">Mostrando 1-10 de 1240 usuarios</p>
          <div className="flex gap-2">
            <PaginationButton icon={ChevronLeft} label="Página anterior" disabled />
            <button
              type="button"
              aria-current="page"
              className="text-label-md grid size-10 place-items-center border border-[var(--color-on-surface)] bg-[var(--color-on-surface)] text-[var(--color-background)]"
            >
              1
            </button>
            <PaginationButton label="2" />
            <PaginationButton label="3" />
            <span className="grid size-10 place-items-center text-[var(--color-outline)]">...</span>
            <PaginationButton icon={ChevronRight} label="Página siguiente" />
          </div>
        </footer>
      </div>

      <UserActionModals modal={modal} onClose={() => setModal(null)} />
    </>
  )
}

type UserRowProps = {
  user: AdminUser
  highlighted?: boolean
  onOpenModal: (modal: UserModalState) => void
}

function UserRow({ user, highlighted = false, onOpenModal }: UserRowProps) {
  const disabled = user.status === 'Desactivada'

  return (
    <tr
      className={`group border-b border-[color-mix(in_srgb,var(--color-secondary)_25%,transparent)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-surface-container-low)_50%,transparent)] ${
        highlighted ? 'bg-[color-mix(in_srgb,var(--color-surface-container-low)_50%,transparent)]' : ''
      }`}
    >
      <td className="px-4 py-5">
        <div className="flex flex-col">
          <span className={`font-medium ${disabled ? 'text-[color-mix(in_srgb,var(--color-on-surface)_60%,transparent)]' : 'text-[var(--color-on-surface)]'}`}>
            {user.name}
          </span>
          <span className={`mt-1 text-sm ${disabled ? 'text-[color-mix(in_srgb,var(--color-outline)_60%,transparent)]' : 'text-[var(--color-outline)]'}`}>
            {user.email}
          </span>
        </div>
      </td>
      <td className="px-4 py-5">
        <RoleBadge role={user.role} disabled={disabled} />
      </td>
      <td className={`hidden px-4 py-5 md:table-cell ${disabled ? 'text-[color-mix(in_srgb,var(--color-outline)_60%,transparent)]' : 'text-[var(--color-outline)]'}`}>
        {user.registeredAt}
      </td>
      <td className="px-4 py-5">
        <StatusIndicator status={user.status} />
      </td>
      <td className="px-4 py-5 text-right">
        <div className="flex justify-end gap-3 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
          <IconAction icon={Eye} label={`Ver detalle de ${user.name}`} onClick={() => onOpenModal({ type: 'detail', user })} />
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

type FilterSelectProps = {
  label: string
  options: string[]
}

function FilterSelect({ label, options }: FilterSelectProps) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select className="text-body-md cursor-pointer appearance-none border-0 border-b border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-transparent py-3 pr-10 pl-4 text-[var(--color-on-surface)] focus:border-[var(--color-on-surface)] focus:outline-none">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        size={18}
        strokeWidth={1.8}
        className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-[var(--color-outline)]"
      />
    </label>
  )
}

type TableHeadProps = {
  children: string
  className?: string
}

function TableHead({ children, className = '' }: TableHeadProps) {
  return <th className={`text-label-md px-4 py-4 uppercase text-[var(--color-outline)] ${className}`}>{children}</th>
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
    <span className={`inline-flex items-center gap-1.5 ${active ? 'text-[var(--color-secondary)]' : 'text-[var(--color-outline)]'}`}>
      <span className={`size-2 rounded-full ${active ? 'bg-[var(--color-secondary)]' : 'bg-[var(--color-surface-dim)]'}`} />
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
  const className = {
    default: 'hover:text-[var(--color-on-surface)]',
    primary: 'hover:text-[var(--color-primary-container)]',
    success: 'hover:text-[var(--color-secondary)]',
    danger: 'hover:text-[var(--color-error)]',
  }[intent]

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`p-2 text-[var(--color-outline)] transition-colors ${className}`}
    >
      <Icon size={20} strokeWidth={1.8} />
    </button>
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
      className="text-label-md grid size-10 place-items-center border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] text-[var(--color-on-surface)] transition-colors hover:border-[var(--color-on-surface)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {Icon ? <Icon size={18} strokeWidth={1.8} /> : label}
    </button>
  )
}
