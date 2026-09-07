import { moneyToCents } from '../../../lib/formatMoney'
import type { OrderLineDTO, SubOrderListItemDTO } from './pedidos.schema'

export function getLineTotalCents(line: OrderLineDTO): bigint | null {
  const unitCents = moneyToCents(line.unitPriceSnapshot)
  if (unitCents === null || !Number.isSafeInteger(line.quantity) || line.quantity < 0) return null

  return unitCents * BigInt(line.quantity)
}

export function getLinesSubtotalCents(lines: OrderLineDTO[]): bigint | null {
  let subtotal = 0n

  for (const line of lines) {
    const lineTotal = getLineTotalCents(line)
    if (lineTotal === null) return null
    subtotal += lineTotal
  }

  return subtotal
}

export function getSubOrderTotalCents(pedido: SubOrderListItemDTO): bigint | null {
  const subtotal = getLinesSubtotalCents(pedido.orderLines)
  const shipping = moneyToCents(pedido.shippingCostSnapshot)
  if (subtotal === null || shipping === null) return null

  return subtotal + shipping
}
