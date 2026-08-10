/**
 * formatMoney — display helper for Decimal strings serialized by Prisma.
 *
 * Accepts a money string (e.g. "18.50") and returns a locale-formatted EUR
 * string using the es-ES locale (e.g. "18,50 €").
 *
 * Returns '—' when the input is empty, not a finite number, or otherwise
 * unparseable. The return value is display-only and MUST NOT be used for
 * arithmetic or persisted back to the API.
 */
export function formatMoney(value: string | null | undefined): string {
  if (value == null || value === '') return '—'

  const numeric = Number(value)

  if (!Number.isFinite(numeric)) return '—'

  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(numeric)
}

export function moneyToCents(value: string): bigint | null {
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(value.trim())
  if (!match) return null

  const [, euros, decimal = ''] = match
  return BigInt(euros) * 100n + BigInt(decimal.padEnd(2, '0'))
}

export function formatMoneyFromCents(value: bigint | null): string {
  if (value === null) return '—'

  const sign = value < 0n ? '-' : ''
  const absolute = value < 0n ? -value : value
  const decimal = `${sign}${absolute / 100n}.${(absolute % 100n).toString().padStart(2, '0')}`
  return formatMoney(decimal)
}
