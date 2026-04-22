import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShoppingBag, Search, CheckCircle, XCircle, Clock, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

const initialOrders = [
  { id: 'PLT-001', platform: 'Shopee', zone: 'SE Asia', service: 'Bangkok Airport Transfer', customer: 'Somchai K.', date: '2026-03-25', time: '14:00', passengers: 2, amount: 1200, currency: 'THB', status: 'pending', bookingRef: null, platformOrderId: 'SPE-88291034' },
  { id: 'PLT-002', platform: 'Ctrip', zone: 'China', service: '曼谷机场接送', customer: 'Wang Lei', date: '2026-03-26', time: '09:30', passengers: 3, amount: 250, currency: 'CNY', status: 'confirmed', bookingRef: 'IBB-20260326-001', platformOrderId: 'CTP-77382910' },
  { id: 'PLT-003', platform: 'Klook', zone: 'SE Asia', service: 'Chiang Mai City Tour', customer: 'John Smith', date: '2026-03-27', time: '08:00', passengers: 4, amount: 1800, currency: 'THB', status: 'pending', bookingRef: null, platformOrderId: 'KLK-55129384' },
  { id: 'PLT-004', platform: 'Amazon', zone: 'Global', service: 'Bangkok Airport Transfer', customer: 'Emily Chen', date: '2026-03-25', time: '18:00', passengers: 2, amount: 35, currency: 'USD', status: 'confirmed', bookingRef: 'IBB-20260325-003', platformOrderId: 'AMZ-99283746' },
  { id: 'PLT-005', platform: 'Noon', zone: 'Middle East', service: 'Dubai Airport Transfer', customer: 'Ahmed Al-Rashid', date: '2026-03-28', time: '11:00', passengers: 1, amount: 150, currency: 'AED', status: 'pending', bookingRef: null, platformOrderId: 'NON-44182736' },
  { id: 'PLT-006', platform: 'Ozon', zone: 'Russia', service: 'Аэропорт Бангкок', customer: 'Ivan Petrov', date: '2026-03-26', time: '16:00', passengers: 2, amount: 3200, currency: 'RUB', status: 'cancelled', bookingRef: null, platformOrderId: 'OZN-33291847' },
  { id: 'PLT-007', platform: 'GetYourGuide', zone: 'Global', service: 'Pattaya Day Trip', customer: 'Maria Garcia', date: '2026-03-29', time: '07:00', passengers: 6, amount: 45, currency: 'USD', status: 'pending', bookingRef: null, platformOrderId: 'GYG-22183746' },
  { id: 'PLT-008', platform: 'Lazada', zone: 'SE Asia', service: 'Phuket Private Transfer', customer: 'Nattapong S.', date: '2026-03-25', time: '12:00', passengers: 3, amount: 2500, currency: 'THB', status: 'confirmed', bookingRef: 'IBB-20260325-004', platformOrderId: 'LZD-11293847' },
  { id: 'PLT-009', platform: 'TikTok Shop', zone: 'SE Asia', service: 'Bangkok City Tour', customer: 'Priya Sharma', date: '2026-03-27', time: '10:00', passengers: 2, amount: 1500, currency: 'THB', status: 'pending', bookingRef: null, platformOrderId: 'TTK-66182736' },
  { id: 'PLT-010', platform: 'Booking.com', zone: 'Global', service: 'Bangkok Luxury Transfer', customer: 'James Wilson', date: '2026-03-30', time: '15:00', passengers: 2, amount: 65, currency: 'USD', status: 'pending', bookingRef: null, platformOrderId: 'BKG-55291038' },
]

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
}

const zoneColors = {
  'SE Asia': 'bg-orange-100 text-orange-700',
  'Global': 'bg-blue-100 text-blue-700',
  'China': 'bg-red-100 text-red-700',
  'Middle East': 'bg-yellow-100 text-yellow-800',
  'Russia': 'bg-purple-100 text-purple-700',
}

