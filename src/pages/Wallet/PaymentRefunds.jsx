import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Search, ArrowUpCircle, CheckCircle, XCircle, Clock, AlertCircle, Download } from 'lucide-react'

const mockRefunds = [
  { id: 'REF-20260324-005', customerId: 'C-0042', customerName: 'Somchai Jaidee', tier: 'VIP',
    bookingRef: 'BK-20260322-065', cancelReason: 'Customer Cancelled 24 Hours in Advance',
    amount: 4500, refundTo: 'wallet', status: 'pending',
    requestedAt: '2026-03-24 09:00', note: '' },
  { id: 'REF-20260323-004', customerId: 'C-0156', customerName: 'Tanaka Hiroshi', tier: 'VIP',
    bookingRef: 'BK-20260320-031', cancelReason: 'Driver no-show',
    amount: 8900, refundTo: 'wallet', status: 'pending',
    requestedAt: '2026-03-23 14:00', note: '' },
  { id: 'REF-20260322-003', customerId: 'C-0089', customerName: 'Priya Sharma', tier: 'General',
    bookingRef: 'BK-20260319-020', cancelReason: 'Customer changed travel plan',
    amount: 2800, refundTo: 'original', status: 'completed',
    requestedAt: '2026-03-22 10:00', completedAt: '2026-03-22 11:30', completedBy: 'Admin01',
    note: 'Refunded to Stripe card ending 4242' },
  { id: 'REF-20260321-002', customerId: 'C-0312', customerName: 'IBB Corp Ltd', tier: 'Business Partner',
    bookingRef: 'BK-20260318-015', cancelReason: 'Corporate event cancelled',
    amount: 45000, refundTo: 'wallet', status: 'completed',
    requestedAt: '2026-03-21 09:00', completedAt: '2026-03-21 10:00', completedBy: 'Admin02',
    note: 'Refunded to corporate wallet balance' },
  { id: 'REF-20260320-001', customerId: 'C-0078', customerName: 'Maria Santos', tier: 'General',
    bookingRef: 'BK-20260317-008', cancelReason: 'Customer Cancelled 2 Hours Early',
    amount: 1900, refundTo: 'original', status: 'rejected',
    requestedAt: '2026-03-20 16:00', rejectedAt: '2026-03-20 17:00', rejectedBy: 'Admin01',
    note: 'Cancel under 24 hrs — no refund per policy' },
]

const statusConfig = {
  pending:   { label: 'Pending Review', className: 'bg-yellow-100 text-yellow-700', icon: Clock },
  completed: { label: 'Refunded',       className: 'bg-green-100 text-green-700',   icon: CheckCircle },
  rejected:  { label: 'Rejected',       className: 'bg-red-100 text-red-700',       icon: XCircle },
}

const tierColor = {
  'General': 'bg-blue-100 text-blue-700',
  'VIP': 'bg-pink-100 text-pink-700',
  'VVIP': 'bg-yellow-100 text-yellow-700',
  'Business Partner': 'bg-green-100 text-green-700',
}

