import { Badge } from '@/components/ui/badge'
import { ArrowDownRight, ArrowUpRight, ArrowRightLeft } from 'lucide-react'

export const getStatusBadge = (status) => {
  const badges = {
    in_stock: <Badge className="bg-green-100 text-green-800 border-green-200">In Stock</Badge>,
    low_stock: <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Low Stock</Badge>,
    out_of_stock: <Badge className="bg-red-100 text-red-800 border-red-200">Out of Stock</Badge>
  }
  return badges[status] || badges.in_stock
}

export const getMovementIcon = (type) => {
  const icons = {
    in: <ArrowDownRight className="h-4 w-4 text-green-600" />,
    out: <ArrowUpRight className="h-4 w-4 text-red-600" />,
    transfer: <ArrowRightLeft className="h-4 w-4 text-blue-600" />
  }
  return icons[type]
}

export const formatCurrency = (value) => {
  return `$${parseFloat(value).toFixed(2)}`
}

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const calculateInventoryStats = (inventory) => {
  const totalProducts = inventory.length
  const totalUnits = inventory.reduce((sum, item) => sum + item.stock, 0)
  const lowStockItems = inventory.filter(item => item.status === 'low_stock').length
  const outOfStockItems = inventory.filter(item => item.status === 'out_of_stock').length
  const inventoryValue = inventory.reduce((sum, item) => sum + (item.stock * parseFloat(item.unitCost)), 0)

  return {
    totalProducts,
    totalUnits,
    lowStockItems,
    outOfStockItems,
    inventoryValue
  }
}

export const filterInventory = (inventory, filters) => {
  let filtered = [...inventory]

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(searchLower) ||
      item.sku.toLowerCase().includes(searchLower)
    )
  }

  // Status filter
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(item => item.status === filters.status)
  }

  // Category filter
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(item => item.category === filters.category)
  }

  // Stock range filter
  if (filters.stockRange && filters.stockRange !== 'all') {
    const ranges = {
      '0-50': [0, 50],
      '51-100': [51, 100],
      '101-200': [101, 200],
      '200+': [201, Infinity]
    }
    const [min, max] = ranges[filters.stockRange] || [0, Infinity]
    filtered = filtered.filter(item => item.stock >= min && item.stock <= max)
  }

  // Location filter
  if (filters.location && filters.location !== 'all') {
    filtered = filtered.filter(item => item.location.includes(filters.location))
  }

  return filtered
}

export const sortInventory = (inventory, sortField, sortDirection) => {
  const sorted = [...inventory].sort((a, b) => {
    let aVal = a[sortField]
    let bVal = b[sortField]

    if (sortField === 'stock' || sortField === 'unitCost') {
      aVal = parseFloat(aVal)
      bVal = parseFloat(bVal)
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  return sorted
}

export const paginateInventory = (inventory, currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return inventory.slice(startIndex, endIndex)
}

export const getTotalPages = (totalItems, itemsPerPage) => {
  return Math.ceil(totalItems / itemsPerPage)
}
