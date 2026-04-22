import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RefreshCw, TrendingUp, MapPin, Route, BarChart3, Download, Star, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Mock analytics data based on real zones from PricingUpdate
const zoneStats = [
  { zone: 'Airport Transfer', routes: 3, bookings: 1842, revenue: 7250000, avgRating: 4.9, growth: 12.4, topRoute: 'Bangkok - Suvarnabhumi Airport' },
  { zone: 'The South of Thailand', routes: 12, bookings: 1205, revenue: 9820000, avgRating: 4.7, growth: 8.2, topRoute: 'Bangkok - Hua Hin' },
  { zone: 'The East of Thailand', routes: 12, bookings: 2341, revenue: 6540000, avgRating: 4.8, growth: 15.6, topRoute: 'Bangkok - Pattaya' },
  { zone: 'The North of Thailand', routes: 8, bookings: 987, revenue: 8320000, avgRating: 4.6, growth: 5.3, topRoute: 'Bangkok - Chiang Mai' },
  { zone: 'Central Region', routes: 6, bookings: 1654, revenue: 3210000, avgRating: 4.7, growth: 9.8, topRoute: 'Bangkok - Nakhon Pathom' },
  { zone: 'The Northeast of Thailand', routes: 4, bookings: 743, revenue: 2870000, avgRating: 4.5, growth: 3.1, topRoute: 'Bangkok - Khao Yai' },
  { zone: 'The West of Thailand', routes: 4, bookings: 612, revenue: 2140000, avgRating: 4.6, growth: 6.7, topRoute: 'Bangkok - Kanchanaburi' },
  { zone: 'Hourly Package', routes: 4, bookings: 3201, revenue: 12400000, avgRating: 4.8, growth: 22.5, topRoute: '08 Hours (Max 350 Km.)' },
  { zone: 'Period Package', routes: 4, bookings: 421, revenue: 18750000, avgRating: 4.9, growth: 18.3, topRoute: '30 Day Package' },
]

const topRoutes = [
  { rank: 1, destination: 'Bangkok - Pattaya', zone: 'East', bookings: 892, revenue: 2140000, avgPrice: 2399, growth: 18.2 },
  { rank: 2, destination: 'Bangkok - Suvarnabhumi Airport', zone: 'Airport', bookings: 756, revenue: 1512000, avgPrice: 2000, growth: 12.4 },
  { rank: 3, destination: 'Bangkok - Hua Hin', zone: 'South', bookings: 634, revenue: 1395000, avgPrice: 2200, growth: 9.1 },
  { rank: 4, destination: 'Bangkok - Chiang Mai', zone: 'North', bookings: 521, revenue: 9538000, avgPrice: 18300, growth: 7.8 },
  { rank: 5, destination: 'Bangkok - Khao Yai', zone: 'Northeast', bookings: 487, revenue: 1705000, avgPrice: 3500, growth: 5.6 },
  { rank: 6, destination: 'Bangkok - Kanchanaburi', zone: 'West', bookings: 412, revenue: 1318000, avgPrice: 3200, growth: 8.3 },
  { rank: 7, destination: 'Bangkok - Koh Chang', zone: 'East', bookings: 389, revenue: 3112000, avgPrice: 8000, growth: 14.2 },
  { rank: 8, destination: 'Bangkok - Phuket', zone: 'South', bookings: 312, revenue: 5400000, avgPrice: 17300, growth: 11.5 },
]

const monthlyData = [
  { month: 'Jul', bookings: 1820, revenue: 8200000 },
  { month: 'Aug', bookings: 2100, revenue: 9500000 },
  { month: 'Sep', bookings: 1950, revenue: 8800000 },
  { month: 'Oct', bookings: 2350, revenue: 10600000 },
  { month: 'Nov', bookings: 2680, revenue: 12100000 },
  { month: 'Dec', bookings: 3120, revenue: 14050000 },
  { month: 'Jan', bookings: 2890, revenue: 13000000 },
  { month: 'Feb', bookings: 2540, revenue: 11450000 },
  { month: 'Mar', bookings: 2760, revenue: 12430000 },
]

const vehicleTypeData = [
  { type: 'Car Standard', bookings: 4821, pct: 38 },
  { type: 'Car Executive', bookings: 2934, pct: 23 },
  { type: 'Van Standard', bookings: 2156, pct: 17 },
  { type: 'Car Family', bookings: 1423, pct: 11 },
  { type: 'Limousine Premium', bookings: 892, pct: 7 },
  { type: 'Bus', bookings: 512, pct: 4 },
]

const maxBookings = Math.max(...monthlyData.map(d => d.bookings))
const maxRevenue = Math.max(...monthlyData.map(d => d.revenue))