export default function PlatformOrders() {
  const [orders, setOrders] = useState(initialOrders)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [confirmDialog, setConfirmDialog] = useState(null)
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast({ title: 'Refreshed', description: 'Latest data loaded' })
    }, 800)
  }

  const filtered = orders.filter(o =>
    (filterStatus === 'All' || o.status === filterStatus) &&
    (o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.platformOrderId.toLowerCase().includes(search.toLowerCase()) ||
      o.platform.toLowerCase().includes(search.toLowerCase()))
  )

  const pendingCount = orders.filter(o => o.status === 'pending').length
  const confirmedCount = orders.filter(o => o.status === 'confirmed').length

  const handleConfirm = (id) => {
    const refNum = `IBB-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(Math.floor(Math.random()*900)+100)}`
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'confirmed', bookingRef: refNum } : o))
    toast({ title: 'Order Confirmed', description: `Booking ${refNum} created. Platform notified.` })
    setConfirmDialog(null)
  }

  const handleCancel = (id) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'cancelled' } : o))
    toast({ title: 'Order Cancelled', description: 'Platform has been notified of cancellation.' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100 border border-blue-200">
            <ShoppingBag className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Platform Orders</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Orders from All External Platforms — Confirm/Cancel Back to Platform</p>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">Total Orders</p>
          <p className="text-2xl font-bold">{orders.length}</p>
        </CardContent></Card>
        <Card className="border-yellow-200"><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">Pending Action</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          <p className="text-xs text-yellow-600">Requires review</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">Platforms</p>
          <p className="text-2xl font-bold">{[...new Set(orders.map(o => o.platform))].length}</p>
        </CardContent></Card>
      </div>

      {/* Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-3 pb-3">
          <div className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <p className="text-xs text-blue-800"><strong>Business Spec:</strong> When Admin confirms → system creates IBB Booking & sends "Confirmed" status to Platform | If cancelled → sends "Cancelled" status</p>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9 h-9" placeholder="Search by customer, order ID, platform..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {['All', 'pending', 'confirmed', 'cancelled'].map(s => (
          <Button key={s} variant={filterStatus === s ? 'default' : 'outline'} size="sm"
            className={filterStatus === s ? 'bg-blue-600 hover:bg-blue-700' : ''}
            onClick={() => setFilterStatus(s)}>
            {s === 'All' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </Button>
        ))}
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-3 font-medium">Platform Order ID</th>
                  <th className="text-left p-3 font-medium">Platform</th>
                  <th className="text-left p-3 font-medium">Service</th>
                  <th className="text-left p-3 font-medium">Customer</th>
                  <th className="text-left p-3 font-medium">Date / Time</th>
                  <th className="text-right p-3 font-medium">Amount</th>
                  <th className="text-left p-3 font-medium">IBB Booking</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => {
                  const sc = statusConfig[o.status]
                  const StatusIcon = sc.icon
                  return (
                    <tr key={o.id} className="border-b hover:bg-muted/20">
                      <td className="p-3">
                        <div className="font-mono text-xs">{o.platformOrderId}</div>
                        <Badge className={`text-xs mt-1 ${zoneColors[o.zone]}`}>{o.zone}</Badge>
                      </td>
                      <td className="p-3 font-medium">{o.platform}</td>
                      <td className="p-3">
                        <div className="max-w-xs truncate">{o.service}</div>
                        <div className="text-xs text-muted-foreground">{o.passengers} pax</div>
                      </td>
                      <td className="p-3">{o.customer}</td>
                      <td className="p-3">
                        <div>{o.date}</div>
                        <div className="text-xs text-muted-foreground">{o.time}</div>
                      </td>
                      <td className="p-3 text-right font-medium">{o.amount.toLocaleString()} {o.currency}</td>
                      <td className="p-3">
                        {o.bookingRef
                          ? <span className="text-xs font-mono text-green-600">{o.bookingRef}</span>
                          : <span className="text-xs text-muted-foreground">—</span>}
                      </td>
                      <td className="p-3">
                        <Badge className={`text-xs ${sc.color}`}><StatusIcon className="h-3 w-3 mr-1" />{sc.label}</Badge>
                      </td>
                      <td className="p-3">
                        {o.status === 'pending' && (
                          <div className="flex gap-1">
                            <Button size="sm" className="text-xs bg-gray-700 hover:bg-gray-700" onClick={() => setConfirmDialog(o)}>
                              <CheckCircle className="h-3 w-3 mr-1" />Confirm
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleCancel(o.id)}>
                              <XCircle className="h-3 w-3 mr-1" />Cancel
                            </Button>
                          </div>
                        )}
                        {o.status === 'confirmed' && (
                          <span className="text-xs text-green-600">✓ Notified</span>
                        )}
                        {o.status === 'cancelled' && (
                          <span className="text-xs text-red-500">✗ Cancelled</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Confirm Dialog */}
      {confirmDialog && (
        <Dialog open={!!confirmDialog} onOpenChange={() => setConfirmDialog(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Platform Order</DialogTitle>
              <DialogDescription>Create IBB Booking and notify Platform as Confirmed</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Platform</span><span className="font-medium">{confirmDialog.platform}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Order ID</span><span className="font-mono text-xs">{confirmDialog.platformOrderId}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="font-medium">{confirmDialog.service}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span>{confirmDialog.customer}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Date/Time</span><span>{confirmDialog.date} {confirmDialog.time}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-bold text-green-600">{confirmDialog.amount.toLocaleString()} {confirmDialog.currency}</span></div>
              </div>
              <div className="flex gap-3">
                <Button size="sm" className="flex-1 bg-gray-700 hover:bg-gray-700" onClick={() => handleConfirm(confirmDialog.id)}>
                  <CheckCircle className="h-4 w-4 mr-2" />Confirm & Create Booking
                </Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setConfirmDialog(null)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
