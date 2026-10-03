import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, ChevronRight, RefreshCw } from 'lucide-react'
import { useStore } from '../store/useStore'
import { usd, currentMonthKey, monthLabel } from '../lib/format'
import { availableBalance, inMonth, spendByCategory, sumUSD } from '../lib/finance'
import DonutChart from '../components/DonutChart'
import TransactionRow from '../components/TransactionRow'
import { PrivacyValue } from '../components/PrivacyMode'

export default function Dashboard({ onAdd }) {
  const name = useStore((s) => s.profile.name)
  const transactions = useStore((s) => s.transactions)
  const goals = useStore((s) => s.goals)
  const rates = useStore((s) => s.rates)

  const balance = availableBalance(transactions)
  const monthTx = inMonth(transactions)
  const monthIncome = sumUSD(monthTx, 'income')
  const monthExpense = sumUSD(monthTx, 'expense')
  const byCat = spendByCategory(monthTx).slice(0, 6)
  const savedInGoals = goals.reduce((a, g) => a + (Number(g.currentUSD) || 0), 0)
  const recent = transactions.slice(0, 4)

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink/50">Hola, {name || 'crack'} 👋</p>
          <h1 className="text-xl font-extrabold">{monthLabel(currentMonthKey())}</h1>
        </div>
        <RatesBadge rates={rates} />
      </header>

      {/* Balance */}
      <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-5 text-white shadow-soft">
        <p className="text-sm text-brand-100">Balance disponible</p>
        <p className="mt-1 text-4xl font-extrabold tracking-tight"><PrivacyValue value={usd(balance)} /></p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="flex items-center gap-1 text-xs text-brand-100">
              <TrendingUp size={13} /> Ingresos
            </p>
            <p className="text-lg font-bold"><PrivacyValue value={usd(monthIncome)} /></p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="flex items-center gap-1 text-xs text-brand-100">
              <TrendingDown size={13} /> Gastos
            </p>
            <p className="text-lg font-bold"><PrivacyValue value={usd(monthExpense)} /></p>
          </div>
        </div>
        {savedInGoals > 0 && (
          <p className="mt-3 text-xs text-brand-100">
            💰 <PrivacyValue value={usd(savedInGoals)} /> guardados en tus metas
          </p>
        )}
      </div>

      {/* Donut */}
      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold">Gasto por categoría</h2>
          <Link to="/movimientos" className="flex items-center text-sm font-medium text-brand-600">
            Ver todo <ChevronRight size={16} />
          </Link>
        </div>

        {monthExpense === 0 ? (
          <EmptyHint onAdd={onAdd} />
        ) : (
          <>
            <DonutChart data={byCat} total={monthExpense} />
            <ul className="mt-4 space-y-2">
              {byCat.map((c) => (
                <li key={c.id} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: c.color }}
                    />
                    {c.label}
                  </span>
                  <span className="font-semibold">
                    <PrivacyValue value={usd(c.value)} />
                    <span className="ml-1 text-ink/40">
                      {Math.round((c.value / monthExpense) * 100)}%
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Recientes */}
      {recent.length > 0 && (
        <div>
          <h2 className="mb-2 font-bold">Últimos movimientos</h2>
          <div className="space-y-2">
            {recent.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyHint({ onAdd }) {
  return (
    <div className="py-8 text-center">
      <p className="text-4xl">🌱</p>
      <p className="mt-2 font-semibold">Aún no hay gastos este mes</p>
      <p className="text-sm text-ink/50">Registra el primero y velo acá en USD.</p>
      <button onClick={onAdd} className="btn-ghost mt-3">
        Agregar mi primer gasto
      </button>
    </div>
  )
}

function RatesBadge({ rates }) {
  if (!rates) return null
  const map = {
    live: { t: 'En vivo', c: 'bg-emerald-100 text-emerald-600' },
    cache: { t: 'Actualizado', c: 'bg-brand-100 text-brand-600' },
    fallback: { t: 'Aprox.', c: 'bg-amber-100 text-amber-600' },
  }
  const s = map[rates.source] || map.cache
  return (
    <span
      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${s.c}`}
      title={`Tipo de cambio actualizado: ${new Date(rates.fetchedAt).toLocaleString('es')}`}
    >
      <RefreshCw size={11} /> {s.t}
    </span>
  )
}
