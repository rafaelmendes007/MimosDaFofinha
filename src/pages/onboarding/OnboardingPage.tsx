import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BackgroundGlow, Button } from '@/components/ui'

/**
 * Carta de boas-vindas. Edite o texto abaixo livremente — é o único lugar
 * que precisa mudar para personalizar a mensagem completa.
 * A lógica de "mostrar só no primeiro acesso" será conectada na Etapa 4,
 * junto com o restante do fluxo de onboarding e o Supabase.
 */
const LETTER_TITLE = 'Feliz 3 anos, Fofinha'
const LETTER_BODY = `Três anos atrás a nossa história começou, e de lá pra cá cada dia ao seu
lado virou um motivo a mais para sorrir. Esse app é um pedacinho disso: um
lugar só nosso, com mimos, memórias e tudo que a gente ainda vai viver
juntos.

Espero que cada resgate aqui dentro vire um momento de verdade — e que
daqui a mais três anos a gente esteja lembrando de tudo isso com o
coração cheio.`

export function OnboardingPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 py-16">
      <BackgroundGlow />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md text-center"
      >
        <span className="text-3xl">🤍</span>
        <h1 className="text-shimmer mt-4 font-display text-4xl leading-tight font-semibold text-balance">
          {LETTER_TITLE}
        </h1>
        <p className="mt-6 text-pretty whitespace-pre-line text-cream-300">{LETTER_BODY}</p>

        <Link to="/" className="mt-10 inline-block">
          <Button size="lg" className="px-10">
            Entrar no aplicativo
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
