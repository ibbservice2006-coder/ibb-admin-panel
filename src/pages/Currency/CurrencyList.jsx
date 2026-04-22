import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { RefreshCw, Search, Edit, ToggleLeft, ToggleRight, Globe, DollarSign, TrendingUp, CheckCircle } from 'lucide-react'

const currencies = [
  { code: 'THB', name: 'Thai Baht',           symbol: '฿',  flag: '🇹🇭', region: 'Southeast Asia', base: true,  active: true,  rate: 1.0000,    type: 'fiat' },
  { code: 'USD', name: 'US Dollar',            symbol: '$',  flag: '🇺🇸', region: 'Global',         base: false, active: true,  rate: 0.02778,   type: 'fiat' },
  { code: 'EUR', name: 'Euro',                 symbol: '€',  flag: '🇪🇺', region: 'Europe',         base: false, active: true,  rate: 0.02564,   type: 'fiat' },
  { code: 'GBP', name: 'British Pound',        symbol: '£',  flag: '🇬🇧', region: 'Europe',         base: false, active: true,  rate: 0.02198,   type: 'fiat' },
  { code: 'CNY', name: 'Chinese Yuan',         symbol: '¥',  flag: '🇨🇳', region: 'Asia',           base: false, active: true,  rate: 0.20134,   type: 'fiat' },
  { code: 'JPY', name: 'Japanese Yen',         symbol: '¥',  flag: '🇯🇵', region: 'Asia',           base: false, active: true,  rate: 4.21000,   type: 'fiat' },
  { code: 'IDR', name: 'Indonesian Rupiah',    symbol: 'Rp', flag: '🇮🇩', region: 'Southeast Asia', base: false, active: true,  rate: 435.6000,  type: 'fiat' },
  { code: 'SGD', name: 'Singapore Dollar',     symbol: 'S$', flag: '🇸🇬', region: 'Southeast Asia', base: false, active: true,  rate: 0.03752,   type: 'fiat' },
  { code: 'BND', name: 'Brunei Dollar',        symbol: 'B$', flag: '🇧🇳', region: 'Southeast Asia', base: false, active: true,  rate: 0.03752,   type: 'fiat' },
  { code: 'AED', name: 'UAE Dirham',           symbol: 'د.إ',flag: '🇦🇪', region: 'Middle East',    base: false, active: true,  rate: 0.10204,   type: 'fiat' },
  { code: 'RUB', name: 'Russian Ruble',        symbol: '₽',  flag: '🇷🇺', region: 'Europe/Asia',    base: false, active: true,  rate: 2.56000,   type: 'fiat' },
  { code: 'SAR', name: 'Saudi Riyal',          symbol: '﷼',  flag: '🇸🇦', region: 'Middle East',    base: false, active: true,  rate: 0.10417,   type: 'fiat' },
  { code: 'OMR', name: 'Omani Rial',           symbol: 'ر.ع',flag: '🇴🇲', region: 'Middle East',    base: false, active: true,  rate: 0.01070,   type: 'fiat' },
  { code: 'INR', name: 'Indian Rupee',         symbol: '₹',  flag: '🇮🇳', region: 'Asia',           base: false, active: true,  rate: 2.31000,   type: 'fiat' },
]

const regionColors = {
  'Southeast Asia': 'bg-blue-100 text-blue-700',
  'Global':         'bg-purple-100 text-purple-700',
  'Europe':         'bg-green-100 text-green-700',
  'Asia':           'bg-orange-100 text-orange-700',
  'Middle East':    'bg-yellow-100 text-yellow-700',
  'Europe/Asia':    'bg-pink-100 text-pink-700',
}

export default function CurrencyList() {
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast({ title: 'Refreshed', description: 'Latest data loaded' })
    }, 800)
  }
  const [search, setSearch] = useState('')
  const [regionFilter, setRegionFilter] = useState('all')
  const [currencies_, setCurrencies] = useState(currencies)
  const [editCurrency, setEditCurrency] = useState(null)

  const regions = ['all', ...Array.from(new Set(currencies.map(c => c.region)))]

  const filtered = currencies_.filter(c => {
    const matchSearch = c.code.toLowerCase().includes(search.toLowerCase()) ||
                        c.name.toLowerCase().includes(search.toLowerCase())
    const matchRegion = regionFilter === 'all' || c.region === regionFilter
    return matchSearch && matchRegion
  })

  const toggleActive = (code) => {
    setCurrencies(prev => prev.map(c => c.code === code && !c.base ? { ...c, active: !c.active } : c))
  }

  const stats = {
    total: currencies_.length,
    active: currencies_.filter(c => c.active).length,
    regions: new Set(currencies_.map(c => c.region)).size,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Currency List</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage supported currencies in IBB Shuttle system (14 currencies)</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50"><Globe className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Total Currencies</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50"><CheckCircle className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50"><TrendingUp className="h-5 w-5 text-purple-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Regions Covered</p>
                <p className="text-2xl font-bold">{stats.regions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search currency code or name..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {regions.map(r => (
            <button key={r} onClick={() => setRegionFilter(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${regionFilter === r ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
              {r === 'all' ? 'All Regions' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Currency Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Currency</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Code</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Symbol</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Region</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Rate (per THB)</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Base</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.code} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{c.flag}</span>
                        <span className="font-medium">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-blue-700">{c.code}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-gray-600">{c.symbol}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${regionColors[c.region] || 'bg-gray-100 text-gray-700'}`}>
                        {c.region}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm">
                      {c.base ? <span className="text-muted-foreground">Base Currency</span> : c.rate.toFixed(5)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {c.base && <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">Base</Badge>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleActive(c.code)} className="flex items-center gap-1 mx-auto">
                        {c.active
                          ? <><ToggleRight className="h-5 w-5 text-green-500" /><span className="text-xs text-green-600">Active</span></>
                          : <><ToggleLeft className="h-5 w-5 text-gray-400" /><span className="text-xs text-gray-400">Inactive</span></>
                        }
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button variant="ghost" size="sm" onClick={() => setEditCurrency(c)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editCurrency && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setEditCurrency(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">{editCurrency.flag} Edit {editCurrency.name}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Currency Code</label>
                <Input value={editCurrency.code} disabled className="mt-1 bg-muted/50" />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Currency Name</label>
                <Input value={editCurrency.name} className="mt-1"
                  onChange={e => setEditCurrency(prev => ({ ...prev, name: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Symbol</label>
                <Input value={editCurrency.symbol} className="mt-1"
                  onChange={e => setEditCurrency(prev => ({ ...prev, symbol: e.target.value }))} />
              </div>
              {!editCurrency.base && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Exchange Rate (per 1 THB)</label>
                  <Input type="number" step="0.00001" value={editCurrency.rate} className="mt-1"
                    onChange={e => setEditCurrency(prev => ({ ...prev, rate: parseFloat(e.target.value) }))} />
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-6 justify-end">
              <Button size="sm" variant="outline" onClick={() => setEditCurrency(null)}>Cancel</Button>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
                setCurrencies(prev => prev.map(c => c.code === editCurrency.code ? editCurrency : c))
                setEditCurrency(null)
              }}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
