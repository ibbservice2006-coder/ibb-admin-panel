import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Search, 
  Tag, 
  Edit, 
  Trash2, 
  MoreVertical,
  TrendingUp,
  Hash,
  Palette,
  FileText,
  Package,
  Users,
  ShoppingCart,
  AlertCircle
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function Tags() {
  const [tags, setTags] = useState([
    { id: 1, name: 'Urgent', color: 'red', category: 'Priority', usageCount: 45, description: 'High priority items' },
    { id: 2, name: 'Featured', color: 'blue', category: 'Product', usageCount: 32, description: 'Featured products' },
    { id: 3, name: 'New Customer', color: 'green', category: 'Customer', usageCount: 28, description: 'New customer accounts' },
    { id: 4, name: 'Discount', color: 'orange', category: 'Promotion', usageCount: 56, description: 'Discounted items' },
    { id: 5, name: 'Seasonal', color: 'purple', category: 'Product', usageCount: 23, description: 'Seasonal products' },
    { id: 6, name: 'VIP', color: 'yellow', category: 'Customer', usageCount: 12, description: 'VIP customers' },
    { id: 7, name: 'Pending Review', color: 'gray', category: 'Status', usageCount: 18, description: 'Items pending review' },
    { id: 8, name: 'Best Seller', color: 'pink', category: 'Product', usageCount: 67, description: 'Best selling products' },
    { id: 9, name: 'Clearance', color: 'red', category: 'Promotion', usageCount: 34, description: 'Clearance sale items' },
    { id: 10, name: 'Pre-order', color: 'indigo', category: 'Status', usageCount: 15, description: 'Pre-order items' }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState(null)
  
  // Form states
  const [formName, setFormName] = useState('')
  const [formColor, setFormColor] = useState('blue')
  const [formCategory, setFormCategory] = useState('General')
  const [formDescription, setFormDescription] = useState('')

  const categories = ['General', 'Priority', 'Product', 'Customer', 'Promotion', 'Status', 'Marketing']
  const colors = [
    { name: 'red', value: '#ef4444', label: 'Red' },
    { name: 'orange', value: '#f97316', label: 'Orange' },
    { name: 'yellow', value: '#eab308', label: 'Yellow' },
    { name: 'green', value: '#22c55e', label: 'Green' },
    { name: 'blue', value: '#3b82f6', label: 'Blue' },
    { name: 'indigo', value: '#6366f1', label: 'Indigo' },
    { name: 'purple', value: '#a855f7', label: 'Purple' },
    { name: 'pink', value: '#ec4899', label: 'Pink' },
    { name: 'gray', value: '#6b7280', label: 'Gray' }
  ]

  // Filter tags
  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tag.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || tag.category === filterCategory
    return matchesSearch && matchesCategory
  })

  // Group tags by category
  const tagsByCategory = filteredTags.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = []
    }
    acc[tag.category].push(tag)
    return acc
  }, {})

  // Get color value
  const getColorValue = (colorName) => {
    return colors.find(c => c.name === colorName)?.value || '#3b82f6'
  }

  const handleCreateTag = () => {
    if (!formName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a tag name',
        variant: 'destructive'
      })
      return
    }

    const newTag = {
      id: tags.length + 1,
      name: formName,
      color: formColor,
      category: formCategory,
      usageCount: 0,
      description: formDescription
    }

    setTags([...tags, newTag])
    setIsCreateDialogOpen(false)
    resetForm()
    
    toast({
      title: 'Success',
      description: 'Tag created successfully'
    })
  }

  const handleEditTag = () => {
    if (!formName.trim() || !selectedTag) return

    setTags(tags.map(tag => 
      tag.id === selectedTag.id 
        ? { ...tag, name: formName, color: formColor, category: formCategory, description: formDescription }
        : tag
    ))

    setIsEditDialogOpen(false)
    setSelectedTag(null)
    resetForm()
    
    toast({
      title: 'Success',
      description: 'Tag updated successfully'
    })
  }

  const handleDeleteTag = (tagId) => {
    setTags(tags.filter(tag => tag.id !== tagId))
    toast({
      title: 'Success',
      description: 'Tag deleted successfully'
    })
  }

  const openEditDialog = (tag) => {
    setSelectedTag(tag)
    setFormName(tag.name)
    setFormColor(tag.color)
    setFormCategory(tag.category)
    setFormDescription(tag.description)
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormName('')
    setFormColor('blue')
    setFormCategory('General')
    setFormDescription('')
  }

  // Stats
  const totalTags = tags.length
  const totalUsage = tags.reduce((sum, tag) => sum + tag.usageCount, 0)
  const mostUsedTag = tags.reduce((max, tag) => tag.usageCount > max.usageCount ? tag : max, tags[0])
  const categoryCount = new Set(tags.map(t => t.category)).size

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tags & Labels</h1>
          <p className="text-muted-foreground mt-1">
            Organize and categorize your content with custom tags
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white gap-2">
              <Plus className="h-4 w-4" />
              Create Tag
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Tag</DialogTitle>
              <DialogDescription>
                Add a new tag to organize your content
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tag Name</label>
                <Input 
                  placeholder="Enter tag name" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={formCategory} onValueChange={setFormCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <div className="grid grid-cols-9 gap-2">
                  {colors.map(color => (
                    <button
                      key={color.name}
                      type="button"
                      className={`h-10 w-10 rounded-md border-2 transition-all hover:scale-110 ${
                        formColor === color.name ? 'border-foreground ring-2 ring-offset-2' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setFormColor(color.name)}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (Optional)</label>
                <Input 
                  placeholder="Enter tag description" 
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>
              <div className="pt-2">
                <label className="text-sm font-medium mb-2 block">Preview</label>
                <Badge 
                  className="text-white"
                  style={{ backgroundColor: getColorValue(formColor) }}
                >
                  {formName || 'Tag Name'}
                </Badge>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" variant="outline" onClick={() => {
                setIsCreateDialogOpen(false)
                resetForm()
              }}>
                Cancel
              </Button>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleCreateTag}>Create Tag</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tags</p>
                <p className="text-2xl font-bold">{totalTags}</p>
              </div>
              <Tag className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Usage</p>
                <p className="text-2xl font-bold">{totalUsage}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{categoryCount}</p>
              </div>
              <Hash className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Most Used</p>
                <p className="text-lg font-bold truncate">{mostUsedTag?.name}</p>
              </div>
              <Palette className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search tags..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tags Display */}
      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="category">By Category</TabsTrigger>
        </TabsList>

        {/* Grid View */}
        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTags.map(tag => (
              <Card key={tag.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Badge 
                        className="text-white mb-2"
                        style={{ backgroundColor: getColorValue(tag.color) }}
                      >
                        {tag.name}
                      </Badge>
                      <CardDescription className="text-xs">{tag.category}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({ title: 'Updated', description: 'Data updated successfully' })}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(tag)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteTag(tag.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                    {tag.description || 'No description'}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-xs text-muted-foreground">Usage</span>
                    <span className="text-sm font-semibold">{tag.usageCount}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Table View */}
        <TabsContent value="table">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tag</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Usage</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTags.map(tag => (
                    <TableRow key={tag.id}>
                      <TableCell>
                        <Badge 
                          className="text-white"
                          style={{ backgroundColor: getColorValue(tag.color) }}
                        >
                          {tag.name}
                        </Badge>
                      </TableCell>
                      <TableCell>{tag.category}</TableCell>
                      <TableCell className="max-w-xs truncate">{tag.description || '-'}</TableCell>
                      <TableCell className="text-right font-medium">{tag.usageCount}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({ title: 'Updated', description: 'Data updated successfully' })}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(tag)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteTag(tag.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Category View */}
        <TabsContent value="category" className="space-y-4">
          {Object.entries(tagsByCategory).map(([category, categoryTags]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  {category}
                  <Badge variant="secondary" className="ml-2">{categoryTags.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categoryTags.map(tag => (
                    <div key={tag.id} className="group relative">
                      <Badge 
                        className="text-white cursor-pointer hover:opacity-80 transition-opacity pr-8"
                        style={{ backgroundColor: getColorValue(tag.color) }}
                      >
                        {tag.name}
                        <span className="ml-2 text-xs opacity-75">({tag.usageCount})</span>
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button  onClick={() => toast({ title: 'Updated', description: 'Data updated successfully' })}
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(tag)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteTag(tag.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {filteredTags.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No tags found</p>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Tag Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>
              Update tag information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tag Name</label>
              <Input 
                placeholder="Enter tag name" 
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Color</label>
              <div className="grid grid-cols-9 gap-2">
                {colors.map(color => (
                  <button
                    key={color.name}
                    type="button"
                    className={`h-10 w-10 rounded-md border-2 transition-all hover:scale-110 ${
                      formColor === color.name ? 'border-foreground ring-2 ring-offset-2' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setFormColor(color.name)}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <Input 
                placeholder="Enter tag description" 
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>
            <div className="pt-2">
              <label className="text-sm font-medium mb-2 block">Preview</label>
              <Badge 
                className="text-white"
                style={{ backgroundColor: getColorValue(formColor) }}
              >
                {formName || 'Tag Name'}
              </Badge>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => {
              setIsEditDialogOpen(false)
              setSelectedTag(null)
              resetForm()
            }}>
              Cancel
            </Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleEditTag}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
