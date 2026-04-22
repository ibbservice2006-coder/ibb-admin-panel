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
  Zap,
  AlertTriangle,
  Wrench,
  MapPin,
  Battery,
  Fuel,
  Eye,
  Clock,
  Activity,
  TrendingUp
} from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

// Mock vehicle status data
const vehicleStatusData = [
  {
    id: 'VAN-45',
    type: 'Van',
    driver: 'Somchai P.',
    status: 'in-use',
    location: 'Sukhumvit Soi 11',
    fuel: 85,
    battery: 95,
    lastUpdate: '2 min ago',
    trips: 12,
    distance: '245 km',
    nextMaintenance: '500 km'
  },
  {
    id: 'CAR-12',
    type: 'Car',
    driver: 'Arun K.',
    status: 'in-use',
    location: 'Silom Road',
    fuel: 45,
    battery: 88,
    lastUpdate: '1 min ago',
    trips: 8,
    distance: '156 km',
    nextMaintenance: '1200 km'
  },
  {
    id: 'BUS-08',
    type: 'Bus',
    driver: 'Niran T.',
    status: 'available',
    location: 'Main Depot',
    fuel: 92,
    battery: 100,
    lastUpdate: '5 min ago',
    trips: 0,
    distance: '0 km',
    nextMaintenance: '800 km'
  },
  {
    id: 'VAN-32',
    type: 'Van',
    driver: 'Wichai S.',
    status: 'maintenance',
    location: 'Service Center',
    fuel: 30,
    battery: 60,
    lastUpdate: '30 min ago',
    trips: 5,
    distance: '89 km',
    nextMaintenance: 'In Progress'
  },
  {
    id: 'CAR-05',
    type: 'Car',
    driver: null,
    status: 'offline',
    location: 'Unknown',
    fuel: 0,
    battery: 0,
    lastUpdate: '2 hours ago',
    trips: 0,
    distance: '0 km',
    nextMaintenance: '2000 km'
  }
]

const statusConfig = {
  'available': { color: 'bg-green-100 text-green-800', icon: '✓', label: 'Available' },
  'in-use': { color: 'bg-blue-100 text-blue-800', icon: '▶', label: 'In Use' },
  'maintenance': { color: 'bg-yellow-100 text-yellow-800', icon: '⚙', label: 'Maintenance' },
  'offline': { color: 'bg-red-100 text-red-800', icon: '✕', label: 'Offline' }
}

