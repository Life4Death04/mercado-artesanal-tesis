import {
  backupOperationSchema,
  createBackupInputSchema,
  type BackupOperation,
  type CreateBackupInput,
} from './backups.schema'

export const adminBackupEndpoints = {
  create: '/admin/database-backups',
  operation: (operationId: string) =>
    `/admin/database-backup-operations/${encodeURIComponent(operationId)}`,
} as const

type ApiCaller = <TResponse>(
  path: string,
  options?: { method?: string; body?: unknown; signal?: AbortSignal },
) => Promise<TResponse>

export async function createAdminBackup(
  api: ApiCaller,
  input: CreateBackupInput,
): Promise<BackupOperation> {
  const body = createBackupInputSchema.parse(input)
  return backupOperationSchema.parse(
    await api<unknown>(adminBackupEndpoints.create, { method: 'POST', body }),
  )
}

export async function getAdminBackupOperation(
  api: ApiCaller,
  operationId: string,
  signal?: AbortSignal,
): Promise<BackupOperation> {
  return backupOperationSchema.parse(
    await api<unknown>(adminBackupEndpoints.operation(operationId), { signal }),
  )
}
