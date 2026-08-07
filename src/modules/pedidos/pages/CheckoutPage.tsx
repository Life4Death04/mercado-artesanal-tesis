import { useState } from 'react'
import { ArrowRight, Check, ChevronRight, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { resolveErrorMessage } from '../../../lib/errorMessages'
import type { Cart } from '../../carrito/carrito.schema'
import { useCartQuery } from '../../carrito/hooks/useCart'
import { useAddressesQuery } from '../../perfil/hooks/useAddressesQuery'
import { CheckoutDeliveryStep, type CheckoutProducer } from '../componentes/CheckoutDeliveryStep'
import { useDeliveryModesQuery } from '../hooks/useDeliveryModesQuery'
import type { DeliverySelection } from '../pagos.schema'

type CheckoutStep = 1 | 2

function toCheckoutProducers(cart: Cart): CheckoutProducer[] {
  return Object.values(cart.items.reduce<Record<string, CheckoutProducer>>((groups, item) => {
    const producer = item.product.producer
    if (!producer) return groups
    const current = groups[producer.id]
    groups[producer.id] = current ?? { id: producer.id, name: producer.businessName ?? producer.name ?? 'Productos artesanales', location: producer.province ?? '', itemCount: 0 }
    groups[producer.id].itemCount += 1
    return groups
  }, {}))
}

export function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1)
  const [selections, setSelections] = useState<DeliverySelection[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const cartQuery = useCartQuery()
  const addressesQuery = useAddressesQuery()
  const deliveryModesQuery = useDeliveryModesQuery(Boolean(cartQuery.data?.items.length))
  const producers = cartQuery.data ? toCheckoutProducers(cartQuery.data) : []
  const modes = deliveryModesQuery.data ?? []
  const addresses = addressesQuery.data ?? []
  const isLoading = cartQuery.isLoading || addressesQuery.isLoading || deliveryModesQuery.isLoading
  const cartProducerIds = new Set(producers.map((producer) => producer.id))
  const validSelections = selections.filter((selection) => cartProducerIds.has(selection.producerId) && modes.find((group) => group.producerId === selection.producerId)?.modes.some((mode) => mode.id === selection.deliveryModeId))
  const selectedModes = validSelections.flatMap((selection) => modes.find((group) => group.producerId === selection.producerId)?.modes.filter((mode) => mode.id === selection.deliveryModeId) ?? [])
  const requiresShippingAddress = selectedModes.some((mode) => mode.type === 'shipping')
  const activeSelectedAddressId = selectedAddressId && addresses.some((address) => address.id === selectedAddressId) ? selectedAddressId : null

  function selectDeliveryMode(producerId: string, deliveryModeId: string) {
    setSelections((current) => [...current.filter((selection) => selection.producerId !== producerId), { producerId, deliveryModeId }])
    setValidationError(null)
  }

  function continueToPayment() {
    const selectionProducerIds = new Set(validSelections.map((selection) => selection.producerId))
    if (producers.length === 0) return setValidationError('Tu carrito está vacío o ya no está disponible para el checkout.')
    if (validSelections.length !== selections.length || validSelections.length !== cartProducerIds.size || selectionProducerIds.size !== cartProducerIds.size) {
      setSelections(validSelections)
      return setValidationError('Las opciones de entrega cambiaron. Selecciona un método válido para cada productor antes de continuar.')
    }
    if (requiresShippingAddress && !activeSelectedAddressId) {
      if (selectedAddressId) setSelectedAddressId(null)
      return setValidationError('Selecciona una dirección guardada y válida para los envíos antes de continuar.')
    }
    setValidationError(null)
    setCurrentStep(2)
  }

  const dataError = cartQuery.error ?? addressesQuery.error ?? deliveryModesQuery.error

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <main className="mx-auto w-full max-w-[var(--layout-container-max)] px-[var(--space-margin-mobile)] py-12 md:px-[var(--space-margin-desktop)] md:py-16">
        <header className="mb-12"><nav aria-label="Breadcrumb" className="text-label-sm mb-4 flex items-center gap-2 text-[var(--color-on-surface-variant)]/70"><Link to="/carrito" className="transition-colors hover:text-[var(--color-primary)]">Carrito</Link><ChevronRight size={14} strokeWidth={1.8} /><span className="text-[var(--color-on-surface)]">Checkout</span></nav><h1 className="text-display-lg text-[var(--color-on-surface)]">{currentStep === 1 ? 'Detalles de envío' : 'Método de pago'}</h1><p className="text-body-md mt-3 max-w-2xl text-[var(--color-on-surface-variant)]">{currentStep === 1 ? 'Define cómo recibirá cada productor su parte del pedido.' : 'La integración de pago se habilitará en el siguiente paso del checkout.'}</p></header>
        <CheckoutStepper currentStep={currentStep} />
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16"><div className="lg:col-span-8">{currentStep === 1 ? <CheckoutDeliveryStep producers={producers} deliveryModeGroups={modes} selections={validSelections} addresses={addresses} selectedAddressId={activeSelectedAddressId} isLoading={isLoading} error={dataError ? resolveErrorMessage(dataError) : null} onSelectMode={selectDeliveryMode} onSelectAddress={setSelectedAddressId} /> : <PaymentPlaceholder onBack={() => setCurrentStep(1)} />}</div><OrderSummaryPanel currentStep={currentStep} error={validationError} onContinue={continueToPayment} /></div>
      </main>
    </div>
  )
}

