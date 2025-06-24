
export const isValidStockSymbol = (symbol: string): boolean => {
  return /^[A-Z]{1,5}$/.test(symbol.toUpperCase())
}

export const sanitizeStockSymbol = (symbol: string): string => {
  return symbol.toUpperCase().trim()
}

export const isValidSearchQuery = (query: string): boolean => {
  return query.trim().length >= 1
}

export const sanitizeSearchQuery = (query: string): string => {
  return query.trim()
}
