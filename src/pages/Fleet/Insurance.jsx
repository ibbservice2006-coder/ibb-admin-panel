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
  Plus, Edit, Trash2, Eye, AlertTriangle, CheckCircle, Clock,
  TrendingUp, BarChart3, ArrowUpDown, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, RefreshCw, Download, Shield, AlertCircle,
  Calendar, DollarSign
} from 'lucide-react'

// Mock data for insurance records
const generateMockInsuranceRecords = () => {
  const providers = ['Thai Insurance Co.', 'Bangkok Insurance', 'AXA Insurance', 'Allianz', 'Generali']
  const types = ['Comprehensive', 'Third Party', 'Full Coverage', 'Premium']
  const statuses = ['active', 'expiring_soon', 'expired', 'pending_renewal']
  const vehicles = ['IBB-0001', 'IBB-0002', 'IBB-0003', 'IBB-0004', 'IBB-0005', 'IBB-0006', 'IBB-0007', 'IBB-0008']

  return Array.from({ length: 20 }, (_, index) => {
    const startDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
    const expiryDate = new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000)
    const daysUntilExpiry = Math.floor((expiryDate - Date.now()) / (24 * 60 * 60 * 1000))
    
    let status = 'active'
    if (daysUntilExpiry < 0) status = 'expired'
    else if (daysUntilExpiry < 30) status = 'expiring_soon'
    
    return {
      id: index + 1,
      licensePlate: vehicles[Math.floor(Math.random() * vehicles.length)],
      provider: providers[Math.floor(Math.random() * providers.length)],
      type: types[Math.floor(Math.random() * types.length)],
      policyNumber: `POL-${String(index + 1).padStart(6, '0')}`,
      startDate: startDate.toISOString().split('T')[0],
      expiryDate: expiryDate.toISOString().split('T')[0],
      status: status,
      premium: Math.floor(Math.random() * 20000) + 5000,
      coverage: Math.floor(Math.random() * 5000000) + 1000000,
      deductible: [5000, 10000, 15000, 20000][Math.floor(Math.random() * 4)],
      daysUntilExpiry: daysUntilExpiry,
      claimsHistory: Math.floor(Math.random() * 3),
      agentName: ['Agent Smith', 'Agent Johnson', 'Agent Williams', 'Agent Brown'][Math.floor(Math.random() * 4)],
      agentPhone: '02-XXX-XXXX',
      notes: 'Active insurance policy'
    }
  })
}

const mockInsuranceRecords = generateMockInsuranceRecords()

const getStatusBadge = (status, daysUntilExpiry) => {
  const badges = {
    active: <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>,
    expiring_soon: <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Expiring Soon ({daysUntilExpiry} days)</Badge>,
    expired: <Badge className="bg-red-100 text-red-800 border-red-200">Expired</Badge>,
    pending_renewal: <Badge className="bg-blue-100 text-blue-800 border-blue-200">Pending Renewal</Badge>
  }
  return badges[status] || badges.active
}

