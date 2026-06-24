import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Filter, Search, SlidersHorizontal } from 'lucide-react'
import { OrderDetailModal, ProductReviewModal } from '../componentes/ConsumerOrderModals'
import { ReportarIncidenciaModal } from '../../perfil/componentes/IncidenciaModals'

export type ConsumerOrderStatus = 'Pendiente' | 'Confirmado' | 'En preparación' | 'En camino' | 'Entregado' | 'Cancelado'

export type ConsumerOrderProduct = {
  name: string
  detail: string
  quantity: string
  unitPrice: string
  total: string
  image: string
  reviewed?: boolean
}

export type ConsumerSubOrder = {
  id: string
  producer: string
  location: string
  status: ConsumerOrderStatus
  deliveryMethod: string
  deliveryAddress: string
  tracking: string
  subtotal: string
  shipping: string
  total: string
  incidentId?: string
  products: ConsumerOrderProduct[]
}

export type ConsumerOrder = {
  id: string
  date: string
  dateISO: string
  status: ConsumerOrderStatus
  total: string
  address: string
  subOrders: ConsumerSubOrder[]
}

type ReviewTarget = {
  product: ConsumerOrderProduct
  subOrderId: string
}

type DateFilters = {
  from: string
  to: string
}

const orderStatusFilters: Array<ConsumerOrderStatus | 'Todos'> = [
  'Todos',
  'Pendiente',
  'Confirmado',
  'En preparación',
  'En camino',
  'Entregado',
  'Cancelado',
]

