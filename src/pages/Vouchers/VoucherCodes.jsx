import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Hash, Plus, Copy, Trash2, Search, Download, RefreshCw } from 'lucide-react'

const generateCode = (prefix = 'IBB') => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = prefix + '-'
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

const initialCodes = [
  { id: 1, code: 'IBB-WELCOME20', campaign: 'Welcome Campaign', discountType: 'percentage', discountValue: 20, maxUses: 1000, usedCount: 342, status: 'active', createdAt: '2026-01-01', expiresAt: '2026-12-31', assignedTo: null },
  { id: 2, code: 'IBB-VIP500', campaign: 'VIP Special', discountType: 'fixed', discountValue: 500, maxUses: 200, usedCount: 87, status: 'active', createdAt: '2026-03-01', expiresAt: '2026-03-31', assignedTo: 'VIP Members' },
  { id: 3, code: 'IBB-VVIP15', campaign: 'VVIP Exclusive', discountType: 'percentage', discountValue: 15, maxUses: 500, usedCount: 124, status: 'active', createdAt: '2026-01-01', expiresAt: '2026-12-31', assignedTo: 'VVIP Members' },
  { id: 4, code: 'IBB-SONGKRAN25', campaign: 'Songkran 2026', discountType: 'percentage', discountValue: 25, maxUses: 300, usedCount: 0, status: 'inactive', createdAt: '2026-03-01', expiresAt: '2026-04-16', assignedTo: null },
  { id: 5, code: 'IBB-BP-CORP', campaign: 'Business Partner', discountType: 'percentage', discountValue: 12, maxUses: 999, usedCount: 67, status: 'active', createdAt: '2026-01-01', expiresAt: '2026-12-31', assignedTo: 'Business Partner' },
  { id: 6, code: 'IBB-MARCH10', campaign: 'March Madness', discountType: 'percentage', discountValue: 10, maxUses: 2000, usedCount: 1456, status: 'active', createdAt: '2026-03-01', expiresAt: '2026-03-31', assignedTo: null },
  { id: 7, code: 'IBB-XMAS30', campaign: 'Christmas 2025', discountType: 'percentage', discountValue: 30, maxUses: 500, usedCount: 500, status: 'expired', createdAt: '2025-12-20', expiresAt: '2025-12-31', assignedTo: null },
  { id: 8, code: 'IBB-NEWYEAR15', campaign: 'New Year 2026', discountType: 'percentage', discountValue: 15, maxUses: 1000, usedCount: 892, status: 'expired', createdAt: '2026-01-01', expiresAt: '2026-01-07', assignedTo: null },
]

const statusColor = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  expired: 'bg-red-100 text-red-600',
  exhausted: 'bg-orange-100 text-orange-700',
}

