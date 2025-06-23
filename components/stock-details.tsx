import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { StockQuote } from "@/lib/types"

interface StockDetailsProps {
  stock: StockQuote
}

export function StockDetails({ stock }: StockDetailsProps) {
  const isPositive = stock.changePercent > 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Price</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-4xl font-bold">${stock.price.toFixed(2)}</div>
          <div className={`flex items-center gap-2 text-lg ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            <span>
              {isPositive ? "+" : ""}
              {stock.change.toFixed(2)}
            </span>
            <span>
              ({isPositive ? "+" : ""}
              {stock.changePercent.toFixed(2)}%)
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date(stock.lastUpdated).toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Open</div>
              <div className="font-semibold">${stock.open?.toFixed(2) || "N/A"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Previous Close</div>
              <div className="font-semibold">${stock.previousClose?.toFixed(2) || "N/A"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Day High</div>
              <div className="font-semibold">${stock.high?.toFixed(2) || "N/A"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Day Low</div>
              <div className="font-semibold">${stock.low?.toFixed(2) || "N/A"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Volume</div>
              <div className="font-semibold">{stock.volume ? stock.volume.toLocaleString() : "N/A"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Market Cap</div>
              <div className="font-semibold">{stock.marketCap ? `$${(stock.marketCap / 1e9).toFixed(2)}B` : "N/A"}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