const initialOrders: ConsumerOrder[] = [
  {
    id: '#AG-8821',
    date: '12/05/2026',
    dateISO: '2026-05-12',
    status: 'En camino',
    total: '49.45€',
    address: 'Calle Mayor 42, 3º B, Alicante',
    subOrders: [
      {
        id: '#AG-8821-A',
        producer: 'Aceites de la Montaña',
        location: 'Beniardá, Alicante',
        status: 'Entregado',
        deliveryMethod: 'Mensajería Urgente Frío',
        deliveryAddress: 'Calle Mayor 42, 3º B\n03002 Alicante, España',
        tracking: 'SEUR-882910399X',
        subtotal: '43.95€',
        shipping: '5.50€',
        total: '49.45€',
        incidentId: 'INC-001',
        products: [
          {
            name: 'Aceite de Oliva Virgen Extra 500ml',
            detail: 'Cosecha Temprana, Arbequina',
            quantity: '2x',
            unitPrice: '18.50€',
            total: '37.00€',
            image:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuBXiF5Jmxaucrr6_MG1NwSiEsoLYvwTbzcaFG8MyhPzCxteFwSQw8lv9YyJdMj4CvnW9KtkMuz1DLqcd2FcMzuDl9LlN4dUojNRO2yrwuGy2fnLPCUVawh_dXfvxyY1yYWZMDDUaFobjAWhFd_egSRzQ6eYqQxa4DyMp0v2IhNSWb5ZRwbkWeH0-nNaW9PaB2Qg5xg3UK-zHnR3Teg9Kop7nxlwdIi6hGXZrr3fY7-XE7E6jglyhHNVd9YiBTdFdqXryl-7YHqltcw',
          },
          {
            name: 'Tapenade de Oliva Negra',
            detail: 'Ecológico, 150g',
            quantity: '1x',
            unitPrice: '6.95€',
            total: '6.95€',
            image:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuB2kd6zHhl8gzupOx1SA1HmSgZdyLTie5mnspuPb4I8SOTK0Z5mbog1TfDf85Zj30BYGyamXjitnUYaFp05Hgo7cKr3OWGqbRxQSfVoaqv8dYXD8Y3CIZNyd189mmaAzu7ux_1urPV822bDvXIpoPHX_QKON9Pvv9C1sB8v9qD6DYxoCfqI4IrJjsoMvQIkvDP7UCDazI4AHphZj91CqdDOkPf_XPt_eIHK3LtrL2IhxApBNl16o6ypm3fVUd_PE9syky0wRLv3Hz4',
          },
        ],
      },
    ],
  },
  {
    id: '#AG-8822',
    date: '12/05/2026',
    dateISO: '2026-05-12',
    status: 'Pendiente',
    total: '18.90€',
    address: 'Mercado Central, Elche',
    subOrders: [
      {
        id: '#AG-8822-A',
        producer: 'Quesería San Antonio',
        location: 'Elche, Alicante',
        status: 'Pendiente',
        deliveryMethod: 'Entrega Personal',
        deliveryAddress: 'Mercado Central, Puesto 18\n03201 Elche, España',
        tracking: 'ENTREGA-PRODUCTOR-8822',
        subtotal: '16.90€',
        shipping: '2.00€',
        total: '18.90€',
        products: [
          {
            name: 'Queso de Cabra con Romero',
            detail: 'Maduración corta, 400g',
            quantity: '1x',
            unitPrice: '16.90€',
            total: '16.90€',
            image:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuACPw5Xagty6uEGbAZPt7ougTRDN902sBzFlMw3a1iad08kHrucHlAZMuCm45n0aFBm-2n17K219zgG62l8PedvWPwNE0hrPq846JdPvDYCL0qp8yGaOj0PExI84qrkFo64pdWvec7foqLbWpWkQ8XXpFmRULcVowwlI6qZWaorxT7kb8QKGFfkDkRsKSRlKGzEfGGi2ds5Yaidpwzkz8vuj6rHRKJ9pJPvHvaTjJjaxGr3h738OZCdMRzZTOD1XjMBHz1tKaYdXE0',
          },
        ],
      },
    ],
  },
  {
    id: '#AG-7540',
    date: '15/04/2026',
    dateISO: '2026-04-15',
    status: 'Entregado',
    total: '32.50€',
    address: 'Calle Mayor 42, Alicante',
    subOrders: [
      {
        id: '#AG-7540-A',
        producer: 'Turrones Hijos de Manuel Picó',
        location: 'Jijona, Alicante',
        status: 'Entregado',
        deliveryMethod: 'Mensajería',
        deliveryAddress: 'Calle Mayor 42, 3º B\n03002 Alicante, España',
        tracking: 'MRW-7540102',
        subtotal: '28.50€',
        shipping: '4.00€',
        total: '32.50€',
        incidentId: 'INC-002',
        products: [
          {
            name: 'Caja Degustación Turrón',
            detail: 'Surtido Artesanal',
            quantity: '3x',
            unitPrice: '9.50€',
            total: '28.50€',
            reviewed: true,
            image:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCztl1jLSI_oU4y3dHVhYVIrCAYSJged3hkgiEjDWviaz81U7U3BC_CqBaIw4qAqacQBNty84zaiY9bdB8yUXgFNkKuV_92ymuU99IrII2IjVhkw4aYCVXSStn6VOv9PgBZS5IyQyT0ZQo5yBANyjNsQSsEgGCub7AKDZYcgNAqvyHyrXMimBJnkp4enVL5FkjT0CxElvUzLZ5pXAhXshdtPJE9EEe1LgA4Uj0dWAVwsY7lL4hpmo6IQ83Rk8ckAUmHD__7_rYQqiw',
          },
        ],
      },
    ],
  },
  {
    id: '#AG-9012',
    date: '20/05/2026',
    dateISO: '2026-05-20',
    status: 'Confirmado',
    total: '41.80€',
    address: 'Avenida Denia 18, Alicante',
    subOrders: [
      {
        id: '#AG-9012-A',
        producer: 'Apícola Marina',
        location: 'Denia, Alicante',
        status: 'Confirmado',
        deliveryMethod: 'Mensajería estándar',
        deliveryAddress: 'Avenida Denia 18\n03015 Alicante, España',
        tracking: 'PENDIENTE-ASIGNACION',
        subtotal: '37.80€',
        shipping: '4.00€',
        total: '41.80€',
        incidentId: 'INC-003',
        products: [
          {
            name: 'Miel de Azahar Marina Alta',
            detail: 'Tarro 500g',
            quantity: '2x',
            unitPrice: '8.20€',
            total: '16.40€',
            image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=900&q=80',
          },
          {
            name: 'Pack infusiones mediterráneas',
            detail: '6 variedades locales',
            quantity: '1x',
            unitPrice: '21.40€',
            total: '21.40€',
            image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=900&q=80',
          },
        ],
      },
    ],
  },
  {
    id: '#AG-9110',
    date: '27/05/2026',
    dateISO: '2026-05-27',
    status: 'En preparación',
    total: '67.20€',
    address: 'Calle San Fernando 8, Alicante',
    subOrders: [
      {
        id: '#AG-9110-A',
        producer: 'Bodegas Monastrell',
        location: 'Villena, Alicante',
        status: 'En preparación',
        deliveryMethod: 'Punto de recogida',
        deliveryAddress: 'Punto Gourmet Alicante\nCalle San Fernando 8',
        tracking: 'RECOGIDA-9110',
        subtotal: '44.00€',
        shipping: '0.00€',
        total: '44.00€',
        products: [
          {
            name: 'Tinto Crianza Monastrell',
            detail: 'Botella 750ml',
            quantity: '2x',
            unitPrice: '22.00€',
            total: '44.00€',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2UjzXmY8KF0_4qO_MdscDSIVlv3R6d9K11EntdmKih-XDxMHoIRt8UeoIkH_vy3BXyK7EuTNrbkpvwG5SK3XXWhh76whZoBnvW0EDRxZhPzETApknTTvLXG1l0aqPSSVwB4xUJLwx6sQgJIviLCdhknPqpYJg7VxTzVnTfy5_bYsvDYwPBurNuWsjFb3cOf9ofFZ2jLKT_ZDYiSJNMqwhVebI9huuDYIazYf-Eiw81XUpznp_h1d1w9poAcoysIcCNWG_sWqsKnw',
          },
        ],
      },
      {
        id: '#AG-9110-B',
        producer: 'Cárnicas Pinoso',
        location: 'Pinoso, Alicante',
        status: 'En camino',
        deliveryMethod: 'Mensajería refrigerada',
        deliveryAddress: 'Calle San Fernando 8\n03002 Alicante, España',
        tracking: 'CORREOS-9110-B',
        subtotal: '19.20€',
        shipping: '4.00€',
        total: '23.20€',
        products: [
          {
            name: 'Longaniza Curada Artesana',
            detail: 'Formato degustación',
            quantity: '2x',
            unitPrice: '9.60€',
            total: '19.20€',
            image: 'https://images.unsplash.com/photo-1603046891726-36bfd957e0bf?auto=format&fit=crop&w=900&q=80',
          },
        ],
      },
    ],
  },
  {
    id: '#AG-8120',
    date: '02/03/2026',
    dateISO: '2026-03-02',
    status: 'Cancelado',
    total: '24.00€',
    address: 'Calle Mayor 42, Alicante',
    subOrders: [
      {
        id: '#AG-8120-A',
        producer: 'Panadería La Marina',
        location: 'Altea, Alicante',
        status: 'Cancelado',
        deliveryMethod: 'Entrega Personal',
        deliveryAddress: 'Mercado de Altea\nPuesto 7',
        tracking: 'CANCELADO-8120',
        subtotal: '24.00€',
        shipping: '0.00€',
        total: '24.00€',
        products: [
          {
            name: 'Coca salada tradicional',
            detail: 'Bandeja familiar',
            quantity: '2x',
            unitPrice: '12.00€',
            total: '24.00€',
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
          },
        ],
      },
    ],
  },
]

