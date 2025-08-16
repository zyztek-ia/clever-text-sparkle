
import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ChartDataPoint {
  timestamp: string
  temperature?: number
  current_speed?: number
  depth?: number
  sardine_density?: number
  wave_height?: number
}

interface OceanographicChartProps {
  data: ChartDataPoint[]
  type: 'temperature' | 'current' | 'depth' | 'sardine' | 'wave'
  title: string
  className?: string
  showTrend?: boolean
  isRealTime?: boolean
}

const chartConfigs = {
  temperature: {
    dataKey: 'temperature',
    color: 'hsl(var(--temp-warm))',
    gradientId: 'thermalGradient',
    unit: '°C',
    icon: '🌡️',
    thresholds: { min: 15, max: 25, optimal: [18, 22] }
  },
  current: {
    dataKey: 'current_speed',
    color: 'hsl(var(--current-strong))',
    gradientId: 'currentGradient',
    unit: 'm/s',
    icon: '🌊',
    thresholds: { min: 0, max: 5, optimal: [1, 3] }
  },
  depth: {
    dataKey: 'depth',
    color: 'hsl(var(--depth-primary))',
    gradientId: 'depthGradient',
    unit: 'm',
    icon: '📏',
    thresholds: { min: 1800, max: 1900, optimal: [1840, 1860] }
  },
  sardine: {
    dataKey: 'sardine_density',
    color: 'hsl(var(--sardine-primary))',
    gradientId: 'sardineGradient',
    unit: 'kg/km²',
    icon: '🐟',
    thresholds: { min: 50, max: 200, optimal: [120, 180] }
  },
  wave: {
    dataKey: 'wave_height',
    color: 'hsl(var(--current-mild))',
    gradientId: 'waveGradient',
    unit: 'm',
    icon: '〰️',
    thresholds: { min: 0, max: 4, optimal: [0.5, 2] }
  }
}

const CustomTooltip = ({ active, payload, label, config }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value
    const isOptimal = value >= config.thresholds.optimal[0] && value <= config.thresholds.optimal[1]
    
    return (
      <div className="glass-card p-3 border border-white/10 rounded-lg backdrop-blur-md">
        <p className="text-sm font-medium text-foreground mb-1">
          {new Date(label).toLocaleString()}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs">{config.icon}</span>
          <span className="text-sm font-bold" style={{ color: config.color }}>
            {value?.toFixed(2)} {config.unit}
          </span>
          {isOptimal && (
            <Badge variant="secondary" className="text-xs bg-current-strong/20 text-current-strong">
              Optimal
            </Badge>
          )}
        </div>
      </div>
    )
  }
  return null
}

const CustomDot = ({ cx, cy, fill, payload, config }: any) => {
  const value = payload[config.dataKey]
  const isOptimal = value >= config.thresholds.optimal[0] && value <= config.thresholds.optimal[1]
  
  return (
    <circle
      cx={cx}
      cy={cy}
      r={isOptimal ? 4 : 2}
      fill={fill}
      stroke={isOptimal ? 'hsl(var(--current-strong))' : fill}
      strokeWidth={isOptimal ? 2 : 1}
      className={isOptimal ? 'animate-pulse' : ''}
    />
  )
}

export const OceanographicChart: React.FC<OceanographicChartProps> = ({
  data,
  type,
  title,
  className,
  showTrend = true,
  isRealTime = false
}) => {
  const config = chartConfigs[type]
  const latestValue = data[data.length - 1]?.[config.dataKey]
  const trend = data.length > 1 ? 
    (latestValue > data[data.length - 2]?.[config.dataKey] ? 'up' : 'down') : 'stable'

  // Calculate average for trend line
  const average = data.reduce((sum, point) => sum + (point[config.dataKey] || 0), 0) / data.length

  return (
    <Card className={cn("data-visualization-card", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <span className="text-xl">{config.icon}</span>
            {title}
            {isRealTime && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-current-strong rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground">LIVE</span>
              </div>
            )}
          </CardTitle>
          {showTrend && (
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs",
                  trend === 'up' && "bg-current-strong/20 text-current-strong",
                  trend === 'down' && "bg-thermal-cool/20 text-thermal-cool",
                  trend === 'stable' && "bg-muted/40"
                )}
              >
                {trend === 'up' && '↗'} 
                {trend === 'down' && '↘'} 
                {trend === 'stable' && '→'}
                {latestValue?.toFixed(1)} {config.unit}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="h-64 w-full relative overflow-hidden rounded-b-lg">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" 
                 style={{
                   backgroundImage: `radial-gradient(circle at 1px 1px, ${config.color} 1px, transparent 0)`,
                   backgroundSize: '20px 20px'
                 }} />
          </div>
          
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <defs>
                <linearGradient id={config.gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={config.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={config.color} stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                strokeOpacity={0.3}
              />
              
              <XAxis 
                dataKey="timestamp"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => new Date(value).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              />
              
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              
              {/* Optimal range indicators */}
              <ReferenceLine 
                y={config.thresholds.optimal[0]} 
                stroke="hsl(var(--current-strong))" 
                strokeDasharray="2 2" 
                strokeOpacity={0.5}
              />
              <ReferenceLine 
                y={config.thresholds.optimal[1]} 
                stroke="hsl(var(--current-strong))" 
                strokeDasharray="2 2" 
                strokeOpacity={0.5}
              />
              
              {/* Average trend line */}
              {showTrend && (
                <ReferenceLine 
                  y={average} 
                  stroke={config.color} 
                  strokeDasharray="5 5" 
                  strokeOpacity={0.7}
                />
              )}
              
              <Tooltip 
                content={<CustomTooltip config={config} />}
                cursor={{ stroke: config.color, strokeWidth: 1, strokeOpacity: 0.5 }}
              />
              
              <Area
                type="monotone"
                dataKey={config.dataKey}
                stroke={config.color}
                strokeWidth={2}
                fill={`url(#${config.gradientId})`}
                dot={<CustomDot config={config} />}
                activeDot={{ 
                  r: 6, 
                  stroke: config.color, 
                  strokeWidth: 2, 
                  fill: 'hsl(var(--background))',
                  className: 'drop-shadow-lg'
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
          
          {/* Real-time indicator */}
          {isRealTime && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1">
              <div className="w-1.5 h-1.5 bg-current-strong rounded-full animate-pulse" />
              <span className="text-xs font-medium">Live Data</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
