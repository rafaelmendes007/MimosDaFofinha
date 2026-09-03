import { supabase } from '@/integrations/supabase/client'
import type { RedemptionRow } from '@/types/database'

/** Quantas vezes cada mimo já foi resgatado por essa usuária. */
export async function fetchRedemptionCountsByTreat(
  userId: string,
): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('redemptions')
    .select('treat_id')
    .eq('user_id', userId)
    .returns<Pick<RedemptionRow, 'treat_id'>[]>()

  if (error) {
    console.error('Erro ao buscar resgates:', error.message)
    return {}
  }

  return data.reduce<Record<string, number>>((counts, row) => {
    counts[row.treat_id] = (counts[row.treat_id] ?? 0) + 1
    return counts
  }, {})
}
