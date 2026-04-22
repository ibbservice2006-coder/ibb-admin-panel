import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
  Users, Car, MapPin, DollarSign, TrendingUp, TrendingDown,
  RefreshCw, Calendar, Star, AlertTriangle, CheckCircle, Clock
} from 'lucide-react'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

const revenueData = [
  { date: '25 Feb', revenue: 284000, bookings: 42 },
  { date: '26 Feb', revenue: 312000, bookings: 48 },
  { date: '27 Feb', revenue: 298000, bookings: 45 },
  { date: '28 Feb', revenue: 356000, bookings: 54 },
  { date: '1 Mar', revenue: 389000, bookings: 58 },
  { date: '2 Mar', revenue: 342000, bookings: 51 },
  { date: '3 Mar', revenue: 298000, bookings: 44 },
  { date: '4 Mar', revenue: 412000, bookings: 62 },
  { date: '5 Mar', revenue: 445000, bookings: 67 },
  { date: '6 Mar', revenue: 398000, bookings: 60 },
  { date: '7 Mar', revenue: 467000, bookings: 70 },
  { date: '8 Mar', revenue: 489000, bookings: 73 },
  { date: '9 Mar', revenue: 412000, bookings: 62 },
  { date: '10 Mar', revenue: 356000, bookings: 53 },
  { date: '11 Mar', revenue: 523000, bookings: 78 },
  { date: '12 Mar', revenue: 548000, bookings: 82 },
  { date: '13 Mar', revenue: 489000, bookings: 73 },
  { date: '14 Mar', revenue: 534000, bookings: 80 },
  { date: '15 Mar', revenue: 567000, bookings: 85 },
  { date: '16 Mar', revenue: 498000, bookings: 74 },
  { date: '17 Mar', revenue: 445000, bookings: 66 },
  { date: '18 Mar', revenue: 589000, bookings: 88 },
  { date: '19 Mar', revenue: 612000, bookings: 92 },
  { date: '20 Mar', revenue: 578000, bookings: 86 },
  { date: '21 Mar', revenue: 634000, bookings: 95 },
  { date: '22 Mar', revenue: 656000, bookings: 98 },
  { date: '23 Mar', revenue: 589000, bookings: 88 },
  { date: '24 Mar', revenue: 534000, bookings: 80 },
  { date: '25 Mar', revenue: 698000, bookings: 104 },
]

const bookingStatusData = [
  { status: 'Confirmed', count: 284 },
  { status: 'In Progress', count: 47 },
  { status: 'Completed', count: 1842 },
  { status: 'Cancelled', count: 63 },
  { status: 'Pending', count: 28 },
]

const recentBookings = [
  { id: 'IBB-2026-4521', customer: 'Wang Wei', route: 'BKK Airport → Pattaya', amount: '฿2,400', status: 'confirmed', time: '09:45' },
  { id: 'IBB-2026-4520', customer: 'Tanaka Hiroshi', route: 'Hua Hin → BKK Airport', amount: '฿3,200', status: 'in_progress', time: '09:30' },
  { id: 'IBB-2026-4519', customer: 'Sarah Johnson', route: 'Pattaya → BKK Airport', amount: '฿2,800', status: 'completed', time: '08:15' },
  { id: 'IBB-2026-4518', customer: 'Li Mingzhu', route: 'BKK Airport → Hua Hin', amount: '฿4,500', status: 'confirmed', time: '08:00' },
  { id: 'IBB-2026-4517', customer: 'Somchai Rattana', route: 'Phuket → Krabi', amount: '฿1,800', status: 'pending', time: '07:45' },
]

const topRoutes = [
  { route: 'BKK Airport → Pattaya', bookings: 342, revenue: '฿820,800', trend: 'up', change: '+12%' },
  { route: 'BKK Airport → Hua Hin', bookings: 289, revenue: '฿1,300,500', trend: 'up', change: '+8%' },
  { route: 'Pattaya → BKK Airport', bookings: 318, revenue: '฿889,200', trend: 'up', change: '+15%' },
  { route: 'Hua Hin → BKK Airport', bookings: 267, revenue: '฿1,201,500', trend: 'down', change: '-3%' },
  { route: 'BKK Airport → Phuket', bookings: 198, revenue: '฿1,386,000', trend: 'up', change: '+22%' },
]

const statusColors = {
  confirmed: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  pending: 'bg-gray-100 text-gray-800',
}

function StatCard({ title, value, change, icon: Icon, trend, subtitle, bgColor, iconColor }) {
  const isPositive = trend === 'up'
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            {isPositive
              ? <TrendingUp className="h-3 w-3 text-green-500" />
              : <TrendingDown className="h-3 w-3 text-red-500" />
            }
            <span className={isPositive ? 'text-green-500' : 'text-red-500'}>{change}</span>
            <span>from last month</span>
          </p>
        )}
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with IBB Shuttle today — Mar 25, 2026
          </p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setRefreshKey(k => k + 1)} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />Refresh
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Revenue (Mar)" value="฿14.8M" change="+18.5%" icon={DollarSign} trend="up" bgColor="bg-green-100" iconColor="text-green-600" />
        <StatCard title="Total Bookings" value="2,264" change="+12.3%" icon={Calendar} trend="up" bgColor="bg-blue-100" iconColor="text-blue-600" />
        <StatCard title="Active Customers" value="8,420" change="+5.7%" icon={Users} trend="up" bgColor="bg-purple-100" iconColor="text-purple-600" />
        <StatCard title="Active Vehicles" value="47/52" change="-1 in maintenance" icon={Car} trend="down" bgColor="bg-orange-100" iconColor="text-orange-600" />
      </div>

      {/* Secondary KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Avg Booking Value" value="฿3,240" change="+6.2%" icon={TrendingUp} trend="up" bgColor="bg-cyan-100" iconColor="text-cyan-600" />
        <StatCard title="Driver Rating" value="4.82 ★" subtitle="Based on 1,842 reviews" icon={Star} trend="up" bgColor="bg-yellow-100" iconColor="text-yellow-600" />
        <StatCard title="On-Time Rate" value="94.2%" change="+1.8%" icon={CheckCircle} trend="up" bgColor="bg-teal-100" iconColor="text-teal-600" />
        <StatCard title="Pending Issues" value="12" subtitle="3 urgent, 9 normal" icon={AlertTriangle} trend="down" bgColor="bg-red-100" iconColor="text-red-600" />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Daily revenue for the last 30 days (THB)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
                <YAxis tickFormatter={v => `฿${(v/1000).toFixed(0)}K`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v, name) => [name === 'revenue' ? `฿${v.toLocaleString()}` : v, name === 'revenue' ? 'Revenue' : 'Bookings']} />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Status</CardTitle>
            <CardDescription>Distribution of current booking statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={90}
                  dataKey="count"
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest bookings from IBB Shuttle today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map(b => (
                <div key={b.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{b.id}</p>
                    <p className="text-xs text-muted-foreground">{b.customer} · {b.route}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{b.amount}</p>
                    <Badge className={`text-xs ${statusColors[b.status]}`} variant="outline">{b.status.replace('_', ' ')}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Routes */}
        <Card>
          <CardHeader>
            <CardTitle>Top Routes</CardTitle>
            <CardDescription>Best performing routes this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRoutes.map((r, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{r.route}</p>
                      <p className="text-xs text-muted-foreground">{r.bookings} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{r.revenue}</p>
                    <p className={`text-xs flex items-center justify-end gap-1 ${r.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {r.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {r.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
