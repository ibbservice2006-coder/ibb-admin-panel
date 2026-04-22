import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  FolderTree,
  Folder,
  FolderOpen,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  GripVertical,
  Eye,
  EyeOff,
  CheckSquare,
  ImagePlus,
  Globe
} from 'lucide-react'
import { apiService } from '../services/apiService'

function CategoryForm({ category, categories, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    parent_id: category?.parent_id || null,
    icon: category?.icon || '',
    image: category?.image || '',
    is_active: category?.is_active ?? true,
    meta_title: category?.meta_title || '',
    meta_description: category?.meta_description || '',
    sort_order: category?.sort_order || 0
  })

  const { toast } = useToast()
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: apiService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories'])
      toast({ title: 'Category created successfully' })
      onSuccess()
    },
    onError: (error) => {
      toast({ 
        title: 'Error creating category', 
        description: error.response?.data?.detail || 'Something went wrong',
        variant: 'destructive'
      })
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => apiService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories'])
      toast({ title: 'Category updated successfully' })
      onSuccess()
    },
    onError: (error) => {
      toast({ 
        title: 'Error updating category', 
        description: error.response?.data?.detail || 'Something went wrong',
        variant: 'destructive'
      })
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const data = {
      ...formData,
      parent_id: formData.parent_id ? parseInt(formData.parent_id) : null,
      sort_order: parseInt(formData.sort_order) || 0
    }

    if (category) {
      updateMutation.mutate({ id: category.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  const handleNameChange = (name) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
      meta_title: prev.meta_title || name
    }))
  }

  const handleAddImage = () => {
    const url = prompt('Enter category image URL:')
    if (url) {
      setFormData(prev => ({ ...prev, image: url }))
    }
  }

  // Filter out current category and its descendants for parent selection
  const availableParents = categories?.filter(cat => 
    cat.id !== category?.id && cat.parent_id !== category?.id
  ) || []

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Category Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g., Saxophone Parts"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            placeholder="auto-generated"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          placeholder="Category description..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="parent_id">Parent Category</Label>
          <Select
            value={formData.parent_id?.toString() || 'none'}
            onValueChange={(value) => setFormData(prev => ({ 
              ...prev, 
              parent_id: value === 'none' ? null : value 
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="None (Top Level)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None (Top Level)</SelectItem>
              {availableParents.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.parent_id ? '— ' : ''}{cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort_order">Sort Order</Label>
          <Input
            id="sort_order"
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData(prev => ({ ...prev, sort_order: e.target.value }))}
            placeholder="0"
          />
          <p className="text-xs text-muted-foreground">Lower numbers appear first</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Category Image</Label>
        {formData.image ? (
          <div className="relative w-32 h-32">
            <img 
              src={formData.image} 
              alt="Category"
              className="w-full h-full object-cover rounded-lg border"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button size="sm"
            type="button"
            variant="outline"
            onClick={handleAddImage}
          >
            <ImagePlus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <Label className="text-base font-semibold">SEO Settings</Label>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="meta_title">Meta Title</Label>
          <Input
            id="meta_title"
            value={formData.meta_title}
            onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
            placeholder="Category name for search engines"
            maxLength={60}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta_description">Meta Description</Label>
          <Textarea
            id="meta_description"
            value={formData.meta_description}
            onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
            placeholder="Brief description for search results"
            rows={2}
            maxLength={160}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
          />
          <Label htmlFor="is_active">Active</Label>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="bg-gray-700 hover:bg-gray-600 text-white" size="sm" 
            type="submit" 
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {category ? 'Update' : 'Create'} Category
          </Button>
        </div>
      </div>
    </form>
  )
}

function CategoryTreeItem({ category, categories, level = 0, onEdit, onDelete, selectedCategories, onSelect }) {
  const [isExpanded, setIsExpanded] = useState(true)
  
  const children = categories?.filter(cat => cat.parent_id === category.id) || []
  const hasChildren = children.length > 0
  const productCount = category.product_count || 0

  return (
    <>
      <TableRow className={level > 0 ? 'bg-muted/30' : ''}>
        <TableCell className="w-[50px]">
          <Checkbox 
            checked={selectedCategories.includes(category.id)}
            onCheckedChange={(checked) => onSelect(category.id, checked)}
          />
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
            {hasChildren && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
            {hasChildren ? (
              isExpanded ? <FolderOpen className="h-4 w-4 text-blue-500" /> : <Folder className="h-4 w-4 text-blue-500" />
            ) : (
              <Folder className="h-4 w-4 text-gray-400" />
            )}
            <span className="font-medium">{category.name}</span>
          </div>
        </TableCell>
        <TableCell className="font-mono text-sm">{category.slug}</TableCell>
        <TableCell>
          <Badge variant="outline">{productCount} products</Badge>
        </TableCell>
        <TableCell>
          <Badge variant={category.is_active ? 'default' : 'secondary'}>
            {category.is_active ? (
              <>
                <Eye className="h-3 w-3 mr-1" />
                Active
              </>
            ) : (
              <>
                <EyeOff className="h-3 w-3 mr-1" />
                Inactive
              </>
            )}
          </Badge>
        </TableCell>
        <TableCell className="text-center">{category.sort_order || 0}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => toast({ title: 'Updated', description: 'Data updated successfully' })}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(category)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Plus className="h-4 w-4 mr-2" />
                Add Subcategory
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(category)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
      {isExpanded && hasChildren && children.map(child => (
        <CategoryTreeItem
          key={child.id}
          category={child}
          categories={categories}
          level={level + 1}
          onEdit={onEdit}
          onDelete={onDelete}
          selectedCategories={selectedCategories}
          onSelect={onSelect}
        />
      ))}
    </>
  )
}

export default function Categories() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')

  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: apiService.getCategories
  })

  const deleteMutation = useMutation({
    mutationFn: apiService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories'])
      toast({ title: 'Category deleted successfully' })
    },
    onError: (error) => {
      toast({ 
        title: 'Error deleting category', 
        description: error.response?.data?.detail || 'Cannot delete category with products',
        variant: 'destructive'
      })
    }
  })

  const handleEdit = (category) => {
    setSelectedCategory(category)
    setIsDialogOpen(true)
  }

  const handleDelete = (category) => {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      deleteMutation.mutate(category.id)
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setSelectedCategory(null)
  }

  const handleSelectCategory = (categoryId, checked) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, categoryId])
    } else {
      setSelectedCategories(prev => prev.filter(id => id !== categoryId))
    }
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCategories(categories?.map(c => c.id) || [])
    } else {
      setSelectedCategories([])
    }
  }

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedCategories.length} selected categories?`)) {
      selectedCategories.forEach(id => deleteMutation.mutate(id))
      setSelectedCategories([])
    }
  }

  const handleBulkToggleStatus = (active) => {
    toast({ title: `${active ? 'Activating' : 'Deactivating'} ${selectedCategories.length} categories...` })
    setSelectedCategories([])
  }

  // Filter and organize categories
  const filteredCategories = categories?.filter(cat => {
    if (searchTerm && !cat.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    if (statusFilter === 'active' && !cat.is_active) return false
    if (statusFilter === 'inactive' && cat.is_active) return false
    return true
  }) || []

  const topLevelCategories = filteredCategories.filter(cat => !cat.parent_id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">
            Manage product categories and hierarchies
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setSelectedCategory(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedCategory ? 'Edit Category' : 'Create New Category'}
              </DialogTitle>
              <DialogDescription>
                {selectedCategory 
                  ? 'Update category information and settings.'
                  : 'Add a new category to organize your products.'
                }
              </DialogDescription>
            </DialogHeader>
            <CategoryForm
              category={selectedCategory}
              categories={categories}
              onSuccess={handleDialogClose}
              onCancel={handleDialogClose}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Bulk Actions Bar */}
      {selectedCategories.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{selectedCategories.length} categories selected</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkToggleStatus(true)}>
                  Activate
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkToggleStatus(false)}>
                  Deactivate
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedCategories([])}>
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                  placeholder="Search categories..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Categories Tree Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="h-5 w-5" />
            Categories ({topLevelCategories.length})
          </CardTitle>
          <CardDescription>
            Hierarchical category structure with drag and drop support
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <FolderTree className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load categories</h3>
              <p className="text-muted-foreground">
                {error.message || 'Something went wrong'}
              </p>
            </div>
          ) : topLevelCategories.length === 0 ? (
            <div className="text-center py-8">
              <FolderTree className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No categories yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first category to organize products
              </p>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox 
                      checked={selectedCategories.length === categories.length && categories.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topLevelCategories.map(category => (
                  <CategoryTreeItem
                    key={category.id}
                    category={category}
                    categories={filteredCategories}
                    level={0}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    selectedCategories={selectedCategories}
                    onSelect={handleSelectCategory}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
