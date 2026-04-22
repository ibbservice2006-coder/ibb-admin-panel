import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft, Package, DollarSign, User, MapPin, Calendar,
  CreditCard, Truck, Edit, Printer
} from 'lucide-react'

// Mock order data
const mockOrders = {
  'ORD-1234': {
    id: 'ORD-1234',
    order_number: 'ORD-1234',
    date: '2024-10-01 14:30:00',
    status: 'completed',
    payment_status: 'paid',
    customer: {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567'
    },
    shipping_address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    },
    billing_address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    },
    items: [
      {
        id: '1',
        name: 'Wireless Bluetooth Headphones',
        sku: 'WBH-001',
        quantity: 2,
        price: 299.99,
        total: 599.98
      },
      {
        id: '2',
        name: 'USB-C Cable 2m',
        sku: 'UC-002',
        quantity: 1,
        price: 19.99,
        total: 19.99
      }
    ],
    subtotal: 619.97,
    tax: 49.60,
    shipping: 15.00,
    discount: 0,
    total: 684.57,
    payment_method: 'Credit Card',
    shipping_method: 'Standard Shipping',
    tracking_number: 'TRK123456789',
    notes: 'Please deliver before 5 PM'
  },
  'ORD-1235': {
    id: 'ORD-1235',
    order_number: 'ORD-1235',
    date: '2024-10-02 10:15:00',
    status: 'processing',
    payment_status: 'paid',
    customer: {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 234-5678'
    },
    shipping_address: {
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      country: 'USA'
    },
    billing_address: {
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      country: 'USA'
    },
    items: [
      {
        id: '2',
        name: 'Smart Watch Series 5',
        sku: 'SW-005',
        quantity: 1,
        price: 599.99,
        total: 599.99
      }
    ],
    subtotal: 599.99,
    tax: 48.00,
    shipping: 10.00,
    discount: 50.00,
    total: 607.99,
    payment_method: 'PayPal',
    shipping_method: 'Express Shipping',
    tracking_number: null,
    notes: null
  }
}

export default function OrderDetail() {
  const { toast } = useToast()
  const { id } = useParams()
  const navigate = useNavigate()
  const order = mockOrders[id] || mockOrders['ORD-1234']

  const getStatusBadge = (status) => {
    const variants = {
      'completed': 'default',
      'processing': 'secondary',
      'shipped': 'default',
      'cancelled': 'destructive',
      'pending': 'secondary'
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getPaymentStatusBadge = (status) => {
    const variants = {
      'paid': 'default',
      'pending': 'secondary',
      'failed': 'destructive',
      'refunded': 'secondary'
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
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
          <div>
            <h1 className="text-3xl font-bold">Order {order.order_number}</h1>
            <p className="text-muted-foreground">{order.date}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => toast({ title: 'Updated', description: 'Data updated successfully' })}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast({ title: 'Updated', description: 'Data updated successfully' })}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Order Status</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {getStatusBadge(order.status)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {getPaymentStatusBadge(order.payment_status)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${order.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{order.items.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
              onClick={() => navigate(`/customers/${order.customer.id}`)}>
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{order.customer.name}</p>
                <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Information */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="font-medium">Shipping Address</p>
                <p className="text-sm text-muted-foreground">{order.shipping_address.street}</p>
                <p className="text-sm text-muted-foreground">
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
                </p>
                <p className="text-sm text-muted-foreground">{order.shipping_address.country}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="font-medium">Shipping Method</p>
                <p className="text-sm text-muted-foreground">{order.shipping_method}</p>
                {order.tracking_number && (
                  <p className="text-sm text-muted-foreground">Tracking: {order.tracking_number}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-left py-3 px-4">SKU</th>
                  <th className="text-right py-3 px-4">Price</th>
                  <th className="text-right py-3 px-4">Quantity</th>
                  <th className="text-right py-3 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/products/${item.id}`)}>
                    <td className="py-3 px-4">
                      <p className="font-medium">{item.name}</p>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{item.sku}</td>
                    <td className="py-3 px-4 text-right">${item.price}</td>
                    <td className="py-3 px-4 text-right">{item.quantity}</td>
                    <td className="py-3 px-4 text-right font-medium">${item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${order.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${order.tax}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${order.shipping}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-${order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${order.total}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment & Additional Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Payment Method</span>
              <span className="text-sm font-medium">{order.payment_method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Payment Status</span>
              {getPaymentStatusBadge(order.payment_status)}
            </div>
          </CardContent>
        </Card>

        {order.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Order Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
