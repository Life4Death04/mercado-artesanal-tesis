import { z } from 'zod'

export const backupOperationTypeSchema = z.enum(['CREATE', 'DELETE', 'RESTORE_PREPARATION'])
export const backupOperationStatusSchema = z.enum(['ACCEPTED', 'RUNNING', 'SUCCEEDED', 'FAILED'])
export const backupOperationStageSchema = z
  .enum([
    'DUMPING',
    'HASHING',
    'PUBLISHING',
    'TOMBSTONING',
    'TARGET_CREATED',
    'RESTORING',
    'VERIFYING',
  ])
  .nullable()

export const createBackupInputSchema = z
  .object({
    label: z.string().trim().max(200).nullable().optional(),
  })
  .strict()

export const backupOperationSchema = z
  .object({
    id: z.string().min(1),
    type: backupOperationTypeSchema,
    status: backupOperationStatusSchema,
    stage: backupOperationStageSchema,
    backupId: z.string().min(1).nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    failureReason: z.string().nullable(),
    result: z.record(z.string(), z.unknown()).nullable(),
    links: z
      .object({
        self: z.string(),
        backup: z.string().optional(),
      })
      .strict(),
  })
  .strict()

export type CreateBackupInput = z.input<typeof createBackupInputSchema>
export type BackupOperation = z.infer<typeof backupOperationSchema>
export type BackupOperationStage = z.infer<typeof backupOperationStageSchema>

export function getSuccessfulCreateResult(operation: BackupOperation) {
  if (operation.type !== 'CREATE' || operation.status !== 'SUCCEEDED' || operation.result === null) {
    return null
  }

  const result = z
    .object({
      checksumSha256: z.string(),
      bytes: z.number().nonnegative(),
    })
    .safeParse(operation.result)

  return result.success ? result.data : null
}
