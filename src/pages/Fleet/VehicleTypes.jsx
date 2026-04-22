import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import {
  Plus, Edit, Trash2, Eye, Users, DollarSign, Zap, AlertTriangle,
  TrendingUp, BarChart3, ArrowUpDown, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, RefreshCw, Download, Filter, X as XIcon
} from 'lucide-react'

// Mock data for vehicle types
const generateMockVehicleTypes = () => {
  return [
    {
      id: 1,
      name: 'Economy',
      code: 'ECO',
      description: 'Compact cars for single or 2 passengers',
      capacity: 4,
      basePrice: 150,
      pricePerKm: 12,
      pricePerMinute: 2,
      totalVehicles: 45,
      activeVehicles: 38,
      maintenanceVehicles: 2,
      offlineVehicles: 5,
      features: ['Air Conditioning', 'USB Charging', 'WiFi'],
      color: '#10b981'
    },
    {
      id: 2,
      name: 'Comfort',
      code: 'COM',
      description: 'Mid-size sedan for up to 4 passengers',
      capacity: 4,
      basePrice: 200,
      pricePerKm: 15,
      pricePerMinute: 2.5,
      totalVehicles: 60,
      activeVehicles: 52,
      maintenanceVehicles: 3,
      offlineVehicles: 5,
      features: ['Air Conditioning', 'USB Charging', 'WiFi', 'Premium Seats'],
      color: '#3b82f6'
    },
    {
      id: 3,
      name: 'Premium',
      code: 'PRM',
      description: 'Luxury sedan for up to 4 passengers',
      capacity: 4,
      basePrice: 300,
      pricePerKm: 20,
      pricePerMinute: 3.5,
      totalVehicles: 30,
      activeVehicles: 25,
      maintenanceVehicles: 2,
      offlineVehicles: 3,
      features: ['Air Conditioning', 'USB Charging', 'WiFi', 'Premium Seats', 'Leather Interior'],
      color: '#f59e0b'
    },
    {
      id: 4,
      name: 'XL Van',
      code: 'XLV',
      description: 'Large van for up to 8 passengers',
      capacity: 8,
      basePrice: 400,
      pricePerKm: 25,
      pricePerMinute: 4,
      totalVehicles: 20,
      activeVehicles: 16,
      maintenanceVehicles: 1,
      offlineVehicles: 3,
      features: ['Air Conditioning', 'USB Charging', 'WiFi', 'Spacious Interior', 'Luggage Space'],
      color: '#ef4444'
    },
    {
      id: 5,
      name: 'Executive',
      code: 'EXE',
      description: 'Premium executive vehicle for VIP',
      capacity: 4,
      basePrice: 500,
      pricePerKm: 30,
      pricePerMinute: 5,
      totalVehicles: 15,
      activeVehicles: 12,
      maintenanceVehicles: 1,
      offlineVehicles: 2,
      features: ['Air Conditioning', 'USB Charging', 'WiFi', 'Premium Seats', 'Leather Interior', 'Minibar'],
      color: '#8b5cf6'
    }
  ]
}

const mockVehicleTypes = generateMockVehicleTypes()

