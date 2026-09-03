import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { LoginPage } from '@/pages/auth/LoginPage'
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { CatalogPage } from '@/pages/catalog/CatalogPage'
import { HistoryPage } from '@/pages/history/HistoryPage'
import { RequestsPage } from '@/pages/requests/RequestsPage'
import { AdminPage } from '@/pages/admin/AdminPage'
import { AppShell } from '@/components/layout/AppShell'
import { RequireAuth } from './RequireAuth'
import { RequireAdmin } from './RequireAdmin'

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      { path: '/onboarding', element: <OnboardingPage /> },
      {
        element: <AppShell />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/mimos', element: <CatalogPage /> },
          { path: '/memorias', element: <HistoryPage /> },
          { path: '/pedido-especial', element: <RequestsPage /> },
          {
            element: <RequireAdmin />,
            children: [{ path: '/admin', element: <AdminPage /> }],
          },
        ],
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
