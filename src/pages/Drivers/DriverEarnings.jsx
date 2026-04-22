import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import {
  TrendingUp, TrendingDown, BarChart3, ArrowUpDown, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, RefreshCw, Download, Eye, Edit, Trash2,
  DollarSign, Wallet, CreditCard, AlertTriangle, CheckCircle, Clock
} from 'lucide-react'

// Mock data for driver earnings
const generateMockEarningsData = () => {
  return Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    driverId: index + 1,
    driverName: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Tom Brown', 'Lisa Anderson', 'David Lee', 'Emma Davis', 'Chris Martin', 'Sophie Taylor'][index % 10],
    month: 'March 2026',
    totalEarnings: Math.floor(Math.random() * 50000) + 10000,
    totalTrips: Math.floor(Math.random() * 100) + 20,
    averagePerTrip: Math.floor(Math.random() * 200) + 100,
    bonusEarnings: Math.floor(Math.random() * 5000),
    penaltyDeductions: Math.floor(Math.random() * 2000),
    commissionRate: (Math.random() * 5 + 15).toFixed(1),
    totalCommission: Math.floor(Math.random() * 10000) + 1000,
    platformFees: Math.floor(Math.random() * 5000),
    insuranceCost: Math.floor(Math.random() * 2000),
    maintenanceCost: Math.floor(Math.random() * 3000),
    fuelCost: Math.floor(Math.random() * 8000),
    netEarnings: Math.floor(Math.random() * 40000) + 5000,
    paymentStatus: ['Paid', 'Pending', 'Processing'][Math.floor(Math.random() * 3)],
    paymentMethod: ['Bank Transfer', 'Wallet', 'Check'][Math.floor(Math.random() * 3)],
    paymentDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalWorkingDays: Math.floor(Math.random() * 25) + 5,
    totalWorkingHours: Math.floor(Math.random() * 200) + 50,
    averageHourlyRate: Math.floor(Math.random() * 200) + 100
  }))
}

const mockEarningsData = generateMockEarningsData()

const getPaymentStatusBadge = (status) => {
  const badges = {
    'Paid': <Badge className="bg-green-100 text-green-800">Paid</Badge>,
    'Pending': <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>,
    'Processing': <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
  }
  return badges[status] || badges['Pending']
}

