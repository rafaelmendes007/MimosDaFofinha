import { supabase } from '@/integrations/supabase/client'
import type { Profile } from '@/types/domain'
import type { ProfileRow } from '@/types/database'

function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    role: row.role,
    displayName: row.display_name,
    onboardingCompletedAt: row.onboarding_completed_at,
    createdAt: row.created_at,
  }
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, role, display_name, onboarding_completed_at, created_at, updated_at')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Erro ao buscar perfil:', error.message)
    return null
  }

  return mapProfile(data)
}

export async function completeOnboarding(): Promise<void> {
  const { error } = await supabase.rpc('complete_onboarding')
  if (error) throw error
}
