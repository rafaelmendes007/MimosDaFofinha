import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { Logo } from './Logo'
import { navItems } from './navItems'

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 hidden border-b border-ink-700/70 bg-ink-950/80 backdrop-blur-lg md:block">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Logo />
        <ul className="flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-ink-700 text-gold-300'
                      : 'text-cream-300 hover:bg-ink-800 hover:text-cream-100',
                  )
                }
              >
                <Icon className="size-4" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
