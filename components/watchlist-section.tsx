"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useWatchlistStore } from "@/store/watchlist-store"
import { useStockQuotes } from "@/hooks/use-stock-query"
import { Trash2, TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import Link from "next/link"

export function WatchlistSection() {
  const { watchlist, removeFromWatchlist } = useWatchlistStore()

  // Memoize the symbols array to prevent unnecessary re-renders
  const symbols = useMemo(() => watchlist.map((item) => item.symbol), [watchlist])

  // Use React Query for fetching stock prices
  const stockQueries = useStockQuotes(symbols)

  // Check if any queries are loading
  const isLoading = stockQueries.some((query) => query.isLoading)
  const hasErrors = stockQueries.some((query) => query.error)

  if (watchlist.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Watchlist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Your watchlist is empty. Search for stocks to add them to your watchlist.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            Your Watchlist
            {isLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
          </div>
          <Badge variant="secondary">{watchlist.length} stocks</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {watchlist.map((item, index) => {
            const query = stockQueries[index]
            const priceData = query?.data
            const isQueryLoading = query?.isLoading
            const queryError = query?.error
            const isPositive = priceData?.changePercent && priceData.changePercent > 0

            return (
              <div
                key={item.symbol}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <Link href={`/stock/${item.symbol}`} className="block hover:underline">
                    <div className="font-semibold">{item.symbol}</div>
                    <div className="text-sm text-muted-foreground truncate">{item.name}</div>
                  </Link>
                </div>

                {isQueryLoading ? (
                  <div className="mr-4 space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                ) : queryError ? (
                  <div className="text-sm text-muted-foreground mr-4">Error loading</div>
                ) : priceData ? (
                  <div className="text-right mr-4">
                    <div className="font-semibold">${priceData.price.toFixed(2)}</div>
                    <div
                      className={`text-sm flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}
                    >
                      {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {priceData.changePercent?.toFixed(2)}%
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground mr-4">No data</div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromWatchlist(item.symbol)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )
          })}
        </div>

        {hasErrors && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Some stock prices couldn't be loaded. Data will refresh automatically.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
