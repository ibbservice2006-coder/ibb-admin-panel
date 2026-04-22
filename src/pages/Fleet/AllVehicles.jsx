import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import {
  Search, Plus, Edit, Trash2, Eye, MapPin, Users, Zap, AlertTriangle,
  Truck, TrendingUp, TrendingDown, BarChart3, ArrowUpDown, ChevronLeft,
  ChevronRight, ChevronsLeft, ChevronsRight, RefreshCw, Download, Filter, X as XIcon
} from 'lucide-react'

// Mock data generator for vehicles
const generateMockVehicles = () => {
  const makes = ['Toyota', 'Honda', 'Nissan', 'Hyundai', 'Kia', 'BMW', 'Mercedes']
  const models = ['Camry', 'Accord', 'Altima', 'Elantra', 'Sportage', '3 Series', 'C-Class']
  const statuses = ['available', 'in_use', 'maintenance', 'offline']
  const zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E']

  return Array.from({ length: 25 }, (_, index) => ({
    id: index + 1,
    licensePlate: `IBB-${String(index + 1).padStart(4, '0')}`,
    make: makes[Math.floor(Math.random() * makes.length)],
    model: models[Math.floor(Math.random() * models.length)],
    year: 2020 + Math.floor(Math.random() * 4),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    mileage: Math.floor(Math.random() * 150000) + 5000,
    driver: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Unassigned'][Math.floor(Math.random() * 5)],
    location: zones[Math.floor(Math.random() * zones.length)],
    gpsCoords: `${(13.7 + Math.random() * 0.1).toFixed(4)}, ${(100.5 + Math.random() * 0.1).toFixed(4)}`,
    fuelLevel: Math.floor(Math.random() * 100),
    lastService: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    nextService: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    registrationExpiry: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    insuranceExpiry: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    color: ['White', 'Black', 'Silver', 'Blue', 'Red'][Math.floor(Math.random() * 5)],
    capacity: [4, 5, 6, 7, 8][Math.floor(Math.random() * 5)]
  }))
}

const mockVehicles = generateMockVehicles()

const getStatusBadge = (status) => {
  const badges = {
    available: <Badge className="bg-green-100 text-green-800 border-green-200">Available</Badge>,
    in_use: <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Use</Badge>,
    maintenance: <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Maintenance</Badge>,
    offline: <Badge className="bg-red-100 text-red-800 border-red-200">Offline</Badge>
  }
  return badges[status] || badges.available
}

