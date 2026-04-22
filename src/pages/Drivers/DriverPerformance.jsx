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
  Star, Award, AlertTriangle, CheckCircle, Clock, Zap
} from 'lucide-react'

// Mock data for driver performance
const generateMockPerformanceData = () => {
  return Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    driverId: index + 1,
    driverName: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Tom Brown', 'Lisa Anderson', 'David Lee', 'Emma Davis', 'Chris Martin', 'Sophie Taylor'][index % 10],
    month: 'March 2026',
    rating: (Math.random() * 1 + 4).toFixed(1),
    totalTrips: Math.floor(Math.random() * 100) + 20,
    completedTrips: Math.floor(Math.random() * 95) + 20,
    cancelledTrips: Math.floor(Math.random() * 5),
    averageRating: (Math.random() * 1 + 4).toFixed(1),
    onTimePercentage: Math.floor(Math.random() * 20) + 80,
    safetyScore: Math.floor(Math.random() * 20) + 80,
    customerComplaints: Math.floor(Math.random() * 3),
    totalEarnings: Math.floor(Math.random() * 50000) + 10000,
    averageEarningsPerTrip: Math.floor(Math.random() * 200) + 100,
    acceptanceRate: Math.floor(Math.random() * 20) + 80,
    cancellationRate: Math.floor(Math.random() * 5),
    averageWaitTime: Math.floor(Math.random() * 5) + 2,
    averageTripDuration: Math.floor(Math.random() * 30) + 15,
    totalDistance: Math.floor(Math.random() * 5000) + 500,
    fuelConsumption: (Math.random() * 2 + 8).toFixed(1),
    vehicleCondition: ['Excellent', 'Good', 'Fair'][Math.floor(Math.random() * 3)],
    communicationRating: (Math.random() * 1 + 4).toFixed(1),
    reliabilityScore: Math.floor(Math.random() * 20) + 80
  }))
}

const mockPerformanceData = generateMockPerformanceData()

const getPerformanceColor = (score) => {
  if (score >= 85) return 'text-green-600'
  if (score >= 75) return 'text-blue-600'
  if (score >= 65) return 'text-yellow-600'
  return 'text-red-600'
}

const getPerformanceBadge = (score) => {
  if (score >= 85) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
  if (score >= 75) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
  if (score >= 65) return <Badge className="bg-yellow-100 text-yellow-800">Fair</Badge>
  return <Badge className="bg-red-100 text-red-800">Poor</Badge>
}

export default function DriverPerformance() {
  const [performanceData, setPerformanceData] = useState(mockPerformanceData)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRecords, setSelectedRecords] = useState([])
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // Sorting
  const [sortBy, setSortBy] = useState('rating')
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
  const filteredData = performanceData.filter(record => {
    return record.driverName.toLowerCase().includes(searchTerm.toLowerCase())
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
    totalDrivers: performanceData.length,
    averageRating: (performanceData.reduce((sum, r) => sum + parseFloat(r.rating), 0) / performanceData.length).toFixed(1),
    averageSafetyScore: Math.round(performanceData.reduce((sum, r) => sum + r.safetyScore, 0) / performanceData.length),
    averageOnTime: Math.round(performanceData.reduce((sum, r) => sum + r.onTimePercentage, 0) / performanceData.length),
    totalComplaints: performanceData.reduce((sum, r) => sum + r.customerComplaints, 0)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast({ title: 'Refreshed', description: 'Performance data updated' })
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
        <h1 className="text-3xl font-bold tracking-tight">Driver Performance</h1>
        <p className="text-muted-foreground mt-2">Monitor and analyze driver performance metrics</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDrivers}</div>
            <p className="text-xs text-muted-foreground">Monitored</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.averageRating}/5.0</div>
            <p className="text-xs text-muted-foreground">Overall rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(stats.averageSafetyScore)}`}>{stats.averageSafetyScore}%</div>
            <p className="text-xs text-muted-foreground">Average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time %</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.averageOnTime}%</div>
            <p className="text-xs text-muted-foreground">Punctuality</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complaints</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.totalComplaints}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>View detailed performance data for each driver</CardDescription>
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
          {/* Search */}
          <div>
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
                  <th className="px-4 py-3 text-left">Rating</th>
                  <th className="px-4 py-3 text-left">Safety</th>
                  <th className="px-4 py-3 text-left">On-Time</th>
                  <th className="px-4 py-3 text-left">Trips</th>
                  <th className="px-4 py-3 text-left">Completion</th>
                  <th className="px-4 py-3 text-left">Complaints</th>
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
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium">{record.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getPerformanceBadge(record.safetyScore)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-blue-500"
                            style={{ width: `${record.onTimePercentage}%` }}
                          />
                        </div>
                        <span className="text-xs">{record.onTimePercentage}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{record.totalTrips}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-green-500"
                            style={{ width: `${(record.completedTrips / record.totalTrips * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs">{Math.round(record.completedTrips / record.totalTrips * 100)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={record.customerComplaints === 0 ? 'secondary' : 'destructive'}>
                        {record.customerComplaints}
                      </Badge>
                    </td>
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
              <DialogTitle>Driver Performance Details</DialogTitle>
              <DialogDescription>{selectedRecord.driverName}</DialogDescription>
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
                <Label className="text-muted-foreground">Rating</Label>
                <p className="font-medium">{selectedRecord.rating}/5.0</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Safety Score</Label>
                <p className={`font-medium ${getPerformanceColor(selectedRecord.safetyScore)}`}>{selectedRecord.safetyScore}%</p>
              </div>
              <div>
                <Label className="text-muted-foreground">On-Time Percentage</Label>
                <p className="font-medium">{selectedRecord.onTimePercentage}%</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Reliability Score</Label>
                <p className={`font-medium ${getPerformanceColor(selectedRecord.reliabilityScore)}`}>{selectedRecord.reliabilityScore}%</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Total Trips</Label>
                <p className="font-medium">{selectedRecord.totalTrips}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Completed Trips</Label>
                <p className="font-medium">{selectedRecord.completedTrips}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Cancelled Trips</Label>
                <p className="font-medium">{selectedRecord.cancelledTrips}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Acceptance Rate</Label>
                <p className="font-medium">{selectedRecord.acceptanceRate}%</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Cancellation Rate</Label>
                <p className="font-medium">{selectedRecord.cancellationRate}%</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Customer Complaints</Label>
                <p className="font-medium">{selectedRecord.customerComplaints}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Total Earnings</Label>
                <p className="font-medium">฿{selectedRecord.totalEarnings.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Avg Earnings/Trip</Label>
                <p className="font-medium">฿{selectedRecord.averageEarningsPerTrip}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Avg Wait Time</Label>
                <p className="font-medium">{selectedRecord.averageWaitTime} min</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Avg Trip Duration</Label>
                <p className="font-medium">{selectedRecord.averageTripDuration} min</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Total Distance</Label>
                <p className="font-medium">{selectedRecord.totalDistance.toLocaleString()} km</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Fuel Consumption</Label>
                <p className="font-medium">{selectedRecord.fuelConsumption} km/L</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Vehicle Condition</Label>
                <p className="font-medium">{selectedRecord.vehicleCondition}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Communication Rating</Label>
                <p className="font-medium">{selectedRecord.communicationRating}/5.0</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
