import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import type { Stripe, StripePaymentElementOptions } from '@stripe/stripe-js'
import { AlertTriangle, Lock, ShieldCheck } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { hasStripePublishableKey, stripePromise } from '../stripeClient'

type StripeState = Stripe | null | undefined

type Props = {
  clientSecret: string
  onRecovery: () => void
}

const appearance = {
  variables: {
    colorPrimary: '#7a2e3a',
    colorBackground: '#ffffff',
    colorText: '#1c1b1b',
    colorDanger: '#ba1a1a',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '4px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': { border: '1px solid #79747e', boxShadow: 'none' },
    '.Input:focus': { border: '1px solid #7a2e3a', boxShadow: '0 0 0 1px #7a2e3a' },
    '.Label': { color: '#1c1b1b' },
    '.Tab': { border: '1px solid #79747e' },
    '.Tab--selected': { borderColor: '#7a2e3a', boxShadow: '0 0 0 1px #7a2e3a' },
  },
} as const

const paymentElementOptions: StripePaymentElementOptions = {
  layout: 'tabs',
  wallets: { link: 'never' },
}

export function StripePaymentForm({ clientSecret, onRecovery }: Props) {
  const [stripe, setStripe] = useState<StripeState>(() => hasStripePublishableKey && stripePromise !== null ? undefined : null)

  useEffect(() => {
    let mounted = true

    if (stripePromise === null) return undefined

    stripePromise.then((stripeInstance) => {
      if (mounted) setStripe(stripeInstance)
    }).catch(() => {
      if (mounted) setStripe(null)
    })

    return () => {
      mounted = false
    }
  }, [])

  if (stripe === undefined) {
    return <PaymentNotice title="Preparando el pago seguro" message="Estamos conectando con el proveedor de pago. No introduzcas los datos de tu tarjeta fuera de este formulario." />
  }

  if (stripe === null) {
    return <PaymentNotice title="El pago no está disponible" message="No se pudo cargar la configuración segura de pago. No se ha enviado ningún dato de tarjeta." error />
  }

  return (
    <Elements key={clientSecret} stripe={stripe} options={{ clientSecret, appearance, locale: 'es-ES' }}>
      <StripeConfirmationForm onRecovery={onRecovery} />
    </Elements>
  )
}

function StripeConfirmationForm({ onRecovery }: Pick<Props, 'onRecovery'>) {
  const stripe = useStripe()
  const elements = useElements()
  const submittingRef = useRef(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)

  async function confirmPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submittingRef.current) return

    if (!isReady || loadFailed || !stripe || !elements) {
      setError('El formulario de pago seguro todavía no está disponible. Espera un momento e inténtalo de nuevo.')
      return
    }

    submittingRef.current = true
    setIsSubmitting(true)
    setError(null)

    const submission = await elements.submit()
    if (submission.error) {
      setError(submission.error.message ?? 'Revisa los datos de tu tarjeta e inténtalo de nuevo.')
      submittingRef.current = false
      setIsSubmitting(false)
      return
    }

    const returnUrl = new URL('/checkout/procesando', window.location.origin).toString()
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: 'if_required',
    })

    if (result.error) {
      setError(result.error.message ?? 'No se pudo confirmar el pago. Revisa los datos e inténtalo de nuevo.')
      submittingRef.current = false
      setIsSubmitting(false)
      return
    }

    const paymentIntentId = result.paymentIntent?.id
    if (!paymentIntentId || !/^pi_[A-Za-z0-9_]+$/.test(paymentIntentId)) {
      setError('No pudimos verificar la referencia del pago. No se ha confirmado ningún pedido.')
      submittingRef.current = false
      setIsSubmitting(false)
      return
    }

    window.location.assign(`${returnUrl}?payment_intent=${encodeURIComponent(paymentIntentId)}`)
  }

  return (
    <section className="border border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] bg-[var(--color-surface-container-lowest)] p-6 md:p-8">
      <div className="mb-6 flex items-start gap-4 border-b border-[var(--color-outline-variant)] pb-5"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-container)] text-[var(--color-primary)]"><Lock size={19} strokeWidth={1.8} /></span><div><h2 className="text-headline-md text-[24px] text-[var(--color-on-surface)]">Pago con tarjeta</h2><p className="text-body-md mt-1 text-[var(--color-on-surface-variant)]">Los datos de tu tarjeta se gestionan directamente mediante Stripe.</p></div></div>
      <form onSubmit={confirmPayment}>
        {loadFailed ? <div role="alert" className="text-label-sm rounded-[var(--radius-default)] bg-[var(--color-error-container)] p-4 text-[var(--color-error)]"><p>No pudimos preparar el formulario de pago. No se ha enviado ningún dato de tarjeta.</p><button type="button" onClick={onRecovery} className="mt-3 font-medium underline underline-offset-4">Volver a preparar el pago</button></div> : <PaymentElement options={paymentElementOptions} onReady={() => setIsReady(true)} onLoadError={() => { setIsReady(false); setLoadFailed(true) }} />}
        {error ? <p role="alert" className="text-label-sm mt-5 rounded-[var(--radius-default)] bg-[var(--color-error-container)] p-4 text-[var(--color-error)]">{error}</p> : null}
        <button type="submit" disabled={isSubmitting || loadFailed || !isReady || !stripe || !elements} className="text-label-md mt-6 flex w-full items-center justify-center gap-2 bg-[var(--color-primary)] px-6 py-4 text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary-container)] disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Confirmando pago seguro...' : 'Confirmar pago seguro'}<ShieldCheck size={17} strokeWidth={1.8} /></button>
      </form>
    </section>
  )
}

function PaymentNotice({ title, message, error = false }: { title: string; message: string; error?: boolean }) {
  const Icon = error ? AlertTriangle : Lock

  return <section className="border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-6 md:p-8"><Icon size={24} strokeWidth={1.8} className={error ? 'mb-4 text-[var(--color-error)]' : 'mb-4 text-[var(--color-primary)]'} /><h2 className="text-headline-md text-[24px] text-[var(--color-on-surface)]">{title}</h2><p className="text-body-md mt-3 text-[var(--color-on-surface-variant)]">{message}</p></section>
}
