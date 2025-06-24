
import type { StockQuote, StockSearchResult, StockHistoricalData } from "@/lib/types"
import { stockApiClient } from "./api-client"
import { mockDataService } from "./mock-data-service"

class StockService {
  private get isDemoMode(): boolean {
    const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY
    return !apiKey || apiKey === "demo" || apiKey.trim() === ""
  }

  private get hasValidApiKey(): boolean {
    const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY
    return !!(apiKey && apiKey !== "demo" && apiKey.trim().length > 0)
  }

  async getQuote(symbol: string): Promise<StockQuote> {
    if (this.isDemoMode) {
      return mockDataService.generateQuote(symbol)
    }

    try {
      return await stockApiClient.fetchQuote(symbol)
    } catch (error) {
      console.warn(`API error for ${symbol}, falling back to mock data:`, error)
      return mockDataService.generateQuote(symbol)
    }
  }

  async searchSymbols(query: string): Promise<StockSearchResult[]> {
    if (this.isDemoMode) {
      return mockDataService.searchSymbols(query)
    }

    try {
      return await stockApiClient.searchSymbols(query)
    } catch (error) {
      console.warn(`Search API error for "${query}", falling back to mock data:`, error)
      return mockDataService.searchSymbols(query)
    }
  }

  async getHistoricalData(symbol: string, timeRange: string): Promise<StockHistoricalData[]> {
    if (this.isDemoMode) {
      return mockDataService.generateHistoricalData(symbol, timeRange)
    }

    try {
      return await stockApiClient.fetchHistoricalData(symbol, timeRange)
    } catch (error) {
      console.warn(`Historical data API error for ${symbol}, falling back to mock data:`, error)
      return mockDataService.generateHistoricalData(symbol, timeRange)
    }
  }

  async getMultipleQuotes(symbols: string[]): Promise<StockQuote[]> {
    const promises = symbols.map((symbol) => this.getQuote(symbol))
    return Promise.all(promises)
  }

  getServiceStatus(): { mode: "demo" | "live"; hasApiKey: boolean } {
    return {
      mode: this.isDemoMode ? "demo" : "live",
      hasApiKey: this.hasValidApiKey,
    }
  }
}

export const stockService = new StockService()
