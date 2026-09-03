import { useCallback, useEffect, useState } from 'react'
import { fetchAllTreats } from '@/services/treatService'
import type { Treat } from '@/types/domain'

export function useAdminTreats() {
  const [treats, setTreats] = useState<Treat[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const reload = useCallback(async () => {
    setIsLoading(true)
    setTreats(await fetchAllTreats())
    setIsLoading(false)
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  return { treats, isLoading, reload }
}
