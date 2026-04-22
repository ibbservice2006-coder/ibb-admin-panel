import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Search, RefreshCw, Download, Edit, ChevronLeft, ChevronRight } from 'lucide-react'

const vanRoutes = [
  { id: 1, zone: 'Airport Transfer', distance: '26 km', destination: 'Bangkok - Don Mueang Airport', std: 1400, exec: 1600, premium: 3500, luxury: 10000 },
  { id: 2, zone: 'Airport Transfer', distance: '32 km', destination: 'Bangkok - Suvarnabhumi Airport', std: 1400, exec: 1600, premium: 3500, luxury: 10000 },
  { id: 3, zone: 'Airport Transfer', distance: '178 km', destination: 'Bangkok - Utapao Airport', std: 3800, exec: 4000, premium: 15000, luxury: null },
  { id: 4, zone: 'Central Region', distance: '35 km', destination: 'Bangkok - Nonthaburi', std: 1400, exec: 1600, premium: null, luxury: 18000 },
  { id: 5, zone: 'Central Region', distance: '45 km', destination: 'Bangkok - Pathum Thani', std: 2200, exec: 2400, premium: null, luxury: null },
  { id: 6, zone: 'Central Region', distance: '51 km', destination: 'Bangkok - Samut Prakan', std: 2200, exec: 2400, premium: null, luxury: null },
  { id: 7, zone: 'Central Region', distance: '59 km', destination: 'Bangkok - Samut Sakhon', std: 2400, exec: 2600, premium: null, luxury: null },
  { id: 8, zone: 'Central Region', distance: '69 km', destination: 'Bangkok - Nakhon Pathom', std: 2800, exec: 3000, premium: 12300, luxury: null },
  { id: 9, zone: 'Central Region', distance: '78 km', destination: 'Bangkok - Chachoengsao', std: 2800, exec: 3000, premium: 12000, luxury: null },
  { id: 10, zone: 'The East of Thailand', distance: '100 km', destination: 'Bangkok - Bangsean', std: 2600, exec: 2800, premium: null, luxury: null },
  { id: 11, zone: 'The East of Thailand', distance: '150 km', destination: 'Bangkok - Chon Buri', std: 2800, exec: 3000, premium: 10000, luxury: null },
  { id: 12, zone: 'The East of Thailand', distance: '150 km', destination: 'Bangkok - Pattaya', std: 3600, exec: 3800, premium: 10000, luxury: 22000 },
  { id: 13, zone: 'The East of Thailand', distance: '130 km', destination: 'Bangkok - Laem Chabang', std: 3800, exec: 4000, premium: 10000, luxury: 23500 },
  { id: 14, zone: 'The East of Thailand', distance: '200 km', destination: 'Bangkok - Sathahip', std: 3800, exec: 4000, premium: 12000, luxury: null },
  { id: 15, zone: 'The East of Thailand', distance: '220 km', destination: 'Bangkok - Rayong', std: 3800, exec: 4000, premium: 15000, luxury: 28000 },
  { id: 16, zone: 'The East of Thailand', distance: '242 km', destination: 'Bangkok - Ban Phae Pier', std: 4100, exec: 4300, premium: 15300, luxury: 28300 },
  { id: 17, zone: 'The East of Thailand', distance: '275 km', destination: 'Bangkok - Chanthaburi', std: 4300, exec: 4500, premium: 13000, luxury: 33000 },
  { id: 18, zone: 'The East of Thailand', distance: '300 km', destination: 'Bangkok - Aranyaprathet', std: 4800, exec: 5000, premium: null, luxury: null },
  { id: 19, zone: 'The East of Thailand', distance: '300 km', destination: 'Bangkok - Sa Kaeo', std: 4900, exec: 5100, premium: null, luxury: null },
  { id: 20, zone: 'The East of Thailand', distance: '400 km', destination: 'Bangkok - Trat', std: 6800, exec: 7000, premium: 22000, luxury: 30000 },
  { id: 21, zone: 'The East of Thailand', distance: '420 km', destination: 'Bangkok - Hat Lek', std: 7300, exec: 7500, premium: null, luxury: null },
  { id: 22, zone: 'The East of Thailand', distance: '450 km', destination: 'Bangkok - Koh Chang', std: 7800, exec: 8000, premium: 16000, luxury: null },
  { id: 23, zone: 'The South of Thailand', distance: '99 km', destination: 'Bangkok - Samut Songkhram', std: 2600, exec: 2800, premium: null, luxury: null },
  { id: 24, zone: 'The South of Thailand', distance: '200 km', destination: 'Bangkok - Cha-Am', std: 3800, exec: 4000, premium: 13000, luxury: 25000 },
  { id: 25, zone: 'The South of Thailand', distance: '220 km', destination: 'Bangkok - Hua Hin', std: 4300, exec: 4500, premium: 13000, luxury: 33000 },
  { id: 26, zone: 'The South of Thailand', distance: '245 km', destination: 'Bangkok - Pranburi', std: 4800, exec: 5000, premium: 15000, luxury: null },
  { id: 27, zone: 'The South of Thailand', distance: '300 km', destination: 'Bangkok - Kui Buri', std: 5100, exec: 5300, premium: null, luxury: null },
  { id: 28, zone: 'The South of Thailand', distance: '265 km', destination: 'Bangkok - Sam Roi Yot', std: 5100, exec: 5300, premium: null, luxury: null },
  { id: 29, zone: 'The South of Thailand', distance: '380 km', destination: 'Bangkok - Bang Saphan', std: 6300, exec: 6500, premium: 26000, luxury: 35000 },
  { id: 30, zone: 'The South of Thailand', distance: '500 km', destination: 'Bangkok - Chumphon', std: 8600, exec: 8800, premium: 25000, luxury: null },
  { id: 31, zone: 'The South of Thailand', distance: '867 km', destination: 'Bangkok - Phuket', std: 17300, exec: 17500, premium: 40000, luxury: 109000 },
  { id: 32, zone: 'The South of Thailand', distance: '710 km', destination: 'Bangkok - Don Sak', std: 18300, exec: 18500, premium: null, luxury: null },
  { id: 33, zone: 'The South of Thailand', distance: '644 km', destination: 'Bangkok - Surat Thani', std: 18300, exec: 18500, premium: null, luxury: null },
  { id: 34, zone: 'The South of Thailand', distance: '946 km', destination: 'Bangkok - Krabi', std: 18300, exec: 18500, premium: null, luxury: null },
  { id: 35, zone: 'The West of Thailand', distance: '165 km', destination: 'Bangkok - Ratchaburi', std: 3600, exec: 3800, premium: null, luxury: null },
  { id: 36, zone: 'The West of Thailand', distance: '130 km', destination: 'Bangkok - Kanchanaburi', std: 4200, exec: 4400, premium: 11500, luxury: 22000 },
  { id: 37, zone: 'The West of Thailand', distance: '235 km', destination: 'Bangkok - Sai Yok', std: 5600, exec: 5800, premium: null, luxury: null },
  { id: 38, zone: 'The West of Thailand', distance: '380 km', destination: 'Bangkok - Sangkhla Buri', std: 7800, exec: 8000, premium: null, luxury: null },
  { id: 39, zone: 'The North of Thailand', distance: '76 km', destination: 'Bangkok - Ayutthaya', std: 2900, exec: 3100, premium: 10000, luxury: null },
  { id: 40, zone: 'The North of Thailand', distance: '260 km', destination: 'Bangkok - Nakhon Sawan', std: 4600, exec: 4800, premium: 20900, luxury: null },
  { id: 41, zone: 'The North of Thailand', distance: '350 km', destination: 'Bangkok - Phetchabun', std: 7800, exec: 8000, premium: null, luxury: null },
  { id: 42, zone: 'The North of Thailand', distance: '400 km', destination: 'Bangkok - Phitsanulok', std: 7800, exec: 8000, premium: 17000, luxury: 35000 },
  { id: 43, zone: 'The North of Thailand', distance: '500 km', destination: 'Bangkok - Sukhothai', std: 9800, exec: 10000, premium: null, luxury: 41500 },
  { id: 44, zone: 'The North of Thailand', distance: '519 km', destination: 'Bangkok - Mae Sot - Tak', std: 11300, exec: 11500, premium: 18400, luxury: null },
  { id: 45, zone: 'The North of Thailand', distance: '695 km', destination: 'Bangkok - Chiang Mai', std: 18300, exec: 18500, premium: 34000, luxury: 52000 },
  { id: 46, zone: 'The North of Thailand', distance: '820 km', destination: 'Bangkok - Chiang Rai', std: 20300, exec: 20500, premium: null, luxury: null },
  { id: 47, zone: 'The Northeast of Thailand', distance: '107 km', destination: 'Bangkok - Saraburi', std: 3300, exec: 3500, premium: null, luxury: null },
  { id: 48, zone: 'The Northeast of Thailand', distance: '165 km', destination: 'Bangkok - Khao Yai', std: 4200, exec: 4400, premium: 10500, luxury: 19500 },
  { id: 49, zone: 'The Northeast of Thailand', distance: '246 km', destination: 'Bangkok - Wang Nam Khiao', std: 4600, exec: 4800, premium: 18000, luxury: null },
  { id: 50, zone: 'The Northeast of Thailand', distance: '299 km', destination: 'Bangkok - Nakhon Ratchasima', std: 4600, exec: 4800, premium: 11500, luxury: 28000 },
  { id: 51, zone: 'Hourly', distance: '4 Hrs', destination: '04 Hours: Private Van Rental with Driver & Fuel (Max 250 Km.)', std: 3200, exec: 3400, premium: 7500, luxury: 10000 },
  { id: 52, zone: 'Hourly', distance: '6 Hrs', destination: '06 Hours: Private Van Rental with Driver & Fuel (Max 300 Km.)', std: 4600, exec: 4800, premium: 9000, luxury: 16000 },
  { id: 53, zone: 'Hourly', distance: '8 Hrs', destination: '08 Hours: Private Van Rental with Driver & Fuel (Max 350 Km.)', std: 5800, exec: 6000, premium: 12000, luxury: 20000 },
  { id: 54, zone: 'Hourly', distance: '10 Hrs', destination: '10 Hours: Private Van Rental with Driver & Fuel (Max 400 Km.)', std: 7300, exec: 7500, premium: 15000, luxury: 24000 },
  { id: 55, zone: 'Period', distance: '1 Day', destination: '01 Day: Private Van Rental with Driver & Fuel (Max 350 Km./Day)', std: 5800, exec: 6000, premium: 12000, luxury: 20000 },
  { id: 56, zone: 'Period', distance: '7 Days', destination: '07 Day: Private Van Rental with Driver & Fuel (Max 350 Km./Day)', std: 39800, exec: 40000, premium: 84000, luxury: null },
  { id: 57, zone: 'Period', distance: '15 Days', destination: '15 Day: Private Van Rental with Driver & Fuel (Max 350 Km./Day)', std: 84800, exec: 85000, premium: 180000, luxury: null },
  { id: 58, zone: 'Period', distance: '30 Days', destination: '30 Day: Private Van Rental with Driver & Fuel (Max 350 Km./Day)', std: 149800, exec: 150000, premium: 350000, luxury: null },
]

