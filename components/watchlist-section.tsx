"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWatchlistStore } from "@/store/watchlist-store"
import { Trash2, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { useStockPrices } from "@/hooks/use-stock-prices"

export function WatchlistSection() {
  const { watchlist, removeFromWatchlist } = useWatchlistStore()
  const symbols = useMemo(() => watchlist.map((item) => item.symbol), [watchlist])

  const { prices, isLoading } = useStockPrices(symbols)

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
          Your Watchlist
          <Badge variant="secondary">{watchlist.length} stocks</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {watchlist.map((item) => {
            const priceData = prices[item.symbol]
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

                {isLoading ? (
                  <div className="text-sm text-muted-foreground">Loading...</div>
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
      </CardContent>
    </Card>
  )
}
