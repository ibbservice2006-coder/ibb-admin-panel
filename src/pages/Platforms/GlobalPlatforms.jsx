import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Globe, RefreshCw, CheckCircle, XCircle, AlertCircle, Settings } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import PlatformLogo from '@/components/PlatformLogo'

const globalPlatforms = [
  {
    id: 1, name: 'Amazon', logoKey: 'amazon', type: 'E-Commerce', status: 'connected',
    countries: ['US', 'UK', 'DE', 'FR', 'IT', 'ES', 'AE', 'AU', 'JP'],
    orders: 987, revenue: 1240000, commission: 8.0, lastSync: '3 min ago',
    description: "The world's largest E-Commerce platform covering 20+ countries",
    features: ['FBA Integration', 'Amazon Pay', 'Seller Central API'],
  },
  {
    id: 2, name: 'eBay', logoKey: 'ebay', type: 'E-Commerce', status: 'connected',
    countries: ['US', 'UK', 'AU', 'DE', 'CA'],
    orders: 234, revenue: 187000, commission: 6.5, lastSync: '15 min ago',
    description: 'Global Marketplace Platform with 135M+ Users',
    features: ['eBay API', 'PayPal Integration', 'Global Shipping'],
  },
  {
    id: 3, name: 'Booking.com', logoKey: 'booking', type: 'Travel', status: 'connected',
    countries: ['Global', '220+ Countries'],
    orders: 654, revenue: 543000, commission: 12.0, lastSync: '8 min ago',
    description: "The world's largest accommodation and travel booking platform",
    features: ['Transfer Listing', 'Extranet API', 'Instant Confirmation'],
  },
  {
    id: 4, name: 'Expedia', logoKey: 'expedia', type: 'Travel', status: 'warning',
    countries: ['US', 'UK', 'EU', 'AU', 'CA'],
    orders: 123, revenue: 98000, commission: 10.0, lastSync: '2 hr ago',
    description: 'All-in-One Travel Booking Platform by Expedia Group',
    features: ['Transfer Service', 'Expedia Affiliate', 'Multi-currency'],
  },
  {
    id: 5, name: 'GetYourGuide', logoKey: 'getyourguide', type: 'Travel & Activities', status: 'connected',
    countries: ['Global', 'Focus: EU/US'],
    orders: 432, revenue: 321000, commission: 20.0, lastSync: '20 min ago',
    description: 'Popular Activity & Tour Booking Platform in Europe & America',
    features: ['Activity API', 'Instant Booking', 'Review System'],
  },
  {
    id: 6, name: 'Viator', logoKey: 'viator', type: 'Travel & Activities', status: 'disconnected',
    countries: ['Global', 'Focus: US/EU/AU'],
    orders: 0, revenue: 0, commission: 20.0, lastSync: 'Never',
    description: 'TripAdvisor affiliate activity booking platform with over 1.5 million users',
    features: ['Viator API', 'TripAdvisor Integration', 'Review Sync'],
  },
  {
    id: 7, name: 'Airbnb', logoKey: 'airbnb', type: 'Travel', status: 'connected',
    countries: ['Global', '220+ Countries'],
    orders: 321, revenue: 287000, commission: 3.0, lastSync: '25 min ago',
    description: 'Global accommodation and travel experience platform',
    features: ['Experience Listing', 'Airbnb API', 'Instant Book'],
  },
  {
    id: 8, name: 'Coupang', logoKey: 'coupang', type: 'E-Commerce', status: 'connected',
    countries: ['KR', 'US'],
    orders: 187, revenue: 143000, commission: 5.5, lastSync: '30 min ago',
    description: 'No.1 E-Commerce Platform in South Korea',
    features: ['Rocket Delivery', 'Coupang API', 'Korean Market'],
  },
]

const statusConfig = {
  connected:    { label: 'Connected',    color: 'bg-green-100 text-green-700',  icon: CheckCircle },
  warning:      { label: 'Warning',      color: 'bg-yellow-100 text-yellow-700',icon: AlertCircle },
  disconnected: { label: 'Disconnected', color: 'bg-red-100 text-red-700',      icon: XCircle },
}

export default function GlobalPlatforms() {
  const [platforms, setPlatforms] = useState(globalPlatforms)
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
            <Globe className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Global Platforms</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Global popular platforms — US, EU, AU, KR</p>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={() => toast({ title: 'Syncing Global Platforms...' })}>
          <RefreshCw className="h-4 w-4 mr-2" />Sync All
        </Button>
      </div>

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
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.countries.map(c => (
                        <span key={c} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded px-1.5 py-0.5">{c}</span>
                      ))}
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
