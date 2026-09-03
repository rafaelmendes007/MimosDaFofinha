/**
 * Tipos do schema Supabase (Postgres), mantidos manualmente em sincronia com
 * os scripts em supabase/sql/. Cresce a cada etapa: hoje reflete apenas
 * "profiles" (Etapa 3); "treats", "redemptions" etc. entram nas próximas.
 */
export type UserRoleRow = 'user' | 'admin'

export interface ProfileRow {
  id: string
  role: UserRoleRow
  display_name: string
  onboarding_completed_at: string | null
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow
        Insert: Partial<ProfileRow> & { id: string }
        Update: Partial<ProfileRow>
      }
    }
    Views: Record<string, never>
    Functions: {
      complete_onboarding: {
        Args: Record<string, never>
        Returns: void
      }
      is_admin: {
        Args: { uid: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: UserRoleRow
    }
  }
}
