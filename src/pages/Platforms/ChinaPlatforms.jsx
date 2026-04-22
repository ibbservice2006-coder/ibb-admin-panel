import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Settings } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import PlatformLogo from '@/components/PlatformLogo'

const chinaPlatforms = [
  {
    id: 1, name: 'Taobao / Tmall', logoKey: 'taobao', type: 'E-Commerce', status: 'connected',
    countries: ['CN', 'Global via Tmall Global'],
    orders: 1876, revenue: 2340000, commission: 5.0, lastSync: '4 min ago',
    description: 'Largest Alibaba Group E-Commerce platform in China',
    features: ['Tmall Global', 'Alipay', 'Taobao API', 'Cross-border'],
    note: 'Tmall Global required for foreign brands',
  },
  {
    id: 2, name: 'JD.com (京东)', logoKey: 'jd', type: 'E-Commerce', status: 'connected',
    countries: ['CN', 'Global via JD Worldwide'],
    orders: 987, revenue: 1120000, commission: 4.5, lastSync: '7 min ago',
    description: "China's 2nd top E-Commerce platform, focusing on quality products",
    features: ['JD Worldwide', 'JD Pay', 'Logistics API', 'Cross-border'],
    note: 'JD Worldwide supports foreign brands directly',
  },
  {
    id: 3, name: 'Ctrip / Trip.com (携程)', logoKey: 'ctrip', type: 'Travel', status: 'connected',
    countries: ['CN', 'Global'],
    orders: 765, revenue: 890000, commission: 8.0, lastSync: '12 min ago',
    description: "China's #1 Travel Booking Platform with 400M+ Users",
    features: ['Transfer Booking', 'Trip.com API', 'WeChat Pay', 'Alipay'],
    note: 'Trip.com is the international version of Ctrip',
  },
  {
    id: 4, name: 'Fliggy (飞猪)', logoKey: 'fliggy', type: 'Travel', status: 'warning',
    countries: ['CN'],
    orders: 234, revenue: 187000, commission: 6.0, lastSync: '3 hr ago',
    description: 'Alibaba travel platform connected to Taobao/Tmall',
    features: ['Alibaba Ecosystem', 'Alipay', 'Taobao Integration'],
    note: 'Suitable for Cross-selling with Taobao',
  },
  {
    id: 5, name: 'Meituan (美团)', logoKey: 'meituan', type: 'Super App', status: 'connected',
    countries: ['CN'],
    orders: 543, revenue: 432000, commission: 7.0, lastSync: '18 min ago',
    description: 'Leading super app in China covering Food, Travel, Entertainment',
    features: ['Meituan Travel', 'WeChat Pay', 'Local Services'],
    note: 'Suitable for Chinese customers needing local service',
  },
  {
    id: 8, name: 'Xiaohongshu / RED (小红书)', logoKey: 'xiaohongshu', type: 'Social Commerce', status: 'connected',
    countries: ['CN', 'Global Chinese Users'],
    orders: 312, revenue: 245000, commission: 5.0, lastSync: '16 min ago',
    description: 'Popular social commerce + review platform in China with 300M+ users',
    features: ['KOL Marketing', 'Product Review', 'Social Sharing', 'Live Commerce'],
    note: 'Ideal for KOL/Influencers reviewing IBB in Thailand — attracts Chinese tourists',
  },
  {
    id: 10, name: 'Douyin (抖音) / TikTok CN', logoKey: 'douyin', type: 'Social Commerce', status: 'connected',
    countries: ['CN'],
    orders: 187, revenue: 143000, commission: 6.0, lastSync: '28 min ago',
    description: 'China’s #1 Short Video + E-Commerce Platform with 700M+ Users',
    features: ['Douyin Shop', 'KOL/Influencer', 'Live Streaming', 'Content Marketing'],
    note: 'Douyin (China) separate from TikTok (international) — requires Chinese account',
  },
  {
    id: 6, name: 'Pinduoduo (拼多多)', logoKey: 'pinduoduo', type: 'E-Commerce', status: 'disconnected',
    countries: ['CN'],
    orders: 0, revenue: 0, commission: 3.0, lastSync: 'Never',
    description: 'E-Commerce platform focused on low prices and group buying in China',
    features: ['Group Buying', 'WeChat Integration', 'Temu (Global)'],
    note: 'Temu is the International Version for Global Market',
  },
  {
    id: 7, name: 'WeChat Mini Program', logoKey: 'wechat', type: 'Super App', status: 'connected',
    countries: ['CN', 'Global Chinese Users'],
    orders: 432, revenue: 354000, commission: 2.0, lastSync: '22 min ago',
    description: 'WeChat Mini Program for global Chinese customers',
    features: ['WeChat Pay', 'Mini Program API', 'Social Sharing', 'QR Code'],
    note: 'Covers over 1.3 billion WeChat users worldwide',
  },
]