export default function RouteAnalytics() {
  const [period, setPeriod] = useState('9months')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const totalBookings = zoneStats.reduce((s, z) => s + z.bookings, 0)
  const totalRevenue = zoneStats.reduce((s, z) => s + z.revenue, 0)
  const totalRoutes = zoneStats.reduce((s, z) => s + z.routes, 0)
  const avgRating = (zoneStats.reduce((s, z) => s + z.avgRating, 0) / zoneStats.length).toFixed(1)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(r => setTimeout(r, 800))
    setIsRefreshing(false)
    toast({ title: 'Analytics Refreshed', description: 'Route analytics data updated' })
  }

  const handleExport = () => {
    toast({ title: 'Export Started', description: 'Route analytics report is being generated' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Route Analytics</h1>
          <p className="text-muted-foreground mt-2">Performance insights across all zones and routes</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="9months">Last 9 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3" /> +11.8% vs last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{(totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3" /> +14.3% vs last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRoutes}</div>
            <p className="text-xs text-muted-foreground mt-1">Across 9 zones</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{avgRating}</div>
            <p className="text-xs text-muted-foreground mt-1">Customer satisfaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Bookings Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Bookings</CardTitle>
            <CardDescription>Booking volume over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-48">
              {monthlyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">{d.bookings.toLocaleString()}</span>
                  <div
                    className="w-full rounded-t transition-all hover:opacity-80"
                    style={{ height: `${(d.bookings / maxBookings) * 140}px`, backgroundColor: '#6366f1' }}
                    title={`${d.month}: ${d.bookings} bookings`}
                  />
                  <span className="text-xs text-muted-foreground">{d.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Revenue (฿)</CardTitle>
            <CardDescription>Revenue trend over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-48">
              {monthlyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">{(d.revenue / 1000000).toFixed(1)}M</span>
                  <div
                    className="w-full bg-green-500 rounded-t transition-all hover:opacity-80"
                    style={{ height: `${(d.revenue / maxRevenue) * 140}px` }}
                    title={`${d.month}: ฿${d.revenue.toLocaleString()}`}
                  />
                  <span className="text-xs text-muted-foreground">{d.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zone Performance + Vehicle Type */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Zone Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Zone Performance</CardTitle>
            <CardDescription>Bookings and revenue by zone</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {zoneStats.sort((a, b) => b.bookings - a.bookings).map((z, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 text-xs text-muted-foreground text-right">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium truncate">{z.zone}</span>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className="text-xs text-muted-foreground">{z.bookings.toLocaleString()} trips</span>
                        <span className={`text-xs flex items-center gap-0.5 ${z.growth >= 10 ? 'text-green-600' : 'text-blue-600'}`}>
                          <ArrowUpRight className="h-3 w-3" />+{z.growth}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${(z.bookings / Math.max(...zoneStats.map(x => x.bookings))) * 100}%`, backgroundColor: ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f97316','#ec4899','#f59e0b','#3b82f6','#14b8a6'][zoneStats.sort((a,b)=>b.bookings-a.bookings).indexOf(z)] || '#6366f1' }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">Top: {z.topRoute.replace('Bangkok - ', '')}</span>
                      <span className="text-xs text-muted-foreground">฿{(z.revenue / 1000000).toFixed(1)}M revenue</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Vehicle Type Breakdown</CardTitle>
            <CardDescription>Bookings by vehicle type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vehicleTypeData.map((v, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{v.type}</span>
                    <span className="text-xs font-medium">{v.pct}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${v.pct}%`,
                        backgroundColor: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f97316', '#ec4899'][i]
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{v.bookings.toLocaleString()} bookings</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Routes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Performing Routes</CardTitle>
          <CardDescription>Highest booking volume routes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">#</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Destination</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Zone</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Bookings</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Revenue</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Avg Price</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Growth</th>
                </tr>
              </thead>
              <tbody>
                {topRoutes.map((r) => (
                  <tr key={r.rank} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-2 px-3">
                      <span className={`font-bold text-xs ${r.rank <= 3 ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                        {r.rank <= 3 ? ['🥇', '🥈', '🥉'][r.rank - 1] : `#${r.rank}`}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-medium">{r.destination}</td>
                    <td className="py-2 px-3">
                      <Badge variant="outline" className="text-xs">{r.zone}</Badge>
                    </td>
                    <td className="py-2 px-3 text-right">{r.bookings.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right">฿{(r.revenue / 1000000).toFixed(2)}M</td>
                    <td className="py-2 px-3 text-right">฿{r.avgPrice.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right">
                      <span className="text-green-600 flex items-center justify-end gap-0.5 text-xs">
                        <ArrowUpRight className="h-3 w-3" />+{r.growth}%
                      </span>
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
