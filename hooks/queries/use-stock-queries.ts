/**
 * Stock-related React Query hooks
 */
"use client"

import { useQuery, useQueries } from "@tanstack/react-query"
import { stockService } from "@/lib/services/stock-service"

// Query key factory
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
    queryFn: () => stockService.getQuote(symbol),
    enabled: !!symbol,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  })
}

export function useStockQuotes(symbols: string[]) {
  return useQueries({
    queries: symbols.map((symbol) => ({
      queryKey: stockQueryKeys.quote(symbol),
      queryFn: () => stockService.getQuote(symbol),
      staleTime: 30 * 1000,
      refetchInterval: 30 * 1000,
      enabled: !!symbol,
    })),
  })
}

export function useStockSearch(query: string) {
  return useQuery({
    queryKey: stockQueryKeys.search(query),
    queryFn: () => stockService.searchSymbols(query),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
  })
}

export function useStockHistoricalData(symbol: string, timeRange: string) {
  return useQuery({
    queryKey: stockQueryKeys.historical(symbol, timeRange),
    queryFn: () => stockService.getHistoricalData(symbol, timeRange),
    enabled: !!symbol && !!timeRange,
    staleTime: 5 * 60 * 1000,
  })
}
