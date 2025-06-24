/**
 * Empty watchlist state component
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function WatchlistEmpty() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Watchlist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            Your watchlist is empty. Search for stocks to add them to your watchlist.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
