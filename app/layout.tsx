import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/components/query-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FundingPips Stock Tracker",
  description: "Real-time stock tracking with advanced analytics and personalized watchlists",
  keywords: "stocks, trading, finance, real-time, watchlist, analytics",
  authors: [{ name: "FundingPips" }],
  openGraph: {
    title: "FundingPips Stock Tracker",
    description: "Track your favorite stocks in real-time",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <main className="min-h-screen bg-background">{children}</main>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
