import {
  DatabaseBackup,
  Loader2,
  RefreshCcw,
  Trash2,
  XCircle,
} from 'lucide-react'
import { resolveErrorMessage } from '../../../../lib/errorMessages'
import {
  getSuccessfulCreateResult,
  type BackupOperation,
  type BackupOperationStage,
} from '../backups.schema'

type OperationQuery = {
  data?: BackupOperation
  error: unknown
  isError: boolean
  isLoading: boolean
  isFetching: boolean
  refetch: () => Promise<unknown>
}

type BackupOperationCardProps = {
  operationId: string
  query: OperationQuery
  onRemove: () => void
}

const STATUS_LABELS: Record<BackupOperation['status'], string> = {
  ACCEPTED: 'En cola',
  RUNNING: 'En proceso',
  SUCCEEDED: 'Completada',
  FAILED: 'Fallida',
}

const STAGE_LABELS: Record<Exclude<BackupOperationStage, null>, string> = {
  DUMPING: 'Generando el volcado de datos',
  HASHING: 'Verificando la integridad',
  PUBLISHING: 'Publicando la copia',
  TOMBSTONING: 'Preparando la eliminación',
  TARGET_CREATED: 'Preparando el destino',
  RESTORING: 'Restaurando los datos',
  VERIFYING: 'Verificando el resultado',
}

const STAGE_PROGRESS: Record<Exclude<BackupOperationStage, null>, number> = {
  DUMPING: 35,
  HASHING: 68,
  PUBLISHING: 90,
  TOMBSTONING: 65,
  TARGET_CREATED: 28,
  RESTORING: 62,
  VERIFYING: 88,
}

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const byteFormatter = new Intl.NumberFormat('es-ES', {
  style: 'unit',
  unit: 'megabyte',
  maximumFractionDigits: 2,
})

