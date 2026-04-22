import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { mockInventory } from '../data/mockData'
import { filterInventory, sortInventory, paginateInventory, getTotalPages } from '../utils/helpers'

export const useInventory = () => {
  const [inventory, setInventory] = useState(mockInventory)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [stockRangeFilter, setStockRangeFilter] = useState('all')
  const [selectedItems, setSelectedItems] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // Sorting
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  
  const { toast } = useToast()

  // Apply filters, sorting, and pagination
  const filters = {
    search: searchTerm,
    status: statusFilter,
    category: categoryFilter,
    stockRange: stockRangeFilter,
    location: locationFilter
  }

  const filtered = filterInventory(inventory, filters)
  const sorted = sortInventory(filtered, sortBy, sortOrder)
  const totalPages = getTotalPages(sorted.length, itemsPerPage)
  const paginated = paginateInventory(sorted, currentPage, itemsPerPage)

  // Handlers
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast({ title: 'Inventory refreshed', description: 'Stock levels have been updated' })
    }, 1000)
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

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

  const handleAddProduct = (newProduct) => {
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
    toast({ title: 'Product added', description: `${product.name} has been added to inventory` })
    return product
  }

  const handleEditProduct = (updatedProduct) => {
    const updated = inventory.map(item => {
      if (item.id === updatedProduct.id) {
        const stock = parseInt(updatedProduct.stock)
        const reserved = parseInt(updatedProduct.reserved)
        const reorderPoint = parseInt(updatedProduct.reorderPoint)
        
        let status = 'in_stock'
        if (stock === 0) status = 'out_of_stock'
        else if (stock <= reorderPoint) status = 'low_stock'

        return {
          ...updatedProduct,
          stock,
          reserved,
          available: stock - reserved,
          reorderPoint,
          status,
          unitCost: parseFloat(updatedProduct.unitCost),
          lastUpdated: new Date().toISOString()
        }
      }
      return item
    })

    setInventory(updated)
    toast({ title: 'Product updated', description: 'Product details have been saved' })
  }

  const handleDeleteProduct = (product) => {
    setInventory(inventory.filter(item => item.id !== product.id))
    toast({ title: 'Product deleted', description: `${product.name} has been removed` })
  }

  const handleAdjustStock = (product, adjustmentType, quantity, reason) => {
    const qty = parseInt(quantity)
    const updated = inventory.map(item => {
      if (item.id === product.id) {
        let newStock = item.stock
        
        if (adjustmentType === 'add') newStock += qty
        else if (adjustmentType === 'remove') newStock -= qty
        else if (adjustmentType === 'set') newStock = qty
        
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
    toast({ 
      title: 'Stock adjusted', 
      description: `${product.name}: ${adjustmentType} ${qty} units - ${reason}` 
    })
  }

  const handleBulkDelete = () => {
    setInventory(inventory.filter(item => !selectedItems.includes(item.id)))
    toast({ 
      title: 'Bulk delete completed', 
      description: `${selectedItems.length} items have been removed` 
    })
    setSelectedItems([])
  }

  const handleBulkAdjust = (adjustmentType, quantity, reason) => {
    const qty = parseInt(quantity)
    const updated = inventory.map(item => {
      if (selectedItems.includes(item.id)) {
        let newStock = item.stock
        
        if (adjustmentType === 'add') newStock += qty
        else if (adjustmentType === 'remove') newStock -= qty
        else if (adjustmentType === 'set') newStock = qty
        
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
    toast({ 
      title: 'Bulk adjustment completed', 
      description: `${selectedItems.length} items adjusted: ${adjustmentType} ${qty} units` 
    })
    setSelectedItems([])
  }

  const handleExport = () => {
    const selected = selectedItems.length > 0 
      ? inventory.filter(item => selectedItems.includes(item.id))
      : sorted
    
    toast({ title: 'Export started', description: `Exporting ${selected.length} items as CSV...` })
  }

  const handleSelectAll = () => {
    if (selectedItems.length === paginated.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(paginated.map(item => item.id))
    }
  }

  const handleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const resetFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setCategoryFilter('all')
    setLocationFilter('all')
    setStockRangeFilter('all')
    setCurrentPage(1)
  }

  return {
    // State
    inventory,
    searchTerm,
    statusFilter,
    categoryFilter,
    locationFilter,
    stockRangeFilter,
    selectedItems,
    isRefreshing,
    currentPage,
    itemsPerPage,
    sortBy,
    sortOrder,
    
    // Computed
    filteredInventory: filtered,
    sortedInventory: sorted,
    paginatedInventory: paginated,
    totalPages,
    totalItems: sorted.length,
    
    // Setters
    setSearchTerm,
    setStatusFilter,
    setCategoryFilter,
    setLocationFilter,
    setStockRangeFilter,
    setCurrentPage,
    setItemsPerPage,
    
    // Handlers
    handleRefresh,
    handleSort,
    handleQuickAdjust,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleAdjustStock,
    handleBulkDelete,
    handleBulkAdjust,
    handleExport,
    handleSelectAll,
    handleSelectItem,
    resetFilters
  }
}
