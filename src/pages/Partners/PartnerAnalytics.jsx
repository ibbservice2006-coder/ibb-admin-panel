import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Users, DollarSign, Star } from 'lucide-react'

const monthlyData = [
  { month: 'Oct', individual: 45000, company: 320000, platform: 480000 },
  { month: 'Nov', individual: 52000, company: 385000, platform: 520000 },
  { month: 'Dec', individual: 68000, company: 510000, platform: 680000 },
  { month: 'Jan', individual: 58000, company: 420000, platform: 590000 },
  { month: 'Feb', individual: 72000, company: 465000, platform: 640000 },
  { month: 'Mar', individual: 85000, company: 540000, platform: 720000 },
]

const partnerRevenue = [
  { name: 'Shopee Affiliate', revenue: 2710000, type: 'platform', color: '#f97316' },
  { name: 'Amazing Thailand Tours', revenue: 1560000, type: 'company', color: '#8b5cf6' },
  { name: 'Lazada Affiliate', revenue: 1435000, type: 'platform', color: '#f97316' },
  { name: 'Pattaya Beach Hotel', revenue: 990000, type: 'company', color: '#8b5cf6' },
  { name: 'Hua Hin Travel Agency', revenue: 435000, type: 'company', color: '#8b5cf6' },
  { name: 'Somsak Wongdee', revenue: 240000, type: 'individual', color: '#3b82f6' },
  { name: 'Napa Loves Traveling', revenue: 110000, type: 'individual', color: '#3b82f6' },
]

const typeDistribution = [
  { name: 'Platform', value: 4145000, color: '#f97316' },
  { name: 'Company', value: 2985000, color: '#8b5cf6' },
  { name: 'Individual', value: 350000, color: '#3b82f6' },
]

const conversionTrend = [
  { month: 'Oct', individual: 18.2, company: 22.5, platform: 7.8 },
  { month: 'Nov', individual: 19.1, company: 21.8, platform: 8.2 },
  { month: 'Dec', individual: 20.5, company: 23.4, platform: 9.1 },
  { month: 'Jan', individual: 18.8, company: 22.1, platform: 8.5 },
  { month: 'Feb', individual: 21.2, company: 24.0, platform: 9.8 },
  { month: 'Mar', individual: 22.0, company: 25.3, platform: 10.2 },
]

const topPartners = [
  { rank: 1, name: 'Shopee Affiliate', type: 'platform', revenue: 2710000, conversions: 542, convRate: 6.4, growth: '+12%' },
  { rank: 2, name: 'Amazing Thailand Tours', type: 'company', revenue: 1560000, conversions: 312, convRate: 20.0, growth: '+8%' },
  { rank: 3, name: 'Lazada Affiliate', type: 'platform', revenue: 1435000, conversions: 287, convRate: 5.9, growth: '+5%' },
  { rank: 4, name: 'Pattaya Beach Hotel', type: 'company', revenue: 990000, conversions: 198, convRate: 26.7, growth: '+15%' },
  { rank: 5, name: 'Hua Hin Travel Agency', type: 'company', revenue: 435000, conversions: 87, convRate: 20.0, growth: '+3%' },
]

const typeColor = {
  individual: 'bg-blue-100 text-blue-700',
  company: 'bg-purple-100 text-purple-700',
  platform: 'bg-orange-100 text-orange-700',
}

export default function PartnerAnalytics() {
  const totalRevenue = typeDistribution.reduce((a, t) => a + t.value, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-100 border border-indigo-200">
          <TrendingUp className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Partner Analytics</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Analyze Performance of All Partner & Affiliate Types</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Partner Revenue', value: `฿${(totalRevenue / 1000000).toFixed(1)}M`, sub: 'All channels', color: 'text-green-700', bg: 'bg-green-50', icon: DollarSign },
          { label: 'Active Partners', value: '8', sub: '3 types', color: 'text-blue-700', bg: 'bg-blue-50', icon: Users },
          { label: 'Avg Conv. Rate', value: '15.2%', sub: 'Across all partners', color: 'text-purple-700', bg: 'bg-purple-50', icon: TrendingUp },
          { label: 'Top Partner', value: 'Shopee', sub: '฿2.7M revenue', color: 'text-orange-700', bg: 'bg-orange-50', icon: Star },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue by Type - Stacked Bar */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base">Revenue by Partner Type (6 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `฿${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v) => `฿${v.toLocaleString()}`} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="platform" name="Platform" stackId="a" fill="#f97316" radius={[0, 0, 0, 0]} />
                <Bar dataKey="company" name="Company" stackId="a" fill="#8b5cf6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="individual" name="Individual" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Distribution - Pie */}
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base">Revenue share</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={typeDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                  {typeDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `฿${(v / 1000000).toFixed(1)}M`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {typeDistribution.map(t => (
                <div key={t.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                    <span>{t.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">฿{(t.value / 1000000).toFixed(1)}M</span>
                    <span className="text-muted-foreground ml-1">({(t.value / totalRevenue * 100).toFixed(0)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Rate Trend */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base">Conversion Rate Trend (%)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={conversionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="company" name="Company" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="individual" name="Individual" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="platform" name="Platform" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Partners Table */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />Top Partners by Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="text-left py-2 font-medium w-8">#</th>
                  <th className="text-left py-2 font-medium">Partner</th>
                  <th className="text-right py-2 font-medium">Revenue</th>
                  <th className="text-right py-2 font-medium">Conversions</th>
                  <th className="text-right py-2 font-medium">Conv. Rate</th>
                  <th className="text-right py-2 font-medium">Growth</th>
                </tr>
              </thead>
              <tbody>
                {topPartners.map(p => (
                  <tr key={p.rank} className="border-b hover:bg-gray-50">
                    <td className="py-2.5 text-xs font-bold text-muted-foreground">{p.rank}</td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">{p.name}</span>
                        <Badge className={`text-xs ${typeColor[p.type]}`}>{p.type}</Badge>
                      </div>
                    </td>
                    <td className="py-2.5 text-right text-xs font-bold">฿{(p.revenue / 1000000).toFixed(1)}M</td>
                    <td className="py-2.5 text-right text-xs">{p.conversions}</td>
                    <td className="py-2.5 text-right text-xs font-medium text-purple-700">{p.convRate}%</td>
                    <td className="py-2.5 text-right">
                      <span className="text-xs font-medium text-green-700">{p.growth}</span>
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
