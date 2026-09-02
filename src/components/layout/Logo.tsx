import { cn } from '@/lib/cn'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('font-display text-lg font-semibold tracking-wide text-cream-100', className)}>
      Mimos <span className="text-gold-300">da Fofinha</span>
    </span>
  )
}
