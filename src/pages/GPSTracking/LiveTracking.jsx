import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Download,
  RefreshCw,
  MapPin,
  Navigation,
  Users,
  Clock,
  Zap,
  AlertTriangle,
  Eye,
  Phone,
  MessageSquare
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Mock live tracking data
const liveTrackingData = [
  {
    id: 'VAN-45',
    driver: 'Somchai P.',
    status: 'in-transit',
    passengers: 3,
    latitude: 13.7563,
    longitude: 100.5018,
    location: 'Sukhumvit Soi 11',
    destination: 'Airport',
    speed: 45,
    heading: 'NE',
    eta: '15 min',
    distance: '8.5 km',
    lastUpdate: '1 min ago'
  },
  {
    id: 'CAR-12',
    type: 'Car',
    driver: 'Arun K.',
    status: 'in-transit',
    passengers: 1,
    latitude: 13.7280,
    longitude: 100.5318,
    location: 'Silom Road',
    destination: 'Hotel',
    speed: 35,
    heading: 'SE',
    eta: '8 min',
    distance: '4.2 km',
    lastUpdate: '2 min ago'
  },
  {
    id: 'BUS-08',
    driver: 'Niran T.',
    status: 'idle',
    passengers: 0,
    latitude: 13.7563,
    longitude: 100.4518,
    location: 'Main Depot',
    destination: 'N/A',
    speed: 0,
    heading: '-',
    eta: '-',
    distance: '0 km',
    lastUpdate: '5 min ago'
  },
  {
    id: 'VAN-32',
    driver: 'Wichai S.',
    status: 'in-transit',
    passengers: 2,
    latitude: 13.7463,
    longitude: 100.5218,
    location: 'Ploenchit Road',
    destination: 'Shopping Mall',
    speed: 52,
    heading: 'N',
    eta: '12 min',
    distance: '6.8 km',
    lastUpdate: '1 min ago'
  }
]

const statusConfig = {
  'in-transit': { color: 'bg-green-100 text-green-800', label: 'In Transit', icon: '▶' },
  'idle': { color: 'bg-blue-100 text-blue-800', label: 'Idle', icon: '⏸' },
  'offline': { color: 'bg-red-100 text-red-800', label: 'Offline', icon: '✕' }
}

export default function LiveTracking() {
  const { toast } = useToast()
  const handleExport = () => {
    const rows = [['#', 'Data', 'Value', 'Date']]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ibb_export.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: 'Exported', description: 'CSV downloaded successfully' })
  }
  const [vehicles, setVehicles] = useState(liveTrackingData)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast({ title: 'Data Refreshed', description: 'Live tracking data has been updated.' })
  }

  // Statistics
  const inTransit = vehicles.filter(v => v.status === 'in-transit').length
  const idle = vehicles.filter(v => v.status === 'idle').length
  const totalPassengers = vehicles.reduce((sum, v) => sum + v.passengers, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Tracking</h1>
          <p className="text-muted-foreground mt-1">Real-time GPS location and status of all active vehicles</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Vehicles</p>
                <h3 className="text-2xl font-bold mt-1">{vehicles.length}</h3>
              </div>
              <div className="p-2 rounded-lg bg-slate-50">
                <Navigation className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Transit</p>
                <h3 className="text-2xl font-bold mt-1 text-green-600">{inTransit}</h3>
              </div>
              <div className="p-2 rounded-lg bg-green-50">
                <Zap className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Idle</p>
                <h3 className="text-2xl font-bold mt-1 text-blue-600">{idle}</h3>
              </div>
              <div className="p-2 rounded-lg bg-blue-50">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Passengers</p>
                <h3 className="text-2xl font-bold mt-1 text-orange-600">{totalPassengers}</h3>
              </div>
              <div className="p-2 rounded-lg bg-orange-50">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Placeholder */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Map View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-96 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-2" />
              <p className="text-muted-foreground">Interactive Map View</p>
              <p className="text-xs text-muted-foreground mt-1">Map integration coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Vehicles List */}
      <div className="space-y-3">
        {vehicles.map(vehicle => (
          <Card key={vehicle.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-sm">{vehicle.id}</h3>
                    <Badge className={statusConfig[vehicle.status]?.color}>
                      {statusConfig[vehicle.status]?.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{vehicle.driver}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{vehicle.lastUpdate}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Current Location</p>
                  <p className="text-sm font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    {vehicle.location}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Destination</p>
                  <p className="text-sm font-medium">{vehicle.destination}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Passengers</p>
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Users className="h-4 w-4 text-green-600 flex-shrink-0" />
                    {vehicle.passengers}
                  </p>
                </div>
              </div>

              {vehicle.status === 'in-transit' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 pb-4 border-b border-slate-200">
                  <div>
                    <p className="text-xs text-muted-foreground">Speed</p>
                    <p className="text-sm font-bold text-orange-600">{vehicle.speed} km/h</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Direction</p>
                    <p className="text-sm font-bold">{vehicle.heading}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">ETA</p>
                    <p className="text-sm font-bold text-blue-600">{vehicle.eta}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Distance</p>
                    <p className="text-sm font-bold">{vehicle.distance}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => toast({ title: 'View Details', description: 'Loading details...' })}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call Driver
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
