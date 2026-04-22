import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import {
  Search,
  CreditCard,
  Eye,
  RefreshCw,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  ArrowUpDown,
  CheckSquare,
  MoreHorizontal,
  RotateCcw,
  Calendar,
  TrendingUp,
  Wallet
} from 'lucide-react'
import { apiService } from '../services/apiService'

function PaymentDetailsDialog({ payment, isOpen, onClose }) {
  if (!payment) return null

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
      authorized: 'bg-blue-100 text-blue-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
          <DialogDescription>
            Payment #{payment.id} - {payment.method}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Order Number</p>
                  <p className="text-sm text-muted-foreground">{payment.order_number}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Amount</p>
                  <p className="text-sm font-semibold text-green-600">${payment.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Payment Method</p>
                  <p className="text-sm text-muted-foreground">{payment.method}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge className={getStatusColor(payment.status)}>
                    {payment.status.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Transaction ID</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {payment.transaction_id || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Gateway</p>
                  <p className="text-sm text-muted-foreground">{payment.gateway}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Customer</p>
                  <p className="text-sm text-muted-foreground">{payment.customer_email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Payment Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(payment.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payment.timeline.map((event, index) => (
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
                      {index < payment.timeline.length - 1 && (
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

          {/* Gateway Response */}
          {payment.gateway_response && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Gateway Response</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-48">
                  {JSON.stringify(payment.gateway_response, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedPayments, setSelectedPayments] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Mock data for payments
  const mockPayments = [
    {
      id: 1,
      order_number: 'ORD-2024-001',
      customer_email: 'john@example.com',
      amount: 333.98,
      method: 'Credit Card',
      gateway: 'Stripe',
      status: 'completed',
      transaction_id: 'TXN-STR-123456',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:31:00Z',
      gateway_response: { status: 'success', code: '200' },
      timeline: [
        { type: 'success', title: 'Payment Completed', description: 'Payment processed successfully', timestamp: '2024-01-15T10:31:00Z' },
        { type: 'info', title: 'Payment Authorized', description: 'Card authorized', timestamp: '2024-01-15T10:30:30Z' },
        { type: 'info', title: 'Payment Initiated', description: 'Customer initiated payment', timestamp: '2024-01-15T10:30:00Z' }
      ]
    },
    {
      id: 2,
      order_number: 'ORD-2024-002',
      customer_email: 'jane@example.com',
      amount: 166.42,
      method: 'PayPal',
      gateway: 'PayPal',
      status: 'completed',
      transaction_id: 'TXN-PP-789012',
      created_at: '2024-01-17T09:15:00Z',
      updated_at: '2024-01-17T09:16:00Z',
      gateway_response: { status: 'success', code: '200' },
      timeline: [
        { type: 'success', title: 'Payment Completed', description: 'PayPal payment confirmed', timestamp: '2024-01-17T09:16:00Z' },
        { type: 'info', title: 'Payment Initiated', description: 'Redirected to PayPal', timestamp: '2024-01-17T09:15:00Z' }
      ]
    },
    {
      id: 3,
      order_number: 'ORD-2024-003',
      customer_email: 'bob@example.com',
      amount: 59.39,
      method: 'Bank Transfer',
      gateway: 'Manual',
      status: 'pending',
      transaction_id: null,
      created_at: '2024-01-18T11:00:00Z',
      updated_at: '2024-01-18T11:00:00Z',
      gateway_response: null,
      timeline: [
        { type: 'warning', title: 'Awaiting Payment', description: 'Waiting for bank transfer confirmation', timestamp: '2024-01-18T11:00:00Z' }
      ]
    },
    {
      id: 4,
      order_number: 'ORD-2024-004',
      customer_email: 'alice@example.com',
      amount: 104.73,
      method: 'Credit Card',
      gateway: 'Stripe',
      status: 'completed',
      transaction_id: 'TXN-STR-345678',
      created_at: '2024-01-16T14:30:00Z',
      updated_at: '2024-01-16T14:31:00Z',
      gateway_response: { status: 'success', code: '200' },
      timeline: [
        { type: 'success', title: 'Payment Completed', description: 'Payment processed successfully', timestamp: '2024-01-16T14:31:00Z' },
        { type: 'info', title: 'Payment Initiated', description: 'Customer initiated payment', timestamp: '2024-01-16T14:30:00Z' }
      ]
    },
    {
      id: 5,
      order_number: 'ORD-2024-005',
      customer_email: 'charlie@example.com',
      amount: 59.35,
      method: 'Credit Card',
      gateway: 'Stripe',
      status: 'failed',
      transaction_id: 'TXN-STR-901234',
      created_at: '2024-01-14T08:00:00Z',
      updated_at: '2024-01-14T08:01:00Z',
      gateway_response: { status: 'error', code: '402', message: 'Insufficient funds' },
      timeline: [
        { type: 'error', title: 'Payment Failed', description: 'Insufficient funds', timestamp: '2024-01-14T08:01:00Z' },
        { type: 'info', title: 'Payment Initiated', description: 'Customer initiated payment', timestamp: '2024-01-14T08:00:00Z' }
      ]
    },
    {
      id: 6,
      order_number: 'ORD-2024-006',
      customer_email: 'david@example.com',
      amount: 299.99,
      method: 'Credit Card',
      gateway: 'Stripe',
      status: 'refunded',
      transaction_id: 'TXN-STR-567890',
      created_at: '2024-01-13T10:00:00Z',
      updated_at: '2024-01-14T15:00:00Z',
      gateway_response: { status: 'refunded', code: '200' },
      timeline: [
        { type: 'info', title: 'Payment Refunded', description: 'Full refund processed', timestamp: '2024-01-14T15:00:00Z' },
        { type: 'success', title: 'Payment Completed', description: 'Payment processed successfully', timestamp: '2024-01-13T10:01:00Z' },
        { type: 'info', title: 'Payment Initiated', description: 'Customer initiated payment', timestamp: '2024-01-13T10:00:00Z' }
      ]
    },
    {
      id: 7,
      order_number: 'ORD-2024-007',
      customer_email: 'emma@example.com',
      amount: 450.00,
      method: 'Credit Card',
      gateway: 'Stripe',
      status: 'authorized',
      transaction_id: 'TXN-STR-112233',
      created_at: '2024-01-18T14:00:00Z',
      updated_at: '2024-01-18T14:00:30Z',
      gateway_response: { status: 'authorized', code: '200' },
      timeline: [
        { type: 'info', title: 'Payment Authorized', description: 'Funds authorized, awaiting capture', timestamp: '2024-01-18T14:00:30Z' },
        { type: 'info', title: 'Payment Initiated', description: 'Customer initiated payment', timestamp: '2024-01-18T14:00:00Z' }
      ]
    }
  ]

  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments', { search: searchTerm, status: statusFilter, method: methodFilter, sort: sortBy, order: sortOrder }],
    queryFn: () => {
      let filtered = mockPayments
      
      // Search filter
      if (searchTerm) {
        filtered = filtered.filter(payment => 
          payment.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      // Status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(payment => payment.status === statusFilter)
      }

      // Method filter
      if (methodFilter !== 'all') {
        filtered = filtered.filter(payment => payment.method === methodFilter)
      }

      // Sort
      filtered.sort((a, b) => {
        let aVal, bVal
        switch (sortBy) {
          case 'date':
            aVal = new Date(a.created_at)
            bVal = new Date(b.created_at)
            break
          case 'amount':
            aVal = a.amount
            bVal = b.amount
            break
          default:
            return 0
        }
        return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1)
      })
      
      return Promise.resolve({ items: filtered, total: filtered.length })
    }
  })

  const refundMutation = useMutation({
    mutationFn: ({ id, amount }) => {
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['payments'])
      toast({ title: 'Payment refunded successfully' })
    }
  })

  const captureMutation = useMutation({
    mutationFn: (id) => {
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['payments'])
      toast({ title: 'Payment captured successfully' })
    }
  })

  const retryMutation = useMutation({
    mutationFn: (id) => {
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['payments'])
      toast({ title: 'Payment retry initiated' })
    }
  })

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment)
    setIsDetailsOpen(true)
  }

  const handleRefund = (payment) => {
    if (confirm(`Refund $${payment.amount.toFixed(2)} for ${payment.order_number}?`)) {
      refundMutation.mutate({ id: payment.id, amount: payment.amount })
    }
  }

  const handleCapture = (payment) => {
    if (confirm(`Capture authorized payment of $${payment.amount.toFixed(2)}?`)) {
      captureMutation.mutate(payment.id)
    }
  }

  const handleRetry = (payment) => {
    if (confirm(`Retry failed payment for ${payment.order_number}?`)) {
      retryMutation.mutate(payment.id)
    }
  }

  const handleSelectPayment = (paymentId, checked) => {
    if (checked) {
      setSelectedPayments(prev => [...prev, paymentId])
    } else {
      setSelectedPayments(prev => prev.filter(id => id !== paymentId))
    }
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPayments(payments?.items?.map(p => p.id) || [])
    } else {
      setSelectedPayments([])
    }
  }

  const handleBulkExport = () => {
    toast({ title: `Exporting ${selectedPayments.length} payments to CSV...` })
    setSelectedPayments([])
  }

  const handleExportAll = () => {
    toast({ title: 'Exporting all payments to CSV...' })
  }

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
      authorized: 'bg-blue-100 text-blue-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getMethodIcon = (method) => {
    if (method.includes('Card')) return <CreditCard className="h-4 w-4" />
    if (method === 'PayPal') return <Wallet className="h-4 w-4" />
    return <DollarSign className="h-4 w-4" />
  }

  const totalPayments = payments?.total || 0
  const completedPayments = payments?.items?.filter(p => p.status === 'completed').length || 0
  const pendingPayments = payments?.items?.filter(p => p.status === 'pending').length || 0
  const failedPayments = payments?.items?.filter(p => p.status === 'failed').length || 0
  const totalRevenue = payments?.items?.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0) || 0
  const refundedAmount = payments?.items?.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0) || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">
            Manage payment transactions and refunds
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportAll}>
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPayments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPayments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedPayments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refunded</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${refundedAmount.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions Bar */}
      {selectedPayments.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{selectedPayments.length} payments selected</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleBulkExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedPayments([])}>
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
                  placeholder="Search by order, customer, transaction ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="authorized">Authorized</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="PayPal">PayPal</SelectItem>
                <SelectItem value="Wise">Wise</SelectItem>
                <SelectItem value="Payoneer">Payoneer</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
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
                  Payment Date {sortBy === 'date' && `(${sortOrder})`}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('amount')}>
                  Amount {sortBy === 'amount' && `(${sortOrder})`}
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

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions ({totalPayments})</CardTitle>
          <CardDescription>
            View and manage all payment transactions
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
                      checked={selectedPayments.length === payments?.items?.length && payments?.items?.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Gateway</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments?.items?.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedPayments.includes(payment.id)}
                        onCheckedChange={(checked) => handleSelectPayment(payment.id, checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{payment.order_number}</div>
                      {payment.transaction_id && (
                        <div className="text-xs text-muted-foreground font-mono">
                          {payment.transaction_id}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{payment.customer_email}</div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">${payment.amount.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getMethodIcon(payment.method)}
                        <span className="text-sm">{payment.method}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{payment.gateway}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(payment.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
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
                          <DropdownMenuItem onClick={() => handleViewDetails(payment)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {payment.status === 'authorized' && (
                            <DropdownMenuItem onClick={() => handleCapture(payment)}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Capture Payment
                            </DropdownMenuItem>
                          )}
                          {payment.status === 'completed' && (
                            <DropdownMenuItem onClick={() => handleRefund(payment)}>
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Refund Payment
                            </DropdownMenuItem>
                          )}
                          {payment.status === 'failed' && (
                            <DropdownMenuItem onClick={() => handleRetry(payment)}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Retry Payment
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download Receipt
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

      {/* Payment Details Dialog */}
      {selectedPayment && (
        <PaymentDetailsDialog 
          payment={selectedPayment} 
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false)
            setSelectedPayment(null)
          }} 
        />
      )}
    </div>
  )
}
