"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useStockHistoricalData } from "@/hooks/use-stock-query"
import { RefreshCw } from "lucide-react"

interface StockChartProps {
  symbol: string
}

type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y"

export function StockChart({ symbol }: StockChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("1M")

  const { data, isLoading, error, refetch, isFetching } = useStockHistoricalData(symbol, timeRange)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          {(["1D", "1W", "1M", "3M", "1Y"] as TimeRange[]).map((range) => (
            <Skeleton key={range} className="h-8 w-12" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          {(["1D", "1W", "1M", "3M", "1Y"] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
        <div className="h-96 flex flex-col items-center justify-center space-y-4">
          <div className="text-destructive">Failed to load chart data</div>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-muted-foreground">No chart data available</div>
      </div>
    )
  }

  // Simple SVG chart implementation
  const maxPrice = Math.max(...data.map((d) => d.close))
  const minPrice = Math.min(...data.map((d) => d.close))
  const priceRange = maxPrice - minPrice
  const chartWidth = 800
  const chartHeight = 300
  const padding = 40

  const points = data
    .map((point, index) => {
      const x = (index / (data.length - 1)) * (chartWidth - 2 * padding) + padding
      const y = chartHeight - padding - ((point.close - minPrice) / priceRange) * (chartHeight - 2 * padding)
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="space-y-4">
      {/* Time Range Selector */}
      <div className="flex gap-2 items-center">
        {(["1D", "1W", "1M", "3M", "1Y"] as TimeRange[]).map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange(range)}
            disabled={isFetching}
          >
            {range}
          </Button>
        ))}
        {isFetching && <RefreshCw className="h-4 w-4 animate-spin" />}
      </div>

      {/* Chart */}
      <div className="w-full overflow-x-auto">
        <svg
          width={chartWidth}
          height={chartHeight}
          className="border rounded"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#e5e7eb" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Price line */}
          <polyline fill="none" stroke="hsl(var(--primary))" strokeWidth="2" points={points} />

          {/* Price labels */}
          <text x={padding} y={padding} className="text-xs fill-muted-foreground">
            ${maxPrice.toFixed(2)}
          </text>
          <text x={padding} y={chartHeight - padding + 15} className="text-xs fill-muted-foreground">
            ${minPrice.toFixed(2)}
          </text>
        </svg>
      </div>

      {/* Chart Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <div className="text-muted-foreground">Period High</div>
          <div className="font-semibold">${maxPrice.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Period Low</div>
          <div className="font-semibold">${minPrice.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Data Points</div>
          <div className="font-semibold">{data.length}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Range</div>
          <div className="font-semibold">{timeRange}</div>
        </div>
      </div>
    </div>
  )
}
