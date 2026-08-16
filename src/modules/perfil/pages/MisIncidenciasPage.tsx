import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Filter, Flag, Package, Search, X } from 'lucide-react'
import { formatMoney, formatMoneyFromCents } from '../../../lib/formatMoney'
import { resolveErrorMessage } from '../../../lib/errorMessages'
import { useConsumerIncidentQuery, useConsumerIncidentsQuery } from '../../incidencias/hooks'
import { getIncidentLineTotalCents } from '../../incidencias/incidencias.money'
import type { ConsumerIncidentDetail, ConsumerIncidentSummary } from '../../incidencias/incidencias.schema'

type StatusFilter = 'ALL' | 'OPEN' | 'RESOLVED'
const pageSize = 5

export function MisIncidenciasPage() {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null)
  const incidentsQuery = useConsumerIncidentsQuery()
  const detailQuery = useConsumerIncidentQuery(selectedIncidentId)
  const incidents = incidentsQuery.data ?? []
  const normalizedSearch = search.trim().toLowerCase()
  const filteredIncidents = incidents.filter((incident) => {
    const matchesStatus = statusFilter === 'ALL' || incident.status === statusFilter
    const matchesSearch = !normalizedSearch || [incident.id, incident.reportReason, incident.target.subOrderId, incident.target.producerBusinessName, incident.target.fulfillmentStatus]
      .join(' ').toLowerCase().includes(normalizedSearch)
    return matchesStatus && matchesSearch
  })
  const totalPages = Math.max(1, Math.ceil(filteredIncidents.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const visibleIncidents = filteredIncidents.slice((safePage - 1) * pageSize, safePage * pageSize)

  function updateSearch(value: string) {
    setSearch(value)
    setCurrentPage(1)
  }

  function updateStatus(value: StatusFilter) {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <main className="mx-auto min-h-screen max-w-[var(--layout-container-max)] px-[var(--space-margin-mobile)] py-12 md:px-[var(--space-margin-desktop)]">
        <header className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <nav className="text-label-md mb-4 flex items-center gap-2 text-[var(--color-on-surface-variant)]/60">
              <Link to="/perfil" className="transition-colors hover:text-[#7A2E3A]">Mi cuenta</Link>
              <ChevronRight size={14} strokeWidth={1.8} />
              <span className="text-[var(--color-on-surface)]">Mis incidencias</span>
            </nav>
            <h1 className="text-headline-lg text-[var(--color-on-background)]">Mis incidencias</h1>
            <p className="text-body-md mt-4 leading-relaxed text-[var(--color-on-surface-variant)]">Consulta los problemas reportados sobre tus entregas y la resolución registrada por el equipo.</p>
          </div>
          <Link to="/pedidos" className="text-label-md flex items-center gap-3 bg-[#7A2E3A] px-8 py-4 uppercase tracking-widest text-white shadow-lg transition-opacity hover:opacity-90">
            <Flag size={20} strokeWidth={1.6} />
            Seleccionar entrega
          </Link>
        </header>

        <aside className="mb-8 border-l-4 border-[#7A2E3A] bg-[var(--color-surface-container-low)] p-5 text-body-md text-[var(--color-on-surface-variant)]">
          Para crear una incidencia, abre <strong className="text-[var(--color-on-surface)]">Mis pedidos</strong> y selecciona una entrega con pago confirmado que no esté cancelada.
        </aside>

        <section className="mb-8 border border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-surface-container-lowest)] p-4 md:p-6" aria-label="Filtros de incidencias">
          <label className="relative block">
            <Search size={18} strokeWidth={1.8} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--color-outline)]" />
            <input type="search" value={search} onChange={(event) => updateSearch(event.target.value)} placeholder="Buscar por referencia, productor, entrega o motivo..." className="text-body-md w-full border border-[var(--color-outline-variant)] bg-[#FAF7F0] py-3 pr-4 pl-11 text-[#1A1A1A] placeholder:text-[var(--color-outline)] focus:border-[#7A2E3A] focus:outline-none" />
          </label>
          <div className="mt-5 flex gap-3 overflow-x-auto border-t border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] pt-5">
            {([['ALL', 'Todas'], ['OPEN', 'Abiertas'], ['RESOLVED', 'Resueltas']] as const).map(([value, label]) => (
              <button key={value} type="button" onClick={() => updateStatus(value)} className={`text-label-md whitespace-nowrap border px-5 py-2 transition-all ${statusFilter === value ? 'border-[#7A2E3A] bg-[#7A2E3A] text-white' : 'border-[var(--color-outline-variant)] hover:border-[#7A2E3A]'}`}>{label}</button>
            ))}
          </div>
        </section>

        {incidentsQuery.isLoading ? <StatePanel message="Cargando tus incidencias..." /> : null}
        {incidentsQuery.isError ? <StatePanel error message={resolveErrorMessage(incidentsQuery.error)} /> : null}
        {!incidentsQuery.isLoading && !incidentsQuery.isError ? <div className="space-y-6">{visibleIncidents.map((incident) => <IncidentCard key={incident.id} incident={incident} onView={() => setSelectedIncidentId(incident.id)} />)}</div> : null}
        {!incidentsQuery.isLoading && !incidentsQuery.isError && incidents.length === 0 ? <StatePanel message="Todavía no has reportado ninguna incidencia." /> : null}
        {!incidentsQuery.isLoading && !incidentsQuery.isError && incidents.length > 0 && filteredIncidents.length === 0 ? <StatePanel message="No hay incidencias que coincidan con los filtros aplicados." /> : null}
        {filteredIncidents.length > pageSize ? <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} /> : null}
      </main>

      {selectedIncidentId ? <IncidentDetailModal incident={detailQuery.data ?? null} loading={detailQuery.isLoading} error={detailQuery.isError ? resolveErrorMessage(detailQuery.error) : null} onClose={() => setSelectedIncidentId(null)} /> : null}
    </div>
  )
}

