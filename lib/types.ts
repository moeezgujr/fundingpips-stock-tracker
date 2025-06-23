export interface StockQuote {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  open?: number
  high?: number
  low?: number
  previousClose?: number
  volume?: number
  marketCap?: number
  lastUpdated: string
}

export interface StockSearchResult {
  symbol: string
  name: string
  type: string
  region: string
  currency: string
}

export interface StockHistoricalData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface WatchlistItem {
  symbol: string
  name: string
  addedAt: string
}
