import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Mail, Send, Eye, Edit, Copy, Trash2, Plus,
  CheckCircle, XCircle, Clock, TrendingUp, Users, BarChart2
} from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const emailStats = [
  { month: 'Oct', sent: 4820, delivered: 4736, opened: 2180, clicked: 842 },
  { month: 'Nov', sent: 5240, delivered: 5148, opened: 2420, clicked: 968 },
  { month: 'Dec', sent: 7680, delivered: 7526, opened: 3640, clicked: 1480 },
  { month: 'Jan', sent: 5980, delivered: 5862, opened: 2740, clicked: 1092 },
  { month: 'Feb', sent: 6420, delivered: 6298, opened: 2980, clicked: 1196 },
  { month: 'Mar', sent: 7240, delivered: 7098, opened: 3380, clicked: 1352 },
]

const emailTemplates = [
  { id: 'ET-001', name: 'Booking Confirmation', trigger: 'On booking created', lastSent: '2 min ago', sent: 2840, openRate: 68.4, status: 'active', category: 'transactional' },
  { id: 'ET-002', name: 'Payment Receipt', trigger: 'On payment success', lastSent: '8 min ago', sent: 2640, openRate: 72.1, status: 'active', category: 'transactional' },
  { id: 'ET-003', name: 'Booking Reminder (24h)', trigger: '24h before trip', lastSent: '1 hr ago', sent: 1820, openRate: 64.8, status: 'active', category: 'reminder' },
  { id: 'ET-004', name: 'Booking Reminder (2h)', trigger: '2h before trip', lastSent: '2 hr ago', sent: 1680, openRate: 78.2, status: 'active', category: 'reminder' },
  { id: 'ET-005', name: 'Trip Completed + Review', trigger: 'On trip completed', lastSent: '3 hr ago', sent: 1540, openRate: 52.4, status: 'active', category: 'transactional' },
  { id: 'ET-006', name: 'Cancellation Notice', trigger: 'On booking cancelled', lastSent: '5 hr ago', sent: 284, openRate: 84.2, status: 'active', category: 'transactional' },
  { id: 'ET-007', name: 'Refund Processed', trigger: 'On refund approved', lastSent: '1 day ago', sent: 102, openRate: 88.6, status: 'active', category: 'transactional' },
  { id: 'ET-008', name: 'Membership Upgrade', trigger: 'On tier upgrade', lastSent: '2 days ago', sent: 248, openRate: 76.4, status: 'active', category: 'membership' },
  { id: 'ET-009', name: 'Songkran Promo', trigger: 'Manual / Scheduled', lastSent: '1 day ago', sent: 4418, openRate: 42.8, status: 'active', category: 'marketing' },
  { id: 'ET-010', name: 'Weekly Summary', trigger: 'Every Monday 09:00', lastSent: '3 days ago', sent: 842, openRate: 38.2, status: 'active', category: 'report' },
  { id: 'ET-011', name: 'Password Reset', trigger: 'On password reset request', lastSent: '4 hr ago', sent: 186, openRate: 92.4, status: 'active', category: 'security' },
  { id: 'ET-012', name: 'New Route Announcement', trigger: 'Manual', lastSent: '5 days ago', sent: 4418, openRate: 35.6, status: 'draft', category: 'marketing' },
]

const categoryColor = {
  transactional: 'bg-blue-100 text-blue-700',
  reminder: 'bg-yellow-100 text-yellow-700',
  marketing: 'bg-purple-100 text-purple-700',
  membership: 'bg-green-100 text-green-700',
  report: 'bg-gray-100 text-gray-600',
  security: 'bg-red-100 text-red-700',
}

