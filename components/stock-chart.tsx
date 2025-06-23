"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { stockApi } from "@/lib/stock-api"
import type { StockHistoricalData } from "@/lib/types"

interface StockChartProps {
  symbol: string
}

type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y"

export function StockChart({ symbol }: StockChartProps) {
  const [data, setData] = useState<StockHistoricalData[]>([])
  const [timeRange, setTimeRange] = useState<TimeRange>("1M")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchChartData() {
      setIsLoading(true)
      setError(null)

      try {
        const chartData = await stockApi.getHistoricalData(symbol, timeRange)
        setData(chartData)
      } catch (err) {
        console.error("Error fetching chart data:", err)
        setError("Failed to load chart data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchChartData()
  }, [symbol, timeRange])

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-muted-foreground">Loading chart...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-destructive">{error}</div>
      </div>
    )
  }

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

      <div className="w-full overflow-x-auto">
        <svg
          width={chartWidth}
          height={chartHeight}
          className="border rounded"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          <defs>
            <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#e5e7eb" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          <polyline fill="none" stroke="hsl(var(--primary))" strokeWidth="2" points={points} />

          <text x={padding} y={padding} className="text-xs fill-muted-foreground">
            ${maxPrice.toFixed(2)}
          </text>
          <text x={padding} y={chartHeight - padding + 15} className="text-xs fill-muted-foreground">
            ${minPrice.toFixed(2)}
          </text>
        </svg>
      </div>

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
