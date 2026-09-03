import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { BackgroundGlow } from '@/components/ui/BackgroundGlow'
import { PageTransition } from '@/components/shared/PageTransition'
import { TopNav } from './TopNav'
import { BottomNav } from './BottomNav'
import { MobileHeader } from './MobileHeader'

/** Layout principal do app autenticado: navegação + transições de página. */
export function AppShell() {
  const location = useLocation()

  return (
    <div className="min-h-svh">
      <BackgroundGlow />
      <TopNav />
      <MobileHeader />
      <main className="mx-auto max-w-4xl px-4 pt-6 pb-28 md:pb-16">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  )
}
