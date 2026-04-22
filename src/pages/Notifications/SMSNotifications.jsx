import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  MessageSquare, Send, Edit, Plus, CheckCircle, XCircle,
  TrendingUp, DollarSign, Globe, AlertTriangle
} from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const smsStats = [
  { month: 'Oct', sent: 2140, delivered: 2098, failed: 42, cost: 6420 },
  { month: 'Nov', sent: 2380, delivered: 2332, failed: 48, cost: 7140 },
  { month: 'Dec', sent: 3420, delivered: 3352, failed: 68, cost: 10260 },
  { month: 'Jan', sent: 2640, delivered: 2588, failed: 52, cost: 7920 },
  { month: 'Feb', sent: 2880, delivered: 2824, failed: 56, cost: 8640 },
  { month: 'Mar', sent: 3180, delivered: 3118, failed: 62, cost: 9540 },
]

const smsTemplates = [
  { id: 'ST-001', name: 'OTP Verification', message: 'Your IBB OTP is {{otp}}. Valid 5 min. Do not share.', trigger: 'On login/register', sent: 8420, deliveryRate: 99.2, cost: 0.30, status: 'active', category: 'security' },
  { id: 'ST-002', name: 'Booking Confirmed', message: 'Booking {{id}} confirmed. {{route}} on {{date}} {{time}}. Driver: {{driver}}', trigger: 'On booking created', sent: 2840, deliveryRate: 98.4, cost: 0.30, status: 'active', category: 'transactional' },
  { id: 'ST-003', name: 'Driver Assigned', message: 'Driver {{name}} ({{plate}}) is assigned. ETA: {{eta}} min. Call: {{phone}}', trigger: 'On driver assigned', sent: 2640, deliveryRate: 98.2, cost: 0.30, status: 'active', category: 'transactional' },
  { id: 'ST-004', name: 'Trip Reminder (2h)', message: 'Reminder: IBB trip in 2 hrs. {{route}}. Driver: {{driver}} {{phone}}', trigger: '2h before trip', sent: 1820, deliveryRate: 97.8, cost: 0.30, status: 'active', category: 'reminder' },
  { id: 'ST-005', name: 'Payment Failed', message: 'Payment for {{id}} failed. Please update payment: {{link}}', trigger: 'On payment failed', sent: 284, deliveryRate: 98.6, cost: 0.30, status: 'active', category: 'payment' },
  { id: 'ST-006', name: 'Booking Cancelled', message: 'Booking {{id}} cancelled. Refund ฿{{amount}} in 3-5 days.', trigger: 'On cancellation', sent: 284, deliveryRate: 98.0, cost: 0.30, status: 'active', category: 'transactional' },
  { id: 'ST-007', name: 'Flash Promo (Thai)', message: 'Special IBB! {{pct}}% off until {{date}} Code: {{code}} Book: {{link}}', trigger: 'Manual / Scheduled', sent: 1240, deliveryRate: 96.8, cost: 0.30, status: 'active', category: 'marketing' },
  { id: 'ST-008', name: 'International OTP (EN)', message: 'Your IBB verification code: {{otp}}. Expires in 5 minutes.', trigger: 'On intl login', sent: 2180, deliveryRate: 97.4, cost: 0.45, status: 'active', category: 'security' },
]

const providerStats = [
  { provider: 'DTAC/True Move (TH)', sent: 6840, rate: 99.1, cost: '฿0.28/SMS' },
  { provider: 'AIS (TH)', sent: 4820, rate: 98.8, cost: '฿0.30/SMS' },
  { provider: 'Twilio (International)', sent: 2180, rate: 97.4, cost: '฿0.45/SMS' },
  { provider: 'AWS SNS (Backup)', sent: 800, rate: 96.2, cost: '฿0.35/SMS' },
]

const categoryColor = {
  security: 'bg-red-100 text-red-700',
  transactional: 'bg-blue-100 text-blue-700',
  reminder: 'bg-yellow-100 text-yellow-700',
  payment: 'bg-orange-100 text-orange-700',
  marketing: 'bg-purple-100 text-purple-700',
}

