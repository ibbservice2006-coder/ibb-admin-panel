import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import {
  Download,
  RefreshCw,
  Users,
  UserPlus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Star,
  ShoppingCart,
  Target,
  AlertCircle,
  Activity,
  BarChart3
} from 'lucide-react'
import {
  LineChart as RechartsLine, Line, BarChart as RechartsBar, Bar, PieChart as RechartsPie, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, Area, AreaChart
} from 'recharts'

// Mock customer report data
const mockCustomerData = {
  overview: {
    total_customers: 1248,
    new_customers: 89,
    active_customers: 456,
    inactive_customers: 792,
    customer_lifetime_value: 1250.50,
    retention_rate: 68.5,
    churn_rate: 12.3,
    avg_engagement_score: 7.2
  },
  growth_trend: [
    { month: 'Jan', total: 945, new: 78, active: 342 },
    { month: 'Feb', total: 1023, new: 85, active: 378 },
    { month: 'Mar', total: 1089, new: 72, active: 398 },
    { month: 'Apr', total: 1145, new: 68, active: 412 },
    { month: 'May', total: 1198, new: 82, active: 428 },
    { month: 'Jun', total: 1248, new: 89, active: 456 }
  ],
  ltv_trend: [
    { month: 'Jan', ltv: 1085 },
    { month: 'Feb', ltv: 1125 },
    { month: 'Mar', ltv: 1165 },
    { month: 'Apr', ltv: 1198 },
    { month: 'May', ltv: 1225 },
    { month: 'Jun', ltv: 1250.50 }
  ],
  retention_trend: [
    { month: 'Jan', retention: 64.2, churn: 14.5 },
    { month: 'Feb', retention: 65.8, churn: 13.8 },
    { month: 'Mar', retention: 66.5, churn: 13.2 },
    { month: 'Apr', retention: 67.2, churn: 12.9 },
    { month: 'May', retention: 68.0, churn: 12.5 },
    { month: 'Jun', retention: 68.5, churn: 12.3 }
  ],
  by_segment: [
    { segment: 'VIP', count: 45, revenue: 125400, avg_order: 890, percentage: 3.6, ltv: 2789 },
    { segment: 'Regular', count: 456, revenue: 285600, avg_order: 425, percentage: 36.5, ltv: 1456 },
    { segment: 'New', count: 589, revenue: 145800, avg_order: 280, percentage: 47.2, ltv: 485 },
    { segment: 'Inactive', count: 158, revenue: 0, avg_order: 0, percentage: 12.7, ltv: 0 }
  ],
  revenue_by_segment: [
    { segment: 'VIP', revenue: 125400, percentage: 22.5 },
    { segment: 'Regular', revenue: 285600, percentage: 51.2 },
    { segment: 'New', revenue: 145800, percentage: 26.3 },
    { segment: 'Inactive', revenue: 0, percentage: 0 }
  ],
  aov_by_segment: [
    { segment: 'VIP', aov: 890 },
    { segment: 'Regular', aov: 425 },
    { segment: 'New', aov: 280 },
    { segment: 'Inactive', aov: 0 }
  ],
  rfm_analysis: [
    { segment: 'Champions', count: 89, percentage: 7.1, description: 'Recent, frequent, high spenders', color: '#10b981' },
    { segment: 'Loyal', count: 156, percentage: 12.5, description: 'Frequent buyers, good value', color: '#3b82f6' },
    { segment: 'Potential', count: 234, percentage: 18.8, description: 'Recent buyers, good potential', color: '#8b5cf6' },
    { segment: 'At Risk', count: 178, percentage: 14.3, description: 'Used to buy frequently, declining', color: '#f59e0b' },
    { segment: 'Hibernating', count: 342, percentage: 27.4, description: 'Low engagement, need reactivation', color: '#ef4444' },
    { segment: 'Lost', count: 249, percentage: 19.9, description: 'Churned customers', color: '#6b7280' }
  ],
  top_customers: [
    { id: '1', name: 'John Smith', email: 'john.smith@example.com', orders: 45, revenue: 18900, avg_order: 420, rfm: 'Champions' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah.j@example.com', orders: 38, revenue: 16800, avg_order: 442, rfm: 'Champions' },
    { id: '3', name: 'Michael Chen', email: 'm.chen@example.com', orders: 32, revenue: 15200, avg_order: 475, rfm: 'Champions' },
    { id: '4', name: 'Emma Wilson', email: 'emma.w@example.com', orders: 28, revenue: 12600, avg_order: 450, rfm: 'Loyal' },
    { id: '5', name: 'David Brown', email: 'david.b@example.com', orders: 25, revenue: 11500, avg_order: 460, rfm: 'Loyal' }
  ],
  by_location: [
    { location: 'Bangkok', customers: 456, revenue: 285600, percentage: 36.5 },
    { location: 'Chiang Mai', customers: 234, revenue: 145800, percentage: 18.8 },
    { location: 'Phuket', customers: 189, revenue: 125400, percentage: 15.1 },
    { location: 'Pattaya', customers: 156, revenue: 98500, percentage: 12.5 },
    { location: 'Other', customers: 213, revenue: 125680, percentage: 17.1 }
  ],
  acquisition_channels: [
    { channel: 'Organic Search', customers: 456, percentage: 36.5, cost_per_customer: 15, cac: 15, ltv: 1450 },
    { channel: 'Social Media', customers: 342, percentage: 27.4, cost_per_customer: 25, cac: 25, ltv: 1280 },
    { channel: 'Direct', customers: 234, percentage: 18.8, cost_per_customer: 0, cac: 0, ltv: 1650 },
    { channel: 'Email Marketing', customers: 156, percentage: 12.5, cost_per_customer: 8, cac: 8, ltv: 1580 },
    { channel: 'Paid Ads', customers: 60, percentage: 4.8, cost_per_customer: 45, cac: 45, ltv: 980 }
  ],
  cohort_analysis: [
    { month: 'Jan 2024', new_customers: 85, month_1: 68, month_2: 58, month_3: 52, month_1_pct: 80, month_2_pct: 68, month_3_pct: 61 },
    { month: 'Feb 2024', new_customers: 92, month_1: 74, month_2: 65, month_3: 58, month_1_pct: 80, month_2_pct: 71, month_3_pct: 63 },
    { month: 'Mar 2024', new_customers: 78, month_1: 65, month_2: 58, month_3: null, month_1_pct: 83, month_2_pct: 74, month_3_pct: null },
    { month: 'Apr 2024', new_customers: 95, month_1: 78, month_2: null, month_3: null, month_1_pct: 82, month_2_pct: null, month_3_pct: null },
    { month: 'May 2024', new_customers: 89, month_1: null, month_2: null, month_3: null, month_1_pct: null, month_2_pct: null, month_3_pct: null }
  ],
  churn_analysis: {
    total_churned: 154,
    churn_rate: 12.3,
    at_risk_customers: 178,
    reasons: [
      { reason: 'Price Sensitivity', count: 45, percentage: 29.2 },
      { reason: 'Product Quality', count: 38, percentage: 24.7 },
      { reason: 'Better Competitor', count: 32, percentage: 20.8 },
      { reason: 'Poor Support', count: 24, percentage: 15.6 },
      { reason: 'Other', count: 15, percentage: 9.7 }
    ],
    at_risk_list: [
      { id: '10', name: 'Alice Cooper', email: 'alice.c@example.com', last_order: '45 days ago', risk_score: 85 },
      { id: '11', name: 'Bob Wilson', email: 'bob.w@example.com', last_order: '52 days ago', risk_score: 82 },
      { id: '12', name: 'Carol Davis', email: 'carol.d@example.com', last_order: '38 days ago', risk_score: 78 },
      { id: '13', name: 'Dan Miller', email: 'dan.m@example.com', last_order: '48 days ago', risk_score: 75 }
    ]
  },
  engagement_score: [
    { segment: 'VIP', score: 9.2, color: '#10b981' },
    { segment: 'Regular', score: 7.5, color: '#3b82f6' },
    { segment: 'New', score: 6.8, color: '#8b5cf6' },
    { segment: 'Inactive', score: 2.1, color: '#ef4444' }
  ],
  purchase_frequency: [
    { orders: '1', customers: 589, percentage: 47.2 },
    { orders: '2-3', customers: 312, percentage: 25.0 },
    { orders: '4-6', customers: 189, percentage: 15.1 },
    { orders: '7-10', customers: 98, percentage: 7.9 },
    { orders: '11+', customers: 60, percentage: 4.8 }
  ]
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const getRFMBadge = (rfm) => {
  const config = {
    'Champions': { variant: 'default', color: 'bg-green-600' },
    'Loyal': { variant: 'default', color: 'bg-blue-600' },
    'Potential': { variant: 'secondary', color: 'bg-purple-600' },
    'At Risk': { variant: 'secondary', color: 'bg-orange-600' },
    'Hibernating': { variant: 'destructive', color: 'bg-red-600' },
    'Lost': { variant: 'outline', color: 'bg-gray-600' }
  }
  const { variant } = config[rfm] || config['Lost']
  return <Badge variant={variant}>{rfm}</Badge>
}

export default function CustomerReport() {
  const [dateRange, setDateRange] = useState('this_month')
  const [isRefreshing, setIsRefreshing] = useState(false)
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
      toast({ title: 'Report refreshed', description: 'Customer data has been updated' })
    }, 1000)
  }

  const { 
    overview, growth_trend, ltv_trend, retention_trend, by_segment, revenue_by_segment,
    aov_by_segment, rfm_analysis, top_customers, by_location, acquisition_channels,
    cohort_analysis, churn_analysis, engagement_score, purchase_frequency
  } = mockCustomerData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Customer Report</h1>
          <p className="text-muted-foreground">
            Comprehensive customer analytics, segmentation, and lifetime value insights
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 justify-between">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this_week">This Week</SelectItem>
              <SelectItem value="last_week">Last Week</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="this_quarter">This Quarter</SelectItem>
              <SelectItem value="this_year">This Year</SelectItem>
            </SelectContent>
          </Select>
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
          <TabsTrigger value="segments">Segments & Value</TabsTrigger>
          <TabsTrigger value="acquisition">Acquisition & Retention</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview.total_customers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{overview.active_customers}</div>
                <p className="text-xs text-muted-foreground">{((overview.active_customers / overview.total_customers) * 100).toFixed(1)}% of total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer LTV</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${overview.customer_lifetime_value}</div>
                <p className="text-xs text-green-600">+8.5% vs last period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{overview.retention_rate}%</div>
                <p className="text-xs text-red-600">Churn: {overview.churn_rate}%</p>
              </CardContent>
            </Card>
          </div>

          {/* Customer Growth Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Customer Growth Trend
              </CardTitle>
              <CardDescription>Track customer acquisition and active user growth over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={growth_trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.6}
                    name="Total Customers"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="new" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="New Customers"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="active" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="Active Customers"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LTV Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Customer Lifetime Value Trend
                </CardTitle>
                <CardDescription>Average LTV progression over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsLine data={ltv_trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="ltv" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      name="LTV ($)"
                    />
                  </RechartsLine>
                </ResponsiveContainer>
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs text-green-900">
                    <strong>📈 Positive Trend:</strong> LTV increased by 15.3% over the past 6 months, 
                    indicating improved customer value and retention strategies.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Retention Rate Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Retention & Churn Rate Trend
                </CardTitle>
                <CardDescription>Monthly retention and churn performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsLine data={retention_trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="retention" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      name="Retention Rate (%)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="churn" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      name="Churn Rate (%)"
                    />
                  </RechartsLine>
                </ResponsiveContainer>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>Target:</strong> Retention rate above 70% is excellent. 
                    Churn rate below 10% is considered healthy for most industries.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Segments & Value Tab */}
        <TabsContent value="segments" className="space-y-6">
          {/* Customer Segments */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Segments Overview</CardTitle>
              <CardDescription>Breakdown by customer segment with key metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Segment</th>
                      <th className="text-right py-3 px-4 font-medium">Customers</th>
                      <th className="text-right py-3 px-4 font-medium">Revenue</th>
                      <th className="text-right py-3 px-4 font-medium">Avg Order</th>
                      <th className="text-right py-3 px-4 font-medium">LTV</th>
                      <th className="text-right py-3 px-4 font-medium">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {by_segment.map((segment, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <Badge variant={segment.segment === 'VIP' ? 'default' : 'outline'}>
                            {segment.segment}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">{segment.count}</td>
                        <td className="py-3 px-4 text-right font-semibold">${segment.revenue.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">${segment.avg_order}</td>
                        <td className="py-3 px-4 text-right font-semibold text-green-600">${segment.ltv}</td>
                        <td className="py-3 px-4 text-right">{segment.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue by Segment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue by Customer Segment
                </CardTitle>
                <CardDescription>Revenue contribution by segment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPie>
                    <Pie
                      data={revenue_by_segment}
                      dataKey="revenue"
                      nameKey="segment"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.segment}: ${entry.percentage}%`}
                    >
                      {revenue_by_segment.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-900">
                    <strong>💡 Insight:</strong> Regular customers contribute 51.2% of revenue despite being 36.5% of customers. 
                    VIP segment has highest value per customer.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* AOV by Segment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Average Order Value by Segment
                </CardTitle>
                <CardDescription>AOV comparison across segments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsBar data={aov_by_segment}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="segment" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="aov" fill="#3b82f6" name="AOV ($)">
                      {aov_by_segment.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </RechartsBar>
                </ResponsiveContainer>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>Strategy:</strong> Focus on upgrading Regular customers to VIP status 
                    through targeted promotions and loyalty programs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RFM Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                RFM Analysis (Recency, Frequency, Monetary)
              </CardTitle>
              <CardDescription>Customer segmentation based on purchase behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rfm_analysis.map((segment, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: segment.color }}
                        />
                        <div>
                          <p className="font-semibold">{segment.segment}</p>
                          <p className="text-xs text-muted-foreground">{segment.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{segment.count} customers</p>
                        <p className="text-xs text-muted-foreground">{segment.percentage}%</p>
                      </div>
                    </div>
                    <Progress value={segment.percentage} className="h-2" />
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">High Value</p>
                  <p className="text-xl font-bold text-green-600">
                    {rfm_analysis.filter(s => ['Champions', 'Loyal'].includes(s.segment))
                      .reduce((sum, s) => sum + s.count, 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">At Risk</p>
                  <p className="text-xl font-bold text-orange-600">
                    {rfm_analysis.find(s => s.segment === 'At Risk')?.count || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Need Reactivation</p>
                  <p className="text-xl font-bold text-red-600">
                    {rfm_analysis.filter(s => ['Hibernating', 'Lost'].includes(s.segment))
                      .reduce((sum, s) => sum + s.count, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Acquisition & Retention Tab */}
        <TabsContent value="acquisition" className="space-y-6">
          {/* Acquisition Channels */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Acquisition Channels</CardTitle>
              <CardDescription>Channel performance with cost and value metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Channel</th>
                      <th className="text-right py-3 px-4 font-medium">Customers</th>
                      <th className="text-right py-3 px-4 font-medium">%</th>
                      <th className="text-right py-3 px-4 font-medium">CAC</th>
                      <th className="text-right py-3 px-4 font-medium">LTV</th>
                      <th className="text-right py-3 px-4 font-medium">LTV:CAC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {acquisition_channels.map((channel, index) => {
                      const ratio = channel.cac > 0 ? (channel.ltv / channel.cac).toFixed(1) : '∞'
                      const isGood = channel.cac === 0 || (channel.ltv / channel.cac) >= 3
                      return (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{channel.channel}</td>
                          <td className="py-3 px-4 text-right">{channel.customers}</td>
                          <td className="py-3 px-4 text-right">{channel.percentage}%</td>
                          <td className="py-3 px-4 text-right">${channel.cac}</td>
                          <td className="py-3 px-4 text-right font-semibold">${channel.ltv}</td>
                          <td className="py-3 px-4 text-right">
                            <Badge variant={isGood ? 'default' : 'destructive'}>
                              {ratio}:1
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-900">
                  <strong>✅ Healthy Ratio:</strong> LTV:CAC ratio of 3:1 or higher is considered healthy. 
                  Direct and Email Marketing channels show excellent performance.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cohort Retention Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Cohort Retention Analysis</CardTitle>
              <CardDescription>Track customer retention by acquisition cohort</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Cohort</th>
                      <th className="text-right py-3 px-4 font-medium">New</th>
                      <th className="text-right py-3 px-4 font-medium">Month 1</th>
                      <th className="text-right py-3 px-4 font-medium">Month 2</th>
                      <th className="text-right py-3 px-4 font-medium">Month 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cohort_analysis.map((cohort, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{cohort.month}</td>
                        <td className="py-3 px-4 text-right font-semibold">{cohort.new_customers}</td>
                        <td className="py-3 px-4 text-right">
                          {cohort.month_1 !== null ? (
                            <div>
                              <span className="font-semibold">{cohort.month_1}</span>
                              <span className="text-xs text-muted-foreground ml-1">({cohort.month_1_pct}%)</span>
                            </div>
                          ) : '-'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {cohort.month_2 !== null ? (
                            <div>
                              <span className="font-semibold">{cohort.month_2}</span>
                              <span className="text-xs text-muted-foreground ml-1">({cohort.month_2_pct}%)</span>
                            </div>
                          ) : '-'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {cohort.month_3 !== null ? (
                            <div>
                              <span className="font-semibold">{cohort.month_3}</span>
                              <span className="text-xs text-muted-foreground ml-1">({cohort.month_3_pct}%)</span>
                            </div>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Churn Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Churn Analysis
              </CardTitle>
              <CardDescription>Understanding customer churn and at-risk customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Churn Overview */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Churned</p>
                    <p className="text-2xl font-bold text-red-600">{churn_analysis.total_churned}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Churn Rate</p>
                    <p className="text-2xl font-bold text-red-600">{churn_analysis.churn_rate}%</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">At Risk</p>
                    <p className="text-2xl font-bold text-orange-600">{churn_analysis.at_risk_customers}</p>
                  </div>
                </div>

                {/* Churn Reasons */}
                <div>
                  <h4 className="font-semibold mb-3">Churn Reasons</h4>
                  <div className="space-y-3">
                    {churn_analysis.reasons.map((reason, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{reason.reason}</span>
                          <span className="text-muted-foreground">{reason.count} ({reason.percentage}%)</span>
                        </div>
                        <Progress value={reason.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* At-Risk Customers */}
                <div>
                  <h4 className="font-semibold mb-3">At-Risk Customers (High Priority)</h4>
                  <div className="space-y-2">
                    {churn_analysis.at_risk_list.map((customer, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-orange-50">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">{customer.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right mr-3">
                            <p className="text-sm font-semibold text-orange-600">Risk: {customer.risk_score}%</p>
                            <p className="text-xs text-muted-foreground">{customer.last_order}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate(`/customers/${customer.id}`)}
                            >
                              <Users className="h-3 w-3 mr-1" />
                              Profile
                            </Button>
                            <Button 
                              className="bg-gray-700 hover:bg-gray-600 text-white" 
                              size="sm"
                              onClick={() => navigate(`/customers/${customer.id}`)}
                            >
                              <Target className="h-3 w-3 mr-1" />
                              Email
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-900">
                    <strong>🚨 Action Required:</strong> Reach out to at-risk customers with personalized offers, 
                    address top churn reasons (price sensitivity, product quality), and implement win-back campaigns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          {/* Top Customers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                Top Customers
              </CardTitle>
              <CardDescription>Highest value customers by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Rank</th>
                      <th className="text-left py-3 px-4 font-medium">Customer</th>
                      <th className="text-right py-3 px-4 font-medium">Orders</th>
                      <th className="text-right py-3 px-4 font-medium">Revenue</th>
                      <th className="text-right py-3 px-4 font-medium">Avg Order</th>
                      <th className="text-left py-3 px-4 font-medium">RFM Segment</th>
                      <th className="text-center py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {top_customers.map((customer, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-semibold">#{index + 1}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-xs text-muted-foreground">{customer.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">{customer.orders}</td>
                        <td className="py-3 px-4 text-right font-semibold text-green-600">
                          ${customer.revenue.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">${customer.avg_order}</td>
                        <td className="py-3 px-4">{getRFMBadge(customer.rfm)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate(`/customers/${customer.id}`)}
                            >
                              <Users className="h-3 w-3 mr-1" />
                              Profile
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

          {/* Customers by Location */}
          <Card>
            <CardHeader>
              <CardTitle>Customers by Location</CardTitle>
              <CardDescription>Geographic distribution of customer base</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {by_location.map((loc, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{loc.location}</span>
                      <span className="text-muted-foreground">{loc.customers} customers ({loc.percentage}%)</span>
                    </div>
                    <Progress value={loc.percentage} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      ${loc.revenue.toLocaleString()} revenue
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Purchase Frequency Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Purchase Frequency Distribution
                </CardTitle>
                <CardDescription>Customer distribution by order count</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsBar data={purchase_frequency}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="orders" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="customers" fill="#3b82f6" name="Customers">
                      {purchase_frequency.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </RechartsBar>
                </ResponsiveContainer>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>Insight:</strong> 47.2% are one-time buyers. Focus on converting them to repeat customers 
                    through follow-up campaigns and loyalty programs.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Customer Engagement Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Customer Engagement Score
                </CardTitle>
                <CardDescription>Engagement level by segment (0-10 scale)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {engagement_score.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.segment}</span>
                        <span className="text-2xl font-bold" style={{ color: item.color }}>
                          {item.score}
                        </span>
                      </div>
                      <Progress value={item.score * 10} className="h-3" />
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Average Engagement</p>
                      <p className="text-2xl font-bold text-blue-600">{overview.avg_engagement_score}</p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-xs text-blue-900 mt-2">
                    Score above 7.0 indicates good customer engagement. Focus on improving Inactive segment engagement.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
