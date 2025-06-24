"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { useMarketOverview } from "@/hooks/use-stock-query"

export function MarketOverview() {
  const marketQueries = useMarketOverview()
  const indices = ["SPY", "QQQ", "DIA"]
  const names = ["S&P 500", "NASDAQ", "Dow Jones"]

  const isLoading = marketQueries.some((query) => query.isLoading)
  const hasErrors = marketQueries.some((query) => query.error)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Market Overview
          {isLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {marketQueries.map((query, index) => {
            const stock = query.data
            const isQueryLoading = query.isLoading
            const queryError = query.error

            if (isQueryLoading) {
              return (
                <div key={indices[index]} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              )
            }

            if (queryError || !stock) {
              return (
                <div key={indices[index]} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{names[index]}</h3>
                    <Badge variant="outline">{indices[index]}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">Unable to load</div>
                </div>
              )
            }

            const isPositive = stock.changePercent > 0

            return (
              <div key={stock.symbol} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{names[index]}</h3>
                  <Badge variant={isPositive ? "default" : "destructive"}>{stock.symbol}</Badge>
                </div>
                <div className="text-2xl font-bold">${stock.price.toFixed(2)}</div>
                <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
                  {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span>
                    {isPositive ? "+" : ""}
                    {stock.change.toFixed(2)}
                  </span>
                  <span>
                    ({isPositive ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            )
          })}
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
