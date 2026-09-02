import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type BadgeTone = 'gold' | 'wine' | 'neutral'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
}

const toneClasses: Record<BadgeTone, string> = {
  gold: 'bg-gold-500/15 text-gold-300 border-gold-500/30',
  wine: 'bg-wine-500/15 text-wine-300 border-wine-400/30',
  neutral: 'bg-ink-700 text-cream-300 border-ink-500',
}

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  )
}
