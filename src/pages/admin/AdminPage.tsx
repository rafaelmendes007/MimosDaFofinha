import { useState } from 'react'
import { EmptyState, Spinner } from '@/components/ui'
import { AdminTabs } from '@/components/admin/AdminTabs'
import { OverviewTab } from '@/components/admin/OverviewTab'
import { CreditsTab } from '@/components/admin/CreditsTab'
import { TreatsTab } from '@/components/admin/TreatsTab'
import { RequestsTab } from '@/components/admin/RequestsTab'
import { usePrimaryUser } from '@/hooks/usePrimaryUser'
import { useAdminRequests } from '@/hooks/useAdminRequests'
import type { AdminTab } from '@/components/admin/AdminTabs'

export function AdminPage() {
  const { primaryUser, isLoading } = usePrimaryUser()
  const { requests } = useAdminRequests()
  const [tab, setTab] = useState<AdminTab>('overview')

  const pendingCount = requests.filter((request) => request.status === 'pending').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-cream-100">Área administrativa</h1>
        <p className="text-sm text-cream-400">Visão geral para o patrocinador oficial do amor.</p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      )}

      {!isLoading && !primaryUser && (
        <EmptyState
          icon="🤍"
          title="Nenhuma usuária encontrada ainda"
          description="Crie a conta dela em Authentication > Users no Supabase para começar a gerenciar mimos e créditos."
        />
      )}

      {!isLoading && primaryUser && (
        <>
          <AdminTabs active={tab} onChange={setTab} pendingCount={pendingCount} />

          {tab === 'overview' && <OverviewTab userId={primaryUser.id} />}
          {tab === 'credits' && <CreditsTab userId={primaryUser.id} />}
          {tab === 'treats' && <TreatsTab userId={primaryUser.id} />}
          {tab === 'requests' && <RequestsTab />}
        </>
      )}
    </div>
  )
}
