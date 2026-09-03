import { supabase } from '@/integrations/supabase/client'
import type { CustomRequestRow } from '@/types/database'
import type { MemoryEntry, RedemptionWithTreat } from '@/types/domain'

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

/**
 * Memórias de verdade: resgates do catálogo + pedidos especiais aprovados,
 * unificados numa única linha do tempo (mais recente primeiro).
 */
export async function fetchMemories(userId: string): Promise<MemoryEntry[]> {
  const redemptions = await fetchRedemptionHistory(userId)

  const { data: approvedRequests, error } = await supabase
    .from('custom_requests')
    .select('id, message, approved_cost_credits, admin_note, resolved_at')
    .eq('user_id', userId)
    .eq('status', 'approved')
    .returns<
      Pick<CustomRequestRow, 'id' | 'message' | 'approved_cost_credits' | 'admin_note' | 'resolved_at'>[]
    >()

  if (error) {
    console.error('Erro ao buscar pedidos aprovados para memórias:', error.message)
  }

  const fromRedemptions: MemoryEntry[] = redemptions.map((entry) => ({
    id: `redemption-${entry.id}`,
    icon: entry.treat.icon,
    title: entry.treat.name,
    description: entry.treat.description,
    costCredits: entry.costCredits,
    date: entry.redeemedAt,
  }))

  const fromRequests: MemoryEntry[] = (approvedRequests ?? []).map((row) => ({
    id: `request-${row.id}`,
    icon: '✨',
    title: row.message,
    description: row.admin_note ?? 'Pedido especial aprovado.',
    costCredits: row.approved_cost_credits ?? 0,
    date: row.resolved_at ?? '',
  }))

  return [...fromRedemptions, ...fromRequests].sort((a, b) => b.date.localeCompare(a.date))
}
