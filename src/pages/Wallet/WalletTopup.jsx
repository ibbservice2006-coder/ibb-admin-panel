import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import {
  Search, CheckCircle, XCircle, Clock, ArrowUpCircle,
  Wallet, Eye, AlertCircle, Download
} from 'lucide-react'

const mockTopups = [
  { id: 'TU-20260324-008', customerId: 'C-0201', customerName: 'Wang Fang', tier: 'VIP',
    amount: 15000, currency: 'THB', originalAmount: 3000, originalCurrency: 'CNY',
    method: 'payoneer', status: 'pending', submittedAt: '2026-03-24 10:30',
    slipUrl: 'slip_TU008.jpg', note: 'Top-up via Payoneer CNY → THB' },
  { id: 'TU-20260324-007', customerId: 'C-0089', customerName: 'Priya Sharma', tier: 'VIP',
    amount: 10000, currency: 'THB', originalAmount: 10000, originalCurrency: 'THB',
    method: 'bank_transfer', status: 'pending', submittedAt: '2026-03-24 09:15',
    slipUrl: 'slip_TU007.jpg', note: 'PromptPay transfer' },
  { id: 'TU-20260323-006', customerId: 'C-0118', customerName: 'Ahmad Al-Rashid', tier: 'VVIP',
    amount: 50000, currency: 'THB', originalAmount: 1388, originalCurrency: 'USDT',
    method: 'crypto', status: 'approved', submittedAt: '2026-03-23 08:00',
    approvedAt: '2026-03-23 08:42', approvedBy: 'Admin01',
    slipUrl: 'slip_TU006.jpg', note: 'USDT via Bitkub wallet' },
  { id: 'TU-20260323-005', customerId: 'C-0156', customerName: 'Tanaka Hiroshi', tier: 'VIP',
    amount: 20000, currency: 'THB', originalAmount: 80000, originalCurrency: 'JPY',
    method: 'wise', status: 'approved', submittedAt: '2026-03-23 07:30',
    approvedAt: '2026-03-23 09:50', approvedBy: 'Admin01',
    slipUrl: 'slip_TU005.jpg', note: 'Wise transfer JPY → THB' },
  { id: 'TU-20260322-004', customerId: 'C-0312', customerName: 'IBB Corp Ltd', tier: 'Business Partner',
    amount: 200000, currency: 'THB', originalAmount: 200000, originalCurrency: 'THB',
    method: 'bank_transfer', status: 'approved', submittedAt: '2026-03-22 14:00',
    approvedAt: '2026-03-22 15:30', approvedBy: 'Admin02',
    slipUrl: 'slip_TU004.jpg', note: 'Corporate monthly credit deposit' },
  { id: 'TU-20260321-003', customerId: 'C-0078', customerName: 'Maria Santos', tier: 'VIP',
    amount: 5000, currency: 'THB', originalAmount: 140, originalCurrency: 'USD',
    method: 'wise', status: 'rejected', submittedAt: '2026-03-21 16:00',
    rejectedAt: '2026-03-21 17:30', rejectedBy: 'Admin01',
    slipUrl: 'slip_TU003.jpg', note: 'Rejected — slip unclear, amount mismatch' },
]

const statusConfig = {
  pending:  { label: 'Pending Review', className: 'bg-yellow-100 text-yellow-700', icon: Clock },
  approved: { label: 'Approved',       className: 'bg-green-100 text-green-700',   icon: CheckCircle },
  rejected: { label: 'Rejected',       className: 'bg-red-100 text-red-700',       icon: XCircle },
}

const methodLabel = {
  bank_transfer: 'Bank Transfer (THB)', payoneer: 'Payoneer', wise: 'Wise', crypto: 'Crypto (Bitkub)',
}

const tierColor = {
  'General': 'bg-blue-100 text-blue-700',
  'VIP': 'bg-pink-100 text-pink-700',
  'VVIP': 'bg-yellow-100 text-yellow-700',
  'Business Partner': 'bg-green-100 text-green-700',
}

