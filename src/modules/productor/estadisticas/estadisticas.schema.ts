import { z } from 'zod'

// ---------------------------------------------------------------------------
// Window parameter — strictly: '7d' | '30d' | '90d' | '1y'
// [source: mercado-artesanal-backend/openspec/specs/sales-stats/spec.md]
// Any other value → VALIDATION_FAILED (422) from backend.
// ---------------------------------------------------------------------------

export const StatsWindowSchema = z.enum(['7d', '30d', '90d', '1y'])
export type StatsWindow = z.infer<typeof StatsWindowSchema>

// ---------------------------------------------------------------------------
// Revenue stats DTO — GET /producers/me/stats/revenue?window=<value>
// [source: sales-stats/spec.md]
//
// money-typing R1: totalRevenue is a Decimal string (NEVER z.number()).
// ---------------------------------------------------------------------------

export type RevenueStatsDTO = {
  window: StatsWindow
  /** Decimal string from Prisma aggregate — display via formatMoney; NEVER parse for math. */
  totalRevenue: string
  currency: 'EUR'
  from: string
  to: string
}

// ---------------------------------------------------------------------------
// Order count DTO — GET /producers/me/stats/order-count?window=<value>
// [source: sales-stats/spec.md]
//
// count is an integer, NOT money — z.number() is fine here.
// ---------------------------------------------------------------------------

export type OrderCountStatsDTO = {
  window: StatsWindow
  count: number
  from: string
  to: string
}

// ---------------------------------------------------------------------------
// Low-stock alert item — embedded in LowStockStatsDTO
// [source: sales-stats/spec.md — delegates to inventory capability]
// ---------------------------------------------------------------------------

export type LowStockAlertItem = {
  productId: string
  name: string
  stock: number
  lowStockThreshold: number
}

// ---------------------------------------------------------------------------
// Low-stock stats DTO — GET /producers/me/stats/low-stock
// [source: sales-stats/spec.md]
// ---------------------------------------------------------------------------

export type LowStockStatsDTO = {
  items: LowStockAlertItem[]
  limit: number
  offset: number
  total: number
}
