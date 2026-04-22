import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Zap, Plus, Edit, Trash2, ToggleLeft, ToggleRight,
  Mail, MessageSquare, Smartphone, Bell, Clock, Filter,
  CheckCircle, AlertTriangle, Settings, ArrowRight, Users
} from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

const notificationRules = [
  {
    id: 'NR-001', name: 'Booking Confirmed — All Channels', status: 'active', priority: 1,
    trigger: 'booking.created', condition: 'status == "confirmed"',
    channels: ['email', 'sms', 'push'],
    templates: { email: 'ET-001', sms: 'ST-002', push: 'PT-001' },
    audience: 'Customer', delay: 0, fired: 2840, lastFired: '2 min ago',
    category: 'booking'
  },
  {
    id: 'NR-002', name: 'OTP Verification — SMS Only', status: 'active', priority: 1,
    trigger: 'auth.otp_requested', condition: 'always',
    channels: ['sms'],
    templates: { sms: 'ST-001' },
    audience: 'Customer', delay: 0, fired: 8420, lastFired: '30 sec ago',
    category: 'security'
  },
  {
    id: 'NR-003', name: 'Driver Assigned — Push + SMS', status: 'active', priority: 2,
    trigger: 'booking.driver_assigned', condition: 'always',
    channels: ['push', 'sms'],
    templates: { push: 'PT-002', sms: 'ST-003' },
    audience: 'Customer', delay: 0, fired: 2640, lastFired: '5 min ago',
    category: 'realtime'
  },
  {
    id: 'NR-004', name: 'Trip Reminder 24h — Email + Push', status: 'active', priority: 2,
    trigger: 'schedule.24h_before_trip', condition: 'booking.status == "confirmed"',
    channels: ['email', 'push'],
    templates: { email: 'ET-003', push: 'PT-003' },
    audience: 'Customer', delay: 0, fired: 1820, lastFired: '1 hr ago',
    category: 'reminder'
  },
  {
    id: 'NR-005', name: 'Trip Reminder 2h — SMS + Push', status: 'active', priority: 2,
    trigger: 'schedule.2h_before_trip', condition: 'booking.status == "confirmed"',
    channels: ['sms', 'push'],
    templates: { sms: 'ST-004', push: 'PT-003' },
    audience: 'Customer', delay: 0, fired: 1680, lastFired: '2 hr ago',
    category: 'reminder'
  },
  {
    id: 'NR-006', name: 'Driver Arrived — Push Only', status: 'active', priority: 1,
    trigger: 'trip.driver_arrived', condition: 'always',
    channels: ['push'],
    templates: { push: 'PT-004' },
    audience: 'Customer', delay: 0, fired: 2380, lastFired: '15 min ago',
    category: 'realtime'
  },
  {
    id: 'NR-007', name: 'Payment Success — Email + Push', status: 'active', priority: 2,
    trigger: 'payment.success', condition: 'always',
    channels: ['email', 'push'],
    templates: { email: 'ET-002', push: 'PT-006' },
    audience: 'Customer', delay: 0, fired: 2640, lastFired: '8 min ago',
    category: 'payment'
  },
  {
    id: 'NR-008', name: 'Payment Failed — SMS + Push', status: 'active', priority: 1,
    trigger: 'payment.failed', condition: 'retry_count >= 1',
    channels: ['sms', 'push'],
    templates: { sms: 'ST-005', push: 'PT-010' },
    audience: 'Customer', delay: 0, fired: 284, lastFired: '6 hr ago',
    category: 'payment'
  },
  {
    id: 'NR-009', name: 'Booking Cancelled — All Channels', status: 'active', priority: 2,
    trigger: 'booking.cancelled', condition: 'always',
    channels: ['email', 'sms', 'push'],
    templates: { email: 'ET-006', sms: 'ST-006', push: 'PT-001' },
    audience: 'Customer', delay: 0, fired: 284, lastFired: '5 hr ago',
    category: 'booking'
  },
  {
    id: 'NR-010', name: 'Membership Upgrade — Email + Push', status: 'active', priority: 2,
    trigger: 'membership.tier_upgraded', condition: 'always',
    channels: ['email', 'push'],
    templates: { email: 'ET-008', push: 'PT-009' },
    audience: 'Customer', delay: 0, fired: 248, lastFired: '2 days ago',
    category: 'membership'
  },
  {
    id: 'NR-011', name: 'Wallet Low Balance — Push Only', status: 'active', priority: 3,
    trigger: 'wallet.balance_low', condition: 'balance < 200',
    channels: ['push'],
    templates: { push: 'PT-010' },
    audience: 'Customer', delay: 0, fired: 420, lastFired: '3 hr ago',
    category: 'payment'
  },
  {
    id: 'NR-012', name: 'Weekly Summary — Email Only', status: 'active', priority: 3,
    trigger: 'schedule.weekly_monday_9am', condition: 'has_bookings_this_week',
    channels: ['email'],
    templates: { email: 'ET-010' },
    audience: 'Customer', delay: 0, fired: 842, lastFired: '3 days ago',
    category: 'report'
  },
  {
    id: 'NR-013', name: 'Promo Blast — All Channels', status: 'draft', priority: 3,
    trigger: 'manual', condition: 'membership.tier in ["VVIP","VIP","General"]',
    channels: ['email', 'sms', 'push'],
    templates: { email: 'ET-009', sms: 'ST-007', push: 'PT-007' },
    audience: 'All Users (4,418)', delay: 0, fired: 0, lastFired: 'Never',
    category: 'marketing'
  },
]

