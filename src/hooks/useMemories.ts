import { useCallback, useEffect, useState } from 'react'
import { fetchMemories } from '@/services/historyService'
import type { MemoryEntry } from '@/types/domain'

export function useMemories(userId: string | undefined) {
  const [entries, setEntries] = useState<MemoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const reload = useCallback(async () => {
    if (!userId) return
    setIsLoading(true)
    setEntries(await fetchMemories(userId))
    setIsLoading(false)
  }, [userId])

  useEffect(() => {
    void reload()
  }, [reload])

  return { entries, isLoading, reload }
}
