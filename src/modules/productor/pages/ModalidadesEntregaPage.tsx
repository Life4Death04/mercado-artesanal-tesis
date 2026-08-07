import { type ReactNode, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ZodError } from 'zod'
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
import { useCreateEntregaMutation } from '../entregas/hooks/useCreateEntregaMutation'
import { useDeleteEntregaMutation } from '../entregas/hooks/useDeleteEntregaMutation'
import { useUpdateEntregasMutation } from '../entregas/hooks/useUpdateEntregasMutation'
import { resolveErrorMessage } from '../../../lib/errorMessages'
import {
  createDeliveryModePayloadSchema,
  updateDeliveryModePayloadSchema,
  type CreateDeliveryModePayload,
  type DeliveryModeDTO,
  type UpdateDeliveryModePayload,
} from '../entregas/entregas.schema'

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
  notas: string
}

type PuntoRecogidaState = PuntoRecogida & { coste: string }

type DraftConfig = {
  entregaPersonal: EntregaPersonalState
  mensajeria: MensajeriaState
  puntosActiva: boolean
  puntos: PuntoRecogidaState[]
}

// ---------------------------------------------------------------------------
// Helpers — map backend DTOs to local display shapes
// ---------------------------------------------------------------------------

const EMPTY_ENTREGA_PERSONAL: EntregaPersonalState = {
  id: null,
  activa: false,
  ambito: '',
  coste: '0,00',
  notas: '',
}

const EMPTY_MENSAJERIA: MensajeriaState = {
  id: null,
  activa: false,
  empresa: '',
  ambito: 'Nacional',
  coste: '0,00',
  notas: '',
}

class InvalidDeliveryCostError extends Error {}

type DeliveryModeOperation =
  | { kind: 'create'; payload: CreateDeliveryModePayload }
  | { kind: 'update'; id: string; payload: UpdateDeliveryModePayload }
  | { kind: 'delete'; id: string }

function parseDeliveryCost(value: string): number {
  const normalized = value.trim().replace(',', '.')
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    throw new InvalidDeliveryCostError('El coste debe ser cero o un número positivo con hasta 2 decimales.')
  }

  const cost = Number(normalized)
  if (!Number.isFinite(cost) || cost > 99_999_999.99) {
    throw new InvalidDeliveryCostError('El coste indicado está fuera del rango permitido.')
  }

  return cost
}

/**
 * Maps the backend delivery mode list to the local DraftConfig shape.
 *
 * The dedicated cards use the first personal-delivery and carrier-shipping
 * row. Every PICKUP row remains independently editable in the pickup list.
 */
