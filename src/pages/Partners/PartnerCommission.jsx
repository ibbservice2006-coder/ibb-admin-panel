import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DollarSign, CheckCircle, Clock, XCircle, TrendingUp, AlertCircle } from 'lucide-react'

const commissions = [
  { id: 'COM001', partnerId: 'P002', partnerName: 'Amazing Thailand Tours', type: 'company', feeType: 'commission',
    period: 'Mar 2024', bookings: 52, revenue: 260000, rate: 5, amount: 13000,
    status: 'pending', dueDate: '2024-04-05', paymentMethod: 'Bank Transfer' },
  { id: 'COM002', partnerId: 'P004', partnerName: 'Pattaya Beach Hotel Group', type: 'company', feeType: 'commission',
    period: 'Mar 2024', bookings: 33, revenue: 165000, rate: 5, amount: 8250,
    status: 'pending', dueDate: '2024-04-05', paymentMethod: 'Bank Transfer' },
  { id: 'COM003', partnerId: 'P001', partnerName: 'Somsak Wongdee', type: 'individual', feeType: 'referral',
    period: 'Mar 2024', bookings: 8, revenue: 40000, rate: 5, amount: 2000,
    status: 'pending', dueDate: '2024-04-05', paymentMethod: 'PromptPay' },
  { id: 'COM004', partnerId: 'P007', partnerName: 'Hua Hin Travel Agency', type: 'company', feeType: 'commission',
    period: 'Mar 2024', bookings: 14, revenue: 70000, rate: 5, amount: 3500,
    status: 'approved', dueDate: '2024-04-05', paymentMethod: 'Bank Transfer' },
  { id: 'COM005', partnerId: 'P003', partnerName: 'Napa Loves Traveling', type: 'individual', feeType: 'referral',
    period: 'Mar 2024', bookings: 4, revenue: 20000, rate: 5, amount: 1000,
    status: 'pending', dueDate: '2024-04-05', paymentMethod: 'PromptPay' },
  { id: 'COM006', partnerId: 'P002', partnerName: 'Amazing Thailand Tours', type: 'company', feeType: 'commission',
    period: 'Feb 2024', bookings: 48, revenue: 240000, rate: 5, amount: 12000,
    status: 'paid', dueDate: '2024-03-05', paymentMethod: 'Bank Transfer', paidDate: '2024-03-04' },
  { id: 'COM007', partnerId: 'P004', partnerName: 'Pattaya Beach Hotel Group', type: 'company', feeType: 'commission',
    period: 'Feb 2024', bookings: 31, revenue: 155000, rate: 5, amount: 7750,
    status: 'paid', dueDate: '2024-03-05', paymentMethod: 'Bank Transfer', paidDate: '2024-03-04' },
  { id: 'COM008', partnerId: 'P001', partnerName: 'Somsak Wongdee', type: 'individual', feeType: 'referral',
    period: 'Feb 2024', bookings: 7, revenue: 35000, rate: 5, amount: 1750,
    status: 'paid', dueDate: '2024-03-05', paymentMethod: 'PromptPay', paidDate: '2024-03-05' },
]

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  approved: { label: 'Approved', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
}

const feeTypeLabel = {
  commission: 'Commission',
  referral: 'Referral Fee',
}

