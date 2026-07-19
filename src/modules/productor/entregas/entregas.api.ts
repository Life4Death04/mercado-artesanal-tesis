import { DeliveryModeTypeSchema } from './entregas.schema'
import type { DeliveryModeDTO, UpdateDeliveryModePayload } from './entregas.schema'

// ---------------------------------------------------------------------------
// Endpoint constants
// [source: mercado-artesanal-backend/openspec/specs/delivery-modes/spec.md]
// ---------------------------------------------------------------------------

export const entregasEndpoints = {
  /** GET /producers/me/delivery-modes — list all delivery modes for the producer. */
  list: '/producers/me/delivery-modes',
  /** PATCH /producers/me/delivery-modes/:id — partial update of one delivery mode. */
  update: (id: string) => `/producers/me/delivery-modes/${id}`,
} as const

// ---------------------------------------------------------------------------
// Authenticated caller type — matches the return type of useAuthenticatedApi()
// ---------------------------------------------------------------------------

type ApiCaller = <TResponse>(path: string, options?: { method?: string; body?: unknown }) => Promise<TResponse>

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Edge-parses the type field on a raw delivery mode response.
 * Guards control-flow branches against unknown DeliveryModeType values.
 * Spec: producer-api-client R6 (response validation at the edge for control-flow enums).
 * Fails closed: unknown type → ZodError → surfaces as ApiError-like through hook.
 */
function parseDeliveryModeType(raw: DeliveryModeDTO): DeliveryModeDTO {
  DeliveryModeTypeSchema.parse(raw.type)
  return raw
}

// ---------------------------------------------------------------------------
// Delivery mode API functions — called exclusively by hook layer (spec R5)
// ---------------------------------------------------------------------------

/**
 * Lists all delivery modes configured for the authenticated producer.
 *
 * Edge-parses the DeliveryModeType enum on each item so that unknown values
 * from a future backend migration surface as errors rather than silent wrong display.
 *
 * Endpoint: GET /api/v1/producers/me/delivery-modes
 */
export async function listEntregas(apiCaller: ApiCaller): Promise<DeliveryModeDTO[]> {
  const raw = await apiCaller<DeliveryModeDTO[]>(entregasEndpoints.list)
  return raw.map(parseDeliveryModeType)
}

/**
 * Partially updates a delivery mode for the authenticated producer.
 *
 * Backend validates through UpdateDeliveryModeSchema (Zod partial strict);
 * unknown keys → VALIDATION_FAILED. Returns the updated DeliveryModeDTO.
 *
 * Note on flatRate: backend expects a Decimal-compatible string (e.g. "5.50").
 * The form normalises comma separators to dots before calling this function.
 *
 * Endpoint: PATCH /api/v1/producers/me/delivery-modes/:id
 */
export async function updateEntrega(
  apiCaller: ApiCaller,
  id: string,
  payload: UpdateDeliveryModePayload,
): Promise<DeliveryModeDTO> {
  const sanitisedPayload: UpdateDeliveryModePayload = { ...payload }

  // Normalise decimal separator: "5,50" → "5.50" for Prisma Decimal compatibility.
  if (typeof sanitisedPayload.flatRate === 'string') {
    sanitisedPayload.flatRate = sanitisedPayload.flatRate.replace(',', '.')
  }

  const raw = await apiCaller<DeliveryModeDTO>(entregasEndpoints.update(id), {
    method: 'PATCH',
    body: sanitisedPayload,
  })

  return parseDeliveryModeType(raw)
}
