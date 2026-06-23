import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { AlertTriangle, ArrowRight, CheckCircle2, ExternalLink, Info, Package, ShoppingBag, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export type AdminUser = {
  id: number
  name: string
  email: string
  role: 'Cliente' | 'Productor'
  status: 'Activa' | 'Desactivada'
  registeredAt: string
  coverImage?: string
  municipality?: string
  productsPublished?: number
  totalOrders?: number
}

export type UserModalState =
  | { type: 'detail'; user: AdminUser }
  | { type: 'activate'; user: AdminUser }
  | { type: 'deactivate'; user: AdminUser }
  | { type: 'delete'; user: AdminUser }
  | null

type UserActionModalsProps = {
  modal: UserModalState
  onClose: () => void
  onOpenModal: (state: UserModalState) => void
  onConfirm: (type: 'activate' | 'deactivate' | 'delete', userId: number) => void
}

export function UserActionModals({ modal, onClose, onOpenModal, onConfirm }: UserActionModalsProps) {
  if (modal?.type === 'detail') {
    return (
      <UserDetailDrawer
        user={modal.user}
        onClose={onClose}
        onOpenModal={onOpenModal}
      />
    )
  }

  if (modal?.type === 'activate') {
    return (
      <ActivateUserModal
        user={modal.user}
        onClose={onClose}
        onConfirm={() => onConfirm('activate', modal.user.id)}
      />
    )
  }

  if (modal?.type === 'deactivate') {
    return (
      <DeactivateUserModal
        user={modal.user}
        onClose={onClose}
        onConfirm={() => onConfirm('deactivate', modal.user.id)}
      />
    )
  }

  if (modal?.type === 'delete') {
    return (
      <DeleteUserModal
        user={modal.user}
        onClose={onClose}
        onConfirm={() => onConfirm('delete', modal.user.id)}
      />
    )
  }

  return null
}

// ---------------------------------------------------------------------------
// UserDetailDrawer
// ---------------------------------------------------------------------------

type UserDetailDrawerProps = {
  user: AdminUser
  onClose: () => void
  onOpenModal: (state: UserModalState) => void
}

function UserDetailDrawer({ user, onClose, onOpenModal }: UserDetailDrawerProps) {
  const navigate = useNavigate()

  function handleModerate() {
    onClose()
    navigate(`/admin/moderacion?q=${encodeURIComponent(user.name)}`)
  }

  function handleToggleStatus() {
    onOpenModal(
      user.status === 'Activa'
        ? { type: 'deactivate', user }
        : { type: 'activate', user },
    )
  }

  function handleDelete() {
    onOpenModal({ type: 'delete', user })
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-end" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Cerrar detalle de usuario"
        onClick={onClose}
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-on-surface)_20%,transparent)]"
      />

      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-[color-mix(in_srgb,var(--color-secondary)_35%,transparent)] bg-[var(--color-background)] shadow-[0_20px_60px_-20px_rgba(28,27,27,0.35)]">
        {/* Header */}
        <header className="flex shrink-0 items-start justify-between border-b border-[color-mix(in_srgb,var(--color-secondary)_25%,transparent)] px-8 py-8">
          <div>
            <h2 className="text-headline-lg mb-3 text-[var(--color-on-surface)]">{user.name}</h2>
            <div className="flex flex-wrap items-center gap-3">
              <RoleBadge role={user.role} />
              <StatusPill status={user.status} />
            </div>
          </div>
          <button
            type="button"
            aria-label="Cerrar panel"
            onClick={onClose}
            className="-mr-2 rounded-[var(--radius-sm)] p-2 text-[var(--color-outline)] transition-colors hover:text-[var(--color-on-surface)] focus:ring-2 focus:ring-[var(--color-secondary-container)] focus:outline-none"
          >
            <X size={22} strokeWidth={1.8} />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 space-y-12 overflow-y-auto p-8">
          {user.coverImage && (
            <img
              src={user.coverImage}
              alt={`Portada de ${user.name}`}
              className="h-48 w-full object-cover"
            />
          )}

          <DrawerSection title="Información de cuenta">
            <InfoField label="Correo electrónico" value={user.email} />
            <InfoField label="Fecha de registro" value={user.registeredAt} />
          </DrawerSection>

          {user.role === 'Productor' && (
            <DrawerSection title="Detalles del productor">
              <InfoField label="Emprendimiento" value={user.name} />
              <InfoField label="Municipio" value={user.municipality ?? 'Alicante'} />
            </DrawerSection>
          )}

          <DrawerSection title="Resumen de actividad">
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                icon={Package}
                value={String(user.productsPublished ?? 12)}
                label="Productos publicados"
              />
              <MetricCard
                icon={ShoppingBag}
                value={String(user.totalOrders ?? 38)}
                label="Pedidos totales"
              />
            </div>
          </DrawerSection>
        </div>

        {/* Footer — actions */}
        <footer className="shrink-0 border-t border-[color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--color-background)] p-8">
          <div className="flex flex-col gap-4">
            {/* Ver contenido del usuario en Moderación */}
            <button
              type="button"
              onClick={handleModerate}
              className="text-label-md group flex w-full items-center justify-center gap-2 bg-[var(--color-primary-container)] px-6 py-4 text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary)]"
            >
              <ExternalLink size={16} strokeWidth={1.8} />
              Ver contenido en Moderación
            </button>

            {/* Desactivar / Activar */}
            <button
              type="button"
              onClick={handleToggleStatus}
              className="text-label-md w-full border border-[var(--color-on-surface)] px-6 py-4 text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-container-low)]"
            >
              {user.status === 'Activa' ? 'Desactivar cuenta' : 'Activar cuenta'}
            </button>

            {/* Eliminar */}
            <button
              type="button"
              onClick={handleDelete}
              className="text-label-md w-full bg-[var(--color-error)] px-6 py-4 text-[var(--color-on-error)] transition-colors hover:bg-[var(--color-on-error-container)]"
            >
              Eliminar cuenta
            </button>
          </div>
        </footer>
      </aside>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ActivateUserModal
