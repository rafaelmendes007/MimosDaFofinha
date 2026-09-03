import { useCallback, useEffect, useState } from 'react'
import { fetchCreditBalance } from '@/services/creditService'

export function useCreditBalance(userId: string | undefined) {
  const [balance, setBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const reload = useCallback(async () => {
    if (!userId) return
    setIsLoading(true)
    setBalance(await fetchCreditBalance(userId))
    setIsLoading(false)
  }, [userId])

  useEffect(() => {
    void reload()
  }, [reload])

  return { balance, isLoading, reload }
}
