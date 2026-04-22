import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import { 
  Download, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw,
  Users,
  Target,
  Award
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Mock data for charts
const revenueData = [
  { name: 'Mon', revenue: 45000, bookings: 120 },
  { name: 'Tue', revenue: 52000, bookings: 145 },
  { name: 'Wed', revenue: 48000, bookings: 132 },
  { name: 'Thu', revenue: 61000, bookings: 168 },
  { name: 'Fri', revenue: 55000, bookings: 150 },
  { name: 'Sat', revenue: 67000, bookings: 185 },
  { name: 'Sun', revenue: 72000, bookings: 210 },
]

const vehiclePerformance = [
  { name: 'Van', value: 450000, color: '#3b82f6' },
  { name: 'Bus', value: 180000, color: '#10b981' },
  { name: 'Car', value: 120000, color: '#f59e0b' },
]

const efficiencyMetrics = [
  { label: 'Avg Assign Time', value: '12m 30s', change: '-2m', trend: 'up', status: 'Good' },
  { label: 'Pickup On-Time', value: '94.2%', change: '+1.5%', trend: 'up', status: 'Excellent' },
  { label: 'Cancel Rate', value: '2.1%', change: '-0.5%', trend: 'up', status: 'Good' },
  { label: 'Customer Rating', value: '4.85/5', change: '+0.05', trend: 'up', status: 'Great' }
]

export default function KPIMetrics() {
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast({ title: 'Metrics Updated', description: 'Latest performance data has been loaded.' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">KPI Metrics</h1>
          <p className="text-muted-foreground mt-1">Key performance indicators and business analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Update Data
          </Button>
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { toast({ title: 'Download Started', description: 'Opening Print Dialog...' }); setTimeout(() => window.print(), 300); }}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {efficiencyMetrics.map((metric, idx) => (
          <Card key={idx} className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
              <div className="flex items-end justify-between mt-2">
                <h3 className="text-2xl font-bold tracking-tight">{metric.value}</h3>
                <Badge variant="outline" className={`
                  ${metric.status === 'Excellent' ? 'bg-green-50 text-green-700 border-green-200' : 
                    metric.status === 'Great' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                    'bg-slate-50 text-slate-700 border-slate-200'}
                `}>
                  {metric.status}
                </Badge>
              </div>
              <div className="flex items-center mt-4 text-xs">
                <span className={metric.trend === 'up' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                  {metric.change}
                </span>
                <span className="text-muted-foreground ml-1.5">vs last week</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Revenue & Bookings Trend</CardTitle>
                <CardDescription>Weekly growth performance</CardDescription>
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
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `฿${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Revenue by Vehicle</CardTitle>
            <CardDescription>Market share distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vehiclePerformance}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {vehiclePerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              {vehiclePerformance.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold">฿{(item.value / 1000).toFixed(0)}k</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Target Achievement</CardTitle>
          <CardDescription>Performance vs monthly goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Monthly Revenue Goal</span>
                </div>
                <span className="text-sm font-bold">85%</span>
              </div>
              <div className="w-full bg-blue-50 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '85%' }} />
              </div>
              <p className="text-xs text-muted-foreground">฿1.2M of ฿1.5M targeted</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">New Customer Target</span>
                </div>
                <span className="text-sm font-bold">62%</span>
              </div>
              <div className="w-full bg-green-50 h-2 rounded-full overflow-hidden">
                <div className="bg-green-600 h-full rounded-full" style={{ width: '62%' }} />
              </div>
              <p className="text-xs text-muted-foreground">310 of 500 targeted</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">VIP Conversion Rate</span>
                </div>
                <span className="text-sm font-bold">48%</span>
              </div>
              <div className="w-full bg-purple-50 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: '48%' }} />
              </div>
              <p className="text-xs text-muted-foreground">120 of 250 targeted</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
