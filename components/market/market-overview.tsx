/**
 * Market overview component
 */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useMarketOverview } from "@/hooks/queries/use-market-queries"
import { MarketIndexCard } from "./market-index-card"

const MARKET_INDICES = [
  { symbol: "SPY", name: "S&P 500" },
  { symbol: "QQQ", name: "NASDAQ" },
  { symbol: "DIA", name: "Dow Jones" },
]

export function MarketOverview() {
  const marketQueries = useMarketOverview()
  const isLoading = marketQueries.some((query) => query.isLoading)
  const hasErrors = marketQueries.some((query) => query.error)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Market Overview
          {isLoading && <LoadingSpinner size="sm" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {marketQueries.map((query, index) => (
            <MarketIndexCard
              key={MARKET_INDICES[index].symbol}
              symbol={MARKET_INDICES[index].symbol}
              displayName={MARKET_INDICES[index].name}
              query={query}
            />
          ))}
        </div>

        {hasErrors && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Some market data couldn't be loaded. Data will refresh automatically.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
