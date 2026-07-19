import { useMutation } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../../auth/hooks/useAuthenticatedApi'
import { reportProducto } from '../productos.api'
import type { ReportProductoFormValues } from '../productos.schema'

type ReportProductoArgs = {
  id: string
  body: ReportProductoFormValues
}

/**
 * Mutation for POST /api/v1/products/:id/report.
 *
 * - Any authenticated user may report (consumer, producer, admin).
 * - Token acquisition is delegated to useAuthenticatedApi() (spec R2).
 * - First-report-wins; subsequent reports are idempotent 200.
 * - Does NOT invalidate the products list — moderation fields on the producer
 *   list view are informational and stale cache is acceptable here.
 * - 401 / 4xx / 5xx surface as mutation error via resolveErrorMessage.
 */
export function useReportProductoMutation() {
  const apiRequest = useAuthenticatedApi()

  return useMutation({
    mutationFn: ({ id, body }: ReportProductoArgs) => reportProducto(apiRequest, id, body),
    // No cache invalidation — moderation status does not drive producer list control flow
  })
}
