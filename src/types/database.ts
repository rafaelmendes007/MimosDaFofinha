/**
 * Tipos do schema Supabase (Postgres), mantidos manualmente em sincronia com
 * os scripts em supabase/sql/. Cresce a cada etapa.
 */
export type UserRoleRow = 'user' | 'admin'
export type CreditTransactionReasonRow =
  | 'grant'
  | 'redemption'
  | 'adjustment'
  | 'custom_request_approved'

export interface ProfileRow {
  id: string
  role: UserRoleRow
  display_name: string
  onboarding_completed_at: string | null
  created_at: string
  updated_at: string
}

export interface TreatRow {
  id: string
  name: string
  description: string
  icon: string
  cost_credits: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreditTransactionRow {
  id: string
  user_id: string
  amount: number
  reason: CreditTransactionReasonRow
  note: string | null
  created_by: string
  created_at: string
}

export interface RedemptionRow {
  id: string
  user_id: string
  treat_id: string
  cost_credits: number
  note: string | null
  redeemed_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow
        Insert: Partial<ProfileRow> & { id: string }
        Update: Partial<ProfileRow>
        Relationships: []
      }
      treats: {
        Row: TreatRow
        Insert: Partial<TreatRow> & { name: string; cost_credits: number }
        Update: Partial<TreatRow>
        Relationships: []
      }
      credit_transactions: {
        Row: CreditTransactionRow
        Insert: Partial<CreditTransactionRow> & {
          user_id: string
          amount: number
          reason: CreditTransactionReasonRow
          created_by: string
        }
        Update: Partial<CreditTransactionRow>
        Relationships: []
      }
      redemptions: {
        Row: RedemptionRow
        Insert: Partial<RedemptionRow> & {
          user_id: string
          treat_id: string
          cost_credits: number
        }
        Update: Partial<RedemptionRow>
        Relationships: []
      }
    }
    Views: Record<never, never>
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
