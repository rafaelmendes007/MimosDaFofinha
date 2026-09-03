import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gift, History, Sparkles } from 'lucide-react'
import { Card, CardTitle, CardDescription, CreditBalance } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { useCreditBalance } from '@/hooks/useCreditBalance'
import { useTreats } from '@/hooks/useTreats'

export function DashboardPage() {
  const { profile } = useAuth()
  const { balance } = useCreditBalance(profile?.id)
  const { treats } = useTreats()

  const firstName = profile?.displayName?.split(' ')[0] || 'Fofinha'
  const treatCountLabel =
    treats.length === 0
      ? 'Nenhum mimo cadastrado ainda'
      : `${treats.length} ${treats.length === 1 ? 'mimo esperando' : 'mimos esperando'} por você`

  const quickLinks = [
    { to: '/mimos', icon: Gift, title: 'Ver mimos', description: treatCountLabel },
    { to: '/memorias', icon: History, title: 'Memórias', description: 'Reviva o que já vivemos juntos' },
    {
      to: '/pedido-especial',
      icon: Sparkles,
      title: 'Pedido especial',
      description: 'Peça algo que não está no catálogo',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-cream-400">Que bom te ver por aqui</p>
        <h1 className="font-display text-2xl font-semibold text-cream-100">Olá, {firstName} 👋</h1>
      </div>

      <CreditBalance credits={balance} />

      <div className="grid gap-3 sm:grid-cols-3">
        {quickLinks.map(({ to, icon: Icon, title, description }, index) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 + index * 0.06, ease: 'easeOut' }}
          >
            <Link to={to}>
              <Card className="h-full transition-colors hover:border-gold-500/40">
                <Icon className="size-5 text-gold-300" />
                <CardTitle className="mt-3 text-base">{title}</CardTitle>
                <CardDescription className="mt-1">{description}</CardDescription>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
