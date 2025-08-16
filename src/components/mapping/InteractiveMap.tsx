
import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Layers, Satellite, Fish, Thermometer, Navigation } from 'lucide-react'

interface MapLayer {
  id: string
  name: string
  type: 'temperature' | 'currents' | 'bathymetry' | 'sardine' | 'satellite'
  visible: boolean
  opacity: number
}

interface MapData {
  temperature: number[][]
  currents: { x: number, y: number, speed: number, direction: number }[]
  sardineLocations: { lat: number, lng: number, density: number }[]
  bathymetry: number[][]
}

export const InteractiveMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [layers, setLayers] = useState<MapLayer[]>([
    { id: 'temperature', name: 'Temperatura', type: 'temperature', visible: true, opacity: 0.7 },
    { id: 'currents', name: 'Corrientes', type: 'currents', visible: true, opacity: 0.8 },
    { id: 'bathymetry', name: 'Batimetría', type: 'bathymetry', visible: false, opacity: 0.6 },
    { id: 'sardine', name: 'Sardina', type: 'sardine', visible: true, opacity: 0.9 },
    { id: 'satellite', name: 'Satélite', type: 'satellite', visible: false, opacity: 1.0 }
  ])

  const [mapData, setMapData] = useState<MapData>({
    temperature: [],
    currents: [],
    sardineLocations: [],
    bathymetry: []
  })

  const [selectedPoint, setSelectedPoint] = useState<{
    lat: number
    lng: number
    data: any
  } | null>(null)

  useEffect(() => {
    initializeMap()
    generateMockMapData()
  }, [])

  const initializeMap = () => {
    if (!mapRef.current) return

    // Create a canvas-based map visualization
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 600
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.cursor = 'crosshair'
    
    mapRef.current.innerHTML = ''
    mapRef.current.appendChild(canvas)

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw base map of Ensenada Bay
    drawBaseMap(ctx, canvas.width, canvas.height)

    // Add click handler for point selection
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) * (canvas.width / rect.width)
      const y = (e.clientY - rect.top) * (canvas.height / rect.height)
      
      // Convert pixel coordinates to lat/lng
      const lat = 31.9200 - (y / canvas.height) * 0.2
      const lng = -116.6500 + (x / canvas.width) * 0.2
      
      setSelectedPoint({
        lat,
        lng,
        data: {
          temperature: 18.5 + Math.random() * 4,
          current_speed: 1.5 + Math.random() * 2,
          sardine_density: Math.floor(100 + Math.random() * 100)
        }
      })
    })

    // Render layers
    renderLayers(ctx, canvas.width, canvas.height)
  }

  const drawBaseMap = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw water background
    ctx.fillStyle = '#1e40af'
    ctx.fillRect(0, 0, width, height)

    // Draw coastline
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 3
    ctx.beginPath()
    
    // Simplified Ensenada Bay coastline
    ctx.moveTo(width * 0.8, 0)
    ctx.lineTo(width * 0.9, height * 0.3)
    ctx.lineTo(width, height * 0.4)
    ctx.lineTo(width, height)
    ctx.lineTo(width * 0.7, height)
    ctx.lineTo(width * 0.6, height * 0.8)
    ctx.lineTo(width * 0.8, height * 0.6)
    ctx.lineTo(width * 0.8, 0)
    
    ctx.stroke()

    // Add grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 1
    
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath()
      ctx.moveTo((width / 10) * i, 0)
      ctx.lineTo((width / 10) * i, height)
      ctx.stroke()
      
      ctx.beginPath()
      ctx.moveTo(0, (height / 10) * i)
      ctx.lineTo(width, (height / 10) * i)
      ctx.stroke()
    }
  }

  const renderLayers = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    layers.forEach(layer => {
      if (!layer.visible) return

      ctx.globalAlpha = layer.opacity

      switch (layer.type) {
        case 'temperature':
          renderTemperatureLayer(ctx, width, height)
          break
        case 'currents':
          renderCurrentsLayer(ctx, width, height)
          break
        case 'sardine':
          renderSardineLayer(ctx, width, height)
          break
        case 'bathymetry':
          renderBathymetryLayer(ctx, width, height)
          break
      }
    })

    ctx.globalAlpha = 1.0
  }

  const renderTemperatureLayer = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Create temperature gradient overlay
    const gridSize = 20
    
    for (let x = 0; x < width; x += gridSize) {
      for (let y = 0; y < height; y += gridSize) {
        const temp = 16 + Math.random() * 8 // 16-24°C
        const hue = (24 - temp) * 8 // Blue to red
        
        ctx.fillStyle = `hsla(${hue}, 70%, 50%, 0.3)`
        ctx.fillRect(x, y, gridSize, gridSize)
      }
    }
  }

  const renderCurrentsLayer = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw current vectors
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 2
    
    const spacing = 50
    
    for (let x = spacing; x < width; x += spacing) {
      for (let y = spacing; y < height; y += spacing) {
        const speed = 0.5 + Math.random() * 3
        const direction = Math.random() * Math.PI * 2
        
        const endX = x + Math.cos(direction) * speed * 10
        const endY = y + Math.sin(direction) * speed * 10
        
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(endX, endY)
        ctx.stroke()
        
        // Arrow head
        const arrowLength = 8
        const arrowAngle = Math.PI / 6
        
        ctx.beginPath()
        ctx.moveTo(endX, endY)
        ctx.lineTo(
          endX - arrowLength * Math.cos(direction - arrowAngle),
          endY - arrowLength * Math.sin(direction - arrowAngle)
        )
        ctx.moveTo(endX, endY)
        ctx.lineTo(
          endX - arrowLength * Math.cos(direction + arrowAngle),
          endY - arrowLength * Math.sin(direction + arrowAngle)
        )
        ctx.stroke()
      }
    }
  }

  const renderSardineLayer = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw sardine concentration areas
    mapData.sardineLocations.forEach((location, index) => {
      const x = (location.lng + 116.6500) * (width / 0.2) * 0.2
      const y = (31.9200 - location.lat) * (height / 0.2) * 0.2
      
      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        const radius = Math.sqrt(location.density / 10)
        
        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
        
        // Add density label
        ctx.fillStyle = '#ffffff'
        ctx.font = '12px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(location.density.toString(), x, y + 4)
      }
    })
  }

  const renderBathymetryLayer = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw depth contours
    ctx.strokeStyle = '#6b7280'
    ctx.lineWidth = 1
    
    // Simulate depth contours
    for (let depth = 10; depth <= 100; depth += 20) {
      const radius = (depth / 100) * Math.min(width, height) * 0.3
      
      ctx.beginPath()
      ctx.arc(width * 0.4, height * 0.6, radius, 0, Math.PI * 2)
      ctx.stroke()
      
      // Add depth label
      ctx.fillStyle = '#6b7280'
      ctx.font = '10px Arial'
      ctx.fillText(`${depth}m`, width * 0.4 + radius - 15, height * 0.6)
    }
  }

  const generateMockMapData = () => {
    // Generate mock sardine locations
    const sardineLocations = []
    for (let i = 0; i < 15; i++) {
      sardineLocations.push({
        lat: 31.8500 + Math.random() * 0.05,
        lng: -116.6200 + Math.random() * 0.05,
        density: Math.floor(80 + Math.random() * 120)
      })
    }

    setMapData(prev => ({
      ...prev,
      sardineLocations
    }))
  }

  const toggleLayer = (layerId: string) => {
    setLayers(prev => 
      prev.map(layer => 
        layer.id === layerId 
          ? { ...layer, visible: !layer.visible }
          : layer
      )
    )
    
    // Re-render map with updated layers
    setTimeout(initializeMap, 100)
  }

  const updateLayerOpacity = (layerId: string, opacity: number) => {
    setLayers(prev => 
      prev.map(layer => 
        layer.id === layerId 
          ? { ...layer, opacity }
          : layer
      )
    )
    
    setTimeout(initializeMap, 100)
  }

  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <Card className="backdrop-blur-md bg-white/5 border border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Capas del Mapa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {layers.map(layer => (
              <div key={layer.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Button
                    variant={layer.visible ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleLayer(layer.id)}
                    className="flex items-center gap-1"
                  >
                    {layer.type === 'temperature' && <Thermometer className="w-3 h-3" />}
                    {layer.type === 'currents' && <Navigation className="w-3 h-3" />}
                    {layer.type === 'sardine' && <Fish className="w-3 h-3" />}
                    {layer.type === 'satellite' && <Satellite className="w-3 h-3" />}
                    {layer.type === 'bathymetry' && <Layers className="w-3 h-3" />}
                    {layer.name}
                  </Button>
                </div>
                
                {layer.visible && (
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Opacidad</label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={layer.opacity}
                      onChange={(e) => updateLayerOpacity(layer.id, parseFloat(e.target.value))}
                      className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Map */}
      <Card className="backdrop-blur-md bg-white/5 border border-white/10">
        <CardHeader>
          <CardTitle>Mapa Interactivo - Bahía de Ensenada</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            ref={mapRef} 
            className="w-full h-96 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-lg relative"
          />
          
          {selectedPoint && (
            <div className="absolute top-4 right-4 backdrop-blur-md bg-white/10 border border-white/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Punto Seleccionado</h4>
              <div className="space-y-1 text-sm">
                <p>Lat: {selectedPoint.lat.toFixed(4)}°</p>
                <p>Lng: {selectedPoint.lng.toFixed(4)}°</p>
                <p>Temperatura: {selectedPoint.data.temperature.toFixed(1)}°C</p>
                <p>Corriente: {selectedPoint.data.current_speed.toFixed(1)} m/s</p>
                <p>Sardina: {selectedPoint.data.sardine_density} kg/km²</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="backdrop-blur-md bg-white/5 border border-white/10">
        <CardHeader>
          <CardTitle>Leyenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-red-500 rounded"></div>
              <span>Temperatura (16-24°C)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Corrientes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Densidad Sardina</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span>Batimetría</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
