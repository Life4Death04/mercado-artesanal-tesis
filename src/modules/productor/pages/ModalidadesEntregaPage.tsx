import { type ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  Loader2,
  MapPin,
  PackageCheck,
  Pencil,
  Plus,
  Save,
  Trash2,
  Truck,
  User,
  X,
} from 'lucide-react'
import {
  AgregarPuntoModal,
  EliminarPuntoModal,
  type PuntoRecogida,
} from '../componentes/ModalidadesEntregaModals'
import { useEntregasQuery } from '../entregas/hooks/useEntregasQuery'
import { useUpdateEntregasMutation } from '../entregas/hooks/useUpdateEntregasMutation'
import { resolveErrorMessage } from '../../../lib/errorMessages'
import type { DeliveryModeDTO } from '../entregas/entregas.schema'

// ---------------------------------------------------------------------------
// Local draft types — UI-facing shapes derived from DeliveryModeDTO
// ---------------------------------------------------------------------------

type EntregaPersonalState = {
  id: string | null
  activa: boolean
  ambito: string
  coste: string
  notas: string
}

type MensajeriaState = {
  id: string | null
  activa: boolean
  empresa: string
  ambito: string
  coste: string
}

type DraftConfig = {
  entregaPersonal: EntregaPersonalState
  mensajeria: MensajeriaState
  puntosActiva: boolean
  puntos: PuntoRecogida[]
}

// ---------------------------------------------------------------------------
// Helpers — map backend DTOs to local display shapes
// ---------------------------------------------------------------------------

const EMPTY_ENTREGA_PERSONAL: EntregaPersonalState = {
  id: null,
  activa: false,
  ambito: '',
  coste: '0,00 EUR',
  notas: '',
}

const EMPTY_MENSAJERIA: MensajeriaState = {
  id: null,
  activa: false,
  empresa: '',
  ambito: 'Nacional',
  coste: '0,00 EUR',
}

/**
 * Maps the backend delivery mode list to the local DraftConfig shape.
 *
 * PICKUP modes are displayed as "Entrega personal" (first PICKUP found) and
 * subsequent PICKUP modes are surfaced as "Punto de recogida" entries.
 * SHIPPING_FLAT_RATE modes map to "Mensajeria".
 *
 * This is a best-effort mapping: the backend may have 0 items (new producer),
 * exactly 1 of each type, or multiple. Only the first of each type is bound
 * to the dedicated card; extras are ignored in this view.
 */
