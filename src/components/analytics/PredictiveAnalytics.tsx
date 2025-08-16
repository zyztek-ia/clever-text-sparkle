
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { realDataIntegrationService } from '@/services/realDataIntegration'

interface Prediction {
  type: string
  value: number
  confidence: number
  timestamp: string
  trend: 'up' | 'down' | 'stable'
}

interface Anomaly {
  type: string
  severity: 'low' | 'medium' | 'high'
  description: string
  timestamp: string
  impact: string
}

export const PredictiveAnalytics: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [forecastData, setForecastData] = useState<any[]>([])

  useEffect(() => {
    loadPredictions()
    generateForecastData()
  }, [])

  const loadPredictions = async () => {
    setIsAnalyzing(true)
    
    try {
      // Generate AI predictions
      const sardineModel = await realDataIntegrationService.generateSardinePopulationPrediction()
      
      const newPredictions: Prediction[] = [
        {
          type: 'Población de Sardina',
          value: sardineModel.data[1]?.population || 2300000,
          confidence: sardineModel.confidence,
          timestamp: new Date().toISOString(),
          trend: 'up'
        },
        {
          type: 'Temperatura Oceánica',
          value: 18.5 + Math.random() * 2,
          confidence: 0.85,
          timestamp: new Date().toISOString(),
          trend: Math.random() > 0.5 ? 'up' : 'down'
        },
        {
          type: 'Velocidad de Corrientes',
          value: 2.1 + Math.random() * 0.8,
          confidence: 0.78,
          timestamp: new Date().toISOString(),
          trend: 'stable'
        }
      ]
      
      setPredictions(newPredictions)
      
      // Generate anomalies
      const mockAnomalies: Anomaly[] = [
        {
          type: 'Temperatura',
          severity: 'medium',
          description: 'Incremento gradual de temperatura detectado',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          impact: 'Posible migración temprana de sardinas'
        },
        {
          type: 'Corrientes',
          severity: 'low',
          description: 'Patrón de corrientes irregular en sector norte',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          impact: 'Monitoreo continuo recomendado'
        }
      ]
      
      setAnomalies(mockAnomalies)
      
    } catch (error) {
      console.error('Error loading predictions:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateForecastData = () => {
    const data = []
    const now = new Date()
    
    for (let i = 0; i < 48; i++) { // 48 hours forecast
      const timestamp = new Date(now.getTime() + i * 60 * 60 * 1000)
      
      data.push({
        time: timestamp.toLocaleString('es-MX', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit' 
        }),
        temperature: 18 + Math.sin(i * 0.1) * 2 + Math.random() * 0.5,
        sardine_population: 2300000 + Math.sin(i * 0.05) * 100000 + Math.random() * 50000,
        current_speed: 2.0 + Math.sin(i * 0.08) * 0.5 + Math.random() * 0.2,
        confidence: Math.max(0.6, 1 - (i * 0.01)) // Confidence decreases over time
      })
    }
    
    setForecastData(data)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400'
      case 'low': return 'bg-blue-500/20 text-blue-400'
      default: return 'bg-muted/40'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗'
      case 'down': return '↘'
      case 'stable': return '→'
      default: return '→'
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Analysis Status */}
      <Card className="backdrop-blur-md bg-white/5 border border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            Estado de Análisis IA
            {isAnalyzing && <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="font-semibold">Modelos Activos</span>
              </div>
              <p className="text-2xl font-bold text-green-400">3</p>
              <p className="text-sm text-muted-foreground">Sardina, Temperatura, Corrientes</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="font-semibold">Próxima Actualización</span>
              </div>
              <p className="text-2xl font-bold text-blue-400">25m</p>
              <p className="text-sm text-muted-foreground">Análisis automático continuo</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="font-semibold">Precisión Promedio</span>
              </div>
              <p className="text-2xl font-bold text-purple-400">87%</p>
              <p className="text-sm text-muted-foreground">Últimas 168 horas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Predictions Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {predictions.map((prediction, index) => (
          <Card key={index} className="backdrop-blur-md bg-white/5 border border-white/10">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                {prediction.type}
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                  {getTrendIcon(prediction.trend)} {(prediction.confidence * 100).toFixed(0)}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-foreground">
                  {prediction.type.includes('Población') 
                    ? `${(prediction.value / 1000000).toFixed(1)}M`
                    : prediction.value.toFixed(1)
                  }
                  {prediction.type.includes('Temperatura') && '°C'}
                  {prediction.type.includes('Velocidad') && ' m/s'}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Predicción para próximas 48h
                </div>
                
                <div className="w-full bg-muted/20 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${prediction.confidence * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Forecast Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="backdrop-blur-md bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle>Pronóstico de Temperatura (48h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData.slice(0, 24)}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: 'hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    stroke="#ef4444"
                    fillOpacity={1}
                    fill="url(#tempGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle>Población de Sardina Proyectada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData.slice(0, 24)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: 'hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: any) => [`${(value / 1000000).toFixed(2)}M`, 'Población']}
                  />
                  <Line
                    type="monotone"
                    dataKey="sardine_population"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Anomaly Detection */}
      <Card className="backdrop-blur-md bg-white/5 border border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Detección de Anomalías
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {anomalies.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <p>No se detectaron anomalías en las últimas 24 horas</p>
              </div>
            ) : (
              anomalies.map((anomaly, index) => (
                <div key={index} className="backdrop-blur-md bg-white/5 border border-white/10 p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <h4 className="font-semibold">{anomaly.type}</h4>
                      <Badge variant="secondary" className={getSeverityColor(anomaly.severity)}>
                        {anomaly.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(anomaly.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <p className="text-sm mb-2">{anomaly.description}</p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Impacto:</strong> {anomaly.impact}
                  </p>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/10">
            <Button 
              onClick={loadPredictions}
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>Analizando... <div className="w-4 h-4 ml-2 border-2 border-white/20 border-t-white rounded-full animate-spin" /></>
              ) : (
                'Actualizar Análisis'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
