import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Tag, Search, Plus, Edit, ToggleLeft, ToggleRight, Ticket, ShoppingBag, Filter, Copy } from 'lucide-react'

const initialVouchers = [
  { id: 1, code: 'IBB-WELCOME20', name: 'Welcome Discount 20%', type: 'ibb', source: 'IBB',
    discountType: 'percentage', discountValue: 20, minBooking: 1000, maxDiscount: 500,
    validFrom: '2026-01-01', validTo: '2026-12-31', maxUses: 1000, usedCount: 342,
    applicableTiers: ['General', 'VIP', 'VVIP', 'Business Partner'],
    isActive: true, description: '20% discount for all new customers' },
  { id: 2, code: 'IBB-VIP500', name: 'VIP Special ฿500 Off', type: 'ibb', source: 'IBB',
    discountType: 'fixed', discountValue: 500, minBooking: 3000, maxDiscount: 500,
    validFrom: '2026-03-01', validTo: '2026-03-31', maxUses: 200, usedCount: 87,
    applicableTiers: ['VIP', 'VVIP'],
    isActive: true, description: '฿500 discount for VIP members and above' },
  { id: 3, code: 'IBB-VVIP15', name: 'VVIP Exclusive 15%', type: 'ibb', source: 'IBB',
    discountType: 'percentage', discountValue: 15, minBooking: 5000, maxDiscount: 2000,
    validFrom: '2026-01-01', validTo: '2026-12-31', maxUses: 500, usedCount: 124,
    applicableTiers: ['VVIP'],
    isActive: true, description: '15% special discount for VVIP members only' },
  { id: 4, code: 'SHOPEE-IBB10', name: 'Shopee Voucher 10%', type: 'external', source: 'Shopee',
    discountType: 'percentage', discountValue: 10, minBooking: 500, maxDiscount: 300,
    validFrom: '2026-03-01', validTo: '2026-03-31', maxUses: 5000, usedCount: 1243,
    applicableTiers: ['General', 'VIP', 'VVIP', 'Business Partner'],
    isActive: true, description: 'Shopee coupon — confirm with Shopee after use' },
  { id: 5, code: 'LAZADA-IBB200', name: 'Lazada ฿200 Off', type: 'external', source: 'Lazada',
    discountType: 'fixed', discountValue: 200, minBooking: 1500, maxDiscount: 200,
    validFrom: '2026-03-15', validTo: '2026-04-15', maxUses: 2000, usedCount: 456,
    applicableTiers: ['General', 'VIP', 'VVIP', 'Business Partner'],
    isActive: true, description: 'Coupon from Lazada — must confirm with Lazada after use' },
  { id: 6, code: 'AMAZON-IBB5', name: 'Amazon 5% Voucher', type: 'external', source: 'Amazon',
    discountType: 'percentage', discountValue: 5, minBooking: 2000, maxDiscount: 400,
    validFrom: '2026-02-01', validTo: '2026-05-31', maxUses: 3000, usedCount: 789,
    applicableTiers: ['General', 'VIP', 'VVIP', 'Business Partner'],
    isActive: true, description: 'Coupon from Amazon Global — confirm with Amazon after use' },
  { id: 7, code: 'IBB-SONGKRAN25', name: 'Songkran Festival 25%', type: 'ibb', source: 'IBB',
    discountType: 'percentage', discountValue: 25, minBooking: 2000, maxDiscount: 1500,
    validFrom: '2026-04-10', validTo: '2026-04-16', maxUses: 300, usedCount: 0,
    applicableTiers: ['General', 'VIP', 'VVIP', 'Business Partner'],
    isActive: false, description: 'Songkran 2026 Promo — Not Active' },
  { id: 8, code: 'IBB-BP-CORP', name: 'Business Partner Corporate', type: 'ibb', source: 'IBB',
    discountType: 'percentage', discountValue: 12, minBooking: 10000, maxDiscount: 5000,
    validFrom: '2026-01-01', validTo: '2026-12-31', maxUses: 999, usedCount: 67,
    applicableTiers: ['Business Partner'],
    isActive: true, description: 'Special Discount for Business Partners Only' },
]

const sourceColor = {
  IBB: 'bg-blue-100 text-blue-700',
  Shopee: 'bg-orange-100 text-orange-700',
  Lazada: 'bg-purple-100 text-purple-700',
  Amazon: 'bg-yellow-100 text-yellow-700',
  eBay: 'bg-red-100 text-red-700',
  Coupang: 'bg-pink-100 text-pink-700',
}

const tierColor = {
  'General': 'bg-blue-50 text-blue-600',
  'VIP': 'bg-pink-50 text-pink-600',
  'VVIP': 'bg-yellow-50 text-yellow-600',
  'Business Partner': 'bg-green-50 text-green-600',
}

