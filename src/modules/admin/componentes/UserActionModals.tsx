import type { KeyboardEvent, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Info,
  Loader2,
  Package,
  ShoppingBag,
  X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { resolveErrorMessage } from '../../../lib/errorMessages'
import { useAdminUserDetailQuery } from '../usuarios/hooks/useAdminUsers'
import {
  getAdminUserDisplayName,
  type AdminUserRole,
  type AdminUserStatus,
  type AdminUserSummary,
} from '../usuarios/usuarios.schema'

export type UserModalState =
  | { type: 'detail'; user: AdminUserSummary }
  | { type: 'activate'; user: AdminUserSummary }
  | { type: 'deactivate'; user: AdminUserSummary }
  | { type: 'delete'; user: AdminUserSummary }
  | null

type UserActionModalsProps = {
  modal: UserModalState
  onClose: () => void
  onOpenModal: (state: Exclude<UserModalState, null>) => void
  onConfirm: (type: 'activate' | 'deactivate' | 'delete', userId: string) => void
  isPending: boolean
  error: string | null
}

export function UserActionModals({
  modal,
  onClose,
  onOpenModal,
  onConfirm,
  isPending,
  error,
}: UserActionModalsProps) {
  if (modal?.type === 'detail') {
    return <UserDetailDrawer user={modal.user} onClose={onClose} onOpenModal={onOpenModal} />
  }

  if (modal?.type === 'activate') {
    return (
      <ActivateUserModal
        user={modal.user}
        onClose={onClose}
        onConfirm={() => onConfirm('activate', modal.user.id)}
        isPending={isPending}
        error={error}
      />
    )
  }

  if (modal?.type === 'deactivate') {
    return (
      <DeactivateUserModal
        user={modal.user}
        onClose={onClose}
        onConfirm={() => onConfirm('deactivate', modal.user.id)}
        isPending={isPending}
        error={error}
      />
    )
  }

  if (modal?.type === 'delete') {
    return (
      <DeleteUserModal
        user={modal.user}
        onClose={onClose}
        onConfirm={() => onConfirm('delete', modal.user.id)}
        isPending={isPending}
        error={error}
      />
    )
  }

  return null
}

function UserDetailDrawer({
  user,
  onClose,
  onOpenModal,
}: {
  user: AdminUserSummary
  onClose: () => void
  onOpenModal: (state: Exclude<UserModalState, null>) => void
}) {
  const navigate = useNavigate()
  const detailQuery = useAdminUserDetailQuery(user.id)
  const detail = detailQuery.data
  const currentUser = detail ?? user
  const displayName = getAdminUserDisplayName(currentUser)
  const isDeleted = currentUser.status === 'DELETED'

  function handleModerate() {
    onClose()
    navigate(`/admin/moderacion?q=${encodeURIComponent(displayName)}`)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-detail-title"
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        aria-label="Cerrar detalle de usuario"
        onClick={onClose}
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-on-surface)_20%,transparent)]"
      />

      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-[color-mix(in_srgb,var(--color-secondary)_35%,transparent)] bg-[var(--color-background)] shadow-[0_20px_60px_-20px_rgba(28,27,27,0.35)]">
        <header className="flex shrink-0 items-start justify-between border-b border-[color-mix(in_srgb,var(--color-secondary)_25%,transparent)] px-8 py-8">
          <div>
            <h2 id="user-detail-title" className="text-headline-lg mb-3 text-[var(--color-on-surface)]">
              {displayName}
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <RoleBadge role={currentUser.role} />
              <StatusPill status={currentUser.status} />
            </div>
          </div>
          <button
            type="button"
            aria-label="Cerrar panel"
            autoFocus
            onClick={onClose}
            className="-mr-2 rounded-[var(--radius-sm)] p-2 text-[var(--color-outline)] transition-colors hover:text-[var(--color-on-surface)] focus:ring-2 focus:ring-[var(--color-secondary-container)] focus:outline-none"
          >
            <X size={22} strokeWidth={1.8} />
          </button>
        </header>

        <div className="flex-1 space-y-12 overflow-y-auto p-8" aria-busy={detailQuery.isLoading}>
          {detailQuery.isLoading ? (
            <div className="flex min-h-48 items-center justify-center gap-3 text-[var(--color-outline)]" aria-live="polite">
              <Loader2 size={22} className="animate-spin" />
              <span className="text-body-md">Cargando detalle...</span>
            </div>
          ) : detailQuery.isError ? (
            <div
              role="alert"
              className="rounded-[var(--radius-sm)] bg-[var(--color-error-container)] p-5 text-[var(--color-error)]"
            >
              <p className="text-body-md">{resolveErrorMessage(detailQuery.error)}</p>
              <button
                type="button"
                onClick={() => void detailQuery.refetch()}
                disabled={detailQuery.isFetching}
                className="text-label-md mt-4 inline-flex items-center gap-2 border border-current px-4 py-2 disabled:cursor-wait disabled:opacity-60"
              >
                <Loader2 size={15} className={detailQuery.isFetching ? 'animate-spin' : ''} />
                {detailQuery.isFetching ? 'Reintentando...' : 'Reintentar'}
              </button>
            </div>
          ) : detail ? (
            <>
              {detail.avatar ? (
                <img
                  src={detail.avatar}
                  alt={`Avatar de ${displayName}`}
                  className="size-24 rounded-full border border-[color-mix(in_srgb,var(--color-secondary)_35%,transparent)] object-cover"
                />
              ) : null}

              <DrawerSection title="Información de cuenta">
                <InfoField label="Correo electrónico" value={detail.email} />
                <InfoField label="Correo verificado" value={detail.emailVerified ? 'Sí' : 'No'} />
                <InfoField label="Fecha de registro" value={formatDate(detail.createdAt)} />
                <InfoField label="Última actualización" value={formatDate(detail.updatedAt)} />
              </DrawerSection>

              {detail.role === 'PRODUCER' ? (
                <DrawerSection title="Detalles del productor">
                  <InfoField label="Emprendimiento" value={detail.businessName ?? 'Sin nombre comercial'} />
                </DrawerSection>
              ) : null}

              <DrawerSection title="Resumen de actividad">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <MetricCard
                    icon={Package}
                    value={String(detail.activity.publishedProductCount)}
                    label="Productos publicados"
                  />
                  <MetricCard
                    icon={ShoppingBag}
                    value={String(detail.activity.orderCount)}
                    label="Pedidos totales"
                  />
                  <MetricCard
                    icon={AlertTriangle}
                    value={String(detail.activity.activeOrderCount)}
                    label="Pedidos activos"
                  />
                </div>
              </DrawerSection>
            </>
          ) : null}
        </div>

        <footer className="shrink-0 border-t border-[color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--color-background)] p-8">
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={handleModerate}
              className="text-label-md group flex w-full items-center justify-center gap-2 bg-[var(--color-primary-container)] px-6 py-4 text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary)]"
            >
              <ExternalLink size={16} strokeWidth={1.8} />
              Ver contenido en Moderación
            </button>

            {isDeleted ? (
              <p className="text-body-md border border-[var(--color-error-container)] bg-[color-mix(in_srgb,var(--color-error-container)_35%,transparent)] p-4 text-center text-[var(--color-error)]">
                Esta cuenta fue eliminada y es de solo lectura.
              </p>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() =>
                    onOpenModal(
                      currentUser.status === 'ACTIVE'
                        ? { type: 'deactivate', user: currentUser }
                        : { type: 'activate', user: currentUser },
                    )
                  }
                  className="text-label-md w-full border border-[var(--color-on-surface)] px-6 py-4 text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-container-low)]"
                >
                  {currentUser.status === 'ACTIVE' ? 'Desactivar cuenta' : 'Activar cuenta'}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenModal({ type: 'delete', user: currentUser })}
                  className="text-label-md w-full bg-[var(--color-error)] px-6 py-4 text-[var(--color-on-error)] transition-colors hover:bg-[var(--color-on-error-container)]"
                >
                  Eliminar cuenta
                </button>
              </>
            )}
          </div>
        </footer>
      </aside>
    </div>
  )
}

