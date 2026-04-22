import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Settings } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import PlatformLogo from '@/components/PlatformLogo'

const mePlatforms = [
  {
    id: 1, name: 'Noon', logoKey: 'noon', type: 'E-Commerce', status: 'connected',
    countries: ['AE', 'SA', 'EG'],
    orders: 432, revenue: 654000, commission: 7.0, lastSync: '6 min ago',
    description: 'No.1 E-Commerce platform in Middle East, founded in Dubai',
    features: ['Noon Pay', 'Express Delivery', 'Arabic Interface'],
    note: 'Supports payments in AED, SAR, EGP',
  },
  {
    id: 2, name: 'Amazon.ae', logoKey: 'amazon_ae', type: 'E-Commerce', status: 'connected',
    countries: ['AE', 'SA'],
    orders: 321, revenue: 487000, commission: 8.0, lastSync: '9 min ago',
    description: 'Amazon for Middle East, formerly Souq.com',
    features: ['Amazon Pay', 'FBA UAE', 'Arabic Support', 'Prime'],
    note: 'Connected to Amazon Global Seller Central',
  },
  {
    id: 3, name: 'Careem', logoKey: 'careem', type: 'Super App', status: 'disconnected',
    countries: ['AE', 'SA', 'EG', 'JO', 'PK'],
    orders: 0, revenue: 0, commission: 10.0, lastSync: 'Never',
    description: 'Leading Super App in the Middle East under Uber',
    features: ['Careem Pay', 'Ride Integration', 'Food Delivery'],
    note: 'Suitable for transfer services in big cities',
  },
  {
    id: 4, name: 'Wego', logoKey: 'wego', type: 'Travel', status: 'connected',
    countries: ['AE', 'SA', 'EG', 'KW', 'QA', 'BH'],
    orders: 187, revenue: 234000, commission: 9.0, lastSync: '25 min ago',
    description: 'Leading travel booking platform in the Middle East',
    features: ['Flight + Transfer', 'Arabic Interface', 'Multi-currency'],
    note: 'Supports Currency AED, SAR, OMR, KWD',
  },
  {
    id: 5, name: 'Jahez', logoKey: 'jahez', type: 'Delivery App', status: 'warning',
    countries: ['SA'],
    orders: 87, revenue: 65000, commission: 6.0, lastSync: '2 hr ago',
    description: 'Leading food delivery & services app in Saudi Arabia',
    features: ['Jahez Pay', 'Saudi Market', 'Arabic Support'],
    note: 'Focus on Saudi Arabia Market',
  },
  {
    id: 6, name: 'Talabat', logoKey: 'talabat', type: 'Super App', status: 'connected',
    countries: ['AE', 'SA', 'KW', 'QA', 'BH', 'OM', 'JO', 'EG'],
    orders: 234, revenue: 312000, commission: 8.0, lastSync: '14 min ago',
    description: 'Super App covering 8 Middle East countries under Delivery Hero',
    features: ['Talabat Pay', 'Express Delivery', 'Multi-country'],
    note: 'Covers all GCC countries',
  },
]

const statusConfig = {
  connected:    { label: 'Connected',    color: 'bg-green-100 text-green-700',  icon: CheckCircle },
  warning:      { label: 'Warning',      color: 'bg-yellow-100 text-yellow-700',icon: AlertCircle },
  disconnected: { label: 'Disconnected', color: 'bg-red-100 text-red-700',      icon: XCircle },
}

export default function MiddleEastPlatforms() {
  const [platforms, setPlatforms] = useState(mePlatforms)
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
          <div className="p-2.5 rounded-xl bg-amber-100 border border-amber-200">
            <span className="text-xl">🌙</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Middle East Platforms</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Popular platform in Middle East market — UAE, SA, EG, GCC</p>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={() => toast({ title: 'Syncing Middle East Platforms...' })}>
          <RefreshCw className="h-4 w-4 mr-2" />Sync All
        </Button>
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-3 pb-3">
          <p className="text-xs text-amber-700"><strong>Note:</strong> Middle East platform must support Arabic interface and payments in AED, SAR, OMR</p>
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
                    {p.note && <p className="text-xs text-amber-600 mt-1 italic">💡 {p.note}</p>}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.countries.map(c => <span key={c} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded px-1.5 py-0.5">{c}</span>)}
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
                  {p.features.map(f => <span key={f} className="text-xs bg-amber-50 text-amber-700 rounded px-2 py-0.5">{f}</span>)}
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
