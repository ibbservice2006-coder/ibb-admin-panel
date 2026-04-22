import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Percent, TrendingUp, DollarSign, Edit, Save, X, Info, ShieldAlert } from 'lucide-react'

// Data by SQL Schema: currency_margins
// base_margin_percentage BETWEEN 0.0400 AND 0.1800
// volatility_adjustment, liquidity_adjustment, risk_level (low/medium/high/very_high)
const marginData = [
  { code: 'USD', name: 'US Dollar',         flag: '🇺🇸', baseRate: 36.02,  baseMargin: 4.0, volatilityAdj: 0.0, liquidityAdj: 0.0, riskLevel: 'low' },
  { code: 'EUR', name: 'Euro',              flag: '🇪🇺', baseRate: 39.01,  baseMargin: 4.0, volatilityAdj: 0.0, liquidityAdj: 0.0, riskLevel: 'low' },
  { code: 'GBP', name: 'British Pound',     flag: '🇬🇧', baseRate: 45.50,  baseMargin: 4.0, volatilityAdj: 0.0, liquidityAdj: 0.0, riskLevel: 'low' },
  { code: 'SGD', name: 'Singapore Dollar',  flag: '🇸🇬', baseRate: 26.65,  baseMargin: 4.0, volatilityAdj: 0.0, liquidityAdj: 0.0, riskLevel: 'low' },
  { code: 'BND', name: 'Brunei Dollar',     flag: '🇧🇳', baseRate: 26.65,  baseMargin: 4.0, volatilityAdj: 0.0, liquidityAdj: 0.0, riskLevel: 'low' },
  { code: 'CNY', name: 'Chinese Yuan',      flag: '🇨🇳', baseRate: 4.97,   baseMargin: 4.0, volatilityAdj: 1.0, liquidityAdj: 0.0, riskLevel: 'medium' },
  { code: 'JPY', name: 'Japanese Yen',      flag: '🇯🇵', baseRate: 0.2375, baseMargin: 4.0, volatilityAdj: 1.0, liquidityAdj: 0.0, riskLevel: 'medium' },
  { code: 'AED', name: 'UAE Dirham',        flag: '🇦🇪', baseRate: 9.81,   baseMargin: 4.0, volatilityAdj: 1.0, liquidityAdj: 0.0, riskLevel: 'medium' },
  { code: 'SAR', name: 'Saudi Riyal',       flag: '🇸🇦', baseRate: 9.60,   baseMargin: 4.0, volatilityAdj: 1.0, liquidityAdj: 0.0, riskLevel: 'medium' },
  { code: 'OMR', name: 'Omani Rial',        flag: '🇴🇲', baseRate: 93.50,  baseMargin: 4.0, volatilityAdj: 1.0, liquidityAdj: 0.0, riskLevel: 'medium' },
  { code: 'INR', name: 'Indian Rupee',      flag: '🇮🇳', baseRate: 0.433,  baseMargin: 4.0, volatilityAdj: 2.0, liquidityAdj: 0.0, riskLevel: 'high' },
  { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩', baseRate: 0.0023, baseMargin: 4.0, volatilityAdj: 2.0, liquidityAdj: 0.0, riskLevel: 'high' },
  { code: 'RUB', name: 'Russian Ruble',     flag: '🇷🇺', baseRate: 0.391,  baseMargin: 4.0, volatilityAdj: 4.0, liquidityAdj: 0.0, riskLevel: 'very_high' },
]

const riskConfig = {
  low:       { label: 'Low',       color: 'text-green-700 bg-green-100 border-green-200' },
  medium:    { label: 'Medium',    color: 'text-blue-700 bg-blue-100 border-blue-200' },
  high:      { label: 'High',      color: 'text-orange-700 bg-orange-100 border-orange-200' },
  very_high: { label: 'Very High', color: 'text-red-700 bg-red-100 border-red-200' },
}

export default function CurrencyMargins() {
  const [data, setData] = useState(marginData)
  const [editRow, setEditRow] = useState(null)
  const [editVol, setEditVol] = useState('')
  const [editLiq, setEditLiq] = useState('')

  const totalMargin = (r) => r.baseMargin + r.volatilityAdj + r.liquidityAdj

  const saveEdit = (code) => {
    const vol = parseFloat(editVol) || 0
    const liq = parseFloat(editLiq) || 0
    const total = 4.0 + vol + liq
    // enforce 4%–18% constraint from Schema
    if (total < 4 || total > 18) {
      alert('Total margin must be between 4% and 18% (per Schema constraint)')
      return
    }
    setData(prev => prev.map(r => r.code === code
      ? { ...r, volatilityAdj: vol, liquidityAdj: liq }
      : r
    ))
    setEditRow(null)
  }

  const avgTotal = (data.reduce((s, r) => s + totalMargin(r), 0) / data.length).toFixed(2)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Currency Margins</h1>
          <p className="text-muted-foreground text-sm mt-1">Set Margin for Currency Conversion — Base 4% + Volatility/Liquidity Adjustment</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-700 space-y-1">
          <p className="font-medium">Dynamic Currency Margin System (4%–18%)</p>
          <p>Base margin = <strong>4%</strong> All currencies (per ibbservice.com) + Volatility & Liquidity Adjustments by risk</p>
          <p className="text-xs text-blue-600">Schema constraint: <code className="bg-blue-100 px-1 rounded">base_margin_percentage BETWEEN 0.0400 AND 0.1800</code> — Total margin must be between 4%–18%</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50"><Percent className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Base Margin (All)</p>
                <p className="text-2xl font-bold">4.0%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50"><TrendingUp className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Total Margin</p>
                <p className="text-2xl font-bold">{avgTotal}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-50"><ShieldAlert className="h-5 w-5 text-orange-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">High Risk Currencies</p>
                <p className="text-2xl font-bold">{data.filter(r => r.riskLevel === 'high' || r.riskLevel === 'very_high').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50"><DollarSign className="h-5 w-5 text-red-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Max Total Margin</p>
                <p className="text-2xl font-bold">{Math.max(...data.map(r => totalMargin(r))).toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Margin Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Margin Settings per Currency</CardTitle>
          <CardDescription>Base (4%) + Volatility Adj. + Liquidity Adj. = Total Effective Margin — Allowed range: 4%–18%</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Currency</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Base Rate</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Risk Level</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Base</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Volatility Adj.</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Liquidity Adj.</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground font-bold">Total Margin</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Effective Rate</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map(r => {
                  const total = totalMargin(r)
                  const effectiveRate = (r.baseRate * (1 + total / 100)).toFixed(r.baseRate < 1 ? 6 : 4)
                  const risk = riskConfig[r.riskLevel]
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
                      <td className="px-4 py-3 text-right font-mono text-sm">
                        {r.baseRate.toFixed(r.baseRate < 1 ? 5 : 4)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${risk.color}`}>
                          {risk.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-mono text-muted-foreground">4.0%</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {editRow === r.code ? (
                          <Input type="number" step="0.5" min="0" max="14" value={editVol}
                            onChange={e => setEditVol(e.target.value)}
                            className="w-20 h-7 text-center text-sm mx-auto" />
                        ) : (
                          <span className={`text-sm font-mono ${r.volatilityAdj > 0 ? 'text-orange-600 font-semibold' : 'text-muted-foreground'}`}>
                            {r.volatilityAdj > 0 ? `+${r.volatilityAdj.toFixed(1)}%` : '—'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {editRow === r.code ? (
                          <Input type="number" step="0.5" min="0" max="14" value={editLiq}
                            onChange={e => setEditLiq(e.target.value)}
                            className="w-20 h-7 text-center text-sm mx-auto" />
                        ) : (
                          <span className={`text-sm font-mono ${r.liquidityAdj > 0 ? 'text-purple-600 font-semibold' : 'text-muted-foreground'}`}>
                            {r.liquidityAdj > 0 ? `+${r.liquidityAdj.toFixed(1)}%` : '—'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          total <= 4   ? 'text-green-700 bg-green-100' :
                          total <= 5   ? 'text-blue-700 bg-blue-100' :
                          total <= 6   ? 'text-orange-700 bg-orange-100' :
                                         'text-red-700 bg-red-100'
                        }`}>
                          {total.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-sm">
                        {effectiveRate}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {editRow === r.code ? (
                          <div className="flex gap-1 justify-center">
                            <Button variant="ghost" size="sm" onClick={() => saveEdit(r.code)}><Save className="h-3.5 w-3.5 text-green-600" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => setEditRow(null)}><X className="h-3.5 w-3.5 text-red-500" /></Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => {
                            setEditRow(r.code)
                            setEditVol(r.volatilityAdj.toString())
                            setEditLiq(r.liquidityAdj.toString())
                          }}>
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
    </div>
  )
}
