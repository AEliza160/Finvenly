// lib/sheets.js — Lógica de conexión con Google Sheets para Finvely
import { JWT } from "google-auth-library";

const TABLA_TRANSACTIONS = "Transactions";
const TABLA_GOALS = "Goals";

// Crea el cliente autenticado con la cuenta de servicio de Google
function clienteGoogle() {
  const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, SHEET_ID } = process.env;
  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !SHEET_ID) {
    throw new Error("Faltan variables de entorno de Google");
  }
  return new JWT({
    email: GOOGLE_CLIENT_EMAIL,
    key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function urlRango(rango) {
  const id = process.env.SHEET_ID;
  return `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${encodeURIComponent(rango)}`;
}

// ----------------------------------------------------
// 1. TRANSACTIONS (11 columnas: A hasta K)
// ----------------------------------------------------
export async function leerTransactions() {
  const cliente = clienteGoogle();
  const { data } = await cliente.request({ url: urlRango(`${TABLA_TRANSACTIONS}!A2:K`) });
  const filas = data.values || [];
  
  return filas
    .filter((fila) => fila[0]) // Ignora filas vacías sin ID
    .map(([
      id,
      type,
      amountOriginal,
      currencyOriginal,
      rateApplied,
      amountUSD,
      category,
      note,
      recurring,
      goalId,
      date
    ]) => ({
      id,
      type: type || "expense",
      amountOriginal: Number(amountOriginal) || 0,
      currencyOriginal: currencyOriginal || "USD",
      rateApplied: Number(rateApplied) || 1,
      amountUSD: Number(amountUSD) || 0,
      category: category || "otros",
      note: note || "",
      recurring: recurring === "TRUE" || recurring === true,
      goalId: goalId || "",
      date: date || new Date().toISOString(),
    }));
}

export async function guardarTransaction(tx) {
  const cliente = clienteGoogle();
  const idHoja = process.env.SHEET_ID;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${idHoja}/values/${encodeURIComponent(TABLA_TRANSACTIONS)}!A2:K:append?valueInputOption=USER_ENTERED`;

  const fila = [
    tx.id || `tx_${Date.now()}`,
    tx.type || "expense",
    Number(tx.amountOriginal) || 0,
    tx.currencyOriginal || "USD",
    Number(tx.rateApplied) || 1,
    Number(tx.amountUSD) || 0,
    tx.category || "otros",
    tx.note || "",
    tx.recurring ? "TRUE" : "FALSE",
    tx.goalId || "",
    tx.date || new Date().toISOString(),
  ];

  await cliente.request({
    method: "POST",
    url,
    data: { values: [fila] },
  });

  return tx;
}

// ----------------------------------------------------
// 2. GOALS (8 columnas: A hasta H)
// ----------------------------------------------------
export async function leerGoals() {
  const cliente = clienteGoogle();
  const { data } = await cliente.request({ url: urlRango(`${TABLA_GOALS}!A2:H`) });
  const filas = data.values || [];

  return filas
    .filter((fila) => fila[0]) // Ignora filas vacías sin ID
    .map(([
      id,
      name,
      targetUSD,
      currentUSD,
      allocationPct,
      deadline,
      emoji,
      createdAt
    ]) => ({
      id,
      name: name || "Meta",
      targetUSD: Number(targetUSD) || 0,
      currentUSD: Number(currentUSD) || 0,
      allocationPct: Number(allocationPct) || 0,
      deadline: deadline || "",
      emoji: emoji || "🎯",
      createdAt: createdAt || new Date().toISOString(),
    }));
}

export async function guardarGoal(goal) {
  const cliente = clienteGoogle();
  const idHoja = process.env.SHEET_ID;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${idHoja}/values/${encodeURIComponent(TABLA_GOALS)}!A2:H:append?valueInputOption=USER_ENTERED`;

  const fila = [
    goal.id || `meta_${Date.now()}`,
    goal.name || "Nueva meta",
    Number(goal.targetUSD) || 0,
    Number(goal.currentUSD) || 0,
    Number(goal.allocationPct) || 0,
    goal.deadline || "",
    goal.emoji || "🎯",
    goal.createdAt || new Date().toISOString(),
  ];

  await cliente.request({
    method: "POST",
    url,
    data: { values: [fila] },
  });

  return goal;
}
