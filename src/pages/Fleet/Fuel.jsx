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
  Plus, Edit, Trash2, Eye, Zap, TrendingUp, TrendingDown, BarChart3,
  ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  RefreshCw, Download, Droplet, AlertCircle, Calendar, DollarSign
} from 'lucide-react'

// Mock data for fuel records
const generateMockFuelRecords = () => {
  const vehicles = ['IBB-0001', 'IBB-0002', 'IBB-0003', 'IBB-0004', 'IBB-0005', 'IBB-0006', 'IBB-0007', 'IBB-0008']
  const fuelTypes = ['Petrol 95', 'Petrol 91', 'Diesel']
  const stations = ['PTT Station', 'Shell Station', 'Caltex Station', 'Esso Station', 'Bangchak Station']

  return Array.from({ length: 30 }, (_, index) => {
    const date = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
    
    return {
      id: index + 1,
      licensePlate: vehicles[Math.floor(Math.random() * vehicles.length)],
      date: date.toISOString().split('T')[0],
      time: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      fuelType: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
      quantity: (Math.random() * 40 + 10).toFixed(2),
      pricePerLiter: (Math.random() * 5 + 30).toFixed(2),
      totalCost: 0, // Will be calculated
      station: stations[Math.floor(Math.random() * stations.length)],
      mileage: Math.floor(Math.random() * 150000) + 5000,
      fuelLevel: Math.floor(Math.random() * 100),
      consumption: (Math.random() * 5 + 8).toFixed(2),
      driver: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'][Math.floor(Math.random() * 4)],
      notes: 'Regular fuel refill'
    }
  }).map(record => ({
    ...record,
    totalCost: (parseFloat(record.quantity) * parseFloat(record.pricePerLiter)).toFixed(2)
  }))
}

const mockFuelRecords = generateMockFuelRecords()

