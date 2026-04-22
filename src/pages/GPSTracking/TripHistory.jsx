import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { History, Search, MapPin, Clock, Car, User, CheckCircle, AlertTriangle, XCircle, Download } from 'lucide-react'

const tripHistory = [
  { id: 'H001', booking: 'IBB-2024-0890', date: '2024-03-24', driver: 'Somchai Jaidee', vehicle: 'AB-1234',
    customer: 'Sarah Johnson', tier: 'VVIP',
    origin: 'Suvarnabhumi Airport', destination: 'Pattaya Beach Hotel',
    startTime: '09:00', endTime: '11:28', duration: '2h 28m',
    distance: '145.2 km', avgSpeed: '58.7 km/h', maxSpeed: '112 km/h',
    status: 'completed', deviation: false, deviationNote: null, rating: 5,
  },
  { id: 'H002', booking: 'IBB-2024-0889', date: '2024-03-24', driver: 'Vichai Mankong', vehicle: 'Balance-5678',
    customer: 'Li Wei', tier: 'VIP',
    origin: 'Don Mueang Airport', destination: 'Hua Hin Marriott',
    startTime: '10:30', endTime: '13:45', duration: '3h 15m',
    distance: '210.8 km', avgSpeed: '64.9 km/h', maxSpeed: '118 km/h',
    status: 'completed', deviation: false, deviationNote: null, rating: 4,
  },
  { id: 'H003', booking: 'IBB-2024-0888', date: '2024-03-23', driver: 'Surachai Promdee', vehicle: 'YD-7890',
    customer: 'Ahmed Al-Rashid', tier: 'VIP',
    origin: 'Suvarnabhumi Airport', destination: 'Kanchanaburi River Kwai',
    startTime: '08:00', endTime: '11:52', duration: '3h 52m',
    distance: '178.5 km', avgSpeed: '46.1 km/h', maxSpeed: '95 km/h',
    status: 'deviation', deviation: true, deviationNote: 'Off-route stop 22 mins — alert sent', rating: 3,
  },
  { id: 'H004', booking: 'IBB-2024-0887', date: '2024-03-23', driver: 'Prasit Deengam', vehicle: 'JCh-9012',
    customer: 'Dmitri Volkov', tier: 'General',
    origin: 'Don Mueang Airport', destination: 'Pattaya Walking Street',
    startTime: '14:00', endTime: '15:55', duration: '1h 55m',
    distance: '131.3 km', avgSpeed: '68.4 km/h', maxSpeed: '108 km/h',
    status: 'completed', deviation: false, deviationNote: null, rating: 5,
  },
  { id: 'H005', booking: 'IBB-2024-0886', date: '2024-03-22', driver: 'Anan Sukjai', vehicle: 'ChS-3456',
    customer: 'Maria Garcia', tier: 'Business Partner',
    origin: 'Suvarnabhumi Airport', destination: 'Rayong Industrial Estate',
    startTime: '07:30', endTime: '09:15', duration: '1h 45m',
    distance: '95.7 km', avgSpeed: '54.7 km/h', maxSpeed: '98 km/h',
    status: 'completed', deviation: false, deviationNote: null, rating: 5,
  },
  { id: 'H006', booking: 'IBB-2024-0885', date: '2024-03-22', driver: 'Vichai Mankong', vehicle: 'Balance-5678',
    customer: 'Tanaka Hiroshi', tier: 'VVIP',
    origin: 'Suvarnabhumi Airport', destination: 'Hua Hin Sofitel',
    startTime: '11:00', endTime: '14:30', duration: '3h 30m',
    distance: '208.4 km', avgSpeed: '59.5 km/h', maxSpeed: '115 km/h',
    status: 'cancelled', deviation: false, deviationNote: 'Customer Cancelled En Route', rating: null,
  },
]

const statusConfig = {
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle, iconColor: 'text-green-600' },
  deviation: { label: 'Deviation', color: 'bg-yellow-100 text-yellow-700', icon: AlertTriangle, iconColor: 'text-yellow-600' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle, iconColor: 'text-red-600' },
}

const tierColor = {
  'General': 'bg-blue-100 text-blue-700',
  'VIP': 'bg-pink-100 text-pink-700',
  'VVIP': 'bg-yellow-100 text-yellow-700',
  'Business Partner': 'bg-green-100 text-green-700',
}