export default function VoucherCodes() {
  const [codes, setCodes] = useState(initialCodes)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isBulkOpen, setIsBulkOpen] = useState(false)
  const [bulkCount, setBulkCount] = useState(10)
  const [bulkPrefix, setBulkPrefix] = useState('IBB')
  const [bulkDiscount, setBulkDiscount] = useState(10)
  const [bulkExpiry, setBulkExpiry] = useState('')
  const [newCode, setNewCode] = useState({ code: '', campaign: '', discountType: 'percentage', discountValue: 10, maxUses: 100, expiresAt: '', assignedTo: '' })
  const { toast } = useToast()
  const handleExport = () => {
    const rows = [['#', 'Data', 'Value', 'Date']]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ibb_export.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: 'Exported', description: 'CSV downloaded successfully' })
  }

  const filtered = codes.filter(c => {
    const matchSearch = c.code.toLowerCase().includes(search.toLowerCase()) || c.campaign.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  const activeCount = codes.filter(c => c.status === 'active').length
  const totalUsed = codes.reduce((s, c) => s + c.usedCount, 0)
  const totalCapacity = codes.reduce((s, c) => s + c.maxUses, 0)

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code)
    toast({ title: 'Copied!', description: `${code} copied.` })
  }

  const handleDelete = (id) => {
    const c = codes.find(x => x.id === id)
    setCodes(prev => prev.filter(x => x.id !== id))
    toast({ title: 'Deleted', description: `${c.code} removed.` })
  }

  const handleAdd = () => {
    const newId = Math.max(...codes.map(c => c.id)) + 1
    setCodes(prev => [...prev, { ...newCode, id: newId, usedCount: 0, status: 'active', createdAt: new Date().toISOString().split('T')[0] }])
    toast({ title: 'Code Created', description: `${newCode.code} added.` })
    setIsAddOpen(false)
    setNewCode({ code: '', campaign: '', discountType: 'percentage', discountValue: 10, maxUses: 100, expiresAt: '', assignedTo: '' })
  }

  const handleBulkGenerate = () => {
    const newCodes = Array.from({ length: bulkCount }, (_, i) => ({
      id: Math.max(...codes.map(c => c.id)) + i + 1,
      code: generateCode(bulkPrefix),
      campaign: 'Bulk Generated',
      discountType: 'percentage',
      discountValue: bulkDiscount,
      maxUses: 1,
      usedCount: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: bulkExpiry,
      assignedTo: null,
    }))
    setCodes(prev => [...prev, ...newCodes])
    toast({ title: 'Bulk Generated', description: `${bulkCount} codes created.` })
    setIsBulkOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-green-100 border border-green-200">
            <Hash className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Voucher Codes</h1>
            <p className="text-muted-foreground text-sm mt-0.5"> >Create and manage all Voucher Codes</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setIsBulkOpen(true)}>
            <RefreshCw className="h-4 w-4 mr-2" />Bulk Generate
          </Button>
          <Button size="sm" className="bg-gray-700 hover:bg-gray-700" onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />New Code
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">Total Codes</p>
          <p className="text-2xl font-bold">{codes.length}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-green-600">{activeCount}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">Total Used</p>
          <p className="text-2xl font-bold text-blue-600">{totalUsed.toLocaleString()}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">Total Capacity</p>
          <p className="text-2xl font-bold text-purple-600">{totalCapacity.toLocaleString()}</p>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <Card><CardContent className="pt-4 pb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search code or campaign..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'inactive', 'expired'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border capitalize transition-colors ${statusFilter === s ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
                {s}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2"  onClick={handleExport}/>Export</Button>
        </div>
      </CardContent></Card>

      {/* Codes Table */}
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Code</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Campaign</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Discount</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Usage</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Expires</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="font-mono font-bold text-xs bg-muted px-2 py-0.5 rounded">{c.code}</code>
                      <button onClick={() => handleCopy(c.code)} className="text-muted-foreground hover:text-foreground">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {c.assignedTo && <p className="text-xs text-muted-foreground mt-0.5">{c.assignedTo}</p>}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{c.campaign}</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-green-600">
                      {c.discountType === 'percentage' ? `${c.discountValue}%` : `฿${c.discountValue}`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <span className="text-xs font-medium">{c.usedCount}/{c.maxUses}</span>
                      <div className="h-1 bg-gray-100 rounded-full overflow-hidden w-16 mt-1">
                        <div className="h-full bg-blue-400 rounded-full" style={{ width: `${Math.min((c.usedCount/c.maxUses)*100, 100)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{c.expiresAt}</td>
                  <td className="px-4 py-3">
                    <Badge className={`text-xs ${statusColor[c.status]}`}>{c.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New Voucher Code</DialogTitle><DialogDescription>Create New Voucher Code</DialogDescription></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Code</Label>
                <div className="flex gap-2 mt-1">
                  <Input className="font-mono" placeholder="IBB-XXXXXXXX" value={newCode.code} onChange={e => setNewCode(p => ({ ...p, code: e.target.value.toUpperCase() }))} />
                  <Button variant="outline" size="sm" onClick={() => setNewCode(p => ({ ...p, code: generateCode() }))}><RefreshCw className="h-4 w-4" /></Button>
                </div>
              </div>
              <div><Label>Campaign</Label><Input className="mt-1" value={newCode.campaign} onChange={e => setNewCode(p => ({ ...p, campaign: e.target.value }))} /></div>
              <div><Label>Discount Type</Label>
                <select className="mt-1 w-full border rounded-md px-3 py-2 text-sm" value={newCode.discountType} onChange={e => setNewCode(p => ({ ...p, discountType: e.target.value }))}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed (฿)</option>
                </select>
              </div>
              <div><Label>Value</Label><Input type="number" className="mt-1" value={newCode.discountValue} onChange={e => setNewCode(p => ({ ...p, discountValue: parseFloat(e.target.value) || 0 }))} /></div>
              <div><Label>Max Uses</Label><Input type="number" className="mt-1" value={newCode.maxUses} onChange={e => setNewCode(p => ({ ...p, maxUses: parseInt(e.target.value) || 0 }))} /></div>
              <div><Label>Expires At</Label><Input type="date" className="mt-1" value={newCode.expiresAt} onChange={e => setNewCode(p => ({ ...p, expiresAt: e.target.value }))} /></div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button size="sm" className="flex-1 bg-gray-700 hover:bg-gray-700" onClick={handleAdd}>Create</Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Generate Dialog */}
      <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Bulk Generate Codes</DialogTitle><DialogDescription>Create multiple Voucher Codes at once</DialogDescription></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Prefix</Label><Input className="mt-1 font-mono" value={bulkPrefix} onChange={e => setBulkPrefix(e.target.value.toUpperCase())} /></div>
              <div><Label>Count</Label><Input type="number" className="mt-1" min={1} max={500} value={bulkCount} onChange={e => setBulkCount(parseInt(e.target.value) || 1)} /></div>
              <div><Label>Discount (%)</Label><Input type="number" className="mt-1" value={bulkDiscount} onChange={e => setBulkDiscount(parseFloat(e.target.value) || 0)} /></div>
              <div><Label>Expires At</Label><Input type="date" className="mt-1" value={bulkExpiry} onChange={e => setBulkExpiry(e.target.value)} /></div>
            </div>
            <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">Will create <strong>{bulkCount}</strong> Code Formats <code className="font-mono">{bulkPrefix}-XXXXXXXX</code> Each code can be used once</p>
            <div className="flex gap-3 pt-2">
              <Button size="sm" className="flex-1 bg-gray-700 hover:bg-gray-700" onClick={handleBulkGenerate}>Generate {bulkCount} Codes</Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => setIsBulkOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
