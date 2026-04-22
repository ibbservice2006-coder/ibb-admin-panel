import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, CheckCircle, XCircle, Clock, Download, RefreshCw } from 'lucide-react'

const redemptions = [
  { id: 1, code: 'IBB-WELCOME20', customer: 'Somchai P.', tier: 'General', bookingRef: 'IBB-2026-001234', originalAmount: 2500, discountAmount: 500, finalAmount: 2000, usedAt: '2026-03-24 09:15', status: 'success', source: 'IBB', verifiedExternal: null },
  { id: 2, code: 'SHOPEE-IBB10', customer: 'Malee S.', tier: 'VIP', bookingRef: 'IBB-2026-001235', originalAmount: 3200, discountAmount: 320, finalAmount: 2880, usedAt: '2026-03-24 09:42', status: 'success', source: 'Shopee', verifiedExternal: true },
  { id: 3, code: 'IBB-VIP500', customer: 'Nattapong K.', tier: 'VIP', bookingRef: 'IBB-2026-001236', originalAmount: 4500, discountAmount: 500, finalAmount: 4000, usedAt: '2026-03-24 10:05', status: 'success', source: 'IBB', verifiedExternal: null },
  { id: 4, code: 'LAZADA-IBB200', customer: 'Wanida T.', tier: 'General', bookingRef: 'IBB-2026-001237', originalAmount: 1800, discountAmount: 200, finalAmount: 1600, usedAt: '2026-03-24 10:30', status: 'success', source: 'Lazada', verifiedExternal: true },
  { id: 5, code: 'IBB-VVIP15', customer: 'Prayuth C.', tier: 'VVIP', bookingRef: 'IBB-2026-001238', originalAmount: 8500, discountAmount: 1275, finalAmount: 7225, usedAt: '2026-03-24 11:00', status: 'success', source: 'IBB', verifiedExternal: null },
  { id: 6, code: 'IBB-EXPIRED99', customer: 'Apinya R.', tier: 'General', bookingRef: null, originalAmount: 1500, discountAmount: 0, finalAmount: 1500, usedAt: '2026-03-24 11:15', status: 'expired', source: 'IBB', verifiedExternal: null },
  { id: 7, code: 'SHOPEE-FAKE01', customer: 'Unknown', tier: 'General', bookingRef: null, originalAmount: 2000, discountAmount: 0, finalAmount: 2000, usedAt: '2026-03-24 11:30', status: 'invalid', source: 'Shopee', verifiedExternal: false },
  { id: 8, code: 'IBB-BP-CORP', customer: 'Thai Airways Co.', tier: 'Business Partner', bookingRef: 'IBB-2026-001239', originalAmount: 45000, discountAmount: 5400, finalAmount: 39600, usedAt: '2026-03-24 12:00', status: 'success', source: 'IBB', verifiedExternal: null },
  { id: 9, code: 'AMAZON-IBB5', customer: 'John D.', tier: 'VIP', bookingRef: 'IBB-2026-001240', originalAmount: 5200, discountAmount: 260, finalAmount: 4940, usedAt: '2026-03-24 12:30', status: 'success', source: 'Amazon', verifiedExternal: true },
  { id: 10, code: 'IBB-MARCH10', customer: 'Siriwan M.', tier: 'General', bookingRef: 'IBB-2026-001241', originalAmount: 1200, discountAmount: 120, finalAmount: 1080, usedAt: '2026-03-24 13:00', status: 'success', source: 'IBB', verifiedExternal: null },
]

