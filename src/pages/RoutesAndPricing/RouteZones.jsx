import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import {
  MapPin, Plus, Edit, Trash2, Eye, RefreshCw, Search,
  ChevronLeft, ChevronRight, Map, Route, TrendingUp
} from 'lucide-react'

// Actual route data from PricingUpdate
const mockZones = [
  {
    id: 1,
    zoneName: 'Airport Transfer',
    zoneCode: 'AIRPORT',
    description: 'Routes to/from major airports in Thailand',
    color: '#06b6d4',
    status: 'active',
    coverageArea: 'Bangkok Metropolitan + Rayong',
    createdDate: '2023-01-15',
    lastUpdated: '2024-03-10',
    routes: [
      { distance: '26 km', destination: 'Bangkok - Don Mueang Airport' },
      { distance: '32 km', destination: 'Bangkok - Suvarnabhumi Airport' },
      { distance: '178 km', destination: 'Bangkok - Utapao Airport' },
    ],
  },
  {
    id: 2,
    zoneName: 'Central Region',
    zoneCode: 'CENTRAL',
    description: 'Routes within Central Thailand including Bangkok suburbs',
    color: '#8b5cf6',
    status: 'active',
    coverageArea: 'Central Thailand',
    createdDate: '2023-01-15',
    lastUpdated: '2024-03-08',
    routes: [
      { distance: '35 km', destination: 'Bangkok - Nonthaburi' },
      { distance: '45 km', destination: 'Bangkok - Pathum Thani' },
      { distance: '51 km', destination: 'Bangkok - Samut Prakan' },
      { distance: '59 km', destination: 'Bangkok - Samut Sakhon' },
      { distance: '69 km', destination: 'Bangkok - Nakhon Pathom' },
      { distance: '78 km', destination: 'Bangkok - Chachoengsao' },
    ],
  },
  {
    id: 3,
    zoneName: 'The East of Thailand',
    zoneCode: 'EAST',
    description: 'Eastern seaboard destinations including Pattaya and Koh Chang',
    color: '#f97316',
    status: 'active',
    coverageArea: 'Eastern Thailand',
    createdDate: '2023-01-15',
    lastUpdated: '2024-03-12',
    routes: [
      { distance: '100 km', destination: 'Bangkok - Bangsean' },
      { distance: '150 km', destination: 'Bangkok - Chon Buri' },
      { distance: '150 km', destination: 'Bangkok - Pattaya' },
      { distance: '130 km', destination: 'Bangkok - Laem Chabang' },
      { distance: '200 km', destination: 'Bangkok - Sathahip' },
      { distance: '220 km', destination: 'Bangkok - Rayong' },
      { distance: '275 km', destination: 'Bangkok - Chanthaburi' },
      { distance: '300 km', destination: 'Bangkok - Aranyaprathet' },
      { distance: '300 km', destination: 'Bangkok - Sa Kaeo' },
      { distance: '400 km', destination: 'Bangkok - Trat' },
      { distance: '420 km', destination: 'Bangkok - Hat Lek' },
      { distance: '450 km', destination: 'Bangkok - Koh Chang' },
    ],
  },
  {
    id: 4,
    zoneName: 'The South of Thailand',
    zoneCode: 'SOUTH',
    description: 'Southern Thailand including Hua Hin, Phuket, Surat Thani and Krabi',
    color: '#10b981',
    status: 'active',
    coverageArea: 'Southern Thailand',
    createdDate: '2023-01-15',
    lastUpdated: '2024-03-11',
    routes: [
      { distance: '99 km', destination: 'Bangkok - Samut Songkhram' },
      { distance: '200 km', destination: 'Bangkok - Cha-Am' },
      { distance: '220 km', destination: 'Bangkok - Hua Hin' },
      { distance: '245 km', destination: 'Bangkok - Pranburi' },
      { distance: '300 km', destination: 'Bangkok - Kui Buri' },
      { distance: '265 km', destination: 'Bangkok - Sam Roi Yot' },
      { distance: '380 km', destination: 'Bangkok - Bang Saphan' },
      { distance: '500 km', destination: 'Bangkok - Chumphon' },
      { distance: '867 km', destination: 'Bangkok - Phuket' },
      { distance: '710 km', destination: 'Bangkok - Don Sak' },
      { distance: '644 km', destination: 'Bangkok - Surat Thani' },
      { distance: '946 km', destination: 'Bangkok - Krabi' },
    ],
  },
  {
    id: 5,
    zoneName: 'The West of Thailand',
    zoneCode: 'WEST',
    description: 'Western Thailand including Kanchanaburi and Sangkhla Buri',
    color: '#eab308',
    status: 'active',
    coverageArea: 'Western Thailand',
    createdDate: '2023-01-15',
    lastUpdated: '2024-03-05',
    routes: [
      { distance: '165 km', destination: 'Bangkok - Ratchaburi' },
      { distance: '130 km', destination: 'Bangkok - Kanchanaburi' },
      { distance: '235 km', destination: 'Bangkok - Sai Yok' },
      { distance: '380 km', destination: 'Bangkok - Sangkhla Buri' },
    ],
  },
  {
    id: 6,
    zoneName: 'The North of Thailand',
    zoneCode: 'NORTH',
    description: 'Northern Thailand including Chiang Mai and Chiang Rai',
    color: '#6366f1',
    status: 'active',
    coverageArea: 'Northern Thailand',
    createdDate: '2023-01-15',
    lastUpdated: '2024-03-09',
    routes: [
      { distance: '76 km', destination: 'Bangkok - Ayutthaya' },
      { distance: '260 km', destination: 'Bangkok - Nakhon Sawan' },
      { distance: '350 km', destination: 'Bangkok - Phetchabun' },
      { distance: '400 km', destination: 'Bangkok - Phitsanulok' },
      { distance: '500 km', destination: 'Bangkok - Sukhothai' },
      { distance: '519 km', destination: 'Bangkok - Mae Sot - Tak' },
      { distance: '695 km', destination: 'Bangkok - Chiang Mai' },
      { distance: '820 km', destination: 'Bangkok - Chiang Rai' },
    ],
  },
  {
    id: 7,
    zoneName: 'The Northeast of Thailand',
    zoneCode: 'NORTHEAST',
    description: 'Northeastern Thailand (Isan) including Khao Yai and Nakhon Ratchasima',
    color: '#ec4899',
    status: 'active',
    coverageArea: 'Northeastern Thailand',
    createdDate: '2023-01-15',
    lastUpdated: '2024-03-07',
    routes: [
      { distance: '107 km', destination: 'Bangkok - Saraburi' },
      { distance: '165 km', destination: 'Bangkok - Khao Yai' },
      { distance: '246 km', destination: 'Bangkok - Wang Nam Khiao' },
      { distance: '299 km', destination: 'Bangkok - Nakhon Ratchasima' },
    ],
  },
  {
    id: 8,
    zoneName: 'Hourly Package',
    zoneCode: 'HOURLY',
    description: 'Hourly private car rental with driver and fuel — 4, 6, 8, 10 hour packages',
    color: '#14b8a6',
    status: 'active',
    coverageArea: 'Nationwide',
    createdDate: '2023-01-15',
    lastUpdated: '2024-03-06',
    routes: [
      { distance: '4 Hrs', destination: '04 Hours: Private Car Rental with Driver & Fuel (Max 250 Km.)' },
      { distance: '6 Hrs', destination: '06 Hours: Private Car Rental with Driver & Fuel (Max 300 Km.)' },
      { distance: '8 Hrs', destination: '08 Hours: Private Car Rental with Driver & Fuel (Max 350 Km.)' },
      { distance: '10 Hrs', destination: '10 Hours: Private Car Rental with Driver & Fuel (Max 400 Km.)' },
    ],
  },
  {
    id: 9,
    zoneName: 'Period Package',
    zoneCode: 'PERIOD',
    description: 'Multi-day private car rental with driver and fuel — 1, 7, 15, 30 day packages',
    color: '#f43f5e',
    status: 'active',
    coverageArea: 'Nationwide',
    createdDate: '2023-01-15',
    lastUpdated: '2024-03-04',
    routes: [
      { distance: '1 Day', destination: '01 Day: Private Car Rental with Driver & Fuel (Max 350 Km./Day)' },
      { distance: '7 Days', destination: '07 Day: Private Car Rental with Driver & Fuel (Max 350 Km./Day)' },
      { distance: '15 Days', destination: '15 Day: Private Car Rental with Driver & Fuel (Max 350 Km./Day)' },
      { distance: '30 Days', destination: '30 Day: Private Car Rental with Driver & Fuel (Max 350 Km./Day)' },
    ],
  },
]