function CheckoutStepper({ currentStep }: { currentStep: CheckoutStep }) {
  return <nav aria-label="Progreso del checkout" className="mx-auto mb-16 max-w-xl"><ol className="flex items-start justify-between gap-4">{[{ number: 1, label: 'Entrega' }, { number: 2, label: 'Pago' }].map((step, index) => <li key={step.number} className="flex flex-1 items-start last:flex-none"><div className="flex flex-col items-center gap-2"><span className={`text-label-md flex size-8 items-center justify-center rounded-full border ${currentStep === step.number ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-on-primary)]' : currentStep > step.number ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] opacity-60'}`}>{currentStep > step.number ? <Check size={16} strokeWidth={2} /> : step.number}</span><span className="text-label-md text-[var(--color-on-surface-variant)]">{step.label}</span></div>{index === 0 ? <span className="mt-4 mx-4 h-px flex-1 bg-[var(--color-outline-variant)]" /> : null}</li>)}</ol></nav>
}

function OrderSummaryPanel({ currentStep, error, onContinue }: { currentStep: CheckoutStep; error: string | null; onContinue: () => void }) {
  return <aside className="relative lg:col-span-4"><div className="sticky top-24 border border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] bg-[var(--color-surface-container-lowest)] p-6 shadow-sm md:p-8"><h2 className="text-headline-md mb-6 border-b border-[var(--color-outline-variant)] pb-4 text-[24px] text-[var(--color-on-surface)]">Resumen del pedido</h2><div className="mb-6 flex flex-col gap-3 text-[var(--color-on-surface-variant)]"><div className="text-body-md flex justify-between"><span>Subtotal productos</span><span>—</span></div><div className="text-body-md flex justify-between"><span>Gastos de envío</span><span>—</span></div></div><div className="mb-8 flex items-end justify-between border-t border-[var(--color-outline-variant)] pt-6"><span className="text-label-md text-[var(--color-on-surface)]">Total</span><span className="text-headline-md text-[28px] text-[var(--color-primary)]">—</span></div>{error ? <p role="alert" className="text-label-sm mb-4 text-[var(--color-error)]">{error}</p> : null}{currentStep === 1 ? <button type="button" onClick={onContinue} className="text-label-md flex w-full items-center justify-center gap-2 bg-[var(--color-primary)] px-6 py-4 text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary-container)]">Continuar al pago<ArrowRight size={16} strokeWidth={1.8} /></button> : null}<Link to="/carrito" className="text-label-md mt-4 block w-full py-2 text-center text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-primary)]">Volver al carrito</Link></div></aside>
}

function PaymentPlaceholder({ onBack }: { onBack: () => void }) {
  return <section className="border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-6 md:p-8"><Lock size={24} strokeWidth={1.8} className="mb-4 text-[var(--color-primary)]" /><h2 className="text-headline-md text-[var(--color-on-surface)]">Entrega confirmada</h2><p className="text-body-md mt-3 text-[var(--color-on-surface-variant)]">La selección de entrega está lista. La confirmación de pago con Stripe se añadirá en el siguiente trabajo.</p><button type="button" onClick={onBack} className="text-label-md mt-8 text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-container)]">Volver a entrega</button></section>
}
