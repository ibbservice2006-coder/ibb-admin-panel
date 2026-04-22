import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Smartphone, Send, Edit, Plus, Bell, BellOff,
  TrendingUp, Users, Zap, Target, BarChart2, Globe
} from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

const pushStats = [
  { month: 'Oct', sent: 8640, delivered: 8208, opened: 2592, ctr: 30.0 },
  { month: 'Nov', sent: 9820, delivered: 9329, opened: 2888, ctr: 29.4 },
  { month: 'Dec', sent: 14200, delivered: 13490, opened: 4260, ctr: 30.0 },
  { month: 'Jan', sent: 11400, delivered: 10830, opened: 3306, ctr: 29.0 },
  { month: 'Feb', sent: 12600, delivered: 11970, opened: 3654, ctr: 29.0 },
  { month: 'Mar', sent: 14800, delivered: 14060, opened: 4292, ctr: 29.0 },
]

const deviceBreakdown = [
  { name: 'Android', value: 58.4, color: '#10b981' },
  { name: 'iOS', value: 36.2, color: '#3b82f6' },
  { name: 'Web Browser', value: 5.4, color: '#8b5cf6' },
]

const pushTemplates = [
  { id: 'PT-001', name: 'Booking Confirmed', body: 'Your booking {{id}} is confirmed! {{route}}', trigger: 'On booking created', sent: 2840, ctr: 42.8, status: 'active', category: 'transactional', deeplink: '/bookings/{{id}}' },
  { id: 'PT-002', name: 'Driver On The Way', body: 'Driver {{name}} is on the way! ETA {{eta}} min', trigger: 'On driver dispatched', sent: 2640, ctr: 68.4, status: 'active', category: 'realtime', deeplink: '/tracking/{{id}}' },
  { id: 'PT-003', name: 'Trip Starting Soon (30m)', body: 'Your trip starts in 30 minutes. Be ready!', trigger: '30 min before trip', sent: 2420, ctr: 52.1, status: 'active', category: 'reminder', deeplink: '/bookings/{{id}}' },
  { id: 'PT-004', name: 'Driver Arrived', body: 'Your driver has arrived at the pickup point!', trigger: 'On driver arrived', sent: 2380, ctr: 74.6, status: 'active', category: 'realtime', deeplink: '/tracking/{{id}}' },
  { id: 'PT-005', name: 'Trip Completed', body: 'Trip completed! Rate your experience with {{driver}}', trigger: 'On trip completed', sent: 2240, ctr: 38.2, status: 'active', category: 'transactional', deeplink: '/review/{{id}}' },
  { id: 'PT-006', name: 'Payment Success', body: 'Payment ฿{{amount}} received. Thank you!', trigger: 'On payment success', sent: 2640, ctr: 28.4, status: 'active', category: 'transactional', deeplink: '/receipts/{{id}}' },
  { id: 'PT-007', name: 'Promo: Flash Sale', body: '⚡ Flash Sale! {{pct}}% off next 2 hours. Code: {{code}}', trigger: 'Manual', sent: 4418, ctr: 22.6, status: 'active', category: 'marketing', deeplink: '/promo/{{code}}' },
  { id: 'PT-008', name: 'New Route Available', body: '🚐 New route: {{from}} → {{to}} now available!', trigger: 'Manual', sent: 4418, ctr: 18.4, status: 'active', category: 'marketing', deeplink: '/routes' },
  { id: 'PT-009', name: 'Membership Upgrade', body: '🎉 Congratulations! You\'ve been upgraded to {{tier}}!', trigger: 'On tier upgrade', sent: 248, ctr: 82.4, status: 'active', category: 'membership', deeplink: '/membership' },
  { id: 'PT-010', name: 'Wallet Low Balance', body: 'Wallet balance low (฿{{balance}}). Top up now!', trigger: 'Balance < ฿200', sent: 420, ctr: 56.8, status: 'active', category: 'payment', deeplink: '/wallet/topup' },
]

