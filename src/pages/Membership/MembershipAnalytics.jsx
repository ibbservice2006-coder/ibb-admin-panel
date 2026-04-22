import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { Users, TrendingUp, ArrowUpCircle, DollarSign, Star, Zap, Crown, Briefcase } from 'lucide-react'

const memberGrowth = [
  { month: 'Oct', general: 8200, vip: 4100, vvip: 320, business: 42 },
  { month: 'Nov', general: 8900, vip: 4500, vvip: 360, business: 48 },
  { month: 'Dec', general: 9800, vip: 5100, vvip: 410, business: 55 },
  { month: 'Jan', general: 10200, vip: 5600, vvip: 460, business: 61 },
  { month: 'Feb', general: 11000, vip: 6200, vvip: 510, business: 68 },
  { month: 'Mar', general: 11840, vip: 6890, vvip: 580, business: 74 },
]

const revenueByTier = [
  { tier: 'General',  revenue: 2840000,  color: '#3b82f6' },
  { tier: 'VIP',      revenue: 12400000, color: '#ec4899' },
  { tier: 'VVIP',     revenue: 18600000, color: '#eab308' },
  { tier: 'Business', revenue: 152800000,color: '#16a34a' },
]

const upgrades = [
  { month: 'Oct', generalToVip: 42, vipToVvip: 8, vvipToBp: 2 },
  { month: 'Nov', generalToVip: 55, vipToVvip: 11, vvipToBp: 1 },
  { month: 'Dec', generalToVip: 68, vipToVvip: 14, vvipToBp: 3 },
  { month: 'Jan', generalToVip: 51, vipToVvip: 9, vvipToBp: 2 },
  { month: 'Feb', generalToVip: 73, vipToVvip: 16, vvipToBp: 4 },
  { month: 'Mar', generalToVip: 84, vipToVvip: 19, vvipToBp: 3 },
]

const tierDistribution = [
  { name: 'General',  value: 11840, color: '#3b82f6' },
  { name: 'VIP',      value: 6890,  color: '#ec4899' },
  { name: 'VVIP',     value: 580,   color: '#eab308' },
  { name: 'Business', value: 74,    color: '#16a34a' },
]

const totalMembers = tierDistribution.reduce((s, t) => s + t.value, 0)

const TIER_ICONS = { General: Star, VIP: Zap, VVIP: Crown, Business: Briefcase }
const TIER_COLORS = { General: '#3b82f6', VIP: '#ec4899', VVIP: '#eab308', Business: '#16a34a' }

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border rounded-lg shadow-lg p-3 text-xs">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {typeof p.value === 'number' && p.value > 1000 ? `฿${(p.value/1000000).toFixed(2)}M` : p.value?.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function MembershipAnalytics() {
  const latestMonth = memberGrowth[memberGrowth.length - 1]
  const prevMonth = memberGrowth[memberGrowth.length - 2]
  const totalRevenue = revenueByTier.reduce((s, r) => s + r.revenue, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Membership Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of all 4 member levels · last 6 months data</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {tierDistribution.map(t => {
          const Icon = TIER_ICONS[t.name]
          const prev = memberGrowth[memberGrowth.length - 2][t.name.toLowerCase() === 'business' ? 'business' : t.name.toLowerCase()]
          const curr = memberGrowth[memberGrowth.length - 1][t.name.toLowerCase() === 'business' ? 'business' : t.name.toLowerCase()]
          const growth = (((curr - prev) / prev) * 100).toFixed(1)
          return (
            <Card key={t.name}>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: t.color + '20' }}>
                    <Icon className="h-5 w-5" style={{ color: t.color }} />
                  </div>
                  <span className="text-xs font-medium text-green-600">+{growth}%</span>
                </div>
                <p className="text-2xl font-bold">{t.value.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.name} Members</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Member Growth Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Member Growth (6 Months)</CardTitle>
            <CardDescription>Accumulated members count by tier</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={memberGrowth} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="general"  name="General"  stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="vip"      name="VIP"      stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="vvip"     name="VVIP"     stroke="#eab308" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="business" name="Business" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tier Distribution Pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tier Distribution</CardTitle>
            <CardDescription>Member distribution by tier</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={tierDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                  dataKey="value" paddingAngle={3}>
                  {tierDistribution.map((t, i) => <Cell key={i} fill={t.color} />)}
                </Pie>
                <Tooltip formatter={(val) => [val.toLocaleString(), 'Members']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {tierDistribution.map(t => (
                <div key={t.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                    <span>{t.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{t.value.toLocaleString()}</span>
                    <span className="text-muted-foreground">({((t.value / totalMembers) * 100).toFixed(1)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Tier */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue by Tier</CardTitle>
            <CardDescription>Total Revenue by Membership Tier</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueByTier} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="tier" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `฿${(v/1000000).toFixed(0)}M`} />
                <Tooltip formatter={v => [`฿${(v/1000000).toFixed(2)}M`, 'Revenue']} />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                  {revenueByTier.map((r, i) => <Cell key={i} fill={r.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 pt-3 border-t flex justify-between text-xs text-muted-foreground">
              <span>Total Revenue</span>
              <span className="font-bold text-sm text-gray-800">฿{(totalRevenue/1000000).toFixed(1)}M</span>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Trends */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Upgrade Trends</CardTitle>
            <CardDescription>Number of tier upgrades per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={upgrades} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="generalToVip"  name="General→VIP"  fill="#3b82f6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="vipToVvip"     name="VIP→VVIP"     fill="#eab308" radius={[2, 2, 0, 0]} />
                <Bar dataKey="vvipToBp"      name="VVIP→Business" fill="#16a34a" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
