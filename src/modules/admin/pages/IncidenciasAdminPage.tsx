import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatMoney } from '../../../lib/formatMoney'
import { resolveErrorMessage } from '../../../lib/errorMessages'
import { useAdminIncidentsQuery } from '../../incidencias/hooks'

const pageSize = 20

export function IncidenciasAdminPage() {
  const [page, setPage] = useState(1)
  const incidentsQuery = useAdminIncidentsQuery(page, pageSize)
  const result = incidentsQuery.data
  const start = result && result.total > 0 ? (result.page - 1) * result.limit + 1 : 0
  const end = result ? Math.min(result.page * result.limit, result.total) : 0

  return (
    <div className="mx-[var(--space-margin-mobile)] max-w-[var(--layout-container-max)] md:mx-0">
      <header className="mb-12">
        <h1 className="text-headline-lg mb-2 text-[var(--color-on-surface)]">Gestión de incidencias</h1>
        <p className="text-body-md max-w-2xl text-[var(--color-outline)]">Revise y resuelva los problemas reportados sobre entregas pagadas.</p>
      </header>

      {incidentsQuery.isLoading ? <StatePanel message="Cargando incidencias..." /> : null}
      {incidentsQuery.isError ? <StatePanel error message={resolveErrorMessage(incidentsQuery.error)} /> : null}
      {result ? (
        <>
          <section className="overflow-x-auto" aria-label="Listado de incidencias" aria-busy={incidentsQuery.isFetching}>
            <table className="w-full min-w-[1100px] border-collapse text-left">
              <thead><tr className="border-b border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)]"><TableHead>Referencia</TableHead><TableHead>Reportante</TableHead><TableHead>Productor</TableHead><TableHead className="w-1/4">Motivo</TableHead><TableHead>Importe</TableHead><TableHead>Entrega</TableHead><TableHead>Fecha</TableHead><TableHead>Estado</TableHead><TableHead className="text-right">Acción</TableHead></tr></thead>
              <tbody className="text-body-md">
                {result.items.map((incident) => (
                  <tr key={incident.id} className="border-b border-[color-mix(in_srgb,var(--color-on-surface)_10%,transparent)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-surface-container-low)_55%,transparent)]">
                    <td className="px-4 py-6 font-editorial font-semibold" title={incident.id}>{shortReference(incident.id)}</td>
                    <td className="px-4 py-6 font-medium">{incident.reporterName ?? 'Sin nombre'}</td>
                    <td className="px-4 py-6">{incident.target.producerBusinessName}</td>
                    <td className="px-4 py-6"><p className="line-clamp-2 max-w-sm">{incident.reportReason}</p></td>
                    <td className="px-4 py-6 whitespace-nowrap">{formatMoney(incident.target.subtotal)}</td>
                    <td className="px-4 py-6">{fulfillmentLabel(incident.target.fulfillmentStatus)}</td>
                    <td className="px-4 py-6 whitespace-nowrap text-[var(--color-outline)]"><span className="block">Creada: {formatDate(incident.createdAt)}</span>{incident.resolvedAt ? <span className="text-label-sm mt-1 block">Resuelta: {formatDate(incident.resolvedAt)}</span> : null}</td>
                    <td className="px-4 py-6"><StatusBadge status={incident.status} /></td>
                    <td className="px-4 py-6 text-right"><Link to={`/admin/incidencias/${encodeURIComponent(incident.id)}`} className="text-label-md inline-flex border border-[var(--color-on-surface)] px-4 py-2 transition-colors hover:bg-[var(--color-on-surface)] hover:text-[var(--color-surface)]">{incident.status === 'OPEN' ? 'Revisar' : 'Ver detalle'}</Link></td>
                  </tr>
                ))}
                {result.items.length === 0 ? <tr><td colSpan={9} className="px-4 py-16 text-center text-[var(--color-outline)]">No hay incidencias registradas.</td></tr> : null}
              </tbody>
            </table>
          </section>
          <footer className="mt-8 flex flex-col gap-6 border-t border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] pt-6 md:flex-row md:items-center md:justify-between">
            <span className="text-body-md text-[var(--color-outline)]">{result.total === 0 ? 'Sin resultados' : `Mostrando ${start}-${end} de ${result.total} incidencias`}</span>
            <nav className="flex items-center gap-3" aria-label="Paginación de incidencias">
              <PageButton label="Página anterior" disabled={page <= 1 || incidentsQuery.isFetching} onClick={() => setPage((current) => current - 1)}><ChevronLeft size={18} /></PageButton>
              <span className="text-label-md">Página {result.page} de {Math.max(1, result.totalPages)}</span>
              <PageButton label="Página siguiente" disabled={page >= result.totalPages || incidentsQuery.isFetching} onClick={() => setPage((current) => current + 1)}><ChevronRight size={18} /></PageButton>
            </nav>
          </footer>
        </>
      ) : null}
    </div>
  )
}

function TableHead({ children, className = '' }: { children: string; className?: string }) { return <th className={`text-label-md px-4 py-4 uppercase tracking-wider text-[var(--color-outline)] ${className}`}>{children}</th> }
function StatusBadge({ status }: { status: 'OPEN' | 'RESOLVED' }) { return <span className={`text-label-sm inline-block rounded-full border px-3 py-1 ${status === 'OPEN' ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-green-200 bg-green-50 text-green-800'}`}>{status === 'OPEN' ? 'Abierta' : 'Resuelta'}</span> }
function PageButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: ReactNode }) { return <button type="button" aria-label={label} disabled={disabled} onClick={onClick} className="grid size-10 place-items-center border border-[var(--color-outline-variant)] disabled:cursor-not-allowed disabled:opacity-40">{children}</button> }
function StatePanel({ message, error = false }: { message: string; error?: boolean }) { return <div role={error ? 'alert' : 'status'} className={`border p-10 text-center text-body-md ${error ? 'border-[var(--color-error)] text-[var(--color-error)]' : 'border-dashed border-[var(--color-outline-variant)] text-[var(--color-outline)]'}`}>{message}</div> }
function shortReference(value: string) { return value.length > 16 ? `${value.slice(0, 7)}...${value.slice(-5)}` : value }
function formatDate(value: string) { return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(new Date(value)) }
function fulfillmentLabel(value: string) { return ({ pending: 'Pendiente', preparing: 'En preparación', sent: 'En camino', delivered: 'Entregada', cancelled: 'Cancelada' } as Record<string, string>)[value] ?? value }
