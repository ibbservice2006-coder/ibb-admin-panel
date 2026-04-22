import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Gift, Plus, Edit, Calendar, Star, ToggleLeft, ToggleRight } from 'lucide-react'

const initialPromotions = [
  { id: 1, name: 'Songkran Festival 2026', type: 'festival', description: 'Special Songkran discount Apr 10-16, 2026', discount: 25, discountType: 'percentage', startDate: '2026-04-10', endDate: '2026-04-16', targetTiers: ['General', 'VIP', 'VVIP', 'Business Partner'], isActive: false, autoApply: false, minBooking: 2000 },
  { id: 2, name: 'VIP Loyalty Q1 Bonus', type: 'tier', description: 'Special Bonus for VIP Members Booking 5 Times in Q1', discount: 10, discountType: 'percentage', startDate: '2026-01-01', endDate: '2026-03-31', targetTiers: ['VIP'], isActive: true, autoApply: true, minBooking: 1000 },
  { id: 3, name: 'VVIP Concierge Perk', type: 'tier', description: 'Special discount for VVIP on every booking', discount: 15, discountType: 'percentage', startDate: '2026-01-01', endDate: '2026-12-31', targetTiers: ['VVIP'], isActive: true, autoApply: true, minBooking: 0 },
  { id: 4, name: 'Business Partner Volume Deal', type: 'tier', description: 'Special Discount for 10 Monthly Bookings', discount: 8, discountType: 'percentage', startDate: '2026-01-01', endDate: '2026-12-31', targetTiers: ['Business Partner'], isActive: true, autoApply: false, minBooking: 5000 },
  { id: 5, name: 'Summer Holiday Sale', type: 'seasonal', description: 'Summer Promo — Special discount May-Jun', discount: 12, discountType: 'percentage', startDate: '2026-05-01', endDate: '2026-06-30', targetTiers: ['General', 'VIP', 'VVIP', 'Business Partner'], isActive: false, autoApply: false, minBooking: 1500 },
  { id: 6, name: 'Shopee Mega Sale Integration', type: 'external', description: 'Shopee Mega Sale promo — extra discount for Shopee buyers', discount: 5, discountType: 'percentage', startDate: '2026-03-15', endDate: '2026-04-15', targetTiers: ['General', 'VIP', 'VVIP', 'Business Partner'], isActive: true, autoApply: false, minBooking: 500 },
]

const typeConfig = {
  festival: { label: 'Festival', color: 'bg-orange-100 text-orange-700', icon: '🎉' },
  seasonal: { label: 'Seasonal', color: 'bg-blue-100 text-blue-700', icon: '🌤' },
  tier: { label: 'Tier Exclusive', color: 'bg-purple-100 text-purple-700', icon: '⭐' },
  external: { label: 'External Platform', color: 'bg-yellow-100 text-yellow-700', icon: '🛒' },
}

const tierColor = {
  'General': 'bg-blue-50 text-blue-600',
  'VIP': 'bg-pink-50 text-pink-600',
  'VVIP': 'bg-yellow-50 text-yellow-600',
  'Business Partner': 'bg-green-50 text-green-600',
}

