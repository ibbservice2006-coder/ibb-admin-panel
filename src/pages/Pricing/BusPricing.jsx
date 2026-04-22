import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Search, RefreshCw, Download, Edit, Bus, ChevronLeft, ChevronRight } from 'lucide-react'

const busRoutes = [
  { id: 1, zone: 'Airport Transfer', distance: '26 km', destination: 'Bangkok - Don Mueang Airport', minibus: 6000, mid: 10000, group: 14000 },
  { id: 2, zone: 'Airport Transfer', distance: '32 km', destination: 'Bangkok - Suvarnabhumi Airport', minibus: 6000, mid: 10000, group: 14000 },
  { id: 3, zone: 'Airport Transfer', distance: '178 km', destination: 'Bangkok - Utapao Airport', minibus: null, mid: 25000, group: 28000 },
  { id: 4, zone: 'Central Region', distance: '35 km', destination: 'Bangkok - Nonthaburi', minibus: null, mid: 12000, group: 14000 },
  { id: 5, zone: 'Central Region', distance: '45 km', destination: 'Bangkok - Pathum Thani', minibus: null, mid: 13000, group: 15000 },
  { id: 6, zone: 'Central Region', distance: '51 km', destination: 'Bangkok - Samut Prakan', minibus: null, mid: 12000, group: 14000 },
  { id: 7, zone: 'Central Region', distance: '59 km', destination: 'Bangkok - Samut Sakhon', minibus: null, mid: null, group: null },
  { id: 8, zone: 'Central Region', distance: '69 km', destination: 'Bangkok - Nakhon Pathom', minibus: null, mid: 16000, group: null },
  { id: 9, zone: 'Central Region', distance: '78 km', destination: 'Bangkok - Chachoengsao', minibus: 12000, mid: 19000, group: 23000 },
  { id: 10, zone: 'The East of Thailand', distance: '100 km', destination: 'Bangkok - Bangsean', minibus: 12000, mid: 20000, group: 24000 },
  { id: 11, zone: 'The East of Thailand', distance: '150 km', destination: 'Bangkok - Chon Buri', minibus: 12500, mid: 21000, group: 24000 },
  { id: 12, zone: 'The East of Thailand', distance: '150 km', destination: 'Bangkok - Pattaya', minibus: 14000, mid: 23000, group: 25000 },
  { id: 13, zone: 'The East of Thailand', distance: '130 km', destination: 'Bangkok - Laem Chabang', minibus: 12500, mid: 21000, group: 24000 },
  { id: 14, zone: 'The East of Thailand', distance: '200 km', destination: 'Bangkok - Sathahip', minibus: 14000, mid: 23000, group: 25000 },
  { id: 15, zone: 'The East of Thailand', distance: '220 km', destination: 'Bangkok - Rayong', minibus: 16000, mid: 27000, group: 30000 },
  { id: 16, zone: 'The East of Thailand', distance: '242 km', destination: 'Bangkok - Ban Phae Pier', minibus: 16300, mid: 27300, group: 30300 },
  { id: 17, zone: 'The East of Thailand', distance: '275 km', destination: 'Bangkok - Chanthaburi', minibus: 16000, mid: 27000, group: 30000 },
  { id: 18, zone: 'The East of Thailand', distance: '300 km', destination: 'Bangkok - Aranyaprathet', minibus: null, mid: null, group: null },
  { id: 19, zone: 'The East of Thailand', distance: '300 km', destination: 'Bangkok - Sa Kaeo', minibus: null, mid: null, group: null },
  { id: 20, zone: 'The East of Thailand', distance: '400 km', destination: 'Bangkok - Trat', minibus: 18000, mid: 30000, group: 33000 },
  { id: 21, zone: 'The East of Thailand', distance: '420 km', destination: 'Bangkok - Hat Lek', minibus: null, mid: null, group: null },
  { id: 22, zone: 'The East of Thailand', distance: '450 km', destination: 'Bangkok - Koh Chang', minibus: null, mid: null, group: null },
  { id: 23, zone: 'The South of Thailand', distance: '99 km', destination: 'Bangkok - Samut Songkhram', minibus: null, mid: 18000, group: null },
  { id: 24, zone: 'The South of Thailand', distance: '200 km', destination: 'Bangkok - Cha-Am', minibus: 12000, mid: 19000, group: 21000 },
  { id: 25, zone: 'The South of Thailand', distance: '220 km', destination: 'Bangkok - Hua Hin', minibus: 14000, mid: 23000, group: 25000 },
  { id: 26, zone: 'The South of Thailand', distance: '245 km', destination: 'Bangkok - Pranburi', minibus: null, mid: null, group: null },
  { id: 27, zone: 'The South of Thailand', distance: '300 km', destination: 'Bangkok - Kui Buri', minibus: null, mid: null, group: null },
  { id: 28, zone: 'The South of Thailand', distance: '265 km', destination: 'Bangkok - Sam Roi Yot', minibus: 5100, mid: 5300, group: null },
  { id: 29, zone: 'The South of Thailand', distance: '380 km', destination: 'Bangkok - Bang Saphan', minibus: null, mid: null, group: null },
  { id: 30, zone: 'The South of Thailand', distance: '500 km', destination: 'Bangkok - Chumphon', minibus: 24000, mid: 40000, group: null },
  { id: 31, zone: 'The South of Thailand', distance: '867 km', destination: 'Bangkok - Phuket', minibus: null, mid: 73000, group: 75000 },
  { id: 32, zone: 'The South of Thailand', distance: '710 km', destination: 'Bangkok - Don Sak', minibus: null, mid: null, group: null },
  { id: 33, zone: 'The South of Thailand', distance: '644 km', destination: 'Bangkok - Surat Thani', minibus: null, mid: 42000, group: null },
  { id: 34, zone: 'The South of Thailand', distance: '946 km', destination: 'Bangkok - Krabi', minibus: null, mid: 52000, group: null },
  { id: 35, zone: 'The West of Thailand', distance: '165 km', destination: 'Bangkok - Ratchaburi', minibus: null, mid: 20000, group: null },
  { id: 36, zone: 'The West of Thailand', distance: '130 km', destination: 'Bangkok - Kanchanaburi', minibus: 15000, mid: 25000, group: null },
  { id: 37, zone: 'The West of Thailand', distance: '235 km', destination: 'Bangkok - Sai Yok', minibus: null, mid: null, group: null },
  { id: 38, zone: 'The West of Thailand', distance: '380 km', destination: 'Bangkok - Sangkhla Buri', minibus: null, mid: null, group: null },
  { id: 39, zone: 'The North of Thailand', distance: '76 km', destination: 'Bangkok - Ayutthaya', minibus: 10000, mid: 16000, group: 20000 },
  { id: 40, zone: 'The North of Thailand', distance: '260 km', destination: 'Bangkok - Nakhon Sawan', minibus: null, mid: 25000, group: null },
  { id: 41, zone: 'The North of Thailand', distance: '350 km', destination: 'Bangkok - Phetchabun', minibus: null, mid: null, group: null },
  { id: 42, zone: 'The North of Thailand', distance: '400 km', destination: 'Bangkok - Phitsanulok', minibus: null, mid: 29000, group: null },
  { id: 43, zone: 'The North of Thailand', distance: '500 km', destination: 'Bangkok - Sukhothai', minibus: null, mid: 36000, group: null },
  { id: 44, zone: 'The North of Thailand', distance: '519 km', destination: 'Bangkok - Mae Sot - Tak', minibus: null, mid: null, group: null },
  { id: 45, zone: 'The North of Thailand', distance: '695 km', destination: 'Bangkok - Chiang Mai', minibus: 32000, mid: 52000, group: null },
  { id: 46, zone: 'The North of Thailand', distance: '820 km', destination: 'Bangkok - Chiang Rai', minibus: null, mid: null, group: null },
  { id: 47, zone: 'The Northeast of Thailand', distance: '107 km', destination: 'Bangkok - Saraburi', minibus: null, mid: 21500, group: null },
  { id: 48, zone: 'The Northeast of Thailand', distance: '165 km', destination: 'Bangkok - Khao Yai', minibus: 14000, mid: 23000, group: null },
  { id: 49, zone: 'The Northeast of Thailand', distance: '246 km', destination: 'Bangkok - Wang Nam Khiao', minibus: null, mid: null, group: null },
  { id: 50, zone: 'The Northeast of Thailand', distance: '299 km', destination: 'Bangkok - Nakhon Ratchasima', minibus: null, mid: 25000, group: null },
  { id: 51, zone: 'Hourly', distance: '4 Hrs', destination: '04 Hours: Private Bus Rental with Driver & Fuel (Max 250 Km.)', minibus: 12000, mid: 20000, group: 28000 },
  { id: 52, zone: 'Hourly', distance: '6 Hrs', destination: '06 Hours: Private Bus Rental with Driver & Fuel (Max 300 Km.)', minibus: 18000, mid: 30000, group: 38000 },
  { id: 53, zone: 'Hourly', distance: '8 Hrs', destination: '08 Hours: Private Bus Rental with Driver & Fuel (Max 350 Km.)', minibus: 21000, mid: 35000, group: 50000 },
  { id: 54, zone: 'Hourly', distance: '10 Hrs', destination: '10 Hours: Private Bus Rental with Driver & Fuel (Max 400 Km.)', minibus: 27000, mid: 45000, group: 65000 },
  { id: 55, zone: 'Period', distance: '1 Day', destination: '01 Day: Private Bus Rental with Driver & Fuel (Max 350 Km./Day)', minibus: 21000, mid: 35000, group: 50000 },
  { id: 56, zone: 'Period', distance: '7 Days', destination: '07 Day: Private Bus Rental with Driver & Fuel (Max 350 Km./Day)', minibus: null, mid: null, group: null },
  { id: 57, zone: 'Period', distance: '15 Days', destination: '15 Day: Private Bus Rental with Driver & Fuel (Max 350 Km./Day)', minibus: null, mid: null, group: null },
  { id: 58, zone: 'Period', distance: '30 Days', destination: '30 Day: Private Bus Rental with Driver & Fuel (Max 350 Km./Day)', minibus: null, mid: null, group: null },
]

