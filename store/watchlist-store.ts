import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface WatchlistItem {
  symbol: string
  name: string
  addedAt: string
}

interface WatchlistStore {
  watchlist: WatchlistItem[]
  addToWatchlist: (item: Omit<WatchlistItem, "addedAt">) => void
  removeFromWatchlist: (symbol: string) => void
  clearWatchlist: () => void
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      watchlist: [],

      addToWatchlist: (item) => {
        const { watchlist } = get()
        const exists = watchlist.some((w) => w.symbol === item.symbol)

        if (!exists) {
          set({
            watchlist: [...watchlist, { ...item, addedAt: new Date().toISOString() }],
          })
        }
      },

      removeFromWatchlist: (symbol) => {
        set({
          watchlist: get().watchlist.filter((item) => item.symbol !== symbol),
        })
      },

      clearWatchlist: () => {
        set({ watchlist: [] })
      },
    }),
    {
      name: "fundingpips-watchlist",
    },
  ),
)
