import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Shield, Plus, AlertTriangle, CheckCircle, MapPin, Bell, Edit, Trash2, Clock } from 'lucide-react'

const zones = [
  {
    id: 'Z001', name: 'Suvarnabhumi Airport Zone', type: 'pickup_dropoff',
    center: 'Suvarnabhumi Airport (BKK)', radius: '2 km',
    active: true, alertOnExit: true, alertOnEntry: false,
    vehicles: 3, alerts: 0,
    description: 'Suvarnabhumi Airport passenger pick-up/drop-off zone',
  },
  {
    id: 'Z002', name: 'Don Mueang Airport Zone', type: 'pickup_dropoff',
    center: 'Don Mueang Airport (DMK)', radius: '2 km',
    active: true, alertOnExit: true, alertOnEntry: false,
    vehicles: 1, alerts: 0,
    description: 'Don Mueang Airport Passenger Pickup/Dropoff Zone',
  },
  {
    id: 'Z003', name: 'Bangkok City Zone', type: 'service_area',
    center: 'Central Bangkok', radius: '25 km',
    active: true, alertOnExit: true, alertOnEntry: false,
    vehicles: 4, alerts: 0,
    description: 'Service area in Bangkok',
  },
  {
    id: 'Z004', name: 'Pattaya Service Zone', type: 'service_area',
    center: 'Pattaya City Center', radius: '15 km',
    active: true, alertOnExit: false, alertOnEntry: false,
    vehicles: 2, alerts: 0,
    description: 'Service Area in Pattaya',
  },
  {
    id: 'Z005', name: 'Restricted Zone — Border', type: 'restricted',
    center: 'Thai-Myanmar Border', radius: '5 km',
    active: true, alertOnExit: false, alertOnEntry: true,
    vehicles: 0, alerts: 0,
    description: 'No border zone entry — alert immediately when vehicle approaches',
  },
]

const alertLog = [
  { id: 'A001', time: '13:45', vehicle: 'YD-7890', driver: 'Surachai Promdee', zone: 'Bangkok City Zone',
    type: 'exit', severity: 'high', booking: 'IBB-2024-0894', resolved: false,
    note: 'Vehicle out of service area — Customer: Ahmed Al-Rashid',
  },
  { id: 'A002', time: '11:20', vehicle: 'AB-1234', driver: 'Somchai Jaidee', zone: 'Suvarnabhumi Airport Zone',
    type: 'idle', severity: 'medium', booking: 'IBB-2024-0891', resolved: true,
    note: 'Stopped in airport zone over 30 mins',
  },
  { id: 'A003', time: '09:05', vehicle: 'Balance-5678', driver: 'Vichai Mankong', zone: 'Don Mueang Airport Zone',
    type: 'entry', severity: 'low', booking: 'IBB-2024-0889', resolved: true,
    note: 'Vehicle entered Don Mueang airport zone — on route',
  },
]

const zoneTypeConfig = {
  pickup_dropoff: { label: 'Pickup/Dropoff', color: 'bg-blue-100 text-blue-700' },
  service_area: { label: 'Service Area', color: 'bg-green-100 text-green-700' },
  restricted: { label: 'Restricted', color: 'bg-red-100 text-red-700' },
}

const alertTypeConfig = {
  exit: { label: 'Zone Exit', color: 'text-red-600', bg: 'bg-red-50' },
  entry: { label: 'Zone Entry', color: 'text-blue-600', bg: 'bg-blue-50' },
  idle: { label: 'Idle Alert', color: 'text-yellow-600', bg: 'bg-yellow-50' },
}

const severityConfig = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-600',
}

const emptyZoneForm = { name: '', type: 'service_area', center: '', radius: '', description: '', alertOnExit: false, alertOnEntry: false }

