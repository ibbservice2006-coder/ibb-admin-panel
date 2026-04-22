import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { Download, TrendingUp, TrendingDown, DollarSign, RefreshCw, Calendar, ArrowUpRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const monthlyRevenue = [
  { month: 'Oct', total: 1820000, bookings: 1240000, wallet: 320000, platform: 260000 },
  { month: 'Nov', total: 2150000, bookings: 1480000, wallet: 380000, platform: 290000 },
  { month: 'Dec', total: 3240000, bookings: 2210000, wallet: 580000, platform: 450000 },
  { month: 'Jan', total: 2480000, bookings: 1720000, wallet: 420000, platform: 340000 },
  { month: 'Feb', total: 2760000, bookings: 1890000, wallet: 480000, platform: 390000 },
  { month: 'Mar', total: 3120000, bookings: 2140000, wallet: 540000, platform: 440000 },
]

const revenueByVehicle = [
  { type: 'Van 9 Seats', revenue: 4820000, pct: 31.2, color: '#6366f1' },
  { type: 'Car 4 Seats', revenue: 3560000, pct: 23.0, color: '#3b82f6' },
  { type: 'Van 12 Seats', revenue: 3210000, pct: 20.8, color: '#8b5cf6' },
  { type: 'Minibus 20', revenue: 2180000, pct: 14.1, color: '#f59e0b' },
  { type: 'Bus 40+', revenue: 1680000, pct: 10.9, color: '#10b981' },
]

const revenueByRoute = [
  { route: 'BKK → Pattaya', revenue: 2840000, trips: 1420 },
  { route: 'BKK → Hua Hin', revenue: 2210000, trips: 1105 },
  { route: 'BKK → Kanchanaburi', revenue: 1680000, trips: 840 },
  { route: 'BKK → Ayutthaya', revenue: 1450000, trips: 725 },
  { route: 'Pattaya → Airport', revenue: 1320000, trips: 880 },
  { route: 'BKK → Chiang Mai', revenue: 980000, trips: 196 },
]

const revenueByCurrency = [
  { currency: 'THB', amount: 9840000, pct: 63.7 },
  { currency: 'USD', amount: 2450000, pct: 15.9 },
  { currency: 'CNY', amount: 1320000, pct: 8.5 },
  { currency: 'EUR', amount: 890000, pct: 5.8 },
  { currency: 'Others', amount: 950000, pct: 6.1 },
]

const weeklyTrend = [
  { week: 'W1 Mar', revenue: 680000, target: 650000 },
  { week: 'W2 Mar', revenue: 720000, target: 700000 },
  { week: 'W3 Mar', revenue: 810000, target: 750000 },
  { week: 'W4 Mar', revenue: 910000, target: 800000 },
]

const COLORS = ['#6366f1', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981']

export default function RevenueReport() {
  const [period, setPeriod] = useState('6m')
  const { toast } = useToast()

  const totalRevenue = monthlyRevenue.reduce((a, m) => a + m.total, 0)
  const lastMonth = monthlyRevenue[monthlyRevenue.length - 1].total
  const prevMonth = monthlyRevenue[monthlyRevenue.length - 2].total
  const growth = (((lastMonth - prevMonth) / prevMonth) * 100).toFixed(1)

  const handleExport = () => {
    toast({ title: 'Export Revenue Report', description: 'Generating PDF/Excel file...' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-green-100 border border-green-200">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Revenue Report</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Total revenue report all channels — Last updated Mar 25, 2026</p>
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
          { label: 'Total Revenue (6M)', value: `฿${(totalRevenue / 1000000).toFixed(1)}M`, sub: 'All channels combined', color: 'text-green-700', bg: 'bg-green-50', icon: DollarSign, trend: '+12.4%' },
          { label: 'Mar Revenue', value: `฿${(lastMonth / 1000000).toFixed(2)}M`, sub: `vs Feb ฿${(prevMonth / 1000000).toFixed(2)}M`, color: 'text-blue-700', bg: 'bg-blue-50', icon: TrendingUp, trend: `+${growth}%` },
          { label: 'Avg Monthly', value: `฿${(totalRevenue / 6 / 1000000).toFixed(2)}M`, sub: 'Per month average', color: 'text-purple-700', bg: 'bg-purple-50', icon: Calendar, trend: '+8.1%' },
          { label: 'Top Route Revenue', value: '฿2.84M', sub: 'BKK → Pattaya', color: 'text-orange-700', bg: 'bg-orange-50', icon: ArrowUpRight, trend: '+5.2%' },
        ].map(s => (
          <Card key={s.label} className={`${s.bg} border-0`}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
                </div>
                <div className="text-right">
                  <s.icon className={`h-5 w-5 ${s.color} opacity-60 mb-1`} />
                  <Badge className="text-xs bg-green-100 text-green-700">{s.trend}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Revenue Area Chart */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            Monthly Revenue Breakdown (6 Month)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorWallet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPlatform" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `฿${(v / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(v) => `฿${v.toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="bookings" name="Direct Bookings" stroke="#6366f1" fill="url(#colorBookings)" strokeWidth={2} />
              <Area type="monotone" dataKey="wallet" name="Wallet Payments" stroke="#10b981" fill="url(#colorWallet)" strokeWidth={2} />
              <Area type="monotone" dataKey="platform" name="Platform Sales" stroke="#f59e0b" fill="url(#colorPlatform)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Vehicle Type */}
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base">Revenue by Vehicle Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueByVehicle} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => `฿${(v / 1000000).toFixed(1)}M`} />
                <YAxis type="category" dataKey="type" tick={{ fontSize: 10 }} width={90} />
                <Tooltip formatter={(v) => `฿${v.toLocaleString()}`} />
                <Bar dataKey="revenue" name="Revenue" radius={[0, 4, 4, 0]}>
                  {revenueByVehicle.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Currency */}
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base">Revenue by Currency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="45%" height={180}>
                <PieChart>
                  <Pie data={revenueByCurrency} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="amount">
                    {revenueByCurrency.map((entry, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `฿${(v / 1000000).toFixed(2)}M`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {revenueByCurrency.map((c, i) => (
                  <div key={c.currency} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="font-medium">{c.currency}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">฿{(c.amount / 1000000).toFixed(1)}M</span>
                      <span className="text-muted-foreground ml-1">({c.pct}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Revenue Routes */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base">Top Revenue Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="text-left py-2 font-medium">#</th>
                  <th className="text-left py-2 font-medium">Route</th>
                  <th className="text-right py-2 font-medium">Revenue</th>
                  <th className="text-right py-2 font-medium">Trips</th>
                  <th className="text-right py-2 font-medium">Avg/Trip</th>
                  <th className="text-left py-2 font-medium pl-4">Share</th>
                </tr>
              </thead>
              <tbody>
                {revenueByRoute.map((r, i) => {
                  const totalR = revenueByRoute.reduce((a, x) => a + x.revenue, 0)
                  const pct = (r.revenue / totalR * 100).toFixed(1)
                  return (
                    <tr key={r.route} className="border-b hover:bg-gray-50">
                      <td className="py-2.5 text-xs font-bold text-muted-foreground">{i + 1}</td>
                      <td className="py-2.5 text-xs font-medium">{r.route}</td>
                      <td className="py-2.5 text-right text-xs font-bold text-green-700">฿{(r.revenue / 1000000).toFixed(2)}M</td>
                      <td className="py-2.5 text-right text-xs">{r.trips.toLocaleString()}</td>
                      <td className="py-2.5 text-right text-xs">฿{Math.round(r.revenue / r.trips).toLocaleString()}</td>
                      <td className="py-2.5 pl-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5 w-24">
                            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{pct}%</span>
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

      {/* Weekly Target vs Actual */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base">Weekly Revenue vs Target (March 2026)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `฿${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => `฿${v.toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="revenue" name="Actual Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" name="Target" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
