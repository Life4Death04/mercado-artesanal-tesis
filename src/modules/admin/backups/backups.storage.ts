import { z } from 'zod'

const STORAGE_KEY = 'admin-database-backup-operation-ids'
const MAX_RECENT_OPERATIONS = 20
const operationIdsSchema = z.array(z.string().min(1)).max(MAX_RECENT_OPERATIONS)

export function readRecentBackupOperationIds(): string[] {
  if (typeof window === 'undefined') return []

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY)
    if (storedValue === null) return []

    const parsed = operationIdsSchema.safeParse(JSON.parse(storedValue))
    return parsed.success ? [...new Set(parsed.data)] : []
  } catch {
    return []
  }
}

export function writeRecentBackupOperationIds(operationIds: string[]) {
  if (typeof window === 'undefined') return

  try {
    const sanitizedIds = [...new Set(operationIds)].slice(0, MAX_RECENT_OPERATIONS)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedIds))
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
}
