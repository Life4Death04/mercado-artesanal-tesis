import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useAuthenticatedApi } from '../../auth/hooks/useAuthenticatedApi'
import { getPaymentStatus } from '../pagos.api'
import { paymentStatusKeys } from '../paymentStatus.queryKeys'

const POLL_AT_MS = [1_000, 3_000, 7_000, 11_000, 15_000, 19_000, 23_000, 27_000, 31_000] as const

export function usePaymentStatusQuery(paymentIntentId: string | null) {
  const { isAuthenticated, isLoading } = useAuth0()
  const api = useAuthenticatedApi()
  const [timedOutPaymentIntentId, setTimedOutPaymentIntentId] = useState<string | null>(null)
  const [isManualRetryPending, setIsManualRetryPending] = useState(false)
  const [isScheduledRefetchPending, setIsScheduledRefetchPending] = useState(false)
  const startedAtRef = useRef(new Map<string, number>())
  const nextDelayIndexRef = useRef(new Map<string, number>())
  const retryInFlightRef = useRef(false)

  const query = useQuery({
    queryKey: paymentStatusKeys.detail(paymentIntentId ?? 'missing'),
    enabled: paymentIntentId !== null && isAuthenticated && !isLoading,
    retry: false,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    queryFn: ({ signal }) => getPaymentStatus(api, paymentIntentId!, signal),
  })
  const { data, isError, isFetching, isSuccess, refetch } = query

  const hasTimedOut = timedOutPaymentIntentId === paymentIntentId
  const statusState = data?.state

  useEffect(() => {
    if (
      !paymentIntentId ||
      statusState !== 'PROCESSING' ||
      hasTimedOut ||
      isManualRetryPending ||
      isScheduledRefetchPending ||
      retryInFlightRef.current ||
      !isAuthenticated ||
      isLoading ||
      !isSuccess ||
      isError ||
      isFetching
    ) return undefined

    const startedAt = startedAtRef.current.get(paymentIntentId) ?? Date.now()
    startedAtRef.current.set(paymentIntentId, startedAt)
    const nextDelayIndex = nextDelayIndexRef.current.get(paymentIntentId) ?? 0
    const pollAt = POLL_AT_MS[nextDelayIndex]

    if (pollAt === undefined) {
      const timeout = window.setTimeout(() => setTimedOutPaymentIntentId(paymentIntentId), 0)
      return () => window.clearTimeout(timeout)
    }

    const delay = Math.max(pollAt - (Date.now() - startedAt), 0)
    const timeout = window.setTimeout(() => {
      nextDelayIndexRef.current.set(paymentIntentId, nextDelayIndex + 1)
      retryInFlightRef.current = true
      setIsScheduledRefetchPending(true)
      void refetch({ cancelRefetch: false }).finally(() => {
        retryInFlightRef.current = false
        setIsScheduledRefetchPending(false)
      })
    }, delay)
    return () => window.clearTimeout(timeout)
  }, [hasTimedOut, isAuthenticated, isLoading, isManualRetryPending, isScheduledRefetchPending, paymentIntentId, isError, isFetching, isSuccess, refetch, statusState])

  function retryStatus() {
    if (!paymentIntentId || !isAuthenticated || isLoading || isFetching || retryInFlightRef.current) return undefined

    retryInFlightRef.current = true
    startedAtRef.current.delete(paymentIntentId)
    nextDelayIndexRef.current.delete(paymentIntentId)
    setTimedOutPaymentIntentId(null)
    setIsManualRetryPending(true)

    return refetch({ cancelRefetch: false }).finally(() => {
      retryInFlightRef.current = false
      setIsManualRetryPending(false)
    })
  }

  return { ...query, hasTimedOut, isManualRetryPending, retryStatus }
}
