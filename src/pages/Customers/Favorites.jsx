import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import {
  Star, Search, RefreshCw, Trash2, Eye, MapPin, Users,
  TrendingUp, Heart, ChevronLeft, ChevronRight, Car, Navigation
} from 'lucide-react'

const vehicleTypes = ['Car', 'Van', 'Bus']

const generateMockFavorites = () => {
  const customers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Tom Brown', 'Lisa Anderson', 'David Lee', 'Emma Davis', 'Chris Martin', 'Sophie Taylor']
  const routes = [
    { from: 'Suvarnabhumi Airport', to: 'Sukhumvit Soi 11', zone: 'Airport Transfer' },
    { from: 'Don Mueang Airport', to: 'Silom Road', zone: 'Airport Transfer' },
    { from: 'Bangkok', to: 'Pattaya', zone: 'The East of Thailand' },
    { from: 'Bangkok', to: 'Chiang Mai', zone: 'The North of Thailand' },
    { from: 'Bangkok', to: 'Phuket', zone: 'The South of Thailand' },
    { from: 'Bangkok', to: 'Hua Hin', zone: 'The West of Thailand' },
    { from: 'Bangkok', to: 'Khon Kaen', zone: 'The Northeast of Thailand' },
    { from: 'Bangkok', to: 'Kanchanaburi', zone: 'The West of Thailand' },
    { from: 'Suvarnabhumi Airport', to: 'Pattaya', zone: 'The East of Thailand' },
    { from: 'Bangkok', to: 'Koh Chang', zone: 'The East of Thailand' },
  ]
  const vehicles = ['Car', 'Van', 'Bus']

  return Array.from({ length: 28 }, (_, i) => {
    const route = routes[i % routes.length]
    return {
      id: i + 1,
      customerId: `CUST-${String((i % 10) + 1).padStart(3, '0')}`,
      customerName: customers[i % customers.length],
      fromLocation: route.from,
      toLocation: route.to,
      zone: route.zone,
      vehicleType: vehicles[i % vehicles.length],
      savedDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usageCount: Math.floor(Math.random() * 30) + 1,
      lastBooked: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estimatedPrice: Math.floor(Math.random() * 8000) + 800,
      nickname: i % 3 === 0 ? 'Work Route' : i % 3 === 1 ? 'Weekend Trip' : '',
    }
  })
}

const mockFavorites = generateMockFavorites()

const getVehicleBadge = (type) => {
  const colors = {
    Car: 'bg-blue-100 text-blue-800 border-blue-200',
    Van: 'bg-purple-100 text-purple-800 border-purple-200',
    Bus: 'bg-green-100 text-green-800 border-green-200',
  }
  return <Badge className={`text-xs ${colors[type] || colors.Car}`}>{type}</Badge>
}

const getZoneBadge = (zone) => {
  const colors = {
    'Airport Transfer': 'bg-cyan-100 text-cyan-800',
    'The East of Thailand': 'bg-orange-100 text-orange-800',
    'The North of Thailand': 'bg-indigo-100 text-indigo-800',
    'The South of Thailand': 'bg-teal-100 text-teal-800',
    'The West of Thailand': 'bg-yellow-100 text-yellow-800',
    'The Northeast of Thailand': 'bg-rose-100 text-rose-800',
    'Central Region': 'bg-gray-100 text-gray-800',
  }
  return <Badge className={`text-xs ${colors[zone] || 'bg-gray-100 text-gray-800'}`}>{zone}</Badge>
}

