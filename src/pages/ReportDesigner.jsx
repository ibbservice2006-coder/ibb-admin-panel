import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  Share,
  Settings,
  Database,
  Table as TableIcon,
  FileText,
  Layers,
  Palette,
  Code,
  Play,
  Save,
  Copy
} from 'lucide-react'
import { apiService } from '../services/apiService'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart as RechartsLineChart, Line, Pie } from 'recharts'

// Chart types configuration
const chartTypes = [
  { id: 'bar', name: 'Bar Chart', icon: BarChart3, description: 'Compare values across categories' },
  { id: 'line', name: 'Line Chart', icon: LineChart, description: 'Show trends over time' },
  { id: 'pie', name: 'Pie Chart', icon: PieChart, description: 'Show proportions of a whole' },
  { id: 'table', name: 'Data Table', icon: TableIcon, description: 'Display raw data in table format' }
]

// Data sources configuration
const dataSources = [
  { id: 'products', name: 'Products', description: 'Product catalog data' },
  { id: 'orders', name: 'Orders', description: 'Order transactions' },
  { id: 'customers', name: 'Customers', description: 'Customer information' },
  { id: 'payments', name: 'Payments', description: 'Payment transactions' },
  { id: 'reviews', name: 'Reviews', description: 'Customer reviews and ratings' }
]

// Sample data for charts
const sampleData = {
  sales: [
    { month: 'Jan', sales: 4000, orders: 240 },
    { month: 'Feb', sales: 3000, orders: 198 },
    { month: 'Mar', sales: 2000, orders: 180 },
    { month: 'Apr', sales: 2780, orders: 208 },
    { month: 'May', sales: 1890, orders: 181 },
    { month: 'Jun', sales: 2390, orders: 250 }
  ],
  categories: [
    { name: 'Electronics', value: 400, color: '#8884d8' },
    { name: 'Clothing', value: 300, color: '#82ca9d' },
    { name: 'Books', value: 200, color: '#ffc658' },
    { name: 'Home', value: 100, color: '#ff7300' }
  ]
}

