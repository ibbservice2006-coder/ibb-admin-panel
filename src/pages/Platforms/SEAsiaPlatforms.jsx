import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, RefreshCw, CheckCircle, XCircle, AlertCircle, Settings } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import PlatformLogo from '@/components/PlatformLogo'

const seaPlatforms = [
  {
    id: 1, name: 'Shopee', logoKey: 'shopee', type: 'E-Commerce', status: 'connected',
    countries: ['TH', 'MY', 'SG', 'ID', 'PH', 'VN', 'TW'],
    orders: 1240, revenue: 892000, commission: 3.5, lastSync: '2 min ago',
    description: "Southeast Asia's #1 E-Commerce Platform",
    features: ['Voucher Integration', 'Auto Booking', 'Status Sync'],
  },
  {
    id: 2, name: 'Lazada', logoKey: 'lazada', type: 'E-Commerce', status: 'connected',
    countries: ['TH', 'MY', 'SG', 'ID', 'PH', 'VN'],
    orders: 876, revenue: 654000, commission: 4.0, lastSync: '5 min ago',
    description: 'Alibaba Group e-commerce platform',
    features: ['Voucher Integration', 'Auto Booking', 'Status Sync'],
  },
  {
    id: 3, name: 'Grab', logoKey: 'grab', type: 'Super App', status: 'connected',
    countries: ['TH', 'MY', 'SG', 'ID', 'PH', 'VN', 'MM', 'KH'],
    orders: 2340, revenue: 1820000, commission: 5.0, lastSync: '1 min ago',
    description: 'Leading Super App in Southeast Asia Covering 8 Countries',
    features: ['GrabTravel Integration', 'Real-time Tracking', 'GrabPay'],
  },
  {
    id: 4, name: 'Klook', logoKey: 'klook', type: 'Travel & Activities', status: 'connected',
    countries: ['Global', 'Focus: TH/SG/HK/TW'],
    orders: 543, revenue: 412000, commission: 6.0, lastSync: '10 min ago',
    description: 'Global activity and travel booking platform',
    features: ['Activity Listing', 'Instant Confirmation', 'Multi-currency'],
  },
  {
    id: 5, name: 'Agoda', logoKey: 'agoda', type: 'Travel', status: 'warning',
    countries: ['Global', 'Focus: TH/SG/ID/MY'],
    orders: 321, revenue: 287000, commission: 5.5, lastSync: '1 hr ago',
    description: 'Accommodation & travel booking platform under Booking Holdings',
    features: ['Transfer Listing', 'AgodaCash', 'API Integration'],
  },
  {
    id: 6, name: 'Traveloka', logoKey: 'traveloka', type: 'Travel', status: 'connected',
    countries: ['ID', 'TH', 'MY', 'SG', 'PH', 'VN'],
    orders: 432, revenue: 354000, commission: 5.0, lastSync: '15 min ago',
    description: 'Leading ticketing & travel platform in Indonesia',
    features: ['Transfer Service', 'Traveloka Pay', 'Status Sync'],
  },
  {
    id: 7, name: 'Tokopedia', logoKey: 'tokopedia', type: 'E-Commerce', status: 'disconnected',
    countries: ['ID'],
    orders: 0, revenue: 0, commission: 3.5, lastSync: 'Never',
    description: 'Indonesia’s #1 E-Commerce platform',
    features: ['Voucher Integration', 'Auto Booking'],
  },
  {
    id: 8, name: 'TikTok Shop', logoKey: 'tiktok_shop', type: 'Social Commerce', status: 'connected',
    countries: ['TH', 'MY', 'SG', 'ID', 'PH', 'VN'],
    orders: 654, revenue: 487000, commission: 4.5, lastSync: '8 min ago',
    description: 'Rapidly Growing Social Commerce on TikTok',
    features: ['Live Commerce', 'Affiliate', 'Auto Booking'],
  },
]

const statusConfig = {
  connected:    { label: 'Connected',    color: 'bg-green-100 text-green-700',  icon: CheckCircle },
  warning:      { label: 'Warning',      color: 'bg-yellow-100 text-yellow-700',icon: AlertCircle },
  disconnected: { label: 'Disconnected', color: 'bg-red-100 text-red-700',      icon: XCircle },
}

export default function SEAsiaPlatforms() {
  const [platforms, setPlatforms] = useState(seaPlatforms)
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const handleSaveSettings = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast({ title: 'Settings Saved', description: 'Settings Saved' })
    }, 600)
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
          <div className="p-2.5 rounded-xl bg-orange-100 border border-orange-200">
            <MapPin className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">SE Asia Platforms</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Popular platforms in Southeast Asia</p>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={() => toast({ title: 'Syncing SE Asia Platforms...' })}>
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
                      <Badge className={`text-xs ${sc.color}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />{sc.label}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{p.type}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.countries.map(c => (
                        <span key={c} className="text-xs bg-orange-50 text-orange-700 border border-orange-200 rounded px-1.5 py-0.5">{c}</span>
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
                  {p.features.map(f => (
                    <span key={f} className="text-xs bg-blue-50 text-blue-700 rounded px-2 py-0.5">{f}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <span className="text-xs text-muted-foreground">Last sync: {p.lastSync}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleSync(p.id)}>
                      <RefreshCw className="h-3 w-3 mr-1" />Sync
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleSaveSettings}>
                      <Settings className="h-3 w-3 mr-1" />Config
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