export default function VehicleStatus() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [vehicles, setVehicles] = useState(vehicleStatusData)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.driver?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast({ title: 'Data Refreshed', description: 'Vehicle status has been updated.' })
  }

  // Statistics
  const statusStats = {
    available: vehicles.filter(v => v.status === 'available').length,
    'in-use': vehicles.filter(v => v.status === 'in-use').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length,
    offline: vehicles.filter(v => v.status === 'offline').length
  }

  const avgFuel = Math.round(vehicles.reduce((sum, v) => sum + v.fuel, 0) / vehicles.length)
  const avgBattery = Math.round(vehicles.reduce((sum, v) => sum + v.battery, 0) / vehicles.length)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicle Status</h1>
          <p className="text-muted-foreground mt-1">Real-time status and location tracking of all vehicles</p>
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
                <p className="text-sm font-medium text-muted-foreground">Total Vehicles</p>
                <h3 className="text-2xl font-bold mt-1">{vehicles.length}</h3>
              </div>
              <div className="p-2 rounded-lg bg-slate-50">
                <Activity className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available</p>
                <h3 className="text-2xl font-bold mt-1 text-green-600">{statusStats.available}</h3>
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
                <p className="text-sm font-medium text-muted-foreground">In Use</p>
                <h3 className="text-2xl font-bold mt-1 text-blue-600">{statusStats['in-use']}</h3>
              </div>
              <div className="p-2 rounded-lg bg-blue-50">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Maintenance</p>
                <h3 className="text-2xl font-bold mt-1 text-yellow-600">{statusStats.maintenance}</h3>
              </div>
              <div className="p-2 rounded-lg bg-yellow-50">
                <Wrench className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Offline</p>
                <h3 className="text-2xl font-bold mt-1 text-red-600">{statusStats.offline}</h3>
              </div>
              <div className="p-2 rounded-lg bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Fuel className="h-5 w-5" />
              Average Fuel Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <div className="text-3xl font-bold text-orange-600">{avgFuel}%</div>
              <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-orange-600 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${avgFuel}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Battery className="h-5 w-5" />
              Average Battery Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <div className="text-3xl font-bold text-blue-600">{avgBattery}%</div>
              <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${avgBattery}%` }}
                ></div>
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
                placeholder="Search by vehicle ID or driver name..."
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

      {/* Vehicle Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles.map(vehicle => (
          <Card key={vehicle.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">{vehicle.id}</h3>
                  <p className="text-sm text-muted-foreground">{vehicle.type}</p>
                </div>
                <Badge className={statusConfig[vehicle.status]?.color}>
                  {statusConfig[vehicle.status]?.label}
                </Badge>
              </div>

              {vehicle.driver && (
                <div className="mb-4 pb-4 border-b border-slate-200">
                  <p className="text-xs text-muted-foreground mb-1">Driver</p>
                  <p className="text-sm font-medium">{vehicle.driver}</p>
                </div>
              )}

              {/* Location */}
              <div className="mb-4 flex items-start gap-2">
                <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium">{vehicle.location}</p>
                </div>
              </div>

              {/* Fuel & Battery */}
              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Fuel className="h-3 w-3" />
                      Fuel
                    </span>
                    <span className="text-sm font-bold text-orange-600">{vehicle.fuel}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-orange-600 h-full rounded-full"
                      style={{ width: `${vehicle.fuel}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Battery className="h-3 w-3" />
                      Battery
                    </span>
                    <span className="text-sm font-bold text-blue-600">{vehicle.battery}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${vehicle.battery}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4 pb-4 border-b border-slate-200 text-xs">
                <div>
                  <p className="text-muted-foreground">Trips Today</p>
                  <p className="font-bold">{vehicle.trips}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Distance</p>
                  <p className="font-bold">{vehicle.distance}</p>
                </div>
              </div>

              {/* Last Update */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {vehicle.lastUpdate}
                </span>
              </div>

              {/* Next Maintenance */}
              <div className="bg-slate-50 p-2 rounded mb-4 text-xs">
                <p className="text-muted-foreground">Next Maintenance</p>
                <p className="font-bold text-slate-700">{vehicle.nextMaintenance}</p>
              </div>

              {/* Action Button */}
              <Button variant="outline" className="w-full" size="sm" onClick={() => { setSelectedVehicle(vehicle); setShowDetailDialog(true) }}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Vehicle Details</DialogTitle><DialogDescription>{selectedVehicle?.id} - {selectedVehicle?.type}</DialogDescription></DialogHeader>
          {selectedVehicle && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">Vehicle ID</p><p className="font-bold">{selectedVehicle.id}</p></div>
                <div><p className="text-muted-foreground">Type</p><p className="font-medium">{selectedVehicle.type}</p></div>
                <div><p className="text-muted-foreground">Driver</p><p className="font-medium">{selectedVehicle.driver || 'Unassigned'}</p></div>
                <div><p className="text-muted-foreground">Status</p><Badge className={selectedVehicle.status === 'available' ? 'bg-green-100 text-green-800 border-none' : selectedVehicle.status === 'in-use' ? 'bg-blue-100 text-blue-800 border-none' : selectedVehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800 border-none' : 'bg-gray-100 text-gray-800 border-none'}>{selectedVehicle.status}</Badge></div>
                <div><p className="text-muted-foreground">Location</p><p className="font-medium">{selectedVehicle.location}</p></div>
                <div><p className="text-muted-foreground">Last Update</p><p className="font-medium">{selectedVehicle.lastUpdate}</p></div>
                <div><p className="text-muted-foreground">Trips Today</p><p className="font-medium">{selectedVehicle.trips}</p></div>
                <div><p className="text-muted-foreground">Distance Today</p><p className="font-medium">{selectedVehicle.distance}</p></div>
              </div>
              <div className="space-y-2">
                <div><div className="flex justify-between text-sm mb-1"><span>Fuel Level</span><span className="font-medium">{selectedVehicle.fuel}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{width: `${selectedVehicle.fuel}%`}}></div></div></div>
                <div><div className="flex justify-between text-sm mb-1"><span>Battery</span><span className="font-medium">{selectedVehicle.battery}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{width: `${selectedVehicle.battery}%`}}></div></div></div>
              </div>
              <div className="text-sm"><p className="text-muted-foreground">Next Maintenance</p><p className="font-medium text-orange-600">{selectedVehicle.nextMaintenance}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setShowDetailDialog(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Export Vehicle Status</DialogTitle><DialogDescription>Choose export format</DialogDescription></DialogHeader>
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
