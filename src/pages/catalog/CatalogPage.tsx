import { Badge, Button, Card, CardDescription, CardTitle } from '@/components/ui'

/** Dados de exemplo — o catálogo real vem do Supabase na Etapa 4/5. */
const SAMPLE_TREATS = [
  { icon: '🍕', name: 'Vale Pizza', description: 'Uma pizza escolhida por você para comermos juntos.', cost: 2, redeemed: 3 },
  { icon: '🍧', name: 'Vale Açaí', description: 'Aquele açaí de sempre, do jeitinho que você gosta.', cost: 1, redeemed: 5 },
  { icon: '🎬', name: 'Vale Escolher o Filme', description: 'Você escolhe, eu assisto sem reclamar.', cost: 1, redeemed: 8 },
  { icon: '💆', name: 'Vale Massagem', description: 'Um momento só seu, de relaxar de verdade.', cost: 3, redeemed: 2 },
]

export function CatalogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-cream-100">Seus mimos</h1>
        <p className="text-sm text-cream-400">Escolha um e transforme em momento.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {SAMPLE_TREATS.map((treat) => (
          <Card key={treat.name} className="flex flex-col">
            <div className="flex items-start justify-between">
              <span className="text-3xl">{treat.icon}</span>
              <Badge tone="gold">{treat.cost} {treat.cost === 1 ? 'crédito' : 'créditos'}</Badge>
            </div>
            <CardTitle className="mt-3">{treat.name}</CardTitle>
            <CardDescription className="mt-1 flex-1">{treat.description}</CardDescription>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-cream-400">Já aproveitado {treat.redeemed}x</span>
              <Button size="md">Resgatar</Button>
            </div>
          </Card>
        ))}
      </div>

      <p className="text-center text-xs text-cream-400">
        Catálogo, resgate e transação real chegam nas Etapas 4 e 5.
      </p>
    </div>
  )
}
