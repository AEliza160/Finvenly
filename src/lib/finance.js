import { monthKey, currentMonthKey, localDayKey } from './format'
import { getCategory } from './categories'

export const sumUSD = (txs, type) =>
  txs
    .filter((t) => (type ? t.type === type : true))
    .reduce((acc, t) => acc + (Number(t.amountUSD) || 0), 0)

// Balance disponible = ingresos - gastos (los aportes a metas ya cuentan como gasto).
export const availableBalance = (txs) =>
  sumUSD(txs, 'income') - sumUSD(txs, 'expense')

export const inMonth = (txs, key = currentMonthKey()) =>
  txs.filter((t) => monthKey(t.date) === key)

// Agrupa gastos por categoria para el grafico de anillos.
export const spendByCategory = (txs) => {
  const map = new Map()
  txs
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const cat = getCategory(t.category, 'expense')
      const prev = map.get(cat.id) || { ...cat, value: 0, count: 0 }
      prev.value += Number(t.amountUSD) || 0
      prev.count += 1
      map.set(cat.id, prev)
    })
  return [...map.values()].sort((a, b) => b.value - a.value)
}

// Meses disponibles con movimientos, mas reciente primero.
export const availableMonths = (txs) => {
  const set = new Set(txs.map((t) => monthKey(t.date)))
  set.add(currentMonthKey())
  return [...set].sort().reverse()
}

// Estadisticas tipo "Wrapped" para un mes.
export const monthlyStats = (allTxs, key) => {
  const txs = inMonth(allTxs, key)
  const income = sumUSD(txs, 'income')
  const expense = sumUSD(txs, 'expense')
  const byCat = spendByCategory(txs)
  const savingTxs = txs.filter((t) => t.category === 'ahorro' && t.type === 'expense')
  const saved = savingTxs.reduce((a, t) => a + (Number(t.amountUSD) || 0), 0)

  // Dia con mas gasto
  const byDay = new Map()
  txs
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const d = localDayKey(t.date)
      byDay.set(d, (byDay.get(d) || 0) + (Number(t.amountUSD) || 0))
    })
  let topDay = null
  for (const [d, v] of byDay) if (!topDay || v > topDay.value) topDay = { date: d, value: v }

  const recurring = txs.filter((t) => t.recurring && t.type === 'expense')
  const recurringTotal = recurring.reduce((a, t) => a + (Number(t.amountUSD) || 0), 0)

  return {
    key,
    count: txs.length,
    income,
    expense,
    net: income - expense,
    saved,
    savingRate: income > 0 ? saved / income : 0,
    topCategory: byCat[0] || null,
    topDay,
    recurringCount: recurring.length,
    recurringTotal,
    avgExpense:
      txs.filter((t) => t.type === 'expense').length > 0
        ? expense / txs.filter((t) => t.type === 'expense').length
        : 0,
  }
}
