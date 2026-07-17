import { apiRequest } from '../../lib/api'
import type { BackendUser, CurrentUser } from './auth.types'

export async function syncAuthenticatedUser(accessToken: string): Promise<BackendUser> {
  return apiRequest<BackendUser>('/auth/sync', {
    method: 'POST',
    accessToken,
  })
}

export async function getCurrentUser(accessToken: string): Promise<CurrentUser> {
  return apiRequest<CurrentUser>('/users/me', {
    accessToken,
  })
}