function mapDtosToConfig(modes: DeliveryModeDTO[]): DraftConfig {
  const pickup = modes.find((m) => m.type === 'PICKUP')
  const shipping = modes.find((m) => m.type === 'SHIPPING_FLAT_RATE')

  const entregaPersonal: EntregaPersonalState = pickup
    ? {
        id: pickup.id,
        activa: pickup.isActive,
        ambito: pickup.coverageScope ?? pickup.locationAddress ?? '',
        coste: '0,00 EUR', // PICKUP has no flat rate — cost is always shown as free
        notas: pickup.openingHours ?? '',
      }
    : EMPTY_ENTREGA_PERSONAL

  const mensajeria: MensajeriaState = shipping
    ? {
        id: shipping.id,
        activa: shipping.isActive,
        empresa: shipping.locationName ?? '',
        ambito: shipping.coverageScope ?? 'Nacional',
        coste: shipping.flatRate ? shipping.flatRate.replace('.', ',') + ' EUR' : '0,00 EUR',
      }
    : EMPTY_MENSAJERIA

  // Pickup points sourced from locationAddress / locationName on PICKUP modes
  // In the current backend model, each PICKUP entry IS a pickup point.
  // We surface all PICKUP modes as "puntos de recogida" in the list.
  const puntos: PuntoRecogida[] = modes
    .filter((m) => m.type === 'PICKUP')
    .map((m) => ({
      id: m.id,
      nombre: m.locationName ?? 'Punto sin nombre',
      calle: m.locationAddress ?? '',
      municipio: m.coverageScope ?? '',
      codigoPostal: '',
      horario: m.openingHours ?? '',
    }))

  return {
    entregaPersonal,
    mensajeria,
    puntosActiva: puntos.length > 0 && puntos.some(() => pickup?.isActive ?? false),
    puntos,
  }
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export function ModalidadesEntregaPage() {
  const { data: modes = [], isLoading, isError, error: queryError } = useEntregasQuery()
  const updateMutation = useUpdateEntregasMutation()

  // Derive initial config from server data
  const serverConfig = mapDtosToConfig(modes)

  const [draftConfig, setDraftConfig] = useState<DraftConfig | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showAgregar, setShowAgregar] = useState(false)
  const [puntoAEliminar, setPuntoAEliminar] = useState<PuntoRecogida | null>(null)
  const [mutationError, setMutationError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Effective config: draft when editing, server otherwise
  const effectiveConfig = isEditing && draftConfig !== null ? draftConfig : serverConfig

  const activeMethods = [
    effectiveConfig.entregaPersonal.activa,
    effectiveConfig.mensajeria.activa,
    effectiveConfig.puntosActiva,
  ].filter(Boolean).length

  function beginEdit() {
    setDraftConfig(serverConfig)
    setMutationError(null)
    setSaveSuccess(false)
    setIsEditing(true)
  }

  function cancelEdit() {
    setDraftConfig(null)
    setPuntoAEliminar(null)
    setShowAgregar(false)
    setMutationError(null)
    updateMutation.reset()
    setIsEditing(false)
  }

  async function saveChanges() {
    if (!draftConfig) return
    setMutationError(null)

    // Collect all mutations needed (isActive changes and field changes)
    const updates: Array<() => Promise<unknown>> = []

    // Update entrega personal (PICKUP) if id exists
    if (draftConfig.entregaPersonal.id) {
      updates.push(() =>
        updateMutation.mutateAsync({
          id: draftConfig.entregaPersonal.id!,
          payload: {
            isActive: draftConfig.entregaPersonal.activa,
            coverageScope: draftConfig.entregaPersonal.ambito || null,
            openingHours: draftConfig.entregaPersonal.notas || null,
          },
        }),
      )
    }

    // Update mensajeria (SHIPPING_FLAT_RATE) if id exists
    if (draftConfig.mensajeria.id) {
      // Parse flatRate from display format "5,50 EUR" → "5.50"
      const rawCost = draftConfig.mensajeria.coste
        .replace(/\s*EUR\s*$/i, '')
        .trim()
        .replace(',', '.')
      const isValidRate = /^\d+(\.\d{1,2})?$/.test(rawCost)

      updates.push(() =>
        updateMutation.mutateAsync({
          id: draftConfig.mensajeria.id!,
          payload: {
            isActive: draftConfig.mensajeria.activa,
            locationName: draftConfig.mensajeria.empresa || null,
            coverageScope: draftConfig.mensajeria.ambito || null,
            flatRate: isValidRate ? rawCost : undefined,
          },
        }),
      )
    }

    if (updates.length === 0) {
      // No backend IDs available — local state only (new producer scenario)
      setIsEditing(false)
      return
    }

    try {
      for (const update of updates) {
        await update()
      }
      setSaveSuccess(true)
      setIsEditing(false)
      setDraftConfig(null)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: unknown) {
      setMutationError(resolveErrorMessage(err))
    }
  }

  function updateEntregaPersonal<K extends keyof EntregaPersonalState>(
    key: K,
    value: EntregaPersonalState[K],
  ) {
    setDraftConfig((current) => {
      const base = current ?? serverConfig
      return { ...base, entregaPersonal: { ...base.entregaPersonal, [key]: value } }
    })
  }

  function updateMensajeria<K extends keyof MensajeriaState>(
    key: K,
    value: MensajeriaState[K],
  ) {
    setDraftConfig((current) => {
      const base = current ?? serverConfig
      return { ...base, mensajeria: { ...base.mensajeria, [key]: value } }
    })
  }

  function agregarPunto(datos: Omit<PuntoRecogida, 'id'>) {
    setDraftConfig((current) => {
      const base = current ?? serverConfig
      return {
        ...base,
        puntos: [...base.puntos, { ...datos, id: `local-${Date.now()}` }],
      }
    })
  }

  function eliminarPunto(id: string) {
    setDraftConfig((current) => {
      const base = current ?? serverConfig
      return {
        ...base,
        puntos: base.puntos.filter((punto) => punto.id !== id),
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3 bg-[var(--color-background)] text-[var(--color-secondary)]">
        <Loader2 size={24} strokeWidth={1.8} className="animate-spin" />
        <span className="text-body-md">Cargando configuración de entregas...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <main className="mx-auto w-full max-w-[var(--layout-container-max)] px-[var(--space-margin-mobile)] py-12 md:px-[var(--space-margin-desktop)] md:py-16">
        <section className="mb-10">
          <nav
            aria-label="Breadcrumb"
            className="text-label-sm mb-6 flex items-center gap-2 text-[var(--color-secondary)]"
          >
            <Link to="/productor/pedidos" className="transition-colors hover:text-[var(--color-primary)]">
              Area Productor
            </Link>
            <ChevronRight size={14} strokeWidth={1.8} />
            <span className="text-[var(--color-primary)]">Configuracion de entregas</span>
          </nav>

          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h1 className="text-display-lg mb-4 text-[var(--color-primary)]">
                Configuracion de entregas
              </h1>
              <p className="text-body-md max-w-2xl text-[var(--color-on-surface-variant)]">
                Define como reciben tus productos los clientes y deja visible que modalidades
                estan activas antes de publicar cambios.
              </p>
            </div>

            {isEditing ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={updateMutation.isPending}
                  className="text-label-md inline-flex items-center justify-center gap-2 border border-[var(--color-outline-variant)] bg-white px-5 py-3 text-[var(--color-secondary)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X size={16} strokeWidth={1.8} />
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => { void saveChanges() }}
                  disabled={updateMutation.isPending}
                  className="text-label-md inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] px-5 py-3 text-white transition-colors hover:bg-[var(--color-primary-container)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updateMutation.isPending ? (
                    <Loader2 size={16} strokeWidth={1.8} className="animate-spin" />
                  ) : (
                    <Save size={16} strokeWidth={1.8} />
                  )}
                  Guardar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={beginEdit}
                className="text-label-md inline-flex items-center justify-center gap-2 bg-[var(--color-primary-container)] px-5 py-3 text-[var(--color-on-primary-container)] transition-colors hover:bg-[var(--color-primary)] hover:text-white"
              >
                <Pencil size={16} strokeWidth={1.8} />
                Editar configuracion
              </button>
            )}
          </div>
        </section>

        {/* Global query error banner */}
        {isError ? (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-8 border border-[var(--color-error)] bg-[var(--color-error-container)] px-5 py-4 text-[var(--color-error)]"
          >
            <p className="text-body-md">{resolveErrorMessage(queryError)}</p>
          </div>
        ) : null}

        {/* Mutation error banner — shown during edit */}
        {mutationError ? (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-8 border border-[var(--color-error)] bg-[var(--color-error-container)] px-5 py-4 text-[var(--color-error)]"
          >
            <p className="text-body-md">{mutationError}</p>
          </div>
        ) : null}

        {/* Success confirmation */}
        {saveSuccess ? (
          <div
            role="status"
            aria-live="polite"
            className="mb-8 border border-[#2E7D32] bg-[rgba(46,125,50,0.08)] px-5 py-4 text-[#2E7D32]"
          >
            <p className="text-body-md">Configuración de entregas guardada correctamente.</p>
          </div>
        ) : null}

        <section className="mb-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <SummaryCard
            label="Modalidades activas"
            value={`${activeMethods}/3`}
            helpText="Se recomienda tener al menos una activa"
            icon={<PackageCheck size={22} strokeWidth={1.8} className="text-[#2E7D32]" />}
            iconBg="#E8F5E9"
          />
          <SummaryCard
            label="Cobertura principal"
            value={effectiveConfig.mensajeria.ambito}
            helpText={effectiveConfig.entregaPersonal.activa ? effectiveConfig.entregaPersonal.ambito : 'Sin reparto propio'}
            icon={<Truck size={22} strokeWidth={1.8} className="text-[var(--color-primary)]" />}
            iconBg="rgba(122,46,58,0.12)"
          />
          <SummaryCard
            label="Puntos de recogida"
            value={String(effectiveConfig.puntos.length)}
            helpText={effectiveConfig.puntosActiva ? 'Disponibles para clientes' : 'Modalidad desactivada'}
            icon={<MapPin size={22} strokeWidth={1.8} className="text-[#1565C0]" />}
            iconBg="#E3F2FD"
          />
        </section>

        <section className="mb-6 border border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-surface-container-lowest)] p-5 shadow-[0_18px_50px_-35px_rgba(122,46,58,0.35)] md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-label-md mb-1 uppercase tracking-[0.18em] text-[var(--color-outline)]">
                Estado de la pantalla
              </p>
              <p className="text-body-md text-[var(--color-on-surface-variant)]">
                {isEditing
                  ? 'Los campos y toggles estan habilitados. Guarda para confirmar los cambios.'
                  : 'Los campos estan bloqueados hasta pulsar Editar configuracion.'}
              </p>
            </div>
            <span
              className={`text-label-md inline-flex w-fit items-center rounded-full px-4 py-2 ${
                isEditing
                  ? 'bg-[#FFF3E0] text-[#EF6C00]'
                  : 'bg-[rgba(46,125,50,0.12)] text-[#2E7D32]'
              }`}
            >
              {isEditing ? 'Edicion en curso' : 'Solo lectura'}
            </span>
          </div>
        </section>

        <div className="flex flex-col gap-6">
          <DeliveryCard
            icon={<User size={22} strokeWidth={1.8} className="text-[var(--color-primary)]" />}
            title="Entrega personal"
            subtitle="Gestion directa de repartos"
            active={effectiveConfig.entregaPersonal.activa}
            editable={isEditing}
            onToggle={() => updateEntregaPersonal('activa', !effectiveConfig.entregaPersonal.activa)}
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <CardField
                label="Ambito de cobertura"
                value={effectiveConfig.entregaPersonal.ambito}
                onChange={(value) => updateEntregaPersonal('ambito', value)}
                disabled={!isEditing}
              />
              <CardField
                label="Coste del servicio"
                value={effectiveConfig.entregaPersonal.coste}
                onChange={(value) => updateEntregaPersonal('coste', value)}
                disabled={!isEditing}
              />
              <TextAreaField
                label="Notas o condiciones"
                value={effectiveConfig.entregaPersonal.notas}
                onChange={(value) => updateEntregaPersonal('notas', value)}
                disabled={!isEditing}
              />
            </div>
          </DeliveryCard>

          <DeliveryCard
            icon={<Truck size={22} strokeWidth={1.8} className="text-[var(--color-primary)]" />}
            title="Mensajeria"
            subtitle="Envio por agencia externa"
            active={effectiveConfig.mensajeria.activa}
            editable={isEditing}
            onToggle={() => updateMensajeria('activa', !effectiveConfig.mensajeria.activa)}
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <CardField
                label="Empresa de transporte"
                value={effectiveConfig.mensajeria.empresa}
                onChange={(value) => updateMensajeria('empresa', value)}
                disabled={!isEditing}
              />
              <SelectField
                label="Ambito"
                value={effectiveConfig.mensajeria.ambito}
                onChange={(value) => updateMensajeria('ambito', value)}
                disabled={!isEditing}
                options={['Provincial', 'Nacional', 'Internacional']}
              />
              <CardField
                label="Coste base"
                value={effectiveConfig.mensajeria.coste}
                onChange={(value) => updateMensajeria('coste', value)}
                disabled={!isEditing}
              />
            </div>
          </DeliveryCard>

          <DeliveryCard
            icon={<MapPin size={22} strokeWidth={1.8} className="text-[var(--color-primary)]" />}
            title="Punto de recogida"
            subtitle="Recogida local por parte del cliente"
            active={effectiveConfig.puntosActiva}
            editable={isEditing}
            onToggle={() =>
              setDraftConfig((current) => {
                const base = current ?? serverConfig
                return { ...base, puntosActiva: !base.puntosActiva }
              })
            }
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-label-md uppercase tracking-[0.18em] text-[var(--color-outline)]">
                    Puntos activos
                  </p>
                  <p className="text-body-sm text-[var(--color-on-surface-variant)]">
                    Gestiona direcciones y horarios disponibles para recogida local.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!isEditing || !effectiveConfig.puntosActiva}
                  onClick={() => setShowAgregar(true)}
                  className="text-label-md inline-flex w-fit items-center gap-2 border border-[var(--color-outline-variant)] bg-white px-4 py-2 text-[var(--color-primary)] transition-colors hover:border-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus size={16} strokeWidth={1.8} />
                  Anadir punto
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {effectiveConfig.puntos.length === 0 ? (
                  <div className="border border-dashed border-[var(--color-outline-variant)] p-6 text-center text-[var(--color-on-surface-variant)]">
                    No hay puntos de recogida configurados.
                  </div>
                ) : (
                  effectiveConfig.puntos.map((punto) => (
                    <article
                      key={punto.id}
                      className="flex flex-col gap-4 border border-[var(--color-outline-variant)] bg-white/70 p-4 md:flex-row md:items-start md:justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-headline-sm text-[var(--color-on-surface)]">
                            {punto.nombre}
                          </h3>
                          {punto.codigoPostal ? (
                            <span className="text-label-sm rounded-full bg-[rgba(21,101,192,0.1)] px-3 py-1 text-[#1565C0]">
                              {punto.codigoPostal}
                            </span>
                          ) : null}
                        </div>
                        <p className="text-body-md text-[var(--color-on-surface-variant)]">
                          {punto.calle}{punto.municipio ? `, ${punto.municipio}` : ''}
                        </p>
                        <p className="text-label-md text-[var(--color-primary)]">
                          Horario: {punto.horario}
                        </p>
                        {punto.indicaciones ? (
                          <p className="text-body-sm text-[var(--color-secondary)]">
                            {punto.indicaciones}
                          </p>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        aria-label={`Eliminar ${punto.nombre}`}
                        onClick={() => setPuntoAEliminar(punto)}
                        disabled={!isEditing || !effectiveConfig.puntosActiva}
                        className="text-label-md inline-flex items-center gap-2 self-start text-[var(--color-secondary)] transition-colors hover:text-[var(--color-error)] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 size={16} strokeWidth={1.8} />
                        Eliminar
                      </button>
                    </article>
                  ))
                )}
              </div>
            </div>
          </DeliveryCard>
        </div>
      </main>

      {showAgregar && isEditing ? (
        <AgregarPuntoModal onClose={() => setShowAgregar(false)} onConfirm={agregarPunto} />
      ) : null}

      {puntoAEliminar && isEditing ? (
        <EliminarPuntoModal
          nombrePunto={puntoAEliminar.nombre}
          onClose={() => setPuntoAEliminar(null)}
          onConfirm={() => eliminarPunto(puntoAEliminar.id)}
        />
      ) : null}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-components (unchanged UX structure from original page)
// ---------------------------------------------------------------------------

type SummaryCardProps = {
  label: string
  value: string
  helpText: string
  icon: ReactNode
  iconBg: string
}

function SummaryCard({ label, value, helpText, icon, iconBg }: SummaryCardProps) {
  return (
    <div className="flex items-center justify-between rounded-[var(--radius-xl)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-5 md:p-6">
      <div>
        <p className="text-label-md mb-1 uppercase tracking-widest text-[var(--color-secondary)]">
          {label}
        </p>
        <p className="text-headline-lg text-[var(--color-on-surface)]">{value}</p>
        <p className="text-body-sm mt-2 text-[var(--color-on-surface-variant)]">{helpText}</p>
      </div>
      <div className="flex size-12 items-center justify-center rounded-full" style={{ backgroundColor: iconBg }}>
        {icon}
      </div>
    </div>
  )
}

type DeliveryCardProps = {
  active: boolean
  editable: boolean
  onToggle: () => void
  icon: ReactNode
  title: string
  subtitle: string
  children: ReactNode
}

function DeliveryCard({
  active,
  editable,
  onToggle,
  icon,
  title,
  subtitle,
  children,
}: DeliveryCardProps) {
  return (
    <section
      className={`rounded-[var(--radius-xl)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-5 shadow-[0_18px_50px_-35px_rgba(122,46,58,0.35)] transition-opacity md:p-6 ${
        active ? 'opacity-100' : 'opacity-75'
      }`}
    >
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-[rgba(122,46,58,0.12)]">
            {icon}
          </div>
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h2 className="text-headline-sm text-[var(--color-primary)]">{title}</h2>
              <span
                className={`text-label-sm rounded-full px-3 py-1 ${
                  active
                    ? 'bg-[rgba(46,125,50,0.12)] text-[#2E7D32]'
                    : 'bg-[var(--color-surface-container-high)] text-[var(--color-secondary)]'
                }`}
              >
                {active ? 'Activa' : 'Inactiva'}
              </span>
            </div>
            <p className="text-body-md text-[var(--color-on-surface-variant)]">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-label-sm uppercase tracking-[0.18em] text-[var(--color-outline)]">
            Disponible
          </span>
          <Toggle checked={active} onChange={onToggle} disabled={!editable} />
        </div>
      </div>

      {children}
    </section>
  )
}

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean
  onChange: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? 'bg-[var(--color-primary-container)]' : 'bg-[var(--color-surface-container-highest)]'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

function CardField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-label-sm uppercase tracking-widest text-[var(--color-secondary)]">
        {label}
      </span>
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="text-body-md border border-[var(--color-outline-variant)] bg-white px-4 py-3 text-[var(--color-on-surface)] focus:border-[var(--color-primary)] focus:outline-none disabled:cursor-not-allowed disabled:bg-[var(--color-surface-container)] disabled:text-[var(--color-secondary)]"
      />
    </label>
  )
}

function SelectField({
  label,
  value,
  onChange,
  disabled,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  options: string[]
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-label-sm uppercase tracking-widest text-[var(--color-secondary)]">
        {label}
      </span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="text-body-md border border-[var(--color-outline-variant)] bg-white px-4 py-3 text-[var(--color-on-surface)] focus:border-[var(--color-primary)] focus:outline-none disabled:cursor-not-allowed disabled:bg-[var(--color-surface-container)] disabled:text-[var(--color-secondary)]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function TextAreaField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  return (
    <label className="flex flex-col gap-2 md:col-span-2">
      <span className="text-label-sm uppercase tracking-widest text-[var(--color-secondary)]">
        {label}
      </span>
      <textarea
        rows={4}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="text-body-md resize-none border border-[var(--color-outline-variant)] bg-white px-4 py-3 text-[var(--color-on-surface)] focus:border-[var(--color-primary)] focus:outline-none disabled:cursor-not-allowed disabled:bg-[var(--color-surface-container)] disabled:text-[var(--color-secondary)]"
      />
    </label>
  )
}
