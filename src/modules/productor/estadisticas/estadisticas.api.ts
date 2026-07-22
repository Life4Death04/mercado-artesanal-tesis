import type { RevenueStatsDTO, OrderCountStatsDTO, LowStockStatsDTO, StatsWindow } from './estadisticas.schema'

// ---------------------------------------------------------------------------
// Endpoint constants
// [source: mercado-artesanal-backend/openspec/specs/sales-stats/spec.md]
// ---------------------------------------------------------------------------

export const estadisticasEndpoints = {
  /**
   * GET /producers/me/stats/revenue?window=<value>
   * window: '7d' | '30d' | '90d' | '1y'
   * Response: { window, totalRevenue: string, currency: 'EUR', from, to }
   */
  revenue: (window: StatsWindow) => `/producers/me/stats/revenue?window=${encodeURIComponent(window)}`,
  /**
   * GET /producers/me/stats/order-count?window=<value>
   * Response: { window, count: integer, from, to }
   */
  orderCount: (window: StatsWindow) => `/producers/me/stats/order-count?window=${encodeURIComponent(window)}`,
  /**
   * GET /producers/me/stats/low-stock
   * Response: { items: [...], limit, offset, total }
   */
  lowStock: '/producers/me/stats/low-stock',
} as const

// ---------------------------------------------------------------------------
// Authenticated caller type — matches return type of useAuthenticatedApi()
// ---------------------------------------------------------------------------

type ApiCaller = <TResponse>(path: string, options?: { method?: string; body?: unknown }) => Promise<TResponse>

// ---------------------------------------------------------------------------
// API functions — called exclusively by the hook layer (spec R5)
// ---------------------------------------------------------------------------

/**
 * Fetches revenue for the authenticated producer over the given window.
 *
 * Only SubOrders with status IN (sent, delivered) contribute.
 * Cancelled orders are excluded. Shipping cost NOT included (Cycle 2 spec).
 * totalRevenue is a Decimal string — display via formatMoney; NEVER parse for math.
 *
 * Endpoint: GET /api/v1/producers/me/stats/revenue?window=<value>
 */
export async function getRevenueStats(apiCaller: ApiCaller, window: StatsWindow): Promise<RevenueStatsDTO> {
  return apiCaller<RevenueStatsDTO>(estadisticasEndpoints.revenue(window))
}

/**
 * Fetches the count of non-cancelled SubOrders for the producer over the given window.
 *
 * Excludes cancelled orders. Counts: pending, preparing, sent, delivered.
 *
 * Endpoint: GET /api/v1/producers/me/stats/order-count?window=<value>
 */
export async function getOrderCountStats(apiCaller: ApiCaller, window: StatsWindow): Promise<OrderCountStatsDTO> {
  return apiCaller<OrderCountStatsDTO>(estadisticasEndpoints.orderCount(window))
}

/**
 * Fetches the low-stock alert list (products at or below their lowStockThreshold).
 * Delegates to the inventory capability in the backend (per spec).
 *
 * Endpoint: GET /api/v1/producers/me/stats/low-stock
 */
export async function getLowStockStats(apiCaller: ApiCaller): Promise<LowStockStatsDTO> {
  return apiCaller<LowStockStatsDTO>(estadisticasEndpoints.lowStock)
}
