import { supabase } from '@/integrations/supabase/client'
import type { Treat } from '@/types/domain'
import type { TreatRow } from '@/types/database'

function mapTreat(row: TreatRow): Treat {
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
