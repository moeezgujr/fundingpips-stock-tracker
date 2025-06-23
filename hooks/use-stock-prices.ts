"use client"

import { useState, useEffect, useMemo } from "react"
import { stockApi } from "@/lib/stock-api"

interface StockPrice {
  symbol: string
  price: number
  changePercent: number
}

export function useStockPrices(symbols: string[]) {
  const [prices, setPrices] = useState<Record<string, StockPrice>>({})
  const [isLoading, setIsLoading] = useState(false)

  // Memoize the symbols array to prevent unnecessary re-renders
  const memoizedSymbols = useMemo(() => {
    return symbols.sort().join(",")
  }, [symbols])

  useEffect(() => {
    const symbolsArray = memoizedSymbols ? memoizedSymbols.split(",") : []

    if (symbolsArray.length === 0) {
      setPrices({})
      return
    }

    async function fetchPrices() {
      setIsLoading(true)

      try {
        const pricePromises = symbolsArray.map(async (symbol) => {
          try {
            const quote = await stockApi.getStockQuote(symbol)
            return {
              symbol,
              price: quote.price,
              changePercent: quote.changePercent,
            }
          } catch (error) {
            console.error(`Error fetching price for ${symbol}:`, error)
            return null
          }
        })

        const results = await Promise.all(pricePromises)
        const priceMap: Record<string, StockPrice> = {}

        results.forEach((result) => {
          if (result) {
            priceMap[result.symbol] = result
          }
        })

        setPrices(priceMap)
      } catch (error) {
        console.error("Error fetching stock prices:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrices()

    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(fetchPrices, 30000)

    return () => clearInterval(interval)
  }, [memoizedSymbols]) // Now using the memoized string instead of the array

  return { prices, isLoading }
}
