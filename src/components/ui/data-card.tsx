
import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cva, type VariantProps } from "class-variance-authority"

const dataCardVariants = cva(
  "relative overflow-hidden glass-card hover-lift glow-effect transition-all duration-500 group cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-card/60 to-card/30 border-border/20",
        thermal: "thermal-gradient border-thermal-cool/20 data-flow-effect",
        current: "ocean-current-flow border-current-mild/20 wave-animation",
        depth: "depth-visualization border-primary/20 depth-scanner",
        sardine: "bg-gradient-to-br from-sardine-primary/10 to-current-strong/5 border-current-strong/15 ripple-effect"
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

const TrendIcon = ({ trend }: { trend: "up" | "down" | "stable" }) => {
  const baseClasses = "transition-all duration-300 group-hover:scale-110"
  
  switch (trend) {
    case "up":
      return (
        <div className={cn(baseClasses, "text-current-strong animate-bounce")}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 3l3 3h-2v4H7V6H5l3-3z" />
          </svg>
        </div>
      )
    case "down":
      return (
        <div className={cn(baseClasses, "text-thermal-cool rotate-180 animate-bounce")}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 3l3 3h-2v4H7V6H5l3-3z" />
          </svg>
        </div>
      )
    case "stable":
      return (
        <div className={cn(baseClasses, "text-muted-foreground")}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
      )
    default:
      return null
  }
}

export interface DataCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dataCardVariants> {
  title: string
  value: string | number
  unit?: string
  trend?: "up" | "down" | "stable"
  icon?: React.ReactNode
  subtitle?: string
  isActive?: boolean
}

const DataCard = React.forwardRef<HTMLDivElement, DataCardProps>(
  ({ 
    className, 
    variant, 
    size, 
    title, 
    value, 
    unit, 
    trend, 
    icon, 
    subtitle,
    isActive = false,
    ...props 
  }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          dataCardVariants({ variant, size, className }),
          isActive && "ring-2 ring-primary-glow/50 shadow-glow"
        )}
        {...props}
      >
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-4 left-4 w-1 h-1 bg-primary-glow/30 rounded-full float-animation" 
               style={{ animationDelay: '0s' }} />
          <div className="absolute top-8 right-8 w-0.5 h-0.5 bg-current-mild/40 rounded-full float-animation" 
               style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-thermal-warm/20 rounded-full float-animation" 
               style={{ animationDelay: '2s' }} />
        </div>

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium text-muted-foreground/90 group-hover:text-foreground transition-colors duration-300">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-xs text-muted-foreground/70">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className="h-5 w-5 text-muted-foreground/70 group-hover:text-primary-glow transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              {icon}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="relative z-10">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline space-x-2">
              <div className="text-2xl font-bold text-foreground group-hover:gradient-text transition-all duration-500 transform group-hover:scale-105">
                {value}
              </div>
              {unit && (
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  {unit}
                </div>
              )}
            </div>
            
            {trend && <TrendIcon trend={trend} />}
          </div>
          
          {trend && (
            <div className={cn(
              "mt-2 text-xs flex items-center gap-1 font-medium transition-all duration-300",
              trend === "up" && "text-current-strong",
              trend === "down" && "text-thermal-cool", 
              trend === "stable" && "text-muted-foreground/80"
            )}>
              <span className="capitalize opacity-80 group-hover:opacity-100">
                {trend === "up" && "Increasing trend"}
                {trend === "down" && "Decreasing trend"}
                {trend === "stable" && "Stable conditions"}
              </span>
            </div>
          )}
        </CardContent>

        {/* Shimmer overlay effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
        
        {/* Bottom wave border */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-glow/0 via-primary-glow/50 to-primary-glow/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </Card>
    )
  }
)

DataCard.displayName = "DataCard"

export { DataCard, dataCardVariants }
