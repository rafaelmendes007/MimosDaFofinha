import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { LoginPage } from '@/pages/auth/LoginPage'
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { CatalogPage } from '@/pages/catalog/CatalogPage'
import { HistoryPage } from '@/pages/history/HistoryPage'
import { RequestsPage } from '@/pages/requests/RequestsPage'
import { AdminPage } from '@/pages/admin/AdminPage'

/**
 * Rotas do app. Proteção por autenticação/role (usuária vs. administrador)
 * será adicionada na Etapa 3, junto com o AuthContext e as regras de RLS.
 */
const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/onboarding', element: <OnboardingPage /> },
  { path: '/', element: <DashboardPage /> },
  { path: '/mimos', element: <CatalogPage /> },
  { path: '/memorias', element: <HistoryPage /> },
  { path: '/pedido-especial', element: <RequestsPage /> },
  { path: '/admin', element: <AdminPage /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
