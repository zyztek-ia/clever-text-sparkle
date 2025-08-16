import { DataCard } from "@/components/ui/data-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Thermometer, 
  Waves, 
  Fish, 
  Satellite, 
  TrendingUp,
  Navigation,
  Layers,
  Clock
} from "lucide-react"
import heroImage from "@/assets/hero-oceanic.jpg"

export function OceanicDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <img 
          src={heroImage} 
          alt="Oceanographic monitoring of Ensenada B.C." 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-ocean opacity-70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              Sistema de Agregación y Predicción de Datos Oceánicos
            </h1>
            <p className="text-xl md:text-2xl mb-6 text-white/90">
              Monitoreo en tiempo real de Ensenada, B.C. • Datos oceanográficos y climatológicos
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Satellite className="w-4 h-4 mr-2" />
                NOAA Satelital
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Fish className="w-4 h-4 mr-2" />
                Especies Sardina
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Waves className="w-4 h-4 mr-2" />
                Corrientes Oceánicas
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Data Overview */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <DataCard
            variant="thermal"
            title="Temperatura Superficial"
            value="18.2"
            unit="°C"
            trend="up"
            icon={<Thermometer />}
          />
          <DataCard
            variant="current"
            title="Velocidad de Corriente"
            value="2.1"
            unit="m/s"
            trend="stable"
            icon={<Navigation />}
          />
          <DataCard
            variant="depth"
            title="Profundidad Promedio"
            value="1,847"
            unit="m"
            trend="stable"
            icon={<Layers />}
          />
          <DataCard
            variant="sardine"
            title="Densidad de Sardina"
            value="156"
            unit="kg/km²"
            trend="down"
            icon={<Fish />}
          />
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="live" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Datos en Vivo
            </TabsTrigger>
            <TabsTrigger value="historical" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Históricos
            </TabsTrigger>
            <TabsTrigger value="satellite" className="flex items-center gap-2">
              <Satellite className="w-4 h-4" />
              Satélite
            </TabsTrigger>
            <TabsTrigger value="sardine" className="flex items-center gap-2">
              <Fish className="w-4 h-4" />
              Sardina
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-data">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-thermal-warm" />
                    Mapa Térmico en Tiempo Real
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-thermal rounded-lg flex items-center justify-center text-white/80">
                    Visualización de temperatura oceánica - Datos NOAA en tiempo real
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-data">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Waves className="w-5 h-5 text-current-mild" />
                    Corrientes Actuales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-ocean rounded-lg flex items-center justify-center text-white/80">
                    Mapa de corrientes oceánicas y dirección de flujo
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-data">
              <CardHeader>
                <CardTitle>Estaciones de Monitoreo Activas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <h4 className="font-semibold text-foreground mb-2">Estación Central</h4>
                    <p className="text-sm text-muted-foreground">31.8667°N, 116.6000°W</p>
                    <Badge variant="secondary" className="mt-2">Activa</Badge>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <h4 className="font-semibold text-foreground mb-2">Estación Norte</h4>
                    <p className="text-sm text-muted-foreground">31.9200°N, 116.5800°W</p>
                    <Badge variant="secondary" className="mt-2">Activa</Badge>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <h4 className="font-semibold text-foreground mb-2">Estación Sur</h4>
                    <p className="text-sm text-muted-foreground">31.8100°N, 116.6200°W</p>
                    <Badge variant="secondary" className="mt-2">Activa</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historical" className="space-y-6">
            <Card className="shadow-data">
              <CardHeader>
                <CardTitle>Análisis Histórico de Temperatura</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-gradient-thermal rounded-lg flex items-center justify-center text-white/80">
                  Gráficos de tendencias históricas - Datos de temperatura de los últimos 10 años
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="satellite" className="space-y-6">
            <Card className="shadow-data">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Satellite className="w-5 h-5" />
                  Imágenes Satelitales NOAA/CONABIO
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gradient-depth rounded-lg flex items-center justify-center text-white/80">
                  Agregación sistemática de imágenes satelitales de múltiples fuentes
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sardine" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-data">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fish className="w-5 h-5 text-current-strong" />
                    Migración de Sardina
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <DataCard
                      variant="sardine"
                      title="Población Estimada"
                      value="2.3M"
                      unit="individuos"
                      trend="down"
                    />
                    <DataCard
                      variant="sardine"
                      title="Tasa de Reproducción"
                      value="87%"
                      unit="éxito"
                      trend="up"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-data">
                <CardHeader>
                  <CardTitle>Rutas de Migración</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-ocean rounded-lg flex items-center justify-center text-white/80">
                    Mapeo de rutas migratorias estacionales
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}