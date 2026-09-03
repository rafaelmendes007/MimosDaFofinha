import type { SupabaseClient } from '@supabase/supabase-js'
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

/** Erro específico para quando não há créditos suficientes — a UI trata à parte. */
export class InsufficientCreditsError extends Error {
  constructor() {
    super('insufficient_credits')
    this.name = 'InsufficientCreditsError'
  }
}

export interface RedeemResult {
  redemptionId: string
  newBalance: number
}

/**
 * Resgata um mimo de verdade: chama a função transacional no banco, que
 * verifica saldo, desconta créditos e grava o resgate atomicamente. Nunca
 * desconta créditos localmente antes de confirmar com o servidor.
 */
export async function redeemTreat(treatId: string): Promise<RedeemResult> {
  // O parser de tipos do supabase-js não infere corretamente os argumentos de
  // RPCs com parâmetros nesta versão da lib (mesma limitação contornada com
  // `.returns()` em creditService/redemptionService) — aqui o client é tratado
  // como não tipado só para esta chamada; o restante do arquivo continua
  // type-safe pela assinatura pública de `redeemTreat`.
  const untypedClient = supabase as unknown as SupabaseClient
  const { data, error } = (await untypedClient.rpc('redeem_treat', {
    p_treat_id: treatId,
  })) as {
    data: { redemption_id: string; new_balance: number }[] | null
    error: { message: string } | null
  }

  if (error) {
    if (error.message.includes('insufficient_credits')) {
      throw new InsufficientCreditsError()
    }
    throw new Error(error.message)
  }

  const result = data?.[0]
  if (!result) {
    throw new Error('Resposta inesperada ao resgatar o mimo.')
  }

  return { redemptionId: result.redemption_id, newBalance: result.new_balance }
}
