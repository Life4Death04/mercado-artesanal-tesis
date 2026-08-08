import { AlertTriangle, CheckCircle2, Clock3, RotateCcw, ShieldAlert, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { PaymentStatus } from '../pagos.schema'

type Props = {
  status?: PaymentStatus
  isLoading: boolean
  hasTimedOut: boolean
  isInaccessible: boolean
  isRetrying: boolean
  onRetry: () => void
}

export function PaymentOutcomePanel({ status, isLoading, hasTimedOut, isInaccessible, isRetrying, onRetry }: Props) {
  if (isInaccessible) return <Outcome icon={ShieldAlert} title="No podemos consultar este pago" message="La referencia no está disponible para esta sesión. Inicia sesión de nuevo o vuelve al checkout para revisar el pago de forma segura." tone="error" />
  if (isLoading && !status) return <Outcome icon={Clock3} title="Estamos comprobando tu pago" message="Esperamos la confirmación segura del pago. No cierres esta página mientras actualizamos el estado." />
  if (hasTimedOut && status?.state === 'PROCESSING') return <Outcome icon={Clock3} title="Tu pago sigue en proceso" message="Aún no tenemos una confirmación final. No te cobraremos de nuevo desde esta pantalla. Espera unos minutos y vuelve a consultar el estado." actionLabel={isRetrying ? 'Consultando estado...' : 'Volver a consultar'} onAction={onRetry} isActionPending={isRetrying} />
  if (!status || status.state === 'PROCESSING') return <Outcome icon={Clock3} title="Tu pago está siendo confirmado" message="La confirmación puede tardar unos instantes. Estamos actualizando el estado de forma segura." />
  if (status.state === 'SUCCEEDED') return <Outcome icon={CheckCircle2} title="Pago confirmado" message="Hemos confirmado el pago y creado tu pedido." tone="success" actionLabel="Ver mi pedido" to={`/pedidos?orderId=${encodeURIComponent(status.orderId)}`} />
  if (status.state === 'PENDING') return <Outcome icon={AlertTriangle} title="Tu pago requiere revisión" message="No podemos confirmar el pedido todavía. No realices otro pago mientras revisamos el resultado. Puedes volver a consultar el estado en unos minutos." actionLabel={isRetrying ? 'Consultando estado...' : 'Volver a consultar'} onAction={onRetry} isActionPending={isRetrying} />
  if (status.state === 'FAILED') return <Outcome icon={XCircle} title="El pago no se completó" message="No hemos confirmado ningún pedido. Vuelve al checkout cuando quieras revisar los datos de pago o probar otro método." tone="error" actionLabel="Volver al checkout" to="/checkout" />
  return <Outcome icon={XCircle} title="El pago fue cancelado" message="No hemos confirmado ningún pedido. Puedes volver al checkout cuando estés listo para intentarlo de nuevo." tone="error" actionLabel="Volver al checkout" to="/checkout" />
}

function Outcome({ icon: Icon, title, message, tone = 'default', actionLabel, onAction, isActionPending = false, to }: { icon: typeof Clock3; title: string; message: string; tone?: 'default' | 'success' | 'error'; actionLabel?: string; onAction?: () => void; isActionPending?: boolean; to?: string }) {
  const iconClass = tone === 'success' ? 'bg-emerald-50 text-emerald-700' : tone === 'error' ? 'bg-[var(--color-error-container)] text-[var(--color-error)]' : 'bg-[var(--color-primary-container)] text-[var(--color-primary)]'
  return <section aria-live="polite" className="border border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] bg-[var(--color-surface-container-lowest)] p-7 shadow-sm md:p-10"><span className={`mb-6 flex size-12 items-center justify-center rounded-full ${iconClass}`}><Icon size={24} strokeWidth={1.8} /></span><h1 className="text-display-md text-[var(--color-on-surface)]">{title}</h1><p className="text-body-lg mt-4 max-w-xl text-[var(--color-on-surface-variant)]">{message}</p>{onAction ? <button type="button" disabled={isActionPending} onClick={onAction} className="text-label-md mt-8 inline-flex items-center gap-2 bg-[var(--color-primary)] px-5 py-3 text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary-container)] disabled:cursor-not-allowed disabled:opacity-60"><RotateCcw size={16} strokeWidth={1.8} />{actionLabel}</button> : null}{to ? <Link to={to} className="text-label-md mt-8 inline-flex items-center gap-2 bg-[var(--color-primary)] px-5 py-3 text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary-container)]">{actionLabel}</Link> : null}</section>
}
