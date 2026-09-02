import { Card, CardDescription, CardTitle } from '@/components/ui'

const SAMPLE_STATS = [
  { label: 'Saldo atual', value: '5 créditos' },
  { label: 'Mimos ativos', value: '4' },
  { label: 'Pedidos pendentes', value: '0' },
]

export function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-cream-100">Área administrativa</h1>
        <p className="text-sm text-cream-400">Visão geral para o patrocinador oficial do amor.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {SAMPLE_STATS.map((stat) => (
          <Card key={stat.label}>
            <CardDescription>{stat.label}</CardDescription>
            <CardTitle className="mt-1 text-2xl">{stat.value}</CardTitle>
          </Card>
        ))}
      </div>

      <p className="text-center text-xs text-cream-400">
        Gestão de créditos, mimos e pedidos chega completa na Etapa 8. Este painel também
        precisará de controle de acesso (Etapa 3) para não ficar visível a qualquer pessoa.
      </p>
    </div>
  )
}
