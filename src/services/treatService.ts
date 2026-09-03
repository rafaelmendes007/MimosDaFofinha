import type { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import type { Treat } from '@/types/domain'
import type { TreatRow } from '@/types/database'

export function mapTreat(row: TreatRow): Treat {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    icon: row.icon,
    costCredits: row.cost_credits,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function fetchActiveTreats(): Promise<Treat[]> {
  const { data, error } = await supabase
    .from('treats')
    .select('id, name, description, icon, cost_credits, is_active, created_at, updated_at')
    .eq('is_active', true)
    .order('cost_credits', { ascending: true })

  if (error) {
    console.error('Erro ao buscar mimos:', error.message)
    return []
  }

  return data.map(mapTreat)
}

export interface TreatInput {
  name: string
  description: string
  icon: string
  costCredits: number
}

/** Cria um novo mimo no catálogo. Só funciona para quem tem role = admin (RLS). */
export async function createTreat(input: TreatInput): Promise<void> {
  const untypedClient = supabase as unknown as SupabaseClient
  const { error } = (await untypedClient.from('treats').insert({
    name: input.name,
    description: input.description,
    icon: input.icon,
    cost_credits: input.costCredits,
  })) as { error: { message: string } | null }

  if (error) {
    throw new Error(error.message)
  }
}

/** Edita um mimo existente (nome, descrição, ícone, custo e/ou se está ativo). */
export async function updateTreat(
  treatId: string,
  changes: Partial<TreatInput & { isActive: boolean }>,
): Promise<void> {
  const untypedClient = supabase as unknown as SupabaseClient
  const { error } = (await untypedClient
    .from('treats')
    .update({
      ...(changes.name !== undefined && { name: changes.name }),
      ...(changes.description !== undefined && { description: changes.description }),
      ...(changes.icon !== undefined && { icon: changes.icon }),
      ...(changes.costCredits !== undefined && { cost_credits: changes.costCredits }),
      ...(changes.isActive !== undefined && { is_active: changes.isActive }),
    })
    .eq('id', treatId)) as { error: { message: string } | null }

  if (error) {
    throw new Error(error.message)
  }
}

/** Todos os mimos, inclusive desativados — uso exclusivo da área administrativa. */
export async function fetchAllTreats(): Promise<Treat[]> {
  const { data, error } = await supabase
    .from('treats')
    .select('id, name, description, icon, cost_credits, is_active, created_at, updated_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar mimos (admin):', error.message)
    return []
  }

  return data.map(mapTreat)
}
