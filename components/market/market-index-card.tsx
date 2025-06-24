/**
 * Individual market index card component
 */
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { PriceDisplay } from "@/components/ui/price-display"
import type { UseQueryResult } from "@tanstack/react-query"
import type { StockQuote } from "@/lib/types"

interface MarketIndexCardProps {
  symbol: string
  displayName: string
  query: UseQueryResult<StockQuote>
}

export function MarketIndexCard({ symbol, displayName, query }: MarketIndexCardProps) {
  const { data: stock, isLoading, error } = query

  if (isLoading) {
    return <MarketIndexSkeleton displayName={displayName} symbol={symbol} />
  }

  if (error || !stock) {
    return <MarketIndexError displayName={displayName} symbol={symbol} />
  }

  const isPositive = stock.changePercent > 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{displayName}</h3>
        <Badge variant={isPositive ? "default" : "destructive"}>{stock.symbol}</Badge>
      </div>
      <PriceDisplay price={stock.price} change={stock.change} changePercent={stock.changePercent} size="lg" />
    </div>
  )
}

function MarketIndexSkeleton({ displayName, symbol }: { displayName: string; symbol: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{displayName}</h3>
        <Badge variant="outline">{symbol}</Badge>
      </div>
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-4 w-16" />
    </div>
  )
}

function MarketIndexError({ displayName, symbol }: { displayName: string; symbol: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{displayName}</h3>
        <Badge variant="outline">{symbol}</Badge>
      </div>
      <div className="text-sm text-muted-foreground">Unable to load</div>
    </div>
  )
}
