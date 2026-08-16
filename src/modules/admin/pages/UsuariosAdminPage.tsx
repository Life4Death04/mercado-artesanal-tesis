import { useDeferredValue, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import {
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  RefreshCcw,
  Search,
  Trash2,
} from 'lucide-react'
import { resolveErrorMessage } from '../../../lib/errorMessages'
import { UserActionModals, type UserModalState } from '../componentes/UserActionModals'
import {
  useActivateAdminUserMutation,
  useAdminUsersQuery,
  useDeactivateAdminUserMutation,
  useDeleteAdminUserMutation,
} from '../usuarios/hooks/useAdminUsers'
import {
  getAdminUserDisplayName,
  type AdminUserRole,
  type AdminUserStatus,
  type AdminUserSummary,
} from '../usuarios/usuarios.schema'

type UserLifecycleAction = 'activate' | 'deactivate' | 'delete'

function statusFilterExcludesResult(
  action: UserLifecycleAction,
  status: AdminUserStatus | '',
): boolean {
  const resultingStatus: Record<UserLifecycleAction, AdminUserStatus> = {
    activate: 'ACTIVE',
    deactivate: 'DEACTIVATED',
    delete: 'DELETED',
  }

  return status !== '' && status !== resultingStatus[action]
}

export function UsuariosAdminPage() {
  const [searchParams] = useSearchParams()
  const [modal, setModal] = useState<UserModalState>(null)
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [role, setRole] = useState<AdminUserRole | ''>('')
  const [status, setStatus] = useState<AdminUserStatus | ''>('')
  const [page, setPage] = useState(1)
  const [feedback, setFeedback] = useState<string | null>(null)
  const deferredQuery = useDeferredValue(query)
  const usersQuery = useAdminUsersQuery({
    page,
    search: deferredQuery.trim() || undefined,
    role: role || undefined,
    status: status || undefined,
  })
  const activateMutation = useActivateAdminUserMutation()
  const deactivateMutation = useDeactivateAdminUserMutation()
  const deleteMutation = useDeleteAdminUserMutation()
  const anyMutationPending =
    activateMutation.isPending || deactivateMutation.isPending || deleteMutation.isPending
  const result = usersQuery.data
  const users = result?.items ?? []
  const totalPages = Math.max(1, result?.totalPages ?? 1)
  const start = result && result.totalItems > 0 ? (result.page - 1) * result.pageSize + 1 : 0
  const end = result ? Math.min(start + result.pageSize - 1, result.totalItems) : 0

  function resetMutations() {
    activateMutation.reset()
    deactivateMutation.reset()
    deleteMutation.reset()
  }

  function openModal(nextModal: Exclude<UserModalState, null>) {
    resetMutations()
    setFeedback(null)
    setModal(nextModal)
  }

  function closeModal() {
    if (anyMutationPending) return
    resetMutations()
    setModal(null)
  }

  function resetFilters() {
    setQuery('')
    setRole('')
    setStatus('')
    setPage(1)
  }

  function handleConfirm(type: UserLifecycleAction, userId: string) {
    const onSuccess = () => {
      const filteredResultShrinks = statusFilterExcludesResult(type, status)

      setModal(null)
      setFeedback(
        type === 'activate'
          ? 'La cuenta se activó correctamente.'
          : type === 'deactivate'
            ? 'La cuenta se desactivó correctamente.'
            : 'La cuenta se eliminó correctamente.',
      )
      if (filteredResultShrinks && users.length === 1 && page > 1) setPage(page - 1)
    }

    if (type === 'activate') {
      activateMutation.mutate(userId, { onSuccess })
    } else if (type === 'deactivate') {
      deactivateMutation.mutate(userId, { onSuccess })
    } else {
      deleteMutation.mutate(userId, { onSuccess })
    }
  }

  const modalPending =
    modal?.type === 'activate'
      ? activateMutation.isPending
      : modal?.type === 'deactivate'
        ? deactivateMutation.isPending
        : modal?.type === 'delete'
          ? deleteMutation.isPending
          : false
  const modalError =
    modal?.type === 'activate' && activateMutation.isError
      ? resolveErrorMessage(activateMutation.error)
      : modal?.type === 'deactivate' && deactivateMutation.isError
        ? resolveErrorMessage(deactivateMutation.error)
        : modal?.type === 'delete' && deleteMutation.isError
          ? resolveErrorMessage(deleteMutation.error)
          : null

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
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Buscar por nombre o correo..."
              className="text-body-md w-full border-0 border-b border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-transparent py-3 pr-4 pl-12 text-[var(--color-on-surface)] transition-colors placeholder:text-[var(--color-outline)] focus:border-[var(--color-on-surface)] focus:outline-none"
            />
          </label>

          <div className="flex flex-wrap items-center gap-4">
            <FilterSelect
              label="Rol"
              value={role}
              options={[
                { value: '', label: 'Rol (Todos)' },
                { value: 'CONSUMER', label: 'Cliente' },
                { value: 'PRODUCER', label: 'Productor' },
              ]}
              onChange={(value) => {
                setRole(value as AdminUserRole | '')
                setPage(1)
              }}
            />
            <FilterSelect
              label="Estado"
              value={status}
              options={[
                { value: '', label: 'Estado (Todos)' },
                { value: 'ACTIVE', label: 'Activa' },
                { value: 'DEACTIVATED', label: 'Desactivada' },
                { value: 'DELETED', label: 'Eliminada' },
              ]}
              onChange={(value) => {
                setStatus(value as AdminUserStatus | '')
                setPage(1)
              }}
            />
            <button
              type="button"
              onClick={resetFilters}
              className="text-label-md flex items-center gap-2 px-2 py-3 uppercase text-[var(--color-outline)] transition-colors hover:text-[var(--color-on-surface)]"
            >
              <RefreshCcw size={15} strokeWidth={1.9} />
              Restablecer
            </button>
          </div>
        </section>

        {feedback ? (
          <p
            role="status"
            aria-live="polite"
            className="text-body-md mb-6 rounded-[var(--radius-sm)] bg-[var(--color-tertiary-fixed)] p-4 text-[var(--color-tertiary)]"
          >
            {feedback}
          </p>
        ) : null}

        <section className="overflow-x-auto" aria-label="Listado de usuarios" aria-busy={usersQuery.isLoading}>
          {usersQuery.isLoading ? (
            <div className="flex min-h-56 items-center justify-center gap-3 text-[var(--color-outline)]" aria-live="polite">
              <Loader2 size={24} className="animate-spin" />
              <span className="text-body-md">Cargando usuarios...</span>
            </div>
          ) : usersQuery.isError ? (
            <div
              role="alert"
              className="rounded-[var(--radius-lg)] border border-[var(--color-error)] bg-[var(--color-error-container)] p-8 text-center text-[var(--color-error)]"
            >
              <p className="text-body-md">{resolveErrorMessage(usersQuery.error)}</p>
              <button
                type="button"
                onClick={() => void usersQuery.refetch()}
                disabled={usersQuery.isFetching}
                className="text-label-md mt-5 inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-current px-5 py-2.5 disabled:cursor-wait disabled:opacity-60"
              >
                <RefreshCcw size={16} className={usersQuery.isFetching ? 'animate-spin' : ''} />
                {usersQuery.isFetching ? 'Reintentando...' : 'Reintentar'}
              </button>
            </div>
          ) : (
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
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-body-md px-4 py-12 text-center text-[var(--color-outline)]">
                      {result?.totalItems === 0 && !deferredQuery.trim() && !role && !status
                        ? 'Todavía no hay usuarios registrados.'
                        : 'No se encontraron usuarios con los filtros aplicados.'}
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      actionsDisabled={anyMutationPending}
                      onOpenModal={openModal}
                    />
                  ))
                )}
              </tbody>
            </table>
          )}
        </section>

        {!usersQuery.isLoading && !usersQuery.isError ? (
          <footer className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[color-mix(in_srgb,var(--color-secondary)_20%,transparent)] pt-4 sm:flex-row">
            <p className="text-sm text-[var(--color-outline)]">
              {result?.totalItems === 0
                ? 'Sin resultados'
                : `Mostrando ${start}–${end} de ${result?.totalItems ?? 0} usuarios`}
            </p>
            <div className="flex gap-2">
              <PaginationButton
                icon={ChevronLeft}
                label="Página anterior"
                disabled={page === 1}
                onClick={() => setPage((currentPage) => currentPage - 1)}
              />
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  aria-current={pageNumber === page ? 'page' : undefined}
                  onClick={() => setPage(pageNumber)}
                  className={`text-label-md grid size-10 place-items-center border transition-colors ${
                    pageNumber === page
                      ? 'border-[var(--color-on-surface)] bg-[var(--color-on-surface)] text-[var(--color-background)]'
                      : 'border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] text-[var(--color-on-surface)] hover:border-[var(--color-on-surface)]'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              <PaginationButton
                icon={ChevronRight}
                label="Página siguiente"
                disabled={page >= totalPages}
                onClick={() => setPage((currentPage) => currentPage + 1)}
              />
            </div>
          </footer>
        ) : null}
      </div>

      <UserActionModals
        modal={modal}
        onClose={closeModal}
        onOpenModal={openModal}
        onConfirm={handleConfirm}
        isPending={modalPending}
        error={modalError}
      />
    </>
  )
}

type UserRowProps = {
  user: AdminUserSummary
  actionsDisabled: boolean
  onOpenModal: (modal: Exclude<UserModalState, null>) => void
}

function UserRow({ user, actionsDisabled, onOpenModal }: UserRowProps) {
  const displayName = getAdminUserDisplayName(user)
  const readOnly = user.status === 'DELETED'

  return (
    <tr className="border-b border-[color-mix(in_srgb,var(--color-secondary)_25%,transparent)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-surface-container-low)_50%,transparent)]">
      <td className="px-4 py-5">
        <div className={`flex flex-col ${readOnly ? 'opacity-60' : ''}`}>
          <span className="font-medium text-[var(--color-on-surface)]">{displayName}</span>
          <span className="mt-1 text-sm text-[var(--color-outline)]">{user.email}</span>
        </div>
      </td>
      <td className="px-4 py-5">
        <RoleBadge role={user.role} disabled={readOnly} />
      </td>
      <td className="hidden px-4 py-5 text-[var(--color-outline)] md:table-cell">
        {formatDate(user.createdAt)}
      </td>
      <td className="px-4 py-5">
        <StatusIndicator status={user.status} />
      </td>
      <td className="px-4 py-5 text-right">
        <div className="flex justify-end gap-3">
          <IconAction
            icon={Eye}
            label={`Ver detalle de ${displayName}`}
            disabled={actionsDisabled}
            onClick={() => onOpenModal({ type: 'detail', user })}
          />
          {user.status === 'ACTIVE' ? (
            <IconAction
              icon={Ban}
              label={`Desactivar ${displayName}`}
              intent="primary"
              disabled={actionsDisabled}
              onClick={() => onOpenModal({ type: 'deactivate', user })}
            />
          ) : user.status === 'DEACTIVATED' ? (
            <IconAction
              icon={CheckCircle2}
              label={`Activar ${displayName}`}
              intent="success"
              disabled={actionsDisabled}
              onClick={() => onOpenModal({ type: 'activate', user })}
            />
          ) : null}
          {user.status !== 'DELETED' ? (
            <IconAction
              icon={Trash2}
              label={`Eliminar ${displayName}`}
              intent="danger"
              disabled={actionsDisabled}
              onClick={() => onOpenModal({ type: 'delete', user })}
            />
          ) : null}
        </div>
      </td>
    </tr>
  )
}

type FilterSelectProps = {
  label: string
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
}

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="text-body-md cursor-pointer appearance-none border-0 border-b border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-transparent py-3 pr-10 pl-4 text-[var(--color-on-surface)] focus:border-[var(--color-on-surface)] focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value || 'all'} value={option.value}>
            {option.label}
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

function TableHead({ children, className = '' }: { children: string; className?: string }) {
  return (
    <th className={`text-label-md px-4 py-4 uppercase text-[var(--color-outline)] ${className}`}>
      {children}
    </th>
  )
}

function RoleBadge({ role, disabled }: { role: AdminUserRole; disabled: boolean }) {
  const label = role === 'PRODUCER' ? 'Productor' : 'Cliente'
  const className =
    role === 'PRODUCER'
      ? 'bg-[var(--color-secondary-container)] text-[var(--color-secondary)]'
      : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface)]'

  return (
    <span className={`text-label-sm inline-block rounded-[var(--radius-sm)] px-3 py-1 uppercase tracking-wider ${className} ${disabled ? 'opacity-60' : ''}`}>
      {label}
    </span>
  )
}

function StatusIndicator({ status }: { status: AdminUserStatus }) {
  const labels: Record<AdminUserStatus, string> = {
    ACTIVE: 'Activa',
    DEACTIVATED: 'Desactivada',
    DELETED: 'Eliminada',
  }
  const colorClass =
    status === 'ACTIVE'
      ? 'text-[var(--color-secondary)]'
      : status === 'DELETED'
        ? 'text-[var(--color-error)]'
        : 'text-[var(--color-outline)]'
  const dotClass =
    status === 'ACTIVE'
      ? 'bg-[var(--color-secondary)]'
      : status === 'DELETED'
        ? 'bg-[var(--color-error)]'
        : 'bg-[var(--color-surface-dim)]'

  return (
    <span className={`inline-flex items-center gap-1.5 ${colorClass}`}>
      <span className={`size-2 rounded-full ${dotClass}`} />
      {labels[status]}
    </span>
  )
}

function IconAction({
  icon: Icon,
  label,
  intent = 'default',
  disabled,
  onClick,
}: {
  icon: LucideIcon
  label: string
  intent?: 'default' | 'primary' | 'success' | 'danger'
  disabled: boolean
  onClick: () => void
}) {
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
      disabled={disabled}
      onClick={onClick}
      className={`p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${colorClass}`}
    >
      <Icon size={20} strokeWidth={1.8} />
    </button>
  )
}

function PaginationButton({
  label,
  icon: Icon,
  disabled,
  onClick,
}: {
  label: string
  icon: LucideIcon
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="text-label-md grid size-10 place-items-center border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] text-[var(--color-on-surface)] transition-colors hover:border-[var(--color-on-surface)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Icon size={18} strokeWidth={1.8} />
    </button>
  )
}

function formatDate(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}
