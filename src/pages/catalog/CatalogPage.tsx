import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, PartyPopper } from 'lucide-react'
import { Badge, Button, Card, CardDescription, CardTitle, EmptyState, Modal, Spinner } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { useTreats } from '@/hooks/useTreats'
import { useCreditBalance } from '@/hooks/useCreditBalance'
import { useRedemptionCounts } from '@/hooks/useRedemptionCounts'
import { InsufficientCreditsError, redeemTreat } from '@/services/redemptionService'
import { pickSuccessMessage } from '@/utils/redeemMessages'
import { fireCelebration } from '@/utils/confetti'
import type { Treat } from '@/types/domain'

type ModalStatus = 'confirm' | 'insufficient' | 'redeeming' | 'success' | 'error'

export function CatalogPage() {
  const { profile } = useAuth()
  const { treats, isLoading } = useTreats()
  const { balance, reload: reloadBalance } = useCreditBalance(profile?.id)
  const { counts, increment: incrementCount } = useRedemptionCounts(profile?.id)

  const [selectedTreat, setSelectedTreat] = useState<Treat | null>(null)
  const [status, setStatus] = useState<ModalStatus>('confirm')
  const [successMessage, setSuccessMessage] = useState('')

  function openRedeem(treat: Treat) {
    setSelectedTreat(treat)
    setStatus(balance < treat.costCredits ? 'insufficient' : 'confirm')
  }

  function closeModal() {
    setSelectedTreat(null)
  }

  async function handleConfirm() {
    if (!selectedTreat) return
    setStatus('redeeming')
    try {
      await redeemTreat(selectedTreat.id)
      setSuccessMessage(pickSuccessMessage())
      setStatus('success')
      incrementCount(selectedTreat.id)
      void reloadBalance()
      fireCelebration()
    } catch (error) {
      if (error instanceof InsufficientCreditsError) {
        setStatus('insufficient')
      } else {
        console.error('Erro ao resgatar mimo:', error)
        setStatus('error')
      }
    }
  }

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
          {treats.map((treat, index) => {
            const redeemedCount = counts[treat.id] ?? 0
            return (
              <motion.div
                key={treat.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3), ease: 'easeOut' }}
              >
                <Card className="flex h-full flex-col">
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
                    <Button size="md" onClick={() => openRedeem(treat)}>
                      Resgatar
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      <Modal open={!!selectedTreat} onClose={closeModal}>
        {selectedTreat && (
          <AnimatePresence mode="wait">
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 text-center"
            >
              {(status === 'confirm' || status === 'redeeming') && (
                <>
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
                  <p className="text-xs text-cream-400">Confirma o resgate desse mimo?</p>
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={closeModal}
                      disabled={status === 'redeeming'}
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleConfirm}
                      disabled={status === 'redeeming'}
                    >
                      {status === 'redeeming' ? <Spinner /> : 'Confirmar'}
                    </Button>
                  </div>
                </>
              )}

              {status === 'success' && (
                <>
                  <PartyPopper className="mx-auto size-9 text-gold-300" />
                  <p className="font-display text-xl font-semibold text-cream-100">
                    {successMessage}
                  </p>
                  <Button className="w-full" onClick={closeModal}>
                    Fechar
                  </Button>
                </>
              )}

              {status === 'insufficient' && (
                <>
                  <span className="text-4xl">🥺</span>
                  <p className="font-display text-lg font-semibold text-cream-100">
                    Ops... seus créditos acabaram.
                  </p>
                  <p className="text-sm text-cream-300">
                    O Fofinho foi informado.
                    <br />
                    Aguarde uma nova liberação de créditos. <Heart className="inline size-3.5 text-blush-400" fill="currentColor" />
                  </p>
                  <Button className="w-full" onClick={closeModal}>
                    Entendi
                  </Button>
                </>
              )}

              {status === 'error' && (
                <>
                  <span className="text-4xl">💔</span>
                  <p className="font-display text-lg font-semibold text-cream-100">
                    Algo não deu certo
                  </p>
                  <p className="text-sm text-cream-300">
                    Não consegui concluir o resgate agora. Tenta de novo em instantes?
                  </p>
                  <div className="flex gap-3">
                    <Button variant="secondary" className="flex-1" onClick={closeModal}>
                      Fechar
                    </Button>
                    <Button className="flex-1" onClick={handleConfirm}>
                      Tentar de novo
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </Modal>
    </div>
  )
}
