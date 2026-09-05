import { getCurrency } from './currencies'

export const usd = (value) => {
  const n = Number(value) || 0
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })
}

export const local = (value, code) => {
  const c = getCurrency(code)
  const n = Number(value) || 0
  const digits = ['CLP', 'PYG', 'COP', 'ARS', 'CRC', 'VES'].includes(code) ? 0 : 2
  return `${c.symbol} ${n.toLocaleString('es', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`
}

export const monthKey = (dateStr) => {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export const currentMonthKey = () => monthKey(new Date().toISOString())

export const monthLabel = (key) => {
  const [y, m] = key.split('-').map(Number)
  const d = new Date(y, m - 1, 1)
  const s = d.toLocaleDateString('es', { month: 'long', year: 'numeric' })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// Clave de dia en horario local: 'YYYY-MM-DD'
export const localDayKey = (dateStr) => {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`
}

export const dayLabel = (dateStr) => {
  // Acepta ISO completo o 'YYYY-MM-DD' (se interpreta como hora local, no UTC).
  const d = /^\d{4}-\d{2}-\d{2}$/.test(dateStr)
    ? new Date(`${dateStr}T12:00:00`)
    : new Date(dateStr)
  const today = new Date()
  const yst = new Date()
  yst.setDate(today.getDate() - 1)
  const same = (a, b) => a.toDateString() === b.toDateString()
  if (same(d, today)) return 'Hoy'
  if (same(d, yst)) return 'Ayer'
  return d.toLocaleDateString('es', { day: 'numeric', month: 'short' })
}

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