export default function TripHistory() {
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
  const [search, setSearch] = useState('')
  const [filterDriver, setFilterDriver] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate, setFilterDate] = useState('')

  const drivers = [...new Set(tripHistory.map(t => t.driver))]

  const filtered = tripHistory.filter(t => {
    const matchSearch = t.booking.toLowerCase().includes(search.toLowerCase()) ||
      t.customer.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase())
    const matchDriver = filterDriver === 'all' || t.driver === filterDriver
    const matchStatus = filterStatus === 'all' || t.status === filterStatus
    const matchDate = !filterDate || t.date === filterDate
    return matchSearch && matchDriver && matchStatus && matchDate
  })

  const stats = {
    total: tripHistory.length,
    completed: tripHistory.filter(t => t.status === 'completed').length,
    deviation: tripHistory.filter(t => t.status === 'deviation').length,
    cancelled: tripHistory.filter(t => t.status === 'cancelled').length,
    totalDistance: tripHistory.reduce((a, t) => a + parseFloat(t.distance), 0).toFixed(1),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-100 border border-purple-200">
            <History className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Trip History</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Route history — Check deviation & punctuality</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-3.5 w-3.5 mr-1" />Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Trips', value: stats.total, color: 'text-gray-700', bg: 'bg-gray-50' },
          { label: 'Completed', value: stats.completed, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Deviation', value: stats.deviation, color: 'text-yellow-700', bg: 'bg-yellow-50' },
          { label: 'Cancelled', value: stats.cancelled, color: 'text-red-700', bg: 'bg-red-50' },
          { label: 'Total Distance', value: `${stats.totalDistance} km`, color: 'text-blue-700', bg: 'bg-blue-50' },
        ].map(s => (
          <Card key={s.label} className={`${s.bg} border-0`}>
            <CardContent className="pt-3 pb-3 text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search Booking, customer, destination..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterDriver} onValueChange={setFilterDriver}>
          <SelectTrigger className="w-44"><SelectValue placeholder="DriverAll" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">DriverAll</SelectItem>
            {drivers.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="deviation">Deviation</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" className="w-40" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
      </div>

      <div className="space-y-3">
        {filtered.map(trip => {
          const cfg = statusConfig[trip.status]
          const StatusIcon = cfg.icon
          return (
            <Card key={trip.id} className={`border ${trip.status === 'deviation' ? 'border-yellow-200' : trip.status === 'cancelled' ? 'border-red-100' : 'border-gray-200'}`}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusIcon className={`h-4 w-4 ${cfg.iconColor}`} />
                    <span className="font-bold">{trip.booking}</span>
                    <Badge className={`text-xs ${cfg.color}`}>{cfg.label}</Badge>
                    <Badge className={`text-xs ${tierColor[trip.tier]}`}>{trip.tier}</Badge>
                    <span className="text-xs text-muted-foreground">{trip.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {trip.rating && Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-sm ${i < trip.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">From:</span>
                      <span className="font-medium text-xs">{trip.origin}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-red-600 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">To:</span>
                      <span className="font-medium text-xs">{trip.destination}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><p className="text-muted-foreground">Start</p><p className="font-medium">{trip.startTime}</p></div>
                    <div><p className="text-muted-foreground">End</p><p className="font-medium">{trip.endTime}</p></div>
                    <div><p className="text-muted-foreground">Duration</p><p className="font-medium">{trip.duration}</p></div>
                    <div><p className="text-muted-foreground">Distance</p><p className="font-medium">{trip.distance}</p></div>
                    <div><p className="text-muted-foreground">Avg Speed</p><p className="font-medium">{trip.avgSpeed}</p></div>
                    <div><p className="text-muted-foreground">Max Speed</p><p className="font-medium">{trip.maxSpeed}</p></div>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <Car className="h-3.5 w-3.5 text-blue-600" />
                      <span>{trip.driver} · {trip.vehicle}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-purple-600" />
                      <span>{trip.customer}</span>
                    </div>
                    {trip.deviationNote && (
                      <div className="flex items-start gap-2 text-yellow-700 bg-yellow-50 rounded p-2 mt-1">
                        <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                        <span>{trip.deviationNote}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
