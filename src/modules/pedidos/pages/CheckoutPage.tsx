import type { ReactNode } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Car, Check, ChevronRight, CreditCard, Info, Lock, MapPin, Plus, Smartphone, Store, Truck } from 'lucide-react'

type CheckoutStep = 1 | 2 | 3

type DeliveryOption = {
  icon: 'truck' | 'store' | 'car'
  name: string
  price: string
  priceValue: number
  description: string
}

type ShippingGroup = {
  id: string
  producer: string
  location: string
  product: string
  productPriceValue: number
  image: string
  warning?: string
  selectedDeliveryName: string
  deliveryOptions: DeliveryOption[]
  address?: {
    label: string
    value: string
  }
}

const shippingGroups: ShippingGroup[] = [
  {
    id: 'aceites-montana',
    producer: 'Aceites de la Montaña',
    location: 'Beniardá, Alicante',
    product: '2x Extra Virgin Olive Oil 500ml',
    productPriceValue: 42.5,
    warning: 'Solo quedan 2 unidades de este producto.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDOT4B3IlpDVZUGzctOQtw1MWGY3iKsbsXm_UrK0dg5JYk6RP8pzTh1P0FT4Z6wN2CcjMGdYtpOoFKQZHkJTkw7jGbld27hIxtD60q-7vdK7AdEUr21nXtmAMx6C6j-cBZMl3qkLnA7QZKgohVbxZf4RCoLdH7K28ngbXD_SNmy14ZZKOavxiUXoU-_0VX7XSx7OD3G8Bc19rmBX0WyblFnbSlMb01Q5Se1dA2ySn3ZFVgA_Qw4kt80emuRXdu4Dk8WFlXA3h6tDkk',
    address: {
      label: 'Casa',
      value: 'Calle Mayor 12, 3º B, 03001 Alicante',
    },
    selectedDeliveryName: 'Mensajería',
    deliveryOptions: [
      {
        icon: 'truck',
        name: 'Mensajería',
        price: '4.95€',
        priceValue: 4.95,
        description: 'Envío estándar (2-3 días hábiles).',
      },
      {
        icon: 'store',
        name: 'Recogida en Punto',
        price: 'Gratis',
        priceValue: 0,
        description: 'Recoge tu pedido en establecimientos asociados.',
      },
    ],
  },
  {
    id: 'queseria-san-antonio',
    producer: 'Quesería San Antonio',
    location: 'Elche, Alicante',
    product: '1x Goat Cheese with Rosemary',
    productPriceValue: 2,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuACPw5Xagty6uEGbAZPt7ougTRDN902sBzFlMw3a1iad08kHrucHlAZMuCm45n0aFBm-2n17K219zgG62l8PedvWPwNE0hrPq846JdPvDYCL0qp8yGaOj0PExI84qrkFo64pdWvec7foqLbWpWkQ8XXpFmRULcVowwlI6qZWaorxT7kb8QKGFfkDkRsKSRlKGzEfGGi2ds5Yaidpwzkz8vuj6rHRKJ9pJPvHvaTjJjaxGr3h738OZCdMRzZTOD1XjMBHz1tKaYdXE0',
    selectedDeliveryName: 'Mensajería',
    deliveryOptions: [
      {
        icon: 'car',
        name: 'Entrega Personal',
        price: '2.00€',
        priceValue: 2,
        description: 'Entrega directa por el productor en zonas habilitadas.',
      },
      {
        icon: 'truck',
        name: 'Mensajería',
        price: '5.50€',
        priceValue: 5.5,
        description: 'Envío estándar refrigerado.',
      },
    ],
  },
]

