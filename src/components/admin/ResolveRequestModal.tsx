import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Button, Input, Modal, Textarea } from '@/components/ui'
import { InsufficientCreditsForRequestError, resolveCustomRequest } from '@/services/requestService'
import type { CustomRequest } from '@/types/domain'

interface ResolveRequestModalProps {
  request: CustomRequest | null
  mode: 'approved' | 'rejected' | null
  onClose: () => void
  onResolved: () => void
}

export function ResolveRequestModal({ request, mode, onClose, onResolved }: ResolveRequestModalProps) {
  const [cost, setCost] = useState('1')
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!request) return
    setCost('1')
    setNote('')
    setError(null)
  }, [request, mode])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!request || !mode) return

    let parsedCost: number | null = null
    if (mode === 'approved') {
      parsedCost = Number(cost)
      if (!Number.isInteger(parsedCost) || parsedCost <= 0) {
        setError('Digite um custo em créditos válido (número inteiro maior que zero).')
        return
      }
    }

    setIsSubmitting(true)
    setError(null)
    try {
      await resolveCustomRequest(request.id, mode, parsedCost, note.trim() || null)
      onResolved()
      onClose()
    } catch (err) {
      if (err instanceof InsufficientCreditsForRequestError) {
        setError('Ela não tem créditos suficientes para esse valor. Adicione créditos antes de aprovar.')
      } else {
        setError('Não consegui salvar agora. Tenta de novo?')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal open={!!request && !!mode} onClose={onClose}>
      {request && mode && (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <p className="font-display text-lg font-semibold text-cream-100">
            {mode === 'approved' ? 'Aprovar pedido' : 'Recusar pedido'}
          </p>
          <p className="rounded-xl bg-ink-900/60 p-3 text-sm text-cream-300 italic">
            "{request.message}"
          </p>
          {mode === 'approved' && (
            <Input
              type="number"
              min={1}
              label="Quantos créditos isso vale?"
              value={cost}
              onChange={(event) => setCost(event.target.value)}
            />
          )}
          <Textarea
            label="Nota (opcional)"
            placeholder={mode === 'approved' ? 'Ex: Combinado pra sexta!' : 'Ex: Vamos deixar pra outra data'}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={2}
          />
          {error && <p className="text-sm text-wine-300">{error}</p>}
          <div className="flex gap-3">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : mode === 'approved' ? 'Confirmar aprovação' : 'Confirmar recusa'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
