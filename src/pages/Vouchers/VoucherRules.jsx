import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Shield, Plus, Edit, CheckCircle, XCircle, ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react'

const initialRules = [
  { id: 1, name: 'Single Voucher Per Booking', description: 'Customers can use only 1 voucher per booking', category: 'usage', isActive: true, priority: 1, canOverride: false, appliesTo: 'all' },
  { id: 2, name: 'No Stacking with Membership Discount', description: 'Voucher cannot be combined with Membership discount', category: 'stacking', isActive: true, priority: 2, canOverride: false, appliesTo: 'all' },
  { id: 3, name: 'Expiry Date Enforcement', description: 'System auto-checks expiry — expired vouchers are rejected immediately', category: 'validation', isActive: true, priority: 1, canOverride: false, appliesTo: 'all' },
  { id: 4, name: 'Max Uses Per Customer', description: 'Each voucher valid once per customer (except Multi-use codes)', category: 'usage', isActive: true, priority: 2, canOverride: true, appliesTo: 'ibb' },
  { id: 5, name: 'Minimum Booking Amount', description: 'Voucher valid only when booking meets minimum required amount', category: 'validation', isActive: true, priority: 1, canOverride: false, appliesTo: 'all' },
  { id: 6, name: 'External Platform Verification', description: 'Vouchers from Shopee/Lazada/Amazon must be confirmed back to the source platform after use', category: 'external', isActive: true, priority: 1, canOverride: false, appliesTo: 'external' },
  { id: 7, name: 'Crypto Payment Voucher Restriction', description: 'Voucher cannot be used with Cryptocurrency payment (VVIP only)', category: 'payment', isActive: true, priority: 3, canOverride: true, appliesTo: 'vvip' },
  { id: 8, name: 'Festival Voucher Blackout Dates', description: 'Regular vouchers not valid during specified Peak Seasons unless Festival Voucher', category: 'restriction', isActive: false, priority: 2, canOverride: true, appliesTo: 'all' },
  { id: 9, code: 9, name: 'Business Partner Invoice Exclusion', description: 'Business Partners using Invoice/Credit cannot use extra discount Vouchers', category: 'tier', isActive: true, priority: 2, canOverride: false, appliesTo: 'business_partner' },
]

const categoryConfig = {
  usage: { label: 'Usage', color: 'bg-blue-100 text-blue-700' },
  stacking: { label: 'Stacking', color: 'bg-purple-100 text-purple-700' },
  validation: { label: 'Validation', color: 'bg-green-100 text-green-700' },
  external: { label: 'External', color: 'bg-orange-100 text-orange-700' },
  payment: { label: 'Payment', color: 'bg-yellow-100 text-yellow-700' },
  restriction: { label: 'Restriction', color: 'bg-red-100 text-red-700' },
  tier: { label: 'Tier', color: 'bg-pink-100 text-pink-700' },
}

const appliesToConfig = {
  all: 'All',
  ibb: 'IBB Only',
  external: 'External Only',
  vvip: 'VVIP Only',
  business_partner: 'Business Partner',
}

