import { useEffect, useState } from 'react'
import { fetchPrimaryUserProfile } from '@/services/profileService'
import type { Profile } from '@/types/domain'

/** A única usuária (role = 'user') deste app de duas pessoas. */
export function usePrimaryUser() {
  const [primaryUser, setPrimaryUser] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true
    fetchPrimaryUserProfile().then((profile) => {
      if (!isActive) return
      setPrimaryUser(profile)
      setIsLoading(false)
    })
    return () => {
      isActive = false
    }
  }, [])

  return { primaryUser, isLoading }
}
