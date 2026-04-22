import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts'
import { Download, Users, UserCheck, TrendingUp, Star, Globe, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const customerGrowth = [
  { month: 'Oct', new: 142, returning: 380, total: 522 },
  { month: 'Nov', new: 168, returning: 420, total: 588 },
  { month: 'Dec', new: 215, returning: 510, total: 725 },
  { month: 'Jan', new: 178, returning: 465, total: 643 },
  { month: 'Feb', new: 192, returning: 498, total: 690 },
  { month: 'Mar', new: 224, returning: 542, total: 766 },
]

const membershipDist = [
  { name: 'General', value: 3420, color: '#94a3b8' },
  { name: 'VIP', value: 842, color: '#f59e0b' },
  { name: 'VVIP', value: 156, color: '#8b5cf6' },
  { name: 'Business Partner', value: 48, color: '#10b981' },
]

const customersByNationality = [
  { country: 'Thailand', customers: 2840, pct: 62.8, flag: '🇹🇭' },
  { country: 'China', customers: 680, pct: 15.0, flag: '🇨🇳' },
  { country: 'Russia', customers: 285, pct: 6.3, flag: '🇷🇺' },
  { country: 'Middle East', customers: 210, pct: 4.6, flag: '🇦🇪' },
  { country: 'Europe', customers: 195, pct: 4.3, flag: '🇪🇺' },
  { country: 'Others', customers: 316, pct: 7.0, flag: '🌍' },
]

const retentionData = [
  { month: 'Oct', rate: 68.2 },
  { month: 'Nov', rate: 70.5 },
  { month: 'Dec', rate: 72.1 },
  { month: 'Jan', rate: 69.8 },
  { month: 'Feb', rate: 73.4 },
  { month: 'Mar', rate: 75.2 },
]

const topCustomers = [
  { name: 'ABC Company Ltd.', type: 'Business Partner', bookings: 48, spent: 1240000, tier: 'VVIP' },
  { name: 'Alibaba Travel Group', type: 'Corporate', bookings: 36, spent: 980000, tier: 'VVIP' },
  { name: 'Somchai Rakkanthang', type: 'Individual', bookings: 24, spent: 580000, tier: 'VIP' },
  { name: 'Pattaya Beach Hotel', type: 'Corporate', bookings: 22, spent: 520000, tier: 'VIP' },
  { name: 'Napa Thai Travel', type: 'Individual', bookings: 18, spent: 420000, tier: 'VIP' },
]

const avgOrderValue = [
  { month: 'Oct', general: 3200, vip: 5800, vvip: 12400 },
  { month: 'Nov', general: 3350, vip: 6100, vvip: 13200 },
  { month: 'Dec', general: 3800, vip: 7200, vvip: 15600 },
  { month: 'Jan', general: 3100, vip: 5900, vvip: 12800 },
  { month: 'Feb', general: 3400, vip: 6300, vvip: 13800 },
  { month: 'Mar', general: 3650, vip: 6800, vvip: 14500 },
]

const tierColor = {
  'VVIP': 'bg-purple-100 text-purple-700',
  'VIP': 'bg-yellow-100 text-yellow-700',
  'General': 'bg-gray-100 text-gray-700',
}

export default function CustomersReport() {
  const [period, setPeriod] = useState('6m')
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

  const totalCustomers = membershipDist.reduce((a, m) => a + m.value, 0)
  const lastMonthNew = customerGrowth[customerGrowth.length - 1].new
  const lastRetention = retentionData[retentionData.length - 1].rate

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100 border border-blue-200">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Customers Report</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Analyze Customers, Behavior & Retention</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['1m', '3m', '6m', '1y'].map(p => (
            <Button key={p} size="sm" variant={period === p ? 'default' : 'outline'}
              onClick={() => setPeriod(p)} className="text-xs h-7">{p.toUpperCase()}</Button>
          ))}
          <Button size="sm" variant="outline" onClick={handleExport} className="gap-1.5 ml-2">
            <Download className="h-3.5 w-3.5" />Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Customers', value: totalCustomers.toLocaleString(), sub: 'All tiers', color: 'text-blue-700', bg: 'bg-blue-50', icon: Users },
          { label: 'New This Month', value: lastMonthNew.toString(), sub: 'Mar 2026', color: 'text-green-700', bg: 'bg-green-50', icon: UserCheck },
          { label: 'Retention Rate', value: `${lastRetention}%`, sub: 'Mar 2026', color: 'text-purple-700', bg: 'bg-purple-50', icon: TrendingUp },
          { label: 'VIP+ Members', value: (842 + 156 + 48).toLocaleString(), sub: 'VIP / VVIP / BP', color: 'text-yellow-700', bg: 'bg-yellow-50', icon: Star },
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

      {/* Customer Growth */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base">Customer Growth — New vs Returning</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={customerGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="returning" name="Returning" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
              <Bar dataKey="new" name="New Customers" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Membership Distribution */}
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base">Membership Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="45%" height={180}>
                <PieChart>
                  <Pie data={membershipDist} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value">
                    {membershipDist.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2.5">
                {membershipDist.map(m => (
                  <div key={m.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                      <span className="font-medium">{m.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{m.value.toLocaleString()}</span>
                      <span className="text-muted-foreground ml-1">({(m.value / totalCustomers * 100).toFixed(1)}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers by Nationality */}
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" />Customers by Nationality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {customersByNationality.map(c => (
                <div key={c.country} className="flex items-center gap-3">
                  <span className="text-lg w-6">{c.flag}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="font-medium">{c.country}</span>
                      <span className="text-muted-foreground">{c.customers.toLocaleString()} ({c.pct}%)</span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Retention Rate Trend */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base">Customer Retention Rate Trend (%)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={retentionData}>
              <defs>
                <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[60, 80]} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Area type="monotone" dataKey="rate" name="Retention Rate" stroke="#6366f1" fill="url(#retentionGrad)" strokeWidth={2} dot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Avg Order Value by Tier */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base">Average Order Value by Membership Tier (฿)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={avgOrderValue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `฿${v.toLocaleString()}`} />
              <Tooltip formatter={(v) => `฿${v.toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="vvip" name="VVIP" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="vip" name="VIP" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="general" name="General" stroke="#94a3b8" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />Top Customers by Spending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="text-left py-2 font-medium">#</th>
                <th className="text-left py-2 font-medium">Customer</th>
                <th className="text-left py-2 font-medium">Type</th>
                <th className="text-right py-2 font-medium">Bookings</th>
                <th className="text-right py-2 font-medium">Total Spent</th>
                <th className="text-left py-2 font-medium pl-4">Tier</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((c, i) => (
                <tr key={c.name} className="border-b hover:bg-gray-50">
                  <td className="py-2.5 text-xs font-bold text-muted-foreground">{i + 1}</td>
                  <td className="py-2.5 text-xs font-medium">{c.name}</td>
                  <td className="py-2.5 text-xs text-muted-foreground">{c.type}</td>
                  <td className="py-2.5 text-right text-xs">{c.bookings}</td>
                  <td className="py-2.5 text-right text-xs font-bold text-green-700">฿{(c.spent / 1000000).toFixed(2)}M</td>
                  <td className="py-2.5 pl-4">
                    <Badge className={`text-xs ${tierColor[c.tier] || 'bg-gray-100 text-gray-700'}`}>{c.tier}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
