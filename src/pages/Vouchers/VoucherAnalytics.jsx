import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Ticket, DollarSign, Percent } from 'lucide-react'

const dailyUsage = [
  { date: 'Mar 18', ibb: 45, external: 32, discount: 12400 },
  { date: 'Mar 19', ibb: 62, external: 41, discount: 18700 },
  { date: 'Mar 20', ibb: 38, external: 28, discount: 9800 },
  { date: 'Mar 21', ibb: 71, external: 55, discount: 22100 },
  { date: 'Mar 22', ibb: 89, external: 67, discount: 28500 },
  { date: 'Mar 23', ibb: 54, external: 43, discount: 16200 },
  { date: 'Mar 24', ibb: 42, external: 31, discount: 13600 },
]

const topVouchers = [
  { code: 'SHOPEE-IBB10', redemptions: 1243, discount: 48200, source: 'Shopee' },
  { code: 'IBB-MARCH10', redemptions: 876, discount: 31400, source: 'IBB' },
  { code: 'IBB-WELCOME20', redemptions: 342, discount: 28600, source: 'IBB' },
  { code: 'LAZADA-IBB200', redemptions: 456, discount: 18200, source: 'Lazada' },
  { code: 'IBB-VIP500', redemptions: 87, discount: 17400, source: 'IBB' },
]

const tierUsage = [
  { tier: 'General', count: 1456, color: '#3b82f6' },
  { tier: 'VIP', count: 876, color: '#ec4899' },
  { tier: 'VVIP', count: 234, color: '#f59e0b' },
  { tier: 'Business Partner', count: 89, color: '#10b981' },
]

const sourceBreakdown = [
  { name: 'IBB', value: 1456, color: '#3b82f6' },
  { name: 'Shopee', value: 1243, color: '#f97316' },
  { name: 'Lazada', value: 456, color: '#8b5cf6' },
  { name: 'Amazon', value: 289, color: '#f59e0b' },
]

export default function VoucherAnalytics() {
  const totalRedemptions = dailyUsage.reduce((s, d) => s + d.ibb + d.external, 0)
  const totalDiscount = dailyUsage.reduce((s, d) => s + d.discount, 0)
  const avgDiscount = Math.round(totalDiscount / totalRedemptions)
  const conversionRate = 18.4

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-100 border border-indigo-200">
          <TrendingUp className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Voucher Analytics</h1>
          <p className="text-muted-foreground text-sm mt-0.5"> >Analyze Voucher and Promotion Performance</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50"><Ticket className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-xs text-muted-foreground">Total Redemptions</p><p className="text-2xl font-bold text-blue-600">{totalRedemptions.toLocaleString()}</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-50"><DollarSign className="h-5 w-5 text-orange-600" /></div>
            <div><p className="text-xs text-muted-foreground">Total Discount Given</p><p className="text-2xl font-bold text-orange-600">฿{(totalDiscount/1000).toFixed(0)}K</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-50"><DollarSign className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-xs text-muted-foreground">Avg Discount / Use</p><p className="text-2xl font-bold text-green-600">฿{avgDiscount.toLocaleString()}</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50"><Percent className="h-5 w-5 text-purple-600" /></div>
            <div><p className="text-xs text-muted-foreground">Conversion Rate</p><p className="text-2xl font-bold text-purple-600">{conversionRate}%</p></div>
          </div>
        </CardContent></Card>
      </div>

      {/* Daily Usage Chart */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Daily Redemptions (IBB vs External)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dailyUsage} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="ibb" name="IBB Vouchers" fill="#3b82f6" radius={[4,4,0,0]} />
              <Bar dataKey="external" name="External Platform" fill="#f97316" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        {/* Source Breakdown Pie */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Redemptions by Source</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={sourceBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {sourceBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [v.toLocaleString(), 'Redemptions']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {sourceBreakdown.map(s => (
                <div key={s.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-muted-foreground">{s.name}</span>
                  <span className="font-medium ml-auto">{s.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tier Usage */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Redemptions by Tier</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3 mt-2">
              {tierUsage.map(t => {
                const total = tierUsage.reduce((s, x) => s + x.count, 0)
                const pct = Math.round((t.count / total) * 100)
                return (
                  <div key={t.tier}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{t.tier}</span>
                      <span className="text-xs text-muted-foreground">{t.count.toLocaleString()} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: t.color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Vouchers */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Top Performing Vouchers</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Code</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Redemptions</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Discount Given</th>
              </tr>
            </thead>
            <tbody>
              {topVouchers.map((v, i) => (
                <tr key={v.code} className={`border-b last:border-0 hover:bg-muted/30 ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                  <td className="px-4 py-3 text-muted-foreground font-bold">#{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{v.code}</code>
                      <Badge className={`text-xs ${v.source === 'IBB' ? 'bg-blue-100 text-blue-700' : v.source === 'Shopee' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>{v.source}</Badge>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-bold">{v.redemptions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-bold text-orange-600">฿{v.discount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
