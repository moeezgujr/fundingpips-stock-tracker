import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import { stockApi } from "@/lib/stock-api"

export async function MarketOverview() {
  try {
    const indices = await Promise.allSettled([
      stockApi.getStockQuote("SPY"), 
      stockApi.getStockQuote("QQQ"), 
      stockApi.getStockQuote("DIA"),
    ])

    const marketData = indices
      .map((result, index) => {
        if (result.status === "fulfilled") {
          const symbols = ["SPY", "QQQ", "DIA"]
          const names = ["S&P 500", "NASDAQ", "Dow Jones"]
          return {
            ...result.value,
            symbol: symbols[index],
            displayName: names[index],
          }
        }
        return null
      })
      .filter(Boolean)

    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {marketData.map((stock) => {
              if (!stock) return null

              const isPositive = stock.changePercent > 0

              return (
                <div key={stock.symbol} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{stock.displayName}</h3>
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
        </CardContent>
      </Card>
    )
  } catch (error) {
    console.error("Error fetching market overview:", error)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Unable to load market data at this time.</p>
        </CardContent>
      </Card>
    )
  }
}
