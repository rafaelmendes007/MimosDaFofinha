import { Sparkles } from 'lucide-react'
import { Badge, Button, Card, Textarea } from '@/components/ui'

export function RequestsPage() {
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
        <Textarea
          label="O que você gostaria?"
          placeholder="Ex: Quero tomar açaí com você hoje."
          rows={4}
        />
        <Button className="w-full" size="lg">
          Enviar pedido
        </Button>
        <p className="text-center text-xs text-cream-400">
          O pedido fica pendente até o patrocinador oficial do amor aprovar. Fluxo completo na
          Etapa 7.
        </p>
      </Card>
    </div>
  )
}
