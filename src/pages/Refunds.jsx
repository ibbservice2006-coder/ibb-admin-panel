import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import {
  Plus,
  Search,
  Edit,
  Eye,
  RotateCcw,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  CreditCard,
  Download,
  ArrowUpDown,
  CheckSquare,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  TrendingDown
} from 'lucide-react'
import { apiService } from '../services/apiService'

function RefundDetailsDialog({ refund, isOpen, onClose }) {
  if (!refund) return null

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getTypeColor = (type) => {
    return type === 'full' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Refund Details</DialogTitle>
          <DialogDescription>
            Refund ID: #{refund.id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Refund Info */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Refund Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Order Number</p>
                  <p className="text-sm text-muted-foreground">{refund.order_number}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Payment ID</p>
                  <p className="text-sm text-muted-foreground">#{refund.payment_id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Amount</p>
                  <p className="text-lg font-bold text-green-600">${refund.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <Badge className={getTypeColor(refund.type)}>
                    {refund.type === 'full' ? 'Full Refund' : 'Partial Refund'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge className={getStatusColor(refund.status)}>
                    {refund.status.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Refund Method</p>
                  <p className="text-sm text-muted-foreground">{refund.method}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer & Order Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Customer</p>
                  <p className="text-sm text-muted-foreground">{refund.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{refund.customer_email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Original Amount</p>
                  <p className="text-sm text-muted-foreground">${refund.original_amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Requested Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(refund.created_at).toLocaleString()}
                  </p>
                </div>
                {refund.processed_at && (
                  <div>
                    <p className="text-sm font-medium">Processed Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(refund.processed_at).toLocaleString()}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">Processing Time</p>
                  <p className="text-sm text-muted-foreground">{refund.processing_time}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reason & Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reason & Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium">Reason</p>
                <p className="text-sm text-muted-foreground">{refund.reason}</p>
              </div>
              {refund.notes && (
                <div>
                  <p className="text-sm font-medium">Admin Notes</p>
                  <p className="text-sm text-muted-foreground">{refund.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Refund Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {refund.timeline.map((event, index) => (
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
                         event.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                         <Clock className="h-4 w-4" />}
                      </div>
                      {index < refund.timeline.length - 1 && (
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

function RefundFormDialog({ refund, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    order_number: refund?.order_number || '',
    payment_id: refund?.payment_id || '',
    amount: refund?.amount || '',
    type: refund?.type || 'full',
    reason: refund?.reason || '',
    method: refund?.method || 'Original Payment Method',
    status: refund?.status || 'pending',
    notes: refund?.notes || ''
  })

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
  const queryClient = useQueryClient()

  const saveMutation = useMutation({
    mutationFn: (data) => Promise.resolve(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['refunds'])
      toast({ title: refund ? 'Refund updated' : 'Refund created' })
      onClose()
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    saveMutation.mutate(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{refund ? 'Edit Refund' : 'Create Refund'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Order Number *</Label>
              <Input
                value={formData.order_number}
                onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Payment ID *</Label>
              <Input
                type="number"
                value={formData.payment_id}
                onChange={(e) => setFormData({ ...formData, payment_id: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Amount *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Refund</SelectItem>
                  <SelectItem value="partial">Partial Refund</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Refund Method</Label>
              <Select value={formData.method} onValueChange={(v) => setFormData({ ...formData, method: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Original Payment Method">Original Payment Method</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Wise">Wise</SelectItem>
                  <SelectItem value="Payoneer">Payoneer</SelectItem>
                  <SelectItem value="Store Credit">Store Credit</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Reason *</Label>
            <Select value={formData.reason} onValueChange={(v) => setFormData({ ...formData, reason: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Customer Request">Customer Request</SelectItem>
                <SelectItem value="Product Defect">Product Defect</SelectItem>
                <SelectItem value="Wrong Item">Wrong Item</SelectItem>
                <SelectItem value="Damaged in Shipping">Damaged in Shipping</SelectItem>
                <SelectItem value="Not as Described">Not as Described</SelectItem>
                <SelectItem value="Order Cancelled">Order Cancelled</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Admin Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button size="sm" type="submit" className="bg-gray-700 hover:bg-gray-600 text-white">{refund ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function Refunds() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRefund, setSelectedRefund] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingRefund, setEditingRefund] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedRefunds, setSelectedRefunds] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Mock data
  const mockRefunds = [
    {
      id: 1,
      order_number: 'ORD-2024-001',
      payment_id: 1,
      customer_name: 'John Doe',
      customer_email: 'john@example.com',
      amount: 150.00,
      original_amount: 150.00,
      type: 'full',
      reason: 'Customer Request',
      method: 'Original Payment Method',
      status: 'completed',
      created_at: '2024-01-15T10:00:00Z',
      processed_at: '2024-01-16T14:30:00Z',
      processing_time: '1 day 4 hours',
      notes: 'Customer changed mind',
      timeline: [
        { type: 'success', title: 'Refund Completed', description: 'Refund processed successfully', timestamp: '2024-01-16T14:30:00Z' },
        { type: 'info', title: 'Refund Approved', description: 'Refund approved by admin', timestamp: '2024-01-16T10:00:00Z' },
        { type: 'info', title: 'Refund Requested', description: 'Customer requested refund', timestamp: '2024-01-15T10:00:00Z' }
      ]
    },
    {
      id: 2,
      order_number: 'ORD-2024-003',
      payment_id: 3,
      customer_name: 'Jane Smith',
      customer_email: 'jane@example.com',
      amount: 50.00,
      original_amount: 200.00,
      type: 'partial',
      reason: 'Product Defect',
      method: 'Original Payment Method',
      status: 'processing',
      created_at: '2024-01-17T09:00:00Z',
      processed_at: null,
      processing_time: '2 days',
      notes: 'One item defective, partial refund for that item',
      timeline: [
        { type: 'info', title: 'Processing Refund', description: 'Refund is being processed', timestamp: '2024-01-18T10:00:00Z' },
        { type: 'info', title: 'Refund Approved', description: 'Refund approved by admin', timestamp: '2024-01-17T15:00:00Z' },
        { type: 'info', title: 'Refund Requested', description: 'Customer reported defect', timestamp: '2024-01-17T09:00:00Z' }
      ]
    },
    {
      id: 3,
      order_number: 'ORD-2024-006',
      payment_id: 6,
      customer_name: 'Bob Johnson',
      customer_email: 'bob@example.com',
      amount: 300.00,
      original_amount: 300.00,
      type: 'full',
      reason: 'Wrong Item',
      method: 'Bank Transfer',
      status: 'pending',
      created_at: '2024-01-18T14:00:00Z',
      processed_at: null,
      processing_time: '1 day',
      notes: 'Awaiting admin review',
      timeline: [
        { type: 'warning', title: 'Pending Review', description: 'Awaiting admin approval', timestamp: '2024-01-18T14:00:00Z' },
        { type: 'info', title: 'Refund Requested', description: 'Wrong item received', timestamp: '2024-01-18T14:00:00Z' }
      ]
    },
    {
      id: 4,
      order_number: 'ORD-2024-010',
      payment_id: 10,
      customer_name: 'Alice Wilson',
      customer_email: 'alice@example.com',
      amount: 120.00,
      original_amount: 120.00,
      type: 'full',
      reason: 'Order Cancelled',
      method: 'Original Payment Method',
      status: 'approved',
      created_at: '2024-01-18T16:00:00Z',
      processed_at: null,
      processing_time: '6 hours',
      notes: 'Order cancelled before shipment',
      timeline: [
        { type: 'success', title: 'Refund Approved', description: 'Refund approved, processing soon', timestamp: '2024-01-18T20:00:00Z' },
        { type: 'info', title: 'Refund Requested', description: 'Order cancelled by customer', timestamp: '2024-01-18T16:00:00Z' }
      ]
    },
    {
      id: 5,
      order_number: 'ORD-2024-012',
      payment_id: 12,
      customer_name: 'Charlie Brown',
      customer_email: 'charlie@example.com',
      amount: 80.00,
      original_amount: 80.00,
      type: 'full',
      reason: 'Not as Described',
      method: 'Store Credit',
      status: 'rejected',
      created_at: '2024-01-17T11:00:00Z',
      processed_at: '2024-01-18T09:00:00Z',
      processing_time: '22 hours',
      notes: 'Product matches description, refund denied',
      timeline: [
        { type: 'error', title: 'Refund Rejected', description: 'Product matches description', timestamp: '2024-01-18T09:00:00Z' },
        { type: 'info', title: 'Under Review', description: 'Admin reviewing request', timestamp: '2024-01-17T15:00:00Z' },
        { type: 'info', title: 'Refund Requested', description: 'Customer claims mismatch', timestamp: '2024-01-17T11:00:00Z' }
      ]
    }
  ]

  const { data: refunds, isLoading } = useQuery({
    queryKey: ['refunds', { search: searchTerm, status: statusFilter, type: typeFilter, sort: sortBy, order: sortOrder }],
    queryFn: () => {
      let filtered = mockRefunds
      
      if (searchTerm) {
        filtered = filtered.filter(r => 
          r.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      if (statusFilter !== 'all') {
        filtered = filtered.filter(r => r.status === statusFilter)
      }

      if (typeFilter !== 'all') {
        filtered = filtered.filter(r => r.type === typeFilter)
      }

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
        if (typeof aVal === 'number') {
          return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
        }
        return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1)
      })
      
      return Promise.resolve({ items: filtered, total: filtered.length })
    }
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries(['refunds'])
      toast({ title: 'Refund status updated' })
    }
  })

  const handleViewDetails = (refund) => {
    setSelectedRefund(refund)
    setIsDetailsOpen(true)
  }

  const handleEdit = (refund) => {
    setEditingRefund(refund)
    setIsFormOpen(true)
  }

  const handleApprove = (refund) => {
    if (confirm(`Approve refund for ${refund.order_number}?`)) {
      updateStatusMutation.mutate({ id: refund.id, status: 'approved' })
    }
  }

  const handleReject = (refund) => {
    if (confirm(`Reject refund for ${refund.order_number}?`)) {
      updateStatusMutation.mutate({ id: refund.id, status: 'rejected' })
    }
  }

  const handleSelectRefund = (refundId, checked) => {
    if (checked) {
      setSelectedRefunds(prev => [...prev, refundId])
    } else {
      setSelectedRefunds(prev => prev.filter(id => id !== refundId))
    }
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRefunds(refunds?.items?.map(r => r.id) || [])
    } else {
      setSelectedRefunds([])
    }
  }

  const handleBulkExport = () => {
    toast({ title: `Exporting ${selectedRefunds.length} refunds to CSV...` })
    setSelectedRefunds([])
  }

  const handleBulkApprove = () => {
    toast({ title: `Approving ${selectedRefunds.length} refunds...` })
    setSelectedRefunds([])
  }

  const handleBulkReject = () => {
    toast({ title: `Rejecting ${selectedRefunds.length} refunds...` })
    setSelectedRefunds([])
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getTypeColor = (type) => {
    return type === 'full' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
  }

  const totalRefunds = refunds?.total || 0
  const pendingRefunds = refunds?.items?.filter(r => r.status === 'pending').length || 0
  const approvedRefunds = refunds?.items?.filter(r => r.status === 'approved').length || 0
  const completedRefunds = refunds?.items?.filter(r => r.status === 'completed').length || 0
  const rejectedRefunds = refunds?.items?.filter(r => r.status === 'rejected').length || 0
  const totalAmount = refunds?.items?.reduce((sum, r) => sum + r.amount, 0) || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Refunds</h1>
          <p className="text-muted-foreground">
            Manage refund requests and processing
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setEditingRefund(null); setIsFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Create Refund
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRefunds}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRefunds}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedRefunds}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedRefunds}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedRefunds}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions Bar */}
      {selectedRefunds.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{selectedRefunds.length} refunds selected</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleBulkApprove}>
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkReject}>
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedRefunds([])}>
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
                  placeholder="Search by order, customer..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full">Full Refund</SelectItem>
                <SelectItem value="partial">Partial Refund</SelectItem>
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
                  Date {sortBy === 'date' && `(${sortOrder})`}
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

      {/* Refunds Table */}
      <Card>
        <CardHeader>
          <CardTitle>Refunds ({totalRefunds})</CardTitle>
          <CardDescription>
            Review and process refund requests
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
                      checked={selectedRefunds.length === refunds?.items?.length && refunds?.items?.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {refunds?.items?.map((refund) => (
                  <TableRow key={refund.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedRefunds.includes(refund.id)}
                        onCheckedChange={(checked) => handleSelectRefund(refund.id, checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{refund.order_number}</div>
                      <div className="text-sm text-muted-foreground">#{refund.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{refund.customer_name}</div>
                      <div className="text-xs text-muted-foreground">{refund.customer_email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-green-600">${refund.amount.toFixed(2)}</div>
                      {refund.type === 'partial' && (
                        <div className="text-xs text-muted-foreground">of ${refund.original_amount.toFixed(2)}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(refund.type)}>
                        {refund.type === 'full' ? 'Full' : 'Partial'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{refund.reason}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs">{refund.method}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(refund.status)}>
                        {refund.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(refund.created_at).toLocaleDateString()}</div>
                      <div className="text-xs text-muted-foreground">{refund.processing_time}</div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => toast({ title: 'View Details', description: 'Loading details...' })}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(refund)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(refund)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Refund
                          </DropdownMenuItem>
                          {refund.status === 'pending' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleApprove(refund)}>
                                <ThumbsUp className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReject(refund)}>
                                <ThumbsDown className="h-4 w-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
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

      {/* Dialogs */}
      {selectedRefund && (
        <RefundDetailsDialog 
          refund={selectedRefund} 
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false)
            setSelectedRefund(null)
          }} 
        />
      )}

      <RefundFormDialog
        refund={editingRefund}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingRefund(null)
        }}
      />
    </div>
  )
}
