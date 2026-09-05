import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore'
import { usd, monthKey, monthLabel } from '../lib/format'
import TransactionRow from '../components/TransactionRow'

const FILTERS = [
  { v: 'all', l: 'Todo' },
  { v: 'expense', l: 'Gastos' },
  { v: 'income', l: 'Ingresos' },
  { v: 'recurring', l: 'Recurrentes' },
]

export default function Movimientos() {
  const transactions = useStore((s) => s.transactions)
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => {
    if (filter === 'all') return transactions
    if (filter === 'recurring') return transactions.filter((t) => t.recurring)
    return transactions.filter((t) => t.type === filter)
  }, [transactions, filter])

  const groups = useMemo(() => {
    const map = new Map()
    filtered.forEach((t) => {
      const k = monthKey(t.date)
      if (!map.has(k)) map.set(k, [])
      map.get(k).push(t)
    })
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]))
  }, [filtered])

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">Movimientos</h1>

      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
        {FILTERS.map((f) => (
          <button
            key={f.v}
            onClick={() => setFilter(f.v)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              filter === f.v ? 'bg-brand-600 text-white' : 'bg-white text-ink/50'
            }`}
          >
            {f.l}
          </button>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="card py-12 text-center">
          <p className="text-4xl">🔍</p>
          <p className="mt-2 font-semibold">Nada por acá</p>
          <p className="text-sm text-ink/50">Agrega un movimiento con el botón +.</p>
        </div>
      )}

      {groups.map(([key, list]) => {
        const income = list.filter((t) => t.type === 'income').reduce((a, t) => a + t.amountUSD, 0)
        const expense = list.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amountUSD, 0)
        return (
          <section key={key}>
            <div className="mb-2 flex items-center justify-between px-1">
              <h2 className="text-sm font-bold text-ink/60">{monthLabel(key)}</h2>
              <span className="text-xs text-ink/40">
                <span className="text-emerald-500">+{usd(income)}</span>{' '}
                <span className="text-rose-400">-{usd(expense)}</span>
              </span>
            </div>
            <div className="space-y-2">
              {list.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
