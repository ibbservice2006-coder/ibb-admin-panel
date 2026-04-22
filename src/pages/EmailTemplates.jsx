import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Plus, Search, Mail, Edit, Copy, Trash2, Eye, 
  CheckCircle2, Clock, FileText
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Template Form Dialog
function TemplateFormDialog({ template, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    subject: template?.subject || '',
    category: template?.category || 'Marketing',
    status: template?.status || 'Draft',
    content: template?.content || ''
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
          <DialogTitle>{template ? 'Edit Template' : 'Create Template'}</DialogTitle>
          <DialogDescription>
            Configure email template settings and content
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Template Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Order Confirmation"
              required
            />
          </div>
          <div>
            <Label>Email Subject *</Label>
            <Input
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g. Your Order #{{order_number}} is Confirmed"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use {'{{variable}}'} syntax for dynamic content
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category *</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Transactional">Transactional</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Newsletter">Newsletter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status *</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Email Content</Label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter email HTML content or plain text..."
              rows={8}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button size="sm" type="submit" className="bg-gray-700 hover:bg-gray-600 text-white">{template ? 'Save Changes' : 'Create Template'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function EmailTemplates() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [templates, setTemplates] = useState([
  const [isOpen, setIsOpen] = useState(false)
    {
      id: 1,
      name: 'Order Confirmation',
      subject: 'Your Order #{{order_number}} is Confirmed',
      category: 'Transactional',
      status: 'Active',
      lastModified: '2024-10-01',
      usageCount: 1234
    },
    {
      id: 2,
      name: 'Shipping Notification',
      subject: 'Your Order is On The Way!',
      category: 'Transactional',
      status: 'Active',
      lastModified: '2024-09-28',
      usageCount: 1156
    },
    {
      id: 3,
      name: 'Welcome Email',
      subject: 'Welcome to Our Store!',
      category: 'Marketing',
      status: 'Active',
      lastModified: '2024-09-25',
      usageCount: 456
    },
    {
      id: 4,
      name: 'Abandoned Cart',
      subject: 'You Left Something Behind...',
      category: 'Marketing',
      status: 'Active',
      lastModified: '2024-09-20',
      usageCount: 789
    },
    {
      id: 5,
      name: 'Order Delivered',
      subject: 'Your Order Has Been Delivered',
      category: 'Transactional',
      status: 'Active',
      lastModified: '2024-09-15',
      usageCount: 1089
    },
    {
      id: 6,
      name: 'Password Reset',
      subject: 'Reset Your Password',
      category: 'Transactional',
      status: 'Active',
      lastModified: '2024-09-10',
      usageCount: 234
    },
    {
      id: 7,
      name: 'Newsletter Template',
      subject: 'Monthly Newsletter - {{month}}',
      category: 'Newsletter',
      status: 'Draft',
      lastModified: '2024-10-03',
      usageCount: 0
    },
    {
      id: 8,
      name: 'Promotional Offer',
      subject: 'Special Offer Just For You!',
      category: 'Marketing',
      status: 'Active',
      lastModified: '2024-09-30',
      usageCount: 567
    }
  ])

  const stats = [
    {
      title: 'Total Templates',
      value: templates.length,
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Active Templates',
      value: templates.filter(t => t.status === 'Active').length,
      icon: CheckCircle2,
      color: 'text-green-600'
    },
    {
      title: 'Draft Templates',
      value: templates.filter(t => t.status === 'Draft').length,
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Total Sent',
      value: templates.reduce((sum, t) => sum + t.usageCount, 0).toLocaleString(),
      icon: Mail,
      color: 'text-purple-600'
    }
  ]

  const handleSave = (data) => {
    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === editingTemplate.id ? { ...t, ...data, lastModified: new Date().toISOString().split('T')[0] } : t))
      toast({ title: 'Template updated successfully' })
    } else {
      setTemplates([...templates, { ...data, id: Date.now(), usageCount: 0, lastModified: new Date().toISOString().split('T')[0] }])
      toast({ title: 'Template created successfully' })
    }
    setEditingTemplate(null)
  }

  const handleCreateTemplate = () => {
    setEditingTemplate(null)
    setIsFormOpen(true)
  }

  const handleEditTemplate = (template) => {
    setEditingTemplate(template)
    setIsFormOpen(true)
  }

  const handleDuplicateTemplate = (template) => {
    const newTemplate = { ...template, id: Date.now(), name: `${template.name} (Copy)`, usageCount: 0 }
    setTemplates([...templates, newTemplate])
    toast({ title: 'Template duplicated successfully' })
  }

  const handlePreviewTemplate = (template) => {
    toast({
      title: 'Preview Template',
      description: `Opening preview for ${template.name}...`
    })
  }

  const handleDeleteTemplate = (template) => {
    if (confirm(`Are you sure you want to delete "${template.name}"?`)) {
      setTemplates(templates.filter(t => t.id !== template.id))
      toast({ title: 'Template deleted', variant: 'destructive' })
    }
  }

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
          <p className="text-muted-foreground">
            Manage your email templates for transactional and marketing emails
          </p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleCreateTemplate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
          <CardDescription>
            Browse and manage your email templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Templates Table */}
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left text-sm font-medium">Name</th>
                  <th className="p-3 text-left text-sm font-medium">Subject</th>
                  <th className="p-3 text-left text-sm font-medium">Category</th>
                  <th className="p-3 text-left text-sm font-medium">Status</th>
                  <th className="p-3 text-left text-sm font-medium">Usage</th>
                  <th className="p-3 text-left text-sm font-medium">Last Modified</th>
                  <th className="p-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTemplates.map((template) => (
                  <tr key={template.id} className="border-b">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{template.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {template.subject}
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{template.category}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge 
                        variant={template.status === 'Active' ? 'default' : 'secondary'}
                      >
                        {template.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm">
                      {template.usageCount.toLocaleString()} sent
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {template.lastModified}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePreviewTemplate(template)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDuplicateTemplate(template)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTemplate(template)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <TemplateFormDialog
        template={editingTemplate}
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingTemplate(null); }}
        onSave={handleSave}
      />
    </div>
  )
}
