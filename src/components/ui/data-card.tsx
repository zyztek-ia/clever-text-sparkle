import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cva, type VariantProps } from "class-variance-authority"

const dataCardVariants = cva(
  "relative overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-glow border-border/50",
  {
    variants: {
      variant: {
        default: "bg-card/90",
        thermal: "bg-gradient-thermal border-thermal-cool/30",
        current: "bg-gradient-ocean border-current-mild/30",
        depth: "bg-gradient-depth border-primary/30",
        sardine: "bg-card/95 border-current-strong/20"
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface DataCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dataCardVariants> {
  title: string
  value: string | number
  unit?: string
  trend?: "up" | "down" | "stable"
  icon?: React.ReactNode
}

const DataCard = React.forwardRef<HTMLDivElement, DataCardProps>(
  ({ className, variant, size, title, value, unit, trend, icon, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(dataCardVariants({ variant, size, className }))}
        {...props}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon && (
            <div className="h-4 w-4 text-muted-foreground">
              {icon}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-1">
            <div className="text-2xl font-bold text-foreground">
              {value}
            </div>
            {unit && (
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                {unit}
              </div>
            )}
          </div>
          {trend && (
            <div className={cn(
              "mt-1 text-xs flex items-center",
              trend === "up" && "text-current-strong",
              trend === "down" && "text-thermal-cool",
              trend === "stable" && "text-muted-foreground"
            )}>
              <span className={cn(
                "mr-1",
                trend === "up" && "↗",
                trend === "down" && "↘",
                trend === "stable" && "→"
              )}>
                {trend === "up" && "↗"}
                {trend === "down" && "↘"}
                {trend === "stable" && "→"}
              </span>
              {trend === "up" && "Increasing"}
              {trend === "down" && "Decreasing"}
              {trend === "stable" && "Stable"}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
)

DataCard.displayName = "DataCard"

export { DataCard, dataCardVariants }