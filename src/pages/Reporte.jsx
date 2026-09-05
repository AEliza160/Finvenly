import { useMemo, useState } from 'react'
import { Share2, Check } from 'lucide-react'
import { useStore } from '../store/useStore'
import { usd, monthLabel, currentMonthKey, dayLabel } from '../lib/format'
import { availableMonths, monthlyStats, spendByCategory, inMonth } from '../lib/finance'
import { getCategory } from '../lib/categories'
import DonutChart from '../components/DonutChart'

export default function Reporte() {
  const transactions = useStore((s) => s.transactions)
  const name = useStore((s) => s.profile.name)
  const resetAll = useStore((s) => s.resetAll)

  const months = useMemo(() => availableMonths(transactions), [transactions])
  const [selected, setSelected] = useState(currentMonthKey())
  const stats = useMemo(() => monthlyStats(transactions, selected), [transactions, selected])
  const byCat = useMemo(
    () => spendByCategory(inMonth(transactions, selected)).slice(0, 5),
    [transactions, selected],
  )
  const [copied, setCopied] = useState(false)

  const summaryText = buildSummary(name, selected, stats)

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Mi FINVELY Wrapped', text: summaryText })
        return
      }
    } catch {
      /* usuario cancelo */
    }
    try {
      await navigator.clipboard.writeText(summaryText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* sin portapapeles */
    }
  }

  const empty = stats.count === 0

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">Tu Wrapped financiero ✨</h1>
      <p className="-mt-2 text-sm text-ink/50">Tu mes en números, listo para compartir.</p>

      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
        {months.map((m) => (
          <button
            key={m}
            onClick={() => setSelected(m)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              selected === m ? 'bg-brand-600 text-white' : 'bg-white text-ink/50'
            }`}
          >
            {monthLabel(m)}
          </button>
        ))}
      </div>

      {empty ? (
        <div className="card py-12 text-center">
          <p className="text-4xl">📊</p>
          <p className="mt-2 font-semibold">Sin datos para {monthLabel(selected)}</p>
          <p className="text-sm text-ink/50">Registra tus movimientos y vuelve a fin de mes.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-5 text-white shadow-soft">
            <p className="text-sm text-brand-100">{monthLabel(selected)}</p>
            <p className="text-lg font-semibold">
              {name || 'Este mes'}, moviste <strong>{usd(stats.income + stats.expense)}</strong> en
              total.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <Stat label="Ingresaste" value={usd(stats.income)} />
              <Stat label="Gastaste" value={usd(stats.expense)} />
              <Stat label="Ahorraste" value={usd(stats.saved)} />
              <Stat
                label="Tasa de ahorro"
                value={`${Math.round(stats.savingRate * 100)}%`}
                highlight={stats.savingRate >= 0.1}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <BigCard emoji="🏆" title="Categoría estrella">
              {stats.topCategory ? (
                <>
                  <p className="text-lg font-bold">{stats.topCategory.label}</p>
                  <p className="text-sm text-ink/50">{usd(stats.topCategory.value)}</p>
                </>
              ) : (
                <p className="text-sm text-ink/50">Sin gastos</p>
              )}
            </BigCard>
            <BigCard emoji="🔥" title="Día de mayor gasto">
              {stats.topDay ? (
                <>
                  <p className="text-lg font-bold">{dayLabel(stats.topDay.date)}</p>
                  <p className="text-sm text-ink/50">{usd(stats.topDay.value)}</p>
                </>
              ) : (
                <p className="text-sm text-ink/50">-</p>
              )}
            </BigCard>
            <BigCard emoji="🧾" title="Movimientos">
              <p className="text-lg font-bold">{stats.count}</p>
              <p className="text-sm text-ink/50">~{usd(stats.avgExpense)} por gasto</p>
            </BigCard>
            <BigCard emoji="🔁" title="Suscripciones">
              <p className="text-lg font-bold">{usd(stats.recurringTotal)}</p>
              <p className="text-sm text-ink/50">{stats.recurringCount} recurrentes</p>
            </BigCard>
          </div>

          {byCat.length > 0 && (
            <div className="card p-5">
              <h2 className="mb-3 font-bold">A dónde fue tu plata</h2>
              <DonutChart data={byCat} total={stats.expense} centerLabel="Total gastado" />
              <ul className="mt-4 space-y-2">
                {byCat.map((c) => (
                  <li key={c.id} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                      {c.label}
                    </span>
                    <span className="font-semibold">{usd(c.value)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={share} className="btn-primary w-full py-3.5">
            {copied ? (
              <>
                <Check size={18} /> Copiado
              </>
            ) : (
              <>
                <Share2 size={18} /> Compartir mi Wrapped
              </>
            )}
          </button>
        </>
      )}

      <div className="pt-6 text-center">
        <button
          onClick={() => {
            if (confirm('Esto borra tu perfil y todos tus movimientos. ¿Continuar?')) resetAll()
          }}
          className="text-xs font-medium text-ink/30"
        >
          Reiniciar FINVELY
        </button>
      </div>
    </div>
  )
}

function Stat({ label, value, highlight }) {
  return (
    <div className={`rounded-2xl p-3 ${highlight ? 'bg-accent/30' : 'bg-white/10'}`}>
      <p className="text-xs text-brand-100">{label}</p>
      <p className="text-lg font-extrabold">{value}</p>
    </div>
  )
}

function BigCard({ emoji, title, children }) {
  return (
    <div className="card p-4">
      <p className="text-2xl">{emoji}</p>
      <p className="mt-1 text-xs font-medium text-ink/40">{title}</p>
      <div className="mt-0.5">{children}</div>
    </div>
  )
}

function buildSummary(name, monthKey, s) {
  const top = s.topCategory ? getCategory(s.topCategory.id, 'expense').label : '-'
  return [
    `Mi FINVELY Wrapped - ${monthLabel(monthKey)}`,
    ``,
    `Ingresos: ${usd(s.income)}`,
    `Gastos: ${usd(s.expense)}`,
    `Ahorro: ${usd(s.saved)} (${Math.round(s.savingRate * 100)}% de mis ingresos)`,
    `Categoria estrella: ${top}`,
    `${s.count} movimientos registrados`,
    ``,
    `Todo en USD, con FINVELY.`,
  ].join('\n')
}