function IncidentCard({ incident, onView }: { incident: ConsumerIncidentSummary; onView: () => void }) {
  return (
    <article className="border border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] bg-[var(--color-surface-container-lowest)] p-6 shadow-[0_10px_30px_-15px_rgba(122,46,58,0.08)] md:p-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row">
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-3"><StatusBadge status={incident.status} /><span className="text-label-md text-[var(--color-on-surface-variant)]">{formatDate(incident.createdAt)}</span></div>
          <h2 className="text-headline-md mb-2 break-all text-[24px]">Incidencia {shortReference(incident.id)}</h2>
          <p className="text-label-md mb-4 text-[var(--color-secondary)]">{incident.target.producerBusinessName} · {formatMoney(incident.target.subtotal)}</p>
          <p className="text-body-md line-clamp-3 max-w-3xl text-[var(--color-on-surface-variant)]">{incident.reportReason}</p>
          <p className="text-label-sm mt-4 text-[var(--color-outline)]">Entrega {shortReference(incident.target.subOrderId)} · {fulfillmentLabel(incident.target.fulfillmentStatus)}</p>
        </div>
        <button type="button" onClick={onView} className="text-label-md self-start border border-[var(--color-outline)] px-6 py-3 transition-colors hover:bg-[var(--color-surface-variant)]">Ver detalle</button>
      </div>
    </article>
  )
}