const categoryColor = {
  transactional: 'bg-blue-100 text-blue-700',
  realtime: 'bg-green-100 text-green-700',
  reminder: 'bg-yellow-100 text-yellow-700',
  marketing: 'bg-purple-100 text-purple-700',
  membership: 'bg-pink-100 text-pink-700',
  payment: 'bg-orange-100 text-orange-700',
}

const subscriberSegments = [
  { segment: 'All Users', count: 4418, opted_in: 3854, rate: 87.2 },
  { segment: 'VVIP', count: 156, opted_in: 154, rate: 98.7 },
  { segment: 'VIP', count: 842, opted_in: 820, rate: 97.4 },
  { segment: 'General', count: 3420, opted_in: 2880, rate: 84.2 },
]

export default function PushNotifications() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('templates')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSendTestOpen, setIsSendTestOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [addForm, setAddForm] = useState({ name: '', category: 'transactional', trigger: '', body: '', deeplink: '' })
  const { toast } = useToast()

  const totalSent = pushStats.reduce((a, m) => a + m.sent, 0)
  const totalOpened = pushStats.reduce((a, m) => a + m.opened, 0)
  const avgCTR = (totalOpened / totalSent * 100).toFixed(1)
  const avgDelivery = (pushStats.reduce((a, m) => a + m.delivered, 0) / totalSent * 100).toFixed(1)

  const filtered = pushTemplates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-100 border border-purple-200">
            <Smartphone className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Push Notifications</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Manage Push Templates, Segments, and Real-time Triggers</p>
          </div>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white gap-1.5" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-3.5 w-3.5" />New Template
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Sent (6M)', value: totalSent.toLocaleString(), sub: 'All push types', color: 'text-purple-700', bg: 'bg-purple-50', icon: Bell },
          { label: 'Delivery Rate', value: `${avgDelivery}%`, sub: 'Android + iOS + Web', color: 'text-green-700', bg: 'bg-green-50', icon: TrendingUp },
          { label: 'Avg CTR', value: `${avgCTR}%`, sub: 'Click-through rate', color: 'text-blue-700', bg: 'bg-blue-50', icon: Target },
          { label: 'Opted-in Users', value: '3,854', sub: '87.2% of all users', color: 'text-orange-700', bg: 'bg-orange-50', icon: Users },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Push Volume Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base">Push Notification Volume & CTR</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={pushStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} domain={[25, 35]} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar yAxisId="left" dataKey="sent" name="Sent" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="ctr" name="CTR %" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base">Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={deviceBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value">
                  {deviceBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={v => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {deviceBreakdown.map(d => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span>{d.name}</span>
                  </div>
                  <span className="font-bold">{d.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscriber Segments */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />Push Opt-in by Segment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {subscriberSegments.map(s => (
              <div key={s.segment} className="bg-gray-50 rounded-lg p-3 border">
                <p className="text-xs font-bold">{s.segment}</p>
                <p className="text-lg font-bold text-purple-700 mt-1">{s.opted_in.toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${s.rate}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{s.rate}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {['templates', 'analytics'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'templates' && (
        <Card>
          <CardHeader className="pb-2 pt-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Push Templates ({filtered.length})</CardTitle>
              <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 text-sm w-48" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {filtered.map(t => (
                <div key={t.id} className="px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-bold">{t.name}</span>
                        <Badge className={`text-xs ${categoryColor[t.category]}`}>{t.category}</Badge>
                        <Badge className="text-xs bg-blue-50 text-blue-700">CTR {t.ctr}%</Badge>
                      </div>
                      <p className="text-xs bg-gray-50 rounded px-2 py-1 font-mono text-gray-600">{t.body}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">Trigger: {t.trigger}</span>
                        <span className="text-xs text-muted-foreground">Sent: {t.sent.toLocaleString()}</span>
                        <span className="text-xs font-mono text-muted-foreground">→ {t.deeplink}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => { setSelectedTemplate(t); setIsEditOpen(true) }}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => { setSelectedTemplate(t); setIsSendTestOpen(true) }}>
                        <Send className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'analytics' && (
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base">CTR by Template Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { cat: 'Membership Upgrade', ctr: 82.4, color: '#ec4899' },
                { cat: 'Driver Arrived (Realtime)', ctr: 74.6, color: '#10b981' },
                { cat: 'Driver On The Way', ctr: 68.4, color: '#22c55e' },
                { cat: 'Wallet Low Balance', ctr: 56.8, color: '#f97316' },
                { cat: 'Trip Starting Soon', ctr: 52.1, color: '#f59e0b' },
                { cat: 'Booking Confirmed', ctr: 42.8, color: '#3b82f6' },
                { cat: 'Trip Completed', ctr: 38.2, color: '#6366f1' },
                { cat: 'Payment Success', ctr: 28.4, color: '#8b5cf6' },
                { cat: 'Marketing (Flash Sale)', ctr: 22.6, color: '#a855f7' },
                { cat: 'Marketing (New Route)', ctr: 18.4, color: '#94a3b8' },
              ].map(item => (
                <div key={item.cat} className="flex items-center gap-3">
                  <span className="text-xs font-medium w-48 flex-shrink-0">{item.cat}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className="h-2 rounded-full" style={{ width: `${item.ctr}%`, backgroundColor: item.color }} />
                  </div>
                  <span className="text-xs font-bold w-10 text-right">{item.ctr}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      {/* New Template Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Push Template</DialogTitle>
            <DialogDescription>Create new Push Notification Template</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Template Name *</Label>
              <Input placeholder="e.g. Booking Confirmed" value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Category</Label>
                <Select value={addForm.category} onValueChange={v => setAddForm({...addForm, category: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transactional">Transactional</SelectItem>
                    <SelectItem value="realtime">Realtime</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="membership">Membership</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Trigger</Label>
                <Input placeholder="e.g. On booking created" value={addForm.trigger} onChange={e => setAddForm({...addForm, trigger: e.target.value})} className="mt-1" /></div>
            </div>
            <div><Label>Message Body *</Label>
              <Textarea placeholder="e.g. Your booking {{id}} is confirmed!" value={addForm.body} onChange={e => setAddForm({...addForm, body: e.target.value})} className="mt-1" rows={3} /></div>
            <div><Label>Deep Link URL</Label>
              <Input placeholder="e.g. /bookings/{{id}}" value={addForm.deeplink} onChange={e => setAddForm({...addForm, deeplink: e.target.value})} className="mt-1" /></div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
              if (!addForm.name || !addForm.body) { toast({ title: 'Error', description: 'Name and body are required', variant: 'destructive' }); return }
              setIsAddOpen(false); setAddForm({ name: '', category: 'transactional', trigger: '', body: '', deeplink: '' })
              toast({ title: 'Push Template Created', description: `"${addForm.name}" created successfully` })
            }}>Create Template</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {selectedTemplate && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Push Template</DialogTitle>
              <DialogDescription>{selectedTemplate.id}: {selectedTemplate.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div><Label>Template Name</Label><Input defaultValue={selectedTemplate.name} className="mt-1" /></div>
              <div><Label>Trigger</Label><Input defaultValue={selectedTemplate.trigger} className="mt-1" /></div>
              <div><Label>Message Body</Label><Textarea defaultValue={selectedTemplate.body} className="mt-1" rows={3} /></div>
              <div><Label>Deep Link</Label><Input defaultValue={selectedTemplate.deeplink} className="mt-1" /></div>
            </div>
            <div className="flex gap-2 justify-end mt-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setIsEditOpen(false); toast({ title: 'Template Updated', description: `"${selectedTemplate.name}" updated` }) }}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Send Test Dialog */}
      {selectedTemplate && (
        <Dialog open={isSendTestOpen} onOpenChange={setIsSendTestOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Send Test Push</DialogTitle>
              <DialogDescription>Send test push for: {selectedTemplate.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div><Label>Device / User ID</Label><Input defaultValue="admin-device" className="mt-1" /></div>
              <div className="bg-gray-50 rounded p-3 text-xs font-mono text-gray-600">{selectedTemplate.body}</div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="outline" size="sm" onClick={() => setIsSendTestOpen(false)}>Cancel</Button>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => {
                setIsSendTestOpen(false)
                toast({ title: 'Test Push Sent', description: `"${selectedTemplate.name}" sent to test device` })
              }}>Send Test</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
