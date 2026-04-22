import { useState } from 'react'
import { Webhook, Plus, Trash2, Play, Pause, Copy, CheckCircle, XCircle, Clock, RefreshCw, ChevronDown, ChevronRight, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'

const FAVICON_URL = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=32`

const EVENT_GROUPS = {
  'Booking': ['booking.created', 'booking.confirmed', 'booking.cancelled', 'booking.completed', 'booking.updated'],
  'Payment': ['payment.received', 'payment.failed', 'payment.refunded', 'payment.pending'],
  'Driver': ['driver.assigned', 'driver.arrived', 'driver.completed', 'driver.location_updated'],
  'Customer': ['customer.registered', 'customer.updated', 'customer.deleted'],
  'Vehicle': ['vehicle.maintenance_due', 'vehicle.status_changed', 'vehicle.assigned'],
}

const ALL_EVENTS = Object.values(EVENT_GROUPS).flat()

const INITIAL_WEBHOOKS = [
  {
    id: 1,
    name: 'Booking Notifications',
    url: 'https://hooks.example.com/booking',
    events: ['booking.created', 'booking.confirmed', 'booking.cancelled'],
    status: 'active',
    secret: 'whsec_abc123xyz456',
    method: 'POST',
    successRate: 98.5,
    totalCalls: 1250,
    failedCalls: 19,
    lastTriggered: '2025-10-06 16:48:00',
    createdAt: '2025-09-15',
  },
  {
    id: 2,
    name: 'Payment Gateway Sync',
    url: 'https://payments.example.com/webhook',
    events: ['payment.received', 'payment.failed', 'payment.refunded'],
    status: 'active',
    secret: 'whsec_def456uvw789',
    method: 'POST',
    successRate: 99.2,
    totalCalls: 890,
    failedCalls: 7,
    lastTriggered: '2025-10-06 16:45:00',
    createdAt: '2025-09-18',
  },
  {
    id: 3,
    name: 'CRM Integration',
    url: 'https://crm.example.com/ibb-hook',
    events: ['customer.registered', 'customer.updated', 'booking.completed'],
    status: 'active',
    secret: 'whsec_ghi789rst012',
    method: 'POST',
    successRate: 97.1,
    totalCalls: 430,
    failedCalls: 12,
    lastTriggered: '2025-10-06 16:40:00',
    createdAt: '2025-09-20',
  },
  {
    id: 4,
    name: 'Fleet Management System',
    url: 'https://fleet.internal.com/webhook',
    events: ['driver.assigned', 'vehicle.status_changed', 'vehicle.maintenance_due'],
    status: 'paused',
    secret: 'whsec_jkl012mno345',
    method: 'POST',
    successRate: 95.0,
    totalCalls: 210,
    failedCalls: 11,
    lastTriggered: '2025-10-05 14:00:00',
    createdAt: '2025-10-01',
  },
]

const DELIVERY_LOGS = [
  { id: 1, webhook: 'Booking Notifications', event: 'booking.created', time: '2025-10-06 16:48', status: 'success', code: 200, duration: '145ms', attempt: 1 },
  { id: 2, webhook: 'Payment Gateway Sync', event: 'payment.received', time: '2025-10-06 16:45', status: 'success', code: 200, duration: '320ms', attempt: 1 },
  { id: 3, webhook: 'CRM Integration', event: 'customer.registered', time: '2025-10-06 16:40', status: 'success', code: 201, duration: '280ms', attempt: 1 },
  { id: 4, webhook: 'Booking Notifications', event: 'booking.cancelled', time: '2025-10-06 16:35', status: 'failed', code: 500, duration: '—', attempt: 3 },
  { id: 5, webhook: 'Payment Gateway Sync', event: 'payment.failed', time: '2025-10-06 16:30', status: 'success', code: 200, duration: '410ms', attempt: 1 },
  { id: 6, webhook: 'Fleet Management System', event: 'vehicle.status_changed', time: '2025-10-05 14:00', status: 'failed', code: 503, duration: '—', attempt: 3 },
]

function ServiceIcon({ domain, name, size = 16 }) {
  return (
    <img
      src={FAVICON_URL(domain)}
      alt={name}
      width={size}
      height={size}
      className="rounded"
      onError={(e) => { e.target.style.display = 'none' }}
    />
  )
}

export default function IntegrationsWebhooks() {
  const { toast } = useToast()
  const [webhooks, setWebhooks] = useState(INITIAL_WEBHOOKS)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [showSecret, setShowSecret] = useState({})
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [formData, setFormData] = useState({ name: '', url: '', events: [], method: 'POST' })

  const toggleStatus = (id) => {
    const wh = webhooks.find(w => w.id === id)
    setWebhooks(prev => prev.map(w => w.id === id ? { ...w, status: w.status === 'active' ? 'paused' : 'active' } : w))
    toast({ title: wh?.status === 'active' ? 'Webhook Paused' : 'Webhook Activated', description: wh?.name })
  }

  const handleTest = (wh) => {
    toast({ title: 'Test Payload Sent', description: `Test event sent to ${wh.url}` })
  }

  const handleAdd = () => {
    if (!formData.name || !formData.url || formData.events.length === 0) {
      toast({ title: 'Missing fields', description: 'Name, URL and at least one event are required.', variant: 'destructive' })
      return
    }
    const secret = 'whsec_' + Math.random().toString(36).slice(2, 14)
    setWebhooks(prev => [...prev, {
      id: Date.now(), ...formData, secret, status: 'active',
      successRate: 100, totalCalls: 0, failedCalls: 0,
      lastTriggered: 'Never', createdAt: new Date().toISOString().split('T')[0]
    }])
    setFormData({ name: '', url: '', events: [], method: 'POST' })
    setShowAddDialog(false)
    toast({ title: 'Webhook Created', description: `${formData.name} is now active.` })
  }

  const handleDelete = (id) => {
    setWebhooks(prev => prev.filter(w => w.id !== id))
    setDeleteTarget(null)
    toast({ title: 'Webhook Deleted' })
  }

  const toggleEvent = (event) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(event) ? prev.events.filter(e => e !== event) : [...prev.events, event]
    }))
  }

  const activeCount = webhooks.filter(w => w.status === 'active').length
  const totalCalls = webhooks.reduce((s, w) => s + w.totalCalls, 0)
  const failedLogs = DELIVERY_LOGS.filter(l => l.status === 'failed').length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Webhooks</h1>
          <p className="text-muted-foreground mt-2">Send real-time event notifications to external endpoints</p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Webhook
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Total Webhooks</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{webhooks.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">{activeCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Total Deliveries</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalCalls.toLocaleString()}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Failed (Recent)</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-red-600">{failedLogs}</div></CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="webhooks">
        <TabsList>
          <TabsTrigger value="webhooks"><Webhook className="w-4 h-4 mr-2" />Webhooks</TabsTrigger>
          <TabsTrigger value="logs"><Clock className="w-4 h-4 mr-2" />Delivery Logs</TabsTrigger>
        </TabsList>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configured Webhooks</CardTitle>
              <CardDescription>Manage webhook endpoints that receive IBB event notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {webhooks.map(wh => (
                <div key={wh.id} className={`border rounded-lg p-4 space-y-3 ${wh.status === 'paused' ? 'opacity-60' : ''}`}>
                  {/* Row 1: Name + status + actions */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Webhook className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">{wh.name}</span>
                      <Badge variant={wh.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                        {wh.status === 'active' ? 'Active' : 'Paused'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => handleTest(wh)}>
                        <Play className="w-3 h-3" /> Test
                      </Button>
                      <Button variant="ghost" size="icon" title={wh.status === 'active' ? 'Pause' : 'Resume'} onClick={() => toggleStatus(wh.id)}>
                        {wh.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleteTarget(wh)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setExpandedId(expandedId === wh.id ? null : wh.id)}>
                        {expandedId === wh.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Row 2: URL */}
                  <div>
                    <code className="text-sm bg-muted px-3 py-1.5 rounded font-mono block truncate">{wh.url}</code>
                  </div>

                  {/* Row 3: Events */}
                  <div className="flex flex-wrap gap-1">
                    {wh.events.map(e => (
                      <Badge key={e} variant="outline" className="text-xs font-mono">{e}</Badge>
                    ))}
                  </div>

                  {/* Row 4: Metadata columns */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Success Rate</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`font-medium ${wh.successRate >= 98 ? 'text-green-600' : wh.successRate >= 95 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {wh.successRate}%
                        </span>
                        <Progress value={wh.successRate} className="h-1.5 flex-1" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Deliveries</p>
                      <p className="font-medium mt-0.5">{wh.totalCalls.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Failed</p>
                      <p className="font-medium mt-0.5 text-red-600">{wh.failedCalls}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Last Triggered</p>
                      <p className="font-medium mt-0.5 text-xs">{wh.lastTriggered}</p>
                    </div>
                  </div>

                  {/* Expanded: Signing Secret */}
                  {expandedId === wh.id && (
                    <div className="pt-3 border-t space-y-2">
                      <Label className="text-xs text-muted-foreground">Signing Secret</Label>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-muted px-3 py-1.5 rounded font-mono flex-1">
                          {showSecret[wh.id] ? wh.secret : '••••••••••••••••••••'}
                        </code>
                        <Button variant="ghost" size="icon" onClick={() => setShowSecret(p => ({ ...p, [wh.id]: !p[wh.id] }))}>
                          {showSecret[wh.id] ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { navigator.clipboard.writeText(wh.secret); toast({ title: 'Copied' }) }}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Created: {wh.createdAt} · Method: {wh.method}</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery Logs Tab */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Clock className="w-4 h-4" /> Delivery History</CardTitle>
              <CardDescription>Recent webhook delivery attempts and results</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Webhook</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Attempts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DELIVERY_LOGS.map(log => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium text-sm">{log.webhook}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs font-mono">{log.event}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{log.time}</TableCell>
                      <TableCell>
                        {log.status === 'success'
                          ? <span className="flex items-center gap-1 text-green-600 text-xs"><CheckCircle className="w-3.5 h-3.5" /> Success</span>
                          : <span className="flex items-center gap-1 text-red-600 text-xs"><XCircle className="w-3.5 h-3.5" /> Failed</span>
                        }
                      </TableCell>
                      <TableCell>
                        <Badge variant={log.code < 300 ? 'default' : 'destructive'} className="text-xs">{log.code}</Badge>
                      </TableCell>
                      <TableCell className="text-xs">{log.duration}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{log.attempt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Webhook Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Webhook</DialogTitle>
            <DialogDescription>Configure a new endpoint to receive IBB event notifications</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Webhook Name</Label>
              <Input placeholder="e.g. My CRM Integration" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Endpoint URL</Label>
              <Input placeholder="https://your-server.com/webhook" value={formData.url} onChange={e => setFormData(p => ({ ...p, url: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>HTTP Method</Label>
              <Select value={formData.method} onValueChange={v => setFormData(p => ({ ...p, method: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Subscribe to Events</Label>
              <div className="border rounded-md p-3 max-h-52 overflow-y-auto space-y-3">
                {Object.entries(EVENT_GROUPS).map(([group, events]) => (
                  <div key={group}>
                    <p className="text-xs font-semibold text-muted-foreground mb-1.5">{group}</p>
                    <div className="grid grid-cols-2 gap-1">
                      {events.map(event => (
                        <label key={event} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-muted rounded px-1 py-0.5">
                          <input type="checkbox" checked={formData.events.includes(event)} onChange={() => toggleEvent(event)} />
                          <span className="font-mono">{event}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {formData.events.length > 0 && (
                <p className="text-xs text-muted-foreground">{formData.events.length} event(s) selected</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleAdd}>Create Webhook</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      {deleteTarget && (
        <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Webhook?</DialogTitle>
              <DialogDescription>
                <strong>{deleteTarget.name}</strong> will stop receiving events immediately.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button size="sm" variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(deleteTarget.id)}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
