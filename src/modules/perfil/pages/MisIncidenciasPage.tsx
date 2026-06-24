import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Clock3, Filter, Flag, MessageSquare, Package, Search, X } from 'lucide-react'
import { ReportarIncidenciaModal } from '../componentes/IncidenciaModals'

type IncidenciaStatus = 'Abierta' | 'En revisión' | 'Resuelta' | 'Cerrada'
type IncidenciaPrioridad = 'Baja' | 'Media' | 'Alta' | 'Crítica'

type IncidenciaUpdate = {
  fecha: string
  agente: string
  texto: string
}

type Incidencia = {
  id: string
  titulo: string
  pedidoRef: string
  fecha: string
  status: IncidenciaStatus
  prioridad: IncidenciaPrioridad
  motivo: string
  descripcion: string
  resolucion?: {
    texto: string
    fecha: string
  }
  seguimiento: IncidenciaUpdate[]
}

const initialIncidencias: Incidencia[] = [
  {
    id: 'INC-001',
    titulo: 'Retraso en la entrega',
    pedidoRef: '#AG-8821',
    fecha: '12/05/2026',
    status: 'En revisión',
    prioridad: 'Alta',
    motivo: 'Entrega retrasada',
    descripcion:
      'El pedido debería haber llegado hace dos días según el seguimiento proporcionado. No he recibido ninguna actualización por parte de la empresa de transporte.',
    seguimiento: [
      { fecha: '12/05/2026 09:30', agente: 'Cliente', texto: 'Reporte inicial creado desde Mis pedidos.' },
      { fecha: '12/05/2026 12:15', agente: 'Atención artesanal', texto: 'Se solicitó actualización al operador logístico.' },
      { fecha: '13/05/2026 10:40', agente: 'Logística', texto: 'El paquete se encuentra en reparto con incidencia de ruta.' },
    ],
  },
  {
    id: 'INC-002',
    titulo: 'Producto defectuoso',
    pedidoRef: '#AG-7540',
    fecha: '15/04/2026',
    status: 'Resuelta',
    prioridad: 'Media',
    motivo: 'Producto dañado',
    descripcion:
      'Una de las botellas de aceite de oliva virgen extra llegó con el precinto roto y goteando. Adjunto fotos del embalaje dañado.',
    resolucion: {
      texto:
        'Hemos procedido al reembolso íntegro del producto. Lamentamos las molestias. Como gesto de buena voluntad, hemos añadido 50 puntos de fidelidad a su cuenta.',
      fecha: 'Finalizado el 16/04/2026',
    },
    seguimiento: [
      { fecha: '15/04/2026 18:12', agente: 'Cliente', texto: 'Reporte creado con evidencia fotográfica.' },
      { fecha: '16/04/2026 09:10', agente: 'Aceites de la Montaña', texto: 'El productor confirmó rotura durante transporte.' },
      { fecha: '16/04/2026 11:45', agente: 'Atención artesanal', texto: 'Reembolso aprobado y puntos de fidelidad añadidos.' },
    ],
  },
  {
    id: 'INC-003',
    titulo: 'Error en entrega',
    pedidoRef: '#AG-9012',
    fecha: '20/05/2026',
    status: 'Abierta',
    prioridad: 'Crítica',
    motivo: 'Producto incorrecto',
    descripcion:
      'He recibido una selección de quesos diferente a la que pedí. Falta el queso de cabra artesano de la Marina Alta.',
    seguimiento: [
      { fecha: '20/05/2026 17:05', agente: 'Cliente', texto: 'Incidencia creada y pendiente de primera revisión.' },
    ],
  },
  {
    id: 'INC-004',
    titulo: 'Consulta sobre punto de recogida',
    pedidoRef: '#AG-9110',
    fecha: '27/05/2026',
    status: 'Abierta',
    prioridad: 'Baja',
    motivo: 'Cambio de recogida',
    descripcion:
      'Necesito confirmar si puedo recoger el pedido el sábado por la mañana en lugar del viernes por la tarde.',
    seguimiento: [
      { fecha: '27/05/2026 08:50', agente: 'Cliente', texto: 'Solicitud de cambio de horario enviada.' },
    ],
  },
  {
    id: 'INC-005',
    titulo: 'Cancelación cerrada',
    pedidoRef: '#AG-8120',
    fecha: '03/03/2026',
    status: 'Cerrada',
    prioridad: 'Media',
    motivo: 'Cancelación de pedido',
    descripcion:
      'El productor no pudo preparar la coca salada por falta de stock. La cancelación fue aceptada por ambas partes.',
    seguimiento: [
      { fecha: '02/03/2026 13:20', agente: 'Productor', texto: 'Stock insuficiente comunicado.' },
      { fecha: '03/03/2026 10:00', agente: 'Atención artesanal', texto: 'Caso cerrado tras reembolso automático.' },
    ],
  },
  {
    id: 'INC-006',
    titulo: 'Factura con datos incompletos',
    pedidoRef: '#AG-8822',
    fecha: '14/05/2026',
    status: 'En revisión',
    prioridad: 'Baja',
    motivo: 'Documento de compra',
    descripcion:
      'El comprobante descargado no incluye el NIF que indiqué en mi perfil. Solicito la corrección del documento.',
    seguimiento: [
      { fecha: '14/05/2026 12:00', agente: 'Cliente', texto: 'Solicitud recibida con captura del comprobante.' },
      { fecha: '14/05/2026 15:35', agente: 'Administración', texto: 'Datos fiscales en validación.' },
    ],
  },
]

