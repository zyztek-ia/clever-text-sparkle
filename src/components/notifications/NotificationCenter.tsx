
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bell, AlertTriangle, Info, CheckCircle, X, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Alert {
  id: string
  timestamp: string
  alert_type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  station_id?: string
  acknowledged: boolean
  resolved: boolean
}

interface NotificationCenterProps {
  className?: string
}

const severityConfig = {
  low: { color: 'text-muted-foreground', bg: 'bg-muted/40', icon: Info },
  medium: { color: 'text-current-mild', bg: 'bg-current-mild/20', icon: Bell },
  high: { color: 'text-thermal-warm', bg: 'bg-thermal-warm/20', icon: AlertTriangle },
  critical: { color: 'text-destructive', bg: 'bg-destructive/20', icon: AlertTriangle }
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ className }) => {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unresolved'>('unresolved')

  // Simulate real-time alerts
  useEffect(() => {
    const generateAlert = () => {
      const alertTypes = ['temperature', 'current', 'sardine_population', 'system', 'sensor']
      const severities: Alert['severity'][] = ['low', 'medium', 'high', 'critical']
      const stations = ['central', 'north', 'south']
      
      const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)]
      const severity = severities[Math.floor(Math.random() * severities.length)]
      const station = stations[Math.floor(Math.random() * stations.length)]
      
      const alertMessages = {
        temperature: {
          title: 'Anomalía de Temperatura',
          description: `Temperatura oceánica fuera del rango normal en estación ${station}`
        },
        current: {
          title: 'Cambio en Corrientes',
          description: `Variación significativa en velocidad de corriente detectada`
        },
        sardine_population: {
          title: 'Migración de Sardina',
          description: `Cambio en patrón migratorio de población de sardinas`
        },
        system: {
          title: 'Estado del Sistema',
          description: `Actualización de estado en estación de monitoreo`
        },
        sensor: {
          title: 'Sensor',
          description: `Calibración requerida en sensor de ${station}`
        }
      }

      const newAlert: Alert = {
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        alert_type: alertType,
        severity,
        title: alertMessages[alertType as keyof typeof alertMessages].title,
        description: alertMessages[alertType as keyof typeof alertMessages].description,
        station_id: station,
        acknowledged: false,
        resolved: false
      }

      setAlerts(prev => [newAlert, ...prev.slice(0, 19)]) // Keep only 20 most recent

      // Show toast for high/critical alerts
      if (severity === 'high' || severity === 'critical') {
        toast.error(newAlert.title, {
          description: newAlert.description,
          action: {
            label: 'Ver Detalles',
            onClick: () => setIsOpen(true)
          }
        })
      }
    }

    // Generate initial alerts
    for (let i = 0; i < 5; i++) {
      setTimeout(() => generateAlert(), i * 1000)
    }

    // Generate new alerts periodically
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 30 seconds
        generateAlert()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true }
          : alert
      )
    )
    toast.success('Alerta reconocida')
  }

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, resolved: true, acknowledged: true }
          : alert
      )
    )
    toast.success('Alerta resuelta')
  }

  const filteredAlerts = alerts.filter(alert => 
    filter === 'all' ? true : !alert.resolved
  )

  const unResolvedCount = alerts.filter(alert => !alert.resolved).length
  const criticalCount = alerts.filter(alert => 
    alert.severity === 'critical' && !alert.resolved
  ).length

  if (!isOpen) {
    return (
      <div className={cn("fixed top-4 right-4 z-50", className)}>
        <Button
          onClick={() => setIsOpen(true)}
          variant="secondary"
          className="glass-card hover:glass-heavy relative"
        >
          <Bell className="w-4 h-4 mr-2" />
          Alertas
          {unResolvedCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center text-xs"
            >
              {unResolvedCount}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("fixed top-4 right-4 z-50 w-96", className)}>
      <Card className="glass-heavy max-h-[80vh] overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Centro de Notificaciones
              {criticalCount > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  {criticalCount} Críticas
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilter(filter === 'all' ? 'unresolved' : 'all')}
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={filter === 'unresolved' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unresolved')}
              className="text-xs"
            >
              Sin Resolver ({unResolvedCount})
            </Button>
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className="text-xs"
            >
              Todas ({alerts.length})
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 max-h-96 overflow-y-auto">
          {filteredAlerts.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No hay alertas {filter === 'unresolved' ? 'pendientes' : ''}</p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {filteredAlerts.map((alert) => {
                const config = severityConfig[alert.severity]
                const Icon = config.icon
                
                return (
                  <div
                    key={alert.id}
                    className={cn(
                      "glass-card p-3 rounded-lg border transition-all duration-300",
                      config.bg,
                      alert.resolved && "opacity-60",
                      !alert.acknowledged && alert.severity === 'critical' && "animate-pulse"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", config.color)} />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm text-foreground truncate">
                            {alert.title}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-2">
                          {alert.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                            {alert.station_id && (
                              <Badge variant="outline" className="text-xs">
                                {alert.station_id}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex gap-1">
                            {!alert.acknowledged && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => acknowledgeAlert(alert.id)}
                                className="h-6 px-2 text-xs"
                              >
                                Reconocer
                              </Button>
                            )}
                            {!alert.resolved && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => resolveAlert(alert.id)}
                                className="h-6 px-2 text-xs text-current-strong"
                              >
                                Resolver
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
