import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import {
  MapPin, Plus, Edit, Trash2, Eye, Search, RefreshCw,
  Home, Building2, Plane, Star, Users, ChevronLeft, ChevronRight
} from 'lucide-react'

const addressTypes = ['Home', 'Office', 'Airport', 'Hotel', 'Other']

const generateMockAddresses = () => {
  const customers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Tom Brown', 'Lisa Anderson', 'David Lee', 'Emma Davis', 'Chris Martin', 'Sophie Taylor']
  const types = ['Home', 'Office', 'Airport', 'Hotel', 'Other']
  const areas = [
    { label: 'Suvarnabhumi Airport', district: 'Bang Phli', province: 'Samut Prakan', zip: '10540' },
    { label: 'Don Mueang Airport', district: 'Don Mueang', province: 'Bangkok', zip: '10210' },
    { label: 'Sukhumvit Soi 11', district: 'Watthana', province: 'Bangkok', zip: '10110' },
    { label: 'Silom Road', district: 'Bang Rak', province: 'Bangkok', zip: '10500' },
    { label: 'Chatuchak Market', district: 'Chatuchak', province: 'Bangkok', zip: '10900' },
    { label: 'Pattaya Beach Road', district: 'Bang Lamung', province: 'Chonburi', zip: '20150' },
    { label: 'Nimman Road', district: 'Suthep', province: 'Chiang Mai', zip: '50200' },
    { label: 'Patong Beach', district: 'Kathu', province: 'Phuket', zip: '83150' },
    { label: 'Hua Hin Market', district: 'Hua Hin', province: 'Prachuap Khiri Khan', zip: '77110' },
    { label: 'Khao San Road', district: 'Phra Nakhon', province: 'Bangkok', zip: '10200' },
  ]

  return Array.from({ length: 32 }, (_, i) => {
    const area = areas[i % areas.length]
    return {
      id: i + 1,
      customerId: `CUST-${String((i % 10) + 1).padStart(3, '0')}`,
      customerName: customers[i % customers.length],
      label: area.label,
      type: types[i % types.length],
      fullAddress: `${Math.floor(Math.random() * 999) + 1} ${area.label}`,
      district: area.district,
      province: area.province,
      zipCode: area.zip,
      country: 'Thailand',
      isDefault: i % 5 === 0,
      usageCount: Math.floor(Math.random() * 50) + 1,
      lastUsed: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: i % 3 === 0 ? 'Near BTS station' : i % 3 === 1 ? 'Gate 3, Terminal 2' : '',
    }
  })
}

const mockAddresses = generateMockAddresses()

const getTypeIcon = (type) => {
  const icons = {
    Home: <Home className="h-4 w-4 text-blue-500" />,
    Office: <Building2 className="h-4 w-4 text-orange-500" />,
    Airport: <Plane className="h-4 w-4 text-cyan-500" />,
    Hotel: <Star className="h-4 w-4 text-yellow-500" />,
    Other: <MapPin className="h-4 w-4 text-gray-500" />,
  }
  return icons[type] || icons.Other
}

const getTypeBadge = (type) => {
  const colors = {
    Home: 'bg-blue-100 text-blue-800 border-blue-200',
    Office: 'bg-orange-100 text-orange-800 border-orange-200',
    Airport: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    Hotel: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Other: 'bg-gray-100 text-gray-800 border-gray-200',
  }
  return <Badge className={`text-xs ${colors[type] || colors.Other}`}>{type}</Badge>
}

