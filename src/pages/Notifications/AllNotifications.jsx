import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import {
  Bell, Mail, MessageSquare, Smartphone, CheckCheck,
  Search, Filter, Trash2, Eye, RefreshCw, TrendingUp,
  AlertCircle, Info, CheckCircle, XCircle, Clock
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const notificationStats = [
  { month: 'Oct', email: 4820, sms: 2140, push: 8640 },
  { month: 'Nov', email: 5240, sms: 2380, push: 9820 },
  { month: 'Dec', email: 7680, sms: 3420, push: 14200 },
  { month: 'Jan', email: 5980, sms: 2640, push: 11400 },
  { month: 'Feb', email: 6420, sms: 2880, push: 12600 },
  { month: 'Mar', email: 7240, sms: 3180, push: 14800 },
]

const recentNotifications = [
  { id: 'N-0841', type: 'push', category: 'booking', title: 'Booking Confirmed', message: 'Booking BK-10892 confirmed for Anan S. — BKK→Pattaya', recipient: 'Anan S.', time: '2 min ago', status: 'delivered', priority: 'normal' },
  { id: 'N-0840', type: 'sms', category: 'otp', title: 'OTP Verification', message: 'Your IBB OTP is 482910. Valid for 5 minutes.', recipient: '+66812345678', time: '5 min ago', status: 'delivered', priority: 'high' },
  { id: 'N-0839', type: 'email', category: 'payment', title: 'Payment Receipt', message: 'Payment of ฿4,200 received for booking BK-10891', recipient: 'somsak@email.com', time: '8 min ago', status: 'delivered', priority: 'normal' },
  { id: 'N-0838', type: 'push', category: 'driver', title: 'Driver Assigned', message: 'Driver Somchai W. has been assigned to your trip', recipient: 'Wichai K.', time: '12 min ago', status: 'delivered', priority: 'normal' },
  { id: 'N-0837', type: 'email', category: 'promo', title: 'Songkran Special Offer', message: '20% off all bookings Apr 13-15! Use code SONGKRAN20', recipient: 'VIP Members (842)', time: '1 hr ago', status: 'delivered', priority: 'low' },
  { id: 'N-0836', type: 'push', category: 'alert', title: 'Trip Starting Soon', message: 'Your trip starts in 30 minutes. Driver is on the way.', recipient: 'Niran T.', time: '1 hr ago', status: 'delivered', priority: 'high' },
  { id: 'N-0835', type: 'sms', category: 'booking', title: 'Booking Reminder', message: 'Reminder: Your IBB trip tomorrow at 08:00 from Suvarnabhumi', recipient: '+66898765432', time: '2 hr ago', status: 'failed', priority: 'normal' },
  { id: 'N-0834', type: 'email', category: 'system', title: 'Weekly Report', message: 'Your weekly booking summary for Mar 17-23 is ready', recipient: 'admin@ibb.co.th', time: '3 hr ago', status: 'delivered', priority: 'low' },
  { id: 'N-0833', type: 'push', category: 'promo', title: 'New Route Available', message: 'New route: Bangkok → Kanchanaburi now available!', recipient: 'All Users (4,418)', time: '5 hr ago', status: 'delivered', priority: 'low' },
  { id: 'N-0832', type: 'sms', category: 'payment', title: 'Payment Failed', message: 'Payment for BK-10820 failed. Please update payment method.', recipient: '+66845678901', time: '6 hr ago', status: 'delivered', priority: 'high' },
]

const typeIcon = { email: Mail, sms: MessageSquare, push: Smartphone }
const typeColor = { email: 'text-blue-600 bg-blue-50', sms: 'text-green-600 bg-green-50', push: 'text-purple-600 bg-purple-50' }
const statusColor = { delivered: 'bg-green-100 text-green-700', failed: 'bg-red-100 text-red-700', pending: 'bg-yellow-100 text-yellow-700' }
const priorityColor = { high: 'bg-red-100 text-red-700', normal: 'bg-gray-100 text-gray-600', low: 'bg-blue-50 text-blue-600' }
const categoryIcon = { booking: CheckCircle, otp: AlertCircle, payment: TrendingUp, driver: Bell, promo: Info, alert: Clock, system: Info }
const categoryColor = { booking: 'text-green-500', otp: 'text-red-500', payment: 'text-blue-500', driver: 'text-orange-500', promo: 'text-purple-500', alert: 'text-yellow-500', system: 'text-gray-500' }

export default function AllNotifications() {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isMarkAllOpen, setIsMarkAllOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedNotif, setSelectedNotif] = useState(null)
  const [notifications, setNotifications] = useState(recentNotifications)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setNotifications(recentNotifications)
      setIsRefreshing(false)
      toast({ title: 'Refreshed', description: 'Latest notifications loaded successfully' })
    }, 800)
  }

  const handleClearAll = () => {
    setNotifications([])
    toast({ title: 'Cleared All', description: 'All notifications deleted successfully' })
  }

  const filtered = notifications.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase()) ||
      n.recipient.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'all' || n.type === filterType
    const matchStatus = filterStatus === 'all' || n.status === filterStatus
    return matchSearch && matchType && matchStatus
  })

  const totalSent = notificationStats.reduce((a, m) => a + m.email + m.sms + m.push, 0)
  const deliveryRate = 98.2

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-100 border border-indigo-200">
            <Bell className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">All Notifications</h1>
            <p className="text-muted-foreground text-sm mt-0.5"> >Centralized Notifications — Email, SMS, Push</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleRefresh} disabled={isRefreshing} className="gap-1.5">
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />{isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white gap-1.5" onClick={() => setIsMarkAllOpen(true)}>
            <CheckCheck className="h-3.5 w-3.5" />Mark All Read
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Sent (6M)', value: totalSent.toLocaleString(), sub: 'All channels', color: 'text-indigo-700', bg: 'bg-indigo-50', icon: Bell },
          { label: 'Delivery Rate', value: `${deliveryRate}%`, sub: 'Avg all channels', color: 'text-green-700', bg: 'bg-green-50', icon: CheckCircle },
          { label: 'Failed (6M)', value: '682', sub: '1.8% of total', color: 'text-red-700', bg: 'bg-red-50', icon: XCircle },
          { label: 'Today Sent', value: '1,248', sub: 'Email+SMS+Push', color: 'text-blue-700', bg: 'bg-blue-50', icon: TrendingUp },
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

      {/* Volume Chart */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base">Notification Volume by Channel (6 months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={notificationStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={v => v.toLocaleString()} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="push" name="Push" stackId="a" fill="#8b5cf6" />
              <Bar dataKey="email" name="Email" stackId="a" fill="#3b82f6" />
              <Bar dataKey="sms" name="SMS" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search notifications..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-8 text-sm" />
        </div>
        <div className="flex gap-1">
          {['all', 'email', 'sms', 'push'].map(t => (
            <Button key={t} size="sm" variant={filterType === t ? 'default' : 'outline'}
              onClick={() => setFilterType(t)} className="text-xs h-8 capitalize">{t}</Button>
          ))}
        </div>
        <div className="flex gap-1">
          {['all', 'delivered', 'failed', 'pending'].map(s => (
            <Button key={s} size="sm" variant={filterStatus === s ? 'default' : 'outline'}
              onClick={() => setFilterStatus(s)} className="text-xs h-8 capitalize">{s}</Button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base flex items-center justify-between">
            <span>Recent Notifications ({filtered.length})</span>
            <Button size="sm" variant="ghost" className="text-xs text-red-500 gap-1 h-7" onClick={handleClearAll}>
              <Trash2 className="h-3 w-3" />Clear All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filtered.map(n => {
              const TypeIcon = typeIcon[n.type]
              const CatIcon = categoryIcon[n.category] || Info
              return (
                <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${typeColor[n.type]}`}>
                    <TypeIcon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold">{n.title}</span>
                      <Badge className={`text-xs ${statusColor[n.status]}`}>{n.status}</Badge>
                      <Badge className={`text-xs ${priorityColor[n.priority]}`}>{n.priority}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{n.message}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">→ {n.recipient}</span>
                      <span className="text-xs text-muted-foreground">{n.time}</span>
                      <span className="text-xs font-mono text-muted-foreground">{n.id}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 flex-shrink-0" onClick={() => { setSelectedNotif(n); setIsViewOpen(true) }}>
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
      {/* Mark All Read Dialog */}
      <Dialog open={isMarkAllOpen} onOpenChange={setIsMarkAllOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Mark All Read</DialogTitle>
            <DialogDescription>Confirm Clear All Notifications</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Mark notification as read? {filtered.length} All items??</p>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" size="sm" onClick={() => setIsMarkAllOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
              setIsMarkAllOpen(false)
              toast({ title: 'Mark All Read', description: `${filtered.length} notifications read` })
            }}>Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Notification Dialog */}
      {selectedNotif && (
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedNotif.title}</DialogTitle>
              <DialogDescription>{selectedNotif.id} — {selectedNotif.time}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-muted-foreground text-xs">Channel</Label><p className="font-medium capitalize">{selectedNotif.type}</p></div>
                <div><Label className="text-muted-foreground text-xs">Status</Label><p className="font-medium capitalize">{selectedNotif.status}</p></div>
                <div><Label className="text-muted-foreground text-xs">Priority</Label><p className="font-medium capitalize">{selectedNotif.priority}</p></div>
                <div><Label className="text-muted-foreground text-xs">Category</Label><p className="font-medium capitalize">{selectedNotif.category}</p></div>
              </div>
              <div><Label className="text-muted-foreground text-xs">Recipient</Label><p className="font-medium">{selectedNotif.recipient}</p></div>
              <div><Label className="text-muted-foreground text-xs">Message</Label><p className="text-sm bg-muted/50 p-2 rounded">{selectedNotif.message}</p></div>
            </div>
            <div className="flex justify-end mt-2">
              <Button size="sm" variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
