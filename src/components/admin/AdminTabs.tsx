import { cn } from '@/lib/cn'

export type AdminTab = 'overview' | 'credits' | 'treats' | 'requests'

const TABS: { id: AdminTab; label: string }[] = [
  { id: 'overview', label: 'Visão geral' },
  { id: 'credits', label: 'Créditos' },
  { id: 'treats', label: 'Mimos' },
  { id: 'requests', label: 'Pedidos' },
]

interface AdminTabsProps {
  active: AdminTab
  onChange: (tab: AdminTab) => void
  pendingCount?: number
}

export function AdminTabs({ active, onChange, pendingCount = 0 }: AdminTabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-full border border-ink-600 bg-ink-800/60 p-1">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative flex-1 rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
            active === tab.id
              ? 'bg-ink-700 text-gold-300'
              : 'text-cream-300 hover:text-cream-100',
          )}
        >
          {tab.label}
          {tab.id === 'requests' && pendingCount > 0 && (
            <span className="ml-1.5 inline-flex size-4 items-center justify-center rounded-full bg-wine-500 text-[10px] text-cream-100">
              {pendingCount}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
