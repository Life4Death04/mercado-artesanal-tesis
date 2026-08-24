import { useState, type FormEvent } from 'react'
import {
  ArchiveRestore,
  CheckCircle2,
  DatabaseBackup,
  HardDrive,
  Info,
  Loader2,
  RefreshCcw,
  ShieldCheck,
} from 'lucide-react'
import { resolveErrorMessage } from '../../../lib/errorMessages'
import { BackupOperationCard } from '../backups/components/BackupOperationCard'
import {
  useAdminBackupOperationQueries,
  useCreateAdminBackupMutation,
  useRecentBackupOperationIds,
} from '../backups/hooks/useAdminBackups'

const MAX_LABEL_LENGTH = 200

export function BackupsAdminPage() {
  const [label, setLabel] = useState('')
  const [showAcceptedNotice, setShowAcceptedNotice] = useState(false)
  const { operationIds, addOperationId, removeOperationId } = useRecentBackupOperationIds()
  const operationQueries = useAdminBackupOperationQueries(operationIds)
  const createMutation = useCreateAdminBackupMutation()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setShowAcceptedNotice(false)

    const normalizedLabel = label.trim()
    createMutation.mutate(
      { label: normalizedLabel || null },
      {
        onSuccess: (operation) => {
          addOperationId(operation.id)
          setLabel('')
          setShowAcceptedNotice(true)
        },
      },
    )
  }

  function retryCreation() {
    if (!createMutation.variables) return
    setShowAcceptedNotice(false)
    createMutation.mutate(createMutation.variables, {
      onSuccess: (operation) => {
        addOperationId(operation.id)
        setLabel('')
        setShowAcceptedNotice(true)
      },
    })
  }

  return (
    <div className="mx-[var(--space-margin-mobile)] max-w-[var(--layout-container-max)] md:mx-0">
      <header className="mb-10 max-w-3xl">
        <div className="mb-4 flex items-center gap-3 text-[var(--color-primary)]">
          <DatabaseBackup size={24} strokeWidth={1.8} aria-hidden="true" />
          <span className="text-label-md uppercase tracking-[0.16em]">Administración del sistema</span>
        </div>
        <h2 className="text-display-lg mb-3 text-[var(--color-on-surface)]">Copias de seguridad</h2>
        <p className="text-body-lg text-[var(--color-secondary)]">
          Crea una copia de la base de datos y consulta el avance de las solicitudes realizadas desde este navegador.
        </p>
      </header>

      <section className="mb-10 grid overflow-hidden rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-surface)] lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.75fr)]" aria-labelledby="create-backup-heading">
        <div className="p-6 md:p-8 lg:p-10">
          <div className="mb-7 flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--color-primary-container)] text-[var(--color-on-primary)]">
              <HardDrive size={21} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div>
              <h3 id="create-backup-heading" className="text-headline-lg text-[var(--color-on-surface)]">Crear una nueva copia</h3>
              <p className="text-body-md mt-1 text-[var(--color-secondary)]">El proceso se ejecuta en segundo plano. Podrás seguir cada etapa aquí.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl">
            <label htmlFor="backup-label" className="text-label-md block text-[var(--color-on-surface)]">Nombre de referencia <span className="font-normal text-[var(--color-secondary)]">(opcional)</span></label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="min-w-0 flex-1">
                <input
                  id="backup-label"
                  value={label}
                  onChange={(event) => {
                    setLabel(event.target.value)
                    createMutation.reset()
                    setShowAcceptedNotice(false)
                  }}
                  maxLength={MAX_LABEL_LENGTH}
                  aria-describedby="backup-label-help"
                  placeholder="Ej.: Cierre mensual de agosto"
                  disabled={createMutation.isPending}
                  className="text-body-md w-full rounded-[var(--radius-sm)] border border-[var(--color-outline-variant)] bg-transparent px-4 py-3 text-[var(--color-on-surface)] outline-none transition-colors placeholder:text-[var(--color-outline)] focus:border-[var(--color-primary-container)] disabled:cursor-wait disabled:opacity-60"
                />
                <div id="backup-label-help" className="text-label-sm mt-2 flex justify-between gap-4 text-[var(--color-secondary)]">
                  <span>Se recortarán los espacios al inicio y al final.</span>
                  <span className="tabular-nums">{label.length}/{MAX_LABEL_LENGTH}</span>
                </div>
              </div>
              <button type="submit" disabled={createMutation.isPending} className="text-label-md inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-primary-container)] px-6 py-3 text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary)] disabled:cursor-wait disabled:opacity-65">
                {createMutation.isPending ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <DatabaseBackup size={18} aria-hidden="true" />}
                {createMutation.isPending ? 'Solicitando...' : 'Crear copia'}
              </button>
            </div>
          </form>

          {showAcceptedNotice && createMutation.isSuccess ? (
            <div className="text-body-md mt-6 flex items-start gap-3 border-l-4 border-[var(--color-primary-container)] bg-[var(--color-surface-container-low)] p-4 text-[var(--color-on-surface)]" role="status" aria-live="polite">
              <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
              <span>La solicitud fue aceptada. El estado se actualizará automáticamente.</span>
            </div>
          ) : null}

          {createMutation.isError ? (
            <div className="mt-6 border-l-4 border-[var(--color-error)] bg-[var(--color-error-container)] p-4 text-[var(--color-on-error-container)]" role="alert">
              <p className="text-body-md">{resolveErrorMessage(createMutation.error)}</p>
              <button type="button" onClick={retryCreation} disabled={createMutation.isPending} className="text-label-md mt-3 inline-flex items-center gap-2 border border-current px-4 py-2 disabled:opacity-60">
                <RefreshCcw size={16} aria-hidden="true" />
                Reintentar solicitud
              </button>
            </div>
          ) : null}
        </div>

        <aside className="border-t border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-surface-container-low)] p-6 md:p-8 lg:border-t-0 lg:border-l" aria-labelledby="restore-heading">
          <ArchiveRestore size={27} strokeWidth={1.6} className="mb-5 text-[var(--color-secondary)]" aria-hidden="true" />
          <h3 id="restore-heading" className="text-headline-md text-[var(--color-on-surface)]">Restauración</h3>
          <p id="restore-unavailable-help" className="text-body-md mt-3 text-[var(--color-secondary)]">
            La restauración todavía no está disponible porque el servidor no ofrece esta operación.
          </p>
          <button type="button" disabled aria-describedby="restore-unavailable-help" className="text-label-md mt-6 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-5 py-3 text-[var(--color-outline)] opacity-75">
            <ArchiveRestore size={17} aria-hidden="true" />
            Restaurar copia
          </button>
        </aside>
      </section>

      <section aria-labelledby="recent-operations-heading">
        <div className="mb-6 flex flex-col gap-4 border-b border-[color-mix(in_srgb,var(--color-outline-variant)_55%,transparent)] pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 id="recent-operations-heading" className="text-headline-lg text-[var(--color-on-surface)]">Actividad de este navegador</h3>
            <p className="text-body-md mt-2 max-w-3xl text-[var(--color-secondary)]">
              Este no es un catálogo completo del servidor. Solo se guardan en este navegador los identificadores de las operaciones solicitadas aquí; no se almacenan copias, respuestas ni credenciales.
            </p>
          </div>
          {operationIds.length > 0 ? <span className="text-label-md whitespace-nowrap text-[var(--color-secondary)]">{operationIds.length} {operationIds.length === 1 ? 'operación local' : 'operaciones locales'}</span> : null}
        </div>

        {operationIds.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] px-6 py-12 text-center">
            <ShieldCheck size={34} strokeWidth={1.5} className="mx-auto text-[var(--color-secondary)]" aria-hidden="true" />
            <h4 className="text-headline-md mt-5 text-[var(--color-on-surface)]">No hay operaciones guardadas en este navegador</h4>
            <p className="text-body-md mx-auto mt-2 max-w-xl text-[var(--color-secondary)]">Cuando solicites una copia, su identificador aparecerá aquí y permitirá recuperar el estado después de actualizar la página.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5" aria-label="Operaciones recientes de copias de seguridad">
            {operationIds.map((operationId, index) => (
              <BackupOperationCard key={operationId} operationId={operationId} query={operationQueries[index]} onRemove={() => removeOperationId(operationId)} />
            ))}
          </div>
        )}

        <div className="text-label-sm mt-7 flex items-start gap-2 text-[var(--color-outline)]">
          <Info size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p>Quitar una entrada solo borra su identificador de este navegador. No elimina ninguna copia ni operación del servidor.</p>
        </div>
      </section>
    </div>
  )
}