const statusFilters: Array<IncidenciaStatus | 'Todas'> = ['Todas', 'Abierta', 'En revisión', 'Resuelta', 'Cerrada']
const priorityFilters: Array<IncidenciaPrioridad | 'Todas'> = ['Todas', 'Baja', 'Media', 'Alta', 'Crítica']
const pageSize = 5

function statusBadgeClass(status: IncidenciaStatus): string {
  switch (status) {
    case 'En revisión':
      return 'bg-[var(--color-secondary-fixed)] text-[var(--color-on-secondary-fixed)]'
    case 'Resuelta':
      return 'bg-green-100 text-green-800'
    case 'Abierta':
      return 'bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed)]'
    case 'Cerrada':
      return 'bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)]'
  }
}

function priorityBadgeClass(prioridad: IncidenciaPrioridad): string {
  switch (prioridad) {
    case 'Crítica':
      return 'border-red-300 text-red-800 bg-red-50'
    case 'Alta':
      return 'border-orange-300 text-orange-800 bg-orange-50'
    case 'Media':
      return 'border-amber-300 text-amber-800 bg-amber-50'
    case 'Baja':
      return 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container-low)]'
  }
}

export function MisIncidenciasPage() {
  const [searchParams] = useSearchParams()
  const [incidencias, setIncidencias] = useState(initialIncidencias)
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [statusFilter, setStatusFilter] = useState<IncidenciaStatus | 'Todas'>('Todas')
  const [priorityFilter, setPriorityFilter] = useState<IncidenciaPrioridad | 'Todas'>('Todas')
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selectedIncidencia, setSelectedIncidencia] = useState<Incidencia | null>(null)

  const normalizedSearch = search.trim().toLowerCase()
  const incidenciasFiltradas = incidencias.filter((incidencia) => {
    const matchesSearch =
      !normalizedSearch ||
      [incidencia.id, incidencia.pedidoRef, incidencia.titulo, incidencia.motivo, incidencia.descripcion, incidencia.prioridad]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    const matchesStatus = statusFilter === 'Todas' || incidencia.status === statusFilter
    const matchesPriority = priorityFilter === 'Todas' || incidencia.prioridad === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })
  const totalPages = Math.max(1, Math.ceil(incidenciasFiltradas.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const visibleIncidencias = incidenciasFiltradas.slice((safePage - 1) * pageSize, safePage * pageSize)

  function updateSearch(value: string) {
    setSearch(value)
    setCurrentPage(1)
  }

  function updateStatusFilter(filter: IncidenciaStatus | 'Todas') {
    setStatusFilter(filter)
    setCurrentPage(1)
  }

  function updatePriorityFilter(filter: IncidenciaPrioridad | 'Todas') {
    setPriorityFilter(filter)
    setCurrentPage(1)
  }

  function updateIncidenciaStatus(id: string, status: IncidenciaStatus) {
    setIncidencias((current) => current.map((incidencia) => incidencia.id === id ? { ...incidencia, status } : incidencia))
    setSelectedIncidencia((current) => current?.id === id ? { ...current, status } : current)
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <main className="mx-auto min-h-screen max-w-[var(--layout-container-max)] px-[var(--space-margin-mobile)] py-12 md:px-[var(--space-margin-desktop)]">
        <header className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <nav className="text-label-md mb-4 flex items-center gap-2 text-[var(--color-on-surface-variant)]/60">
              <Link to="/perfil" className="transition-colors hover:text-[#7A2E3A]">Mi Cuenta</Link>
              <ChevronRight size={14} strokeWidth={1.8} />
              <span className="text-[var(--color-on-surface)]">Mis incidencias</span>
            </nav>
            <h1 className="text-headline-lg text-[var(--color-on-background)]">Mis incidencias</h1>
            <p className="text-body-md mt-4 leading-relaxed text-[var(--color-on-surface-variant)]">
              Gestiona tus reportes y consultas sobre pedidos. Cada caso mantiene su prioridad, seguimiento y conexión directa con el pedido original.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="text-label-md flex items-center gap-3 bg-[#7A2E3A] px-8 py-4 uppercase tracking-widest text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
          >
            <Flag size={20} strokeWidth={1.6} />
            Reportar incidencia
          </button>
        </header>

        <section className="mb-8 border border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-surface-container-lowest)] p-4 md:p-6" aria-label="Filtros de incidencias">
          <label className="relative block">
            <Search size={18} strokeWidth={1.8} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--color-outline)]" />
            <input
              type="search"
              value={search}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Buscar por incidencia, pedido, motivo o prioridad..."
              className="text-body-md w-full border border-[var(--color-outline-variant)] bg-[#FAF7F0] py-3 pr-4 pl-11 text-[#1A1A1A] placeholder:text-[var(--color-outline)] focus:border-[#7A2E3A] focus:ring-0 focus:outline-none"
            />
          </label>

          <div className="mt-5 flex gap-3 overflow-x-auto border-t border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] pt-5">
            {statusFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => updateStatusFilter(filter)}
                className={`text-label-md whitespace-nowrap border px-5 py-2 transition-all ${statusFilter === filter ? 'border-[#7A2E3A] bg-[#7A2E3A] text-white' : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface)] hover:border-[#7A2E3A]'}`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto">
            {priorityFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => updatePriorityFilter(filter)}
                className={`text-label-sm whitespace-nowrap rounded-full border px-4 py-2 transition-all ${priorityFilter === filter ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)] text-white' : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)]'}`}
              >
                Prioridad {filter}
              </button>
            ))}
          </div>
        </section>

        <div className="space-y-6">
          {visibleIncidencias.map((incidencia) => (
            <IncidenciaCard
              key={incidencia.id}
              incidencia={incidencia}
              highlighted={normalizedSearch.length > 0 && [incidencia.id, incidencia.pedidoRef].join(' ').toLowerCase().includes(normalizedSearch)}
              onView={() => setSelectedIncidencia(incidencia)}
            />
          ))}
        </div>

        {visibleIncidencias.length === 0 ? (
          <div className="mt-10 border border-dashed border-[var(--color-outline-variant)] p-10 text-center">
            <Filter className="mx-auto mb-3 text-[var(--color-outline)]" size={28} strokeWidth={1.8} />
            <p className="text-body-md text-[var(--color-on-surface-variant)]">No hay incidencias que coincidan con los filtros aplicados.</p>
          </div>
        ) : null}

        <IncidenciasPagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </main>


      {showModal ? <ReportarIncidenciaModal onClose={() => setShowModal(false)} /> : null}
      {selectedIncidencia ? (
        <DetalleIncidenciaModal
          incidencia={selectedIncidencia}
          onClose={() => setSelectedIncidencia(null)}
          onStatusChange={(status) => updateIncidenciaStatus(selectedIncidencia.id, status)}
        />
      ) : null}
    </div>
  )
}

