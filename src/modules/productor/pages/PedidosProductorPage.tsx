import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart2, BookOpen, ChevronLeft, ChevronRight, Download, Package, Search, Settings, ShoppingBag, Truck, User } from 'lucide-react'
import { CancelarPedidoModal, DetallePedidoModal } from '../componentes/PedidosProductorModals'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PedidoStatus = 'Pendiente' | 'En preparación' | 'Enviado' | 'Entregado' | 'Cancelado'

export type ProductoPedido = {
  nombre: string
  cantidad: number
  precioUnitario: string
  subtotal: string
  imagen: string
}

export type PedidoProductor = {
  id: string
  cliente: {
    nombre: string
    email: string
    telefono: string
    iniciales: string
  }
  fecha: string
  status: PedidoStatus
  entrega: {
    tipo: string
    direccion?: string
  }
  productos: ProductoPedido[]
  productosSummary: string
  subtotal: string
  gastoEnvio: string
  total: string
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const pedidos: PedidoProductor[] = [
  {
    id: '#10423',
    cliente: { nombre: 'Marta García', email: 'marta.garcia@email.com', telefono: '+34 600 000 000', iniciales: 'MG' },
    fecha: '24 May 2024',
    status: 'Pendiente',
    entrega: { tipo: 'Mensajería', direccion: 'Calle de las Castañuelas, 42, 3º B\n03001, Alicante, España' },
    productosSummary: 'Aceite de Oliva Virgen Extra (2), Miel de Azahar (1)',
    subtotal: '80,50€',
    gastoEnvio: '5,00€',
    total: '85,50€',
    productos: [
      {
        nombre: 'Aceite de Oliva Virgen Extra (500ml)',
        cantidad: 2,
        precioUnitario: '24,50€',
        subtotal: '49,00€',
        imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWZJa-wOtsS_IoWzb2lJlhltHxvo_7Sw1ZqebL2b0rpe315vLPTZ76fjKmeeOnUeaDkPZ6AjXafi1-vT_dVylEIbSTZbU1Dkqcdg8KOnT6gP0DcQSL1QEH489c2td7KX3I7IQtYgInzAJ6N8qsTN60kGZaYbpOKI-7CDlXFy2iHozO2CKuE_9AmOit-l5KbX-Dz7xvJ4wtEqt72fs6Ti9cznI84iEHr6zZfi9695QXyrjHm0Oc2wPyUZk2D5kpLLfp6RAzTFxuRN4',
      },
      {
        nombre: 'Miel de Azahar de la Marina',
        cantidad: 3,
        precioUnitario: '10,50€',
        subtotal: '31,50€',
        imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyCFasx4n34OVzjzGM_b3dKCRefQWmXltevCh9ww2KmLsDJoCZ04fGeUPh4ujtb0RaW98VY17nBKoHQ3MfQGREGXJ24LfFqMMiih5WAnvxCRFMld_oiWm8li5nQ_Vpag2Uyo7H2TTayT_y1k4bDF0wEZE7To9RmKdVHwWl-iwokuc4HUXyfv9IKFzvA2BJ6tA24ZHLJatY9OegGMKjpb9YMyusuu__qFZz7BUrmMNTg4gRUpRAifeisGpucD_poFMfSqTGQ0EIZ0M',
      },
    ],
  },
  {
    id: '#10422',
    cliente: { nombre: 'Juan Pérez', email: 'juan.perez@email.com', telefono: '+34 611 222 333', iniciales: 'JP' },
    fecha: '23 May 2024',
    status: 'En preparación',
    entrega: { tipo: 'Punto de recogida', direccion: 'Mercado Central, Puesto 18 — Denia' },
    productosSummary: 'Turrón de Jijona (3)',
    subtotal: '38,50€',
    gastoEnvio: '3,50€',
    total: '42,00€',
    productos: [
      {
        nombre: 'Turrón de Jijona Artesano',
        cantidad: 3,
        precioUnitario: '12,83€',
        subtotal: '38,50€',
        imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCztl1jLSI_oU4y3dHVhYVIrCAYSJged3hkgiEjDWviaz81U7U3BC_CqBaIw4qAqacQBNty84zaiY9bdB8yUXgFNkKuV_92ymuU99IrII2IjVhkw4aYCVXSStn6VOv9PgBZS5IyQyT0ZQo5yBANyjNsQSsEgGCub7AKDZYcgNAqvyHyrXMimBJnkp4enVL5FkjT0CxElvUzLZ5pXAhXshdtPJE9EEe1LgA4Uj0dWAVwsY7lL4hpmo6IQ83Rk8ckAUmHD__7_rYQqiw',
      },
    ],
  },
  {
    id: '#10420',
    cliente: { nombre: 'Carlos López', email: 'c.lopez@email.com', telefono: '+34 699 888 777', iniciales: 'CL' },
    fecha: '20 May 2024',
    status: 'Enviado',
    entrega: { tipo: 'Mensajería', direccion: 'Avda. de la Constitución, 8, 2º A\n03003, Alicante, España' },
    productosSummary: 'Aceite de Oliva Virgen Extra (2), Turrón de Jijona (1)',
    subtotal: '61,00€',
    gastoEnvio: '7,00€',
    total: '68,00€',
    productos: [
      {
        nombre: 'Aceite de Oliva Virgen Extra (500ml)',
        cantidad: 2,
        precioUnitario: '24,50€',
        subtotal: '49,00€',
        imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWZJa-wOtsS_IoWzb2lJlhltHxvo_7Sw1ZqebL2b0rpe315vLPTZ76fjKmeeOnUeaDkPZ6AjXafi1-vT_dVylEIbSTZbU1Dkqcdg8KOnT6gP0DcQSL1QEH489c2td7KX3I7IQtYgInzAJ6N8qsTN60kGZaYbpOKI-7CDlXFy2iHozO2CKuE_9AmOit-l5KbX-Dz7xvJ4wtEqt72fs6Ti9cznI84iEHr6zZfi9695QXyrjHm0Oc2wPyUZk2D5kpLLfp6RAzTFxuRN4',
      },
      {
        nombre: 'Turrón de Jijona Artesano',
        cantidad: 1,
        precioUnitario: '12,83€',
        subtotal: '12,83€',
        imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCztl1jLSI_oU4y3dHVhYVIrCAYSJged3hkgiEjDWviaz81U7U3BC_CqBaIw4qAqacQBNty84zaiY9bdB8yUXgFNkKuV_92ymuU99IrII2IjVhkw4aYCVXSStn6VOv9PgBZS5IyQyT0ZQo5yBANyjNsQSsEgGCub7AKDZYcgNAqvyHyrXMimBJnkp4enVL5FkjT0CxElvUzLZ5pXAhXshdtPJE9EEe1LgA4Uj0dWAVwsY7lL4hpmo6IQ83Rk8ckAUmHD__7_rYQqiw',
      },
    ],
  },
  {
    id: '#10421',
    cliente: { nombre: 'Elena Sanz', email: 'e.sanz@email.com', telefono: '+34 622 333 444', iniciales: 'ES' },
    fecha: '22 May 2024',
    status: 'Cancelado',
    entrega: { tipo: 'Mensajería', direccion: 'Calle Mayor 3, 1º C\n03300, Orihuela, España' },
    productosSummary: 'Vino Tinto Alicante (1)',
    subtotal: '22,00€',
    gastoEnvio: '3,00€',
    total: '25,00€',
    productos: [
      {
        nombre: 'Vino Tinto Alicante D.O.',
        cantidad: 1,
        precioUnitario: '22,00€',
        subtotal: '22,00€',
        imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCzc7FxIB6146OgThQLqG_S8TF4n3EmfBxBj9kkHTI5gvbR8i4-ubUEnKLUfrhYWCCtUzdrTOTsj8sH3PV9CUu3JbCqPv-titRJAAa7oLWfREenQO02q857nvca9gWAqe1xIrqNDVf1AkOLzYCrncQnzVfd-z9jpWBMHIFQndjRIykt433NlEipYEUzuzZ1DfJEjQJke4O3RS6_u9E4DjpCVzUVLVhr4nUZJFTWiV47Da0XesK27Msd9AphLA0mnZgA4yvX2Dk2vk',
      },
    ],
  },
]

const FILTROS: Array<{ label: string; count: number }> = [
  { label: 'Todos', count: 24 },
  { label: 'Pendientes', count: 5 },
  { label: 'En preparación', count: 8 },
  { label: 'Enviados', count: 6 },
  { label: 'Entregados', count: 5 },
  { label: 'Cancelados', count: 0 },
]

const NAV_ITEMS = [
  { icon: ShoppingBag, label: 'Mis pedidos', to: '/productor/pedidos', active: true },
  { icon: BookOpen, label: 'Mi catálogo', to: '/productor/productos', active: false },
  { icon: Package, label: 'Inventario', to: '/productor/inventario', active: false },
  { icon: BarChart2, label: 'Estadísticas', to: '/productor/estadisticas', active: false },
  { icon: Truck, label: 'Configuración de entregas', to: '/productor/entregas', active: false },
]

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export function PedidosProductorPage() {
  const [filtroActivo, setFiltroActivo] = useState(0)
  const [selectedPedido, setSelectedPedido] = useState<PedidoProductor | null>(null)
  const [cancelingPedido, setCancelingPedido] = useState<PedidoProductor | null>(null)

  function handleCancel() {
    setCancelingPedido(selectedPedido)
  }

  function handleConfirmCancel() {
    setCancelingPedido(null)
    setSelectedPedido(null)
  }

  return (
    <div className="flex min-h-screen bg-[#FAF7F0] text-[var(--color-on-surface)]">
      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] p-6">
        <div className="mb-12">
          <Link to="/" className="text-headline-md text-[var(--color-primary)]">Alicante Gourmet</Link>
          <p className="text-label-sm mt-1 text-[var(--color-secondary)]">Artesano de Denia</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map(({ icon: Icon, label, to, active }) => (
            <Link
              key={label}
              to={to}
              className={`flex items-center gap-3 rounded-[var(--radius-lg)] px-4 py-3 transition-all duration-200 ${active ? 'translate-x-0.5 bg-[var(--color-secondary-container)] font-semibold text-[var(--color-primary)]' : 'text-[var(--color-secondary)] hover:bg-[var(--color-surface-container-high)]'}`}
            >
              <Icon size={20} strokeWidth={1.8} />
              <span className="text-label-md">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-[var(--color-outline-variant)] pt-6">
          <Link to="/productor/perfil" className="flex items-center gap-3 rounded-[var(--radius-lg)] px-4 py-3 text-[var(--color-secondary)] transition-all hover:bg-[var(--color-surface-container-high)]">
            <User size={20} strokeWidth={1.8} />
            <span className="text-label-md">Mi perfil</span>
          </Link>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="ml-64 min-h-screen flex-1 bg-[var(--color-surface)] px-[var(--space-margin-desktop)] py-12">
        {/* Header */}
        <header className="mb-12 flex items-end justify-between">
          <div>
            <h1 className="text-display-lg text-[var(--color-primary)]">Mis pedidos</h1>
            <div className="mt-2 flex items-center gap-3">
              <span className="rounded-full bg-[var(--color-primary)] px-3 py-0.5 text-xs font-bold text-[var(--color-on-primary)]">
                24 Total
              </span>
              <span className="text-label-sm italic text-[var(--color-secondary)]">Actualizado hace 5 minutos</span>
            </div>
          </div>
          <button type="button" className="text-label-md flex items-center gap-2 rounded-[var(--radius-default)] bg-[var(--color-primary-container)] px-6 py-2.5 text-[var(--color-on-primary-container)] transition-opacity hover:opacity-90">
            <Download size={16} strokeWidth={1.8} />
            Exportar CSV
          </button>
        </header>

        {/* Search + Filters */}
        <section className="mb-10 space-y-8">
          <div className="relative max-w-xl">
            <Search size={18} strokeWidth={1.8} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]" />
            <input
              type="text"
              placeholder="Buscar por nº de pedido o cliente..."
              className="text-body-md w-full border-0 border-b border-[var(--color-outline-variant)] bg-transparent px-12 py-3 text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] outline-none transition-colors focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {FILTROS.map(({ label, count }, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setFiltroActivo(i)}
                className={`text-label-md whitespace-nowrap border-b-2 px-4 py-2 transition-all ${i === filtroActivo ? 'border-[var(--color-primary)] font-bold text-[var(--color-primary)]' : 'border-transparent text-[var(--color-secondary)] hover:text-[var(--color-primary)]'}`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </section>

        {/* Orders */}
        <div className="flex flex-col gap-6">
          {pedidos.map((pedido) => (
            <OrderCard key={pedido.id} pedido={pedido} onView={() => setSelectedPedido(pedido)} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-24 text-center">
          <p className="text-label-sm italic text-[var(--color-outline)]">Mostrando {pedidos.length} de 24 pedidos realizados este mes</p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <button type="button" className="flex size-10 items-center justify-center rounded-full border border-[var(--color-outline-variant)] text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-container-high)]">
              <ChevronLeft size={18} strokeWidth={1.8} />
            </button>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((page) => (
                <button key={page} type="button" className={`text-label-md flex size-8 items-center justify-center rounded-full ${page === 1 ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]' : 'text-[var(--color-secondary)] hover:bg-[var(--color-surface-container-high)]'}`}>
                  {page}
                </button>
              ))}
            </div>
            <button type="button" className="flex size-10 items-center justify-center rounded-full border border-[var(--color-outline-variant)] text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-container-high)]">
              <ChevronRight size={18} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </main>

      {/* Watermark */}
      <div className="pointer-events-none fixed right-0 bottom-0 p-12 opacity-[0.03]">
        <span className="text-display-lg rotate-12 origin-bottom-right transform text-[120px] leading-none text-[var(--color-primary)]">ALC</span>
      </div>

      {/* Modals */}
      {selectedPedido && !cancelingPedido ? (
        <DetallePedidoModal
          pedido={selectedPedido}
          onClose={() => setSelectedPedido(null)}
          onCancel={handleCancel}
        />
      ) : null}

      {cancelingPedido ? (
        <CancelarPedidoModal
          pedido={cancelingPedido}
          onClose={() => setCancelingPedido(null)}
          onConfirm={handleConfirmCancel}
        />
      ) : null}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Order card
// ---------------------------------------------------------------------------

type OrderCardProps = { pedido: PedidoProductor; onView: () => void }

function OrderCard({ pedido, onView }: OrderCardProps) {
  const isCancelled = pedido.status === 'Cancelado'

  return (
    <article
      className={`flex cursor-pointer flex-col items-start justify-between gap-8 rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] p-8 transition-all duration-300 hover:bg-white hover:shadow-[0_4px_20px_rgba(26,26,26,0.04)] md:flex-row ${isCancelled ? 'opacity-50 grayscale-[0.5]' : ''}`}
    >
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-headline-md text-lg text-[var(--color-primary)]">{pedido.id}</span>
          <OrderStatusBadge status={pedido.status} />
          <span className="text-label-sm text-[var(--color-secondary)]">• {pedido.fecha}</span>
        </div>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
          <OrderMeta label="Cliente" value={pedido.cliente.nombre} />
          <div>
            <p className="text-label-sm mb-1 uppercase tracking-wider text-[var(--color-outline)]">Entrega</p>
            <div className="flex items-center gap-2 text-body-md text-[var(--color-on-surface)]">
              {pedido.entrega.tipo.toLowerCase().includes('mensajer')
                ? <Truck size={16} strokeWidth={1.8} className="text-[var(--color-secondary)]" />
                : <Settings size={16} strokeWidth={1.8} className="text-[var(--color-secondary)]" />}
              <span>{pedido.entrega.tipo}</span>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-label-sm mb-1 uppercase tracking-wider text-[var(--color-outline)]">Productos</p>
            <p className="text-body-md line-clamp-1 italic text-[var(--color-on-surface)]">{pedido.productosSummary}</p>
          </div>
        </div>
      </div>

      <div className="flex min-w-[120px] flex-col items-end justify-between self-stretch">
        <p className={`text-headline-md text-[var(--color-primary)] ${isCancelled ? 'line-through text-[var(--color-secondary)]' : ''}`}>
          {pedido.total}
        </p>
        <button
          type="button"
          onClick={onView}
          className={`text-label-md mt-4 border-b pb-0 transition-all hover:pb-1 ${isCancelled ? 'border-[var(--color-secondary)] text-[var(--color-secondary)]' : 'border-[var(--color-primary)] text-[var(--color-primary)]'}`}
        >
          Ver detalle
        </button>
      </div>
    </article>
  )
}

function OrderMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-label-sm mb-1 uppercase tracking-wider text-[var(--color-outline)]">{label}</p>
      <p className="text-headline-md text-lg text-[var(--color-on-surface)]">{value}</p>
    </div>
  )
}

function OrderStatusBadge({ status }: { status: PedidoStatus }) {
  const map: Record<PedidoStatus, string> = {
    Pendiente: 'bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]',
    'En preparación': 'bg-[var(--color-surface-container-highest)] text-[var(--color-secondary)]',
    Enviado: 'bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed)]',
    Entregado: 'bg-[#006a4e]/10 text-[#006a4e]',
    Cancelado: 'bg-[var(--color-error-container)] text-[var(--color-on-error-container)]',
  }

  return (
    <span className={`rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${map[status]}`}>
      {status}
    </span>
  )
}
