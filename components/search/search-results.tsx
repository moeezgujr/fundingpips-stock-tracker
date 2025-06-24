"use client"

/**
 * Search results dropdown component
 */
import { Card, CardContent } from "@/components/ui/card"
import type { StockSearchResult } from "@/lib/types"

interface SearchResultsProps {
  results: StockSearchResult[]
  onSelect: (symbol: string) => void
  isVisible: boolean
}

export function SearchResults({ results, onSelect, isVisible }: SearchResultsProps) {
  if (!isVisible || results.length === 0) {
    return null
  }

  return (
    <Card className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-y-auto">
      <CardContent className="p-0">
        {results.map((stock) => (
          <SearchResultItem key={stock.symbol} stock={stock} onSelect={() => onSelect(stock.symbol)} />
        ))}
      </CardContent>
    </Card>
  )
}

interface SearchResultItemProps {
  stock: StockSearchResult
  onSelect: () => void
}

function SearchResultItem({ stock, onSelect }: SearchResultItemProps) {
  return (
    <button
      onClick={onSelect}
      className="w-full text-left p-4 hover:bg-muted transition-colors border-b last:border-b-0"
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold">{stock.symbol}</div>
          <div className="text-sm text-muted-foreground truncate">{stock.name}</div>
        </div>
        <div className="text-sm text-muted-foreground">{stock.type}</div>
      </div>
    </button>
  )
}
