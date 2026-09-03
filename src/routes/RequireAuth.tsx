import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { BackgroundGlow, Spinner } from '@/components/ui'

/** Bloqueia rotas para quem não está autenticado e força o onboarding pendente. */
export function RequireAuth() {
  const { session, profile, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <BackgroundGlow />
        <Spinner />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const onboardingPending = profile && !profile.onboardingCompletedAt
  if (onboardingPending && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  return <Outlet />
}
