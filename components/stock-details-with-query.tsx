"use client"

import { StockDetails } from "./stock-details"
import { useStockQuote } from "@/hooks/use-stock-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"
import type { StockQuote } from "@/lib/types"

interface StockDetailsWithQueryProps {
  symbol: string
  initialData: StockQuote
}

export function StockDetailsWithQuery({ symbol, initialData }: StockDetailsWithQueryProps) {
  const { data: stock, isLoading, error, isFetching } = useStockQuote(symbol)

  // Use initial data while loading
  const displayStock = stock || initialData

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Stock Details
            <RefreshCw className="h-4 w-4 text-destructive" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive mb-4">Unable to load current stock data</p>
            <p className="text-sm text-muted-foreground">Showing last known data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {isFetching && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Updating stock data...
        </div>
      )}
      <StockDetails stock={displayStock} />
    </div>
  )
}
