import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useSyncLogs } from './hooks/useSyncLogs'
import { platformStatus, mockActiveAlerts, analyticsData } from './data/mockData'
import { exportLogs } from './utils/logHelpers'
import { DEFAULT_VISIBLE_COLUMNS, AUTO_REFRESH_INTERVAL } from './utils/constants'

// Import UI components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'
import {
  Search, RefreshCw, Download, Filter, CheckCircle2, XCircle, Clock, AlertTriangle,
  FileText, Calendar, Activity, ChevronDown, ChevronUp, RotateCcw, Trash2, Eye,
  PlayCircle, PauseCircle, Info as InfoIcon, Wifi, WifiOff, Terminal, ArrowUpDown,
  ArrowUp, ArrowDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Bug, AlertCircle, Columns, Bell, FileJson, FileSpreadsheet, TrendingUp,
  BarChart3, PieChart, LineChart, Save, X as XIcon, Flame, Zap, Sparkles
} from 'lucide-react'

// Import helpers
import { 
  getLevelIcon, getLevelBadge, getStatusIcon, getStatusBadge, formatTimestamp 
} from './utils/logHelpers'
import { 
  STATUS_OPTIONS, LEVEL_OPTIONS, TYPE_OPTIONS, DATE_RANGE_OPTIONS, ITEMS_PER_PAGE_OPTIONS 
} from './utils/constants'

