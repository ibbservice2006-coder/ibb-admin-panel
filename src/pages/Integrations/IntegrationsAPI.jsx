import { useState } from 'react'
import { Key, Plus, Copy, Eye, EyeOff, RefreshCw, Trash2, BarChart3, Clock, AlertCircle, CheckCircle, Shield, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'

const FAVICON_URL = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=32`

const SERVICES = [
  { id: 'google_maps', name: 'Google Maps', category: 'Maps & Location', domain: 'maps.google.com', docsUrl: 'https://developers.google.com/maps' },
  { id: 'twilio', name: 'Twilio', category: 'SMS & Voice', domain: 'twilio.com', docsUrl: 'https://www.twilio.com/docs' },
  { id: 'sendgrid', name: 'SendGrid', category: 'Email', domain: 'sendgrid.com', docsUrl: 'https://docs.sendgrid.com' },
  { id: 'firebase', name: 'Firebase FCM', category: 'Push Notifications', domain: 'firebase.google.com', docsUrl: 'https://firebase.google.com/docs' },
  { id: 'stripe', name: 'Stripe', category: 'Payment', domain: 'stripe.com', docsUrl: 'https://stripe.com/docs' },
  { id: 'omise', name: 'Omise', category: 'Payment', domain: 'omise.co', docsUrl: 'https://www.omise.co/docs' },
  { id: 'line', name: 'LINE Notify', category: 'Messaging', domain: 'line.me', docsUrl: 'https://notify-bot.line.me/doc/en/' },
  { id: 'openai', name: 'OpenAI', category: 'AI', domain: 'openai.com', docsUrl: 'https://platform.openai.com/docs' },
  { id: 'here_maps', name: 'HERE Maps', category: 'Maps & Location', domain: 'here.com', docsUrl: 'https://developer.here.com' },
  { id: 'mailchimp', name: 'Mailchimp', category: 'Email', domain: 'mailchimp.com', docsUrl: 'https://mailchimp.com/developer' },
]

const INITIAL_KEYS = [
  { id: 1, service: 'google_maps', name: 'Google Maps API Key', key: 'AIzaSy_masked', env: 'production', permissions: ['read'], rateLimit: 2000, status: 'active', createdAt: '2025-09-15', lastUsed: '2025-10-06 16:45:00', requestCount: 45230 },
  { id: 2, service: 'twilio', name: 'Twilio Auth Token', key: 'AC_masked', env: 'production', permissions: ['read', 'write'], rateLimit: 500, status: 'active', createdAt: '2025-09-18', lastUsed: '2025-10-06 16:30:00', requestCount: 12300 },
  { id: 3, service: 'sendgrid', name: 'SendGrid API Key', key: 'SG_masked', env: 'production', permissions: ['read', 'write'], rateLimit: 1000, status: 'active', createdAt: '2025-09-20', lastUsed: '2025-10-06 16:20:00', requestCount: 8900 },
  { id: 4, service: 'stripe', name: 'Stripe Secret Key', key: 'sk_live_masked', env: 'production', permissions: ['read', 'write'], rateLimit: 1000, status: 'active', createdAt: '2025-10-01', lastUsed: '2025-10-06 16:10:00', requestCount: 34100 },
  { id: 5, service: 'omise', name: 'Omise Secret Key', key: 'skey_test_masked', env: 'sandbox', permissions: ['read', 'write'], rateLimit: 200, status: 'active', createdAt: '2025-10-02', lastUsed: '2025-10-06 15:00:00', requestCount: 7800 },
  { id: 6, service: 'openai', name: 'OpenAI API Key', key: 'sk_masked', env: 'production', permissions: ['read', 'write'], rateLimit: 100, status: 'revoked', createdAt: '2025-08-10', lastUsed: '2025-09-30 10:00:00', requestCount: 2100 },
]

const USAGE_LOGS = [
  { id: 1, service: 'google_maps', endpoint: 'Directions API', method: 'GET', time: '2025-10-06 16:45', status: 200, latency: '120ms', ip: '203.150.1.10' },
  { id: 2, service: 'twilio', endpoint: 'Messages', method: 'POST', time: '2025-10-06 16:30', status: 201, latency: '340ms', ip: '203.150.1.10' },
  { id: 3, service: 'sendgrid', endpoint: 'Mail Send', method: 'POST', time: '2025-10-06 16:20', status: 202, latency: '280ms', ip: '203.150.1.11' },
  { id: 4, service: 'stripe', endpoint: 'Payment Intents', method: 'POST', time: '2025-10-06 16:10', status: 200, latency: '450ms', ip: '203.150.1.10' },
  { id: 5, service: 'google_maps', endpoint: 'Geocoding API', method: 'GET', time: '2025-10-06 15:55', status: 200, latency: '95ms', ip: '203.150.1.12' },
  { id: 6, service: 'openai', endpoint: 'Chat Completions', method: 'POST', time: '2025-10-06 15:40', status: 429, latency: '—', ip: '203.150.1.10' },
]

const METHOD_COLORS = { GET: 'bg-blue-500', POST: 'bg-green-500', PUT: 'bg-yellow-500', DELETE: 'bg-red-500' }

function ServiceIcon({ domain, name, size = 20 }) {
  return (
    <img
      src={FAVICON_URL(domain)}
      alt={name}
      width={size}
      height={size}
      className="rounded"
      onError={(e) => { e.target.style.display = 'none' }}
    />
  )
}

export default function IntegrationsAPI() {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const handleSaveSettings = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast({ title: 'Settings Saved', description: 'Settings Saved' })
    }, 600)
  }
  const [keys, setKeys] = useState(INITIAL_KEYS)
  const [showKey, setShowKey] = useState({})
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [formData, setFormData] = useState({ service: '', name: '', key: '', env: 'production', permissions: [], rateLimit: 500 })
  const [rateLimitSettings, setRateLimitSettings] = useState({ enabled: true, defaultLimit: 1000, burstLimit: 1500, timeWindow: 60 })

  const toggleShow = (id) => setShowKey(prev => ({ ...prev, [id]: !prev[id] }))
  const maskKey = (key) => key.slice(0, 10) + '•'.repeat(18)

  const copyKey = (key) => {
    navigator.clipboard.writeText(key)
    toast({ title: 'Copied', description: 'API key copied to clipboard.' })
  }

  const handleSave = () => {
    if (!formData.service || !formData.name || !formData.key) {
      toast({ title: 'Missing fields', description: 'Please fill in all required fields.', variant: 'destructive' })
      return
    }
    const svc = SERVICES.find(s => s.id === formData.service)
    setKeys(prev => [...prev, {
      id: Date.now(), ...formData,
      status: 'active', createdAt: new Date().toISOString().split('T')[0], lastUsed: 'Never', requestCount: 0
    }])
    setFormData({ service: '', name: '', key: '', env: 'production', permissions: [], rateLimit: 500 })
    setShowAddDialog(false)
    toast({ title: 'API Key Added', description: `${formData.name} has been saved.` })
  }

  const handleRevoke = (id) => {
    setKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'revoked' } : k))
    toast({ title: 'Key Revoked' })
  }

  const handleRegenerate = (id) => {
    setKeys(prev => prev.map(k => {
      if (k.id !== id) return k
      const svc = SERVICES.find(s => s.id === k.service)
      return { ...k, key: `sk_${k.env === 'production' ? 'live' : 'test'}_${Math.random().toString(36).slice(2, 15)}${Math.random().toString(36).slice(2, 15)}` }
    }))
    toast({ title: 'Key Regenerated', description: 'A new API key has been generated.' })
  }

  const handleDelete = (id) => {
    setKeys(prev => prev.filter(k => k.id !== id))
    setDeleteTarget(null)
    toast({ title: 'Key Deleted' })
  }

  const togglePermission = (perm) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm) ? prev.permissions.filter(p => p !== perm) : [...prev.permissions, perm]
    }))
  }

  const activeCount = keys.filter(k => k.status === 'active').length
  const totalRequests = keys.reduce((s, k) => s + k.requestCount, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Management</h1>
          <p className="text-muted-foreground mt-2">Manage external service API keys, rate limiting, and monitor usage</p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add API Key
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Total Keys</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{keys.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Active Keys</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">{activeCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalRequests.toLocaleString()}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Default Rate Limit</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{rateLimitSettings.defaultLimit}/min</div></CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="keys">
        <TabsList>
          <TabsTrigger value="keys"><Key className="w-4 h-4 mr-2" />API Keys</TabsTrigger>
          <TabsTrigger value="logs"><BarChart3 className="w-4 h-4 mr-2" />Usage Logs</TabsTrigger>
          <TabsTrigger value="ratelimit"><Clock className="w-4 h-4 mr-2" />Rate Limiting</TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage authentication keys for external service integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {keys.map(k => {
                const svc = SERVICES.find(s => s.id === k.service)
                return (
                  <div key={k.id} className={`border rounded-lg p-4 space-y-3 ${k.status === 'revoked' ? 'opacity-60' : ''}`}>
                    {/* Row 1: Name + badges + actions */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        {svc && <ServiceIcon domain={svc.domain} name={svc.name} size={20} />}
                        <span className="font-semibold">{k.name}</span>
                        <Badge variant={k.status === 'active' ? 'default' : 'destructive'} className="text-xs">{k.status}</Badge>
                        <Badge variant="outline" className="text-xs">{k.env}</Badge>
                        {svc && <Badge variant="secondary" className="text-xs">{svc.category}</Badge>}
                      </div>
                      <div className="flex items-center gap-1">
                        {k.status === 'active' && (
                          <>
                            <Button variant="ghost" size="icon" title="Regenerate" onClick={() => handleRegenerate(k.id)}>
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleRevoke(k.id)}>Revoke</Button>
                          </>
                        )}
                        {svc?.docsUrl && (
                          <Button variant="ghost" size="icon" asChild title="Documentation" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                            <a href={svc.docsUrl} target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4" /></a>
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleteTarget(k)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Row 2: Key value */}
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-3 py-1.5 rounded font-mono flex-1">
                        {showKey[k.id] ? k.key : maskKey(k.key)}
                      </code>
                      <Button variant="ghost" size="icon" onClick={() => toggleShow(k.id)}>
                        {showKey[k.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => copyKey(k.key)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Row 3: Metadata columns */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Permissions</p>
                        <div className="flex gap-1 mt-0.5 flex-wrap">
                          {k.permissions.length > 0
                            ? k.permissions.map(p => <Badge key={p} variant="outline" className="text-xs">{p}</Badge>)
                            : <span className="text-xs text-muted-foreground">—</span>
                          }
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Rate Limit</p>
                        <p className="font-medium mt-0.5">{k.rateLimit}/min</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Last Used</p>
                        <p className="font-medium mt-0.5 text-xs">{k.lastUsed}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Requests</p>
                        <p className="font-medium mt-0.5">{k.requestCount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage Logs Tab */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Clock className="w-4 h-4" /> API Usage Logs</CardTitle>
              <CardDescription>Recent API calls across all integrated services</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Latency</TableHead>
                    <TableHead>IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {USAGE_LOGS.map(log => {
                    const svc = SERVICES.find(s => s.id === log.service)
                    return (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {svc && <ServiceIcon domain={svc.domain} name={svc.name} size={16} />}
                            <span className="font-medium text-sm">{svc?.name || log.service}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{log.endpoint}</TableCell>
                        <TableCell>
                          <span className={`text-white text-xs px-2 py-0.5 rounded font-mono ${METHOD_COLORS[log.method] || 'bg-gray-500'}`}>
                            {log.method}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{log.time}</TableCell>
                        <TableCell>
                          <Badge variant={log.status < 300 ? 'default' : log.status < 400 ? 'secondary' : 'destructive'} className="text-xs">
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{log.latency}</TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">{log.ip}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rate Limiting Tab */}
        <TabsContent value="ratelimit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rate Limiting</CardTitle>
              <CardDescription>Configure global rate limiting for all external API calls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Rate Limiting</p>
                  <p className="text-sm text-muted-foreground">Apply rate limits to all outbound API calls</p>
                </div>
                <Switch checked={rateLimitSettings.enabled} onCheckedChange={v => setRateLimitSettings(p => ({ ...p, enabled: v }))} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Default Rate Limit</Label>
                  <span className="text-sm font-medium">{rateLimitSettings.defaultLimit} req/min</span>
                </div>
                <Slider
                  value={[rateLimitSettings.defaultLimit]}
                  min={100} max={5000} step={100}
                  onValueChange={([v]) => setRateLimitSettings(p => ({ ...p, defaultLimit: v }))}
                  disabled={!rateLimitSettings.enabled}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Burst Limit</Label>
                  <span className="text-sm font-medium">{rateLimitSettings.burstLimit} req/min</span>
                </div>
                <Slider
                  value={[rateLimitSettings.burstLimit]}
                  min={100} max={10000} step={100}
                  onValueChange={([v]) => setRateLimitSettings(p => ({ ...p, burstLimit: v }))}
                  disabled={!rateLimitSettings.enabled}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Time Window</Label>
                  <span className="text-sm font-medium">{rateLimitSettings.timeWindow} seconds</span>
                </div>
                <Slider
                  value={[rateLimitSettings.timeWindow]}
                  min={10} max={300} step={10}
                  onValueChange={([v]) => setRateLimitSettings(p => ({ ...p, timeWindow: v }))}
                  disabled={!rateLimitSettings.enabled}
                />
              </div>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveSettings}>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Key Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add API Key</DialogTitle>
            <DialogDescription>Add a new external service API key</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Service</Label>
              <Select value={formData.service} onValueChange={v => setFormData(p => ({ ...p, service: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service..." />
                </SelectTrigger>
                <SelectContent>
                  {SERVICES.map(s => (
                    <SelectItem key={s.id} value={s.id}>
                      <div className="flex items-center gap-2">
                        <ServiceIcon domain={s.domain} name={s.name} size={16} />
                        {s.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Key Name</Label>
              <Input placeholder="e.g. Google Maps Production Key" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>API Key / Secret</Label>
              <Input type="password" placeholder="Paste your API key here" value={formData.key} onChange={e => setFormData(p => ({ ...p, key: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Environment</Label>
                <Select value={formData.env} onValueChange={v => setFormData(p => ({ ...p, env: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="sandbox">Sandbox</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Rate Limit (req/min)</Label>
                <Input type="number" value={formData.rateLimit} onChange={e => setFormData(p => ({ ...p, rateLimit: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Permissions</Label>
              <div className="flex gap-3">
                {['read', 'write', 'delete'].map(perm => (
                  <label key={perm} className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input type="checkbox" checked={formData.permissions.includes(perm)} onChange={() => togglePermission(perm)} />
                    {perm}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSave}>Save Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      {deleteTarget && (
        <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete API Key?</DialogTitle>
              <DialogDescription>
                <strong>{deleteTarget.name}</strong> will be permanently removed. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button size="sm" variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(deleteTarget.id)}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
