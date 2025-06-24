/**
 * Main watchlist section component
 */
"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useWatchlistStore } from "@/store/watchlist-store"
import { useStockQuotes } from "@/hooks/queries/use-stock-queries"
import { WatchlistItem } from "./watchlist-item"
import { WatchlistEmpty } from "./watchlist-empty"

export function WatchlistSection() {
  const { watchlist, removeFromWatchlist } = useWatchlistStore()

  const symbols = useMemo(() => watchlist.map((item) => item.symbol), [watchlist])
  const stockQueries = useStockQuotes(symbols)

  const isLoading = stockQueries.some((query) => query.isLoading)
  const hasErrors = stockQueries.some((query) => query.error)

  if (watchlist.length === 0) {
    return <WatchlistEmpty />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            Your Watchlist
            {isLoading && <LoadingSpinner size="sm" />}
          </div>
          <Badge variant="secondary">{watchlist.length} stocks</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {watchlist.map((item, index) => (
            <WatchlistItem key={item.symbol} item={item} query={stockQueries[index]} onRemove={removeFromWatchlist} />
          ))}
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
