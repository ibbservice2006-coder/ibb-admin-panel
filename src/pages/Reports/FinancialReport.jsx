import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { Download, DollarSign, TrendingUp, TrendingDown, CreditCard, AlertCircle, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const pnlData = [
  { month: 'Oct', revenue: 1820000, costs: 1248000, gross: 572000, net: 382000 },
  { month: 'Nov', revenue: 2150000, costs: 1462000, gross: 688000, net: 458000 },
  { month: 'Dec', revenue: 3240000, costs: 2138000, gross: 1102000, net: 742000 },
  { month: 'Jan', revenue: 2480000, costs: 1686000, gross: 794000, net: 528000 },
  { month: 'Feb', revenue: 2760000, costs: 1862000, gross: 898000, net: 598000 },
  { month: 'Mar', revenue: 3120000, costs: 2090000, gross: 1030000, net: 688000 },
]

const costBreakdown = [
  { name: 'Driver Earnings', value: 3676000, pct: 35.8, color: '#6366f1' },
  { name: 'Fuel', value: 2353200, pct: 22.9, color: '#f59e0b' },
  { name: 'Maintenance', value: 1197600, pct: 11.7, color: '#ef4444' },
  { name: 'Platform Fees', value: 924000, pct: 9.0, color: '#f97316' },
  { name: 'Insurance', value: 616800, pct: 6.0, color: '#8b5cf6' },
  { name: 'Admin & Ops', value: 1518400, pct: 14.8, color: '#94a3b8' },
]

const paymentMethodRevenue = [
  { method: 'Bank Transfer (THB)', revenue: 5840000, txns: 2420, color: '#3b82f6' },
  { method: 'Credit/Debit Card', revenue: 3210000, txns: 1340, color: '#6366f1' },
  { method: 'Shopee Pay', revenue: 1480000, txns: 620, color: '#f97316' },
  { method: 'Alipay / WeChat Pay', revenue: 1320000, txns: 480, color: '#10b981' },
  { method: 'Wallet Balance', revenue: 980000, txns: 410, color: '#8b5cf6' },
  { method: 'Crypto (VVIP)', revenue: 420000, txns: 42, color: '#f59e0b' },
  { method: 'Others', revenue: 200000, txns: 88, color: '#94a3b8' },
]

const refundData = [
  { month: 'Oct', refunds: 42000, count: 18 },
  { month: 'Nov', refunds: 38500, count: 15 },
  { month: 'Dec', refunds: 58200, count: 24 },
  { month: 'Jan', refunds: 44800, count: 19 },
  { month: 'Feb', refunds: 36200, count: 14 },
  { month: 'Mar', refunds: 32400, count: 12 },
]

const currencyMarginRevenue = [
  { currency: 'USD', margin: 5.5, revenue: 134750 },
  { currency: 'EUR', margin: 6.0, revenue: 53400 },
  { currency: 'CNY', margin: 7.0, revenue: 92400 },
  { currency: 'RUB', margin: 12.0, revenue: 48000 },
  { currency: 'AED', margin: 8.0, revenue: 38400 },
  { currency: 'Others', margin: 9.2, revenue: 87400 },
]

export default function FinancialReport() {
  const [period, setPeriod] = useState('6m')
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

  const totalRevenue = pnlData.reduce((a, m) => a + m.revenue, 0)
  const totalNet = pnlData.reduce((a, m) => a + m.net, 0)
  const netMargin = (totalNet / totalRevenue * 100).toFixed(1)
  const totalRefunds = refundData.reduce((a, m) => a + m.refunds, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-200">
            <DollarSign className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Financial Report</h1>
            <p className="text-muted-foreground text-sm mt-0.5">P&L, Cost, Payments, and Currency Margin Revenue</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['1m', '3m', '6m', '1y'].map(p => (
            <Button key={p} size="sm" variant={period === p ? 'default' : 'outline'}
              onClick={() => setPeriod(p)} className="text-xs h-7">{p.toUpperCase()}</Button>
          ))}
          <Button size="sm" variant="outline" onClick={handleExport} className="gap-1.5 ml-2">
            <Download className="h-3.5 w-3.5" />Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue (6M)', value: `฿${(totalRevenue / 1000000).toFixed(1)}M`, sub: 'All channels', color: 'text-emerald-700', bg: 'bg-emerald-50', icon: TrendingUp },
          { label: 'Net Profit (6M)', value: `฿${(totalNet / 1000000).toFixed(2)}M`, sub: `Margin: ${netMargin}%`, color: 'text-green-700', bg: 'bg-green-50', icon: DollarSign },
          { label: 'Total Refunds (6M)', value: `฿${(totalRefunds / 1000).toFixed(0)}K`, sub: '102 cases', color: 'text-red-700', bg: 'bg-red-50', icon: TrendingDown },
          { label: 'FX Margin Revenue', value: '฿454K', sub: 'From 14 currencies', color: 'text-blue-700', bg: 'bg-blue-50', icon: CreditCard },
        ].map(s => (
          <Card key={s.label} className={`${s.bg} border-0`}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
                </div>
                <s.icon className={`h-6 w-6 ${s.color} opacity-60`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* P&L Chart */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base">Profit & Loss Statement (6 months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={pnlData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `฿${(v / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(v) => `฿${v.toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="costs" name="Total Costs" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="net" name="Net Profit" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Breakdown */}
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base">Cost Breakdown (6M)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="45%" height={180}>
                <PieChart>
                  <Pie data={costBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value">
                    {costBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `฿${(v / 1000000).toFixed(2)}M`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {costBreakdown.map(c => (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="font-medium">{c.name}</span>
                    </div>
                    <span className="text-muted-foreground">{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Refund Trend */}
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />Refund Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={refundData}>
                <defs>
                  <linearGradient id="refundGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `฿${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v, n) => n === 'refunds' ? `฿${v.toLocaleString()}` : v} />
                <Area type="monotone" dataKey="refunds" name="Refund Amount" stroke="#ef4444" fill="url(#refundGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-2">Refund rate improving: 2.3% → 1.0% (Oct → Mar)</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method Revenue */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-blue-500" />Revenue by Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="text-left py-2 font-medium">Payment Method</th>
                <th className="text-right py-2 font-medium">Revenue</th>
                <th className="text-right py-2 font-medium">Transactions</th>
                <th className="text-right py-2 font-medium">Avg/Txn</th>
                <th className="text-left py-2 font-medium pl-4">Share</th>
              </tr>
            </thead>
            <tbody>
              {paymentMethodRevenue.map(p => {
                const total = paymentMethodRevenue.reduce((a, x) => a + x.revenue, 0)
                const pct = (p.revenue / total * 100).toFixed(1)
                return (
                  <tr key={p.method} className="border-b hover:bg-gray-50">
                    <td className="py-2.5 text-xs font-medium">{p.method}</td>
                    <td className="py-2.5 text-right text-xs font-bold text-green-700">฿{(p.revenue / 1000000).toFixed(2)}M</td>
                    <td className="py-2.5 text-right text-xs">{p.txns.toLocaleString()}</td>
                    <td className="py-2.5 text-right text-xs">฿{Math.round(p.revenue / p.txns).toLocaleString()}</td>
                    <td className="py-2.5 pl-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: p.color }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Currency Margin Revenue */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base">Currency Exchange Margin Revenue (6M)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {currencyMarginRevenue.map(c => (
              <div key={c.currency} className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold">{c.currency}</span>
                  <Badge className="text-xs bg-blue-100 text-blue-700">{c.margin}% margin</Badge>
                </div>
                <p className="text-lg font-bold text-green-700">฿{c.revenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Margin revenue</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
            Total FX Margin Revenue: <span className="font-bold text-green-700">฿454,350</span> — 
            Base margin 4% + Volatility adjustment (0-14%) per currency
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
