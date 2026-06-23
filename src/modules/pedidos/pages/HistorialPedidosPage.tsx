import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'
import { OrderDetailModal, ProductReviewModal } from '../componentes/ConsumerOrderModals'

export type ConsumerOrderStatus = 'PENDIENTE' | 'ENTREGADO' | 'ENVIADO' 

export type ConsumerOrderProduct = {
  name: string
  detail: string
  quantity: string
  unitPrice: string
  total: string
  image: string
}

export type ConsumerOrder = {
  id: string
  producer: string
  date: string
  location: string
  itemsLabel: string
  total: string
  status: ConsumerOrderStatus
  deliveryMethod: string
  deliveryAddress: string
  tracking: string
  subtotal: string
  shipping: string
  products: ConsumerOrderProduct[]
}

type OrderGroup = {
  dateLabel: string
  shipmentsLabel: string
  orders: ConsumerOrder[]
}

const orders: ConsumerOrder[] = [
  {
    id: '#AG-8821',
    producer: 'Aceites de la Montaña',
    date: '12/05/2024',
    location: 'Beniardá, Alicante',
    itemsLabel: '2 artículos',
    total: '49.45€',
    status: 'ENVIADO',
    deliveryMethod: 'Mensajería Urgente Frío',
    deliveryAddress: 'Calle Mayor 42, 3º B\n03002 Alicante, España',
    tracking: 'SEUR-882910399X',
    subtotal: '43.95€',
    shipping: '5.50€',
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
  {
    id: '#AG-8822',
    producer: 'Quesería San Antonio',
    date: '12/05/2024',
    location: 'Elche, Alicante',
    itemsLabel: '1 artículo',
    total: '2.00€',
    status: 'PENDIENTE',
    deliveryMethod: 'Entrega Personal',
    deliveryAddress: 'Mercado Central, Puesto 18\n03201 Elche, España',
    tracking: 'ENTREGA-PRODUCTOR-8822',
    subtotal: '0.00€',
    shipping: '2.00€',
    products: [
      {
        name: 'Queso de Cabra con Romero',
        detail: 'Maduración corta, 400g',
        quantity: '1x',
        unitPrice: '0.00€',
        total: '0.00€',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuACPw5Xagty6uEGbAZPt7ougTRDN902sBzFlMw3a1iad08kHrucHlAZMuCm45n0aFBm-2n17K219zgG62l8PedvWPwNE0hrPq846JdPvDYCL0qp8yGaOj0PExI84qrkFo64pdWvec7foqLbWpWkQ8XXpFmRULcVowwlI6qZWaorxT7kb8QKGFfkDkRsKSRlKGzEfGGi2ds5Yaidpwzkz8vuj6rHRKJ9pJPvHvaTjJjaxGr3h738OZCdMRzZTOD1XjMBHz1tKaYdXE0',
      },
    ],
  },
  {
    id: '#AG-7540',
    producer: 'Turrones Hijos de Manuel Picó',
    date: '15/04/2024',
    location: 'Jijona, Alicante',
    itemsLabel: '3 artículos',
    total: '32.50€',
    status: 'ENTREGADO',
    deliveryMethod: 'Mensajería',
    deliveryAddress: 'Calle Mayor 42, 3º B\n03002 Alicante, España',
    tracking: 'MRW-7540102',
    subtotal: '28.50€',
    shipping: '4.00€',
    products: [
      {
        name: 'Caja Degustación Turrón',
        detail: 'Surtido Artesanal',
        quantity: '3x',
        unitPrice: '9.50€',
        total: '28.50€',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCztl1jLSI_oU4y3dHVhYVIrCAYSJged3hkgiEjDWviaz81U7U3BC_CqBaIw4qAqacQBNty84zaiY9bdB8yUXgFNkKuV_92ymuU99IrII2IjVhkw4aYCVXSStn6VOv9PgBZS5IyQyT0ZQo5yBANyjNsQSsEgGCub7AKDZYcgNAqvyHyrXMimBJnkp4enVL5FkjT0CxElvUzLZ5pXAhXshdtPJE9EEe1LgA4Uj0dWAVwsY7lL4hpmo6IQ83Rk8ckAUmHD__7_rYQqiw',
      },
    ],
  },
]

const orderGroups: OrderGroup[] = [
  {
    dateLabel: 'Compra del 12/05/2024',
    shipmentsLabel: '2 Envíos separados',
    orders: orders.slice(0, 2),
  },
  {
    dateLabel: 'Compra del 15/04/2024',
    shipmentsLabel: '1 Envío',
    orders: orders.slice(2),
  },
]

const filters = ['Todos', 'Pendiente', 'En preparación', 'Enviado', 'Entregado', 'Cancelado']

export function HistorialPedidosPage() {
  const [selectedOrder, setSelectedOrder] = useState<ConsumerOrder | null>(null)
  const [reviewProduct, setReviewProduct] = useState<ConsumerOrderProduct | null>(null)

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#1A1A1A]">
      <main className="mx-auto w-full max-w-[var(--layout-container-max)] px-[var(--space-margin-mobile)] py-16 md:px-[var(--space-margin-desktop)] md:py-24">
        <section className="mb-12">
          <nav aria-label="Breadcrumb" className="text-label-sm mb-6 flex items-center gap-2 text-[var(--color-outline)]">
            <Link to="/perfil" className="transition-colors hover:text-[var(--color-primary)]">
              Mi cuenta
            </Link>
            <ChevronRight size={14} strokeWidth={1.8} />
            <span className="text-[#1A1A1A]">Mis pedidos</span>
          </nav>
          <h1 className="text-display-lg mb-4 text-[#1A1A1A]">Mis pedidos</h1>
          <p className="text-body-md max-w-2xl text-[var(--color-on-surface-variant)]">
            Revisa el historial de tus compras y el estado de tus pedidos actuales. Cada envío es preparado con cuidado por nuestros productores artesanales.
          </p>
        </section>

        <div className="mb-10 flex gap-3 overflow-x-auto border-b border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] pb-4">
          {filters.map((filter, index) => (
            <button
              key={filter}
              type="button"
              className={`text-label-md whitespace-nowrap rounded-full border px-4 py-2 transition-all ${index === 0 ? 'border-[#7A2E3A] bg-[#7A2E3A] text-white' : 'border-[var(--color-outline-variant)] bg-transparent text-[var(--color-on-surface-variant)] hover:border-[#7A2E3A] hover:text-[#7A2E3A]'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-12">
          {orderGroups.map((group) => (
            <section key={group.dateLabel}>
              <div className="mb-4 flex items-end justify-between border-b border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] pb-2">
                <h2 className="text-label-md uppercase tracking-wider text-[var(--color-outline)]">{group.dateLabel}</h2>
                <span className="text-label-sm text-[var(--color-on-surface-variant)]">{group.shipmentsLabel}</span>
              </div>

              <div className="flex flex-col gap-4">
                {group.orders.map((order) => (
                  <OrderRow key={order.id} order={order} onView={() => setSelectedOrder(order)} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <Pagination />
      </main>

      <OrdersFooter />

      {selectedOrder ? (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onReview={(product) => {
            setReviewProduct(product)
          }}
        />
      ) : null}

      {reviewProduct ? <ProductReviewModal product={reviewProduct} onClose={() => setReviewProduct(null)} /> : null}
    </div>
  )
}

function OrderRow({ order, onView }: { order: ConsumerOrder; onView: () => void }) {
  const delivered = order.status === 'ENTREGADO'

  return (
    <article className={`group relative flex cursor-pointer flex-col gap-6 rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] p-6 transition-colors hover:border-[var(--color-outline-variant)] md:flex-row md:items-center md:justify-between ${delivered ? 'bg-transparent opacity-80 hover:opacity-100' : 'bg-white/50'}`} onClick={onView}>
      <div className="flex flex-grow flex-col gap-4 md:flex-row md:items-center md:gap-8">
        <OrderMeta label="Nº de pedido" value={order.id} />
        <OrderMeta label="Productor" value={order.producer} grow />
        <OrderMeta label="Artículos" value={order.itemsLabel} />
        <OrderMeta label="Total" value={order.total} />
      </div>

      <div className="flex min-w-[200px] items-center justify-between gap-6 md:justify-end">
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
  if (status === 'ENTREGADO') {
    return (
      <span className="inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--color-outline-variant)_20%,transparent)] bg-[var(--color-surface-container-low)] px-2.5 py-1 text-xs font-medium text-[var(--color-on-surface-variant)]">
        <CheckCircle2 size={14} strokeWidth={1.8} className="mr-1" />
        ENTREGADO
      </span>
    )
  }

  return (
    <span className="inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] bg-[var(--color-surface-container-high)] px-2.5 py-1 text-xs font-medium text-[#1A1A1A]">
      <span className="mr-1.5 size-1.5 rounded-full bg-[var(--color-primary)]" />
      PENDIENTE
    </span>
  )
}

function Pagination() {
  return (
    <div className="mt-16 flex items-center justify-center gap-4 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] pt-8">
      <button type="button" disabled className="flex size-10 items-center justify-center rounded-full border border-[var(--color-outline-variant)] text-[var(--color-outline)] opacity-50 disabled:cursor-not-allowed">
        <ChevronLeft size={18} strokeWidth={1.8} />
      </button>
      <div className="text-label-md flex items-center gap-2">
        {[1, 2, 3].map((page) => (
          <button key={page} type="button" className={`flex size-10 items-center justify-center rounded-full transition-colors ${page === 1 ? 'bg-[var(--color-surface-container-high)] text-[#1A1A1A]' : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)]'}`}>
            {page}
          </button>
        ))}
      </div>
      <button type="button" className="flex size-10 items-center justify-center rounded-full border border-[var(--color-outline-variant)] text-[var(--color-outline)] transition-colors hover:border-[#1A1A1A] hover:text-[#1A1A1A]">
        <ChevronRight size={18} strokeWidth={1.8} />
      </button>
    </div>
  )
}

function OrdersFooter() {
  return (
    <footer className="mt-auto w-full border-t border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] bg-[var(--color-surface-container-lowest)] py-16">
      <div className="mx-auto flex max-w-[var(--layout-container-max)] flex-col items-center justify-between gap-8 px-[var(--space-margin-mobile)] md:flex-row md:px-[var(--space-margin-desktop)]">
        <div className="text-headline-md text-[var(--color-primary)]">L'Essence d'Alicante</div>
        <nav className="text-label-sm flex flex-wrap justify-center gap-6 text-[var(--color-secondary)]" aria-label="Footer">
          {['Privacy Policy', 'Terms of Service', 'Shipping & Returns', 'Contact Us', 'Our Story'].map((item) => (
            <a key={item} href="#" className="text-[var(--color-on-surface-variant)] transition-all hover:text-[var(--color-primary)] hover:underline">
              {item}
            </a>
          ))}
        </nav>
        <p className="text-label-sm text-center text-[var(--color-secondary)] md:text-right">© 2024 L'Essence d'Alicante. Artisanal Excellence from the Mediterranean.</p>
      </div>
    </footer>
  )
}
