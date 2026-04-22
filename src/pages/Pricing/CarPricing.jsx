import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Search, RefreshCw, Download, Edit, Car, ChevronLeft, ChevronRight } from 'lucide-react'

const carRoutes = [
  { id: 1, zone: 'Airport Transfer', distance: '26 km', destination: 'Bangkok - Don Mueang Airport', std: 1100, exec: 1300, family: 1300, electric: 1300, limo_premium: 3500, limo_luxury: 5000 },
  { id: 2, zone: 'Airport Transfer', distance: '32 km', destination: 'Bangkok - Suvarnabhumi Airport', std: 1100, exec: 1300, family: 1300, electric: 1300, limo_premium: 3500, limo_luxury: 5000 },
  { id: 3, zone: 'Airport Transfer', distance: '178 km', destination: 'Bangkok - Utapao Airport', std: 3000, exec: 3300, family: 3300, electric: 3300, limo_premium: 15000, limo_luxury: 16500 },
  { id: 4, zone: 'Central Region', distance: '35 km', destination: 'Bangkok - Nonthaburi', std: 1100, exec: 1300, family: 1300, electric: 1300, limo_premium: null, limo_luxury: null },
  { id: 5, zone: 'Central Region', distance: '45 km', destination: 'Bangkok - Pathum Thani', std: 1500, exec: 1500, family: 1500, electric: 1500, limo_premium: null, limo_luxury: null },
  { id: 6, zone: 'Central Region', distance: '51 km', destination: 'Bangkok - Samut Prakan', std: 1700, exec: 1800, family: 1800, electric: 2000, limo_premium: null, limo_luxury: null },
  { id: 7, zone: 'Central Region', distance: '59 km', destination: 'Bangkok - Samut Sakhon', std: 1800, exec: 2100, family: 2100, electric: 2100, limo_premium: null, limo_luxury: null },
  { id: 8, zone: 'Central Region', distance: '69 km', destination: 'Bangkok - Nakhon Pathom', std: 2200, exec: 2500, family: 2500, electric: 2500, limo_premium: 9500, limo_luxury: 10900 },
  { id: 9, zone: 'Central Region', distance: '78 km', destination: 'Bangkok - Chachoengsao', std: 2300, exec: 2600, family: 2600, electric: 2600, limo_premium: null, limo_luxury: null },
  { id: 10, zone: 'The East of Thailand', distance: '100 km', destination: 'Bangkok - Bangsean', std: 2100, exec: 2400, family: 2400, electric: 2400, limo_premium: null, limo_luxury: null },
  { id: 11, zone: 'The East of Thailand', distance: '150 km', destination: 'Bangkok - Chon Buri', std: 2200, exec: 2500, family: 2500, electric: 2500, limo_premium: null, limo_luxury: null },
  { id: 12, zone: 'The East of Thailand', distance: '150 km', destination: 'Bangkok - Pattaya', std: 2600, exec: 2850, family: 2850, electric: 2850, limo_premium: 10000, limo_luxury: 12500 },
  { id: 13, zone: 'The East of Thailand', distance: '130 km', destination: 'Bangkok - Laem Chabang', std: 2800, exec: 3000, family: 3000, electric: 3000, limo_premium: 10000, limo_luxury: 13500 },
  { id: 14, zone: 'The East of Thailand', distance: '200 km', destination: 'Bangkok - Sathahip', std: 2800, exec: 3000, family: 3000, electric: 3000, limo_premium: 12500, limo_luxury: 13500 },
  { id: 15, zone: 'The East of Thailand', distance: '220 km', destination: 'Bangkok - Rayong', std: 3200, exec: 3500, family: 3500, electric: 3500, limo_premium: 15000, limo_luxury: 16500 },
  { id: 16, zone: 'The East of Thailand', distance: '242 km', destination: 'Bangkok - Ban Phae Pier', std: 3500, exec: 3800, family: 3800, electric: 3800, limo_premium: 15300, limo_luxury: 16800 },
  { id: 17, zone: 'The East of Thailand', distance: '275 km', destination: 'Bangkok - Chanthaburi', std: 3800, exec: 4000, family: 4000, electric: 4000, limo_premium: null, limo_luxury: null },
  { id: 18, zone: 'The East of Thailand', distance: '300 km', destination: 'Bangkok - Aranyaprathet', std: 3900, exec: 4200, family: 4200, electric: 4200, limo_premium: null, limo_luxury: null },
  { id: 19, zone: 'The East of Thailand', distance: '300 km', destination: 'Bangkok - Sa Kaeo', std: 3900, exec: 4200, family: 4200, electric: 4200, limo_premium: null, limo_luxury: null },
  { id: 20, zone: 'The East of Thailand', distance: '400 km', destination: 'Bangkok - Trat', std: 5300, exec: 5500, family: 5500, electric: 5500, limo_premium: 22000, limo_luxury: 24000 },
  { id: 21, zone: 'The East of Thailand', distance: '420 km', destination: 'Bangkok - Hat Lek', std: 5800, exec: 6000, family: 6000, electric: 6000, limo_premium: null, limo_luxury: null },
  { id: 22, zone: 'The East of Thailand', distance: '450 km', destination: 'Bangkok - Koh Chang', std: 6000, exec: 6500, family: 6500, electric: 6500, limo_premium: null, limo_luxury: null },
  { id: 23, zone: 'The South of Thailand', distance: '99 km', destination: 'Bangkok - Samut Songkhram', std: 2400, exec: 2700, family: 2700, electric: 2700, limo_premium: null, limo_luxury: null },
  { id: 24, zone: 'The South of Thailand', distance: '200 km', destination: 'Bangkok - Cha-Am', std: 3300, exec: 3500, family: 3500, electric: 3500, limo_premium: 13000, limo_luxury: 15000 },
  { id: 25, zone: 'The South of Thailand', distance: '220 km', destination: 'Bangkok - Hua Hin', std: 3500, exec: 3800, family: 3800, electric: 3800, limo_premium: 13000, limo_luxury: 15000 },
  { id: 26, zone: 'The South of Thailand', distance: '245 km', destination: 'Bangkok - Pranburi', std: 3800, exec: 4100, family: 4100, electric: 4100, limo_premium: 15000, limo_luxury: 16500 },
  { id: 27, zone: 'The South of Thailand', distance: '300 km', destination: 'Bangkok - Kui Buri', std: 3900, exec: 4200, family: 4200, electric: 4200, limo_premium: null, limo_luxury: null },
  { id: 28, zone: 'The South of Thailand', distance: '265 km', destination: 'Bangkok - Sam Roi Yot', std: 3900, exec: 4200, family: 4200, electric: 4200, limo_premium: null, limo_luxury: null },
  { id: 29, zone: 'The South of Thailand', distance: '380 km', destination: 'Bangkok - Bang Saphan', std: 5300, exec: 5500, family: 5500, electric: 5500, limo_premium: 17000, limo_luxury: null },
  { id: 30, zone: 'The South of Thailand', distance: '500 km', destination: 'Bangkok - Chumphon', std: 6500, exec: 7200, family: 7200, electric: 7200, limo_premium: 25000, limo_luxury: null },
  { id: 31, zone: 'The South of Thailand', distance: '867 km', destination: 'Bangkok - Phuket', std: 12500, exec: 14500, family: 14500, electric: 14500, limo_premium: 40000, limo_luxury: null },
  { id: 32, zone: 'The South of Thailand', distance: '710 km', destination: 'Bangkok - Don Sak', std: 12500, exec: 15000, family: 15000, electric: 15000, limo_premium: null, limo_luxury: null },
  { id: 33, zone: 'The South of Thailand', distance: '644 km', destination: 'Bangkok - Surat Thani', std: 13000, exec: 15000, family: 15000, electric: 15000, limo_premium: null, limo_luxury: null },
  { id: 34, zone: 'The South of Thailand', distance: '946 km', destination: 'Bangkok - Krabi', std: 14500, exec: 15500, family: 15500, electric: 15500, limo_premium: null, limo_luxury: null },
  { id: 35, zone: 'The West of Thailand', distance: '165 km', destination: 'Bangkok - Ratchaburi', std: 2800, exec: 3100, family: 3100, electric: 3100, limo_premium: null, limo_luxury: null },
  { id: 36, zone: 'The West of Thailand', distance: '130 km', destination: 'Bangkok - Kanchanaburi', std: 3200, exec: 3500, family: 3500, electric: 3500, limo_premium: 11500, limo_luxury: 14000 },
  { id: 37, zone: 'The West of Thailand', distance: '235 km', destination: 'Bangkok - Sai Yok', std: 3900, exec: 4200, family: 4200, electric: 4200, limo_premium: null, limo_luxury: null },
  { id: 38, zone: 'The West of Thailand', distance: '380 km', destination: 'Bangkok - Sangkhla Buri', std: 6500, exec: 7200, family: 7200, electric: 7200, limo_premium: null, limo_luxury: null },
  { id: 39, zone: 'The North of Thailand', distance: '76 km', destination: 'Bangkok - Ayutthaya', std: 2300, exec: 2500, family: 2500, electric: 2500, limo_premium: 8750, limo_luxury: 10000 },
  { id: 40, zone: 'The North of Thailand', distance: '260 km', destination: 'Bangkok - Nakhon Sawan', std: 3800, exec: 4000, family: 4000, electric: 4000, limo_premium: null, limo_luxury: null },
  { id: 41, zone: 'The North of Thailand', distance: '350 km', destination: 'Bangkok - Phetchabun', std: null, exec: 7000, family: 7000, electric: 7000, limo_premium: null, limo_luxury: null },
  { id: 42, zone: 'The North of Thailand', distance: '400 km', destination: 'Bangkok - Phitsanulok', std: 6300, exec: 7000, family: 7000, electric: 7000, limo_premium: 17000, limo_luxury: null },
  { id: 43, zone: 'The North of Thailand', distance: '500 km', destination: 'Bangkok - Sukhothai', std: 7500, exec: 8000, family: 8000, electric: 8000, limo_premium: null, limo_luxury: null },
  { id: 44, zone: 'The North of Thailand', distance: '519 km', destination: 'Bangkok - Mae Sot - Tak', std: 7800, exec: 8200, family: 8200, electric: 8200, limo_premium: null, limo_luxury: null },
  { id: 45, zone: 'The North of Thailand', distance: '695 km', destination: 'Bangkok - Chiang Mai', std: 12500, exec: 15000, family: 15000, electric: 15000, limo_premium: 34000, limo_luxury: null },
  { id: 46, zone: 'The North of Thailand', distance: '820 km', destination: 'Bangkok - Chiang Rai', std: 14500, exec: 16500, family: 16500, electric: 16500, limo_premium: null, limo_luxury: null },
  { id: 47, zone: 'The Northeast of Thailand', distance: '107 km', destination: 'Bangkok - Saraburi', std: 2500, exec: 2800, family: 2800, electric: 2800, limo_premium: null, limo_luxury: null },
  { id: 48, zone: 'The Northeast of Thailand', distance: '165 km', destination: 'Bangkok - Khao Yai', std: 3500, exec: 3800, family: 3800, electric: 3800, limo_premium: 10500, limo_luxury: 15000 },
  { id: 49, zone: 'The Northeast of Thailand', distance: '246 km', destination: 'Bangkok - Wang Nam Khiao', std: 3800, exec: 4100, family: 4100, electric: 4100, limo_premium: null, limo_luxury: null },
  { id: 50, zone: 'The Northeast of Thailand', distance: '299 km', destination: 'Bangkok - Nakhon Ratchasima', std: 3800, exec: 4000, family: 4000, electric: 4000, limo_premium: 11500, limo_luxury: null },
  { id: 51, zone: 'Hourly', distance: '4 Hrs', destination: '04 Hours: Private Car Rental with Driver & Fuel (Max 250 Km.)', std: 2200, exec: 2600, family: 2600, electric: 2600, limo_premium: 7500, limo_luxury: 10000 },
  { id: 52, zone: 'Hourly', distance: '6 Hrs', destination: '06 Hours: Private Car Rental with Driver & Fuel (Max 300 Km.)', std: 3300, exec: 3900, family: 3900, electric: 3900, limo_premium: 9000, limo_luxury: 15000 },
  { id: 53, zone: 'Hourly', distance: '8 Hrs', destination: '08 Hours: Private Car Rental with Driver & Fuel (Max 350 Km.)', std: 4200, exec: 5000, family: 5000, electric: 5000, limo_premium: 12000, limo_luxury: 20000 },
  { id: 54, zone: 'Hourly', distance: '10 Hrs', destination: '10 Hours: Private Car Rental with Driver & Fuel (Max 400 Km.)', std: 5250, exec: 6250, family: 6250, electric: 6250, limo_premium: 15000, limo_luxury: 25000 },
  { id: 55, zone: 'Period', distance: '1 Day', destination: '01 Day: Private Car Rental with Driver & Fuel (Max 350 Km./Day)', std: 4200, exec: 5000, family: 5000, electric: 5000, limo_premium: 12000, limo_luxury: 20000 },
  { id: 56, zone: 'Period', distance: '7 Days', destination: '07 Day: Private Car Rental with Driver & Fuel (Max 350 Km./Day)', std: 25000, exec: 30000, family: 30000, electric: 30000, limo_premium: 84000, limo_luxury: 140000 },
  { id: 57, zone: 'Period', distance: '15 Days', destination: '15 Day: Private Car Rental with Driver & Fuel (Max 350 Km./Day)', std: 50000, exec: 60000, family: 60000, electric: 60000, limo_premium: 180000, limo_luxury: 300000 },
  { id: 58, zone: 'Period', distance: '30 Days', destination: '30 Day: Private Car Rental with Driver & Fuel (Max 350 Km./Day)', std: 85000, exec: 100000, family: 100000, electric: 100000, limo_premium: 350000, limo_luxury: 600000 },
]

