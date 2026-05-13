import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { Download, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useKPIMetrics } from '@/hooks/useDashboard'
import { ApiErrorBanner, ApiEmptyState } from '@/components/ApiErrorBanner'

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

function fmt(n) {
  if (n >= 1_000_000) return `฿${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `฿${(n / 1_000).toFixed(0)}k`
  return `฿${n}`
}

export default function KPIMetrics() {
  const { toast } = useToast()
  const { data, isLoading, isError, refetch, isFetching } = useKPIMetrics()

  const totals        = data?.totals        ?? {}
  const last7Days     = data?.last7Days     ?? []
  const vehicleRevenue = data?.vehicleRevenue ?? []

  // Shape last7Days for recharts
  const chartData = last7Days.map(row => ({
    name:     row.date ? new Date(row.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' }) : '—',
    revenue:  Number(row.revenue),
    bookings: Number(row.bookings),
  }))

  // Shape vehicleRevenue for pie
  const pieData = vehicleRevenue.map(row => ({
    name:  row.category ?? 'Other',
    value: Number(row.revenue),
  }))

  const summaryCards = [
    {
      label:  'Total Bookings',
      value:  isLoading ? '—' : (totals.totalBookings ?? 0).toLocaleString(),
      badge:  null,
    },
    {
      label:  'Completed',
      value:  isLoading ? '—' : (totals.totalCompleted ?? 0).toLocaleString(),
      badge:  { text: `${totals.completionRate ?? 0}%`, style: 'bg-green-50 text-green-700 border-green-200' },
    },
    {
      label:  'Cancellation Rate',
      value:  isLoading ? '—' : `${totals.cancellationRate ?? 0}%`,
      badge:  null,
    },
    {
      label:  'Avg Booking Value',
      value:  isLoading ? '—' : `฿${Number(totals.avgBookingValue ?? 0).toLocaleString()}`,
      badge:  null,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">KPI Metrics</h1>
          <p className="text-muted-foreground mt-1">Key performance indicators and business analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Update Data
          </Button>
          <Button
            size="sm"
            className="bg-gray-700 hover:bg-gray-600 text-white"
            onClick={() => { toast({ title: 'Download Started', description: 'Opening Print Dialog...' }); setTimeout(() => window.print(), 300) }}
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {isError && <ApiErrorBanner onRetry={refetch} />}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, idx) => (
          <Card key={idx} className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
              <div className="flex items-end justify-between mt-2">
                <h3 className="text-2xl font-bold tracking-tight">{card.value}</h3>
                {card.badge && (
                  <Badge variant="outline" className={card.badge.style}>{card.badge.text}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Total Revenue highlight */}
      <Card className="border-none shadow-sm bg-white">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-muted-foreground">Total Revenue (All Time)</p>
          <h3 className="text-3xl font-bold tracking-tight mt-1">
            {isLoading ? '—' : fmt(Number(totals.totalRevenueTHB ?? 0))}
          </h3>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue trend */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Revenue & Bookings — Last 7 Days</CardTitle>
                <CardDescription>Daily performance</CardDescription>
              </div>
              <Tabs defaultValue="revenue" className="w-[200px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="revenue">Revenue</TabsTrigger>
                  <TabsTrigger value="bookings">Bookings</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <ApiEmptyState message="No data for the last 7 days" />
            ) : (
              <div className="h-[350px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(v) => fmt(v)} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      formatter={(value) => [`฿${Number(value).toLocaleString()}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue by vehicle category */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Revenue by Vehicle</CardTitle>
            <CardDescription>Category distribution</CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <ApiEmptyState message="No vehicle revenue data" />
            ) : (
              <>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => `฿${Number(v).toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3 mt-4">
                  {pieData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                        <span className="text-sm font-medium capitalize">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold">{fmt(item.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
