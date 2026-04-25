import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Search, RefreshCw, Download, Edit, Car, ChevronLeft, ChevronRight } from 'lucide-react'

const BASE_API_URL = 'https://ibb-booking-api.ibbshuttleservice.com'; // Replace with your actual Cloudflare Worker URL



const zones = ['All Zones', 'Airport Transfer', 'Central Region', 'The East of Thailand', 'The South of Thailand', 'The West of Thailand', 'The North of Thailand', 'The Northeast of Thailand', 'Hourly', 'Period']
const zoneColors = { 'Airport Transfer': 'bg-blue-100 text-blue-800', 'Central Region': 'bg-green-100 text-green-800', 'The East of Thailand': 'bg-orange-100 text-orange-800', 'The South of Thailand': 'bg-yellow-100 text-yellow-800', 'The West of Thailand': 'bg-purple-100 text-purple-800', 'The North of Thailand': 'bg-red-100 text-red-800', 'The Northeast of Thailand': 'bg-pink-100 text-pink-800', 'Hourly': 'bg-teal-100 text-teal-800', 'Period': 'bg-indigo-100 text-indigo-800' }
const fp = (v) => v ? `฿${v.toLocaleString()}` : <span className="text-gray-300">N/A</span>

const PAGE_SIZE = 15

export default function CarPricing() {
  const [vehicleCategories, setVehicleCategories] = useState([]);
    const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicleCategories();
  }, []);

  const fetchVehicleCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_API_URL}/api/pricing`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_CLOUDFLARE_API_TOKEN || ''}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setVehicleCategories(data);
    } catch (error) {
      console.error("Error fetching vehicle categories:", error);
      toast({ title: 'Error', description: 'Failed to load pricing data.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const applyMarkup = (price) => {
    if (price === null) return null;
    return Math.round(price * 1.04);
  };
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

  const filtered = vehicleCategories.filter(r =>
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
          { label: 'Total Routes', value: vehicleCategories.length, color: 'bg-blue-100 text-blue-600' },
          { label: 'Price Tiers', value: 6, color: 'bg-green-100 text-green-600' },
          { label: 'Zones', value: 9, color: 'bg-purple-100 text-purple-600' },
          { label: 'Limo Routes', value: vehicleCategories.filter(r => r.limo_premium).length, color: 'bg-orange-100 text-orange-600' },
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
