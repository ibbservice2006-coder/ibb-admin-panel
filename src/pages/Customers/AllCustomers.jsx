import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import {
  Plus, Edit, Trash2, Eye, MapPin, Users, Zap, AlertTriangle,
  Users as UsersIcon, TrendingUp, TrendingDown, BarChart3, ArrowUpDown, ChevronLeft,
  ChevronRight, ChevronsLeft, ChevronsRight, RefreshCw, Download, Filter,
  Phone, Mail, Award, Calendar, DollarSign
} from 'lucide-react'

// Mock data generator for customers
const generateMockCustomers = () => {
  const statuses = ['active', 'inactive', 'suspended', 'vip']
  const membershipLevels = ['Standard', 'Premium', 'VIP', 'VVIP']

  return Array.from({ length: 25 }, (_, index) => ({
    id: index + 1,
    name: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Tom Brown', 'Lisa Anderson', 'David Lee', 'Emma Davis', 'Chris Martin', 'Sophie Taylor'][index % 10],
    email: `customer${index + 1}@email.com`,
    phone: `08${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    membershipLevel: membershipLevels[Math.floor(Math.random() * membershipLevels.length)],
    joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalTrips: Math.floor(Math.random() * 500) + 10,
    totalSpent: Math.floor(Math.random() * 500000) + 5000,
    averageRating: (Math.random() * 2 + 3.5).toFixed(1),
    lastTrip: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    walletBalance: Math.floor(Math.random() * 50000),
    referralCode: `REF${String(index + 1).padStart(6, '0')}`,
    referralCount: Math.floor(Math.random() * 10),
    preferredPayment: ['Credit Card', 'Wallet', 'Bank Transfer'][Math.floor(Math.random() * 3)],
    address: 'Bangkok, Thailand',
    city: 'Bangkok',
    country: 'Thailand',
    zipCode: '10110',
    emergencyContact: 'Emergency Contact Name',
    emergencyPhone: '08XXXXXXXX',
    verificationStatus: Math.random() > 0.2 ? 'Verified' : 'Pending',
    documentVerified: Math.random() > 0.3
  }))
}

const mockCustomers = generateMockCustomers()

const getStatusBadge = (status) => {
  const badges = {
    active: <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>,
    inactive: <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>,
    suspended: <Badge className="bg-red-100 text-red-800 border-red-200">Suspended</Badge>,
    vip: <Badge className="bg-purple-100 text-purple-800 border-purple-200">VIP</Badge>
  }
  return badges[status] || badges.active
}

const getMembershipBadge = (level) => {
  const colors = {
    'Standard': 'bg-blue-100 text-blue-800',
    'Premium': 'bg-yellow-100 text-yellow-800',
    'VIP': 'bg-purple-100 text-purple-800',
    'VVIP': 'bg-pink-100 text-pink-800'
  }
  return <Badge className={colors[level] || colors['Standard']}>{level}</Badge>
}

export default function AllCustomers() {
  const [customers, setCustomers] = useState(mockCustomers)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [membershipFilter, setMembershipFilter] = useState('all')
  const [selectedCustomers, setSelectedCustomers] = useState([])
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '', membershipLevel: 'Standard', status: 'active' })
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // Sorting
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')

  const { toast } = useToast()

  // Filter and search
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
    const matchesMembership = membershipFilter === 'all' || customer.membershipLevel === membershipFilter
    return matchesSearch && matchesStatus && matchesMembership
  })

  // Sort
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage)
  const paginatedCustomers = sortedCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Statistics
  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    vip: customers.filter(c => c.status === 'vip').length,
    totalSpent: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    averageSpent: Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length),
    totalTrips: customers.reduce((sum, c) => sum + c.totalTrips, 0)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast({ title: 'Refreshed', description: 'Customer data updated' })
  }

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer)
    setIsDetailsDialogOpen(true)
  }

  const handleEdit = (customer) => {
    setSelectedCustomer(customer)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (customer) => {
    setSelectedCustomer(customer)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    setCustomers(customers.filter(c => c.id !== selectedCustomer.id))
    setIsDeleteDialogOpen(false)
    toast({ title: 'Deleted', description: `Customer ${selectedCustomer.name} removed` })
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCustomers(paginatedCustomers.map(c => c.id))
    } else {
      setSelectedCustomers([])
    }
  }

  const handleSelectCustomer = (customerId, checked) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, customerId])
    } else {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Customers</h1>
        <p className="text-muted-foreground mt-2">Manage and monitor your customer base</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP Members</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.vip}</div>
            <p className="text-xs text-muted-foreground">Premium members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">฿{(stats.totalSpent / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.totalTrips.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customer List</CardTitle>
              <CardDescription>View and manage all customers</CardDescription>
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
                Add Customer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, email, or phone..."
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
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
            <Select value={membershipFilter} onValueChange={(value) => {
              setMembershipFilter(value)
              setCurrentPage(1)
            }}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filter by membership" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
                <SelectItem value="VVIP">VVIP</SelectItem>
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
                      checked={selectedCustomers.length === paginatedCustomers.length && paginatedCustomers.length > 0}
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
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Membership</th>
                  <th className="px-4 py-3 text-left">Trips</th>
                  <th className="px-4 py-3 text-left">Total Spent</th>
                  <th className="px-4 py-3 text-left">Join Date</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedCustomers.includes(customer.id)}
                        onCheckedChange={(checked) => handleSelectCustomer(customer.id, checked)}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{customer.name}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(customer.status)}</td>
                    <td className="px-4 py-3">{getMembershipBadge(customer.membershipLevel)}</td>
                    <td className="px-4 py-3 text-sm font-medium">{customer.totalTrips}</td>
                    <td className="px-4 py-3 font-medium">฿{customer.totalSpent.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">{customer.joinDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(customer)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(customer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(customer)}
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
              Showing {paginatedCustomers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, sortedCustomers.length)} of {sortedCustomers.length} customers
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
      {selectedCustomer && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
              <DialogDescription>{selectedCustomer.name}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p className="font-medium">{selectedCustomer.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <p className="font-medium">{getStatusBadge(selectedCustomer.status)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{selectedCustomer.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Phone</Label>
                <p className="font-medium">{selectedCustomer.phone}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Membership Level</Label>
                <p className="font-medium">{getMembershipBadge(selectedCustomer.membershipLevel)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Join Date</Label>
                <p className="font-medium">{selectedCustomer.joinDate}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Total Trips</Label>
                <p className="font-medium">{selectedCustomer.totalTrips}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Total Spent</Label>
                <p className="font-medium">฿{selectedCustomer.totalSpent.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Last Trip</Label>
                <p className="font-medium">{selectedCustomer.lastTrip}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Wallet Balance</Label>
                <p className="font-medium">฿{selectedCustomer.walletBalance.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Referral Code</Label>
                <p className="font-medium">{selectedCustomer.referralCode}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Referral Count</Label>
                <p className="font-medium">{selectedCustomer.referralCount}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Preferred Payment</Label>
                <p className="font-medium">{selectedCustomer.preferredPayment}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Verification Status</Label>
                <p className="font-medium">{selectedCustomer.verificationStatus}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Address</Label>
                <p className="font-medium">{selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.zipCode}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Customer Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>Add Customer Data to IBB Shuttle</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5">
              <Label>Full name <span className="text-red-500">*</span></Label>
              <Input placeholder="Somchai Jaidee" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label>Phone Number <span className="text-red-500">*</span></Label>
              <Input placeholder="+66-81-234-5678" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Email</Label>
              <Input placeholder="customer@email.com" type="email" value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label>Membership Level</Label>
              <Select value={newCustomer.membershipLevel} onValueChange={v => setNewCustomer({...newCustomer, membershipLevel: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="VVIP">VVIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={newCustomer.status} onValueChange={v => setNewCustomer({...newCustomer, status: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
              if (!newCustomer.name || !newCustomer.phone) { toast({ title: 'Please enter name and phone number', variant: 'destructive' }); return }
              setCustomers([{ id: Date.now(), name: newCustomer.name, phone: newCustomer.phone, email: newCustomer.email, membershipLevel: newCustomer.membershipLevel, status: newCustomer.status, joinDate: new Date().toISOString().split('T')[0], totalTrips: 0, totalSpent: 0, averageRating: '0.0', lastTrip: '-', walletBalance: 0, referralCode: `REF${Date.now()}`, referralCount: 0, preferredPayment: 'Cash', address: 'Bangkok, Thailand', city: 'Bangkok', country: 'Thailand', zipCode: '10110', emergencyContact: '-', emergencyPhone: '-', verificationStatus: 'Pending', documentVerified: false }, ...customers])
              setIsAddOpen(false)
              setNewCustomer({ name: '', phone: '', email: '', membershipLevel: 'Standard', status: 'active' })
              toast({ title: 'Customer Added!', description: `${newCustomer.name} added to system successfully` })
            }}>Add Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      {selectedCustomer && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Customer</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedCustomer.name}? This action cannot be undone.
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
