import { useState } from 'react'
import { Plug, CheckCircle, XCircle, Settings, RefreshCw, ExternalLink, Search, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

const FAVICON_URL = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

function ServiceIcon({ domain, name, size = 40 }) {
  return (
    <img
      src={FAVICON_URL(domain)}
      alt={name}
      width={size}
      height={size}
      className="rounded-lg"
      onError={(e) => { e.target.style.display = 'none' }}
    />
  )
}

const SERVICES = [
  // Maps & Location
  { id: 'google_maps', name: 'Google Maps', category: 'Maps & Location', domain: 'maps.google.com', desc: 'Route planning, geocoding, and distance matrix', status: 'connected', fields: [{ key: 'api_key', label: 'API Key', type: 'password' }] },
  { id: 'here_maps', name: 'HERE Maps', category: 'Maps & Location', domain: 'here.com', desc: 'Alternative mapping and navigation service', status: 'disconnected', fields: [{ key: 'api_key', label: 'API Key', type: 'password' }] },

  // Payments
  { id: 'stripe', name: 'Stripe', category: 'Payment', domain: 'stripe.com', desc: 'International card payment processing', status: 'connected', fields: [{ key: 'secret_key', label: 'Secret Key', type: 'password' }, { key: 'publishable_key', label: 'Publishable Key', type: 'text' }] },
  { id: 'omise', name: 'Omise', category: 'Payment', domain: 'omise.co', desc: 'Thai and Southeast Asian payment gateway', status: 'connected', fields: [{ key: 'secret_key', label: 'Secret Key', type: 'password' }, { key: 'public_key', label: 'Public Key', type: 'text' }] },
  { id: 'promptpay', name: 'PromptPay', category: 'Payment', domain: 'promptpay.io', desc: 'Thai QR code payment via PromptPay', status: 'connected', fields: [{ key: 'merchant_id', label: 'Merchant ID', type: 'text' }] },
  { id: 'paypal', name: 'PayPal', category: 'Payment', domain: 'paypal.com', desc: 'Global online payment platform', status: 'disconnected', fields: [{ key: 'client_id', label: 'Client ID', type: 'text' }, { key: 'client_secret', label: 'Client Secret', type: 'password' }] },

  // Messaging & Notifications
  { id: 'twilio', name: 'Twilio SMS', category: 'Messaging', domain: 'twilio.com', desc: 'SMS and voice notifications to customers', status: 'connected', fields: [{ key: 'account_sid', label: 'Account SID', type: 'text' }, { key: 'auth_token', label: 'Auth Token', type: 'password' }, { key: 'phone_number', label: 'From Number', type: 'text' }] },
  { id: 'sendgrid', name: 'SendGrid', category: 'Email', domain: 'sendgrid.com', desc: 'Transactional email delivery service', status: 'connected', fields: [{ key: 'api_key', label: 'API Key', type: 'password' }, { key: 'from_email', label: 'From Email', type: 'text' }] },
  { id: 'firebase', name: 'Firebase FCM', category: 'Push Notifications', domain: 'firebase.google.com', desc: 'Mobile push notifications via Firebase', status: 'connected', fields: [{ key: 'server_key', label: 'Server Key', type: 'password' }, { key: 'project_id', label: 'Project ID', type: 'text' }] },
  { id: 'line', name: 'LINE Notify', category: 'Messaging', domain: 'line.me', desc: 'LINE messaging for Thai customers', status: 'disconnected', fields: [{ key: 'channel_token', label: 'Channel Access Token', type: 'password' }] },

  // Analytics & Monitoring
  { id: 'google_analytics', name: 'Google Analytics', category: 'Analytics', domain: 'analytics.google.com', desc: 'Website and app usage analytics', status: 'connected', fields: [{ key: 'measurement_id', label: 'Measurement ID', type: 'text' }] },
  { id: 'sentry', name: 'Sentry', category: 'Monitoring', domain: 'sentry.io', desc: 'Error tracking and performance monitoring', status: 'disconnected', fields: [{ key: 'dsn', label: 'DSN URL', type: 'text' }] },

  // Automation & CRM
  { id: 'zapier', name: 'Zapier', category: 'Automation', domain: 'zapier.com', desc: 'Connect IBB with 5,000+ apps automatically', status: 'disconnected', fields: [{ key: 'webhook_url', label: 'Webhook URL', type: 'text' }] },
  { id: 'hubspot', name: 'HubSpot CRM', category: 'CRM', domain: 'hubspot.com', desc: 'Customer relationship management platform', status: 'disconnected', fields: [{ key: 'api_key', label: 'API Key', type: 'password' }, { key: 'portal_id', label: 'Portal ID', type: 'text' }] },

  // Accounting
  { id: 'quickbooks', name: 'QuickBooks', category: 'Accounting', domain: 'quickbooks.intuit.com', desc: 'Accounting and invoicing integration', status: 'disconnected', fields: [{ key: 'client_id', label: 'Client ID', type: 'text' }, { key: 'client_secret', label: 'Client Secret', type: 'password' }] },
]

const CATEGORIES = ['All', ...new Set(SERVICES.map(s => s.category))]

export default function ThirdPartyServices() {
  const { toast } = useToast()
  const [services, setServices] = useState(SERVICES)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [configService, setConfigService] = useState(null)
  const [configValues, setConfigValues] = useState({})

  const filtered = services.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'All' || s.category === activeCategory
    return matchSearch && matchCat
  })

  const connectedCount = services.filter(s => s.status === 'connected').length

  const handleConfigure = (svc) => {
    setConfigService(svc)
    setConfigValues({})
  }

  const handleConnect = () => {
    setServices(prev => prev.map(s => s.id === configService.id ? { ...s, status: 'connected' } : s))
    setConfigService(null)
    toast({ title: 'Connected', description: `${configService.name} has been connected successfully.` })
  }

  const handleDisconnect = (id) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, status: 'disconnected' } : s))
    toast({ title: 'Disconnected', description: 'Service has been disconnected.' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Plug className="w-8 h-8 text-violet-600" />
          Third-party Services
        </h1>
        <p className="text-muted-foreground mt-1">Connect IBB Shuttle with external platforms and services</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Services', value: services.length, icon: Plug, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Connected', value: connectedCount, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Not Connected', value: services.length - connectedCount, icon: XCircle, color: 'text-slate-500', bg: 'bg-slate-50' },
          { label: 'Categories', value: CATEGORIES.length - 1, icon: Settings, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((s, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${s.bg}`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <Button key={cat} variant={activeCategory === cat ? 'default' : 'outline'} size="sm" onClick={() => setActiveCategory(cat)} className="text-xs">
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(svc => (
          <Card key={svc.id} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <ServiceIcon domain={svc.domain} name={svc.name} size={40} />
                  <div>
                    <p className="font-semibold">{svc.name}</p>
                    <Badge variant="outline" className="text-xs mt-0.5">{svc.category}</Badge>
                  </div>
                </div>
                <Badge variant={svc.status === 'connected' ? 'default' : 'secondary'} className="text-xs shrink-0">
                  {svc.status === 'connected'
                    ? <><CheckCircle className="w-3 h-3 mr-1" />Connected</>
                    : <><XCircle className="w-3 h-3 mr-1" />Not Connected</>
                  }
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{svc.desc}</p>
              <div className="flex gap-2 mt-3">
                {svc.status === 'connected' ? (
                  <>
                    <Button variant="outline" size="sm" className="flex-1 text-xs gap-1" onClick={() => handleConfigure(svc)}>
                      <Settings className="w-3 h-3" /> Configure
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive" onClick={() => handleDisconnect(svc.id)}>
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white flex-1 text-xs gap-1" onClick={() => handleConfigure(svc)}>
                    <Plug className="w-3 h-3" /> Connect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>No services found matching your search.</p>
        </div>
      )}

      {/* Configure Dialog */}
      {configService && (
        <Dialog open={!!configService} onOpenChange={() => setConfigService(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ServiceIcon domain={configService.domain} name={configService.name} size={28} />
                {configService.status === 'connected' ? 'Configure' : 'Connect'} {configService.name}
              </DialogTitle>
              <DialogDescription>{configService.desc}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              {configService.fields.map(field => (
                <div key={field.key} className="space-y-1.5">
                  <Label>{field.label}</Label>
                  <Input
                    type={field.type}
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                    value={configValues[field.key] || ''}
                    onChange={e => setConfigValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button size="sm" variant="outline" onClick={() => setConfigService(null)}>Cancel</Button>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleConnect}>
                {configService.status === 'connected' ? 'Save Changes' : 'Connect'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
