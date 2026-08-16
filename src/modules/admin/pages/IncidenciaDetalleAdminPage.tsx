import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { formatMoney, formatMoneyFromCents } from '../../../lib/formatMoney'
import { resolveErrorMessage } from '../../../lib/errorMessages'
import { useAdminIncidentQuery } from '../../incidencias/hooks'
import { getIncidentLineTotalCents } from '../../incidencias/incidencias.money'
import type { AdminIncidentDetail } from '../../incidencias/incidencias.schema'
import { IncidentResolutionModal } from '../componentes/IncidentResolutionModal'

export function IncidenciaDetalleAdminPage() {
  const { incidenciaId } = useParams()
  const incidentId = incidenciaId?.trim() || null
  const incidentQuery = useAdminIncidentQuery(incidentId)
  const [resolutionOpen, setResolutionOpen] = useState(false)
  const incident = incidentQuery.data

  return (
    <>
      <div className="mx-[var(--space-margin-mobile)] max-w-[var(--layout-container-max)] md:mx-0">
        <Link to="/admin/incidencias" className="text-label-md mb-8 inline-flex items-center gap-2 uppercase text-[var(--color-secondary)] hover:text-[var(--color-on-surface)]"><ArrowLeft size={18} />Volver al listado</Link>
        {!incidentId ? <StatePanel error message="La referencia de incidencia no es válida." /> : null}
        {incidentQuery.isLoading ? <StatePanel message="Cargando detalle de la incidencia..." /> : null}
        {incidentQuery.isError ? <StatePanel error message={resolveErrorMessage(incidentQuery.error)} /> : null}
        {incident ? <IncidentContent incident={incident} onResolve={() => setResolutionOpen(true)} /> : null}
      </div>
      {incident && resolutionOpen && incident.status === 'OPEN' ? <IncidentResolutionModal incidentId={incident.id} onClose={() => setResolutionOpen(false)} onResolved={() => setResolutionOpen(false)} /> : null}
    </>
  )
}

function IncidentContent({ incident, onResolve }: { incident: AdminIncidentDetail; onResolve: () => void }) {
  return <>
    <header className="mb-10 flex flex-col gap-5 border-b border-[color-mix(in_srgb,var(--color-secondary)_40%,transparent)] pb-6 md:flex-row md:items-end md:justify-between"><div><span className="text-label-sm mb-2 block uppercase tracking-widest text-[var(--color-outline)]">Incidencia</span><h1 className="text-display-lg break-all text-[var(--color-primary)]">{incident.id}</h1><p className="text-body-md mt-2 text-[var(--color-outline)]">Creada el {formatDateTime(incident.createdAt)} · Actualizada el {formatDateTime(incident.updatedAt)}</p></div><StatusBadge status={incident.status} /></header>
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
      <main className="flex flex-col gap-10 lg:col-span-8">
        <section><h2 className="text-headline-md mb-4">Motivo reportado</h2><p className="text-body-lg whitespace-pre-wrap leading-relaxed text-[var(--color-on-surface-variant)]">{incident.reportReason}</p></section>
        <section><h2 className="text-headline-md mb-4">Entrega afectada</h2><div className="grid gap-5 border border-[var(--color-outline-variant)] bg-[var(--color-surface-bright)] p-6 sm:grid-cols-2 lg:grid-cols-3"><Detail label="Productor" value={incident.target.producerBusinessName} /><Detail label="Subpedido" value={shortReference(incident.target.subOrderId)} /><Detail label="Estado actual" value={fulfillmentLabel(incident.target.fulfillmentStatus)} /><Detail label="Subtotal" value={formatMoney(incident.target.subtotal)} /><Detail label="Envío" value={formatMoney(incident.target.shippingCost)} /><Detail label="Modalidad" value={deliveryModeLabel(incident.target.deliveryModeType)} /><Detail label="Seguimiento" value={incident.target.trackingNumber ?? 'Aún no disponible'} /></div></section>
        <section><h2 className="text-headline-md mb-4">Líneas registradas</h2><div className="divide-y divide-[var(--color-outline-variant)] border-y border-[var(--color-outline-variant)]">{incident.target.lines.map((line) => <div key={line.productId} className="grid gap-2 py-5 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-8"><div><p className="text-body-md font-semibold">Producto ref. {shortReference(line.productId)}</p><p className="text-label-sm text-[var(--color-outline)]">Cantidad: {line.quantity}</p></div><span>{formatMoney(line.unitPrice)} / ud.</span><strong>{formatMoneyFromCents(getIncidentLineTotalCents(line))}</strong></div>)}</div></section>
        {incident.resolution ? <section className="border-l-4 border-green-700 bg-green-50 p-6"><h2 className="text-headline-md mb-4 text-green-900">Resolución registrada</h2><p className="text-body-md whitespace-pre-wrap leading-relaxed">{incident.resolution.reason}</p><dl className="mt-5 grid gap-3 sm:grid-cols-2"><Detail label="Fecha" value={formatDateTime(incident.resolution.resolvedAt)} /><Detail label="Administrador" value={shortReference(incident.resolution.resolvedById)} /></dl></section> : null}
      </main>
      <aside className="flex flex-col gap-6 lg:col-span-4"><section className="border border-[var(--color-outline-variant)] bg-[var(--color-surface-bright)] p-6"><h2 className="text-headline-md mb-5">Reportante</h2><Detail label="Nombre" value={incident.reporter.name ?? 'Sin nombre'} /><div className="mt-4"><Detail label="Correo" value={incident.reporter.email} /></div></section>{incident.status === 'OPEN' ? <button type="button" onClick={onResolve} className="text-label-md w-full bg-[var(--color-primary-container)] px-6 py-4 uppercase tracking-widest text-[var(--color-on-primary)] hover:bg-[var(--color-primary)]">Registrar resolución</button> : <p className="border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] p-5 text-body-md text-[var(--color-on-surface-variant)]">Esta incidencia está resuelta y es de solo lectura.</p>}</aside>
    </div>
  </>
}

function StatusBadge({ status }: { status: 'OPEN' | 'RESOLVED' }) { return <span className={`text-label-sm w-fit rounded-full px-4 py-1.5 uppercase tracking-wide ${status === 'OPEN' ? 'bg-amber-100 text-amber-900' : 'bg-green-100 text-green-900'}`}>{status === 'OPEN' ? 'Abierta' : 'Resuelta'}</span> }
function Detail({ label, value }: { label: string; value: string }) { return <div><p className="text-label-sm mb-1 uppercase tracking-wider text-[var(--color-outline)]">{label}</p><p className="text-body-md break-words text-[var(--color-on-surface)]">{value}</p></div> }
function StatePanel({ message, error = false }: { message: string; error?: boolean }) { return <div role={error ? 'alert' : 'status'} className={`border p-10 text-center ${error ? 'border-[var(--color-error)] text-[var(--color-error)]' : 'border-dashed border-[var(--color-outline-variant)] text-[var(--color-outline)]'}`}>{message}</div> }
function shortReference(value: string) { return value.length > 20 ? `${value.slice(0, 9)}...${value.slice(-7)}` : value }
function formatDateTime(value: string) { return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) }
function fulfillmentLabel(value: string) { return ({ pending: 'Pendiente', preparing: 'En preparación', sent: 'En camino', delivered: 'Entregada', cancelled: 'Cancelada' } as Record<string, string>)[value] ?? value }
function deliveryModeLabel(value: AdminIncidentDetail['target']['deliveryModeType']) { return ({ PERSONAL_DELIVERY: 'Entrega personal', PICKUP: 'Recogida', SHIPPING_FLAT_RATE: 'Envío' } as const)[value] }
