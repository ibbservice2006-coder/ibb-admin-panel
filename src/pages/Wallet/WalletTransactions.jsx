import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import {
  Search, Download, RefreshCw, ArrowUpCircle, ArrowDownCircle,
  CreditCard, Wallet, DollarSign, TrendingUp, Filter, Eye
} from 'lucide-react'

const mockTransactions = [
  { id: 'TXN-20260324-001', customerId: 'C-0042', customerName: 'Somchai Jaidee', tier: 'VIP',
    type: 'debit', amount: 4500, currency: 'THB', method: 'wallet', status: 'completed',
    bookingRef: 'BK-20260324-089', note: 'Booking payment', createdAt: '2026-03-24 09:15' },
  { id: 'TXN-20260324-002', customerId: 'C-0118', customerName: 'Ahmad Al-Rashid', tier: 'VVIP',
    type: 'credit', amount: 50000, currency: 'THB', method: 'crypto', status: 'completed',
    bookingRef: null, note: 'Wallet top-up via USDT', createdAt: '2026-03-24 08:42' },
  { id: 'TXN-20260323-045', customerId: 'C-0205', customerName: 'Li Wei', tier: 'VIP',
    type: 'refund', amount: 3200, currency: 'THB', method: 'wallet', status: 'completed',
    bookingRef: 'BK-20260320-031', note: 'Refund - cancelled booking', createdAt: '2026-03-23 16:30' },
  { id: 'TXN-20260323-044', customerId: 'C-0089', customerName: 'Priya Sharma', tier: 'General',
    type: 'debit', amount: 2800, currency: 'THB', method: 'credit_card', status: 'completed',
    bookingRef: 'BK-20260323-078', note: 'Booking payment via Stripe', createdAt: '2026-03-23 14:20' },
  { id: 'TXN-20260323-043', customerId: 'C-0312', customerName: 'IBB Corp Ltd', tier: 'Business Partner',
    type: 'debit', amount: 85000, currency: 'THB', method: 'bank_transfer', status: 'completed',
    bookingRef: 'BK-20260323-070', note: 'Corporate bulk booking', createdAt: '2026-03-23 11:05' },
  { id: 'TXN-20260323-042', customerId: 'C-0156', customerName: 'Tanaka Hiroshi', tier: 'VIP',
    type: 'credit', amount: 20000, currency: 'THB', method: 'wise', status: 'completed',
    bookingRef: null, note: 'Wallet top-up via Wise (JPY)', createdAt: '2026-03-23 09:50' },
  { id: 'TXN-20260322-038', customerId: 'C-0042', customerName: 'Somchai Jaidee', tier: 'VIP',
    type: 'bonus', amount: 450, currency: 'THB', method: 'system', status: 'completed',
    bookingRef: 'BK-20260322-065', note: '5% cashback reward', createdAt: '2026-03-22 18:00' },
  { id: 'TXN-20260322-037', customerId: 'C-0078', customerName: 'Maria Santos', tier: 'General',
    type: 'debit', amount: 1900, currency: 'THB', method: 'credit_card', status: 'failed',
    bookingRef: 'BK-20260322-060', note: 'Card declined', createdAt: '2026-03-22 15:30' },
  { id: 'TXN-20260322-036', customerId: 'C-0118', customerName: 'Ahmad Al-Rashid', tier: 'VVIP',
    type: 'debit', amount: 12500, currency: 'THB', method: 'wallet', status: 'completed',
    bookingRef: 'BK-20260322-058', note: 'VVIP booking payment', createdAt: '2026-03-22 13:10' },
  { id: 'TXN-20260321-030', customerId: 'C-0201', customerName: 'Wang Fang', tier: 'VIP',
    type: 'credit', amount: 15000, currency: 'THB', method: 'payoneer', status: 'pending',
    bookingRef: null, note: 'Top-up via Payoneer (CNY) — awaiting confirmation', createdAt: '2026-03-21 20:15' },
]

const statusConfig = {
  completed: { label: 'Completed', className: 'bg-green-100 text-green-700' },
  pending:   { label: 'Pending',   className: 'bg-yellow-100 text-yellow-700' },
  failed:    { label: 'Failed',    className: 'bg-red-100 text-red-700' },
  processing:{ label: 'Processing',className: 'bg-blue-100 text-blue-700' },
  refunded:  { label: 'Refunded',  className: 'bg-purple-100 text-purple-700' },
}

