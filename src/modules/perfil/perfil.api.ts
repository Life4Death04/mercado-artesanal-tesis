import { currentUserSchema } from '../auth/auth.schema'
import type { CurrentUser } from '../auth/auth.types'
import type { ProfileFormValues } from './perfil.schema'

type ApiCaller = <TResponse>(
  path: string,
  options?: { method?: string; body?: unknown; signal?: AbortSignal },
) => Promise<TResponse>

export async function updateProfile(api: ApiCaller, input: ProfileFormValues): Promise<CurrentUser> {
  const response = await api<unknown>('/users/me', { method: 'PATCH', body: input })
  return currentUserSchema.parse(response)
}