const getStatusBadge = (status) => {
  const map = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
  }
  return <Badge className={`text-xs ${map[status] || map.active}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
}

export default function RouteZones() {
  const [zones, setZones] = useState(mockZones)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedZone, setSelectedZone] = useState(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const [editForm, setEditForm] = useState({})
  const { toast } = useToast()

  const filtered = zones.filter(z => {
    const matchSearch =
      z.zoneName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      z.zoneCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      z.routes.some(r => r.destination.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchStatus = statusFilter === 'all' || z.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const stats = {
    total: zones.length,
    active: zones.filter(z => z.status === 'active').length,
    totalRoutes: zones.reduce((s, z) => s + z.routes.length, 0),
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(r => setTimeout(r, 800))
    setIsRefreshing(false)
    toast({ title: 'Refreshed', description: 'Zone data updated' })
  }

  const handleView = (zone) => { setSelectedZone(zone); setIsViewOpen(true) }
  const handleEdit = (zone) => { setSelectedZone(zone); setEditForm({ ...zone }); setIsEditOpen(true) }
  const handleDelete = (zone) => { setSelectedZone(zone); setIsDeleteOpen(true) }

  const handleSaveEdit = () => {
    setZones(zones.map(z => z.id === editForm.id ? { ...editForm } : z))
    setIsEditOpen(false)
    toast({ title: 'Zone Updated', description: `${editForm.zoneName} has been updated` })
  }

  const handleConfirmDelete = () => {
    setZones(zones.filter(z => z.id !== selectedZone.id))
    setIsDeleteOpen(false)
    toast({ title: 'Zone Deleted', description: `${selectedZone.zoneName} removed`, variant: 'destructive' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Route Zones</h1>
          <p className="text-muted-foreground mt-2">Manage geographic zones and coverage areas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setEditForm({}); setIsAddOpen(true) }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Zone
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Zones</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Coverage zones</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Zones</CardTitle>
            <MapPin className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
            <Route className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalRoutes}</div>
            <p className="text-xs text-muted-foreground">Across all zones</p>
          </CardContent>
        </Card>
      </div>

      {/* Zone Cards */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Zone List</CardTitle>
              <CardDescription>All geographic service zones with routes</CardDescription>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search zone, code or destination..."
                className="pl-9"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1) }}
              />
            </div>
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setCurrentPage(1) }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginated.map(zone => (
              <div key={zone.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: zone.color }} />
                    <div>
                      <p className="font-semibold text-sm">{zone.zoneName}</p>
                      <p className="text-xs text-muted-foreground font-mono">{zone.zoneCode}</p>
                    </div>
                  </div>
                  {getStatusBadge(zone.status)}
                </div>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{zone.description}</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="text-center p-2 bg-muted rounded">
                    <p className="text-xs text-muted-foreground">Routes</p>
                    <p className="font-bold text-sm">{zone.routes.length}</p>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <p className="text-xs text-muted-foreground">Coverage</p>
                    <p className="font-bold text-xs leading-tight">{zone.coverageArea}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-1">Destinations:</p>
                  <div className="flex flex-wrap gap-1">
                    {zone.routes.slice(0, 3).map((r, i) => (
                      <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded-full truncate max-w-[140px]" title={r.destination}>
                        {r.destination.replace('Bangkok - ', '')}
                      </span>
                    ))}
                    {zone.routes.length > 3 && (
                      <span className="text-xs text-muted-foreground px-1">+{zone.routes.length - 3} more</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 pt-2 border-t">
                  <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs" onClick={() => handleView(zone)}>
                    <Eye className="h-3 w-3 mr-1" /> View
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs" onClick={() => handleEdit(zone)}>
                    <Edit className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs text-destructive hover:text-destructive" onClick={() => handleDelete(zone)}>
                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
            {paginated.length === 0 && (
              <div className="col-span-3 py-12 text-center text-muted-foreground">No zones found</div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filtered.length)} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} zones
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm px-2">Page {currentPage} of {totalPages}</span>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedZone && <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: selectedZone?.color }} />}
              {selectedZone?.zoneName}
            </DialogTitle>
            <DialogDescription>Zone code: {selectedZone?.zoneCode}</DialogDescription>
          </DialogHeader>
          {selectedZone && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-muted-foreground">Status</p>{getStatusBadge(selectedZone.status)}</div>
                <div><p className="text-muted-foreground">Coverage Area</p><p className="font-medium">{selectedZone.coverageArea}</p></div>
                <div><p className="text-muted-foreground">Total Routes</p><p className="font-bold text-blue-600">{selectedZone.routes.length}</p></div>
                <div><p className="text-muted-foreground">Last Updated</p><p className="font-medium">{selectedZone.lastUpdated}</p></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-sm">{selectedZone.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">All Routes ({selectedZone.routes.length})</p>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {selectedZone.routes.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm py-1 border-b last:border-0">
                      <span className="text-xs text-muted-foreground w-16 flex-shrink-0">{r.distance}</span>
                      <span className="text-xs">{r.destination}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Zone</DialogTitle>
            <DialogDescription>Update zone information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Zone Name</Label>
              <Input value={editForm.zoneName || ''} onChange={e => setEditForm({ ...editForm, zoneName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Zone Code</Label>
              <Input value={editForm.zoneCode || ''} onChange={e => setEditForm({ ...editForm, zoneCode: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Coverage Area</Label>
              <Input value={editForm.coverageArea || ''} onChange={e => setEditForm({ ...editForm, coverageArea: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editForm.status || 'active'} onValueChange={v => setEditForm({ ...editForm, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Zone</DialogTitle>
            <DialogDescription>
              Delete zone <span className="font-semibold">"{selectedZone?.zoneName}"</span>? All routes in this zone will be affected. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button size="sm" variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Zone</DialogTitle>
            <DialogDescription>Create a new geographic service zone</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Zone Name</Label>
              <Input placeholder="e.g. The East of Thailand" value={editForm.zoneName || ''} onChange={e => setEditForm({ ...editForm, zoneName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Zone Code</Label>
              <Input placeholder="e.g. EAST" value={editForm.zoneCode || ''} onChange={e => setEditForm({ ...editForm, zoneCode: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Coverage Area</Label>
              <Input placeholder="e.g. Eastern Thailand" value={editForm.coverageArea || ''} onChange={e => setEditForm({ ...editForm, coverageArea: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Describe this zone..." rows={3} value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => { setIsAddOpen(false); setEditForm({}) }}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
              const newZone = {
                id: Date.now(),
                ...editForm,
                status: 'active',
                routes: [],
                color: '#6366f1',
                createdDate: new Date().toISOString().split('T')[0],
                lastUpdated: new Date().toISOString().split('T')[0],
              }
              setZones([...zones, newZone])
              setIsAddOpen(false)
              setEditForm({})
              toast({ title: 'Zone Added', description: `${newZone.zoneName} created successfully` })
            }}>Add Zone</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
