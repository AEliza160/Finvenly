import fs from 'fs';

const transaccionesContenido = `id,type,amountOriginal,currencyOriginal,rateApplied,amountUSD,category,note,recurring,goalId,date
tx_8x92a,expense,8500,ARS,0.0011,9.35,comida,Cena familiar,false,,2026-10-17T14:20:00Z
tx_2p11b,income,150,USD,1,150,salario,Freelance,false,,2026-10-17T14:22:00Z
tx_9o44z,expense,50,USD,1,50,ahorro,Aporte a: Fondo,false,meta_f329,2026-10-17T14:25:00Z`;

const metasContenido = `id,name,targetUSD,currentUSD,allocationPct,deadline,emoji,createdAt,updatedAt
meta_f329,Fondo de Emergencia,1000,50,15,2027-12-31,🎯,2026-10-17T14:00:00Z,2026-10-17T14:25:00Z
meta_k881,Viaje de Estudios,2500,0,0,2028-06-15,✈️,2026-10-17T14:05:00Z,2026-10-17T14:05:00Z`;

try {
  fs.writeFileSync('transactions.csv', transaccionesContenido);
  console.log('✅ Archivo transactions.csv creado con éxito.');
  
  fs.writeFileSync('goals.csv', metasContenido);
  console.log('✅ Archivo goals.csv creado con éxito.');
  
  console.log('\n¡Listo! Ya puedes importarlos directamente en Google Sheets.');
} catch (error) {
  console.error('❌ Error al crear los archivos:', error);
}
