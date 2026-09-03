import { useState } from 'react'
import type { FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Badge, Button, Card, Spinner, Textarea } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { useCustomRequests } from '@/hooks/useCustomRequests'
import { createCustomRequest } from '@/services/requestService'
import { formatFullDate } from '@/utils/formatDate'
import type { CustomRequest, CustomRequestStatus } from '@/types/domain'

const STATUS_LABEL: Record<CustomRequestStatus, string> = {
  pending: 'Aguardando resposta',
  approved: 'Aprovado',
  rejected: 'Recusado',
}

function statusBadgeTone(status: CustomRequestStatus): 'gold' | 'wine' | 'neutral' {
  if (status === 'approved') return 'gold'
  if (status === 'rejected') return 'wine'
  return 'neutral'
}

function RequestCard({ request }: { request: CustomRequest }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-cream-100">{request.message}</p>
        <Badge tone={statusBadgeTone(request.status)} className="shrink-0">
          {STATUS_LABEL[request.status]}
          {request.status === 'approved' && request.approvedCostCredits !== null
            ? ` · ${request.approvedCostCredits} ${request.approvedCostCredits === 1 ? 'crédito' : 'créditos'}`
            : ''}
        </Badge>
      </div>
      <p className="mt-2 text-xs text-cream-400">{formatFullDate(request.createdAt)}</p>
      {request.adminNote && (
        <p className="mt-2 text-xs text-cream-300 italic">"{request.adminNote}"</p>
      )}
    </Card>
  )
}

export function RequestsPage() {
  const { profile } = useAuth()
  const { requests, isLoading, reload } = useCustomRequests(profile?.id)

  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!profile || !message.trim()) return

    setIsSubmitting(true)
    setError(null)
    setFeedback(null)
    try {
      await createCustomRequest(profile.id, message)
      setMessage('')
      setFeedback('Pedido enviado! 💌 Assim que for avaliado, a resposta aparece aqui.')
      await reload()
    } catch {
      setError('Não consegui enviar o pedido agora. Tenta de novo em instantes?')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-cream-100">Pedido especial</h1>
        <p className="text-sm text-cream-400">Quando o que você quer não está no catálogo.</p>
      </div>

      <Card className="space-y-4">
        <Badge tone="wine">
          <Sparkles className="size-3" /> Não desconta créditos automaticamente
        </Badge>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Textarea
            label="O que você gostaria?"
            placeholder="Ex: Quero tomar açaí com você hoje."
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
          />
          {error && (
            <p role="alert" className="text-sm text-wine-300">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar pedido'}
          </Button>
        </form>
        {feedback && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-gold-300"
          >
            {feedback}
          </motion.p>
        )}
      </Card>

      {isLoading && (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      )}

      {!isLoading && requests.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium tracking-[0.2em] text-cream-400 uppercase">
            Seus pedidos
          </p>
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  )
}
