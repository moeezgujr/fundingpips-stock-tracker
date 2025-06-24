"use client"

import { useQuery, useQueries } from "@tanstack/react-query"
import { stockApi } from "@/lib/stock-api"

export const stockQueryKeys = {
  all: ["stocks"] as const,
  quotes: () => [...stockQueryKeys.all, "quotes"] as const,
  quote: (symbol: string) => [...stockQueryKeys.quotes(), symbol] as const,
  search: (query: string) => [...stockQueryKeys.all, "search", query] as const,
  historical: (symbol: string, timeRange: string) => [...stockQueryKeys.all, "historical", symbol, timeRange] as const,
}

export function useStockQuote(symbol: string) {
  return useQuery({
    queryKey: stockQueryKeys.quote(symbol),
    queryFn: () => stockApi.getStockQuote(symbol),
    enabled: !!symbol,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time updates
  })
}

export function useStockQuotes(symbols: string[]) {
  return useQueries({
    queries: symbols.map((symbol) => ({
      queryKey: stockQueryKeys.quote(symbol),
      queryFn: () => stockApi.getStockQuote(symbol),
      staleTime: 30 * 1000,
      refetchInterval: 30 * 1000,
      enabled: !!symbol,
    })),
  })
}

export function useStockSearch(query: string) {
  return useQuery({
    queryKey: stockQueryKeys.search(query),
    queryFn: () => stockApi.searchStocks(query),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes (search results don't change often)
  })
}

export function useStockHistoricalData(symbol: string, timeRange: string) {
  return useQuery({
    queryKey: stockQueryKeys.historical(symbol, timeRange),
    queryFn: () => stockApi.getHistoricalData(symbol, timeRange),
    enabled: !!symbol && !!timeRange,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useMarketOverview() {
  const indices = ["SPY", "QQQ", "DIA"]

  return useQueries({
    queries: indices.map((symbol) => ({
      queryKey: stockQueryKeys.quote(symbol),
      queryFn: () => stockApi.getStockQuote(symbol),
      staleTime: 60 * 1000, // 1 minute
      refetchInterval: 60 * 1000, // Refetch every minute
    })),
  })
}
