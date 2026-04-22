import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Megaphone, Plus, Edit, Calendar, Users, DollarSign, TrendingUp, ToggleLeft, ToggleRight } from 'lucide-react'

const initialCampaigns = [
  { id: 1, name: 'New Year 2026 Campaign', description: 'Welcome New Year 2026 promotion', status: 'completed',
    startDate: '2026-01-01', endDate: '2026-01-07', budget: 50000, spent: 48200,
    targetTiers: ['General', 'VIP', 'VVIP', 'Business Partner'],
    voucherCount: 3, redemptions: 1240, revenue: 285000, discountGiven: 48200 },
  { id: 2, name: 'Valentine\'s Day Special', description: "Valentine's promo — Couples travel together", status: 'completed',
    startDate: '2026-02-14', endDate: '2026-02-14', budget: 20000, spent: 18500,
    targetTiers: ['VIP', 'VVIP'],
    voucherCount: 2, redemptions: 342, revenue: 124000, discountGiven: 18500 },
  { id: 3, name: 'March Madness Sale', description: 'Special Discount Throughout March', status: 'active',
    startDate: '2026-03-01', endDate: '2026-03-31', budget: 80000, spent: 42300,
    targetTiers: ['General', 'VIP', 'VVIP', 'Business Partner'],
    voucherCount: 4, redemptions: 876, revenue: 312000, discountGiven: 42300 },
  { id: 4, name: 'Songkran Festival 2026', description: 'Songkran Promo — Special discounts during Songkran', status: 'upcoming',
    startDate: '2026-04-10', endDate: '2026-04-16', budget: 100000, spent: 0,
    targetTiers: ['General', 'VIP', 'VVIP', 'Business Partner'],
    voucherCount: 5, redemptions: 0, revenue: 0, discountGiven: 0 },
  { id: 5, name: 'VIP Loyalty Reward Q1', description: 'Loyalty rewards for VIP members Q1', status: 'active',
    startDate: '2026-01-01', endDate: '2026-03-31', budget: 60000, spent: 38700,
    targetTiers: ['VIP', 'VVIP'],
    voucherCount: 2, redemptions: 524, revenue: 198000, discountGiven: 38700 },
  { id: 6, name: 'Business Partner Annual Deal', description: 'Special deals for Business Partners all year', status: 'active',
    startDate: '2026-01-01', endDate: '2026-12-31', budget: 200000, spent: 45600,
    targetTiers: ['Business Partner'],
    voucherCount: 1, redemptions: 89, revenue: 890000, discountGiven: 45600 },
]

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-100 text-green-700' },
  upcoming: { label: 'Upcoming', color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-600' },
  paused: { label: 'Paused', color: 'bg-yellow-100 text-yellow-700' },
}

const tierColor = {
  'General': 'bg-blue-50 text-blue-600',
  'VIP': 'bg-pink-50 text-pink-600',
  'VVIP': 'bg-yellow-50 text-yellow-600',
  'Business Partner': 'bg-green-50 text-green-600',
}