export default function AllVehicles() {
  const [vehicles, setVehicles] = useState(mockVehicles)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedVehicles, setSelectedVehicles] = useState([])
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newVehicle, setNewVehicle] = useState({ licensePlate: '', make: 'Toyota', model: '', year: '2024', color: 'White', capacity: '5', status: 'available' })
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // Sorting
  const [sortBy, setSortBy] = useState('licensePlate')
  const [sortOrder, setSortOrder] = useState('asc')

  const { toast } = useToast()

  // Filter and search
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Sort
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    let aValue = a[sortBy]
    let bValue = b[sortBy]
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }
    
    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    return sortOrder === 'asc' ? comparison : -comparison
  })

  // Paginate
  const totalPages = Math.ceil(sortedVehicles.length / itemsPerPage)
  const paginatedVehicles = sortedVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Statistics
  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'available').length,
    inUse: vehicles.filter(v => v.status === 'in_use').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast({ title: 'Refreshed', description: 'Vehicle data updated' })
  }

  const handleViewDetails = (vehicle) => {
    setSelectedVehicle(vehicle)
    setIsDetailsDialogOpen(true)
  }

  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (vehicle) => {
    setSelectedVehicle(vehicle)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    setVehicles(vehicles.filter(v => v.id !== selectedVehicle.id))
    setIsDeleteDialogOpen(false)
    toast({ title: 'Deleted', description: `Vehicle ${selectedVehicle.licensePlate} removed` })
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedVehicles(paginatedVehicles.map(v => v.id))
    } else {
      setSelectedVehicles([])
    }
  }

  const handleSelectVehicle = (vehicleId, checked) => {
    if (checked) {
      setSelectedVehicles([...selectedVehicles, vehicleId])
    } else {
      setSelectedVehicles(selectedVehicles.filter(id => id !== vehicleId))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Vehicles</h1>
        <p className="text-muted-foreground mt-2">Manage your fleet of vehicles</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Active fleet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <p className="text-xs text-muted-foreground">Ready for booking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Use</CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inUse}</div>
            <p className="text-xs text-muted-foreground">Active trips</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.maintenance}</div>
            <p className="text-xs text-muted-foreground">Under service</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Vehicle Fleet</CardTitle>
              <CardDescription>Manage and monitor all vehicles in your fleet</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setIsAddOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by license plate, make, model, or driver..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value)
              setCurrentPage(1)
            }}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="in_use">In Use</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <Checkbox
                      checked={selectedVehicles.length === paginatedVehicles.length && paginatedVehicles.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left cursor-pointer" onClick={() => {
                    setSortBy('licensePlate')
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  }}>
                    <div className="flex items-center gap-2">
                      License Plate
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">Vehicle</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Driver</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Fuel</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedVehicles.includes(vehicle.id)}
                        onCheckedChange={(checked) => handleSelectVehicle(vehicle.id, checked)}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{vehicle.licensePlate}</td>
                    <td className="px-4 py-3 text-sm">{vehicle.year} {vehicle.make} {vehicle.model}</td>
                    <td className="px-4 py-3">{getStatusBadge(vehicle.status)}</td>
                    <td className="px-4 py-3 text-sm">{vehicle.driver}</td>
                    <td className="px-4 py-3 text-sm flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {vehicle.location}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              vehicle.fuelLevel > 50 ? 'bg-green-500' :
                              vehicle.fuelLevel > 25 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${vehicle.fuelLevel}%` }}
                          />
                        </div>
                        <span className="text-xs">{vehicle.fuelLevel}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(vehicle)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(vehicle)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(vehicle)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {paginatedVehicles.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, sortedVehicles.length)} of {sortedVehicles.length} vehicles
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-3 py-2 text-sm">Page {currentPage} of {totalPages}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      {selectedVehicle && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Vehicle Details</DialogTitle>
              <DialogDescription>{selectedVehicle.licensePlate}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">License Plate</Label>
                <p className="font-medium">{selectedVehicle.licensePlate}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <p className="font-medium">{getStatusBadge(selectedVehicle.status)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Make & Model</Label>
                <p className="font-medium">{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Color</Label>
                <p className="font-medium">{selectedVehicle.color}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Capacity</Label>
                <p className="font-medium">{selectedVehicle.capacity} Seats</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Mileage</Label>
                <p className="font-medium">{selectedVehicle.mileage.toLocaleString()} km</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Driver</Label>
                <p className="font-medium">{selectedVehicle.driver}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Location</Label>
                <p className="font-medium">{selectedVehicle.location}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">GPS Coordinates</Label>
                <p className="font-medium text-sm">{selectedVehicle.gpsCoords}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Fuel Level</Label>
                <p className="font-medium">{selectedVehicle.fuelLevel}%</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Last Service</Label>
                <p className="font-medium">{selectedVehicle.lastService}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Next Service</Label>
                <p className="font-medium">{selectedVehicle.nextService}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Registration Expiry</Label>
                <p className="font-medium">{selectedVehicle.registrationExpiry}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Insurance Expiry</Label>
                <p className="font-medium">{selectedVehicle.insuranceExpiry}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Vehicle Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Plus className="h-5 w-5" />Add New Vehicle</DialogTitle>
            <DialogDescription>Add new vehicle to IBB Fleet</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5">
              <Label>License plate <span className="text-red-500">*</span></Label>
              <Input placeholder="IBB-0026" value={newVehicle.licensePlate} onChange={e => setNewVehicle({...newVehicle, licensePlate: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label>Make</Label>
              <Select value={newVehicle.make} onValueChange={v => setNewVehicle({...newVehicle, make: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Toyota','Honda','Nissan','Hyundai','Kia','BMW','Mercedes','Ford','Isuzu','Mitsubishi'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Model</Label>
              <Input placeholder="Commuter / Alphard" value={newVehicle.model} onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label>Car Year</Label>
              <Input type="number" placeholder="2024" value={newVehicle.year} onChange={e => setNewVehicle({...newVehicle, year: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label>Color</Label>
              <Select value={newVehicle.color} onValueChange={v => setNewVehicle({...newVehicle, color: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['White','Black','Silver','Blue','Red','Grey','Gold'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Capacity (Seats)</Label>
              <Select value={newVehicle.capacity} onValueChange={v => setNewVehicle({...newVehicle, capacity: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[4,5,6,7,8,9,10,12,15,20].map(n => <SelectItem key={n} value={String(n)}>{n} Seat</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Initial status</Label>
              <Select value={newVehicle.status} onValueChange={v => setNewVehicle({...newVehicle, status: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
              if (!newVehicle.licensePlate) { toast({ title: 'Please enter vehicle registration', variant: 'destructive' }); return }
              setVehicles([{ id: Date.now(), licensePlate: newVehicle.licensePlate, make: newVehicle.make, model: newVehicle.model, year: parseInt(newVehicle.year)||2024, color: newVehicle.color, capacity: parseInt(newVehicle.capacity)||5, status: newVehicle.status, mileage: 0, driver: 'Unassigned', location: 'Zone A', gpsCoords: '13.7563, 100.5018', fuelLevel: 100, lastService: new Date().toISOString().split('T')[0], nextService: '-', registrationExpiry: '-', insuranceExpiry: '-' }, ...vehicles])
              setIsAddOpen(false)
              setNewVehicle({ licensePlate: '', make: 'Toyota', model: '', year: '2024', color: 'White', capacity: '5', status: 'available' })
              toast({ title: 'Vehicle Added!', description: `${newVehicle.licensePlate} added successfully` })
            }}><Plus className="h-4 w-4 mr-2" />Add Vehicle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      {selectedVehicle && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Vehicle</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedVehicle.licensePlate}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 justify-end">
              <Button size="sm" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="destructive" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