export default function VoucherRules() {
  const [rules, setRules] = useState(initialRules)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editRule, setEditRule] = useState(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [newRule, setNewRule] = useState({ name: '', description: '', category: 'usage', priority: 2, canOverride: false, appliesTo: 'all' })
  const { toast } = useToast()

  const activeCount = rules.filter(r => r.isActive).length
  const nonOverridable = rules.filter(r => !r.canOverride && r.isActive).length

  const handleToggle = (id) => {
    const r = rules.find(x => x.id === id)
    if (!r.canOverride && r.isActive) {
      toast({ title: 'Cannot Disable', description: 'This rule is mandatory and cannot be overridden.', variant: 'destructive' })
      return
    }
    setRules(prev => prev.map(x => x.id === id ? { ...x, isActive: !x.isActive } : x))
    toast({ title: r.isActive ? 'Rule Disabled' : 'Rule Enabled' })
  }

  const handleSaveEdit = () => {
    setRules(prev => prev.map(r => r.id === editRule.id ? editRule : r))
    toast({ title: 'Rule Updated' })
    setIsEditOpen(false)
  }

  const handleAdd = () => {
    const newId = Math.max(...rules.map(r => r.id)) + 1
    setRules(prev => [...prev, { ...newRule, id: newId, isActive: true }])
    toast({ title: 'Rule Created', description: `${newRule.name} added.` })
    setIsAddOpen(false)
    setNewRule({ name: '', description: '', category: 'usage', priority: 2, canOverride: false, appliesTo: 'all' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-100 border border-red-200">
            <Shield className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Voucher Rules</h1>
            <p className="text-muted-foreground text-sm mt-0.5">All Voucher Terms & Conditions</p>
          </div>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-700" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />New Rule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">Total Rules</p>
          <p className="text-2xl font-bold">{rules.length}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">Active Rules</p>
          <p className="text-2xl font-bold text-green-600">{activeCount}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-2">
            <div>
              <p className="text-xs text-muted-foreground">Mandatory (Non-override)</p>
              <p className="text-2xl font-bold text-red-600">{nonOverridable}</p>
            </div>
            <AlertTriangle className="h-5 w-5 text-red-400 ml-auto" />
          </div>
        </CardContent></Card>
      </div>

      {/* Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800 text-sm">Business Spec — Voucher Validation Rules</p>
              <p className="text-xs text-blue-700 mt-0.5">System checks conditions before each use: <strong>Expiry date / Reuse / Count</strong> Vouchers from External Platforms must notify platform to confirm usage</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rules List */}
      <div className="space-y-3">
        {rules.sort((a, b) => a.priority - b.priority).map(r => {
          const catCfg = categoryConfig[r.category]
          return (
            <Card key={r.id} className={`border ${r.isActive ? 'border-gray-200' : 'border-gray-200 opacity-60'}`}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${r.isActive ? 'bg-green-50' : 'bg-gray-50'}`}>
                    {r.isActive ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm">{r.name}</span>
                      <Badge className={`text-xs ${catCfg?.color}`}>{catCfg?.label}</Badge>
                      <Badge className="text-xs bg-gray-100 text-gray-600">Priority {r.priority}</Badge>
                      <Badge className="text-xs bg-muted text-muted-foreground">{appliesToConfig[r.appliesTo]}</Badge>
                      {!r.canOverride && <Badge className="text-xs bg-red-100 text-red-700">Mandatory</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{r.description}</p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => { setEditRule({ ...r }); setIsEditOpen(true) }}>
                      <Edit className="h-3.5 w-3.5 mr-1" />Edit
                    </Button>
                    <Button variant="outline" size="sm" className={`h-8 text-xs ${r.isActive ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'} ${!r.canOverride && r.isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => handleToggle(r.id)}>
                      {r.isActive ? <><ToggleRight className="h-3.5 w-3.5 mr-1" />Disable</> : <><ToggleLeft className="h-3.5 w-3.5 mr-1" />Enable</>}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Edit Dialog */}
      {editRule && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Edit Rule</DialogTitle><DialogDescription>Edit Voucher Usage Rules</DialogDescription></DialogHeader>
            <div className="space-y-3">
              <div><Label>Rule Name</Label><Input className="mt-1" value={editRule.name} onChange={e => setEditRule(p => ({ ...p, name: e.target.value }))} /></div>
              <div><Label>Description</Label><Input className="mt-1" value={editRule.description} onChange={e => setEditRule(p => ({ ...p, description: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Category</Label>
                  <select className="mt-1 w-full border rounded-md px-3 py-2 text-sm" value={editRule.category} onChange={e => setEditRule(p => ({ ...p, category: e.target.value }))}>
                    {Object.entries(categoryConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div><Label>Priority</Label>
                  <select className="mt-1 w-full border rounded-md px-3 py-2 text-sm" value={editRule.priority} onChange={e => setEditRule(p => ({ ...p, priority: parseInt(e.target.value) }))}>
                    <option value={1}>1 — High</option>
                    <option value={2}>2 — Medium</option>
                    <option value={3}>3 — Low</option>
                  </select>
                </div>
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
          <DialogHeader><DialogTitle>New Rule</DialogTitle><DialogDescription>Create New Voucher Rule</DialogDescription></DialogHeader>
          <div className="space-y-3">
            <div><Label>Rule Name</Label><Input className="mt-1" value={newRule.name} onChange={e => setNewRule(p => ({ ...p, name: e.target.value }))} /></div>
            <div><Label>Description</Label><Input className="mt-1" value={newRule.description} onChange={e => setNewRule(p => ({ ...p, description: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Category</Label>
                <select className="mt-1 w-full border rounded-md px-3 py-2 text-sm" value={newRule.category} onChange={e => setNewRule(p => ({ ...p, category: e.target.value }))}>
                  {Object.entries(categoryConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div><Label>Applies To</Label>
                <select className="mt-1 w-full border rounded-md px-3 py-2 text-sm" value={newRule.appliesTo} onChange={e => setNewRule(p => ({ ...p, appliesTo: e.target.value }))}>
                  {Object.entries(appliesToConfig).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button size="sm" className="flex-1 bg-gray-700 hover:bg-gray-700" onClick={handleAdd}>Create Rule</Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
