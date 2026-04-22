import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Navigation, Search, MapPin, Clock, User, Car, Phone, AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react'

const activeTrips = [
  {
    id: 'T001', booking: 'IBB-2024-0891', status: 'on_route',
    driver: 'Somchai Jaidee', driverPhone: '081-234-5678', vehicle: 'AB-1234', vehicleType: 'Toyota Alphard',
    customer: 'John Smith', customerPhone: '+1-555-0101', tier: 'VVIP',
    origin: 'Suvarnabhumi Airport (BKK)', destination: 'Pattaya Beach Hotel',
    pickupTime: '12:00', eta: '14:30', progress: 65,
    lat: 13.7563, lng: 100.5018, speed: 85,
    distance: '145 km', elapsed: '1h 32m', remaining: '48m',
    alert: null,
  },
  {
    id: 'T002', booking: 'IBB-2024-0892', status: 'on_route',
    driver: 'Vichai Mankong', driverPhone: '082-345-6789', vehicle: 'Balance-5678', vehicleType: 'Mercedes V-Class',
    customer: 'Wang Lei', customerPhone: '+86-138-0000-0001', tier: 'VIP',
    origin: 'Suvarnabhumi Airport (BKK)', destination: 'Hua Hin Marriott',
    pickupTime: '13:00', eta: '16:45', progress: 40,
    lat: 13.8621, lng: 100.6078, speed: 92,
    distance: '210 km', elapsed: '1h 10m', remaining: '1h 45m',
    alert: null,
  },
  {
    id: 'T003', booking: 'IBB-2024-0893', status: 'on_route',
    driver: 'Anan Sukjai', driverPhone: '084-567-8901', vehicle: 'ChS-3456', vehicleType: 'Toyota Commuter',
    customer: 'Dmitri Volkov', customerPhone: '+7-916-000-0001', tier: 'General',
    origin: 'Don Mueang Airport (DMK)', destination: 'Pattaya Walking Street',
    pickupTime: '13:30', eta: '15:20', progress: 55,
    lat: 13.9200, lng: 100.4800, speed: 78,
    distance: '130 km', elapsed: '58m', remaining: '50m',
    alert: null,
  },
  {
    id: 'T004', booking: 'IBB-2024-0894', status: 'alert',
    driver: 'Surachai Promdee', driverPhone: '085-678-9012', vehicle: 'YD-7890', vehicleType: 'Toyota Fortuner',
    customer: 'Ahmed Al-Rashid', customerPhone: '+971-50-000-0001', tier: 'VIP',
    origin: 'Suvarnabhumi Airport (BKK)', destination: 'Kanchanaburi River Kwai',
    pickupTime: '12:30', eta: '17:00', progress: 30,
    lat: 13.6500, lng: 100.3200, speed: 0,
    distance: '180 km', elapsed: '1h 45m', remaining: '2h 30m',
    alert: 'Stopped over 15 mins — off route',
  },
]

const statusConfig = {
  on_route: { label: 'On Route', color: 'bg-green-100 text-green-700' },
  alert: { label: 'Alert', color: 'bg-red-100 text-red-700' },
  pickup: { label: 'Pickup', color: 'bg-yellow-100 text-yellow-700' },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-600' },
}

const tierColor = {
  'General': 'bg-blue-100 text-blue-700',
  'VIP': 'bg-pink-100 text-pink-700',
  'VVIP': 'bg-yellow-100 text-yellow-700',
  'Business Partner': 'bg-green-100 text-green-700',
}

