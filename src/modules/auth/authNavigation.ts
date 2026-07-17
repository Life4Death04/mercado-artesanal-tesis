import type { BackendRole } from './auth.types'

export function homePathForRole(role: BackendRole | undefined): string {
  if (role === 'ADMIN') return '/admin'
  if (role === 'PRODUCER') return '/productor/pedidos'
  if (role === 'CONSUMER') return '/productos'
  return '/registro'
}