export default function Fuel() {
  const [records, setRecords] = useState(mockFuelRecords)
  const [searchTerm, setSearchTerm] = useState('')
  const [fuelTypeFilter, setFuelTypeFilter] = useState('all')
  const [selectedRecords, setSelectedRecords] = useState([])
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({ licensePlate: '', date: new Date().toISOString().split('T')[0], time: '', fuelType: 'Petrol 95', quantity: '', pricePerLiter: '', station: '', mileage: '', driver: '', notes: '' })
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // Sorting
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')

  const { toast } = useToast()

  // Get unique fuel types
  const fuelTypes = [...new Set(records.map(r => r.fuelType))]

  // Filter and search
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.station.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.driver.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFuelType = fuelTypeFilter === 'all' || record.fuelType === fuelTypeFilter
    return matchesSearch && matchesFuelType
  })

  // Sort
  const sortedRecords = [...filteredRecords].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedRecords.length / itemsPerPage)
  const paginatedRecords = sortedRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Statistics
  const stats = {
    total: records.length,
    totalCost: records.reduce((sum, r) => sum + parseFloat(r.totalCost), 0),
    totalQuantity: records.reduce((sum, r) => sum + parseFloat(r.quantity), 0),
    averageConsumption: (records.reduce((sum, r) => sum + parseFloat(r.consumption), 0) / records.length).toFixed(2),
    averageCostPerLiter: (records.reduce((sum, r) => sum + parseFloat(r.pricePerLiter), 0) / records.length).toFixed(2)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast({ title: 'Refreshed', description: 'Fuel records updated' })
  }

  const handleViewDetails = (record) => {
    setSelectedRecord(record)
    setIsDetailsDialogOpen(true)
  }

  const handleEdit = (record) => {
    setSelectedRecord(record)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (record) => {
    setSelectedRecord(record)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    setRecords(records.filter(r => r.id !== selectedRecord.id))
    setIsDeleteDialogOpen(false)
    toast({ title: 'Deleted', description: 'Fuel record removed' })
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRecords(paginatedRecords.map(r => r.id))
    } else {
      setSelectedRecords([])
    }
  }

  const handleSelectRecord = (recordId, checked) => {
    if (checked) {
      setSelectedRecords([...selectedRecords, recordId])
    } else {
      setSelectedRecords(selectedRecords.filter(id => id !== recordId))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fuel Management</h1>
        <p className="text-muted-foreground mt-2">Track fuel consumption and costs</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Fuel transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">฿{stats.totalCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
            <p className="text-xs text-muted-foreground">Total spent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalQuantity.toLocaleString('en-US', { maximumFractionDigits: 0 })} L</div>
            <p className="text-xs text-muted-foreground">Liters</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Consumption</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.averageConsumption} km/L</div>
            <p className="text-xs text-muted-foreground">Per liter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">฿{stats.averageCostPerLiter}</div>
            <p className="text-xs text-muted-foreground">Per liter</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Fuel Records</CardTitle>
              <CardDescription>View and manage fuel consumption records</CardDescription>
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
                Record Fuel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by license plate, station, or driver..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full"
              />
            </div>
            <Select value={fuelTypeFilter} onValueChange={(value) => {
              setFuelTypeFilter(value)
              setCurrentPage(1)
            }}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {fuelTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
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
                      checked={selectedRecords.length === paginatedRecords.length && paginatedRecords.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left cursor-pointer" onClick={() => {
                    setSortBy('date')
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  }}>
                    <div className="flex items-center gap-2">
                      Date
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">Vehicle</th>
                  <th className="px-4 py-3 text-left">Fuel Type</th>
                  <th className="px-4 py-3 text-left">Quantity</th>
                  <th className="px-4 py-3 text-left">Price/L</th>
                  <th className="px-4 py-3 text-left">Total Cost</th>
                  <th className="px-4 py-3 text-left">Station</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedRecords.includes(record.id)}
                        onCheckedChange={(checked) => handleSelectRecord(record.id, checked)}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">{record.date} {record.time}</td>
                    <td className="px-4 py-3 font-medium">{record.licensePlate}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant="outline">{record.fuelType}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">{record.quantity} L</td>
                    <td className="px-4 py-3 text-sm">฿{record.pricePerLiter}</td>
                    <td className="px-4 py-3 font-medium">฿{parseFloat(record.totalCost).toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-sm">{record.station}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(record)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(record)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(record)}
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
              Showing {paginatedRecords.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, sortedRecords.length)} of {sortedRecords.length} records
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
      {selectedRecord && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Fuel Record Details</DialogTitle>
              <DialogDescription>{selectedRecord.licensePlate} - {selectedRecord.date}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">License Plate</Label>
                <p className="font-medium">{selectedRecord.licensePlate}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Date & Time</Label>
                <p className="font-medium">{selectedRecord.date} {selectedRecord.time}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Fuel Type</Label>
                <p className="font-medium">{selectedRecord.fuelType}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Station</Label>
                <p className="font-medium">{selectedRecord.station}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Quantity</Label>
                <p className="font-medium">{selectedRecord.quantity} L</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Price per Liter</Label>
                <p className="font-medium">฿{selectedRecord.pricePerLiter}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Total Cost</Label>
                <p className="font-medium">฿{parseFloat(selectedRecord.totalCost).toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Mileage</Label>
                <p className="font-medium">{selectedRecord.mileage.toLocaleString()} km</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Fuel Level</Label>
                <p className="font-medium">{selectedRecord.fuelLevel}%</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Consumption</Label>
                <p className="font-medium">{selectedRecord.consumption} km/L</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Driver</Label>
                <p className="font-medium">{selectedRecord.driver}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Notes</Label>
                <p className="font-medium">{selectedRecord.notes}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Record Fuel Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Record Fuel</DialogTitle>
            <DialogDescription>Log a new fuel refill record</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>License Plate *</Label>
              <Input placeholder="IBB-0001" value={addForm.licensePlate}
                onChange={e => setAddForm({...addForm, licensePlate: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Driver</Label>
              <Input placeholder="Driver name" value={addForm.driver}
                onChange={e => setAddForm({...addForm, driver: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={addForm.date}
                onChange={e => setAddForm({...addForm, date: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Time</Label>
              <Input type="time" value={addForm.time}
                onChange={e => setAddForm({...addForm, time: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Fuel Type</Label>
              <Select value={addForm.fuelType} onValueChange={v => setAddForm({...addForm, fuelType: v})}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Petrol 95">Petrol 95</SelectItem>
                  <SelectItem value="Petrol 91">Petrol 91</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Station</Label>
              <Input placeholder="PTT Station" value={addForm.station}
                onChange={e => setAddForm({...addForm, station: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Quantity (Liters) *</Label>
              <Input type="number" step="0.01" placeholder="35.50" value={addForm.quantity}
                onChange={e => setAddForm({...addForm, quantity: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Price per Liter (฿)</Label>
              <Input type="number" step="0.01" placeholder="35.00" value={addForm.pricePerLiter}
                onChange={e => setAddForm({...addForm, pricePerLiter: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Mileage (km)</Label>
              <Input type="number" placeholder="50000" value={addForm.mileage}
                onChange={e => setAddForm({...addForm, mileage: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Total Cost</Label>
              <Input disabled value={addForm.quantity && addForm.pricePerLiter ? `฿${(parseFloat(addForm.quantity)*parseFloat(addForm.pricePerLiter)).toFixed(2)}` : '-'} className="mt-1 bg-muted/50" />
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
              if (!addForm.licensePlate || !addForm.quantity) { toast({ title: 'Error', description: 'License plate and quantity are required', variant: 'destructive' }); return }
              const totalCost = (parseFloat(addForm.quantity||0) * parseFloat(addForm.pricePerLiter||0)).toFixed(2)
              const newRecord = { ...addForm, id: records.length + 1, quantity: parseFloat(addForm.quantity).toFixed(2), pricePerLiter: parseFloat(addForm.pricePerLiter||0).toFixed(2), totalCost, mileage: parseInt(addForm.mileage)||0, fuelLevel: 100, consumption: '12.00' }
              setRecords([newRecord, ...records])
              setIsAddOpen(false)
              setAddForm({ licensePlate: '', date: new Date().toISOString().split('T')[0], time: '', fuelType: 'Petrol 95', quantity: '', pricePerLiter: '', station: '', mileage: '', driver: '', notes: '' })
              toast({ title: 'Fuel Recorded', description: `${addForm.quantity}L for ${addForm.licensePlate} recorded successfully` })
            }}>Record Fuel</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      {selectedRecord && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Fuel Record</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this fuel record? This action cannot be undone.
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
