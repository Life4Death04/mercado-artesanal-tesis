import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, ExternalLink, LogOut, MapPin, Plus } from 'lucide-react'
import { AgregarDireccionModal, EditarDireccionModal, type NewAddressInput, type EditAddressInput } from '../componentes/ProfileModals'

type Address = {
  id: string
  alias: string
  line1: string
  line2: string
  isDefault: boolean
}

type ProfileFormState = {
  name: string
  phone: string
}

const initialAddresses: Address[] = [
  {
    id: 'addr-1',
    alias: 'Casa',
    line1: 'Calle del Teatro, 14, 3º Izquierda',
    line2: '03001 Alicante, España',
    isDefault: true,
  },
  {
    id: 'addr-2',
    alias: 'Trabajo',
    line1: 'Avenida de la Constitución, 2',
    line2: '03002 Alicante, España',
    isDefault: false,
  },
]

const initialProfile: ProfileFormState = {
  name: 'Alejandro Valls',
  phone: '+34 600 000 000',
}

export function PerfilPage() {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(initialProfile)
  const [addresses, setAddresses] = useState(initialAddresses)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  function handleToggleEdit() {
    setIsEditing((editing) => !editing)
  }

  function handleSaveAddress(address: NewAddressInput) {
    setAddresses((currentAddresses) => {
      const nextAddresses = address.isDefault
        ? currentAddresses.map((currentAddress) => ({ ...currentAddress, isDefault: false }))
        : currentAddresses

      return [
        ...nextAddresses,
        {
          id: `addr-${Date.now()}`,
          alias: address.alias,
          line1: address.line1,
          line2: address.line2,
          isDefault: address.isDefault,
        },
      ]
    })
  }

  function handleEditAddress(addressId: string, updates: EditAddressInput) {
    setAddresses((currentAddresses) =>
      currentAddresses.map((address) => {
        if (address.id !== addressId) {
          return updates.isDefault ? { ...address, isDefault: false } : address
        }

        return { ...address, ...updates }
      }),
    )
  }

  function handleDeleteAddress(addressId: string) {
    setAddresses((currentAddresses) => currentAddresses.filter((address) => address.id !== addressId))
  }

  function handleMarkDefault(addressId: string) {
    setAddresses((currentAddresses) =>
      currentAddresses.map((address) => ({
        ...address,
        isDefault: address.id === addressId,
      })),
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#1A1A1A]">
      <main className="mx-auto max-w-[800px] px-[var(--space-margin-mobile)] py-16 md:px-0">
        <section className="mb-16">
          <nav aria-label="Breadcrumb" className="text-label-sm mb-4 flex items-center gap-2 text-[var(--color-on-surface-variant)]/70">
            <Link to="/productos" className="transition-colors hover:text-[var(--color-primary)]">
              Área consumidor
            </Link>
            <ChevronRight size={14} strokeWidth={1.8} />
            <span className="text-[var(--color-on-surface)]">Mi perfil</span>
          </nav>
          <h1 className="text-headline-lg text-[var(--color-on-surface)]">Mi perfil</h1>
          <p className="text-body-md mt-2 text-[var(--color-on-surface-variant)]">
            Gestiona tu información personal, direcciones y preferencias de cuenta.
          </p>
        </section>

        <section className="mb-20">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-headline-md text-[var(--color-on-surface)]">Datos personales</h2>
          </div>

          <div className="space-y-10">
            <div className="grid grid-cols-1 gap-[var(--space-gutter)] md:grid-cols-2">
              <EditorialField id="nombre" label="Nombre" value={profile.name} onChange={(value) => setProfile((current) => ({ ...current, name: value }))} type="text" disabled={!isEditing} />
              <EditorialField id="telefono" label="Teléfono (opcional)" value={profile.phone} onChange={(value) => setProfile((current) => ({ ...current, phone: value }))} placeholder="+34 600 000 000" type="tel" disabled={!isEditing} />
            </div>

            <div className="grid grid-cols-1 items-center gap-[var(--space-gutter)] md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <span className="text-label-md uppercase tracking-wider text-[var(--color-outline)]">
                  Correo electrónico
                </span>
                <div className="flex items-center gap-3 py-2">
                  <span className="text-body-md text-[var(--color-on-surface-variant)]">alejandro.valls@example.com</span>
                  <span className="rounded-full bg-[var(--color-secondary-container)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter text-[var(--color-on-secondary-container)]">
                    Verificado
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-label-md uppercase tracking-wider text-[var(--color-outline)]">Contraseña</span>
                <a
                  href="#"
                  className="text-label-md flex items-center gap-2 py-2 text-[#7A2E3A] transition-all hover:underline"
                >
                  Cambiar contraseña
                  <ExternalLink size={16} strokeWidth={1.8} />
                </a>
                <p className="text-label-sm text-[var(--color-outline)] italic">
                  Serás redirigido a nuestro portal de seguridad Auth0.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={handleToggleEdit}
                className="text-label-md bg-[#7A2E3A] px-10 py-4 uppercase tracking-widest text-white shadow-[0_10px_30px_-15px_rgba(122,46,58,0.08)] transition-opacity hover:opacity-90"
              >
                {isEditing ? 'Guardar cambios' : 'Editar perfil'}
              </button>
            </div>
          </div>
        </section>

        <Divider />

        <section className="mb-20">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-headline-md text-[var(--color-on-surface)]">Mis direcciones</h2>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="text-label-md flex items-center gap-2 text-[#7A2E3A] transition-opacity hover:opacity-70"
            >
              <Plus size={18} strokeWidth={1.8} />
              Añadir dirección
            </button>
          </div>

          <div className="grid grid-cols-1 gap-[var(--space-gutter)] md:grid-cols-2">
            {addresses.map((addr) => (
              <AddressCard key={addr.id} address={addr} onEdit={() => setEditingAddress(addr)} onDelete={() => handleDeleteAddress(addr.id)} onMarkDefault={() => handleMarkDefault(addr.id)} />
            ))}
          </div>
        </section>

        <Divider />

        <section className="flex flex-col items-center justify-between gap-6 pb-20 md:flex-row">
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="text-label-md flex items-center gap-2 text-[var(--color-on-surface-variant)] transition-colors hover:text-[#7A2E3A]"
          >
            <LogOut size={20} strokeWidth={1.8} />
            Cerrar sesión
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-label-md text-[var(--color-error)]/60 underline decoration-dotted underline-offset-4 transition-colors hover:text-[var(--color-error)]"
          >
            Eliminar cuenta permanentemente
          </button>
        </section>
      </main>


      {showAddModal ? <AgregarDireccionModal onClose={() => setShowAddModal(false)} onSave={handleSaveAddress} /> : null}
      {editingAddress ? (
        <EditarDireccionModal
          address={editingAddress}
          onClose={() => setEditingAddress(null)}
          onSave={(updates) => {
            handleEditAddress(editingAddress.id, updates)
            setEditingAddress(null)
          }}
        />
      ) : null}
      {showLogoutConfirm ? (
        <ConfirmationModal
          title="Cerrar sesión"
          description="¿Deseas cerrar tu sesión actual y volver al acceso principal?"
          confirmLabel="Cerrar sesión"
          onCancel={() => setShowLogoutConfirm(false)}
          onConfirm={() => navigate('/login')}
        />
      ) : null}
      {showDeleteConfirm ? (
        <ConfirmationModal
          title="Eliminar cuenta"
          description="Esta acción es solo demostrativa para la tesis. Se cerrará la sesión y volverás al acceso principal."
          confirmLabel="Eliminar cuenta"
          danger
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={() => navigate('/login')}
        />
      ) : null}
    </div>
  )
}

function AddressCard({ address, onEdit, onDelete, onMarkDefault }: { address: Address; onEdit: () => void; onDelete: () => void; onMarkDefault: () => void }) {
  return (
    <div
      className={`group border p-8 bg-white transition-all ${
        address.isDefault
          ? 'border-[var(--color-outline-variant)] shadow-[0_10px_30px_-15px_rgba(122,46,58,0.08)]'
          : 'border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] bg-white/50 hover:border-[var(--color-outline-variant)] hover:bg-white'
      }`}
    >
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-label-md uppercase tracking-widest text-[var(--color-outline)]">{address.alias}</h3>
        {address.isDefault ? (
          <span className="border border-[#7A2E3A] px-2 py-0.5 text-[10px] font-bold uppercase text-[#7A2E3A]">
            Predeterminada
          </span>
        ) : null}
      </div>

      <div className="text-body-md mb-6 flex items-start gap-2 leading-relaxed text-[var(--color-on-surface)]">
        <MapPin size={16} strokeWidth={1.8} className="mt-1 shrink-0 text-[var(--color-outline)]" />
        <span>
          {address.line1}
          <br />
          {address.line2}
        </span>
      </div>

      <div className="flex gap-4 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] pt-4">
        <button type="button" onClick={onEdit} className="text-label-sm text-[var(--color-on-surface-variant)] transition-colors hover:text-[#7A2E3A]">
          Editar
        </button>
        <button type="button" onClick={onDelete} className="text-label-sm text-[var(--color-on-surface-variant)] transition-colors hover:text-[#7A2E3A]">
          Eliminar
        </button>
        {!address.isDefault ? (
          <button type="button" onClick={onMarkDefault} className="text-label-sm ml-auto text-[#7A2E3A]/60 transition-colors hover:text-[#7A2E3A]">
            Marcar predeterminada
          </button>
        ) : null}
      </div>
    </div>
  )
}

function EditorialField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-label-md uppercase tracking-wider text-[var(--color-outline)]"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`text-body-md border-b border-[var(--color-outline-variant)] bg-transparent py-2 transition-colors focus:border-[#7A2E3A] focus:outline-none ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
      />
    </div>
  )
}

function Divider() {
  return <hr className="mb-20 h-px border-0 bg-[var(--color-outline-variant)] opacity-50" />
}

function ConfirmationModal({ title, description, confirmLabel, danger = false, onCancel, onConfirm }: { title: string; description: string; confirmLabel: string; danger?: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-on-surface)]/40 p-4 backdrop-blur-[1px]" role="dialog" aria-modal="true" aria-labelledby="profile-confirmation-title">
      <div className="w-full max-w-md bg-[#FAF7F0] p-8 shadow-2xl">
        <h2 id="profile-confirmation-title" className="text-headline-md text-[var(--color-on-surface)]">{title}</h2>
        <p className="text-body-md mt-3 text-[var(--color-on-surface-variant)]">{description}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="text-label-md border border-[var(--color-outline-variant)] px-6 py-3 text-[var(--color-on-surface-variant)] transition-colors hover:bg-[var(--color-surface-container-low)]">
            Cancelar
          </button>
          <button type="button" onClick={onConfirm} className={`text-label-md px-6 py-3 text-white transition-colors ${danger ? 'bg-[var(--color-error)] hover:brightness-110' : 'bg-[#7A2E3A] hover:bg-[#63222d]'}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
