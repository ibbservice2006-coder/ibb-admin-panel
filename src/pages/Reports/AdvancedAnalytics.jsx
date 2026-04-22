import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { Brain, TrendingUp, Target, Zap, AlertTriangle, CheckCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const demandForecast = [
  { month: 'Oct', actual: 522, forecast: null, lower: null, upper: null },
  { month: 'Nov', actual: 588, forecast: null, lower: null, upper: null },
  { month: 'Dec', actual: 725, forecast: null, lower: null, upper: null },
  { month: 'Jan', actual: 643, forecast: null, lower: null, upper: null },
  { month: 'Feb', actual: 690, forecast: null, lower: null, upper: null },
  { month: 'Mar', actual: 766, forecast: 766, lower: 740, upper: 792 },
  { month: 'Apr', actual: null, forecast: 820, lower: 780, upper: 860 },
  { month: 'May', actual: null, forecast: 880, lower: 830, upper: 930 },
  { month: 'Jun', actual: null, forecast: 950, lower: 890, upper: 1010 },
]

const churnRisk = [
  { segment: 'VVIP', total: 156, atRisk: 8, churnRate: 5.1, ltv: 48000 },
  { segment: 'VIP', total: 842, atRisk: 62, churnRate: 7.4, ltv: 18500 },
  { segment: 'General', total: 3420, atRisk: 412, churnRate: 12.0, ltv: 4200 },
  { segment: 'Business Partner', total: 48, atRisk: 3, churnRate: 6.3, ltv: 125000 },
]

const kpiSummary = [
  { kpi: 'Revenue Growth (MoM)', value: '+13.0%', trend: 'up', status: 'good', target: '+10%' },
  { kpi: 'Booking Completion Rate', value: '95.8%', trend: 'up', status: 'good', target: '95%' },
  { kpi: 'Customer Retention', value: '75.2%', trend: 'up', status: 'good', target: '70%' },
  { kpi: 'Driver On-Time Rate', value: '95.8%', trend: 'up', status: 'good', target: '93%' },
  { kpi: 'Fleet Utilization', value: '77.9%', trend: 'up', status: 'warning', target: '85%' },
  { kpi: 'Avg Booking Value', value: '฿4,073', trend: 'up', status: 'good', target: '฿3,800' },
  { kpi: 'Net Profit Margin', value: '22.1%', trend: 'up', status: 'good', target: '20%' },
  { kpi: 'Refund Rate', value: '1.0%', trend: 'down', status: 'good', target: '<2%' },
]

const platformROI = [
  { platform: 'Shopee', investment: 180000, revenue: 1480000, roi: 722, color: '#f97316' },
  { platform: 'Lazada', investment: 120000, revenue: 960000, roi: 700, color: '#3b82f6' },
  { platform: 'LINE OA', investment: 45000, revenue: 380000, roi: 744, color: '#10b981' },
  { platform: 'Google Ads', investment: 95000, revenue: 640000, roi: 574, color: '#6366f1' },
  { platform: 'Facebook', investment: 72000, revenue: 420000, roi: 483, color: '#8b5cf6' },
]

const cohortRetention = [
  { cohort: 'Oct 2025', m0: 100, m1: 68, m2: 55, m3: 48, m4: 44, m5: 42 },
  { cohort: 'Nov 2025', m0: 100, m1: 70, m2: 57, m3: 50, m4: 46, m5: null },
  { cohort: 'Dec 2025', m0: 100, m1: 72, m2: 59, m3: 52, m4: null, m5: null },
  { cohort: 'Jan 2026', m0: 100, m1: 73, m2: 61, m3: null, m4: null, m5: null },
  { cohort: 'Feb 2026', m0: 100, m1: 75, m2: null, m3: null, m4: null, m5: null },
  { cohort: 'Mar 2026', m0: 100, m1: null, m2: null, m3: null, m4: null, m5: null },
]

const insights = [
  { type: 'opportunity', icon: ArrowUpRight, color: 'text-green-600', bg: 'bg-green-50', title: 'Peak Season Approaching', desc: 'Songkran (Apr 13-15) — Booking up 45% YoY, increase vehicles & drivers in advance' },
  { type: 'opportunity', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', title: 'Chinese Market Growing', desc: 'Chinese customers up 28% MoM — add Alipay/WeChat Pay & Chinese content' },
  { type: 'warning', icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50', title: 'Fleet Utilization Below Target', desc: 'Utilization 77.9% below 85% target — consider reducing fleet or increasing marketing' },
  { type: 'warning', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', title: 'VIP Churn Risk', desc: '62 VIP members at churn risk — send retention offer urgently' },
  { type: 'success', icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-50', title: 'Refund Rate Improving', desc: 'Refund rate dropped from 2.3% → 1.0% in 6 months — due to improved driver training' },
]

const getRetentionColor = (val) => {
  if (val === null) return 'bg-gray-100 text-gray-400'
  if (val >= 70) return 'bg-green-500 text-white'
  if (val >= 55) return 'bg-green-300 text-white'
  if (val >= 45) return 'bg-yellow-300 text-gray-800'
  return 'bg-red-200 text-gray-800'
}

export default function AdvancedAnalytics() {
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast({ title: 'Refreshed', description: 'Latest data loaded' })
    }, 800)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-100 border border-violet-200">
            <Brain className="h-6 w-6 text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Advanced Analytics</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Business Intelligence, Forecasting & Predictive Insights</p>
          </div>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white gap-1.5"  onClick={handleRefresh}>
          <Zap className="h-3.5 w-3.5" />Run Analysis
        </Button>
      </div>

      {/* KPI Dashboard */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-indigo-500" />KPI Performance Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {kpiSummary.map(k => (
              <div key={k.kpi} className={`rounded-lg p-3 border ${k.status === 'good' ? 'bg-green-50 border-green-100' : 'bg-yellow-50 border-yellow-100'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-lg font-bold ${k.status === 'good' ? 'text-green-700' : 'text-yellow-700'}`}>{k.value}</span>
                  {k.trend === 'up'
                    ? <ArrowUpRight className="h-4 w-4 text-green-600" />
                    : <ArrowDownRight className="h-4 w-4 text-green-600" />}
                </div>
                <p className="text-xs font-medium text-gray-700">{k.kpi}</p>
                <p className="text-xs text-muted-foreground">Target: {k.target}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Demand Forecast */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-4 w-4 text-violet-500" />Demand Forecast — ML Prediction (Apr–Jun 2026)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={demandForecast}>
              <defs>
                <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine x="Mar" stroke="#94a3b8" strokeDasharray="4 4" label={{ value: 'Forecast Start', position: 'top', fontSize: 10 }} />
              <Area type="monotone" dataKey="upper" name="Upper Bound" stroke="none" fill="#8b5cf620" />
              <Area type="monotone" dataKey="lower" name="Lower Bound" stroke="none" fill="#fff" />
              <Line type="monotone" dataKey="actual" name="Actual Bookings" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} connectNulls={false} />
              <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 4 }} connectNulls={false} />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-1">Shaded area = 95% confidence interval — Model accuracy: 94.2%</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Churn Risk Analysis */}
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />Customer Churn Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="text-left py-2 font-medium">Segment</th>
                  <th className="text-right py-2 font-medium">Total</th>
                  <th className="text-right py-2 font-medium">At Risk</th>
                  <th className="text-right py-2 font-medium">Churn Rate</th>
                  <th className="text-right py-2 font-medium">Avg LTV</th>
                </tr>
              </thead>
              <tbody>
                {churnRisk.map(c => (
                  <tr key={c.segment} className="border-b hover:bg-gray-50">
                    <td className="py-2.5 text-xs font-medium">{c.segment}</td>
                    <td className="py-2.5 text-right text-xs">{c.total.toLocaleString()}</td>
                    <td className="py-2.5 text-right">
                      <Badge className="text-xs bg-red-100 text-red-700">{c.atRisk}</Badge>
                    </td>
                    <td className="py-2.5 text-right text-xs font-medium text-red-600">{c.churnRate}%</td>
                    <td className="py-2.5 text-right text-xs font-bold text-green-700">฿{c.ltv.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Platform ROI */}
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base">Marketing Channel ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {platformROI.map(p => (
                <div key={p.platform} className="flex items-center gap-3">
                  <span className="text-xs font-medium w-20 flex-shrink-0">{p.platform}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-muted-foreground">฿{(p.investment / 1000).toFixed(0)}K invest</span>
                      <span className="font-bold text-green-700">ROI {p.roi}%</span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full" style={{ width: `${Math.min(p.roi / 8, 100)}%`, backgroundColor: p.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cohort Retention */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base">Cohort Retention Analysis (%)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="text-left py-1 pr-4 font-medium">Cohort</th>
                  {['Month 0', 'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5'].map(m => (
                    <th key={m} className="text-center py-1 px-2 font-medium">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cohortRetention.map(row => (
                  <tr key={row.cohort}>
                    <td className="py-1 pr-4 font-medium text-xs">{row.cohort}</td>
                    {[row.m0, row.m1, row.m2, row.m3, row.m4, row.m5].map((v, i) => (
                      <td key={i} className="py-1 px-2 text-center">
                        <div className={`rounded px-2 py-1 font-medium text-xs ${getRetentionColor(v)}`}>
                          {v !== null ? `${v}%` : '—'}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-2">Retention improving: Month 1 rate 68% → 75% over 6 months</p>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-4 w-4 text-violet-500" />AI-Generated Business Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.map((ins, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${ins.bg}`}>
                <ins.icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${ins.color}`} />
                <div>
                  <p className={`text-xs font-bold ${ins.color}`}>{ins.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{ins.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
