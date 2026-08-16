import { moneyToCents } from '../../lib/formatMoney'
import type { IncidentLine } from './incidencias.schema'

export function getIncidentLineTotalCents(line: IncidentLine): bigint | null {
  const unitCents = moneyToCents(line.unitPrice)
  if (unitCents === null || !Number.isSafeInteger(line.quantity)) return null
  return unitCents * BigInt(line.quantity)
}
