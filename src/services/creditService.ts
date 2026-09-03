import { supabase } from '@/integrations/supabase/client'
import type { CreditTransactionRow } from '@/types/database'

/**
 * O saldo nunca é um número solto: é sempre a soma do ledger
 * (credit_transactions). A Etapa 5 adiciona as escritas nesse ledger.
 */
export async function fetchCreditBalance(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('credit_transactions')
    .select('amount')
    .eq('user_id', userId)
    .returns<Pick<CreditTransactionRow, 'amount'>[]>()

  if (error) {
    console.error('Erro ao buscar saldo:', error.message)
    return 0
  }

  return data.reduce((total, row) => total + row.amount, 0)
}
