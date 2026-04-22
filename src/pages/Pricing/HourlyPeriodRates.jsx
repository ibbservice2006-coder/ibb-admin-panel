import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { RefreshCw, Edit, Clock, Calendar } from 'lucide-react'

const hourlyRates = {
  car: [
    { id: 1, pkg: '4 Hrs', maxKm: 250, std: 2000, exec: 2500, family: 2500, electric: 2500, premium: 7500, luxury: 10000 },
    { id: 2, pkg: '6 Hrs', maxKm: 300, std: 2500, exec: 3000, family: 3000, electric: 3000, premium: 10000, luxury: 15000 },
    { id: 3, pkg: '8 Hrs', maxKm: 350, std: 3000, exec: 3500, family: 3500, electric: 3500, premium: 12000, luxury: 20000 },
    { id: 4, pkg: '10 Hrs', maxKm: 400, std: 4000, exec: 4500, family: 4500, electric: 4500, premium: 15000, luxury: 25000 },
  ],
  van: [
    { id: 1, pkg: '4 Hrs', maxKm: 250, std: 3200, exec: 3400, premium: 7500, luxury: 10000 },
    { id: 2, pkg: '6 Hrs', maxKm: 300, std: 4600, exec: 4800, premium: 9000, luxury: 16000 },
    { id: 3, pkg: '8 Hrs', maxKm: 350, std: 5800, exec: 6000, premium: 12000, luxury: 20000 },
    { id: 4, pkg: '10 Hrs', maxKm: 400, std: 7300, exec: 7500, premium: 15000, luxury: 24000 },
  ],
  bus: [
    { id: 1, pkg: '4 Hrs', maxKm: 250, minibus: 12000, mid: 20000, group: 28000 },
    { id: 2, pkg: '6 Hrs', maxKm: 300, minibus: 18000, mid: 30000, group: 38000 },
    { id: 3, pkg: '8 Hrs', maxKm: 350, minibus: 21000, mid: 35000, group: 50000 },
    { id: 4, pkg: '10 Hrs', maxKm: 400, minibus: 27000, mid: 45000, group: 65000 },
  ],
}

const periodRates = {
  car: [
    { id: 1, pkg: '1 Day', maxKm: 350, std: 4200, exec: 5000, family: 5000, electric: 5000, premium: 8500, luxury: 15000 },
    { id: 2, pkg: '7 Days', maxKm: 350, std: 25000, exec: 30000, family: 30000, electric: 30000, premium: 64000, luxury: 140000 },
    { id: 3, pkg: '15 Days', maxKm: 350, std: 50000, exec: 60000, family: 60000, electric: 60000, premium: 130000, luxury: 280000 },
    { id: 4, pkg: '30 Days', maxKm: 350, std: 95000, exec: 115000, family: 115000, electric: 115000, premium: 250000, luxury: 600000 },
  ],
  van: [
    { id: 1, pkg: '1 Day', maxKm: 350, std: 5800, exec: 6000, premium: 12000, luxury: 20000 },
    { id: 2, pkg: '7 Days', maxKm: 350, std: 39800, exec: 40000, premium: 84000, luxury: null },
    { id: 3, pkg: '15 Days', maxKm: 350, std: 84800, exec: 85000, premium: 180000, luxury: null },
    { id: 4, pkg: '30 Days', maxKm: 350, std: 149800, exec: 150000, premium: 350000, luxury: null },
  ],
  bus: [
    { id: 1, pkg: '1 Day', maxKm: 350, minibus: 21000, mid: 35000, group: 50000 },
    { id: 2, pkg: '7 Days', maxKm: 350, minibus: null, mid: null, group: null },
    { id: 3, pkg: '15 Days', maxKm: 350, minibus: null, mid: null, group: null },
    { id: 4, pkg: '30 Days', maxKm: 350, minibus: null, mid: null, group: null },
  ],
}

const fp = (v) => v ? `฿${v.toLocaleString()}` : <span className="text-gray-300">N/A</span>

export default function HourlyPeriodRates() {
  const [tab, setTab] = useState('hourly')
  const [vehicle, setVehicle] = useState('car')
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

  const data = tab === 'hourly' ? hourlyRates[vehicle] : periodRates[vehicle]

  const carCols = ['std', 'exec', 'family', 'electric', 'premium', 'luxury']
  const carLabels = ['Standard', 'Executive', 'Family', 'Electric', 'Limo Premium', 'Limo Luxury']
  const vanCols = ['std', 'exec', 'premium', 'luxury']
  const vanLabels = ['Standard', 'Executive', 'Premium', 'Luxury']
  const busCols = ['minibus', 'mid', 'group']
  const busLabels = ['Minibus', 'Mid-sized', 'Group Bus']

  const cols = vehicle === 'car' ? carCols : vehicle === 'van' ? vanCols : busCols
  const labels = vehicle === 'car' ? carLabels : vehicle === 'van' ? vanLabels : busLabels

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hourly & Period Rates</h1>
          <p className="text-sm text-gray-500 mt-1">Hourly rental rates (4/6/8/10 Hrs) and period rates (1/7/15/30 days)</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
      </div>

      {/* Tab: Hourly / Period */}
      <div className="flex gap-2">
        <Button variant={tab === 'hourly' ? 'default' : 'outline'} size="sm" onClick={() => setTab('hourly')}>
          <Clock className="h-4 w-4 mr-2" />Hourly Rates
        </Button>
        <Button variant={tab === 'period' ? 'default' : 'outline'} size="sm" onClick={() => setTab('period')}>
          <Calendar className="h-4 w-4 mr-2" />Period Rates
        </Button>
      </div>

      {/* Vehicle Tab */}
      <div className="flex gap-2">
        {['car', 'van', 'bus'].map(v => (
          <button key={v} onClick={() => setVehicle(v)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${vehicle === v ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
            {v === 'car' ? '🚗 Car & SUV' : v === 'van' ? '🚐 MPV/Van' : '🚌 Bus/Coach'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Package</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Max KM</th>
              {labels.map(l => <th key={l} className="text-right px-4 py-3 font-medium text-gray-600">{l}</th>)}
              <th className="text-center px-4 py-3 font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">{r.pkg}</td>
                <td className="px-4 py-3 text-gray-500">{r.maxKm} km</td>
                {cols.map(c => <td key={c} className="px-4 py-3 text-right font-medium">{fp(r[c])}</td>)}
                <td className="px-4 py-3 text-center">
                  <Button variant="ghost" size="sm" onClick={() => setEditRow({ ...r, vehicle, tab })}><Edit className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editRow && (
        <Dialog open={!!editRow} onOpenChange={() => setEditRow(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Edit {editRow.pkg} — {editRow.vehicle.toUpperCase()}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><label className="text-xs text-gray-500 block mb-1">Max KM</label><Input type="number" defaultValue={editRow.maxKm} /></div>
              <div className="grid grid-cols-2 gap-3">
                {cols.map((c, i) => (
                  <div key={c}>
                    <label className="text-xs text-gray-500 block mb-1">{labels[i]}</label>
                    <Input type="number" defaultValue={editRow[c] || ''} placeholder="N/A" />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white flex-1" onClick={() => { toast({ title: 'Rate updated' }); setEditRow(null) }}>Save Changes</Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditRow(null)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