export default function ActiveTrips() {
  const { toast } = useToast()
  const [trips, setTrips] = useState(activeTrips)
  const [search, setSearch] = useState('')
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTrips(prev => prev.map(t => {
        if (t.status === 'on_route') {
          return { ...t, speed: Math.max(60, Math.min(110, t.speed + (Math.random() - 0.5) * 8)) }
        }
        return t
      }))
      setLastUpdate(new Date())
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  const filtered = trips.filter(t =>
    t.booking.toLowerCase().includes(search.toLowerCase()) ||
    t.driver.toLowerCase().includes(search.toLowerCase()) ||
    t.customer.toLowerCase().includes(search.toLowerCase()) ||
    t.destination.toLowerCase().includes(search.toLowerCase())
  )

  const alerts = trips.filter(t => t.status === 'alert')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100 border border-blue-200">
            <Navigation className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Active Trips</h1>
            <p className="text-muted-foreground text-sm mt-0.5"> >Ongoing trips</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Updated: {lastUpdate.toLocaleTimeString('th-TH')}</span>
          <Badge className="bg-green-100 text-green-700">{trips.length} Active</Badge>
        </div>
      </div>

      {/* Alert Banner */}
      {alerts.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-red-700 font-semibold">
            <AlertTriangle className="h-5 w-5" />
            {alerts.length} Trip has notifications — Requires verification
          </div>
          {alerts.map(t => (
            <div key={t.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-100">
              <div className="text-sm">
                <span className="font-medium">{t.booking}</span>
                <span className="text-muted-foreground ml-2">{t.driver} · {t.vehicle}</span>
                <span className="text-red-600 ml-2">— {t.alert}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-7 px-2 text-xs border-red-200 text-red-600" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                  <Phone className="h-3 w-3 mr-1" />Phone
                </Button>
                <Button size="sm" className="px-2 text-xs bg-gray-700 hover:bg-gray-700" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                  <MapPin className="h-3 w-3 mr-1" />View map
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Active Trips', value: trips.length, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'On Route', value: trips.filter(t => t.status === 'on_route').length, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Alerts', value: alerts.length, color: 'text-red-700', bg: 'bg-red-50' },
          { label: 'Avg Speed', value: `${Math.round(trips.filter(t => t.speed > 0).reduce((a, t) => a + t.speed, 0) / trips.filter(t => t.speed > 0).length)} km/h`, color: 'text-purple-700', bg: 'bg-purple-50' },
        ].map(s => (
          <Card key={s.label} className={`${s.bg} border-0`}>
            <CardContent className="pt-3 pb-3 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search Booking, Driver, Customer..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Trip Cards */}
      <div className="space-y-4">
        {filtered.map(trip => (
          <Card key={trip.id} className={`border ${trip.status === 'alert' ? 'border-red-200 bg-red-50/30' : 'border-gray-200'}`}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base">{trip.booking}</span>
                  <Badge className={`text-xs ${statusConfig[trip.status].color}`}>{statusConfig[trip.status].label}</Badge>
                  <Badge className={`text-xs ${tierColor[trip.tier]}`}>{trip.tier}</Badge>
                </div>
                <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                  <ExternalLink className="h-3 w-3 mr-1" />Live Map
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Route Info */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Origin</p>
                      <p className="font-medium">{trip.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Destination</p>
                      <p className="font-medium">{trip.destination}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm mt-2">
                    <div><p className="text-xs text-muted-foreground">Pickup</p><p className="font-medium">{trip.pickupTime}</p></div>
                    <div><p className="text-xs text-muted-foreground">ETA</p><p className="font-medium">{trip.eta}</p></div>
                    <div><p className="text-xs text-muted-foreground">Distance</p><p className="font-medium">{trip.distance}</p></div>
                    <div><p className="text-xs text-muted-foreground">Speed</p><p className="font-medium">{Math.round(trip.speed)} km/h</p></div>
                  </div>
                </div>

                {/* Right: People Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Car className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground"> >Driver · {trip.vehicle} · {trip.vehicleType}</p>
                      <p className="font-medium">{trip.driver}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                      <Phone className="h-3 w-3 mr-1" />{trip.driverPhone}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-purple-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Customer</p>
                      <p className="font-medium">{trip.customer}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                      <Phone className="h-3 w-3 mr-1" />{trip.customerPhone}
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>{trip.progress}% · {trip.elapsed} elapsed · {trip.remaining} remaining</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${trip.status === 'alert' ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${trip.progress}%` }}
                      />
                    </div>
                  </div>

                  {trip.alert && (
                    <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded-lg p-2 mt-1">
                      <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                      {trip.alert}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