// ---------------------------------------------------------------------------

type ConfirmModalProps = {
  user: AdminUser
  onClose: () => void
  onConfirm: () => void
}

function ActivateUserModal({ user, onClose, onConfirm }: ConfirmModalProps) {
  return (
    <CenteredOverlay onClose={onClose}>
      <section className="relative z-10 flex w-full max-w-md flex-col items-center border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-[var(--color-background)] p-10 text-center shadow-[0_20px_40px_-15px_rgba(28,27,27,0.15)]">
        <div className="mb-6 flex size-16 items-center justify-center rounded-[var(--radius-xl)] border border-[color-mix(in_srgb,var(--color-secondary)_35%,transparent)] bg-[var(--color-surface-container-low)] text-[var(--color-primary-container)]">
          <CheckCircle2 size={38} strokeWidth={1.8} />
        </div>
        <h2 className="text-headline-lg mb-2 text-[var(--color-on-surface)]">Activar cuenta</h2>
        <p className="text-label-sm mb-1 uppercase tracking-wider text-[var(--color-outline)]">
          {user.name}
        </p>
        <p className="text-body-md mx-auto mb-10 max-w-xs leading-relaxed text-[var(--color-outline)]">
          ¿Está seguro de que desea activar esta cuenta? Se restaurará el acceso del usuario y se le
          enviará una notificación automática.
        </p>
        <div className="flex w-full flex-col gap-4">
          <button
            type="button"
            onClick={onConfirm}
            className="text-label-md group flex w-full items-center justify-center gap-2 bg-[var(--color-primary-container)] px-6 py-4 text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary)]"
          >
            Activar
            <ArrowRight
              size={18}
              strokeWidth={1.8}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-label-md w-full border border-[color-mix(in_srgb,var(--color-on-surface)_10%,transparent)] px-6 py-4 text-[var(--color-on-surface)] transition-colors hover:border-[color-mix(in_srgb,var(--color-on-surface)_30%,transparent)] hover:bg-[var(--color-surface-container-lowest)]"
          >
            Cancelar
          </button>
        </div>
      </section>
    </CenteredOverlay>
  )
}

// ---------------------------------------------------------------------------
// DeactivateUserModal
// ---------------------------------------------------------------------------

function DeactivateUserModal({ user, onClose, onConfirm }: ConfirmModalProps) {
  return (
    <CenteredOverlay onClose={onClose}>
      <section className="relative z-10 flex w-full max-w-[480px] flex-col border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-[var(--color-background)] shadow-[0_20px_40px_-10px_rgba(28,27,27,0.15)]">
        <div className="px-8 pt-10 pb-6">
          <h2 className="text-headline-md text-[var(--color-on-surface)]">Desactivar cuenta</h2>
          <p className="text-label-sm mt-1 uppercase tracking-wider text-[var(--color-outline)]">
            {user.name}
          </p>
        </div>
        <div className="flex flex-col gap-6 px-8 pb-8">
          <p className="text-body-md text-[var(--color-on-surface-variant)]">
            ¿Está seguro de que desea suspender temporalmente el acceso de esta cuenta?
          </p>
          <div className="flex items-start gap-3 border-l-[3px] border-[color-mix(in_srgb,var(--color-primary-container)_40%,transparent)] bg-[var(--color-surface-container-low)] p-4">
            <AlertTriangle
              size={24}
              strokeWidth={1.8}
              className="shrink-0 text-[var(--color-primary-container)]"
            />
            <p className="text-body-md text-[var(--color-on-surface)]">
              Sus productos dejarán de ser visibles en el catálogo de forma inmediata.
            </p>
          </div>
        </div>
        <footer className="flex items-center justify-end gap-4 border-t border-[color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--color-background)] px-8 py-6">
          <button
            type="button"
            onClick={onClose}
            className="text-label-md px-5 py-2.5 text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-container-low)]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="text-label-md bg-[var(--color-primary-container)] px-6 py-2.5 text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary)]"
          >
            Desactivar
          </button>
        </footer>
      </section>
    </CenteredOverlay>
  )
}