const pageSize = 5

export function HistorialPedidosPage() {
  const [searchParams] = useSearchParams()
  const initialSearch = searchParams.get('search') ?? ''
  const [search, setSearch] = useState(initialSearch)
  const [statusFilter, setStatusFilter] = useState<ConsumerOrderStatus | 'Todos'>('Todos')
  const [dateFilters, setDateFilters] = useState<DateFilters>({ from: '', to: '' })
  const [showDateFilters, setShowDateFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [reviewTarget, setReviewTarget] = useState<ReviewTarget | null>(null)
  const [reportPedidoLabel, setReportPedidoLabel] = useState<string | null>(null)
  const [reviewedKeys, setReviewedKeys] = useState<string[]>([])

  const orders = initialOrders.map((order) => ({
    ...order,
    subOrders: order.subOrders.map((subOrder) => ({
      ...subOrder,
      products: subOrder.products.map((product) => ({
        ...product,
        reviewed: product.reviewed || reviewedKeys.includes(getReviewKey(subOrder.id, product.name)),
      })),
    })),
  }))

  const normalizedSearch = search.trim().toLowerCase()
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !normalizedSearch ||
      [order.id, order.address, order.status, ...order.subOrders.flatMap((subOrder) => [
        subOrder.id,
        subOrder.producer,
        subOrder.location,
        subOrder.incidentId ?? '',
        ...subOrder.products.map((product) => product.name),
      ])]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    const matchesStatus = statusFilter === 'Todos' || order.status === statusFilter || order.subOrders.some((subOrder) => subOrder.status === statusFilter)
    const matchesFrom = !dateFilters.from || order.dateISO >= dateFilters.from
    const matchesTo = !dateFilters.to || order.dateISO <= dateFilters.to

    return matchesSearch && matchesStatus && matchesFrom && matchesTo
  })
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const visibleOrders = filteredOrders.slice((safePage - 1) * pageSize, safePage * pageSize)
  const selectedOrder = selectedOrderId ? orders.find((order) => order.id === selectedOrderId) ?? null : null

  function updateSearch(value: string) {
    setSearch(value)
    setCurrentPage(1)
  }

  function updateStatusFilter(filter: ConsumerOrderStatus | 'Todos') {
    setStatusFilter(filter)
    setCurrentPage(1)
  }

  function updateDateFilter(key: keyof DateFilters, value: string) {
    setDateFilters((current) => ({ ...current, [key]: value }))
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#1A1A1A]">
      <main className="mx-auto w-full max-w-[var(--layout-container-max)] px-[var(--space-margin-mobile)] py-16 md:px-[var(--space-margin-desktop)] md:py-24">
        <section className="mb-10">
          <nav aria-label="Breadcrumb" className="text-label-sm mb-6 flex items-center gap-2 text-[var(--color-outline)]">
            <Link to="/perfil" className="transition-colors hover:text-[var(--color-primary)]">
              Mi cuenta
            </Link>
            <ChevronRight size={14} strokeWidth={1.8} />
            <span className="text-[#1A1A1A]">Mis pedidos</span>
          </nav>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-display-lg mb-4 text-[#1A1A1A]">Mis pedidos</h1>
              <p className="text-body-md max-w-2xl text-[var(--color-on-surface-variant)]">
                Revisa el historial de tus compras y abre cada envío para seguir el avance por productor, valorar productos o reportar incidencias.
              </p>
            </div>
            <div className="border border-[color-mix(in_srgb,var(--color-outline-variant)_40%,transparent)] bg-white/45 px-5 py-4 text-right">
              <span className="text-label-sm block uppercase tracking-[0.18em] text-[var(--color-outline)]">Pedidos filtrados</span>
              <strong className="text-headline-md text-[28px] text-[#7A2E3A]">{filteredOrders.length}</strong>
            </div>
          </div>
        </section>

        <section className="mb-8 border border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-surface-container-lowest)] p-4 shadow-[0_18px_50px_-35px_rgba(122,46,58,0.35)] md:p-6" aria-label="Filtros de pedidos">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <Search size={18} strokeWidth={1.8} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--color-outline)]" />
              <input
                type="search"
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Buscar por pedido, producto, productor o incidencia..."
                className="text-body-md w-full border border-[var(--color-outline-variant)] bg-[#FAF7F0] py-3 pr-4 pl-11 text-[#1A1A1A] placeholder:text-[var(--color-outline)] focus:border-[#7A2E3A] focus:ring-0 focus:outline-none"
              />
            </label>
            <button
              type="button"
              onClick={() => setShowDateFilters((value) => !value)}
              className="text-label-md inline-flex items-center justify-center gap-2 border border-[var(--color-outline-variant)] px-5 py-3 uppercase tracking-wider text-[var(--color-secondary)] transition-colors hover:border-[#7A2E3A] hover:text-[#7A2E3A]"
            >
              <SlidersHorizontal size={18} strokeWidth={1.8} />
              Fechas
            </button>
          </div>

          {showDateFilters ? (
            <div className="mt-5 grid gap-4 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] pt-5 sm:grid-cols-2">
              <DateField label="Desde" value={dateFilters.from} onChange={(value) => updateDateFilter('from', value)} />
              <DateField label="Hasta" value={dateFilters.to} onChange={(value) => updateDateFilter('to', value)} />
            </div>
          ) : null}

          <div className="mt-5 flex gap-3 overflow-x-auto border-t border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] pt-5">
            {orderStatusFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => updateStatusFilter(filter)}
                className={`text-label-md whitespace-nowrap rounded-full border px-4 py-2 transition-all ${statusFilter === filter ? 'border-[#7A2E3A] bg-[#7A2E3A] text-white' : 'border-[var(--color-outline-variant)] bg-transparent text-[var(--color-on-surface-variant)] hover:border-[#7A2E3A] hover:text-[#7A2E3A]'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-4">
            {visibleOrders.map((order) => (
            <OrderRow key={order.id} order={order} highlighted={normalizedSearch.length > 0 && order.id.toLowerCase().includes(normalizedSearch)} onView={() => setSelectedOrderId(order.id)} />
          ))}
        </div>

        {visibleOrders.length === 0 ? (
          <div className="mt-10 border border-dashed border-[var(--color-outline-variant)] p-10 text-center">
            <Filter className="mx-auto mb-3 text-[var(--color-outline)]" size={28} strokeWidth={1.8} />
            <p className="text-body-md text-[var(--color-on-surface-variant)]">No hay pedidos que coincidan con los filtros aplicados.</p>
          </div>
        ) : null}

        <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </main>


      {selectedOrder ? (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrderId(null)}
          onReport={(subOrder) => setReportPedidoLabel(`Pedido ${selectedOrder.id} · ${subOrder.producer}`)}
          onReview={(subOrderId, product) => setReviewTarget({ subOrderId, product })}
        />
      ) : null}

      {reviewTarget ? (
        <ProductReviewModal
          product={reviewTarget.product}
          onClose={() => setReviewTarget(null)}
          onSubmit={() => {
            setReviewedKeys((current) => [...new Set([...current, getReviewKey(reviewTarget.subOrderId, reviewTarget.product.name)])])
            setReviewTarget(null)
          }}
        />
      ) : null}

      {reportPedidoLabel ? <ReportarIncidenciaModal initialPedidoLabel={reportPedidoLabel} onClose={() => setReportPedidoLabel(null)} /> : null}
    </div>
  )
}

function getReviewKey(subOrderId: string, productName: string) {
  return `${subOrderId}:${productName}`
}

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-label-sm uppercase tracking-wider text-[var(--color-outline)]">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="text-body-md border border-[var(--color-outline-variant)] bg-[#FAF7F0] px-4 py-3 text-[#1A1A1A] focus:border-[#7A2E3A] focus:ring-0 focus:outline-none"
      />
    </label>
  )
}

function OrderRow({ order, highlighted, onView }: { order: ConsumerOrder; highlighted: boolean; onView: () => void }) {
  const productCount = order.subOrders.reduce((total, subOrder) => total + subOrder.products.length, 0)
  const producers = order.subOrders.map((subOrder) => subOrder.producer).join(' · ')

  return (
    <article
      className={`group relative flex cursor-pointer flex-col gap-6 rounded-[var(--radius-lg)] border p-6 transition-colors md:flex-row md:items-center md:justify-between ${
        highlighted
          ? 'border-[#7A2E3A] bg-[color-mix(in_srgb,#7A2E3A_8%,white)] shadow-[0_18px_45px_-32px_rgba(122,46,58,0.65)]'
          : 'border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] bg-white/50 hover:border-[var(--color-outline-variant)]'
      }`}
      onClick={onView}
    >
      <div className="flex flex-grow flex-col gap-4 md:flex-row md:items-center md:gap-8">
        <OrderMeta label="Nº de pedido" value={order.id} />
        <OrderMeta label="Productores" value={producers} grow />
        <OrderMeta label="Fecha" value={order.date} />
        <OrderMeta label="Artículos" value={`${productCount} artículos`} />
        <OrderMeta label="Total" value={order.total} />
      </div>

      <div className="flex min-w-[220px] items-center justify-between gap-6 md:justify-end">
        <StatusBadge status={order.status} />
        <button type="button" className="text-label-md flex items-center gap-1 text-[#1A1A1A] transition-colors group-hover:underline hover:text-[#7A2E3A]">
          Ver detalle
          <ArrowRight size={18} strokeWidth={1.8} />
        </button>
      </div>
    </article>
  )
}

function OrderMeta({ label, value, grow = false }: { label: string; value: string; grow?: boolean }) {
  return (
    <div className={grow ? 'flex-grow' : 'min-w-[100px]'}>
      <span className="text-label-sm mb-1 block text-[var(--color-on-surface-variant)]">{label}</span>
      <span className="text-body-md font-medium text-[#1A1A1A]">{value}</span>
    </div>
  )
}

function StatusBadge({ status }: { status: ConsumerOrderStatus }) {
  const completed = status === 'Entregado'
  const cancelled = status === 'Cancelado'

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${completed ? 'border-green-200 bg-green-50 text-green-800' : cancelled ? 'border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)]' : 'border-[color-mix(in_srgb,var(--color-primary)_25%,transparent)] bg-[var(--color-surface-container-high)] text-[#1A1A1A]'}`}>
      {completed ? <CheckCircle2 size={14} strokeWidth={1.8} className="mr-1" /> : <span className="mr-1.5 size-1.5 rounded-full bg-[var(--color-primary)]" />}
      {status}
    </span>
  )
}

function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
  return (
    <div className="mt-16 flex items-center justify-center gap-4 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] pt-8">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex size-10 items-center justify-center rounded-full border border-[var(--color-outline-variant)] text-[var(--color-outline)] transition-colors hover:border-[#1A1A1A] hover:text-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft size={18} strokeWidth={1.8} />
      </button>
      <div className="text-label-md flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button key={page} type="button" onClick={() => onPageChange(page)} className={`flex size-10 items-center justify-center rounded-full transition-colors ${page === currentPage ? 'bg-[var(--color-surface-container-high)] text-[#1A1A1A]' : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)]'}`}>
            {page}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex size-10 items-center justify-center rounded-full border border-[var(--color-outline-variant)] text-[var(--color-outline)] transition-colors hover:border-[#1A1A1A] hover:text-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronRight size={18} strokeWidth={1.8} />
      </button>
    </div>
  )
}
