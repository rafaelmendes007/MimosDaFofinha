import type { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import type { CustomRequest } from '@/types/domain'
import type { CustomRequestRow } from '@/types/database'

export function mapRequest(row: CustomRequestRow): CustomRequest {
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

/** Todos os pedidos especiais, de qualquer usuária — uso da área administrativa. */
export async function fetchAllCustomRequests(): Promise<CustomRequest[]> {
  const { data, error } = await supabase
    .from('custom_requests')
    .select(
      'id, user_id, message, status, approved_cost_credits, admin_note, created_at, resolved_at, resolved_by',
    )
    .order('created_at', { ascending: false })
    .returns<CustomRequestRow[]>()

  if (error) {
    console.error('Erro ao buscar pedidos especiais (admin):', error.message)
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

/** Erro específico para quando o admin tenta aprovar um pedido sem saldo suficiente da usuária. */
export class InsufficientCreditsForRequestError extends Error {
  constructor() {
    super('insufficient_credits')
    this.name = 'InsufficientCreditsForRequestError'
  }
}

/** Aprova (descontando créditos) ou recusa um pedido especial. Só admin. */
export async function resolveCustomRequest(
  requestId: string,
  decision: 'approved' | 'rejected',
  costCredits: number | null,
  note: string | null,
): Promise<void> {
  const untypedClient = supabase as unknown as SupabaseClient
  const { error } = (await untypedClient.rpc('admin_resolve_custom_request', {
    p_request_id: requestId,
    p_decision: decision,
    p_cost_credits: costCredits,
    p_note: note,
  })) as { error: { message: string } | null }

  if (error) {
    if (error.message.includes('insufficient_credits')) {
      throw new InsufficientCreditsForRequestError()
    }
    throw new Error(error.message)
  }
}
