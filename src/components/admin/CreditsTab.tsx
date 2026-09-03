import { useState } from 'react'
import type { FormEvent } from 'react'
import { Card, CardDescription, CreditBalance, Input, Button, Spinner } from '@/components/ui'
import { useCreditBalance } from '@/hooks/useCreditBalance'
import { useCreditHistory } from '@/hooks/useCreditHistory'
import { grantCredits } from '@/services/creditService'
import { formatFullDate } from '@/utils/formatDate'

const REASON_LABEL: Record<string, string> = {
  grant: 'Créditos concedidos',
  redemption: 'Resgate de mimo',
  custom_request_approved: 'Pedido especial aprovado',
  adjustment: 'Ajuste',
}

interface CreditsTabProps {
  userId: string
}

export function CreditsTab({ userId }: CreditsTabProps) {
  const { balance, reload: reloadBalance } = useCreditBalance(userId)
  const { transactions, isLoading, reload: reloadHistory } = useCreditHistory(userId)

  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const parsedAmount = Number(amount)
    if (!Number.isInteger(parsedAmount) || parsedAmount <= 0) {
      setError('Digite uma quantidade válida de créditos (número inteiro maior que zero).')
      return
    }

    setIsSubmitting(true)
    setError(null)
    setFeedback(null)
    try {
      await grantCredits(userId, parsedAmount, note.trim() || null)
      setAmount('')
      setNote('')
      setFeedback(`Créditos adicionados! Novo saldo: ${parsedAmount} a mais. 💛`)
      await Promise.all([reloadBalance(), reloadHistory()])
    } catch {
      setError('Não consegui adicionar os créditos agora. Tenta de novo?')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <CreditBalance credits={balance} />

      <Card className="space-y-4">
        <CardDescription>Adicionar créditos</CardDescription>
        <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={handleSubmit}>
          <Input
            type="number"
            min={1}
            label="Quantidade"
            placeholder="Ex: 5"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="sm:w-32"
          />
          <Input
            label="Motivo (opcional)"
            placeholder="Ex: Mesada de mimos do mês"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isSubmitting} className="sm:w-auto">
            {isSubmitting ? 'Adicionando...' : 'Adicionar'}
          </Button>
        </form>
        {error && <p className="text-sm text-wine-300">{error}</p>}
        {feedback && <p className="text-sm text-gold-300">{feedback}</p>}
      </Card>

      <div className="space-y-3">
        <p className="text-xs font-medium tracking-[0.2em] text-cream-400 uppercase">
          Extrato de créditos
        </p>

        {isLoading && (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        )}

        {!isLoading && transactions.length === 0 && (
          <p className="text-sm text-cream-400">Nenhuma movimentação ainda.</p>
        )}

        {!isLoading && transactions.length > 0 && (
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-cream-100">
                    {REASON_LABEL[transaction.reason] ?? transaction.reason}
                  </p>
                  <p className="text-xs text-cream-400">
                    {formatFullDate(transaction.createdAt)}
                    {transaction.note ? ` · ${transaction.note}` : ''}
                  </p>
                </div>
                <span
                  className={
                    transaction.amount > 0
                      ? 'font-display font-semibold text-gold-300'
                      : 'font-display font-semibold text-cream-300'
                  }
                >
                  {transaction.amount > 0 ? '+' : ''}
                  {transaction.amount}
                </span>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
