// Default filter values
export const DEFAULT_FILTERS = {
  searchTerm: '',
  statusFilter: 'all',
  levelFilter: 'all',
  typeFilter: 'all',
  platformFilter: 'all',
  dateRange: 'all',
  customDateFrom: null,
  customDateTo: null
}

// Default pagination
export const DEFAULT_PAGINATION = {
  currentPage: 1,
  itemsPerPage: 10
}

// Default sort
export const DEFAULT_SORT = {
  sortBy: 'timestamp',
  sortOrder: 'desc'
}

// Default visible columns
export const DEFAULT_VISIBLE_COLUMNS = {
  timestamp: true,
  platform: true,
  type: true,
  status: true,
  level: true,
  message: true,
  duration: true,
  details: true,
  requestId: false,
  actions: true
}

// Filter options
export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'success', label: 'Success' },
  { value: 'error', label: 'Error' },
  { value: 'warning', label: 'Warning' },
  { value: 'pending', label: 'Pending' }
]

export const LEVEL_OPTIONS = [
  { value: 'all', label: 'All Levels' },
  { value: 'info', label: 'Info' },
  { value: 'debug', label: 'Debug' },
  { value: 'warning', label: 'Warning' },
  { value: 'error', label: 'Error' },
  { value: 'critical', label: 'Critical' }
]

export const TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'Product Sync', label: 'Product Sync' },
  { value: 'Order Sync', label: 'Order Sync' },
  { value: 'Inventory Sync', label: 'Inventory Sync' },
  { value: 'Payment Sync', label: 'Payment Sync' }
]

export const DATE_RANGE_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'custom', label: 'Custom Range' }
]

export const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100]

// Auto-refresh interval (ms)
export const AUTO_REFRESH_INTERVAL = 30000

// Real-time update check interval (ms)
export const REALTIME_CHECK_INTERVAL = 15000