const zones = ['All Zones', 'Airport Transfer', 'Central Region', 'The East of Thailand', 'The South of Thailand', 'The West of Thailand', 'The North of Thailand', 'The Northeast of Thailand', 'Hourly', 'Period']
const zoneColors = { 'Airport Transfer': 'bg-blue-100 text-blue-800', 'Central Region': 'bg-green-100 text-green-800', 'The East of Thailand': 'bg-orange-100 text-orange-800', 'The South of Thailand': 'bg-yellow-100 text-yellow-800', 'The West of Thailand': 'bg-purple-100 text-purple-800', 'The North of Thailand': 'bg-red-100 text-red-800', 'The Northeast of Thailand': 'bg-pink-100 text-pink-800', 'Hourly': 'bg-teal-100 text-teal-800', 'Period': 'bg-indigo-100 text-indigo-800' }
const fp = (v) => v ? `฿${v.toLocaleString()}` : <span className="text-gray-300">N/A</span>
const PAGE_SIZE = 15

export default function BusPricing() {
  const [search, setSearch] = useState('')
  const [zone, setZone] = useState('All Zones')
  const [page, setPage] = useState(1)
  const [editRow, setEditRow] = useState(null)
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast({ title: 'Refreshed', description: 'Latest data loaded' })
    }, 800)
  }
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

  const filtered = busRoutes.filter(r =>
    (zone === 'All Zones' || r.zone === zone) &&
    r.destination.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Bus className="h-6 w-6 text-orange-600" /> Bus / Coach Pricing</h1>
          <p className="text-sm text-gray-500 mt-1">Bus/Coach price list all routes — Minibus / Mid-sized / Group Bus</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
          <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Routes', value: busRoutes.length },
          { label: 'Price Tiers', value: 3 },
          { label: 'Zones', value: 9 },
          { label: 'Available Routes', value: busRoutes.filter(r => r.minibus || r.mid || r.group).length },
        ].map((s, i) => (
          <Card key={i}><CardContent className="pt-5">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </CardContent></Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search destination..." className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
        <Select value={zone} onValueChange={v => { setZone(v); setPage(1) }}>
          <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
          <SelectContent>{zones.map(z => <SelectItem key={z} value={z}>{z}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Destination</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Zone</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Dist.</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Minibus</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Mid-sized</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Group Bus</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paged.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">{r.destination}</td>
                <td className="px-4 py-3"><Badge className={`text-xs ${zoneColors[r.zone] || 'bg-gray-100 text-gray-700'}`}>{r.zone}</Badge></td>
                <td className="px-4 py-3 text-gray-500">{r.distance}</td>
                <td className="px-4 py-3 text-right font-medium">{fp(r.minibus)}</td>
                <td className="px-4 py-3 text-right font-medium">{fp(r.mid)}</td>
                <td className="px-4 py-3 text-right font-medium">{fp(r.group)}</td>
                <td className="px-4 py-3 text-center">
                  <Button variant="ghost" size="sm" onClick={() => setEditRow(r)}><Edit className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} routes</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="px-3 py-1 border rounded text-sm">{page} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      {editRow && (
        <Dialog open={!!editRow} onOpenChange={() => setEditRow(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Edit Price — {editRow.destination}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                {[['Minibus', editRow.minibus], ['Mid-sized', editRow.mid], ['Group Bus', editRow.group]].map(([label, val]) => (
                  <div key={label}>
                    <label className="text-xs text-gray-500 block mb-1">{label}</label>
                    <Input defaultValue={val || ''} placeholder="N/A" />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white flex-1" onClick={() => { toast({ title: 'Price updated successfully' }); setEditRow(null) }}>Save Changes</Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditRow(null)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