export default function VehicleTypes() {
  const [vehicleTypes, setVehicleTypes] = useState(mockVehicleTypes)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTypes, setSelectedTypes] = useState([])
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedType, setSelectedType] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({ name: '', code: '', description: '', capacity: 4, basePrice: 200, pricePerKm: 15, pricePerMinute: 2.5 })
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // Sorting
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')

  const { toast } = useToast()

  // Filter and search
  const filteredTypes = vehicleTypes.filter(type => {
    return type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           type.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
           type.description.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Sort
  const sortedTypes = [...filteredTypes].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedTypes.length / itemsPerPage)
  const paginatedTypes = sortedTypes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Statistics
  const stats = {
    totalTypes: vehicleTypes.length,
    totalVehicles: vehicleTypes.reduce((sum, type) => sum + type.totalVehicles, 0),
    activeVehicles: vehicleTypes.reduce((sum, type) => sum + type.activeVehicles, 0),
    averageCapacity: Math.round(vehicleTypes.reduce((sum, type) => sum + type.capacity, 0) / vehicleTypes.length)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast({ title: 'Refreshed', description: 'Vehicle types updated' })
  }

  const handleViewDetails = (type) => {
    setSelectedType(type)
    setIsDetailsDialogOpen(true)
  }

  const handleEdit = (type) => {
    setSelectedType(type)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (type) => {
    setSelectedType(type)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    setVehicleTypes(vehicleTypes.filter(t => t.id !== selectedType.id))
    setIsDeleteDialogOpen(false)
    toast({ title: 'Deleted', description: `Vehicle type ${selectedType.name} removed` })
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedTypes(paginatedTypes.map(t => t.id))
    } else {
      setSelectedTypes([])
    }
  }

  const handleSelectType = (typeId, checked) => {
    if (checked) {
      setSelectedTypes([...selectedTypes, typeId])
    } else {
      setSelectedTypes(selectedTypes.filter(id => id !== typeId))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vehicle Types</h1>
        <p className="text-muted-foreground mt-2">Manage vehicle categories and pricing</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Types</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTypes}</div>
            <p className="text-xs text-muted-foreground">Vehicle categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalVehicles}</div>
            <p className="text-xs text-muted-foreground">All vehicles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.activeVehicles}</div>
            <p className="text-xs text-muted-foreground">In service</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Capacity</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.averageCapacity}</div>
            <p className="text-xs text-muted-foreground">Passengers per vehicle</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Vehicle Types</CardTitle>
              <CardDescription>Configure vehicle categories and pricing tiers</CardDescription>
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
                Add Type
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div>
            <Input
              placeholder="Search by name, code, or description..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full"
            />
          </div>

          {/* Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedTypes.map((type) => (
              <Card key={type.id} className="relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: type.color }}
                />
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{type.name}</CardTitle>
                      <Badge variant="outline" className="mt-2">{type.code}</Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(type)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(type)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(type)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Capacity:</span>
                      <p className="font-medium">{type.capacity} passengers</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Base Price:</span>
                      <p className="font-medium">฿{type.basePrice}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Per km:</span>
                      <p className="font-medium">฿{type.pricePerKm}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Per min:</span>
                      <p className="font-medium">฿{type.pricePerMinute}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-bold text-lg">{type.totalVehicles}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Active</p>
                        <p className="font-bold text-lg text-green-600">{type.activeVehicles}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Offline</p>
                        <p className="font-bold text-lg text-red-600">{type.offlineVehicles}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-2">Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {type.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {paginatedTypes.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, sortedTypes.length)} of {sortedTypes.length} types
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
      {selectedType && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedType.name}</DialogTitle>
              <DialogDescription>{selectedType.code}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p className="font-medium">{selectedType.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Code</Label>
                <p className="font-medium">{selectedType.code}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Description</Label>
                <p className="font-medium">{selectedType.description}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Capacity</Label>
                <p className="font-medium">{selectedType.capacity} passengers</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Base Price</Label>
                <p className="font-medium"> > > >฿{selectedType.basePrice}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Price per km</Label>
                <p className="font-medium">฿{selectedType.pricePerKm}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Price per minute</Label>
                <p className="font-medium">฿{selectedType.pricePerMinute}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Total Vehicles</Label>
                <p className="font-medium">{selectedType.totalVehicles}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Active Vehicles</Label>
                <p className="font-medium text-green-600">{selectedType.activeVehicles}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Features</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedType.features.map((feature, idx) => (
                    <Badge key={idx}>{feature}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Vehicle Type Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Vehicle Type</DialogTitle>
            <DialogDescription>Create a new vehicle category with pricing</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Type Name *</Label>
              <Input placeholder="e.g. Economy, Premium" value={addForm.name}
                onChange={e => setAddForm({...addForm, name: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Code *</Label>
              <Input placeholder="e.g. ECO" value={addForm.code}
                onChange={e => setAddForm({...addForm, code: e.target.value.toUpperCase()})} className="mt-1" />
            </div>
            <div>
              <Label>Capacity (pax)</Label>
              <Input type="number" min={1} max={20} value={addForm.capacity}
                onChange={e => setAddForm({...addForm, capacity: parseInt(e.target.value)||1})} className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Input placeholder="Brief description" value={addForm.description}
                onChange={e => setAddForm({...addForm, description: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Base Price (฿)</Label>
              <Input type="number" min={0} value={addForm.basePrice}
                onChange={e => setAddForm({...addForm, basePrice: parseFloat(e.target.value)||0})} className="mt-1" />
            </div>
            <div>
              <Label>Price/km (฿)</Label>
              <Input type="number" min={0} step={0.5} value={addForm.pricePerKm}
                onChange={e => setAddForm({...addForm, pricePerKm: parseFloat(e.target.value)||0})} className="mt-1" />
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
              if (!addForm.name || !addForm.code) { toast({ title: 'Error', description: 'Name and Code are required', variant: 'destructive' }); return }
              const newType = { ...addForm, id: vehicleTypes.length + 1, totalVehicles: 0, activeVehicles: 0, maintenanceVehicles: 0, offlineVehicles: 0, features: [], color: '#6b7280', pricePerMinute: addForm.pricePerMinute }
              setVehicleTypes([...vehicleTypes, newType])
              setIsAddOpen(false)
              setAddForm({ name: '', code: '', description: '', capacity: 4, basePrice: 200, pricePerKm: 15, pricePerMinute: 2.5 })
              toast({ title: 'Vehicle Type Added', description: `${addForm.name} (${addForm.code}) created successfully` })
            }}>Add Type</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      {selectedType && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Vehicle Type</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedType.name}? This action cannot be undone.
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
