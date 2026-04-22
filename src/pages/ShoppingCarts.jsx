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
  ShoppingCart,
  Trash2,
  Eye,
  Package,
  User,
  DollarSign,
  Calendar,
  AlertTriangle,
  Mail,
  ShoppingBag,
  Download,
  ArrowUpDown,
  CheckSquare,
  MoreHorizontal,
  Clock,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react'
import { apiService } from '../services/apiService'

function CartDetailsDialog({ cart, isOpen, onClose }) {
  if (!cart) return null

  const totalValue = cart.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Shopping Cart Details</DialogTitle>
          <DialogDescription>
            Cart for {cart.user.email} - {cart.items?.length || 0} items
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{cart.user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Cart Created</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(cart.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(cart.updated_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Value</p>
                  <p className="text-sm font-semibold text-green-600">
                    ${totalValue.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cart Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cart Items</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.items && cart.items.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="font-medium">{item.product_name}</div>
                              <div className="text-sm text-muted-foreground">
                                SKU: {item.sku}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>${item.price}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No items in cart</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function ShoppingCarts() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCart, setSelectedCart] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updated')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedCarts, setSelectedCarts] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Mock data for shopping carts
  const mockCarts = [
    {
      id: 1,
      user: { id: 1, email: 'john@example.com', first_name: 'John', last_name: 'Doe' },
      items: [
        {
          product_id: 1,
          product_name: 'Wireless Headphones',
          sku: 'WH-001',
          price: 99.99,
          quantity: 1,
          image: 'https://via.placeholder.com/100'
        },
        {
          product_id: 2,
          product_name: 'Smart Watch',
          sku: 'SW-002',
          price: 199.99,
          quantity: 2,
          image: 'https://via.placeholder.com/100'
        }
      ],
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-16T14:20:00Z',
      status: 'active'
    },
    {
      id: 2,
      user: { id: 2, email: 'jane@example.com', first_name: 'Jane', last_name: 'Smith' },
      items: [
        {
          product_id: 3,
          product_name: 'Bluetooth Speaker',
          sku: 'BS-003',
          price: 79.99,
          quantity: 1,
          image: 'https://via.placeholder.com/100'
        }
      ],
      created_at: '2024-01-14T15:45:00Z',
      updated_at: '2024-01-14T15:45:00Z',
      status: 'active'
    },
    {
      id: 3,
      user: { id: 3, email: 'bob@example.com', first_name: 'Bob', last_name: 'Johnson' },
      items: [
        {
          product_id: 1,
          product_name: 'Wireless Headphones',
          sku: 'WH-001',
          price: 99.99,
          quantity: 1,
          image: 'https://via.placeholder.com/100'
        }
      ],
      created_at: '2024-01-05T09:20:00Z',
      updated_at: '2024-01-05T09:20:00Z',
      status: 'abandoned'
    },
    {
      id: 4,
      user: { id: 4, email: 'alice@example.com', first_name: 'Alice', last_name: 'Wilson' },
      items: [
        {
          product_id: 1,
          product_name: 'Wireless Headphones',
          sku: 'WH-001',
          price: 99.99,
          quantity: 3,
          image: 'https://via.placeholder.com/100'
        },
        {
          product_id: 4,
          product_name: 'Laptop Stand',
          sku: 'LS-004',
          price: 49.99,
          quantity: 1,
          image: 'https://via.placeholder.com/100'
        }
      ],
      created_at: '2024-01-12T11:15:00Z',
      updated_at: '2024-01-17T16:30:00Z',
      status: 'active'
    },
    {
      id: 5,
      user: { id: 5, email: 'charlie@example.com', first_name: 'Charlie', last_name: 'Brown' },
      items: [
        {
          product_id: 2,
          product_name: 'Smart Watch',
          sku: 'SW-002',
          price: 199.99,
          quantity: 1,
          image: 'https://via.placeholder.com/100'
        }
      ],
      created_at: '2024-01-08T08:10:00Z',
      updated_at: '2024-01-08T08:10:00Z',
      status: 'stale'
    }
  ]

  const { data: carts, isLoading } = useQuery({
    queryKey: ['shopping-carts', { search: searchTerm, status: statusFilter, sort: sortBy, order: sortOrder }],
    queryFn: () => {
      let filtered = mockCarts
      
      // Search filter
      if (searchTerm) {
        filtered = filtered.filter(cart => 
          cart.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cart.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cart.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cart.items.some(item => 
            item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      }
      
      // Status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(cart => {
          const status = getCartStatus(cart)
          return status.label.toLowerCase() === statusFilter
        })
      }

      // Sort
      filtered.sort((a, b) => {
        let aVal, bVal
        switch (sortBy) {
          case 'updated':
            aVal = new Date(a.updated_at)
            bVal = new Date(b.updated_at)
            break
          case 'created':
            aVal = new Date(a.created_at)
            bVal = new Date(b.created_at)
            break
          case 'value':
            aVal = getCartValue(a)
            bVal = getCartValue(b)
            break
          case 'items':
            aVal = a.items?.length || 0
            bVal = b.items?.length || 0
            break
          default:
            return 0
        }
        return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1)
      })
      
      return Promise.resolve({ items: filtered, total: filtered.length })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => {
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['shopping-carts'])
      toast({ title: 'Shopping cart deleted successfully' })
    }
  })

  const recoverMutation = useMutation({
    mutationFn: (id) => {
      return Promise.resolve()
    },
    onSuccess: () => {
      toast({ title: 'Recovery email sent successfully' })
    }
  })

  const convertMutation = useMutation({
    mutationFn: (id) => {
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['shopping-carts'])
      toast({ title: 'Cart converted to order successfully' })
    }
  })

  const handleViewDetails = (cart) => {
    setSelectedCart(cart)
    setIsDetailsOpen(true)
  }

  const handleDelete = (cart) => {
    if (confirm(`Are you sure you want to delete ${cart.user.email}'s cart?`)) {
      deleteMutation.mutate(cart.id)
    }
  }

  const handleRecover = (cart) => {
    if (confirm(`Send recovery email to ${cart.user.email}?`)) {
      recoverMutation.mutate(cart.id)
    }
  }

  const handleConvert = (cart) => {
    if (confirm(`Convert ${cart.user.email}'s cart to order?`)) {
      convertMutation.mutate(cart.id)
    }
  }

  const handleSelectCart = (cartId, checked) => {
    if (checked) {
      setSelectedCarts(prev => [...prev, cartId])
    } else {
      setSelectedCarts(prev => prev.filter(id => id !== cartId))
    }
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCarts(carts?.items?.map(c => c.id) || [])
    } else {
      setSelectedCarts([])
    }
  }

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedCarts.length} selected carts?`)) {
      selectedCarts.forEach(id => deleteMutation.mutate(id))
      setSelectedCarts([])
    }
  }

  const handleBulkRecover = () => {
    toast({ title: `Sending recovery emails to ${selectedCarts.length} customers...` })
    setSelectedCarts([])
  }

  const handleExport = () => {
    toast({ title: 'Exporting shopping carts to CSV...' })
  }

  const getCartValue = (cart) => {
    return cart.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0
  }

  const getCartStatus = (cart) => {
    if (cart.items?.length === 0) {
      return { label: 'Empty', color: 'bg-gray-100 text-gray-800' }
    }
    
    const daysSinceUpdate = Math.floor(
      (new Date() - new Date(cart.updated_at)) / (1000 * 60 * 60 * 24)
    )
    
    if (daysSinceUpdate > 7) {
      return { label: 'Abandoned', color: 'bg-red-100 text-red-800' }
    } else if (daysSinceUpdate > 3) {
      return { label: 'Stale', color: 'bg-yellow-100 text-yellow-800' }
    } else {
      return { label: 'Active', color: 'bg-green-100 text-green-800' }
    }
  }

  const getCartAge = (cart) => {
    const daysSinceUpdate = Math.floor(
      (new Date() - new Date(cart.updated_at)) / (1000 * 60 * 60 * 24)
    )
    
    if (daysSinceUpdate === 0) return 'Today'
    if (daysSinceUpdate === 1) return '1 day ago'
    if (daysSinceUpdate < 7) return `${daysSinceUpdate} days ago`
    if (daysSinceUpdate < 30) return `${Math.floor(daysSinceUpdate / 7)} weeks ago`
    return `${Math.floor(daysSinceUpdate / 30)} months ago`
  }

  const activeCarts = carts?.items?.filter(cart => {
    const status = getCartStatus(cart)
    return status.label === 'Active'
  }) || []
  
  const staleCarts = carts?.items?.filter(cart => {
    const status = getCartStatus(cart)
    return status.label === 'Stale'
  }) || []
  
  const abandonedCarts = carts?.items?.filter(cart => {
    const status = getCartStatus(cart)
    return status.label === 'Abandoned'
  }) || []
  
  const totalValue = carts?.items?.reduce((sum, cart) => sum + getCartValue(cart), 0) || 0
  const recoveryRate = 23.5 // Mock recovery rate

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shopping Carts</h1>
          <p className="text-muted-foreground">
            Monitor customer shopping carts and abandoned items
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Carts</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{carts?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Carts</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCarts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abandoned</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{abandonedCarts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recovery Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recoveryRate}%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions Bar */}
      {selectedCarts.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{selectedCarts.length} carts selected</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleBulkRecover}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Recovery Email
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedCarts([])}>
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
                  placeholder="Search carts by customer or product..."
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
                <SelectItem value="stale">Stale</SelectItem>
                <SelectItem value="abandoned">Abandoned</SelectItem>
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
                <DropdownMenuItem onClick={() => setSortBy('updated')}>
                  Last Updated {sortBy === 'updated' && `(${sortOrder})`}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('created')}>
                  Created Date {sortBy === 'created' && `(${sortOrder})`}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('value')}>
                  Cart Value {sortBy === 'value' && `(${sortOrder})`}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('items')}>
                  Item Count {sortBy === 'items' && `(${sortOrder})`}
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

      {/* Shopping Carts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Shopping Carts ({carts?.total || 0})</CardTitle>
          <CardDescription>
            Customer shopping carts and their contents
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
                      checked={selectedCarts.length === carts?.items?.length && carts?.items?.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carts?.items?.map((cart) => {
                  const cartValue = getCartValue(cart)
                  const status = getCartStatus(cart)
                  const age = getCartAge(cart)
                  
                  return (
                    <TableRow key={cart.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedCarts.includes(cart.id)}
                          onCheckedChange={(checked) => handleSelectCart(cart.id, checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{cart.user.email}</div>
                            <div className="text-sm text-muted-foreground">
                              {cart.user.first_name} {cart.user.last_name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex -space-x-2">
                          {cart.items?.slice(0, 3).map((item, idx) => (
                            <div 
                              key={idx}
                              className="w-8 h-8 rounded border-2 border-white bg-muted flex items-center justify-center"
                              title={item.product_name}
                            >
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                          ))}
                          {cart.items?.length > 3 && (
                            <div className="w-8 h-8 rounded border-2 border-white bg-muted flex items-center justify-center text-xs font-medium">
                              +{cart.items.length - 3}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>{cart.items?.length || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">${cartValue.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {age}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={status.color}>
                          {status.label}
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
                            <DropdownMenuItem onClick={() => handleViewDetails(cart)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRecover(cart)}>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Recovery Email
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleConvert(cart)}>
                              <ShoppingBag className="h-4 w-4 mr-2" />
                              Convert to Order
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(cart)}
                              className="text-red-600"
                            >
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

      {/* Cart Details Dialog */}
      {selectedCart && (
        <CartDetailsDialog 
          cart={selectedCart} 
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false)
            setSelectedCart(null)
          }} 
        />
      )}
    </div>
  )
}