const typeConfig = {
  debit:  { label: 'Debit',  icon: ArrowDownCircle, color: 'text-red-500' },
  credit: { label: 'Credit', icon: ArrowUpCircle,   color: 'text-green-500' },
  refund: { label: 'Refund', icon: ArrowUpCircle,   color: 'text-purple-500' },
  bonus:  { label: 'Bonus',  icon: ArrowUpCircle,   color: 'text-blue-500' },
}

const methodLabel = {
  wallet: 'Wallet', credit_card: 'Credit Card', bank_transfer: 'Bank Transfer',
  wise: 'Wise', payoneer: 'Payoneer', crypto: 'Crypto', system: 'System',
}

const tierColor = {
  'General': 'bg-blue-100 text-blue-700',
  'VIP': 'bg-pink-100 text-pink-700',
  'VVIP': 'bg-yellow-100 text-yellow-700',
  'Business Partner': 'bg-green-100 text-green-700',
}

export default function WalletTransactions() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isRefreshing, setIsRefreshing] = useState(false)
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

  const filtered = mockTransactions.filter(t => {
    const matchSearch = t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (t.bookingRef && t.bookingRef.toLowerCase().includes(search.toLowerCase()))
    const matchType = typeFilter === 'all' || t.type === typeFilter
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    return matchSearch && matchType && matchStatus
  })

  const stats = {
    totalIn: mockTransactions.filter(t => ['credit','bonus','refund'].includes(t.type) && t.status === 'completed').reduce((s, t) => s + t.amount, 0),
    totalOut: mockTransactions.filter(t => t.type === 'debit' && t.status === 'completed').reduce((s, t) => s + t.amount, 0),
    pending: mockTransactions.filter(t => t.status === 'pending').length,
    failed: mockTransactions.filter(t => t.status === 'failed').length,
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(r => setTimeout(r, 800))
    setIsRefreshing(false)
    toast({ title: 'Refreshed', description: 'Transaction data updated' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100 border border-blue-200">
            <Wallet className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Wallet Transactions</h1>
            <p className="text-muted-foreground text-sm mt-0.5">All transaction history in Wallet Simulation</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50"><ArrowUpCircle className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Total In (Today)</p>
                <p className="text-xl font-bold text-green-600">฿{stats.totalIn.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50"><ArrowDownCircle className="h-5 w-5 text-red-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Total Out (Today)</p>
                <p className="text-xl font-bold text-red-500">฿{stats.totalOut.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-50"><TrendingUp className="h-5 w-5 text-yellow-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50"><CreditCard className="h-5 w-5 text-red-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Failed</p>
                <p className="text-xl font-bold text-red-500">{stats.failed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by TXN ID, customer, booking ref..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2 items-center">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {['all','debit','credit','refund','bonus'].map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${typeFilter === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
                  {t === 'all' ? 'All Types' : t}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {['all','completed','pending','failed'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${statusFilter === s ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
                  {s === 'all' ? 'All Status' : s}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Transactions ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">TXN ID</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Method</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Booking Ref</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Note</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => {
                  const tc = typeConfig[t.type]
                  const Icon = tc.icon
                  return (
                    <tr key={t.id} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-4 py-3 font-mono text-xs text-blue-700 font-semibold">{t.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-sm">{t.customerName}</p>
                        <Badge className={`text-xs mt-0.5 ${tierColor[t.tier]}`}>{t.tier}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`flex items-center gap-1 ${tc.color}`}>
                          <Icon className="h-4 w-4" />
                          <span className="font-medium capitalize">{t.type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-bold ${['credit','bonus','refund'].includes(t.type) ? 'text-green-600' : 'text-red-500'}`}>
                          {['credit','bonus','refund'].includes(t.type) ? '+' : '-'}฿{t.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{methodLabel[t.method] || t.method}</td>
                      <td className="px-4 py-3 font-mono text-xs">{t.bookingRef || '—'}</td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${statusConfig[t.status]?.className}`}>{statusConfig[t.status]?.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{t.createdAt}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-[180px] truncate">{t.note}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
