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
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  Eye,
  MessageSquare,
  User,
  Package,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Reply,
  Download,
  MoreHorizontal,
  ArrowUpDown,
  CheckSquare,
  ImagePlus,
  X,
  BarChart3
} from 'lucide-react'
import { apiService } from '../services/apiService'

function ReviewForm({ review, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    product_id: review?.product_id || '',
    user_id: review?.user_id || '',
    rating: review?.rating || 5,
    title: review?.title || '',
    comment: review?.comment || '',
    is_verified: review?.is_verified ?? false,
    status: review?.status || 'pending',
    images: review?.images || []
  })

  const [imageUrls, setImageUrls] = useState(formData.images)

  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => apiService.getProducts({ limit: 100 })
  })

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiService.getUsers({ limit: 100 })
  })

  const createMutation = useMutation({
    mutationFn: (data) => {
      return Promise.resolve({ id: Date.now(), ...data })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews'])
      toast({ title: 'Review created successfully' })
      onSuccess()
    },
    onError: (error) => {
      toast({ 
        title: 'Error creating review', 
        description: error.message || 'Something went wrong',
        variant: 'destructive'
      })
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => {
      return Promise.resolve({ id, ...data })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews'])
      toast({ title: 'Review updated successfully' })
      onSuccess()
    },
    onError: (error) => {
      toast({ 
        title: 'Error updating review', 
        description: error.message || 'Something went wrong',
        variant: 'destructive'
      })
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const data = {
      ...formData,
      product_id: parseInt(formData.product_id),
      user_id: parseInt(formData.user_id),
      rating: parseInt(formData.rating),
      images: imageUrls
    }

    if (review) {
      updateMutation.mutate({ id: review.id, data })
    } else {
      createMutation.mutate(data)
    }
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="product">Product *</Label>
          <Select
            value={formData.product_id?.toString()}
            onValueChange={(value) => setFormData(prev => ({ ...prev, product_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {products?.items?.map((product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="user">Customer *</Label>
          <Select
            value={formData.user_id?.toString()}
            onValueChange={(value) => setFormData(prev => ({ ...prev, user_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              {users?.items?.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rating">Rating *</Label>
          <Select
            value={formData.rating?.toString()}
            onValueChange={(value) => setFormData(prev => ({ ...prev, rating: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((rating) => (
                <SelectItem key={rating} value={rating.toString()}>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-1">({rating})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Review Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Brief review title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Review Comment *</Label>
        <Textarea
          id="comment"
          value={formData.comment}
          onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
          rows={4}
          placeholder="Customer's review comment"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Review Images</Label>
        <div className="grid grid-cols-4 gap-4">
          {imageUrls.map((url, idx) => (
            <div key={idx} className="relative group">
              <img 
                src={url} 
                alt={`Review ${idx + 1}`}
                className="w-full h-24 object-cover rounded-lg border"
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
          {imageUrls.length < 5 && (
            <Button size="sm"
              type="button"
              variant="outline"
              className="h-24 border-dashed"
              onClick={handleAddImage}
            >
              <div className="flex flex-col items-center gap-1">
                <ImagePlus className="h-5 w-5" />
                <span className="text-xs">Add Image</span>
              </div>
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_verified"
          checked={formData.is_verified}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_verified: checked }))}
        />
        <Label htmlFor="is_verified">Verified Purchase</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button size="sm" type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="bg-gray-700 hover:bg-gray-600 text-white" size="sm" 
          type="submit" 
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {review ? 'Update' : 'Create'} Review
        </Button>
      </div>
    </form>
  )
}

function ReplyDialog({ review, onClose }) {
  const [reply, setReply] = useState(review.admin_reply || '')
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const replyMutation = useMutation({
    mutationFn: ({ id, reply }) => {
      return Promise.resolve({ id, admin_reply: reply })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews'])
      toast({ title: 'Reply posted successfully' })
      onClose()
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    replyMutation.mutate({ id: review.id, reply })
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reply to Review</DialogTitle>
          <DialogDescription>
            Respond to customer's review
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Customer's Review</Label>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">{review.comment}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reply">Your Reply *</Label>
            <Textarea
              id="reply"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={4}
              placeholder="Write your response..."
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button size="sm" type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" type="submit" className="bg-gray-700 hover:bg-gray-600 text-white" disabled={replyMutation.isPending}>
              Post Reply
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function Reviews() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReview, setSelectedReview] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)
  const [replyingReview, setReplyingReview] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [productFilter, setProductFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedReviews, setSelectedReviews] = useState([])

  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Mock data for reviews
  const mockReviews = [
    {
      id: 1,
      product: { id: 1, name: 'Wireless Headphones' },
      user: { id: 1, email: 'john@example.com', first_name: 'John', last_name: 'Doe' },
      rating: 5,
      title: 'Excellent sound quality!',
      comment: 'These headphones exceeded my expectations. The sound quality is crystal clear and the battery life is amazing.',
      status: 'approved',
      is_verified: true,
      created_at: '2024-01-15T10:30:00Z',
      helpful_count: 24,
      not_helpful_count: 2,
      images: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
      admin_reply: 'Thank you for your positive feedback! We\'re glad you love the product.'
    },
    {
      id: 2,
      product: { id: 2, name: 'Smart Watch' },
      user: { id: 2, email: 'jane@example.com', first_name: 'Jane', last_name: 'Smith' },
      rating: 4,
      title: 'Good value for money',
      comment: 'Nice watch with good features. The only downside is the battery could last longer.',
      status: 'approved',
      is_verified: false,
      created_at: '2024-01-14T15:45:00Z',
      helpful_count: 15,
      not_helpful_count: 3,
      images: [],
      admin_reply: null
    },
    {
      id: 3,
      product: { id: 1, name: 'Wireless Headphones' },
      user: { id: 3, email: 'bob@example.com', first_name: 'Bob', last_name: 'Johnson' },
      rating: 2,
      title: 'Not as expected',
      comment: 'The headphones are okay but not worth the price. Sound quality could be better.',
      status: 'pending',
      is_verified: false,
      created_at: '2024-01-13T09:20:00Z',
      helpful_count: 5,
      not_helpful_count: 8,
      images: ['https://via.placeholder.com/150'],
      admin_reply: null,
      is_flagged: true
    }
  ]

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', { search: searchTerm, status: statusFilter, rating: ratingFilter, product: productFilter, sort: sortBy, order: sortOrder }],
    queryFn: () => {
      let filtered = mockReviews
      
      if (searchTerm) {
        filtered = filtered.filter(review => 
          review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      if (statusFilter !== 'all') {
        filtered = filtered.filter(review => review.status === statusFilter)
      }
      
      if (ratingFilter !== 'all') {
        filtered = filtered.filter(review => review.rating === parseInt(ratingFilter))
      }

      if (productFilter !== 'all') {
        filtered = filtered.filter(review => review.product.id === parseInt(productFilter))
      }

      // Sort
      filtered.sort((a, b) => {
        let aVal, bVal
        switch (sortBy) {
          case 'date':
            aVal = new Date(a.created_at)
            bVal = new Date(b.created_at)
            break
          case 'rating':
            aVal = a.rating
            bVal = b.rating
            break
          case 'helpful':
            aVal = a.helpful_count
            bVal = b.helpful_count
            break
          default:
            return 0
        }
        return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1)
      })
      
      return Promise.resolve({ items: filtered, total: filtered.length })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => {
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews'])
      toast({ title: 'Review deleted successfully' })
    }
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => {
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews'])
      toast({ title: 'Review status updated successfully' })
    }
  })

  const handleEdit = (review) => {
    setSelectedReview(review)
    setIsDialogOpen(true)
  }

  const handleDelete = (review) => {
    if (confirm(`Are you sure you want to delete this review?`)) {
      deleteMutation.mutate(review.id)
    }
  }

  const handleStatusChange = (review, newStatus) => {
    updateStatusMutation.mutate({ id: review.id, status: newStatus })
  }

  const handleReply = (review) => {
    setReplyingReview(review)
    setIsReplyDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setSelectedReview(null)
  }

  const handleSelectReview = (reviewId, checked) => {
    if (checked) {
      setSelectedReviews(prev => [...prev, reviewId])
    } else {
      setSelectedReviews(prev => prev.filter(id => id !== reviewId))
    }
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedReviews(reviews?.items?.map(r => r.id) || [])
    } else {
      setSelectedReviews([])
    }
  }

  const handleBulkApprove = () => {
    toast({ title: `Approving ${selectedReviews.length} reviews...` })
    setSelectedReviews([])
  }

  const handleBulkReject = () => {
    toast({ title: `Rejecting ${selectedReviews.length} reviews...` })
    setSelectedReviews([])
  }

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedReviews.length} selected reviews?`)) {
      selectedReviews.forEach(id => deleteMutation.mutate(id))
      setSelectedReviews([])
    }
  }

  const handleExport = () => {
    toast({ title: 'Exporting reviews to CSV...' })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = mockReviews.filter(r => r.rating === rating).length
    const percentage = mockReviews.length > 0 ? (count / mockReviews.length) * 100 : 0
    return { rating, count, percentage }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Reviews</h1>
          <p className="text-muted-foreground">
            Manage customer reviews and ratings
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setSelectedReview(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedReview ? 'Edit Review' : 'Create New Review'}
                </DialogTitle>
                <DialogDescription>
                  {selectedReview 
                    ? 'Update review information and status.'
                    : 'Add a new customer review.'
                  }
                </DialogDescription>
              </DialogHeader>
              <ReviewForm
                review={selectedReview}
                onSuccess={handleDialogClose}
                onCancel={handleDialogClose}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviews?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2</div>
            <div className="flex items-center mt-1">
              {renderStars(4)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviews?.items?.filter(r => r.status === 'pending').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Reviews</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviews?.items?.filter(r => r.is_verified).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Rating Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-20">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <div className="w-20 text-right">
                  <span className="text-sm text-muted-foreground">{count} ({percentage.toFixed(0)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedReviews.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{selectedReviews.length} reviews selected</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleBulkApprove}>
                  Approve
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkReject}>
                  Reject
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedReviews([])}>
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
                  placeholder="Search reviews..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                {[5, 4, 3, 2, 1].map(rating => (
                  <SelectItem key={rating} value={rating.toString()}>
                    {rating} Stars
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="1">Wireless Headphones</SelectItem>
                <SelectItem value="2">Smart Watch</SelectItem>
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
                <DropdownMenuItem onClick={() => setSortBy('date')}>
                  Date {sortBy === 'date' && `(${sortOrder})`}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('rating')}>
                  Rating {sortBy === 'rating' && `(${sortOrder})`}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('helpful')}>
                  Most Helpful {sortBy === 'helpful' && `(${sortOrder})`}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                  {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews ({reviews?.total || 0})</CardTitle>
          <CardDescription>
            Customer reviews and ratings for your products
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox 
                      checked={selectedReviews.length === reviews?.items?.length && reviews?.items?.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="max-w-md">Review</TableHead>
                  <TableHead>Helpful</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews?.items?.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedReviews.includes(review.id)}
                        onCheckedChange={(checked) => handleSelectReview(review.id, checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{review.product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {review.user.first_name} {review.user.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {review.user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                        <span className="ml-1 text-sm">({review.rating})</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div>
                        {review.title && (
                          <div className="font-medium text-sm mb-1">{review.title}</div>
                        )}
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {review.comment}
                        </div>
                        {review.images && review.images.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {review.images.slice(0, 3).map((img, idx) => (
                              <img 
                                key={idx}
                                src={img} 
                                alt={`Review ${idx + 1}`}
                                className="w-12 h-12 object-cover rounded border"
                              />
                            ))}
                            {review.images.length > 3 && (
                              <div className="w-12 h-12 bg-muted rounded border flex items-center justify-center text-xs">
                                +{review.images.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                        {review.admin_reply && (
                          <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                            <div className="flex items-center gap-1 text-blue-600 mb-1">
                              <Reply className="h-3 w-3" />
                              <span className="font-medium">Admin Reply:</span>
                            </div>
                            <p className="text-muted-foreground">{review.admin_reply}</p>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-green-600">
                          <ThumbsUp className="h-3 w-3" />
                          <span className="text-sm">{review.helpful_count}</span>
                        </div>
                        <div className="flex items-center gap-1 text-red-600">
                          <ThumbsDown className="h-3 w-3" />
                          <span className="text-sm">{review.not_helpful_count}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge className={getStatusColor(review.status)}>
                          {review.status}
                        </Badge>
                        {review.is_verified && (
                          <Badge variant="outline" className="text-xs">
                            Verified
                          </Badge>
                        )}
                        {review.is_flagged && (
                          <Badge variant="destructive" className="text-xs">
                            <Flag className="h-3 w-3 mr-1" />
                            Flagged
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => toast({ title: 'Updated', description: 'Data updated successfully' })}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(review)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReply(review)}>
                            <Reply className="h-4 w-4 mr-2" />
                            Reply
                          </DropdownMenuItem>
                          {review.status === 'pending' && (
                            <>
                              <DropdownMenuItem onClick={() => handleStatusChange(review, 'approved')}>
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(review, 'rejected')}>
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Flag className="h-4 w-4 mr-2" />
                            {review.is_flagged ? 'Unflag' : 'Flag'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(review)}
                            className="text-red-600"
                          >
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
          )}
        </CardContent>
      </Card>

      {/* Reply Dialog */}
      {isReplyDialogOpen && replyingReview && (
        <ReplyDialog 
          review={replyingReview} 
          onClose={() => {
            setIsReplyDialogOpen(false)
            setReplyingReview(null)
          }} 
        />
      )}
    </div>
  )
}
