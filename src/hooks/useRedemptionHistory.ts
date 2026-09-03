import { useCallback, useEffect, useState } from 'react'
import { fetchRedemptionHistory } from '@/services/historyService'
import type { RedemptionWithTreat } from '@/types/domain'

export function useRedemptionHistory(userId: string | undefined) {
  const [entries, setEntries] = useState<RedemptionWithTreat[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const reload = useCallback(async () => {
    if (!userId) return
    setIsLoading(true)
    setEntries(await fetchRedemptionHistory(userId))
    setIsLoading(false)
  }, [userId])

  useEffect(() => {
    void reload()
  }, [reload])

  return { entries, isLoading, reload }
}
