import type { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import type { CustomRequest } from '@/types/domain'
import type { CustomRequestRow } from '@/types/database'

function mapRequest(row: CustomRequestRow): CustomRequest {
  return {
    id: row.id,
    userId: row.user_id,
    message: row.message,
    status: row.status,
    approvedCostCredits: row.approved_cost_credits,
    adminNote: row.admin_note,
    createdAt: row.created_at,
    resolvedAt: row.resolved_at,
    resolvedBy: row.resolved_by,
  }
}

export async function fetchMyCustomRequests(userId: string): Promise<CustomRequest[]> {
  const { data, error } = await supabase
    .from('custom_requests')
    .select(
      'id, user_id, message, status, approved_cost_credits, admin_note, created_at, resolved_at, resolved_by',
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .returns<CustomRequestRow[]>()

  if (error) {
    console.error('Erro ao buscar pedidos especiais:', error.message)
    return []
  }

  return data.map(mapRequest)
}

export async function createCustomRequest(userId: string, message: string): Promise<void> {
  // Mesma limitação do parser de tipos do supabase-js contornada em
  // redemptionService.ts — aqui só para o argumento de `.insert()`.
  const untypedClient = supabase as unknown as SupabaseClient
  const { error } = (await untypedClient
    .from('custom_requests')
    .insert({ user_id: userId, message: message.trim() })) as { error: { message: string } | null }

  if (error) {
    throw new Error(error.message)
  }
}
