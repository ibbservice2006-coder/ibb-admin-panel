import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, TrendingDown, Calendar, Filter, Download } from 'lucide-react'

const historyData = {
  USD: [
    { date: '03/18', rate: 35.72 }, { date: '03/19', rate: 35.80 }, { date: '03/20', rate: 35.87 },
    { date: '03/21', rate: 35.95 }, { date: '03/22', rate: 35.90 }, { date: '03/23', rate: 35.87 },
    { date: '03/24', rate: 36.02 },
  ],
  EUR: [
    { date: '03/18', rate: 39.55 }, { date: '03/19', rate: 39.40 }, { date: '03/20', rate: 39.45 },
    { date: '03/21', rate: 39.30 }, { date: '03/22', rate: 39.20 }, { date: '03/23', rate: 39.45 },
    { date: '03/24', rate: 39.01 },
  ],
  GBP: [
    { date: '03/18', rate: 45.00 }, { date: '03/19', rate: 45.10 }, { date: '03/20', rate: 45.12 },
    { date: '03/21', rate: 45.30 }, { date: '03/22', rate: 45.25 }, { date: '03/23', rate: 45.12 },
    { date: '03/24', rate: 45.50 },
  ],
  SGD: [
    { date: '03/18', rate: 26.80 }, { date: '03/19', rate: 26.75 }, { date: '03/20', rate: 26.72 },
    { date: '03/21', rate: 26.68 }, { date: '03/22', rate: 26.70 }, { date: '03/23', rate: 26.72 },
    { date: '03/24', rate: 26.65 },
  ],
}

const allLogs = [
  { id: 1, date: '2026-03-24 08:00', code: 'USD', flag: '🇺🇸', prev: 35.87, curr: 36.02, change: +0.15, source: 'Auto Sync' },
  { id: 2, date: '2026-03-24 08:00', code: 'EUR', flag: '🇪🇺', prev: 39.45, curr: 39.01, change: -0.44, source: 'Auto Sync' },
  { id: 3, date: '2026-03-24 08:00', code: 'GBP', flag: '🇬🇧', prev: 45.12, curr: 45.50, change: +0.38, source: 'Auto Sync' },
  { id: 4, date: '2026-03-23 08:00', code: 'USD', flag: '🇺🇸', prev: 35.95, curr: 35.87, change: -0.08, source: 'Auto Sync' },
  { id: 5, date: '2026-03-23 08:00', code: 'CNY', flag: '🇨🇳', prev: 4.95,  curr: 4.97,  change: +0.02, source: 'Auto Sync' },
  { id: 6, date: '2026-03-22 08:00', code: 'JPY', flag: '🇯🇵', prev: 0.2401,curr: 0.2375,change: -0.0026, source: 'Auto Sync' },
  { id: 7, date: '2026-03-22 08:00', code: 'SGD', flag: '🇸🇬', prev: 26.70, curr: 26.72, change: +0.02, source: 'Auto Sync' },
  { id: 8, date: '2026-03-21 14:30', code: 'RUB', flag: '🇷🇺', prev: 0.385, curr: 0.391, change: +0.006, source: 'Manual' },
  { id: 9, date: '2026-03-21 08:00', code: 'AED', flag: '🇦🇪', prev: 9.79,  curr: 9.81,  change: +0.02, source: 'Auto Sync' },
  { id: 10,date: '2026-03-20 08:00', code: 'INR', flag: '🇮🇳', prev: 0.431, curr: 0.433, change: +0.002, source: 'Auto Sync' },
]

const CHART_COLORS = { USD: '#6366f1', EUR: '#10b981', GBP: '#f59e0b', SGD: '#ef4444' }

export default function RateHistory() {
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
  const [selectedCurrencies, setSelectedCurrencies] = useState(['USD', 'EUR'])
  const [filterCode, setFilterCode] = useState('all')
  const [filterSource, setFilterSource] = useState('all')

  const toggleCurrency = (code) => {
    setSelectedCurrencies(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    )
  }

  // Merge chart data
  const chartData = historyData.USD.map((d, i) => {
    const row = { date: d.date }
    selectedCurrencies.forEach(code => {
      if (historyData[code]) row[code] = historyData[code][i]?.rate
    })
    return row
  })

  const filteredLogs = allLogs.filter(l => {
    const matchCode = filterCode === 'all' || l.code === filterCode
    const matchSource = filterSource === 'all' || l.source === filterSource
    return matchCode && matchSource
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rate History</h1>
          <p className="text-muted-foreground text-sm mt-1">Last 7 days exchange rate history</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Chart Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Exchange Rate Trend (7 Days)</CardTitle>
              <CardDescription>Exchange rate THB → Foreign Currency</CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
              {Object.keys(historyData).map(code => (
                <button key={code} onClick={() => toggleCurrency(code)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${selectedCurrencies.includes(code) ? 'text-white border-transparent' : 'bg-white text-gray-500 border-gray-300'}`}
                  style={selectedCurrencies.includes(code) ? { backgroundColor: CHART_COLORS[code] } : {}}>
                  {code}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(val, name) => [`${val?.toFixed(4)}`, name]} />
              <Legend />
              {selectedCurrencies.map(code => historyData[code] && (
                <Line key={code} type="monotone" dataKey={code} stroke={CHART_COLORS[code]}
                  strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Change Log */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Change Log</CardTitle>
              <CardDescription>Exchange Rate Changes All</CardDescription>
            </div>
            <div className="flex gap-2">
              <select value={filterCode} onChange={e => setFilterCode(e.target.value)}
                className="border rounded-md px-2 py-1.5 text-xs bg-white">
                <option value="all">All Currencies</option>
                {[...new Set(allLogs.map(l => l.code))].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={filterSource} onChange={e => setFilterSource(e.target.value)}
                className="border rounded-md px-2 py-1.5 text-xs bg-white">
                <option value="all">All Sources</option>
                <option value="Auto Sync">Auto Sync</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date/Time</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Currency</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Previous</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">New Rate</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Change</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Source</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(l => (
                  <tr key={l.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{l.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span>{l.flag}</span>
                        <span className="font-mono font-bold text-blue-700">{l.code}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-muted-foreground">{l.prev.toFixed(4)}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">{l.curr.toFixed(4)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`flex items-center justify-end gap-0.5 text-xs font-medium ${l.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {l.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {l.change >= 0 ? '+' : ''}{l.change.toFixed(4)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={l.source === 'Manual' ? 'outline' : 'secondary'} className="text-xs">
                        {l.source}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
