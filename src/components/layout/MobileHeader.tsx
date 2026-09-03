import { LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Logo } from './Logo'

/** Cabeçalho enxuto para telas pequenas — a navegação principal fica na BottomNav. */
export function MobileHeader() {
  const { signOut } = useAuth()

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-ink-700/70 bg-ink-950/80 px-4 py-3 backdrop-blur-lg md:hidden">
      <Logo className="text-base" />
      <button
        type="button"
        onClick={() => void signOut()}
        aria-label="Sair"
        className="rounded-full p-2 text-cream-400 transition-colors hover:bg-ink-800 hover:text-cream-100"
      >
        <LogOut className="size-4" />
      </button>
    </header>
  )
}
