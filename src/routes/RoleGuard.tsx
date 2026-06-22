import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

type Role = 'consumidor' | 'productor' | 'administrador'

type RoleGuardProps = {
  allowedRoles: Role[]
  currentRole?: Role
  children: ReactNode
}

export function RoleGuard({ allowedRoles, currentRole = 'consumidor', children }: RoleGuardProps) {
  if (!allowedRoles.includes(currentRole)) {
    return <Navigate to="/" replace />
  }

  return children
}
