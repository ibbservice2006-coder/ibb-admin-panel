import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Store, Plus, Edit, Eye, Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const initialListings = [
  { id: 1, title: 'IBB Shuttle — Bangkok Airport Transfer', platform: 'Shopee', zone: 'SE Asia', status: 'active', price: 1200, currency: 'THB', views: 12400, orders: 543, rating: 4.8, reviews: 234, lastUpdated: '2 days ago' },
  { id: 2, title: 'IBB Shuttle — Phuket Private Transfer', platform: 'Lazada', zone: 'SE Asia', status: 'active', price: 2500, currency: 'THB', views: 8760, orders: 321, rating: 4.7, reviews: 156, lastUpdated: '3 days ago' },
  { id: 3, title: 'IBB Shuttle — Chiang Mai City Tour', platform: 'Klook', zone: 'SE Asia', status: 'active', price: 1800, currency: 'THB', views: 6540, orders: 234, rating: 4.9, reviews: 189, lastUpdated: '1 day ago' },
  { id: 4, title: 'IBB Shuttle — Bangkok Airport Transfer', platform: 'Amazon', zone: 'Global', status: 'active', price: 35, currency: 'USD', views: 9870, orders: 432, rating: 4.6, reviews: 312, lastUpdated: '5 days ago' },
  { id: 5, title: 'IBB Shuttle — Pattaya Day Trip', platform: 'GetYourGuide', zone: 'Global', status: 'active', price: 45, currency: 'USD', views: 5430, orders: 187, rating: 4.8, reviews: 143, lastUpdated: '4 days ago' },
  { id: 6, title: 'IBB Shuttle — Bangkok Luxury Transfer', platform: 'Booking.com', zone: 'Global', status: 'active', price: 65, currency: 'USD', views: 7650, orders: 298, rating: 4.7, reviews: 201, lastUpdated: '2 days ago' },
  { id: 7, title: 'IBB Shuttle — 曼谷机场接送', platform: 'Ctrip', zone: 'China', status: 'active', price: 250, currency: 'CNY', views: 18760, orders: 765, rating: 4.9, reviews: 543, lastUpdated: '1 day ago' },
  { id: 8, title: 'IBB Shuttle — 泰国私人包车', platform: 'Fliggy', zone: 'China', status: 'warning', price: 280, currency: 'CNY', views: 4320, orders: 123, rating: 4.5, reviews: 87, lastUpdated: '2 weeks ago' },
  { id: 9, title: 'IBB Shuttle — Dubai Airport Transfer', platform: 'Noon', zone: 'Middle East', status: 'active', price: 150, currency: 'AED', views: 4320, orders: 187, rating: 4.7, reviews: 98, lastUpdated: '3 days ago' },
  { id: 10, title: 'IBB Shuttle — Аэропорт Бангкок', platform: 'Ozon', zone: 'Russia', status: 'active', price: 3200, currency: 'RUB', views: 5430, orders: 234, rating: 4.6, reviews: 134, lastUpdated: '6 days ago' },
  { id: 11, title: 'IBB Shuttle — Koh Samui Transfer', platform: 'eBay', zone: 'Global', status: 'inactive', price: 40, currency: 'USD', views: 1230, orders: 23, rating: 4.3, reviews: 18, lastUpdated: '1 month ago' },
]

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-600', icon: XCircle },
  warning: { label: 'Needs Update', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
}

const zoneColors = {
  'SE Asia': 'bg-orange-100 text-orange-700',
  'Global': 'bg-blue-100 text-blue-700',
  'China': 'bg-red-100 text-red-700',
  'Middle East': 'bg-yellow-100 text-yellow-800',
  'Russia': 'bg-purple-100 text-purple-700',
}

const emptyForm = { title: '', platform: 'Shopee', zone: 'SE Asia', price: '', currency: 'THB', status: 'active' }

