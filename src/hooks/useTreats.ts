import { useEffect, useState } from 'react'
import { fetchActiveTreats } from '@/services/treatService'
import type { Treat } from '@/types/domain'

export function useTreats() {
  const [treats, setTreats] = useState<Treat[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true
    fetchActiveTreats().then((result) => {
      if (!isActive) return
      setTreats(result)
      setIsLoading(false)
    })
    return () => {
      isActive = false
    }
  }, [])

  return { treats, isLoading }
}
