import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Search, RefreshCw, Download, MapPin, DollarSign, Car, Bus, TrendingUp } from 'lucide-react'

const zones = [
  { id: 1, name: 'Airport Transfer', code: 'APT', routes: 3, color: 'bg-blue-100 text-blue-800', description: 'Don Mueang / Suvarnabhumi / Utapao', carMin: 1100, carMax: 16500, vanMin: 1400, vanMax: 15000, busMin: 6000, busMax: 28000 },
  { id: 2, name: 'Central Region', code: 'CTR', routes: 6, color: 'bg-green-100 text-green-800', description: 'Nonthaburi / Pathum Thani / Samut Prakan / Samut Sakhon / Nakhon Pathom / Chachoengsao', carMin: 1100, carMax: 10900, vanMin: 1400, vanMax: 12300, busMin: 12000, busMax: 23000 },
  { id: 3, name: 'The East of Thailand', code: 'EST', routes: 13, color: 'bg-orange-100 text-orange-800', description: 'Pattaya / Rayong / Chanthaburi / Trat / Koh Chang', carMin: 2100, carMax: 24000, vanMin: 2600, vanMax: 30000, busMin: 12000, busMax: 33000 },
  { id: 4, name: 'The South of Thailand', code: 'STH', routes: 12, color: 'bg-yellow-100 text-yellow-800', description: 'Hua Hin / Chumphon / Phuket / Surat Thani / Krabi', carMin: 2400, carMax: 15500, vanMin: 2600, vanMax: 40000, busMin: 12000, busMax: 75000 },
  { id: 5, name: 'The West of Thailand', code: 'WST', routes: 4, color: 'bg-purple-100 text-purple-800', description: 'Ratchaburi / Kanchanaburi / Sai Yok / Sangkhla Buri', carMin: 2800, carMax: 14000, vanMin: 3600, vanMax: 22000, busMin: null, busMax: null },
  { id: 6, name: 'The North of Thailand', code: 'NTH', routes: 8, color: 'bg-red-100 text-red-800', description: 'Ayutthaya / Nakhon Sawan / Phitsanulok / Chiang Mai / Chiang Rai', carMin: 2300, carMax: 16500, vanMin: 2900, vanMax: 52000, busMin: 14000, busMax: 75000 },
  { id: 7, name: 'The Northeast of Thailand', code: 'NET', routes: 4, color: 'bg-pink-100 text-pink-800', description: 'Saraburi / Khao Yai / Wang Nam Khiao / Nakhon Ratchasima', carMin: 2500, carMax: 15000, vanMin: 3300, vanMax: 28000, busMin: 14000, busMax: 40000 },
  { id: 8, name: 'Hourly Package', code: 'HRL', routes: 4, color: 'bg-teal-100 text-teal-800', description: '4 / 6 / 8 / 10 Hours with Driver & Fuel', carMin: 2200, carMax: 25000, vanMin: 3200, vanMax: 24000, busMin: null, busMax: null },
  { id: 9, name: 'Period Package', code: 'PRD', routes: 4, color: 'bg-indigo-100 text-indigo-800', description: '1 / 7 / 15 / 30 Days with Driver & Fuel', carMin: 4200, carMax: 600000, vanMin: 5800, vanMax: 350000, busMin: null, busMax: null },
]

const formatPrice = (val) => val ? `฿${val.toLocaleString()}` : 'N/A'

export default function ZonePricing() {
  const [search, setSearch] = useState('')
  const [selectedZone, setSelectedZone] = useState(null)
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

  const filtered = zones.filter(z =>
    z.name.toLowerCase().includes(search.toLowerCase()) ||
    z.code.toLowerCase().includes(search.toLowerCase()) ||
    z.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Zone Pricing</h1>
          <p className="text-sm text-gray-500 mt-1">Price overview by all zones</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg"><MapPin className="h-5 w-5 text-blue-600" /></div>
              <div><p className="text-sm text-gray-500">Total Zones</p><p className="text-2xl font-bold">9</p></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg"><TrendingUp className="h-5 w-5 text-green-600" /></div>
              <div><p className="text-sm text-gray-500">Total Routes</p><p className="text-2xl font-bold">58</p></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg"><Car className="h-5 w-5 text-purple-600" /></div>
              <div><p className="text-sm text-gray-500">Vehicle Types</p><p className="text-2xl font-bold">3</p></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg"><DollarSign className="h-5 w-5 text-orange-600" /></div>
              <div><p className="text-sm text-gray-500">Price Tiers</p><p className="text-2xl font-bold">9</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search zones..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Zone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(zone => (
          <Card key={zone.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedZone(zone)}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{zone.name}</CardTitle>
                  <p className="text-xs text-gray-500 mt-1">{zone.description}</p>
                </div>
                <Badge className={zone.color}>{zone.code}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-1"><MapPin className="h-3 w-3" /> Routes</span>
                  <span className="font-semibold">{zone.routes} routes</span>
                </div>
                <div className="border-t pt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 flex items-center gap-1"><Car className="h-3 w-3" /> Car</span>
                    <span>{formatPrice(zone.carMin)} – {formatPrice(zone.carMax)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 flex items-center gap-1"><Car className="h-3 w-3" /> Van</span>
                    <span>{formatPrice(zone.vanMin)} – {formatPrice(zone.vanMax)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 flex items-center gap-1"><Bus className="h-3 w-3" /> Bus</span>
                    <span>{zone.busMin ? `${formatPrice(zone.busMin)} – ${formatPrice(zone.busMax)}` : 'N/A'}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => toast({ title: 'View Details', description: 'Loading details...' })}>View Details</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Dialog */}
      {selectedZone && (
        <Dialog open={!!selectedZone} onOpenChange={() => setSelectedZone(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Badge className={selectedZone.color}>{selectedZone.code}</Badge>
                {selectedZone.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">{selectedZone.description}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Total Routes</p>
                  <p className="text-xl font-bold">{selectedZone.routes}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Zone Code</p>
                  <p className="text-xl font-bold">{selectedZone.code}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold">Price Range by Vehicle</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span className="text-sm flex items-center gap-2"><Car className="h-4 w-4 text-blue-600" /> Car & SUV</span>
                    <span className="text-sm font-medium">{formatPrice(selectedZone.carMin)} – {formatPrice(selectedZone.carMax)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm flex items-center gap-2"><Car className="h-4 w-4 text-green-600" /> MPV / Van</span>
                    <span className="text-sm font-medium">{formatPrice(selectedZone.vanMin)} – {formatPrice(selectedZone.vanMax)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                    <span className="text-sm flex items-center gap-2"><Bus className="h-4 w-4 text-orange-600" /> Bus / Coach</span>
                    <span className="text-sm font-medium">{selectedZone.busMin ? `${formatPrice(selectedZone.busMin)} – ${formatPrice(selectedZone.busMax)}` : 'Not Available'}</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
