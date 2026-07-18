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
// Authenticated caller type — matches the return type of useAuthenticatedApi()
// ---------------------------------------------------------------------------

type ApiCaller = <TResponse>(path: string, options?: { method?: string; body?: unknown }) => Promise<TResponse>

// ---------------------------------------------------------------------------
// API functions — called exclusively by hook layer; not by page components
// ---------------------------------------------------------------------------

/**
 * Fetches the current authenticated user with embedded producer profile.
 * Endpoint: GET /api/v1/users/me
 *
 * Edge-parses User.role to guard against unknown enum values.
 * Receives an authenticated caller from useAuthenticatedApi() — no raw token.
 */
export async function getUserMe(apiCaller: ApiCaller): Promise<UserMeResponse> {
  const raw = await apiCaller<UserMeResponse>(producerProfileEndpoints.getMe)

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
 * Receives an authenticated caller from useAuthenticatedApi() — no raw token.
 */
export async function patchProducerMe(
  apiCaller: ApiCaller,
  body: ProducerProfileFormValues,
): Promise<AuthenticatedProducerProfile> {
  return apiCaller<AuthenticatedProducerProfile>(producerProfileEndpoints.patchMe, {
    method: 'PATCH',
    body,
  })
}
