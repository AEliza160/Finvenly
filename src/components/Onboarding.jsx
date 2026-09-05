import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { useStore } from '../store/useStore'
import { CURRENCIES } from '../lib/currencies'

export default function Onboarding() {
  const completeOnboarding = useStore((s) => s.completeOnboarding)
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [currency, setCurrency] = useState('')

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col justify-between bg-gradient-to-b from-brand-600 to-brand-800 px-6 py-10 text-white">
      <div>
        <div className="mb-2 text-3xl font-extrabold tracking-tight">FINVELY</div>
        <p className="text-brand-100">
          Tu dinero, siempre en dólares. Sin importar cuánto se mueva tu moneda local.
        </p>
      </div>

      {step === 0 && (
        <div className="animate-pop space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">¡Hola! ¿Cómo te llamas?</h1>
            <p className="text-brand-100/80">Lo usamos solo para saludarte.</p>
          </div>
          <input
            autoFocus
            className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3.5 text-lg text-white placeholder-white/50 outline-none focus:border-white/60"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && name.trim() && setStep(1)}
          />
          <button
            disabled={!name.trim()}
            onClick={() => setStep(1)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-lg font-semibold text-brand-700 transition active:scale-95 disabled:opacity-40"
          >
            Seguir <ArrowRight size={20} />
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="animate-pop space-y-5">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">¿Cuál es tu moneda local?</h1>
            <p className="text-brand-100/80">
              Registras tus gastos en tu moneda y FINVELY los convierte a USD al instante.
            </p>
          </div>
          <div className="no-scrollbar max-h-72 space-y-2 overflow-y-auto pr-1">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => setCurrency(c.code)}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                  currency === c.code
                    ? 'border-white bg-white text-brand-700'
                    : 'border-white/20 bg-white/10 text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">{c.flag}</span>
                  <span className="font-medium">{c.name}</span>
                </span>
                <span className="flex items-center gap-2 text-sm opacity-70">
                  {c.code}
                  {currency === c.code && <Check size={16} />}
                </span>
              </button>
            ))}
          </div>
          <button
            disabled={!currency}
            onClick={() => completeOnboarding({ name, localCurrency: currency })}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-lg font-semibold text-brand-700 transition active:scale-95 disabled:opacity-40"
          >
            Empezar <ArrowRight size={20} />
          </button>
        </div>
      )}

      <div className="flex justify-center gap-2 pt-6">
        {[0, 1].map((i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              step === i ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