function IncidenciaCard({ incidencia, highlighted, onView }: { incidencia: Incidencia; highlighted: boolean; onView: () => void }) {
  return (
    <article className={`border p-6 shadow-[0_10px_30px_-15px_rgba(122,46,58,0.08)] transition-transform hover:-translate-y-0.5 md:p-8 ${highlighted ? 'border-[#7A2E3A] bg-[color-mix(in_srgb,#7A2E3A_8%,white)]' : 'border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] bg-[var(--color-surface-container-lowest)]'}`}>
      <div className="flex flex-col justify-between gap-6 md:flex-row">
        <div className="flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className={`text-label-sm px-3 py-1 uppercase tracking-wider ${statusBadgeClass(incidencia.status)}`}>
              {incidencia.status}
            </span>
            <span className={`text-label-sm rounded-full border px-3 py-1 ${priorityBadgeClass(incidencia.prioridad)}`}>
              Prioridad {incidencia.prioridad}
            </span>
            <span className="text-label-md text-[var(--color-on-surface-variant)]">{incidencia.fecha}</span>
          </div>

          <h2 className="text-headline-md mb-2 text-[24px] text-[var(--color-on-surface)]">{incidencia.titulo}</h2>
          <p className="text-label-md mb-3 text-[var(--color-secondary)]">{incidencia.motivo}</p>

          <Link
            to={`/pedidos?search=${encodeURIComponent(incidencia.pedidoRef)}`}
            className="text-label-md mb-6 inline-flex items-center gap-2 text-[#7A2E3A] transition-colors hover:underline"
          >
            <Package size={18} strokeWidth={1.6} />
            Pedido {incidencia.pedidoRef}
          </Link>

          <p className="text-body-md max-w-3xl text-[var(--color-on-surface-variant)]">
            {incidencia.descripcion}
          </p>
        </div>

        <div className="flex gap-4 self-start md:flex-col md:justify-end">
          <button
            type="button"
            onClick={onView}
            className="text-label-md border border-[var(--color-outline)] px-6 py-3 transition-colors hover:bg-[var(--color-surface-variant)]"
          >
            Ver detalle
          </button>
          <Link
            to={`/pedidos?search=${encodeURIComponent(incidencia.pedidoRef)}`}
            className="text-label-md inline-block border border-[var(--color-outline)] px-6 py-3 text-center transition-colors hover:bg-[var(--color-surface-variant)]"
          >
            Ver pedido
          </Link>
        </div>
      </div>
    </article>
  )
}

