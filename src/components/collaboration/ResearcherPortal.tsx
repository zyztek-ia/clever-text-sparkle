
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Users, Share, Download, Bell, MessageSquare, FileText } from 'lucide-react'

interface ResearchProject {
  id: string
  title: string
  institution: string
  researchers: string[]
  status: 'active' | 'completed' | 'planned'
  lastUpdate: string
}

interface DataExport {
  id: string
  type: 'temperature' | 'currents' | 'sardine' | 'complete'
  format: 'csv' | 'json' | 'netcdf'
  dateRange: string
  requestedBy: string
  status: 'ready' | 'processing' | 'requested'
}

export const ResearcherPortal: React.FC = () => {
  const [projects] = useState<ResearchProject[]>([
    {
      id: '1',
      title: 'Impacto del Cambio Climático en Sardina Monterrey',
      institution: 'CICESE',
      researchers: ['Dr. María González', 'Dr. Carlos Hernández'],
      status: 'active',
      lastUpdate: '2024-01-15'
    },
    {
      id: '2',
      title: 'Patrones de Corrientes en Bahía de Ensenada',
      institution: 'UABC',
      researchers: ['Dr. José Martínez', 'Dra. Ana López'],
      status: 'active',
      lastUpdate: '2024-01-14'
    }
  ])

  const [exports] = useState<DataExport[]>([
    {
      id: '1',
      type: 'temperature',
      format: 'csv',
      dateRange: '2024-01-01 to 2024-01-15',
      requestedBy: 'Dr. María González',
      status: 'ready'
    },
    {
      id: '2',
      type: 'complete',
      format: 'netcdf',
      dateRange: '2024-01-01 to 2024-01-15',
      requestedBy: 'Dr. José Martínez',
      status: 'processing'
    }
  ])

  const [newAlert, setNewAlert] = useState({
    type: 'temperature',
    threshold: '',
    email: '',
    description: ''
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400'
      case 'completed': return 'bg-blue-500/20 text-blue-400'
      case 'planned': return 'bg-yellow-500/20 text-yellow-400'
      case 'ready': return 'bg-green-500/20 text-green-400'
      case 'processing': return 'bg-yellow-500/20 text-yellow-400'
      case 'requested': return 'bg-blue-500/20 text-blue-400'
      default: return 'bg-muted/40'
    }
  }

  return (
    <div className="space-y-6">
      {/* Collaboration Overview */}
      <Card className="backdrop-blur-md bg-white/5 border border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Portal de Colaboración Científica
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{projects.length}</div>
              <div className="text-sm text-muted-foreground">Proyectos Activos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">8</div>
              <div className="text-sm text-muted-foreground">Instituciones</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">24</div>
              <div className="text-sm text-muted-foreground">Investigadores</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">156</div>
              <div className="text-sm text-muted-foreground">Datasets Compartidos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Research Projects */}
      <Card className="backdrop-blur-md bg-white/5 border border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Proyectos de Investigación Activos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map(project => (
              <div key={project.id} className="backdrop-blur-md bg-white/5 border border-white/10 p-4 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.institution}</p>
                  </div>
                  <Badge variant="secondary" className={getStatusColor(project.status)}>
                    {project.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{project.researchers.join(', ')}</span>
                  </div>
                  <div className="text-muted-foreground">
                    Última actualización: {project.lastUpdate}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline">
                    <Share className="w-4 h-4 mr-2" />
                    Compartir Datos
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Colaborar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Export Requests */}
      <Card className="backdrop-blur-md bg-white/5 border border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exportación de Datos Científicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exports.map(exportRequest => (
              <div key={exportRequest.id} className="backdrop-blur-md bg-white/5 border border-white/10 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {exportRequest.type}
                    </Badge>
                    <Badge variant="outline" className="uppercase">
                      {exportRequest.format}
                    </Badge>
                    <Badge variant="secondary" className={getStatusColor(exportRequest.status)}>
                      {exportRequest.status.toUpperCase()}
                    </Badge>
                  </div>
                  {exportRequest.status === 'ready' && (
                    <Button size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </Button>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>Rango: {exportRequest.dateRange}</p>
                  <p>Solicitado por: {exportRequest.requestedBy}</p>
                </div>
              </div>
            ))}
            
            <div className="border-t border-white/10 pt-4">
              <h4 className="font-semibold mb-4">Solicitar Nueva Exportación</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select className="px-3 py-2 rounded-md bg-background border border-border">
                  <option>Temperatura</option>
                  <option>Corrientes</option>
                  <option>Sardina</option>
                  <option>Dataset Completo</option>
                </select>
                <select className="px-3 py-2 rounded-md bg-background border border-border">
                  <option>CSV</option>
                  <option>JSON</option>
                  <option>NetCDF</option>
                </select>
                <Input placeholder="Rango de fechas" />
                <Button>Solicitar</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Configuration */}
      <Card className="backdrop-blur-md bg-white/5 border border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Sistema de Alertas para Investigadores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Alerta</label>
                <select 
                  className="w-full px-3 py-2 rounded-md bg-background border border-border"
                  value={newAlert.type}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="temperature">Temperatura Anómala</option>
                  <option value="currents">Corrientes Extremas</option>
                  <option value="sardine">Migración de Sardina</option>
                  <option value="weather">Condiciones Meteorológicas</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Umbral</label>
                <Input 
                  placeholder="ej. >25°C, <1.5m/s"
                  value={newAlert.threshold}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, threshold: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email de Notificación</label>
              <Input 
                type="email"
                placeholder="investigador@institucion.edu.mx"
                value={newAlert.email}
                onChange={(e) => setNewAlert(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <Textarea 
                placeholder="Describir el contexto científico de la alerta..."
                value={newAlert.description}
                onChange={(e) => setNewAlert(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            
            <Button className="w-full">
              <Bell className="w-4 h-4 mr-2" />
              Configurar Alerta
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* International Collaboration */}
      <Card className="backdrop-blur-md bg-white/5 border border-white/10">
        <CardHeader>
          <CardTitle>Colaboración Internacional</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-500/10">
              <div className="text-2xl font-bold text-blue-400">NOAA</div>
              <div className="text-sm text-muted-foreground">Estados Unidos</div>
              <div className="text-xs mt-2">Intercambio de datos satelitales</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-500/10">
              <div className="text-2xl font-bold text-green-400">IOC-UNESCO</div>
              <div className="text-sm text-muted-foreground">Global</div>
              <div className="text-xs mt-2">Red de observación oceánica</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-500/10">
              <div className="text-2xl font-bold text-purple-400">IOOS</div>
              <div className="text-sm text-muted-foreground">Pacífico Norte</div>
              <div className="text-xs mt-2">Sistema integrado de observación</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
