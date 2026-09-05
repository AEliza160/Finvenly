import { NavLink } from 'react-router-dom'
import { Home, ArrowLeftRight, Target, Sparkles } from 'lucide-react'

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/movimientos', label: 'Movimientos', icon: ArrowLeftRight },
  { to: '/metas', label: 'Metas', icon: Target },
  { to: '/reporte', label: 'Wrapped', icon: Sparkles },
]

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-brand-100 bg-white/90 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur">
      <ul className="flex items-center justify-around">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex w-16 flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium transition ${
                  isActive ? 'text-brand-700' : 'text-ink/40'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} strokeWidth={isActive ? 2.6 : 2} />
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
