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
  Package,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  BarChart3,
  DollarSign,
  Warehouse,
  Target,
  ShoppingCart,
  Percent,
  Clock,
  MapPin,
  Archive
} from 'lucide-react'
import {
  LineChart as RechartsLine, Line, BarChart as RechartsBar, Bar, PieChart as RechartsPie, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, Area, AreaChart
} from 'recharts'

// Mock inventory report data
const mockInventoryData = {
  overview: {
    total_items: 156,
    total_stock_value: 285600,
    low_stock_items: 12,
    out_of_stock_items: 5,
    overstocked_items: 8,
    turnover_rate: 4.2,
    stock_accuracy: 96.5,
    carrying_cost: 28560
  },
  value_trend: [
    { month: 'Jan', value: 245000, stock_level: 8500 },
    { month: 'Feb', value: 258000, stock_level: 8900 },
    { month: 'Mar', value: 262000, stock_level: 9100 },
    { month: 'Apr', value: 271000, stock_level: 9400 },
    { month: 'May', value: 268000, stock_level: 9200 },
    { month: 'Jun', value: 275000, stock_level: 9600 },
    { month: 'Jul', value: 282000, stock_level: 9800 },
    { month: 'Aug', value: 279000, stock_level: 9700 },
    { month: 'Sep', value: 285600, stock_level: 10200 }
  ],
  turnover_by_period: [
    { month: 'Jan', turnover: 3.8 },
    { month: 'Feb', turnover: 4.1 },
    { month: 'Mar', turnover: 3.9 },
    { month: 'Apr', turnover: 4.3 },
    { month: 'May', turnover: 4.0 },
    { month: 'Jun', turnover: 4.5 },
    { month: 'Jul', turnover: 4.6 },
    { month: 'Aug', turnover: 4.4 },
    { month: 'Sep', turnover: 4.2 }
  ],
  by_category: [
    { category: 'Electronics', items: 45, stock_value: 125400, turnover: 5.1, status: 'healthy' },
    { category: 'Accessories', items: 68, stock_value: 89200, turnover: 4.8, status: 'healthy' },
    { category: 'Clothing', items: 32, stock_value: 52800, turnover: 3.2, status: 'slow' },
    { category: 'Home & Garden', items: 11, stock_value: 18200, turnover: 2.8, status: 'slow' }
  ],
  by_location: [
    { location: 'Main Warehouse', items: 89, value: 165400, utilization: 78 },
    { location: 'Store A', items: 35, value: 68200, utilization: 65 },
    { location: 'Store B', items: 22, value: 38500, utilization: 58 },
    { location: 'Store C', items: 10, value: 13500, utilization: 42 }
  ],
  abc_analysis: [
    { class: 'A', items: 23, percentage: 14.7, value: 200000, value_percentage: 70.0, color: '#10b981' },
    { class: 'B', items: 47, percentage: 30.1, value: 57120, value_percentage: 20.0, color: '#f59e0b' },
    { class: 'C', items: 86, percentage: 55.2, value: 28480, value_percentage: 10.0, color: '#ef4444' }
  ],
  low_stock_items: [
    { id: '2', sku: 'PROD-002', name: 'Smart Watch Series 5', current_stock: 28, reorder_point: 30, status: 'low' },
    { id: '5', sku: 'PROD-005', name: 'Mechanical Keyboard RGB', current_stock: 15, reorder_point: 20, status: 'low' },
    { id: '12', sku: 'PROD-012', name: 'Wireless Earbuds Pro', current_stock: 8, reorder_point: 25, status: 'critical' },
    { id: '18', sku: 'PROD-018', name: 'Phone Case Premium', current_stock: 12, reorder_point: 40, status: 'critical' },
    { id: '25', sku: 'PROD-025', name: 'Screen Protector', current_stock: 18, reorder_point: 50, status: 'critical' }
  ],
  out_of_stock_items: [
    { id: '3', sku: 'PROD-003', name: 'USB-C Charging Cable', days_out: 3, lost_sales: 45, lost_revenue: 1350 },
    { id: '15', sku: 'PROD-015', name: 'Laptop Bag', days_out: 5, lost_sales: 28, lost_revenue: 2240 },
    { id: '22', sku: 'PROD-022', name: 'Power Bank 20000mAh', days_out: 2, lost_sales: 32, lost_revenue: 1920 },
    { id: '31', sku: 'PROD-031', name: 'Bluetooth Speaker', days_out: 7, lost_sales: 56, lost_revenue: 4480 },
    { id: '38', sku: 'PROD-038', name: 'Webcam HD', days_out: 4, lost_sales: 38, lost_revenue: 3040 }
  ],
  reorder_recommendations: [
    { id: '12', sku: 'PROD-012', name: 'Wireless Earbuds Pro', current: 8, recommended: 100, priority: 'urgent', lead_time: 7 },
    { id: '18', sku: 'PROD-018', name: 'Phone Case Premium', current: 12, recommended: 150, priority: 'urgent', lead_time: 5 },
    { id: '25', sku: 'PROD-025', name: 'Screen Protector', current: 18, recommended: 200, priority: 'high', lead_time: 3 },
    { id: '2', sku: 'PROD-002', name: 'Smart Watch Series 5', current: 28, recommended: 50, priority: 'medium', lead_time: 10 },
    { id: '5', sku: 'PROD-005', name: 'Mechanical Keyboard RGB', current: 15, recommended: 40, priority: 'medium', lead_time: 7 }
  ],
  slow_moving: [
    { sku: 'PROD-042', name: 'Vintage Camera', stock: 45, days_in_stock: 180, value: 18900 },
    { sku: 'PROD-048', name: 'Analog Watch', stock: 32, days_in_stock: 165, value: 12800 },
    { sku: 'PROD-055', name: 'Desk Organizer', stock: 28, days_in_stock: 145, value: 5600 },
    { sku: 'PROD-061', name: 'Wall Clock', stock: 22, days_in_stock: 132, value: 4400 }
  ],
  fast_moving: [
    { sku: 'PROD-001', name: 'Wireless Bluetooth Headphones', avg_daily_sales: 8.5, turnover_days: 12 },
    { sku: 'PROD-006', name: 'Wireless Mouse', avg_daily_sales: 7.2, turnover_days: 15 },
    { sku: 'PROD-011', name: 'Phone Charger', avg_daily_sales: 6.8, turnover_days: 18 },
    { sku: 'PROD-016', name: 'USB Cable', avg_daily_sales: 5.9, turnover_days: 20 }
  ],
  dead_stock: [
    { sku: 'PROD-078', name: 'VGA Cable', stock: 65, days_no_sale: 240, value: 3250, action: 'Clearance Sale' },
    { sku: 'PROD-082', name: 'CD Player', stock: 28, days_no_sale: 210, value: 8400, action: 'Return to Supplier' },
    { sku: 'PROD-091', name: 'Floppy Disk', stock: 120, days_no_sale: 365, value: 1200, action: 'Write Off' },
    { sku: 'PROD-095', name: 'Cassette Tape', stock: 85, days_no_sale: 320, value: 2550, action: 'Donate' }
  ],
  stockout_impact: {
    total_stockouts: 5,
    total_days_out: 21,
    lost_sales: 199,
    lost_revenue: 13030,
    affected_customers: 156,
    avg_recovery_time: 4.2
  },
  carrying_cost_breakdown: {
    storage_cost: 14280,
    insurance: 5712,
    depreciation: 5712,
    opportunity_cost: 2856,
    total: 28560,
    percentage_of_value: 10.0
  }
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const getStatusBadge = (status) => {
  const config = {
    healthy: { variant: 'default', label: 'Healthy' },
    slow: { variant: 'secondary', label: 'Slow Moving' },
    low: { variant: 'secondary', label: 'Low Stock' },
    critical: { variant: 'destructive', label: 'Critical' },
    urgent: { variant: 'destructive', label: 'Urgent' },
    high: { variant: 'default', label: 'High' },
    medium: { variant: 'secondary', label: 'Medium' }
  }
  const { variant, label } = config[status] || config.healthy
  return <Badge variant={variant}>{label}</Badge>
}

export default function InventoryReport() {
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
      toast({ title: 'Report refreshed', description: 'Inventory data has been updated' })
    }, 1000)
  }

  const { 
    overview, value_trend, turnover_by_period, by_category, by_location, abc_analysis,
    low_stock_items, out_of_stock_items, reorder_recommendations, slow_moving, fast_moving,
    dead_stock, stockout_impact, carrying_cost_breakdown
  } = mockInventoryData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Inventory Report</h1>
          <p className="text-muted-foreground">
            Comprehensive inventory analytics, stock management, and optimization insights
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
          <TabsTrigger value="stock-status">Stock Status</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview.total_items}</div>
                <p className="text-xs text-muted-foreground">Unique SKUs</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${overview.total_stock_value.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total inventory value</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview.turnover_rate}x</div>
                <p className="text-xs text-green-600">Healthy rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stock Accuracy</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview.stock_accuracy}%</div>
                <p className="text-xs text-green-600">Excellent accuracy</p>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Value Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Inventory Value Trend
              </CardTitle>
              <CardDescription>Track inventory value and stock levels over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={value_trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.6}
                    name="Inventory Value ($)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="stock_level" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Stock Level (units)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Turnover Rate by Period */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Turnover Rate by Period
              </CardTitle>
              <CardDescription>Monthly inventory turnover performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsBar data={turnover_by_period}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="turnover" fill="#3b82f6" name="Turnover Rate">
                    {turnover_by_period.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.turnover >= 4.0 ? '#10b981' : '#f59e0b'} />
                    ))}
                  </Bar>
                </RechartsBar>
              </ResponsiveContainer>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Target:</strong> 4.0x or higher is considered healthy. 
                  Green bars indicate good performance, orange bars need improvement.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Inventory by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Category</th>
                      <th className="text-right py-3 px-4 font-medium">Items</th>
                      <th className="text-right py-3 px-4 font-medium">Stock Value</th>
                      <th className="text-right py-3 px-4 font-medium">Turnover Rate</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {by_category.map((cat, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{cat.category}</td>
                        <td className="py-3 px-4 text-right">{cat.items}</td>
                        <td className="py-3 px-4 text-right font-semibold">${cat.stock_value.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">{cat.turnover}x</td>
                        <td className="py-3 px-4">{getStatusBadge(cat.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Status Tab */}
        <TabsContent value="stock-status" className="space-y-6">
          {/* Alert Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                <TrendingDown className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{overview.low_stock_items}</div>
                <p className="text-xs text-muted-foreground">Need reorder</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{overview.out_of_stock_items}</div>
                <p className="text-xs text-muted-foreground">Urgent action needed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overstocked</CardTitle>
                <Package className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{overview.overstocked_items}</div>
                <p className="text-xs text-muted-foreground">Consider promotion</p>
              </CardContent>
            </Card>
          </div>

          {/* Reorder Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Reorder Recommendations
              </CardTitle>
              <CardDescription>Suggested purchase orders based on stock levels and demand</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">SKU</th>
                      <th className="text-left py-3 px-4 font-medium">Product</th>
                      <th className="text-right py-3 px-4 font-medium">Current</th>
                      <th className="text-right py-3 px-4 font-medium">Recommended</th>
                      <th className="text-center py-3 px-4 font-medium">Lead Time</th>
                      <th className="text-left py-3 px-4 font-medium">Priority</th>
                      <th className="text-center py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reorder_recommendations.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-mono text-sm">{item.sku}</td>
                        <td className="py-3 px-4 font-medium">{item.name}</td>
                        <td className="py-3 px-4 text-right text-red-600 font-semibold">{item.current}</td>
                        <td className="py-3 px-4 text-right text-green-600 font-semibold">{item.recommended}</td>
                        <td className="py-3 px-4 text-center">{item.lead_time} days</td>
                        <td className="py-3 px-4">{getStatusBadge(item.priority)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button 
                              variant={item.priority === 'urgent' ? 'destructive' : 'default'}
                              size="sm"
                              onClick={() => navigate('/inventory')}
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Order
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate(`/products/${item.id}`)}
                            >
                              <Package className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-900">
                  <strong>💡 Tip:</strong> Place orders for urgent items immediately to avoid stockouts. 
                  Consider lead times when planning reorders.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Low Stock Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-yellow-600" />
                  Low Stock Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {low_stock_items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.sku}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right mr-3">
                          <p className="text-sm font-semibold">{item.current_stock} / {item.reorder_point}</p>
                          {getStatusBadge(item.status)}
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate('/inventory')}
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Reorder
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/products/${item.id}`)}
                          >
                            <Package className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Out of Stock Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Out of Stock Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {out_of_stock_items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.sku}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right mr-3">
                          <p className="text-sm font-semibold text-red-600">{item.days_out} days</p>
                          <p className="text-xs text-muted-foreground">{item.lost_sales} lost sales</p>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => navigate('/inventory')}
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Reorder Now
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/products/${item.id}`)}
                          >
                            <Package className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stockout Impact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Stockout Impact Analysis
              </CardTitle>
              <CardDescription>Financial and operational impact of out-of-stock situations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Stockouts</p>
                  <p className="text-2xl font-bold text-red-600">{stockout_impact.total_stockouts}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Days Out</p>
                  <p className="text-2xl font-bold">{stockout_impact.total_days_out}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Lost Sales</p>
                  <p className="text-2xl font-bold text-red-600">{stockout_impact.lost_sales}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Lost Revenue</p>
                  <p className="text-2xl font-bold text-red-600">${stockout_impact.lost_revenue.toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Affected Customers</p>
                  <p className="text-2xl font-bold">{stockout_impact.affected_customers}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Avg Recovery Time</p>
                  <p className="text-2xl font-bold">{stockout_impact.avg_recovery_time} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fast Moving Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Fast Moving Items
                </CardTitle>
                <CardDescription>High-velocity products with quick turnover</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {fast_moving.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-600">{item.avg_daily_sales}/day</p>
                        <p className="text-xs text-muted-foreground">{item.turnover_days} days turnover</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Slow Moving Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-orange-600" />
                  Slow Moving Items
                </CardTitle>
                <CardDescription>Products with low sales velocity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {slow_moving.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-orange-50">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-orange-600">{item.days_in_stock} days</p>
                        <p className="text-xs text-muted-foreground">${item.value.toLocaleString()} value</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dead Stock Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5 text-red-600" />
                Dead Stock Analysis
              </CardTitle>
              <CardDescription>Items with no sales activity - immediate action required</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">SKU</th>
                      <th className="text-left py-3 px-4 font-medium">Product</th>
                      <th className="text-right py-3 px-4 font-medium">Stock</th>
                      <th className="text-right py-3 px-4 font-medium">Days No Sale</th>
                      <th className="text-right py-3 px-4 font-medium">Value</th>
                      <th className="text-left py-3 px-4 font-medium">Recommended Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dead_stock.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-mono text-sm">{item.sku}</td>
                        <td className="py-3 px-4 font-medium">{item.name}</td>
                        <td className="py-3 px-4 text-right font-semibold">{item.stock}</td>
                        <td className="py-3 px-4 text-right text-red-600 font-semibold">{item.days_no_sale}</td>
                        <td className="py-3 px-4 text-right">${item.value.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <Badge variant="destructive">{item.action}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Total Dead Stock</p>
                  <p className="text-xl font-bold text-red-600">298 units</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Value Locked</p>
                  <p className="text-xl font-bold text-red-600">$15,400</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Days No Sale</p>
                  <p className="text-xl font-bold text-red-600">284 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ABC Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                ABC Analysis
              </CardTitle>
              <CardDescription>Inventory classification by value contribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPie>
                    <Pie
                      data={abc_analysis}
                      dataKey="value"
                      nameKey="class"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `Class ${entry.class}: ${entry.value_percentage}%`}
                    >
                      {abc_analysis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>

                <div className="space-y-3">
                  {abc_analysis.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="font-semibold">Class {item.class}</span>
                        </div>
                        <span className="text-muted-foreground">
                          {item.items} items ({item.percentage}%) = ${item.value.toLocaleString()} ({item.value_percentage}%)
                        </span>
                      </div>
                      <Progress value={item.value_percentage} className="h-2" />
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <p className="text-sm font-semibold">ABC Classification Guide:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li><strong>Class A (High Value):</strong> 70% of value, 15% of items - Tight control, frequent review</li>
                    <li><strong>Class B (Medium Value):</strong> 20% of value, 30% of items - Moderate control, regular review</li>
                    <li><strong>Class C (Low Value):</strong> 10% of value, 55% of items - Simple control, periodic review</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          {/* Stock by Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Stock by Warehouse/Location
              </CardTitle>
              <CardDescription>Inventory distribution across storage locations</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBar data={by_location}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="items" fill="#3b82f6" name="Items" />
                  <Bar dataKey="value" fill="#10b981" name="Value ($)" />
                </RechartsBar>
              </ResponsiveContainer>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Location</th>
                      <th className="text-right py-3 px-4 font-medium">Items</th>
                      <th className="text-right py-3 px-4 font-medium">Value</th>
                      <th className="text-left py-3 px-4 font-medium">Utilization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {by_location.map((loc, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{loc.location}</td>
                        <td className="py-3 px-4 text-right">{loc.items}</td>
                        <td className="py-3 px-4 text-right font-semibold">${loc.value.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Progress value={loc.utilization} className="h-2 flex-1" />
                            <span className="text-sm font-medium">{loc.utilization}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Carrying Cost Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Carrying Cost Analysis
              </CardTitle>
              <CardDescription>Total cost of holding inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Storage Cost</p>
                    <p className="text-xl font-bold">${carrying_cost_breakdown.storage_cost.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Insurance</p>
                    <p className="text-xl font-bold">${carrying_cost_breakdown.insurance.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Depreciation</p>
                    <p className="text-xl font-bold">${carrying_cost_breakdown.depreciation.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Opportunity Cost</p>
                    <p className="text-xl font-bold">${carrying_cost_breakdown.opportunity_cost.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Cost</p>
                    <p className="text-2xl font-bold text-red-600">${carrying_cost_breakdown.total.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Storage Cost</span>
                      <span className="font-semibold">${carrying_cost_breakdown.storage_cost.toLocaleString()}</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Insurance</span>
                      <span className="font-semibold">${carrying_cost_breakdown.insurance.toLocaleString()}</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Depreciation</span>
                      <span className="font-semibold">${carrying_cost_breakdown.depreciation.toLocaleString()}</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Opportunity Cost</span>
                      <span className="font-semibold">${carrying_cost_breakdown.opportunity_cost.toLocaleString()}</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </div>

                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Carrying Cost as % of Inventory Value</p>
                      <p className="text-2xl font-bold text-orange-600">{carrying_cost_breakdown.percentage_of_value}%</p>
                    </div>
                    <Percent className="h-8 w-8 text-orange-600" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Industry benchmark: 15-25%. Your rate is excellent, indicating efficient inventory management.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stock Accuracy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Stock Accuracy Rate
              </CardTitle>
              <CardDescription>Inventory count accuracy measurement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold text-green-600">{overview.stock_accuracy}%</p>
                    <p className="text-sm text-muted-foreground mt-1">Current accuracy rate</p>
                  </div>
                  <Target className="h-16 w-16 text-green-600" />
                </div>
                <Progress value={overview.stock_accuracy} className="h-3" />
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Physical Count</p>
                    <p className="text-xl font-bold">10,200</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">System Count</p>
                    <p className="text-xl font-bold">10,565</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Variance</p>
                    <p className="text-xl font-bold text-orange-600">365</p>
                  </div>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs text-green-900">
                    <strong>✅ Excellent Performance:</strong> Your stock accuracy is above 95%, which is considered world-class. 
                    Industry average is 85-90%. Continue current practices and conduct regular cycle counts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