const statusConfig = {
  success: { label: 'Success', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  expired: { label: 'Expired', color: 'bg-gray-100 text-gray-600', icon: Clock },
  invalid: { label: 'Invalid', color: 'bg-red-100 text-red-700', icon: XCircle },
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
}

const tierColor = {
  'General': 'bg-blue-50 text-blue-600',
  'VIP': 'bg-pink-50 text-pink-600',
  'VVIP': 'bg-yellow-50 text-yellow-600',
  'Business Partner': 'bg-green-50 text-green-600',
}

const sourceColor = {
  IBB: 'bg-blue-100 text-blue-700',
  Shopee: 'bg-orange-100 text-orange-700',
  Lazada: 'bg-purple-100 text-purple-700',
  Amazon: 'bg-yellow-100 text-yellow-700',
}

export default function VoucherRedemption() {
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
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = redemptions.filter(r => {
    const matchSearch = r.code.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.toLowerCase().includes(search.toLowerCase()) ||
      (r.bookingRef || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  const successCount = redemptions.filter(r => r.status === 'success').length
  const totalDiscount = redemptions.filter(r => r.status === 'success').reduce((s, r) => s + r.discountAmount, 0)
  const invalidCount = redemptions.filter(r => r.status === 'invalid' || r.status === 'expired').length
  const externalPending = redemptions.filter(r => r.source !== 'IBB' && r.verifiedExternal === null && r.status === 'success').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-100 border border-teal-200">
            <CheckCircle className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Voucher Redemption</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Voucher usage history All</p>
          </div>
        </div>
        <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2"  onClick={handleExport}/>Export</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">Successful</p>
          <p className="text-2xl font-bold text-green-600">{successCount}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">Total Discount Given</p>
          <p className="text-2xl font-bold text-orange-600">฿{totalDiscount.toLocaleString()}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">Invalid / Expired</p>
          <p className="text-2xl font-bold text-red-600">{invalidCount}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">External Pending Verify</p>
              <p className="text-2xl font-bold text-yellow-600">{externalPending}</p>
            </div>
            {externalPending > 0 && <Badge className="text-xs bg-yellow-100 text-yellow-700">Action needed</Badge>}
          </div>
        </CardContent></Card>
      </div>

      {/* External Platform Notice */}
      {externalPending > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-3">
              <RefreshCw className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800 text-sm">External Platform Verification Required</p>
                <p className="text-xs text-yellow-700 mt-0.5">Has {externalPending} Items using vouchers from External Platforms (Shopee/Lazada/Amazon) not yet confirmed back to source platform per terms Business Spec</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card><CardContent className="pt-4 pb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search code, customer, booking ref..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {['all', 'success', 'expired', 'invalid'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border capitalize transition-colors ${statusFilter === s ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </CardContent></Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Code</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Booking Ref</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Original</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Discount</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Final</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Used At</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const StatusIcon = statusConfig[r.status]?.icon || CheckCircle
                return (
                  <tr key={r.id} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{r.code}</code>
                        <Badge className={`text-xs ${sourceColor[r.source] || 'bg-gray-100 text-gray-600'}`}>{r.source}</Badge>
                      </div>
                      {r.source !== 'IBB' && r.verifiedExternal !== null && (
                        <p className={`text-xs mt-0.5 ${r.verifiedExternal ? 'text-green-600' : 'text-red-600'}`}>
                          {r.verifiedExternal ? '✓ Verified with platform' : '✗ Verification failed'}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-xs">{r.customer}</p>
                      <Badge className={`text-xs mt-0.5 ${tierColor[r.tier]}`}>{r.tier}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {r.bookingRef ? <code className="text-xs text-blue-600">{r.bookingRef}</code> : <span className="text-xs text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right text-xs">฿{r.originalAmount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-xs font-bold ${r.discountAmount > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {r.discountAmount > 0 ? `-฿${r.discountAmount.toLocaleString()}` : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs font-bold">฿{r.finalAmount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{r.usedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <StatusIcon className={`h-3.5 w-3.5 ${r.status === 'success' ? 'text-green-600' : r.status === 'invalid' ? 'text-red-600' : 'text-gray-500'}`} />
                        <Badge className={`text-xs ${statusConfig[r.status]?.color}`}>{statusConfig[r.status]?.label}</Badge>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
