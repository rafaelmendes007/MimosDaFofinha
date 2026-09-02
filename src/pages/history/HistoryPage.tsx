import { History as HistoryIcon } from 'lucide-react'
import { EmptyState } from '@/components/ui'

export function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-cream-100">Memórias</h1>
        <p className="text-sm text-cream-400">A linha do tempo dos nossos mimos.</p>
      </div>

      <EmptyState
        icon={<HistoryIcon className="mx-auto size-8 text-gold-300" />}
        title="Ainda sem memórias por aqui"
        description="Quando um mimo for resgatado, ele aparece aqui — com data e tudo, para nunca esquecermos."
      />

      <p className="text-center text-xs text-cream-400">
        A linha do tempo real vem na Etapa 6.
      </p>
    </div>
  )
}
