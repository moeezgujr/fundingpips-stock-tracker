
import type { StockQuote, StockSearchResult, StockHistoricalData } from "@/lib/types"
import { calculateChange, calculateChangePercent } from "@/lib/utils/calculations"

class MockDataService {
  private readonly stockDatabase = {
    AAPL: { name: "Apple Inc.", basePrice: 175, sector: "Technology" },
    GOOGL: { name: "Alphabet Inc.", basePrice: 140, sector: "Technology" },
    MSFT: { name: "Microsoft Corporation", basePrice: 380, sector: "Technology" },
    TSLA: { name: "Tesla, Inc.", basePrice: 250, sector: "Automotive" },
    AMZN: { name: "Amazon.com, Inc.", basePrice: 145, sector: "E-commerce" },
    META: { name: "Meta Platforms, Inc.", basePrice: 320, sector: "Technology" },
    NVDA: { name: "NVIDIA Corporation", basePrice: 450, sector: "Technology" },
    NFLX: { name: "Netflix, Inc.", basePrice: 400, sector: "Entertainment" },
    SPY: { name: "SPDR S&P 500 ETF Trust", basePrice: 450, sector: "ETF" },
    QQQ: { name: "Invesco QQQ Trust", basePrice: 380, sector: "ETF" },
    DIA: { name: "SPDR Dow Jones Industrial Average ETF Trust", basePrice: 340, sector: "ETF" },
    JPM: { name: "JPMorgan Chase & Co.", basePrice: 150, sector: "Financial" },
    JNJ: { name: "Johnson & Johnson", basePrice: 160, sector: "Healthcare" },
    V: { name: "Visa Inc.", basePrice: 240, sector: "Financial" },
    PG: { name: "Procter & Gamble Co.", basePrice: 155, sector: "Consumer Goods" },
    UNH: { name: "UnitedHealth Group Inc.", basePrice: 520, sector: "Healthcare" },
    HD: { name: "Home Depot Inc.", basePrice: 330, sector: "Retail" },
    MA: { name: "Mastercard Inc.", basePrice: 380, sector: "Financial" },
    BAC: { name: "Bank of America Corp.", basePrice: 35, sector: "Financial" },
    XOM: { name: "Exxon Mobil Corp.", basePrice: 110, sector: "Energy" },
    WMT: { name: "Walmart Inc.", basePrice: 160, sector: "Retail" },
  }

  private priceCache = new Map<string, { price: number; timestamp: number }>()
  private readonly CACHE_DURATION = 30000 // 30 seconds

