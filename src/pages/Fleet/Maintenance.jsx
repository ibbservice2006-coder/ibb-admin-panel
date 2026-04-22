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
  Plus, Edit, Trash2, Eye, Calendar, AlertTriangle, CheckCircle, Clock,
  TrendingUp, BarChart3, ArrowUpDown, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, RefreshCw, Download, Wrench, AlertCircle
} from 'lucide-react'

// Mock data for maintenance records
const generateMockMaintenanceRecords = () => {
  const types = ['Oil Change', 'Tire Rotation', 'Brake Service', 'Engine Inspection', 'Battery Check', 'Filter Replacement', 'Fluid Top-up', 'General Inspection']
  const statuses = ['scheduled', 'in_progress', 'completed', 'overdue']
  const vehicles = ['IBB-0001', 'IBB-0002', 'IBB-0003', 'IBB-0004', 'IBB-0005', 'IBB-0006', 'IBB-0007', 'IBB-0008']

  return Array.from({ length: 20 }, (_, index) => {
    const dueDate = new Date(Date.now() + (Math.random() - 0.5) * 60 * 24 * 60 * 60 * 1000)
    const completedDate = Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null
    
    return {
      id: index + 1,
      licensePlate: vehicles[Math.floor(Math.random() * vehicles.length)],
      maintenanceType: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      scheduledDate: dueDate.toISOString().split('T')[0],
      completedDate: completedDate ? completedDate.toISOString().split('T')[0] : null,
      cost: Math.floor(Math.random() * 5000) + 500,
      technician: ['John Smith', 'Mike Johnson', 'Sarah Wilson', 'Tom Brown', 'Unassigned'][Math.floor(Math.random() * 5)],
      notes: 'Regular maintenance service',
      mileage: Math.floor(Math.random() * 150000) + 5000,
      nextDueDate: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  })
}

const mockMaintenanceRecords = generateMockMaintenanceRecords()

const getStatusBadge = (status) => {
  const badges = {
    scheduled: <Badge className="bg-blue-100 text-blue-800 border-blue-200">Scheduled</Badge>,
    in_progress: <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">In Progress</Badge>,
    completed: <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>,
    overdue: <Badge className="bg-red-100 text-red-800 border-red-200">Overdue</Badge>
  }
  return badges[status] || badges.scheduled
}

export default function Maintenance() {
  const [records, setRecords] = useState(mockMaintenanceRecords)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedRecords, setSelectedRecords] = useState([])
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // Sorting
  const [sortBy, setSortBy] = useState('scheduledDate')
  const [sortOrder, setSortOrder] = useState('asc')

  const { toast } = useToast()

  // Get unique maintenance types
  const maintenanceTypes = [...new Set(records.map(r => r.maintenanceType))]

  // Filter and search
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.maintenanceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.technician.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter
    const matchesType = typeFilter === 'all' || record.maintenanceType === typeFilter
    return matchesSearch && matchesStatus && matchesType
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
    scheduled: records.filter(r => r.status === 'scheduled').length,
    inProgress: records.filter(r => r.status === 'in_progress').length,
    completed: records.filter(r => r.status === 'completed').length,
    overdue: records.filter(r => r.status === 'overdue').length,
    totalCost: records.reduce((sum, r) => sum + r.cost, 0)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast({ title: 'Refreshed', description: 'Maintenance records updated' })
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
    toast({ title: 'Deleted', description: 'Maintenance record removed' })
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
        <h1 className="text-3xl font-bold tracking-tight">Maintenance Management</h1>
        <p className="text-muted-foreground mt-2">Track and schedule vehicle maintenance</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All maintenance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
            <p className="text-xs text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Being serviced</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Done</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">฿{stats.totalCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Spent</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Maintenance Records</CardTitle>
              <CardDescription>View and manage vehicle maintenance schedules</CardDescription>
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
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => toast({ title: 'Scheduled', description: 'Time set successfully' })}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Maintenance
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by license plate, type, or technician..."
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
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(value) => {
              setTypeFilter(value)
              setCurrentPage(1)
            }}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {maintenanceTypes.map(type => (
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
                    setSortBy('licensePlate')
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  }}>
                    <div className="flex items-center gap-2">
                      Vehicle
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Scheduled Date</th>
                  <th className="px-4 py-3 text-left">Technician</th>
                  <th className="px-4 py-3 text-left">Cost</th>
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
                    <td className="px-4 py-3 font-medium">{record.licensePlate}</td>
                    <td className="px-4 py-3 text-sm">{record.maintenanceType}</td>
                    <td className="px-4 py-3">{getStatusBadge(record.status)}</td>
                    <td className="px-4 py-3 text-sm">{record.scheduledDate}</td>
                    <td className="px-4 py-3 text-sm">{record.technician}</td>
                    <td className="px-4 py-3 font-medium">฿{record.cost.toLocaleString()}</td>
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
              <DialogTitle>Maintenance Details</DialogTitle>
              <DialogDescription>{selectedRecord.licensePlate} - {selectedRecord.maintenanceType}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">License Plate</Label>
                <p className="font-medium">{selectedRecord.licensePlate}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Type</Label>
                <p className="font-medium">{selectedRecord.maintenanceType}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <p className="font-medium">{getStatusBadge(selectedRecord.status)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Technician</Label>
                <p className="font-medium">{selectedRecord.technician}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Scheduled Date</Label>
                <p className="font-medium">{selectedRecord.scheduledDate}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Completed Date</Label>
                <p className="font-medium">{selectedRecord.completedDate || 'Not completed'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Cost</Label>
                <p className="font-medium">฿{selectedRecord.cost.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Mileage</Label>
                <p className="font-medium">{selectedRecord.mileage.toLocaleString()} km</p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Notes</Label>
                <p className="font-medium">{selectedRecord.notes}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Next Due Date</Label>
                <p className="font-medium">{selectedRecord.nextDueDate}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Dialog */}
      {selectedRecord && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Maintenance Record</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this maintenance record? This action cannot be undone.
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
