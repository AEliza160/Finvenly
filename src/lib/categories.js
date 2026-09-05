import {
  ShoppingBag,
  PartyPopper,
  Repeat,
  GraduationCap,
  UtensilsCrossed,
  Bus,
  HeartPulse,
  Sparkles,
  Home,
  Gift,
  Plane,
  PiggyBank,
  Wallet,
  Briefcase,
  MoreHorizontal,
} from 'lucide-react'

// Categorias de GASTO. El color se usa en el grafico de anillos.
export const EXPENSE_CATEGORIES = [
  { id: 'salidas', label: 'Salidas', icon: PartyPopper, color: '#f472b6' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: '#a78bfa' },
  { id: 'suscripciones', label: 'Suscripciones', icon: Repeat, color: '#38bdf8' },
  { id: 'educacion', label: 'Educación', icon: GraduationCap, color: '#34d399' },
  { id: 'comida', label: 'Comida', icon: UtensilsCrossed, color: '#fbbf24' },
  { id: 'transporte', label: 'Transporte', icon: Bus, color: '#fb923c' },
  { id: 'salud', label: 'Salud', icon: HeartPulse, color: '#f87171' },
  { id: 'belleza', label: 'Belleza', icon: Sparkles, color: '#e879f9' },
  { id: 'hogar', label: 'Hogar', icon: Home, color: '#60a5fa' },
  { id: 'regalos', label: 'Regalos', icon: Gift, color: '#c084fc' },
  { id: 'viajes', label: 'Viajes', icon: Plane, color: '#2dd4bf' },
  { id: 'ahorro', label: 'Ahorro', icon: PiggyBank, color: '#4ade80' },
  { id: 'otros', label: 'Otros', icon: MoreHorizontal, color: '#94a3b8' },
]

// Categorias de INGRESO.
export const INCOME_CATEGORIES = [
  { id: 'trabajo', label: 'Trabajo', icon: Briefcase, color: '#34d399' },
  { id: 'mesada', label: 'Mesada', icon: Wallet, color: '#a78bfa' },
  { id: 'emprendimiento', label: 'Emprendimiento', icon: Sparkles, color: '#f472b6' },
  { id: 'regalo', label: 'Regalo', icon: Gift, color: '#fbbf24' },
  { id: 'otros', label: 'Otros', icon: MoreHorizontal, color: '#94a3b8' },
]

const ALL = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]

export const getCategory = (id, type = 'expense') => {
  const list = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  return list.find((c) => c.id === id) || ALL.find((c) => c.id === id) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1]
}
