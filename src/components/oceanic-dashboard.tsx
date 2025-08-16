import { DataCard } from "@/components/ui/data-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OceanographicChart } from "@/components/charts/OceanographicChart"
import { useOceanographicData, useMonitoringStations } from "@/hooks/useOceanographicData"
import { cn } from "@/lib/utils"
import { 
  Thermometer, 
  Waves, 
  Fish, 
  Satellite, 
  TrendingUp,
  Navigation,
  Layers,
  Clock,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Activity,
  CloudRain,
  Wind,
  Eye
} from "lucide-react"
import heroImage from "@/assets/hero-oceanic.jpg"
import { toast } from "sonner"
import { NotificationCenter } from "@/components/notifications/NotificationCenter"

export function OceanicDashboard() {
  const { 
    currentConditions, 
    sardineData, 
    weatherData,
    chartData,
    isLoading,
    isConnected,
    lastUpdate,
    dataQuality,
    refresh 
  } = useOceanographicData({
    enableRealTime: true,
    refreshInterval: 30000
  })

  const { stations, activeStations, totalStations, healthyStations } = useMonitoringStations()

  const handleRefresh = async () => {
    toast.promise(refresh(), {
      loading: 'Actualizando datos oceanográficos...',
      success: 'Datos actualizados correctamente',
      error: 'Error al actualizar los datos'
    })
  }

  const connectionStatus = isConnected ? 'Conectado' : 'Desconectado'
  const lastUpdateText = lastUpdate 
    ? `Última actualización: ${lastUpdate.toLocaleTimeString()}`
    : 'Sin actualizaciones recientes'

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Add notification center */}
      <NotificationCenter />
      
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-glow/5 rounded-full float-animation" 
             style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-20 w-24 h-24 bg-current-mild/5 rounded-full float-animation" 
             style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-1/3 w-40 h-40 bg-thermal-warm/5 rounded-full float-animation" 
             style={{ animationDelay: '4s' }} />
      </div>

      {/* Enhanced Hero Section */}
      <div className="relative h-[70vh] overflow-hidden oceanographic-hero">
        <img 
          src={heroImage} 
          alt="Monitoreo oceanográfico de Ensenada B.C." 
          className="w-full h-full object-cover transform-3d hover-lift"
        />
        <div className="absolute inset-0 bg-gradient-ocean opacity-60" />
        
        {/* Status bar */}
        <div className="absolute top-6 right-6 flex items-center gap-4">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-current-strong" />
            ) : (
              <WifiOff className="w-4 h-4 text-destructive" />
            )}
            <span className="text-sm font-medium text-white">{connectionStatus}</span>
          </div>
          
          <Button 
            onClick={handleRefresh}
            variant="secondary"
            size="sm"
            className="glass-card hover:glass-heavy"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-5xl px-6 space-y-6">
            <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight gradient-text float-animation">
              Sistema de Agregación y Predicción de Datos Oceánicos
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 shimmer-effect">
              Monitoreo en tiempo real de Ensenada, B.C. • Datos oceanográficos y climatológicos avanzados
            </p>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <Badge variant="secondary" className="glass-card text-white border-white/20 hover-lift">
                <Satellite className="w-4 h-4 mr-2" />
                NOAA Satelital
              </Badge>
              <Badge variant="secondary" className="glass-card text-white border-white/20 hover-lift">
                <Fish className="w-4 h-4 mr-2" />
                Monitoreo de Sardina
              </Badge>
              <Badge variant="secondary" className="glass-card text-white border-white/20 hover-lift">
                <Waves className="w-4 h-4 mr-2" />
                Corrientes en Tiempo Real
              </Badge>
              <Badge variant="secondary" className="glass-card text-white border-white/20 hover-lift">
                <Activity className="w-4 h-4 mr-2" />
                IA Predictiva
              </Badge>
            </div>

            {/* Live status indicators */}
            <div className="mt-8 flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-full">
                <div className="w-2 h-2 bg-current-strong rounded-full animate-pulse" />
                <span>Estaciones: {healthyStations}/{totalStations}</span>
              </div>
              <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-full">
                <div className="w-2 h-2 bg-primary-glow rounded-full animate-pulse" />
                <span>Calidad de Datos: {dataQuality.overall === 'good' ? 'Excelente' : 'Limitada'}</span>
              </div>
              <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-full">
                <Clock className="w-3 h-3" />
                <span className="text-xs">{lastUpdateText}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave effect at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Enhanced Data Overview */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <DataCard
            variant="thermal"
            title="Temperatura Superficial"
            subtitle="Sensor térmico infrarrojo"
            value={currentConditions?.temperature?.toFixed(1) || "--"}
            unit="°C"
            trend={currentConditions?.temperature && currentConditions.temperature > 18 ? "up" : currentConditions?.temperature && currentConditions.temperature < 16 ? "down" : "stable"}
            icon={<Thermometer className="w-5 h-5" />}
            isActive={true}
          />
          
          <DataCard
            variant="current"
            title="Velocidad de Corriente"
            subtitle="Doppler acústico"
            value={currentConditions?.current_speed?.toFixed(1) || "--"}
            unit="m/s"
            trend={currentConditions?.current_speed && currentConditions.current_speed > 2.5 ? "up" : currentConditions?.current_speed && currentConditions.current_speed < 1.5 ? "down" : "stable"}
            icon={<Navigation className="w-5 h-5" />}
            isActive={true}
          />
          
          <DataCard
            variant="depth"
            title="Profundidad Promedio"
            subtitle="Sonar multihaz"
            value={currentConditions?.depth?.toFixed(0) || "1,847"}
            unit="m"
            trend="stable"
            icon={<Layers className="w-5 h-5" />}
            isActive={true}
          />
          
          <DataCard
            variant="sardine"
            title="Densidad de Sardina"
            subtitle="Estimación por IA"
            value={sardineData?.density?.toFixed(0) || "--"}
            unit="kg/km²"
            trend={sardineData?.reproduction_rate && sardineData.reproduction_rate > 0.85 ? "up" : sardineData?.reproduction_rate && sardineData.reproduction_rate < 0.80 ? "down" : "stable"}
            icon={<Fish className="w-5 h-5" />}
            isActive={true}
          />
        </div>

        {/* Weather Information Card */}
        {weatherData && (
          <Card className="glass-card mb-8 hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-current-mild" />
                Condiciones Meteorológicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{weatherData.air_temperature.toFixed(1)}°C</div>
                  <div className="text-sm text-muted-foreground">Temperatura del Aire</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{weatherData.humidity.toFixed(0)}%</div>
                  <div className="text-sm text-muted-foreground">Humedad</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{weatherData.pressure.toFixed(0)} hPa</div>
                  <div className="text-sm text-muted-foreground">Presión</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{weatherData.visibility.toFixed(1)} km</div>
                  <div className="text-sm text-muted-foreground">Visibilidad</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Main Dashboard */}
        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 glass-card">
            <TabsTrigger value="live" className="flex items-center gap-2 transition-all duration-300">
              <Clock className="w-4 h-4" />
              Datos en Vivo
            </TabsTrigger>
            <TabsTrigger value="historical" className="flex items-center gap-2 transition-all duration-300">
              <TrendingUp className="w-4 h-4" />
              Análisis Histórico
            </TabsTrigger>
            <TabsTrigger value="satellite" className="flex items-center gap-2 transition-all duration-300">
              <Satellite className="w-4 h-4" />
              Satélite
            </TabsTrigger>
            <TabsTrigger value="sardine" className="flex items-center gap-2 transition-all duration-300">
              <Fish className="w-4 h-4" />
              Ecosistema Marino
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-6">
            {/* Real-time Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <OceanographicChart
                data={chartData}
                type="temperature"
                title="Temperatura Oceánica"
                isRealTime={true}
                showTrend={true}
              />
              
              <OceanographicChart
                data={chartData}
                type="current"
                title="Velocidad de Corrientes"
                isRealTime={true}
                showTrend={true}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <OceanographicChart
                data={chartData}
                type="wave"
                title="Altura de Olas"
                isRealTime={true}
                showTrend={true}
              />
              
              <OceanographicChart
                data={chartData}
                type="depth"
                title="Batimetría Dinámica"
                isRealTime={true}
                showTrend={true}
              />
            </div>

            {/* Enhanced Monitoring Stations */}
            <Card className="glass-heavy">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Estaciones de Monitoreo</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-current-strong/20 text-current-strong">
                      {healthyStations} Activas
                    </Badge>
                    <Badge variant="secondary" className="bg-muted/40">
                      {totalStations} Total
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stations.map((station) => (
                    <div 
                      key={station.id} 
                      className="monitoring-station p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-foreground">{station.name}</h4>
                        <div className="flex items-center gap-1">
                          {station.status === 'active' ? (
                            <CheckCircle className="w-4 h-4 text-current-strong" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-destructive" />
                          )}
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "text-xs",
                              station.status === 'active' && "bg-current-strong/20 text-current-strong",
                              station.status === 'maintenance' && "bg-destructive/20 text-destructive"
                            )}
                          >
                            {station.status === 'active' ? 'Activa' : 'Mantenimiento'}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {station.location.lat.toFixed(4)}°N, {Math.abs(station.location.lng).toFixed(4)}°W
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {station.sensors.map((sensor) => (
                          <Badge key={sensor} variant="outline" className="text-xs glass-card">
                            {sensor}
                          </Badge>
                        ))}
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        Última lectura: {station.lastReading.toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historical" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <OceanographicChart
                data={chartData}
                type="temperature"
                title="Análisis Térmico Histórico (7 días)"
                showTrend={true}
                className="col-span-full"
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <OceanographicChart
                  data={chartData}
                  type="current"
                  title="Patrones de Corrientes"
                  showTrend={true}
                />
                
                <OceanographicChart
                  data={chartData}
                  type="wave"
                  title="Tendencias de Oleaje"
                  showTrend={true}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="satellite" className="space-y-6">
            <Card className="glass-heavy">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Satellite className="w-5 h-5" />
                  Imágenes Satelitales NOAA/CONABIO
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 thermal-gradient rounded-lg flex items-center justify-center text-white/80 relative overflow-hidden">
                  <div className="text-center space-y-4">
                    <Satellite className="w-16 h-16 mx-auto animate-bounce" />
                    <p className="text-lg font-medium">Agregación sistemática de imágenes satelitales</p>
                    <p className="text-sm opacity-80">Integración de múltiples fuentes de datos espaciales</p>
                  </div>
                  
                  {/* Scanning line effect */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" 
                       style={{ animation: 'data-flow 3s linear infinite' }} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sardine" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-heavy">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fish className="w-5 h-5 text-current-strong" />
                    Población de Sardina Monterrey
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <DataCard
                      variant="sardine"
                      title="Población Estimada"
                      subtitle="Modelo predictivo basado en IA"
                      value={sardineData?.population_estimate ? (sardineData.population_estimate / 1000000).toFixed(1) : "--"}
                      unit="M individuos"
                      trend={sardineData?.reproduction_rate && sardineData.reproduction_rate > 0.85 ? "up" : "down"}
                    />
                    
                    <DataCard
                      variant="sardine"
                      title="Tasa de Reproducción"
                      subtitle="Análisis de biomarcadores"
                      value={sardineData?.reproduction_rate ? (sardineData.reproduction_rate * 100).toFixed(0) : "--"}
                      unit="% éxito"
                      trend={sardineData?.reproduction_rate && sardineData.reproduction_rate > 0.85 ? "up" : sardineData?.reproduction_rate && sardineData.reproduction_rate < 0.80 ? "down" : "stable"}
                    />
                    
                    <div className="glass-card p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Navigation className="w-4 h-4" />
                        Patrón Migratorio Actual
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            sardineData?.migration_pattern === 'north' && "bg-current-strong/20 text-current-strong",
                            sardineData?.migration_pattern === 'south' && "bg-thermal-cool/20 text-thermal-cool",
                            sardineData?.migration_pattern === 'stationary' && "bg-muted/40"
                          )}
                        >
                          {sardineData?.migration_pattern === 'north' && '↗ Norte'}
                          {sardineData?.migration_pattern === 'south' && '↘ Sur'}
                          {sardineData?.migration_pattern === 'stationary' && '⊙ Estacionaria'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Temporada {new Date().getMonth() >= 3 && new Date().getMonth() <= 5 ? 'Primavera' : 
                                   new Date().getMonth() >= 6 && new Date().getMonth() <= 8 ? 'Verano' :
                                   new Date().getMonth() >= 9 && new Date().getMonth() <= 11 ? 'Otoño' : 'Invierno'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-heavy">
                <CardHeader>
                  <CardTitle>Rutas Migratorias y Hábitat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 ocean-current-flow rounded-lg flex items-center justify-center text-white/80 relative overflow-hidden">
                    <div className="text-center space-y-4">
                      <Fish className="w-16 h-16 mx-auto wave-animation" />
                      <p className="font-medium">Mapeo de rutas migratorias estacionales</p>
                      <p className="text-sm opacity-80">Análisis de patrones de comportamiento</p>
                    </div>
                    
                    {/* Swimming fish effect */}
                    <div className="absolute top-1/4 left-0 w-4 h-2 bg-white/30 rounded-full float-animation" 
                         style={{ animationDelay: '0s', animationDuration: '8s' }} />
                    <div className="absolute top-1/2 left-1/4 w-3 h-1.5 bg-white/25 rounded-full float-animation" 
                         style={{ animationDelay: '2s', animationDuration: '6s' }} />
                    <div className="absolute top-3/4 left-1/2 w-5 h-2.5 bg-white/20 rounded-full float-animation" 
                         style={{ animationDelay: '4s', animationDuration: '10s' }} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sardine population chart */}
            <OceanographicChart
              data={chartData.map(d => ({ ...d, sardine_density: sardineData?.density || 156 }))}
              type="sardine"
              title="Densidad Poblacional Histórica"
              showTrend={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
