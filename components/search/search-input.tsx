"use client"

import type React from "react"

/**
 * Search input component
 */
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading?: boolean
  placeholder?: string
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  placeholder = "Search stocks...",
}: SearchInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button type="submit" disabled={!value.trim() || isLoading}>
        {isLoading ? <LoadingSpinner size="sm" /> : <Search className="h-4 w-4" />}
      </Button>
    </form>
  )
}