export default function VoucherCampaigns() {
  const [campaigns, setCampaigns] = useState(initialCampaigns)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editCampaign, setEditCampaign] = useState(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [newCampaign, setNewCampaign] = useState({ name: '', description: '', startDate: '', endDate: '', budget: 10000, targetTiers: ['General', 'VIP', 'VVIP', 'Business Partner'] })
  const { toast } = useToast()

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length
  const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0)
  const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0)
  const totalRedemptions = campaigns.reduce((s, c) => s + c.redemptions, 0)

  const handleToggleStatus = (id) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id !== id) return c
      const newStatus = c.status === 'active' ? 'paused' : c.status === 'paused' ? 'active' : c.status
      return { ...c, status: newStatus }
    }))
    toast({ title: 'Status Updated' })
  }

  const handleSaveEdit = () => {
    setCampaigns(prev => prev.map(c => c.id === editCampaign.id ? editCampaign : c))
    toast({ title: 'Campaign Updated', description: `${editCampaign.name} updated.` })
    setIsEditOpen(false)
  }

  const handleAdd = () => {
    const newId = Math.max(...campaigns.map(c => c.id)) + 1
    setCampaigns(prev => [...prev, { ...newCampaign, id: newId, status: 'upcoming', spent: 0, voucherCount: 0, redemptions: 0, revenue: 0, discountGiven: 0 }])
    toast({ title: 'Campaign Created', description: `${newCampaign.name} created.` })
    setIsAddOpen(false)
    setNewCampaign({ name: '', description: '', startDate: '', endDate: '', budget: 10000, targetTiers: ['General', 'VIP', 'VVIP', 'Business Partner'] })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-100 border border-purple-200">
            <Megaphone className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Campaigns</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Manage all promo campaigns</p>
          </div>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-700" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />New Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-50"><Megaphone className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-xs text-muted-foreground">Active Campaigns</p><p className="text-2xl font-bold text-green-600">{activeCampaigns}</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50"><DollarSign className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-xs text-muted-foreground">Total Budget</p><p className="text-2xl font-bold text-blue-600">฿{(totalBudget/1000).toFixed(0)}K</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-50"><TrendingUp className="h-5 w-5 text-orange-600" /></div>
            <div><p className="text-xs text-muted-foreground">Budget Spent</p><p className="text-2xl font-bold text-orange-600">฿{(totalSpent/1000).toFixed(0)}K</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50"><Users className="h-5 w-5 text-purple-600" /></div>
            <div><p className="text-xs text-muted-foreground">Total Redemptions</p><p className="text-2xl font-bold text-purple-600">{totalRedemptions.toLocaleString()}</p></div>
          </div>
        </CardContent></Card>
      </div>

      {/* Campaign Cards */}
      <div className="space-y-3">
        {campaigns.map(c => {
          const budgetPct = c.budget > 0 ? Math.min((c.spent / c.budget) * 100, 100) : 0
          const roi = c.discountGiven > 0 ? ((c.revenue - c.discountGiven) / c.discountGiven * 100).toFixed(0) : 0
          return (
            <Card key={c.id} className="border border-gray-200">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-purple-50 flex-shrink-0">
                    <Megaphone className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm">{c.name}</span>
                      <Badge className={`text-xs ${statusConfig[c.status]?.color}`}>{statusConfig[c.status]?.label}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{c.startDate} → {c.endDate}</span>
                      <span><span className="text-muted-foreground">Vouchers: </span><span className="font-medium">{c.voucherCount}</span></span>
                      <span><span className="text-muted-foreground">Redemptions: </span><span className="font-medium">{c.redemptions.toLocaleString()}</span></span>
                      {c.revenue > 0 && <span><span className="text-muted-foreground">Revenue: </span><span className="font-medium text-green-600">฿{c.revenue.toLocaleString()}</span></span>}
                      {c.discountGiven > 0 && <span><span className="text-muted-foreground">ROI: </span><span className="font-medium text-blue-600">{roi}%</span></span>}
                    </div>
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">Target:</span>
                      {c.targetTiers.map(t => <Badge key={t} className={`text-xs ${tierColor[t]}`}>{t}</Badge>)}
                    </div>
                    {/* Budget bar */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Budget: ฿{c.spent.toLocaleString()} / ฿{c.budget.toLocaleString()}</span>
                        <span className="font-medium">{budgetPct.toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden w-full max-w-xs">
                        <div className={`h-full rounded-full transition-all ${budgetPct >= 90 ? 'bg-red-400' : budgetPct >= 70 ? 'bg-yellow-400' : 'bg-purple-400'}`}
                          style={{ width: `${budgetPct}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => { setEditCampaign({ ...c }); setIsEditOpen(true) }}>
                      <Edit className="h-3.5 w-3.5 mr-1" />Edit
                    </Button>
                    {(c.status === 'active' || c.status === 'paused') && (
                      <Button variant="outline" size="sm" className={`h-8 text-xs ${c.status === 'active' ? 'text-yellow-600 border-yellow-200 hover:bg-yellow-50' : 'text-green-600 border-green-200 hover:bg-green-50'}`}
                        onClick={() => handleToggleStatus(c.id)}>
                        {c.status === 'active' ? <><ToggleRight className="h-3.5 w-3.5 mr-1" />Pause</> : <><ToggleLeft className="h-3.5 w-3.5 mr-1" />Resume</>}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Edit Dialog */}
      {editCampaign && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Edit Campaign</DialogTitle><DialogDescription>Edit campaign details</DialogDescription></DialogHeader>
            <div className="space-y-3">
              <div><Label>Campaign Name</Label><Input className="mt-1" value={editCampaign.name} onChange={e => setEditCampaign(p => ({ ...p, name: e.target.value }))} /></div>
              <div><Label>Description</Label><Input className="mt-1" value={editCampaign.description} onChange={e => setEditCampaign(p => ({ ...p, description: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Start Date</Label><Input type="date" className="mt-1" value={editCampaign.startDate} onChange={e => setEditCampaign(p => ({ ...p, startDate: e.target.value }))} /></div>
                <div><Label>End Date</Label><Input type="date" className="mt-1" value={editCampaign.endDate} onChange={e => setEditCampaign(p => ({ ...p, endDate: e.target.value }))} /></div>
                <div><Label>Budget (฿)</Label><Input type="number" className="mt-1" value={editCampaign.budget} onChange={e => setEditCampaign(p => ({ ...p, budget: parseInt(e.target.value) || 0 }))} /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button size="sm" className="flex-1 bg-gray-700 hover:bg-gray-700" onClick={handleSaveEdit}>Save</Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New Campaign</DialogTitle><DialogDescription>Create new promo campaign</DialogDescription></DialogHeader>
          <div className="space-y-3">
            <div><Label>Campaign Name</Label><Input className="mt-1" placeholder="e.g. Summer Sale 2026" value={newCampaign.name} onChange={e => setNewCampaign(p => ({ ...p, name: e.target.value }))} /></div>
            <div><Label>Description</Label><Input className="mt-1" value={newCampaign.description} onChange={e => setNewCampaign(p => ({ ...p, description: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Start Date</Label><Input type="date" className="mt-1" value={newCampaign.startDate} onChange={e => setNewCampaign(p => ({ ...p, startDate: e.target.value }))} /></div>
              <div><Label>End Date</Label><Input type="date" className="mt-1" value={newCampaign.endDate} onChange={e => setNewCampaign(p => ({ ...p, endDate: e.target.value }))} /></div>
              <div><Label>Budget (฿)</Label><Input type="number" className="mt-1" value={newCampaign.budget} onChange={e => setNewCampaign(p => ({ ...p, budget: parseInt(e.target.value) || 0 }))} /></div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button size="sm" className="flex-1 bg-gray-700 hover:bg-gray-700" onClick={handleAdd}>Create Campaign</Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