// ---------------------------------------------------------------------------
// DeleteUserModal
// ---------------------------------------------------------------------------

function DeleteUserModal({ user, onClose, onConfirm }: ConfirmModalProps) {
  return (
    <CenteredOverlay onClose={onClose}>
      <section className="relative z-10 w-full max-w-[520px] overflow-hidden border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-[var(--color-background)] shadow-[0_20px_60px_-15px_rgba(28,27,27,0.2)]">
        <div className="h-1 w-full bg-[var(--color-error)]" />
        <div className="flex flex-col gap-8 p-8 text-center md:p-10">
          <div className="flex flex-col items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-[var(--radius-xl)] border border-[var(--color-error-container)] bg-[color-mix(in_srgb,var(--color-error-container)_30%,transparent)] text-[var(--color-error)]">
              <AlertTriangle size={28} strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="text-headline-lg text-[var(--color-on-surface)]">Eliminar cuenta</h2>
              <p className="text-label-sm mt-1 uppercase tracking-wider text-[var(--color-outline)]">
                {user.name}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <p className="text-body-lg text-[var(--color-on-surface-variant)]">
              ¿Está seguro de que desea eliminar esta cuenta? Esta acción dará de baja la cuenta
              conforme a las políticas de la plataforma y{' '}
              <strong className="font-semibold text-[var(--color-on-surface)]">
                no puede deshacerse
              </strong>
              .
            </p>
            <div className="flex items-start gap-4 border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-[var(--color-surface-container-low)] p-5 text-left">
              <Info size={23} strokeWidth={1.8} className="mt-0.5 shrink-0 text-[var(--color-outline)]" />
              <p className="text-body-md text-[var(--color-on-surface-variant)]">
                No es posible eliminar esta cuenta mientras tenga pedidos activos. Puede
                desactivarla temporalmente.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col-reverse justify-center gap-4 border-t border-[color-mix(in_srgb,var(--color-secondary)_35%,transparent)] pt-6 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="text-label-md border border-[var(--color-on-surface)] px-8 py-3.5 text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-container)]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="text-label-md border border-[var(--color-error)] bg-[var(--color-error)] px-8 py-3.5 text-[var(--color-on-error)] shadow-sm transition-opacity hover:opacity-90"
            >
              Eliminar
            </button>
          </div>
        </div>
      </section>
    </CenteredOverlay>
  )
}

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

function CenteredOverlay({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-on-surface)_24%,transparent)] backdrop-blur-[2px]"
      />
      {children}
    </div>
  )
}

function RoleBadge({ role }: { role: AdminUser['role'] }) {
  const className =
    role === 'Productor'
      ? 'bg-[var(--color-secondary-container)] text-[var(--color-secondary)]'
      : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface)]'

  return (
    <span
      className={`text-label-sm rounded-[var(--radius-sm)] px-3 py-1 uppercase tracking-wider ${className}`}
    >
      {role}
    </span>
  )
}

function StatusPill({ status }: { status: AdminUser['status'] }) {
  const active = status === 'Activa'

  return (
    <span
      className={`text-label-sm inline-flex items-center rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-secondary)_25%,transparent)] px-3 py-1 ${
        active
          ? 'bg-[var(--color-tertiary-fixed)] text-[var(--color-tertiary)]'
          : 'bg-[var(--color-surface-container)] text-[var(--color-outline)]'
      }`}
    >
      <span
        className={`mr-2 size-1.5 rounded-full ${
          active ? 'bg-[var(--color-primary-container)]' : 'bg-[var(--color-surface-dim)]'
        }`}
      />
      {status}
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
      <p className="text-label-sm mb-1 uppercase tracking-wider text-[var(--color-outline)]">
        {label}
      </p>
      <p className="text-body-md text-[var(--color-on-surface)]">{value}</p>
    </div>
  )
}

function MetricCard({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center border border-[color-mix(in_srgb,var(--color-secondary)_25%,transparent)] bg-[var(--color-surface-container-low)] p-6 text-center">
      <Icon size={24} strokeWidth={1.7} className="mb-3 text-[var(--color-outline)]" />
      <span className="text-headline-lg mb-1 text-[var(--color-on-surface)]">{value}</span>
      <span className="text-label-sm uppercase tracking-wider text-[var(--color-outline)]">
        {label}
      </span>
    </div>
  )
}
