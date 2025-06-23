"use client"

import { Button } from "@/components/ui/button"
import { useWatchlistStore } from "@/store/watchlist-store"
import { Star, StarOff } from "lucide-react"

interface AddToWatchlistButtonProps {
  symbol: string
  name: string
}

export function AddToWatchlistButton({ symbol, name }: AddToWatchlistButtonProps) {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStore()
  const isInWatchlist = watchlist.some((item) => item.symbol === symbol)

  const handleToggle = () => {
    if (isInWatchlist) {
      removeFromWatchlist(symbol)
    } else {
      addToWatchlist({ symbol, name })
    }
  }

  return (
    <Button onClick={handleToggle} variant={isInWatchlist ? "default" : "outline"} className="flex items-center gap-2">
      {isInWatchlist ? (
        <>
          <Star className="h-4 w-4 fill-current" />
          Remove from Watchlist
        </>
      ) : (
        <>
          <StarOff className="h-4 w-4" />
          Add to Watchlist
        </>
      )}
    </Button>
  )
}
