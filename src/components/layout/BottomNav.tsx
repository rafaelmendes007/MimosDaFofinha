import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { navItems } from './navItems'

export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-700/80 bg-ink-900/90 backdrop-blur-lg md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className="relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-cream-400"
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="bottom-nav-active"
                      className="absolute inset-x-3 top-0.5 h-9 rounded-2xl bg-ink-700/80"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon
                    className={cn(
                      'relative size-5 transition-colors',
                      isActive ? 'text-gold-300' : 'text-cream-400',
                    )}
                    strokeWidth={isActive ? 2.25 : 1.75}
                  />
                  <span className={cn('relative transition-colors', isActive && 'text-cream-100')}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
