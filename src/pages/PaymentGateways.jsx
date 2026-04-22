import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Link2,
  Link2Off,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  DollarSign,
  AlertCircle,
  Settings,
  Eye,
  Activity,
  Grid3x3,
  List,
  Download,
  Upload,
  CheckSquare,
  Square,
  Zap,
  Wallet
} from 'lucide-react'

// Helper function to load custom gateways from localStorage
const loadCustomGateways = () => {
  try {
    const stored = localStorage.getItem('customGateways')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    return []
  }
}

// Helper function to save custom gateways to localStorage
const saveCustomGateways = (gateways) => {
  try {
    localStorage.setItem('customGateways', JSON.stringify(gateways))
  } catch (error) {
    console.error('Failed to save custom gateways:', error)
  }
}

export default function PaymentGateways() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingGateway, setEditingGateway] = useState(null)
  const [isAddGatewayTypeOpen, setIsAddGatewayTypeOpen] = useState(false)
  const [editingGatewayType, setEditingGatewayType] = useState(null)
  const [customGateways, setCustomGateways] = useState([])
  const [testingGateways, setTestingGateways] = useState(new Set())
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // New states for additional features
  const [selectedGateways, setSelectedGateways] = useState(new Set())
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [gatewayTypeFilter, setGatewayTypeFilter] = useState('all')
  const [selectedBadgeColor, setSelectedBadgeColor] = useState('bg-blue-500')

  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Load custom gateways from localStorage on mount
  useEffect(() => {
    const loaded = loadCustomGateways()
    setCustomGateways(loaded)
  }, [])

  // Mock data for payment gateways
  const mockGateways = [
    {
      id: 1,
      name: 'Stripe Production',
      type: 'stripe',
      account_id: 'acct_1234567890',
      status: 'connected',
      is_active: true,
      test_mode: false,
      transactions_today: 45,
      volume_today: 12450.00,
      last_transaction: '2024-10-03T08:30:00Z',
      success_rate: 98.5,
      created_at: '2024-01-15T10:00:00Z',
      currency: 'USD',
      supported_methods: ['Credit Card', 'Debit Card']
    },
    {
      id: 2,
      name: 'PayPal Business',
      type: 'paypal',
      account_id: 'paypal_business@example.com',
      status: 'connected',
      is_active: true,
      test_mode: false,
      transactions_today: 28,
      volume_today: 8920.00,
      last_transaction: '2024-10-03T07:15:00Z',
      success_rate: 97.2,
      created_at: '2024-01-20T10:00:00Z',
      currency: 'USD',
      supported_methods: ['PayPal']
    },
    {
      id: 3,
      name: 'Wise Transfer',
      type: 'wise',
      account_id: 'wise_12345',
      status: 'connected',
      is_active: true,
      test_mode: false,
      transactions_today: 12,
      volume_today: 5600.00,
      last_transaction: '2024-10-03T06:00:00Z',
      success_rate: 99.1,
      created_at: '2024-02-01T10:00:00Z',
      currency: 'THB',
      supported_methods: ['Bank Transfer', 'Wise']
    },
    {
      id: 4,
      name: 'Payoneer Gateway',
      type: 'payoneer',
      account_id: 'payoneer_67890',
      status: 'connected',
      is_active: true,
      test_mode: false,
      transactions_today: 8,
      volume_today: 3200.00,
      last_transaction: '2024-10-03T05:30:00Z',
      success_rate: 96.8,
      created_at: '2024-02-15T10:00:00Z',
      currency: 'USD',
      supported_methods: ['Payoneer']
    },
    {
      id: 5,
      name: 'Bank Transfer (Manual)',
      type: 'bank_transfer',
      account_id: 'manual_bank',
      status: 'connected',
      is_active: true,
      test_mode: false,
      transactions_today: 5,
      volume_today: 15000.00,
      last_transaction: '2024-10-02T16:00:00Z',
      success_rate: 100,
      created_at: '2024-01-10T10:00:00Z',
      currency: 'THB',
      supported_methods: ['Bank Transfer']
    },
    {
      id: 6,
      name: 'PromptPay Thailand',
      type: 'promptpay',
      account_id: 'promptpay_th',
      status: 'connected',
      is_active: true,
      test_mode: false,
      transactions_today: 35,
      volume_today: 8500.00,
      last_transaction: '2024-10-03T08:00:00Z',
      success_rate: 99.5,
      created_at: '2024-03-01T10:00:00Z',
      currency: 'THB',
      supported_methods: ['PromptPay']
    },
    {
      id: 7,
      name: 'Credit Card Gateway',
      type: 'credit_card',
      account_id: 'cc_gateway_001',
      status: 'connected',
      is_active: true,
      test_mode: false,
      transactions_today: 52,
      volume_today: 18900.00,
      last_transaction: '2024-10-03T08:45:00Z',
      success_rate: 97.8,
      created_at: '2024-01-05T10:00:00Z',
      currency: 'USD',
      supported_methods: ['Credit Card', 'Debit Card']
    },
    {
      id: 8,
      name: 'TrueMoney Wallet',
      type: 'truemoney',
      account_id: 'truemoney_12345',
      status: 'connected',
      is_active: true,
      test_mode: false,
      transactions_today: 18,
      volume_today: 4200.00,
      last_transaction: '2024-10-03T07:30:00Z',
      success_rate: 98.2,
      created_at: '2024-03-15T10:00:00Z',
      currency: 'THB',
      supported_methods: ['TrueMoney Wallet']
    },
    {
      id: 9,
      name: 'LINE Pay Thailand',
      type: 'line_pay',
      account_id: 'linepay_th_001',
      status: 'connected',
      is_active: true,
      test_mode: false,
      transactions_today: 22,
      volume_today: 6800.00,
      last_transaction: '2024-10-03T07:00:00Z',
      success_rate: 99.0,
      created_at: '2024-04-01T10:00:00Z',
      currency: 'THB',
      supported_methods: ['LINE Pay']
    },
    {
      id: 10,
      name: 'Rabbit LINE Pay',
      type: 'rabbit_line_pay',
      account_id: 'rabbit_lp_001',
      status: 'connected',
      is_active: true,
      test_mode: false,
      transactions_today: 15,
      volume_today: 3900.00,
      last_transaction: '2024-10-03T06:30:00Z',
      success_rate: 98.7,
      created_at: '2024-04-15T10:00:00Z',
      currency: 'THB',
      supported_methods: ['Rabbit LINE Pay']
    }
  ]

  const { data: gateways, isLoading } = useQuery({
    queryKey: ['gateways', { search: searchTerm, status: statusFilter }],
    queryFn: () => {
      let filtered = mockGateways
      
      if (searchTerm) {
        filtered = filtered.filter(g => 
          g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          g.type.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      if (statusFilter !== 'all') {
        filtered = filtered.filter(g => g.status === statusFilter)
      }
      
      if (gatewayTypeFilter !== 'all') {
        filtered = filtered.filter(g => g.type === gatewayTypeFilter)
      }
      
      return Promise.resolve({ items: filtered, total: filtered.length })
    }
  })

  const handleRefresh = () => {
    setIsRefreshing(true)
    queryClient.invalidateQueries(['gateways'])
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleExport = () => {
    toast({ title: 'Exporting gateways...', description: 'CSV file will be downloaded' })
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      toast({ title: 'Importing gateways...', description: `Processing ${file.name}` })
    }
  }

  const handleTestAll = () => {
    toast({ title: 'Testing all gateways...', description: 'Connection tests initiated' })
  }

  const getPlatformColor = (type) => {
    const colors = {
      stripe: 'bg-purple-500',
      paypal: 'bg-blue-500',
      wise: 'bg-green-600',
      payoneer: 'bg-orange-500',
      bank_transfer: 'bg-gray-600',
      promptpay: 'bg-blue-600',
      truemoney: 'bg-orange-600',
      line_pay: 'bg-green-500',
      credit_card: 'bg-indigo-500',
      rabbit_line_pay: 'bg-pink-500'
    }
    
    const customGateway = customGateways.find(g => g.value === type)
    if (customGateway) return customGateway.color
    
    return colors[type] || 'bg-gray-500'
  }

  const getPlatformLabel = (type) => {
    const labels = {
      stripe: 'Stripe',
      paypal: 'PayPal',
      wise: 'Wise',
      payoneer: 'Payoneer',
      bank_transfer: 'Bank Transfer',
      promptpay: 'PromptPay',
      truemoney: 'TrueMoney Wallet',
      line_pay: 'LINE Pay',
      credit_card: 'Credit/Debit Card',
      rabbit_line_pay: 'Rabbit LINE Pay'
    }
    
    const customGateway = customGateways.find(g => g.value === type)
    if (customGateway) return customGateway.label
    
    return labels[type] || type
  }

  // Filter and sort
  const filteredGateways = gateways?.items || []
  
  const sortedGateways = [...filteredGateways].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'status':
        return a.status.localeCompare(b.status)
      case 'transactions':
        return b.transactions_today - a.transactions_today
      default:
        return 0
    }
  })

  // Pagination
  const totalItems = sortedGateways.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedGateways = sortedGateways.slice(startIndex, endIndex)

  const totalGateways = gateways?.total || 0
  const connectedGateways = gateways?.items?.filter(g => g.status === 'connected').length || 0
  const totalTransactions = gateways?.items?.reduce((sum, g) => sum + g.transactions_today, 0) || 0
  const totalVolume = gateways?.items?.reduce((sum, g) => sum + g.volume_today, 0) || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        {/* Row 1: Title */}
        <div>
          <h1 className="text-3xl font-bold">Payment Gateways</h1>
          <p className="text-muted-foreground">
            Manage payment gateway integrations and configurations
          </p>
        </div>

        {/* Row 2: All Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                <Zap className="h-4 w-4 mr-2" />
                Quick Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleTestAll}>
                <Activity className="h-4 w-4 mr-2" />
                Test All Connections
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Toggle */}
          <div className="flex border rounded-md">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Export/Import */}
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" asChild onClick={() => { const input = document.createElement('input'); input.type = 'file'; input.accept = '.csv,.xlsx'; input.onchange = (e) => { if (e.target.files[0]) toast({ title: 'File Imported', description: `${e.target.files[0].name} imported successfully` }) }; input.click() }}>
            <label className="cursor-pointer flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Import
              <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
            </label>
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

          {/* Main Actions - Right Side */}
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setIsAddGatewayTypeOpen(true)}
            className="ml-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Gateway Type
          </Button>
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setEditingGateway(null); setIsFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Connect Gateway
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gateways</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGateways}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedGateways}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions Today</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume Today</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalVolume.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search gateways..."
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
                <SelectItem value="connected">Connected</SelectItem>
                <SelectItem value="disconnected">Disconnected</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>

            <Select value={gatewayTypeFilter} onValueChange={setGatewayTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Gateway Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="wise">Wise</SelectItem>
                <SelectItem value="payoneer">Payoneer</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="promptpay">PromptPay</SelectItem>
                <SelectItem value="credit_card">Credit/Debit Card</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="truemoney">TrueMoney Wallet</SelectItem>
                <SelectItem value="line_pay">LINE Pay</SelectItem>
                <SelectItem value="rabbit_line_pay">Rabbit LINE Pay</SelectItem>
                {customGateways.map(g => (
                  <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="transactions">Transactions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Help Link */}
      <div className="flex items-center justify-between text-sm">
        <a 
          href="https://docs.example.com/payment-gateways" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline flex items-center gap-1"
        >
          <AlertCircle className="h-4 w-4" />
          Need help? View payment gateway documentation
        </a>
        <span className="text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} gateways
        </span>
      </div>

      {/* Gateway Cards */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))
        ) : paginatedGateways.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No payment gateways found</p>
              <p className="text-sm text-muted-foreground mb-4">
                Get started by connecting your first payment gateway
              </p>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Connect Gateway
              </Button>
            </CardContent>
          </Card>
        ) : (
          paginatedGateways.map((gateway) => (
            <Card key={gateway.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg ${getPlatformColor(gateway.type)} flex items-center justify-center text-white font-bold text-lg`}>
                      {gateway.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{gateway.name}</CardTitle>
                      <CardDescription>
                        <Badge variant="outline" className="mt-1">
                          {getPlatformLabel(gateway.type)}
                        </Badge>
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Activity className="h-4 w-4 mr-2" />
                        Test Connection
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Logs
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Disconnect
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={gateway.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {gateway.status === 'connected' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                    {gateway.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active</span>
                  <Switch checked={gateway.is_active} />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Transactions Today</p>
                    <p className="text-lg font-semibold">{gateway.transactions_today}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Volume Today</p>
                    <p className="text-lg font-semibold text-green-600">${gateway.volume_today.toFixed(2)}</p>
                  </div>
                </div>
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Transaction</span>
                    <span>{new Date(gateway.last_transaction).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Success Rate</span>
                    <Badge variant="secondary">{gateway.success_rate}%</Badge>
                  </div>
                  {gateway.test_mode && (
                    <Badge variant="outline" className="w-full justify-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Test Mode
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Add Gateway Type Dialog */}
      <Dialog open={isAddGatewayTypeOpen} onOpenChange={setIsAddGatewayTypeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Gateway Type</DialogTitle>
            <DialogDescription>
              Create a custom payment gateway type for your integration
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="gateway-type-name">Gateway Type Name</Label>
              <Input id="gateway-type-name" placeholder="e.g., Custom Payment Provider" />
            </div>
            <div>
              <Label htmlFor="gateway-type-value">Gateway Type Value</Label>
              <Input id="gateway-type-value" placeholder="e.g., custom_provider" />
            </div>
            <div>
              <Label>Badge Color</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {[
                  { value: 'bg-orange-500', label: 'Orange', preview: '#f97316' },
                  { value: 'bg-blue-500', label: 'Blue', preview: '#3b82f6' },
                  { value: 'bg-green-500', label: 'Green', preview: '#22c55e' },
                  { value: 'bg-yellow-500', label: 'Yellow', preview: '#eab308' },
                  { value: 'bg-red-500', label: 'Red', preview: '#ef4444' },
                  { value: 'bg-purple-500', label: 'Purple', preview: '#a855f7' },
                  { value: 'bg-pink-500', label: 'Pink', preview: '#ec4899' },
                  { value: 'bg-indigo-500', label: 'Indigo', preview: '#6366f1' },
                  { value: 'bg-teal-500', label: 'Teal', preview: '#14b8a6' },
                  { value: 'bg-cyan-500', label: 'Cyan', preview: '#06b6d4' },
                  { value: 'bg-gray-700', label: 'Gray', preview: '#374151' },
                  { value: 'bg-black', label: 'Black', preview: '#000000' }
                ].map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedBadgeColor(color.value)}
                    className={`h-10 rounded-md border-2 transition-all ${
                      selectedBadgeColor === color.value ? 'border-primary scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.preview }}
                    title={color.label}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Select a color that represents the gateway's brand
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsAddGatewayTypeOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
                toast({ title: 'Gateway type added', description: 'Custom gateway type has been created' })
                setIsAddGatewayTypeOpen(false)
              }}>
                Add Gateway Type
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Connect Gateway Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Connect Payment Gateway</DialogTitle>
            <DialogDescription>
              Configure and connect a new payment gateway to your store
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="gateway-name">Gateway Name</Label>
              <Input id="gateway-name" placeholder="e.g., Stripe Production" />
            </div>
            <div>
              <Label htmlFor="gateway-type-select">Gateway Type</Label>
              <Select defaultValue="stripe">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wise">Wise</SelectItem>
                  <SelectItem value="payoneer">Payoneer</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="promptpay">PromptPay</SelectItem>
                  <SelectItem value="credit_card">Credit/Debit Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="truemoney">TrueMoney Wallet</SelectItem>
                  <SelectItem value="line_pay">LINE Pay</SelectItem>
                  <SelectItem value="rabbit_line_pay">Rabbit LINE Pay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="account-id">Account ID / API Key</Label>
              <Input id="account-id" placeholder="Enter your account ID or API key" />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select defaultValue="USD">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="THB">THB - Thai Baht</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="test-mode" />
              <Label htmlFor="test-mode">Enable Test Mode</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="active" defaultChecked />
              <Label htmlFor="active">Active</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
                toast({ title: 'Gateway connected', description: 'Payment gateway has been successfully connected' })
                setIsFormOpen(false)
              }}>
                Connect Gateway
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
