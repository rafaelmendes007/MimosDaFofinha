import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Badge, Button, Card, CardDescription, CardTitle, Spinner } from '@/components/ui'
import { useAdminTreats } from '@/hooks/useAdminTreats'
import { useRedemptionCounts } from '@/hooks/useRedemptionCounts'
import { updateTreat } from '@/services/treatService'
import { TreatFormModal } from './TreatFormModal'
import type { Treat } from '@/types/domain'

interface TreatsTabProps {
  userId: string
}

export function TreatsTab({ userId }: TreatsTabProps) {
  const { treats, isLoading, reload } = useAdminTreats()
  const { counts } = useRedemptionCounts(userId)

  const [formOpen, setFormOpen] = useState(false)
  const [editingTreat, setEditingTreat] = useState<Treat | null>(null)

  function openCreate() {
    setEditingTreat(null)
    setFormOpen(true)
  }

  function openEdit(treat: Treat) {
    setEditingTreat(treat)
    setFormOpen(true)
  }

  async function toggleActive(treat: Treat) {
    await updateTreat(treat.id, { isActive: !treat.isActive })
    await reload()
  }

  return (
    <div className="space-y-4">
      <Button onClick={openCreate} className="w-full">
        <Plus className="size-4" /> Novo mimo
      </Button>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      )}

      {!isLoading &&
        treats.map((treat) => (
          <Card key={treat.id} className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{treat.icon}</span>
                <div>
                  <CardTitle className="text-base">{treat.name}</CardTitle>
                  <CardDescription className="mt-1">{treat.description}</CardDescription>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <Badge tone="gold">
                  {treat.costCredits} {treat.costCredits === 1 ? 'crédito' : 'créditos'}
                </Badge>
                {!treat.isActive && <Badge tone="wine">Desativado</Badge>}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-cream-400">
                Usado {counts[treat.id] ?? 0}x por ela
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="md" onClick={() => openEdit(treat)}>
                  Editar
                </Button>
                <Button variant="secondary" size="md" onClick={() => void toggleActive(treat)}>
                  {treat.isActive ? 'Desativar' : 'Reativar'}
                </Button>
              </div>
            </div>
          </Card>
        ))}

      <TreatFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={() => void reload()}
        treat={editingTreat}
      />
    </div>
  )
}
