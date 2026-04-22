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
import { HelpCircle, Plus, Edit, Trash2, Eye, Search, ThumbsUp, TrendingUp, BookOpen } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const faqData = [
  { id: 1, question: 'How do I book a shuttle from Suvarnabhumi Airport to Pattaya?', answer: 'You can book directly through our website, LINE Official Account (@ibbshuttle), or call our 24/7 hotline at +66-2-XXX-XXXX. Booking at least 24 hours in advance is recommended for guaranteed availability.', category: 'Booking', status: 'published', helpful: 142, unhelpful: 8, views: 1840, lang: 'EN', order: 1 },
  { id: 2, question: 'What is the price from Bangkok Airport to Hua Hin?', answer: 'Standard price ฿3,200/trip up to 4 passengers standard van. VIP vehicles ฿4,500. Prices may vary during peak seasons (Songkran, New Year). See Pricing page for details.', category: 'Pricing', status: 'published', helpful: 218, unhelpful: 12, views: 2640, lang: 'EN', order: 2 },
  { id: 3, question: 'Can I cancel or change my booking?', answer: 'Free cancellation is available up to 24 hours before your scheduled pickup. Cancellations within 24 hours incur a 50% fee. Changes to pickup time or location can be made up to 6 hours before departure subject to availability.', category: 'Booking', status: 'published', helpful: 96, unhelpful: 4, views: 1240, lang: 'EN', order: 3 },
  { id: 4, question: 'What payment methods do you accept?', answer: 'We accept: Credit/Debit cards (Visa, Mastercard, JCB), Bank transfer, QR PromptPay, IBB Wallet, WeChat Pay, Alipay. Cash payment is available for local customers only.', category: 'Payment', status: 'published', helpful: 184, unhelpful: 6, views: 2100, lang: 'EN', order: 4 },
  { id: 5, question: 'Do you offer child seats?', answer: 'Yes, child seats are available upon request at no extra charge. Please specify when booking. We have infant seats (0-13kg), toddler seats (9-18kg), and booster seats (15-36kg). Subject to availability.', category: 'Service', status: 'published', helpful: 72, unhelpful: 2, views: 890, lang: 'EN', order: 5 },
  { id: 6, question: 'How do I track my driver?', answer: 'Once your booking is confirmed and a driver is assigned (usually 2 hours before pickup), you will receive an SMS/LINE message with a real-time tracking link. You can also track via the IBB app or by logging into your account.', category: 'Service', status: 'published', helpful: 128, unhelpful: 5, views: 1560, lang: 'EN', order: 6 },
  { id: 7, question: 'What if my flight is delayed?', answer: 'IBB monitors flight arrivals in real-time. For airport pickups, we automatically adjust your pickup time based on actual landing time at no extra charge. Please ensure your flight number is provided when booking.', category: 'Booking', status: 'published', helpful: 204, unhelpful: 3, views: 2380, lang: 'EN', order: 7 },
  { id: 8, question: 'Do you serve Phuket and Chiang Mai?', answer: 'Currently IBB Shuttle operates routes between Bangkok (BKK/DMK), Pattaya, Hua Hin, and Rayong. Phuket and Chiang Mai routes are planned for Q3 2026. Sign up for our newsletter to be notified.', category: 'Routes', status: 'published', helpful: 56, unhelpful: 18, views: 980, lang: 'EN', order: 8 },
  { id: 9, question: 'How far in advance can bookings be made?', answer: 'Bookings allowed up to 90 days in advance. Recommend at least 24 hours prior, especially during Songkran and New Year peak periods.', category: 'Booking', status: 'published', helpful: 88, unhelpful: 2, views: 1120, lang: 'TH', order: 9 },
  { id: 10, question: 'Shuttle pickup location at Suvarnabhumi Airport?', answer: 'Meet your driver at Gate 4, Arrivals Hall (Level 2), near the IBB Shuttle counter. Look for the driver holding a sign with your name. If you cannot locate your driver, call the number in your confirmation SMS.', category: 'Routes', status: 'draft', helpful: 0, unhelpful: 0, views: 0, lang: 'EN', order: 10 },
]

const categories = ['Booking', 'Pricing', 'Payment', 'Service', 'Routes', 'Technical']

