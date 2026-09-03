import { useEffect, useState } from 'react'
import { fetchRedemptionCountsByTreat } from '@/services/redemptionService'

export function useRedemptionCounts(userId: string | undefined) {
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    if (!userId) return
    let isActive = true
    fetchRedemptionCountsByTreat(userId).then((result) => {
      if (isActive) setCounts(result)
    })
    return () => {
      isActive = false
    }
  }, [userId])

  return counts
}
