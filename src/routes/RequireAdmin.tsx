import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

/**
 * Bloqueia a área administrativa para quem não é admin. Isto é só a camada
 * de UX — a segurança de verdade vem das políticas RLS no banco, que negam
 * qualquer leitura/escrita administrativa para quem não tem role = 'admin'.
 */
export function RequireAdmin() {
  const { isAdmin } = useAuth()
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />
}
