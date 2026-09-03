import { useCallback, useEffect, useState } from 'react'
import { fetchAllCustomRequests } from '@/services/requestService'
import type { CustomRequest } from '@/types/domain'

export function useAdminRequests() {
  const [requests, setRequests] = useState<CustomRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const reload = useCallback(async () => {
    setIsLoading(true)
    setRequests(await fetchAllCustomRequests())
    setIsLoading(false)
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  return { requests, isLoading, reload }
}