type ConfirmModalProps = {
  user: AdminUserSummary
  onClose: () => void
  onConfirm: () => void
  isPending: boolean
  error: string | null
}

function ActivateUserModal({ user, onClose, onConfirm, isPending, error }: ConfirmModalProps) {
  const displayName = getAdminUserDisplayName(user)

  return (
    <CenteredOverlay
      onClose={onClose}
      disableClose={isPending}
      titleId="activate-user-title"
    >
      <section className="relative z-10 flex w-full max-w-md flex-col items-center border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-[var(--color-background)] p-10 text-center shadow-[0_20px_40px_-15px_rgba(28,27,27,0.15)]">
        <div className="mb-6 flex size-16 items-center justify-center rounded-[var(--radius-xl)] border border-[color-mix(in_srgb,var(--color-secondary)_35%,transparent)] bg-[var(--color-surface-container-low)] text-[var(--color-primary-container)]">
          <CheckCircle2 size={38} strokeWidth={1.8} />
        </div>
        <h2 id="activate-user-title" className="text-headline-lg mb-2 text-[var(--color-on-surface)]">
          Activar cuenta
        </h2>
        <p className="text-label-sm mb-1 uppercase tracking-wider text-[var(--color-outline)]">
          {displayName}
        </p>
        <p className="text-body-md mx-auto mb-8 max-w-xs leading-relaxed text-[var(--color-outline)]">
          ¿Está seguro de que desea activar esta cuenta? Se restaurará el acceso del usuario.
        </p>
        <ModalError error={error} />
        <div className="mt-6 flex w-full flex-col gap-4">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending || user.status === 'DELETED'}
            className="text-label-md group flex w-full items-center justify-center gap-2 bg-[var(--color-primary-container)] px-6 py-4 text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} strokeWidth={1.8} />}
            {isPending ? 'Activando...' : 'Activar'}
          </button>
          <SecondaryButton onClick={onClose} disabled={isPending} />
        </div>
      </section>
    </CenteredOverlay>
  )
}