export default function Favorites() {
  const [favorites, setFavorites] = useState(mockFavorites)
  const [searchTerm, setSearchTerm] = useState('')
  const [vehicleFilter, setVehicleFilter] = useState('all')
  const [zoneFilter, setZoneFilter] = useState('all')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedFav, setSelectedFav] = useState(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { toast } = useToast()

  const zones = [...new Set(favorites.map(f => f.zone))].sort()

  const filtered = favorites.filter(f => {
    const matchSearch =
      f.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.toLocation.toLowerCase().includes(searchTerm.toLowerCase())
    const matchVehicle = vehicleFilter === 'all' || f.vehicleType === vehicleFilter
    const matchZone = zoneFilter === 'all' || f.zone === zoneFilter
    return matchSearch && matchVehicle && matchZone
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const stats = {
    total: favorites.length,
    uniqueCustomers: new Set(favorites.map(f => f.customerId)).size,
    uniqueRoutes: new Set(favorites.map(f => `${f.fromLocation}-${f.toLocation}`)).size,
    totalBookings: favorites.reduce((s, f) => s + f.usageCount, 0),
    topRoute: (() => {
      const counts = {}
      favorites.forEach(f => {
        const key = `${f.fromLocation} → ${f.toLocation}`
        counts[key] = (counts[key] || 0) + f.usageCount
      })
      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'
    })(),
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(r => setTimeout(r, 800))
    setIsRefreshing(false)
    toast({ title: 'Refreshed', description: 'Favorites data updated' })
  }

  const handleView = (fav) => { setSelectedFav(fav); setIsViewOpen(true) }
  const handleDelete = (fav) => { setSelectedFav(fav); setIsDeleteOpen(true) }

  const handleConfirmDelete = () => {
    setFavorites(favorites.filter(f => f.id !== selectedFav.id))
    setIsDeleteOpen(false)
    toast({ title: 'Removed', description: 'Favorite route removed', variant: 'destructive' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Favorite Routes</h1>
        <p className="text-muted-foreground mt-2">Customer saved favorite routes and frequent destinations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Favorites</CardTitle>
            <Heart className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Saved routes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueCustomers}</div>
            <p className="text-xs text-muted-foreground">With saved routes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Routes</CardTitle>
            <Navigation className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.uniqueRoutes}</div>
            <p className="text-xs text-muted-foreground">Distinct paths</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">From favorites</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Route Banner */}
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Most Popular Favorite Route</p>
              <p className="text-base font-bold text-yellow-900 dark:text-yellow-100">{stats.topRoute}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Favorites List</CardTitle>
              <CardDescription>All customer saved favorite routes</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <div className="flex flex-col md:flex-row gap-3 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer or location..."
                className="pl-9"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1) }}
              />
            </div>
            <Select value={vehicleFilter} onValueChange={v => { setVehicleFilter(v); setCurrentPage(1) }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Vehicles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                {vehicleTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={zoneFilter} onValueChange={v => { setZoneFilter(v); setCurrentPage(1) }}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Zones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                {zones.map(z => <SelectItem key={z} value={z}>{z}</SelectItem>)}
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
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Route</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Zone</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Vehicle</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Est. Price</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Used</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Last Booked</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(fav => (
                  <tr key={fav.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center text-xs font-semibold text-rose-600">
                          {fav.customerName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium">{fav.customerName}</p>
                          <p className="text-xs text-muted-foreground">{fav.customerId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-1">
                        <MapPin className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">From: {fav.fromLocation}</p>
                          <p className="text-xs font-medium">To: {fav.toLocation}</p>
                          {fav.nickname && <p className="text-xs text-primary mt-0.5">"{fav.nickname}"</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getZoneBadge(fav.zone)}</td>
                    <td className="py-3 px-4">{getVehicleBadge(fav.vehicleType)}</td>
                    <td className="py-3 px-4 font-medium">฿{fav.estimatedPrice.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="font-medium">{fav.usageCount}</span>
                      <span className="text-xs text-muted-foreground ml-1">times</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{fav.lastBooked}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleView(fav)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(fav)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr><td colSpan={8} className="py-12 text-center text-muted-foreground">No favorites found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filtered.length)} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} favorites
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
            <DialogTitle>Favorite Route Details</DialogTitle>
            <DialogDescription>Full route information</DialogDescription>
          </DialogHeader>
          {selectedFav && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center font-semibold text-rose-600">
                  {selectedFav.customerName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold">{selectedFav.customerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedFav.customerId}</p>
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-muted-foreground">From:</span>
                  <span className="font-medium">{selectedFav.fromLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-muted-foreground">To:</span>
                  <span className="font-medium">{selectedFav.toLocation}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-muted-foreground">Zone</p><p className="font-medium">{selectedFav.zone}</p></div>
                <div><p className="text-muted-foreground">Vehicle</p>{getVehicleBadge(selectedFav.vehicleType)}</div>
                <div><p className="text-muted-foreground">Est. Price</p><p className="font-medium">฿{selectedFav.estimatedPrice.toLocaleString()}</p></div>
                <div><p className="text-muted-foreground">Times Used</p><p className="font-medium">{selectedFav.usageCount} times</p></div>
                <div><p className="text-muted-foreground">Saved Date</p><p className="font-medium">{selectedFav.savedDate}</p></div>
                <div><p className="text-muted-foreground">Last Booked</p><p className="font-medium">{selectedFav.lastBooked}</p></div>
                {selectedFav.nickname && <div className="col-span-2"><p className="text-muted-foreground">Nickname</p><p className="font-medium">"{selectedFav.nickname}"</p></div>}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove Favorite</DialogTitle>
            <DialogDescription>
              Remove the route <span className="font-semibold">"{selectedFav?.fromLocation} → {selectedFav?.toLocation}"</span> from {selectedFav?.customerName}'s favorites? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button size="sm" variant="destructive" onClick={handleConfirmDelete}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
