import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { cartKeys } from '../../carrito/carrito.queryKeys'
import { PaymentOutcomePanel } from '../componentes/PaymentOutcomePanel'
import { usePaymentStatusQuery } from '../hooks/usePaymentStatusQuery'

const PAYMENT_INTENT_ID_PATTERN = /^pi_[A-Za-z0-9_]+$/

export function PagoProcesandoPage() {
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const paymentIntentId = searchParams.get('payment_intent')
  const safePaymentIntentId = paymentIntentId && PAYMENT_INTENT_ID_PATTERN.test(paymentIntentId) ? paymentIntentId : null
  const statusQuery = usePaymentStatusQuery(safePaymentIntentId)
  const invalidatedIntentRef = useRef<string | null>(null)

  useEffect(() => {
    if (statusQuery.data?.state !== 'SUCCEEDED' || invalidatedIntentRef.current === safePaymentIntentId) return
    invalidatedIntentRef.current = safePaymentIntentId
    void queryClient.invalidateQueries({ queryKey: cartKeys.all })
  }, [queryClient, safePaymentIntentId, statusQuery.data?.state])

  return <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)]"><main className="mx-auto w-full max-w-3xl px-[var(--space-margin-mobile)] py-16 md:px-[var(--space-margin-desktop)] md:py-24"><nav aria-label="Breadcrumb" className="text-label-sm mb-8"><Link to="/checkout" className="text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-primary)]">Volver al checkout</Link></nav><PaymentOutcomePanel status={statusQuery.data} isLoading={statusQuery.isLoading || statusQuery.isFetching} hasTimedOut={statusQuery.hasTimedOut} isInaccessible={safePaymentIntentId === null || statusQuery.isError} isRetrying={statusQuery.isManualRetryPending || statusQuery.isFetching} onRetry={() => { void statusQuery.retryStatus() }} /></main></div>
}
