import { motion } from 'framer-motion'
import { History as HistoryIcon } from 'lucide-react'
import { Badge, Card, CardDescription, EmptyState, Spinner } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { useMemories } from '@/hooks/useMemories'
import { formatFullDate } from '@/utils/formatDate'

export function HistoryPage() {
  const { profile } = useAuth()
  const { entries, isLoading } = useMemories(profile?.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-cream-100">Memórias</h1>
        <p className="text-sm text-cream-400">
          {entries.length === 0
            ? 'A linha do tempo dos nossos mimos.'
            : `${entries.length} ${entries.length === 1 ? 'momento vivido' : 'momentos vividos'} juntos.`}
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      )}

      {!isLoading && entries.length === 0 && (
        <EmptyState
          icon={<HistoryIcon className="mx-auto size-8 text-gold-300" />}
          title="Ainda sem memórias por aqui"
          description="Quando um mimo for resgatado, ele aparece aqui — com data e tudo, para nunca esquecermos."
        />
      )}

      {!isLoading && entries.length > 0 && (
        <div className="relative space-y-5 border-l border-ink-600 pl-6">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              className="relative"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: Math.min(index * 0.06, 0.36), ease: 'easeOut' }}
            >
              <span className="absolute top-5 -left-[29px] size-3 rounded-full border-2 border-ink-950 bg-gold-400" />
              <Card>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{entry.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-display font-semibold text-cream-100">{entry.title}</p>
                      <Badge tone="gold" className="shrink-0">
                        {entry.costCredits} {entry.costCredits === 1 ? 'crédito' : 'créditos'}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-cream-400">{formatFullDate(entry.date)}</p>
                    {entry.description && (
                      <CardDescription className="mt-2">{entry.description}</CardDescription>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
