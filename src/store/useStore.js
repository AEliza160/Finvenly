import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { uid } from '../lib/format'

export const useStore = create(
  persist(
    (set, get) => ({
      profile: {
        name: '',
        localCurrency: 'USD',
        onboarded: false,
      },
      transactions: [],
      goals: [],
      rates: null,

      // --- Perfil ---
      setProfile: (patch) =>
        set((s) => ({ profile: { ...s.profile, ...patch } })),

      completeOnboarding: ({ name, localCurrency }) =>
        set((s) => ({
          profile: { ...s.profile, name: name.trim(), localCurrency, onboarded: true },
        })),

      resetAll: () =>
        set({
          profile: { name: '', localCurrency: 'USD', onboarded: false },
          transactions: [],
          goals: [],
        }),

      setRates: (rates) => set({ rates }),

      // --- Sincronización con Google Sheets / API ---
      fetchData: async () => {
        try {
          const [resTx, resGoals] = await Promise.all([
            fetch('/api/transactions'),
            fetch('/api/goals')
          ])
          if (resTx.ok && resGoals.ok) {
            const transactions = await resTx.json()
            const goals = await resGoals.json()
            set({ 
              transactions: Array.isArray(transactions) ? transactions : [], 
              goals: Array.isArray(goals) ? goals : [] 
            })
          }
        } catch (error) {
          console.error("Error al sincronizar con Google Sheets:", error)
        }
      },

      // --- Transacciones ---
      addTransaction: async (tx) => {
        const nuevaTx = {
          id: uid(),
          recurring: false,
          note: '',
          date: new Date().toISOString(),
          ...tx,
        }

        // Actualización optimista en la interfaz
        set((s) => ({
          transactions: [nuevaTx, ...s.transactions],
        }))

        // Enviar al backend (Google Sheets)
        try {
          await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaTx),
          })
        } catch (error) {
          console.error("Error al guardar la transacción en el servidor:", error)
        }
      },

      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),

      // --- Metas / Bolsillos ---
      addGoal: async (goal) => {
        const nuevaMeta = {
          id: uid(),
          currentUSD: 0,
          allocationPct: 0,
          deadline: '',
          emoji: '\u{1F3AF}',
          createdAt: new Date().toISOString(),
          ...goal,
        }

        set((s) => ({
          goals: [...s.goals, nuevaMeta],
        }))

        try {
          await fetch('/api/goals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaMeta),
          })
        } catch (error) {
          console.error("Error al guardar la meta en el servidor:", error)
        }
      },

      updateGoal: (id, patch) =>
        set((s) => ({
          goals: s.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)),
        })),

      deleteGoal: (id) =>
        set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      contributeToGoal: (id, amountUSD) => {
        const amt = Number(amountUSD) || 0
        if (amt <= 0) return
        const goal = get().goals.find((g) => g.id === id)
        if (!goal) return
        
        get().addTransaction({
          type: 'expense',
          amountOriginal: amt,
          currencyOriginal: 'USD',
          rateApplied: 1,
          amountUSD: amt,
          category: 'ahorro',
          note: `Aporte a: ${goal.name}`,
          goalId: id,
        })

        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === id ? { ...g, currentUSD: Math.max(0, g.currentUSD + amt) } : g,
          ),
        }))
      },
    }),
    {
      name: 'finvely.store.v1',
      partialize: (s) => ({
        profile: s.profile,
        transactions: s.transactions,
        goals: s.goals,
      }),
    },
  ),
)