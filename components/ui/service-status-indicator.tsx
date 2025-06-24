"use client"

/**
 * Service status indicator component
 */
import { Badge } from "./badge"
import { stockService } from "@/lib/services/stock-service"
import { useEffect, useState } from "react"

export function ServiceStatusIndicator() {
  const [status, setStatus] = useState<{ mode: "demo" | "live"; hasApiKey: boolean }>({
    mode: "demo",
    hasApiKey: false,
  })

  useEffect(() => {
    setStatus(stockService.getServiceStatus())
  }, [])

  if (status.mode === "live") {
    return (
      <Badge variant="default" className="bg-green-600">
        Live Data
      </Badge>
    )
  }

  return <Badge variant="secondary">Demo Mode</Badge>
}
