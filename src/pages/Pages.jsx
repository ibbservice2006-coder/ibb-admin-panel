import { useState } from 'react'
import { Search, Plus, Edit, Trash2, FileText, Eye, EyeOff, Globe, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function Pages() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPage, setSelectedPage] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    status: 'published',
    visibility: 'public'
  })

  const [pages, setPages] = useState([
    {
      id: 1,
      title: 'About Us',
      slug: 'about-us',
      content: 'Learn more about our company, mission, and values...',
      status: 'published',
      visibility: 'public',
      author: 'John Doe',
      views: 1245,
      createdAt: '2024-01-15',
      updatedAt: '2024-09-20'
    },
    {
      id: 2,
      title: 'Contact Us',
      slug: 'contact',
      content: 'Get in touch with our customer support team...',
      status: 'published',
      visibility: 'public',
      author: 'Sarah Smith',
      views: 892,
      createdAt: '2024-01-15',
      updatedAt: '2024-08-10'
    },
    {
      id: 3,
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      content: 'This privacy policy explains how we collect and use your data...',
      status: 'published',
      visibility: 'public',
      author: 'Mike Johnson',
      views: 2341,
      createdAt: '2024-01-15',
      updatedAt: '2024-10-01'
    },
    {
      id: 4,
      title: 'Terms of Service',
      slug: 'terms-of-service',
      content: 'By using our services, you agree to these terms...',
      status: 'published',
      visibility: 'public',
      author: 'Mike Johnson',
      views: 1876,
      createdAt: '2024-01-15',
      updatedAt: '2024-10-01'
    },
    {
      id: 5,
      title: 'Shipping Information',
      slug: 'shipping-info',
      content: 'Learn about our shipping methods, rates, and delivery times...',
      status: 'published',
      visibility: 'public',
      author: 'Emily Brown',
      views: 567,
      createdAt: '2024-02-20',
      updatedAt: '2024-09-15'
    },
    {
      id: 6,
      title: 'Return Policy',
      slug: 'return-policy',
      content: 'Our return policy allows you to return items within 30 days...',
      status: 'published',
      visibility: 'public',
      author: 'Emily Brown',
      views: 423,
      createdAt: '2024-02-20',
      updatedAt: '2024-09-15'
    },
    {
      id: 7,
      title: 'FAQ',
      slug: 'faq',
      content: 'Frequently asked questions about our products and services...',
      status: 'published',
      visibility: 'public',
      author: 'David Wilson',
      views: 1534,
      createdAt: '2024-03-10',
      updatedAt: '2024-10-02'
    },
    {
      id: 8,
      title: 'Careers',
      slug: 'careers',
      content: 'Join our team! View current job openings...',
      status: 'draft',
      visibility: 'private',
      author: 'Sarah Smith',
      views: 0,
      createdAt: '2024-10-01',
      updatedAt: '2024-10-03'
    }
  ])

  const stats = [
    {
      title: 'Total Pages',
      value: pages.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Published',
      value: pages.filter(p => p.status === 'published').length,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Drafts',
      value: pages.filter(p => p.status === 'draft').length,
      icon: EyeOff,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Total Views',
      value: pages.reduce((sum, p) => sum + p.views, 0).toLocaleString(),
      icon: Globe,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  const filteredPages = pages.filter(page => {
    const matchesSearch = 
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleAddClick = () => {
    setFormData({ title: '', slug: '', content: '', status: 'published', visibility: 'public' })
    setIsAddDialogOpen(true)
  }

  const handleEditClick = (page) => {
    setSelectedPage(page)
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      status: page.status,
      visibility: page.visibility
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (page) => {
    setSelectedPage(page)
    setIsDeleteDialogOpen(true)
  }

  const handleAdd = () => {
    const newPage = {
      id: pages.length + 1,
      ...formData,
      author: 'John Doe',
      views: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
    setPages([...pages, newPage])
    setIsAddDialogOpen(false)
  }

  const handleSave = () => {
    setPages(pages.map(page =>
      page.id === selectedPage.id 
        ? { ...page, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
        : page
    ))
    setIsEditDialogOpen(false)
  }

  const handleDelete = () => {
    setPages(pages.filter(page => page.id !== selectedPage.id))
    setIsDeleteDialogOpen(false)
  }

  const toggleStatus = (pageId) => {
    setPages(pages.map(page =>
      page.id === pageId
        ? { 
            ...page, 
            status: page.status === 'published' ? 'draft' : 'published',
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : page
    ))
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (title) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Pages</h1>
        <p className="text-muted-foreground">Manage website content pages</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Pages</CardTitle>
              <CardDescription>Create and manage content pages</CardDescription>
            </div>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleAddClick}>
              <Plus className="mr-2 h-4 w-4" />
              Add Page
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
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
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No pages found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div className="font-medium">{page.title}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        /{page.slug}
                      </TableCell>
                      <TableCell>
                        <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                          {page.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {page.visibility === 'public' ? (
                            <>
                              <Globe className="h-3 w-3 text-green-600" />
                              <span className="text-sm">Public</span>
                            </>
                          ) : (
                            <>
                              <Lock className="h-3 w-3 text-orange-600" />
                              <span className="text-sm">Private</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{page.author}</TableCell>
                      <TableCell className="text-sm">{page.views.toLocaleString()}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{page.updatedAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleStatus(page.id)}
                            title={page.status === 'published' ? 'Unpublish' : 'Publish'}
                          >
                            {page.status === 'published' ? (
                              <EyeOff className="h-4 w-4 text-orange-600" />
                            ) : (
                              <Eye className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(page)}
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(page)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        setIsAddDialogOpen(false)
        setIsEditDialogOpen(false)
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isAddDialogOpen ? 'Add New Page' : 'Edit Page'}</DialogTitle>
            <DialogDescription>
              {isAddDialogOpen ? 'Create a new content page' : 'Update page information'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., About Us"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">/</span>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="about-us"
                  className="font-mono"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Auto-generated from title. You can customize it.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter page content..."
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Supports HTML and Markdown formatting
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select value={formData.visibility} onValueChange={(value) => setFormData({ ...formData, visibility: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => {
              setIsAddDialogOpen(false)
              setIsEditDialogOpen(false)
            }}>
              Cancel
            </Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={isAddDialogOpen ? handleAdd : handleSave}>
              {isAddDialogOpen ? 'Add Page' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the page
              <strong> "{selectedPage?.title}"</strong> and remove it from your website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