export default function DriverEarnings() {
  const [earningsData, setEarningsData] = useState(mockEarningsData)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedRecords, setSelectedRecords] = useState([])
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // Sorting
  const [sortBy, setSortBy] = useState('totalEarnings')
  const [sortOrder, setSortOrder] = useState('desc')

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

  // Filter and search
  const filteredData = earningsData.filter(record => {
    const matchesSearch = record.driverName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || record.paymentStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  // Sort
  const sortedData = [...filteredData].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Statistics
  const stats = {
    totalEarnings: earningsData.reduce((sum, r) => sum + r.totalEarnings, 0),
    totalNetEarnings: earningsData.reduce((sum, r) => sum + r.netEarnings, 0),
    totalCommission: earningsData.reduce((sum, r) => sum + r.totalCommission, 0),
    totalDeductions: earningsData.reduce((sum, r) => sum + (r.platformFees + r.insuranceCost + r.maintenanceCost + r.fuelCost), 0),
    averageEarningsPerDriver: Math.round(earningsData.reduce((sum, r) => sum + r.totalEarnings, 0) / earningsData.length),
    paidCount: earningsData.filter(r => r.paymentStatus === 'Paid').length
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast({ title: 'Refreshed', description: 'Earnings data updated' })
  }

  const handleViewDetails = (record) => {
    setSelectedRecord(record)
    setIsDetailsDialogOpen(true)
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRecords(paginatedData.map(r => r.id))
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
        <h1 className="text-3xl font-bold tracking-tight">Driver Earnings</h1>
        <p className="text-muted-foreground mt-2">Track and manage driver earnings and payments</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">฿{(stats.totalEarnings / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Gross</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Earnings</CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">฿{(stats.totalNetEarnings / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">After deductions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">฿{(stats.totalDeductions / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Fees & costs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg per Driver</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">฿{stats.averageEarningsPerDriver.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.paidCount}</div>
            <p className="text-xs text-muted-foreground">Payments processed</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Earnings Report</CardTitle>
              <CardDescription>View detailed earnings and payment information</CardDescription>
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
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by driver name..."
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
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
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
                      checked={selectedRecords.length === paginatedData.length && paginatedData.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left cursor-pointer" onClick={() => {
                    setSortBy('driverName')
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  }}>
                    <div className="flex items-center gap-2">
                      Driver Name
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">Trips</th>
                  <th className="px-4 py-3 text-left">Gross Earnings</th>
                  <th className="px-4 py-3 text-left">Deductions</th>
                  <th className="px-4 py-3 text-left">Net Earnings</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedData.map((record) => (
                  <tr key={record.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedRecords.includes(record.id)}
                        onCheckedChange={(checked) => handleSelectRecord(record.id, checked)}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{record.driverName}</td>
                    <td className="px-4 py-3 text-sm font-medium">{record.totalTrips}</td>
                    <td className="px-4 py-3 font-medium text-green-600">฿{record.totalEarnings.toLocaleString()}</td>
                    <td className="px-4 py-3 font-medium text-red-600">฿{(record.platformFees + record.insuranceCost + record.maintenanceCost + record.fuelCost).toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold text-blue-600">฿{record.netEarnings.toLocaleString()}</td>
                    <td className="px-4 py-3">{getPaymentStatusBadge(record.paymentStatus)}</td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(record)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} records
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
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Earnings Details</DialogTitle>
              <DialogDescription>{selectedRecord.driverName} - {selectedRecord.month}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Driver Name</Label>
                <p className="font-medium">{selectedRecord.driverName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Month</Label>
                <p className="font-medium">{selectedRecord.month}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Total Trips</Label>
                <p className="font-medium">{selectedRecord.totalTrips}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Working Days</Label>
                <p className="font-medium">{selectedRecord.totalWorkingDays}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Working Hours</Label>
                <p className="font-medium">{selectedRecord.totalWorkingHours}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Avg Hourly Rate</Label>
                <p className="font-medium">฿{selectedRecord.averageHourlyRate}</p>
              </div>
              <div className="col-span-2 border-t pt-4">
                <h3 className="font-semibold mb-3">Earnings Breakdown</h3>
              </div>
              <div>
                <Label className="text-muted-foreground">Total Earnings</Label>
                <p className="font-bold text-green-600">฿{selectedRecord.totalEarnings.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Bonus Earnings</Label>
                <p className="font-medium">฿{selectedRecord.bonusEarnings.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Commission Rate</Label>
                <p className="font-medium">{selectedRecord.commissionRate}%</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Total Commission</Label>
                <p className="font-medium">฿{selectedRecord.totalCommission.toLocaleString()}</p>
              </div>
              <div className="col-span-2 border-t pt-4">
                <h3 className="font-semibold mb-3">Deductions</h3>
              </div>
              <div>
                <Label className="text-muted-foreground">Platform Fees</Label>
                <p className="font-medium text-red-600">฿{selectedRecord.platformFees.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Insurance Cost</Label>
                <p className="font-medium text-red-600">฿{selectedRecord.insuranceCost.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Maintenance Cost</Label>
                <p className="font-medium text-red-600">฿{selectedRecord.maintenanceCost.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Fuel Cost</Label>
                <p className="font-medium text-red-600">฿{selectedRecord.fuelCost.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Penalty Deductions</Label>
                <p className="font-medium text-red-600">฿{selectedRecord.penaltyDeductions.toLocaleString()}</p>
              </div>
              <div className="col-span-2 border-t pt-4">
                <h3 className="font-semibold mb-3">Net Earnings</h3>
              </div>
              <div className="col-span-2">
                <div className="flex justify-between items-center bg-blue-50 p-3 rounded">
                  <Label className="text-muted-foreground">Net Earnings</Label>
                  <p className="font-bold text-2xl text-blue-600">฿{selectedRecord.netEarnings.toLocaleString()}</p>
                </div>
              </div>
              <div className="col-span-2 border-t pt-4">
                <h3 className="font-semibold mb-3">Payment Information</h3>
              </div>
              <div>
                <Label className="text-muted-foreground">Payment Status</Label>
                <p className="font-medium">{getPaymentStatusBadge(selectedRecord.paymentStatus)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Payment Method</Label>
                <p className="font-medium">{selectedRecord.paymentMethod}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Payment Date</Label>
                <p className="font-medium">{selectedRecord.paymentDate}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Avg per Trip</Label>
                <p className="font-medium">฿{selectedRecord.averagePerTrip}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
