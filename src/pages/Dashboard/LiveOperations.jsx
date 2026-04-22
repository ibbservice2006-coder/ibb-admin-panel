import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  MapPin,
  Navigation,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Pause,
  RefreshCw,
  Download,
  Filter,
  Phone,
  MessageSquare,
  Eye,
  Zap
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Mock data for live trips
const activeTrips = [
  {
    id: 'TRIP-001',
    driver: 'Somchai P.',
    vehicle: 'VAN-45',
    pickup: 'Siam Square',
    dropoff: 'Airport Terminal 1',
    status: 'on-trip',
    progress: 65,
    eta: '18 min',
    delay: 0,
    passengers: 4,
    rating: 4.8
  },
  {
    id: 'TRIP-002',
    driver: 'Arun K.',
    vehicle: 'CAR-12',
    pickup: 'Central Station',
    dropoff: 'Luxury Hotel',
    status: 'on-trip',
    progress: 45,
    eta: '25 min',
    delay: 5,
    passengers: 2,
    rating: 4.9
  },
  {
    id: 'TRIP-003',
    driver: 'Niran T.',
    vehicle: 'BUS-08',
    pickup: 'Shopping Mall',
    dropoff: 'Beach Resort',
    status: 'picking-up',
    progress: 10,
    eta: '35 min',
    delay: 0,
    passengers: 8,
    rating: 4.7
  },
  {
    id: 'TRIP-004',
    driver: 'Wichai S.',
    vehicle: 'VAN-32',
    pickup: 'Airport Terminal 3',
    dropoff: 'City Center',
    status: 'delayed',
    progress: 30,
    eta: '42 min',
    delay: 12,
    passengers: 3,
    rating: 4.6
  }
]

const pendingBookings = [
  { id: 'BK-5001', customer: 'John D.', pickup: 'Airport', time: '10:30', waitTime: '5 min', priority: 'normal' },
  { id: 'BK-5002', customer: 'Sarah M.', pickup: 'Central', time: '10:45', waitTime: '15 min', priority: 'vip' },
  { id: 'BK-5003', customer: 'Mike L.', pickup: 'Hotel', time: '11:00', waitTime: '25 min', priority: 'normal' }
]

const systemMetrics = [
  { label: 'Active Trips', value: '24', icon: Navigation, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Pending Bookings', value: '12', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { label: 'Delayed Trips', value: '3', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  { label: 'Completed Today', value: '156', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' }
]

const getStatusBadge = (status) => {
  switch (status) {
    case 'on-trip': return <Badge className="bg-blue-100 text-blue-800 border-none">On Trip</Badge>
    case 'picking-up': return <Badge className="bg-yellow-100 text-yellow-800 border-none">Picking Up</Badge>
    case 'delayed': return <Badge className="bg-red-100 text-red-800 border-none">Delayed</Badge>
    case 'completed': return <Badge className="bg-green-100 text-green-800 border-none">Completed</Badge>
    default: return <Badge variant="outline">{status}</Badge>
  }
}

export default function LiveOperations() {
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
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast({ title: 'Data Refreshed', description: 'Real-time data has been updated.' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Operations</h1>
          <p className="text-muted-foreground mt-1">Real-time trip tracking and monitoring</p>
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

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemMetrics.map((metric, idx) => (
          <Card key={idx} className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${metric.bg}`}>
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                <h3 className="text-2xl font-bold mt-1 tracking-tight">{metric.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Trips</TabsTrigger>
          <TabsTrigger value="pending">Pending Bookings</TabsTrigger>
          <TabsTrigger value="alerts">System Alerts</TabsTrigger>
        </TabsList>

        {/* Active Trips Tab */}
        <TabsContent value="active" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Active Trips</CardTitle>
                <CardDescription>Currently running trips on the road</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => toast({ title: 'View Details', description: 'Loading details...' })}>View Map</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeTrips.map((trip) => (
                <div key={trip.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-sm">{trip.id}</h4>
                        {getStatusBadge(trip.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">Driver: <span className="font-medium text-foreground">{trip.driver}</span></p>
                      <p className="text-sm text-muted-foreground">Vehicle: <span className="font-medium text-foreground">{trip.vehicle}</span></p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-bold text-yellow-600 mb-2">
                        ⭐ {trip.rating}
                      </div>
                      <p className="text-xs text-muted-foreground">{trip.passengers} passengers</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="text-muted-foreground">{trip.pickup}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-medium">{trip.dropoff}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-bold">{trip.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${trip.progress}%` }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">ETA: <span className="font-bold text-foreground">{trip.eta}</span></span>
                      </div>
                      {trip.delay > 0 && (
                        <div className="flex items-center gap-1 text-red-600 font-bold text-xs">
                          <AlertTriangle className="h-3 w-3" />
                          +{trip.delay} min delay
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => toast({ title: 'View Details', description: 'Loading details...' })}>
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Bookings Tab */}
        <TabsContent value="pending" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Pending Bookings</CardTitle>
              <CardDescription>Bookings waiting for driver assignment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-sm">{booking.id}</h4>
                          <Badge variant="outline" className={booking.priority === 'vip' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-50 text-slate-700 border-slate-200'}>
                            {booking.priority === 'vip' ? '⭐ VIP' : 'Normal'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Customer: <span className="font-medium text-foreground">{booking.customer}</span></p>
                        <p className="text-sm text-muted-foreground">Pickup: <span className="font-medium text-foreground">{booking.pickup}</span></p>
                        <p className="text-xs text-muted-foreground mt-1">Booking Time: {booking.time} | Waiting: {booking.waitTime}</p>
                      </div>
                      <Button size="sm" className="bg-gray-700 hover:bg-gray-600" onClick={() => toast({ title: 'Assigned', description: 'Task assigned successfully' })}>Assign</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">System Alerts</CardTitle>
              <CardDescription>Critical alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="border-l-4 border-l-red-500 bg-red-50 p-4 rounded">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-red-900">GPS Offline - VAN-12</h4>
                    <p className="text-sm text-red-700 mt-1">Vehicle GPS has been offline for 8 minutes. Driver may be in a dead zone.</p>
                    <Button size="sm" variant="link" className="p-0 h-auto mt-2 text-red-600" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>Take Action</Button>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-l-yellow-500 bg-yellow-50 p-4 rounded">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-yellow-900">High Surge Pricing Active</h4>
                    <p className="text-sm text-yellow-700 mt-1">Surge pricing is now 1.8x due to high demand in downtown area.</p>
                    <Button size="sm" variant="link" className="p-0 h-auto mt-2 text-yellow-600" onClick={() => toast({ title: 'View Details', description: 'Loading details...' })}>View Details</Button>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-l-blue-500 bg-blue-50 p-4 rounded">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-blue-900">Maintenance Reminder - BUS-05</h4>
                    <p className="text-sm text-blue-700 mt-1">Vehicle is due for scheduled maintenance. Schedule appointment?</p>
                    <Button size="sm" variant="link" className="p-0 h-auto mt-2 text-blue-600" onClick={() => toast({ title: 'Scheduled', description: 'Time set successfully' })}>Schedule</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
