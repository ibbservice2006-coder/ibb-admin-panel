import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import {
  Search, RefreshCw, Download, Upload, Plus, Edit, Trash2, AlertTriangle,
  Package, TrendingUp, TrendingDown, BarChart3, ArrowUpDown, ArrowUp, ArrowDown,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, History, Bell,
  Eye, Minus, QrCode, Image as ImageIcon, FileText, Filter, X as XIcon,
  ArrowUpRight, ArrowDownRight, ArrowRightLeft, Calendar, DollarSign
} from 'lucide-react'

// Mock data generator
const generateMockInventory = () => {
  const categories = ['Electronics', 'Accessories', 'Furniture', 'Clothing']
  const locations = ['Warehouse A', 'Warehouse B', 'Warehouse C']
  const products = [
    'Wireless Bluetooth Headphones', 'Smart Watch Series 5', 'USB-C Charging Cable',
    'Laptop Stand Aluminum', 'Mechanical Keyboard RGB', 'Wireless Mouse',
    'Phone Case Premium', 'Screen Protector', 'Power Bank 20000mAh',
    'HDMI Cable 2m', 'USB Hub 4-Port', 'Webcam HD 1080p',
    'Desk Lamp LED', 'Office Chair Ergonomic', 'Monitor Stand',
    'Bluetooth Speaker', 'Microphone USB', 'Gaming Headset',
    'Mouse Pad XL', 'Cable Organizer', 'Laptop Bag 15inch'
  ]

  return products.map((name, index) => {
    const stock = Math.floor(Math.random() * 300)
    const reserved = Math.floor(Math.random() * 20)
    const reorderPoint = Math.floor(Math.random() * 100) + 20
    
    let status = 'in_stock'
    if (stock === 0) status = 'out_of_stock'
    else if (stock <= reorderPoint) status = 'low_stock'

    return {
      id: index + 1,
      sku: `PROD-${String(index + 1).padStart(3, '0')}`,
      name,
      category: categories[Math.floor(Math.random() * categories.length)],
      stock,
      reserved,
      available: stock - reserved,
      reorderPoint,
      status,
      location: `${locations[Math.floor(Math.random() * locations.length)]} - Shelf ${Math.floor(Math.random() * 30) + 1}`,
      unitCost: (Math.random() * 100 + 10).toFixed(2),
      lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      image: `https://via.placeholder.com/150?text=${name.split(' ')[0]}`,
      description: `High-quality ${name.toLowerCase()} for professional use`
    }
  })
}

const mockInventory = generateMockInventory()

// Mock stock history
const mockStockHistory = [
  { id: 1, date: '2024-10-03 14:30', user: 'John Doe', action: 'Added', quantity: 50, reason: 'Stock Received', newStock: 195 },
  { id: 2, date: '2024-10-02 10:15', user: 'Jane Smith', action: 'Removed', quantity: 10, reason: 'Damaged', newStock: 145 },
  { id: 3, date: '2024-10-01 16:45', user: 'Mike Johnson', action: 'Set', quantity: 155, reason: 'Inventory Correction', newStock: 155 },
  { id: 4, date: '2024-09-30 09:20', user: 'Sarah Wilson', action: 'Added', quantity: 30, reason: 'Customer Return', newStock: 185 }
]

// Mock stock movements
const mockStockMovements = [
  { id: 1, date: '2024-10-03', type: 'in', quantity: 50, from: 'Supplier A', to: 'Warehouse A', notes: 'New stock arrival' },
  { id: 2, date: '2024-10-02', type: 'out', quantity: 20, from: 'Warehouse A', to: 'Customer', notes: 'Order #1234' },
  { id: 3, date: '2024-10-01', type: 'transfer', quantity: 30, from: 'Warehouse A', to: 'Warehouse B', notes: 'Stock rebalancing' },
  { id: 4, date: '2024-09-30', type: 'in', quantity: 100, from: 'Supplier B', to: 'Warehouse C', notes: 'Bulk order' }
]

const getStatusBadge = (status) => {
  const badges = {
    in_stock: <Badge className="bg-green-100 text-green-800 border-green-200">In Stock</Badge>,
    low_stock: <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Low Stock</Badge>,
    out_of_stock: <Badge className="bg-red-100 text-red-800 border-red-200">Out of Stock</Badge>
  }
  return badges[status] || badges.in_stock
}

