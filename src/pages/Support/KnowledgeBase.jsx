import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { BookOpen, Plus, Edit, Trash2, Eye, Search, TrendingUp, FileText, Users, Clock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const articlesData = [
  { id: 1, title: 'Getting Started with IBB Shuttle Booking', category: 'Getting Started', status: 'published', author: 'IBB Team', views: 4820, lastUpdated: '2026-03-10', readTime: '5 min', lang: 'EN', tags: ['booking', 'beginner'], excerpt: 'A complete guide to making your first booking with IBB Shuttle Service, from choosing your route to payment.' },
  { id: 2, title: 'IBB Wallet — How to Top Up and Use', category: 'Payments', status: 'published', author: 'Finance Team', views: 3640, lastUpdated: '2026-03-12', readTime: '4 min', lang: 'EN', tags: ['wallet', 'payment'], excerpt: 'Learn how to add funds to your IBB Wallet and use it for faster checkout on all future bookings.' },
  { id: 3, title: 'Airport Pickup Guide — Suvarnabhumi & Don Mueang', category: 'Routes', status: 'published', author: 'Operations', views: 6210, lastUpdated: '2026-03-15', readTime: '6 min', lang: 'EN', tags: ['airport', 'pickup', 'BKK'], excerpt: 'Detailed instructions on where to meet your IBB driver at both Bangkok airports, including terminal maps.' },
  { id: 4, title: 'Membership Tiers — Standard, Premium, VIP, VVIP', category: 'Membership', status: 'published', author: 'IBB Team', views: 2980, lastUpdated: '2026-03-08', readTime: '7 min', lang: 'EN', tags: ['membership', 'benefits'], excerpt: 'Compare all membership tiers and discover the exclusive benefits available at each level.' },
  { id: 5, title: 'Cancellation & Refund Policy', category: 'Policies', status: 'published', author: 'Legal Team', views: 5420, lastUpdated: '2026-03-01', readTime: '3 min', lang: 'EN', tags: ['cancellation', 'refund', 'policy'], excerpt: 'Full details on our cancellation windows, refund timelines, and how to request a refund.' },
  { id: 6, title: 'Driver Safety Standards & Verification', category: 'Safety', status: 'published', author: 'Safety Team', views: 1840, lastUpdated: '2026-02-28', readTime: '5 min', lang: 'EN', tags: ['safety', 'driver', 'verification'], excerpt: 'How IBB verifies and trains all drivers, including background checks, license verification, and ongoing monitoring.' },
  { id: 7, title: 'How to book IBB Shuttle airport transfer', category: 'Getting Started', status: 'published', author: 'IBB Team', views: 3120, lastUpdated: '2026-03-10', readTime: '5 min', lang: 'TH', tags: ['booking', 'beginner', 'thai'], excerpt: 'IBB Shuttle airport transfer booking guide from route selection to payment' },
  { id: 8, title: 'Group Booking Guide (5+ Passengers)', category: 'Booking', status: 'published', author: 'Sales Team', views: 2240, lastUpdated: '2026-03-05', readTime: '4 min', lang: 'EN', tags: ['group', 'booking', 'corporate'], excerpt: 'Special instructions for booking multiple vehicles or large groups, including corporate account setup.' },
  { id: 9, title: 'Tracking Your Shuttle in Real-Time', category: 'Technology', status: 'published', author: 'Tech Team', views: 1680, lastUpdated: '2026-02-20', readTime: '3 min', lang: 'EN', tags: ['tracking', 'GPS', 'app'], excerpt: 'How to use the IBB tracking feature to monitor your driver\'s location and estimated arrival time.' },
  { id: 10, question: 'Partner & Affiliate Program Guide', title: 'Partner & Affiliate Program Guide', category: 'Partners', status: 'draft', author: 'Partnership Team', views: 0, lastUpdated: '2026-03-20', readTime: '8 min', lang: 'EN', tags: ['partner', 'affiliate', 'referral'], excerpt: 'How to join the IBB Partner Program, earn referral fees, and track your commissions.' },
]

const categories = ['Getting Started', 'Booking', 'Payments', 'Routes', 'Membership', 'Policies', 'Safety', 'Technology', 'Partners']

export default function KnowledgeBase() {
  const [articles, setArticles] = useState(articlesData)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [langFilter, setLangFilter] = useState('all')
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editForm, setEditForm] = useState({})
  const { toast } = useToast()

  const filtered = articles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'all' || a.category === categoryFilter
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    const matchLang = langFilter === 'all' || a.lang === langFilter
    return matchSearch && matchCat && matchStatus && matchLang
  })

  const stats = [
    { title: 'Total Articles', value: articles.length, icon: BookOpen, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    { title: 'Published', value: articles.filter(a => a.status === 'published').length, icon: FileText, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
    { title: 'Total Views', value: articles.reduce((s, a) => s + a.views, 0).toLocaleString(), icon: TrendingUp, bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
    { title: 'Authors', value: [...new Set(articles.map(a => a.author))].length, icon: Users, bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
  ]

  const handleDelete = () => {
    setArticles(articles.filter(a => a.id !== selectedArticle.id))
    setIsDeleteOpen(false)
    toast({ title: 'Article Deleted', description: `"${selectedArticle.title}" has been deleted.`, variant: 'destructive' })
  }

  const handleSave = () => {
    if (isEditOpen) {
      setArticles(articles.map(a => a.id === selectedArticle.id ? { ...a, ...editForm } : a))
      setIsEditOpen(false)
      toast({ title: 'Article Updated', description: 'Article has been updated successfully.' })
    } else {
      const newArticle = { ...editForm, id: articles.length + 1, views: 0, lastUpdated: new Date().toISOString().split('T')[0], tags: [] }
      setArticles([...articles, newArticle])
      setIsAddOpen(false)
      toast({ title: 'Article Added', description: 'New article has been added successfully.' })
    }
    setEditForm({})
  }

  const openEdit = (article) => {
    setSelectedArticle(article)
    setEditForm({ title: article.title, excerpt: article.excerpt, category: article.category, status: article.status, lang: article.lang, author: article.author, readTime: article.readTime })
    setIsEditOpen(true)
  }

  const openAdd = () => {
    setEditForm({ title: '', excerpt: '', category: 'Getting Started', status: 'draft', lang: 'EN', author: '', readTime: '5 min' })
    setIsAddOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Base</h1>
          <p className="text-muted-foreground">Articles and guides for customers and partners</p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={openAdd}><Plus />New Article</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}><stat.icon className={`h-4 w-4 ${stat.iconColor}`} /></div>
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{stat.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Articles</CardTitle>
          <CardDescription>Click View to read article — Click Edit to modify</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={langFilter} onValueChange={setLangFilter}>
              <SelectTrigger className="w-[110px]"><SelectValue placeholder="Language" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Lang</SelectItem>
                <SelectItem value="EN">English</SelectItem>
                <SelectItem value="TH">Thai</SelectItem>
                <SelectItem value="ZH">Chinese</SelectItem>
                <SelectItem value="JA">Japanese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Lang</TableHead>
                  <TableHead>Read Time</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No articles found</TableCell></TableRow>
                ) : filtered.map(article => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <p className="text-sm font-medium max-w-xs truncate">{article.title}</p>
                      <p className="text-xs text-muted-foreground max-w-xs truncate">{article.excerpt}</p>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{article.category}</Badge></TableCell>
                    <TableCell className="text-sm">{article.author}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{article.lang}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />{article.readTime}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{article.views.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{article.lastUpdated}</TableCell>
                    <TableCell>
                      <Badge className={article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} variant="outline">
                        {article.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedArticle(article); setIsViewOpen(true) }}>
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(article)}>
                          <Edit className="h-4 w-4 text-yellow-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedArticle(article); setIsDeleteOpen(true) }}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-sm text-muted-foreground mt-3">Showing {filtered.length} of {articles.length} articles</p>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedArticle?.title}</DialogTitle>
            <DialogDescription>
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge variant="outline">{selectedArticle?.category}</Badge>
                <Badge variant="secondary">{selectedArticle?.lang}</Badge>
                <Badge className={selectedArticle?.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} variant="outline">{selectedArticle?.status}</Badge>
              </div>
            </DialogDescription>
          </DialogHeader>
          {selectedArticle && (
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-xs">Excerpt</Label>
                <p className="text-sm mt-1 leading-relaxed">{selectedArticle.excerpt}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><Label className="text-muted-foreground text-xs">Author</Label><p className="font-medium">{selectedArticle.author}</p></div>
                <div><Label className="text-muted-foreground text-xs">Read Time</Label><p className="font-medium">{selectedArticle.readTime}</p></div>
                <div><Label className="text-muted-foreground text-xs">Last Updated</Label><p className="font-medium">{selectedArticle.lastUpdated}</p></div>
                <div><Label className="text-muted-foreground text-xs">Views</Label><p className="font-medium">{selectedArticle.views.toLocaleString()}</p></div>
              </div>
              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div>
                  <Label className="text-muted-foreground text-xs">Tags</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedArticle.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">#{tag}</Badge>)}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setIsViewOpen(false); openEdit(selectedArticle) }}>Edit Article</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={isEditOpen || isAddOpen} onOpenChange={(open) => { if (!open) { setIsEditOpen(false); setIsAddOpen(false) } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditOpen ? 'Edit Article' : 'New Article'}</DialogTitle>
            <DialogDescription>{isEditOpen ? `Editing: ${selectedArticle?.title}` : 'Create a new knowledge base article'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="Article title..." value={editForm.title || ''} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Excerpt / Summary</Label>
              <Textarea placeholder="Brief description..." value={editForm.excerpt || ''} onChange={e => setEditForm({ ...editForm, excerpt: e.target.value })} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={editForm.category || 'Getting Started'} onValueChange={v => setEditForm({ ...editForm, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={editForm.lang || 'EN'} onValueChange={v => setEditForm({ ...editForm, lang: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EN">English</SelectItem>
                    <SelectItem value="TH">Thai</SelectItem>
                    <SelectItem value="ZH">Chinese</SelectItem>
                    <SelectItem value="JA">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <Input placeholder="Author name..." value={editForm.author || ''} onChange={e => setEditForm({ ...editForm, author: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={editForm.status || 'draft'} onValueChange={v => setEditForm({ ...editForm, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => { setIsEditOpen(false); setIsAddOpen(false) }}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSave} disabled={!editForm.title || !editForm.excerpt}>{isEditOpen ? 'Save Changes' : 'Create Article'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article?</AlertDialogTitle>
            <AlertDialogDescription>Delete article "{selectedArticle?.title}" Log out? This action is irreversible</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
