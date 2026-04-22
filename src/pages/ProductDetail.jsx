import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft, Package, DollarSign, TrendingUp, ShoppingCart, 
  BarChart3, Edit, Trash2, Star, AlertCircle
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

// Mock product data
const mockProducts = {
  '1': {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    sku: 'WBH-001',
    category: 'Electronics',
    price: 299.99,
    cost: 180.00,
    stock: 145,
    reorder_point: 50,
    status: 'active',
    rating: 4.5,
    reviews: 234,
    description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
    images: ['https://via.placeholder.com/400x400?text=Product+Image'],
    sales_data: [
      { month: 'Jan', units: 45, revenue: 13500 },
      { month: 'Feb', units: 52, revenue: 15600 },
      { month: 'Mar', units: 48, revenue: 14400 },
      { month: 'Apr', units: 63, revenue: 18900 },
      { month: 'May', units: 58, revenue: 17400 },
      { month: 'Jun', units: 67, revenue: 20100 }
    ],
    recent_orders: [
      { id: 'ORD-1234', customer: 'John Smith', quantity: 2, total: 599.98, date: '2024-10-01', status: 'completed' },
      { id: 'ORD-1235', customer: 'Sarah Johnson', quantity: 1, total: 299.99, date: '2024-10-02', status: 'processing' },
      { id: 'ORD-1236', customer: 'Mike Brown', quantity: 3, total: 899.97, date: '2024-10-03', status: 'completed' }
    ]
  },
  '2': {
    id: '2',
    name: 'Smart Watch Series 5',
    sku: 'SW-005',
    category: 'Electronics',
    price: 599.99,
    cost: 360.00,
    stock: 89,
    reorder_point: 30,
    status: 'active',
    rating: 4.7,
    reviews: 189,
    description: 'Advanced smartwatch with health monitoring, GPS, and water resistance.',
    images: ['https://via.placeholder.com/400x400?text=Smart+Watch'],
    sales_data: [
      { month: 'Jan', units: 22, revenue: 13200 },
      { month: 'Feb', units: 26, revenue: 15600 },
      { month: 'Mar', units: 24, revenue: 14400 },
      { month: 'Apr', units: 28, revenue: 16800 },
      { month: 'May', units: 25, revenue: 15000 },
      { month: 'Jun', units: 30, revenue: 18000 }
    ],
    recent_orders: [
      { id: 'ORD-1240', customer: 'Emily Davis', quantity: 1, total: 599.99, date: '2024-10-01', status: 'completed' },
      { id: 'ORD-1241', customer: 'David Wilson', quantity: 2, total: 1199.98, date: '2024-10-02', status: 'shipped' }
    ]
  }
}

export default function ProductDetail() {
  const { toast } = useToast()
  const { id } = useParams()
  const navigate = useNavigate()
  const product = mockProducts[id] || mockProducts['1']

  const profit = product.price - product.cost
  const margin = ((profit / product.price) * 100).toFixed(1)
  const stockStatus = product.stock > product.reorder_point ? 'In Stock' : 'Low Stock'
  const totalSold = product.sales_data.reduce((sum, item) => sum + item.units, 0)
  const totalRevenue = product.sales_data.reduce((sum, item) => sum + item.revenue, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">SKU: {product.sku}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => toast({ title: 'Updated', description: 'Data updated successfully' })}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={() => toast({ title: 'Deleted', description: 'Data deleted successfully', variant: 'destructive' })}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${product.price}</div>
            <p className="text-xs text-muted-foreground">
              Cost: ${product.cost} | Margin: {margin}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{product.stock}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant={product.stock > product.reorder_point ? 'default' : 'destructive'}>
                {stockStatus}
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sold</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSold}</div>
            <p className="text-xs text-muted-foreground">
              Last 6 months
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Last 6 months
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales History</TabsTrigger>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Product Info */}
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <span className="text-sm font-medium">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge>{product.status}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={product.sales_data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="units" stroke="#3b82f6" name="Units Sold" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sales History Tab */}
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={product.sales_data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="units" fill="#3b82f6" name="Units Sold" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {product.recent_orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.date}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-medium">${order.total}</p>
                      <p className="text-sm text-muted-foreground">Qty: {order.quantity}</p>
                      <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
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
