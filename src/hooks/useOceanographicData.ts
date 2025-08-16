
import { useState, useEffect, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { oceanographicDataService, type OceanographicReading, type SardineData } from '@/services/oceanographicDataService'
import { toast } from 'sonner'

export interface UseOceanographicDataOptions {
  enableRealTime?: boolean
  refreshInterval?: number
  historicalDays?: number
}

export const useOceanographicData = ({
  enableRealTime = true,
  refreshInterval = 30000, // 30 seconds
  historicalDays = 7
}: UseOceanographicDataOptions = {}) => {
  const [isConnected, setIsConnected] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const queryClient = useQueryClient()

  // Current conditions query
  const {
    data: currentConditions,
    isLoading: isLoadingCurrent,
    error: currentError,
    refetch: refetchCurrent
  } = useQuery({
    queryKey: ['oceanographic', 'current'],
    queryFn: oceanographicDataService.getCurrentConditions,
    refetchInterval: enableRealTime ? refreshInterval : false,
    refetchIntervalInBackground: true,
    onSuccess: () => {
      setLastUpdate(new Date())
      setIsConnected(true)
    },
    onError: (error) => {
      console.error('Failed to fetch current conditions:', error)
      setIsConnected(false)
      toast.error('Connection to oceanographic sensors lost', {
        description: 'Switching to cached data...'
      })
    }
  })

  // Historical data query
  const {
    data: historicalData,
    isLoading: isLoadingHistorical,
    error: historicalError
  } = useQuery({
    queryKey: ['oceanographic', 'historical', historicalDays],
    queryFn: () => oceanographicDataService.getHistoricalData(historicalDays),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000 // Refresh every 5 minutes
  })

  // Sardine data query
  const {
    data: sardineData,
    isLoading: isLoadingSardine,
    error: sardineError
  } = useQuery({
    queryKey: ['sardine', 'current'],
    queryFn: oceanographicDataService.getSardineData,
    refetchInterval: enableRealTime ? refreshInterval * 4 : false, // Less frequent updates
    staleTime: 10 * 60 * 1000 // 10 minutes
  })

  // Weather data query
  const {
    data: weatherData,
    isLoading: isLoadingWeather
  } = useQuery({
    queryKey: ['weather', 'current'],
    queryFn: oceanographicDataService.getWeatherData,
    refetchInterval: enableRealTime ? refreshInterval * 2 : false,
    staleTime: 5 * 60 * 1000
  })

  // Satellite imagery query
  const {
    data: satelliteImages,
    isLoading: isLoadingSatellite
  } = useQuery({
    queryKey: ['satellite', 'images'],
    queryFn: oceanographicDataService.getSatelliteImagery,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: 30 * 60 * 1000
  })

  // Manual refresh function
  const refresh = useCallback(async () => {
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['oceanographic'] }),
        queryClient.invalidateQueries({ queryKey: ['sardine'] }),
        queryClient.invalidateQueries({ queryKey: ['weather'] })
      ])
      
      toast.success('Data refreshed successfully', {
        description: 'All sensors updated'
      })
    } catch (error) {
      toast.error('Failed to refresh data', {
        description: 'Please check your connection'
      })
    }
  }, [queryClient])

  // Connection status monitoring
  useEffect(() => {
    const checkConnection = () => {
      const now = Date.now()
      const lastUpdateTime = lastUpdate?.getTime() || 0
      const timeSinceUpdate = now - lastUpdateTime
      
      // Consider disconnected if no update for 2 minutes
      if (timeSinceUpdate > 2 * 60 * 1000 && lastUpdate) {
        setIsConnected(false)
      }
    }

    const interval = setInterval(checkConnection, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [lastUpdate])

  // Data quality metrics
  const dataQuality = {
    temperature: currentConditions?.temperature ? 'good' : 'poor',
    currents: currentConditions?.current_speed ? 'good' : 'poor',
    overall: isConnected && currentConditions ? 'good' : 'degraded'
  }

  // Format data for charts
  const formatChartData = useCallback((data: OceanographicReading[]) => {
    return data.map(reading => ({
      timestamp: reading.timestamp,
      temperature: reading.temperature,
      current_speed: reading.current_speed,
      depth: reading.depth,
      wave_height: reading.wave_height
    }))
  }, [])

  const chartData = historicalData ? formatChartData(historicalData) : []
  
  // Add current reading to chart data for real-time visualization
  if (currentConditions && chartData.length > 0) {
    const currentPoint = {
      timestamp: currentConditions.timestamp,
      temperature: currentConditions.temperature,
      current_speed: currentConditions.current_speed,
      depth: currentConditions.depth,
      wave_height: currentConditions.wave_height
    }
    
    // Replace or add the latest point
    const updatedChartData = [...chartData]
    const lastIndex = updatedChartData.length - 1
    const lastPoint = updatedChartData[lastIndex]
    
    if (lastPoint && new Date(currentPoint.timestamp) > new Date(lastPoint.timestamp)) {
      updatedChartData[lastIndex] = currentPoint
    }
  }

  return {
    // Current data
    currentConditions,
    sardineData,
    weatherData,
    satelliteImages,
    
    // Historical data
    historicalData,
    chartData,
    
    // Loading states
    isLoading: isLoadingCurrent || isLoadingHistorical || isLoadingSardine || isLoadingWeather,
    isLoadingCurrent,
    isLoadingHistorical,
    isLoadingSardine,
    isLoadingWeather,
    isLoadingSatellite,
    
    // Error states
    errors: {
      current: currentError,
      historical: historicalError,
      sardine: sardineError
    },
    
    // Connection status
    isConnected,
    lastUpdate,
    dataQuality,
    
    // Actions
    refresh,
    refetchCurrent,
    
    // Utils
    formatChartData
  }
}

// Hook for monitoring station status
export const useMonitoringStations = () => {
  const [stations] = useState([
    {
      id: 'central',
      name: 'Estación Central',
      location: { lat: 31.8667, lng: -116.6000 },
      status: 'active',
      lastReading: new Date(),
      sensors: ['temperature', 'current', 'depth', 'salinity']
    },
    {
      id: 'north',
      name: 'Estación Norte',
      location: { lat: 31.9200, lng: -116.5800 },
      status: 'active',
      lastReading: new Date(Date.now() - 5 * 60 * 1000),
      sensors: ['temperature', 'current', 'wave']
    },
    {
      id: 'south',
      name: 'Estación Sur',
      location: { lat: 31.8100, lng: -116.6200 },
      status: 'maintenance',
      lastReading: new Date(Date.now() - 30 * 60 * 1000),
      sensors: ['temperature', 'depth']
    }
  ])

  const activeStations = stations.filter(s => s.status === 'active')
  const maintenanceStations = stations.filter(s => s.status === 'maintenance')
  
  return {
    stations,
    activeStations,
    maintenanceStations,
    totalStations: stations.length,
    healthyStations: activeStations.length
  }
}
