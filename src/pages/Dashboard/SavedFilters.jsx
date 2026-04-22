import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Filter,
  Plus,
  Trash2,
  Edit,
  Copy,
  Share2,
  Download,
  Search,
  Clock,
  User,
  RefreshCw,
  Zap,
  FolderOpen
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Mock saved filters
const savedFilters = [
  {
    id: 'filter-1',
    name: 'Active Trips Today',
    description: 'All trips currently in progress',
    category: 'Operations',
    filters: { status: 'active', date: 'today' },
    usageCount: 24,
    lastUsed: '5 minutes ago',
    createdBy: 'Admin',
    isPublic: true
  },
  {
    id: 'filter-2',
    name: 'High Value Customers',
    description: 'Customers with total spending > $1000',
    category: 'Customers',
    filters: { spending: '>1000', status: 'active' },
    usageCount: 12,
    lastUsed: '2 hours ago',
    createdBy: 'Admin',
    isPublic: true
  },
  {
    id: 'filter-3',
    name: 'Delayed Bookings',
    description: 'Bookings delayed by more than 10 minutes',
    category: 'Bookings',
    filters: { delay: '>10', status: 'delayed' },
    usageCount: 8,
    lastUsed: '1 day ago',
    createdBy: 'Manager',
    isPublic: false
  },
  {
    id: 'filter-4',
    name: 'Fleet Maintenance Due',
    description: 'Vehicles requiring maintenance',
    category: 'Fleet',
    filters: { maintenanceStatus: 'due', status: 'active' },
    usageCount: 15,
    lastUsed: '3 hours ago',
    createdBy: 'Admin',
    isPublic: true
  },
  {
    id: 'filter-5',
    name: 'Premium Members',
    description: 'All premium and VIP members',
    category: 'Customers',
    filters: { membership: ['premium', 'vip'] },
    usageCount: 18,
    lastUsed: '30 minutes ago',
    createdBy: 'Admin',
    isPublic: true
  }
]

const categories = ['All', 'Operations', 'Customers', 'Bookings', 'Fleet', 'Drivers']
const filterCategories = ['Operations', 'Customers', 'Bookings', 'Fleet', 'Drivers']

export default function SavedFilters() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filters, setFilters] = useState(savedFilters)

  // New Filter Dialog state
  const [isNewFilterOpen, setIsNewFilterOpen] = useState(false)
  const [newFilterName, setNewFilterName] = useState('')
  const [newFilterDesc, setNewFilterDesc] = useState('')
  const [newFilterCategory, setNewFilterCategory] = useState('Operations')
  const [newFilterIsPublic, setNewFilterIsPublic] = useState(false)

  const filteredData = filters.filter(filter => {
    const matchesSearch = filter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          filter.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || filter.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDelete = (id) => {
    setFilters(filters.filter(f => f.id !== id))
    toast({ title: 'Filter Deleted', description: 'Saved filter has been removed.' })
  }

  const handleDuplicate = (filter) => {
    const newFilter = {
      ...filter,
      id: `filter-${Date.now()}`,
      name: `${filter.name} (Copy)`
    }
    setFilters([...filters, newFilter])
    toast({ title: 'Filter Duplicated', description: `${filter.name} has been duplicated.` })
  }

  const handleShare = (filter) => {
    const shareUrl = `${window.location.origin}/filters/${filter.id}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
    }
    toast({ title: 'Share Link Copied', description: 'Filter share link copied to clipboard.' })
  }

  const handleApply = (filter) => {
    toast({ title: 'Filter Applied', description: `${filter.name} has been applied.` })
  }

  const handleCreateFilter = () => {
    if (!newFilterName.trim()) {
      toast({ title: 'Error', description: 'Please enter Filter name', variant: 'destructive' })
      return
    }
    const created = {
      id: `filter-${Date.now()}`,
      name: newFilterName.trim(),
      description: newFilterDesc.trim() || 'Custom filter',
      category: newFilterCategory,
      filters: { status: 'active' },
      usageCount: 0,
      lastUsed: 'Never',
      createdBy: 'Admin',
      isPublic: newFilterIsPublic
    }
    setFilters([...filters, created])
    setIsNewFilterOpen(false)
    setNewFilterName('')
    setNewFilterDesc('')
    setNewFilterCategory('Operations')
    setNewFilterIsPublic(false)
    toast({ title: 'Filter Created', description: `"${created.name}" created successfully` })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Filters</h1>
          <p className="text-muted-foreground mt-1">Manage and organize your custom filter views</p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600" onClick={() => setIsNewFilterOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Filter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Filters</p>
                <h3 className="text-2xl font-bold mt-1">{filters.length}</h3>
              </div>
              <div className="p-2 rounded-lg bg-blue-50">
                <Filter className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Public Filters</p>
                <h3 className="text-2xl font-bold mt-1">{filters.filter(f => f.isPublic).length}</h3>
              </div>
              <div className="p-2 rounded-lg bg-green-50">
                <Share2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Usage</p>
                <h3 className="text-2xl font-bold mt-1">{filters.reduce((sum, f) => sum + f.usageCount, 0)}</h3>
              </div>
              <div className="p-2 rounded-lg bg-purple-50">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search filters..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? 'bg-gray-700 hover:bg-gray-600' : ''}
              >
                {cat}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters List */}
      <div className="space-y-3">
        {filteredData.length > 0 ? (
          filteredData.map(filter => (
            <Card key={filter.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FolderOpen className="h-4 w-4 text-slate-500" />
                      <h3 className="font-bold text-sm">{filter.name}</h3>
                      {filter.isPublic && (
                        <Badge className="bg-green-100 text-green-800 border-none text-xs">Public</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{filter.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <p className="text-muted-foreground">Category</p>
                        <p className="font-medium">{filter.category}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Usage</p>
                        <p className="font-medium">{filter.usageCount} times</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Used</p>
                        <p className="font-medium">{filter.lastUsed}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Created By</p>
                        <p className="font-medium">{filter.createdBy}</p>
                      </div>
                    </div>

                    <div className="mt-3 p-2 bg-slate-50 rounded text-xs">
                      <p className="text-muted-foreground mb-1">Filters:</p>
                      <p className="font-mono text-slate-600">
                        {Object.entries(filter.filters).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join(' | ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="bg-gray-700 hover:bg-gray-600"
                      onClick={() => handleApply(filter)}
                    >
                      Apply
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDuplicate(filter)}
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShare(filter)}
                      title="Share"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(filter.id)}
                      className="text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-none shadow-sm">
            <CardContent className="p-12 text-center">
              <Filter className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-muted-foreground">No filters found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or category filters</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* New Filter Dialog */}
      <Dialog open={isNewFilterOpen} onOpenChange={setIsNewFilterOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create new filter</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Filter Name <span className="text-red-500">*</span></Label>
              <Input
                placeholder="e.g., Active Drivers Today"
                value={newFilterName}
                onChange={(e) => setNewFilterName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input
                placeholder="Explain this filter..."
                value={newFilterDesc}
                onChange={(e) => setNewFilterDesc(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={newFilterCategory} onValueChange={setNewFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={newFilterIsPublic}
                onChange={(e) => setNewFilterIsPublic(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isPublic" className="cursor-pointer">Public (visible to others)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewFilterOpen(false)}>Cancel</Button>
            <Button className="bg-gray-700 hover:bg-gray-600" onClick={handleCreateFilter}>
              <Plus className="h-4 w-4 mr-2" />
              Create Filter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
