import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/cn'

interface CreditBalanceProps {
  credits: number
  className?: string
}

function balanceMessage(credits: number): string {
  if (credits === 0) return 'Seus créditos estão esperando uma nova liberação'
  if (credits === 1) return 'Você tem 1 mimo disponível'
  return `Você tem ${credits} mimos disponíveis`
}

export function CreditBalance({ credits, className }: CreditBalanceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'relative overflow-hidden rounded-3xl border border-gold-500/25 bg-gradient-to-br from-ink-800 via-ink-800 to-wine-600/30 p-6 shadow-glow',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-[0.2em] text-gold-300/80 uppercase">
          Seu saldo
        </span>
        <Heart className="size-4 text-blush-400" fill="currentColor" />
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-shimmer font-display text-5xl font-semibold">{credits}</span>
        <span className="text-sm text-cream-300">{credits === 1 ? 'crédito' : 'créditos'}</span>
      </div>

      <p className="mt-2 text-sm text-cream-300">{balanceMessage(credits)} 💕</p>
    </motion.div>
  )
}
