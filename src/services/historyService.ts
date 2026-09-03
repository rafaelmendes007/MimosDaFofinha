import { supabase } from '@/integrations/supabase/client'
import type { RedemptionWithTreat } from '@/types/domain'

interface HistoryRow {
  id: string
  user_id: string
  treat_id: string
  cost_credits: number
  redeemed_at: string
  note: string | null
  treat: { id: string; name: string; icon: string; description: string } | null
}

/** Linha do tempo completa de resgates da usuária, mais recente primeiro. */
export async function fetchRedemptionHistory(userId: string): Promise<RedemptionWithTreat[]> {
  const { data, error } = await supabase
    .from('redemptions')
    .select('id, user_id, treat_id, cost_credits, redeemed_at, note, treat:treats(id, name, icon, description)')
    .eq('user_id', userId)
    .order('redeemed_at', { ascending: false })
    .returns<HistoryRow[]>()

  if (error) {
    console.error('Erro ao buscar memórias:', error.message)
    return []
  }

  return data
    .filter((row) => row.treat !== null)
    .map((row) => ({
      id: row.id,
      userId: row.user_id,
      treatId: row.treat_id,
      costCredits: row.cost_credits,
      redeemedAt: row.redeemed_at,
      note: row.note,
      treat: row.treat as { id: string; name: string; icon: string; description: string },
    }))
}
