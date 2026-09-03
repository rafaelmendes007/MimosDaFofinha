import { useState } from 'react'
import { Badge, Button, Card, CardDescription, CardTitle, EmptyState, Modal, Spinner } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { useTreats } from '@/hooks/useTreats'
import { useRedemptionCounts } from '@/hooks/useRedemptionCounts'
import type { Treat } from '@/types/domain'

export function CatalogPage() {
  const { profile } = useAuth()
  const { treats, isLoading } = useTreats()
  const counts = useRedemptionCounts(profile?.id)
  const [selectedTreat, setSelectedTreat] = useState<Treat | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-cream-100">Seus mimos</h1>
        <p className="text-sm text-cream-400">Escolha um e transforme em momento.</p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      )}

      {!isLoading && treats.length === 0 && (
        <EmptyState
          icon="🎁"
          title="Nenhum mimo por aqui ainda"
          description="Assim que os primeiros mimos forem cadastrados, eles aparecem nesta vitrine."
        />
      )}

      {!isLoading && treats.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {treats.map((treat) => {
            const redeemedCount = counts[treat.id] ?? 0
            return (
              <Card key={treat.id} className="flex flex-col">
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{treat.icon}</span>
                  <Badge tone="gold">
                    {treat.costCredits} {treat.costCredits === 1 ? 'crédito' : 'créditos'}
                  </Badge>
                </div>
                <CardTitle className="mt-3">{treat.name}</CardTitle>
                <CardDescription className="mt-1 flex-1">{treat.description}</CardDescription>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-cream-400">
                    {redeemedCount === 0
                      ? 'Ainda não vivemos isso'
                      : `Já aproveitado ${redeemedCount}x`}
                  </span>
                  <Button size="md" onClick={() => setSelectedTreat(treat)}>
                    Resgatar
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal open={!!selectedTreat} onClose={() => setSelectedTreat(null)}>
        {selectedTreat && (
          <div className="space-y-4 text-center">
            <span className="text-4xl">{selectedTreat.icon}</span>
            <div>
              <p className="font-display text-xl font-semibold text-cream-100">
                {selectedTreat.name}
              </p>
              <p className="mt-1 text-sm text-cream-300">{selectedTreat.description}</p>
            </div>
            <Badge tone="gold" className="mx-auto">
              {selectedTreat.costCredits}{' '}
              {selectedTreat.costCredits === 1 ? 'crédito' : 'créditos'}
            </Badge>
            <p className="text-xs text-cream-400">
              O resgate de verdade — com desconto de créditos e a comemoração — chega na Etapa 5.
            </p>
            <Button className="w-full" onClick={() => setSelectedTreat(null)}>
              Fechar
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
