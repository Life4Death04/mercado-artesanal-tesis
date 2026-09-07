import { useState } from 'react'
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../../auth/hooks/useAuthenticatedApi'
import { createAdminBackup, getAdminBackupOperation } from '../backups.api'
import { adminBackupKeys } from '../backups.queryKeys'
import { readRecentBackupOperationIds, writeRecentBackupOperationIds } from '../backups.storage'
import type { CreateBackupInput } from '../backups.schema'

const POLLING_INTERVAL_MS = 2_000

export function useRecentBackupOperationIds() {
  const [operationIds, setOperationIds] = useState(readRecentBackupOperationIds)

  function addOperationId(operationId: string) {
    setOperationIds((currentIds) => {
      const nextIds = [operationId, ...currentIds.filter((id) => id !== operationId)]
      writeRecentBackupOperationIds(nextIds)
      return nextIds.slice(0, 20)
    })
  }

  function removeOperationId(operationId: string) {
    setOperationIds((currentIds) => {
      const nextIds = currentIds.filter((id) => id !== operationId)
      writeRecentBackupOperationIds(nextIds)
      return nextIds
    })
  }

  return { operationIds, addOperationId, removeOperationId }
}

export function useCreateAdminBackupMutation() {
  const api = useAuthenticatedApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateBackupInput) => createAdminBackup(api, input),
    onSuccess: (operation) => {
      queryClient.setQueryData(adminBackupKeys.operation(operation.id), operation)
    },
  })
}

export function useAdminBackupOperationQueries(operationIds: string[]) {
  const api = useAuthenticatedApi()

  return useQueries({
    queries: operationIds.map((operationId) => ({
      queryKey: adminBackupKeys.operation(operationId),
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        getAdminBackupOperation(api, operationId, signal),
      retry: false,
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchInterval: (query: { state: { data?: { status?: string }; status?: string } }) => {
        if (query.state.status === 'error') return false

        const status = query.state.data?.status
        return status === 'SUCCEEDED' || status === 'FAILED' ? false : POLLING_INTERVAL_MS
      },
    })),
  })
}