function DeactivateUserModal({ user, onClose, onConfirm, isPending, error }: ConfirmModalProps) {
  return (
    <CenteredOverlay
      onClose={onClose}
      disableClose={isPending}
      titleId="deactivate-user-title"
    >
      <section className="relative z-10 flex w-full max-w-[480px] flex-col border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-[var(--color-background)] shadow-[0_20px_40px_-10px_rgba(28,27,27,0.15)]">
        <div className="px-8 pt-10 pb-6">
          <h2 id="deactivate-user-title" className="text-headline-md text-[var(--color-on-surface)]">
            Desactivar cuenta
          </h2>
          <p className="text-label-sm mt-1 uppercase tracking-wider text-[var(--color-outline)]">
            {getAdminUserDisplayName(user)}
          </p>
        </div>
        <div className="flex flex-col gap-6 px-8 pb-8">
          <p className="text-body-md text-[var(--color-on-surface-variant)]">
            ¿Está seguro de que desea suspender temporalmente el acceso de esta cuenta?
          </p>
          {user.role === 'PRODUCER' ? (
            <div className="flex items-start gap-3 border-l-[3px] border-[color-mix(in_srgb,var(--color-primary-container)_40%,transparent)] bg-[var(--color-surface-container-low)] p-4">
              <AlertTriangle size={24} strokeWidth={1.8} className="shrink-0 text-[var(--color-primary-container)]" />
              <p className="text-body-md text-[var(--color-on-surface)]">
                Sus productos dejarán de ser visibles en el catálogo de forma inmediata.
              </p>
            </div>
          ) : null}
          <ModalError error={error} />
        </div>
        <footer className="flex items-center justify-end gap-4 border-t border-[color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--color-background)] px-8 py-6">
          <SecondaryButton onClick={onClose} disabled={isPending} compact />
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending || user.status === 'DELETED'}
            className="text-label-md inline-flex items-center gap-2 bg-[var(--color-primary-container)] px-6 py-2.5 text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
            {isPending ? 'Desactivando...' : 'Desactivar'}
          </button>
        </footer>
      </section>
    </CenteredOverlay>
  )
}

function DeleteUserModal({ user, onClose, onConfirm, isPending, error }: ConfirmModalProps) {
  return (
    <CenteredOverlay onClose={onClose} disableClose={isPending} titleId="delete-user-title">
      <section className="relative z-10 w-full max-w-[520px] overflow-hidden border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-[var(--color-background)] shadow-[0_20px_60px_-15px_rgba(28,27,27,0.2)]">
        <div className="h-1 w-full bg-[var(--color-error)]" />
        <div className="flex flex-col gap-8 p-8 text-center md:p-10">
          <div className="flex flex-col items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-[var(--radius-xl)] border border-[var(--color-error-container)] bg-[color-mix(in_srgb,var(--color-error-container)_30%,transparent)] text-[var(--color-error)]">
              <AlertTriangle size={28} strokeWidth={1.8} />
            </div>
            <div>
              <h2 id="delete-user-title" className="text-headline-lg text-[var(--color-on-surface)]">
                Eliminar cuenta
              </h2>
              <p className="text-label-sm mt-1 uppercase tracking-wider text-[var(--color-outline)]">
                {getAdminUserDisplayName(user)}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <p className="text-body-lg text-[var(--color-on-surface-variant)]">
              ¿Está seguro de que desea eliminar esta cuenta? Esta acción dará de baja la cuenta y{' '}
              <strong className="font-semibold text-[var(--color-on-surface)]">no puede deshacerse</strong>.
            </p>
            <div className="flex items-start gap-4 border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-[var(--color-surface-container-low)] p-5 text-left">
              <Info size={23} strokeWidth={1.8} className="mt-0.5 shrink-0 text-[var(--color-outline)]" />
              <p className="text-body-md text-[var(--color-on-surface-variant)]">
                No es posible eliminar esta cuenta mientras tenga pedidos activos. Puede desactivarla temporalmente.
              </p>
            </div>
            <ModalError error={error} />
          </div>

          <div className="mt-4 flex flex-col-reverse justify-center gap-4 border-t border-[color-mix(in_srgb,var(--color-secondary)_35%,transparent)] pt-6 sm:flex-row">
            <SecondaryButton onClick={onClose} disabled={isPending} bordered />
            <button
              type="button"
              onClick={onConfirm}
              disabled={isPending || user.status === 'DELETED'}
              className="text-label-md inline-flex items-center justify-center gap-2 border border-[var(--color-error)] bg-[var(--color-error)] px-8 py-3.5 text-[var(--color-on-error)] shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
              {isPending ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </section>
    </CenteredOverlay>
  )
}

function CenteredOverlay({
  children,
  onClose,
  disableClose,
  titleId,
}: {
  children: ReactNode
  onClose: () => void
  disableClose: boolean
  titleId: string
}) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape' && !disableClose) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        aria-label="Cerrar modal"
        onClick={onClose}
        disabled={disableClose}
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-on-surface)_24%,transparent)] backdrop-blur-[2px] disabled:cursor-wait"
      />
      {children}
    </div>
  )
}

