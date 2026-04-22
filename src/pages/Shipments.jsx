import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import {
  Plus,
  Search,
  Edit,
  Eye,
  Truck,
  Package,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  ArrowUpDown,
  CheckSquare,
  MoreHorizontal,
  Printer,
  MapPinned,
  RotateCcw,
  Trash2,
  DollarSign,
  Globe,
  Box
} from 'lucide-react'

function ShipmentDetailsDialog({ shipment, isOpen, onClose }) {
  if (!shipment) return null

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      picked_up: 'bg-blue-100 text-blue-800',
      in_transit: 'bg-purple-100 text-purple-800',
      out_for_delivery: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      returned: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Shipment Details</DialogTitle>
          <DialogDescription>
            Tracking #{shipment.tracking_number}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Shipment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Order Number</p>
                  <p className="text-sm text-muted-foreground">{shipment.order_number}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Carrier</p>
                  <p className="text-sm text-muted-foreground">{shipment.carrier}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Tracking Number</p>
                  <p className="text-sm text-blue-600 font-mono">{shipment.tracking_number}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Shipping Method</p>
                  <p className="text-sm text-muted-foreground">{shipment.method}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge className={getStatusColor(shipment.status)}>
                    {shipment.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Customer</p>
                  <p className="text-sm text-muted-foreground">{shipment.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Shipping Address</p>
                  <p className="text-sm text-muted-foreground">
                    {shipment.address.street}<br />
                    {shipment.address.city}, {shipment.address.state} {shipment.address.postal_code}<br />
                    {shipment.address.country}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Estimated Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(shipment.estimated_delivery).toLocaleDateString()}
                  </p>
                </div>
                {shipment.actual_delivery && (
                  <div>
                    <p className="text-sm font-medium">Actual Delivery</p>
                    <p className="text-sm text-green-600">
                      {new Date(shipment.actual_delivery).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tracking Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {shipment.timeline.map((event, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        event.type === 'success' ? 'bg-green-100 text-green-600' :
                        event.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                        event.type === 'error' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {event.type === 'success' ? <CheckCircle className="h-4 w-4" /> :
                         event.type === 'error' ? <AlertTriangle className="h-4 w-4" /> :
                         <Truck className="h-4 w-4" />}
                      </div>
                      {index < shipment.timeline.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      {event.location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Package Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium">Weight</p>
                  <p className="text-sm text-muted-foreground">{shipment.weight} kg</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Dimensions</p>
                  <p className="text-sm text-muted-foreground">{shipment.dimensions}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Items</p>
                  <p className="text-sm text-muted-foreground">{shipment.items_count} items</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ShipmentFormDialog({ shipment, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    order_number: shipment?.order_number || '',
    carrier: shipment?.carrier || '',
    tracking_number: shipment?.tracking_number || '',
    method: shipment?.method || 'Standard',
    status: shipment?.status || 'pending',
    estimated_delivery: shipment?.estimated_delivery || '',
    weight: shipment?.weight || '',
    dimensions: shipment?.dimensions || '',
    notes: shipment?.notes || ''
  })

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
  const queryClient = useQueryClient()

  const saveMutation = useMutation({
    mutationFn: (data) => Promise.resolve(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['shipments'])
      toast({ title: shipment ? 'Shipment updated' : 'Shipment created' })
      onClose()
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    saveMutation.mutate(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{shipment ? 'Edit Shipment' : 'Create Shipment'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Order Number *</Label>
              <Input
                value={formData.order_number}
                onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Carrier *</Label>
              <Select value={formData.carrier} onValueChange={(v) => setFormData({ ...formData, carrier: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FedEx">FedEx</SelectItem>
                  <SelectItem value="UPS">UPS</SelectItem>
                  <SelectItem value="DHL">DHL</SelectItem>
                  <SelectItem value="USPS">USPS</SelectItem>
                  <SelectItem value="Thailand Post">Thailand Post</SelectItem>
                  <SelectItem value="Kerry">Kerry Express</SelectItem>
                  <SelectItem value="Flash">Flash Express</SelectItem>
                  <SelectItem value="J&T">J&T Express</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tracking Number *</Label>
              <Input
                value={formData.tracking_number}
                onChange={(e) => setFormData({ ...formData, tracking_number: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Shipping Method</Label>
              <Select value={formData.method} onValueChange={(v) => setFormData({ ...formData, method: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Express">Express</SelectItem>
                  <SelectItem value="Overnight">Overnight</SelectItem>
                  <SelectItem value="Economy">Economy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="picked_up">Picked Up</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Estimated Delivery</Label>
              <Input
                type="date"
                value={formData.estimated_delivery}
                onChange={(e) => setFormData({ ...formData, estimated_delivery: e.target.value })}
              />
            </div>
            <div>
              <Label>Weight (kg)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
            <div>
              <Label>Dimensions (LxWxH cm)</Label>
              <Input
                placeholder="30x20x10"
                value={formData.dimensions}
                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button size="sm" type="submit" className="bg-gray-700 hover:bg-gray-600 text-white">{shipment ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Shipping Method Form Dialog
function ShippingMethodFormDialog({ method, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: method?.name || '',
    deliveryTime: method?.deliveryTime || '',
    description: method?.description || '',
    enabled: method?.enabled ?? true
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{method ? 'Edit Shipping Method' : 'Add Shipping Method'}</DialogTitle>
          <DialogDescription>
            Configure shipping method and delivery time
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Method Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Standard Shipping"
              required
            />
          </div>
          <div>
            <Label>Delivery Time *</Label>
            <Input
              value={formData.deliveryTime}
              onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
              placeholder="e.g. 3-5 business days"
              required
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional details about this shipping method"
              rows={3}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={formData.enabled}
              onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
            />
            <Label>Enabled</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button size="sm" type="submit" className="bg-gray-700 hover:bg-gray-600 text-white">{method ? 'Save' : 'Add'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Shipping Rate Form Dialog
function ShippingRateFormDialog({ rate, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    method: rate?.method || '',
    zone: rate?.zone || '',
    minWeight: rate?.minWeight || 0,
    maxWeight: rate?.maxWeight || 5,
    rate: rate?.rate || 0,
    currency: rate?.currency || 'THB'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{rate ? 'Edit Shipping Rate' : 'Add Shipping Rate'}</DialogTitle>
          <DialogDescription>
            Configure shipping rate based on weight and zone
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Shipping Method *</Label>
            <Select value={formData.method} onValueChange={(v) => setFormData({ ...formData, method: v })}>
              <SelectTrigger>
                <SelectValue placeholder="SelectedShipping Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Standard Shipping">Standard Shipping</SelectItem>
                <SelectItem value="Express Shipping">Express Shipping</SelectItem>
                <SelectItem value="Overnight Shipping">Overnight Shipping</SelectItem>
                <SelectItem value="Same Day Delivery">Same Day Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Zone *</Label>
            <Select value={formData.zone} onValueChange={(v) => setFormData({ ...formData, zone: v })}>
              <SelectTrigger>
                <SelectValue placeholder="SelectedZone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bangkok Metropolitan">Bangkok Metropolitan</SelectItem>
                <SelectItem value="Provincial">Provincial</SelectItem>
                <SelectItem value="International">International</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Minimum Weight (kg) *</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.minWeight}
                onChange={(e) => setFormData({ ...formData, minWeight: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label>Max Weight (kg) *</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.maxWeight}
                onChange={(e) => setFormData({ ...formData, maxWeight: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Shipping Rate *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.rate}
                onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label>Currency</Label>
              <Select value={formData.currency} onValueChange={(v) => setFormData({ ...formData, currency: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="THB">THB (Baht)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button size="sm" type="submit" className="bg-gray-700 hover:bg-gray-600 text-white">{rate ? 'Save' : 'Add'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Shipping Zone Form Dialog
function ShippingZoneFormDialog({ zone, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: zone?.name || '',
    countries: zone?.countries?.join(', ') || '',
    description: zone?.description || '',
    enabled: zone?.enabled ?? true
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...formData,
      countries: formData.countries.split(',').map(c => c.trim()).filter(c => c)
    }
    onSave(data)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{zone ? 'Edit Shipping Zone' : 'Add Shipping Zone'}</DialogTitle>
          <DialogDescription>
            Define shipping zone and regions
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Zone Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Bangkok Metropolitan"
              required
            />
          </div>
          <div>
            <Label>Countries/Regions *</Label>
            <Input
              value={formData.countries}
              onChange={(e) => setFormData({ ...formData, countries: e.target.value })}
              placeholder="Enter country names separated by commas e.g. Thailand, Vietnam, Singapore"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separate with commas (,) for multiple countries
            </p>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional details about this area"
              rows={3}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={formData.enabled}
              onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
            />
            <Label>Enabled</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button size="sm" type="submit" className="bg-gray-700 hover:bg-gray-600 text-white">{zone ? 'Save' : 'Add'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Carrier Form Dialog
function CarrierFormDialog({ carrier, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: carrier?.name || '',
    apiKey: carrier?.apiKey || '',
    trackingUrl: carrier?.trackingUrl || '',
    logo: carrier?.logo || '📦',
    enabled: carrier?.enabled ?? true
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{carrier ? 'Edit Carrier' : 'Add Carrier'}</DialogTitle>
          <DialogDescription>
            Configure carrier information and API integration
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Carrier Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Kerry Express"
              required
            />
          </div>
          <div>
            <Label>API Key</Label>
            <Input
              value={formData.apiKey}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              placeholder="Enter API Key for integration"
              type="password"
            />
          </div>
          <div>
            <Label>Tracking URL</Label>
            <Input
              value={formData.trackingUrl}
              onChange={(e) => setFormData({ ...formData, trackingUrl: e.target.value })}
              placeholder="https://example.com/track?id={tracking}"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use {'{tracking}'} as placeholder for tracking number
            </p>
          </div>
          <div>
            <Label>Logo (Emoji)</Label>
            <Input
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              placeholder="🚚"
              maxLength={2}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={formData.enabled}
              onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
            />
            <Label>Enabled</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button size="sm" type="submit" className="bg-gray-700 hover:bg-gray-600 text-white">{carrier ? 'Save' : 'Add'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Shipping Methods Tab Component
function ShippingMethodsTab() {
  const [methods, setMethods] = useState([
    { id: 1, name: 'Standard Shipping', enabled: true, deliveryTime: '3-5 business days', description: 'Standard shipping service' },
    { id: 2, name: 'Express Shipping', enabled: true, deliveryTime: '1-2 business days', description: 'Express shipping service' },
    { id: 3, name: 'Same Day Delivery', enabled: true, deliveryTime: 'Same day delivery', description: 'Same day delivery service (Bangkok only)' },
    { id: 4, name: 'Pickup at Store', enabled: true, deliveryTime: 'Available immediately', description: 'Pickup at store' }
  ])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState(null)
  const { toast } = useToast()

  const handleToggle = (id) => {
    setMethods(methods.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m))
    toast({ title: 'Shipping method updated' })
  }

  const handleEdit = (method) => {
    setEditingMethod(method)
    setIsFormOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this shipping method?')) {
      setMethods(methods.filter(m => m.id !== id))
      toast({ title: 'Shipping method deleted' })
    }
  }

  const handleSave = (data) => {
    if (editingMethod) {
      setMethods(methods.map(m => m.id === editingMethod.id ? { ...m, ...data } : m))
      toast({ title: 'Shipping method updated' })
    } else {
      const newMethod = { id: Date.now(), ...data }
      setMethods([...methods, newMethod])
      toast({ title: 'Shipping method added' })
    }
    setEditingMethod(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Shipping Methods</h3>
          <p className="text-sm text-muted-foreground">Configure available shipping methods</p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setEditingMethod(null); setIsFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Shipping Method
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Method Name</TableHead>
              <TableHead>Delivery Time</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {methods.map((method) => (
              <TableRow key={method.id}>
                <TableCell className="font-medium">{method.name}</TableCell>
                <TableCell>{method.deliveryTime}</TableCell>
                <TableCell className="text-muted-foreground">{method.description}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch checked={method.enabled} onCheckedChange={() => handleToggle(method.id)} />
                    <span className="text-sm">{method.enabled ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(method)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(method.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <ShippingMethodFormDialog
        method={editingMethod}
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingMethod(null); }}
        onSave={handleSave}
      />
    </div>
  )
}

// Shipping Rates Tab Component
function ShippingRatesTab() {
  const [rates, setRates] = useState([
    { id: 1, method: 'Standard Shipping', zone: 'Bangkok Metropolitan', minWeight: 0, maxWeight: 5, rate: 50, currency: 'THB' },
    { id: 2, method: 'Standard Shipping', zone: 'Bangkok Metropolitan', minWeight: 5, maxWeight: 10, rate: 80, currency: 'THB' },
    { id: 3, method: 'Express Shipping', zone: 'Bangkok Metropolitan', minWeight: 0, maxWeight: 5, rate: 100, currency: 'THB' },
    { id: 4, method: 'Standard Shipping', zone: 'Provincial', minWeight: 0, maxWeight: 5, rate: 80, currency: 'THB' },
    { id: 5, method: 'Same Day Delivery', zone: 'Bangkok Metropolitan', minWeight: 0, maxWeight: 5, rate: 200, currency: 'THB' }
  ])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingRate, setEditingRate] = useState(null)
  const { toast } = useToast()

  const handleEdit = (rate) => {
    setEditingRate(rate)
    setIsFormOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this shipping rate?')) {
      setRates(rates.filter(r => r.id !== id))
      toast({ title: 'Shipping rate deleted' })
    }
  }

  const handleSave = (data) => {
    if (editingRate) {
      setRates(rates.map(r => r.id === editingRate.id ? { ...r, ...data } : r))
      toast({ title: 'Shipping rate updated' })
    } else {
      const newRate = { id: Date.now(), ...data }
      setRates([...rates, newRate])
      toast({ title: 'Shipping rate added' })
    }
    setEditingRate(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Shipping Rates</h3>
          <p className="text-sm text-muted-foreground">Configure shipping rate based on weight and zone</p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setEditingRate(null); setIsFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Shipping Rate
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shipping Method</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Weight (kg)</TableHead>
              <TableHead>Shipping Rate</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rates.map((rate) => (
              <TableRow key={rate.id}>
                <TableCell className="font-medium">{rate.method}</TableCell>
                <TableCell>{rate.zone}</TableCell>
                <TableCell>{rate.minWeight} - {rate.maxWeight} kg</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{rate.rate} {rate.currency}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(rate)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(rate.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <ShippingRateFormDialog
        rate={editingRate}
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingRate(null); }}
        onSave={handleSave}
      />
    </div>
  )
}

// Shipping Zones Tab Component
function ShippingZonesTab() {
  const [zones, setZones] = useState([
    { id: 1, name: 'Bangkok Metropolitan', countries: ['Bangkok', 'Nonthaburi', 'Pathum Thani', 'Samut Prakan'], enabled: true, description: 'Bangkok and metropolitan area' },
    { id: 2, name: 'Provincial', countries: ['Chiang Mai', 'Phuket', 'Khon Kaen', 'Songkhla'], enabled: true, description: 'Other provinces nationwide' },
    { id: 3, name: 'International', countries: ['Singapore', 'Malaysia', 'Vietnam'], enabled: true, description: 'Southeast Asian countries' }
  ])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingZone, setEditingZone] = useState(null)
  const { toast } = useToast()

  const handleToggle = (id) => {
    setZones(zones.map(z => z.id === id ? { ...z, enabled: !z.enabled } : z))
    toast({ title: 'Shipping zone updated' })
  }

  const handleEdit = (zone) => {
    setEditingZone(zone)
    setIsFormOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this shipping zone?')) {
      setZones(zones.filter(z => z.id !== id))
      toast({ title: 'Shipping zone deleted' })
    }
  }

  const handleSave = (data) => {
    if (editingZone) {
      setZones(zones.map(z => z.id === editingZone.id ? { ...z, ...data } : z))
      toast({ title: 'Shipping zone updated' })
    } else {
      const newZone = { id: Date.now(), ...data }
      setZones([...zones, newZone])
      toast({ title: 'Shipping zone added' })
    }
    setEditingZone(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Shipping Zones</h3>
          <p className="text-sm text-muted-foreground">Define available shipping areas</p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setEditingZone(null); setIsFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Shipping Zone
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Zone Name</TableHead>
              <TableHead>Area/Country</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zones.map((zone) => (
              <TableRow key={zone.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    {zone.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {zone.countries.slice(0, 3).map((country, idx) => (
                      <Badge key={idx} variant="outline">{country}</Badge>
                    ))}
                    {zone.countries.length > 3 && (
                      <Badge variant="outline">+{zone.countries.length - 3} Others</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{zone.description}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch checked={zone.enabled} onCheckedChange={() => handleToggle(zone.id)} />
                    <span className="text-sm">{zone.enabled ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(zone)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(zone.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <ShippingZoneFormDialog
        zone={editingZone}
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingZone(null); }}
        onSave={handleSave}
      />
    </div>
  )
}

// Carriers Tab Component
function CarriersTab() {
  const [carriers, setCarriers] = useState([
    { id: 1, name: 'Kerry Express', enabled: true, apiKey: '••••••••', trackingUrl: 'https://th.kerryexpress.com/th/track/?track={tracking}', logo: '🚛' },
    { id: 2, name: 'Flash Express', enabled: true, apiKey: '••••••••', trackingUrl: 'https://flashexpress.com/tracking/?se={tracking}', logo: '⚡' },
    { id: 3, name: 'Thailand Post', enabled: true, apiKey: '••••••••', trackingUrl: 'https://track.thailandpost.co.th/?trackNumber={tracking}', logo: '🇹🇭' },
    { id: 4, name: 'J&T Express', enabled: true, apiKey: '••••••••', trackingUrl: 'https://www.jtexpress.co.th/index/query/gzquery.html?bills={tracking}', logo: '🔴' },
    { id: 5, name: 'DHL', enabled: false, apiKey: '', trackingUrl: 'https://www.dhl.com/th-en/home/tracking.html?tracking-id={tracking}', logo: '✈️' },
    { id: 6, name: 'FedEx', enabled: false, apiKey: '', trackingUrl: 'https://www.fedex.com/fedextrack/?tracknumbers={tracking}', logo: '📦' }
  ])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCarrier, setEditingCarrier] = useState(null)
  const { toast } = useToast()

  const handleToggle = (id) => {
    setCarriers(carriers.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c))
    toast({ title: 'Carrier updated' })
  }

  const handleEdit = (carrier) => {
    setEditingCarrier(carrier)
    setIsFormOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this carrier?')) {
      setCarriers(carriers.filter(c => c.id !== id))
      toast({ title: 'Carrier deleted' })
    }
  }

  const handleTestConnection = (carrier) => {
    toast({ title: `Testing connection... ${carrier.name}...`, description: 'Please wait...' })
  }

  const handleSave = (data) => {
    if (editingCarrier) {
      setCarriers(carriers.map(c => c.id === editingCarrier.id ? { ...c, ...data } : c))
      toast({ title: 'Carrier updated' })
    } else {
      const newCarrier = { id: Date.now(), ...data }
      setCarriers([...carriers, newCarrier])
      toast({ title: 'Carrier added' })
    }
    setEditingCarrier(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Carriers</h3>
          <p className="text-sm text-muted-foreground">Manage carriers and configure API integration</p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setEditingCarrier(null); setIsFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Carrier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {carriers.map((carrier) => (
          <Card key={carrier.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{carrier.logo}</div>
                  <div>
                    <CardTitle className="text-lg">{carrier.name}</CardTitle>
                    <CardDescription>
                      {carrier.apiKey && carrier.apiKey !== '' ? 'API Connected' : 'Not configured'}
                    </CardDescription>
                  </div>
                </div>
                <Switch checked={carrier.enabled} onCheckedChange={() => handleToggle(carrier.id)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">API Key</p>
                  <p className="text-sm text-muted-foreground font-mono">{carrier.apiKey || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Tracking URL</p>
                  <p className="text-sm text-muted-foreground truncate">{carrier.trackingUrl}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleTestConnection(carrier)}>
                    Connection
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(carrier)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(carrier.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CarrierFormDialog
        carrier={editingCarrier}
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingCarrier(null); }}
        onSave={handleSave}
      />
    </div>
  )
}

export default function Shipments() {
  const [activeTab, setActiveTab] = useState('shipments')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedShipment, setSelectedShipment] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingShipment, setEditingShipment] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [carrierFilter, setCarrierFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedShipments, setSelectedShipments] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Mock data
  const mockShipments = [
    {
      id: 1,
      order_number: 'ORD-2024-001',
      customer_name: 'John Doe',
      carrier: 'Kerry',
      tracking_number: 'KRY123456789',
      method: 'Express',
      status: 'delivered',
      weight: 2.5,
      dimensions: '30x20x15',
      items_count: 2,
      estimated_delivery: '2024-10-05',
      actual_delivery: '2024-10-05',
      created_at: '2024-10-03T10:00:00Z',
      address: {
        street: '123 Sukhumvit Road',
        city: 'Bangkok',
        state: 'Bangkok',
        postal_code: '10110',
        country: 'Thailand'
      },
      timeline: [
        { type: 'success', title: 'Delivered successfully', description: 'Package delivered to recipient', location: 'Bangkok', timestamp: '2024-10-05T14:20:00Z' },
        { type: 'info', title: 'Out for delivery', description: 'Package is out for delivery', location: 'Bangkok', timestamp: '2024-10-05T08:00:00Z' },
        { type: 'info', title: 'Arrived at warehouse', description: 'Package arrived at local warehouse', location: 'Bangkok', timestamp: '2024-10-04T18:00:00Z' },
        { type: 'info', title: 'In transit', description: 'Package is in transit', location: 'Pathum Thani', timestamp: '2024-10-04T10:00:00Z' },
        { type: 'info', title: 'Package picked up by carrier', description: 'Package picked up by carrier', location: 'Nonthaburi', timestamp: '2024-10-03T10:00:00Z' }
      ]
    },
    {
      id: 2,
      order_number: 'ORD-2024-002',
      customer_name: 'Jane Smith',
      carrier: 'Flash',
      tracking_number: 'FLH987654321',
      method: 'Standard',
      status: 'in_transit',
      weight: 1.8,
      dimensions: '25x15x10',
      items_count: 1,
      estimated_delivery: '2024-10-07',
      created_at: '2024-10-04T14:00:00Z',
      address: {
        street: '456 Rama 4 Road',
        city: 'Bangkok',
        state: 'Bangkok',
        postal_code: '10120',
        country: 'Thailand'
      },
      timeline: [
        { type: 'info', title: 'In transit', description: 'Package is in transit', location: 'Ayutthaya', timestamp: '2024-10-05T12:00:00Z' },
        { type: 'info', title: 'Package picked up by carrier', description: 'Package picked up by carrier', location: 'Chiang Mai', timestamp: '2024-10-04T14:00:00Z' }
      ]
    },
    {
      id: 3,
      order_number: 'ORD-2024-003',
      customer_name: 'Bob Johnson',
      carrier: 'Thailand Post',
      tracking_number: 'THP456789123',
      method: 'Standard',
      status: 'pending',
      weight: 3.2,
      dimensions: '35x25x20',
      items_count: 3,
      estimated_delivery: '2024-10-08',
      created_at: '2024-10-04T09:00:00Z',
      address: {
        street: '789 Phetchaburi Road',
        city: 'Bangkok',
        state: 'Bangkok',
        postal_code: '10400',
        country: 'Thailand'
      },
      timeline: [
        { type: 'info', title: 'Order Created', description: 'Shipment order created', location: 'Bangkok', timestamp: '2024-10-04T09:00:00Z' }
      ]
    }
  ]

  const { data: shipments, isLoading } = useQuery({
    queryKey: ['shipments', { search: searchTerm, status: statusFilter, carrier: carrierFilter, sort: sortBy, order: sortOrder }],
    queryFn: () => {
      let filtered = mockShipments
      
      if (searchTerm) {
        filtered = filtered.filter(s => 
          s.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      if (statusFilter !== 'all') {
        filtered = filtered.filter(s => s.status === statusFilter)
      }

      if (carrierFilter !== 'all') {
        filtered = filtered.filter(s => s.carrier === carrierFilter)
      }

      filtered.sort((a, b) => {
        let aVal, bVal
        switch (sortBy) {
          case 'date':
            aVal = new Date(a.created_at)
            bVal = new Date(b.created_at)
            break
          case 'carrier':
            aVal = a.carrier
            bVal = b.carrier
            break
          default:
            return 0
        }
        if (typeof aVal === 'string') {
          return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        }
        return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1)
      })
      
      return Promise.resolve({ items: filtered, total: filtered.length })
    }
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries(['shipments'])
      toast({ title: 'Shipment status updated' })
    }
  })

  const handleViewDetails = (shipment) => {
    setSelectedShipment(shipment)
    setIsDetailsOpen(true)
  }

  const handleEdit = (shipment) => {
    setEditingShipment(shipment)
    setIsFormOpen(true)
  }

  const handleUpdateStatus = (shipment, status) => {
    if (confirm(`Update shipment status ${shipment.tracking_number} to ${status}?`)) {
      updateStatusMutation.mutate({ id: shipment.id, status })
    }
  }

  const handlePrintLabel = (shipment) => {
    toast({ title: `Printing shipping label for ${shipment.tracking_number}...` })
  }

  const handleTrack = (shipment) => {
    toast({ title: `Opening tracking page for ${shipment.tracking_number}...` })
  }

  const handleSelectShipment = (shipmentId, checked) => {
    if (checked) {
      setSelectedShipments(prev => [...prev, shipmentId])
    } else {
      setSelectedShipments(prev => prev.filter(id => id !== shipmentId))
    }
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedShipments(shipments?.items?.map(s => s.id) || [])
    } else {
      setSelectedShipments([])
    }
  }

  const handleBulkExport = () => {
    toast({ title: `Exporting ${selectedShipments.length} shipments as CSV...` })
    setSelectedShipments([])
  }

  const handleBulkUpdateStatus = (status) => {
    toast({ title: `Updating ${selectedShipments.length} shipments to ${status}...` })
    setSelectedShipments([])
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      picked_up: 'bg-blue-100 text-blue-800',
      in_transit: 'bg-purple-100 text-purple-800',
      out_for_delivery: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      returned: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const totalShipments = shipments?.total || 0
  const pendingShipments = shipments?.items?.filter(s => s.status === 'pending').length || 0
  const inTransitShipments = shipments?.items?.filter(s => s.status === 'in_transit').length || 0
  const deliveredShipments = shipments?.items?.filter(s => s.status === 'delivered').length || 0
  const failedShipments = shipments?.items?.filter(s => s.status === 'failed').length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shipments & Shipping Settings</h1>
          <p className="text-muted-foreground">
            Manage shipments, delivery tracking, and shipping configuration
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {activeTab === 'shipments' && (
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setEditingShipment(null); setIsFormOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Shipment
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="shipments">
            <Package className="h-4 w-4 mr-2" />
            Shipments
          </TabsTrigger>
          <TabsTrigger value="methods">
            <Truck className="h-4 w-4 mr-2" />
            Shipping Method
          </TabsTrigger>
          <TabsTrigger value="rates">
            <DollarSign className="h-4 w-4 mr-2" />
            Rates
          </TabsTrigger>
          <TabsTrigger value="zones">
            <Globe className="h-4 w-4 mr-2" />
            Zones
          </TabsTrigger>
          <TabsTrigger value="carriers">
            <Box className="h-4 w-4 mr-2" />
            Carriers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shipments" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalShipments}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingShipments}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Out for delivery</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inTransitShipments}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivered successfully</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{deliveredShipments}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{failedShipments}</div>
              </CardContent>
            </Card>
          </div>

          {/* Bulk Actions Bar */}
          {selectedShipments.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Selected {selectedShipments.length} items</span>
                  </div>
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => toast({ title: 'Updated', description: 'Data updated successfully' })}>
                          Update Status
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleBulkUpdateStatus('picked_up')}>
                          Mark as Picked Up
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkUpdateStatus('in_transit')}>
                          Mark as In Transit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkUpdateStatus('delivered')}>
                          Mark as Delivered
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" size="sm" onClick={handleBulkExport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedShipments([])}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by Order #, Tracking #, Customer name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="picked_up">Package picked up by carrier</SelectItem>
                    <SelectItem value="in_transit">Out for delivery</SelectItem>
                    <SelectItem value="out_for_delivery">Out for delivery</SelectItem>
                    <SelectItem value="delivered">Delivered successfully</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={carrierFilter} onValueChange={setCarrierFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Carriers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Carriers</SelectItem>
                    <SelectItem value="Kerry">Kerry Express</SelectItem>
                    <SelectItem value="Flash">Flash Express</SelectItem>
                    <SelectItem value="Thailand Post">Thailand Post</SelectItem>
                    <SelectItem value="J&T">J&T Express</SelectItem>
                  </SelectContent>
                </Select>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSortBy('date')}>
                      Ship Date {sortBy === 'date' && `(${sortOrder})`}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('carrier')}>
                      Carriers {sortBy === 'carrier' && `(${sortOrder})`}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                      {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>

          {/* Shipments Table */}
          <Card>
            <CardHeader>
              <CardTitle>Shipments List ({totalShipments})</CardTitle>
              <CardDescription>
                Track and manage all shipments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox 
                          checked={selectedShipments.length === shipments?.items?.length && shipments?.items?.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Carriers</TableHead>
                      <TableHead>Tracking #</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Ship Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shipments?.items?.map((shipment) => (
                      <TableRow key={shipment.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedShipments.includes(shipment.id)}
                            onCheckedChange={(checked) => handleSelectShipment(shipment.id, checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{shipment.order_number}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{shipment.customer_name}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{shipment.carrier}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-mono text-blue-600">{shipment.tracking_number}</div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{shipment.method}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(shipment.estimated_delivery).toLocaleDateString('th-TH')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(shipment.status)}>
                            {shipment.status === 'pending' ? 'Pending' :
                             shipment.status === 'in_transit' ? 'Out for delivery' :
                             shipment.status === 'delivered' ? 'Delivered successfully' :
                             shipment.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => toast({ title: 'View Details', description: 'Loading details...' })}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(shipment)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(shipment)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleTrack(shipment)}>
                                <MapPinned className="h-4 w-4 mr-2" />
                                Track Shipment
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePrintLabel(shipment)}>
                                <Printer className="h-4 w-4 mr-2" />
                                Print Label
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleUpdateStatus(shipment, 'delivered')}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as Delivered
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(shipment, 'returned')}>
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Mark as Returned
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods">
          <ShippingMethodsTab />
        </TabsContent>

        <TabsContent value="rates">
          <ShippingRatesTab />
        </TabsContent>

        <TabsContent value="zones">
          <ShippingZonesTab />
        </TabsContent>

        <TabsContent value="carriers">
          <CarriersTab />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ShipmentDetailsDialog 
        shipment={selectedShipment} 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
      />
      <ShipmentFormDialog 
        shipment={editingShipment} 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
      />
    </div>
  )
}