export default function WalletTopup() {
  const [topups, setTopups] = useState(mockTopups)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedTopup, setSelectedTopup] = useState(null)
  const [rejectNote, setRejectNote] = useState('')
  const [isDetailOpen, setIsDetailOpen] = useState(false)
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

  const filtered = topups.filter(t => {
    const matchSearch = t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    return matchSearch && matchStatus
  })

  const pendingCount = topups.filter(t => t.status === 'pending').length
  const approvedToday = topups.filter(t => t.status === 'approved').length
  const totalApprovedAmount = topups.filter(t => t.status === 'approved').reduce((s, t) => s + t.amount, 0)

  const handleApprove = (id) => {
    setTopups(prev => prev.map(t => t.id === id
      ? { ...t, status: 'approved', approvedAt: new Date().toLocaleString(), approvedBy: 'Admin01' }
      : t))
    toast({ title: 'Approved', description: `Top-up ${id} approved and wallet credited.` })
    setIsDetailOpen(false)
  }

  const handleReject = (id) => {
    setTopups(prev => prev.map(t => t.id === id
      ? { ...t, status: 'rejected', rejectedAt: new Date().toLocaleString(), rejectedBy: 'Admin01', note: rejectNote || t.note }
      : t))
    toast({ title: 'Rejected', description: `Top-up ${id} rejected.`, variant: 'destructive' })
    setIsDetailOpen(false)
    setRejectNote('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-green-100 border border-green-200">
            <ArrowUpCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Wallet Top-up</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Admin approves wallet top-up — customer transfers in advance, Admin verifies slip</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />Export
        </Button>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-amber-800">
          <p className="font-semibold">Wallet Simulation — Manual Approval Required</p>
          <p className="mt-0.5">IBB Wallet system is simulation — customers prepay and attach slip; Admin must verify and approve before funds enter Wallet</p>
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
                <p className="text-xs text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50"><Wallet className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Total Credited</p>
                <p className="text-2xl font-bold text-blue-600">฿{totalApprovedAmount.toLocaleString()}</p>
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
              <Input placeholder="Search by ID or customer name..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2">
              {['all','pending','approved','rejected'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${statusFilter === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
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
          <CardTitle className="text-base">Top-up Requests ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Top-up ID</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Method</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Submitted</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => {
                  const sc = statusConfig[t.status]
                  const StatusIcon = sc.icon
                  return (
                    <tr key={t.id} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-4 py-3 font-mono text-xs text-blue-700 font-semibold">{t.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{t.customerName}</p>
                        <Badge className={`text-xs mt-0.5 ${tierColor[t.tier]}`}>{t.tier}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-green-600">+฿{t.amount.toLocaleString()}</p>
                        {t.originalCurrency !== 'THB' && (
                          <p className="text-xs text-muted-foreground">{t.originalAmount.toLocaleString()} {t.originalCurrency}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs">{methodLabel[t.method] || t.method}</td>
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${sc.className}`}>
                          <StatusIcon className="h-3 w-3" />
                          {sc.label}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{t.submittedAt}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs"
                            onClick={() => { setSelectedTopup(t); setIsDetailOpen(true) }}>
                            <Eye className="h-3 w-3 mr-1" />View
                          </Button>
                          {t.status === 'pending' && (
                            <>
                              <Button size="sm" className="px-2 text-xs bg-gray-700 hover:bg-gray-700"
                                onClick={() => handleApprove(t.id)}>
                                <CheckCircle className="h-3 w-3 mr-1" />Approve
                              </Button>
                              <Button variant="destructive" size="sm" className="h-7 px-2 text-xs"
                                onClick={() => { setSelectedTopup(t); setIsDetailOpen(true) }}>
                                <XCircle className="h-3 w-3 mr-1" />Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      {selectedTopup && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Top-up Detail — {selectedTopup.id}</DialogTitle>
              <DialogDescription>Review details before approve or reject</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><Label className="text-muted-foreground">Customer</Label><p className="font-medium">{selectedTopup.customerName}</p></div>
                <div><Label className="text-muted-foreground">Tier</Label><Badge className={`${tierColor[selectedTopup.tier]}`}>{selectedTopup.tier}</Badge></div>
                <div><Label className="text-muted-foreground">Amount (THB)</Label><p className="font-bold text-green-600 text-lg">฿{selectedTopup.amount.toLocaleString()}</p></div>
                <div><Label className="text-muted-foreground">Original</Label><p className="font-medium">{selectedTopup.originalAmount.toLocaleString()} {selectedTopup.originalCurrency}</p></div>
                <div><Label className="text-muted-foreground">Method</Label><p className="font-medium">{methodLabel[selectedTopup.method]}</p></div>
                <div><Label className="text-muted-foreground">Submitted</Label><p className="font-medium">{selectedTopup.submittedAt}</p></div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <Label className="text-muted-foreground text-xs">Note / Slip Reference</Label>
                <p className="text-sm mt-1">{selectedTopup.note}</p>
              </div>
              {selectedTopup.status === 'pending' && (
                <div className="space-y-3 border-t pt-4">
                  <div>
                    <Label className="text-sm">Reject Reason (optional)</Label>
                    <Input className="mt-1" placeholder="e.g. Slip unclear, amount mismatch..." value={rejectNote} onChange={e => setRejectNote(e.target.value)} />
                  </div>
                  <div className="flex gap-3">
                    <Button size="sm" className="flex-1 bg-gray-700 hover:bg-gray-700" onClick={() => handleApprove(selectedTopup.id)}>
                      <CheckCircle className="h-4 w-4 mr-2" />Approve & Credit Wallet
                    </Button>
                    <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleReject(selectedTopup.id)}>
                      <XCircle className="h-4 w-4 mr-2" />Reject
                    </Button>
                  </div>
                </div>
              )}
              {selectedTopup.status !== 'pending' && (
                <div className="p-3 rounded-lg border">
                  <p className="text-sm font-medium">
                    {selectedTopup.status === 'approved'
                      ? `✅ Approved by ${selectedTopup.approvedBy} at ${selectedTopup.approvedAt}`
                      : `❌ Rejected by ${selectedTopup.rejectedBy} at ${selectedTopup.rejectedAt}`}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