function mapDtosToConfig(modes: DeliveryModeDTO[]): DraftConfig {
  const personal = modes.find((m) => m.type === 'PERSONAL_DELIVERY')
  const shipping = modes.find((m) => m.type === 'SHIPPING_FLAT_RATE')

  const entregaPersonal: EntregaPersonalState = personal
    ? {
        id: personal.id,
        activa: personal.isActive,
        ambito: personal.coverageZone ?? '',
        coste: personal.cost.replace('.', ','),
        notas: personal.notes ?? '',
      }
    : EMPTY_ENTREGA_PERSONAL

  const mensajeria: MensajeriaState = shipping
    ? {
        id: shipping.id,
        activa: shipping.isActive,
        empresa: shipping.carrierCompany ?? '',
        ambito: shipping.coverageZone ?? 'Nacional',
        coste: shipping.cost.replace('.', ','),
        notas: shipping.notes ?? '',
      }
    : EMPTY_MENSAJERIA

  // Each PICKUP row is one independently persisted pickup point.
  const puntos: PuntoRecogidaState[] = modes
    .filter((m) => m.type === 'PICKUP')
    .map((m) => ({
      id: m.id,
      nombre: m.pickupLocationName ?? 'Punto sin nombre',
      calle: m.pickupStreet ?? m.pickupLocation ?? '',
      municipio: m.pickupMunicipality ?? '',
      codigoPostal: m.pickupPostalCode ?? '',
      horario: m.pickupOpeningHours ?? '',
      indicaciones: m.notes ?? undefined,
      coste: m.cost,
    }))

  return {
    entregaPersonal,
    mensajeria,
    puntosActiva: modes.some((mode) => mode.type === 'PICKUP' && mode.isActive),
    puntos,
  }
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export function ModalidadesEntregaPage() {
  const {
    data: modes = [],
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useEntregasQuery()
  const createMutation = useCreateEntregaMutation()
  const deleteMutation = useDeleteEntregaMutation()
  const updateMutation = useUpdateEntregasMutation()

  // Derive initial config from server data
  const serverConfig = mapDtosToConfig(modes)

  const [draftConfig, setDraftConfig] = useState<DraftConfig | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showAgregar, setShowAgregar] = useState(false)
  const [puntoAEliminar, setPuntoAEliminar] = useState<PuntoRecogida | null>(null)
  const [mutationError, setMutationError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const saveInFlightRef = useRef(false)

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
    createMutation.reset()
    updateMutation.reset()
    deleteMutation.reset()
    setIsEditing(false)
  }

  async function saveChanges() {
    if (!draftConfig || saveInFlightRef.current) return
    saveInFlightRef.current = true
    setIsSaving(true)
    setMutationError(null)
    let completedRequestCount = 0
    let requestStarted = false

    try {
      const operations: DeliveryModeOperation[] = []
      const personal = draftConfig.entregaPersonal
      const shipping = draftConfig.mensajeria

      if (personal.id) {
        operations.push({
          kind: 'update',
          id: personal.id,
          payload: updateDeliveryModePayloadSchema.parse({
            cost: parseDeliveryCost(personal.coste),
            coverageZone: personal.ambito || null,
            notes: personal.notas || null,
            isActive: personal.activa,
          }),
        })
      } else if (personal.activa) {
        operations.push({
          kind: 'create',
          payload: createDeliveryModePayloadSchema.parse({
            type: 'PERSONAL_DELIVERY',
            cost: parseDeliveryCost(personal.coste),
            ...(personal.ambito && { coverageZone: personal.ambito }),
            ...(personal.notas && { notes: personal.notas }),
          }),
        })
      }

      if (shipping.id) {
        operations.push({
          kind: 'update',
          id: shipping.id,
          payload: updateDeliveryModePayloadSchema.parse({
            cost: parseDeliveryCost(shipping.coste),
            coverageZone: shipping.ambito || null,
            carrierCompany: shipping.empresa || null,
            notes: shipping.notas || null,
            isActive: shipping.activa,
          }),
        })
      } else if (shipping.activa) {
        operations.push({
          kind: 'create',
          payload: createDeliveryModePayloadSchema.parse({
            type: 'SHIPPING_FLAT_RATE',
            cost: parseDeliveryCost(shipping.coste),
            ...(shipping.ambito && { coverageZone: shipping.ambito }),
            ...(shipping.empresa && { carrierCompany: shipping.empresa }),
            ...(shipping.notas && { notes: shipping.notas }),
          }),
        })
      }

      const draftPointIds = new Set(draftConfig.puntos.map((point) => point.id))
      const removedPointIds = modes
        .filter((mode) => mode.type === 'PICKUP' && !draftPointIds.has(mode.id))
        .map((mode) => mode.id)
      for (const id of removedPointIds) {
        operations.push({ kind: 'delete', id })
      }

      for (const point of draftConfig.puntos) {
        if (point.id.startsWith('local-')) {
          if (!draftConfig.puntosActiva) continue
          operations.push({
            kind: 'create',
            payload: createDeliveryModePayloadSchema.parse({
              type: 'PICKUP',
              cost: parseDeliveryCost(point.coste),
              pickupLocationName: point.nombre,
              pickupStreet: point.calle,
              pickupMunicipality: point.municipio,
              pickupPostalCode: point.codigoPostal,
              pickupOpeningHours: point.horario,
              ...(point.indicaciones && { notes: point.indicaciones }),
            }),
          })
        } else {
          operations.push({
            kind: 'update',
            id: point.id,
            payload: updateDeliveryModePayloadSchema.parse({
              cost: parseDeliveryCost(point.coste),
              pickupLocationName: point.nombre || null,
              pickupStreet: point.calle || null,
              pickupMunicipality: point.municipio || null,
              pickupPostalCode: point.codigoPostal || null,
              pickupOpeningHours: point.horario || null,
              notes: point.indicaciones || null,
              isActive: draftConfig.puntosActiva,
            }),
          })
        }
      }

      for (const operation of operations) {
        requestStarted = true
        if (operation.kind === 'create') {
          await createMutation.mutateAsync(operation.payload)
        } else if (operation.kind === 'update') {
          await updateMutation.mutateAsync({ id: operation.id, payload: operation.payload })
        } else {
          await deleteMutation.mutateAsync(operation.id)
        }
        completedRequestCount += 1
      }

      setSaveSuccess(true)
      setIsEditing(false)
      setDraftConfig(null)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: unknown) {
      const message = err instanceof InvalidDeliveryCostError
        ? err.message
        : err instanceof ZodError
          ? (err.issues[0]?.message ?? 'Revisa los datos de las modalidades de entrega.')
          : resolveErrorMessage(err)
      setMutationError(message)

      if (requestStarted) {
        const refreshResult = await refetch()
        if (completedRequestCount > 0) {
          setMutationError(
            refreshResult.isError
              ? `${message} Algunos cambios sí pudieron guardarse y no se pudo recargar el estado del servidor.`
              : `${message} Algunos cambios sí pudieron guardarse. Se ha recargado el estado confirmado por el servidor.`,
          )
        }
        setDraftConfig(null)
        setIsEditing(false)
      }
    } finally {
      saveInFlightRef.current = false
      setIsSaving(false)
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
        puntos: [...base.puntos, { ...datos, id: `local-${Date.now()}`, coste: '0,00' }],
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
                  disabled={isSaving}
                  className="text-label-md inline-flex items-center justify-center gap-2 border border-[var(--color-outline-variant)] bg-white px-5 py-3 text-[var(--color-secondary)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X size={16} strokeWidth={1.8} />
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => { void saveChanges() }}
                  disabled={isSaving}
                  className="text-label-md inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] px-5 py-3 text-white transition-colors hover:bg-[var(--color-primary-container)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? (
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
            editable={isEditing && !isSaving}
            onToggle={() => updateEntregaPersonal('activa', !effectiveConfig.entregaPersonal.activa)}
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <CardField
                label="Ambito de cobertura"
                value={effectiveConfig.entregaPersonal.ambito}
                onChange={(value) => updateEntregaPersonal('ambito', value)}
                disabled={!isEditing || isSaving}
                maxLength={255}
              />
              <CardField
                label="Coste del servicio"
                value={effectiveConfig.entregaPersonal.coste}
                onChange={(value) => updateEntregaPersonal('coste', value)}
                disabled={!isEditing || isSaving}
              />
              <TextAreaField
                label="Notas o condiciones"
                value={effectiveConfig.entregaPersonal.notas}
                onChange={(value) => updateEntregaPersonal('notas', value)}
                disabled={!isEditing || isSaving}
              />
            </div>
          </DeliveryCard>

          <DeliveryCard
            icon={<Truck size={22} strokeWidth={1.8} className="text-[var(--color-primary)]" />}
            title="Mensajeria"
            subtitle="Envio por agencia externa"
            active={effectiveConfig.mensajeria.activa}
            editable={isEditing && !isSaving}
            onToggle={() => updateMensajeria('activa', !effectiveConfig.mensajeria.activa)}
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <CardField
                label="Empresa de transporte"
                value={effectiveConfig.mensajeria.empresa}
                onChange={(value) => updateMensajeria('empresa', value)}
                disabled={!isEditing || isSaving}
                maxLength={120}
              />
              <SelectField
                label="Ambito"
                value={effectiveConfig.mensajeria.ambito}
                onChange={(value) => updateMensajeria('ambito', value)}
                disabled={!isEditing || isSaving}
                options={['Provincial', 'Nacional', 'Internacional']}
              />
              <CardField
                label="Coste base"
                value={effectiveConfig.mensajeria.coste}
                onChange={(value) => updateMensajeria('coste', value)}
                disabled={!isEditing || isSaving}
              />
              <TextAreaField
                label="Notas o instrucciones"
                value={effectiveConfig.mensajeria.notas}
                onChange={(value) => updateMensajeria('notas', value)}
                disabled={!isEditing || isSaving}
              />
            </div>
          </DeliveryCard>

          <DeliveryCard
            icon={<MapPin size={22} strokeWidth={1.8} className="text-[var(--color-primary)]" />}
            title="Punto de recogida"
            subtitle="Recogida local por parte del cliente"
            active={effectiveConfig.puntosActiva}
            editable={isEditing && !isSaving}
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
                  disabled={!isEditing || isSaving || !effectiveConfig.puntosActiva}
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
                        disabled={!isEditing || isSaving || !effectiveConfig.puntosActiva}
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

      {showAgregar && isEditing && !isSaving ? (
        <AgregarPuntoModal onClose={() => setShowAgregar(false)} onConfirm={agregarPunto} />
      ) : null}

      {puntoAEliminar && isEditing && !isSaving ? (
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
  maxLength,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  maxLength?: number
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
        maxLength={maxLength}
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
        maxLength={1000}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="text-body-md resize-none border border-[var(--color-outline-variant)] bg-white px-4 py-3 text-[var(--color-on-surface)] focus:border-[var(--color-primary)] focus:outline-none disabled:cursor-not-allowed disabled:bg-[var(--color-surface-container)] disabled:text-[var(--color-secondary)]"
      />
    </label>
  )
}
