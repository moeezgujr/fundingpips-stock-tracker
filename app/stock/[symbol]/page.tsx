import { Suspense } from "react"
import { notFound } from "next/navigation"
import { StockDetailsWithQuery } from "@/components/stock-details-with-query"
import { StockChart } from "@/components/stock-chart"
import { AddToWatchlistButton } from "@/components/add-to-watchlist-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { stockApi } from "@/lib/stock-api"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface StockPageProps {
  params: {
    symbol: string
  }
}

export async function generateStaticParams() {
  const popularStocks = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN"]
  return popularStocks.map((symbol) => ({ symbol }))
}

export async function generateMetadata({ params }: StockPageProps) {
  try {
    const stock = await stockApi.getStockQuote(params.symbol)
    return {
      title: `${stock.symbol} - ${stock.name} | FundingPips`,
      description: `Track ${stock.name} (${stock.symbol}) stock price, charts, and analysis.`,
    }
  } catch {
    return {
      title: `${params.symbol} | FundingPips`,
      description: "Stock information and analysis",
    }
  }
}

export default async function StockPage({ params }: StockPageProps) {
  try {
    const stock = await stockApi.getStockQuote(params.symbol)

    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{stock.name}</h1>
            <p className="text-xl text-muted-foreground">{stock.symbol}</p>
          </div>
          <AddToWatchlistButton symbol={stock.symbol} name={stock.name} />
        </div>

        <Suspense fallback={<StockDetailsSkeleton />}>
          <StockDetailsWithQuery symbol={params.symbol} initialData={stock} />
        </Suspense>
        <Card>
          <CardHeader>
            <CardTitle>Price Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartSkeleton />}>
              <StockChart symbol={params.symbol} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error("Error loading stock:", error)
    notFound()
  }
}

function StockDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Price</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-40" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Key Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i}>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ChartSkeleton() {
  return <Skeleton className="h-96 w-full" />
}

export const revalidate = 300