const summaryItems = [
  {
    name: 'Oro Líquido Arbequina',
    detail: '500ml, Edición Limitada',
    quantity: 'Qty 1',
    price: '28.00€',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAhsDXqkVUyVbZXhXsSkKIWIZKrUBpZtqIzzEZHFUVOQMxOiN2qVWPxa2Hv7GAlBQFtpRrhEMvZYrG4RWhKaOjwq2B2dZYe-6jSAbtzQi3VtwrJPXOLbk_BjYyaI_At6JuMjR9o034klAVFMOtjPCVTyTEwte7SjubuZqousp1xHcNMiKaoOCx6mz7v9EiuoccPIWOC-0l6ZyoOPBwuWSlpEZbDGBvlrkqvZdGX4bO7NsT4UL-fyoKdK5uSDLgfYsFO15u5tmOiMlQ',
  },
  {
    name: 'Caja Degustación Turrón',
    detail: 'Surtido Artesanal',
    quantity: 'Qty 1',
    price: '14.50€',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCztl1jLSI_oU4y3dHVhYVIrCAYSJged3hkgiEjDWviaz81U7U3BC_CqBaIw4qAqacQBNty84zaiY9bdB8yUXgFNkKuV_92ymuU99IrII2IjVhkw4aYCVXSStn6VOv9PgBZS5IyQyT0ZQo5yBANyjNsQSsEgGCub7AKDZYcgNAqvyHyrXMimBJnkp4enVL5FkjT0CxElvUzLZ5pXAhXshdtPJE9EEe1LgA4Uj0dWAVwsY7lL4hpmo6IQ83Rk8ckAUmHD__7_rYQqiw',
  },
]

const confirmationOrders = [
  {
    code: '#AG-8821',
    producer: 'Aceites de la Montaña',
    delivery: 'Mensajería',
    total: '49.45€',
  },
  {
    code: '#AG-8822',
    producer: 'Quesería San Antonio',
    delivery: 'Entrega Personal',
    total: '2.00€',
  },
]

export function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1)
  const [checkoutGroups, setCheckoutGroups] = useState(shippingGroups)
  const [showAddressModalFor, setShowAddressModalFor] = useState<string | null>(null)

  const subtotalProducts = checkoutGroups.reduce((total, group) => total + group.productPriceValue, 0)
  const shippingTotal = checkoutGroups.reduce((total, group) => {
    const selectedOption = group.deliveryOptions.find((option) => option.name === group.selectedDeliveryName)
    return total + (selectedOption?.priceValue ?? 0)
  }, 0)
  const grandTotal = subtotalProducts + shippingTotal

  function handleSelectDelivery(groupId: string, optionName: string) {
    setCheckoutGroups((currentGroups) =>
      currentGroups.map((group) =>
        group.id === groupId ? { ...group, selectedDeliveryName: optionName } : group,
      ),
    )
  }

  function handleSaveAddress(groupId: string, address: ShippingGroup['address']) {
    setCheckoutGroups((currentGroups) =>
      currentGroups.map((group) =>
        group.id === groupId ? { ...group, address } : group,
      ),
    )
    setShowAddressModalFor(null)
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)]">
      {currentStep === 3 ? (
        <ConfirmationStep />
      ) : (
        <main className="mx-auto w-full max-w-[var(--layout-container-max)] px-[var(--space-margin-mobile)] py-12 md:px-[var(--space-margin-desktop)] md:py-16">
          <CheckoutPageHeader currentStep={currentStep} />
          <CheckoutStepper currentStep={currentStep} />

          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="flex flex-col gap-10 lg:col-span-8">
              {currentStep === 1 ? <ShippingDetailsStep groups={checkoutGroups} onSelectDelivery={handleSelectDelivery} onOpenAddressModal={setShowAddressModalFor} /> : <PaymentMethodStep onBack={() => setCurrentStep(1)} />}
            </div>

            <OrderSummaryPanel currentStep={currentStep} subtotalProducts={subtotalProducts} shippingTotal={shippingTotal} grandTotal={grandTotal} onContinue={() => setCurrentStep(currentStep === 1 ? 2 : 3)} />
          </div>
        </main>
      )}

      {showAddressModalFor ? (
        <AddressModal
          onClose={() => setShowAddressModalFor(null)}
          onSave={(address) => handleSaveAddress(showAddressModalFor, address)}
        />
      ) : null}

    </div>
  )
}

