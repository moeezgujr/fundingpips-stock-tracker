"use client"

/**
 * Individual watchlist item component
 */
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { PriceDisplay } from "@/components/ui/price-display"
import { Trash2 } from "lucide-react"
import Link from "next/link"
import type { WatchlistItem as WatchlistItemType } from "@/lib/types"
import type { UseQueryResult } from "@tanstack/react-query"
import type { StockQuote } from "@/lib/types"

interface WatchlistItemProps {
  item: WatchlistItemType
  query: UseQueryResult<StockQuote>
  onRemove: (symbol: string) => void
}

export function WatchlistItem({ item, query, onRemove }: WatchlistItemProps) {
  const { data: priceData, isLoading, error } = query

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-1">
        <Link href={`/stock/${item.symbol}`} className="block hover:underline">
          <div className="font-semibold">{item.symbol}</div>
          <div className="text-sm text-muted-foreground truncate">{item.name}</div>
        </Link>
      </div>

      <div className="mr-4">
        {isLoading ? (
          <WatchlistItemSkeleton />
        ) : error ? (
          <div className="text-sm text-muted-foreground">Error loading</div>
        ) : priceData ? (
          <PriceDisplay price={priceData.price} changePercent={priceData.changePercent} size="sm" />
        ) : (
          <div className="text-sm text-muted-foreground">No data</div>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(item.symbol)}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

function WatchlistItemSkeleton() {
  return (
    <div className="space-y-2 text-right">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-3 w-12" />
    </div>
  )
}
