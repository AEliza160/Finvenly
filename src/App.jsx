import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useStore } from './store/useStore'
import { getRates } from './lib/exchange'
import Onboarding from './components/Onboarding'
import BottomNav from './components/BottomNav'
import TransactionModal from './components/TransactionModal'
import Dashboard from './pages/Dashboard'
import Movimientos from './pages/Movimientos'
import Metas from './pages/Metas'
import Reporte from './pages/Reporte'

export default function App() {
  const onboarded = useStore((s) => s.profile.onboarded)
  const setRates = useStore((s) => s.setRates)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    let active = true
    getRates().then((r) => active && setRates(r))
    return () => {
      active = false
    }
  }, [setRates])

  if (!onboarded) return <Onboarding />

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col bg-brand-50">
      <main className="flex-1 px-5 pb-32 pt-6">
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
  )
}
