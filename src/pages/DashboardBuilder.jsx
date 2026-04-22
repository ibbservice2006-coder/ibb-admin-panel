import { useState } from 'react'
import { Plus, Save, Layout, Grid, BarChart3, PieChart, TrendingUp, Users, Package, ShoppingCart, DollarSign, Activity, Eye, Settings, Trash2, Edit, GripVertical, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BarChart, Bar, LineChart, Line, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Available widget types
const widgetTypes = [
  {
    id: 'stat',
    name: 'Stat Card',
    icon: Activity,
    description: 'Display a single statistic',
    category: 'metrics'
  },
  {
    id: 'bar-chart',
    name: 'Bar Chart',
    icon: BarChart3,
    description: 'Show data in bar chart format',
    category: 'charts'
  },
  {
    id: 'line-chart',
    name: 'Line Chart',
    icon: TrendingUp,
    description: 'Display trends over time',
    category: 'charts'
  },
  {
    id: 'pie-chart',
    name: 'Pie Chart',
    icon: PieChart,
    description: 'Show data distribution',
    category: 'charts'
  },
  {
    id: 'table',
    name: 'Data Table',
    icon: Grid,
    description: 'Display data in table format',
    category: 'data'
  }
]

// Sample data
const sampleData = {
  revenue: { value: 125430, change: 12.5, trend: 'up' },
  orders: { value: 1234, change: -8.2, trend: 'down' },
  customers: { value: 3456, change: 5.1, trend: 'up' },
  products: { value: 567, change: 2.3, trend: 'up' },
  salesData: [
    { month: 'Jan', sales: 4000, orders: 240 },
    { month: 'Feb', sales: 3000, orders: 198 },
    { month: 'Mar', sales: 5000, orders: 320 },
    { month: 'Apr', sales: 4500, orders: 280 },
    { month: 'May', sales: 6000, orders: 390 },
    { month: 'Jun', sales: 5500, orders: 350 }
  ],
  orderStatus: [
    { name: 'Completed', value: 400, color: '#10B981' },
    { name: 'Pending', value: 300, color: '#F59E0B' },
    { name: 'Processing', value: 200, color: '#3B82F6' },
    { name: 'Cancelled', value: 100, color: '#EF4444' }
  ],
  topProducts: [
    { name: 'iPhone 15 Pro', sales: 145, revenue: 6220500 },
    { name: 'MacBook Pro M3', sales: 89, revenue: 7999100 },
    { name: 'iPad Air', sales: 234, revenue: 5826600 },
    { name: 'Samsung Galaxy S24', sales: 167, revenue: 5995300 }
  ]
}

// Saved layouts
const defaultLayouts = [
  {
    id: 'default',
    name: 'Default Dashboard',
    description: 'Standard e-commerce dashboard',
    widgets: [
      { id: '1', type: 'stat', title: 'Total Revenue', dataKey: 'revenue', icon: 'DollarSign', size: 'small' },
      { id: '2', type: 'stat', title: 'Orders', dataKey: 'orders', icon: 'ShoppingCart', size: 'small' },
      { id: '3', type: 'stat', title: 'Customers', dataKey: 'customers', icon: 'Users', size: 'small' },
      { id: '4', type: 'stat', title: 'Products', dataKey: 'products', icon: 'Package', size: 'small' },
      { id: '5', type: 'line-chart', title: 'Sales Overview', dataKey: 'salesData', size: 'large' },
      { id: '6', type: 'pie-chart', title: 'Order Status', dataKey: 'orderStatus', size: 'medium' }
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    description: 'Focus on charts and trends',
    widgets: [
      { id: '1', type: 'bar-chart', title: 'Monthly Sales', dataKey: 'salesData', size: 'large' },
      { id: '2', type: 'line-chart', title: 'Order Trends', dataKey: 'salesData', size: 'large' },
      { id: '3', type: 'pie-chart', title: 'Order Distribution', dataKey: 'orderStatus', size: 'medium' }
    ]
  },
  {
    id: 'minimal',
    name: 'Minimal Dashboard',
    description: 'Key metrics only',
    widgets: [
      { id: '1', type: 'stat', title: 'Total Revenue', dataKey: 'revenue', icon: 'DollarSign', size: 'medium' },
      { id: '2', type: 'stat', title: 'Orders', dataKey: 'orders', icon: 'ShoppingCart', size: 'medium' },
      { id: '3', type: 'stat', title: 'Customers', dataKey: 'customers', icon: 'Users', size: 'medium' }
    ]
  }
]

export default function DashboardBuilder() {
  const [currentLayout, setCurrentLayout] = useState(defaultLayouts[0])
  const [widgets, setWidgets] = useState(defaultLayouts[0].widgets)
  const [editMode, setEditMode] = useState(false)
  const [savedLayouts, setSavedLayouts] = useState(defaultLayouts)
  const [addWidgetOpen, setAddWidgetOpen] = useState(false)
  const [saveLayoutOpen, setSaveLayoutOpen] = useState(false)
  const [layoutName, setLayoutName] = useState('')
  const [layoutDescription, setLayoutDescription] = useState('')

  // Add widget
  const handleAddWidget = (widgetType) => {
    const newWidget = {
      id: Date.now().toString(),
      type: widgetType.id,
      title: widgetType.name,
      dataKey: widgetType.id === 'stat' ? 'revenue' : 'salesData',
      icon: widgetType.id === 'stat' ? 'DollarSign' : null,
      size: widgetType.category === 'charts' ? 'large' : 'small'
    }
    setWidgets([...widgets, newWidget])
    setAddWidgetOpen(false)
  }

  // Remove widget
  const handleRemoveWidget = (widgetId) => {
    setWidgets(widgets.filter(w => w.id !== widgetId))
  }

  // Update widget
  const handleUpdateWidget = (widgetId, updates) => {
    setWidgets(widgets.map(w => w.id === widgetId ? { ...w, ...updates } : w))
  }

  // Save layout
  const handleSaveLayout = () => {
    const newLayout = {
      id: Date.now().toString(),
      name: layoutName,
      description: layoutDescription,
      widgets: widgets
    }
    setSavedLayouts([...savedLayouts, newLayout])
    setLayoutName('')
    setLayoutDescription('')
    setSaveLayoutOpen(false)
  }

  // Load layout
  const handleLoadLayout = (layout) => {
    setCurrentLayout(layout)
    setWidgets(layout.widgets)
    setEditMode(false)
  }

  // Delete layout
  const handleDeleteLayout = (layoutId) => {
    setSavedLayouts(savedLayouts.filter(l => l.id !== layoutId))
  }

  // Render widget
  const renderWidget = (widget) => {
    const data = sampleData[widget.dataKey]
    
    switch (widget.type) {
      case 'stat':
        const IconComponent = widget.icon === 'DollarSign' ? DollarSign : 
                            widget.icon === 'ShoppingCart' ? ShoppingCart :
                            widget.icon === 'Users' ? Users : Package
        return (
          <Card className={widget.size === 'small' ? 'col-span-1' : widget.size === 'medium' ? 'col-span-2' : 'col-span-4'}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
              <IconComponent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {widget.dataKey === 'revenue' ? `$${data.value.toLocaleString()}` : data.value.toLocaleString()}
              </div>
              <p className={`text-xs ${data.trend === 'up' ? 'text-green-600' : 'text-red-600'} mt-1`}>
                {data.trend === 'up' ? '+' : ''}{data.change}% from last month
              </p>
            </CardContent>
          </Card>
        )
      
      case 'bar-chart':
        return (
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sampleData.salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#3B82F6" />
                  <Bar dataKey="orders" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )
      
      case 'line-chart':
        return (
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sampleData.salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )
      
      case 'pie-chart':
        return (
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie
                    data={sampleData.orderStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sampleData.orderStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )
      
      case 'table':
        return (
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sampleData.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${product.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Builder</h1>
          <p className="text-muted-foreground mt-1">
            Customize your dashboard layout and widgets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm"
            variant={editMode ? 'default' : 'outline'}
            onClick={() => setEditMode(!editMode)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {editMode ? 'Exit Edit Mode' : 'Edit Mode'}
          </Button>
          {editMode && (
            <>
              <Dialog open={addWidgetOpen} onOpenChange={setAddWidgetOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Widget
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Widget</DialogTitle>
                    <DialogDescription>
                      Choose a widget type to add to your dashboard
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    {widgetTypes.map((widgetType) => {
                      const Icon = widgetType.icon
                      return (
                        <button
                          key={widgetType.id}
                          onClick={() => handleAddWidget(widgetType)}
                          className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted transition-colors text-left"
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{widgetType.name}</h4>
                            <p className="text-sm text-muted-foreground">{widgetType.description}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={saveLayoutOpen} onOpenChange={setSaveLayoutOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Save Layout
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Dashboard Layout</DialogTitle>
                    <DialogDescription>
                      Save your current dashboard configuration
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="layout-name">Layout Name</Label>
                      <Input
                        id="layout-name"
                        placeholder="My Custom Dashboard"
                        value={layoutName}
                        onChange={(e) => setLayoutName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="layout-description">Description</Label>
                      <Input
                        id="layout-description"
                        placeholder="Description of this layout"
                        value={layoutDescription}
                        onChange={(e) => setLayoutDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button size="sm" variant="outline" onClick={() => setSaveLayoutOpen(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveLayout} disabled={!layoutName}>
                      Save Layout
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">
            <Layout className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="layouts">
            <Grid className="h-4 w-4 mr-2" />
            Saved Layouts
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          {/* Current Layout Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{currentLayout.name}</CardTitle>
                  <CardDescription>{currentLayout.description}</CardDescription>
                </div>
                <Badge variant="outline">{widgets.length} widgets</Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Widgets Grid */}
          <div className="grid grid-cols-4 gap-4">
            {widgets.map((widget) => (
              <div key={widget.id} className="relative group">
                {editMode && (
                  <div className="absolute -top-2 -right-2 z-10 flex gap-1">
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveWidget(widget.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {renderWidget(widget)}
              </div>
            ))}
          </div>

          {widgets.length === 0 && (
            <Card className="p-12">
              <div className="text-center">
                <Layout className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No widgets added</h3>
                <p className="text-muted-foreground mb-4">
                  Click "Add Widget" to start building your dashboard
                </p>
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setAddWidgetOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Widget
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Saved Layouts Tab */}
        <TabsContent value="layouts" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {savedLayouts.map((layout) => (
              <Card key={layout.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{layout.name}</CardTitle>
                      <CardDescription>{layout.description}</CardDescription>
                    </div>
                    {layout.id !== 'default' && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteLayout(layout.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Widgets:</span>
                      <Badge variant="secondary">{layout.widgets.length}</Badge>
                    </div>
                    <Separator />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleLoadLayout(layout)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Load
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