function CheckoutPageHeader({ currentStep }: { currentStep: CheckoutStep }) {
  const title = currentStep === 1 ? 'Detalles de Envío' : 'Método de Pago'
  const description = currentStep === 1
    ? 'Define cómo recibirá cada producto su comprador final.'
    : 'Selecciona un método de pago para completar tu compra.'

  return (
    <header className="mb-12">
      <nav aria-label="Breadcrumb" className="text-label-sm mb-4 flex items-center gap-2 text-[var(--color-on-surface-variant)]/70">
        <Link to="/carrito" className="transition-colors hover:text-[var(--color-primary)]">
          Carrito
        </Link>
        <ChevronRight size={14} strokeWidth={1.8} />
        <span className="text-[var(--color-on-surface)]">Checkout</span>
      </nav>
      <h1 className="text-display-lg text-[var(--color-on-surface)]">{title}</h1>
      <p className="text-body-md mt-3 max-w-2xl text-[var(--color-on-surface-variant)]">{description}</p>
    </header>
  )
}

function CheckoutStepper({ currentStep }: { currentStep: CheckoutStep }) {
  const steps = [
    { number: 1, label: 'Delivery' },
    { number: 2, label: 'Payment' },
    { number: 3, label: 'Confirm' },
  ]

  return (
    <nav aria-label="Progreso del checkout" className="mx-auto mb-16 max-w-xl">
      <ol className="flex items-start justify-between gap-4">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number
          const isComplete = currentStep > step.number

          return (
            <li key={step.number} className="flex flex-1 items-start last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <span
                  className={`text-label-md flex size-8 items-center justify-center rounded-full border ${isActive ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-on-primary)]' : isComplete ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] opacity-60'}`}
                >
                  {isComplete ? <Check size={16} strokeWidth={2} /> : step.number}
                </span>
                <span className={`text-label-md ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)] opacity-70'}`}>{step.label}</span>
              </div>
              {index < steps.length - 1 ? <span className="mt-4 mx-4 h-px flex-1 bg-[var(--color-outline-variant)]" /> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function ShippingDetailsStep({ groups, onSelectDelivery, onOpenAddressModal }: { groups: ShippingGroup[]; onSelectDelivery: (groupId: string, optionName: string) => void; onOpenAddressModal: (groupId: string) => void }) {
  return (
    <>
      {groups.map((group) => (
        <ShippingProducerCard key={group.id} group={group} onSelectDelivery={onSelectDelivery} onOpenAddressModal={onOpenAddressModal} />
      ))}
    </>
  )
}

function ShippingProducerCard({ group, onSelectDelivery, onOpenAddressModal }: { group: ShippingGroup; onSelectDelivery: (groupId: string, optionName: string) => void; onOpenAddressModal: (groupId: string) => void }) {
  return (
    <section className="border border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] bg-[var(--color-surface-container-lowest)] p-6 md:p-8">
      <div className="mb-6 border-b border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] pb-4">
        <h2 className="text-headline-md mb-1 text-[24px] text-[var(--color-on-surface)]">{group.producer}</h2>
        <p className="text-label-sm flex items-center gap-1 text-[var(--color-on-surface-variant)]">
          <MapPin size={15} strokeWidth={1.8} />
          {group.location}
        </p>
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center gap-4">
          <div className="size-16 flex-shrink-0 border border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] bg-[var(--color-surface-container)]">
            <img src={group.image} alt={group.product} className="size-full object-cover" />
          </div>
          <p className="text-body-md text-[var(--color-on-surface)]">{group.product}</p>
        </div>

        {group.warning ? (
          <div className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-error)_20%,transparent)] bg-[color-mix(in_srgb,var(--color-error-container)_30%,transparent)] px-3 py-1.5">
            <Info size={16} strokeWidth={1.8} className="text-[var(--color-error)]" />
            <span className="text-label-sm text-[var(--color-error)]">{group.warning}</span>
          </div>
        ) : null}
      </div>

      <div>
        <h3 className="text-label-md mb-4 text-[var(--color-on-surface)]">Método de entrega</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {group.deliveryOptions.map((option) => (
            <DeliveryOptionCard key={option.name} option={option} groupName={group.producer} selected={group.selectedDeliveryName === option.name} onSelect={() => onSelectDelivery(group.id, option.name)} />
          ))}
        </div>
      </div>

      {group.address ? (
        <div className="mt-6 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] pt-6">
          <h3 className="text-label-md mb-4 text-[var(--color-on-surface)]">Dirección de envío</h3>
          <div className="mb-4 flex items-center justify-between border border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] p-4">
            <div>
              <span className="text-label-md mb-1 block text-[var(--color-on-surface)]">{group.address.label}</span>
              <span className="text-label-sm text-[var(--color-on-surface-variant)]">{group.address.value}</span>
            </div>
            <span className="flex size-5 items-center justify-center rounded-full border border-[var(--color-primary)] text-[var(--color-primary)]">
              <Check size={14} strokeWidth={2} />
            </span>
          </div>
          <button type="button" onClick={() => onOpenAddressModal(group.id)} className="text-label-md flex items-center gap-1 text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-container)]">
            <Plus size={18} strokeWidth={1.8} />
            {group.address ? 'Cambiar dirección' : 'Añadir nueva dirección'}
          </button>
        </div>
      ) : (
        <div className="mt-6 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] pt-6">
          <h3 className="text-label-md mb-4 text-[var(--color-on-surface)]">Dirección de envío</h3>
          <button type="button" onClick={() => onOpenAddressModal(group.id)} className="text-label-md flex items-center gap-1 text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-container)]">
            <Plus size={18} strokeWidth={1.8} />
            Añadir nueva dirección
          </button>
        </div>
      )}
    </section>
  )
}

function DeliveryOptionCard({ option, groupName, selected, onSelect }: { option: DeliveryOption; groupName: string; selected: boolean; onSelect: () => void }) {
  const icon = option.icon === 'truck'
    ? <Truck size={20} strokeWidth={1.8} />
    : option.icon === 'store'
      ? <Store size={20} strokeWidth={1.8} />
      : <Car size={20} strokeWidth={1.8} />

  return (
    <label className={`relative cursor-pointer p-4 transition-colors ${selected ? 'border-2 border-[var(--color-primary)] bg-[var(--color-surface-container-low)]' : 'border border-[var(--color-outline-variant)] hover:border-[var(--color-primary)]'}`}>
      <input className="sr-only" name={`delivery-${groupName}`} type="radio" checked={selected} onChange={onSelect} />
      <div className="mb-3 flex items-start gap-4">
        <span className={`text-label-md flex flex-1 items-center gap-2 text-[var(--color-on-surface)]`}>
          <span className={selected ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'}>{icon}</span>
          {option.name}
        </span>
        <span className={`text-label-md shrink-0 ${option.price === 'Gratis' ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface)]'}`}>{option.price}</span>
        <span className={`mt-0.5 flex size-4 items-center justify-center rounded-full ${selected ? 'border-2 border-[var(--color-primary)]' : 'border border-[var(--color-outline-variant)]'}`}>
          {selected ? <span className="size-2 rounded-full bg-[var(--color-primary)]" /> : null}
        </span>
      </div>
      <p className="text-label-sm text-[var(--color-on-surface-variant)]">{option.description}</p>
    </label>
  )
}

function PaymentMethodStep({ onBack }: { onBack: () => void }) {
  return (
    <>
      <fieldset className="mt-4">
        <legend className="sr-only">Método de pago</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PaymentOption icon={<CreditCard size={22} strokeWidth={1.8} />} title="Credit Card" detail="Stripe Secure Payment" selected />
          <PaymentOption icon={<Smartphone size={22} strokeWidth={1.8} />} title="Bizum" detail="Pay via mobile" />
        </div>
      </fieldset>

      <div className="relative mt-2 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-6 shadow-sm md:p-8">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface-container-lowest)] to-[var(--color-surface-container-low)] opacity-50" />
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-label-md text-[var(--color-on-surface)]" htmlFor="card-details">
              Card Details
            </label>
            <div className="flex items-center rounded-[var(--radius-md)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] px-3 py-3 shadow-sm transition-all focus-within:border-[var(--color-primary)] focus-within:ring-1 focus-within:ring-[var(--color-primary)]">
              <CreditCard size={18} strokeWidth={1.8} className="mr-2 text-[var(--color-outline)]" />
              <input id="card-details" type="text" placeholder="Card number, expiration, CVC" className="block w-full border-0 bg-transparent p-0 text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] focus:ring-0 focus:outline-none sm:text-sm" />
              <span className="text-label-sm ml-2 uppercase tracking-widest text-[var(--color-outline)]">Stripe</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-label-md text-[var(--color-on-surface)]" htmlFor="card-name">
              Name on Card
            </label>
            <input id="card-name" type="text" placeholder="e.g. Maria García" className="block w-full rounded-[var(--radius-md)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] px-3 py-3 text-[var(--color-on-surface)] shadow-sm transition-all focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none sm:text-sm" />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--color-surface-variant)] bg-[var(--color-surface-container-low)] px-4 py-3">
        <Lock size={20} strokeWidth={1.8} className="text-[var(--color-primary)]" />
        <p className="text-label-sm leading-relaxed text-[var(--color-on-surface-variant)]">Pago seguro procesado por Stripe. No almacenamos tus datos de tarjeta. Todas las transacciones están cifradas.</p>
      </div>

      <div className="mt-8 border-t border-[var(--color-outline-variant)] pt-8">
        <button type="button" onClick={onBack} className="text-label-md flex items-center gap-2 text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-primary)]">
          <ArrowLeft size={18} strokeWidth={1.8} />
          Volver a entrega
        </button>
      </div>
    </>
  )
}

