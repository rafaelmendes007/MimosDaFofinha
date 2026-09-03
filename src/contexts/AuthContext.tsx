import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { signInWithPassword, signOut as signOutRequest } from '@/services/authService'
import { fetchProfile } from '@/services/profileService'
import { translateAuthError } from '@/utils/authErrors'
import type { Profile } from '@/types/domain'

interface AuthContextValue {
  session: Session | null
  profile: Profile | null
  isLoading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadProfile(userId: string) {
      const result = await fetchProfile(userId)
      if (isMounted) setProfile(result)
    }

    supabase.auth
      .getSession()
      .then(async ({ data }) => {
        if (!isMounted) return
        setSession(data.session)
        if (data.session) {
          await loadProfile(data.session.user.id)
        }
      })
      .catch((error: unknown) => {
        console.error('Erro ao recuperar sessão:', error)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (newSession) {
        void loadProfile(newSession.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      profile,
      isLoading,
      isAdmin: profile?.role === 'admin',
      async signIn(email, password) {
        const { error } = await signInWithPassword(email, password)
        return { error: error ? translateAuthError(error.message) : null }
      },
      async signOut() {
        await signOutRequest()
      },
      async refreshProfile() {
        if (session) setProfile(await fetchProfile(session.user.id))
      },
    }),
    [session, profile, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de um AuthProvider')
  }
  return context
}
