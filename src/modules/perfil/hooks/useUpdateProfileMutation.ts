import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CurrentUser } from '../../auth/auth.types'
import { useAuthenticatedApi } from '../../auth/hooks/useAuthenticatedApi'
import { CURRENT_USER_QUERY_KEY } from '../../auth/hooks/useCurrentUser'
import { updateProfile } from '../perfil.api'

export function useUpdateProfileMutation() {
  const api = useAuthenticatedApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: Parameters<typeof updateProfile>[1]) => updateProfile(api, input),
    onSuccess: async (user) => {
      queryClient.setQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY, user)
      await queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY })
    },
  })
}
