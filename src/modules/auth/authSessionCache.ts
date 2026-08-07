import type { QueryClient } from '@tanstack/react-query'
import { ApiError } from '../../lib/api'

export function clearAuthenticatedCache(queryClient: QueryClient): void {
  queryClient.clear()
}

export function requiresAuthenticatedCacheIsolation(error: unknown): boolean {
  if (error instanceof ApiError) return error.status === 401
  if (typeof error !== 'object' || error === null || !('error' in error)) return false

  return error.error === 'login_required' || error.error === 'consent_required'
}