export default function FAQManagement() {
  const [faqs, setFaqs] = useState(faqData)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [langFilter, setLangFilter] = useState('all')
  const [selectedFaq, setSelectedFaq] = useState(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editForm, setEditForm] = useState({})
  const { toast } = useToast()

  const filtered = faqs.filter(f => {
    const matchSearch = f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'all' || f.category === categoryFilter
    const matchStatus = statusFilter === 'all' || f.status === statusFilter
    const matchLang = langFilter === 'all' || f.lang === langFilter
    return matchSearch && matchCat && matchStatus && matchLang
  })

  const stats = [
    { title: 'Total FAQs', value: faqs.length, icon: HelpCircle, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    { title: 'Published', value: faqs.filter(f => f.status === 'published').length, icon: BookOpen, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
    { title: 'Total Views', value: faqs.reduce((s, f) => s + f.views, 0).toLocaleString(), icon: TrendingUp, bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
    { title: 'Helpful Votes', value: faqs.reduce((s, f) => s + f.helpful, 0).toLocaleString(), icon: ThumbsUp, bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
  ]

  const handleDelete = () => {
    setFaqs(faqs.filter(f => f.id !== selectedFaq.id))
    setIsDeleteOpen(false)
    toast({ title: 'FAQ Deleted', description: `FAQ #${selectedFaq.id} has been deleted.`, variant: 'destructive' })
  }

  const handleSave = () => {
    if (isEditOpen) {
      setFaqs(faqs.map(f => f.id === selectedFaq.id ? { ...f, ...editForm } : f))
      setIsEditOpen(false)
      toast({ title: 'FAQ Updated', description: 'FAQ has been updated successfully.' })
    } else {
      const newFaq = { ...editForm, id: faqs.length + 1, helpful: 0, unhelpful: 0, views: 0, order: faqs.length + 1 }
      setFaqs([...faqs, newFaq])
      setIsAddOpen(false)
      toast({ title: 'FAQ Added', description: 'New FAQ has been added successfully.' })
    }
    setEditForm({})
  }

  const openEdit = (faq) => {
    setSelectedFaq(faq)
    setEditForm({ question: faq.question, answer: faq.answer, category: faq.category, status: faq.status, lang: faq.lang })
    setIsEditOpen(true)
  }

  const openAdd = () => {
    setEditForm({ question: '', answer: '', category: 'Booking', status: 'draft', lang: 'EN' })
    setIsAddOpen(true)
  }

  const helpfulRate = (faq) => {
    const total = faq.helpful + faq.unhelpful
    return total > 0 ? Math.round((faq.helpful / total) * 100) : 0
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">FAQ Management</h1>
          <p className="text-muted-foreground">Manage FAQs — shown on Website and App</p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={openAdd}><Plus />Add FAQ</Button>
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
          <CardTitle>FAQ List</CardTitle>
          <CardDescription>Click View for Details — Click Edit to Modify</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search FAQs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Category" /></SelectTrigger>
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
                  <TableHead className="w-8">#</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Lang</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Helpful %</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No FAQs found</TableCell></TableRow>
                ) : filtered.map(faq => (
                  <TableRow key={faq.id}>
                    <TableCell className="text-muted-foreground text-sm">{faq.order}</TableCell>
                    <TableCell>
                      <p className="text-sm font-medium max-w-xs truncate">{faq.question}</p>
                      <p className="text-xs text-muted-foreground max-w-xs truncate">{faq.answer}</p>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{faq.category}</Badge></TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{faq.lang}</Badge></TableCell>
                    <TableCell className="text-sm">{faq.views.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <ThumbsUp className="h-3 w-3 text-green-500" />
                        <span>{helpfulRate(faq)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={faq.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} variant="outline">
                        {faq.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedFaq(faq); setIsViewOpen(true) }}>
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(faq)}>
                          <Edit className="h-4 w-4 text-yellow-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedFaq(faq); setIsDeleteOpen(true) }}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-sm text-muted-foreground mt-3">Showing {filtered.length} of {faqs.length} FAQs</p>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>FAQ Details</DialogTitle>
            <DialogDescription>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline">{selectedFaq?.category}</Badge>
                <Badge variant="secondary">{selectedFaq?.lang}</Badge>
                <Badge className={selectedFaq?.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} variant="outline">{selectedFaq?.status}</Badge>
              </div>
            </DialogDescription>
          </DialogHeader>
          {selectedFaq && (
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-xs">Question</Label>
                <p className="font-medium mt-1">{selectedFaq.question}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Answer</Label>
                <p className="text-sm mt-1 leading-relaxed">{selectedFaq.answer}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-2 border-t text-center text-sm">
                <div><p className="font-bold text-lg">{selectedFaq.views.toLocaleString()}</p><p className="text-muted-foreground text-xs">Views</p></div>
                <div><p className="font-bold text-lg text-green-600">{selectedFaq.helpful}</p><p className="text-muted-foreground text-xs">Helpful</p></div>
                <div><p className="font-bold text-lg text-red-500">{selectedFaq.unhelpful}</p><p className="text-muted-foreground text-xs">Not Helpful</p></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setIsViewOpen(false); openEdit(selectedFaq) }}>Edit FAQ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={isEditOpen || isAddOpen} onOpenChange={(open) => { if (!open) { setIsEditOpen(false); setIsAddOpen(false) } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditOpen ? 'Edit FAQ' : 'Add New FAQ'}</DialogTitle>
            <DialogDescription>{isEditOpen ? `Editing FAQ #${selectedFaq?.id}` : 'Create a new FAQ entry'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Question</Label>
              <Textarea placeholder="Enter the question..." value={editForm.question || ''} onChange={e => setEditForm({ ...editForm, question: e.target.value })} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Answer</Label>
              <Textarea placeholder="Enter the answer..." value={editForm.answer || ''} onChange={e => setEditForm({ ...editForm, answer: e.target.value })} rows={4} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={editForm.category || 'Booking'} onValueChange={v => setEditForm({ ...editForm, category: v })}>
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
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSave} disabled={!editForm.question || !editForm.answer}>{isEditOpen ? 'Save Changes' : 'Add FAQ'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete FAQ?</AlertDialogTitle>
            <AlertDialogDescription>Delete this FAQ? This action cannot be undone.</AlertDialogDescription>
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
