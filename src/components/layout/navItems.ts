import { Gift, Heart, History, Sparkles, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

/**
 * Itens de navegação principal. O item "Admin" (adminNavItem) é adicionado
 * condicionalmente pela TopNav/BottomNav, somente quando `isAdmin` é true.
 */
export const navItems: NavItem[] = [
  { to: '/', label: 'Início', icon: Heart },
  { to: '/mimos', label: 'Mimos', icon: Gift },
  { to: '/memorias', label: 'Memórias', icon: History },
  { to: '/pedido-especial', label: 'Pedido', icon: Sparkles },
]

export const adminNavItem: NavItem = { to: '/admin', label: 'Admin', icon: ShieldCheck }