function ChartPreview({ chart }) {
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0']

  if (!chart || !chart.type) {
    return (
      <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Select a chart type to see preview</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-64 p-4 bg-card rounded-lg border">
      <h4 className="font-medium mb-4">{chart.name}</h4>
      <ResponsiveContainer width="100%" height="100%">
        {chart.type === 'bar' && (
          <BarChart data={sampleData.sales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#8884d8" />
            <Bar dataKey="orders" fill="#82ca9d" />
          </BarChart>
        )}
        
        {chart.type === 'line' && (
          <RechartsLineChart data={sampleData.sales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} />
          </RechartsLineChart>
        )}
        
        {chart.type === 'pie' && (
          <RechartsPieChart>
            <Pie
              data={sampleData.categories}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {sampleData.categories.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RechartsPieChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

function ReportBuilder({ report, onUpdate }) {
  const [reportData, setReportData] = useState(report || {
    name: '',
    description: '',
    dataSource: '',
    charts: []
  })

  const [selectedChart, setSelectedChart] = useState(null)
  const [isChartDialogOpen, setIsChartDialogOpen] = useState(false)

  const handleAddChart = (chartData) => {
    const newChart = {
      id: Date.now(),
      ...chartData
    }
    
    const updatedReport = {
      ...reportData,
      charts: [...reportData.charts, newChart]
    }
    
    setReportData(updatedReport)
    onUpdate(updatedReport)
    setIsChartDialogOpen(false)
  }

  const handleUpdateChart = (chartData) => {
    const updatedCharts = reportData.charts.map(chart => 
      chart.id === chartData.id ? chartData : chart
    )
    
    const updatedReport = {
      ...reportData,
      charts: updatedCharts
    }
    
    setReportData(updatedReport)
    onUpdate(updatedReport)
  }

  const handleDeleteChart = (chartId) => {
    const updatedCharts = reportData.charts.filter(chart => chart.id !== chartId)
    const updatedReport = {
      ...reportData,
      charts: updatedCharts
    }
    
    setReportData(updatedReport)
    onUpdate(updatedReport)
  }

  return (
    <div className="space-y-6">
      {/* Report Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportName">Report Name</Label>
              <Input
                id="reportName"
                value={reportData.name}
                onChange={(e) => {
                  const updated = { ...reportData, name: e.target.value }
                  setReportData(updated)
                  onUpdate(updated)
                }}
                placeholder="Enter report name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataSource">Data Source</Label>
              <Select
                value={reportData.dataSource}
                onValueChange={(value) => {
                  const updated = { ...reportData, dataSource: value }
                  setReportData(updated)
                  onUpdate(updated)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent>
                  {dataSources.map((source) => (
                    <SelectItem key={source.id} value={source.id}>
                      {source.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={reportData.description}
              onChange={(e) => {
                const updated = { ...reportData, description: e.target.value }
                setReportData(updated)
                onUpdate(updated)
              }}
              placeholder="Describe the purpose of this report"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Charts & Visualizations</CardTitle>
            <Dialog open={isChartDialogOpen} onOpenChange={setIsChartDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Chart
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Chart</DialogTitle>
                  <DialogDescription>
                    Create a new chart for your report
                  </DialogDescription>
                </DialogHeader>
                <ChartDialog onSubmit={handleAddChart} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {reportData.charts && reportData.charts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reportData.charts.map((chart) => (
                <div key={chart.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{chart.name}</h4>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedChart(chart)
                          setIsChartDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteChart(chart.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <ChartPreview chart={chart} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Charts Added</h3>
              <p className="text-muted-foreground mb-4">
                Add charts and visualizations to build your report
              </p>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setIsChartDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Chart
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function ChartDialog({ onSubmit, chart }) {
  const [chartData, setChartData] = useState(chart || {
    name: '',
    type: '',
    dataSource: '',
    xAxis: '',
    yAxis: '',
    groupBy: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(chartData)
  }

  const selectedChartType = chartTypes.find(type => type.id === chartData.type)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="chartName">Chart Name</Label>
        <Input
          id="chartName"
          value={chartData.name}
          onChange={(e) => setChartData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter chart name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Chart Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {chartTypes.map((type) => (
            <Button size="sm"
              key={type.id}
              type="button"
              variant={chartData.type === type.id ? "default" : "outline"}
              onClick={() => setChartData(prev => ({ ...prev, type: type.id }))}
              className="justify-start gap-2 h-auto p-3"
            >
              <type.icon className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium text-sm">{type.name}</div>
                <div className="text-xs text-muted-foreground">
                  {type.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {selectedChartType && (
        <>
          <div className="space-y-2">
            <Label htmlFor="dataSource">Data Source</Label>
            <Select
              value={chartData.dataSource}
              onValueChange={(value) => setChartData(prev => ({ ...prev, dataSource: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select data source" />
              </SelectTrigger>
              <SelectContent>
                {dataSources.map((source) => (
                  <SelectItem key={source.id} value={source.id}>
                    {source.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {chartData.type !== 'table' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="xAxis">X-Axis</Label>
                <Input
                  id="xAxis"
                  value={chartData.xAxis}
                  onChange={(e) => setChartData(prev => ({ ...prev, xAxis: e.target.value }))}
                  placeholder="e.g., date, category"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yAxis">Y-Axis</Label>
                <Input
                  id="yAxis"
                  value={chartData.yAxis}
                  onChange={(e) => setChartData(prev => ({ ...prev, yAxis: e.target.value }))}
                  placeholder="e.g., sales, count"
                />
              </div>
            </div>
          )}
        </>
      )}

      <div className="flex justify-end space-x-2">
        <Button size="sm" type="submit" className="bg-gray-700 hover:bg-gray-600 text-white" disabled={!chartData.name || !chartData.type}>
          {chart ? 'Update' : 'Add'} Chart
        </Button>
      </div>
    </form>
  )
}

export default function ReportDesigner() {
  const [selectedReport, setSelectedReport] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('reports')

  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Mock data for reports
  const mockReports = [
    {
      id: 1,
      name: 'Sales Performance Dashboard',
      description: 'Monthly sales analysis with trends and comparisons',
      dataSource: 'orders',
      status: 'published',
      charts: [
        { id: 1, name: 'Monthly Sales', type: 'bar', dataSource: 'orders' },
        { id: 2, name: 'Sales Trend', type: 'line', dataSource: 'orders' }
      ],
      views: 156,
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'Customer Analytics Report',
      description: 'Customer behavior and demographics analysis',
      dataSource: 'customers',
      status: 'draft',
      charts: [
        { id: 1, name: 'Customer Distribution', type: 'pie', dataSource: 'customers' },
        { id: 2, name: 'Customer Data', type: 'table', dataSource: 'customers' }
      ],
      views: 23,
      created_at: '2024-01-10T14:20:00Z'
    }
  ]

  const { data: reports, isLoading } = useQuery({
    queryKey: ['reports', { search: searchTerm }],
    queryFn: () => {
      let filtered = mockReports
      if (searchTerm) {
        filtered = filtered.filter(report => 
          report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      return Promise.resolve({ items: filtered, total: filtered.length })
    }
  })

  const createReportMutation = useMutation({
    mutationFn: (reportData) => {
      return Promise.resolve({ id: Date.now(), ...reportData, charts: [], views: 0 })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reports'])
      toast({ title: 'Report created successfully' })
      setIsDialogOpen(false)
    }
  })

  const handleCreateReport = (reportData) => {
    createReportMutation.mutate(reportData)
  }

  const handleUpdateReport = (reportData) => {
    setSelectedReport(reportData)
    toast({ title: 'Report updated' })
  }

  return (
    <div className="space-y-6 animate-slide-in-top">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Report Designer
          </h1>
          <p className="text-muted-foreground">
            Design custom reports with advanced analytics
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white hover-lift">
              <Plus className="h-4 w-4 mr-2" />
              Create Report
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Report</DialogTitle>
              <DialogDescription>
                Start building a new analytics report
              </DialogDescription>
            </DialogHeader>
            <NewReportDialog onSubmit={handleCreateReport} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="designer" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Designer
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Integration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Report Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports Table */}
          <Card>
            <CardHeader>
              <CardTitle>Reports ({reports?.total || 0})</CardTitle>
              <CardDescription>
                Manage your analytics reports and dashboards
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Data Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Charts</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports?.items?.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {report.description}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {dataSources.find(ds => ds.id === report.dataSource)?.name || report.dataSource}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              report.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{report.charts?.length || 0}</TableCell>
                        <TableCell>{report.views}</TableCell>
                        <TableCell>
                          {new Date(report.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedReport(report)
                                setActiveTab('designer')
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}
                              variant="ghost"
                              size="icon"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => toast({ title: 'Download Started', description: 'Downloading file...' })}
                              variant="ghost"
                              size="icon"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="designer" className="space-y-6">
          {selectedReport ? (
            <ReportBuilder 
              report={selectedReport} 
              onUpdate={handleUpdateReport}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Report Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Select a report from the Reports tab or create a new one to start designing
                </p>
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setActiveTab('reports')}>
                  Go to Reports
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Integration Options
              </CardTitle>
              <CardDescription>
                Embed reports and integrate with external systems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Integration with the existing advanced report designer system
                </p>
                <div className="bg-muted/50 rounded-lg p-4 border-2 border-dashed">
                  <iframe
                    src="https://9yhyi3cpxq6l.manus.space/advanced-report-designer"
                    className="w-full h-96 border rounded-lg"
                    title="Report Designer Integration"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function NewReportDialog({ onSubmit }) {
  const [reportData, setReportData] = useState({
    name: '',
    description: '',
    dataSource: '',
    status: 'draft'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(reportData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Report Name</Label>
        <Input
          id="name"
          value={reportData.name}
          onChange={(e) => setReportData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter report name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={reportData.description}
          onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the purpose of this report"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="dataSource">Data Source</Label>
        <Select
          value={reportData.dataSource}
          onValueChange={(value) => setReportData(prev => ({ ...prev, dataSource: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select data source" />
          </SelectTrigger>
          <SelectContent>
            {dataSources.map((source) => (
              <SelectItem key={source.id} value={source.id}>
                <div>
                  <div className="font-medium">{source.name}</div>
                  <div className="text-sm text-muted-foreground">{source.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={reportData.status}
          onValueChange={(value) => setReportData(prev => ({ ...prev, status: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button size="sm" type="submit" className="bg-gray-700 hover:bg-gray-600 text-white">Create Report</Button>
      </div>
    </form>
  )
}
