import { useState, useEffect, useMemo } from 'react'
import { mockLogs } from '../data/mockData'
import { filterLogs, sortLogs, calculateStats } from '../utils/logHelpers'
import { DEFAULT_FILTERS, DEFAULT_PAGINATION, DEFAULT_SORT, REALTIME_CHECK_INTERVAL } from '../utils/constants'

export function useSyncLogs() {
  const [logs, setLogs] = useState(mockLogs)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION)
  const [sort, setSort] = useState(DEFAULT_SORT)
  const [selectedLogs, setSelectedLogs] = useState([])
  const [expandedLogs, setExpandedLogs] = useState([])
  const [newLogsCount, setNewLogsCount] = useState(0)
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const randomCount = Math.floor(Math.random() * 5)
      if (randomCount > 0) {
        setNewLogsCount(prev => prev + randomCount)
      }
    }, REALTIME_CHECK_INTERVAL)
    
    return () => clearInterval(interval)
  }, [])
  
  // Filter logs
  const filteredLogs = useMemo(() => {
    return filterLogs(logs, filters)
  }, [logs, filters])
  
  // Sort logs
  const sortedLogs = useMemo(() => {
    return sortLogs(filteredLogs, sort.sortBy, sort.sortOrder)
  }, [filteredLogs, sort])
  
  // Paginate logs
  const paginatedLogs = useMemo(() => {
    const start = (pagination.currentPage - 1) * pagination.itemsPerPage
    const end = start + pagination.itemsPerPage
    return sortedLogs.slice(start, end)
  }, [sortedLogs, pagination])
  
  // Calculate stats
  const stats = useMemo(() => {
    return calculateStats(filteredLogs)
  }, [filteredLogs])
  
  // Calculate total pages
  const totalPages = Math.ceil(sortedLogs.length / pagination.itemsPerPage)
  
  // Handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 })) // Reset to first page
  }
  
  const handleSort = (sortBy) => {
    setSort(prev => ({
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }))
  }
  
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }
  
  const handleItemsPerPageChange = (itemsPerPage) => {
    setPagination({ currentPage: 1, itemsPerPage })
  }
  
  const handleSelectLog = (logId) => {
    setSelectedLogs(prev =>
      prev.includes(logId)
        ? prev.filter(id => id !== logId)
        : [...prev, logId]
    )
  }
  
  const handleSelectAll = () => {
    if (selectedLogs.length === paginatedLogs.length) {
      setSelectedLogs([])
    } else {
      setSelectedLogs(paginatedLogs.map(log => log.id))
    }
  }
  
  const handleToggleExpand = (logId) => {
    setExpandedLogs(prev =>
      prev.includes(logId)
        ? prev.filter(id => id !== logId)
        : [...prev, logId]
    )
  }
  
  const handleRefresh = (showNotification = true) => {
    // Simulate refresh
    setLogs([...mockLogs])
    setNewLogsCount(0)
    if (showNotification) {
      return { success: true, message: 'Logs refreshed successfully' }
    }
  }
  
  const handleBulkDelete = () => {
    setLogs(prev => prev.filter(log => !selectedLogs.includes(log.id)))
    setSelectedLogs([])
    return { success: true, message: `Deleted ${selectedLogs.length} logs` }
  }
  
  const handleBulkRetry = () => {
    return { success: true, message: `Retrying ${selectedLogs.length} logs` }
  }
  
  const handleRetry = (logId) => {
    return { success: true, message: 'Retry initiated' }
  }
  
  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS)
  }
  
  const handleQuickFilter = (filterType) => {
    switch (filterType) {
      case 'errors':
        setFilters(prev => ({ ...prev, statusFilter: 'error' }))
        break
      case 'warnings':
        setFilters(prev => ({ ...prev, statusFilter: 'warning' }))
        break
      case 'critical':
        setFilters(prev => ({ ...prev, levelFilter: 'critical' }))
        break
      case 'retryable':
        setFilters(prev => ({ ...prev, statusFilter: 'error' }))
        break
      case 'clear':
        handleClearFilters()
        break
    }
  }
  
  return {
    // Data
    logs: paginatedLogs,
    allLogs: sortedLogs,
    filters,
    pagination: { ...pagination, totalPages },
    sort,
    selectedLogs,
    expandedLogs,
    stats,
    newLogsCount,
    
    // Handlers
    handleFilterChange,
    handleSort,
    handlePageChange,
    handleItemsPerPageChange,
    handleSelectLog,
    handleSelectAll,
    handleToggleExpand,
    handleRefresh,
    handleBulkDelete,
    handleBulkRetry,
    handleRetry,
    handleClearFilters,
    handleQuickFilter,
    setNewLogsCount
  }
}
