import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RefreshCw, TrendingUp, TrendingDown, ArrowRightLeft, Clock, Edit, Save, X } from 'lucide-react'

const ratesData = [
  { code: 'USD', name: 'US Dollar',         flag: '🇺🇸', rate: 36.02, prev: 35.87, updated: '2026-03-24 08:00' },
  { code: 'EUR', name: 'Euro',              flag: '🇪🇺', rate: 39.01, prev: 39.45, updated: '2026-03-24 08:00' },
  { code: 'GBP', name: 'British Pound',     flag: '🇬🇧', rate: 45.50, prev: 45.12, updated: '2026-03-24 08:00' },
  { code: 'CNY', name: 'Chinese Yuan',      flag: '🇨🇳', rate: 4.97,  prev: 4.95,  updated: '2026-03-24 08:00' },
  { code: 'JPY', name: 'Japanese Yen',      flag: '🇯🇵', rate: 0.2375,prev: 0.2401,updated: '2026-03-24 08:00' },
  { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩', rate: 0.0023,prev: 0.0022,updated: '2026-03-24 08:00' },
  { code: 'SGD', name: 'Singapore Dollar',  flag: '🇸🇬', rate: 26.65, prev: 26.72, updated: '2026-03-24 08:00' },
  { code: 'BND', name: 'Brunei Dollar',     flag: '🇧🇳', rate: 26.65, prev: 26.72, updated: '2026-03-24 08:00' },
  { code: 'AED', name: 'UAE Dirham',        flag: '🇦🇪', rate: 9.81,  prev: 9.79,  updated: '2026-03-24 08:00' },
  { code: 'RUB', name: 'Russian Ruble',     flag: '🇷🇺', rate: 0.391, prev: 0.388, updated: '2026-03-24 08:00' },
  { code: 'SAR', name: 'Saudi Riyal',       flag: '🇸🇦', rate: 9.60,  prev: 9.58,  updated: '2026-03-24 08:00' },
  { code: 'OMR', name: 'Omani Rial',        flag: '🇴🇲', rate: 93.50, prev: 93.20, updated: '2026-03-24 08:00' },
  { code: 'INR', name: 'Indian Rupee',      flag: '🇮🇳', rate: 0.433, prev: 0.431, updated: '2026-03-24 08:00' },
]

export default function ExchangeRates() {
  const [rates, setRates] = useState(ratesData)
  const [editRow, setEditRow] = useState(null)
  const [editVal, setEditVal] = useState('')
  const [converterAmt, setConverterAmt] = useState('1000')
  const [converterFrom, setConverterFrom] = useState('THB')
  const [converterTo, setConverterTo] = useState('USD')
  const [lastSync, setLastSync] = useState('2026-03-24 08:00 GMT+7')

  const handleSync = () => {
    setLastSync(new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }))
  }

  const saveEdit = (code) => {
    setRates(prev => prev.map(r => r.code === code ? { ...r, prev: r.rate, rate: parseFloat(editVal) } : r))
    setEditRow(null)
  }

  const getConvertedAmount = () => {
    if (converterFrom === 'THB' && converterTo !== 'THB') {
      const r = rates.find(r => r.code === converterTo)
      return r ? (parseFloat(converterAmt) / r.rate).toFixed(4) : '-'
    } else if (converterTo === 'THB' && converterFrom !== 'THB') {
      const r = rates.find(r => r.code === converterFrom)
      return r ? (parseFloat(converterAmt) * r.rate).toFixed(2) : '-'
    } else if (converterFrom === converterTo) {
      return converterAmt
    }
    const fromRate = rates.find(r => r.code === converterFrom)?.rate || 1
    const toRate = rates.find(r => r.code === converterTo)?.rate || 1
    return ((parseFloat(converterAmt) * fromRate) / toRate).toFixed(4)
  }

  const allCurrencies = ['THB', ...rates.map(r => r.code)]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Exchange Rates</h1>
          <p className="text-muted-foreground text-sm mt-1">Exchange rate vs THB (Thai Baht)</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            Last sync: {lastSync}
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleSync}>
            <RefreshCw className="h-4 w-4" /> Sync Rates
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50"><TrendingUp className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Currencies Up</p>
                <p className="text-2xl font-bold">{rates.filter(r => r.rate > r.prev).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50"><TrendingDown className="h-5 w-5 text-red-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Currencies Down</p>
                <p className="text-2xl font-bold">{rates.filter(r => r.rate < r.prev).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50"><ArrowRightLeft className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Total Pairs</p>
                <p className="text-2xl font-bold">{rates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rate Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">THB Exchange Rates</CardTitle>
            <CardDescription>1 THB equals (selling rate)</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Currency</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Rate</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Change</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">1,000 THB</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rates.map(r => {
                    const change = ((r.rate - r.prev) / r.prev * 100).toFixed(2)
                    const up = r.rate >= r.prev
                    return (
                      <tr key={r.code} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{r.flag}</span>
                            <div>
                              <p className="font-mono font-bold text-blue-700">{r.code}</p>
                              <p className="text-xs text-muted-foreground">{r.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {editRow === r.code ? (
                            <Input type="number" step="0.0001" value={editVal}
                              onChange={e => setEditVal(e.target.value)}
                              className="w-28 h-7 text-right text-sm ml-auto" />
                          ) : (
                            <span className="font-mono font-semibold">{r.rate.toFixed(r.rate < 1 ? 5 : 4)}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`flex items-center justify-end gap-0.5 text-xs font-medium ${up ? 'text-green-600' : 'text-red-500'}`}>
                            {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {up ? '+' : ''}{change}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm text-muted-foreground">
                          {(1000 / r.rate).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {editRow === r.code ? (
                            <div className="flex gap-1 justify-center">
                              <Button variant="ghost" size="sm" onClick={() => saveEdit(r.code)}><Save className="h-3.5 w-3.5 text-green-600" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => setEditRow(null)}><X className="h-3.5 w-3.5 text-red-500" /></Button>
                            </div>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={() => { setEditRow(r.code); setEditVal(r.rate.toString()) }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Currency Converter */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-blue-500" />
              Currency Converter
            </CardTitle>
            <CardDescription>Calculate exchange rate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Amount</label>
              <Input type="number" value={converterAmt} onChange={e => setConverterAmt(e.target.value)} className="text-lg font-mono" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">From</label>
              <select value={converterFrom} onChange={e => setConverterFrom(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm bg-white">
                {allCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex justify-center">
              <button onClick={() => { setConverterFrom(converterTo); setConverterTo(converterFrom) }}
                className="p-2 rounded-full border hover:bg-muted/50 transition-colors">
                <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">To</label>
              <select value={converterTo} onChange={e => setConverterTo(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm bg-white">
                {allCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="bg-muted/40 rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">{converterAmt} {converterFrom} =</p>
              <p className="text-2xl font-bold text-blue-700">{getConvertedAmount()}</p>
              <p className="text-sm font-medium">{converterTo}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
