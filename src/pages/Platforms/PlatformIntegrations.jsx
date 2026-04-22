import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Globe, CheckCircle, XCircle, AlertCircle, RefreshCw, TrendingUp, ShoppingBag, Zap } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import PlatformLogo from '@/components/PlatformLogo'

const allPlatforms = [
  // SE Asia
  { id: 1,  name: 'Shopee',        logoKey: 'shopee',       zone: 'SE Asia',     country: 'TH/MY/SG/ID/PH/VN', status: 'connected',    orders: 1240, revenue: 892000,   lastSync: '2 min ago' },
  { id: 2,  name: 'Lazada',        logoKey: 'lazada',       zone: 'SE Asia',     country: 'TH/MY/SG/ID/PH/VN', status: 'connected',    orders: 876,  revenue: 654000,   lastSync: '5 min ago' },
  { id: 3,  name: 'Grab',          logoKey: 'grab',         zone: 'SE Asia',     country: 'TH/MY/SG/ID/PH/VN', status: 'connected',    orders: 2340, revenue: 1820000,  lastSync: '1 min ago' },
  { id: 4,  name: 'Klook',         logoKey: 'klook',        zone: 'SE Asia',     country: 'Global',             status: 'connected',    orders: 543,  revenue: 412000,   lastSync: '10 min ago' },
  { id: 5,  name: 'Agoda',         logoKey: 'agoda',        zone: 'SE Asia',     country: 'Global',             status: 'warning',      orders: 321,  revenue: 287000,   lastSync: '1 hr ago' },
  { id: 22, name: 'TikTok Shop',   logoKey: 'tiktok_shop',  zone: 'SE Asia',     country: 'TH/MY/SG/ID/PH/VN', status: 'connected',    orders: 654,  revenue: 498000,   lastSync: '8 min ago' },
  { id: 23, name: 'Tokopedia',     logoKey: 'tokopedia',    zone: 'SE Asia',     country: 'ID',                 status: 'connected',    orders: 312,  revenue: 234000,   lastSync: '14 min ago' },
  // Global
  { id: 6,  name: 'Amazon',        logoKey: 'amazon',       zone: 'Global',      country: 'US/UK/EU/AE',        status: 'connected',    orders: 987,  revenue: 1240000,  lastSync: '3 min ago' },
  { id: 7,  name: 'eBay',          logoKey: 'ebay',         zone: 'Global',      country: 'US/UK/AU',           status: 'connected',    orders: 234,  revenue: 187000,   lastSync: '15 min ago' },
  { id: 8,  name: 'Booking.com',   logoKey: 'booking',      zone: 'Global',      country: 'Global',             status: 'connected',    orders: 654,  revenue: 543000,   lastSync: '8 min ago' },
  { id: 9,  name: 'Expedia',       logoKey: 'expedia',      zone: 'Global',      country: 'Global',             status: 'warning',      orders: 123,  revenue: 98000,    lastSync: '2 hr ago' },
  { id: 10, name: 'GetYourGuide',  logoKey: 'getyourguide', zone: 'Global',      country: 'Global',             status: 'connected',    orders: 432,  revenue: 321000,   lastSync: '20 min ago' },
  { id: 11, name: 'Viator',        logoKey: 'viator',       zone: 'Global',      country: 'Global',             status: 'disconnected', orders: 0,    revenue: 0,        lastSync: 'Never' },
  { id: 24, name: 'Airbnb',        logoKey: 'airbnb',       zone: 'Global',      country: 'Global',             status: 'connected',    orders: 187,  revenue: 143000,   lastSync: '25 min ago' },
  { id: 25, name: 'Coupang',       logoKey: 'coupang',      zone: 'Global',      country: 'KR',                 status: 'connected',    orders: 98,   revenue: 76000,    lastSync: '30 min ago' },
  // China
  { id: 12, name: 'Taobao/Tmall',  logoKey: 'taobao',       zone: 'China',       country: 'CN',                 status: 'connected',    orders: 1876, revenue: 2340000,  lastSync: '4 min ago' },
  { id: 13, name: 'JD.com',        logoKey: 'jd',           zone: 'China',       country: 'CN',                 status: 'connected',    orders: 987,  revenue: 1120000,  lastSync: '7 min ago' },
  { id: 14, name: 'Ctrip (携程)',  logoKey: 'ctrip',        zone: 'China',       country: 'CN/Global',          status: 'connected',    orders: 765,  revenue: 890000,   lastSync: '12 min ago' },
  { id: 15, name: 'Fliggy (飞猪)', logoKey: 'fliggy',       zone: 'China',       country: 'CN',                 status: 'warning',      orders: 234,  revenue: 187000,   lastSync: '3 hr ago' },
  { id: 26, name: 'Meituan (美团)',logoKey: 'meituan',      zone: 'China',       country: 'CN',                 status: 'connected',    orders: 543,  revenue: 412000,   lastSync: '9 min ago' },
  { id: 27, name: 'Xiaohongshu',   logoKey: 'xiaohongshu',  zone: 'China',       country: 'CN/Global',          status: 'connected',    orders: 312,  revenue: 245000,   lastSync: '16 min ago' },
  { id: 28, name: 'Douyin (抖音)', logoKey: 'douyin',       zone: 'China',       country: 'CN',                 status: 'connected',    orders: 187,  revenue: 143000,   lastSync: '28 min ago' },
  // Middle East
  { id: 16, name: 'Noon',          logoKey: 'noon',         zone: 'Middle East', country: 'AE/SA/EG',           status: 'connected',    orders: 432,  revenue: 654000,   lastSync: '6 min ago' },
  { id: 17, name: 'Amazon.ae',     logoKey: 'amazon_ae',    zone: 'Middle East', country: 'AE',                 status: 'connected',    orders: 321,  revenue: 487000,   lastSync: '9 min ago' },
  { id: 18, name: 'Careem',        logoKey: 'careem',       zone: 'Middle East', country: 'AE/SA/EG/JO',        status: 'disconnected', orders: 0,    revenue: 0,        lastSync: 'Never' },
  { id: 29, name: 'Wego',          logoKey: 'wego',         zone: 'Middle East', country: 'AE/SA/Global',       status: 'connected',    orders: 123,  revenue: 98000,    lastSync: '22 min ago' },
  { id: 30, name: 'Talabat',       logoKey: 'talabat',      zone: 'Middle East', country: 'AE/KW/QA/BH',        status: 'warning',      orders: 87,   revenue: 65000,    lastSync: '1 hr ago' },
  // Russia
  { id: 19, name: 'Ozon',          logoKey: 'ozon',         zone: 'Russia',      country: 'RU',                 status: 'connected',    orders: 543,  revenue: 432000,   lastSync: '11 min ago' },
  { id: 20, name: 'Wildberries',   logoKey: 'wildberries',  zone: 'Russia',      country: 'RU/BY/KZ',           status: 'connected',    orders: 321,  revenue: 287000,   lastSync: '18 min ago' },
  { id: 21, name: 'Yandex Market', logoKey: 'yandex',       zone: 'Russia',      country: 'RU',                 status: 'warning',      orders: 87,   revenue: 65000,    lastSync: '4 hr ago' },
  { id: 31, name: 'Avito',         logoKey: 'avito',        zone: 'Russia',      country: 'RU',                 status: 'connected',    orders: 65,   revenue: 48000,    lastSync: '35 min ago' },
]

