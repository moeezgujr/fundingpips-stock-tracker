/**
 * Stock price display card component
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PriceDisplay } from "@/components/ui/price-display"
import { formatDateTime } from "@/lib/utils/format"
import type { StockQuote } from "@/lib/types"

interface StockPriceCardProps {
  stock: StockQuote
}

export function StockPriceCard({ stock }: StockPriceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Price</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PriceDisplay price={stock.price} change={stock.change} changePercent={stock.changePercent} size="lg" />
        <div className="text-sm text-muted-foreground">Last updated: {formatDateTime(stock.lastUpdated)}</div>
      </CardContent>
    </Card>
  )
}