export default function Geofencing() {
  const { toast } = useToast()
  const [zoneList, setZoneList] = useState(zones)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedZone, setSelectedZone] = useState(null)
  const [addForm, setAddForm] = useState(emptyZoneForm)
  const [editForm, setEditForm] = useState(emptyZoneForm)

  const toggleZone = (id) => {
    setZoneList(prev => prev.map(z => z.id === id ? { ...z, active: !z.active } : z))
  }

  const activeAlerts = alertLog.filter(a => !a.resolved)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-100 border border-orange-200">
            <Shield className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Geofencing</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Set zones and alert if vehicle off-route</p>
          </div>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-3.5 w-3.5 mr-1" />Add Zone
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Zones', value: zoneList.length, color: 'text-gray-700', bg: 'bg-gray-50' },
          { label: 'Active Zones', value: zoneList.filter(z => z.active).length, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Active Alerts', value: activeAlerts.length, color: 'text-red-700', bg: 'bg-red-50' },
          { label: 'Vehicles Monitored', value: zoneList.reduce((a, z) => a + z.vehicles, 0), color: 'text-blue-700', bg: 'bg-blue-50' },
        ].map(s => (
          <Card key={s.label} className={`${s.bg} border-0`}>
            <CardContent className="pt-3 pb-3 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-red-700 font-semibold">
            <AlertTriangle className="h-5 w-5" />
            {activeAlerts.length} Unresolved notifications
          </div>
          {activeAlerts.map(a => (
            <div key={a.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-100">
              <div className="text-sm">
                <span className="font-medium">{a.vehicle}</span>
                <span className="text-muted-foreground ml-2">{a.driver}</span>
                <span className="text-red-600 ml-2">— {a.note}</span>
              </div>
              <Button size="sm" variant="outline" className="h-7 px-2 text-xs border-red-200 text-red-600" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                Resolve
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zone List */}
        <div className="space-y-3">
          <h2 className="font-semibold text-base flex items-center gap-2">
            <MapPin className="h-4 w-4 text-orange-600" />Geofence Zones ({zoneList.length})
          </h2>
          {zoneList.map(zone => (
            <Card key={zone.id} className={`border ${!zone.active ? 'opacity-60' : ''}`}>
              <CardContent className="pt-3 pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{zone.name}</span>
                      <Badge className={`text-xs ${zoneTypeConfig[zone.type].color}`}>
                        {zoneTypeConfig[zone.type].label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{zone.description}</p>
                  </div>
                  <Switch checked={zone.active} onCheckedChange={() => toggleZone(zone.id)} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                  <div><p className="text-muted-foreground">Center</p><p className="font-medium">{zone.center}</p></div>
                  <div><p className="text-muted-foreground">Radius</p><p className="font-medium">{zone.radius}</p></div>
                  <div><p className="text-muted-foreground">Vehicles in Zone</p><p className="font-medium">{zone.vehicles}</p></div>
                  <div>
                    <p className="text-muted-foreground">Alerts</p>
                    <div className="flex gap-2">
                      {zone.alertOnExit && <span className="text-red-600 font-medium">Exit ✓</span>}
                      {zone.alertOnEntry && <span className="text-blue-600 font-medium">Entry ✓</span>}
                      {!zone.alertOnExit && !zone.alertOnEntry && <span className="text-gray-400">None</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => {
                    setSelectedZone(zone)
                    setEditForm({ name: zone.name, type: zone.type, center: zone.center, radius: zone.radius, description: zone.description, alertOnExit: zone.alertOnExit, alertOnEntry: zone.alertOnEntry })
                    setIsEditOpen(true)
                  }}>
                    <Edit className="h-3 w-3 mr-1" />Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-red-500" onClick={() => {
                    setZoneList(prev => prev.filter(z => z.id !== zone.id))
                    toast({ title: 'Zone Deleted', description: `${zone.name} removed` })
                  }}>
                    <Trash2 className="h-3 w-3 mr-1" />Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alert Log */}
        <div className="space-y-3">
          <h2 className="font-semibold text-base flex items-center gap-2">
            <Bell className="h-4 w-4 text-orange-600" />Alert Log (Last 24 hours)
          </h2>
          {alertLog.map(alert => {
            const typeCfg = alertTypeConfig[alert.type]
            return (
              <Card key={alert.id} className={`border ${alert.resolved ? 'opacity-60' : 'border-orange-200'}`}>
                <CardContent className="pt-3 pb-3">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                      <Badge className={`text-xs ${severityConfig[alert.severity]}`}>{alert.severity}</Badge>
                      <Badge className={`text-xs ${alert.resolved ? 'bg-gray-100 text-gray-500' : 'bg-orange-100 text-orange-700'}`}>
                        {alert.resolved ? 'Resolved' : 'Active'}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm font-medium">{alert.vehicle} — {alert.driver}</p>
                  <p className={`text-xs mt-0.5 ${typeCfg.color}`}>{typeCfg.label}: {alert.zone}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.note}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Booking: {alert.booking}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
      {/* Add Zone Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Geofence Zone</DialogTitle>
            <DialogDescription>Set new zones for vehicle tracking</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Zone Name *</Label>
              <Input placeholder="e.g. Phuket Airport Zone" value={addForm.name}
                onChange={e => setAddForm({...addForm, name: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Zone Type</Label>
              <Select value={addForm.type} onValueChange={v => setAddForm({...addForm, type: v})}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup_dropoff">Pickup/Dropoff</SelectItem>
                  <SelectItem value="service_area">Service Area</SelectItem>
                  <SelectItem value="restricted">Restricted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Radius</Label>
              <Input placeholder="e.g. 5 km" value={addForm.radius}
                onChange={e => setAddForm({...addForm, radius: e.target.value})} className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label>Center Location</Label>
              <Input placeholder="e.g. Phuket International Airport" value={addForm.center}
                onChange={e => setAddForm({...addForm, center: e.target.value})} className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Input placeholder="Zone description" value={addForm.description}
                onChange={e => setAddForm({...addForm, description: e.target.value})} className="mt-1" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={addForm.alertOnExit} onCheckedChange={v => setAddForm({...addForm, alertOnExit: v})} />
              <Label className="text-sm">Alert on Exit</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={addForm.alertOnEntry} onCheckedChange={v => setAddForm({...addForm, alertOnEntry: v})} />
              <Label className="text-sm">Alert on Entry</Label>
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
              if (!addForm.name) { toast({ title: 'Error', description: 'Zone name is required', variant: 'destructive' }); return }
              const newZone = { ...addForm, id: `Z00${zoneList.length + 1}`, active: true, vehicles: 0, alerts: 0 }
              setZoneList([...zoneList, newZone])
              setIsAddOpen(false)
              setAddForm(emptyZoneForm)
              toast({ title: 'Zone Added', description: `${addForm.name} created successfully` })
            }}>Add Zone</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Zone Dialog */}
      {selectedZone && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Zone</DialogTitle>
              <DialogDescription>Edit Information {selectedZone.name}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Zone Name</Label>
                <Input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="mt-1" />
              </div>
              <div>
                <Label>Zone Type</Label>
                <Select value={editForm.type} onValueChange={v => setEditForm({...editForm, type: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pickup_dropoff">Pickup/Dropoff</SelectItem>
                    <SelectItem value="service_area">Service Area</SelectItem>
                    <SelectItem value="restricted">Restricted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Radius</Label>
                <Input value={editForm.radius} onChange={e => setEditForm({...editForm, radius: e.target.value})} className="mt-1" />
              </div>
              <div className="col-span-2">
                <Label>Center Location</Label>
                <Input value={editForm.center} onChange={e => setEditForm({...editForm, center: e.target.value})} className="mt-1" />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={editForm.alertOnExit} onCheckedChange={v => setEditForm({...editForm, alertOnExit: v})} />
                <Label className="text-sm">Alert on Exit</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={editForm.alertOnEntry} onCheckedChange={v => setEditForm({...editForm, alertOnEntry: v})} />
                <Label className="text-sm">Alert on Entry</Label>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
                setZoneList(prev => prev.map(z => z.id === selectedZone.id ? { ...z, ...editForm } : z))
                setIsEditOpen(false)
                toast({ title: 'Zone Updated', description: `${editForm.name} updated successfully` })
              }}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
