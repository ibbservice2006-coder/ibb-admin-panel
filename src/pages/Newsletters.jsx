import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Search, Mail, Edit, Trash2, Send, Users, FileText, Calendar } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

function NewsletterFormDialog({ newsletter, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: newsletter?.title || '',
    subject: newsletter?.subject || '',
    content: newsletter?.content || '',
    subscribers: newsletter?.subscribers || 0,
    sendDate: newsletter?.sendDate || '',
    status: newsletter?.status || 'Draft'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{newsletter ? 'Edit Newsletter' : 'Create Newsletter'}</DialogTitle>
          <DialogDescription>Configure newsletter settings and content</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Newsletter Title *</Label>
            <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Monthly Newsletter - October 2024" required />
          </div>
          <div>
            <Label>Email Subject *</Label>
            <Input value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="e.g. October Newsletter - What's New" required />
          </div>
          <div>
            <Label>Content</Label>
            <Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Newsletter content..." rows={6} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Subscribers</Label>
              <Input type="number" value={formData.subscribers} onChange={(e) => setFormData({ ...formData, subscribers: parseInt(e.target.value) })} placeholder="0" />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Sent">Sent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Send Date</Label>
            <Input type="datetime-local" value={formData.sendDate} onChange={(e) => setFormData({ ...formData, sendDate: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button size="sm" type="submit" className="bg-gray-700 hover:bg-gray-600 text-white">{newsletter ? 'Save Changes' : 'Create Newsletter'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function Newsletters() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingNewsletter, setEditingNewsletter] = useState(null)
  const [newsletters, setNewsletters] = useState([
  const [isOpen, setIsOpen] = useState(false)
    { id: 1, title: 'Monthly Newsletter - September', subject: 'September Newsletter - What\'s New', status: 'Sent', sendDate: '2024-09-01', subscribers: 12450, openRate: 45.2 },
    { id: 2, title: 'Weekly Update #42', subject: 'This Week in Review', status: 'Sent', sendDate: '2024-09-28', subscribers: 11890, openRate: 38.7 },
    { id: 3, title: 'Monthly Newsletter - October', subject: 'October Newsletter - Fall Collection', status: 'Scheduled', sendDate: '2024-10-01', subscribers: 13200, openRate: 0 },
    { id: 4, title: 'Holiday Special Edition', subject: 'Holiday Gift Guide 2024', status: 'Draft', sendDate: '', subscribers: 0, openRate: 0 }
  ])

  const handleSave = (data) => {
    if (editingNewsletter) {
      setNewsletters(newsletters.map(n => n.id === editingNewsletter.id ? { ...n, ...data } : n))
      toast({ title: 'Newsletter updated successfully' })
    } else {
      setNewsletters([...newsletters, { ...data, id: Date.now(), openRate: 0 }])
      toast({ title: 'Newsletter created successfully' })
    }
    setEditingNewsletter(null)
  }

  const handleCreate = () => { setEditingNewsletter(null); setIsFormOpen(true) }
  const handleEdit = (newsletter) => { setEditingNewsletter(newsletter); setIsFormOpen(true) }
  const handleDelete = (newsletter) => {
    if (confirm(`Delete "${newsletter.title}"?`)) {
      setNewsletters(newsletters.filter(n => n.id !== newsletter.id))
      toast({ title: 'Newsletter deleted' })
    }
  }

  const filteredNewsletters = newsletters.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()) || n.subject.toLowerCase().includes(searchTerm.toLowerCase()))

  const stats = [
    { title: 'Total Newsletters', value: newsletters.length, icon: FileText, color: 'text-blue-600' },
    { title: 'Total Subscribers', value: newsletters.reduce((sum, n) => sum + n.subscribers, 0).toLocaleString(), icon: Users, color: 'text-green-600' },
    { title: 'Sent', value: newsletters.filter(n => n.status === 'Sent').length, icon: Send, color: 'text-purple-600' },
    { title: 'Avg Open Rate', value: `${(newsletters.filter(n => n.status === 'Sent').reduce((sum, n) => sum + n.openRate, 0) / newsletters.filter(n => n.status === 'Sent').length || 0).toFixed(1)}%`, icon: Mail, color: 'text-orange-600' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Newsletters</h1>
          <p className="text-muted-foreground">Create and manage newsletter campaigns</p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={handleCreate}><Plus />Create Newsletter</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{stat.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Newsletters</CardTitle>
          <CardDescription>Manage your newsletter campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search newsletters..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8" />
            </div>
          </div>

          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left text-sm font-medium">Title</th>
                  <th className="p-3 text-left text-sm font-medium">Subject</th>
                  <th className="p-3 text-left text-sm font-medium">Status</th>
                  <th className="p-3 text-left text-sm font-medium">Subscribers</th>
                  <th className="p-3 text-left text-sm font-medium">Open Rate</th>
                  <th className="p-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNewsletters.map((newsletter) => (
                  <tr key={newsletter.id} className="border-b">
                    <td className="p-3 font-medium">{newsletter.title}</td>
                    <td className="p-3 text-sm text-muted-foreground">{newsletter.subject}</td>
                    <td className="p-3"><Badge variant={newsletter.status === 'Sent' ? 'default' : newsletter.status === 'Scheduled' ? 'secondary' : 'outline'}>{newsletter.status}</Badge></td>
                    <td className="p-3 text-sm">{newsletter.subscribers.toLocaleString()}</td>
                    <td className="p-3 text-sm">{newsletter.openRate}%</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(newsletter)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(newsletter)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <NewsletterFormDialog newsletter={editingNewsletter} isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setEditingNewsletter(null) }} onSave={handleSave} />
    </div>
  )
}