function IncidentDetailModal({ incident, loading, error, onClose }: { incident: ConsumerIncidentDetail | null; loading: boolean; error: string | null; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#1A1A1A]/55 p-4 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-labelledby="detalle-incidencia-title">
      <div className="relative max-h-full w-full max-w-4xl overflow-y-auto border border-[var(--color-outline-variant)] bg-[#FAF7F0] shadow-2xl">
        <button type="button" aria-label="Cerrar modal" onClick={onClose} className="absolute top-5 right-5 z-10 p-2 text-[var(--color-on-surface-variant)] hover:text-[#7A2E3A]"><X size={24} strokeWidth={1.8} /></button>
        <div className="p-6 sm:p-10">
          <h2 id="detalle-incidencia-title" className="sr-only">Detalle de incidencia</h2>
          {loading ? <StatePanel message="Cargando el detalle de la incidencia..." /> : null}
          {error ? <StatePanel error message={error} /> : null}
          {incident ? <>
            <header className="mb-8 pr-12"><StatusBadge status={incident.status} /><h3 className="text-headline-lg mt-4 break-all text-[#1A1A1A]">Incidencia {shortReference(incident.id)}</h3><p className="text-body-md mt-2 text-[var(--color-on-surface-variant)]">Creada el {formatDateTime(incident.createdAt)}</p></header>
            <section className="mb-8"><h3 className="text-label-md mb-3 uppercase tracking-widest text-[var(--color-outline)]">Motivo reportado</h3><p className="text-body-md whitespace-pre-wrap leading-relaxed text-[var(--color-on-surface-variant)]">{incident.reportReason}</p></section>
            <section className="mb-8 grid gap-4 border border-[var(--color-outline-variant)] bg-white/50 p-5 sm:grid-cols-2 lg:grid-cols-3">
              <DetailItem label="Productor" value={incident.target.producerBusinessName} />
              <DetailItem label="Entrega" value={shortReference(incident.target.subOrderId)} />
              <DetailItem label="Estado de entrega" value={fulfillmentLabel(incident.target.fulfillmentStatus)} />
              <DetailItem label="Subtotal" value={formatMoney(incident.target.subtotal)} />
              <DetailItem label="Envío" value={formatMoney(incident.target.shippingCost)} />
              <DetailItem label="Modalidad" value={deliveryModeLabel(incident.target.deliveryModeType)} />
              <DetailItem label="Seguimiento" value={incident.target.trackingNumber ?? 'Aún no disponible'} />
            </section>
            <section className="mb-8"><h3 className="text-label-md mb-4 uppercase tracking-widest text-[var(--color-outline)]">Líneas registradas</h3><div className="divide-y divide-[var(--color-outline-variant)] border-y border-[var(--color-outline-variant)]">{incident.target.lines.map((line) => <div key={line.productId} className="grid gap-2 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6"><div><p className="text-body-md font-medium">Producto ref. {shortReference(line.productId)}</p><p className="text-label-sm text-[var(--color-outline)]">Cantidad: {line.quantity}</p></div><span className="text-body-md">{formatMoney(line.unitPrice)} / ud.</span><strong className="text-body-md">{formatMoneyFromCents(getIncidentLineTotalCents(line))}</strong></div>)}</div></section>
            {incident.resolution ? <section className="mb-8 border-l-4 border-[var(--color-secondary)] bg-[color-mix(in_srgb,var(--color-secondary-container)_20%,transparent)] p-6"><h3 className="text-label-md mb-3 uppercase tracking-widest text-[var(--color-secondary)]">Resolución</h3><p className="text-body-md whitespace-pre-wrap leading-relaxed">{incident.resolution.reason}</p><p className="text-label-sm mt-4 text-[var(--color-on-surface-variant)]">Resuelta el {formatDateTime(incident.resolution.resolvedAt)}</p></section> : <p className="text-body-md mb-8 border-l-4 border-[#7A2E3A] bg-white/50 p-5 text-[var(--color-on-surface-variant)]">La incidencia está abierta y pendiente de resolución administrativa.</p>}
            <footer className="flex flex-col gap-3 border-t border-[var(--color-outline-variant)] pt-6 sm:flex-row sm:justify-between"><Link to={`/pedidos?search=${encodeURIComponent(incident.target.subOrderId)}`} className="text-label-md inline-flex items-center justify-center gap-2 border border-[var(--color-outline)] px-6 py-3"><Package size={18} />Ver pedido</Link><button type="button" onClick={onClose} className="text-label-md bg-[#7A2E3A] px-6 py-3 text-white">Volver</button></footer>
          </> : null}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: 'OPEN' | 'RESOLVED' }) { return <span className={`text-label-sm inline-flex px-3 py-1 uppercase tracking-wider ${status === 'OPEN' ? 'bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed)]' : 'bg-green-100 text-green-800'}`}>{status === 'OPEN' ? 'Abierta' : 'Resuelta'}</span> }
function DetailItem({ label, value }: { label: string; value: string }) { return <div><p className="text-label-sm mb-1 uppercase tracking-wider text-[var(--color-outline)]">{label}</p><p className="text-body-md break-words text-[#1A1A1A]">{value}</p></div> }
function StatePanel({ message, error = false }: { message: string; error?: boolean }) { return <div role={error ? 'alert' : 'status'} className={`my-6 border p-8 text-center text-body-md ${error ? 'border-[var(--color-error)] text-[var(--color-error)]' : 'border-dashed border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)]'}`}><Filter className="mx-auto mb-3" size={26} />{message}</div> }
function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) { return <nav className="mt-12 flex items-center justify-center gap-4" aria-label="Paginación de incidencias"><button type="button" aria-label="Página anterior" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className="grid size-10 place-items-center border disabled:opacity-40"><ChevronLeft size={18} /></button><span className="text-label-md">Página {currentPage} de {totalPages}</span><button type="button" aria-label="Página siguiente" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} className="grid size-10 place-items-center border disabled:opacity-40"><ChevronRight size={18} /></button></nav> }
function shortReference(value: string) { return value.length > 18 ? `${value.slice(0, 8)}...${value.slice(-6)}` : value }
function formatDate(value: string) { return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(new Date(value)) }
function formatDateTime(value: string) { return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) }
function fulfillmentLabel(value: string) { return ({ pending: 'Pendiente', preparing: 'En preparación', sent: 'En camino', delivered: 'Entregada', cancelled: 'Cancelada' } as Record<string, string>)[value] ?? value }
function deliveryModeLabel(value: ConsumerIncidentDetail['target']['deliveryModeType']) { return ({ PERSONAL_DELIVERY: 'Entrega personal', PICKUP: 'Recogida', SHIPPING_FLAT_RATE: 'Envío' } as const)[value] }