function ModalError({ error }: { error: string | null }) {
  return error ? (
    <p
      role="alert"
      aria-live="assertive"
      className="text-body-md w-full rounded-[var(--radius-sm)] bg-[var(--color-error-container)] p-4 text-left text-[var(--color-error)]"
    >
      {error}
    </p>
  ) : null
}

function SecondaryButton({
  onClick,
  disabled,
  compact = false,
  bordered = false,
}: {
  onClick: () => void
  disabled: boolean
  compact?: boolean
  bordered?: boolean
}) {
  return (
    <button
      type="button"
      autoFocus
      onClick={onClick}
      disabled={disabled}
      className={`text-label-md text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-container-low)] disabled:cursor-not-allowed disabled:opacity-50 ${
        compact ? 'px-5 py-2.5' : 'w-full px-6 py-4 sm:w-auto'
      } ${bordered ? 'border border-[var(--color-on-surface)] px-8 py-3.5' : 'border border-[color-mix(in_srgb,var(--color-on-surface)_10%,transparent)]'}`}
    >
      Cancelar
    </button>
  )
}

function RoleBadge({ role }: { role: AdminUserRole }) {
  const producer = role === 'PRODUCER'
  return (
    <span className={`text-label-sm rounded-[var(--radius-sm)] px-3 py-1 uppercase tracking-wider ${producer ? 'bg-[var(--color-secondary-container)] text-[var(--color-secondary)]' : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface)]'}`}>
      {producer ? 'Productor' : 'Cliente'}
    </span>
  )
}

function StatusPill({ status }: { status: AdminUserStatus }) {
  const labels: Record<AdminUserStatus, string> = {
    ACTIVE: 'Activa',
    DEACTIVATED: 'Desactivada',
    DELETED: 'Eliminada',
  }
  const className =
    status === 'ACTIVE'
      ? 'bg-[var(--color-tertiary-fixed)] text-[var(--color-tertiary)]'
      : status === 'DELETED'
        ? 'bg-[var(--color-error-container)] text-[var(--color-error)]'
        : 'bg-[var(--color-surface-container)] text-[var(--color-outline)]'

  return (
    <span className={`text-label-sm inline-flex items-center rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-secondary)_25%,transparent)] px-3 py-1 ${className}`}>
      {labels[status]}
    </span>
  )
}

function DrawerSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="text-headline-md mb-6 text-[var(--color-on-surface)]">{title}</h3>
      <div className="grid grid-cols-1 gap-6">{children}</div>
    </section>
  )
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-[color-mix(in_srgb,var(--color-secondary)_25%,transparent)] pb-4">
      <p className="text-label-sm mb-1 uppercase tracking-wider text-[var(--color-outline)]">{label}</p>
      <p className="text-body-md text-[var(--color-on-surface)]">{value}</p>
    </div>
  )
}

function MetricCard({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) {
  return (
    <div className="flex min-h-32 flex-col items-center justify-center border border-[color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--color-surface-container-low)] p-4 text-center">
      <Icon size={22} strokeWidth={1.7} className="mb-3 text-[var(--color-outline)]" />
      <span className="text-headline-md mb-1 text-[var(--color-on-surface)]">{value}</span>
      <span className="text-label-sm uppercase tracking-wider text-[var(--color-outline)]">{label}</span>
    </div>
  )
}

function formatDate(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(date)
}
