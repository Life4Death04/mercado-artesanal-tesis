export const adminBackupKeys = {
  all: ['admin', 'database-backups'] as const,
  operations: () => [...adminBackupKeys.all, 'operation'] as const,
  operation: (operationId: string) => [...adminBackupKeys.operations(), operationId] as const,
} as const