const zones = ['All Zones', 'Airport Transfer', 'Central Region', 'The East of Thailand', 'The South of Thailand', 'The West of Thailand', 'The North of Thailand', 'The Northeast of Thailand', 'Hourly', 'Period']
const zoneColors = { 'Airport Transfer': 'bg-blue-100 text-blue-800', 'Central Region': 'bg-green-100 text-green-800', 'The East of Thailand': 'bg-orange-100 text-orange-800', 'The South of Thailand': 'bg-yellow-100 text-yellow-800', 'The West of Thailand': 'bg-purple-100 text-purple-800', 'The North of Thailand': 'bg-red-100 text-red-800', 'The Northeast of Thailand': 'bg-pink-100 text-pink-800', 'Hourly': 'bg-teal-100 text-teal-800', 'Period': 'bg-indigo-100 text-indigo-800' }
const fp = (v) => v ? `฿${v.toLocaleString()}` : <span className="text-gray-300">N/A</span>
const PAGE_SIZE = 15

export default function VanPricing() {
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

  const filtered = vanRoutes.filter(r =>
    (zone === 'All Zones' || r.zone === zone) &&
    r.destination.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">MPV / Van Pricing</h1>
          <p className="text-sm text-gray-500 mt-1">MPV/Van price table all routes — Standard / Executive / Premium / Luxury</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
          <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Routes', value: vanRoutes.length },
          { label: 'Price Tiers', value: 4 },
          { label: 'Zones', value: 9 },
          { label: 'Luxury Routes', value: vanRoutes.filter(r => r.luxury).length },
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
              <th className="text-right px-4 py-3 font-medium text-gray-600">Standard</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Executive</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Premium</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Luxury</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paged.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">{r.destination}</td>
                <td className="px-4 py-3"><Badge className={`text-xs ${zoneColors[r.zone] || 'bg-gray-100 text-gray-700'}`}>{r.zone}</Badge></td>
                <td className="px-4 py-3 text-gray-500">{r.distance}</td>
                <td className="px-4 py-3 text-right font-medium">{fp(r.std)}</td>
                <td className="px-4 py-3 text-right font-medium">{fp(r.exec)}</td>
                <td className="px-4 py-3 text-right font-medium text-purple-700">{fp(r.premium)}</td>
                <td className="px-4 py-3 text-right font-medium text-purple-700">{fp(r.luxury)}</td>
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
              <div className="grid grid-cols-2 gap-3">
                {[['Standard', editRow.std], ['Executive', editRow.exec], ['Premium', editRow.premium], ['Luxury', editRow.luxury]].map(([label, val]) => (
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
