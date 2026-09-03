import type { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import type { CreditTransactionRow } from '@/types/database'
import type { CreditTransaction } from '@/types/domain'

/** O saldo nunca é um número solto: é sempre a soma do ledger (credit_transactions). */
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

function mapTransaction(row: CreditTransactionRow): CreditTransaction {
  return {
    id: row.id,
    userId: row.user_id,
    amount: row.amount,
    reason: row.reason,
    note: row.note,
    createdBy: row.created_by,
    createdAt: row.created_at,
  }
}

/** Extrato completo do ledger de uma usuária — uso da área administrativa. */
export async function fetchCreditHistory(userId: string): Promise<CreditTransaction[]> {
  const { data, error } = await supabase
    .from('credit_transactions')
    .select('id, user_id, amount, reason, note, created_by, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .returns<CreditTransactionRow[]>()

  if (error) {
    console.error('Erro ao buscar extrato de créditos:', error.message)
    return []
  }

  return data.map(mapTransaction)
}

/** Concede créditos a uma usuária. Só funciona para quem tem role = admin. */
export async function grantCredits(
  userId: string,
  amount: number,
  note: string | null,
): Promise<number> {
  const untypedClient = supabase as unknown as SupabaseClient
  const { data, error } = (await untypedClient.rpc('admin_grant_credits', {
    p_user_id: userId,
    p_amount: amount,
    p_note: note,
  })) as { data: number | null; error: { message: string } | null }

  if (error) {
    throw new Error(error.message)
  }

  return data ?? 0
}
