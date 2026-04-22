import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import {
  Search,
  ShoppingBag,
  Eye,
  Package,
  User,
  DollarSign,
  Calendar,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpDown,
  CheckSquare,
  MoreHorizontal,
  Printer,
  Download,
  Edit,
  Ban,
  TrendingUp,
  CreditCard,
  MapPin
} from 'lucide-react'
import { apiService } from '../services/apiService'

function TaxInvoiceDialog({ order, isOpen, onClose }) {
  const [customerName, setCustomerName] = useState('')
  const [customerTaxId, setCustomerTaxId] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0])
  const [invoiceNumber, setInvoiceNumber] = useState(`TIV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`)
  const [notes, setNotes] = useState('')
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

  if (!order) return null

  const handlePrint = () => {
    toast({ title: 'Generating tax invoice...', description: 'Your tax invoice is being prepared' })
    // TODO: Implement actual tax invoice generation
    onClose()
  }

  const handleDownloadPDF = () => {
    toast({ title: 'Downloading PDF...', description: 'Your tax invoice PDF is being generated' })
    // TODO: Implement PDF download
  }

  const handleSendEmail = () => {
    toast({ title: 'Sending email...', description: `Tax invoice will be sent to ${customerEmail}` })
    // TODO: Implement email sending
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Print Tax Invoice</DialogTitle>
          <DialogDescription>
            Enter customer tax information for order {order.order_number}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="customer-name">Customer Name / Company Name *</Label>
            <Input
              id="customer-name"
              placeholder="Customer Company Ltd."
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-tax-id">Tax ID / Taxpayer Number *</Label>
            <Input
              id="customer-tax-id"
              placeholder="0-1234-56789-01-2"
              value={customerTaxId}
              onChange={(e) => setCustomerTaxId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-address">Address *</Label>
            <Input
              id="customer-address"
              placeholder="123 Sukhumvit Rd, Khlong Toei Subdistrict, Khlong Toei District, Bangkok 10110"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer-phone">Phone</Label>
              <Input
                id="customer-phone"
                placeholder="+66 2 123 4567"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-email">Email</Label>
              <Input
                id="customer-email"
                type="email"
                placeholder="customer@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoice-date">Invoice Date</Label>
              <Input
                id="invoice-date"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoice-number">Tax Invoice Number</Label>
              <Input
                id="invoice-number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Input
              id="notes"
              placeholder="Special instructions or notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Separator />

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h4 className="font-semibold">Order Summary</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Order Number:</span>
                <span className="font-medium">{order.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (VAT 7%):</span>
                <span>${order.tax?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>${order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" variant="outline" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          {customerEmail && (
            <Button size="sm" variant="outline" onClick={handleSendEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          )}
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handlePrint} disabled={!customerName || !customerTaxId || !customerAddress}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function OrderDetailsDialog({ order, isOpen, onClose }) {
  if (!order) return null

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details - #{order.order_number}</DialogTitle>
          <DialogDescription>
            Order placed on {new Date(order.created_at).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Order Status & Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Badge className={getStatusColor(order.status)}>
                {order.status.toUpperCase()}
              </Badge>
              <Badge className={getPaymentStatusColor(order.payment_status)}>
                Payment: {order.payment_status.toUpperCase()}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toast({ title: 'Download Started', description: 'Downloading file...' })}>
                <Printer className="h-4 w-4 mr-2" />
                Print Invoice
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast({ title: 'Download Started', description: 'Downloading file...' })}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">{order.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {order.shipping_address.address}<br />
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}<br />
                  {order.shipping_address.country}
                </p>
                {order.tracking_number && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm font-medium">Tracking Number</p>
                    <p className="text-sm text-blue-600">{order.tracking_number}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="font-medium">{item.product_name}</div>
                        <div className="text-sm text-muted-foreground">SKU: {item.sku}</div>
                      </TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Order Summary */}
              <div className="mt-4 space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>${order.shipping_cost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.timeline.map((event, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        event.type === 'success' ? 'bg-green-100 text-green-600' :
                        event.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                        event.type === 'error' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {event.type === 'success' ? <CheckCircle className="h-4 w-4" /> :
                         event.type === 'error' ? <XCircle className="h-4 w-4" /> :
                         <Clock className="h-4 w-4" />}
                      </div>
                      {index < order.timeline.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isTaxInvoiceOpen, setIsTaxInvoiceOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedOrders, setSelectedOrders] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Mock data for orders
  const mockOrders = [
    {
      id: 1,
      order_number: 'ORD-2024-001',
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 234-567-8900'
      },
      items: [
        { product_name: 'Wireless Headphones', sku: 'WH-001', price: 99.99, quantity: 1 },
        { product_name: 'Smart Watch', sku: 'SW-002', price: 199.99, quantity: 1 }
      ],
      subtotal: 299.98,
      shipping_cost: 10.00,
      tax: 24.00,
      discount: 0,
      total: 333.98,
      status: 'delivered',
      payment_status: 'paid',
      payment_method: 'Credit Card',
      shipping_address: {
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'USA'
      },
      tracking_number: 'TRK123456789',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-18T14:20:00Z',
      timeline: [
        { type: 'success', title: 'Order Delivered', description: 'Package delivered successfully', timestamp: '2024-01-18T14:20:00Z' },
        { type: 'info', title: 'Out for Delivery', description: 'Package is out for delivery', timestamp: '2024-01-18T08:00:00Z' },
        { type: 'info', title: 'Order Shipped', description: 'Order has been shipped', timestamp: '2024-01-16T10:00:00Z' },
        { type: 'info', title: 'Order Confirmed', description: 'Payment confirmed', timestamp: '2024-01-15T10:30:00Z' }
      ]
    },
    {
      id: 2,
      order_number: 'ORD-2024-002',
      customer: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1 234-567-8901'
      },
      items: [
        { product_name: 'Bluetooth Speaker', sku: 'BS-003', price: 79.99, quantity: 2 }
      ],
      subtotal: 159.98,
      shipping_cost: 8.00,
      tax: 13.44,
      discount: 15.00,
      total: 166.42,
      status: 'processing',
      payment_status: 'paid',
      payment_method: 'PayPal',
      shipping_address: {
        address: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        postal_code: '90001',
        country: 'USA'
      },
      tracking_number: null,
      created_at: '2024-01-17T09:15:00Z',
      updated_at: '2024-01-17T09:15:00Z',
      timeline: [
        { type: 'info', title: 'Order Processing', description: 'Order is being prepared', timestamp: '2024-01-17T09:20:00Z' },
        { type: 'success', title: 'Payment Received', description: 'Payment confirmed via PayPal', timestamp: '2024-01-17T09:15:00Z' }
      ]
    },
    {
      id: 3,
      order_number: 'ORD-2024-003',
      customer: {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '+1 234-567-8902'
      },
      items: [
        { product_name: 'Laptop Stand', sku: 'LS-004', price: 49.99, quantity: 1 }
      ],
      subtotal: 49.99,
      shipping_cost: 5.00,
      tax: 4.40,
      discount: 0,
      total: 59.39,
      status: 'pending',
      payment_status: 'pending',
      payment_method: 'Bank Transfer',
      shipping_address: {
        address: '789 Pine Rd',
        city: 'Chicago',
        state: 'IL',
        postal_code: '60601',
        country: 'USA'
      },
      tracking_number: null,
      created_at: '2024-01-18T11:00:00Z',
      updated_at: '2024-01-18T11:00:00Z',
      timeline: [
        { type: 'warning', title: 'Awaiting Payment', description: 'Waiting for payment confirmation', timestamp: '2024-01-18T11:00:00Z' }
      ]
    },
    {
      id: 4,
      order_number: 'ORD-2024-004',
      customer: {
        name: 'Alice Wilson',
        email: 'alice@example.com',
        phone: '+1 234-567-8903'
      },
      items: [
        { product_name: 'Wireless Mouse', sku: 'WM-005', price: 29.99, quantity: 3 }
      ],
      subtotal: 89.97,
      shipping_cost: 7.00,
      tax: 7.76,
      discount: 0,
      total: 104.73,
      status: 'shipped',
      payment_status: 'paid',
      payment_method: 'Credit Card',
      shipping_address: {
        address: '321 Elm St',
        city: 'Houston',
        state: 'TX',
        postal_code: '77001',
        country: 'USA'
      },
      tracking_number: 'TRK987654321',
      created_at: '2024-01-16T14:30:00Z',
      updated_at: '2024-01-17T10:00:00Z',
      timeline: [
        { type: 'info', title: 'Order Shipped', description: 'Package handed to carrier', timestamp: '2024-01-17T10:00:00Z' },
        { type: 'info', title: 'Order Confirmed', description: 'Payment confirmed', timestamp: '2024-01-16T14:30:00Z' }
      ]
    },
    {
      id: 5,
      order_number: 'ORD-2024-005',
      customer: {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        phone: '+1 234-567-8904'
      },
      items: [
        { product_name: 'USB Cable', sku: 'UC-006', price: 9.99, quantity: 5 }
      ],
      subtotal: 49.95,
      shipping_cost: 5.00,
      tax: 4.40,
      discount: 0,
      total: 59.35,
      status: 'cancelled',
      payment_status: 'refunded',
      payment_method: 'Credit Card',
      shipping_address: {
        address: '654 Maple Dr',
        city: 'Phoenix',
        state: 'AZ',
        postal_code: '85001',
        country: 'USA'
      },
      tracking_number: null,
      created_at: '2024-01-14T08:00:00Z',
      updated_at: '2024-01-15T12:00:00Z',
      timeline: [
        { type: 'error', title: 'Order Cancelled', description: 'Cancelled by customer', timestamp: '2024-01-15T12:00:00Z' },
        { type: 'info', title: 'Order Confirmed', description: 'Payment confirmed', timestamp: '2024-01-14T08:00:00Z' }
      ]
    }
  ]

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', { search: searchTerm, status: statusFilter, payment: paymentFilter, sort: sortBy, order: sortOrder }],
    queryFn: () => {
      let filtered = mockOrders
      
      // Search filter
      if (searchTerm) {
        filtered = filtered.filter(order => 
          order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      // Status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(order => order.status === statusFilter)
      }

      // Payment filter
      if (paymentFilter !== 'all') {
        filtered = filtered.filter(order => order.payment_status === paymentFilter)
      }

      // Sort
      filtered.sort((a, b) => {
        let aVal, bVal
        switch (sortBy) {
          case 'date':
            aVal = new Date(a.created_at)
            bVal = new Date(b.created_at)
            break
          case 'total':
            aVal = a.total
            bVal = b.total
            break
          case 'customer':
            aVal = a.customer.name
            bVal = b.customer.name
            break
          default:
            return 0
        }
        if (typeof aVal === 'string') {
          return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        }
        return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1)
      })
      
      return Promise.resolve({ items: filtered, total: filtered.length })
    }
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => {
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['orders'])
      toast({ title: 'Order status updated successfully' })
    }
  })

  const cancelOrderMutation = useMutation({
    mutationFn: (id) => {
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['orders'])
      toast({ title: 'Order cancelled successfully' })
    }
  })

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }

  const handleUpdateStatus = (order, newStatus) => {
    if (confirm(`Update order ${order.order_number} to ${newStatus}?`)) {
      updateStatusMutation.mutate({ id: order.id, status: newStatus })
    }
  }

  const handleCancelOrder = (order) => {
    if (confirm(`Cancel order ${order.order_number}?`)) {
      cancelOrderMutation.mutate(order.id)
    }
  }

  const handleSelectOrder = (orderId, checked) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, orderId])
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId))
    }
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(orders?.items?.map(o => o.id) || [])
    } else {
      setSelectedOrders([])
    }
  }

  const handleBulkExport = () => {
    toast({ title: `Exporting ${selectedOrders.length} orders to CSV...` })
    setSelectedOrders([])
  }

  const handleBulkPrint = () => {
    toast({ title: `Printing ${selectedOrders.length} invoices...` })
    setSelectedOrders([])
  }

  const handleBulkUpdateStatus = (status) => {
    toast({ title: `Updating ${selectedOrders.length} orders to ${status}...` })
    setSelectedOrders([])
  }

  const handlePrintInvoice = (order) => {
    toast({ title: `Printing invoice for ${order.order_number}...` })
    // TODO: Implement invoice printing
  }

  const handlePrintTaxInvoice = (order) => {
    setSelectedOrder(order)
    setIsTaxInvoiceOpen(true)
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const totalOrders = orders?.total || 0
  const pendingOrders = orders?.items?.filter(o => o.status === 'pending').length || 0
  const processingOrders = orders?.items?.filter(o => o.status === 'processing').length || 0
  const completedOrders = orders?.items?.filter(o => o.status === 'delivered').length || 0
  const totalRevenue = orders?.items?.reduce((sum, o) => sum + o.total, 0) || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">
            Manage customer orders and fulfillment
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions Bar */}
      {selectedOrders.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{selectedOrders.length} orders selected</span>
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => toast({ title: 'Updated', description: 'Data updated successfully' })}>
                      Update Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleBulkUpdateStatus('processing')}>
                      Mark as Processing
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkUpdateStatus('shipped')}>
                      Mark as Shipped
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkUpdateStatus('delivered')}>
                      Mark as Delivered
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="sm" onClick={handleBulkPrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedOrders([])}>
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by order number, customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy('date')}>
                  Order Date {sortBy === 'date' && `(${sortOrder})`}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('total')}>
                  Total Amount {sortBy === 'total' && `(${sortOrder})`}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('customer')}>
                  Customer Name {sortBy === 'customer' && `(${sortOrder})`}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                  {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({totalOrders})</CardTitle>
          <CardDescription>
            View and manage all customer orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox 
                      checked={selectedOrders.length === orders?.items?.length && orders?.items?.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.items?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={(checked) => handleSelectOrder(order.id, checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{order.order_number}</div>
                      {order.tracking_number && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          {order.tracking_number}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{order.customer.name}</div>
                          <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>{order.items.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">${order.total.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentStatusColor(order.payment_status)}>
                        {order.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => toast({ title: 'View Details', description: 'Loading details...' })}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Order
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePrintInvoice(order)}>
                            <Printer className="h-4 w-4 mr-2" />
                            Print Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePrintTaxInvoice(order)}>
                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Print Tax Invoice
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order, 'processing')}>
                            Mark as Processing
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order, 'shipped')}>
                            Mark as Shipped
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order, 'delivered')}>
                            Mark as Delivered
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleCancelOrder(order)}
                            className="text-red-600"
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <OrderDetailsDialog 
          order={selectedOrder} 
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false)
            setSelectedOrder(null)
          }} 
        />
      )}

      {/* Tax Invoice Dialog */}
      {selectedOrder && (
        <TaxInvoiceDialog
          order={selectedOrder}
          isOpen={isTaxInvoiceOpen}
          onClose={() => {
            setIsTaxInvoiceOpen(false)
            setSelectedOrder(null)
          }}
        />
      )}
    </div>
  )
}