export default function SMSNotifications() {
  const [search, setSearch] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSendTestOpen, setIsSendTestOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [addForm, setAddForm] = useState({ name: '', category: 'transactional', trigger: '', message: '' })
  const [testPhone, setTestPhone] = useState('+66812345678')
  const { toast } = useToast()

  const totalSent = smsStats.reduce((a, m) => a + m.sent, 0)
  const totalCost = smsStats.reduce((a, m) => a + m.cost, 0)
  const avgDelivery = (smsStats.reduce((a, m) => a + m.delivered, 0) / totalSent * 100).toFixed(1)

  const filtered = smsTemplates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-green-100 border border-green-200">
            <MessageSquare className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">SMS Notifications</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Manage SMS Templates, OTP, and Delivery Tracking</p>
          </div>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white gap-1.5" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-3.5 w-3.5" />New Template
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Sent (6M)', value: totalSent.toLocaleString(), sub: 'All SMS types', color: 'text-green-700', bg: 'bg-green-50', icon: Send },
          { label: 'Delivery Rate', value: `${avgDelivery}%`, sub: 'Avg all providers', color: 'text-blue-700', bg: 'bg-blue-50', icon: CheckCircle },
          { label: 'Total Cost (6M)', value: `฿${totalCost.toLocaleString()}`, sub: 'All providers', color: 'text-orange-700', bg: 'bg-orange-50', icon: DollarSign },
          { label: 'Active Templates', value: '8', sub: 'TH + International', color: 'text-purple-700', bg: 'bg-purple-50', icon: MessageSquare },
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

      {/* SMS Volume + Cost Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base">SMS Volume Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={smsStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={v => v.toLocaleString()} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="delivered" name="Delivered" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="failed" name="Failed" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" />Provider Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="text-left py-2 font-medium">Provider</th>
                  <th className="text-right py-2 font-medium">Sent</th>
                  <th className="text-right py-2 font-medium">Rate</th>
                  <th className="text-right py-2 font-medium">Cost</th>
                </tr>
              </thead>
              <tbody>
                {providerStats.map(p => (
                  <tr key={p.provider} className="border-b hover:bg-gray-50">
                    <td className="py-2 text-xs font-medium">{p.provider}</td>
                    <td className="py-2 text-right text-xs">{p.sent.toLocaleString()}</td>
                    <td className="py-2 text-right">
                      <span className={`text-xs font-bold ${p.rate >= 98 ? 'text-green-600' : 'text-yellow-600'}`}>{p.rate}%</span>
                    </td>
                    <td className="py-2 text-right text-xs text-muted-foreground">{p.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* SMS Templates */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">SMS Templates ({filtered.length})</CardTitle>
            <div className="relative w-48">
              <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 text-sm" />
            </div>
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
                      <Badge className="text-xs bg-green-100 text-green-700">{t.deliveryRate}% delivery</Badge>
                    </div>
                    <p className="text-xs font-mono bg-gray-50 rounded px-2 py-1 text-gray-600 truncate">{t.message}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">Trigger: {t.trigger}</span>
                      <span className="text-xs text-muted-foreground">Sent: {t.sent.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">Cost: ฿{t.cost}/SMS</span>
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

      {/* Character Limit Warning */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-yellow-700">SMS Character Limits</p>
              <p className="text-xs text-yellow-600 mt-0.5">
                Thai SMS: 70 chars/message (Unicode) · English SMS: 160 chars/message (GSM-7) · 
                Messages exceeding limit will be split and charged per segment.
                OTP messages are always prioritized via dedicated shortcode.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* New SMS Template Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New SMS Template</DialogTitle>
            <DialogDescription>Create new SMS template</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Template Name *</Label>
              <Input placeholder="e.g. OTP Verification" value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Category</Label>
                <Select value={addForm.category} onValueChange={v => setAddForm({...addForm, category: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="security">Security / OTP</SelectItem>
                    <SelectItem value="transactional">Transactional</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Trigger</Label>
                <Input placeholder="e.g. On login" value={addForm.trigger} onChange={e => setAddForm({...addForm, trigger: e.target.value})} className="mt-1" /></div>
            </div>
            <div><Label>Message Body * <span className="text-muted-foreground text-xs">({addForm.message.length}/160 chars)</span></Label>
              <Textarea placeholder="e.g. Your IBB OTP is {{otp}}. Valid 5 min." value={addForm.message} onChange={e => setAddForm({...addForm, message: e.target.value})} className="mt-1" rows={3} maxLength={320} /></div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
              if (!addForm.name || !addForm.message) { toast({ title: 'Error', description: 'Name and message are required', variant: 'destructive' }); return }
              setIsAddOpen(false); setAddForm({ name: '', category: 'transactional', trigger: '', message: '' })
              toast({ title: 'SMS Template Created', description: `"${addForm.name}" created successfully` })
            }}>Create Template</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {selectedTemplate && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit SMS Template</DialogTitle>
              <DialogDescription>{selectedTemplate.id}: {selectedTemplate.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div><Label>Template Name</Label><Input defaultValue={selectedTemplate.name} className="mt-1" /></div>
              <div><Label>Trigger</Label><Input defaultValue={selectedTemplate.trigger} className="mt-1" /></div>
              <div><Label>Message Body</Label><Textarea defaultValue={selectedTemplate.message} className="mt-1" rows={3} /></div>
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
              <DialogTitle>Send Test SMS</DialogTitle>
              <DialogDescription>Send test SMS for: {selectedTemplate.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div><Label>Phone Number</Label><Input value={testPhone} onChange={e => setTestPhone(e.target.value)} className="mt-1" /></div>
              <div className="bg-gray-50 rounded p-3 text-xs font-mono text-gray-600">{selectedTemplate.message}</div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="outline" size="sm" onClick={() => setIsSendTestOpen(false)}>Cancel</Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => {
                setIsSendTestOpen(false)
                toast({ title: 'Test SMS Sent', description: `Sent to ${testPhone}` })
              }}>Send Test</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