const statusConfig = {
  connected:    { label: 'Connected',    color: 'bg-green-100 text-green-700',  icon: CheckCircle,  iconColor: 'text-green-500' },
  warning:      { label: 'Warning',      color: 'bg-yellow-100 text-yellow-700',icon: AlertCircle,  iconColor: 'text-yellow-500' },
  disconnected: { label: 'Disconnected', color: 'bg-red-100 text-red-700',      icon: XCircle,      iconColor: 'text-red-500' },
}

const zones = ['All', 'SE Asia', 'Global', 'China', 'Middle East', 'Russia']

export default function PlatformIntegrations() {
  const [selectedZone, setSelectedZone] = useState('All')
  const [platforms, setPlatforms] = useState(allPlatforms)
  const { toast } = useToast()

  const filtered = selectedZone === 'All' ? platforms : platforms.filter(p => p.zone === selectedZone)
  const totalOrders = platforms.reduce((s, p) => s + p.orders, 0)
  const totalRevenue = platforms.reduce((s, p) => s + p.revenue, 0)
  const connectedCount = platforms.filter(p => p.status === 'connected').length
  const warningCount = platforms.filter(p => p.status === 'warning').length

  const handleSync = (id) => {
    setPlatforms(prev => prev.map(p => p.id === id ? { ...p, lastSync: 'Just now' } : p))
    toast({ title: 'Sync Triggered', description: 'Platform sync initiated.' })
  }

  const handleToggle = (id) => {
    setPlatforms(prev => prev.map(p => {
      if (p.id !== id) return p
      const newStatus = p.status === 'disconnected' ? 'connected' : 'disconnected'
      return { ...p, status: newStatus }
    }))
    toast({ title: 'Platform Updated' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-100 border border-indigo-200">
            <Globe className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Platform Integrations</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Overview of all external platform connections</p>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={() => toast({ title: 'Syncing All Platforms...' })}>
          <RefreshCw className="h-4 w-4 mr-2" />Sync All
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total Platforms</p>
              <p className="text-2xl font-bold">{platforms.length}</p>
            </div>
            <Globe className="h-8 w-8 text-indigo-400" />
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Connected</p>
              <p className="text-2xl font-bold text-green-600">{connectedCount}</p>
              {warningCount > 0 && <p className="text-xs text-yellow-600">{warningCount} warning</p>}
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total Orders (MTD)</p>
              <p className="text-2xl font-bold">{totalOrders.toLocaleString()}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-blue-400" />
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Revenue (MTD)</p>
              <p className="text-2xl font-bold text-green-600">฿{(totalRevenue / 1000000).toFixed(1)}M</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
        </CardContent></Card>
      </div>

      {/* Zone Filter */}
      <div className="flex gap-2 flex-wrap">
        {zones.map(z => (
          <Button key={z} variant={selectedZone === z ? 'default' : 'outline'} size="sm"
            className={selectedZone === z ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
            onClick={() => setSelectedZone(z)}>{z}</Button>
        ))}
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(p => {
          const sc = statusConfig[p.status]
          const StatusIcon = sc.icon
          return (
            <Card key={p.id} className={`border ${p.status === 'disconnected' ? 'opacity-70' : ''}`}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <PlatformLogo platform={p.logoKey} size={36} fallback={p.name} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base">{p.name}</span>
                        <Badge className={`text-xs ${sc.color}`}>
                          <StatusIcon className={`h-3 w-3 mr-1 ${sc.iconColor}`} />
                          {sc.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-xs">{p.zone}</Badge>
                        <span className="text-xs text-muted-foreground">{p.country}</span>
                      </div>
                    </div>
                  </div>
                  <Zap className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-muted/50 rounded-lg p-2.5">
                    <p className="text-xs text-muted-foreground">Orders (MTD)</p>
                    <p className="font-bold text-sm">{p.orders.toLocaleString()}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2.5">
                    <p className="text-xs text-muted-foreground">Revenue (MTD)</p>
                    <p className="font-bold text-sm text-green-600">
                      {p.revenue > 0 ? `฿${(p.revenue / 1000).toFixed(0)}K` : '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Last sync: {p.lastSync}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleSync(p.id)}>
                      <RefreshCw className="h-3 w-3 mr-1" />Sync
                    </Button>
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
