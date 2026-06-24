import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart2,
  BookOpen,
  MapPin,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  User,
} from 'lucide-react'
import {
  AgregarPuntoModal,
  EliminarPuntoModal,
  type PuntoRecogida,
} from '../componentes/ModalidadesEntregaModals'

// ---------------------------------------------------------------------------
// Nav
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { icon: ShoppingBag, label: 'Mis pedidos', to: '/productor/pedidos', active: false },
  { icon: BookOpen, label: 'Mi catálogo', to: '/productor/productos', active: false },
  { icon: Package, label: 'Inventario', to: '/productor/inventario', active: false },
  { icon: BarChart2, label: 'Estadísticas', to: '/productor/estadisticas', active: false },
  { icon: Truck, label: 'Configuración de entregas', to: '/productor/entregas', active: true },
]

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type EntregaPersonalState = {
  activa: boolean
  ambito: string
  coste: string
  notas: string
}

type MensajeriaState = {
  activa: boolean
  empresa: string
  ambito: string
  coste: string
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const puntosIniciales: PuntoRecogida[] = [
  {
    id: 'pr-1',
    nombre: 'Tienda Finca Alicante',
    calle: 'Calle Mayor 12',
    municipio: 'Alicante',
    codigoPostal: '03002',
    horario: '09:00 – 20:00',
  },
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function ModalidadesEntregaPage() {
  // --- Entrega personal state ---
  const [entregaPersonal, setEntregaPersonal] = useState<EntregaPersonalState>({
    activa: true,
    ambito: 'Alicante y alrededores',
    coste: '0.00€',
    notas: 'Entregas solo los sábados por la mañana',
  })

  // --- Mensajería state ---
  const [mensajeria, setMensajeria] = useState<MensajeriaState>({
    activa: true,
    empresa: 'Seur / MRW',
    ambito: 'Nacional',
    coste: '5.50€',
  })

  // --- Puntos de recogida state ---
  const [puntosActiva, setPuntosActiva] = useState(true)
  const [puntos, setPuntos] = useState<PuntoRecogida[]>(puntosIniciales)

  // Modal state
  const [showAgregar, setShowAgregar] = useState(false)
  const [puntoAEliminar, setPuntoAEliminar] = useState<PuntoRecogida | null>(null)

  function agregarPunto(datos: Omit<PuntoRecogida, 'id'>) {
    setPuntos((prev) => [...prev, { ...datos, id: `pr-${Date.now()}` }])
  }

  function eliminarPunto(id: string) {
    setPuntos((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-surface)] text-[var(--color-on-surface)]">
      {/* ── Sidebar ── */}
      <aside className="hidden">
        <div className="mb-12">
          <Link to="/" className="text-headline-md font-bold text-[var(--color-primary)]">
            Alicante Gourmet
          </Link>
          <p className="text-body-md mt-2 text-[var(--color-secondary)]">Artesano de Denia</p>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {NAV_ITEMS.map(({ icon: Icon, label, to, active }) => (
            <Link
              key={label}
              to={to}
              className={`flex items-center gap-3 rounded-[var(--radius-lg)] px-4 py-3 transition-all duration-200 ${
                active
                  ? 'translate-x-0.5 bg-[var(--color-secondary-container)] font-semibold text-[var(--color-primary)]'
                  : 'text-[var(--color-secondary)] hover:bg-[var(--color-surface-container-high)]'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2 : 1.8} />
              <span className="text-label-md">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-[var(--color-outline-variant)] pt-4">
          <Link
            to="/productor/perfil"
            className="flex items-center gap-3 rounded-[var(--radius-lg)] px-4 py-3 text-[var(--color-secondary)] transition-all hover:bg-[var(--color-surface-container-high)]"
          >
            <User size={20} strokeWidth={1.8} />
            <span className="text-label-md">Mi perfil</span>
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="min-h-screen flex-1 px-[var(--space-margin-mobile)] py-12 pb-24 md:px-[var(--space-margin-desktop)]">
        <div className="mx-auto max-w-4xl">
          {/* Page header */}
          <header className="mb-12 max-w-2xl">
            <h1 className="text-display-lg text-[var(--color-primary)]">
              Configuración de entregas
            </h1>
            <p className="text-body-lg mt-4 text-[var(--color-secondary)]">
              Configura cómo recibirán tus productos los clientes. Se recomienda tener al menos una
              modalidad activa.
            </p>
          </header>

          {/* Cards */}
          <div className="flex flex-col gap-8">
            {/* ── Block 1: Entrega personal ── */}
            <DeliveryCard
              active={entregaPersonal.activa}
              onToggle={() =>
                setEntregaPersonal((prev) => ({ ...prev, activa: !prev.activa }))
              }
              icon={<User size={22} strokeWidth={1.8} className="text-[var(--color-primary)]" />}
              title="Entrega personal"
              subtitle="Gestión directa de repartos"
            >
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <CardField
                  label="Ámbito de cobertura"
                  value={entregaPersonal.ambito}
                  onChange={(v) => setEntregaPersonal((prev) => ({ ...prev, ambito: v }))}
                  disabled={!entregaPersonal.activa}
                />
                <CardField
                  label="Coste del servicio"
                  value={entregaPersonal.coste}
                  onChange={(v) => setEntregaPersonal((prev) => ({ ...prev, coste: v }))}
                  disabled={!entregaPersonal.activa}
                />
                <div className="flex flex-col gap-1 md:col-span-2">
                  <span className="text-label-sm uppercase tracking-widest text-[var(--color-secondary)]">
                    Notas / Condiciones
                  </span>
                  <input
                    type="text"
                    value={entregaPersonal.notas}
                    disabled={!entregaPersonal.activa}
                    onChange={(e) =>
                      setEntregaPersonal((prev) => ({ ...prev, notas: e.target.value }))
                    }
                    className="border-b border-[var(--color-outline-variant)] bg-transparent text-body-md text-[var(--color-on-surface)] focus:border-[var(--color-primary)] focus:outline-none disabled:text-[var(--color-secondary)]"
                  />
                </div>
              </div>
            </DeliveryCard>

            {/* ── Block 2: Mensajería ── */}
            <DeliveryCard
              active={mensajeria.activa}
              onToggle={() => setMensajeria((prev) => ({ ...prev, activa: !prev.activa }))}
              icon={<Truck size={22} strokeWidth={1.8} className="text-[var(--color-primary)]" />}
              title="Mensajería"
              subtitle="Envío por agencia externa"
            >
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <CardField
                  label="Empresa de transporte"
                  value={mensajeria.empresa}
                  onChange={(v) => setMensajeria((prev) => ({ ...prev, empresa: v }))}
                  disabled={!mensajeria.activa}
                />
                {/* Scope select */}
                <div className="flex flex-col gap-1">
                  <span className="text-label-sm uppercase tracking-widest text-[var(--color-secondary)]">
                    Ámbito
                  </span>
                  <select
                    value={mensajeria.ambito}
                    disabled={!mensajeria.activa}
                    onChange={(e) =>
                      setMensajeria((prev) => ({ ...prev, ambito: e.target.value }))
                    }
                    className="border-b border-[var(--color-outline-variant)] bg-transparent text-body-md text-[var(--color-on-surface)] focus:border-[var(--color-primary)] focus:outline-none disabled:text-[var(--color-secondary)]"
                  >
                    <option>Provincial</option>
                    <option>Nacional</option>
                    <option>Internacional</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <CardField
                    label="Coste de envío (base)"
                    value={mensajeria.coste}
                    onChange={(v) => setMensajeria((prev) => ({ ...prev, coste: v }))}
                    disabled={!mensajeria.activa}
                  />
                </div>
              </div>
            </DeliveryCard>

            {/* ── Block 3: Punto de recogida ── */}
            <DeliveryCard
              active={puntosActiva}
              onToggle={() => setPuntosActiva((prev) => !prev)}
              icon={
                <MapPin size={22} strokeWidth={1.8} className="text-[var(--color-primary)]" />
              }
              title="Punto de recogida"
              subtitle="Recogida local por el cliente"
            >
              <div>
                <p className="text-label-sm mb-4 uppercase tracking-widest text-[var(--color-secondary)]">
                  Puntos Activos
                </p>

                {/* List */}
                <div className="mb-6 flex flex-col gap-3">
                  {puntos.length === 0 && (
                    <p className="text-body-md text-[var(--color-secondary)] italic">
                      No hay puntos de recogida configurados.
                    </p>
                  )}
                  {puntos.map((punto) => (
                    <div
                      key={punto.id}
                      className="flex items-start justify-between rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-4"
                    >
                      <div>
                        <h4 className="text-label-md text-[var(--color-on-surface)]">
                          {punto.nombre}
                        </h4>
                        <p className="text-body-md mt-1 text-sm text-[var(--color-secondary)]">
                          {punto.calle}, {punto.municipio}
                        </p>
                        <p className="text-label-sm mt-2 text-[var(--color-primary)]">
                          Horario: {punto.horario}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Eliminar ${punto.nombre}`}
                        onClick={() => setPuntoAEliminar(punto)}
                        disabled={!puntosActiva}
                        className="ml-4 flex-shrink-0 text-[var(--color-secondary)] transition-colors hover:text-[var(--color-error)] disabled:pointer-events-none disabled:opacity-40"
                      >
                        <Trash2 size={18} strokeWidth={1.8} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add point button */}
                <button
                  type="button"
                  disabled={!puntosActiva}
                  onClick={() => setShowAgregar(true)}
                  className="text-label-md flex items-center gap-2 text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-container)] disabled:pointer-events-none disabled:opacity-40"
                >
                  <Plus size={18} strokeWidth={2} />
                  Añadir punto
                </button>
              </div>
            </DeliveryCard>
          </div>
        </div>
      </main>

      {/* ── Modals ── */}
      {showAgregar && (
        <AgregarPuntoModal onClose={() => setShowAgregar(false)} onConfirm={agregarPunto} />
      )}

      {puntoAEliminar && (
        <EliminarPuntoModal
          nombrePunto={puntoAEliminar.nombre}
          onClose={() => setPuntoAEliminar(null)}
          onConfirm={() => eliminarPunto(puntoAEliminar.id)}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// DeliveryCard — shared card wrapper with toggle + save button
// ---------------------------------------------------------------------------

type DeliveryCardProps = {
  active: boolean
  onToggle: () => void
  icon: React.ReactNode
  title: string
  subtitle: string
  children: React.ReactNode
}

function DeliveryCard({ active, onToggle, icon, title, subtitle, children }: DeliveryCardProps) {
  return (
    <div
      className={`rounded-[var(--radius-xl)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-8 transition-all duration-300 hover:bg-[var(--color-surface-container-low)] ${
        !active ? 'opacity-70' : ''
      }`}
    >
      {/* Card header */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-container)]">
            {icon}
          </div>
          <div>
            <h3 className="text-headline-sm text-[var(--color-primary)]">{title}</h3>
            <p className="text-label-sm mt-0.5 text-[var(--color-secondary)]">{subtitle}</p>
          </div>
        </div>
        {/* Toggle */}
        <Toggle checked={active} onChange={onToggle} />
      </div>

      {/* Card body */}
      <div className="mb-8">{children}</div>

      {/* Footer */}
      <div className="flex justify-end border-t border-[var(--color-outline-variant)] pt-6">
        <button
          type="button"
          className="text-label-md rounded-[var(--radius-default)] bg-[var(--color-primary-container)] px-6 py-2 text-[var(--color-on-primary-container)] transition-colors hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)]"
        >
          Guardar
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Toggle switch
// ---------------------------------------------------------------------------

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-[var(--color-primary-container)]' : 'bg-[var(--color-surface-container-highest)]'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

// ---------------------------------------------------------------------------
// CardField — minimal bottom-border input
// ---------------------------------------------------------------------------

function CardField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-label-sm uppercase tracking-widest text-[var(--color-secondary)]">
        {label}
      </span>
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="border-b border-[var(--color-outline-variant)] bg-transparent text-body-md text-[var(--color-on-surface)] focus:border-[var(--color-primary)] focus:outline-none disabled:text-[var(--color-secondary)]"
      />
    </div>
  )
}