export default function PaymentRefunds() {
  const [refunds, setRefunds] = useState(mockRefunds)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedRefund, setSelectedRefund] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [adminNote, setAdminNote] = useState('')
  const [refundTo, setRefundTo] = useState('wallet')
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

  const filtered = refunds.filter(r => {
    const matchSearch = r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.bookingRef.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  const pendingCount = refunds.filter(r => r.status === 'pending').length
  const totalRefunded = refunds.filter(r => r.status === 'completed').reduce((s, r) => s + r.amount, 0)

  const handleApprove = (id) => {
    setRefunds(prev => prev.map(r => r.id === id
      ? { ...r, status: 'completed', completedAt: new Date().toLocaleString(), completedBy: 'Admin01', refundTo, note: adminNote || `Refunded to ${refundTo === 'wallet' ? 'wallet balance' : 'original payment method'}` }
      : r))
    toast({ title: 'Refund Processed', description: `${id} — ฿${refunds.find(r => r.id === id)?.amount.toLocaleString()} refunded.` })
    setIsDetailOpen(false)
    setAdminNote('')
  }

  const handleReject = (id) => {
    setRefunds(prev => prev.map(r => r.id === id
      ? { ...r, status: 'rejected', rejectedAt: new Date().toLocaleString(), rejectedBy: 'Admin01', note: adminNote || 'Rejected by Admin' }
      : r))
    toast({ title: 'Refund Rejected', description: `${id} rejected.`, variant: 'destructive' })
    setIsDetailOpen(false)
    setAdminNote('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-100 border border-purple-200">
            <ArrowUpCircle className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Refunds</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Admin manual refunds — No auto-refund system</p>
          </div>
        </div>
        <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2"  onClick={handleExport}/>Export</Button>
      </div>

      {/* Policy Notice */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold">Refund Policy — Manual Process Only</p>
          <p className="mt-0.5">All refunds require Admin approval. No automatic refunds. Admin can refund to Wallet or Original Payment Method</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-50"><Clock className="h-5 w-5 text-yellow-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50"><CheckCircle className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Total Refunded</p>
                <p className="text-2xl font-bold text-green-600">฿{totalRefunded.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50"><XCircle className="h-5 w-5 text-red-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-red-500">{refunds.filter(r => r.status === 'rejected').length}</p>
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
              <Input placeholder="Search by REF ID, customer, booking ref..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2">
              {['all','pending','completed','rejected'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${statusFilter === s ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
                  {s === 'all' ? 'All' : s}{s === 'pending' && pendingCount > 0 ? ` (${pendingCount})` : ''}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Refund Requests ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">REF ID</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Booking</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Refund To</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Requested</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const sc = statusConfig[r.status]
                  const StatusIcon = sc.icon
                  return (
                    <tr key={r.id} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-4 py-3 font-mono text-xs text-purple-700 font-semibold">{r.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{r.customerName}</p>
                        <Badge className={`text-xs mt-0.5 ${tierColor[r.tier]}`}>{r.tier}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs">{r.bookingRef}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 max-w-[160px] truncate">{r.cancelReason}</p>
                      </td>
                      <td className="px-4 py-3 font-bold text-purple-600">฿{r.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs capitalize">{r.refundTo === 'wallet' ? '💳 Wallet' : '🔄 Original Method'}</td>
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${sc.className}`}>
                          <StatusIcon className="h-3 w-3" />{sc.label}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{r.requestedAt}</td>
                      <td className="px-4 py-3">
                        {r.status === 'pending' ? (
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs"
                            onClick={() => { setSelectedRefund(r); setRefundTo(r.refundTo); setIsDetailOpen(true) }}>
                            Review
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">{r.completedBy || r.rejectedBy || '—'}</span>
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

      {/* Review Dialog */}
      {selectedRefund && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Review Refund — {selectedRefund.id}</DialogTitle>
              <DialogDescription>Review and Process Refunds</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><Label className="text-muted-foreground">Customer</Label><p className="font-medium">{selectedRefund.customerName}</p></div>
                <div><Label className="text-muted-foreground">Tier</Label><Badge className={tierColor[selectedRefund.tier]}>{selectedRefund.tier}</Badge></div>
                <div><Label className="text-muted-foreground">Booking Ref</Label><p className="font-mono text-xs">{selectedRefund.bookingRef}</p></div>
                <div><Label className="text-muted-foreground">Refund Amount</Label><p className="font-bold text-purple-600 text-lg">฿{selectedRefund.amount.toLocaleString()}</p></div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <Label className="text-xs text-muted-foreground">Cancel Reason</Label>
                <p className="text-sm mt-1">{selectedRefund.cancelReason}</p>
              </div>
              <div className="space-y-2">
                <Label>Refund To</Label>
                <div className="flex gap-3">
                  <button onClick={() => setRefundTo('wallet')}
                    className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-colors ${refundTo === 'wallet' ? 'bg-purple-50 border-purple-400 text-purple-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                    💳 Wallet Balance
                  </button>
                  <button onClick={() => setRefundTo('original')}
                    className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-colors ${refundTo === 'original' ? 'bg-purple-50 border-purple-400 text-purple-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                    🔄 Original Method
                  </button>
                </div>
              </div>
              <div>
                <Label>Admin Note</Label>
                <Input className="mt-1" placeholder="Optional note..." value={adminNote} onChange={e => setAdminNote(e.target.value)} />
              </div>
              <div className="flex gap-3 pt-2">
                <Button size="sm" className="flex-1 bg-gray-700 hover:bg-gray-700" onClick={() => handleApprove(selectedRefund.id)}>
                  <CheckCircle className="h-4 w-4 mr-2" />Process Refund
                </Button>
                <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleReject(selectedRefund.id)}>
                  <XCircle className="h-4 w-4 mr-2" />Reject
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
