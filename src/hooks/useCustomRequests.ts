import { useCallback, useEffect, useState } from 'react'
import { fetchMyCustomRequests } from '@/services/requestService'
import type { CustomRequest } from '@/types/domain'

export function useCustomRequests(userId: string | undefined) {
  const [requests, setRequests] = useState<CustomRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const reload = useCallback(async () => {
    if (!userId) return
    setIsLoading(true)
    setRequests(await fetchMyCustomRequests(userId))
    setIsLoading(false)
  }, [userId])

  useEffect(() => {
    void reload()
  }, [reload])

  return { requests, isLoading, reload }
}
