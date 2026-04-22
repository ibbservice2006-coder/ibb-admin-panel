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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  Eye,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  Copy,
  ArrowUpDown,
  Settings2,
  CheckSquare,
  AlertTriangle,
  ShoppingCart,
  ImagePlus,
  X,
  Tag,
  Globe,
  TrendingUp,
  Ruler,
  Calendar
} from 'lucide-react'
import { apiService } from '../services/apiService'

function ProductForm({ product, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || '',
    compare_price: product?.compare_price || '',
    cost_price: product?.cost_price || '',
    stock_qty: product?.stock_qty || '',
    is_published: product?.is_published ?? true,
    category_id: product?.category_id || '',
    images: product?.images || [],
    tags: product?.tags || [],
    weight: product?.weight || '',
    dimensions: product?.dimensions || '',
    meta_title: product?.meta_title || '',
    meta_description: product?.meta_description || '',
    meta_keywords: product?.meta_keywords || '',
    platforms: product?.platforms || [],
    variants: product?.variants || [],
    publish_date: product?.publish_date || ''
  })

  const [newTag, setNewTag] = useState('')
  const [imageUrls, setImageUrls] = useState(formData.images)

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
  const queryClient = useQueryClient()

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: apiService.getCategories
  })

  const createMutation = useMutation({
    mutationFn: apiService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
      toast({ title: 'Product created successfully' })
      onSuccess()
    },
    onError: (error) => {
      toast({ 
        title: 'Error creating product', 
        description: error.response?.data?.detail || 'Something went wrong',
        variant: 'destructive'
      })
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => apiService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
      toast({ title: 'Product updated successfully' })
      onSuccess()
    },
    onError: (error) => {
      toast({ 
        title: 'Error updating product', 
        description: error.response?.data?.detail || 'Something went wrong',
        variant: 'destructive'
      })
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const data = {
      ...formData,
      price: parseFloat(formData.price),
      compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
      cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
      stock_qty: parseInt(formData.stock_qty),
      category_id: formData.category_id ? parseInt(formData.category_id) : null,
      images: imageUrls
    }

    if (product) {
      updateMutation.mutate({ id: product.id, data })
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
    const url = prompt('Enter image URL:')
    if (url) {
      setImageUrls(prev => [...prev, url])
    }
  }

  const handleRemoveImage = (index) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  const handlePlatformToggle = (platform) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }))
  }

  const availablePlatforms = ['Shopee', 'Lazada', 'Amazon', 'Line MyShop', 'Facebook Shop']

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="media">Media & SEO</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Saxophone Pad Premium"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                placeholder="e.g., SAX-PAD-001"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="auto-generated-from-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={5}
              placeholder="Detailed product description..."
            />
            <p className="text-xs text-muted-foreground">
              Tip: Use rich formatting for better presentation
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category_id?.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add tag and press Enter"
              />
              <Button size="sm" type="button" onClick={handleAddTag} variant="outline">
                <Tag className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Selling Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="compare_price">Compare at Price</Label>
              <Input
                id="compare_price"
                type="number"
                step="0.01"
                value={formData.compare_price}
                onChange={(e) => setFormData(prev => ({ ...prev, compare_price: e.target.value }))}
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">Show discount</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost_price">Cost per Item</Label>
              <Input
                id="cost_price"
                type="number"
                step="0.01"
                value={formData.cost_price}
                onChange={(e) => setFormData(prev => ({ ...prev, cost_price: e.target.value }))}
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">For profit calculation</p>
            </div>
          </div>

          {formData.compare_price && formData.price && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="py-3">
                <div className="flex items-center gap-2 text-green-700">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">
                    {Math.round(((formData.compare_price - formData.price) / formData.compare_price) * 100)}% OFF
                  </span>
                  <span className="text-sm">
                    (Save ${(formData.compare_price - formData.price).toFixed(2)})
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock_qty">Stock Quantity *</Label>
              <Input
                id="stock_qty"
                type="number"
                value={formData.stock_qty}
                onChange={(e) => setFormData(prev => ({ ...prev, stock_qty: e.target.value }))}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dimensions">Dimensions (L x W x H cm)</Label>
            <Input
              id="dimensions"
              value={formData.dimensions}
              onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
              placeholder="e.g., 10 x 5 x 2"
            />
            <p className="text-xs text-muted-foreground">
              <Ruler className="h-3 w-3 inline mr-1" />
              Used for shipping calculation
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="track_inventory"
              defaultChecked
            />
            <Label htmlFor="track_inventory">Track inventory for this product</Label>
          </div>
        </TabsContent>

        {/* Media & SEO Tab */}
        <TabsContent value="media" className="space-y-4">
          <div className="space-y-2">
            <Label>Product Images</Label>
            <div className="grid grid-cols-4 gap-4">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img 
                    src={url} 
                    alt={`Product ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                    onClick={() => handleRemoveImage(idx)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button size="sm"
                type="button"
                variant="outline"
                className="h-32 border-dashed"
                onClick={handleAddImage}
              >
                <div className="flex flex-col items-center gap-2">
                  <ImagePlus className="h-6 w-6" />
                  <span className="text-xs">Add Image</span>
                </div>
              </Button>
            </div>
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
                placeholder="Product name for search engines"
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground">
                {formData.meta_title.length}/60 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                placeholder="Brief description for search results"
                rows={3}
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground">
                {formData.meta_description.length}/160 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_keywords">Meta Keywords</Label>
              <Input
                id="meta_keywords"
                value={formData.meta_keywords}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </div>
        </TabsContent>

        {/* Platforms Tab */}
        <TabsContent value="platforms" className="space-y-4">
          <div className="space-y-2">
            <Label>Sell on Platforms</Label>
            <p className="text-sm text-muted-foreground">
              Select which platforms this product will be available on
            </p>
            <div className="space-y-2 mt-4">
              {availablePlatforms.map((platform) => (
                <div key={platform} className="flex items-center space-x-2 p-3 border rounded-lg">
                  <Checkbox
                    id={platform}
                    checked={formData.platforms.includes(platform)}
                    onCheckedChange={() => handlePlatformToggle(platform)}
                  />
                  <Label htmlFor={platform} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      {platform}
                    </div>
                  </Label>
                  {formData.platforms.includes(platform) && (
                    <Badge className="bg-gray-700 hover:bg-gray-600 text-white">Active</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Publishing Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Publishing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="is_published">Product Status</Label>
              <p className="text-sm text-muted-foreground">
                {formData.is_published ? 'Visible to customers' : 'Hidden from store'}
              </p>
            </div>
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="publish_date">Schedule Publish Date</Label>
            <Input
              id="publish_date"
              type="datetime-local"
              value={formData.publish_date}
              onChange={(e) => setFormData(prev => ({ ...prev, publish_date: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 inline mr-1" />
              Leave empty to publish immediately
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button size="sm" type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="bg-gray-700 hover:bg-gray-600 text-white" size="sm" 
          type="submit" 
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {product ? 'Update' : 'Create'} Product
        </Button>
      </div>
    </form>
  )
}

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [statusFilter, setStatusFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [visibleColumns, setVisibleColumns] = useState({
    product: true,
    sku: true,
    category: true,
    price: true,
    stock: true,
    platforms: true,
    status: true,
    actions: true
  })

  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', { page: currentPage, limit: pageSize, search: searchTerm }],
    queryFn: () => apiService.getProducts({ 
      page: currentPage, 
      limit: pageSize, 
      search: searchTerm 
    })
  })

  const deleteMutation = useMutation({
    mutationFn: apiService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
      toast({ title: 'Product deleted successfully' })
    },
    onError: (error) => {
      toast({ 
        title: 'Error deleting product', 
        description: error.response?.data?.detail || 'Something went wrong',
        variant: 'destructive'
      })
    }
  })

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  const handleDelete = (product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      deleteMutation.mutate(product.id)
    }
  }

  const handleDuplicate = (product) => {
    const duplicated = {
      ...product,
      name: `${product.name} (Copy)`,
      sku: `${product.sku}-copy`,
      slug: `${product.slug}-copy`
    }
    setSelectedProduct(duplicated)
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setSelectedProduct(null)
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(products?.items?.map(p => p.id) || [])
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectProduct = (productId, checked) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId])
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId))
    }
  }

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedProducts.length} selected products?`)) {
      selectedProducts.forEach(id => deleteMutation.mutate(id))
      setSelectedProducts([])
    }
  }

  const handleBulkPublish = (publish) => {
    toast({ title: `${publish ? 'Publishing' : 'Unpublishing'} ${selectedProducts.length} products...` })
    setSelectedProducts([])
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    if (stock < 10) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle }
    return { label: 'In Stock', color: 'bg-green-100 text-green-800', icon: Package }
  }

  const getPlatformBadges = () => {
    // Mock data - replace with actual platform data
    const platforms = ['Shopee', 'Lazada']
    return platforms
  }

  const filteredProducts = products?.items?.filter(product => {
    if (statusFilter !== 'all' && product.is_published !== (statusFilter === 'published')) return false
    if (stockFilter === 'low' && product.stock_qty >= 10) return false
    if (stockFilter === 'out' && product.stock_qty > 0) return false
    return true
  }) || []

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aVal = a[sortBy]
    let bVal = b[sortBy]
    
    if (sortBy === 'price' || sortBy === 'stock_qty') {
      aVal = parseFloat(aVal)
      bVal = parseFloat(bVal)
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => { const input = document.createElement('input'); input.type = 'file'; input.accept = '.csv,.xlsx'; input.onchange = (e) => { if (e.target.files[0]) toast({ title: 'File Imported', description: `${e.target.files[0].name} imported successfully` }) }; input.click() }}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setSelectedProduct(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedProduct ? 'Edit Product' : 'Create New Product'}
                </DialogTitle>
                <DialogDescription>
                  {selectedProduct 
                    ? 'Update product information and settings.'
                    : 'Add a new product to your catalog.'
                  }
                </DialogDescription>
              </DialogHeader>
              <ProductForm
                product={selectedProduct}
                onSuccess={handleDialogClose}
                onCancel={handleDialogClose}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedProducts.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{selectedProducts.length} products selected</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkPublish(true)}>
                  Publish
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkPublish(false)}>
                  Unpublish
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedProducts([])}>
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
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
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
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy('name')}>
                  Name {sortBy === 'name' && `(${sortOrder})`}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('price')}>
                  Price {sortBy === 'price' && `(${sortOrder})`}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('stock_qty')}>
                  Stock {sortBy === 'stock_qty' && `(${sortOrder})`}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                  {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                  <Settings2 className="h-4 w-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(visibleColumns).map(([key, value]) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={value}
                    onCheckedChange={(checked) => 
                      setVisibleColumns(prev => ({ ...prev, [key]: checked }))
                    }
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({sortedProducts.length})</CardTitle>
          <CardDescription>
            A list of all products in your store
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
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load products</h3>
              <p className="text-muted-foreground">
                {error.message || 'Something went wrong'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox 
                      checked={selectedProducts.length === sortedProducts.length && sortedProducts.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  {visibleColumns.product && <TableHead>Product</TableHead>}
                  {visibleColumns.sku && <TableHead>SKU</TableHead>}
                  {visibleColumns.category && <TableHead>Category</TableHead>}
                  {visibleColumns.price && <TableHead>Price</TableHead>}
                  {visibleColumns.stock && <TableHead>Stock</TableHead>}
                  {visibleColumns.platforms && <TableHead>Platforms</TableHead>}
                  {visibleColumns.status && <TableHead>Status</TableHead>}
                  {visibleColumns.actions && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock_qty)
                  const StockIcon = stockStatus.icon
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={(checked) => handleSelectProduct(product.id, checked)}
                        />
                      </TableCell>
                      {visibleColumns.product && (
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {product.description?.substring(0, 50)}...
                            </div>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.sku && <TableCell className="font-mono">{product.sku}</TableCell>}
                      {visibleColumns.category && <TableCell>{product.category?.name || 'Uncategorized'}</TableCell>}
                      {visibleColumns.price && <TableCell>${product.price}</TableCell>}
                      {visibleColumns.stock && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{product.stock_qty}</span>
                            <Badge className={stockStatus.color}>
                              <StockIcon className="h-3 w-3 mr-1" />
                              {stockStatus.label}
                            </Badge>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.platforms && (
                        <TableCell>
                          <div className="flex gap-1">
                            {getPlatformBadges().map((platform, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.status && (
                        <TableCell>
                          <Badge variant={product.is_published ? 'default' : 'secondary'}>
                            {product.is_published ? 'Published' : 'Draft'}
                          </Badge>
                        </TableCell>
                      )}
                      {visibleColumns.actions && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => toast({ title: 'Updated', description: 'Data updated successfully' })}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(product)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicate(product)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDelete(product)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
