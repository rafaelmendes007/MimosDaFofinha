import { useState } from 'react'
import { Badge, Button, Card, EmptyState, Spinner } from '@/components/ui'
import { useAdminRequests } from '@/hooks/useAdminRequests'
import { formatFullDate } from '@/utils/formatDate'
import { ResolveRequestModal } from './ResolveRequestModal'
import type { CustomRequest, CustomRequestStatus } from '@/types/domain'

const STATUS_LABEL: Record<CustomRequestStatus, string> = {
  pending: 'Aguardando',
  approved: 'Aprovado',
  rejected: 'Recusado',
}

function statusBadgeTone(status: CustomRequestStatus): 'gold' | 'wine' | 'neutral' {
  if (status === 'approved') return 'gold'
  if (status === 'rejected') return 'wine'
  return 'neutral'
}

export function RequestsTab() {
  const { requests, isLoading, reload } = useAdminRequests()
  const [target, setTarget] = useState<{ request: CustomRequest; mode: 'approved' | 'rejected' } | null>(null)

  const pending = requests.filter((request) => request.status === 'pending')
  const resolved = requests.filter((request) => request.status !== 'pending')

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      )}

      {!isLoading && requests.length === 0 && (
        <EmptyState
          icon="💌"
          title="Nenhum pedido especial ainda"
          description="Quando ela enviar um pedido, ele aparece aqui para você aprovar ou recusar."
        />
      )}

      {!isLoading && pending.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium tracking-[0.2em] text-cream-400 uppercase">
            Aguardando resposta
          </p>
          {pending.map((request) => (
            <Card key={request.id} className="space-y-3">
              <p className="text-sm text-cream-100">{request.message}</p>
              <p className="text-xs text-cream-400">{formatFullDate(request.createdAt)}</p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="md"
                  className="flex-1"
                  onClick={() => setTarget({ request, mode: 'rejected' })}
                >
                  Recusar
                </Button>
                <Button
                  size="md"
                  className="flex-1"
                  onClick={() => setTarget({ request, mode: 'approved' })}
                >
                  Aprovar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && resolved.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium tracking-[0.2em] text-cream-400 uppercase">
            Já respondidos
          </p>
          {resolved.map((request) => (
            <Card key={request.id}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-cream-100">{request.message}</p>
                <Badge tone={statusBadgeTone(request.status)} className="shrink-0">
                  {STATUS_LABEL[request.status]}
                  {request.status === 'approved' && request.approvedCostCredits !== null
                    ? ` · ${request.approvedCostCredits}c`
                    : ''}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-cream-400">{formatFullDate(request.createdAt)}</p>
            </Card>
          ))}
        </div>
      )}

      <ResolveRequestModal
        request={target?.request ?? null}
        mode={target?.mode ?? null}
        onClose={() => setTarget(null)}
        onResolved={() => void reload()}
      />
    </div>
  )
}
