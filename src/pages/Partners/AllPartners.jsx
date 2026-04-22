import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Handshake, Search, Plus, User, Building2, Globe, TrendingUp, DollarSign, Star, Phone, Mail } from 'lucide-react'

const initialPartners = [
  { id: 'P001', name: 'Somsak Wongdee', type: 'individual', category: 'Freelance Guide',
    joinDate: '2024-01-15', status: 'active', tier: 'Silver',
    totalReferrals: 48, totalRevenue: 240000, pendingFee: 12000,
    feeRate: '5%', feeType: 'referral', rating: 4.8, contact: '+66-81-234-5678' },
  { id: 'P002', name: 'Amazing Thailand Tours Co., Ltd.', type: 'company', category: 'Tour Company',
    joinDate: '2023-08-20', status: 'active', tier: 'Gold',
    totalReferrals: 312, totalRevenue: 1560000, pendingFee: 78000,
    feeRate: '5%', feeType: 'commission', rating: 4.9, contact: 'info@amazingthaitours.com' },
  { id: 'P003', name: 'Napa Loves Traveling', type: 'individual', category: 'Influencer',
    joinDate: '2024-02-10', status: 'active', tier: 'Bronze',
    totalReferrals: 22, totalRevenue: 110000, pendingFee: 5500,
    feeRate: '5%', feeType: 'referral', rating: 4.6, contact: '@napa_travel' },
  { id: 'P004', name: 'Pattaya Beach Hotel Group', type: 'company', category: 'Hotel',
    joinDate: '2023-11-05', status: 'active', tier: 'Gold',
    totalReferrals: 198, totalRevenue: 990000, pendingFee: 49500,
    feeRate: '5%', feeType: 'commission', rating: 4.7, contact: 'concierge@pattayabeach.com' },
  { id: 'P005', name: 'Shopee Affiliate Program', type: 'platform', category: 'E-Commerce',
    joinDate: '2024-01-01', status: 'active', tier: 'Platinum',
    totalReferrals: 542, totalRevenue: 2710000, pendingFee: 0,
    feeRate: 'Platform Rate', feeType: 'platform', rating: null, contact: 'Shopee Affiliate Dashboard' },
  { id: 'P006', name: 'Wirat Khaprodkeng', type: 'individual', category: 'Freelance',
    joinDate: '2024-03-01', status: 'pending', tier: null,
    totalReferrals: 3, totalRevenue: 15000, pendingFee: 750,
    feeRate: '5%', feeType: 'referral', rating: 4.5, contact: '+66-89-876-5432' },
  { id: 'P007', name: 'Hua Hin Travel Agency', type: 'company', category: 'Travel Agency',
    joinDate: '2023-09-15', status: 'active', tier: 'Silver',
    totalReferrals: 87, totalRevenue: 435000, pendingFee: 21750,
    feeRate: '5%', feeType: 'commission', rating: 4.5, contact: 'booking@huahintravel.com' },
  { id: 'P008', name: 'Lazada Affiliate Program', type: 'platform', category: 'E-Commerce',
    joinDate: '2024-01-01', status: 'active', tier: 'Platinum',
    totalReferrals: 287, totalRevenue: 1435000, pendingFee: 0,
    feeRate: 'Platform Rate', feeType: 'platform', rating: null, contact: 'Lazada Affiliate Dashboard' },
]

const typeConfig = {
  individual: { label: 'Individual', color: 'bg-blue-100 text-blue-700', icon: User },
  company: { label: 'Company', color: 'bg-purple-100 text-purple-700', icon: Building2 },
  platform: { label: 'Platform', color: 'bg-orange-100 text-orange-700', icon: Globe },
}

const feeTypeLabel = {
  referral: 'Referral Fee',
  commission: 'Commission',
  platform: 'Platform Rate',
}

const tierColor = {
  Bronze: 'bg-amber-100 text-amber-700',
  Silver: 'bg-gray-100 text-gray-600',
  Gold: 'bg-yellow-100 text-yellow-700',
  Platinum: 'bg-purple-100 text-purple-700',
}

const statusColor = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  inactive: 'bg-red-100 text-red-700',
}