export default function VoucherCatalog() {
  const [vouchers, setVouchers] = useState(initialVouchers)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [editVoucher, setEditVoucher] = useState(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newVoucher, setNewVoucher] = useState({ code: '', name: '', type: 'ibb', source: 'IBB', discountType: 'percentage', discountValue: 10, minBooking: 500, maxDiscount: 500, validFrom: '', validTo: '', maxUses: 100, description: '' })
  const { toast } = useToast()

  const filtered = vouchers.filter(v => {
    const matchSearch = v.code.toLowerCase().includes(search.toLowerCase()) ||
      v.name.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || v.type === typeFilter
    return matchSearch && matchType
  })

  const ibbCount = vouchers.filter(v => v.type === 'ibb').length
  const extCount = vouchers.filter(v => v.type === 'external').length
  const activeCount = vouchers.filter(v => v.isActive).length
  const totalUsed = vouchers.reduce((s, v) => s + v.usedCount, 0)

  const handleToggle = (id) => {
    const v = vouchers.find(x => x.id === id)
    setVouchers(prev => prev.map(x => x.id === id ? { ...x, isActive: !x.isActive } : x))
    toast({ title: v.isActive ? 'Deactivated' : 'Activated', description: `${v.code} ${v.isActive ? 'deactivated' : 'activated'}.` })
  }

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code)
    toast({ title: 'Copied!', description: `${code} copied to clipboard.` })
  }

  const handleSaveEdit = () => {
    setVouchers(prev => prev.map(v => v.id === editVoucher.id ? editVoucher : v))
    toast({ title: 'Saved', description: `${editVoucher.code} updated.` })
    setIsEditOpen(false)
  }

  const handleAddVoucher = () => {
    const newId = Math.max(...vouchers.map(v => v.id)) + 1
    setVouchers(prev => [...prev, { ...newVoucher, id: newId, usedCount: 0, isActive: true, applicableTiers: ['General', 'VIP', 'VVIP', 'Business Partner'] }])
    toast({ title: 'Voucher Created', description: `${newVoucher.code} added successfully.` })
    setIsAddOpen(false)
    setNewVoucher({ code: '', name: '', type: 'ibb', source: 'IBB', discountType: 'percentage', discountValue: 10, minBooking: 500, maxDiscount: 500, validFrom: '', validTo: '', maxUses: 100, description: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-100 border border-orange-200">
            <Ticket className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Voucher Catalog</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Manage All Vouchers — IBB & External Platforms</p>
          </div>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />New Voucher
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50"><Ticket className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-xs text-muted-foreground">IBB Vouchers</p><p className="text-2xl font-bold text-blue-600">{ibbCount}</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-50"><ShoppingBag className="h-5 w-5 text-orange-600" /></div>
            <div><p className="text-xs text-muted-foreground">External Platform</p><p className="text-2xl font-bold text-orange-600">{extCount}</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-50"><Tag className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-xs text-muted-foreground">Active</p><p className="text-2xl font-bold text-green-600">{activeCount}</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50"><Filter className="h-5 w-5 text-purple-600" /></div>
            <div><p className="text-xs text-muted-foreground">Total Redemptions</p><p className="text-2xl font-bold text-purple-600">{totalUsed.toLocaleString()}</p></div>
          </div>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <Card><CardContent className="pt-4 pb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by code or name..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {[{ key: 'all', label: 'All' }, { key: 'ibb', label: '🏷 IBB' }, { key: 'external', label: '🛒 External' }].map(f => (
              <button key={f.key} onClick={() => setTypeFilter(f.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${typeFilter === f.key ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </CardContent></Card>

      {/* Voucher Cards */}
      <div className="grid grid-cols-1 gap-3">
        {filtered.map(v => (
          <Card key={v.id} className={`border ${v.isActive ? 'border-gray-200' : 'border-gray-200 opacity-60'}`}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${v.type === 'ibb' ? 'bg-blue-50' : 'bg-orange-50'}`}>
                  {v.type === 'ibb' ? <Ticket className="h-5 w-5 text-blue-600" /> : <ShoppingBag className="h-5 w-5 text-orange-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <code className="font-mono font-bold text-sm bg-muted px-2 py-0.5 rounded">{v.code}</code>
                      <button onClick={() => handleCopyCode(v.code)} className="text-muted-foreground hover:text-foreground">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <Badge className={`text-xs ${sourceColor[v.source] || 'bg-gray-100 text-gray-600'}`}>{v.source}</Badge>
                    {!v.isActive && <Badge className="text-xs bg-gray-100 text-gray-500">Inactive</Badge>}
                  </div>
                  <p className="font-medium text-sm mt-1">{v.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{v.description}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs">
                    <span><span className="text-muted-foreground">Discount: </span>
                      <span className="font-bold text-green-600">
                        {v.discountType === 'percentage' ? `${v.discountValue}%` : `฿${v.discountValue}`}
                        {v.maxDiscount && ` (max ฿${v.maxDiscount.toLocaleString()})`}
                      </span>
                    </span>
                    <span><span className="text-muted-foreground">Min booking: </span><span className="font-medium">฿{v.minBooking.toLocaleString()}</span></span>
                    <span><span className="text-muted-foreground">Valid: </span><span className="font-medium">{v.validFrom} → {v.validTo}</span></span>
                    <span><span className="text-muted-foreground">Used: </span><span className="font-medium">{v.usedCount}/{v.maxUses}</span></span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 flex-wrap">
                    <span className="text-xs text-muted-foreground">Tiers:</span>
                    {v.applicableTiers.map(t => <Badge key={t} className={`text-xs ${tierColor[t]}`}>{t}</Badge>)}
                  </div>
                  {/* Usage bar */}
                  <div className="mt-2">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden w-48">
                      <div className="h-full rounded-full bg-orange-400 transition-all"
                        style={{ width: `${Math.min((v.usedCount / v.maxUses) * 100, 100)}%` }} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => { setEditVoucher({ ...v }); setIsEditOpen(true) }}>
                    <Edit className="h-3.5 w-3.5 mr-1" />Edit
                  </Button>
                  <Button variant="outline" size="sm" className={`h-8 text-xs ${v.isActive ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'}`}
                    onClick={() => handleToggle(v.id)}>
                    {v.isActive ? <><ToggleRight className="h-3.5 w-3.5 mr-1" />Disable</> : <><ToggleLeft className="h-3.5 w-3.5 mr-1" />Enable</>}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editVoucher && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Edit Voucher — {editVoucher.code}</DialogTitle><DialogDescription>Edit voucher details</DialogDescription></DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Discount Value</Label><Input type="number" className="mt-1" value={editVoucher.discountValue} onChange={e => setEditVoucher(p => ({ ...p, discountValue: parseFloat(e.target.value) || 0 }))} /></div>
                <div><Label>Max Discount (฿)</Label><Input type="number" className="mt-1" value={editVoucher.maxDiscount} onChange={e => setEditVoucher(p => ({ ...p, maxDiscount: parseInt(e.target.value) || 0 }))} /></div>
                <div><Label>Min Booking (฿)</Label><Input type="number" className="mt-1" value={editVoucher.minBooking} onChange={e => setEditVoucher(p => ({ ...p, minBooking: parseInt(e.target.value) || 0 }))} /></div>
                <div><Label>Max Uses</Label><Input type="number" className="mt-1" value={editVoucher.maxUses} onChange={e => setEditVoucher(p => ({ ...p, maxUses: parseInt(e.target.value) || 0 }))} /></div>
                <div><Label>Valid From</Label><Input type="date" className="mt-1" value={editVoucher.validFrom} onChange={e => setEditVoucher(p => ({ ...p, validFrom: e.target.value }))} /></div>
                <div><Label>Valid To</Label><Input type="date" className="mt-1" value={editVoucher.validTo} onChange={e => setEditVoucher(p => ({ ...p, validTo: e.target.value }))} /></div>
              </div>
              <div><Label>Description</Label><Input className="mt-1" value={editVoucher.description} onChange={e => setEditVoucher(p => ({ ...p, description: e.target.value }))} /></div>
              <div className="flex gap-3 pt-2">
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white flex-1" onClick={handleSaveEdit}>Save</Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Create New Voucher</DialogTitle><DialogDescription>Create new Voucher</DialogDescription></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Code</Label><Input className="mt-1 font-mono" placeholder="IBB-CODE" value={newVoucher.code} onChange={e => setNewVoucher(p => ({ ...p, code: e.target.value.toUpperCase() }))} /></div>
              <div><Label>Type</Label>
                <select className="mt-1 w-full border rounded-md px-3 py-2 text-sm" value={newVoucher.type} onChange={e => setNewVoucher(p => ({ ...p, type: e.target.value, source: e.target.value === 'ibb' ? 'IBB' : 'Shopee' }))}>
                  <option value="ibb">IBB</option>
                  <option value="external">External Platform</option>
                </select>
              </div>
              <div><Label>Name</Label><Input className="mt-1" value={newVoucher.name} onChange={e => setNewVoucher(p => ({ ...p, name: e.target.value }))} /></div>
              <div><Label>Discount Type</Label>
                <select className="mt-1 w-full border rounded-md px-3 py-2 text-sm" value={newVoucher.discountType} onChange={e => setNewVoucher(p => ({ ...p, discountType: e.target.value }))}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (฿)</option>
                </select>
              </div>
              <div><Label>Discount Value</Label><Input type="number" className="mt-1" value={newVoucher.discountValue} onChange={e => setNewVoucher(p => ({ ...p, discountValue: parseFloat(e.target.value) || 0 }))} /></div>
              <div><Label>Max Uses</Label><Input type="number" className="mt-1" value={newVoucher.maxUses} onChange={e => setNewVoucher(p => ({ ...p, maxUses: parseInt(e.target.value) || 0 }))} /></div>
              <div><Label>Valid From</Label><Input type="date" className="mt-1" value={newVoucher.validFrom} onChange={e => setNewVoucher(p => ({ ...p, validFrom: e.target.value }))} /></div>
              <div><Label>Valid To</Label><Input type="date" className="mt-1" value={newVoucher.validTo} onChange={e => setNewVoucher(p => ({ ...p, validTo: e.target.value }))} /></div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button size="sm" className="flex-1 bg-gray-700 hover:bg-gray-600" onClick={handleAddVoucher}>Create Voucher</Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
