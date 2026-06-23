import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ExternalLink, LogOut, Mail, MapPin, Plus } from 'lucide-react'
import { AgregarDireccionModal } from '../componentes/ProfileModals'

type Address = {
  id: string
  alias: string
  line1: string
  line2: string
  isDefault: boolean
}

const addresses: Address[] = [
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

export function PerfilPage() {
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#1A1A1A]">
      <main className="mx-auto max-w-[800px] px-[var(--space-margin-mobile)] py-16 md:px-0">
        {/* Page title */}
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

        {/* Datos personales */}
        <section className="mb-20">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-headline-md text-[var(--color-on-surface)]">Datos personales</h2>
          </div>

          <div className="space-y-10">
            <div className="grid grid-cols-1 gap-[var(--space-gutter)] md:grid-cols-2">
              <EditorialField id="nombre" label="Nombre" defaultValue="Alejandro Valls" type="text" />
              <EditorialField id="telefono" label="Teléfono (opcional)" placeholder="+34 600 000 000" type="tel" />
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
                className="text-label-md bg-[#7A2E3A] px-10 py-4 uppercase tracking-widest text-white shadow-[0_10px_30px_-15px_rgba(122,46,58,0.08)] transition-opacity hover:opacity-90"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </section>

        <Divider />

        {/* Mis direcciones */}
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
              <AddressCard key={addr.id} address={addr} />
            ))}
          </div>
        </section>

        <Divider />

        {/* Account actions */}
        <section className="flex flex-col items-center justify-between gap-6 pb-20 md:flex-row">
          <button
            type="button"
            className="text-label-md flex items-center gap-2 text-[var(--color-on-surface-variant)] transition-colors hover:text-[#7A2E3A]"
          >
            <LogOut size={20} strokeWidth={1.8} />
            Cerrar sesión
          </button>
          <button
            type="button"
            className="text-label-md text-[var(--color-error)]/60 underline decoration-dotted underline-offset-4 transition-colors hover:text-[var(--color-error)]"
          >
            Eliminar cuenta permanentemente
          </button>
        </section>
      </main>

      <ProfileFooter />

      {showAddModal ? <AgregarDireccionModal onClose={() => setShowAddModal(false)} /> : null}
    </div>
  )
}

function AddressCard({ address }: { address: Address }) {
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
        <button type="button" className="text-label-sm text-[var(--color-on-surface-variant)] transition-colors hover:text-[#7A2E3A]">
          Editar
        </button>
        <button type="button" className="text-label-sm text-[var(--color-on-surface-variant)] transition-colors hover:text-[#7A2E3A]">
          Eliminar
        </button>
        {!address.isDefault ? (
          <button type="button" className="text-label-sm ml-auto text-[#7A2E3A]/60 transition-colors hover:text-[#7A2E3A]">
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
  defaultValue,
  placeholder,
  type = 'text',
}: {
  id: string
  label: string
  defaultValue?: string
  placeholder?: string
  type?: string
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
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="text-body-md border-b border-[var(--color-outline-variant)] bg-transparent py-2 transition-colors focus:border-[#7A2E3A] focus:outline-none"
      />
    </div>
  )
}

function Divider() {
  return <hr className="mb-20 h-px border-0 bg-[var(--color-outline-variant)] opacity-50" />
}

function ProfileFooter() {
  const columns = [
    { title: 'Company', links: ['The Manifesto', 'Our Story'] },
    { title: 'Support', links: ['Shipping & Returns', 'Privacy Policy'] },
    { title: 'Connect', links: ['Contact Us'] },
  ]

  return (
    <footer className="border-t border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] bg-[var(--color-surface-container-low)]">
      <div className="mx-auto grid max-w-[var(--layout-container-max)] grid-cols-1 gap-[var(--space-gutter)] px-[var(--space-margin-mobile)] py-16 md:grid-cols-4 md:px-[var(--space-margin-desktop)]">
        <div className="flex flex-col gap-4">
          <span className="text-headline-md text-[var(--color-primary)]">L'Essence d'Alicante</span>
          <p className="text-body-md text-[var(--color-on-surface-variant)]">
            © 2024 L'Essence d'Alicante. Artisanal Heritage.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <span className="text-label-md uppercase tracking-widest text-[var(--color-outline)]">{col.title}</span>
            {col.links.map((link) => (
              <a key={link} href="#" className="text-label-md text-[var(--color-on-surface-variant)] underline transition-all hover:text-[var(--color-primary)]">
                {link}
              </a>
            ))}
            {col.title === 'Connect' && (
              <div className="mt-2 flex gap-4">
                <Mail size={20} strokeWidth={1.8} className="text-[var(--color-on-surface-variant)]" />
              </div>
            )}
          </div>
        ))}
      </div>
    </footer>
  )
}
