import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { RefreshCw, Download, Plus, Edit, Trash2, Calendar, TrendingUp, AlertCircle } from 'lucide-react'
import { useFestivals, useCreateFestival, useUpdateFestival, useDeleteFestival } from '@/hooks/usePricing'

const statusColor = { active: 'bg-green-100 text-green-800', upcoming: 'bg-blue-100 text-blue-800', expired: 'bg-gray-100 text-gray-600' }
const statusLabel = { active: 'Active', upcoming: 'Upcoming', expired: 'Expired' }

function getFestivalStatus(startDate, endDate) {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (now >= start && now <= end) return 'active'
  if (now < start) return 'upcoming'
  return 'expired'
}

export default function FestivalPricing() {
  const [editItem, setEditItem] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const { toast } = useToast()
  const { data: festData, isLoading, refetch } = useFestivals()
  const createFestival = useCreateFestival()
  const updateFestival = useUpdateFestival()
  const deleteFestival = useDeleteFestival()

  const [isRefreshing, setIsRefreshing] = useState(false)
  const handleRefresh = () => {
    setIsRefreshing(true)
    refetch().finally(() => {
      setIsRefreshing(false)
      toast({ title: 'Refreshed', description: 'Latest data loaded' })
    })
  }

  const festivals = (festData?.data ?? []).map(f => ({
    id: f.id,
    name: f.name ?? '-',
    nameLocal: f.name ?? '-',
    year: new Date(f.start_datetime ?? f.start_date ?? Date.now()).getFullYear(),
    startDate: (f.start_datetime ?? f.start_date ?? '').slice(0, 10),
    endDate: (f.end_datetime ?? f.end_date ?? '').slice(0, 10),
    multiplier: parseFloat(f.multiplier ?? 1),
    status: getFestivalStatus(f.start_datetime ?? f.start_date, f.end_datetime ?? f.end_date),
    applies: ['Car', 'Van', 'Bus'],
    zones: 'All Zones',
    note: f.description ?? '',
  }))

  const filtered = festivals.filter(f => filterStatus === 'all' || f.status === filterStatus)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-red-500" /> Festival Pricing
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage special festival pricing — Songkran / New Year / Chinese New Year</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={() => setShowAdd(true)}><Plus />Add Festival</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-5">
          <p className="text-xs text-gray-500">Total Festivals</p>
          <p className="text-2xl font-bold mt-1">{isLoading ? '...' : festivals.length}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <p className="text-xs text-gray-500">Active Now</p>
          <p className="text-2xl font-bold mt-1 text-green-600">{festivals.filter(f => f.status === 'active').length}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <p className="text-xs text-gray-500">Upcoming</p>
          <p className="text-2xl font-bold mt-1 text-blue-600">{festivals.filter(f => f.status === 'upcoming').length}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <p className="text-xs text-gray-500">Max Surcharge</p>
          <p className="text-2xl font-bold mt-1 text-orange-600">+30%</p>
        </CardContent></Card>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-amber-800">
          <p className="font-semibold">Festival Pricing Rules</p>
          <p className="mt-1">Festival prices auto-calculated as regular price × multiplier during set dates. Admin can toggle anytime.</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Festival Cards */}
      <div className="space-y-3">
        {filtered.map(f => (
          <Card key={f.id} className={f.status === 'active' ? 'border-green-300 shadow-sm' : ''}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{f.name}</h3>
                    <span className="text-gray-400 text-sm">({f.nameLocal})</span>
                    <Badge className={statusColor[f.status]}>{statusLabel[f.status]}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{f.startDate} – {f.endDate}</span>
                    <span className="flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5 text-red-500" />
                      <span className="font-semibold text-red-600">×{f.multiplier} (+{Math.round((f.multiplier - 1) * 100)}%)</span>
                    </span>
                    <span>Applies to: {f.applies.join(', ')}</span>
                    <span>Zones: {f.zones}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{f.note}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" onClick={() => { setEditItem(f); setEditValues({ name: f.name, startDate: f.startDate, endDate: f.endDate, multiplier: f.multiplier, note: f.note }) }}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => deleteFestival.mutate(f.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editItem && (
        <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Edit Festival — {editItem.name}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><label className="text-xs text-gray-500 block mb-1">Festival Name</label>
                <Input value={editValues.name ?? ''} onChange={e => setEditValues(v => ({ ...v, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-gray-500 block mb-1">Start Date</label>
                  <Input type="date" value={editValues.startDate ?? ''} onChange={e => setEditValues(v => ({ ...v, startDate: e.target.value }))} />
                </div>
                <div><label className="text-xs text-gray-500 block mb-1">End Date</label>
                  <Input type="date" value={editValues.endDate ?? ''} onChange={e => setEditValues(v => ({ ...v, endDate: e.target.value }))} />
                </div>
              </div>
              <div><label className="text-xs text-gray-500 block mb-1">Price Multiplier (e.g. 1.30 = +30%)</label>
                <Input type="number" step="0.05" value={editValues.multiplier ?? 1} onChange={e => setEditValues(v => ({ ...v, multiplier: parseFloat(e.target.value) }))} />
              </div>
              <div><label className="text-xs text-gray-500 block mb-1">Note</label>
                <Input value={editValues.note ?? ''} onChange={e => setEditValues(v => ({ ...v, note: e.target.value }))} />
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white flex-1" onClick={() => {
                  updateFestival.mutate({
                    id: editItem.id,
                    name: editValues.name,
                    start_datetime: editValues.startDate + 'T00:00:00+07:00',
                    end_datetime: editValues.endDate + 'T23:59:59+07:00',
                    multiplier: editValues.multiplier,
                    description: editValues.note,
                  })
                  setEditItem(null)
                }}>Save Changes</Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditItem(null)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Dialog */}
      {showAdd && (
        <Dialog open={showAdd} onOpenChange={() => setShowAdd(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Add New Festival Period</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><label className="text-xs text-gray-500 block mb-1">Festival Name</label><Input placeholder="e.g. Songkran Festival" /></div>
              <div><label className="text-xs text-gray-500 block mb-1">Local Name</label><Input placeholder="e.g. Songkran" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-gray-500 block mb-1">Start Date</label><Input type="date" /></div>
                <div><label className="text-xs text-gray-500 block mb-1">End Date</label><Input type="date" /></div>
              </div>
              <div><label className="text-xs text-gray-500 block mb-1">Price Multiplier</label><Input type="number" step="0.05" placeholder="1.20" /></div>
              <div><label className="text-xs text-gray-500 block mb-1">Note</label><Input placeholder="Description..." /></div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white flex-1" onClick={() => { toast({ title: 'Festival added' }); setShowAdd(false) }}>Add Festival</Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
