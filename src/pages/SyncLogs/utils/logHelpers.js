import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Info as InfoIcon,
  Bug,
  AlertCircle
} from 'lucide-react'

// Get icon for log level
export const getLevelIcon = (level) => {
  const icons = {
    info: InfoIcon,
    debug: Bug,
    warning: AlertTriangle,
    error: XCircle,
    critical: AlertCircle
  }
  return icons[level] || InfoIcon
}

// Get badge config for log level
export const getLevelBadge = (level) => {
  const config = {
    info: {
      variant: 'default',
      className: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    debug: {
      variant: 'outline',
      className: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    warning: {
      variant: 'secondary',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    error: {
      variant: 'destructive',
      className: 'bg-red-100 text-red-800 border-red-200'
    },
    critical: {
      variant: 'destructive',
      className: 'bg-red-900 text-white border-red-900'
    }
  }
  return config[level] || config.info
}

// Get icon for status
export const getStatusIcon = (status) => {
  const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    pending: Clock
  }
  return icons[status] || Clock
}

// Get badge config for status
export const getStatusBadge = (status) => {
  const config = {
    success: {
      variant: 'default',
      className: 'bg-green-100 text-green-800 border-green-200'
    },
    error: {
      variant: 'destructive',
      className: 'bg-red-100 text-red-800 border-red-200'
    },
    warning: {
      variant: 'secondary',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    pending: {
      variant: 'outline',
      className: 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }
  return config[status] || config.pending
}

// Calculate statistics from logs
export const calculateStats = (logs) => {
  const total = logs.length
  const success = logs.filter(log => log.status === 'success').length
  const warnings = logs.filter(log => log.status === 'warning').length
  const errors = logs.filter(log => log.status === 'error').length
  const critical = logs.filter(log => log.level === 'critical').length
  
  return { total, success, warnings, errors, critical }
}

// Filter logs based on criteria
export const filterLogs = (logs, filters) => {
  let filtered = [...logs]
  
  // Search filter
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase()
    filtered = filtered.filter(log =>
      log.message.toLowerCase().includes(term) ||
      log.platform.toLowerCase().includes(term) ||
      log.requestId.toLowerCase().includes(term)
    )
  }
  
  // Status filter
  if (filters.statusFilter && filters.statusFilter !== 'all') {
    filtered = filtered.filter(log => log.status === filters.statusFilter)
  }
  
  // Level filter
  if (filters.levelFilter && filters.levelFilter !== 'all') {
    filtered = filtered.filter(log => log.level === filters.levelFilter)
  }
  
  // Type filter
  if (filters.typeFilter && filters.typeFilter !== 'all') {
    filtered = filtered.filter(log => log.type === filters.typeFilter)
  }
  
  // Platform filter
  if (filters.platformFilter && filters.platformFilter !== 'all') {
    filtered = filtered.filter(log => log.platform === filters.platformFilter)
  }
  
  // Date range filter
  if (filters.dateRange && filters.dateRange !== 'all') {
    const now = new Date()
    const logDate = (log) => new Date(log.timestamp)
    
    switch (filters.dateRange) {
      case 'today':
        filtered = filtered.filter(log => {
          const diff = now - logDate(log)
          return diff < 24 * 60 * 60 * 1000
        })
        break
      case 'last7days':
        filtered = filtered.filter(log => {
          const diff = now - logDate(log)
          return diff < 7 * 24 * 60 * 60 * 1000
        })
        break
      case 'last30days':
        filtered = filtered.filter(log => {
          const diff = now - logDate(log)
          return diff < 30 * 24 * 60 * 60 * 1000
        })
        break
      case 'custom':
        if (filters.customDateFrom && filters.customDateTo) {
          filtered = filtered.filter(log => {
            const date = logDate(log)
            return date >= filters.customDateFrom && date <= filters.customDateTo
          })
        }
        break
    }
  }
  
  return filtered
}

// Sort logs
export const sortLogs = (logs, sortBy, sortOrder) => {
  const sorted = [...logs]
  
  sorted.sort((a, b) => {
    let aVal, bVal
    
    switch (sortBy) {
      case 'timestamp':
        aVal = new Date(a.timestamp)
        bVal = new Date(b.timestamp)
        break
      case 'status':
        aVal = a.status
        bVal = b.status
        break
      case 'platform':
        aVal = a.platform
        bVal = b.platform
        break
      case 'duration':
        aVal = a.durationSeconds
        bVal = b.durationSeconds
        break
      case 'type':
        aVal = a.type
        bVal = b.type
        break
      case 'level':
        const levelOrder = { info: 1, debug: 2, warning: 3, error: 4, critical: 5 }
        aVal = levelOrder[a.level]
        bVal = levelOrder[b.level]
        break
      default:
        return 0
    }
    
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
    return 0
  })
  
  return sorted
}

// Format timestamp
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Parse advanced search query
export const parseAdvancedSearch = (query) => {
  // Simple parser for: platform:Amazon AND status:error
  const filters = {}
  const parts = query.split(/\s+AND\s+|\s+OR\s+/i)
  
  parts.forEach(part => {
    const match = part.match(/(\w+):(\w+)/)
    if (match) {
      const [, field, value] = match
      filters[field] = value
    }
  })
  
  return filters
}

// Export logs to different formats
export const exportLogs = (logs, format) => {
  switch (format) {
    case 'csv':
      return exportToCSV(logs)
    case 'json':
      return exportToJSON(logs)
    case 'excel':
      return exportToExcel(logs)
    case 'pdf':
      return exportToPDF(logs)
    default:
      return null
  }
}

const exportToCSV = (logs) => {
  const headers = ['Timestamp', 'Platform', 'Type', 'Status', 'Level', 'Message', 'Duration', 'Request ID']
  const rows = logs.map(log => [
    log.timestamp,
    log.platform,
    log.type,
    log.status,
    log.level,
    log.message,
    log.duration,
    log.requestId
  ])
  
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
  return csv
}

const exportToJSON = (logs) => {
  return JSON.stringify(logs, null, 2)
}

const exportToExcel = (logs) => {
  // Placeholder - would need xlsx library
  return exportToCSV(logs)
}

const exportToPDF = (logs) => {
  // Placeholder - would need pdf library
  return exportToJSON(logs)
}
