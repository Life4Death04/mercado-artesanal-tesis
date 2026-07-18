import { apiRequest } from '../../../lib/api'
import { UserRoleSchema } from './profile.schema'
import type { AuthenticatedProducerProfile, ProducerProfileFormValues, UserMeResponse } from './profile.schema'

// ---------------------------------------------------------------------------
// Endpoint constants
// ---------------------------------------------------------------------------

export const producerProfileEndpoints = {
  getMe: '/users/me',
  patchMe: '/producers/me',
} as const

// ---------------------------------------------------------------------------
// API functions — called exclusively by hook layer; not by page components
// ---------------------------------------------------------------------------

/**
 * Fetches the current authenticated user with embedded producer profile.
 * Endpoint: GET /api/v1/users/me
 *
 * Edge-parses User.role to guard against unknown enum values.
 */
export async function getUserMe(accessToken: string): Promise<UserMeResponse> {
  const raw = await apiRequest<UserMeResponse>(producerProfileEndpoints.getMe, { accessToken })

  // Edge-parse the control-flow enum; rejects at Zod if backend sends an unknown role.
  UserRoleSchema.parse(raw.role)

  return raw
}

/**
 * Updates the authenticated producer's profile.
 * Endpoint: PATCH /producers/me
 *
 * Only sends keys present in the form values (partial PATCH).
 * Backend enforces .strict() — unknown keys → VALIDATION_FAILED (400).
 */
export async function patchProducerMe(
  accessToken: string,
  body: ProducerProfileFormValues,
): Promise<AuthenticatedProducerProfile> {
  return apiRequest<AuthenticatedProducerProfile>(producerProfileEndpoints.patchMe, {
    method: 'PATCH',
    accessToken,
    body,
  })
}
