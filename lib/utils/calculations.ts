
export const calculateChangePercent = (current: number, previous: number): number => {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export const calculateChange = (current: number, previous: number): number => {
  return current - previous
}

export const isPositiveChange = (changePercent: number): boolean => {
  return changePercent > 0
}

export const getVolatility = (prices: number[]): number => {
  if (prices.length < 2) return 0

  const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length
  const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length

  return Math.sqrt(variance)
}
