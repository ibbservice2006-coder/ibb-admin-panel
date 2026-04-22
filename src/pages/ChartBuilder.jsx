import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  AreaChart,
  Database,
  Save,
  Download,
  Eye,
  Settings,
  Palette,
  Grid3x3,
  TrendingUp,
  Play,
  FileText,
  Plus,
  Trash2,
  Copy
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import {
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts'

export default function ChartBuilder() {
  const [savedCharts, setSavedCharts] = useState([
    {
      id: 1,
      name: 'Monthly Sales',
      type: 'bar',
      query: 'SELECT month, SUM(total) as sales FROM orders GROUP BY month',
      createdAt: '2024-10-01'
    },
    {
      id: 2,
      name: 'Revenue Trend',
      type: 'line',
      query: 'SELECT date, revenue FROM daily_revenue ORDER BY date',
      createdAt: '2024-10-02'
    }
  ])

  const [chartConfig, setChartConfig] = useState({
    name: '',
    type: 'bar',
    title: '',
    description: '',
    dataSource: 'custom',
    query: '',
    xAxisKey: '',
    yAxisKey: '',
    colorScheme: 'blue',
    showGrid: true,
    showLegend: true,
    showTooltip: true,
    width: '100%',
    height: 400
  })

  const [chartData, setChartData] = useState([])
  const [previewMode, setPreviewMode] = useState(false)

  // Sample data sources
  const dataSources = {
    sales: {
      label: 'Sales Data',
      query: 'SELECT month, revenue, orders FROM monthly_sales',
      sampleData: [
        { month: 'Jan', revenue: 4000, orders: 240 },
        { month: 'Feb', revenue: 3000, orders: 198 },
        { month: 'Mar', revenue: 5000, orders: 300 },
        { month: 'Apr', revenue: 4500, orders: 278 },
        { month: 'May', revenue: 6000, orders: 389 },
        { month: 'Jun', revenue: 5500, orders: 349 }
      ]
    },
    products: {
      label: 'Product Performance',
      query: 'SELECT category, sales, profit FROM product_stats',
      sampleData: [
        { category: 'Electronics', sales: 12000, profit: 3200 },
        { category: 'Clothing', sales: 8000, profit: 2400 },
        { category: 'Home', sales: 6000, profit: 1800 },
        { category: 'Sports', sales: 4500, profit: 1200 },
        { category: 'Books', sales: 3000, profit: 900 }
      ]
    },
    customers: {
      label: 'Customer Analytics',
      query: 'SELECT segment, count, value FROM customer_segments',
      sampleData: [
        { segment: 'Premium', count: 450, value: 125000 },
        { segment: 'Regular', count: 1200, value: 180000 },
        { segment: 'New', count: 800, value: 45000 }
      ]
    },
    orders: {
      label: 'Order Status',
      query: 'SELECT status, count FROM order_status_summary',
      sampleData: [
        { status: 'Completed', count: 1250 },
        { status: 'Processing', count: 320 },
        { status: 'Pending', count: 180 },
        { status: 'Cancelled', count: 45 }
      ]
    }
  }

  const colorSchemes = {
    blue: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'],
    green: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'],
    purple: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'],
    orange: ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'],
    red: ['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'],
    multi: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
  }

  const chartTypes = [
    { value: 'bar', label: 'Bar Chart', icon: BarChart3, description: 'Compare values across categories' },
    { value: 'line', label: 'Line Chart', icon: LineChart, description: 'Show trends over time' },
    { value: 'area', label: 'Area Chart', icon: AreaChart, description: 'Display cumulative values' },
    { value: 'pie', label: 'Pie Chart', icon: PieChart, description: 'Show proportions' }
  ]

  const handleLoadSampleData = () => {
    if (chartConfig.dataSource === 'custom') {
      toast({
        title: 'Info',
        description: 'Please select a data source first',
        variant: 'default'
      })
      return
    }

    const data = dataSources[chartConfig.dataSource].sampleData
    setChartData(data)
    
    // Auto-detect keys
    if (data.length > 0) {
      const keys = Object.keys(data[0])
      setChartConfig(prev => ({
        ...prev,
        xAxisKey: keys[0] || '',
        yAxisKey: keys[1] || ''
      }))
    }

    toast({
      title: 'Success',
      description: `Loaded ${data.length} records from ${dataSources[chartConfig.dataSource].label}`
    })
  }

  const handleRunQuery = () => {
    if (!chartConfig.query) {
      toast({
        title: 'Error',
        description: 'Please enter a SQL query',
        variant: 'destructive'
      })
      return
    }

    // Simulate query execution with sample data
    const sampleData = [
      { name: 'Item A', value: 400 },
      { name: 'Item B', value: 300 },
      { name: 'Item C', value: 500 },
      { name: 'Item D', value: 200 }
    ]
    
    setChartData(sampleData)
    setChartConfig(prev => ({
      ...prev,
      xAxisKey: 'name',
      yAxisKey: 'value'
    }))

    toast({
      title: 'Query Executed',
      description: `Retrieved ${sampleData.length} records`
    })
  }

  const handleSaveChart = () => {
    if (!chartConfig.name || chartData.length === 0) {
      toast({
        title: 'Error',
        description: 'Please provide a chart name and load data',
        variant: 'destructive'
      })
      return
    }

    const newChart = {
      id: savedCharts.length + 1,
      name: chartConfig.name,
      type: chartConfig.type,
      query: chartConfig.query || dataSources[chartConfig.dataSource]?.query || '',
      createdAt: new Date().toISOString().split('T')[0]
    }

    setSavedCharts([...savedCharts, newChart])

    toast({
      title: 'Success',
      description: 'Chart saved successfully'
    })
  }

  const handleLoadChart = (chart) => {
    setChartConfig(prev => ({
      ...prev,
      name: chart.name,
      type: chart.type,
      query: chart.query
    }))
  }

  const handleDeleteChart = (id) => {
    setSavedCharts(savedCharts.filter(c => c.id !== id))
    toast({
      title: 'Success',
      description: 'Chart deleted successfully'
    })
  }

  const handleExport = () => {
    toast({
      title: 'Export Started',
      description: 'Chart is being exported as PNG'
    })
  }

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No data to display</p>
            <p className="text-sm text-muted-foreground">Load data or run a query to see the chart</p>
          </div>
        </div>
      )
    }

    const colors = colorSchemes[chartConfig.colorScheme]

    switch (chartConfig.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={chartConfig.height}>
            <BarChart data={chartData}>
              {chartConfig.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={chartConfig.xAxisKey} />
              <YAxis />
              {chartConfig.showTooltip && <Tooltip />}
              {chartConfig.showLegend && <Legend />}
              <Bar dataKey={chartConfig.yAxisKey} fill={colors[0]} />
            </BarChart>
          </ResponsiveContainer>
        )

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={chartConfig.height}>
            <RechartsLineChart data={chartData}>
              {chartConfig.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={chartConfig.xAxisKey} />
              <YAxis />
              {chartConfig.showTooltip && <Tooltip />}
              {chartConfig.showLegend && <Legend />}
              <Line 
                type="monotone" 
                dataKey={chartConfig.yAxisKey} 
                stroke={colors[0]} 
                strokeWidth={2}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        )

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={chartConfig.height}>
            <RechartsAreaChart data={chartData}>
              {chartConfig.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={chartConfig.xAxisKey} />
              <YAxis />
              {chartConfig.showTooltip && <Tooltip />}
              {chartConfig.showLegend && <Legend />}
              <Area 
                type="monotone" 
                dataKey={chartConfig.yAxisKey} 
                stroke={colors[0]} 
                fill={colors[0]}
                fillOpacity={0.6}
              />
            </RechartsAreaChart>
          </ResponsiveContainer>
        )

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={chartConfig.height}>
            <RechartsPieChart>
              {chartConfig.showTooltip && <Tooltip />}
              {chartConfig.showLegend && <Legend />}
              <Pie
                data={chartData}
                dataKey={chartConfig.yAxisKey}
                nameKey={chartConfig.xAxisKey}
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
            </RechartsPieChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Chart Builder</h1>
        <p className="text-muted-foreground">
          Create interactive charts from your data with visual query builder
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Charts</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedCharts.length}</div>
            <p className="text-xs text-muted-foreground">Total charts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Points</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chartData.length}</div>
            <p className="text-xs text-muted-foreground">Currently loaded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chart Type</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{chartConfig.type}</div>
            <p className="text-xs text-muted-foreground">Current selection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(dataSources).length}</div>
            <p className="text-xs text-muted-foreground">Available sources</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="builder" className="space-y-4">
        <TabsList>
          <TabsTrigger value="builder">
            <BarChart3 className="h-4 w-4 mr-2" />
            Chart Builder
          </TabsTrigger>
          <TabsTrigger value="data">
            <Database className="h-4 w-4 mr-2" />
            Data Source
          </TabsTrigger>
          <TabsTrigger value="customize">
            <Palette className="h-4 w-4 mr-2" />
            Customize
          </TabsTrigger>
          <TabsTrigger value="saved">
            <FileText className="h-4 w-4 mr-2" />
            Saved Charts
          </TabsTrigger>
        </TabsList>

        {/* Builder Tab */}
        <TabsContent value="builder" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Chart Preview */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{chartConfig.title || 'Chart Preview'}</CardTitle>
                      <CardDescription>
                        {chartConfig.description || 'Configure your chart and load data to see preview'}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveChart}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {renderChart()}
                </CardContent>
              </Card>

              {/* Chart Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Chart Configuration</CardTitle>
                  <CardDescription>Basic settings for your chart</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="chart-name">Chart Name</Label>
                      <Input
                        id="chart-name"
                        placeholder="e.g., Monthly Sales"
                        value={chartConfig.name}
                        onChange={(e) => setChartConfig({ ...chartConfig, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chart-title">Chart Title</Label>
                      <Input
                        id="chart-title"
                        placeholder="Display title"
                        value={chartConfig.title}
                        onChange={(e) => setChartConfig({ ...chartConfig, title: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Brief description"
                      value={chartConfig.description}
                      onChange={(e) => setChartConfig({ ...chartConfig, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="x-axis">X-Axis Field</Label>
                      <Input
                        id="x-axis"
                        placeholder="e.g., month, category"
                        value={chartConfig.xAxisKey}
                        onChange={(e) => setChartConfig({ ...chartConfig, xAxisKey: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="y-axis">Y-Axis Field</Label>
                      <Input
                        id="y-axis"
                        placeholder="e.g., sales, revenue"
                        value={chartConfig.yAxisKey}
                        onChange={(e) => setChartConfig({ ...chartConfig, yAxisKey: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Chart Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Chart Type</CardTitle>
                  <CardDescription>Select visualization type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {chartTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <Button size="sm"
                          key={type.value}
                          variant={chartConfig.type === type.value ? 'default' : 'outline'}
                          className="h-auto flex-col items-start p-3"
                          onClick={() => setChartConfig({ ...chartConfig, type: type.value })}
                        >
                          <Icon className="h-5 w-5 mb-1" />
                          <span className="text-xs font-medium">{type.label}</span>
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common operations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white w-full" onClick={handleLoadSampleData}>
                    <Database className="h-4 w-4 mr-2" />
                    Load Sample Data
                  </Button>
                  <Button size="sm" className="w-full" variant="outline" onClick={handleRunQuery}>
                    <Play className="h-4 w-4 mr-2" />
                    Run Query
                  </Button>
                  <Button size="sm" className="w-full" variant="outline" onClick={() => setChartData([])}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Data
                  </Button>
                </CardContent>
              </Card>

              {/* Data Info */}
              {chartData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Data Info</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Records:</span>
                        <span className="font-medium">{chartData.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fields:</span>
                        <span className="font-medium">
                          {chartData.length > 0 ? Object.keys(chartData[0]).length : 0}
                        </span>
                      </div>
                      <Separator />
                      <div className="text-xs text-muted-foreground">
                        Available fields: {chartData.length > 0 ? Object.keys(chartData[0]).join(', ') : 'None'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Data Source Tab */}
        <TabsContent value="data" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Predefined Data Sources</CardTitle>
                <CardDescription>Select from available data sources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Data Source</Label>
                  <Select 
                    value={chartConfig.dataSource} 
                    onValueChange={(value) => setChartConfig({ ...chartConfig, dataSource: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">Custom Query</SelectItem>
                      {Object.entries(dataSources).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {chartConfig.dataSource !== 'custom' && (
                  <Alert>
                    <Database className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Query:</strong> {dataSources[chartConfig.dataSource]?.query}
                    </AlertDescription>
                  </Alert>
                )}

                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white w-full" onClick={handleLoadSampleData}>
                  <Database className="h-4 w-4 mr-2" />
                  Load Data
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom SQL Query</CardTitle>
                <CardDescription>Write your own query</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="query">SQL Query</Label>
                  <Textarea
                    id="query"
                    placeholder="SELECT column1, column2 FROM table WHERE condition"
                    className="min-h-[200px] font-mono text-sm"
                    value={chartConfig.query}
                    onChange={(e) => setChartConfig({ ...chartConfig, query: e.target.value })}
                  />
                </div>

                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white w-full" onClick={handleRunQuery}>
                  <Play className="h-4 w-4 mr-2" />
                  Execute Query
                </Button>

                <Alert>
                  <AlertDescription className="text-xs">
                    Make sure your query returns at least two columns: one for labels (X-axis) and one for values (Y-axis)
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customize Tab */}
        <TabsContent value="customize" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Visual Settings</CardTitle>
                <CardDescription>Customize chart appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Color Scheme</Label>
                  <Select 
                    value={chartConfig.colorScheme} 
                    onValueChange={(value) => setChartConfig({ ...chartConfig, colorScheme: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="multi">Multi-color</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Chart Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={chartConfig.height}
                    onChange={(e) => setChartConfig({ ...chartConfig, height: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-grid">Show Grid</Label>
                    <Switch
                      id="show-grid"
                      checked={chartConfig.showGrid}
                      onCheckedChange={(checked) => setChartConfig({ ...chartConfig, showGrid: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-legend">Show Legend</Label>
                    <Switch
                      id="show-legend"
                      checked={chartConfig.showLegend}
                      onCheckedChange={(checked) => setChartConfig({ ...chartConfig, showLegend: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-tooltip">Show Tooltip</Label>
                    <Switch
                      id="show-tooltip"
                      checked={chartConfig.showTooltip}
                      onCheckedChange={(checked) => setChartConfig({ ...chartConfig, showTooltip: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Color Preview</CardTitle>
                <CardDescription>Current color scheme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {colorSchemes[chartConfig.colorScheme].map((color, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div 
                        className="w-12 h-8 rounded border"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm font-mono">{color}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Saved Charts Tab */}
        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Charts</CardTitle>
              <CardDescription>Manage your saved charts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedCharts.map((chart) => {
                  const ChartIcon = chartTypes.find(t => t.value === chart.type)?.icon || BarChart3
                  return (
                    <div key={chart.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded">
                          <ChartIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{chart.name}</h3>
                            <Badge variant="secondary" className="capitalize">{chart.type}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground font-mono">{chart.query}</p>
                          <p className="text-xs text-muted-foreground">Created: {chart.createdAt}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLoadChart(chart)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Load
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(chart.query)
                            toast({ title: 'Copied', description: 'Query copied to clipboard' })
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteChart(chart.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