export default function Insurance() {
  const [records, setRecords] = useState(mockInsuranceRecords)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedRecords, setSelectedRecords] = useState([])
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({ licensePlate: '', provider: '', type: 'Comprehensive', policyNumber: '', startDate: '', expiryDate: '', premium: '', coverage: '', deductible: 10000, agentName: '', notes: '' })
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // Sorting
  const [sortBy, setSortBy] = useState('expiryDate')
  const [sortOrder, setSortOrder] = useState('asc')

  const { toast } = useToast()

  // Get unique types
  const insuranceTypes = [...new Set(records.map(r => r.type))]

  // Filter and search
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.policyNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter
    const matchesType = typeFilter === 'all' || record.type === typeFilter
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
    active: records.filter(r => r.status === 'active').length,
    expiringSoon: records.filter(r => r.status === 'expiring_soon').length,
    expired: records.filter(r => r.status === 'expired').length,
    totalPremium: records.reduce((sum, r) => sum + r.premium, 0),
    totalCoverage: records.reduce((sum, r) => sum + r.coverage, 0)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast({ title: 'Refreshed', description: 'Insurance records updated' })
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
    toast({ title: 'Deleted', description: 'Insurance record removed' })
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
        <h1 className="text-3xl font-bold tracking-tight">Insurance Management</h1>
        <p className="text-muted-foreground mt-2">Track and manage vehicle insurance policies</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All policies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Valid policies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.expiringSoon}</div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Premium</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">฿{(stats.totalPremium / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Annual cost</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coverage</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600"> > > >฿{(stats.totalCoverage / 1000000).toFixed(0)}M</div>
            <p className="text-xs text-muted-foreground">Total insured</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Insurance Policies</CardTitle>
              <CardDescription>Manage vehicle insurance and coverage details</CardDescription>
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
                Add Policy
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by license plate, provider, or policy number..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending_renewal">Pending Renewal</SelectItem>
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
                {insuranceTypes.map(type => (
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
                  <th className="px-4 py-3 text-left">Provider</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Expiry Date</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Premium</th>
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
                    <td className="px-4 py-3 text-sm">{record.provider}</td>
                    <td className="px-4 py-3 text-sm">{record.type}</td>
                    <td className="px-4 py-3 text-sm">{record.expiryDate}</td>
                    <td className="px-4 py-3">{getStatusBadge(record.status, record.daysUntilExpiry)}</td>
                    <td className="px-4 py-3 font-medium">฿{record.premium.toLocaleString()}</td>
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
              Showing {paginatedRecords.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, sortedRecords.length)} of {sortedRecords.length} policies
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
              <DialogTitle>Insurance Policy Details</DialogTitle>
              <DialogDescription>{selectedRecord.policyNumber}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">License Plate</Label>
                <p className="font-medium">{selectedRecord.licensePlate}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Policy Number</Label>
                <p className="font-medium">{selectedRecord.policyNumber}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Provider</Label>
                <p className="font-medium">{selectedRecord.provider}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Type</Label>
                <p className="font-medium">{selectedRecord.type}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Start Date</Label>
                <p className="font-medium">{selectedRecord.startDate}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Expiry Date</Label>
                <p className="font-medium">{selectedRecord.expiryDate}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <p className="font-medium">{getStatusBadge(selectedRecord.status, selectedRecord.daysUntilExpiry)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Premium</Label>
                <p className="font-medium">฿{selectedRecord.premium.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Coverage Amount</Label>
                <p className="font-medium">฿{selectedRecord.coverage.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Deductible</Label>
                <p className="font-medium">฿{selectedRecord.deductible.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Claims History</Label>
                <p className="font-medium">{selectedRecord.claimsHistory} claims</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Agent Name</Label>
                <p className="font-medium">{selectedRecord.agentName}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Agent Contact</Label>
                <p className="font-medium">{selectedRecord.agentPhone}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Notes</Label>
                <p className="font-medium">{selectedRecord.notes}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Policy Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Insurance Policy</DialogTitle>
            <DialogDescription>Register a new vehicle insurance policy</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>License Plate *</Label>
              <Input placeholder="IBB-0001" value={addForm.licensePlate}
                onChange={e => setAddForm({...addForm, licensePlate: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Policy Number *</Label>
              <Input placeholder="POL-000001" value={addForm.policyNumber}
                onChange={e => setAddForm({...addForm, policyNumber: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Insurance Provider</Label>
              <Input placeholder="e.g. AXA Insurance" value={addForm.provider}
                onChange={e => setAddForm({...addForm, provider: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Coverage Type</Label>
              <Select value={addForm.type} onValueChange={v => setAddForm({...addForm, type: v})}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Comprehensive">Comprehensive</SelectItem>
                  <SelectItem value="Third Party">Third Party</SelectItem>
                  <SelectItem value="Full Coverage">Full Coverage</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Start Date</Label>
              <Input type="date" value={addForm.startDate}
                onChange={e => setAddForm({...addForm, startDate: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Expiry Date</Label>
              <Input type="date" value={addForm.expiryDate}
                onChange={e => setAddForm({...addForm, expiryDate: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Annual Premium (฿)</Label>
              <Input type="number" placeholder="15000" value={addForm.premium}
                onChange={e => setAddForm({...addForm, premium: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Coverage Amount (฿)</Label>
              <Input type="number" placeholder="1000000" value={addForm.coverage}
                onChange={e => setAddForm({...addForm, coverage: e.target.value})} className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label>Agent Name</Label>
              <Input placeholder="Agent name" value={addForm.agentName}
                onChange={e => setAddForm({...addForm, agentName: e.target.value})} className="mt-1" />
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
              if (!addForm.licensePlate || !addForm.policyNumber) { toast({ title: 'Error', description: 'License plate and policy number required', variant: 'destructive' }); return }
              const today = new Date()
              const expiry = addForm.expiryDate ? new Date(addForm.expiryDate) : new Date(today.getTime() + 365*24*60*60*1000)
              const daysLeft = Math.floor((expiry - today) / (24*60*60*1000))
              const newRecord = { ...addForm, id: records.length + 1, status: daysLeft < 0 ? 'expired' : daysLeft < 30 ? 'expiring_soon' : 'active', daysUntilExpiry: daysLeft, premium: parseInt(addForm.premium)||0, coverage: parseInt(addForm.coverage)||0, claimsHistory: 0, agentPhone: '-' }
              setRecords([newRecord, ...records])
              setIsAddOpen(false)
              setAddForm({ licensePlate: '', provider: '', type: 'Comprehensive', policyNumber: '', startDate: '', expiryDate: '', premium: '', coverage: '', deductible: 10000, agentName: '', notes: '' })
              toast({ title: 'Policy Added', description: `Policy ${addForm.policyNumber} for ${addForm.licensePlate} created` })
            }}>Add Policy</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      {selectedRecord && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Insurance Policy</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this insurance policy? This action cannot be undone.
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