const getMovementIcon = (type) => {
  const icons = {
    in: <ArrowDownRight className="h-4 w-4 text-green-600" />,
    out: <ArrowUpRight className="h-4 w-4 text-red-600" />,
    transfer: <ArrowRightLeft className="h-4 w-4 text-blue-600" />
  }
  return icons[type]
}

export default function Inventory() {
  const [inventory, setInventory] = useState(mockInventory)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [stockRangeFilter, setStockRangeFilter] = useState('all')
  const [selectedItems, setSelectedItems] = useState([])
  
  // Dialogs
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isMovementDialogOpen, setIsMovementDialogOpen] = useState(false)
  const [isReportsDialogOpen, setIsReportsDialogOpen] = useState(false)
  
  const [selectedItem, setSelectedItem] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // Sorting
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  
  // Form states
  const [adjustmentType, setAdjustmentType] = useState('add')
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0)
  const [adjustmentReason, setAdjustmentReason] = useState('')
  
  // Movement tracking
  const [movementType, setMovementType] = useState('in')
  const [movementQuantity, setMovementQuantity] = useState(0)
  const [movementFrom, setMovementFrom] = useState('')
  const [movementTo, setMovementTo] = useState('')
  const [movementNotes, setMovementNotes] = useState('')
  
  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    category: '',
    stock: 0,
    reorderPoint: 0,
    location: '',
    unitCost: 0,
    image: '',
    description: ''
  })
  
  const { toast } = useToast()

  // Handlers
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast({ title: 'Inventory refreshed', description: 'Stock levels have been updated' })
    }, 1000)
  }

  const handleExport = () => {
    const selected = selectedItems.length > 0 
      ? inventory.filter(item => selectedItems.includes(item.id))
      : filteredAndSortedInventory
    
    toast({ title: 'Export started', description: `Exporting ${selected.length} items as CSV...` })
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return <ArrowUpDown className="h-4 w-4 ml-1 inline" />
    return sortOrder === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-1 inline" />
      : <ArrowDown className="h-4 w-4 ml-1 inline" />
  }

  // Quick adjust
  const handleQuickAdjust = (item, amount) => {
    const updated = inventory.map(inv => {
      if (inv.id === item.id) {
        const newStock = Math.max(0, inv.stock + amount)
        let status = 'in_stock'
        if (newStock === 0) status = 'out_of_stock'
        else if (newStock <= inv.reorderPoint) status = 'low_stock'

        return {
          ...inv,
          stock: newStock,
          available: newStock - inv.reserved,
          status,
          lastUpdated: new Date().toISOString()
        }
      }
      return inv
    })

    setInventory(updated)
    toast({ title: 'Stock adjusted', description: `${item.name}: ${amount > 0 ? '+' : ''}${amount} units` })
  }

  // Add Product
  const handleAddProduct = () => {
    const newId = Math.max(...inventory.map(i => i.id)) + 1
    const reserved = 0
    const stock = parseInt(newProduct.stock)
    const reorderPoint = parseInt(newProduct.reorderPoint)
    
    let status = 'in_stock'
    if (stock === 0) status = 'out_of_stock'
    else if (stock <= reorderPoint) status = 'low_stock'

    const product = {
      ...newProduct,
      id: newId,
      stock,
      reserved,
      available: stock - reserved,
      reorderPoint,
      status,
      unitCost: parseFloat(newProduct.unitCost),
      lastUpdated: new Date().toISOString(),
      image: newProduct.image || `https://via.placeholder.com/150?text=${newProduct.name.split(' ')[0]}`
    }

    setInventory([...inventory, product])
    setIsAddDialogOpen(false)
    setNewProduct({ sku: '', name: '', category: '', stock: 0, reorderPoint: 0, location: '', unitCost: 0, image: '', description: '' })
    toast({ title: 'Product added', description: `${product.name} has been added to inventory` })
  }

  // Edit Product
  const handleEditProduct = () => {
    const updated = inventory.map(item => {
      if (item.id === selectedItem.id) {
        const stock = parseInt(selectedItem.stock)
        const reserved = parseInt(selectedItem.reserved)
        const reorderPoint = parseInt(selectedItem.reorderPoint)
        
        let status = 'in_stock'
        if (stock === 0) status = 'out_of_stock'
        else if (stock <= reorderPoint) status = 'low_stock'

        return {
          ...selectedItem,
          stock,
          reserved,
          available: stock - reserved,
          reorderPoint,
          status,
          unitCost: parseFloat(selectedItem.unitCost),
          lastUpdated: new Date().toISOString()
        }
      }
      return item
    })

    setInventory(updated)
    setIsEditDialogOpen(false)
    setSelectedItem(null)
    toast({ title: 'Product updated', description: 'Product details have been saved' })
  }

  // Delete Product
  const handleDeleteProduct = () => {
    setInventory(inventory.filter(item => item.id !== selectedItem.id))
    setIsDeleteDialogOpen(false)
    toast({ title: 'Product deleted', description: `${selectedItem.name} has been removed` })
    setSelectedItem(null)
  }

  // Adjust Stock
  const handleAdjustStock = () => {
    const quantity = parseInt(adjustmentQuantity)
    const updated = inventory.map(item => {
      if (item.id === selectedItem.id) {
        let newStock = item.stock
        
        if (adjustmentType === 'add') newStock += quantity
        else if (adjustmentType === 'remove') newStock -= quantity
        else if (adjustmentType === 'set') newStock = quantity
        
        newStock = Math.max(0, newStock)
        
        let status = 'in_stock'
        if (newStock === 0) status = 'out_of_stock'
        else if (newStock <= item.reorderPoint) status = 'low_stock'

        return {
          ...item,
          stock: newStock,
          available: newStock - item.reserved,
          status,
          lastUpdated: new Date().toISOString()
        }
      }
      return item
    })

    setInventory(updated)
    setIsAdjustDialogOpen(false)
    setAdjustmentQuantity(0)
    setAdjustmentReason('')
    toast({ title: 'Stock adjusted', description: `Stock level for ${selectedItem.name} has been updated` })
    setSelectedItem(null)
  }

  // Bulk Operations
  const handleBulkAdjust = (type) => {
    const quantity = parseInt(adjustmentQuantity)
    const updated = inventory.map(item => {
      if (selectedItems.includes(item.id)) {
        let newStock = item.stock
        
        if (type === 'add') newStock += quantity
        else if (type === 'remove') newStock -= quantity
        
        newStock = Math.max(0, newStock)
        
        let status = 'in_stock'
        if (newStock === 0) status = 'out_of_stock'
        else if (newStock <= item.reorderPoint) status = 'low_stock'

        return {
          ...item,
          stock: newStock,
          available: newStock - item.reserved,
          status,
          lastUpdated: new Date().toISOString()
        }
      }
      return item
    })

    setInventory(updated)
    setIsBulkDialogOpen(false)
    setSelectedItems([])
    setAdjustmentQuantity(0)
    toast({ title: 'Bulk adjustment completed', description: `${selectedItems.length} items updated` })
  }

  const handleBulkDelete = () => {
    setInventory(inventory.filter(item => !selectedItems.includes(item.id)))
    setSelectedItems([])
    toast({ title: 'Bulk delete completed', description: `${selectedItems.length} items removed` })
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(paginatedInventory.map(item => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (id, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, id])
    } else {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id))
    }
  }

  // Stock Movement
  const handleAddMovement = () => {
    toast({ 
      title: 'Movement recorded', 
      description: `${movementType.toUpperCase()}: ${movementQuantity} units` 
    })
    setIsMovementDialogOpen(false)
    setMovementQuantity(0)
    setMovementFrom('')
    setMovementTo('')
    setMovementNotes('')
  }

  // Filtering and Sorting
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    const matchesLocation = locationFilter === 'all' || item.location.includes(locationFilter)
    
    let matchesStockRange = true
    if (stockRangeFilter !== 'all') {
      if (stockRangeFilter === '0-50') matchesStockRange = item.stock >= 0 && item.stock <= 50
      else if (stockRangeFilter === '51-100') matchesStockRange = item.stock >= 51 && item.stock <= 100
      else if (stockRangeFilter === '101-200') matchesStockRange = item.stock >= 101 && item.stock <= 200
      else if (stockRangeFilter === '200+') matchesStockRange = item.stock > 200
    }
    
    return matchesSearch && matchesStatus && matchesCategory && matchesLocation && matchesStockRange
  })

  const filteredAndSortedInventory = [...filteredInventory].sort((a, b) => {
    let aVal = a[sortBy]
    let bVal = b[sortBy]
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedInventory.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedInventory = filteredAndSortedInventory.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  // Stats
  const stats = {
    total_items: inventory.length,
    total_stock: inventory.reduce((sum, item) => sum + item.stock, 0),
    low_stock: inventory.filter(item => item.status === 'low_stock').length,
    out_of_stock: inventory.filter(item => item.status === 'out_of_stock').length,
    total_value: inventory.reduce((sum, item) => sum + (item.stock * item.unitCost), 0)
  }

  const lowStockItems = inventory.filter(item => item.status === 'low_stock' || item.status === 'out_of_stock')

  // Get unique locations for filter
  const uniqueLocations = [...new Set(inventory.map(item => item.location.split(' - ')[0]))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">
            Track and manage your product stock levels
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export {selectedItems.length > 0 && `(${selectedItems.length})`}
          </Button>
          <Button variant="outline" size="sm" asChild>
            <label className="cursor-pointer flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Import
              <input type="file" accept=".csv" className="hidden" />
            </label>
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsMovementDialogOpen(true)}>
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Record Movement
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsReportsDialogOpen(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Reports
          </Button>
          {selectedItems.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsBulkDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Bulk Adjust ({selectedItems.length})
              </Button>
              <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900">Low Stock Alert</h3>
                <p className="text-sm text-yellow-800 mt-1">
                  {lowStockItems.length} items are below reorder point and need restocking
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {lowStockItems.slice(0, 5).map(item => (
                    <Badge key={item.id} variant="outline" className="bg-white">
                      {item.name} ({item.stock} left)
                    </Badge>
                  ))}
                  {lowStockItems.length > 5 && (
                    <Badge variant="outline" className="bg-white">
                      +{lowStockItems.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_items}</div>
            <p className="text-xs text-muted-foreground">Unique products</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_stock}</div>
            <p className="text-xs text-muted-foreground">Units in stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.total_value.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Inventory value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.low_stock}</div>
            <p className="text-xs text-muted-foreground">Items need reorder</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.out_of_stock}</div>
            <p className="text-xs text-muted-foreground">Urgent restock needed</p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Advanced Filters</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                </SelectContent>
              </Select>
              <Select value={stockRangeFilter} onValueChange={setStockRangeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Stock Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="0-50">0 - 50</SelectItem>
                  <SelectItem value="51-100">51 - 100</SelectItem>
                  <SelectItem value="101-200">101 - 200</SelectItem>
                  <SelectItem value="200+">200+</SelectItem>
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map(loc => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={String(itemsPerPage)} onValueChange={(val) => {
                setItemsPerPage(parseInt(val))
                setCurrentPage(1)
              }}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">
                    <Checkbox
                      checked={selectedItems.length === paginatedInventory.length && paginatedInventory.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Image</th>
                  <th className="text-left py-3 px-4 font-medium cursor-pointer" onClick={() => handleSort('sku')}>
                    SKU {getSortIcon('sku')}
                  </th>
                  <th className="text-left py-3 px-4 font-medium cursor-pointer" onClick={() => handleSort('name')}>
                    Product {getSortIcon('name')}
                  </th>
                  <th className="text-left py-3 px-4 font-medium cursor-pointer" onClick={() => handleSort('category')}>
                    Category {getSortIcon('category')}
                  </th>
                  <th className="text-right py-3 px-4 font-medium cursor-pointer" onClick={() => handleSort('stock')}>
                    Stock {getSortIcon('stock')}
                  </th>
                  <th className="text-right py-3 px-4 font-medium">Available</th>
                  <th className="text-left py-3 px-4 font-medium cursor-pointer" onClick={() => handleSort('status')}>
                    Status {getSortIcon('status')}
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Quick Adjust</th>
                  <th className="text-center py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInventory.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-12 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No inventory items found</p>
                    </td>
                  </tr>
                ) : (
                  paginatedInventory.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={(checked) => handleSelectItem(item.id, checked)}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
                      </td>
                      <td className="py-3 px-4 font-mono text-sm">
                        <div className="flex items-center gap-2">
                          {item.sku}
                          <QrCode className="h-3 w-3 text-muted-foreground cursor-pointer" title="View Barcode" />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button 
                          className="text-left hover:underline"
                          onClick={() => {
                            setSelectedItem(item)
                            setIsDetailsDialogOpen(true)
                          }}
                        >
                          {item.name}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{item.category}</Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">{item.stock}</td>
                      <td className="py-3 px-4 text-right font-semibold text-green-600">{item.available}</td>
                      <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleQuickAdjust(item, 10)}
                            title="Add 10"
                          >
                            +10
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleQuickAdjust(item, 50)}
                            title="Add 50"
                          >
                            +50
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleQuickAdjust(item, -10)}
                            title="Remove 10"
                          >
                            -10
                          </Button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item)
                              setIsDetailsDialogOpen(true)
                            }}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item)
                              setIsAdjustDialogOpen(true)
                            }}
                            title="Adjust Stock"
                          >
                            <Package className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item)
                              setIsEditDialogOpen(true)
                            }}
                            title="Edit Product"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item)
                              setIsHistoryDialogOpen(true)
                            }}
                            title="View History"
                          >
                            <History className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item)
                              setIsDeleteDialogOpen(true)
                            }}
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedInventory.length)} of {filteredAndSortedInventory.length} items
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Product Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedItem?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="stock">Stock Info</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="movements">Movements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 flex items-center gap-4">
                    <img src={selectedItem.image} alt={selectedItem.name} className="w-32 h-32 rounded object-cover" />
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold">{selectedItem.name}</h3>
                      <p className="text-muted-foreground">{selectedItem.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <QrCode className="h-5 w-5" />
                          <span className="font-mono text-sm">{selectedItem.sku}</span>
                        </div>
                        {getStatusBadge(selectedItem.status)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <p className="text-lg">{selectedItem.category}</p>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <p className="text-lg">{selectedItem.location}</p>
                  </div>
                  <div>
                    <Label>Unit Cost</Label>
                    <p className="text-lg font-semibold">${selectedItem.unitCost}</p>
                  </div>
                  <div>
                    <Label>Total Value</Label>
                    <p className="text-lg font-semibold text-green-600">
                      ${(selectedItem.stock * selectedItem.unitCost).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <Label>Last Updated</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedItem.lastUpdated).toLocaleString()}
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="stock" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Total Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{selectedItem.stock}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Reserved</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-yellow-600">{selectedItem.reserved}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Available</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">{selectedItem.available}</div>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <Label>Reorder Point</Label>
                  <p className="text-lg">{selectedItem.reorderPoint} units</p>
                  {selectedItem.stock <= selectedItem.reorderPoint && (
                    <p className="text-sm text-yellow-600 mt-1">⚠️ Below reorder point - needs restocking</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
                    setIsDetailsDialogOpen(false)
                    setIsAdjustDialogOpen(true)
                  }}>
                    <Package className="h-4 w-4 mr-2" />
                    Adjust Stock
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    setIsDetailsDialogOpen(false)
                    setIsEditDialogOpen(true)
                  }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Details
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-2">
                {mockStockHistory.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant={record.action === 'Added' ? 'default' : 'secondary'}>
                            {record.action}
                          </Badge>
                          <span className="font-semibold">{record.quantity} units</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Reason: {record.reason}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          New stock: {record.newStock} units
                        </p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{record.date}</p>
                        <p>by {record.user}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="movements" className="space-y-2">
                {mockStockMovements.map((movement) => (
                  <div key={movement.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getMovementIcon(movement.type)}
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{movement.type.toUpperCase()}</Badge>
                            <span className="font-semibold">{movement.quantity} units</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            From: {movement.from} → To: {movement.to}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {movement.notes}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{movement.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          )}
          <div className="flex justify-end">
            <Button size="sm" variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stock Movement Dialog */}
      <Dialog open={isMovementDialogOpen} onOpenChange={setIsMovementDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Stock Movement</DialogTitle>
            <DialogDescription>
              Track incoming, outgoing, or transfer of stock
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Movement Type</Label>
              <Select value={movementType} onValueChange={setMovementType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Stock In (Receiving)</SelectItem>
                  <SelectItem value="out">Stock Out (Sales/Shipment)</SelectItem>
                  <SelectItem value="transfer">Transfer (Between Locations)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quantity</Label>
              <Input 
                type="number" 
                value={movementQuantity}
                onChange={(e) => setMovementQuantity(e.target.value)}
                placeholder="Enter quantity" 
              />
            </div>
            <div>
              <Label>From</Label>
              <Input 
                value={movementFrom}
                onChange={(e) => setMovementFrom(e.target.value)}
                placeholder={movementType === 'in' ? 'Supplier name' : 'Warehouse location'} 
              />
            </div>
            <div>
              <Label>To</Label>
              <Input 
                value={movementTo}
                onChange={(e) => setMovementTo(e.target.value)}
                placeholder={movementType === 'out' ? 'Customer/Order #' : 'Warehouse location'} 
              />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea 
                value={movementNotes}
                onChange={(e) => setMovementNotes(e.target.value)}
                placeholder="Additional notes..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsMovementDialogOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleAddMovement}>
                Record Movement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reports Dialog */}
      <Dialog open={isReportsDialogOpen} onOpenChange={setIsReportsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Inventory Reports & Analytics</DialogTitle>
            <DialogDescription>
              View comprehensive reports and analytics
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="value">Value Report</TabsTrigger>
              <TabsTrigger value="movement">Movement</TabsTrigger>
              <TabsTrigger value="lowstock">Low Stock</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">{stats.total_items}</div>
                    <p className="text-sm text-muted-foreground">Unique SKUs</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Total Units</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">{stats.total_stock}</div>
                    <p className="text-sm text-muted-foreground">In all warehouses</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">${stats.total_value.toFixed(2)}</div>
                    <p className="text-sm text-muted-foreground">Total worth</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Avg Unit Cost</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">
                      ${(stats.total_value / stats.total_stock).toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground">Per unit</p>
                  </CardContent>
                </Card>
              </div>
              <div>
                <h4 className="font-semibold mb-2">By Category</h4>
                <div className="space-y-2">
                  {['Electronics', 'Accessories', 'Furniture', 'Clothing'].map(cat => {
                    const items = inventory.filter(i => i.category === cat)
                    const totalStock = items.reduce((sum, i) => sum + i.stock, 0)
                    const totalValue = items.reduce((sum, i) => sum + (i.stock * i.unitCost), 0)
                    return (
                      <div key={cat} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{cat}</p>
                          <p className="text-sm text-muted-foreground">{items.length} products</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{totalStock} units</p>
                          <p className="text-sm text-muted-foreground">${totalValue.toFixed(2)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="value" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Top 10 by Value</h4>
                {[...inventory]
                  .sort((a, b) => (b.stock * b.unitCost) - (a.stock * a.unitCost))
                  .slice(0, 10)
                  .map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.sku}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(item.stock * item.unitCost).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{item.stock} × ${item.unitCost}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="movement" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Recent Stock Movements</h4>
                {mockStockMovements.map((movement) => (
                  <div key={movement.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getMovementIcon(movement.type)}
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{movement.type.toUpperCase()}</Badge>
                            <span className="font-semibold">{movement.quantity} units</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            From: {movement.from} → To: {movement.to}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {movement.notes}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{movement.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="lowstock" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Items Below Reorder Point</h4>
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-yellow-600">{item.stock} units</p>
                      <p className="text-sm text-muted-foreground">Reorder at: {item.reorderPoint}</p>
                    </div>
                  </div>
                ))}
                {lowStockItems.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>All items are above reorder point</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsReportsDialogOpen(false)}>
              Close
            </Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Add a new product to your inventory
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>SKU *</Label>
              <Input 
                value={newProduct.sku} 
                onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                placeholder="PROD-001"
              />
            </div>
            <div>
              <Label>Product Name *</Label>
              <Input 
                value={newProduct.name} 
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                placeholder="Product name"
              />
            </div>
            <div>
              <Label>Category *</Label>
              <Select value={newProduct.category} onValueChange={(val) => setNewProduct({...newProduct, category: val})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Initial Stock *</Label>
              <Input 
                type="number" 
                value={newProduct.stock} 
                onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                placeholder="0"
              />
            </div>
            <div>
              <Label>Reorder Point *</Label>
              <Input 
                type="number" 
                value={newProduct.reorderPoint} 
                onChange={(e) => setNewProduct({...newProduct, reorderPoint: e.target.value})}
                placeholder="0"
              />
            </div>
            <div>
              <Label>Unit Cost ($)</Label>
              <Input 
                type="number" 
                step="0.01"
                value={newProduct.unitCost} 
                onChange={(e) => setNewProduct({...newProduct, unitCost: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div className="col-span-2">
              <Label>Location</Label>
              <Input 
                value={newProduct.location} 
                onChange={(e) => setNewProduct({...newProduct, location: e.target.value})}
                placeholder="Warehouse A - Shelf 1"
              />
            </div>
            <div className="col-span-2">
              <Label>Image URL</Label>
              <Input 
                value={newProduct.image} 
                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                placeholder="https://..."
              />
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea 
                value={newProduct.description} 
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                placeholder="Product description..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button size="sm" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleAddProduct}>
              Add Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>SKU</Label>
                <Input 
                  value={selectedItem.sku} 
                  onChange={(e) => setSelectedItem({...selectedItem, sku: e.target.value})}
                />
              </div>
              <div>
                <Label>Product Name</Label>
                <Input 
                  value={selectedItem.name} 
                  onChange={(e) => setSelectedItem({...selectedItem, name: e.target.value})}
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={selectedItem.category} onValueChange={(val) => setSelectedItem({...selectedItem, category: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Stock</Label>
                <Input 
                  type="number" 
                  value={selectedItem.stock} 
                  onChange={(e) => setSelectedItem({...selectedItem, stock: e.target.value})}
                />
              </div>
              <div>
                <Label>Reserved</Label>
                <Input 
                  type="number" 
                  value={selectedItem.reserved} 
                  onChange={(e) => setSelectedItem({...selectedItem, reserved: e.target.value})}
                />
              </div>
              <div>
                <Label>Reorder Point</Label>
                <Input 
                  type="number" 
                  value={selectedItem.reorderPoint} 
                  onChange={(e) => setSelectedItem({...selectedItem, reorderPoint: e.target.value})}
                />
              </div>
              <div>
                <Label>Unit Cost ($)</Label>
                <Input 
                  type="number" 
                  step="0.01"
                  value={selectedItem.unitCost} 
                  onChange={(e) => setSelectedItem({...selectedItem, unitCost: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <Label>Location</Label>
                <Input 
                  value={selectedItem.location} 
                  onChange={(e) => setSelectedItem({...selectedItem, location: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <Label>Image URL</Label>
                <Input 
                  value={selectedItem.image} 
                  onChange={(e) => setSelectedItem({...selectedItem, image: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <Label>Description</Label>
                <Textarea 
                  value={selectedItem.description} 
                  onChange={(e) => setSelectedItem({...selectedItem, description: e.target.value})}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button size="sm" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleEditProduct}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Adjust Stock Dialog */}
      <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock Level</DialogTitle>
            <DialogDescription>
              Update the stock quantity for {selectedItem?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Current Stock</Label>
              <Input value={selectedItem?.stock || 0} disabled />
            </div>
            <div>
              <Label>Adjustment Type</Label>
              <Select value={adjustmentType} onValueChange={setAdjustmentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add Stock</SelectItem>
                  <SelectItem value="remove">Remove Stock</SelectItem>
                  <SelectItem value="set">Set Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quantity</Label>
              <Input 
                type="number" 
                value={adjustmentQuantity}
                onChange={(e) => setAdjustmentQuantity(e.target.value)}
                placeholder="Enter quantity" 
              />
            </div>
            <div>
              <Label>Reason</Label>
              <Select value={adjustmentReason} onValueChange={setAdjustmentReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="received">Stock Received</SelectItem>
                  <SelectItem value="damaged">Damaged</SelectItem>
                  <SelectItem value="returned">Customer Return</SelectItem>
                  <SelectItem value="correction">Inventory Correction</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsAdjustDialogOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleAdjustStock}>
                Save Adjustment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stock History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Stock History</DialogTitle>
            <DialogDescription>
              View stock adjustment history for {selectedItem?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {mockStockHistory.map((record) => (
              <div key={record.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant={record.action === 'Added' ? 'default' : 'secondary'}>
                        {record.action}
                      </Badge>
                      <span className="font-semibold">{record.quantity} units</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Reason: {record.reason}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      New stock: {record.newStock} units
                    </p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{record.date}</p>
                    <p>by {record.user}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button size="sm" variant="outline" onClick={() => setIsHistoryDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedItem?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="destructive" onClick={handleDeleteProduct}>
              Delete Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Adjust Dialog */}
      <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Stock Adjustment</DialogTitle>
            <DialogDescription>
              Adjust stock for {selectedItems.length} selected items
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Adjustment Type</Label>
              <Select value={adjustmentType} onValueChange={setAdjustmentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add Stock</SelectItem>
                  <SelectItem value="remove">Remove Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quantity</Label>
              <Input 
                type="number" 
                value={adjustmentQuantity}
                onChange={(e) => setAdjustmentQuantity(e.target.value)}
                placeholder="Enter quantity" 
              />
            </div>
            <div>
              <Label>Reason</Label>
              <Textarea 
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                placeholder="Enter reason for bulk adjustment"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsBulkDialogOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => handleBulkAdjust(adjustmentType)}>
                Apply to {selectedItems.length} Items
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
