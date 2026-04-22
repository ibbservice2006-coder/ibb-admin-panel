import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Download, TrendingUp, DollarSign, CreditCard, Wallet } from 'lucide-react'

const dailyRevenue = [
  { date: 'Mar 18', total: 82000, stripe: 28000, omise: 15000, bank: 22000, wallet: 12000, crypto: 5000 },
  { date: 'Mar 19', total: 95000, stripe: 32000, omise: 18000, bank: 25000, wallet: 15000, crypto: 5000 },
  { date: 'Mar 20', total: 78000, stripe: 24000, omise: 14000, bank: 20000, wallet: 16000, crypto: 4000 },
  { date: 'Mar 21', total: 110000, stripe: 38000, omise: 20000, bank: 30000, wallet: 17000, crypto: 5000 },
  { date: 'Mar 22', total: 125000, stripe: 42000, omise: 22000, bank: 35000, wallet: 20000, crypto: 6000 },
  { date: 'Mar 23', total: 98000, stripe: 33000, omise: 17000, bank: 28000, wallet: 14000, crypto: 6000 },
  { date: 'Mar 24', total: 72000, stripe: 25000, omise: 12000, bank: 18000, wallet: 12000, crypto: 5000 },
]

const methodBreakdown = [
  { name: 'Stripe', value: 222000, color: '#8b5cf6', pct: 32 },
  { name: 'Bank Transfer', value: 178000, color: '#3b82f6', pct: 26 },
  { name: 'Omise', value: 118000, color: '#6366f1', pct: 17 },
  { name: 'Wallet', value: 106000, color: '#10b981', pct: 15 },
  { name: 'Crypto', value: 36000, color: '#f59e0b', pct: 5 },
  { name: 'Payoneer/Wise', value: 34000, color: '#f97316', pct: 5 },
]

const tierRevenue = [
  { tier: 'General', revenue: 145000, bookings: 312, avgTicket: 465 },
  { tier: 'VIP', revenue: 298000, bookings: 187, avgTicket: 1594 },
  { tier: 'VVIP', revenue: 186000, bookings: 54, avgTicket: 3444 },
  { tier: 'Business Partner', revenue: 371000, bookings: 89, avgTicket: 4169 },
]

const COLORS = ['#8b5cf6', '#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#f97316']

const tierColor = {
  'General': 'bg-blue-100 text-blue-700',
  'VIP': 'bg-pink-100 text-pink-700',
  'VVIP': 'bg-yellow-100 text-yellow-700',
  'Business Partner': 'bg-green-100 text-green-700',
}

export default function PaymentReports() {
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
  const [period, setPeriod] = useState('7d')

  const totalRevenue = dailyRevenue.reduce((s, d) => s + d.total, 0)
  const totalTransactions = 660
  const avgTicket = Math.round(totalRevenue / totalTransactions)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-green-100 border border-green-200">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Payment Reports</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Revenue Summary and Payment Channel Analysis</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${period === p ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2"  onClick={handleExport}/>Export</Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50"><DollarSign className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className="text-xl font-bold text-green-600">฿{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50"><CreditCard className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Transactions</p>
                <p className="text-xl font-bold text-blue-600">{totalTransactions.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50"><Wallet className="h-5 w-5 text-purple-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Ticket</p>
                <p className="text-xl font-bold text-purple-600">฿{avgTicket.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-50"><TrendingUp className="h-5 w-5 text-yellow-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Top Channel</p>
                <p className="text-xl font-bold text-yellow-600">Stripe</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Revenue Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Daily Revenue by Payment Channel</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dailyRevenue} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `฿${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v, n) => [`฿${v.toLocaleString()}`, n]} />
              <Legend />
              <Bar dataKey="stripe" name="Stripe" fill="#8b5cf6" stackId="a" radius={[0,0,0,0]} />
              <Bar dataKey="omise" name="Omise" fill="#6366f1" stackId="a" />
              <Bar dataKey="bank" name="Bank Transfer" fill="#3b82f6" stackId="a" />
              <Bar dataKey="wallet" name="Wallet" fill="#10b981" stackId="a" />
              <Bar dataKey="crypto" name="Crypto" fill="#f59e0b" stackId="a" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        {/* Pie Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue by Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={methodBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  dataKey="value" nameKey="name" paddingAngle={3}>
                  {methodBreakdown.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`฿${v.toLocaleString()}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {methodBreakdown.map(m => (
                <div key={m.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                  <span className="text-muted-foreground">{m.name}</span>
                  <span className="font-medium ml-auto">{m.pct}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Tier */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue by Membership Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tierRevenue.map(t => {
                const maxRevenue = Math.max(...tierRevenue.map(x => x.revenue))
                const pct = Math.round((t.revenue / tierRevenue.reduce((s, x) => s + x.revenue, 0)) * 100)
                return (
                  <div key={t.tier}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${tierColor[t.tier]}`}>{t.tier}</Badge>
                        <span className="text-xs text-muted-foreground">{t.bookings} bookings</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-sm">฿{t.revenue.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground ml-1">({pct}%)</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all"
                        style={{ width: `${(t.revenue / maxRevenue) * 100}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">Avg ticket: ฿{t.avgTicket.toLocaleString()}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Method Breakdown Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Payment Method Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Method</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Revenue</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Share</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Trend</th>
              </tr>
            </thead>
            <tbody>
              {methodBreakdown.map((m, i) => (
                <tr key={m.name} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} />
                      <span className="font-medium">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-bold">฿{m.value.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${m.pct}%`, backgroundColor: m.color }} />
                      </div>
                      <span className="text-muted-foreground">{m.pct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-green-600 font-medium">+{Math.floor(Math.random() * 15) + 2}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
