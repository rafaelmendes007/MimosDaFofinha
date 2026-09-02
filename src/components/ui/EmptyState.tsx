import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink-500 px-6 py-12 text-center">
      {icon && <div className="text-3xl opacity-80">{icon}</div>}
      <p className="font-display text-lg text-cream-100">{title}</p>
      {description && <p className="max-w-xs text-sm text-cream-400">{description}</p>}
      {action}
    </div>
  )
}
