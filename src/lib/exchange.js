import { FALLBACK_RATES } from './currencies'

// API gratuita y sin API key. Base USD -> rates[XYZ] = unidades de XYZ por 1 USD.
const ENDPOINT = 'https://open.er-api.com/v6/latest/USD'
const CACHE_KEY = 'finvely.rates.v1'
const TTL_MS = 12 * 60 * 60 * 1000 // 12 horas (como el cron sugerido en el .md)

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.rates || !parsed?.fetchedAt) return null
    return parsed
  } catch {
    return null
  }
}

const writeCache = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    /* almacenamiento no disponible */
  }
}

/**
 * Devuelve { rates, fetchedAt, source }.
 * source: 'live' | 'cache' | 'fallback'
 */
export async function getRates({ force = false } = {}) {
  const cached = readCache()
  const fresh = cached && Date.now() - cached.fetchedAt < TTL_MS

  if (cached && fresh && !force) {
    return { ...cached, source: 'cache' }
  }

  try {
    const res = await fetch(ENDPOINT, { cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    if (json.result !== 'success' || !json.rates) throw new Error('respuesta invalida')
    const data = { rates: json.rates, fetchedAt: Date.now() }
    writeCache(data)
    return { ...data, source: 'live' }
  } catch {
    if (cached) return { ...cached, source: 'cache' }
    return { rates: FALLBACK_RATES, fetchedAt: Date.now(), source: 'fallback' }
  }
}

// Convierte un monto en moneda local a USD.
// rate = unidades de moneda local por 1 USD.
export const toUSD = (amount, rate) => {
  const r = Number(rate) || 1
  return (Number(amount) || 0) / r
}
