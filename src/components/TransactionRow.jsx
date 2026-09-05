import { Repeat, Trash2 } from 'lucide-react'
import { getCategory } from '../lib/categories'
import { usd, local, dayLabel } from '../lib/format'
import { useStore } from '../store/useStore'

export default function TransactionRow({ tx }) {
  const deleteTransaction = useStore((s) => s.deleteTransaction)
  const cat = getCategory(tx.category, tx.type)
  const Icon = cat.icon
  const isIncome = tx.type === 'income'

  return (
    <div className="group flex items-center gap-3 rounded-2xl bg-white px-3 py-2.5">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
        style={{ background: cat.color }}
      >
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate font-semibold text-ink">{tx.note || cat.label}</p>
          {tx.recurring && <Repeat size={13} className="shrink-0 text-brand-400" />}
        </div>
        <p className="text-xs text-ink/40">
          {cat.label} &middot; {dayLabel(tx.date)}
          {tx.currencyOriginal !== 'USD' &&
            ` · ${local(tx.amountOriginal, tx.currencyOriginal)}`}
        </p>
      </div>
      <div className="text-right">
        <p className={`font-bold ${isIncome ? 'text-emerald-500' : 'text-ink'}`}>
          {isIncome ? '+' : '-'}
          {usd(tx.amountUSD)}
        </p>
        <button
          onClick={() => deleteTransaction(tx.id)}
          aria-label="Eliminar"
          className="text-ink/20 transition hover:text-rose-500"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
