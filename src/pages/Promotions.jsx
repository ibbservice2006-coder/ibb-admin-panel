import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Search, Tag, Edit, Trash2, TrendingUp, DollarSign, Users, Percent } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

function PromotionFormDialog({ promotion, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: promotion?.name || '',
    code: promotion?.code || '',
    discountType: promotion?.discountType || 'Percentage',
    discountValue: promotion?.discountValue || 0,
    startDate: promotion?.startDate || '',
    endDate: promotion?.endDate || '',
    usageLimit: promotion?.usageLimit || 0,
    status: promotion?.status || 'Active'
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
          <DialogTitle>{promotion ? 'Edit Promotion' : 'Create Promotion'}</DialogTitle>
          <DialogDescription>Configure promotion settings and discount details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Promotion Name *</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Summer Sale 2024" required />
          </div>
          <div>
            <Label>Discount Code *</Label>
            <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="e.g. SUMMER50" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Discount Type *</Label>
              <Select value={formData.discountType} onValueChange={(v) => setFormData({ ...formData, discountType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Percentage">Percentage</SelectItem>
                  <SelectItem value="Fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Discount Value *</Label>
              <Input type="number" value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })} placeholder="0" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date *</Label>
              <Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
            </div>
            <div>
              <Label>End Date *</Label>
              <Input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Usage Limit</Label>
              <Input type="number" value={formData.usageLimit} onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })} placeholder="0 = unlimited" />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button size="sm" type="submit" className="bg-gray-700 hover:bg-gray-600 text-white">{promotion ? 'Save Changes' : 'Create Promotion'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function Promotions() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState(null)
  const [promotions, setPromotions] = useState([
  const [isOpen, setIsOpen] = useState(false)
    { id: 1, name: 'Summer Sale', code: 'SUMMER50', discountType: 'Percentage', discountValue: 50, startDate: '2024-06-01', endDate: '2024-08-31', usageLimit: 1000, used: 856, status: 'Expired', revenue: 125680 },
    { id: 2, name: 'New Customer Discount', code: 'WELCOME20', discountType: 'Percentage', discountValue: 20, startDate: '2024-01-01', endDate: '2024-12-31', usageLimit: 0, used: 2341, status: 'Active', revenue: 45230 },
    { id: 3, name: 'Flash Sale', code: 'FLASH100', discountType: 'Fixed', discountValue: 100, startDate: '2024-10-05', endDate: '2024-10-06', usageLimit: 500, used: 0, status: 'Scheduled', revenue: 0 },
    { id: 4, name: 'Holiday Special', code: 'HOLIDAY30', discountType: 'Percentage', discountValue: 30, startDate: '2024-12-01', endDate: '2024-12-31', usageLimit: 2000, used: 0, status: 'Scheduled', revenue: 0 }
  ])

  const handleSave = (data) => {
    if (editingPromotion) {
      setPromotions(promotions.map(p => p.id === editingPromotion.id ? { ...p, ...data } : p))
      toast({ title: 'Promotion updated successfully' })
    } else {
      setPromotions([...promotions, { ...data, id: Date.now(), used: 0, revenue: 0 }])
      toast({ title: 'Promotion created successfully' })
    }
    setEditingPromotion(null)
  }

  const handleCreate = () => { setEditingPromotion(null); setIsFormOpen(true) }
  const handleEdit = (promotion) => { setEditingPromotion(promotion); setIsFormOpen(true) }
  const handleDelete = (promotion) => {
    if (confirm(`Delete "${promotion.name}"?`)) {
      setPromotions(promotions.filter(p => p.id !== promotion.id))
      toast({ title: 'Promotion deleted' })
    }
  }

  const filteredPromotions = promotions.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.toLowerCase().includes(searchTerm.toLowerCase()))

  const stats = [
    { title: 'Total Promotions', value: promotions.length, icon: Tag, color: 'text-blue-600' },
    { title: 'Active Promotions', value: promotions.filter(p => p.status === 'Active').length, icon: Percent, color: 'text-green-600' },
    { title: 'Total Usage', value: promotions.reduce((sum, p) => sum + p.used, 0).toLocaleString(), icon: Users, color: 'text-purple-600' },
    { title: 'Total Revenue', value: `$${promotions.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}`, icon: DollarSign, color: 'text-orange-600' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Promotions</h1>
          <p className="text-muted-foreground">Create and manage promotional campaigns and discount codes</p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={handleCreate}><Plus />Create Promotion</Button>
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
          <CardTitle>All Promotions</CardTitle>
          <CardDescription>Manage your promotional campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search promotions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8" />
            </div>
          </div>

          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left text-sm font-medium">Name</th>
                  <th className="p-3 text-left text-sm font-medium">Code</th>
                  <th className="p-3 text-left text-sm font-medium">Discount</th>
                  <th className="p-3 text-left text-sm font-medium">Period</th>
                  <th className="p-3 text-left text-sm font-medium">Usage</th>
                  <th className="p-3 text-left text-sm font-medium">Status</th>
                  <th className="p-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPromotions.map((promotion) => (
                  <tr key={promotion.id} className="border-b">
                    <td className="p-3 font-medium">{promotion.name}</td>
                    <td className="p-3"><Badge variant="outline">{promotion.code}</Badge></td>
                    <td className="p-3 text-sm">{promotion.discountType === 'Percentage' ? `${promotion.discountValue}%` : `$${promotion.discountValue}`}</td>
                    <td className="p-3 text-sm text-muted-foreground">{promotion.startDate} to {promotion.endDate}</td>
                    <td className="p-3 text-sm">{promotion.used} / {promotion.usageLimit || '∞'}</td>
                    <td className="p-3"><Badge variant={promotion.status === 'Active' ? 'default' : promotion.status === 'Scheduled' ? 'secondary' : 'outline'}>{promotion.status}</Badge></td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(promotion)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(promotion)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <PromotionFormDialog promotion={editingPromotion} isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setEditingPromotion(null) }} onSave={handleSave} />
    </div>
  )
}
