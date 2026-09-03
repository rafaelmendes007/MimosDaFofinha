import { Sparkles } from 'lucide-react'
import { Card, CardDescription, CardTitle, EmptyState, Spinner } from '@/components/ui'
import { useCreditBalance } from '@/hooks/useCreditBalance'
import { useMemories } from '@/hooks/useMemories'
import { useAdminRequests } from '@/hooks/useAdminRequests'
import { formatFullDate } from '@/utils/formatDate'

interface OverviewTabProps {
  userId: string
}

export function OverviewTab({ userId }: OverviewTabProps) {
  const { balance } = useCreditBalance(userId)
  const { entries, isLoading: memoriesLoading } = useMemories(userId)
  const { requests, isLoading: requestsLoading } = useAdminRequests()

  const pendingRequests = requests.filter((request) => request.status === 'pending')
  const isLoading = memoriesLoading || requestsLoading

  const recentActivity = [
    ...entries.slice(0, 5).map((entry) => ({
      id: entry.id,
      icon: entry.icon,
      title: `Resgatou "${entry.title}"`,
      date: entry.date,
    })),
    ...pendingRequests.map((request) => ({
      id: request.id,
      icon: '💌',
      title: `Novo pedido especial: "${request.message}"`,
      date: request.createdAt,
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8)

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardDescription>Saldo atual dela</CardDescription>
          <CardTitle className="mt-1 text-2xl">{balance} créditos</CardTitle>
        </Card>
        <Card>
          <CardDescription>Pedidos pendentes</CardDescription>
          <CardTitle className="mt-1 text-2xl">{pendingRequests.length}</CardTitle>
        </Card>
        <Card>
          <CardDescription>Memórias criadas</CardDescription>
          <CardTitle className="mt-1 text-2xl">{entries.length}</CardTitle>
        </Card>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium tracking-[0.2em] text-cream-400 uppercase">
          Atividade recente
        </p>

        {isLoading && (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        )}

        {!isLoading && recentActivity.length === 0 && (
          <EmptyState
            icon={<Sparkles className="mx-auto size-8 text-gold-300" />}
            title="Ainda sem atividade"
            description="Resgates e pedidos especiais dela aparecem aqui assim que acontecerem."
          />
        )}

        {!isLoading && recentActivity.length > 0 && (
          <div className="space-y-2">
            {recentActivity.map((item) => (
              <Card key={item.id} className="flex items-center gap-3 py-3">
                <span className="text-xl">{item.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-cream-100">{item.title}</p>
                  <p className="text-xs text-cream-400">{formatFullDate(item.date)}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