export default function AllPartners() {
  const { toast } = useToast()
  const [partners, setPartners] = useState(initialPartners)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [newPartner, setNewPartner] = useState({ name: '', type: 'individual', category: '', contact: '', feeRate: '5%', feeType: 'referral', status: 'pending' })

  const openEdit = (p) => {
    setSelectedPartner(p)
    setEditForm({ name: p.name, category: p.category, contact: p.contact, feeRate: p.feeRate, status: p.status })
    setIsViewOpen(false)
    setIsEditOpen(true)
  }

  const handleSaveEdit = () => {
    setIsSavingEdit(true)
    setTimeout(() => {
      setPartners(prev => prev.map(p => p.id === selectedPartner.id ? { ...p, ...editForm } : p))
      setIsSavingEdit(false)
      setIsEditOpen(false)
      toast({ title: 'Partner Updated', description: `${editForm.name || selectedPartner.name} data updated successfully` })
    }, 700)
  }

  const filtered = partners.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'all' || p.type === filterType
    const matchStatus = filterStatus === 'all' || p.status === filterStatus
    return matchSearch && matchType && matchStatus
  })

  const stats = {
    total: partners.length,
    individual: partners.filter(p => p.type === 'individual').length,
    company: partners.filter(p => p.type === 'company').length,
    platform: partners.filter(p => p.type === 'platform').length,
    totalRevenue: partners.reduce((a, p) => a + p.totalRevenue, 0),
    pendingFee: partners.filter(p => p.type !== 'platform').reduce((a, p) => a + p.pendingFee, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-100 border border-indigo-200">
            <Handshake className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">All Partners</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Manage all Partner types — Individual, Company, Platform</p>
          </div>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-3.5 w-3.5 mr-1" />Add Partner
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          { label: 'Total Partners', value: stats.total, color: 'text-gray-700', bg: 'bg-gray-50' },
          { label: 'Individual', value: stats.individual, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Company', value: stats.company, color: 'text-purple-700', bg: 'bg-purple-50' },
          { label: 'Platform', value: stats.platform, color: 'text-orange-700', bg: 'bg-orange-50' },
          { label: 'Total Revenue', value: `฿${(stats.totalRevenue / 1000000).toFixed(1)}M`, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Pending Fee', value: `฿${(stats.pendingFee / 1000).toFixed(0)}K`, color: 'text-red-700', bg: 'bg-red-50' },
        ].map(s => (
          <Card key={s.label} className={`${s.bg} border-0`}>
            <CardContent className="pt-3 pb-3 text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search Partner name or type..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="individual">Individual</SelectItem>
            <SelectItem value="company">Company</SelectItem>
            <SelectItem value="platform">Platform</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Partner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(partner => {
          const TypeIcon = typeConfig[partner.type].icon
          return (
            <Card key={partner.id} className="border hover:shadow-md transition-shadow">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${typeConfig[partner.type].color}`}>
                      <TypeIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{partner.name}</p>
                      <p className="text-xs text-muted-foreground">{partner.category}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={`text-xs ${statusColor[partner.status]}`}>{partner.status}</Badge>
                    {partner.tier && <Badge className={`text-xs ${tierColor[partner.tier]}`}>{partner.tier}</Badge>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="font-bold text-gray-700">{partner.totalReferrals}</p>
                    <p className="text-muted-foreground">Referrals</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <p className="font-bold text-green-700">฿{(partner.totalRevenue / 1000).toFixed(0)}K</p>
                    <p className="text-muted-foreground">Revenue</p>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded-lg">
                    <p className="font-bold text-red-700">฿{(partner.pendingFee / 1000).toFixed(1)}K</p>
                    <p className="text-muted-foreground">Pending Fee</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {feeTypeLabel[partner.feeType]}: {partner.feeRate}
                    </span>
                    {partner.rating && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {partner.rating}
                      </span>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="h-6 px-2 text-xs" onClick={() => { setSelectedPartner(partner); setIsViewOpen(true) }}>View Profile</Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add Partner Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Plus className="h-5 w-5" />Add New Partner</DialogTitle>
            <DialogDescription>Add Partner data to IBB Shuttle system</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5 col-span-2">
              <Label>Name / Company <span className="text-red-500">*</span></Label>
              <Input placeholder="Partner or company name" value={newPartner.name} onChange={e => setNewPartner({...newPartner, name: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={newPartner.type} onValueChange={v => setNewPartner({...newPartner, type: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="platform">Platform</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Input placeholder="Tour Company / Hotel / Influencer" value={newPartner.category} onChange={e => setNewPartner({...newPartner, category: e.target.value})} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Contact Channels</Label>
              <Input placeholder="Phone / Email / Social" value={newPartner.contact} onChange={e => setNewPartner({...newPartner, contact: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <Label>Commission type</Label>
              <Select value={newPartner.feeType} onValueChange={v => setNewPartner({...newPartner, feeType: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="referral">Referral Fee</SelectItem>
                  <SelectItem value="commission">Commission</SelectItem>
                  <SelectItem value="platform">Platform Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Commission Rate</Label>
              <Input placeholder="5%" value={newPartner.feeRate} onChange={e => setNewPartner({...newPartner, feeRate: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
              if (!newPartner.name) { toast({ title: 'Please enter Partner name', variant: 'destructive' }); return }
              const id = `P${String(partners.length + 1).padStart(3, '0')}`
              setPartners([{ id, name: newPartner.name, type: newPartner.type, category: newPartner.category || 'General', joinDate: new Date().toISOString().split('T')[0], status: 'pending', tier: null, totalReferrals: 0, totalRevenue: 0, pendingFee: 0, feeRate: newPartner.feeRate, feeType: newPartner.feeType, rating: null, contact: newPartner.contact }, ...partners])
              setIsAddOpen(false)
              setNewPartner({ name: '', type: 'individual', category: '', contact: '', feeRate: '5%', feeType: 'referral', status: 'pending' })
              toast({ title: 'Partner Added!', description: `${newPartner.name} added successfully` })
            }}>Add Partner</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Profile Dialog */}
      {selectedPartner && (
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedPartner.name}</DialogTitle>
              <DialogDescription>{selectedPartner.category} — {selectedPartner.id}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Type</p>
                  <p className="font-medium capitalize">{selectedPartner.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Status</p>
                  <Badge className={`text-xs ${statusColor[selectedPartner.status]}`}>{selectedPartner.status}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Tier</p>
                  <p className="font-medium">{selectedPartner.tier || 'No Tier yet'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Rating</p>
                  <p className="font-medium">{selectedPartner.rating ? `${selectedPartner.rating}/5.0` : 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Total Referrals</p>
                  <p className="font-bold text-blue-600">{selectedPartner.totalReferrals}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Total Revenue</p>
                  <p className="font-bold text-green-600">฿{selectedPartner.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Pending Fee</p>
                  <p className="font-bold text-red-600">฿{selectedPartner.pendingFee.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Fee Rate</p>
                  <p className="font-medium">{selectedPartner.feeRate} ({feeTypeLabel[selectedPartner.feeType]})</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-muted-foreground text-xs">Contact Channels</p>
                  <p className="font-medium">{selectedPartner.contact}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-muted-foreground text-xs">Join Date</p>
                  <p className="font-medium">{selectedPartner.joinDate}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => openEdit(selectedPartner)}>Edit Information</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Partner Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Information Partner</DialogTitle>
            <DialogDescription>Update data {selectedPartner?.name}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label className="text-xs">Partner Name</Label>
              <Input value={editForm.name || ''} onChange={e => setEditForm(f => ({...f, name: e.target.value}))} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Category</Label>
              <Input value={editForm.category || ''} onChange={e => setEditForm(f => ({...f, category: e.target.value}))} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Commission Rate</Label>
              <Input value={editForm.feeRate || ''} onChange={e => setEditForm(f => ({...f, feeRate: e.target.value}))} className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Contact Channels</Label>
              <Input value={editForm.contact || ''} onChange={e => setEditForm(f => ({...f, contact: e.target.value}))} className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Status</Label>
              <Select value={editForm.status || 'active'} onValueChange={v => setEditForm(f => ({...f, status: v}))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" size="sm" onClick={() => setIsEditOpen(false)} disabled={isSavingEdit}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveEdit} disabled={isSavingEdit}>
              {isSavingEdit ? 'Saving...' : 'Save data'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
