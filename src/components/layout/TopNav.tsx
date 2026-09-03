import { NavLink } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useAuth } from '@/contexts/AuthContext'
import { Logo } from './Logo'
import { adminNavItem, navItems } from './navItems'

export function TopNav() {
  const { isAdmin, signOut } = useAuth()
  const items = isAdmin ? [...navItems, adminNavItem] : navItems

  return (
    <header className="sticky top-0 z-40 hidden border-b border-ink-700/70 bg-ink-950/80 backdrop-blur-lg md:block">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Logo />
        <div className="flex items-center gap-2">
          <ul className="flex items-center gap-1">
            {items.map(({ to, label, icon: Icon }) => (
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
          <button
            type="button"
            onClick={() => void signOut()}
            aria-label="Sair"
            className="rounded-full p-2.5 text-cream-400 transition-colors hover:bg-ink-800 hover:text-cream-100"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