export default function PlatformStores() {
  const [listings, setListings] = useState(initialListings)
  const [search, setSearch] = useState('')
  const [filterZone, setFilterZone] = useState('All')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState(null)
  const [addForm, setAddForm] = useState(emptyForm)
  const [editForm, setEditForm] = useState(emptyForm)
  const { toast } = useToast()

  const zones = ['All', 'SE Asia', 'Global', 'China', 'Middle East', 'Russia']
  const filtered = listings.filter(l =>
    (filterZone === 'All' || l.zone === filterZone) &&
    (l.title.toLowerCase().includes(search.toLowerCase()) || l.platform.toLowerCase().includes(search.toLowerCase()))
  )

  const activeCount = listings.filter(l => l.status === 'active').length
  const totalOrders = listings.reduce((s, l) => s + l.orders, 0)
  const totalViews = listings.reduce((s, l) => s + l.views, 0)

  const handleView = (l) => { setSelectedListing(l); setIsViewOpen(true) }
  const handleEdit = (l) => { setSelectedListing(l); setEditForm({ title: l.title, platform: l.platform, zone: l.zone, price: l.price, currency: l.currency, status: l.status }); setIsEditOpen(true) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-100 border border-teal-200">
            <Store className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Platform Stores</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Manage IBB Service Listings on All External Platforms</p>
          </div>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />New Listing
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">Total Listings</p>
          <p className="text-2xl font-bold">{listings.length}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">Active Listings</p>
          <p className="text-2xl font-bold text-green-600">{activeCount}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">Total Views (MTD)</p>
          <p className="text-2xl font-bold">{(totalViews / 1000).toFixed(0)}K</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">Total Orders (MTD)</p>
          <p className="text-2xl font-bold text-blue-600">{totalOrders.toLocaleString()}</p>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9 h-9" placeholder="Search listings..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {zones.map(z => (
            <Button key={z} variant={filterZone === z ? 'default' : 'outline'} size="sm"
              className={filterZone === z ? 'bg-teal-600 hover:bg-teal-700' : ''}
              onClick={() => setFilterZone(z)}>{z}</Button>
          ))}
        </div>
      </div>

      {/* Listings Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-3 font-medium">Listing Title</th>
                  <th className="text-left p-3 font-medium">Platform</th>
                  <th className="text-left p-3 font-medium">Zone</th>
                  <th className="text-left p-3 font-medium">Price</th>
                  <th className="text-right p-3 font-medium">Views</th>
                  <th className="text-right p-3 font-medium">Orders</th>
                  <th className="text-left p-3 font-medium">Rating</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => {
                  const sc = statusConfig[l.status]
                  const StatusIcon = sc.icon
                  return (
                    <tr key={l.id} className="border-b hover:bg-muted/20">
                      <td className="p-3">
                        <div className="font-medium max-w-xs truncate">{l.title}</div>
                        <div className="text-xs text-muted-foreground">Updated {l.lastUpdated}</div>
                      </td>
                      <td className="p-3 font-medium">{l.platform}</td>
                      <td className="p-3"><Badge className={`text-xs ${zoneColors[l.zone]}`}>{l.zone}</Badge></td>
                      <td className="p-3 font-medium">{l.price.toLocaleString()} {l.currency}</td>
                      <td className="p-3 text-right">{l.views.toLocaleString()}</td>
                      <td className="p-3 text-right font-medium text-blue-600">{l.orders}</td>
                      <td className="p-3"><span className="text-yellow-500">★</span> {l.rating} <span className="text-xs text-muted-foreground">({l.reviews})</span></td>
                      <td className="p-3"><Badge className={`text-xs ${sc.color}`}><StatusIcon className="h-3 w-3 mr-1" />{sc.label}</Badge></td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleView(l)}><Eye className="h-3 w-3" /></Button>
                          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleEdit(l)}><Edit className="h-3 w-3" /></Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add New Listing Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Listing</DialogTitle>
            <DialogDescription>Add a new service listing to an external platform</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Listing Title *</Label>
              <Input placeholder="IBB Shuttle — Service Name" value={addForm.title}
                onChange={e => setAddForm({...addForm, title: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Platform</Label>
              <Select value={addForm.platform} onValueChange={v => setAddForm({...addForm, platform: v})}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Shopee','Lazada','Klook','Amazon','GetYourGuide','Booking.com','Ctrip','Fliggy','Noon','Ozon','eBay'].map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Zone</Label>
              <Select value={addForm.zone} onValueChange={v => setAddForm({...addForm, zone: v})}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['SE Asia','Global','China','Middle East','Russia'].map(z => (
                    <SelectItem key={z} value={z}>{z}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price</Label>
              <Input type="number" placeholder="1200" value={addForm.price}
                onChange={e => setAddForm({...addForm, price: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Currency</Label>
              <Select value={addForm.currency} onValueChange={v => setAddForm({...addForm, currency: v})}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['THB','USD','CNY','AED','RUB','EUR'].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
              if (!addForm.title) { toast({ title: 'Error', description: 'Listing title is required', variant: 'destructive' }); return }
              const newListing = { ...addForm, id: listings.length + 1, price: parseFloat(addForm.price)||0, views: 0, orders: 0, rating: 0, reviews: 0, lastUpdated: 'just now' }
              setListings([...listings, newListing])
              setIsAddOpen(false)
              setAddForm(emptyForm)
              toast({ title: 'Listing Created', description: `${addForm.title} added to ${addForm.platform}` })
            }}>Create Listing</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Listing Dialog */}
      {selectedListing && (
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Listing Details</DialogTitle>
              <DialogDescription>{selectedListing.platform} — {selectedListing.zone}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div><Label className="text-muted-foreground text-xs">Title</Label><p className="font-medium">{selectedListing.title}</p></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-muted-foreground text-xs">Price</Label><p className="font-medium">{selectedListing.price.toLocaleString()} {selectedListing.currency}</p></div>
                <div><Label className="text-muted-foreground text-xs">Status</Label><p className="font-medium capitalize">{selectedListing.status}</p></div>
                <div><Label className="text-muted-foreground text-xs">Total Views</Label><p className="font-medium">{selectedListing.views.toLocaleString()}</p></div>
                <div><Label className="text-muted-foreground text-xs">Total Orders</Label><p className="font-medium text-blue-600">{selectedListing.orders}</p></div>
                <div><Label className="text-muted-foreground text-xs">Rating</Label><p className="font-medium">★ {selectedListing.rating} ({selectedListing.reviews} reviews)</p></div>
                <div><Label className="text-muted-foreground text-xs">Last Updated</Label><p className="font-medium">{selectedListing.lastUpdated}</p></div>
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <Button size="sm" variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Listing Dialog */}
      {selectedListing && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Listing</DialogTitle>
              <DialogDescription>Update listing details for {selectedListing.platform}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Listing Title</Label>
                <Input value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="mt-1" />
              </div>
              <div>
                <Label>Price</Label>
                <Input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className="mt-1" />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={editForm.status} onValueChange={v => setEditForm({...editForm, status: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="warning">Needs Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
                setListings(listings.map(l => l.id === selectedListing.id ? { ...l, ...editForm, price: parseFloat(editForm.price)||l.price, lastUpdated: 'just now' } : l))
                setIsEditOpen(false)
                toast({ title: 'Listing Updated', description: `${editForm.title} updated successfully` })
              }}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
