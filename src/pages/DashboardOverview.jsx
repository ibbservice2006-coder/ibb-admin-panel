import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { 
  Users, 
  Truck, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Star,
  RefreshCw,
  Download,
  Filter,
  UserCheck
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Mock data for dashboard
const statsData = [
  {
    title: 'Total Bookings Today',
    value: '128',
    change: '+12%',
    trend: 'up',
    icon: Calendar,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    title: 'Active Drivers',
    value: '142',
    change: '+3.2%',
    trend: 'up',
    icon: Users,
    color: 'text-green-600',
    bg: 'bg-green-50'
  },
  {
    title: 'Revenue Today',
    value: '฿4,250',
    change: '+18.4%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  },
  {
    title: 'Avg. Rating',
    value: '4.8',
    change: '-0.2%',
    trend: 'down',
    icon: Star,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50'
  }
]

const recentBookings = [
  { id: 'BK-10234', customer: 'Anan S.', route: 'Airport → City Center', status: 'Pending', time: '10:30', amount: '฿450' },
  { id: 'BK-10235', customer: 'Somsak P.', route: 'Central Station → Hotel', status: 'In Progress', time: '11:15', amount: '฿320' },
  { id: 'BK-10236', customer: 'Wichai K.', route: 'Mall → Airport', status: 'Completed', time: '09:45', amount: '฿550' },
  { id: 'BK-10237', customer: 'Niran T.', route: 'Hotel → Beach', status: 'Cancelled', time: '08:30', amount: '฿800' }
]

const vehicleStatus = [
  { type: 'Van', total: 45, active: 38, maintenance: 4, offline: 3, color: 'bg-sky-400' },
  { type: 'Bus', total: 12, active: 10, maintenance: 1, offline: 1, color: 'bg-teal-400' },
  { type: 'Car', total: 25, active: 22, maintenance: 2, offline: 1, color: 'bg-indigo-400' }
]

const getStatusBadge = (status) => {
  switch (status) {
    case 'Pending': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
    case 'In Progress': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>
    case 'Completed': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>
    case 'Cancelled': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>
    default: return <Badge variant="outline">{status}</Badge>
  }
}

export default function DashboardOverview() {
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
  const [assignDialog, setAssignDialog] = useState({ open: false, type: '', title: '', bookings: [] })
  const [selectedDriver, setSelectedDriver] = useState('')
  const [isAssigning, setIsAssigning] = useState(false)

  const availableDrivers = [
    { id: 'd1', name: 'Somchai Jaidee', vehicle: 'VAN-001', rating: 4.9 },
    { id: 'd2', name: 'Vichai Mankong', vehicle: 'VAN-003', rating: 4.7 },
    { id: 'd3', name: 'Prasit Reowwai', vehicle: 'BUS-002', rating: 4.8 },
    { id: 'd4', name: 'Surachai Ready for work', vehicle: 'VAN-005', rating: 4.6 },
  ]

  const handleAssignNow = () => {
    setSelectedDriver('')
    setAssignDialog({ open: true, type: 'overdue', title: 'Assign Driver - Overdue Bookings (3)', bookings: ['BK-1021', 'BK-1022', 'BK-1023'] })
  }

  const handleAssignDriver = () => {
    setSelectedDriver('')
    setAssignDialog({ open: true, type: 'trip', title: 'Assign Driver - Upcoming Trip', bookings: ['BK-1025'] })
  }

  const handleConfirmAssign = () => {
    if (!selectedDriver) return
    setIsAssigning(true)
    setTimeout(() => {
      setIsAssigning(false)
      setAssignDialog({ open: false, type: '', title: '', bookings: [] })
      const driver = availableDrivers.find(d => d.id === selectedDriver)
      toast({ title: 'Driver Assigned', description: `${driver?.name} received task assigned successfully` })
    }, 800)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast({ title: 'Dashboard Refreshed', description: 'Real-time data has been updated.' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Control Panel - Today {new Date().toLocaleDateString('th-TH')}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex flex-col items-end mr-4 text-xs">
            <span className="text-muted-foreground">Auto-refresh: 30s</span>
            <span className="font-medium">{new Date().toLocaleTimeString('th-TH')}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, idx) => (
          <Card key={idx} className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className={`flex items-center text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings Table */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Recent Bookings</CardTitle>
              <CardDescription>Latest transactions and trip status</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" onClick={() => toast({ title: 'View Details', description: 'Loading details...' })}>View All</Button>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="h-10 px-2 text-left font-medium">Booking ID</th>
                    <th className="h-10 px-2 text-left font-medium">Customer</th>
                    <th className="h-10 px-2 text-left font-medium">Route</th>
                    <th className="h-10 px-2 text-left font-medium">Status</th>
                    <th className="h-10 px-2 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-2 font-medium">{booking.id}</td>
                      <td className="p-2">{booking.customer}</td>
                      <td className="p-2 text-muted-foreground">{booking.route}</td>
                      <td className="p-2">{getStatusBadge(booking.status)}</td>
                      <td className="p-2 text-right font-bold">{booking.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Fleet Distribution Progress */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Fleet Distribution</CardTitle>
            <CardDescription>Vehicle status by type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {vehicleStatus.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.type}</span>
                  <span className="text-muted-foreground">{item.active} / {item.total} Active</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{width: `${(item.active / item.total) * 100}%`}} />
                </div>
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                  <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-green-500" /> Active: {item.active}</span>
                  <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-yellow-500" /> Maint: {item.maintenance}</span>
                  <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-red-500" /> Offline: {item.offline}</span>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">Maintenance Alerts</span>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800 border-none">6 Vehicles</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-red-500 shadow-sm border-none bg-white">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="p-2 bg-red-50 rounded-full">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-bold">3 Bookings Overdue</p>
              <p className="text-xs text-muted-foreground mt-1">Assign drivers immediately to avoid cancellation.</p>
              <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-red-600" onClick={handleAssignNow}>Assign Now</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500 shadow-sm border-none bg-white">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="p-2 bg-yellow-50 rounded-full">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-bold">GPS Offline Alert</p>
              <p className="text-xs text-muted-foreground mt-1">VAN-12 GPS offline 5 mins</p>
              <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-yellow-600" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>Check Status</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500 shadow-sm border-none bg-white">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-full">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold">Trip Assignment</p>
              <p className="text-xs text-muted-foreground mt-1">1 trip will start in 20 mins but no driver yet</p>
              <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-blue-600" onClick={handleAssignDriver}>Assign Driver</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assign Driver Dialog */}
      <Dialog open={assignDialog.open} onOpenChange={(open) => setAssignDialog(prev => ({ ...prev, open }))}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-600" />
            {assignDialog.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {assignDialog.bookings.length > 0 && (
            <div>
              <Label className="text-xs text-muted-foreground">Booking(s) to assign</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {assignDialog.bookings.map(b => (
                  <Badge key={b} variant="outline" className="text-xs">{b}</Badge>
                ))}
              </div>
            </div>
          )}
          <div>
            <Label className="text-sm font-medium">Select Driver</Label>
            <Select value={selectedDriver} onValueChange={setSelectedDriver}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="-- Select available driver --" />
              </SelectTrigger>
              <SelectContent>
                {availableDrivers.map(d => (
                  <SelectItem key={d.id} value={d.id}>
                    <div className="flex items-center gap-2">
                      <span>{d.name}</span>
                      <span className="text-xs text-muted-foreground">({d.vehicle})</span>
                      <span className="text-xs text-yellow-600">★ {d.rating}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedDriver && (() => {
            const d = availableDrivers.find(x => x.id === selectedDriver)
            return (
              <div className="p-3 bg-blue-50 rounded-lg text-sm">
                <p className="font-medium text-blue-800">{d?.name}</p>
                <p className="text-blue-600 text-xs">Vehicle: {d?.vehicle} &nbsp;|&nbsp; Rating: {d?.rating}</p>
              </div>
            )
          })()}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setAssignDialog(prev => ({ ...prev, open: false }))} disabled={isAssigning}>Cancel</Button>
          <Button onClick={handleConfirmAssign} disabled={!selectedDriver || isAssigning} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isAssigning ? 'Assigning...' : 'Confirm Assign'}
          </Button>
        </DialogFooter>
      </DialogContent>
      </Dialog>
    </div>
  )
}
