import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, MapPin, Clock, Users, Star, Navigation, Target, Download } from 'lucide-react'

// Top routes by booking volume
const topRoutes = [
  { route: 'BKK → Pattaya', bookings: 342, avgDuration: '2h 15m', avgDistance: '145 km', revenue: 1540000, growth: 12.5 },
  { route: 'BKK → Hua Hin', bookings: 218, avgDuration: '3h 20m', avgDistance: '210 km', revenue: 1090000, growth: 8.3 },
  { route: 'DMK → Pattaya', bookings: 187, avgDuration: '1h 55m', avgDistance: '130 km', revenue: 841500, growth: 15.2 },
  { route: 'BKK → Kanchanaburi', bookings: 124, avgDuration: '3h 45m', avgDistance: '180 km', revenue: 620000, growth: 6.1 },
  { route: 'BKK → Rayong', bookings: 98, avgDuration: '2h 10m', avgDistance: '180 km', revenue: 490000, growth: 22.4 },
  { route: 'BKK → Chiang Mai', bookings: 76, avgDuration: '8h 30m', avgDistance: '700 km', revenue: 760000, growth: 35.8 },
]

// Popular pickup points
const pickupPoints = [
  { name: 'Suvarnabhumi Airport (BKK)', count: 892, pct: 42 },
  { name: 'Don Mueang Airport (DMK)', count: 456, pct: 21 },
  { name: 'Bangkok City Center', count: 312, pct: 15 },
  { name: 'Pattaya Hotels', count: 198, pct: 9 },
  { name: 'Hua Hin Hotels', count: 145, pct: 7 },
  { name: 'Others', count: 127, pct: 6 },
]

// Peak hours data
const peakHours = [
  { hour: '06:00', trips: 12 }, { hour: '07:00', trips: 28 }, { hour: '08:00', trips: 45 },
  { hour: '09:00', trips: 38 }, { hour: '10:00', trips: 32 }, { hour: '11:00', trips: 25 },
  { hour: '12:00', trips: 30 }, { hour: '13:00', trips: 35 }, { hour: '14:00', trips: 42 },
  { hour: '15:00', trips: 48 }, { hour: '16:00', trips: 55 }, { hour: '17:00', trips: 62 },
  { hour: '18:00', trips: 58 }, { hour: '19:00', trips: 45 }, { hour: '20:00', trips: 35 },
  { hour: '21:00', trips: 22 }, { hour: '22:00', trips: 15 }, { hour: '23:00', trips: 8 },
]

// Weekly trend
const weeklyTrend = [
  { day: 'Mon', trips: 145 }, { day: 'Tue', trips: 132 }, { day: 'Wed', trips: 158 },
  { day: 'Thu', trips: 162 }, { day: 'Fri', trips: 198 }, { day: 'Sat', trips: 245 }, { day: 'Sun', trips: 220 },
]

// Customer nationality
const nationalityData = [
  { name: 'Chinese', value: 28, color: '#ef4444' },
  { name: 'Thai', value: 22, color: '#f97316' },
  { name: 'Russian', value: 15, color: '#3b82f6' },
  { name: 'European', value: 12, color: '#8b5cf6' },
  { name: 'Middle East', value: 10, color: '#10b981' },
  { name: 'Others', value: 13, color: '#6b7280' },
]

// Marketing insights
const marketingInsights = [
  {
    title: 'Route BKK → Chiang Mai grew 35.8%',
    type: 'growth', priority: 'high',
    action: 'Increase capacity & promotions for this route — mostly Chinese VVIP customers',
  },
  {
    title: 'Peak Hour: 16:00–18:00 highest demand',
    type: 'peak', priority: 'medium',
    action: 'Add vehicles during this period — consider surge pricing for General tier',
  },
  {
    title: 'Suvarnabhumi is top Pickup Point (42%)',
    type: 'insight', priority: 'medium',
    action: 'Advertise on Ctrip & Booking.com focusing on BKK Airport Transfer',
  },
  {
    title: 'Fri–Sun demand 50% higher than weekdays',
    type: 'weekend', priority: 'high',
    action: 'Prepare special Weekend Package — attract short-term tourists',
  },
]

const priorityConfig = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-gray-100 text-gray-600 border-gray-200',
}

export default function RouteOptimization() {
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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-100 border border-teal-200">
            <TrendingUp className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Route Optimization</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Analyze popular routes and marketing insights</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-3.5 w-3.5 mr-1" />Export Report
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Routes', value: '58', sub: 'Active routes', color: 'text-gray-700', bg: 'bg-gray-50' },
          { label: 'Total Trips (30d)', value: '2,130', sub: '+14.2% vs last month', color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Avg Trip Duration', value: '2h 48m', sub: 'All routes', color: 'text-purple-700', bg: 'bg-purple-50' },
          { label: 'Customer Satisfaction', value: '4.7 ★', sub: 'Based on 1,842 reviews', color: 'text-yellow-700', bg: 'bg-yellow-50' },
        ].map(s => (
          <Card key={s.label} className={`${s.bg} border-0`}>
            <CardContent className="pt-3 pb-3 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Marketing Insights */}
      <Card className="border-teal-200 bg-teal-50/30">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-teal-600" />
            Marketing Insights — From data GPS
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {marketingInsights.map((insight, i) => (
              <div key={i} className={`p-3 rounded-lg border ${priorityConfig[insight.priority]} bg-white`}>
                <div className="flex items-start gap-2">
                  <Star className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold">{insight.title}</p>
                    <p className="text-xs mt-1 opacity-80">{insight.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours Chart */}
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />Peak Hours (Hourly)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={peakHours} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="trips" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />Weekly Demand
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="trips" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Routes */}
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Navigation className="h-4 w-4 text-purple-600" />Top Routes by Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topRoutes.map((r, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{r.route}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-green-600">+{r.growth}%</span>
                        <span className="text-xs font-bold">{r.bookings}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-purple-500" style={{ width: `${(r.bookings / topRoutes[0].bookings) * 100}%` }} />
                    </div>
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{r.avgDuration}</span>
                      <span>{r.avgDistance}</span>
                      <span>฿{(r.revenue / 1000).toFixed(0)}K revenue</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Nationality + Pickup Points */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-orange-600" />Customer Nationality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <PieChart width={120} height={120}>
                  <Pie data={nationalityData} cx={55} cy={55} innerRadius={30} outerRadius={55} dataKey="value">
                    {nationalityData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
                <div className="flex-1 space-y-1">
                  {nationalityData.map((n, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: n.color }} />
                        <span>{n.name}</span>
                      </div>
                      <span className="font-semibold">{n.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-600" />Top Pickup Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pickupPoints.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="font-medium truncate">{p.name}</span>
                        <span className="text-muted-foreground ml-2">{p.count} ({p.pct}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-red-400" style={{ width: `${p.pct}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
