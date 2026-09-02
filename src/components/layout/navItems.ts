import { Gift, Heart, History, Sparkles, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

/**
 * Itens de navegação principal. O item "Admin" hoje aparece para todo mundo —
 * na Etapa 3, quando o AuthContext e as roles existirem, ele passa a ser
 * exibido somente para o perfil administrador.
 */
export const navItems: NavItem[] = [
  { to: '/', label: 'Início', icon: Heart },
  { to: '/mimos', label: 'Mimos', icon: Gift },
  { to: '/memorias', label: 'Memórias', icon: History },
  { to: '/pedido-especial', label: 'Pedido', icon: Sparkles },
]

export const adminNavItem: NavItem = { to: '/admin', label: 'Admin', icon: ShieldCheck }