function DetalleIncidenciaModal({ incidencia, onClose, onStatusChange }: { incidencia: Incidencia; onClose: () => void; onStatusChange: (status: IncidenciaStatus) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#1A1A1A]/55 p-4 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-labelledby="detalle-incidencia-title">
      <div className="relative max-h-full w-full max-w-3xl overflow-y-auto border border-[var(--color-outline-variant)] bg-[#FAF7F0] shadow-2xl">
        <button type="button" aria-label="Cerrar modal" onClick={onClose} className="absolute top-5 right-5 z-10 p-2 text-[var(--color-on-surface-variant)] transition-colors hover:text-[#7A2E3A]">
          <X size={24} strokeWidth={1.8} />
        </button>

        <div className="p-6 sm:p-10">
          <header className="mb-8 pr-12">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className={`text-label-sm px-3 py-1 uppercase tracking-wider ${statusBadgeClass(incidencia.status)}`}>{incidencia.status}</span>
              <span className={`text-label-sm rounded-full border px-3 py-1 ${priorityBadgeClass(incidencia.prioridad)}`}>Prioridad {incidencia.prioridad}</span>
            </div>
            <h2 id="detalle-incidencia-title" className="text-headline-lg text-[#1A1A1A]">{incidencia.id}</h2>
            <p className="text-body-lg mt-2 text-[var(--color-on-surface-variant)]">{incidencia.titulo} · Pedido {incidencia.pedidoRef}</p>
          </header>

          <section className="mb-8 grid gap-4 border border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-surface-container-lowest)] p-5 sm:grid-cols-2">
            <DetailItem label="Fecha" value={incidencia.fecha} />
            <DetailItem label="Motivo" value={incidencia.motivo} />
            <DetailItem label="Pedido relacionado" value={incidencia.pedidoRef} />
            <DetailItem label="Prioridad" value={incidencia.prioridad} />
          </section>

          <section className="mb-8">
            <h3 className="text-label-md mb-3 uppercase tracking-widest text-[var(--color-outline)]">Descripción</h3>
            <p className="text-body-md leading-relaxed text-[var(--color-on-surface-variant)]">{incidencia.descripcion}</p>
          </section>

          {incidencia.resolucion ? (
            <section className="relative mb-8 overflow-hidden border-l-4 border-[var(--color-secondary)] bg-[color-mix(in_srgb,var(--color-secondary-container)_20%,transparent)] p-6">
              <h3 className="text-label-md mb-3 uppercase tracking-widest text-[var(--color-secondary)]">Resolución del equipo</h3>
              <p className="text-body-md italic leading-relaxed text-[var(--color-on-secondary-container)]">{incidencia.resolucion.texto}</p>
              <p className="text-label-sm mt-4 text-[var(--color-on-surface-variant)]">{incidencia.resolucion.fecha}</p>
            </section>
          ) : null}

          <section className="mb-8">
            <h3 className="text-label-md mb-4 flex items-center gap-2 uppercase tracking-widest text-[var(--color-outline)]">
              <Clock3 size={16} strokeWidth={1.8} />
              Seguimiento
            </h3>
            <ol className="space-y-4 border-l border-[var(--color-outline-variant)] pl-5">
              {incidencia.seguimiento.map((update) => (
                <li key={`${update.fecha}-${update.agente}`} className="relative">
                  <span className="absolute -left-[27px] top-1 size-3 rounded-full bg-[#7A2E3A]" />
                  <p className="text-label-sm uppercase tracking-wider text-[var(--color-outline)]">{update.fecha} · {update.agente}</p>
                  <p className="text-body-md mt-1 text-[#1A1A1A]">{update.texto}</p>
                </li>
              ))}
            </ol>
          </section>

          <footer className="flex flex-col gap-3 border-t border-[var(--color-outline-variant)] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to={`/pedidos?search=${encodeURIComponent(incidencia.pedidoRef)}`}
              className="text-label-md inline-flex items-center justify-center gap-2 border border-[var(--color-outline)] px-6 py-3 transition-colors hover:bg-[var(--color-surface-variant)]"
            >
              <Package size={18} strokeWidth={1.6} />
              Ver pedido
            </Link>

            <div className="flex flex-col gap-3 sm:flex-row">
              {incidencia.status === 'Abierta' ? (
                <button type="button" onClick={() => onStatusChange('Cerrada')} className="text-label-md border border-[var(--color-outline)] px-6 py-3 text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-variant)]">
                  Cancelar incidencia
                </button>
              ) : null}
              {incidencia.status === 'En revisión' ? (
                <span className="text-label-md inline-flex items-center gap-2 px-2 py-3 text-[var(--color-on-surface-variant)]">
                  <MessageSquare size={17} strokeWidth={1.7} />
                  Esperando respuesta del equipo
                </span>
              ) : null}
              {incidencia.status === 'Resuelta' ? (
                <>
                  <button type="button" onClick={() => onStatusChange('Cerrada')} className="text-label-md border border-[var(--color-outline)] px-6 py-3 transition-colors hover:bg-[var(--color-surface-variant)]">
                    Cerrar incidencia
                  </button>
                  <button type="button" onClick={() => onStatusChange('En revisión')} className="text-label-md bg-[#7A2E3A] px-6 py-3 text-white transition-colors hover:bg-[#63222d]">
                    No conforme
                  </button>
                </>
              ) : null}
              <button type="button" onClick={onClose} className="text-label-md bg-[#7A2E3A] px-6 py-3 text-white transition-colors hover:bg-[#63222d]">
                Volver
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-label-sm mb-1 uppercase tracking-wider text-[var(--color-outline)]">{label}</p>
      <p className="text-body-md text-[#1A1A1A]">{value}</p>
    </div>
  )
}

function IncidenciasPagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
  return (
    <nav className="mt-16 flex items-center justify-center gap-4 pb-12" aria-label="Paginación de incidencias">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex size-10 items-center justify-center border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] transition-all hover:border-[#7A2E3A] hover:text-[#7A2E3A] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft size={18} strokeWidth={1.8} />
      </button>
      <div className="flex gap-2">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`text-label-md flex size-10 items-center justify-center transition-all ${
              page === currentPage
                ? 'bg-[#7A2E3A] text-white'
                : 'border border-[var(--color-outline-variant)] hover:border-[#7A2E3A] hover:text-[#7A2E3A]'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex size-10 items-center justify-center border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] transition-all hover:border-[#7A2E3A] hover:text-[#7A2E3A] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronRight size={18} strokeWidth={1.8} />
      </button>
    </nav>
  )
}
