/**
 * Reusable price display component
 */
import { TrendingUp, TrendingDown } from "lucide-react"
import { formatCurrency, formatPercentage } from "@/lib/utils/format"
import { isPositiveChange } from "@/lib/utils/calculations"
import { cn } from "@/lib/utils"

interface PriceDisplayProps {
  price: number
  change?: number
  changePercent?: number
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
  className?: string
}

export function PriceDisplay({
  price,
  change,
  changePercent,
  size = "md",
  showIcon = true,
  className,
}: PriceDisplayProps) {
  const isPositive = changePercent ? isPositiveChange(changePercent) : false

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl font-bold",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  return (
    <div className={cn("space-y-1", className)}>
      <div className={sizeClasses[size]}>{formatCurrency(price)}</div>

      {(change !== undefined || changePercent !== undefined) && (
        <div className={cn("flex items-center gap-1 text-sm", isPositive ? "text-green-600" : "text-red-600")}>
          {showIcon &&
            (isPositive ? <TrendingUp className={iconSizes[size]} /> : <TrendingDown className={iconSizes[size]} />)}

          {change !== undefined && (
            <span>
              {isPositive ? "+" : ""}
              {change.toFixed(2)}
            </span>
          )}

          {changePercent !== undefined && <span>({formatPercentage(changePercent)})</span>}
        </div>
      )}
    </div>
  )
}