function PaymentOption({ icon, title, detail, selected = false }: { icon: ReactNode; title: string; detail: string; selected?: boolean }) {
  return (
    <label className={`relative flex cursor-pointer rounded-[var(--radius-xl)] p-6 shadow-sm transition-colors ${selected ? 'border border-[var(--color-primary)] bg-[var(--color-surface-container-low)] ring-1 ring-[var(--color-primary)]' : 'border border-[var(--color-outline-variant)] bg-[var(--color-surface)] hover:border-[var(--color-primary-container)]'}`}>
      <input className="sr-only" name="payment-method" type="radio" defaultChecked={selected} />
      <span className="flex flex-col">
        <span className="text-label-md flex items-center gap-2 font-bold text-[var(--color-on-surface)]">
          {icon}
          {title}
        </span>
        <span className="text-label-sm mt-1 text-[var(--color-on-surface-variant)]">{detail}</span>
      </span>
    </label>
  )
}

function OrderSummaryPanel({ currentStep, subtotalProducts, shippingTotal, grandTotal, onContinue }: { currentStep: CheckoutStep; subtotalProducts: number; shippingTotal: number; grandTotal: number; onContinue: () => void }) {
  return (
    <aside className="relative lg:col-span-4">
      <div className="sticky top-24 overflow-hidden rounded-[var(--radius-xl)] border border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] bg-[var(--color-surface-container-lowest)] p-6 shadow-sm md:p-8">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 size-32 rounded-full bg-[var(--color-primary-container)] opacity-5 blur-2xl" />
        <h2 className="text-headline-md mb-6 border-b border-[var(--color-outline-variant)] pb-4 text-[24px] text-[var(--color-on-surface)]">Resumen del Pedido</h2>

        {currentStep === 2 ? (
          <ul className="mb-6 flex flex-col gap-6" role="list">
            {summaryItems.map((item) => (
              <li key={item.name} className="flex gap-4">
                <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-[var(--radius-default)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-high)]">
                  <img src={item.image} alt={item.name} className="size-full object-cover" />
                </div>
                <div className="flex flex-grow flex-col justify-between">
                  <div>
                    <h3 className="text-label-md text-[var(--color-on-surface)]">{item.name}</h3>
                    <p className="text-label-sm mt-1 text-[var(--color-on-surface-variant)]">{item.detail}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-label-sm text-[var(--color-outline)]">{item.quantity}</span>
                    <span className="text-label-md text-[var(--color-on-surface)]">{item.price}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mb-6 flex flex-col gap-3 text-[var(--color-on-surface-variant)]">
          <div className="text-body-md flex justify-between">
            <span>Subtotal Productos</span>
            <span>{subtotalProducts.toFixed(2)}€</span>
          </div>
          <div className="text-body-md flex justify-between">
            <span>Gastos de Envío</span>
            <span>{shippingTotal.toFixed(2)}€</span>
          </div>
        </div>

        <div className="mb-8 flex items-end justify-between border-t border-[var(--color-outline-variant)] pt-6">
          <span className="text-label-md text-[var(--color-on-surface)]">Total</span>
          <span className="text-headline-md text-[28px] text-[var(--color-primary)]">{grandTotal.toFixed(2)}€</span>
        </div>

        <div className="flex flex-col gap-4">
          <button type="button" onClick={onContinue} className="text-label-md flex w-full items-center justify-center gap-2 bg-[var(--color-primary)] px-6 py-4 text-[var(--color-on-primary)] transition-colors duration-300 hover:bg-[var(--color-primary-container)]">
            {currentStep === 1 ? 'Continuar al pago' : `Confirmar y pagar ${grandTotal.toFixed(2)}€`}
            {currentStep === 2 ? <Lock size={16} strokeWidth={1.8} /> : <ArrowRight size={16} strokeWidth={1.8} />}
          </button>
          <Link to="/carrito" className="text-label-md w-full border border-transparent py-2 text-center text-[var(--color-on-surface-variant)] transition-colors hover:border-[var(--color-outline-variant)] hover:text-[var(--color-primary)]">
            <span className="text-[var(--color-on-surface-variant)]">Volver al carrito</span>
          </Link>
        </div>
      </div>
    </aside>
  )
}

function AddressModal({ onClose, onSave }: { onClose: () => void; onSave: (address: NonNullable<ShippingGroup['address']>) => void }) {
  const [label, setLabel] = useState('Casa')
  const [value, setValue] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="address-modal-title">
      <div className="w-full max-w-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-6 shadow-2xl md:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="address-modal-title" className="text-headline-md text-[var(--color-on-surface)]">Añadir dirección de entrega</h2>
            <p className="text-body-md mt-2 text-[var(--color-on-surface-variant)]">Guarda una dirección rápida para este envío.</p>
          </div>
          <button type="button" onClick={onClose} className="text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-primary)]">
            <Plus size={18} strokeWidth={1.8} className="rotate-45" />
          </button>
        </div>

        <form
          className="flex flex-col gap-5"
          onSubmit={(event) => {
            event.preventDefault()
            onSave({ label, value })
          }}
        >
          <label className="flex flex-col gap-2">
            <span className="text-label-md text-[var(--color-on-surface)]">Etiqueta</span>
            <input value={label} onChange={(event) => setLabel(event.target.value)} className="border border-[var(--color-outline-variant)] bg-[var(--color-background)] px-4 py-3 text-[var(--color-on-surface)] focus:border-[var(--color-primary)] focus:outline-none" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-label-md text-[var(--color-on-surface)]">Dirección completa</span>
            <textarea value={value} onChange={(event) => setValue(event.target.value)} rows={4} required className="resize-none border border-[var(--color-outline-variant)] bg-[var(--color-background)] px-4 py-3 text-[var(--color-on-surface)] focus:border-[var(--color-primary)] focus:outline-none" placeholder="Ej. Avenida Maisonnave 18, 2º A, 03003 Alicante" />
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="text-label-md border border-[var(--color-outline-variant)] px-6 py-3 text-[var(--color-on-surface-variant)] transition-colors hover:bg-[var(--color-surface-container-low)]">
              Cancelar
            </button>
            <button type="submit" className="text-label-md bg-[var(--color-primary)] px-6 py-3 text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary-container)]">
              Guardar dirección
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ConfirmationStep() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-grow flex-col items-center justify-center px-[var(--space-margin-mobile)] py-16 md:px-[var(--space-margin-desktop)] md:py-24">
      <section className="mb-12 text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-[var(--radius-xl)] border border-[color-mix(in_srgb,var(--color-on-surface)_20%,transparent)]">
          <Check size={30} strokeWidth={1.8} />
        </div>
        <h1 className="text-display-lg mb-4 text-[var(--color-on-surface)]">¡Gracias por tu compra!</h1>
        <p className="text-body-lg mx-auto max-w-xl text-[color-mix(in_srgb,var(--color-on-surface)_80%,transparent)]">
          Tu pedido ha sido procesado con éxito. Como valoramos la frescura, tu orden ha sido dividida por productor y cada uno se enviará por separado directamente desde su origen.
        </p>
      </section>

      <section className="mb-12 w-full">
        <h2 className="text-label-md mb-4 border-b border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] pb-2 uppercase tracking-wider text-[color-mix(in_srgb,var(--color-on-surface)_60%,transparent)]">Resumen de Pedidos</h2>
        <div className="space-y-6">
          {confirmationOrders.map((order) => (
            <article key={order.code} className="border border-[color-mix(in_srgb,var(--color-on-surface)_10%,transparent)] bg-white/50 p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <span className="text-label-md mb-1 block text-[color-mix(in_srgb,var(--color-on-surface)_60%,transparent)]">Pedido {order.code}</span>
                  <h3 className="text-headline-md block text-lg leading-7">{order.producer}</h3>
                </div>
                <span className="text-label-md border border-[color-mix(in_srgb,var(--color-on-surface)_20%,transparent)] bg-[var(--color-background)] px-3 py-1 text-[color-mix(in_srgb,var(--color-on-surface)_80%,transparent)]">PENDIENTE</span>
              </div>
              <div className="mt-4 flex items-end justify-between border-t border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] pt-4">
                <p className="text-body-md text-[color-mix(in_srgb,var(--color-on-surface)_70%,transparent)]">Envío: {order.delivery}</p>
                <p className="text-headline-md text-xl">{order.total}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="mb-12 flex w-full items-center justify-between border-y border-[var(--color-on-surface)] py-6">
        <span className="text-headline-md text-xl">Total Pagado</span>
        <span className="text-headline-md text-2xl font-bold">51.45€</span>
      </div>

      <div className="flex w-full flex-col items-center gap-6">
        <Link to="/pedidos" className="text-label-md w-full bg-[var(--color-primary-container)] px-12 py-4 text-center uppercase tracking-wider text-white transition-colors duration-300 hover:bg-[var(--color-primary)] md:w-auto">
          <span className="text-[var(--color-on-primary)]">Ver mis pedidos</span>
        </Link>
        <Link to="/productos" className="text-body-md border-b border-transparent pb-1 text-[color-mix(in_srgb,var(--color-on-surface)_70%,transparent)] transition-all duration-300 hover:border-[var(--color-on-surface)] hover:text-[var(--color-on-surface)]">
          Seguir comprando
        </Link>
      </div>
    </main>
  )
}
