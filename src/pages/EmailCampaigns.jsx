import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search, Send, Edit, Trash2, Eye, CheckCircle2, Clock, Mail, TrendingUp, Users } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

function CampaignFormDialog({ campaign, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    subject: campaign?.subject || '',
    template: campaign?.template || '',
    recipients: campaign?.recipients || 0,
    scheduledDate: campaign?.scheduledDate || '',
    status: campaign?.status || 'Draft'
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
          <DialogTitle>{campaign ? 'Edit Campaign' : 'Create Campaign'}</DialogTitle>
          <DialogDescription>Configure email campaign settings</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Campaign Name *</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Summer Sale 2024" required />
          </div>
          <div>
            <Label>Email Subject *</Label>
            <Input value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="e.g. Summer Sale - Up to 50% Off!" required />
          </div>
          <div>
            <Label>Email Template</Label>
            <Select value={formData.template} onValueChange={(v) => setFormData({ ...formData, template: v })}>
              <SelectTrigger><SelectValue placeholder="Select template" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="promotional">Promotional Template</SelectItem>
                <SelectItem value="newsletter">Newsletter Template</SelectItem>
                <SelectItem value="announcement">Announcement Template</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Recipients Count</Label>
              <Input type="number" value={formData.recipients} onChange={(e) => setFormData({ ...formData, recipients: parseInt(e.target.value) })} placeholder="0" />
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
            <Label>Schedule Date</Label>
            <Input type="datetime-local" value={formData.scheduledDate} onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button size="sm" type="submit" className="bg-gray-700 hover:bg-gray-600 text-white">{campaign ? 'Save Changes' : 'Create Campaign'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function EmailCampaigns() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState(null)
  const [campaigns, setCampaigns] = useState([
  const [isOpen, setIsOpen] = useState(false)
    { id: 1, name: 'Summer Sale 2024', subject: 'Summer Sale - Up to 50% Off!', status: 'Sent', sentDate: '2024-09-15', recipients: 15234, openRate: 32.5, clickRate: 8.3, revenue: 125680 },
    { id: 2, name: 'New Product Launch', subject: 'Introducing Our Latest Collection', status: 'Sent', sentDate: '2024-09-28', recipients: 18456, openRate: 28.7, clickRate: 6.9, revenue: 89340 },
    { id: 3, name: 'Flash Sale Weekend', subject: '24-Hour Flash Sale Starts Now!', status: 'Scheduled', scheduledDate: '2024-10-05 09:00', recipients: 20000, openRate: 0, clickRate: 0, revenue: 0 },
    { id: 4, name: 'Customer Appreciation', subject: 'Thank You for Being Our Customer', status: 'Draft', lastModified: '2024-10-02', recipients: 0, openRate: 0, clickRate: 0, revenue: 0 }
  ])

  const handleSave = (data) => {
    if (editingCampaign) {
      setCampaigns(campaigns.map(c => c.id === editingCampaign.id ? { ...c, ...data } : c))
      toast({ title: 'Campaign updated successfully' })
    } else {
      setCampaigns([...campaigns, { ...data, id: Date.now(), openRate: 0, clickRate: 0, revenue: 0 }])
      toast({ title: 'Campaign created successfully' })
    }
    setEditingCampaign(null)
  }

  const handleCreate = () => { setEditingCampaign(null); setIsFormOpen(true) }
  const handleEdit = (campaign) => { setEditingCampaign(campaign); setIsFormOpen(true) }
  const handleDelete = (campaign) => {
    if (confirm(`Delete "${campaign.name}"?`)) {
      setCampaigns(campaigns.filter(c => c.id !== campaign.id))
      toast({ title: 'Campaign deleted' })
    }
  }

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === 'all' || c.status.toLowerCase() === activeTab
    return matchesSearch && matchesTab
  })

  const stats = [
    { title: 'Total Campaigns', value: campaigns.length, icon: Mail, color: 'text-blue-600' },
    { title: 'Sent', value: campaigns.filter(c => c.status === 'Sent').length, icon: CheckCircle2, color: 'text-green-600' },
    { title: 'Scheduled', value: campaigns.filter(c => c.status === 'Scheduled').length, icon: Clock, color: 'text-yellow-600' },
    { title: 'Total Revenue', value: `$${campaigns.reduce((sum, c) => sum + c.revenue, 0).toLocaleString()}`, icon: TrendingUp, color: 'text-purple-600' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Campaigns</h1>
          <p className="text-muted-foreground">Create and manage email marketing campaigns</p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={handleCreate}><Plus />Create Campaign</Button>
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Campaigns</CardTitle>
              <CardDescription>Manage your email campaigns</CardDescription>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search campaigns..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8" />
            </div>
          </div>

          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left text-sm font-medium">Name</th>
                  <th className="p-3 text-left text-sm font-medium">Subject</th>
                  <th className="p-3 text-left text-sm font-medium">Status</th>
                  <th className="p-3 text-left text-sm font-medium">Recipients</th>
                  <th className="p-3 text-left text-sm font-medium">Open Rate</th>
                  <th className="p-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b">
                    <td className="p-3 font-medium">{campaign.name}</td>
                    <td className="p-3 text-sm text-muted-foreground">{campaign.subject}</td>
                    <td className="p-3"><Badge variant={campaign.status === 'Sent' ? 'default' : campaign.status === 'Scheduled' ? 'secondary' : 'outline'}>{campaign.status}</Badge></td>
                    <td className="p-3 text-sm">{campaign.recipients.toLocaleString()}</td>
                    <td className="p-3 text-sm">{campaign.openRate}%</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(campaign)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(campaign)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <CampaignFormDialog campaign={editingCampaign} isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setEditingCampaign(null) }} onSave={handleSave} />
    </div>
  )
}