import { useAuth0 } from '@auth0/auth0-react'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { clearAuthenticatedCache } from '../authSessionCache'

export function AuthSessionCacheGuard() {
  const { isAuthenticated, isLoading, user } = useAuth0()
  const queryClient = useQueryClient()
  const hasInitialized = useRef(false)
  const wasAuthenticated = useRef(false)
  const previousIdentity = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (isLoading) return

    if (!hasInitialized.current) {
      hasInitialized.current = true
      wasAuthenticated.current = isAuthenticated
      previousIdentity.current = user?.sub
      return
    }

    const identityChanged =
      isAuthenticated &&
      previousIdentity.current !== undefined &&
      user?.sub !== undefined &&
      previousIdentity.current !== user.sub

    if ((!isAuthenticated && wasAuthenticated.current) || identityChanged) {
      clearAuthenticatedCache(queryClient)
    }

    wasAuthenticated.current = isAuthenticated
    if (user?.sub !== undefined) previousIdentity.current = user.sub
  }, [isAuthenticated, isLoading, queryClient, user?.sub])

  return null
}
