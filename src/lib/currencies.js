// Monedas locales frecuentes en Hispanoamerica + USD.
export const CURRENCIES = [
  { code: 'USD', name: 'Dolar estadounidense', symbol: '$', flag: '\u{1F1FA}\u{1F1F8}' },
  { code: 'ARS', name: 'Peso argentino', symbol: '$', flag: '\u{1F1E6}\u{1F1F7}' },
  { code: 'BOB', name: 'Boliviano', symbol: 'Bs', flag: '\u{1F1E7}\u{1F1F4}' },
  { code: 'BRL', name: 'Real brasileno', symbol: 'R$', flag: '\u{1F1E7}\u{1F1F7}' },
  { code: 'CLP', name: 'Peso chileno', symbol: '$', flag: '\u{1F1E8}\u{1F1F1}' },
  { code: 'COP', name: 'Peso colombiano', symbol: '$', flag: '\u{1F1E8}\u{1F1F4}' },
  { code: 'CRC', name: 'Colon costarricense', symbol: '₡', flag: '\u{1F1E8}\u{1F1F7}' },
  { code: 'CUP', name: 'Peso cubano', symbol: '$', flag: '\u{1F1E8}\u{1F1FA}' },
  { code: 'DOP', name: 'Peso dominicano', symbol: 'RD$', flag: '\u{1F1E9}\u{1F1F4}' },
  { code: 'GTQ', name: 'Quetzal', symbol: 'Q', flag: '\u{1F1EC}\u{1F1F9}' },
  { code: 'HNL', name: 'Lempira', symbol: 'L', flag: '\u{1F1ED}\u{1F1F3}' },
  { code: 'MXN', name: 'Peso mexicano', symbol: '$', flag: '\u{1F1F2}\u{1F1FD}' },
  { code: 'NIO', name: 'Cordoba', symbol: 'C$', flag: '\u{1F1F3}\u{1F1EE}' },
  { code: 'PAB', name: 'Balboa', symbol: 'B/.', flag: '\u{1F1F5}\u{1F1E6}' },
  { code: 'PEN', name: 'Sol peruano', symbol: 'S/', flag: '\u{1F1F5}\u{1F1EA}' },
  { code: 'PYG', name: 'Guarani', symbol: '₲', flag: '\u{1F1F5}\u{1F1FE}' },
  { code: 'UYU', name: 'Peso uruguayo', symbol: '$U', flag: '\u{1F1FA}\u{1F1FE}' },
  { code: 'VES', name: 'Bolivar', symbol: 'Bs', flag: '\u{1F1FB}\u{1F1EA}' },
]

export const getCurrency = (code) =>
  CURRENCIES.find((c) => c.code === code) || CURRENCIES[0]

// Tasas de respaldo (aprox. unidades de moneda local por 1 USD).
// Se usan solo si la API de tipo de cambio no responde y no hay cache.
export const FALLBACK_RATES = {
  USD: 1,
  ARS: 1500,
  BOB: 6.96,
  BRL: 5.4,
  CLP: 950,
  COP: 3900,
  CRC: 505,
  CUP: 120,
  DOP: 60,
  GTQ: 7.75,
  HNL: 25,
  MXN: 18.5,
  NIO: 36.8,
  PAB: 1,
  PEN: 3.75,
  PYG: 7300,
  UYU: 40,
  VES: 45,
}
