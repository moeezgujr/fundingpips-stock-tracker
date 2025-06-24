/**
 * Stock statistics display card component
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatNumber, formatMarketCap } from "@/lib/utils/format"
import type { StockQuote } from "@/lib/types"

interface StockStatsCardProps {
  stock: StockQuote
}

export function StockStatsCard({ stock }: StockStatsCardProps) {
  const stats = [
    { label: "Open", value: stock.open ? formatCurrency(stock.open) : "N/A" },
    { label: "Previous Close", value: stock.previousClose ? formatCurrency(stock.previousClose) : "N/A" },
    { label: "Day High", value: stock.high ? formatCurrency(stock.high) : "N/A" },
    { label: "Day Low", value: stock.low ? formatCurrency(stock.low) : "N/A" },
    { label: "Volume", value: stock.volume ? formatNumber(stock.volume) : "N/A" },
    { label: "Market Cap", value: stock.marketCap ? formatMarketCap(stock.marketCap) : "N/A" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="font-semibold">{stat.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
