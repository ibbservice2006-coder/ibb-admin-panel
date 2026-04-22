export const CATEGORIES = ['Electronics', 'Accessories', 'Furniture', 'Clothing']

export const LOCATIONS = ['Warehouse A', 'Warehouse B', 'Warehouse C']

export const STOCK_STATUSES = [
  { value: 'all', label: 'All Status' },
  { value: 'in_stock', label: 'In Stock' },
  { value: 'low_stock', label: 'Low Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' }
]

export const STOCK_RANGES = [
  { value: 'all', label: 'All Ranges' },
  { value: '0-50', label: '0-50 units' },
  { value: '51-100', label: '51-100 units' },
  { value: '101-200', label: '101-200 units' },
  { value: '200+', label: '200+ units' }
]

export const SORT_OPTIONS = [
  { value: 'sku', label: 'SKU' },
  { value: 'name', label: 'Name' },
  { value: 'category', label: 'Category' },
  { value: 'stock', label: 'Stock' },
  { value: 'status', label: 'Status' }
]

export const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100]

export const MOVEMENT_TYPES = [
  { value: 'in', label: 'Stock In', color: 'green' },
  { value: 'out', label: 'Stock Out', color: 'red' },
  { value: 'transfer', label: 'Transfer', color: 'blue' }
]

export const ADJUSTMENT_ACTIONS = [
  { value: 'add', label: 'Add Stock' },
  { value: 'remove', label: 'Remove Stock' },
  { value: 'set', label: 'Set Stock' }
]

export const ADJUSTMENT_REASONS = [
  'Stock Received',
  'Customer Return',
  'Damaged',
  'Lost',
  'Inventory Correction',
  'Other'
]

export const FILTER_PRESETS = [
  {
    id: 'low-stock',
    name: 'Low Stock Items',
    filters: { status: 'low_stock' }
  },
  {
    id: 'out-of-stock',
    name: 'Out of Stock',
    filters: { status: 'out_of_stock' }
  },
  {
    id: 'electronics',
    name: 'Electronics',
    filters: { category: 'Electronics' }
  },
  {
    id: 'warehouse-a',
    name: 'Warehouse A',
    filters: { location: 'Warehouse A' }
  }
]
