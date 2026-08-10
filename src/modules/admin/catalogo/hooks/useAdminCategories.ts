import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../../auth/hooks/useAuthenticatedApi'
import {
  createAdminCategory,
  deactivateAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from '../categorias.api'
import { adminCategoryKeys } from '../categorias.queryKeys'
import type {
  CreateAdminCategoryInput,
  UpdateAdminCategoryInput,
} from '../categorias.schema'

export function useAdminCategoriesQuery() {
  const api = useAuthenticatedApi()

  return useQuery({
    queryKey: adminCategoryKeys.list(),
    queryFn: ({ signal }) => getAdminCategories(api, signal),
    retry: false,
    refetchOnWindowFocus: false,
  })
}

function useInvalidateCategoryQueries() {
  const queryClient = useQueryClient()

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: adminCategoryKeys.all }),
      queryClient.invalidateQueries({ queryKey: adminCategoryKeys.publicTaxonomy }),
    ])
}

export function useCreateAdminCategoryMutation() {
  const api = useAuthenticatedApi()
  const invalidateCategories = useInvalidateCategoryQueries()

  return useMutation({
    mutationFn: (input: CreateAdminCategoryInput) => createAdminCategory(api, input),
    onSuccess: invalidateCategories,
  })
}

export function useUpdateAdminCategoryMutation() {
  const api = useAuthenticatedApi()
  const invalidateCategories = useInvalidateCategoryQueries()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAdminCategoryInput }) =>
      updateAdminCategory(api, id, input),
    onSuccess: invalidateCategories,
  })
}

export function useDeactivateAdminCategoryMutation() {
  const api = useAuthenticatedApi()
  const invalidateCategories = useInvalidateCategoryQueries()

  return useMutation({
    mutationFn: (categoryId: string) => deactivateAdminCategory(api, categoryId),
    onSuccess: invalidateCategories,
  })
}
