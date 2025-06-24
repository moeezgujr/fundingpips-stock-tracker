/**
 * Alpha Vantage API client
 */
import type { StockQuote, StockSearchResult, StockHistoricalData } from "@/lib/types"

const BASE_URL = "https://www.alphavantage.co/query"

class StockApiClient {
  private get apiKey(): string {
    const key = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY
    if (!key || key === "demo" || key.trim() === "") {
      throw new Error("Alpha Vantage API key is required for live data")
    }
    return key
  }

  private async fetchWithRetry(url: string, retries = 3): Promise<Response> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url)

        if (response.ok) return response

        if (response.status === 429 && i < retries - 1) {
          await this.delay(1000 * (i + 1))
          continue
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      } catch (error) {
        if (i === retries - 1) throw error
        await this.delay(1000)
      }
    }

    throw new Error("Max retries exceeded")
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async fetchQuote(symbol: string): Promise<StockQuote> {
    const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`
    const response = await this.fetchWithRetry(url)
    const data = await response.json()

    if (data["Error Message"]) {
      throw new Error(data["Error Message"])
    }

    if (data["Note"]) {
      throw new Error("API rate limit exceeded. Please try again later.")
    }

    const quote = data["Global Quote"]
    if (!quote || Object.keys(quote).length === 0) {
      throw new Error("Invalid symbol or no data available")
    }

    return this.transformQuoteData(quote, symbol)
  }

  async searchSymbols(query: string): Promise<StockSearchResult[]> {
    const url = `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${query}&apikey=${this.apiKey}`
    const response = await this.fetchWithRetry(url)
    const data = await response.json()

    if (data["Error Message"]) {
      throw new Error(data["Error Message"])
    }

    if (data["Note"]) {
      throw new Error("API rate limit exceeded. Please try again later.")
    }

    const matches = data["bestMatches"] || []
    return matches.slice(0, 10).map(this.transformSearchResult)
  }

  async fetchHistoricalData(symbol: string, timeRange: string): Promise<StockHistoricalData[]> {
    const functionMap: Record<string, string> = {
      "1D": "TIME_SERIES_INTRADAY",
      "1W": "TIME_SERIES_DAILY",
      "1M": "TIME_SERIES_DAILY",
      "3M": "TIME_SERIES_DAILY",
      "1Y": "TIME_SERIES_DAILY",
    }

    const func = functionMap[timeRange] || "TIME_SERIES_DAILY"
    let url = `${BASE_URL}?function=${func}&symbol=${symbol}&apikey=${this.apiKey}`

    if (func === "TIME_SERIES_INTRADAY") {
      url += "&interval=5min"
    }

    const response = await this.fetchWithRetry(url)
    const data = await response.json()

    if (data["Error Message"]) {
      throw new Error(data["Error Message"])
    }

    if (data["Note"]) {
      throw new Error("API rate limit exceeded. Please try again later.")
    }

    return this.transformHistoricalData(data, timeRange)
  }

  private transformQuoteData(quote: any, symbol: string): StockQuote {
    return {
      symbol: quote["01. symbol"],
      name: symbol,
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
  }

  private transformSearchResult(match: any): StockSearchResult {
    return {
      symbol: match["1. symbol"],
      name: match["2. name"],
      type: match["3. type"],
      region: match["4. region"],
      currency: match["8. currency"],
    }
  }

  private transformHistoricalData(data: any, timeRange: string): StockHistoricalData[] {
    const timeSeriesKey = Object.keys(data).find((key) => key.includes("Time Series"))
    if (!timeSeriesKey) {
      throw new Error("No time series data found")
    }

    const timeSeries = data[timeSeriesKey]
    const dataPoints = this.getDataPointsForRange(timeRange)
    const entries = Object.entries(timeSeries).slice(0, dataPoints)

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
  }

  private getDataPointsForRange(timeRange: string): number {
    const pointsMap: Record<string, number> = {
      "1D": 78,
      "1W": 7,
      "1M": 30,
      "3M": 90,
      "1Y": 365,
    }
    return pointsMap[timeRange] || 30
  }
}

export const stockApiClient = new StockApiClient()
