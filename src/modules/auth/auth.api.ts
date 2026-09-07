import { apiRequest } from '../../lib/api'
import { currentUserSchema } from './auth.schema'
import type { BackendUser, CurrentUser } from './auth.types'

export async function syncAuthenticatedUser(accessToken: string): Promise<BackendUser> {
  return apiRequest<BackendUser>('/auth/sync', {
    method: 'POST',
    accessToken,
  })
}

export async function getCurrentUser(accessToken: string): Promise<CurrentUser> {
  return currentUserSchema.parse(
    await apiRequest<unknown>('/users/me', {
      accessToken,
    }),
  )
}
