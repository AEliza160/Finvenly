import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { uid } from '../lib/format'

/**
 * Estado global de FINVELY, persistido en localStorage.
 *
 * transaction: {
 *   id, type: 'income' | 'expense',
 *   amountOriginal, currencyOriginal, rateApplied, amountUSD,
 *   category, note, recurring, date (ISO)
 * }
 * goal: { id, name, targetUSD, currentUSD, allocationPct, deadline, emoji, createdAt }
 */
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
      rates: null, // { rates, fetchedAt, source }

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

      // --- Tipo de cambio ---
      setRates: (rates) => set({ rates }),

      // --- Transacciones ---
      addTransaction: (tx) =>
        set((s) => ({
          transactions: [
            {
              id: uid(),
              recurring: false,
              note: '',
              date: new Date().toISOString(),
              ...tx,
            },
            ...s.transactions,
          ],
        })),

      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),

      // --- Metas / Bolsillos ---
      addGoal: (goal) =>
        set((s) => ({
          goals: [
            ...s.goals,
            {
              id: uid(),
              currentUSD: 0,
              allocationPct: 0,
              deadline: '',
              emoji: '\u{1F3AF}',
              createdAt: new Date().toISOString(),
              ...goal,
            },
          ],
        })),

      updateGoal: (id, patch) =>
        set((s) => ({
          goals: s.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)),
        })),

      deleteGoal: (id) =>
        set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      // Aporta a un bolsillo: mueve dinero del disponible a la meta
      // y deja registro como transaccion de ahorro.
      contributeToGoal: (id, amountUSD) => {
        const amt = Number(amountUSD) || 0
        if (amt <= 0) return
        const goal = get().goals.find((g) => g.id === id)
        if (!goal) return
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === id ? { ...g, currentUSD: Math.max(0, g.currentUSD + amt) } : g,
          ),
          transactions: [
            {
              id: uid(),
              type: 'expense',
              amountOriginal: amt,
              currencyOriginal: 'USD',
              rateApplied: 1,
              amountUSD: amt,
              category: 'ahorro',
              note: `Aporte a: ${goal.name}`,
              recurring: false,
              goalId: id,
              date: new Date().toISOString(),
            },
            ...s.transactions,
          ],
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
