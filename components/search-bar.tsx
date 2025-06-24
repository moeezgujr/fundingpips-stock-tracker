"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Loader2 } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { useStockSearch } from "@/hooks/use-stock-query"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebounce(query, 300)

  // Use React Query for search
  const { data: results = [], isLoading, error } = useStockSearch(debouncedQuery)

  // Handle click outside to close results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Show results when we have data
  useEffect(() => {
    if (results.length > 0 && debouncedQuery) {
      setShowResults(true)
    }
  }, [results, debouncedQuery])

  const handleStockSelect = (symbol: string) => {
    setShowResults(false)
    setQuery("")
    router.push(`/stock/${symbol}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/stock/${query.toUpperCase()}`)
    }
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search stocks by symbol or company name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setShowResults(true)}
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={!query.trim()}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </form>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {results.map((stock) => (
              <button
                key={stock.symbol}
                onClick={() => handleStockSelect(stock.symbol)}
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
            ))}
          </CardContent>
        </Card>
      )}

      {/* Error state */}
      {error && debouncedQuery && (
        <Card className="absolute top-full mt-2 w-full z-50">
          <CardContent className="p-4 text-center text-muted-foreground">
            Unable to search at this time. Please try again.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