export default function Addresses() {
  const [addresses, setAddresses] = useState(mockAddresses)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [provinceFilter, setProvinceFilter] = useState('all')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [open, setOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    customerName: '', label: '', type: 'Home',
    fullAddress: '', district: '', province: '', zipCode: '', notes: ''
  })

  const { toast } = useToast()

  const provinces = [...new Set(addresses.map(a => a.province))].sort()

  const filtered = addresses.filter(a => {
    const matchSearch = a.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.province.toLowerCase().includes(searchTerm.toLowerCase())
    const matchType = typeFilter === 'all' || a.type === typeFilter
    const matchProvince = provinceFilter === 'all' || a.province === provinceFilter
    return matchSearch && matchType && matchProvince
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const stats = {
    total: addresses.length,
    home: addresses.filter(a => a.type === 'Home').length,
    office: addresses.filter(a => a.type === 'Office').length,
    airport: addresses.filter(a => a.type === 'Airport').length,
    defaults: addresses.filter(a => a.isDefault).length,
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(r => setTimeout(r, 800))
    setIsRefreshing(false)
    toast({ title: 'Refreshed', description: 'Address data updated' })
  }

  const handleView = (addr) => { setSelectedAddress(addr); setIsViewOpen(true) }

  const handleEdit = (addr) => {
    setSelectedAddress(addr)
    setEditForm({ ...addr })
    setIsEditOpen(true)
  }

  const handleDelete = (addr) => { setSelectedAddress(addr); setIsDeleteOpen(true) }

  const handleConfirmDelete = () => {
    setAddresses(addresses.filter(a => a.id !== selectedAddress.id))
    setIsDeleteOpen(false)
    toast({ title: 'Deleted', description: `Address removed successfully`, variant: 'destructive' })
  }

  const handleSaveEdit = () => {
    setAddresses(addresses.map(a => a.id === selectedAddress.id ? { ...a, ...editForm } : a))
    setIsEditOpen(false)
    toast({ title: 'Updated', description: 'Address updated successfully' })
  }

  const handleAddNew = () => {
    const newAddr = {
      id: addresses.length + 1,
      customerId: 'CUST-001',
      ...editForm,
      isDefault: false,
      usageCount: 0,
      lastUsed: new Date().toISOString().split('T')[0],
      country: 'Thailand',
    }
    setAddresses([newAddr, ...addresses])
    setIsAddOpen(false)
    setEditForm({ customerName: '', label: '', type: 'Home', fullAddress: '', district: '', province: '', zipCode: '', notes: '' })
    toast({ title: 'Added', description: 'New address added successfully' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Saved Addresses</h1>
        <p className="text-muted-foreground mt-2">Manage customer saved pickup and drop-off locations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Addresses</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All saved locations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Home</CardTitle>
            <Home className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.home}</div>
            <p className="text-xs text-muted-foreground">Residential</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Office</CardTitle>
            <Building2 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.office}</div>
            <p className="text-xs text-muted-foreground">Workplace</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Airport</CardTitle>
            <Plane className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">{stats.airport}</div>
            <p className="text-xs text-muted-foreground">Airport transfers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Default</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.defaults}</div>
            <p className="text-xs text-muted-foreground">Default addresses</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Address List</CardTitle>
              <CardDescription>All saved customer addresses</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setEditForm({ customerName: '', label: '', type: 'Home', fullAddress: '', district: '', province: '', zipCode: '', notes: '' }); setIsAddOpen(true) }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer, label, or province..."
                className="pl-9"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1) }}
              />
            </div>
            <Select value={typeFilter} onValueChange={v => { setTypeFilter(v); setCurrentPage(1) }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {addressTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={provinceFilter} onValueChange={v => { setProvinceFilter(v); setCurrentPage(1) }}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Provinces" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Provinces</SelectItem>
                {provinces.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Label / Address</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Province</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Usage</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Last Used</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Default</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(addr => (
                  <tr key={addr.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                          {addr.customerName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium">{addr.customerName}</p>
                          <p className="text-xs text-muted-foreground">{addr.customerId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-2">
                        {getTypeIcon(addr.type)}
                        <div>
                          <p className="font-medium">{addr.label}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[180px]">{addr.fullAddress}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getTypeBadge(addr.type)}</td>
                    <td className="py-3 px-4">
                      <p className="text-sm">{addr.province}</p>
                      <p className="text-xs text-muted-foreground">{addr.zipCode}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium">{addr.usageCount}</span>
                      <span className="text-xs text-muted-foreground ml-1">trips</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{addr.lastUsed}</td>
                    <td className="py-3 px-4">
                      {addr.isDefault
                        ? <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">Default</Badge>
                        : <span className="text-xs text-muted-foreground">—</span>}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleView(addr)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(addr)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(addr)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr><td colSpan={8} className="py-12 text-center text-muted-foreground">No addresses found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filtered.length)} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} addresses
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" /><ChevronLeft className="h-4 w-4 -ml-2" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm px-2">Page {currentPage} of {totalPages}</span>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                <ChevronRight className="h-4 w-4" /><ChevronRight className="h-4 w-4 -ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Address Details</DialogTitle>
            <DialogDescription>Full address information</DialogDescription>
          </DialogHeader>
          {selectedAddress && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                  {selectedAddress.customerName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold">{selectedAddress.customerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedAddress.customerId}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-muted-foreground">Label</p><p className="font-medium">{selectedAddress.label}</p></div>
                <div><p className="text-muted-foreground">Type</p>{getTypeBadge(selectedAddress.type)}</div>
                <div className="col-span-2"><p className="text-muted-foreground">Full Address</p><p className="font-medium">{selectedAddress.fullAddress}</p></div>
                <div><p className="text-muted-foreground">District</p><p className="font-medium">{selectedAddress.district}</p></div>
                <div><p className="text-muted-foreground">Province</p><p className="font-medium">{selectedAddress.province}</p></div>
                <div><p className="text-muted-foreground">Zip Code</p><p className="font-medium">{selectedAddress.zipCode}</p></div>
                <div><p className="text-muted-foreground">Country</p><p className="font-medium">{selectedAddress.country}</p></div>
                <div><p className="text-muted-foreground">Usage Count</p><p className="font-medium">{selectedAddress.usageCount} trips</p></div>
                <div><p className="text-muted-foreground">Last Used</p><p className="font-medium">{selectedAddress.lastUsed}</p></div>
                {selectedAddress.notes && <div className="col-span-2"><p className="text-muted-foreground">Notes</p><p className="font-medium">{selectedAddress.notes}</p></div>}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit / Add Dialog */}
      {[{ open: isEditOpen, setOpen: setIsEditOpen, title: 'Edit Address', onSave: handleSaveEdit },
        { open: isAddOpen, setOpen: setIsAddOpen, title: 'Add New Address', onSave: handleAddNew }
      ].map(({ open, setOpen, title, onSave }) => (
        <Dialog key={title} open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>Fill in the address details below</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1">
                  <Label>Customer Name</Label>
                  <Input value={editForm.customerName} onChange={e => setEditForm({ ...editForm, customerName: e.target.value })} placeholder="Customer name" />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label>Address Label</Label>
                  <Input value={editForm.label} onChange={e => setEditForm({ ...editForm, label: e.target.value })} placeholder="e.g. Home, Office" />
                </div>
                <div className="space-y-1">
                  <Label>Type</Label>
                  <Select value={editForm.type} onValueChange={v => setEditForm({ ...editForm, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{addressTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Zip Code</Label>
                  <Input value={editForm.zipCode} onChange={e => setEditForm({ ...editForm, zipCode: e.target.value })} placeholder="10110" />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label>Full Address</Label>
                  <Input value={editForm.fullAddress} onChange={e => setEditForm({ ...editForm, fullAddress: e.target.value })} placeholder="Street address" />
                </div>
                <div className="space-y-1">
                  <Label>District</Label>
                  <Input value={editForm.district} onChange={e => setEditForm({ ...editForm, district: e.target.value })} placeholder="District" />
                </div>
                <div className="space-y-1">
                  <Label>Province</Label>
                  <Input value={editForm.province} onChange={e => setEditForm({ ...editForm, province: e.target.value })} placeholder="Province" />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label>Notes (Optional)</Label>
                  <Input value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} placeholder="Additional notes" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={onSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Address</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the address <span className="font-semibold">"{selectedAddress?.label}"</span> for {selectedAddress?.customerName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button size="sm" variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
