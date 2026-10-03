import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Eye, EyeOff, Plus } from 'lucide-react'
import { useStore } from './store/useStore'
import { getRates } from './lib/exchange'
import Onboarding from './components/Onboarding'
import BottomNav from './components/BottomNav'
import TransactionModal from './components/TransactionModal'
import Dashboard from './pages/Dashboard'
import Movimientos from './pages/Movimientos'
import Metas from './pages/Metas'
import Reporte from './pages/Reporte'
import { PrivacyProvider } from './components/PrivacyMode'

export default function App() {
  const onboarded = useStore((s) => s.profile.onboarded)
  const setRates = useStore((s) => s.setRates)
  const [modalOpen, setModalOpen] = useState(false)
  const [privacyHidden, setPrivacyHidden] = useState(false)

  useEffect(() => {
    let active = true
    getRates().then((r) => active && setRates(r))
    return () => {
      active = false
    }
  }, [setRates])

  if (!onboarded) return <Onboarding />

  return (
    <PrivacyProvider hidden={privacyHidden}>
      <div className="mx-auto flex min-h-full max-w-md flex-col bg-brand-50">
        <main className="flex-1 px-5 pb-32 pt-6">
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={() => setPrivacyHidden((hidden) => !hidden)}
              aria-label={privacyHidden ? 'Mostrar saldos y montos' : 'Ocultar saldos y montos'}
              aria-pressed={privacyHidden}
              title={privacyHidden ? 'Mostrar saldos y montos' : 'Ocultar saldos y montos'}
              className="rounded-full bg-white p-2 text-ink/60 shadow-sm transition hover:text-brand-600"
            >
              {privacyHidden ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <Routes>
            <Route path="/" element={<Dashboard onAdd={() => setModalOpen(true)} />} />
            <Route path="/movimientos" element={<Movimientos />} />
            <Route path="/metas" element={<Metas />} />
            <Route path="/reporte" element={<Reporte />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <button
          onClick={() => setModalOpen(true)}
          aria-label="Agregar movimiento"
          className="fixed bottom-24 left-1/2 z-30 -translate-x-1/2 rounded-full bg-brand-600 p-4 text-white shadow-soft transition active:scale-90"
        >
          <Plus size={26} strokeWidth={2.6} />
        </button>

        <BottomNav />

        <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </PrivacyProvider>
  )
}
