import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Button, Input, Modal, Textarea } from '@/components/ui'
import { createTreat, updateTreat } from '@/services/treatService'
import type { Treat } from '@/types/domain'

interface TreatFormModalProps {
  open: boolean
  onClose: () => void
  onSaved: () => void
  treat: Treat | null
}

export function TreatFormModal({ open, onClose, onSaved, treat }: TreatFormModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('🎁')
  const [cost, setCost] = useState('1')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setName(treat?.name ?? '')
    setDescription(treat?.description ?? '')
    setIcon(treat?.icon ?? '🎁')
    setCost(String(treat?.costCredits ?? 1))
    setError(null)
  }, [open, treat])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const parsedCost = Number(cost)
    if (!name.trim() || !Number.isInteger(parsedCost) || parsedCost <= 0) {
      setError('Preencha o nome e um custo em créditos válido (número inteiro maior que zero).')
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      const input = { name: name.trim(), description: description.trim(), icon: icon.trim() || '🎁', costCredits: parsedCost }
      if (treat) {
        await updateTreat(treat.id, input)
      } else {
        await createTreat(input)
      }
      onSaved()
      onClose()
    } catch {
      setError('Não consegui salvar o mimo agora. Tenta de novo?')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <p className="font-display text-lg font-semibold text-cream-100">
          {treat ? 'Editar mimo' : 'Novo mimo'}
        </p>
        <div className="flex gap-3">
          <Input
            label="Ícone"
            value={icon}
            onChange={(event) => setIcon(event.target.value)}
            className="w-20 text-center text-lg"
            maxLength={4}
          />
          <Input
            label="Nome"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="flex-1"
            placeholder="Ex: Vale Pizza"
          />
        </div>
        <Textarea
          label="Descrição"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          placeholder="Ex: Uma pizza escolhida por você para comermos juntos."
        />
        <Input
          type="number"
          min={1}
          label="Custo em créditos"
          value={cost}
          onChange={(event) => setCost(event.target.value)}
        />
        {error && <p className="text-sm text-wine-300">{error}</p>}
        <div className="flex gap-3">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
