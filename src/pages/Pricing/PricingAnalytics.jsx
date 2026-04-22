import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { RefreshCw, Download, TrendingUp, TrendingDown, DollarSign, BarChart2 } from 'lucide-react'

const monthlyRevenue = [
  { month: 'Jul', revenue: 285000, bookings: 142, avgPrice: 2007 },
  { month: 'Aug', revenue: 312000, bookings: 158, avgPrice: 1975 },
  { month: 'Sep', revenue: 298000, bookings: 149, avgPrice: 2000 },
  { month: 'Oct', revenue: 345000, bookings: 172, avgPrice: 2006 },
  { month: 'Nov', revenue: 389000, bookings: 195, avgPrice: 1995 },
  { month: 'Dec', revenue: 452000, bookings: 226, avgPrice: 2000 },
  { month: 'Jan', revenue: 398000, bookings: 199, avgPrice: 2000 },
  { month: 'Feb', revenue: 361000, bookings: 180, avgPrice: 2006 },
  { month: 'Mar', revenue: 415000, bookings: 207, avgPrice: 2005 },
]

const topRoutesByRevenue = [
  { route: 'Bangkok - Phuket', zone: 'South', bookings: 48, revenue: 696000, avgPrice: 14500, growth: 12.5 },
  { route: 'Bangkok - Chiang Mai', zone: 'North', bookings: 62, revenue: 527000, avgPrice: 8500, growth: 8.2 },
  { route: 'Bangkok - Pattaya', zone: 'East', bookings: 134, revenue: 335000, avgPrice: 2500, growth: 15.3 },
  { route: 'Bangkok - Hua Hin', zone: 'South', bookings: 89, revenue: 311500, avgPrice: 3500, growth: 6.7 },
  { route: 'Bangkok - Suvarnabhumi Airport', zone: 'Airport', bookings: 198, revenue: 277200, avgPrice: 1400, growth: 22.1 },
  { route: 'Bangkok - Don Mueang Airport', zone: 'Airport', bookings: 187, revenue: 261800, avgPrice: 1400, growth: 19.8 },
  { route: 'Bangkok - Krabi', zone: 'South', bookings: 18, revenue: 207000, avgPrice: 11500, growth: 5.4 },
  { route: 'Bangkok - Khao Yai', zone: 'Northeast', bookings: 72, revenue: 180000, avgPrice: 2500, growth: 11.2 },
]

const vehicleRevenue = [
  { type: 'Car Standard', revenue: 845000, pct: 28 },
  { type: 'Car Executive', revenue: 623000, pct: 21 },
  { type: 'Car Limousine', revenue: 412000, pct: 14 },
  { type: 'MPV/Van', revenue: 534000, pct: 18 },
  { type: 'Car Family/Electric', revenue: 298000, pct: 10 },
  { type: 'Bus/Coach', revenue: 267000, pct: 9 },
]

const tierRevenue = [
  { tier: 'General', pct: 45, revenue: 1348650, color: 'bg-gray-400' },
  { tier: 'VIP', pct: 28, revenue: 839160, color: 'bg-blue-500' },
  { tier: 'VVIP', pct: 18, revenue: 539460, color: 'bg-purple-500' },
  { tier: 'Business Partner', pct: 9, revenue: 269730, color: 'bg-amber-500' },
]

const maxRev = Math.max(...monthlyRevenue.map(m => m.revenue))

export default function PricingAnalytics() {
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast({ title: 'Refreshed', description: 'Latest data loaded' })
    }, 800)
  }
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
  const totalRevenue = monthlyRevenue.reduce((s, m) => s + m.revenue, 0)
  const totalBookings = monthlyRevenue.reduce((s, m) => s + m.bookings, 0)
  const avgPrice = Math.round(totalRevenue / totalBookings)
  const lastMonth = monthlyRevenue[monthlyRevenue.length - 1]
  const prevMonth = monthlyRevenue[monthlyRevenue.length - 2]
  const growth = (((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100).toFixed(1)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-blue-600" /> Pricing Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">Analyze revenue and pricing efficiency by route, vehicle type, and membership</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
          <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Export</Button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-5">
          <p className="text-xs text-gray-500">Total Revenue (9 mo.)</p>
          <p className="text-2xl font-bold mt-1">฿{(totalRevenue / 1000000).toFixed(2)}M</p>
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" />+{growth}% vs last month</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <p className="text-xs text-gray-500">Total Bookings</p>
          <p className="text-2xl font-bold mt-1">{totalBookings.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">9-month total</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <p className="text-xs text-gray-500">Avg Booking Price</p>
          <p className="text-2xl font-bold mt-1">฿{avgPrice.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">Per booking</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <p className="text-xs text-gray-500">Best Month</p>
          <p className="text-2xl font-bold mt-1">Dec</p>
          <p className="text-xs text-gray-400 mt-1">฿452,000</p>
        </CardContent></Card>
      </div>

      {/* Monthly Revenue Chart */}
      <Card>
        <CardHeader><CardTitle className="text-base">Monthly Revenue</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-40">
            {monthlyRevenue.map(m => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500">฿{(m.revenue / 1000).toFixed(0)}k</span>
                <div className="w-full bg-blue-500 rounded-t" style={{ height: `${(m.revenue / maxRev) * 100}px` }} />
                <span className="text-xs text-gray-500">{m.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vehicle Revenue */}
        <Card>
          <CardHeader><CardTitle className="text-base">Revenue by Vehicle Type</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vehicleRevenue.map(v => (
                <div key={v.type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{v.type}</span>
                    <span className="font-medium">฿{(v.revenue / 1000).toFixed(0)}k ({v.pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${v.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tier Revenue */}
        <Card>
          <CardHeader><CardTitle className="text-base">Revenue by Membership Tier</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tierRevenue.map(t => (
                <div key={t.tier}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{t.tier}</span>
                    <span className="font-medium">฿{(t.revenue / 1000).toFixed(0)}k ({t.pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${t.color}`} style={{ width: `${t.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Routes */}
      <Card>
        <CardHeader><CardTitle className="text-base">Top Routes by Revenue</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">#</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Route</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Zone</th>
                  <th className="text-right px-4 py-2 font-medium text-gray-600">Bookings</th>
                  <th className="text-right px-4 py-2 font-medium text-gray-600">Revenue</th>
                  <th className="text-right px-4 py-2 font-medium text-gray-600">Avg Price</th>
                  <th className="text-right px-4 py-2 font-medium text-gray-600">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topRoutesByRevenue.map((r, i) => (
                  <tr key={r.route} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-bold text-gray-400">{i + 1}</td>
                    <td className="px-4 py-2 font-medium text-gray-900">{r.route}</td>
                    <td className="px-4 py-2"><Badge variant="outline" className="text-xs">{r.zone}</Badge></td>
                    <td className="px-4 py-2 text-right">{r.bookings}</td>
                    <td className="px-4 py-2 text-right font-semibold">฿{r.revenue.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right">฿{r.avgPrice.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right text-green-600 font-medium flex items-center justify-end gap-1">
                      <TrendingUp className="h-3 w-3" />+{r.growth}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
