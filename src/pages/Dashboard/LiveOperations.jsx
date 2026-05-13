import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  MapPin,
  Navigation,
  Clock,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Download,
  Phone,
  Eye,
  Info,
  Car,
  Users
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useLiveOperations, useSystemAlerts } from '@/hooks/useDashboard'
import { bookingsApi } from '@/lib/api'
import { ApiErrorBanner, ApiEmptyState } from '@/components/ApiErrorBanner'

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'critical': return 'border-l-red-500 bg-red-50'
    case 'warning':  return 'border-l-yellow-500 bg-yellow-50'
    case 'info':     return 'border-l-blue-500 bg-blue-50'
    default:         return 'border-l-green-500 bg-green-50'
  }
}

const getSeverityIcon = (severity) => {
  switch (severity) {
    case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />
    case 'warning':  return <AlertCircle className="h-5 w-5 text-yellow-600" />
    case 'info':     return <Info className="h-5 w-5 text-blue-600" />
    default:         return <CheckCircle2 className="h-5 w-5 text-green-600" />
  }
}

const getSeverityBadge = (severity) => {
  switch (severity) {
    case 'critical': return <Badge className="bg-red-100 text-red-800 border-none">Critical</Badge>
    case 'warning':  return <Badge className="bg-yellow-100 text-yellow-800 border-none">Warning</Badge>
    case 'info':     return <Badge className="bg-blue-100 text-blue-800 border-none">Info</Badge>
    default:         return <Badge className="bg-green-100 text-green-800 border-none">OK</Badge>
  }
}

function formatStarted(startedAt) {
  if (!startedAt) return '—'
  const diff = Math.round((Date.now() - new Date(startedAt).getTime()) / 60000)
  if (diff < 60) return `${diff}m ago`
  return `${Math.round(diff / 60)}h ${diff % 60}m ago`
}

