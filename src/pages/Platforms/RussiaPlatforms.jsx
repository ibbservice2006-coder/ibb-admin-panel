import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Settings, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import PlatformLogo from '@/components/PlatformLogo'

const ruPlatforms = [
  {
    id: 1, name: 'Ozon', logoKey: 'ozon', type: 'E-Commerce', status: 'connected',
    countries: ['RU', 'BY', 'KZ'],
    orders: 543, revenue: 432000, commission: 5.0, lastSync: '11 min ago',
    description: 'No.2 E-Commerce platform in Russia with 30M+ users',
    features: ['Ozon Pay', 'Ozon Logistics', 'Seller API', 'Multi-currency'],
    note: 'Support RUB Payments via Local System',
  },
  {
    id: 2, name: 'Wildberries', logoKey: 'wildberries', type: 'E-Commerce', status: 'connected',
    countries: ['RU', 'BY', 'KZ', 'AM', 'KG'],
    orders: 321, revenue: 287000, commission: 4.0, lastSync: '18 min ago',
    description: 'Russia’s #1 E-Commerce platform focusing on fashion & lifestyle',
    features: ['WB Pay', 'WB Logistics', 'Seller Portal', 'CIS Markets'],
    note: 'Covers all CIS countries',
  },
  {
    id: 3, name: 'Yandex Market', logoKey: 'yandex', type: 'E-Commerce', status: 'warning',
    countries: ['RU'],
    orders: 87, revenue: 65000, commission: 6.0, lastSync: '4 hr ago',
    description: "Yandex-affiliated marketplace, Russia's #1 search engine",
    features: ['Yandex Pay', 'Yandex Delivery', 'API Integration'],
    note: 'Connected to Yandex Ecosystem (Search, Maps, Taxi)',
  },
  {
    id: 4, name: 'Yandex Go (Taxi)', logoKey: 'yandex_go', type: 'Ride-hailing', status: 'connected',
    countries: ['RU', 'BY', 'KZ', 'AM', 'AZ', 'GE'],
    orders: 234, revenue: 198000, commission: 8.0, lastSync: '5 min ago',
    description: 'Yandex ride-hailing app covering Russia and CIS countries',
    features: ['Yandex Pay', 'Real-time Tracking', 'Corporate Account'],
    note: 'Suitable for Transfer Service in Russia and CIS',
  },
  {
    id: 5, name: 'Avito', logoKey: 'avito', type: 'Classifieds', status: 'disconnected',
    countries: ['RU'],
    orders: 0, revenue: 0, commission: 3.0, lastSync: 'Never',
    description: 'Russia’s #1 marketplace for goods & services',
    features: ['Avito Pay', 'Service Listing', 'Local Market'],
    note: 'Suitable for local transfer service listings',
  },
  {
    id: 6, name: '2GIS', logoKey: 'twogis', type: 'Maps & Local', status: 'connected',
    countries: ['RU', 'KZ', 'CIS'],
    orders: 123, revenue: 87000, commission: 4.0, lastSync: '35 min ago',
    description: 'Popular Map & Local Business Search App in Russia',
    features: ['Business Listing', 'Route Planning', 'Local Discovery'],
    note: 'Ideal for Local SEO and local service search',
  },
]

const statusConfig = {
  connected:    { label: 'Connected',    color: 'bg-green-100 text-green-700',  icon: CheckCircle },
  warning:      { label: 'Warning',      color: 'bg-yellow-100 text-yellow-700',icon: AlertCircle },
  disconnected: { label: 'Disconnected', color: 'bg-red-100 text-red-700',      icon: XCircle },
}

export default function RussiaPlatforms() {
  const [platforms, setPlatforms] = useState(ruPlatforms)
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
          <div className="p-2.5 rounded-xl bg-blue-100 border border-blue-200">
            <span className="text-xl">🇷🇺</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Russia Platforms</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Popular platforms in Russia & CIS market — Ozon, Wildberries, Yandex</p>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={() => toast({ title: 'Syncing Russia Platforms...' })}>
          <RefreshCw className="h-4 w-4 mr-2" />Sync All
        </Button>
      </div>

      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-3 pb-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-orange-700"><strong>Note:</strong> Russian market has 8% margin due to high RUB volatility and local payment support (Mir Card, SBP)</p>
          </div>
        </CardContent>
      </Card>

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
                    {p.note && <p className="text-xs text-orange-600 mt-1 italic">💡 {p.note}</p>}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.countries.map(c => <span key={c} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded px-1.5 py-0.5">{c}</span>)}
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
                  {p.features.map(f => <span key={f} className="text-xs bg-blue-50 text-blue-700 rounded px-2 py-0.5">{f}</span>)}
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
