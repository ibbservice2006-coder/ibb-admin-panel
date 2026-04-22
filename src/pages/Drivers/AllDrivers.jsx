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
  Users as UsersIcon, TrendingUp, TrendingDown, BarChart3, ArrowUpDown, ChevronLeft,
  ChevronRight, ChevronsLeft, ChevronsRight, RefreshCw, Download, Filter, X as XIcon,
  Star, Phone, Mail, Award
} from 'lucide-react'

// Mock data generator for drivers
const generateMockDrivers = () => {
  const statuses = ['active', 'inactive', 'on_leave', 'suspended']
  const ratings = [4.5, 4.8, 4.2, 4.9, 3.8, 4.6, 4.7, 4.3, 4.4, 4.1]

  return Array.from({ length: 25 }, (_, index) => ({
    id: index + 1,
    name: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Tom Brown', 'Lisa Anderson', 'David Lee', 'Emma Davis', 'Chris Martin', 'Sophie Taylor'][index % 10],
    email: `driver${index + 1}@ibb.com`,
    phone: `08${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    licenseNumber: `DL-${String(index + 1).padStart(6, '0')}`,
    licenseExpiry: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    rating: ratings[Math.floor(Math.random() * ratings.length)],
    totalTrips: Math.floor(Math.random() * 500) + 50,
    totalEarnings: Math.floor(Math.random() * 500000) + 50000,
    completionRate: Math.floor(Math.random() * 100) + 80,
    cancelRate: Math.floor(Math.random() * 10),
    documents: {
      license: Math.random() > 0.3,
      insurance: Math.random() > 0.2,
      background: Math.random() > 0.1,
      medical: Math.random() > 0.15
    },
    assignedVehicle: `IBB-${String(Math.floor(Math.random() * 100) + 1).padStart(4, '0')}`,
    address: 'Bangkok, Thailand',
    emergencyContact: 'Emergency Contact Name',
    emergencyPhone: '08XXXXXXXX'
  }))
}

const mockDrivers = generateMockDrivers()

const getStatusBadge = (status) => {
  const badges = {
    active: <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>,
    inactive: <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>,
    on_leave: <Badge className="bg-blue-100 text-blue-800 border-blue-200">On Leave</Badge>,
    suspended: <Badge className="bg-red-100 text-red-800 border-red-200">Suspended</Badge>
  }
  return badges[status] || badges.active
}

const getRatingColor = (rating) => {
  if (rating >= 4.7) return 'text-green-600'
  if (rating >= 4.3) return 'text-blue-600'
  if (rating >= 4.0) return 'text-yellow-600'
  return 'text-red-600'
}

export default function AllDrivers() {
  const [drivers, setDrivers] = useState(mockDrivers)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedDrivers, setSelectedDrivers] = useState([])
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newDriver, setNewDriver] = useState({ name: '', phone: '', email: '', licenseNumber: '', status: 'active' })
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // Sorting
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')

  const { toast } = useToast()

  // Filter and search
  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.phone.includes(searchTerm) ||
                         driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Sort
  const sortedDrivers = [...filteredDrivers].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedDrivers.length / itemsPerPage)
  const paginatedDrivers = sortedDrivers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Statistics
  const stats = {
    total: drivers.length,
    active: drivers.filter(d => d.status === 'active').length,
    inactive: drivers.filter(d => d.status === 'inactive').length,
    onLeave: drivers.filter(d => d.status === 'on_leave').length,
    averageRating: (drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length).toFixed(1),
    totalEarnings: drivers.reduce((sum, d) => sum + d.totalEarnings, 0)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast({ title: 'Refreshed', description: 'Driver data updated' })
  }

  const handleViewDetails = (driver) => {
    setSelectedDriver(driver)
    setIsDetailsDialogOpen(true)
  }

  const handleEdit = (driver) => {
    setSelectedDriver(driver)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (driver) => {
    setSelectedDriver(driver)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    setDrivers(drivers.filter(d => d.id !== selectedDriver.id))
    setIsDeleteDialogOpen(false)
    toast({ title: 'Deleted', description: `Driver ${selectedDriver.name} removed` })
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedDrivers(paginatedDrivers.map(d => d.id))
    } else {
      setSelectedDrivers([])
    }
  }

  const handleSelectDriver = (driverId, checked) => {
    if (checked) {
      setSelectedDrivers([...selectedDrivers, driverId])
    } else {
      setSelectedDrivers(selectedDrivers.filter(id => id !== driverId))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Drivers</h1>
        <p className="text-muted-foreground mt-2">Manage and monitor your driver fleet</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All drivers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.onLeave}</div>
            <p className="text-xs text-muted-foreground">Temporary absence</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.averageRating}/5.0</div>
            <p className="text-xs text-muted-foreground">Overall rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <TrendingDown className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">฿{(stats.totalEarnings / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">All drivers</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Driver Fleet</CardTitle>
              <CardDescription>View and manage all drivers in your system</CardDescription>
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
                Add Driver
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, email, phone, or license number..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
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
                      checked={selectedDrivers.length === paginatedDrivers.length && paginatedDrivers.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left cursor-pointer" onClick={() => {
                    setSortBy('name')
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  }}>
                    <div className="flex items-center gap-2">
                      Name
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">Contact</th>
                  <th className="px-4 py-3 text-left">License</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Rating</th>
                  <th className="px-4 py-3 text-left">Trips</th>
                  <th className="px-4 py-3 text-left">Completion</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedDrivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedDrivers.includes(driver.id)}
                        onCheckedChange={(checked) => handleSelectDriver(driver.id, checked)}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{driver.name}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {driver.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {driver.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{driver.licenseNumber}</td>
                    <td className="px-4 py-3">{getStatusBadge(driver.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className={`h-4 w-4 ${getRatingColor(driver.rating)}`} />
                        <span className={`font-medium ${getRatingColor(driver.rating)}`}>{driver.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{driver.totalTrips}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-green-500"
                            style={{ width: `${driver.completionRate}%` }}
                          />
                        </div>
                        <span className="text-xs">{driver.completionRate}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(driver)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(driver)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(driver)}
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
              Showing {paginatedDrivers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, sortedDrivers.length)} of {sortedDrivers.length} drivers
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
      {selectedDriver && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Driver Details</DialogTitle>
              <DialogDescription>{selectedDriver.name}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p className="font-medium">{selectedDriver.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <p className="font-medium">{getStatusBadge(selectedDriver.status)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{selectedDriver.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Phone</Label>
                <p className="font-medium">{selectedDriver.phone}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">License Number</Label>
                <p className="font-medium">{selectedDriver.licenseNumber}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">License Expiry</Label>
                <p className="font-medium">{selectedDriver.licenseExpiry}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Join Date</Label>
                <p className="font-medium">{selectedDriver.joinDate}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Rating</Label>
                <p className={`font-medium ${getRatingColor(selectedDriver.rating)}`}>{selectedDriver.rating}/5.0</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Total Trips</Label>
                <p className="font-medium">{selectedDriver.totalTrips}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Total Earnings</Label>
                <p className="font-medium">฿{selectedDriver.totalEarnings.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Completion Rate</Label>
                <p className="font-medium">{selectedDriver.completionRate}%</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Cancel Rate</Label>
                <p className="font-medium">{selectedDriver.cancelRate}%</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Assigned Vehicle</Label>
                <p className="font-medium">{selectedDriver.assignedVehicle}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Address</Label>
                <p className="font-medium">{selectedDriver.address}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Documents</Label>
                <div className="flex gap-2 mt-2">
                  <Badge variant={selectedDriver.documents.license ? 'default' : 'secondary'}>
                    License {selectedDriver.documents.license ? '✓' : '✗'}
                  </Badge>
                  <Badge variant={selectedDriver.documents.insurance ? 'default' : 'secondary'}>
                    Insurance {selectedDriver.documents.insurance ? '✓' : '✗'}
                  </Badge>
                  <Badge variant={selectedDriver.documents.background ? 'default' : 'secondary'}>
                    Background {selectedDriver.documents.background ? '✓' : '✗'}
                  </Badge>
                  <Badge variant={selectedDriver.documents.medical ? 'default' : 'secondary'}>
                    Medical {selectedDriver.documents.medical ? '✓' : '✗'}
                  </Badge>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Driver Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add new driver</DialogTitle>
            <DialogDescription>Add driver info to IBB Shuttle system</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5">
              <Label>Full name <span className="text-red-500">*</span></Label>
              <Input placeholder="Somchai PhraPhrom" value={newDriver.name} onChange={e => setNewDriver({...newDriver, name: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label>Phone Number <span className="text-red-500">*</span></Label>
              <Input placeholder="+66-81-234-5678" value={newDriver.phone} onChange={e => setNewDriver({...newDriver, phone: e.target.value})} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Email</Label>
              <Input placeholder="driver@ibb.com" type="email" value={newDriver.email} onChange={e => setNewDriver({...newDriver, email: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label>Driver license number</Label>
              <Input placeholder="DL-000001" value={newDriver.licenseNumber} onChange={e => setNewDriver({...newDriver, licenseNumber: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={newDriver.status} onValueChange={v => setNewDriver({...newDriver, status: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
              if (!newDriver.name || !newDriver.phone) { toast({ title: 'Please enter name and phone number', variant: 'destructive' }); return }
              setDrivers([{ id: Date.now(), name: newDriver.name, phone: newDriver.phone, email: newDriver.email, licenseNumber: newDriver.licenseNumber || 'DL-NEW', licenseExpiry: '2027-12-31', status: newDriver.status, joinDate: new Date().toISOString().split('T')[0], rating: 0, totalTrips: 0, totalEarnings: 0, completionRate: 100, cancelRate: 0, documents: { license: false, insurance: false, background: false, medical: false }, assignedVehicle: 'Unassigned', address: 'Bangkok, Thailand', emergencyContact: '-', emergencyPhone: '-' }, ...drivers])
              setIsAddOpen(false)
              setNewDriver({ name: '', phone: '', email: '', licenseNumber: '', status: 'active' })
              toast({ title: 'Driver Added!', description: `${newDriver.name} added to system successfully` })
            }}>Add Driver</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      {selectedDriver && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Driver</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedDriver.name}? This action cannot be undone.
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
