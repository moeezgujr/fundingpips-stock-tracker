"use client"

/**
 * Reusable error message component
 */
import { AlertCircle } from "lucide-react"
import { Button } from "./button"

interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
  retryLabel?: string
}

export function ErrorMessage({ title = "Error", message, onRetry, retryLabel = "Retry" }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
      <AlertCircle className="h-8 w-8 text-destructive" />
      <div>
        <h3 className="font-semibold text-destructive">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          {retryLabel}
        </Button>
      )}
    </div>
  )
}
