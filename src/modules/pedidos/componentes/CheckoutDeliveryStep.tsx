import { Check, Store, Truck } from 'lucide-react'
import { formatMoney } from '../../../lib/formatMoney'
import type { Address } from '../../perfil/direcciones.schema'
import type { DeliveryMode, DeliveryModeGroup, DeliverySelection } from '../pagos.schema'

export type CheckoutProducer = {
  id: string
  itemCount: number
  productNames: string[]
}

type Props = {
  producers: CheckoutProducer[]
  deliveryModeGroups: DeliveryModeGroup[]
  selections: DeliverySelection[]
  addresses: Address[]
  selectedAddressId: string | null
  isLoading: boolean
  error: string | null
  onSelectMode: (producerId: string, modeId: string) => void
  onSelectAddress: (addressId: string) => void
}

export function CheckoutDeliveryStep({ producers, deliveryModeGroups, selections, addresses, selectedAddressId, isLoading, error, onSelectMode, onSelectAddress }: Props) {
  const modesByProducer = new Map(deliveryModeGroups.map((group) => [group.producerId, group.modes]))
  const selectedModeByProducer = new Map(selections.map((selection) => [selection.producerId, selection.deliveryModeId]))
  const selectedModes = producers.flatMap((producer) => {
    const selectedId = selectedModeByProducer.get(producer.id)
    return modesByProducer.get(producer.id)?.filter((mode) => mode.id === selectedId) ?? []
  })
  const requiresShippingAddress = selectedModes.some((mode) => mode.type === 'shipping')

  if (isLoading) return <p className="text-body-md py-12 text-center text-[var(--color-on-surface-variant)]">Cargando opciones de entrega...</p>
  if (error) return <p role="alert" className="text-body-md rounded-[var(--radius-default)] bg-[var(--color-error-container)] p-4 text-[var(--color-error)]">{error}</p>

  return (
    <div className="flex flex-col gap-8">
      {producers.map((producer) => {
        const modes = modesByProducer.get(producer.id) ?? []
        const selectedModeId = selectedModeByProducer.get(producer.id)

        return (
          <section key={producer.id} className="border border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] bg-[var(--color-surface-container-lowest)] p-6 md:p-8">
            <header className="mb-6 border-b border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] pb-4">
              <h2 className="text-headline-md mb-1 text-[24px] text-[var(--color-on-surface)]">Productos de este envío</h2>
              <p className="text-label-sm mt-2 text-[var(--color-on-surface-variant)]">{producer.itemCount} {producer.itemCount === 1 ? 'producto en tu carrito' : 'productos en tu carrito'}: {producer.productNames.join(', ')}</p>
            </header>

            <fieldset>
              <legend className="text-label-md mb-4 text-[var(--color-on-surface)]">Método de entrega</legend>
              {modes.length === 0 ? <p role="alert" className="text-body-md text-[var(--color-error)]">Este productor ya no tiene un modo de entrega disponible. Actualiza el carrito antes de continuar.</p> : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {modes.map((mode) => <DeliveryModeCard key={mode.id} mode={mode} producerId={producer.id} selected={selectedModeId === mode.id} onSelect={() => onSelectMode(producer.id, mode.id)} />)}
                </div>
              )}
            </fieldset>
          </section>
        )
      })}

      {requiresShippingAddress ? (
        <section className="border border-[color-mix(in_srgb,var(--color-outline-variant)_80%,transparent)] bg-[var(--color-surface-container-lowest)] p-6 md:p-8">
          <h2 className="text-headline-md mb-2 text-[24px] text-[var(--color-on-surface)]">Dirección de envío</h2>
          <p className="text-body-md mb-5 text-[var(--color-on-surface-variant)]">Selecciona una dirección guardada para los envíos de este pedido.</p>
          {addresses.length === 0 ? <p role="alert" className="text-body-md text-[var(--color-error)]">Guarda una dirección en tu perfil antes de continuar.</p> : (
            <div className="flex flex-col gap-3">
              {addresses.map((address) => (
                <label key={address.id} className={`flex cursor-pointer items-start justify-between gap-4 border p-4 transition-colors ${selectedAddressId === address.id ? 'border-2 border-[var(--color-primary)] bg-[var(--color-surface-container-low)]' : 'border-[var(--color-outline-variant)] hover:border-[var(--color-primary)]'}`}>
                  <input className="sr-only" type="radio" name="shipping-address" checked={selectedAddressId === address.id} onChange={() => onSelectAddress(address.id)} />
                  <span><span className="text-label-md block text-[var(--color-on-surface)]">{address.line1}{address.line2 ? `, ${address.line2}` : ''}</span><span className="text-label-sm text-[var(--color-on-surface-variant)]">{address.postalCode} {address.city}, {address.province}</span></span>
                  {selectedAddressId === address.id ? <span className="flex size-5 items-center justify-center rounded-full border border-[var(--color-primary)] text-[var(--color-primary)]"><Check size={14} strokeWidth={2} /></span> : null}
                </label>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  )
}

function DeliveryModeCard({ mode, producerId, selected, onSelect }: { mode: DeliveryMode; producerId: string; selected: boolean; onSelect: () => void }) {
  const isShipping = mode.type === 'shipping'
  const Icon = isShipping ? Truck : Store

  return (
    <label className={`relative cursor-pointer p-4 transition-colors ${selected ? 'border-2 border-[var(--color-primary)] bg-[var(--color-surface-container-low)]' : 'border border-[var(--color-outline-variant)] hover:border-[var(--color-primary)]'}`}>
      <input className="sr-only" name={`delivery-${producerId}`} type="radio" checked={selected} onChange={onSelect} />
      <span className="mb-3 flex items-start gap-4"><span className={selected ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'}><Icon size={20} strokeWidth={1.8} /></span><span className="text-label-md flex-1 text-[var(--color-on-surface)]">{mode.name}</span><span className={`text-label-md shrink-0 ${mode.price === '0.00' ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface)]'}`}>{formatMoney(mode.price)}</span></span>
      <span className="text-label-sm text-[var(--color-on-surface-variant)]">{isShipping ? 'Entrega en la dirección seleccionada.' : 'Recogida sin dirección de envío.'}</span>
    </label>
  )
}