export default function VoucherPromotions() {
  const [promotions, setPromotions] = useState(initialPromotions)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editPromo, setEditPromo] = useState(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [newPromo, setNewPromo] = useState({ name: '', type: 'festival', description: '', discount: 10, discountType: 'percentage', startDate: '', endDate: '', minBooking: 0, autoApply: false })
  const { toast } = useToast()

  const activeCount = promotions.filter(p => p.isActive).length

  const handleToggle = (id) => {
    const p = promotions.find(x => x.id === id)
    setPromotions(prev => prev.map(x => x.id === id ? { ...x, isActive: !x.isActive } : x))
    toast({ title: p.isActive ? 'Deactivated' : 'Activated', description: `${p.name} updated.` })
  }

  const handleSaveEdit = () => {
    setPromotions(prev => prev.map(p => p.id === editPromo.id ? editPromo : p))
    toast({ title: 'Saved', description: `${editPromo.name} updated.` })
    setIsEditOpen(false)
  }

  const handleAdd = () => {
    const newId = Math.max(...promotions.map(p => p.id)) + 1
    setPromotions(prev => [...prev, { ...newPromo, id: newId, isActive: false, targetTiers: ['General', 'VIP', 'VVIP', 'Business Partner'] }])
    toast({ title: 'Promotion Created', description: `${newPromo.name} added.` })
    setIsAddOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-pink-100 border border-pink-200">
            <Gift className="h-6 w-6 text-pink-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Promotions</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Special promotions — Festival, Seasonal, Tier Exclusive, External</p>
          </div>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-700" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />New Promotion
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(typeConfig).map(([key, cfg]) => {
          const count = promotions.filter(p => p.type === key).length
          return (
            <Card key={key}><CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cfg.icon}</span>
                <div>
                  <p className="text-xs text-muted-foreground">{cfg.label}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              </div>
            </CardContent></Card>
          )
        })}
      </div>

      {/* Promotion Cards */}
      <div className="space-y-3">
        {promotions.map(p => {
          const typeCfg = typeConfig[p.type]
          return (
            <Card key={p.id} className={`border ${p.isActive ? 'border-gray-200' : 'border-gray-200 opacity-70'}`}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-pink-50 flex-shrink-0 text-xl">{typeCfg?.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm">{p.name}</span>
                      <Badge className={`text-xs ${typeCfg?.color}`}>{typeCfg?.label}</Badge>
                      {p.isActive && <Badge className="text-xs bg-green-100 text-green-700">Active</Badge>}
                      {p.autoApply && <Badge className="text-xs bg-blue-100 text-blue-700">Auto-apply</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs">
                      <span className="font-bold text-green-600">
                        {p.discountType === 'percentage' ? `${p.discount}% off` : `฿${p.discount} off`}
                      </span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{p.startDate} → {p.endDate}</span>
                      {p.minBooking > 0 && <span><span className="text-muted-foreground">Min: </span>฿{p.minBooking.toLocaleString()}</span>}
                    </div>
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">Tiers:</span>
                      {p.targetTiers.map(t => <Badge key={t} className={`text-xs ${tierColor[t]}`}>{t}</Badge>)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => { setEditPromo({ ...p }); setIsEditOpen(true) }}>
                      <Edit className="h-3.5 w-3.5 mr-1" />Edit
                    </Button>
                    <Button variant="outline" size="sm" className={`h-8 text-xs ${p.isActive ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'}`}
                      onClick={() => handleToggle(p.id)}>
                      {p.isActive ? <><ToggleRight className="h-3.5 w-3.5 mr-1" />Disable</> : <><ToggleLeft className="h-3.5 w-3.5 mr-1" />Enable</>}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Edit Dialog */}
      {editPromo && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Edit Promotion</DialogTitle><DialogDescription>Edit promotion details</DialogDescription></DialogHeader>
            <div className="space-y-3">
              <div><Label>Name</Label><Input className="mt-1" value={editPromo.name} onChange={e => setEditPromo(p => ({ ...p, name: e.target.value }))} /></div>
              <div><Label>Description</Label><Input className="mt-1" value={editPromo.description} onChange={e => setEditPromo(p => ({ ...p, description: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Discount Value</Label><Input type="number" className="mt-1" value={editPromo.discount} onChange={e => setEditPromo(p => ({ ...p, discount: parseFloat(e.target.value) || 0 }))} /></div>
                <div><Label>Min Booking (฿)</Label><Input type="number" className="mt-1" value={editPromo.minBooking} onChange={e => setEditPromo(p => ({ ...p, minBooking: parseInt(e.target.value) || 0 }))} /></div>
                <div><Label>Start Date</Label><Input type="date" className="mt-1" value={editPromo.startDate} onChange={e => setEditPromo(p => ({ ...p, startDate: e.target.value }))} /></div>
                <div><Label>End Date</Label><Input type="date" className="mt-1" value={editPromo.endDate} onChange={e => setEditPromo(p => ({ ...p, endDate: e.target.value }))} /></div>
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
          <DialogHeader><DialogTitle>New Promotion</DialogTitle><DialogDescription>Create new promotion</DialogDescription></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input className="mt-1" value={newPromo.name} onChange={e => setNewPromo(p => ({ ...p, name: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Type</Label>
                <select className="mt-1 w-full border rounded-md px-3 py-2 text-sm" value={newPromo.type} onChange={e => setNewPromo(p => ({ ...p, type: e.target.value }))}>
                  <option value="festival">Festival</option>
                  <option value="seasonal">Seasonal</option>
                  <option value="tier">Tier Exclusive</option>
                  <option value="external">External Platform</option>
                </select>
              </div>
              <div><Label>Discount (%)</Label><Input type="number" className="mt-1" value={newPromo.discount} onChange={e => setNewPromo(p => ({ ...p, discount: parseFloat(e.target.value) || 0 }))} /></div>
              <div><Label>Start Date</Label><Input type="date" className="mt-1" value={newPromo.startDate} onChange={e => setNewPromo(p => ({ ...p, startDate: e.target.value }))} /></div>
              <div><Label>End Date</Label><Input type="date" className="mt-1" value={newPromo.endDate} onChange={e => setNewPromo(p => ({ ...p, endDate: e.target.value }))} /></div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button size="sm" className="flex-1 bg-gray-700 hover:bg-gray-700" onClick={handleAdd}>Create</Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
