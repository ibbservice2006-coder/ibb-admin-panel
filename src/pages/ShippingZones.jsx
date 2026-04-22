import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, MapPin, Edit, Trash2, Search, Globe } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

export default function ShippingZones() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingZone, setEditingZone] = useState(null)
  const [deletingZoneId, setDeletingZoneId] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    countries: '',
    regions: '',
    rate: '',
    methods: ''
  })

  // Mock data with state
  const [zones, setZones] = useState([
    {
      id: 1,
      name: 'Bangkok Metropolitan',
      countries: ['Thailand'],
      regions: ['Bangkok', 'Nonthaburi', 'Pathum Thani'],
      methods: ['Standard', 'Express'],
      status: 'active',
      rate: '฿50'
    },
    {
      id: 2,
      name: 'Central Thailand',
      countries: ['Thailand'],
      regions: ['Ayutthaya', 'Lopburi', 'Saraburi'],
      methods: ['Standard'],
      status: 'active',
      rate: '฿80'
    },
    {
      id: 3,
      name: 'International - Asia',
      countries: ['Singapore', 'Malaysia', 'Vietnam'],
      regions: ['All'],
      methods: ['Standard', 'Express', 'Air'],
      status: 'active',
      rate: '฿300'
    }
  ])

  const filteredZones = zones.filter(zone =>
    zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.countries.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Handle Add/Edit Zone
  const handleOpenDialog = (zone = null) => {
    if (zone) {
      setEditingZone(zone)
      setFormData({
        name: zone.name,
        countries: zone.countries.join(', '),
        regions: zone.regions.join(', '),
        rate: zone.rate.replace('฿', ''),
        methods: zone.methods.join(', ')
      })
    } else {
      setEditingZone(null)
      setFormData({ name: '', countries: '', regions: '', rate: '', methods: '' })
    }
    setIsDialogOpen(true)
  }

  const handleSaveZone = () => {
    if (editingZone) {
      // Update existing zone
      setZones(zones.map(z => 
        z.id === editingZone.id 
          ? {
              ...z,
              name: formData.name,
              countries: formData.countries.split(',').map(c => c.trim()),
              regions: formData.regions.split(',').map(r => r.trim()),
              rate: `฿${formData.rate}`,
              methods: formData.methods.split(',').map(m => m.trim())
            }
          : z
      ))
    } else {
      // Add new zone
      const newZone = {
        id: Math.max(...zones.map(z => z.id)) + 1,
        name: formData.name,
        countries: formData.countries.split(',').map(c => c.trim()),
        regions: formData.regions.split(',').map(r => r.trim()),
        rate: `฿${formData.rate}`,
        methods: formData.methods.split(',').map(m => m.trim()),
        status: 'active'
      }
      setZones([...zones, newZone])
    }
    setIsDialogOpen(false)
    setFormData({ name: '', countries: '', regions: '', rate: '', methods: '' })
  }

  // Handle Delete Zone
  const handleDeleteClick = (zoneId) => {
    setDeletingZoneId(zoneId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    setZones(zones.filter(z => z.id !== deletingZoneId))
    setIsDeleteDialogOpen(false)
    setDeletingZoneId(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipping Zones</h1>
          <p className="text-muted-foreground mt-2">
            Manage shipping zones and delivery rates for different regions
          </p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white gap-2" onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4" />
          Add Shipping Zone
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Zones</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{zones.length}</div>
            <p className="text-xs text-muted-foreground">Active shipping zones</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Countries covered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rate</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿143</div>
            <p className="text-xs text-muted-foreground">Average shipping cost</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Methods</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Delivery methods</p>
          </CardContent>
        </Card>
      </div>

      {/* Zones Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Shipping Zones</CardTitle>
              <CardDescription>Manage delivery zones and rates</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search zones..."
                  className="pl-8 w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zone Name</TableHead>
                <TableHead>Countries</TableHead>
                <TableHead>Regions</TableHead>
                <TableHead>Methods</TableHead>
                <TableHead>Base Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredZones.map((zone) => (
                <TableRow key={zone.id}>
                  <TableCell className="font-medium">{zone.name}</TableCell>
                  <TableCell>{zone.countries.join(', ')}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {zone.regions.slice(0, 2).join(', ')}
                    {zone.regions.length > 2 && ` +${zone.regions.length - 2}`}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {zone.methods.map((method, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{zone.rate}</TableCell>
                  <TableCell>
                    <Badge variant={zone.status === 'active' ? 'default' : 'secondary'}>
                      {zone.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(zone)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(zone.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingZone ? 'Edit Shipping Zone' : 'Create Shipping Zone'}</DialogTitle>
            <DialogDescription>
              {editingZone ? 'Update shipping zone details' : 'Define a new shipping zone with delivery rates and methods'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="zone-name">Zone Name</Label>
              <Input 
                id="zone-name" 
                placeholder="e.g., Bangkok Metropolitan" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="countries">Countries (comma separated)</Label>
              <Input 
                id="countries" 
                placeholder="e.g., Thailand, Singapore"
                value={formData.countries}
                onChange={(e) => setFormData({...formData, countries: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="regions">Regions/Provinces (comma separated)</Label>
              <Input 
                id="regions" 
                placeholder="Enter regions separated by comma"
                value={formData.regions}
                onChange={(e) => setFormData({...formData, regions: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rate">Base Rate (฿)</Label>
              <Input 
                id="rate" 
                type="number" 
                placeholder="0.00"
                value={formData.rate}
                onChange={(e) => setFormData({...formData, rate: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="methods">Shipping Methods (comma separated)</Label>
              <Input 
                id="methods" 
                placeholder="e.g., Standard, Express"
                value={formData.methods}
                onChange={(e) => setFormData({...formData, methods: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveZone}>
              {editingZone ? 'Update Zone' : 'Create Zone'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the shipping zone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
