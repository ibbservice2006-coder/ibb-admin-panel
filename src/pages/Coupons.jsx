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
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Ticket,
  Percent,
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  Eye,
  MoreHorizontal,
  Download,
  ArrowUpDown,
  CheckSquare,
  AlertTriangle,
  Clock
} from 'lucide-react'
import { apiService } from '../services/apiService'

function CouponFormDialog({ coupon, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    code: coupon?.code || '',
    name: coupon?.name || '',
    description: coupon?.description || '',
    type: coupon?.type || 'percentage',
    value: coupon?.value || '',
    minimum_amount: coupon?.minimum_amount || '',
    maximum_discount: coupon?.maximum_discount || '',
    usage_limit: coupon?.usage_limit || '',
    usage_limit_per_customer: coupon?.usage_limit_per_customer || '1',
    valid_from: coupon?.valid_from || '',
    valid_until: coupon?.valid_until || '',
    is_active: coupon?.is_active ?? true,
    applies_to: coupon?.applies_to || 'all',
    customer_restrictions: coupon?.customer_restrictions || 'all'
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
      queryClient.invalidateQueries(['coupons'])
      toast({ title: coupon ? 'Coupon updated' : 'Coupon created' })
      onClose()
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    saveMutation.mutate(formData)
  }

  const generateCode = () => {
    const code = 'COUPON' + Math.random().toString(36).substr(2, 8).toUpperCase()
    setFormData({ ...formData, code })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{coupon ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Coupon Code *</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., SUMMER2024"
                  required
                />
                <Button size="sm" type="button" variant="outline" onClick={generateCode}>
                  Generate
                </Button>
              </div>
            </div>
            <div className="col-span-2">
              <Label>Coupon Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Summer Sale 2024"
                required
              />
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Internal description of this coupon"
                rows={2}
              />
            </div>
            <div>
              <Label>Discount Type *</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  <SelectItem value="free_shipping">Free Shipping</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.type !== 'free_shipping' && (
              <div>
                <Label>Discount Value *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder={formData.type === 'percentage' ? '10' : '50.00'}
                  required
                />
              </div>
            )}
            <div>
              <Label>Minimum Order Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.minimum_amount}
                onChange={(e) => setFormData({ ...formData, minimum_amount: e.target.value })}
                placeholder="0.00"
              />
            </div>
            {formData.type === 'percentage' && (
              <div>
                <Label>Maximum Discount Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.maximum_discount}
                  onChange={(e) => setFormData({ ...formData, maximum_discount: e.target.value })}
                  placeholder="No limit"
                />
              </div>
            )}
            <div>
              <Label>Total Usage Limit</Label>
              <Input
                type="number"
                value={formData.usage_limit}
                onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                placeholder="Unlimited"
              />
            </div>
            <div>
              <Label>Usage Limit Per Customer</Label>
              <Input
                type="number"
                value={formData.usage_limit_per_customer}
                onChange={(e) => setFormData({ ...formData, usage_limit_per_customer: e.target.value })}
                placeholder="1"
              />
            </div>
            <div>
              <Label>Valid From</Label>
              <Input
                type="datetime-local"
                value={formData.valid_from}
                onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
              />
            </div>
            <div>
              <Label>Valid Until</Label>
              <Input
                type="datetime-local"
                value={formData.valid_until}
                onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
              />
            </div>
            <div>
              <Label>Applies To</Label>
              <Select value={formData.applies_to} onValueChange={(v) => setFormData({ ...formData, applies_to: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="specific_products">Specific Products</SelectItem>
                  <SelectItem value="specific_categories">Specific Categories</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Customer Restrictions</Label>
              <Select value={formData.customer_restrictions} onValueChange={(v) => setFormData({ ...formData, customer_restrictions: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  <SelectItem value="new">New Customers Only</SelectItem>
                  <SelectItem value="existing">Existing Customers Only</SelectItem>
                  <SelectItem value="vip">VIP Customers Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label>Active (coupon can be used)</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button size="sm" type="submit" className="bg-gray-700 hover:bg-gray-600 text-white">{coupon ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function Coupons() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedCoupons, setSelectedCoupons] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Mock data
  const mockCoupons = [
    {
      id: 1,
      code: 'SUMMER2024',
      name: 'Summer Sale 2024',
      description: 'Summer promotion for all products',
      type: 'percentage',
      value: 20,
      minimum_amount: 100,
      maximum_discount: 50,
      usage_limit: 1000,
      usage_limit_per_customer: 1,
      used_count: 234,
      valid_from: '2024-06-01T00:00:00Z',
      valid_until: '2024-08-31T23:59:59Z',
      is_active: true,
      applies_to: 'all',
      customer_restrictions: 'all',
      created_at: '2024-05-15T10:00:00Z'
    },
    {
      id: 2,
      code: 'WELCOME10',
      name: 'Welcome Discount',
      description: 'Welcome discount for new customers',
      type: 'percentage',
      value: 10,
      minimum_amount: 50,
      maximum_discount: null,
      usage_limit: null,
      usage_limit_per_customer: 1,
      used_count: 567,
      valid_from: '2024-01-01T00:00:00Z',
      valid_until: null,
      is_active: true,
      applies_to: 'all',
      customer_restrictions: 'new',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 3,
      code: 'FREESHIP',
      name: 'Free Shipping',
      description: 'Free shipping on orders over $75',
      type: 'free_shipping',
      value: 0,
      minimum_amount: 75,
      maximum_discount: null,
      usage_limit: null,
      usage_limit_per_customer: null,
      used_count: 892,
      valid_from: '2024-01-01T00:00:00Z',
      valid_until: null,
      is_active: true,
      applies_to: 'all',
      customer_restrictions: 'all',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 4,
      code: 'VIP50',
      name: 'VIP Exclusive',
      description: 'Exclusive discount for VIP customers',
      type: 'fixed',
      value: 50,
      minimum_amount: 200,
      maximum_discount: null,
      usage_limit: 500,
      usage_limit_per_customer: 3,
      used_count: 123,
      valid_from: '2024-01-01T00:00:00Z',
      valid_until: '2024-12-31T23:59:59Z',
      is_active: true,
      applies_to: 'specific_categories',
      customer_restrictions: 'vip',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 5,
      code: 'EXPIRED2023',
      name: 'Holiday Sale 2023',
      description: 'Expired holiday promotion',
      type: 'percentage',
      value: 30,
      minimum_amount: 0,
      maximum_discount: 100,
      usage_limit: 2000,
      usage_limit_per_customer: 1,
      used_count: 1456,
      valid_from: '2023-12-01T00:00:00Z',
      valid_until: '2023-12-31T23:59:59Z',
      is_active: false,
      applies_to: 'all',
      customer_restrictions: 'all',
      created_at: '2023-11-15T00:00:00Z'
    }
  ]

  const { data: coupons, isLoading } = useQuery({
    queryKey: ['coupons', { search: searchTerm, status: statusFilter, type: typeFilter, sort: sortBy, order: sortOrder }],
    queryFn: () => {
      let filtered = mockCoupons.map(c => ({
        ...c,
        status: !c.is_active ? 'inactive' : 
                (c.valid_until && new Date(c.valid_until) < new Date()) ? 'expired' :
                (c.usage_limit && c.used_count >= c.usage_limit) ? 'used_up' : 'active'
      }))
      
      if (searchTerm) {
        filtered = filtered.filter(c => 
          c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      if (statusFilter !== 'all') {
        filtered = filtered.filter(c => c.status === statusFilter)
      }

      if (typeFilter !== 'all') {
        filtered = filtered.filter(c => c.type === typeFilter)
      }

      filtered.sort((a, b) => {
        let aVal, bVal
        switch (sortBy) {
          case 'created':
            aVal = new Date(a.created_at)
            bVal = new Date(b.created_at)
            break
          case 'usage':
            aVal = a.used_count
            bVal = b.used_count
            break
          case 'discount':
            aVal = a.value
            bVal = b.value
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

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, is_active }) => Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries(['coupons'])
      toast({ title: 'Coupon status updated' })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries(['coupons'])
      toast({ title: 'Coupon deleted' })
    }
  })

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon)
    setIsFormOpen(true)
  }

  const handleDuplicate = (coupon) => {
    const duplicated = { ...coupon, code: coupon.code + '_COPY', id: undefined }
    setEditingCoupon(duplicated)
    setIsFormOpen(true)
  }

  const handleToggleActive = (coupon) => {
    toggleActiveMutation.mutate({ id: coupon.id, is_active: !coupon.is_active })
  }

  const handleDelete = (coupon) => {
    if (confirm(`Delete coupon "${coupon.code}"?`)) {
      deleteMutation.mutate(coupon.id)
    }
  }

  const handleSelectCoupon = (couponId, checked) => {
    if (checked) {
      setSelectedCoupons(prev => [...prev, couponId])
    } else {
      setSelectedCoupons(prev => prev.filter(id => id !== couponId))
    }
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCoupons(coupons?.items?.map(c => c.id) || [])
    } else {
      setSelectedCoupons([])
    }
  }

  const handleBulkActivate = () => {
    toast({ title: `Activating ${selectedCoupons.length} coupons...` })
    setSelectedCoupons([])
  }

  const handleBulkDeactivate = () => {
    toast({ title: `Deactivating ${selectedCoupons.length} coupons...` })
    setSelectedCoupons([])
  }

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedCoupons.length} coupons?`)) {
      toast({ title: `Deleting ${selectedCoupons.length} coupons...` })
      setSelectedCoupons([])
    }
  }

  const handleBulkExport = () => {
    toast({ title: `Exporting ${selectedCoupons.length} coupons to CSV...` })
    setSelectedCoupons([])
  }

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      expired: 'bg-red-100 text-red-800',
      used_up: 'bg-orange-100 text-orange-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'percentage':
        return <Percent className="h-4 w-4" />
      case 'fixed':
        return <DollarSign className="h-4 w-4" />
      case 'free_shipping':
        return <Ticket className="h-4 w-4" />
      default:
        return null
    }
  }

  const formatDiscount = (coupon) => {
    if (coupon.type === 'percentage') return `${coupon.value}%`
    if (coupon.type === 'fixed') return `$${coupon.value}`
    return 'Free Shipping'
  }

  const totalCoupons = coupons?.total || 0
  const activeCoupons = coupons?.items?.filter(c => c.status === 'active').length || 0
  const expiredCoupons = coupons?.items?.filter(c => c.status === 'expired').length || 0
  const totalUsage = coupons?.items?.reduce((sum, c) => sum + c.used_count, 0) || 0
  const expiringCoupons = coupons?.items?.filter(c => {
    if (!c.valid_until) return false
    const daysUntilExpiry = Math.ceil((new Date(c.valid_until) - new Date()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry > 0 && daysUntilExpiry <= 7
  }).length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Coupons</h1>
          <p className="text-muted-foreground">
            Manage discount coupons and promotions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setEditingCoupon(null); setIsFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Create Coupon
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCoupons}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCoupons}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiredCoupons}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage}</div>
          </CardContent>
        </Card>
        <Card className={expiringCoupons > 0 ? 'border-orange-200 bg-orange-50' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${expiringCoupons > 0 ? 'text-orange-600' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringCoupons}</div>
            {expiringCoupons > 0 && (
              <p className="text-xs text-orange-600 mt-1">Within 7 days</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions Bar */}
      {selectedCoupons.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{selectedCoupons.length} coupons selected</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleBulkActivate}>
                  Activate
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkDeactivate}>
                  Deactivate
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedCoupons([])}>
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
                  placeholder="Search by code or name..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="used_up">Used Up</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
                <SelectItem value="free_shipping">Free Shipping</SelectItem>
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
                <DropdownMenuItem onClick={() => setSortBy('created')}>
                  Created Date {sortBy === 'created' && `(${sortOrder})`}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('usage')}>
                  Usage Count {sortBy === 'usage' && `(${sortOrder})`}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('discount')}>
                  Discount Value {sortBy === 'discount' && `(${sortOrder})`}
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

      {/* Coupons Table */}
      <Card>
        <CardHeader>
          <CardTitle>Coupons ({totalCoupons})</CardTitle>
          <CardDescription>
            Manage discount codes and promotional offers
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
                      checked={selectedCoupons.length === coupons?.items?.length && coupons?.items?.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Valid Period</TableHead>
                  <TableHead>Restrictions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons?.items?.map((coupon) => {
                  const daysUntilExpiry = coupon.valid_until ? 
                    Math.ceil((new Date(coupon.valid_until) - new Date()) / (1000 * 60 * 60 * 24)) : null
                  const isExpiringSoon = daysUntilExpiry && daysUntilExpiry > 0 && daysUntilExpiry <= 7

                  return (
                    <TableRow key={coupon.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedCoupons.includes(coupon.id)}
                          onCheckedChange={(checked) => handleSelectCoupon(coupon.id, checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(coupon.type)}
                          <span className="font-mono font-bold">{coupon.code}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{coupon.name}</div>
                        {coupon.description && (
                          <div className="text-xs text-muted-foreground">{coupon.description}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{formatDiscount(coupon)}</div>
                        {coupon.minimum_amount > 0 && (
                          <div className="text-xs text-muted-foreground">Min: ${coupon.minimum_amount}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {coupon.used_count} / {coupon.usage_limit || '∞'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {coupon.usage_limit ? 
                            `${Math.round((coupon.used_count / coupon.usage_limit) * 100)}% used` : 
                            'Unlimited'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          {coupon.valid_from ? new Date(coupon.valid_from).toLocaleDateString() : 'Now'}
                          {' → '}
                          {coupon.valid_until ? new Date(coupon.valid_until).toLocaleDateString() : 'Forever'}
                        </div>
                        {isExpiringSoon && (
                          <div className="flex items-center gap-1 text-xs text-orange-600 mt-1">
                            <Clock className="h-3 w-3" />
                            Expires in {daysUntilExpiry}d
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          {coupon.customer_restrictions === 'all' ? 'All' :
                           coupon.customer_restrictions === 'new' ? 'New only' :
                           coupon.customer_restrictions === 'existing' ? 'Existing' : 'VIP only'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(coupon.status)}>
                          {coupon.status === 'used_up' ? 'Used Up' : coupon.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={coupon.is_active}
                          onCheckedChange={() => handleToggleActive(coupon)}
                        />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => toast({ title: 'Updated', description: 'Data updated successfully' })}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(coupon)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(coupon)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(coupon)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <CouponFormDialog
        coupon={editingCoupon}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingCoupon(null)
        }}
      />
    </div>
  )
}