export default function PartnerCommission() {
  const { toast } = useToast()
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPeriod, setFilterPeriod] = useState('all')
  const [selected, setSelected] = useState([])

  const filtered = commissions.filter(c => {
    const matchStatus = filterStatus === 'all' || c.status === filterStatus
    const matchPeriod = filterPeriod === 'all' || c.period === filterPeriod
    return matchStatus && matchPeriod
  })

  const pendingTotal = commissions.filter(c => c.status === 'pending' || c.status === 'approved').reduce((a, c) => a + c.amount, 0)
  const paidTotal = commissions.filter(c => c.status === 'paid').reduce((a, c) => a + c.amount, 0)
  const pendingCount = commissions.filter(c => c.status === 'pending').length

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-yellow-100 border border-yellow-200">
            <DollarSign className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Commission & Referral Fee</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Calculate & approve Commission / Referral payments to Partner</p>
          </div>
        </div>
        {selected.length > 0 && (
          <Button size="sm" className="bg-gray-700 hover:bg-gray-700" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
            <CheckCircle className="h-3.5 w-3.5 mr-1" />Approve payment {selected.length} List
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Pending Payment', value: `฿${(pendingTotal / 1000).toFixed(1)}K`, color: 'text-yellow-700', bg: 'bg-yellow-50', icon: Clock },
          { label: 'Pending Items', value: pendingCount, color: 'text-orange-700', bg: 'bg-orange-50', icon: AlertCircle },
          { label: 'Paid This Month', value: `฿${(paidTotal / 1000).toFixed(1)}K`, color: 'text-green-700', bg: 'bg-green-50', icon: CheckCircle },
          { label: 'Total Partners', value: new Set(commissions.map(c => c.partnerId)).size, color: 'text-blue-700', bg: 'bg-blue-50', icon: TrendingUp },
        ].map(s => (
          <Card key={s.label} className={`${s.bg} border-0`}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
                <s.icon className={`h-6 w-6 ${s.color} opacity-60`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPeriod} onValueChange={setFilterPeriod}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Installment" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Every Installment</SelectItem>
            <SelectItem value="Mar 2024">Mar 2024</SelectItem>
            <SelectItem value="Feb 2024">Feb 2024</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Commission Table */}
      <Card>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="text-left py-2 w-8">
                    <input type="checkbox" className="rounded" onChange={e => {
                      if (e.target.checked) setSelected(filtered.filter(c => c.status === 'pending').map(c => c.id))
                      else setSelected([])
                    }} />
                  </th>
                  <th className="text-left py-2 font-medium">Partner</th>
                  <th className="text-left py-2 font-medium"> >Installment</th>
                  <th className="text-right py-2 font-medium">Bookings</th>
                  <th className="text-right py-2 font-medium">Revenue</th>
                  <th className="text-right py-2 font-medium">Rate</th>
                  <th className="text-right py-2 font-medium"> >Amount paid</th>
                  <th className="text-right py-2 font-medium">Channel</th>
                  <th className="text-right py-2 font-medium">Status</th>
                  <th className="text-right py-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const StatusIcon = statusConfig[c.status].icon
                  return (
                    <tr key={c.id} className={`border-b hover:bg-gray-50 ${selected.includes(c.id) ? 'bg-blue-50' : ''}`}>
                      <td className="py-2.5">
                        {c.status === 'pending' && (
                          <input type="checkbox" className="rounded" checked={selected.includes(c.id)}
                            onChange={() => toggleSelect(c.id)} />
                        )}
                      </td>
                      <td className="py-2.5">
                        <div>
                          <p className="font-medium text-xs">{c.partnerName}</p>
                          <Badge className={`text-xs mt-0.5 ${c.feeType === 'referral' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                            {feeTypeLabel[c.feeType]}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-2.5 text-xs text-muted-foreground">{c.period}</td>
                      <td className="py-2.5 text-right text-xs">{c.bookings}</td>
                      <td className="py-2.5 text-right text-xs">฿{c.revenue.toLocaleString()}</td>
                      <td className="py-2.5 text-right text-xs font-medium">{c.rate}%</td>
                      <td className="py-2.5 text-right text-xs font-bold text-green-700">฿{c.amount.toLocaleString()}</td>
                      <td className="py-2.5 text-right text-xs text-muted-foreground">{c.paymentMethod}</td>
                      <td className="py-2.5 text-right">
                        <Badge className={`text-xs ${statusConfig[c.status].color}`}>
                          <StatusIcon className="h-2.5 w-2.5 mr-1" />
                          {statusConfig[c.status].label}
                        </Badge>
                      </td>
                      <td className="py-2.5 text-right">
                        {c.status === 'pending' && (
                          <Button variant="outline" size="sm" className="h-6 px-2 text-xs text-green-700 border-green-300 hover:bg-green-50" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                            Approve
                          </Button>
                        )}
                        {c.status === 'approved' && (
                          <Button size="sm" className="px-2 text-xs bg-gray-700 hover:bg-gray-700" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                            Pay
                          </Button>
                        )}
                        {c.status === 'paid' && (
                          <span className="text-xs text-muted-foreground">{c.paidDate}</span>
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
    </div>
  )
}
