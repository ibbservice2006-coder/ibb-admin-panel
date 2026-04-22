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
  Users,
  MapPin,
  Phone,
  Mail,
  Eye,
  Edit,
  Trash2,
  Star,
  Calendar,
  CreditCard
} from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

// Mock customer profiles data
const customersData = [
  {
    id: 'CUST-001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+66-8-1234-5678',
    joinDate: '2023-06-15',
    totalTrips: 45,
    totalSpent: 8500,
    membershipLevel: 'Premium',
    status: 'active',
    rating: 4.8,
    lastTrip: '2024-03-22'
  },
  {
    id: 'CUST-002',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+66-8-2345-6789',
    joinDate: '2023-08-20',
    totalTrips: 32,
    totalSpent: 6200,
    membershipLevel: 'Standard',
    status: 'active',
    rating: 4.5,
    lastTrip: '2024-03-21'
  },
  {
    id: 'CUST-003',
    name: 'Mike Chen',
    email: 'mike@example.com',
    phone: '+66-8-3456-7890',
    joinDate: '2023-10-10',
    totalTrips: 28,
    totalSpent: 5100,
    membershipLevel: 'Standard',
    status: 'active',
    rating: 4.2,
    lastTrip: '2024-03-20'
  },
  {
    id: 'CUST-004',
    name: 'Anna Smith',
    email: 'anna@example.com',
    phone: '+66-8-4567-8901',
    joinDate: '2023-12-05',
    totalTrips: 15,
    totalSpent: 2800,
    membershipLevel: 'Standard',
    status: 'inactive',
    rating: 4.0,
    lastTrip: '2024-02-28'
  },
  {
    id: 'CUST-005',
    name: 'Peter Park',
    email: 'peter@example.com',
    phone: '+66-8-5678-9012',
    joinDate: '2024-01-15',
    totalTrips: 8,
    totalSpent: 1500,
    membershipLevel: 'VIP',
    status: 'active',
    rating: 4.9,
    lastTrip: '2024-03-22'
  }
]

const membershipColors = {
  'Standard': 'bg-slate-100 text-slate-800',
  'Premium': 'bg-blue-100 text-blue-800',
  'VIP': 'bg-purple-100 text-purple-800',
  'VVIP': 'bg-yellow-100 text-yellow-800'
}

export default function CustomerProfiles() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [customers, setCustomers] = useState(customersData)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)

  const filteredCustomers = customers.filter(customer =>
    customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast({ title: 'Data Refreshed', description: 'Customer profiles have been updated.' })
  }

  // Statistics
  const activeCustomers = customers.filter(c => c.status === 'active').length
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)
  const avgSpent = Math.round(totalRevenue / customers.length)

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Profiles</h1>
          <p className="text-muted-foreground mt-1">Detailed customer information and profiles</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setShowExportDialog(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                <h3 className="text-2xl font-bold mt-1">{customers.length}</h3>
              </div>
              <div className="p-2 rounded-lg bg-slate-50">
                <Users className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <h3 className="text-2xl font-bold mt-1 text-green-600">{activeCustomers}</h3>
              </div>
              <div className="p-2 rounded-lg bg-green-50">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1 text-orange-600">฿{totalRevenue.toLocaleString()}</h3>
              </div>
              <div className="p-2 rounded-lg bg-orange-50">
                <CreditCard className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Spent</p>
                <h3 className="text-2xl font-bold mt-1 text-blue-600">฿{avgSpent.toLocaleString()}</h3>
              </div>
              <div className="p-2 rounded-lg bg-blue-50">
                <CreditCard className="h-5 w-5 text-blue-600" />
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
                placeholder="Search by ID, name or email..."
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

      {/* Customer List */}
      <div className="space-y-3">
        {filteredCustomers.map(customer => (
          <Card key={customer.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-sm">{customer.id}</h3>
                    <Badge className={membershipColors[customer.membershipLevel]}>
                      {customer.membershipLevel}
                    </Badge>
                    <Badge className={customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}>
                      {customer.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{customer.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(customer.rating)}
                    <span className="text-xs font-medium ml-1">{customer.rating}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="text-sm font-medium">{customer.joinDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-slate-200">
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" /> Email
                  </p>
                  <p className="text-xs font-medium mt-1 truncate">{customer.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" /> Phone
                  </p>
                  <p className="text-xs font-medium mt-1">{customer.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Trips</p>
                  <p className="text-sm font-bold mt-1">{customer.totalTrips}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                  <p className="text-sm font-bold mt-1 text-orange-600">฿{customer.totalSpent.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Last Trip: {customer.lastTrip}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => { setSelectedCustomer(customer); setShowDetailDialog(true) }}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => toast({ title: 'Updated', description: 'Data updated successfully' })}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 border-red-200" onClick={() => toast({ title: 'Deleted', description: 'Data deleted successfully', variant: 'destructive' })}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Customer Profile</DialogTitle><DialogDescription>{selectedCustomer?.name}</DialogDescription></DialogHeader>
          {selectedCustomer && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-muted-foreground">Name</p><p className="font-bold">{selectedCustomer.name}</p></div>
              <div><p className="text-muted-foreground">Email</p><p className="font-medium">{selectedCustomer.email || 'N/A'}</p></div>
              <div><p className="text-muted-foreground">Phone</p><p className="font-medium">{selectedCustomer.phone || 'N/A'}</p></div>
              <div><p className="text-muted-foreground">Member Since</p><p className="font-medium">{selectedCustomer.joinDate || 'N/A'}</p></div>
              <div><p className="text-muted-foreground">Total Trips</p><p className="font-medium">{selectedCustomer.totalTrips || 0}</p></div>
              <div><p className="text-muted-foreground">Total Spent</p><p className="font-medium text-green-600">{selectedCustomer.totalSpent || '฿0'}</p></div>
              <div><p className="text-muted-foreground">Status</p><p className="font-medium capitalize">{selectedCustomer.status || 'Active'}</p></div>
              <div><p className="text-muted-foreground">Tier</p><p className="font-medium">{selectedCustomer.tier || 'Standard'}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setShowDetailDialog(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Export Customer Profiles</DialogTitle><DialogDescription>Choose export format</DialogDescription></DialogHeader>
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