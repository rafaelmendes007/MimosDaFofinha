import { motion } from 'framer-motion'
import { BackgroundGlow, Button, Card, Input } from '@/components/ui'
import { Logo } from '@/components/layout/Logo'

export function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 py-12">
      <BackgroundGlow />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <Logo className="text-2xl" />
          <p className="text-sm text-cream-400">Entre para ver seus mimos ✨</p>
        </div>

        <Card className="space-y-4">
          <Input type="email" label="E-mail" placeholder="voce@exemplo.com" autoComplete="email" />
          <Input type="password" label="Senha" placeholder="••••••••" autoComplete="current-password" />
          <Button className="w-full" size="lg">
            Entrar
          </Button>
          <p className="text-center text-xs text-cream-400">
            Autenticação via Supabase será conectada na Etapa 3.
          </p>
        </Card>
      </motion.div>
    </div>
  )
}