export default function LiveOperations() {
  const { toast } = useToast()

  const { data, isLoading, isError, refetch, isFetching } = useLiveOperations()
  const { data: alertsData, isError: alertsError, refetch: refetchAlerts } = useSystemAlerts()

  const { data: pendingData, isError: pendingError, refetch: refetchPending } = useQuery({
    queryKey: ['bookings', 'pending-live'],
    queryFn: () => bookingsApi.list({ status: 'pending', limit: 20 }).then(r => r.data),
    refetchInterval: 15_000,
    staleTime: 5_000,
  })

  const bookingCounts = data?.bookingCounts ?? {}
  const vehicleCounts = data?.vehicleCounts ?? {}
  const driverCounts  = data?.driverCounts  ?? {}
  const activeTrips   = data?.activeTrips   ?? []
  const pendingList   = pendingData?.bookings ?? []
  const alerts        = alertsData?.alerts   ?? []

  const handleRefresh = () => {
    refetch()
    refetchAlerts()
    refetchPending()
    toast({ title: 'Refreshing...', description: 'Fetching latest live data.' })
  }

  const handleExport = () => {
    const rows = [
      ['Booking ID', 'Customer', 'Driver', 'Vehicle', 'Pickup', 'Dropoff', 'Started'],
      ...activeTrips.map(t => [
        t.public_id, t.customer_name, t.driver_name ?? '—', t.plate_number ?? '—',
        t.pickup_location, t.dropoff_location, t.started_at ?? '—'
      ])
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'live_operations.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: 'Exported', description: 'CSV downloaded successfully' })
  }

  const metricCards = [
    {
      label: 'Active Trips',
      value: bookingCounts.in_progress ?? 0,
      icon: Navigation,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Pending Bookings',
      value: bookingCounts.pending ?? 0,
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50'
    },
    {
      label: 'Vehicles Assigned',
      value: vehicleCounts.assigned ?? vehicleCounts.in_use ?? 0,
      icon: Car,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      label: 'Available Drivers',
      value: driverCounts.available ?? 0,
      icon: Users,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Operations</h1>
          <p className="text-muted-foreground mt-1">Real-time trip tracking and monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {isError && <ApiErrorBanner onRetry={refetch} />}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric, idx) => (
          <Card key={idx} className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${metric.bg}`}>
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                <h3 className="text-2xl font-bold mt-1 tracking-tight">
                  {isLoading ? '—' : metric.value}
                </h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Trips ({activeTrips.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({bookingCounts.pending ?? 0})</TabsTrigger>
          <TabsTrigger value="alerts">
            Alerts {alerts.length > 0 ? `(${alerts.length})` : ''}
          </TabsTrigger>
        </TabsList>

        {/* Active Trips Tab */}
        <TabsContent value="active" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Active Trips</CardTitle>
              <CardDescription>Currently in-progress bookings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <ApiEmptyState message="Loading..." />
              ) : activeTrips.length === 0 ? (
                <ApiEmptyState message="No active trips at the moment" />
              ) : (
                activeTrips.map((trip) => (
                  <div key={trip.public_id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-sm">{trip.public_id}</h4>
                          <Badge className="bg-blue-100 text-blue-800 border-none">In Progress</Badge>
                        </div>
                        {trip.driver_name ? (
                          <p className="text-sm text-muted-foreground">
                            Driver: <span className="font-medium text-foreground">{trip.driver_name}</span>
                            {trip.driver_phone && (
                              <span className="ml-2 text-xs text-slate-400">{trip.driver_phone}</span>
                            )}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">Driver: <span className="italic">Unassigned</span></p>
                        )}
                        {trip.plate_number && (
                          <p className="text-sm text-muted-foreground">
                            Vehicle: <span className="font-medium text-foreground">{trip.plate_number}</span>
                            {trip.vehicle_type && <span className="text-xs text-slate-400 ml-1">({trip.vehicle_type})</span>}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        {trip.started_at && (
                          <p className="mt-1">Started {formatStarted(trip.started_at)}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm mb-3">
                      <MapPin className="h-4 w-4 text-green-600 shrink-0" />
                      <span className="text-muted-foreground truncate">{trip.pickup_location}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-medium truncate">{trip.dropoff_location}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t">
                      {trip.driver_phone && (
                        <a href={`tel:${trip.driver_phone}`}>
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4 mr-2" />
                            Call Driver
                          </Button>
                        </a>
                      )}
                      <Button size="sm" variant="outline" onClick={() => toast({ title: trip.public_id, description: `Customer: ${trip.customer_name} | Route: ${trip.route_name}` })}>
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Bookings Tab */}
        <TabsContent value="pending" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Pending Bookings</CardTitle>
              <CardDescription>Bookings awaiting confirmation or driver assignment</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingError && <ApiErrorBanner onRetry={refetchPending} />}
              {!pendingError && pendingList.length === 0 ? (
                <ApiEmptyState message="No pending bookings" />
              ) : (
                <div className="space-y-3">
                  {pendingList.map((booking) => (
                    <div key={booking.public_id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-sm">{booking.public_id}</h4>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                              Pending
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Customer: <span className="font-medium text-foreground">{booking.customer_name}</span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Route: <span className="font-medium text-foreground">{booking.route_name}</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Pickup: {booking.pickup_datetime ? new Date(booking.pickup_datetime).toLocaleString('th-TH') : '—'}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-gray-700 hover:bg-gray-600"
                          onClick={() => toast({ title: 'Open Booking', description: `Go to ${booking.public_id} to assign driver` })}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">System Alerts</CardTitle>
              <CardDescription>Active alerts requiring attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {alertsError && <ApiErrorBanner onRetry={refetchAlerts} />}
              {!alertsError && alerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No active alerts</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)} p-4 rounded-lg`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">{getSeverityIcon(alert.severity)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-sm">{alert.title}</h4>
                          {getSeverityBadge(alert.severity)}
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.detail}</p>
                        {alert.phone && (
                          <a href={`tel:${alert.phone}`} className="text-xs text-blue-600 mt-1 inline-block">
                            {alert.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