const statusConfig = {
  connected:    { label: 'Connected',    color: 'bg-green-100 text-green-700',  icon: CheckCircle },
  warning:      { label: 'Warning',      color: 'bg-yellow-100 text-yellow-700',icon: AlertCircle },
  disconnected: { label: 'Disconnected', color: 'bg-red-100 text-red-700',      icon: XCircle },
}

export default function ChinaPlatforms() {
  const [platforms, setPlatforms] = useState(chinaPlatforms)
  const { toast } = useToast()
  const handleConfig = (name) => {
    toast({ title: `Configure ${name || 'Platform'}`, description: 'Settings page opened' })
  }


  const connected = platforms.filter(p => p.status === 'connected').length
  const totalOrders = platforms.reduce((s, p) => s + p.orders, 0)
  const totalRevenue = platforms.reduce((s, p) => s + p.revenue, 0)

  const handleSync = (id) => {
    setPlatforms(prev => prev.map(p => p.id === id ? { ...p, lastSync: 'Just now', status: 'connected' } : p))
    toast({ title: 'Sync Triggered' })
  }

  const handleToggle = (id) => {
    setPlatforms(prev => prev.map(p => {
      if (p.id !== id) return p
      return { ...p, status: p.status === 'disconnected' ? 'connected' : 'disconnected' }
    }))
    toast({ title: 'Platform Updated' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-100 border border-red-200">
            <span className="text-xl">🇨🇳</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">China Platforms</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Popular platforms in China — Alibaba, JD, Tencent Ecosystem</p>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={() => toast({ title: 'Syncing China Platforms...' })}>
          <RefreshCw className="h-4 w-4 mr-2" />Sync All
        </Button>
      </div>

      {/* Notice */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-3 pb-3">
          <p className="text-xs text-red-700"><strong>Note:</strong> Chinese platforms require special channels for foreign brands like Tmall Global, JD Worldwide, and support Alipay / WeChat Pay.</p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">Total Platforms</p>
          <p className="text-2xl font-bold">{platforms.length}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">Connected</p>
          <p className="text-2xl font-bold text-green-600">{connected}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">Orders (MTD)</p>
          <p className="text-2xl font-bold">{totalOrders.toLocaleString()}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">Revenue (MTD)</p>
          <p className="text-2xl font-bold text-green-600">฿{(totalRevenue / 1000000).toFixed(1)}M</p>
        </CardContent></Card>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {platforms.map(p => {
          const sc = statusConfig[p.status]
          const StatusIcon = sc.icon
          return (
            <Card key={p.id} className={`border ${p.status === 'disconnected' ? 'opacity-70' : ''}`}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <PlatformLogo platform={p.logoKey} size={40} fallback={p.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-base">{p.name}</span>
                      <Badge className={`text-xs ${sc.color}`}><StatusIcon className="h-3 w-3 mr-1" />{sc.label}</Badge>
                      <Badge variant="outline" className="text-xs">{p.type}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                    {p.note && <p className="text-xs text-red-600 mt-1 italic">💡 {p.note}</p>}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.countries.map(c => <span key={c} className="text-xs bg-red-50 text-red-700 border border-red-200 rounded px-1.5 py-0.5">{c}</span>)}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="bg-muted/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-muted-foreground">Orders</p>
                    <p className="font-bold text-sm">{p.orders.toLocaleString()}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="font-bold text-sm text-green-600">{p.revenue > 0 ? `฿${(p.revenue / 1000).toFixed(0)}K` : '—'}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-muted-foreground">Commission</p>
                    <p className="font-bold text-sm text-blue-600">{p.commission}%</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {p.features.map(f => <span key={f} className="text-xs bg-red-50 text-red-700 rounded px-2 py-0.5">{f}</span>)}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <span className="text-xs text-muted-foreground">Last sync: {p.lastSync}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleSync(p.id)}><RefreshCw className="h-3 w-3 mr-1" />Sync</Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs"><Settings className="h-3 w-3 mr-1"  onClick={() => handleConfig('Platform')}/>Config</Button>
                    <Button variant="outline" size="sm"
                      className={`h-7 text-xs ${p.status !== 'disconnected' ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'}`}
                      onClick={() => handleToggle(p.id)}>
                      {p.status !== 'disconnected' ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