export function BackupOperationCard({ operationId, query, onRemove }: BackupOperationCardProps) {
  if (query.isLoading) {
    return (
      <article role="status" className="rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-surface)] p-6" aria-busy="true">
        <div className="flex min-h-28 items-center justify-center gap-3 text-[var(--color-secondary)]">
          <Loader2 size={22} className="animate-spin" aria-hidden="true" />
          <span className="text-body-md">Recuperando operación...</span>
        </div>
      </article>
    )
  }

  if (query.isError || !query.data) {
    return (
      <article className="rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-error)_55%,transparent)] bg-[var(--color-error-container)] p-6" role="alert">
        <div className="flex items-start gap-3">
          <XCircle className="mt-0.5 shrink-0 text-[var(--color-error)]" size={22} aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <h3 className="text-headline-md text-[var(--color-on-error-container)]">No se pudo recuperar esta operación</h3>
            <p className="text-body-md mt-2 text-[var(--color-on-error-container)]">{resolveErrorMessage(query.error)}</p>
            <p className="text-label-sm mt-2 break-all text-[var(--color-on-error-container)]/75">ID: {operationId}</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={() => void query.refetch()} disabled={query.isFetching} className="text-label-md inline-flex items-center gap-2 border border-current px-4 py-2 text-[var(--color-error)] disabled:cursor-wait disabled:opacity-60">
            <RefreshCcw size={16} className={query.isFetching ? 'animate-spin' : ''} aria-hidden="true" />
            {query.isFetching ? 'Reintentando...' : 'Reintentar'}
          </button>
          <button type="button" onClick={onRemove} className="text-label-md inline-flex items-center gap-2 px-4 py-2 text-[var(--color-on-error-container)] hover:underline">
            <Trash2 size={16} aria-hidden="true" />
            Quitar de este navegador
          </button>
        </div>
      </article>
    )
  }

  const operation = query.data
  const result = getSuccessfulCreateResult(operation)
  const progress = getProgress(operation)
  const isActive = operation.status === 'ACCEPTED' || operation.status === 'RUNNING'
  const statusTone = operation.status === 'FAILED'
    ? 'bg-[var(--color-error-container)] text-[var(--color-error)]'
    : operation.status === 'SUCCEEDED'
      ? 'bg-[color-mix(in_srgb,var(--color-secondary-fixed)_55%,transparent)] text-[var(--color-primary)]'
      : 'bg-[var(--color-surface-container-highest)] text-[var(--color-secondary)]'

  return (
    <article className="rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-surface)] p-5 shadow-[0_12px_35px_-28px_color-mix(in_srgb,var(--color-on-surface)_45%,transparent)] md:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span className={`grid size-11 shrink-0 place-items-center rounded-full ${isActive ? 'bg-[var(--color-primary-container)] text-[var(--color-on-primary)]' : 'bg-[var(--color-surface-container-low)] text-[var(--color-primary)]'}`}>
            {isActive ? <Loader2 size={21} className="animate-spin" aria-hidden="true" /> : operation.status === 'FAILED' ? <XCircle size={21} aria-hidden="true" /> : <DatabaseBackup size={21} aria-hidden="true" />}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-headline-md text-[var(--color-on-surface)]">Copia de seguridad</h3>
              <span className={`text-label-sm rounded-full px-3 py-1 ${statusTone}`}>{STATUS_LABELS[operation.status]}</span>
            </div>
            <p className="text-body-md mt-2 text-[var(--color-secondary)]">
              Solicitada el {formatDate(operation.createdAt)}
            </p>
            <p className="text-label-sm mt-1 break-all text-[var(--color-outline)]">Operación: {operation.id}</p>
          </div>
        </div>
        <button type="button" onClick={onRemove} aria-label={`Quitar la operación ${operation.id} de este navegador`} className="text-label-md inline-flex items-center gap-2 self-start rounded-[var(--radius-sm)] px-3 py-2 text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-on-surface)]">
          <Trash2 size={16} aria-hidden="true" />
          Quitar
        </button>
      </div>

      <div className="mt-6" aria-live="polite">
        <div className="mb-2 flex items-center justify-between gap-4">
          <span className="text-label-md text-[var(--color-on-surface)]">{getStageLabel(operation)}</span>
          <span className="text-label-sm tabular-nums text-[var(--color-secondary)]">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-container-highest)]" role="progressbar" aria-label="Progreso de la operación" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
          <span className={`block h-full rounded-full transition-[width] duration-500 ${operation.status === 'FAILED' ? 'bg-[var(--color-error)]' : 'bg-[var(--color-primary-container)]'}`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      {operation.status === 'FAILED' ? (
        <div className="mt-6 flex gap-3 border-l-4 border-[var(--color-error)] bg-[var(--color-error-container)] p-4 text-[var(--color-on-error-container)]">
          <XCircle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="text-label-md">La copia no pudo completarse.</p>
            {operation.failureReason ? <p className="text-body-md mt-1">{operation.failureReason}</p> : null}
          </div>
        </div>
      ) : null}

      {operation.status === 'SUCCEEDED' ? (
        <div className="mt-6 grid gap-4 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] pt-5 sm:grid-cols-2 lg:grid-cols-3">
          <OperationDetail label="Identificador de copia" value={operation.backupId ?? 'No informado'} />
          <OperationDetail label="Tamaño" value={result ? formatBytes(result.bytes) : 'No informado'} />
          <OperationDetail label="Checksum SHA-256" value={result?.checksumSha256 ?? 'No informado'} monospace />
        </div>
      ) : null}
    </article>
  )
}

function OperationDetail({ label, value, monospace = false }: { label: string; value: string; monospace?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-label-sm text-[var(--color-secondary)]">{label}</p>
      <p className={`text-body-md mt-1 break-all text-[var(--color-on-surface)] ${monospace ? 'font-mono text-xs' : ''}`}>{value}</p>
    </div>
  )
}

function getProgress(operation: BackupOperation): number {
  if (operation.status === 'SUCCEEDED') return 100
  if (operation.status === 'FAILED') return 100
  if (operation.stage !== null) return STAGE_PROGRESS[operation.stage]
  return operation.status === 'RUNNING' ? 18 : 8
}

function getStageLabel(operation: BackupOperation): string {
  if (operation.status === 'SUCCEEDED') return 'Copia creada correctamente'
  if (operation.status === 'FAILED') return 'Operación finalizada con errores'
  if (operation.stage !== null) return STAGE_LABELS[operation.stage]
  return operation.status === 'RUNNING' ? 'Iniciando la operación' : 'Esperando para comenzar'
}

function formatDate(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'fecha no disponible' : dateFormatter.format(date)
}

function formatBytes(bytes: number): string {
  return byteFormatter.format(bytes / 1_000_000)
}
