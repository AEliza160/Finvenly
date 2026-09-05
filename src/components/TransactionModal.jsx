import { useEffect, useMemo, useState } from 'react'
import { X, Repeat } from 'lucide-react'
import { useStore } from '../store/useStore'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../lib/categories'
import { CURRENCIES, getCurrency } from '../lib/currencies'
import { toUSD } from '../lib/exchange'
import { usd } from '../lib/format'

const todayInput = () => new Date().toISOString().slice(0, 10)

export default function TransactionModal({ open, onClose }) {
  const localCurrency = useStore((s) => s.profile.localCurrency)
  const rates = useStore((s) => s.rates)
  const addTransaction = useStore((s) => s.addTransaction)

  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState(localCurrency)
  const [category, setCategory] = useState('salidas')
  const [note, setNote] = useState('')
  const [recurring, setRecurring] = useState(false)
  const [date, setDate] = useState(todayInput())

  const cats = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  useEffect(() => {
    if (open) {
      setType('expense')
      setAmount('')
      setCurrency(localCurrency)
      setCategory('salidas')
      setNote('')
      setRecurring(false)
      setDate(todayInput())
    }
  }, [open, localCurrency])

  useEffect(() => {
    setCategory(type === 'income' ? 'trabajo' : 'salidas')
  }, [type])

  const rate = useMemo(() => {
    if (currency === 'USD') return 1
    return rates?.rates?.[currency] || null
  }, [rates, currency])

  const amountUSD = useMemo(() => {
    const n = parseFloat(amount)
    if (!n || !rate) return currency === 'USD' ? n || 0 : 0
    return toUSD(n, rate)
  }, [amount, rate, currency])

  if (!open) return null

  const canSave = parseFloat(amount) > 0 && (currency === 'USD' || rate)

  const save = () => {
    const n = parseFloat(amount)
    if (!canSave) return
    addTransaction({
      type,
      amountOriginal: n,
      currencyOriginal: currency,
      rateApplied: currency === 'USD' ? 1 : rate,
      amountUSD: currency === 'USD' ? n : toUSD(n, rate),
      category,
      note: note.trim(),
      recurring,
      date: new Date(date + 'T12:00:00').toISOString(),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center animate-fade-in">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[92vh] w-full max-w-md animate-slide-up overflow-y-auto rounded-t-3xl bg-brand-50 p-5 no-scrollbar">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Nuevo movimiento</h2>
          <button onClick={onClose} className="rounded-full bg-white p-1.5 text-ink/50">
            <X size={20} />
          </button>
        </div>

        {/* Tipo */}
        <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl bg-white p-1">
          {[
            { v: 'expense', l: 'Gasto' },
            { v: 'income', l: 'Ingreso' },
          ].map((o) => (
            <button
              key={o.v}
              onClick={() => setType(o.v)}
              className={`rounded-xl py-2.5 font-semibold transition ${
                type === o.v
                  ? o.v === 'income'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-brand-600 text-white'
                  : 'text-ink/50'
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>

        {/* Monto + moneda */}
        <div className="card mb-3 p-4">
          <label className="label">Monto</label>
          <div className="flex gap-2">
            <input
              autoFocus
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input flex-1 text-2xl font-bold"
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="input w-28 font-semibold"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-2 text-sm text-ink/50">
            {currency === 'USD' ? (
              <span>Se guarda en USD</span>
            ) : rate ? (
              <span>
                = <strong className="text-brand-700">{usd(amountUSD)}</strong> &middot; 1 USD ={' '}
                {rate.toLocaleString('es', { maximumFractionDigits: 2 })} {currency}
              </span>
            ) : (
              <span className="text-rose-500">
                Sin tipo de cambio para {currency}. Revisa tu conexión.
              </span>
            )}
          </div>
        </div>

        {/* Categoria */}
        <div className="card mb-3 p-4">
          <label className="label">Categoría</label>
          <div className="grid grid-cols-4 gap-2">
            {cats.map((c) => {
              const Icon = c.icon
              const active = category === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`flex flex-col items-center gap-1 rounded-2xl px-1 py-2.5 text-[11px] font-medium transition ${
                    active ? 'text-white' : 'bg-brand-50 text-ink/60'
                  }`}
                  style={active ? { background: c.color } : undefined}
                >
                  <Icon size={20} />
                  {c.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Detalle */}
        <div className="card mb-3 space-y-3 p-4">
          <div>
            <label className="label">Nota (opcional)</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ej. Café con amigas"
              className="input"
            />
          </div>
          <div>
            <label className="label">Fecha</label>
            <input
              type="date"
              value={date}
              max={todayInput()}
              onChange={(e) => setDate(e.target.value)}
              className="input"
            />
          </div>
          {type === 'expense' && (
            <button
              onClick={() => setRecurring((r) => !r)}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 transition ${
                recurring ? 'bg-brand-600 text-white' : 'bg-brand-50 text-ink/60'
              }`}
            >
              <span className="flex items-center gap-2 font-medium">
                <Repeat size={18} /> Gasto recurrente
              </span>
              <span className="text-sm opacity-80">
                {recurring ? 'Si (Netflix, Spotify...)' : 'No'}
              </span>
            </button>
          )}
        </div>

        <button onClick={save} disabled={!canSave} className="btn-primary w-full py-3.5 text-lg">
          Guardar {parseFloat(amount) > 0 && `(${usd(amountUSD)})`}
        </button>
        <div className="h-4" />
      </div>
    </div>
  )
}
