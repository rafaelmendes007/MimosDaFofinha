import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { LoginPage } from '@/pages/auth/LoginPage'
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage'
import { AppShell } from '@/components/layout/AppShell'
import { Spinner } from '@/components/ui'
import { RequireAuth } from './RequireAuth'
import { RequireAdmin } from './RequireAdmin'

// Carregadas sob demanda: mantêm o primeiro carregamento (login/onboarding) leve.
const DashboardPage = lazy(() =>
  import('@/pages/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const CatalogPage = lazy(() =>
  import('@/pages/catalog/CatalogPage').then((m) => ({ default: m.CatalogPage })),
)
const HistoryPage = lazy(() =>
  import('@/pages/history/HistoryPage').then((m) => ({ default: m.HistoryPage })),
)
const RequestsPage = lazy(() =>
  import('@/pages/requests/RequestsPage').then((m) => ({ default: m.RequestsPage })),
)
const AdminPage = lazy(() => import('@/pages/admin/AdminPage').then((m) => ({ default: m.AdminPage })))

function RouteFallback() {
  return (
    <div className="flex min-h-[50svh] items-center justify-center">
      <Spinner />
    </div>
  )
}

function lazyRoute(node: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{node}</Suspense>
}

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      { path: '/onboarding', element: <OnboardingPage /> },
      {
        element: <AppShell />,
        children: [
          { path: '/', element: lazyRoute(<DashboardPage />) },
          { path: '/mimos', element: lazyRoute(<CatalogPage />) },
          { path: '/memorias', element: lazyRoute(<HistoryPage />) },
          { path: '/pedido-especial', element: lazyRoute(<RequestsPage />) },
          {
            element: <RequireAdmin />,
            children: [{ path: '/admin', element: lazyRoute(<AdminPage />) }],
          },
        ],
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
