import { useState } from 'react'
import { Plus, X, Target, Trash2, PiggyBank } from 'lucide-react'
import { useStore } from '../store/useStore'
import { usd, currentMonthKey } from '../lib/format'
import { inMonth, sumUSD } from '../lib/finance'

const EMOJIS = ['🎯', '✈️', '🎧', '💻', '👟', '🎸', '📱', '🏝️', '🎓', '💍', '📷', '🚗']

export default function Metas() {
  const goals = useStore((s) => s.goals)
  const transactions = useStore((s) => s.transactions)
  const addGoal = useStore((s) => s.addGoal)
  const [formOpen, setFormOpen] = useState(false)

  const monthIncome = sumUSD(inMonth(transactions), 'income')
  const totalSaved = goals.reduce((a, g) => a + (Number(g.currentUSD) || 0), 0)
  const totalTarget = goals.reduce((a, g) => a + (Number(g.targetUSD) || 0), 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold">Mis metas</h1>
        <button onClick={() => setFormOpen(true)} className="btn-ghost text-sm">
          <Plus size={16} /> Nueva
        </button>
      </div>

      {goals.length > 0 && (
        <div className="card p-4">
          <p className="text-sm text-ink/50">Ahorrado en bolsillos</p>
          <p className="text-2xl font-extrabold">{usd(totalSaved)}</p>
          {totalTarget > 0 && (
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-100">
              <div
                className="h-full rounded-full bg-brand-600"
                style={{ width: `${Math.min(100, (totalSaved / totalTarget) * 100)}%` }}
              />
            </div>
          )}
        </div>
      )}

      {goals.length === 0 ? (
        <div className="card py-12 text-center">
          <p className="text-4xl">🎯</p>
          <p className="mt-2 font-semibold">Crea tu primer bolsillo</p>
          <p className="mx-auto mt-1 max-w-xs text-sm text-ink/50">
            Un viaje, un concierto, ropa nueva... define cuánto necesitas en USD y asigna un % de
            tu ingreso cada mes.
          </p>
          <button onClick={() => setFormOpen(true)} className="btn-primary mt-4">
            <Plus size={18} /> Nueva meta
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((g) => (
            <GoalCard key={g.id} goal={g} monthIncome={monthIncome} />
          ))}
        </div>
      )}

      {formOpen && (
        <NewGoalForm
          onClose={() => setFormOpen(false)}
          onCreate={(g) => {
            addGoal(g)
            setFormOpen(false)
          }}
        />
      )}
    </div>
  )
}

function GoalCard({ goal, monthIncome }) {
  const contributeToGoal = useStore((s) => s.contributeToGoal)
  const updateGoal = useStore((s) => s.updateGoal)
  const deleteGoal = useStore((s) => s.deleteGoal)
  const [adding, setAdding] = useState(false)
  const [amount, setAmount] = useState('')

  const pct = goal.targetUSD > 0 ? Math.min(100, (goal.currentUSD / goal.targetUSD) * 100) : 0
  const remaining = Math.max(0, goal.targetUSD - goal.currentUSD)
  const suggested = monthIncome * (goal.allocationPct / 100)
  const done = pct >= 100

  return (
    <div className="card overflow-hidden p-4">
      <div className="flex items-start gap-3">
        <span className="text-3xl">{goal.emoji}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-bold">{goal.name}</h3>
            <button
              onClick={() => deleteGoal(goal.id)}
              className="shrink-0 text-ink/20 hover:text-rose-500"
              aria-label="Eliminar meta"
            >
              <Trash2 size={15} />
            </button>
          </div>
          <p className="text-sm text-ink/50">
            {usd(goal.currentUSD)} <span className="text-ink/30">de</span> {usd(goal.targetUSD)}
          </p>
        </div>
      </div>

      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-brand-100">
        <div
          className={`h-full rounded-full transition-all ${done ? 'bg-emerald-500' : 'bg-brand-600'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-ink/50">
        <span>{Math.round(pct)}% completado</span>
        <span>{done ? '¡Meta lograda! 🎉' : `Te faltan ${usd(remaining)}`}</span>
      </div>

      {goal.allocationPct > 0 && !done && (
        <p className="mt-2 rounded-xl bg-brand-50 px-3 py-2 text-xs text-brand-700">
          <PiggyBank size={13} className="mr-1 inline" />
          Aporte sugerido: <strong>{goal.allocationPct}%</strong> de tu ingreso mensual ={' '}
          <strong>{usd(suggested)}</strong>/mes
        </p>
      )}

      {!adding ? (
        <button onClick={() => setAdding(true)} className="btn-ghost mt-3 w-full text-sm">
          <Plus size={15} /> Aportar
        </button>
      ) : (
        <div className="mt-3 flex gap-2">
          <input
            autoFocus
            type="number"
            inputMode="decimal"
            placeholder="Monto USD"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input flex-1"
          />
          <button
            onClick={() => {
              contributeToGoal(goal.id, parseFloat(amount))
              setAmount('')
              setAdding(false)
            }}
            disabled={!(parseFloat(amount) > 0)}
            className="btn-primary px-4"
          >
            OK
          </button>
          <button
            onClick={() => {
              setAdding(false)
              setAmount('')
            }}
            className="rounded-2xl bg-brand-50 px-3 text-ink/50"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {suggested > 0 && !done && (
        <button
          onClick={() => contributeToGoal(goal.id, suggested)}
          className="mt-2 w-full text-center text-xs font-medium text-brand-600"
        >
          Aportar el sugerido ({usd(suggested)})
        </button>
      )}
    </div>
  )
}

function NewGoalForm({ onClose, onCreate }) {
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [pct, setPct] = useState('10')
  const [deadline, setDeadline] = useState('')
  const [emoji, setEmoji] = useState('🎯')

  const valid = name.trim() && parseFloat(target) > 0

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center animate-fade-in">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md animate-slide-up rounded-t-3xl bg-brand-50 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Target size={20} className="text-brand-600" /> Nueva meta
          </h2>
          <button onClick={onClose} className="rounded-full bg-white p-1.5 text-ink/50">
            <X size={20} />
          </button>
        </div>

        <div className="card space-y-3 p-4">
          <div>
            <label className="label">Nombre</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Concierto de Tini"
              className="input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Meta (USD)</label>
              <input
                type="number"
                inputMode="decimal"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="200"
                className="input"
              />
            </div>
            <div>
              <label className="label">% de ingreso</label>
              <input
                type="number"
                inputMode="decimal"
                value={pct}
                onChange={(e) => setPct(e.target.value)}
                placeholder="10"
                className="input"
              />
            </div>
          </div>
          <div>
            <label className="label">Fecha límite (opcional)</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="label">Icono</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`h-10 w-10 rounded-xl text-xl transition ${
                    emoji === e ? 'bg-brand-600' : 'bg-brand-50'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() =>
            onCreate({
              name: name.trim(),
              targetUSD: parseFloat(target),
              allocationPct: Math.max(0, parseFloat(pct) || 0),
              deadline,
              emoji,
            })
          }
          disabled={!valid}
          className="btn-primary mt-3 w-full py-3.5 text-lg"
        >
          Crear meta
        </button>
        <div className="h-4" />
      </div>
    </div>
  )
}
