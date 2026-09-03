import { useCallback, useEffect, useState } from 'react'
import { fetchRedemptionCountsByTreat } from '@/services/redemptionService'

export function useRedemptionCounts(userId: string | undefined) {
  const [counts, setCounts] = useState<Record<string, number>>({})

  const reload = useCallback(async () => {
    if (!userId) return
    setCounts(await fetchRedemptionCountsByTreat(userId))
  }, [userId])

  useEffect(() => {
    void reload()
  }, [reload])

  /** Soma otimista, usada logo após um resgate confirmado pelo servidor. */
  const increment = useCallback((treatId: string) => {
    setCounts((current) => ({ ...current, [treatId]: (current[treatId] ?? 0) + 1 }))
  }, [])

  return { counts, reload, increment }
}
