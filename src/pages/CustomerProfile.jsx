import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft, User, DollarSign, ShoppingCart, TrendingUp,
  Mail, Phone, MapPin, Calendar, Edit, Star
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

// Mock customer data
const mockCustomers = {
  '1': {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    joined: '2023-01-15',
    segment: 'VIP',
    rfm: 'Champions',
    total_orders: 45,
    total_spent: 18900,
    avg_order_value: 420,
    ltv: 22500,
    last_order: '2024-09-28',
    avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=3b82f6&color=fff',
    spending_trend: [
      { month: 'Jan', amount: 2800 },
      { month: 'Feb', amount: 3200 },
      { month: 'Mar', amount: 2900 },
      { month: 'Apr', amount: 3500 },
      { month: 'May', amount: 3100 },
      { month: 'Jun', amount: 3400 }
    ],
    recent_orders: [
      { id: 'ORD-1234', date: '2024-09-28', items: 3, total: 599.98, status: 'completed' },
      { id: 'ORD-1189', date: '2024-09-15', items: 2, total: 399.99, status: 'completed' },
      { id: 'ORD-1145', date: '2024-09-01', items: 1, total: 299.99, status: 'completed' },
      { id: 'ORD-1098', date: '2024-08-20', items: 4, total: 799.96, status: 'completed' }
    ],
    favorite_categories: [
      { name: 'Electronics', orders: 25, spent: 12500 },
      { name: 'Accessories', orders: 15, spent: 4500 },
      { name: 'Home & Garden', orders: 5, spent: 1900 }
    ]
  },
  '2': {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 234-5678',
    location: 'Los Angeles, USA',
    joined: '2023-03-20',
    segment: 'Regular',
    rfm: 'Loyal Customers',
    total_orders: 32,
    total_spent: 12800,
    avg_order_value: 400,
    ltv: 15600,
    last_order: '2024-10-01',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=10b981&color=fff',
    spending_trend: [
      { month: 'Jan', amount: 1800 },
      { month: 'Feb', amount: 2100 },
      { month: 'Mar', amount: 1900 },
      { month: 'Apr', amount: 2400 },
      { month: 'May', amount: 2200 },
      { month: 'Jun', amount: 2400 }
    ],
    recent_orders: [
      { id: 'ORD-1235', date: '2024-10-01', items: 2, total: 499.98, status: 'processing' },
      { id: 'ORD-1190', date: '2024-09-18', items: 1, total: 299.99, status: 'completed' }
    ],
    favorite_categories: [
      { name: 'Fashion', orders: 18, spent: 7200 },
      { name: 'Beauty', orders: 10, spent: 4000 },
      { name: 'Electronics', orders: 4, spent: 1600 }
    ]
  }
}

export default function CustomerProfile() {
  const { toast } = useToast()
  const { id } = useParams()
  const navigate = useNavigate()
  const customer = mockCustomers[id] || mockCustomers['1']

  const getRFMBadge = (rfm) => {
    const variants = {
      'Champions': 'default',
      'Loyal Customers': 'default',
      'Potential Loyalist': 'secondary',
      'At Risk': 'destructive',
      'Lost': 'destructive'
    }
    return <Badge variant={variants[rfm] || 'secondary'}>{rfm}</Badge>
  }

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
          <div className="flex items-center gap-4">
            <img 
              src={customer.avatar} 
              alt={customer.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h1 className="text-3xl font-bold">{customer.name}</h1>
              <p className="text-muted-foreground">{customer.email}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => toast({ title: 'Sent', description: 'Data sent successfully' })}>
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast({ title: 'Updated', description: 'Data updated successfully' })}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${customer.total_spent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              LTV: ${customer.ltv.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.total_orders}</div>
            <p className="text-xs text-muted-foreground">
              Last: {customer.last_order}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${customer.avg_order_value}</div>
            <p className="text-xs text-muted-foreground">
              Per transaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Segment</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.segment}</div>
            <p className="text-xs text-muted-foreground">
              {getRFMBadge(customer.rfm)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">{customer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{customer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="text-sm font-medium">{customer.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Customer Since</p>
                      <p className="text-sm font-medium">{customer.joined}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3">Favorite Categories</h4>
                  <div className="space-y-2">
                    {customer.favorite_categories.map((cat, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{cat.name}</p>
                          <p className="text-xs text-muted-foreground">{cat.orders} orders</p>
                        </div>
                        <p className="text-sm font-medium">${cat.spent.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Spending Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Spending Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={customer.spending_trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="amount" stroke="#3b82f6" name="Spending ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Order History Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customer.recent_orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/orders/${order.id}`)}>
                    <div className="space-y-1">
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                      <p className="text-xs text-muted-foreground">{order.items} items</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-medium">${order.total}</p>
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

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={customer.favorite_categories}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="spent" fill="#3b82f6" name="Amount Spent ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
