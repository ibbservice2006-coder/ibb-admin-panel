import { useState } from 'react'
import { Save, Filter, Star, Trash2, Edit, Eye, Copy, Search, Calendar, DollarSign, Package, Users, ShoppingCart, Plus, X, Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

// Sample saved filters
const defaultFilters = [
  {
    id: '1',
    name: 'High Value Orders',
    description: 'Orders with total > $1000',
    table: 'orders',
    icon: 'ShoppingCart',
    color: 'purple',
    favorite: true,
    filters: [
      { field: 'total', operator: '>', value: '1000' },
      { field: 'status', operator: '=", value: 'completed" }
    ],
    sort: { field: 'total', direction: 'desc' },
    createdAt: '2025-10-01',
    usageCount: 45
  },
  {
    id: '2',
    name: 'Low Stock Products',
    description: 'Products with stock < 10',
    table: 'products',
    icon: 'Package',
    color: 'orange',
    favorite: true,
    filters: [
      { field: 'stock', operator: '<', value: '10' }
    ],
    sort: { field: 'stock', direction: 'asc' },
    createdAt: '2025-09-28',
    usageCount: 32
  },
  {
    id: '3',
    name: 'VIP Customers',
    description: 'Customers with orders > 10',
    table: 'customers',
    icon: 'Users',
    color: 'green',
    favorite: false,
    filters: [
      { field: 'total_orders', operator: '>', value: '10' }
    ],
    sort: { field: 'total_orders', direction: 'desc' },
    createdAt: '2025-09-25',
    usageCount: 28
  },
  {
    id: '4',
    name: 'Pending Orders',
    description: 'Orders waiting for processing',
    table: 'orders',
    icon: 'ShoppingCart',
    color: 'yellow',
    favorite: true,
    filters: [
      { field: 'status', operator: '=", value: 'pending" }
    ],
    sort: { field: 'created_at', direction: 'desc' },
    createdAt: '2025-09-20',
    usageCount: 67
  },
  {
    id: '5',
    name: 'Recent Customers',
    description: 'Customers registered in last 30 days',
    table: 'customers',
    icon: 'Users',
    color: 'blue',
    favorite: false,
    filters: [
      { field: 'created_at', operator: '>', value: '30_days_ago' }
    ],
    sort: { field: 'created_at', direction: 'desc' },
    createdAt: '2025-09-15',
    usageCount: 19
  },
  {
    id: '6',
    name: 'Premium Products',
    description: 'Products with price > $500',
    table: 'products',
    icon: 'Package',
    color: 'purple',
    favorite: false,
    filters: [
      { field: 'price', operator: '>', value: '500' }
    ],
    sort: { field: 'price', direction: 'desc' },
    createdAt: '2025-09-10',
    usageCount: 15
  }
]

// Available tables
const tables = [
  { id: 'products', name: 'Products', icon: Package, color: 'blue' },
  { id: 'customers', name: 'Customers', icon: Users, color: 'green' },
  { id: 'orders', name: 'Orders', icon: ShoppingCart, color: 'purple' },
  { id: 'vendors', name: 'Vendors', icon: Package, color: 'orange' }
]

// Available operators
const operators = [
  { value: '=", label: 'Equals (=)" },
  { value: '!=", label: 'Not equals (≠)" },
  { value: '>", label: 'Greater than (>)" },
  { value: '<', label: 'Less than (<)' },
  { value: '>=", label: 'Greater or equal (≥)" },
  { value: '<=", label: 'Less or equal (≤)" },
  { value: 'contains', label: 'Contains' },
  { value: 'starts_with', label: 'Starts with' },
  { value: 'ends_with', label: 'Ends with' },
  { value: 'is_null', label: 'Is null' },
  { value: 'is_not_null', label: 'Is not null' }
]

export default function SavedFilters() {
  const [savedFilters, setSavedFilters] = useState(defaultFilters)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTable, setSelectedTable] = useState('all')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingFilter, setEditingFilter] = useState(null)
  
  // Form state
  const [filterName, setFilterName] = useState('')
  const [filterDescription, setFilterDescription] = useState('')
  const [filterTable, setFilterTable] = useState('products')
  const [filterConditions, setFilterConditions] = useState([
    { field: '', operator: '=', value: '' }
  ])
  const [sortField, setSortField] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')

  // Filter saved filters
  const filteredFilters = savedFilters.filter(filter => {
    const matchesSearch = filter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         filter.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTable = selectedTable === 'all' || filter.table === selectedTable
    return matchesSearch && matchesTable
  })

  // Get icon component
  const getIcon = (iconName) => {
    const icons = {
      ShoppingCart,
      Package,
      Users,
      DollarSign,
      Calendar
    }
    return icons[iconName] || Filter
  }

  // Get color classes
  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
    return colors[color] || colors.blue
  }

  // Toggle favorite
  const toggleFavorite = (filterId) => {
    setSavedFilters(savedFilters.map(f => 
      f.id === filterId ? { ...f, favorite: !f.favorite } : f
    ))
  }

  // Delete filter
  const deleteFilter = (filterId) => {
    setSavedFilters(savedFilters.filter(f => f.id !== filterId))
  }

  // Duplicate filter
  const duplicateFilter = (filter) => {
    const newFilter = {
      ...filter,
      id: Date.now().toString(),
      name: `${filter.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      usageCount: 0
    }
    setSavedFilters([...savedFilters, newFilter])
  }

  // Apply filter
  const applyFilter = (filter) => {
    // Increment usage count
    setSavedFilters(savedFilters.map(f =>
      f.id === filter.id ? { ...f, usageCount: f.usageCount + 1 } : f
    ))
    // In real app, this would navigate to the table with filters applied
    console.log('Applying filter:', filter)
  }

  // Add condition
  const addCondition = () => {
    setFilterConditions([...filterConditions, { field: '', operator: '=', value: '' }])
  }

  // Remove condition
  const removeCondition = (index) => {
    setFilterConditions(filterConditions.filter((_, i) => i !== index))
  }

  // Update condition
  const updateCondition = (index, field, value) => {
    const newConditions = [...filterConditions]
    newConditions[index][field] = value
    setFilterConditions(newConditions)
  }

  // Save new filter
  const handleSaveFilter = () => {
    const newFilter = {
      id: Date.now().toString(),
      name: filterName,
      description: filterDescription,
      table: filterTable,
      icon: tables.find(t => t.id === filterTable)?.icon.name || 'Filter',
      color: tables.find(t => t.id === filterTable)?.color || 'blue',
      favorite: false,
      filters: filterConditions.filter(c => c.field && c.value),
      sort: sortField ? { field: sortField, direction: sortDirection } : null,
      createdAt: new Date().toISOString().split('T')[0],
      usageCount: 0
    }
    
    setSavedFilters([...savedFilters, newFilter])
    resetForm()
    setCreateDialogOpen(false)
  }

  // Reset form
  const resetForm = () => {
    setFilterName('')
    setFilterDescription('')
    setFilterTable('products')
    setFilterConditions([{ field: '', operator: '=', value: '' }])
    setSortField('')
    setSortDirection('asc')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Saved Filters & Views</h1>
          <p className="text-muted-foreground mt-1">
            Save and reuse your favorite filter combinations
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Filter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Filter</DialogTitle>
              <DialogDescription>
                Define filter conditions and save for quick access
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="filter-name">Filter Name *</Label>
                  <Input
                    id="filter-name"
                    placeholder="e.g., High Value Orders"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filter-description">Description</Label>
                  <Input
                    id="filter-description"
                    placeholder="Brief description of this filter"
                    value={filterDescription}
                    onChange={(e) => setFilterDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filter-table">Table *</Label>
                  <Select value={filterTable} onValueChange={setFilterTable}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tables.map(table => (
                        <SelectItem key={table.id} value={table.id}>
                          {table.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Filter Conditions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Filter Conditions</Label>
                  <Button size="sm" variant="outline" onClick={addCondition}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add Condition
                  </Button>
                </div>
                {filterConditions.map((condition, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Field name"
                        value={condition.field}
                        onChange={(e) => updateCondition(index, 'field', e.target.value)}
                      />
                    </div>
                    <div className="w-40">
                      <Select
                        value={condition.operator}
                        onValueChange={(value) => updateCondition(index, 'operator', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {operators.map(op => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="Value"
                        value={condition.value}
                        onChange={(e) => updateCondition(index, 'value', e.target.value)}
                      />
                    </div>
                    {filterConditions.length > 1 && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeCondition(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              {/* Sort */}
              <div className="space-y-3">
                <Label>Sort (Optional)</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Sort field"
                      value={sortField}
                      onChange={(e) => setSortField(e.target.value)}
                    />
                  </div>
                  <Select value={sortDirection} onValueChange={setSortDirection}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveFilter} disabled={!filterName || !filterTable}>
                <Save className="h-4 w-4 mr-2" />
                Save Filter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Filters</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedFilters.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {savedFilters.filter(f => f.favorite).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Used</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(...savedFilters.map(f => f.usageCount), 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {savedFilters.sort((a, b) => b.usageCount - a.usageCount)[0]?.name}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tables</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(savedFilters.map(f => f.table)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search filters..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All tables" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tables</SelectItem>
                {tables.map(table => (
                  <SelectItem key={table.id} value={table.id}>
                    {table.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Filters List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All Filters ({filteredFilters.length})
          </TabsTrigger>
          <TabsTrigger value="favorites">
            Favorites ({filteredFilters.filter(f => f.favorite).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {filteredFilters.map(filter => {
              const Icon = getIcon(filter.icon)
              return (
                <Card key={filter.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getColorClasses(filter.color)}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{filter.name}</CardTitle>
                          <CardDescription>{filter.description}</CardDescription>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => toggleFavorite(filter.id)}
                      >
                        <Star className={`h-4 w-4 ${filter.favorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline">{filter.table}</Badge>
                        <Badge variant="secondary">{filter.filters.length} conditions</Badge>
                        <Badge variant="secondary">{filter.usageCount} uses</Badge>
                      </div>
                      <Separator />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-gray-700 hover:bg-gray-600 text-white flex-1"
                          onClick={() => applyFilter(filter)}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Apply
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => duplicateFilter(filter)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteFilter(filter.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {filteredFilters.filter(f => f.favorite).map(filter => {
              const Icon = getIcon(filter.icon)
              return (
                <Card key={filter.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getColorClasses(filter.color)}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{filter.name}</CardTitle>
                          <CardDescription>{filter.description}</CardDescription>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => toggleFavorite(filter.id)}
                      >
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline">{filter.table}</Badge>
                        <Badge variant="secondary">{filter.filters.length} conditions</Badge>
                        <Badge variant="secondary">{filter.usageCount} uses</Badge>
                      </div>
                      <Separator />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-gray-700 hover:bg-gray-600 text-white flex-1"
                          onClick={() => applyFilter(filter)}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Apply
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => duplicateFilter(filter)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteFilter(filter.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          {filteredFilters.filter(f => f.favorite).length === 0 && (
            <Card className="p-12">
              <div className="text-center">
                <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No favorite filters</h3>
                <p className="text-muted-foreground">
                  Click the star icon on any filter to add it to favorites
                </p>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
