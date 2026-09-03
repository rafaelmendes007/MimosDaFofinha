import { useCallback, useEffect, useState } from 'react'
import { fetchCreditHistory } from '@/services/creditService'
import type { CreditTransaction } from '@/types/domain'

export function useCreditHistory(userId: string | undefined) {
  const [transactions, setTransactions] = useState<CreditTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const reload = useCallback(async () => {
    if (!userId) return
    setIsLoading(true)
    setTransactions(await fetchCreditHistory(userId))
    setIsLoading(false)
  }, [userId])

  useEffect(() => {
    void reload()
  }, [reload])

  return { transactions, isLoading, reload }
}
