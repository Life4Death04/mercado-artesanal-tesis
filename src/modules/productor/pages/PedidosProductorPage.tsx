import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Filter, Search, SlidersHorizontal, Truck, Warehouse } from 'lucide-react'
import { CancelarPedidoModal, DetallePedidoModal } from '../componentes/PedidosProductorModals'

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

const pedidosIniciales: PedidoProductor[] = [
  {
    id: '#10423',
    cliente: { nombre: 'Marta Garcia', email: 'marta.garcia@email.com', telefono: '+34 600 000 000', iniciales: 'MG' },
    fecha: '24 May 2024',
    status: 'Pendiente',
    entrega: { tipo: 'Mensajeria', direccion: 'Calle de las Castanuelas, 42, 3o B\n03001, Alicante, Espana' },
    productosSummary: 'Aceite de Oliva Virgen Extra (2), Miel de Azahar (1)',
    subtotal: '80,50EUR',
    gastoEnvio: '5,00EUR',
    total: '85,50EUR',
    productos: [
      {
        nombre: 'Aceite de Oliva Virgen Extra (500ml)',
        cantidad: 2,
        precioUnitario: '24,50EUR',
        subtotal: '49,00EUR',
        imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWZJa-wOtsS_IoWzb2lJlhltHxvo_7Sw1ZqebL2b0rpe315vLPTZ76fjKmeeOnUeaDkPZ6AjXafi1-vT_dVylEIbSTZbU1Dkqcdg8KOnT6gP0DcQSL1QEH489c2td7KX3I7IQtYgInzAJ6N8qsTN60kGZaYbpOKI-7CDlXFy2iHozO2CKuE_9AmOit-l5KbX-Dz7xvJ4wtEqt72fs6Ti9cznI84iEHr6zZfi9695QXyrjHm0Oc2wPyUZk2D5kpLLfp6RAzTFxuRN4',
      },
      {
        nombre: 'Miel de Azahar de la Marina',
        cantidad: 3,
        precioUnitario: '10,50EUR',
        subtotal: '31,50EUR',
        imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyCFasx4n34OVzjzGM_b3dKCRefQWmXltevCh9ww2KmLsDJoCZ04fGeUPh4ujtb0RaW98VY17nBKoHQ3MfQGREGXJ24LfFqMMiih5WAnvxCRFMld_oiWm8li5nQ_Vpag2Uyo7H2TTayT_y1k4bDF0wEZE7To9RmKdVHwWl-iwokuc4HUXyfv9IKFzvA2BJ6tA24ZHLJatY9OegGMKjpb9YMyusuu__qFZz7BUrmMNTg4gRUpRAifeisGpucD_poFMfSqTGQ0EIZ0M',
      },
    ],
  },
  {
    id: '#10422',
    cliente: { nombre: 'Juan Perez', email: 'juan.perez@email.com', telefono: '+34 611 222 333', iniciales: 'JP' },
    fecha: '23 May 2024',
    status: 'En preparación',
    entrega: { tipo: 'Punto de recogida', direccion: 'Mercado Central, Puesto 18 - Denia' },
    productosSummary: 'Turron de Jijona (3)',
    subtotal: '38,50EUR',
    gastoEnvio: '3,50EUR',
    total: '42,00EUR',
    productos: [
      {
        nombre: 'Turron de Jijona Artesano',
        cantidad: 3,
        precioUnitario: '12,83EUR',
        subtotal: '38,50EUR',
        imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCztl1jLSI_oU4y3dHVhYVIrCAYSJged3hkgiEjDWviaz81U7U3BC_CqBaIw4qAqacQBNty84zaiY9bdB8yUXgFNkKuV_92ymuU99IrII2IjVhkw4aYCVXSStn6VOv9PgBZS5IyQyT0ZQo5yBANyjNsQSsEgGCub7AKDZYcgNAqvyHyrXMimBJnkp4enVL5FkjT0CxElvUzLZ5pXAhXshdtPJE9EEe1LgA4Uj0dWAVwsY7lL4hpmo6IQ83Rk8ckAUmHD__7_rYQqiw',
      },
    ],
  },
  {
    id: '#10420',
    cliente: { nombre: 'Carlos Lopez', email: 'c.lopez@email.com', telefono: '+34 699 888 777', iniciales: 'CL' },
    fecha: '20 May 2024',
    status: 'Enviado',
    entrega: { tipo: 'Mensajeria', direccion: 'Avda. de la Constitucion, 8, 2o A\n03003, Alicante, Espana' },
    productosSummary: 'Aceite de Oliva Virgen Extra (2), Turron de Jijona (1)',
    subtotal: '61,00EUR',
    gastoEnvio: '7,00EUR',
    total: '68,00EUR',
    productos: [
      {
        nombre: 'Aceite de Oliva Virgen Extra (500ml)',
        cantidad: 2,
        precioUnitario: '24,50EUR',
        subtotal: '49,00EUR',
        imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWZJa-wOtsS_IoWzb2lJlhltHxvo_7Sw1ZqebL2b0rpe315vLPTZ76fjKmeeOnUeaDkPZ6AjXafi1-vT_dVylEIbSTZbU1Dkqcdg8KOnT6gP0DcQSL1QEH489c2td7KX3I7IQtYgInzAJ6N8qsTN60kGZaYbpOKI-7CDlXFy2iHozO2CKuE_9AmOit-l5KbX-Dz7xvJ4wtEqt72fs6Ti9cznI84iEHr6zZfi9695QXyrjHm0Oc2wPyUZk2D5kpLLfp6RAzTFxuRN4',
      },
      {
        nombre: 'Turron de Jijona Artesano',
        cantidad: 1,
        precioUnitario: '12,83EUR',
        subtotal: '12,83EUR',
        imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCztl1jLSI_oU4y3dHVhYVIrCAYSJged3hkgiEjDWviaz81U7U3BC_CqBaIw4qAqacQBNty84zaiY9bdB8yUXgFNkKuV_92ymuU99IrII2IjVhkw4aYCVXSStn6VOv9PgBZS5IyQyT0ZQo5yBANyjNsQSsEgGCub7AKDZYcgNAqvyHyrXMimBJnkp4enVL5FkjT0CxElvUzLZ5pXAhXshdtPJE9EEe1LgA4Uj0dWAVwsY7lL4hpmo6IQ83Rk8ckAUmHD__7_rYQqiw',
      },
    ],
  },
  {
    id: '#10419',
    cliente: { nombre: 'Noelia Torres', email: 'noelia.torres@email.com', telefono: '+34 655 777 123', iniciales: 'NT' },
    fecha: '18 May 2024',
    status: 'Entregado',
    entrega: { tipo: 'Mensajeria', direccion: 'Calle del Mar, 14\n03501, Benidorm, Espana' },
    productosSummary: 'Conserva de bonito (4), Mermelada de higo (2)',
    subtotal: '54,00EUR',
    gastoEnvio: '4,50EUR',
    total: '58,50EUR',
    productos: [
      {
        nombre: 'Conserva de bonito artesana',
        cantidad: 4,
        precioUnitario: '9,50EUR',
        subtotal: '38,00EUR',
        imagen: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
      },
      {
        nombre: 'Mermelada de higo',
        cantidad: 2,
        precioUnitario: '8,00EUR',
        subtotal: '16,00EUR',
        imagen: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    id: '#10421',
    cliente: { nombre: 'Elena Sanz', email: 'e.sanz@email.com', telefono: '+34 622 333 444', iniciales: 'ES' },
    fecha: '22 May 2024',
    status: 'Cancelado',
    entrega: { tipo: 'Mensajeria', direccion: 'Calle Mayor 3, 1o C\n03300, Orihuela, Espana' },
    productosSummary: 'Vino Tinto Alicante (1)',
    subtotal: '22,00EUR',
    gastoEnvio: '3,00EUR',
    total: '25,00EUR',
    productos: [
      {
        nombre: 'Vino Tinto Alicante D.O.',
        cantidad: 1,
        precioUnitario: '22,00EUR',
        subtotal: '22,00EUR',
        imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCzc7FxIB6146OgThQLqG_S8TF4n3EmfBxBj9kkHTI5gvbR8i4-ubUEnKLUfrhYWCCtUzdrTOTsj8sH3PV9CUu3JbCqPv-titRJAAa7oLWfREenQO02q857nvca9gWAqe1xIrqNDVf1AkOLzYCrncQnzVfd-z9jpWBMHIFQndjRIykt433NlEipYEUzuzZ1DfJEjQJke4O3RS6_u9E4DjpCVzUVLVhr4nUZJFTWiV47Da0XesK27Msd9AphLA0mnZgA4yvX2Dk2vk',
      },
    ],
  },
]

const statusFilters: Array<PedidoStatus | 'Todos'> = ['Todos', 'Pendiente', 'En preparación', 'Enviado', 'Entregado', 'Cancelado']
const pageSize = 4

function getNextStatus(status: PedidoStatus): PedidoStatus | null {
  if (status === 'Pendiente') return 'En preparación'
  if (status === 'En preparación') return 'Enviado'
  if (status === 'Enviado') return 'Entregado'
  return null
}

export function PedidosProductorPage() {
  const [pedidos, setPedidos] = useState<PedidoProductor[]>(pedidosIniciales)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PedidoStatus | 'Todos'>('Todos')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPedidoId, setSelectedPedidoId] = useState<string | null>(null)
  const [cancelingPedidoId, setCancelingPedidoId] = useState<string | null>(null)

  const normalizedSearch = search.trim().toLowerCase()
  const searchFilteredOrders = pedidos.filter((pedido) => {
    if (!normalizedSearch) return true

    return [
      pedido.id,
      pedido.cliente.nombre,
      pedido.cliente.email,
      pedido.status,
      pedido.entrega.tipo,
      pedido.productosSummary,
      ...pedido.productos.map((producto) => producto.nombre),
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch)
  })

  const filteredOrders = searchFilteredOrders.filter((pedido) => {
    return statusFilter === 'Todos' || pedido.status === statusFilter
  })

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const visibleOrders = filteredOrders.slice((safePage - 1) * pageSize, safePage * pageSize)
  const selectedPedido = selectedPedidoId ? pedidos.find((pedido) => pedido.id === selectedPedidoId) ?? null : null
  const cancelingPedido = cancelingPedidoId ? pedidos.find((pedido) => pedido.id === cancelingPedidoId) ?? null : null

  function updateSearch(value: string) {
    setSearch(value)
    setCurrentPage(1)
  }

  function updateStatus(filter: PedidoStatus | 'Todos') {
    setStatusFilter(filter)
    setCurrentPage(1)
  }

  function advanceOrderStatus(pedidoId: string) {
    setPedidos((current) =>
      current.map((pedido) => {
        if (pedido.id !== pedidoId) return pedido

        const nextStatus = getNextStatus(pedido.status)
        return nextStatus ? { ...pedido, status: nextStatus } : pedido
      }),
    )
  }

  function confirmCancel() {
    if (!cancelingPedidoId) return

    setPedidos((current) =>
      current.map((pedido) => (pedido.id === cancelingPedidoId ? { ...pedido, status: 'Cancelado' } : pedido)),
    )
    setCancelingPedidoId(null)
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <main className="mx-auto w-full max-w-[var(--layout-container-max)] px-[var(--space-margin-mobile)] py-12 md:px-[var(--space-margin-desktop)] md:py-16">
        <section className="mb-10">
          <nav aria-label="Breadcrumb" className="text-label-sm mb-6 flex items-center gap-2 text-[var(--color-secondary)]">
            <Link to="/productor/pedidos" className="transition-colors hover:text-[var(--color-primary)]">
              Area Productor
            </Link>
            <ChevronRight size={14} strokeWidth={1.8} />
            <span className="text-[var(--color-primary)]">Mis pedidos</span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-display-lg mb-4 text-[var(--color-primary)]">Mis pedidos</h1>
              <p className="text-body-md max-w-2xl text-[var(--color-on-surface-variant)]">
                Gestiona el avance de cada pedido, revisa los detalles del envio y filtra rapidamente por cliente, estado o producto.
              </p>
            </div>

            <div className="border border-[color-mix(in_srgb,var(--color-outline-variant)_40%,transparent)] bg-white/45 px-5 py-4 text-right shadow-[0_18px_50px_-35px_rgba(122,46,58,0.35)]">
              <span className="text-label-sm block uppercase tracking-[0.18em] text-[var(--color-outline)]">
                Pedidos filtrados
              </span>
              <strong className="text-headline-md text-[28px] text-[var(--color-primary)]">{filteredOrders.length}</strong>
            </div>
          </div>
        </section>

        <section className="mb-8 border border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-surface-container-lowest)] p-4 shadow-[0_18px_50px_-35px_rgba(122,46,58,0.35)] md:p-6" aria-label="Filtros de pedidos del productor">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <Search size={18} strokeWidth={1.8} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)]" />
              <input
                type="search"
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Buscar por pedido, cliente, correo o producto..."
                className="text-body-md w-full border border-[var(--color-outline-variant)] bg-[#FAF7F0] py-3 pl-11 pr-4 text-[#1A1A1A] placeholder:text-[var(--color-outline)] focus:border-[var(--color-primary)] focus:outline-none"
              />
            </label>

            <button
              type="button"
              onClick={() => setFiltersOpen((value) => !value)}
              aria-expanded={filtersOpen}
              className="text-label-md inline-flex items-center justify-center gap-2 border border-[var(--color-outline-variant)] px-5 py-3 uppercase tracking-wider text-[var(--color-secondary)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] lg:hidden"
            >
              <SlidersHorizontal size={18} strokeWidth={1.8} />
              Filtros
            </button>
          </div>

          <div className={`${filtersOpen ? 'mt-5 flex' : 'hidden'} flex-col gap-4 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] pt-5 lg:mt-5 lg:flex lg:border-t lg:pt-5`}>
            <div className="flex items-center gap-2 text-[var(--color-secondary)]">
              <Filter size={16} strokeWidth={1.8} />
              <span className="text-label-sm uppercase tracking-[0.18em]">Estado del pedido</span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1">
              {statusFilters.map((filter) => {
                const count = filter === 'Todos'
                  ? searchFilteredOrders.length
                  : searchFilteredOrders.filter((pedido) => pedido.status === filter).length

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => updateStatus(filter)}
                    className={`text-label-md whitespace-nowrap rounded-full border px-4 py-2 transition-all ${statusFilter === filter ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' : 'border-[var(--color-outline-variant)] bg-transparent text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'}`}
                  >
                    {filter} ({count})
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-4">
          {visibleOrders.map((pedido) => (
            <OrderCard key={pedido.id} pedido={pedido} onView={() => setSelectedPedidoId(pedido.id)} />
          ))}
        </div>

        {visibleOrders.length === 0 ? (
          <div className="mt-10 border border-dashed border-[var(--color-outline-variant)] p-10 text-center">
            <Filter className="mx-auto mb-3 text-[var(--color-outline)]" size={28} strokeWidth={1.8} />
            <p className="text-body-md text-[var(--color-on-surface-variant)]">No hay pedidos que coincidan con los filtros aplicados.</p>
          </div>
        ) : null}

        <section className="mt-12 flex flex-col gap-4 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-label-sm italic text-[var(--color-outline)]">
            Mostrando {visibleOrders.length} de {filteredOrders.length} pedidos filtrados
          </p>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="flex size-10 items-center justify-center rounded-full border border-[var(--color-outline-variant)] text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-container-high)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={18} strokeWidth={1.8} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`text-label-md flex size-9 items-center justify-center rounded-full transition-colors ${page === safePage ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]' : 'text-[var(--color-secondary)] hover:bg-[var(--color-surface-container-high)]'}`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              className="flex size-10 items-center justify-center rounded-full border border-[var(--color-outline-variant)] text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-container-high)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight size={18} strokeWidth={1.8} />
            </button>
          </div>
        </section>
      </main>

      {selectedPedido && !cancelingPedido ? (
        <DetallePedidoModal
          pedido={selectedPedido}
          onClose={() => setSelectedPedidoId(null)}
          onCancel={() => setCancelingPedidoId(selectedPedido.id)}
          onAdvanceStatus={() => advanceOrderStatus(selectedPedido.id)}
        />
      ) : null}

      {cancelingPedido ? (
        <CancelarPedidoModal
          pedido={cancelingPedido}
          onClose={() => setCancelingPedidoId(null)}
          onConfirm={confirmCancel}
        />
      ) : null}
    </div>
  )
}

