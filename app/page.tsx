import { Suspense } from "react"
import { SearchBar } from "@/components/search-bar"
import { WatchlistSection } from "@/components/watchlist-section"
import { MarketOverview } from "@/components/market-overview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">FundingPips Stock Tracker</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Track your favorite stocks in real-time with advanced analytics and personalized watchlists
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Search Stocks</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchBar />
        </CardContent>
      </Card>

      {/* Market Overview - RSC for SEO and initial load */}
      <Suspense fallback={<MarketOverviewSkeleton />}>
        <MarketOverview />
      </Suspense>

      {/* Watchlist Section - Client component for interactivity */}
      <WatchlistSection />
    </div>
  )
}

function MarketOverviewSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