export default function EmailNotifications() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('templates')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSendTestOpen, setIsSendTestOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [addForm, setAddForm] = useState({ name: '', category: 'transactional', trigger: '', subject: '', body: '' })
  const [testEmail, setTestEmail] = useState('admin@ibb.co.th')
  const { toast } = useToast()

  const totalSent = emailStats.reduce((a, m) => a + m.sent, 0)
  const totalOpened = emailStats.reduce((a, m) => a + m.opened, 0)
  const avgOpenRate = (totalOpened / totalSent * 100).toFixed(1)
  const avgClickRate = (emailStats.reduce((a, m) => a + m.clicked, 0) / totalSent * 100).toFixed(1)

  const filtered = emailTemplates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100 border border-blue-200">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Email Notifications</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Manage Email Templates, Campaigns, and Delivery Analytics</p>
          </div>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white gap-1.5" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-3.5 w-3.5" />New Template
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Sent (6M)', value: totalSent.toLocaleString(), sub: 'All email types', color: 'text-blue-700', bg: 'bg-blue-50', icon: Send },
          { label: 'Avg Open Rate', value: `${avgOpenRate}%`, sub: 'Industry avg: 21%', color: 'text-green-700', bg: 'bg-green-50', icon: Eye },
          { label: 'Avg Click Rate', value: `${avgClickRate}%`, sub: 'Industry avg: 2.6%', color: 'text-purple-700', bg: 'bg-purple-50', icon: TrendingUp },
          { label: 'Active Templates', value: '11', sub: '1 draft', color: 'text-orange-700', bg: 'bg-orange-50', icon: Mail },
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

      {/* Email Performance Chart */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base">Email Performance Trend (6 months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={emailStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={v => v.toLocaleString()} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="sent" name="Sent" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="delivered" name="Delivered" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="opened" name="Opened" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="clicked" name="Clicked" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-0">
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
              <CardTitle className="text-base">Email Templates ({filtered.length})</CardTitle>
              <div className="relative w-56">
                <Input placeholder="Search template..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 text-sm pr-3 pl-3" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="text-left py-2 px-4 font-medium">Template</th>
                  <th className="text-left py-2 font-medium">Trigger</th>
                  <th className="text-right py-2 font-medium">Sent</th>
                  <th className="text-right py-2 font-medium">Open Rate</th>
                  <th className="text-left py-2 font-medium pl-3">Category</th>
                  <th className="text-left py-2 font-medium">Status</th>
                  <th className="text-right py-2 pr-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} className="border-b hover:bg-gray-50">
                    <td className="py-2.5 px-4">
                      <p className="text-xs font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.id} · {t.lastSent}</p>
                    </td>
                    <td className="py-2.5 text-xs text-muted-foreground">{t.trigger}</td>
                    <td className="py-2.5 text-right text-xs font-medium">{t.sent.toLocaleString()}</td>
                    <td className="py-2.5 text-right">
                      <span className={`text-xs font-bold ${t.openRate >= 60 ? 'text-green-600' : t.openRate >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {t.openRate}%
                      </span>
                    </td>
                    <td className="py-2.5 pl-3">
                      <Badge className={`text-xs ${categoryColor[t.category]}`}>{t.category}</Badge>
                    </td>
                    <td className="py-2.5">
                      <Badge className={`text-xs ${t.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{t.status}</Badge>
                    </td>
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => { setSelectedTemplate(t); setIsPreviewOpen(true) }}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => { setSelectedTemplate(t); setIsEditOpen(true) }}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => { setSelectedTemplate(t); setIsSendTestOpen(true) }}>
                          <Send className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'analytics' && (
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base">Open Rate by Template Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { cat: 'Security (Password Reset)', rate: 92.4, color: '#ef4444' },
                { cat: 'Transactional (Refund)', rate: 88.6, color: '#f97316' },
                { cat: 'Transactional (Cancellation)', rate: 84.2, color: '#f59e0b' },
                { cat: 'Reminder (2h before)', rate: 78.2, color: '#10b981' },
                { cat: 'Membership', rate: 76.4, color: '#3b82f6' },
                { cat: 'Transactional (Booking)', rate: 68.4, color: '#6366f1' },
                { cat: 'Reminder (24h before)', rate: 64.8, color: '#8b5cf6' },
                { cat: 'Marketing (Promo)', rate: 42.8, color: '#94a3b8' },
                { cat: 'Report (Weekly)', rate: 38.2, color: '#cbd5e1' },
              ].map(item => (
                <div key={item.cat} className="flex items-center gap-3">
                  <span className="text-xs font-medium w-52 flex-shrink-0">{item.cat}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className="h-2 rounded-full" style={{ width: `${item.rate}%`, backgroundColor: item.color }} />
                  </div>
                  <span className="text-xs font-bold w-10 text-right">{item.rate}%</span>
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
            <DialogTitle>New Email Template</DialogTitle>
            <DialogDescription>Create new Email Template for system</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Template Name *</Label>
              <Input placeholder="e.g. Booking Confirmation" value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Category</Label>
                <Select value={addForm.category} onValueChange={v => setAddForm({...addForm, category: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transactional">Transactional</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="membership">Membership</SelectItem>
                    <SelectItem value="report">Report</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Trigger</Label>
                <Input placeholder="e.g. On booking created" value={addForm.trigger} onChange={e => setAddForm({...addForm, trigger: e.target.value})} className="mt-1" /></div>
            </div>
            <div><Label>Subject Line *</Label>
              <Input placeholder="e.g. Your booking is confirmed!" value={addForm.subject} onChange={e => setAddForm({...addForm, subject: e.target.value})} className="mt-1" /></div>
            <div><Label>Body (HTML/Text)</Label>
              <Textarea placeholder="Email body content..." value={addForm.body} onChange={e => setAddForm({...addForm, body: e.target.value})} className="mt-1" rows={4} /></div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
              if (!addForm.name || !addForm.subject) { toast({ title: 'Error', description: 'Name and subject are required', variant: 'destructive' }); return }
              setIsAddOpen(false); setAddForm({ name: '', category: 'transactional', trigger: '', subject: '', body: '' })
              toast({ title: 'Template Created', description: `"${addForm.name}" created successfully` })
            }}>Create Template</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      {selectedTemplate && (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Preview: {selectedTemplate.name}</DialogTitle>
              <DialogDescription>{selectedTemplate.id} · {selectedTemplate.category}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs text-muted-foreground">Trigger</Label><p className="font-medium text-xs">{selectedTemplate.trigger}</p></div>
                <div><Label className="text-xs text-muted-foreground">Status</Label><p className="font-medium text-xs capitalize">{selectedTemplate.status}</p></div>
                <div><Label className="text-xs text-muted-foreground">Total Sent</Label><p className="font-medium">{selectedTemplate.sent.toLocaleString()}</p></div>
                <div><Label className="text-xs text-muted-foreground">Open Rate</Label><p className="font-bold text-green-600">{selectedTemplate.openRate}%</p></div>
              </div>
              <div><Label className="text-xs text-muted-foreground">Last Sent</Label><p className="text-xs">{selectedTemplate.lastSent}</p></div>
              <div className="bg-blue-50 rounded p-3 text-xs text-blue-700">📧 Preview: Dear [Customer Name], {selectedTemplate.name} — IBB Shuttle Service</div>
            </div>
            <div className="flex justify-end mt-2">
              <Button size="sm" variant="outline" onClick={() => setIsPreviewOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Dialog */}
      {selectedTemplate && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Template</DialogTitle>
              <DialogDescription>{selectedTemplate.id}: {selectedTemplate.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div><Label>Template Name</Label><Input defaultValue={selectedTemplate.name} className="mt-1" /></div>
              <div><Label>Trigger</Label><Input defaultValue={selectedTemplate.trigger} className="mt-1" /></div>
              <div><Label>Subject</Label><Input defaultValue={`[IBB] ${selectedTemplate.name}`} className="mt-1" /></div>
              <div><Label>Body</Label><Textarea defaultValue={`Dear {{customer_name}},\n\n${selectedTemplate.name} — IBB Shuttle Service\n\nThank you for choosing IBB.`} className="mt-1" rows={4} /></div>
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
              <DialogTitle>Send Test Email</DialogTitle>
              <DialogDescription>Send test email for: {selectedTemplate.name}</DialogDescription>
            </DialogHeader>
            <div><Label>Send to Email</Label>
              <Input value={testEmail} onChange={e => setTestEmail(e.target.value)} className="mt-1" /></div>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="outline" size="sm" onClick={() => setIsSendTestOpen(false)}>Cancel</Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => {
                setIsSendTestOpen(false)
                toast({ title: 'Test Email Sent', description: `Sent to ${testEmail}` })
              }}>Send Test</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