type OrderCardProps = {
  pedido: PedidoProductor
  onView: () => void
}

function OrderCard({ pedido, onView }: OrderCardProps) {
  const isCancelled = pedido.status === 'Cancelado'

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onView}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onView()
        }
      }}
      className={`cursor-pointer rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] bg-[var(--color-surface-container-lowest)] p-5 shadow-[0_10px_30px_-20px_rgba(122,46,58,0.25)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:shadow-[0_20px_45px_-28px_rgba(122,46,58,0.35)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] md:p-7 ${isCancelled ? 'opacity-70' : ''}`}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center gap-3">
              <span className="text-headline-md text-[var(--color-primary)]">{pedido.id}</span>
              <OrderStatusBadge status={pedido.status} />
            </div>
            <span className="text-label-sm text-[var(--color-secondary)]">{pedido.fecha}</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <OrderMeta label="Cliente" value={pedido.cliente.nombre} />

            <div>
              <p className="text-label-sm mb-1 uppercase tracking-wider text-[var(--color-outline)]">Entrega</p>
              <div className="flex items-center gap-2 text-[var(--color-on-surface)]">
                {pedido.entrega.tipo.toLowerCase().includes('mensajer') ? (
                  <Truck size={16} strokeWidth={1.8} className="text-[var(--color-secondary)]" />
                ) : (
                  <Warehouse size={16} strokeWidth={1.8} className="text-[var(--color-secondary)]" />
                )}
                <span className="text-body-md">{pedido.entrega.tipo}</span>
              </div>
            </div>

            <div className="sm:col-span-2 xl:col-span-1">
              <p className="text-label-sm mb-1 uppercase tracking-wider text-[var(--color-outline)]">Productos</p>
              <p className="text-body-md text-[var(--color-on-surface)]">{pedido.productosSummary}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-row items-end justify-between gap-4 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] pt-5 lg:min-w-[152px] lg:flex-col lg:items-end lg:border-t-0 lg:pt-0">
          <p className={`text-headline-md ${isCancelled ? 'text-[var(--color-secondary)] line-through' : 'text-[var(--color-primary)]'}`}>
            {pedido.total}
          </p>
          <span className={`text-label-md border-b pb-0 transition-all ${isCancelled ? 'border-[var(--color-secondary)] text-[var(--color-secondary)]' : 'border-[var(--color-primary)] text-[var(--color-primary)]'}`}>
            Ver detalle
          </span>
        </div>
      </div>
    </article>
  )
}

function OrderMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-label-sm mb-1 uppercase tracking-wider text-[var(--color-outline)]">{label}</p>
      <p className="text-body-md font-semibold text-[var(--color-on-surface)]">{value}</p>
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
    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${map[status]}`}>
      {status}
    </span>
  )
}
