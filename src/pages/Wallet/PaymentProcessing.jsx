import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Clock, RefreshCw, AlertTriangle, CheckCircle, XCircle, Zap } from 'lucide-react'

const mockProcessing = [
  { id: 'TXN-20260324-010', customerId: 'C-0201', customerName: 'Wang Fang', tier: 'VIP',
    amount: 15000, currency: 'THB', method: 'payoneer', type: 'topup',
    status: 'processing', startedAt: '2026-03-24 10:30', elapsed: '14 min',
    bookingRef: null, note: 'Payoneer CNY → THB conversion in progress' },
  { id: 'TXN-20260324-009', customerId: 'C-0089', customerName: 'Priya Sharma', tier: 'General',
    amount: 2800, currency: 'THB', method: 'stripe', type: 'payment',
    status: 'processing', startedAt: '2026-03-24 10:45', elapsed: '3 min',
    bookingRef: 'BK-20260324-092', note: 'Stripe 3DS verification pending' },
  { id: 'TXN-20260324-008', customerId: 'C-0312', customerName: 'IBB Corp Ltd', tier: 'Business Partner',
    amount: 120000, currency: 'THB', method: 'bank_transfer', type: 'payment',
    status: 'pending', startedAt: '2026-03-24 09:00', elapsed: '1h 48min',
    bookingRef: 'BK-20260324-085', note: 'Bank transfer — awaiting bank confirmation' },
  { id: 'TXN-20260323-007', customerId: 'C-0118', customerName: 'Ahmad Al-Rashid', tier: 'VVIP',
    amount: 50000, currency: 'THB', method: 'crypto', type: 'topup',
    status: 'processing', startedAt: '2026-03-23 08:00', elapsed: '2h 42min',
    bookingRef: null, note: 'Bitkub — waiting for 6 block confirmations (4/6)' },
  { id: 'TXN-20260322-005', customerId: 'C-0078', customerName: 'Maria Santos', tier: 'General',
    amount: 1900, currency: 'THB', method: 'stripe', type: 'payment',
    status: 'failed', startedAt: '2026-03-22 15:30', elapsed: '—',
    bookingRef: 'BK-20260322-060', note: 'Card declined — insufficient funds' },
]

const statusConfig = {
  processing: { label: 'Processing', className: 'bg-blue-100 text-blue-700', icon: RefreshCw },
  pending:    { label: 'Pending',    className: 'bg-yellow-100 text-yellow-700', icon: Clock },
  failed:     { label: 'Failed',     className: 'bg-red-100 text-red-700', icon: XCircle },
}

const methodLabel = {
  payoneer: 'Payoneer', wise: 'Wise', stripe: 'Stripe', omise: 'Omise',
  bank_transfer: 'Bank Transfer', crypto: 'Crypto (Bitkub)',
}

const tierColor = {
  'General': 'bg-blue-100 text-blue-700',
  'VIP': 'bg-pink-100 text-pink-700',
  'VVIP': 'bg-yellow-100 text-yellow-700',
  'Business Partner': 'bg-green-100 text-green-700',
}

export default function PaymentProcessing() {
  const [items, setItems] = useState(mockProcessing)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const processingCount = items.filter(t => t.status === 'processing').length
  const pendingCount = items.filter(t => t.status === 'pending').length
  const failedCount = items.filter(t => t.status === 'failed').length

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(r => setTimeout(r, 1000))
    setIsRefreshing(false)
    toast({ title: 'Refreshed', description: 'Processing queue updated' })
  }

  const handleRetry = (id) => {
    setItems(prev => prev.map(t => t.id === id ? { ...t, status: 'processing', note: t.note + ' [Retrying...]' } : t))
    toast({ title: 'Retry initiated', description: `Transaction ${id} is being retried.` })
  }

  const handleForceComplete = (id) => {
    setItems(prev => prev.filter(t => t.id !== id))
    toast({ title: 'Marked Complete', description: `Transaction ${id} manually completed.` })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100 border border-blue-200">
            <RefreshCw className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Payment Processing</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Items in progress — Processing / Pending / Failed</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50"><RefreshCw className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold text-blue-600">{processingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-50"><Clock className="h-5 w-5 text-yellow-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50"><AlertTriangle className="h-5 w-5 text-red-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-500">{failedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Processing Items */}
      <div className="space-y-3">
        {items.map(item => {
          const sc = statusConfig[item.status]
          const StatusIcon = sc.icon
          return (
            <Card key={item.id} className={`border ${item.status === 'failed' ? 'border-red-200' : item.status === 'pending' ? 'border-yellow-200' : 'border-blue-200'}`}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${item.status === 'failed' ? 'bg-red-50' : item.status === 'pending' ? 'bg-yellow-50' : 'bg-blue-50'}`}>
                    <StatusIcon className={`h-5 w-5 ${item.status === 'failed' ? 'text-red-500' : item.status === 'pending' ? 'text-yellow-600' : 'text-blue-600 animate-spin'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-semibold text-blue-700">{item.id}</span>
                      <Badge className={`text-xs ${sc.className}`}>{sc.label}</Badge>
                      <Badge variant="outline" className="text-xs capitalize">{item.type}</Badge>
                      <Badge className={`text-xs ${tierColor[item.tier]}`}>{item.tier}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Customer: </span>
                        <span className="font-medium">{item.customerName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Amount: </span>
                        <span className="font-bold">฿{item.amount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Method: </span>
                        <span className="font-medium">{methodLabel[item.method]}</span>
                      </div>
                      {item.bookingRef && (
                        <div>
                          <span className="text-muted-foreground">Booking: </span>
                          <span className="font-mono text-xs">{item.bookingRef}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">Elapsed: </span>
                        <span className={`font-medium ${item.elapsed !== '—' && item.elapsed.includes('h') ? 'text-orange-600' : ''}`}>{item.elapsed}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">{item.note}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {item.status === 'failed' && (
                      <Button size="sm" variant="outline" className="h-8 text-xs border-blue-200 text-blue-600 hover:bg-blue-50"
                        onClick={() => handleRetry(item.id)}>
                        <RefreshCw className="h-3.5 w-3.5 mr-1" />Retry
                      </Button>
                    )}
                    {item.status !== 'failed' && (
                      <Button size="sm" variant="outline" className="h-8 text-xs border-green-200 text-green-600 hover:bg-green-50"
                        onClick={() => handleForceComplete(item.id)}>
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />Mark Complete
                      </Button>
                    )}
                    {item.status === 'failed' && (
                      <Button size="sm" variant="outline" className="h-8 text-xs border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => { setItems(prev => prev.filter(t => t.id !== item.id)); toast({ title: 'Dismissed', description: `${item.id} removed from queue.` }) }}>
                        <XCircle className="h-3.5 w-3.5 mr-1" />Dismiss
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
        {items.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <p className="text-muted-foreground">No pending transactions — all clear!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
