// netlify/functions/api.mjs — Función serverless para Finvely
import { 
  leerTransactions, 
  guardarTransaction, 
  leerGoals, 
  guardarGoal 
} from "../../lib/sheets.js";

export default async (request) => {
  try {
    const url = new URL(request.url);
    const path = url.pathname;

    // Rutas para Transactions (/api/transactions)
    if (path.includes("/transactions")) {
      if (request.method === "GET") {
        const transactions = await leerTransactions();
        return Response.json(transactions);
      }
      if (request.method === "POST") {
        const datos = await request.json();
        const nuevaTx = await guardarTransaction(datos);
        return Response.json(nuevaTx, { status: 201 });
      }
    }

    // Rutas para Goals (/api/goals)
    if (path.includes("/goals")) {
      if (request.method === "GET") {
        const goals = await leerGoals();
        return Response.json(goals);
      }
      if (request.method === "POST") {
        const datos = await request.json();
        const nuevaMeta = await guardarGoal(datos);
        return Response.json(nuevaMeta, { status: 201 });
      }
    }

    return Response.json({ error: "Ruta no encontrada" }, { status: 404 });
  } catch (error) {
    console.error("Error en la función serverless:", error);
    const status = error.status || 500;
    const mensaje = status === 400 ? error.message : "Error del servidor";
    return Response.json({ error: mensaje }, { status });
  }
};

// Configura la ruta base para Netlify Functions
export const config = { path: "/api/*" };