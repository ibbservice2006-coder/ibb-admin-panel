import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link2, Key, Webhook, RefreshCw, CheckCircle, XCircle, Save, Copy, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function IntegrationSettings() {
  const { toast } = useToast()
  const [showKey, setShowKey] = useState({})

  const toggleShow = (id) => setShowKey(prev => ({...prev, [id]: !prev[id]}))
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast({ title: "Copied", description: "Copied to clipboard." })
  }

  const integrations = [
    { id: "google_maps", name: "Google Maps", category: "Maps", status: "connected", icon: "🗺️", desc: "Route planning and geocoding" },
    { id: "twilio", name: "Twilio SMS", category: "SMS", status: "connected", icon: "📱", desc: "SMS notifications to customers" },
    { id: "sendgrid", name: "SendGrid", category: "Email", status: "connected", icon: "📧", desc: "Transactional email delivery" },
    { id: "firebase", name: "Firebase FCM", category: "Push", status: "connected", icon: "🔔", desc: "Push notifications" },
    { id: "stripe", name: "Stripe", category: "Payment", status: "connected", icon: "💳", desc: "Card payment processing" },
    { id: "omise", name: "Omise", category: "Payment", status: "connected", icon: "🏦", desc: "Thai payment gateway" },
    { id: "slack", name: "Slack", category: "Alerts", status: "disconnected", icon: "💬", desc: "Team alerts and notifications" },
    { id: "zapier", name: "Zapier", category: "Automation", status: "disconnected", icon: "⚡", desc: "Workflow automation" },
    { id: "quickbooks", name: "QuickBooks", category: "Accounting", status: "disconnected", icon: "📊", desc: "Accounting integration" },
    { id: "hubspot", name: "HubSpot CRM", category: "CRM", status: "disconnected", icon: "🎯", desc: "Customer relationship management" },
  ]

  const apiKeys = [
    { id: "api_main", name: "Main API Key", key: "sk_live_masked", created: "Jan 1, 2025", lastUsed: "Today" },
    { id: "api_readonly", name: "Read-Only Key", key: "sk_ro_iBB_xxxxxxxxxxxxxxxxxxxx", created: "Mar 1, 2025", lastUsed: "Yesterday" },
    { id: "api_webhook", name: "Webhook Secret", key: "whsec_iBBxxxxxxxxxxxxxxxxxxxxxxxx", created: "Jan 1, 2025", lastUsed: "Today" },
  ]

  const webhooks = [
    { id: 1, event: "booking.created", url: "https://partner.example.com/webhooks/booking", active: true, lastTriggered: "5 mins ago" },
    { id: 2, event: "payment.completed", url: "https://accounting.example.com/webhooks/pay", active: true, lastTriggered: "1 hour ago" },
    { id: 3, event: "booking.cancelled", url: "https://crm.example.com/webhooks/cancel", active: false, lastTriggered: "3 days ago" },
  ]

  const handleSave = (s) => toast({ title: "Saved", description: s + " updated." })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integrations & API</h1>
        <p className="text-muted-foreground">Connect external services, manage API keys, and configure webhooks</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Connected", value: integrations.filter(i => i.status === "connected").length, icon: CheckCircle, bg: "bg-green-100", ic: "text-green-600" },
          { label: "Disconnected", value: integrations.filter(i => i.status === "disconnected").length, icon: XCircle, bg: "bg-red-100", ic: "text-red-600" },
          { label: "API Keys", value: apiKeys.length, icon: Key, bg: "bg-blue-100", ic: "text-blue-600" },
          { label: "Webhooks", value: webhooks.length, icon: Webhook, bg: "bg-purple-100", ic: "text-purple-600" },
        ].map(s => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
              <div className={"p-2 rounded-lg " + s.bg}><s.icon className={"h-4 w-4 " + s.ic} /></div>
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{s.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="integrations">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="apikeys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="mt-4">
          <div className="grid gap-3 md:grid-cols-2">
            {integrations.map(i => (
              <Card key={i.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{i.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{i.name}</p>
                          <Badge variant="outline" className="text-xs">{i.category}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{i.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {i.status === "connected"
                        ? <Badge className="bg-green-100 text-green-700 border-green-200">Connected</Badge>
                        : <Badge variant="secondary">Disconnected</Badge>
                      }
                      <Button size="sm" variant={i.status === "connected" ? "outline" : "default"} onClick={() => toast({ title: i.status === 'connected' ? `Configure ${i.name}` : `Connect ${i.name}`, description: i.status === 'connected' ? 'Open settings...' : 'Connected...' })}>
                        {i.status === "connected" ? "Configure" : "Connect"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="apikeys" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><Key className="h-5 w-5" /> API Keys</CardTitle>
                  <CardDescription>Manage API keys for external integrations</CardDescription>
                </div>
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { const key = 'sk_' + Math.random().toString(36).substr(2, 32); toast({ title: 'API Key Generated', description: `Key: ${key.substr(0, 16)}...` }) }}><Key className="mr-2 h-4 w-4" />Generate New Key</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {apiKeys.map(k => (
                  <div key={k.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{k.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Created {k.created}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">Last used {k.lastUsed}</span>
                        <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => toast({ title: 'Key Revoked', description: `API Key: ${k.name} has been revoked`, variant: 'destructive' })}>Revoke</Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input readOnly value={showKey[k.id] ? k.key : k.key.replace(/[^_]/g, "•").slice(0, 30) + "..."} className="font-mono text-sm" />
                      <Button size="icon" variant="ghost" onClick={() => toggleShow(k.id)}>
                        {showKey[k.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => copyToClipboard(k.key)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><Webhook className="h-5 w-5" /> Webhooks</CardTitle>
                  <CardDescription>Configure webhook endpoints for real-time event notifications</CardDescription>
                </div>
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => toast({ title: 'Add Webhook', description: 'New Webhook endpoint added successfully' })}><Link2 className="mr-2 h-4 w-4" />Add Webhook</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {webhooks.map(w => (
                  <div key={w.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">{w.event}</Badge>
                        <span className="text-xs text-muted-foreground">Last: {w.lastTriggered}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={w.active} />
                        <Button size="sm" variant="ghost" onClick={() => toast({ title: 'Webhook Tested', description: `${w.event} test completed` })}><RefreshCw className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    <Input readOnly value={w.url} className="font-mono text-xs" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
