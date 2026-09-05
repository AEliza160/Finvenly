# FINVELY

App web de finanzas personales para jovenes de Hispanoamerica. Todo el control de
gastos se centraliza en **USD** para proteger el valor del ahorro frente a la
volatilidad de las monedas locales.

Esta entrega es el **MVP de frontend**: 100% usable y desplegable, sin servidor ni
base de datos. Los datos se guardan en el navegador (`localStorage`).

## Stack

- **React 18 + Vite**
- **Tailwind CSS** (mobile-first, diseño propio)
- **Zustand** (estado global + persistencia en `localStorage`)
- **React Router** (navegacion con bottom-nav)
- **lucide-react** (iconografia)
- Tipo de cambio en tiempo real via [open.er-api.com](https://open.er-api.com)
  (gratis, sin API key), con cache de 12 h y tasas de respaldo offline.

## Funcionalidades (MVP del .md)

| Feature | Estado |
|---|---|
| Dashboard visual: balance en USD + grafico de anillos por categoria | ✅ |
| Gestion multimoneda transparente (ingresas en moneda local → se guarda en USD) | ✅ |
| Tracker de gastos/ingresos con boton flotante e iconos grandes | ✅ |
| Gastos recurrentes (Netflix, Spotify...) | ✅ |
| Wishlist / Metas de ahorro ("Bolsillos") con % de ingreso asignado | ✅ |
| Reporte mensual compartible tipo "Wrapped" | ✅ |
| Onboarding (nombre + moneda local) | ✅ |

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # genera dist/
npm run preview    # sirve dist/ localmente
```

## Despliegue (Netlify)

El repo incluye `netlify.toml`. Basta con conectar el repo en Netlify:

- Build command: `npm run build`
- Publish directory: `dist`

El redirect SPA a `/index.html` ya esta configurado.

## Estructura

```
src/
  lib/          currencies, categories, formato, tipo de cambio, calculos financieros
  store/        useStore.js  (Zustand + persist)
  components/   Onboarding, BottomNav, DonutChart, TransactionModal, TransactionRow
  pages/        Dashboard, Movimientos, Metas, Reporte
```

## Modelo de datos (localStorage)

```
profile      { name, localCurrency, onboarded }
transaction  { id, type, amountOriginal, currencyOriginal, rateApplied,
               amountUSD, category, note, recurring, date }
goal         { id, name, targetUSD, currentUSD, allocationPct, deadline, emoji }
```

Coincide con el esquema `Users / Transactions / Goals` del documento, listo para
migrar a PostgreSQL + API REST en la siguiente fase.

## Siguiente fase (V2 del .md)

- Backend Node/Express + PostgreSQL + auth (JWT / OAuth Google)
- Cron job de tipo de cambio en el servidor
- Clasificacion de gastos con IA segun la nota
- PWA con recordatorios push
