/**
 * Main search bar component
 */
"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDebounce } from "@/hooks/use-debounce"
import { useStockSearch } from "@/hooks/queries/use-stock-queries"
import { SearchInput } from "./search-input"
import { SearchResults } from "./search-results"
import { ErrorMessage } from "@/components/ui/error-message"
import { sanitizeStockSymbol, isValidSearchQuery } from "@/lib/utils/validation"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebounce(query, 300)
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
    if (results.length > 0 && debouncedQuery && isValidSearchQuery(debouncedQuery)) {
      setShowResults(true)
    }
  }, [results, debouncedQuery])

  const handleStockSelect = (symbol: string) => {
    setShowResults(false)
    setQuery("")
    router.push(`/stock/${sanitizeStockSymbol(symbol)}`)
  }

  const handleSubmit = () => {
    if (isValidSearchQuery(query)) {
      const sanitizedSymbol = sanitizeStockSymbol(query)
      router.push(`/stock/${sanitizedSymbol}`)
      setQuery("")
      setShowResults(false)
    }
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <SearchInput
        value={query}
        onChange={setQuery}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        placeholder="Search stocks by symbol or company name..."
      />

      <SearchResults results={results} onSelect={handleStockSelect} isVisible={showResults} />

      {error && debouncedQuery && (
        <div className="absolute top-full mt-2 w-full z-50">
          <ErrorMessage title="Search Error" message="Unable to search at this time. Please try again." />
        </div>
      )}
    </div>
  )
}
