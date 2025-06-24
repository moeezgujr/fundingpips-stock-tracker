/**
 * Combined stock details component
 */
import { StockPriceCard } from "./stock-price-card"
import { StockStatsCard } from "./stock-stats-card"
import type { StockQuote } from "@/lib/types"

interface StockDetailsProps {
  stock: StockQuote
}

export function StockDetails({ stock }: StockDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StockPriceCard stock={stock} />
      <StockStatsCard stock={stock} />
    </div>
  )
}
