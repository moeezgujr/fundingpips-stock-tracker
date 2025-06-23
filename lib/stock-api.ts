import type { StockQuote, StockSearchResult, StockHistoricalData } from "./types"

// Alpha Vantage API configuration
const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || "demo"
const BASE_URL = "https://www.alphavantage.co/query"

class StockAPI {
  private async fetchWithRetry(url: string, retries = 3): Promise<Response> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          next: { revalidate: 300 }, // Cache for 5 minutes
        })

        if (response.ok) {
          return response
        }

        if (response.status === 429 && i < retries - 1) {
          // Rate limited, wait and retry
          await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
          continue
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      } catch (error) {
        if (i === retries - 1) throw error
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    throw new Error("Max retries exceeded")
  }

  async getStockQuote(symbol: string): Promise<StockQuote> {
    // For demo purposes, return mock data if no API key
    if (API_KEY === "demo") {
      // console.log('demo')
      return this.getMockQuote(symbol)
    }
    console.log(symbol)
    const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`

    try {
      const response = await this.fetchWithRetry(url)
      console.log(response)
      const data = await response.json()
      console.log(data)

      if (data["Error Message"]) {
        throw new Error(data["Error Message"])
      }

      const quote = data["Global Quote"]
      if (!quote) {
        throw new Error("Invalid symbol or no data available")
      }

      return {
        symbol: quote["01. symbol"],
        name: symbol, // API doesn't provide company name in quote
        price: Number.parseFloat(quote["05. price"]),
        change: Number.parseFloat(quote["09. change"]),
        changePercent: Number.parseFloat(quote["10. change percent"].replace("%", "")),
        open: Number.parseFloat(quote["02. open"]),
        high: Number.parseFloat(quote["03. high"]),
        low: Number.parseFloat(quote["04. low"]),
        previousClose: Number.parseFloat(quote["08. previous close"]),
        volume: Number.parseInt(quote["06. volume"]),
        lastUpdated: quote["07. latest trading day"],
      }
    } catch (error) {
      console.error("Error fetching stock quote:", error)
      // Fallback to mock data
      return this.getMockQuote(symbol)
    }
  }

  async searchStocks(query: string): Promise<StockSearchResult[]> {
    // For demo purposes, return mock search results
    if (API_KEY === "demo") {
      return this.getMockSearchResults(query)
    }

    const url = `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`

    try {
      const response = await this.fetchWithRetry(url)
      const data = await response.json()

      if (data["Error Message"]) {
        throw new Error(data["Error Message"])
      }

      const matches = data["bestMatches"] || []

      return matches.slice(0, 10).map((match: any) => ({
        symbol: match["1. symbol"],
        name: match["2. name"],
        type: match["3. type"],
        region: match["4. region"],
        currency: match["8. currency"],
      }))
    } catch (error) {
      console.error("Error searching stocks:", error)
      return this.getMockSearchResults(query)
    }
  }

  async getHistoricalData(symbol: string, timeRange: string): Promise<StockHistoricalData[]> {
    // For demo purposes, return mock historical data
    if (API_KEY === "demo") {
      return this.getMockHistoricalData(symbol, timeRange)
    }

    const functionMap: Record<string, string> = {
      "1D": "TIME_SERIES_INTRADAY",
      "1W": "TIME_SERIES_DAILY",
      "1M": "TIME_SERIES_DAILY",
      "3M": "TIME_SERIES_DAILY",
      "1Y": "TIME_SERIES_DAILY",
    }

    const func = functionMap[timeRange] || "TIME_SERIES_DAILY"
    let url = `${BASE_URL}?function=${func}&symbol=${symbol}&apikey=${API_KEY}`

    if (func === "TIME_SERIES_INTRADAY") {
      url += "&interval=5min"
    }

    try {
      const response = await this.fetchWithRetry(url)
      const data = await response.json()

      if (data["Error Message"]) {
        throw new Error(data["Error Message"])
      }

      const timeSeriesKey = Object.keys(data).find((key) => key.includes("Time Series"))
      if (!timeSeriesKey) {
        throw new Error("No time series data found")
      }

      const timeSeries = data[timeSeriesKey]
      const entries = Object.entries(timeSeries).slice(0, this.getDataPointsForRange(timeRange))

      return entries
        .map(([date, values]: [string, any]) => ({
          date,
          open: Number.parseFloat(values["1. open"]),
          high: Number.parseFloat(values["2. high"]),
          low: Number.parseFloat(values["3. low"]),
          close: Number.parseFloat(values["4. close"]),
          volume: Number.parseInt(values["5. volume"]),
        }))
        .reverse()
    } catch (error) {
      console.error("Error fetching historical data:", error)
      return this.getMockHistoricalData(symbol, timeRange)
    }
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

  // Mock data methods for demo/fallback
  private getMockQuote(symbol: string): StockQuote {
    const basePrice = this.getBasePriceForSymbol(symbol)
    const change = (Math.random() - 0.5) * 10
    const changePercent = (change / basePrice) * 100

    return {
      symbol: symbol.toUpperCase(),
      name: this.getCompanyName(symbol),
      price: basePrice + change,
      change,
      changePercent,
      open: basePrice + (Math.random() - 0.5) * 5,
      high: basePrice + Math.random() * 8,
      low: basePrice - Math.random() * 8,
      previousClose: basePrice,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      lastUpdated: new Date().toISOString().split("T")[0],
    }
  }

  private getMockSearchResults(query: string): StockSearchResult[] {
    const mockStocks = [
      { symbol: "AAPL", name: "Apple Inc.", type: "Equity" },
      { symbol: "GOOGL", name: "Alphabet Inc.", type: "Equity" },
      { symbol: "MSFT", name: "Microsoft Corporation", type: "Equity" },
      { symbol: "TSLA", name: "Tesla, Inc.", type: "Equity" },
      { symbol: "AMZN", name: "Amazon.com, Inc.", type: "Equity" },
      { symbol: "META", name: "Meta Platforms, Inc.", type: "Equity" },
      { symbol: "NVDA", name: "NVIDIA Corporation", type: "Equity" },
      { symbol: "NFLX", name: "Netflix, Inc.", type: "Equity" },
    ]

    return mockStocks
      .filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
          stock.name.toLowerCase().includes(query.toLowerCase()),
      )
      .map((stock) => ({
        ...stock,
        region: "United States",
        currency: "USD",
      }))
  }

  private getMockHistoricalData(symbol: string, timeRange: string): StockHistoricalData[] {
    const basePrice = this.getBasePriceForSymbol(symbol)
    const dataPoints = this.getDataPointsForRange(timeRange)
    const data: StockHistoricalData[] = []

    let currentPrice = basePrice
    const now = new Date()

    for (let i = dataPoints - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)

      const volatility = 0.02 // 2% daily volatility
      const change = (Math.random() - 0.5) * 2 * volatility * currentPrice
      const open = currentPrice
      const close = currentPrice + change
      const high = Math.max(open, close) + Math.random() * 0.01 * currentPrice
      const low = Math.min(open, close) - Math.random() * 0.01 * currentPrice

      data.push({
        date: date.toISOString().split("T")[0],
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 5000000) + 1000000,
      })

      currentPrice = close
    }

    return data
  }

  private getBasePriceForSymbol(symbol: string): number {
    const prices: Record<string, number> = {
      AAPL: 175,
      GOOGL: 140,
      MSFT: 380,
      TSLA: 250,
      AMZN: 145,
      META: 320,
      NVDA: 450,
      NFLX: 400,
      SPY: 450,
      QQQ: 380,
      DIA: 340,
    }
    return prices[symbol.toUpperCase()] || 100
  }

  private getCompanyName(symbol: string): string {
    const names: Record<string, string> = {
      AAPL: "Apple Inc.",
      GOOGL: "Alphabet Inc.",
      MSFT: "Microsoft Corporation",
      TSLA: "Tesla, Inc.",
      AMZN: "Amazon.com, Inc.",
      META: "Meta Platforms, Inc.",
      NVDA: "NVIDIA Corporation",
      NFLX: "Netflix, Inc.",
      SPY: "SPDR S&P 500 ETF Trust",
      QQQ: "Invesco QQQ Trust",
      DIA: "SPDR Dow Jones Industrial Average ETF Trust",
    }
    return names[symbol.toUpperCase()] || `${symbol.toUpperCase()} Corporation`
  }
}

export const stockApi = new StockAPI()
