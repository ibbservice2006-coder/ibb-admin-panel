import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts'
import { Download, Calendar, TrendingUp, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const bookingsTrend = [
  { month: 'Oct', total: 522, completed: 490, cancelled: 21, pending: 11 },
  { month: 'Nov', total: 588, completed: 558, cancelled: 18, pending: 12 },
  { month: 'Dec', total: 725, completed: 695, cancelled: 20, pending: 10 },
  { month: 'Jan', total: 643, completed: 612, cancelled: 19, pending: 12 },
  { month: 'Feb', total: 690, completed: 660, cancelled: 18, pending: 12 },
  { month: 'Mar', total: 766, completed: 734, cancelled: 20, pending: 12 },
]

const bookingsByStatus = [
  { name: 'Completed', value: 3749, color: '#10b981' },
  { name: 'Pending', value: 69, color: '#f59e0b' },
  { name: 'Cancelled', value: 116, color: '#ef4444' },
  { name: 'In Progress', value: 24, color: '#3b82f6' },
]

const bookingsByVehicle = [
  { type: 'Van 9 Seats', bookings: 1480, pct: 38.2 },
  { type: 'Car 4 Seats', bookings: 1120, pct: 28.9 },
  { type: 'Van 12 Seats', bookings: 680, pct: 17.6 },
  { type: 'Minibus 20', bookings: 380, pct: 9.8 },
  { type: 'Bus 40+', bookings: 218, pct: 5.6 },
]

const bookingsByChannel = [
  { channel: 'Direct (Website/App)', bookings: 1840, color: '#6366f1' },
  { channel: 'Shopee', bookings: 620, color: '#f97316' },
  { channel: 'Lazada', bookings: 480, color: '#3b82f6' },
  { channel: 'LINE OA', bookings: 380, color: '#10b981' },
  { channel: 'Phone/WhatsApp', bookings: 310, color: '#f59e0b' },
  { channel: 'Other Platforms', bookings: 248, color: '#8b5cf6' },
]

const hourlyPattern = [
  { hour: '06:00', bookings: 28 },
  { hour: '07:00', bookings: 45 },
  { hour: '08:00', bookings: 62 },
  { hour: '09:00', bookings: 55 },
  { hour: '10:00', bookings: 42 },
  { hour: '11:00', bookings: 38 },
  { hour: '12:00', bookings: 35 },
  { hour: '13:00', bookings: 40 },
  { hour: '14:00', bookings: 48 },
  { hour: '15:00', bookings: 52 },
  { hour: '16:00', bookings: 58 },
  { hour: '17:00', bookings: 65 },
  { hour: '18:00', bookings: 72 },
  { hour: '19:00', bookings: 60 },
  { hour: '20:00', bookings: 45 },
  { hour: '21:00', bookings: 30 },
]

const topRoutes = [
  { route: 'BKK → Pattaya', bookings: 1420, completion: 97.2, cancelled: 2.8 },
  { route: 'BKK → Hua Hin', bookings: 1105, completion: 96.8, cancelled: 3.2 },
  { route: 'BKK → Kanchanaburi', bookings: 840, completion: 97.5, cancelled: 2.5 },
  { route: 'BKK → Ayutthaya', bookings: 725, completion: 98.1, cancelled: 1.9 },
  { route: 'Pattaya → Airport', bookings: 880, completion: 96.5, cancelled: 3.5 },
]

export default function BookingsReport() {
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

  const totalBookings = bookingsTrend.reduce((a, m) => a + m.total, 0)
  const totalCompleted = bookingsTrend.reduce((a, m) => a + m.completed, 0)
  const completionRate = (totalCompleted / totalBookings * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-100 border border-indigo-200">
            <Calendar className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Bookings Report</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Booking Reports All — Stats, Trends & Performance</p>
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
          { label: 'Total Bookings (6M)', value: totalBookings.toLocaleString(), sub: 'All channels', color: 'text-indigo-700', bg: 'bg-indigo-50', icon: Calendar },
          { label: 'Completion Rate', value: `${completionRate}%`, sub: `${totalCompleted.toLocaleString()} completed`, color: 'text-green-700', bg: 'bg-green-50', icon: CheckCircle },
          { label: 'Cancellation Rate', value: '3.0%', sub: '116 cancelled', color: 'text-red-700', bg: 'bg-red-50', icon: XCircle },
          { label: 'Mar Bookings', value: '766', sub: '+11% vs Feb', color: 'text-blue-700', bg: 'bg-blue-50', icon: TrendingUp },
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

      {/* Bookings Trend */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base">Bookings Trend (6 months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={bookingsTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="completed" name="Completed" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="pending" name="Pending" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
              <Bar dataKey="cancelled" name="Cancelled" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base">Booking Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="45%" height={180}>
                <PieChart>
                  <Pie data={bookingsByStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value">
                    {bookingsByStatus.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2.5">
                {bookingsByStatus.map(s => {
                  const total = bookingsByStatus.reduce((a, x) => a + x.value, 0)
                  return (
                    <div key={s.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="font-medium">{s.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">{s.value.toLocaleString()}</span>
                        <span className="text-muted-foreground ml-1">({(s.value / total * 100).toFixed(1)}%)</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings by Channel */}
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base">Bookings by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {bookingsByChannel.map(c => {
                const total = bookingsByChannel.reduce((a, x) => a + x.bookings, 0)
                const pct = (c.bookings / total * 100).toFixed(1)
                return (
                  <div key={c.channel} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="font-medium">{c.channel}</span>
                        <span className="text-muted-foreground">{c.bookings.toLocaleString()} ({pct}%)</span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: c.color }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Booking Pattern */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-500" />Hourly Booking Pattern (Average Day)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={hourlyPattern}>
              <defs>
                <linearGradient id="hourlyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="bookings" name="Bookings" stroke="#6366f1" fill="url(#hourlyGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Routes */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base">Top Routes by Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="text-left py-2 font-medium">#</th>
                <th className="text-left py-2 font-medium">Route</th>
                <th className="text-right py-2 font-medium">Bookings</th>
                <th className="text-right py-2 font-medium">Completion</th>
                <th className="text-right py-2 font-medium">Cancelled</th>
              </tr>
            </thead>
            <tbody>
              {topRoutes.map((r, i) => (
                <tr key={r.route} className="border-b hover:bg-gray-50">
                  <td className="py-2.5 text-xs font-bold text-muted-foreground">{i + 1}</td>
                  <td className="py-2.5 text-xs font-medium">{r.route}</td>
                  <td className="py-2.5 text-right text-xs font-bold">{r.bookings.toLocaleString()}</td>
                  <td className="py-2.5 text-right">
                    <Badge className="text-xs bg-green-100 text-green-700">{r.completion}%</Badge>
                  </td>
                  <td className="py-2.5 text-right">
                    <Badge className="text-xs bg-red-100 text-red-700">{r.cancelled}%</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Bookings by Vehicle */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base">Bookings by Vehicle Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bookingsByVehicle.map((v, i) => (
              <div key={v.type} className="flex items-center gap-3">
                <span className="text-xs font-medium w-28 flex-shrink-0">{v.type}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${v.pct}%`, opacity: 1 - i * 0.15 }} />
                </div>
                <span className="text-xs font-bold w-16 text-right">{v.bookings.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground w-10 text-right">{v.pct}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