  generateQuote(symbol: string): StockQuote {
    const symbolUpper = symbol.toUpperCase()
    const stockInfo = this.stockDatabase[symbolUpper as keyof typeof this.stockDatabase]

    const basePrice = stockInfo?.basePrice || this.generateRandomBasePrice()
    const name = stockInfo?.name || `${symbolUpper} Corporation`

    // Use cached price if available and fresh
    const cached = this.priceCache.get(symbolUpper)
    const now = Date.now()

    let currentPrice: number

    if (cached && now - cached.timestamp < this.CACHE_DURATION) {
      currentPrice = cached.price
    } else {
      // Generate new price with realistic volatility
      const volatility = this.getVolatilityForSector(stockInfo?.sector || "Technology")
      const change = (Math.random() - 0.5) * 2 * volatility * basePrice
      currentPrice = Math.max(basePrice + change, basePrice * 0.5) // Prevent negative prices

      // Cache the new price
      this.priceCache.set(symbolUpper, { price: currentPrice, timestamp: now })
    }

    const previousClose = basePrice
    const changePercent = calculateChangePercent(currentPrice, previousClose)
    const change = calculateChange(currentPrice, previousClose)

    // Generate realistic intraday range
    const dayVolatility = 0.01 // 1% intraday volatility
    const open = basePrice + (Math.random() - 0.5) * dayVolatility * basePrice
    const high = Math.max(currentPrice, open) + Math.random() * dayVolatility * basePrice
    const low = Math.min(currentPrice, open) - Math.random() * dayVolatility * basePrice

    return {
      symbol: symbolUpper,
      name,
      price: Number(currentPrice.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      previousClose: Number(previousClose.toFixed(2)),
      volume: this.generateRealisticVolume(symbolUpper),
      lastUpdated: new Date().toISOString().split("T")[0],
    }
  }

  searchSymbols(query: string): StockSearchResult[] {
    const queryLower = query.toLowerCase()

    return Object.entries(this.stockDatabase)
      .filter(
        ([symbol, info]) => symbol.toLowerCase().includes(queryLower) || info.name.toLowerCase().includes(queryLower),
      )
      .map(([symbol, info]) => ({
        symbol,
        name: info.name,
        type: info.sector === "ETF" ? "ETF" : "Equity",
        region: "United States",
        currency: "USD",
      }))
      .slice(0, 8) // Limit results
  }

  generateHistoricalData(symbol: string, timeRange: string): StockHistoricalData[] {
    const symbolUpper = symbol.toUpperCase()
    const stockInfo = this.stockDatabase[symbolUpper as keyof typeof this.stockDatabase]
    const basePrice = stockInfo?.basePrice || this.generateRandomBasePrice()

    const dataPoints = this.getDataPointsForRange(timeRange)
    const data: StockHistoricalData[] = []

    let currentPrice = basePrice
    const now = new Date()
    const volatility = this.getVolatilityForSector(stockInfo?.sector || "Technology")

    // Generate trend (slight upward bias for realistic market behavior)
    const trendFactor = 1 + (Math.random() * 0.0002 - 0.0001) // Very small daily trend

    for (let i = dataPoints - 1; i >= 0; i--) {
      const date = new Date(now)

      if (timeRange === "1D") {
        // For 1D, use hours instead of days
        date.setHours(date.getHours() - i)
      } else {
        date.setDate(date.getDate() - i)
      }

      const dailyVolatility = volatility * (0.5 + Math.random()) // Add randomness to volatility
      const change = (Math.random() - 0.5) * 2 * dailyVolatility * currentPrice
      const open = currentPrice
      const close = Math.max(currentPrice + change, currentPrice * 0.8) * trendFactor // Prevent extreme drops

      // Realistic high/low based on open and close
      const dayRange = Math.abs(close - open) * (1 + Math.random())
      const high = Math.max(open, close) + dayRange * 0.3
      const low = Math.min(open, close) - dayRange * 0.3

      data.push({
        date:
          timeRange === "1D"
            ? date
                .toISOString()
                .slice(0, 16) // Include hour for intraday
            : date.toISOString().split("T")[0],
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: this.generateRealisticVolume(symbolUpper),
      })

      currentPrice = close
    }

    return data
  }

  private generateRandomBasePrice(): number {
    // Generate realistic stock price between $10 and $500
    return Math.floor(Math.random() * 490) + 10
  }

  private getVolatilityForSector(sector: string): number {
    const volatilityMap: Record<string, number> = {
      Technology: 0.025,
      Healthcare: 0.018,
      Financial: 0.022,
      Energy: 0.03,
      "Consumer Goods": 0.015,
      Retail: 0.02,
      Automotive: 0.035,
      Entertainment: 0.025,
      "E-commerce": 0.03,
      ETF: 0.012,
    }
    return volatilityMap[sector] || 0.02 // Default 2% volatility
  }

  private generateRealisticVolume(symbol: string): number {
    // Generate volume based on stock popularity
    const popularStocks = ["AAPL", "TSLA", "NVDA", "AMZN", "GOOGL", "MSFT"]
    const isPopular = popularStocks.includes(symbol)

    const baseVolume = isPopular ? 50000000 : 5000000 // 50M for popular, 5M for others
    const variation = 0.5 + Math.random() // 50% to 150% of base

    return Math.floor(baseVolume * variation)
  }

  private getDataPointsForRange(timeRange: string): number {
    const pointsMap: Record<string, number> = {
      "1D": 78, // 5-min intervals in trading day
      "1W": 7,
      "1M": 30,
      "3M": 90,
      "1Y": 365,
    }
    return pointsMap[timeRange] || 30
  }

  // Method to clear cache (useful for testing)
  clearCache(): void {
    this.priceCache.clear()
  }

  // Method to get cache status
  getCacheStatus(): { size: number; keys: string[] } {
    return {
      size: this.priceCache.size,
      keys: Array.from(this.priceCache.keys()),
    }
  }
}

export const mockDataService = new MockDataService()
