/**
 * Market-related React Query hooks
 */
"use client"

import { useQueries } from "@tanstack/react-query"
import { stockService } from "@/lib/services/stock-service"
import { stockQueryKeys } from "./use-stock-queries"

const MARKET_INDICES = ["SPY", "QQQ", "DIA"]

export function useMarketOverview() {
  return useQueries({
    queries: MARKET_INDICES.map((symbol) => ({
      queryKey: stockQueryKeys.quote(symbol),
      queryFn: () => stockService.getQuote(symbol),
      staleTime: 60 * 1000,
      refetchInterval: 60 * 1000,
    })),
  })
}
