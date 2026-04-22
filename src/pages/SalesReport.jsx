import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import {
  Download, RefreshCw, DollarSign, ShoppingCart, TrendingUp, TrendingDown,
  Users, Calendar, BarChart3, Target, Percent, MapPin, Clock, CreditCard,
  Package, Gift, RotateCcw, ShoppingBag, Activity, PieChart, LineChart
} from 'lucide-react'
import {
  LineChart as RechartsLine, Line, BarChart as RechartsBar, Bar, PieChart as RechartsPie, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, Area, AreaChart
} from 'recharts'

// Mock data
const mockSalesData = {
  overview: {
    total_revenue: 125680.50,
    total_orders: 342,
    average_order_value: 367.54,
    total_customers: 189,
    revenue_growth: 12.5,
    orders_growth: 8.3,
    total_profit: 45238.18,
    profit_margin: 36.0,
    total_cost: 80442.32
  },
  revenue_trend: [
    { date: 'Jan', revenue: 45200, profit: 16272, orders: 120, customers: 85 },
    { date: 'Feb', revenue: 52300, profit: 18828, orders: 135, customers: 92 },
    { date: 'Mar', revenue: 48900, profit: 17604, orders: 128, customers: 88 },
    { date: 'Apr', revenue: 61500, profit: 22140, orders: 158, customers: 105 },
    { date: 'May', revenue: 58700, profit: 21132, orders: 152, customers: 98 },
    { date: 'Jun', revenue: 67200, profit: 24192, orders: 172, customers: 112 },
    { date: 'Jul', revenue: 72800, profit: 26208, orders: 185, customers: 118 },
    { date: 'Aug', revenue: 69500, profit: 25020, orders: 178, customers: 115 },
    { date: 'Sep', revenue: 75300, profit: 27108, orders: 192, customers: 125 },
    { date: 'Oct', revenue: 125680.50, profit: 45238.18, orders: 342, customers: 189 }
  ],
  comparison: {
    current: { revenue: 125680.50, orders: 342, customers: 189 },
    previous: { revenue: 112000, orders: 315, customers: 175 },
    change: { revenue: 12.2, orders: 8.6, customers: 8.0 }
  },
  goals: {
    monthly_target: 150000,
    current: 125680.50,
    percentage: 83.8,
    remaining: 24319.50,
    days_left: 7
  },
  by_category: [
    { category: 'Electronics', revenue: 58400, orders: 145, percentage: 46.5, profit: 21024, margin: 36 },
    { category: 'Accessories', revenue: 35200, orders: 128, percentage: 28.0, profit: 12672, margin: 36 },
    { category: 'Clothing', revenue: 21500, orders: 89, percentage: 17.1, profit: 7740, margin: 36 },
    { category: 'Home & Garden', revenue: 10580.50, orders: 42, percentage: 8.4, profit: 3809, margin: 36 }
  ],
  by_platform: [
    { platform: 'Amazon', revenue: 45200, orders: 128, percentage: 36.0 },
    { platform: 'Shopee', revenue: 38500, orders: 105, percentage: 30.6 },
    { platform: 'Lazada', revenue: 28300, orders: 78, percentage: 22.5 },
    { platform: 'LINE Shopping', revenue: 13680.50, orders: 31, percentage: 10.9 }
  ],
  by_region: [
    { region: 'Bangkok', revenue: 52300, orders: 145, percentage: 41.6 },
    { region: 'Central', revenue: 31500, orders: 89, percentage: 25.1 },
    { region: 'North', revenue: 22400, orders: 62, percentage: 17.8 },
    { region: 'Northeast', revenue: 12680, orders: 28, percentage: 10.1 },
    { region: 'South', revenue: 6800.50, orders: 18, percentage: 5.4 }
  ],
  customer_insights: {
    new_customers: 78,
    returning_customers: 111,
    repeat_rate: 58.7,
    avg_lifetime_value: 665.29,
    churn_rate: 12.3
  },
  by_time: {
    by_hour: [
      { hour: '00:00', orders: 5 }, { hour: '01:00', orders: 3 }, { hour: '02:00', orders: 2 },
      { hour: '03:00', orders: 1 }, { hour: '04:00', orders: 2 }, { hour: '05:00', orders: 4 },
      { hour: '06:00', orders: 8 }, { hour: '07:00', orders: 15 }, { hour: '08:00', orders: 22 },
      { hour: '09:00', orders: 28 }, { hour: '10:00', orders: 35 }, { hour: '11:00', orders: 32 },
      { hour: '12:00', orders: 42 }, { hour: '13:00', orders: 38 }, { hour: '14:00', orders: 35 },
      { hour: '15:00', orders: 30 }, { hour: '16:00', orders: 28 }, { hour: '17:00', orders: 25 },
      { hour: '18:00', orders: 32 }, { hour: '19:00', orders: 38 }, { hour: '20:00', orders: 45 },
      { hour: '21:00', orders: 40 }, { hour: '22:00', orders: 28 }, { hour: '23:00', orders: 18 }
    ],
    by_day: [
      { day: 'Mon', orders: 45, revenue: 16500 },
      { day: 'Tue', orders: 52, revenue: 19100 },
      { day: 'Wed', orders: 48, revenue: 17600 },
      { day: 'Thu', orders: 55, revenue: 20200 },
      { day: 'Fri', orders: 62, revenue: 22800 },
      { day: 'Sat', orders: 48, revenue: 17600 },
      { day: 'Sun', orders: 32, revenue: 11760 }
    ]
  },
  payment_methods: [
    { method: 'Credit Card', orders: 156, revenue: 57300, percentage: 45.6 },
    { method: 'Bank Transfer', orders: 98, revenue: 36000, percentage: 28.6 },
    { method: 'COD', orders: 62, revenue: 22800, percentage: 18.1 },
    { method: 'E-Wallet', orders: 26, revenue: 9580.50, percentage: 7.7 }
  ],
  order_status: [
    { status: 'Delivered', count: 245, percentage: 71.6 },
    { status: 'Shipped', count: 52, percentage: 15.2 },
    { status: 'Processing', count: 32, percentage: 9.4 },
    { status: 'Pending', count: 13, percentage: 3.8 }
  ],
  top_products: [
    { id: '1', name: 'Wireless Bluetooth Headphones', revenue: 18900, units: 63, avg_price: 300, profit: 6804, margin: 36 },
    { id: '2', name: 'Smart Watch Series 5', revenue: 15600, units: 26, avg_price: 600, profit: 5616, margin: 36 },
    { id: '3', name: 'Laptop Stand Aluminum', revenue: 12800, units: 128, avg_price: 100, profit: 4608, margin: 36 },
    { id: '4', name: 'Mechanical Keyboard RGB', revenue: 11200, units: 56, avg_price: 200, profit: 4032, margin: 36 },
    { id: '5', name: 'Wireless Mouse', revenue: 8900, units: 178, avg_price: 50, profit: 3204, margin: 36 }
  ],
  forecast: [
    { month: 'Nov', predicted: 135000, confidence: 'high' },
    { month: 'Dec', predicted: 185000, confidence: 'high' },
    { month: 'Jan', predicted: 125000, confidence: 'medium' }
  ],
  discount_impact: {
    with_discount: { orders: 198, revenue: 68400, avg_discount: 15 },
    without_discount: { orders: 144, revenue: 57280.50, avg_discount: 0 },
    total_discount_given: 12150
  },
  inventory_turnover: 4.2,
  refund_rate: 2.8,
  avg_basket_size: 2.3,
  cohort_analysis: [
    { cohort: 'Jan 2024', month_0: 100, month_1: 45, month_2: 32, month_3: 28, month_4: 25, month_5: 23 },
    { cohort: 'Feb 2024', month_0: 100, month_1: 48, month_2: 35, month_3: 30, month_4: 27, month_5: null },
    { cohort: 'Mar 2024', month_0: 100, month_1: 52, month_2: 38, month_3: 33, month_4: null, month_5: null },
    { cohort: 'Apr 2024', month_0: 100, month_1: 55, month_2: 42, month_3: null, month_4: null, month_5: null },
    { cohort: 'May 2024', month_0: 100, month_1: 58, month_2: null, month_3: null, month_4: null, month_5: null },
    { cohort: 'Jun 2024', month_0: 100, month_1: null, month_2: null, month_3: null, month_4: null, month_5: null }
  ],
  peak_times: {
    peak_hours: [
      { hour: '12:00', orders: 42, is_peak: true },
      { hour: '20:00', orders: 45, is_peak: true },
      { hour: '21:00', orders: 40, is_peak: true }
    ],
    peak_days: [
      { day: 'Fri', orders: 62, revenue: 22800, is_peak: true },
      { day: 'Thu', orders: 55, revenue: 20200, is_peak: true }
    ],
    summary: {
      best_hour: '20:00 (45 orders)',
      best_day: 'Friday (62 orders)',
      worst_hour: '03:00 (1 order)',
      worst_day: 'Sunday (32 orders)'
    }
  }
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function SalesReport() {
  const [dateRange, setDateRange] = useState('this_month')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [customDateFrom, setCustomDateFrom] = useState('')
  const [customDateTo, setCustomDateTo] = useState('')
  const [showCustomDate, setShowCustomDate] = useState(false)
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
  const navigate = useNavigate()

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast({ title: 'Report refreshed', description: 'Sales data has been updated' })
    }, 1000)
  }

  const handleDateRangeChange = (value) => {
    setDateRange(value)
    setShowCustomDate(value === 'custom')
  }

  const { 
    overview, revenue_trend, comparison, goals, by_category, by_platform, by_region,
    customer_insights, by_time, payment_methods, order_status, top_products,
    forecast, discount_impact, inventory_turnover, refund_rate, avg_basket_size,
    cohort_analysis, peak_times
  } = mockSalesData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Sales Report</h1>
          <p className="text-muted-foreground">
            Comprehensive sales analytics and performance insights
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 justify-between flex-wrap">
          <div className="flex items-center gap-2">
            <Select value={dateRange} onValueChange={handleDateRangeChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="this_week">This Week</SelectItem>
                <SelectItem value="last_week">Last Week</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
                <SelectItem value="this_quarter">This Quarter</SelectItem>
                <SelectItem value="this_year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            {showCustomDate && (
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={customDateFrom}
                  onChange={(e) => setCustomDateFrom(e.target.value)}
                  className="w-[150px]"
                />
                <span>to</span>
                <Input
                  type="date"
                  value={customDateTo}
                  onChange={(e) => setCustomDateTo(e.target.value)}
                  className="w-[150px]"
                />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => window.print()}>
                  Print Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExport}>
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExport}>
                  Export as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends & Analysis</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${overview.total_revenue.toLocaleString()}</div>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +{overview.revenue_growth}% from last period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${overview.total_profit.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {overview.profit_margin}% margin
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview.total_orders}</div>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +{overview.orders_growth}% from last period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${overview.average_order_value.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Per transaction</p>
              </CardContent>
            </Card>
          </div>

          {/* Sales Goals */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Monthly Sales Goal
                  </CardTitle>
                  <CardDescription>Track progress towards your monthly target</CardDescription>
                </div>
                <Badge variant="outline" className="text-lg">
                  {goals.percentage}% Complete
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current: ${goals.current.toLocaleString()}</span>
                  <span>Target: ${goals.monthly_target.toLocaleString()}</span>
                </div>
                <Progress value={goals.percentage} className="h-3" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Remaining</p>
                  <p className="text-xl font-bold text-orange-600">${goals.remaining.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Days Left</p>
                  <p className="text-xl font-bold">{goals.days_left} days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Revenue & Profit Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenue_trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Revenue" />
                  <Area type="monotone" dataKey="profit" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Profit" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Period Comparison</CardTitle>
              <CardDescription>Compare current period with previous period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">${comparison.current.revenue.toLocaleString()}</p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +{comparison.change.revenue}% vs previous
                  </p>
                  <p className="text-xs text-muted-foreground">Previous: ${comparison.previous.revenue.toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <p className="text-2xl font-bold">{comparison.current.orders}</p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +{comparison.change.orders}% vs previous
                  </p>
                  <p className="text-xs text-muted-foreground">Previous: {comparison.previous.orders}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Customers</p>
                  <p className="text-2xl font-bold">{comparison.current.customers}</p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +{comparison.change.customers}% vs previous
                  </p>
                  <p className="text-xs text-muted-foreground">Previous: {comparison.previous.customers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sales by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {by_category.map((cat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{cat.category}</span>
                        <span className="text-muted-foreground">${cat.revenue.toLocaleString()} ({cat.percentage}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>{cat.orders} orders</span>
                        <span>Profit: ${cat.profit.toLocaleString()} ({cat.margin}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sales by Platform */}
            <Card>
              <CardHeader>
                <CardTitle>Sales by Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPie>
                    <Pie
                      data={by_platform}
                      dataKey="revenue"
                      nameKey="platform"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.platform}: ${entry.percentage}%`}
                    >
                      {by_platform.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends & Analysis Tab */}
        <TabsContent value="trends" className="space-y-6">
          {/* Sales by Region */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Sales by Region
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBar data={by_region}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                  <Bar dataKey="orders" fill="#10b981" name="Orders" />
                </RechartsBar>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Peak Sales Times */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Peak Sales Times
              </CardTitle>
              <CardDescription>Identify your busiest hours and days for optimal staffing and promotions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 text-sm">📊 Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between p-2 bg-green-50 rounded">
                        <span className="text-muted-foreground">Best Hour:</span>
                        <span className="font-bold text-green-600">{peak_times.summary.best_hour}</span>
                      </div>
                      <div className="flex justify-between p-2 bg-green-50 rounded">
                        <span className="text-muted-foreground">Best Day:</span>
                        <span className="font-bold text-green-600">{peak_times.summary.best_day}</span>
                      </div>
                      <div className="flex justify-between p-2 bg-red-50 rounded">
                        <span className="text-muted-foreground">Slowest Hour:</span>
                        <span className="font-bold text-red-600">{peak_times.summary.worst_hour}</span>
                      </div>
                      <div className="flex justify-between p-2 bg-red-50 rounded">
                        <span className="text-muted-foreground">Slowest Day:</span>
                        <span className="font-bold text-red-600">{peak_times.summary.worst_day}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 text-sm">🔥 Peak Hours</h4>
                    <div className="space-y-2">
                      {peak_times.peak_hours.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-orange-50 border border-orange-200 rounded">
                          <span className="font-medium">{item.hour}</span>
                          <Badge variant="destructive">{item.orders} orders</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-sm">⭐ Peak Days</h4>
                    <div className="space-y-2">
                      {peak_times.peak_days.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded">
                          <span className="font-medium">{item.day}</span>
                          <div className="flex gap-2">
                            <Badge className="bg-gray-700 hover:bg-gray-600 text-white">{item.orders} orders</Badge>
                            <Badge variant="outline">${item.revenue.toLocaleString()}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-900">
                  <strong>💡 Tip:</strong> Schedule promotions during slow hours (03:00-06:00) to boost sales. 
                  Ensure adequate inventory and staff during peak times (12:00, 20:00-21:00, Thu-Fri).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sales by Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Sales by Hour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsLine data={by_time.by_hour}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} />
                  </RechartsLine>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Sales by Day of Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsBar data={by_time.by_day}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                  </RechartsBar>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods & Order Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payment_methods.map((method, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{method.method}</span>
                        <span className="text-muted-foreground">${method.revenue.toLocaleString()} ({method.percentage}%)</span>
                      </div>
                      <Progress value={method.percentage} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {method.orders} orders
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Status Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPie>
                    <Pie
                      data={order_status}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.status}: ${entry.percentage}%`}
                    >
                      {order_status.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Sales Forecast */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Sales Forecast
              </CardTitle>
              <CardDescription>Predicted sales for upcoming months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {forecast.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">{item.month}</p>
                    <p className="text-2xl font-bold">${item.predicted.toLocaleString()}</p>
                    <Badge variant={item.confidence === 'high' ? 'default' : 'secondary'} className="mt-2">
                      {item.confidence} confidence
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">New Customers</p>
                  <p className="text-2xl font-bold">{customer_insights.new_customers}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Returning</p>
                  <p className="text-2xl font-bold">{customer_insights.returning_customers}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Repeat Rate</p>
                  <p className="text-2xl font-bold">{customer_insights.repeat_rate}%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Avg LTV</p>
                  <p className="text-2xl font-bold">${customer_insights.avg_lifetime_value}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Churn Rate</p>
                  <p className="text-2xl font-bold text-red-600">{customer_insights.churn_rate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Segmentation</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBar data={[
                  { segment: 'VIP', customers: 25, revenue: 45000 },
                  { segment: 'Regular', customers: 98, revenue: 52000 },
                  { segment: 'New', customers: 66, revenue: 28680.50 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="segment" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="customers" fill="#3b82f6" name="Customers" />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                </RechartsBar>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Cohort Analysis
              </CardTitle>
              <CardDescription>Customer retention by cohort (% returning each month)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 font-medium">Cohort</th>
                      <th className="text-center py-2 px-3 font-medium">Month 0</th>
                      <th className="text-center py-2 px-3 font-medium">Month 1</th>
                      <th className="text-center py-2 px-3 font-medium">Month 2</th>
                      <th className="text-center py-2 px-3 font-medium">Month 3</th>
                      <th className="text-center py-2 px-3 font-medium">Month 4</th>
                      <th className="text-center py-2 px-3 font-medium">Month 5</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cohort_analysis.map((cohort, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-3 font-medium">{cohort.cohort}</td>
                        <td className="py-2 px-3 text-center">
                          <Badge className="bg-gray-700 hover:bg-gray-600 text-white">{cohort.month_0}%</Badge>
                        </td>
                        <td className="py-2 px-3 text-center">
                          {cohort.month_1 ? (
                            <span className={cohort.month_1 >= 50 ? 'text-green-600 font-semibold' : 'text-orange-600'}>
                              {cohort.month_1}%
                            </span>
                          ) : '-'}
                        </td>
                        <td className="py-2 px-3 text-center">
                          {cohort.month_2 ? (
                            <span className={cohort.month_2 >= 35 ? 'text-green-600 font-semibold' : 'text-orange-600'}>
                              {cohort.month_2}%
                            </span>
                          ) : '-'}
                        </td>
                        <td className="py-2 px-3 text-center">
                          {cohort.month_3 ? (
                            <span className={cohort.month_3 >= 30 ? 'text-green-600 font-semibold' : 'text-orange-600'}>
                              {cohort.month_3}%
                            </span>
                          ) : '-'}
                        </td>
                        <td className="py-2 px-3 text-center">
                          {cohort.month_4 ? (
                            <span className={cohort.month_4 >= 25 ? 'text-green-600 font-semibold' : 'text-orange-600'}>
                              {cohort.month_4}%
                            </span>
                          ) : '-'}
                        </td>
                        <td className="py-2 px-3 text-center">
                          {cohort.month_5 ? (
                            <span className={cohort.month_5 >= 23 ? 'text-green-600 font-semibold' : 'text-orange-600'}>
                              {cohort.month_5}%
                            </span>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>How to read:</strong> Each row shows a customer cohort (acquired in that month). 
                  Numbers show what % of that cohort made purchases in subsequent months. 
                  Green = Good retention, Orange = Needs improvement.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Rank</th>
                      <th className="text-left py-3 px-4 font-medium">Product</th>
                      <th className="text-right py-3 px-4 font-medium">Revenue</th>
                      <th className="text-right py-3 px-4 font-medium">Profit</th>
                      <th className="text-right py-3 px-4 font-medium">Units</th>
                      <th className="text-right py-3 px-4 font-medium">Avg Price</th>
                      <th className="text-right py-3 px-4 font-medium">Margin</th>
                      <th className="text-center py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {top_products.map((product, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-semibold">#{index + 1}</td>
                        <td className="py-3 px-4">{product.name}</td>
                        <td className="py-3 px-4 text-right font-semibold text-green-600">
                          ${product.revenue.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">
                          ${product.profit.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">{product.units}</td>
                        <td className="py-3 px-4 text-right">${product.avg_price}</td>
                        <td className="py-3 px-4 text-right">{product.margin}%</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate(`/products/${product.id}`)}
                            >
                              <Package className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate('/orders')}
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Orders
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Performance Matrix</CardTitle>
              <CardDescription>High margin vs high volume products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border-2 border-green-500 rounded-lg">
                  <p className="font-semibold text-green-600">Stars (High Margin, High Volume)</p>
                  <p className="text-sm text-muted-foreground mt-2">Smart Watch Series 5</p>
                </div>
                <div className="p-4 border-2 border-blue-500 rounded-lg">
                  <p className="font-semibold text-blue-600">Cash Cows (Low Margin, High Volume)</p>
                  <p className="text-sm text-muted-foreground mt-2">Laptop Stand Aluminum</p>
                </div>
                <div className="p-4 border-2 border-yellow-500 rounded-lg">
                  <p className="font-semibold text-yellow-600">Question Marks (High Margin, Low Volume)</p>
                  <p className="text-sm text-muted-foreground mt-2">Wireless Bluetooth Headphones</p>
                </div>
                <div className="p-4 border-2 border-red-500 rounded-lg">
                  <p className="font-semibold text-red-600">Dogs (Low Margin, Low Volume)</p>
                  <p className="text-sm text-muted-foreground mt-2">-</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Discount Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">With Discount</p>
                  <p className="text-xl font-bold">{discount_impact.with_discount.orders} orders</p>
                  <p className="text-sm">${discount_impact.with_discount.revenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Without Discount</p>
                  <p className="text-xl font-bold">{discount_impact.without_discount.orders} orders</p>
                  <p className="text-sm">${discount_impact.without_discount.revenue.toLocaleString()}</p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Total Discount Given</p>
                  <p className="text-xl font-bold text-red-600">${discount_impact.total_discount_given.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Inventory Turnover
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{inventory_turnover}x</p>
                <p className="text-sm text-muted-foreground mt-2">Times per period</p>
                <p className="text-xs text-green-600 mt-2">Healthy turnover rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Avg Basket Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{avg_basket_size}</p>
                <p className="text-sm text-muted-foreground mt-2">Items per order</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Refund & Return Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Refund Rate</span>
                    <span className="text-sm font-bold">{refund_rate}%</span>
                  </div>
                  <Progress value={refund_rate} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">Industry average: 5-10%</p>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Refunds</p>
                    <p className="text-xl font-bold">10</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Refund Amount</p>
                    <p className="text-xl font-bold text-red-600">$3,519</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Refund</p>
                    <p className="text-xl font-bold">$351.90</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales Funnel Analysis</CardTitle>
              <CardDescription>Conversion from view to purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { stage: 'Product Views', count: 15420, percentage: 100 },
                  { stage: 'Add to Cart', count: 3850, percentage: 25 },
                  { stage: 'Checkout Started', count: 1540, percentage: 10 },
                  { stage: 'Payment', count: 770, percentage: 5 },
                  { stage: 'Completed', count: 342, percentage: 2.2 }
                ].map((stage, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{stage.stage}</span>
                      <span className="text-muted-foreground">{stage.count.toLocaleString()} ({stage.percentage}%)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 rounded-full h-3 transition-all"
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
