import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Users,
  Activity,
  Clock,
  MapPin,
  Phone,
  Star,
  Eye,
  MessageSquare,
  AlertCircle
} from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

// Mock driver status data
const driverStatusData = [
  {
    id: 'DRV-001',
    name: 'Somchai P.',
    phone: '+66-8-1234-5678',
    status: 'on-trip',
    currentLocation: 'Sukhumvit Soi 11',
    currentPassengers: 3,
    rating: 4.8,
    trips: 12,
    earnings: '฿2,450',
    lastUpdate: '1 min ago',
    vehicle: 'VAN-45'
  },
  {
    id: 'DRV-002',
    name: 'Arun K.',
    phone: '+66-8-2345-6789',
    status: 'on-trip',
    currentLocation: 'Silom Road',
    currentPassengers: 1,
    rating: 4.9,
    trips: 8,
    earnings: '฿1,280',
    lastUpdate: '2 min ago',
    vehicle: 'CAR-12'
  },
  {
    id: 'DRV-003',
    name: 'Niran T.',
    phone: '+66-8-3456-7890',
    status: 'available',
    currentLocation: 'Main Depot',
    currentPassengers: 0,
    rating: 4.6,
    trips: 0,
    earnings: '฿0',
    lastUpdate: '5 min ago',
    vehicle: 'BUS-08'
  },
  {
    id: 'DRV-004',
    name: 'Wichai S.',
    phone: '+66-8-4567-8901',
    status: 'break',
    currentLocation: 'Coffee Shop',
    currentPassengers: 0,
    rating: 4.7,
    trips: 5,
    earnings: '฿980',
    lastUpdate: '10 min ago',
    vehicle: 'VAN-32'
  },
  {
    id: 'DRV-005',
    name: 'Pattaya M.',
    phone: '+66-8-5678-9012',
    status: 'offline',
    currentLocation: 'Unknown',
    currentPassengers: 0,
    rating: 4.5,
    trips: 0,
    earnings: '฿0',
    lastUpdate: '2 hours ago',
    vehicle: null
  }
]

const statusConfig = {
  'on-trip': { color: 'bg-green-100 text-green-800', label: 'On Trip', icon: '▶' },
  'available': { color: 'bg-blue-100 text-blue-800', label: 'Available', icon: '✓' },
  'break': { color: 'bg-yellow-100 text-yellow-800', label: 'On Break', icon: '⏸' },
  'offline': { color: 'bg-red-100 text-red-800', label: 'Offline', icon: '✕' }
}

export default function DriverStatus() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [drivers, setDrivers] = useState(driverStatusData)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)

  const filteredDrivers = drivers.filter(driver =>
    driver.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast({ title: 'Data Refreshed', description: 'Driver status has been updated.' })
  }

  // Statistics
  const statusStats = {
    'on-trip': drivers.filter(d => d.status === 'on-trip').length,
    'available': drivers.filter(d => d.status === 'available').length,
    'break': drivers.filter(d => d.status === 'break').length,
    'offline': drivers.filter(d => d.status === 'offline').length
  }

  const totalEarnings = drivers.reduce((sum, d) => {
    const earnings = parseInt(d.earnings.replace(/[^0-9]/g, ''))
    return sum + earnings
  }, 0)

  const avgRating = (drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Driver Status</h1>
          <p className="text-muted-foreground mt-1">Real-time status and location tracking of all drivers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setShowExportDialog(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Drivers</p>
                <h3 className="text-2xl font-bold mt-1">{drivers.length}</h3>
              </div>
              <div className="p-2 rounded-lg bg-slate-50">
                <Users className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">On Trip</p>
                <h3 className="text-2xl font-bold mt-1 text-green-600">{statusStats['on-trip']}</h3>
              </div>
              <div className="p-2 rounded-lg bg-green-50">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available</p>
                <h3 className="text-2xl font-bold mt-1 text-blue-600">{statusStats['available']}</h3>
              </div>
              <div className="p-2 rounded-lg bg-blue-50">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                <h3 className="text-2xl font-bold mt-1 text-yellow-600">{avgRating}/5</h3>
              </div>
              <div className="p-2 rounded-lg bg-yellow-50">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                <h3 className="text-2xl font-bold mt-1 text-orange-600">฿{totalEarnings.toLocaleString()}</h3>
              </div>
              <div className="p-2 rounded-lg bg-orange-50">
                <Activity className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by driver ID or name..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => toast({ title: 'Filter Applied', description: 'Data filtered' })}>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Driver Status Cards */}
      <div className="space-y-3">
        {filteredDrivers.map(driver => (
          <Card key={driver.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-bold text-sm">{driver.id}</h3>
                    <Badge className={statusConfig[driver.status]?.color}>
                      {statusConfig[driver.status]?.label}
                    </Badge>
                    <div className="flex items-center gap-1 ml-auto">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-sm">{driver.rating}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium">{driver.name}</p>
                      <p className="text-xs text-muted-foreground">{driver.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Vehicle</p>
                      <p className="text-sm font-medium">{driver.vehicle || 'N/A'}</p>
                    </div>
                    <div className="text-right md:text-left">
                      <p className="text-sm font-bold text-orange-600">{driver.earnings}</p>
                      <p className="text-xs text-muted-foreground">{driver.trips} trips</p>
                    </div>
                  </div>

                  {driver.status === 'on-trip' && (
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="text-muted-foreground">{driver.currentLocation}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-muted-foreground">{driver.currentPassengers} passenger{driver.currentPassengers !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {driver.lastUpdate}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" onClick={() => toast({ title: 'View Details', description: 'Loading details...' })}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Driver Details</DialogTitle><DialogDescription>{selectedDriver?.name}</DialogDescription></DialogHeader>
          {selectedDriver && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-muted-foreground">Driver ID</p><p className="font-bold">{selectedDriver.id}</p></div>
              <div><p className="text-muted-foreground">Name</p><p className="font-medium">{selectedDriver.name}</p></div>
              <div><p className="text-muted-foreground">Status</p><p className="font-medium capitalize">{selectedDriver.status}</p></div>
              <div><p className="text-muted-foreground">Vehicle</p><p className="font-medium">{selectedDriver.vehicle || 'N/A'}</p></div>
              <div><p className="text-muted-foreground">Location</p><p className="font-medium">{selectedDriver.location || 'N/A'}</p></div>
              <div><p className="text-muted-foreground">Rating</p><p className="font-medium">{selectedDriver.rating || 'N/A'}</p></div>
              <div><p className="text-muted-foreground">Trips Today</p><p className="font-medium">{selectedDriver.tripsToday || 0}</p></div>
              <div><p className="text-muted-foreground">Earnings Today</p><p className="font-medium text-green-600">{selectedDriver.earningsToday || '฿0'}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setShowDetailDialog(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Export Driver Status</DialogTitle><DialogDescription>Choose export format</DialogDescription></DialogHeader>
          <div className="space-y-2">
            {['CSV', 'Excel (.xlsx)', 'PDF Report'].map(fmt => (
              <button key={fmt} className="w-full p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-left text-sm font-medium" onClick={() => { setShowExportDialog(false); toast({ title: 'Exporting...', description: `Downloading ${fmt}` }) }}>{fmt}</button>
            ))}
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowExportDialog(false)}>Cancel</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}