export default function SyncLogs() {
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
  const {
    logs, allLogs, filters, pagination, sort, selectedLogs, expandedLogs, stats, newLogsCount,
    handleFilterChange, handleSort, handlePageChange, handleItemsPerPageChange,
    handleSelectLog, handleSelectAll, handleToggleExpand, handleRefresh,
    handleBulkDelete, handleBulkRetry, handleRetry, handleClearFilters,
    handleQuickFilter, setNewLogsCount
  } = useSyncLogs()

  // Local state
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [showPlatformStatus, setShowPlatformStatus] = useState(true)
  const [visibleColumns, setVisibleColumns] = useState(DEFAULT_VISIBLE_COLUMNS)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showAlerts, setShowAlerts] = useState(true)
  const [savedSearches, setSavedSearches] = useState([
    { id: 1, name: 'Amazon Errors', query: 'platform:Amazon AND status:error' },
    { id: 2, name: 'Critical Issues', query: 'level:critical' },
    { id: 3, name: 'Slow Syncs', query: 'duration:>5s' }
  ])
  const [activeAlerts, setActiveAlerts] = useState(mockActiveAlerts)
  
  // New features state
  const [isLiveStreaming, setIsLiveStreaming] = useState(false)
  const [filterPresets, setFilterPresets] = useState([
  const [newLogsCount, setNewLogsCount] = useState(0)
    { id: 1, name: "Today's Errors", filters: { statusFilter: 'error', dateRange: 'today' } },
    { id: 2, name: 'Critical Issues', filters: { levelFilter: 'critical' } },
    { id: 3, name: 'Slow Syncs', filters: { statusFilter: 'all', dateRange: 'today' } },
    { id: 4, name: 'Amazon Only', filters: { platformFilter: 'Amazon' } }
  ])

  // Helper function to check if log is hot (high frequency errors)
  const isHotLog = (log) => {
    // Check if same platform+type has multiple errors recently
    const recentErrors = allLogs.filter(l => 
      l.platform === log.platform && 
      l.type === log.type && 
      l.status === 'error' &&
      new Date() - new Date(l.timestamp) < 10 * 60 * 1000 // last 10 min
    )
    return recentErrors.length >= 3
  }

  // Helper function to check if log is new
  const isNewLog = (log) => {
    const logTime = new Date(log.timestamp)
    const now = new Date()
    return (now - logTime) < 5 * 60 * 1000 // last 5 min
  }

  // Helper function to check if log is slow
  const isSlowLog = (log) => {
    return log.durationSeconds > 5 // more than 5 seconds
  }

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        handleRefresh(false)
      }, AUTO_REFRESH_INTERVAL)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  // Live streaming effect
  useEffect(() => {
    if (isLiveStreaming) {
      const interval = setInterval(() => {
        // Simulate new log arrival
        const shouldAddLog = Math.random() > 0.7 // 30% chance
        if (shouldAddLog) {
          setNewLogsCount(prev => prev + 1)
        }
      }, 5000) // check every 5 seconds
      return () => clearInterval(interval)
    }
  }, [isLiveStreaming])

  // Handlers
  const onRefresh = () => {
    const result = handleRefresh()
    toast({ title: result.message })
  }

  const onBulkDelete = () => {
    const result = handleBulkDelete()
    toast({ title: result.message })
  }

  const onBulkRetry = () => {
    const result = handleBulkRetry()
    toast({ title: result.message })
  }

  const onRetry = (logId) => {
    const result = handleRetry(logId)
    toast({ title: result.message })
  }

  const onExport = (format) => {
    const logsToExport = selectedLogs.length > 0
      ? allLogs.filter(log => selectedLogs.includes(log.id))
      : allLogs
    
    const data = exportLogs(logsToExport, format)
    toast({
      title: `Export started (${format.toUpperCase()})`,
      description: `Downloading ${logsToExport.length} logs as ${format.toUpperCase()}...`
    })
  }

  const onQuickFilter = (filterType) => {
    handleQuickFilter(filterType)
    const messages = {
      errors: 'Showing only errors',
      warnings: 'Showing only warnings',
      critical: 'Showing only critical logs',
      retryable: 'Showing only retryable logs',
      clear: 'All filters cleared'
    }
    toast({ title: messages[filterType] })
  }

  const toggleColumn = (column) => {
    setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }))
  }

  const onAcknowledgeAlert = (alertId) => {
    setActiveAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ))
    toast({ title: 'Alert acknowledged' })
  }

  const onSaveSearch = () => {
    const name = prompt('Enter search name:')
    if (name) {
      const newSearch = {
        id: savedSearches.length + 1,
        name,
        query: filters.searchTerm
      }
      setSavedSearches(prev => [...prev, newSearch])
      toast({ title: 'Search saved successfully' })
    }
  }

  const onLoadSearch = (query) => {
    handleFilterChange('searchTerm', query)
    toast({ title: 'Search loaded' })
  }

  // New feature handlers
  const toggleLiveStreaming = () => {
    setIsLiveStreaming(prev => !prev)
    toast({ 
      title: isLiveStreaming ? 'Live streaming stopped' : 'Live streaming started',
      description: isLiveStreaming ? 'Logs will no longer update automatically' : 'New logs will appear automatically'
    })
  }

  const onSaveFilterPreset = () => {
    const name = prompt('Enter preset name:')
    if (name) {
      const newPreset = {
        id: filterPresets.length + 1,
        name,
        filters: {
          statusFilter: filters.statusFilter,
          levelFilter: filters.levelFilter,
          typeFilter: filters.typeFilter,
          platformFilter: filters.platformFilter,
          dateRange: filters.dateRange
        }
      }
      setFilterPresets(prev => [...prev, newPreset])
      toast({ title: 'Filter preset saved successfully' })
    }
  }

  const onLoadFilterPreset = (preset) => {
    Object.entries(preset.filters).forEach(([key, value]) => {
      handleFilterChange(key, value)
    })
    toast({ title: `Loaded preset: ${preset.name}` })
  }

  const onDeleteFilterPreset = (presetId) => {
    setFilterPresets(prev => prev.filter(p => p.id !== presetId))
    toast({ title: 'Preset deleted' })
  }

  const getSortIcon = (field) => {
    if (sort.sortBy !== field) return <ArrowUpDown className="h-4 w-4 ml-1" />
    return sort.sortOrder === 'asc'
      ? <ArrowUp className="h-4 w-4 ml-1" />
      : <ArrowDown className="h-4 w-4 ml-1" />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sync Logs</h1>
          <p className="text-gray-500">Monitor and manage all platform synchronization logs</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={isLiveStreaming ? "default" : "outline"} 
            size="sm" 
            onClick={toggleLiveStreaming}
            className={isLiveStreaming ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {isLiveStreaming ? (
              <>
                <div className="h-2 w-2 rounded-full bg-white animate-pulse mr-2" />
                LIVE
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4 mr-2" />
                Start Live
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowAnalytics(!showAnalytics)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            {showAnalytics ? 'Hide' : 'Show'} Analytics
          </Button>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Active Alerts */}
      {showAlerts && activeAlerts.filter(a => !a.acknowledged).length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold text-red-900">
                  Active Alerts ({activeAlerts.filter(a => !a.acknowledged).length})
                </h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowAlerts(false)}>
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {activeAlerts.filter(a => !a.acknowledged).map(alert => (
                <div key={alert.id} className="flex items-start justify-between p-3 bg-white rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={alert.severity === 'critical' ? 'bg-red-900 text-white' : 'bg-yellow-100 text-yellow-800'}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{alert.platform}</span>
                    </div>
                    <p className="text-sm text-gray-700">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatTimestamp(alert.timestamp)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onAcknowledgeAlert(alert.id)}>
                      Acknowledge
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toast({ title: 'View Details', description: 'Loading details...' })}>
                      View Logs
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Dashboard */}
      {showAnalytics && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Analytics & Trends
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Success Rate Trend */}
              <Card>
                <CardContent className="pt-6">
                  <h4 className="text-sm font-medium mb-3">Success Rate (7 Days)</h4>
                  <div className="space-y-2">
                    {analyticsData.successRate.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{item.date.slice(5)}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500" 
                              style={{ width: `${item.rate}%` }}
                            />
                          </div>
                          <span className="font-medium">{item.rate}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Avg Sync Duration */}
              <Card>
                <CardContent className="pt-6">
                  <h4 className="text-sm font-medium mb-3">Avg Sync Duration</h4>
                  <div className="space-y-2">
                    {analyticsData.syncDuration.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{item.platform}</span>
                        <span className="font-medium">{item.avg}s</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Errors by Platform */}
              <Card>
                <CardContent className="pt-6">
                  <h4 className="text-sm font-medium mb-3">Errors by Platform</h4>
                  <div className="space-y-2">
                    {analyticsData.errorsByPlatform.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{item.platform}</span>
                        <Badge variant="destructive">{item.errors}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-time Notification */}
      {newLogsCount > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600 animate-pulse" />
                <span className="font-medium text-blue-900">
                  {newLogsCount} new log{newLogsCount > 1 ? 's' : ''} available
                </span>
              </div>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
                handleRefresh(false)
                setNewLogsCount(0)
              }}>
                Refresh to view
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Filters & Filter Presets */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium mr-2">Quick Filters:</p>
            <Button variant="outline" size="sm" onClick={() => onQuickFilter('errors')}>
              <XCircle className="h-4 w-4 mr-1 text-red-600" />
              Errors Only
            </Button>
            <Button variant="outline" size="sm" onClick={() => onQuickFilter('warnings')}>
              <AlertTriangle className="h-4 w-4 mr-1 text-yellow-600" />
              Warnings Only
            </Button>
            <Button variant="outline" size="sm" onClick={() => onQuickFilter('critical')}>
              <AlertCircle className="h-4 w-4 mr-1 text-red-900" />
              Critical Only
            </Button>
            <Button variant="outline" size="sm" onClick={() => onQuickFilter('retryable')}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Retryable
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onQuickFilter('clear')}>
              <XIcon className="h-4 w-4 mr-1" />
              Clear All Filters
            </Button>
          </div>

          {/* Filter Presets */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium">Filter Presets:</p>
              <Button variant="outline" size="sm" onClick={onSaveFilterPreset}>
                <Save className="h-4 w-4 mr-1" />
                Save Current
              </Button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {filterPresets.map(preset => (
                <div key={preset.id} className="flex items-center gap-1">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => onLoadFilterPreset(preset)}
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {preset.name}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onDeleteFilterPreset(preset.id)}
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Status Cards */}
      {showPlatformStatus && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(platformStatus).map(([platform, status]) => (
            <Card key={platform} className={status.connected ? 'border-green-200' : 'border-red-200'}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {status.connected ? (
                      <Wifi className="h-4 w-4 text-green-600" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm font-medium">{platform}</span>
                  </div>
                  <Badge variant={status.connected ? 'default' : 'destructive'} className="text-xs">
                    {status.connected ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500">Last sync: {status.lastSync}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Logs</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Activity className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Success</p>
                <p className="text-2xl font-bold text-green-600">{stats.success}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Warnings</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.warnings}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Errors</p>
                <p className="text-2xl font-bold text-red-600">{stats.errors}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Critical</p>
                <p className="text-2xl font-bold text-red-900">{stats.critical}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-900" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Advanced Search */}
            <div className="lg:col-span-2">
              <label className="text-sm font-medium mb-2 block">Advanced Search</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="e.g., platform:Amazon AND status:error"
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={onSaveSearch}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
              {savedSearches.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className="text-xs text-gray-500">Saved:</span>
                  {savedSearches.map(search => (
                    <Button
                      key={search.id}
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => onLoadSearch(search.query)}
                    >
                      {search.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Select value={filters.dateRange} onValueChange={(val) => handleFilterChange('dateRange', val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATE_RANGE_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filters.statusFilter} onValueChange={(val) => handleFilterChange('statusFilter', val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Level Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Level</label>
              <Select value={filters.levelFilter} onValueChange={(val) => handleFilterChange('levelFilter', val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVEL_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <Select value={filters.typeFilter} onValueChange={(val) => handleFilterChange('typeFilter', val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Platform Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Platform</label>
              <Select value={filters.platformFilter} onValueChange={(val) => handleFilterChange('platformFilter', val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  {Object.keys(platformStatus).map(platform => (
                    <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Custom Date Range Picker */}
          {filters.dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">From Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => toast({ title: 'Filter Applied', description: 'Data filtered' })}>
                      <Calendar className="h-4 w-4 mr-2" />
                      {filters.customDateFrom ? format(filters.customDateFrom, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <CalendarComponent
                      mode="single"
                      selected={filters.customDateFrom}
                      onSelect={(date) => handleFilterChange('customDateFrom', date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">To Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => toast({ title: 'Filter Applied', description: 'Data filtered' })}>
                      <Calendar className="h-4 w-4 mr-2" />
                      {filters.customDateTo ? format(filters.customDateTo, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <CalendarComponent
                      mode="single"
                      selected={filters.customDateTo}
                      onSelect={(date) => handleFilterChange('customDateTo', date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Sort Controls */}
          <Button variant="outline" size="sm" onClick={() => handleSort('timestamp')}>
            Timestamp {getSortIcon('timestamp')}
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSort('status')}>
            Status {getSortIcon('status')}
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSort('platform')}>
            Platform {getSortIcon('platform')}
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSort('duration')}>
            Duration {getSortIcon('duration')}
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSort('level')}>
            Level {getSortIcon('level')}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Column Toggle */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                <Columns className="h-4 w-4 mr-2" />
                Columns
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-3">
                <p className="font-medium">Toggle Columns</p>
                {Object.entries(visibleColumns).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Checkbox
                      checked={value}
                      onCheckedChange={() => toggleColumn(key)}
                    />
                    <span className="text-sm capitalize">{key}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Export Menu */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export {selectedLogs.length > 0 && `(${selectedLogs.length})`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => onExport('csv')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => onExport('json')}>
                  <FileJson className="h-4 w-4 mr-2" />
                  Export as JSON
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => onExport('excel')}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export as Excel
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => onExport('pdf')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Bulk Actions */}
          {selectedLogs.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={onBulkRetry}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Retry ({selectedLogs.length})
              </Button>
              <Button variant="destructive" size="sm" onClick={onBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedLogs.length})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Logs Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Select All */}
            <div className="flex items-center gap-2 pb-4 border-b">
              <Checkbox
                checked={selectedLogs.length === logs.length && logs.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm font-medium">
                {selectedLogs.length > 0 ? `${selectedLogs.length} selected` : 'Select all'}
              </span>
            </div>

            {/* Log Items */}
            {logs.map(log => {
              const isExpanded = expandedLogs.includes(log.id)
              const isSelected = selectedLogs.includes(log.id)
              const StatusIcon = getStatusIcon(log.status)
              const LevelIcon = getLevelIcon(log.level)
              const statusBadge = getStatusBadge(log.status)
              const levelBadge = getLevelBadge(log.level)
              
              // Visual indicators
              const hot = isHotLog(log)
              const isNew = isNewLog(log)
              const slow = isSlowLog(log)

              return (
                <div key={log.id} className={`border rounded-lg p-4 ${isSelected ? 'bg-blue-50 border-blue-200' : ''}`}>
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleSelectLog(log.id)}
                    />

                    {/* Main Content */}
                    <div className="flex-1 space-y-2">
                      {/* Header Row */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Visual Indicators */}
                          {hot && (
                            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                              <Flame className="h-3 w-3 mr-1" />
                              HOT
                            </Badge>
                          )}
                          {isNew && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <Sparkles className="h-3 w-3 mr-1" />
                              NEW
                            </Badge>
                          )}
                          {slow && (
                            <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                              <Zap className="h-3 w-3 mr-1" />
                              SLOW
                            </Badge>
                          )}
                          
                          {visibleColumns.status && (
                            <Badge className={statusBadge.className}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {log.status.toUpperCase()}
                            </Badge>
                          )}
                          {visibleColumns.level && (
                            <Badge className={levelBadge.className}>
                              <LevelIcon className="h-3 w-3 mr-1" />
                              {log.level.toUpperCase()}
                            </Badge>
                          )}
                          {visibleColumns.platform && (
                            <Badge variant="outline">{log.platform}</Badge>
                          )}
                          {visibleColumns.type && (
                            <Badge variant="secondary">{log.type}</Badge>
                          )}
                        </div>
                        {visibleColumns.timestamp && (
                          <span className="text-sm text-gray-500">{formatTimestamp(log.timestamp)}</span>
                        )}
                      </div>

                      {/* Message */}
                      {visibleColumns.message && (
                        <p className="text-sm">{log.message}</p>
                      )}

                      {/* Details Row */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {visibleColumns.duration && (
                          <span>Duration: {log.duration}</span>
                        )}
                        {visibleColumns.details && (
                          <>
                            <span>Synced: {log.details.synced}</span>
                            {log.details.failed > 0 && <span className="text-red-600">Failed: {log.details.failed}</span>}
                            {log.details.skipped > 0 && <span className="text-yellow-600">Skipped: {log.details.skipped}</span>}
                          </>
                        )}
                        {visibleColumns.requestId && (
                          <span className="font-mono text-xs">{log.requestId}</span>
                        )}
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                          {/* Request Details */}
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Request Details</h4>
                            <div className="text-sm space-y-1">
                              <p><span className="font-medium">Method:</span> {log.requestData?.method || 'N/A'}</p>
                              <p><span className="font-medium">Endpoint:</span> {log.endpoint}</p>
                              {log.requestData?.payload && (
                                <div>
                                  <span className="font-medium">Payload:</span>
                                  <pre className="mt-1 p-2 bg-white rounded text-xs overflow-auto">
                                    {JSON.stringify(log.requestData.payload, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Response Details */}
                          {log.responseData && (
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Response Details</h4>
                              <div className="text-sm space-y-1">
                                <p><span className="font-medium">Status Code:</span> {log.responseData.statusCode}</p>
                                <div>
                                  <span className="font-medium">Body:</span>
                                  <pre className="mt-1 p-2 bg-white rounded text-xs overflow-auto">
                                    {JSON.stringify(log.responseData.body, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Performance Metrics */}
                          {log.performanceMetrics && (
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Performance Metrics</h4>
                              <div className="text-sm space-y-1">
                                <p><span className="font-medium">Network Latency:</span> {log.performanceMetrics.networkLatency}s</p>
                                <p><span className="font-medium">Processing Time:</span> {log.performanceMetrics.processingTime}s</p>
                                <p><span className="font-medium">Queue Time:</span> {log.performanceMetrics.queueTime}s</p>
                              </div>
                            </div>
                          )}

                          {/* Error Details */}
                          {log.errorDetails && (
                            <div>
                              <h4 className="font-semibold text-sm mb-2 text-red-600">Error Details</h4>
                              <div className="text-sm space-y-1">
                                {log.errorDetails.error && <p><span className="font-medium">Error:</span> {log.errorDetails.error}</p>}
                                {log.errorDetails.message && <p><span className="font-medium">Message:</span> {log.errorDetails.message}</p>}
                                {log.errorDetails.code && <p><span className="font-medium">Code:</span> {log.errorDetails.code}</p>}
                                {log.errorDetails.stackTrace && (
                                  <div>
                                    <span className="font-medium">Stack Trace:</span>
                                    <pre className="mt-1 p-2 bg-white rounded text-xs overflow-auto">
                                      {log.errorDetails.stackTrace}
                                    </pre>
                                  </div>
                                )}
                                {log.errorDetails.warnings && (
                                  <div>
                                    <span className="font-medium">Warnings:</span>
                                    <ul className="mt-1 list-disc list-inside">
                                      {log.errorDetails.warnings.map((warning, idx) => (
                                        <li key={idx} className="text-yellow-700">{warning}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {visibleColumns.actions && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleExpand(log.id)}
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        {log.retryable && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRetry(log.id)}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {logs.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No logs found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, allLogs.length)} of{' '}
            {allLogs.length} logs
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Select value={pagination.itemsPerPage.toString()} onValueChange={(val) => handleItemsPerPageChange(parseInt(val))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ITEMS_PER_PAGE_OPTIONS.map(num => (
                <SelectItem key={num} value={num.toString()}>{num} per page</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={pagination.currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-4 text-sm">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