const channelIcon = { email: Mail, sms: MessageSquare, push: Smartphone }
const channelColor = { email: 'text-blue-600 bg-blue-50', sms: 'text-green-600 bg-green-50', push: 'text-purple-600 bg-purple-50' }
const categoryColor = {
  booking: 'bg-blue-100 text-blue-700',
  security: 'bg-red-100 text-red-700',
  realtime: 'bg-green-100 text-green-700',
  reminder: 'bg-yellow-100 text-yellow-700',
  payment: 'bg-orange-100 text-orange-700',
  membership: 'bg-pink-100 text-pink-700',
  report: 'bg-gray-100 text-gray-600',
  marketing: 'bg-purple-100 text-purple-700',
}

export default function NotificationRules() {
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [rules, setRules] = useState(notificationRules)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState(null)
  const [addForm, setAddForm] = useState({ name: '', trigger: '', condition: '', channels: 'push', audience: 'Customer', category: 'booking' })
  const { toast } = useToast()

  const toggleRule = (id) => {
    setRules(prev => prev.map(r => r.id === id
      ? { ...r, status: r.status === 'active' ? 'paused' : 'active' }
      : r
    ))
    const rule = rules.find(r => r.id === id)
    toast({ title: rule.status === 'active' ? 'Rule Paused' : 'Rule Activated', description: rule.name })
  }

  const categories = ['all', ...Array.from(new Set(notificationRules.map(r => r.category)))]

  const filtered = rules.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.trigger.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'all' || r.category === filterCat
    return matchSearch && matchCat
  })

  const activeCount = rules.filter(r => r.status === 'active').length
  const totalFired = rules.reduce((a, r) => a + r.fired, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-100 border border-orange-200">
            <Zap className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notification Rules</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Automation rules — set triggers, conditions, and channels for notifications</p>
          </div>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white gap-1.5" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-3.5 w-3.5" />New Rule
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Active Rules', value: activeCount, sub: `${rules.length} total`, color: 'text-green-700', bg: 'bg-green-50', icon: CheckCircle },
          { label: 'Total Fired (All Time)', value: totalFired.toLocaleString(), sub: 'All rules combined', color: 'text-blue-700', bg: 'bg-blue-50', icon: Zap },
          { label: 'Channels Covered', value: '3', sub: 'Email, SMS, Push', color: 'text-purple-700', bg: 'bg-purple-50', icon: Bell },
          { label: 'Draft Rules', value: rules.filter(r => r.status === 'draft').length, sub: 'Pending activation', color: 'text-yellow-700', bg: 'bg-yellow-50', icon: AlertTriangle },
        ].map(s => (
          <Card key={s.label} className={`${s.bg} border-0`}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
                </div>
                <s.icon className={`h-6 w-6 ${s.color} opacity-60`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-48">
          <Input placeholder="Search rule..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 text-sm pl-3" />
        </div>
        <div className="flex flex-wrap gap-1">
          {categories.map(cat => (
            <Button key={cat} size="sm" variant={filterCat === cat ? 'default' : 'outline'}
              onClick={() => setFilterCat(cat)} className="text-xs h-8 capitalize">{cat}</Button>
          ))}
        </div>
      </div>

      {/* Rules List */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base">Automation Rules ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filtered.map(rule => (
              <div key={rule.id} className={`px-4 py-3 hover:bg-gray-50 transition-colors ${rule.status === 'paused' ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-3">
                  {/* Priority Badge */}
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5
                    ${rule.priority === 1 ? 'bg-red-100 text-red-700' : rule.priority === 2 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                    {rule.priority}
                  </div>

                  {/* Rule Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-bold">{rule.name}</span>
                      <Badge className={`text-xs ${categoryColor[rule.category]}`}>{rule.category}</Badge>
                      <Badge className={`text-xs ${rule.status === 'active' ? 'bg-green-100 text-green-700' : rule.status === 'paused' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                        {rule.status}
                      </Badge>
                    </div>

                    {/* Trigger → Condition → Channels */}
                    <div className="flex items-center gap-1.5 flex-wrap text-xs text-muted-foreground mb-1">
                      <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-xs">{rule.trigger}</span>
                      <ArrowRight className="h-3 w-3" />
                      <span className="font-mono bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-xs">{rule.condition}</span>
                      <ArrowRight className="h-3 w-3" />
                      <div className="flex gap-1">
                        {rule.channels.map(ch => {
                          const Icon = channelIcon[ch]
                          return (
                            <span key={ch} className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs ${channelColor[ch]}`}>
                              <Icon className="h-2.5 w-2.5" />{ch}
                            </span>
                          )
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Audience: {rule.audience}</span>
                      <span>Fired: {rule.fired.toLocaleString()}</span>
                      <span>Last: {rule.lastFired}</span>
                      <span className="font-mono">{rule.id}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => { setSelectedRule(rule); setIsEditOpen(true) }}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => toggleRule(rule.id)}>
                      {rule.status === 'active'
                        ? <ToggleRight className="h-4 w-4 text-green-600" />
                        : <ToggleLeft className="h-4 w-4 text-gray-400" />
                      }
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:text-red-600"
                      onClick={() => { setSelectedRule(rule); setIsDeleteOpen(true) }}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Priority Legend */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-3">
            <Settings className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-gray-700 mb-1">Priority Levels</p>
              <div className="flex gap-4 flex-wrap text-xs text-gray-600">
                <span><span className="font-bold text-red-600">P1 — Critical:</span> OTP, Driver Arrived, Payment Failed — send immediately, no delay</span>
                <span><span className="font-bold text-yellow-600">P2 — Normal:</span> Booking, Payment, Reminders — sent by trigger</span>
                <span><span className="font-bold text-gray-500">P3 — Low:</span> Reports, Marketing — supports batch and delay</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* New Rule Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Notification Rule</DialogTitle>
            <DialogDescription>Create New Automation Rule</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Rule Name *</Label>
              <Input placeholder="e.g. Booking Confirmed — All Channels" value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Trigger Event</Label>
                <Input placeholder="e.g. booking.created" value={addForm.trigger} onChange={e => setAddForm({...addForm, trigger: e.target.value})} className="mt-1" /></div>
              <div><Label>Category</Label>
                <Select value={addForm.category} onValueChange={v => setAddForm({...addForm, category: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="booking">Booking</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="realtime">Realtime</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Condition</Label>
              <Input placeholder="e.g. status == confirmed" value={addForm.condition} onChange={e => setAddForm({...addForm, condition: e.target.value})} className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Channels</Label>
                <Select value={addForm.channels} onValueChange={v => setAddForm({...addForm, channels: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="push">Push Only</SelectItem>
                    <SelectItem value="sms">SMS Only</SelectItem>
                    <SelectItem value="email">Email Only</SelectItem>
                    <SelectItem value="push,sms">Push + SMS</SelectItem>
                    <SelectItem value="email,push">Email + Push</SelectItem>
                    <SelectItem value="email,sms,push">All Channels</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Audience</Label>
                <Select value={addForm.audience} onValueChange={v => setAddForm({...addForm, audience: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Driver">Driver</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="All">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
              if (!addForm.name || !addForm.trigger) { toast({ title: 'Error', description: 'Name and trigger are required', variant: 'destructive' }); return }
              setIsAddOpen(false); setAddForm({ name: '', trigger: '', condition: '', channels: 'push', audience: 'Customer', category: 'booking' })
              toast({ title: 'Rule Created', description: `"${addForm.name}" created and activated` })
            }}>Create Rule</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Rule Dialog */}
      {selectedRule && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Rule</DialogTitle>
              <DialogDescription>{selectedRule.id}: {selectedRule.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div><Label>Rule Name</Label><Input defaultValue={selectedRule.name} className="mt-1" /></div>
              <div><Label>Trigger Event</Label><Input defaultValue={selectedRule.trigger} className="mt-1" /></div>
              <div><Label>Condition</Label><Input defaultValue={selectedRule.condition} className="mt-1" /></div>
              <div><Label>Channels</Label><p className="text-sm mt-1 font-medium">{selectedRule.channels.join(', ')}</p></div>
            </div>
            <div className="flex gap-2 justify-end mt-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setIsEditOpen(false); toast({ title: 'Rule Updated', description: `"${selectedRule.name}" updated` }) }}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Rule Dialog */}
      {selectedRule && (
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-red-600">Delete Rule</DialogTitle>
              <DialogDescription>Confirm delete Notification Rule</DialogDescription>
            </DialogHeader>
            <p className="text-sm">Confirm delete rule <strong>"{ selectedRule.name}"</strong> Are you sure? Auto notifications will stop</p>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="outline" size="sm" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
              <Button size="sm" variant="destructive" onClick={() => {
                setRules(prev => prev.filter(r => r.id !== selectedRule.id))
                setIsDeleteOpen(false)
                toast({ title: 'Rule Deleted', description: `"${selectedRule.name}" deleted`, variant: 'destructive' })
              }}>Delete Rule</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