const zones = ['All Zones', 'Airport Transfer', 'Central Region', 'The East of Thailand', 'The South of Thailand', 'The West of Thailand', 'The North of Thailand', 'The Northeast of Thailand', 'Hourly', 'Period']
const zoneColors = { 'Airport Transfer': 'bg-blue-100 text-blue-800', 'Central Region': 'bg-green-100 text-green-800', 'The East of Thailand': 'bg-orange-100 text-orange-800', 'The South of Thailand': 'bg-yellow-100 text-yellow-800', 'The West of Thailand': 'bg-purple-100 text-purple-800', 'The North of Thailand': 'bg-red-100 text-red-800', 'The Northeast of Thailand': 'bg-pink-100 text-pink-800', 'Hourly': 'bg-teal-100 text-teal-800', 'Period': 'bg-indigo-100 text-indigo-800' }
const fp = (v) => v ? `฿${v.toLocaleString()}` : <span className="text-gray-300">N/A</span>

const PAGE_SIZE = 15

export default function CarPricing() {
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

  const filtered = carRoutes.filter(r =>
    (zone === 'All Zones' || r.zone === zone) &&
    r.destination.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Car className="h-6 w-6 text-blue-600" /> Car & SUV Pricing</h1>
          <p className="text-sm text-gray-500 mt-1">Car & SUV price list all routes — Standard / Executive / Family / Electric / Limousine</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
          <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Export</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Routes', value: carRoutes.length, color: 'bg-blue-100 text-blue-600' },
          { label: 'Price Tiers', value: 6, color: 'bg-green-100 text-green-600' },
          { label: 'Zones', value: 9, color: 'bg-purple-100 text-purple-600' },
          { label: 'Limo Routes', value: carRoutes.filter(r => r.limo_premium).length, color: 'bg-orange-100 text-orange-600' },
        ].map((s, i) => (
          <Card key={i}><CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${s.color.split(' ')[0]}`}><Car className={`h-5 w-5 ${s.color.split(' ')[1]}`} /></div>
              <div><p className="text-xs text-gray-500">{s.label}</p><p className="text-2xl font-bold">{s.value}</p></div>
            </div>
          </CardContent></Card>
        ))}
      </div>

      {/* Filters */}
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

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Destination</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Zone</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Dist.</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Standard</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Executive</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Family</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Electric</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Limo Premium</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Limo Luxury</th>
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
                <td className="px-4 py-3 text-right font-medium">{fp(r.family)}</td>
                <td className="px-4 py-3 text-right font-medium">{fp(r.electric)}</td>
                <td className="px-4 py-3 text-right font-medium text-purple-700">{fp(r.limo_premium)}</td>
                <td className="px-4 py-3 text-right font-medium text-purple-700">{fp(r.limo_luxury)}</td>
                <td className="px-4 py-3 text-center">
                  <Button variant="ghost" size="sm" onClick={() => setEditRow(r)}><Edit className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} routes</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="px-3 py-1 border rounded text-sm">{page} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Edit Dialog */}
      {editRow && (
        <Dialog open={!!editRow} onOpenChange={() => setEditRow(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Edit Price — {editRow.destination}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="flex gap-2 text-sm text-gray-500">
                <Badge className={zoneColors[editRow.zone] || ''}>{editRow.zone}</Badge>
                <span>{editRow.distance}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[['Standard', editRow.std], ['Executive', editRow.exec], ['Family', editRow.family], ['Electric', editRow.electric], ['Limo Premium', editRow.limo_premium], ['Limo Luxury', editRow.limo_luxury]].map(([label, val]) => (
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
