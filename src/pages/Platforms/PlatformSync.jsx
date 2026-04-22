import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Clock, Settings, Activity, Zap } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const syncConfigs = [
  { id: 1, platform: 'Shopee', zone: 'SE Asia', status: 'active', interval: '15 min', lastSync: '3 min ago', nextSync: '12 min', syncTypes: ['Orders', 'Status', 'Inventory'], webhookEnabled: true, successRate: 99.2 },
  { id: 2, platform: 'Lazada', zone: 'SE Asia', status: 'active', interval: '15 min', lastSync: '8 min ago', nextSync: '7 min', syncTypes: ['Orders', 'Status'], webhookEnabled: true, successRate: 98.7 },
  { id: 3, platform: 'Klook', zone: 'SE Asia', status: 'active', interval: '30 min', lastSync: '12 min ago', nextSync: '18 min', syncTypes: ['Orders', 'Status', 'Availability'], webhookEnabled: true, successRate: 99.5 },
  { id: 4, platform: 'TikTok Shop', zone: 'SE Asia', status: 'active', interval: '15 min', lastSync: '5 min ago', nextSync: '10 min', syncTypes: ['Orders', 'Status', 'Inventory'], webhookEnabled: true, successRate: 97.8 },
  { id: 5, platform: 'Amazon', zone: 'Global', status: 'active', interval: '30 min', lastSync: '15 min ago', nextSync: '15 min', syncTypes: ['Orders', 'Status', 'Pricing'], webhookEnabled: true, successRate: 99.8 },
  { id: 6, platform: 'Booking.com', zone: 'Global', status: 'active', interval: '10 min', lastSync: '2 min ago', nextSync: '8 min', syncTypes: ['Orders', 'Status', 'Availability', 'Pricing'], webhookEnabled: true, successRate: 99.9 },
  { id: 7, platform: 'GetYourGuide', zone: 'Global', status: 'active', interval: '30 min', lastSync: '20 min ago', nextSync: '10 min', syncTypes: ['Orders', 'Status'], webhookEnabled: false, successRate: 98.1 },
  { id: 8, platform: 'Ctrip', zone: 'China', status: 'active', interval: '15 min', lastSync: '4 min ago', nextSync: '11 min', syncTypes: ['Orders', 'Status', 'Availability'], webhookEnabled: true, successRate: 98.9 },
  { id: 9, platform: 'Fliggy', zone: 'China', status: 'warning', interval: '30 min', lastSync: '3 hr ago', nextSync: 'Paused', syncTypes: ['Orders', 'Status'], webhookEnabled: false, successRate: 87.3 },
  { id: 10, platform: 'Noon', zone: 'Middle East', status: 'active', interval: '30 min', lastSync: '25 min ago', nextSync: '5 min', syncTypes: ['Orders', 'Status'], webhookEnabled: true, successRate: 97.6 },
  { id: 11, platform: 'Ozon', zone: 'Russia', status: 'active', interval: '60 min', lastSync: '35 min ago', nextSync: '25 min', syncTypes: ['Orders', 'Status', 'Pricing'], webhookEnabled: true, successRate: 96.4 },
  { id: 12, platform: 'Wildberries', zone: 'Russia', status: 'active', interval: '60 min', lastSync: '45 min ago', nextSync: '15 min', syncTypes: ['Orders', 'Status'], webhookEnabled: false, successRate: 95.8 },
]

const webhookLogs = [
  { id: 1, platform: 'Shopee', event: 'order.created', orderId: 'SPE-88291034', status: 'success', time: '2 min ago' },
  { id: 2, platform: 'Booking.com', event: 'booking.confirmed', orderId: 'BKG-55291038', status: 'success', time: '5 min ago' },
  { id: 3, platform: 'Ctrip', event: 'order.status_update', orderId: 'CTP-77382910', status: 'success', time: '8 min ago' },
  { id: 4, platform: 'Fliggy', event: 'order.created', orderId: 'FLG-33291847', status: 'failed', time: '3 hr ago' },
  { id: 5, platform: 'Amazon', event: 'order.created', orderId: 'AMZ-99283746', status: 'success', time: '15 min ago' },
  { id: 6, platform: 'Lazada', event: 'order.cancelled', orderId: 'LZD-11293847', status: 'success', time: '22 min ago' },
  { id: 7, platform: 'Noon', event: 'order.created', orderId: 'NON-44182736', status: 'success', time: '28 min ago' },
  { id: 8, platform: 'Ozon', event: 'order.status_update', orderId: 'OZN-33291847', status: 'success', time: '35 min ago' },
]

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  warning: { label: 'Warning', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  paused: { label: 'Paused', color: 'bg-gray-100 text-gray-600', icon: Clock },
}

const zoneColors = {
  'SE Asia': 'bg-orange-100 text-orange-700',
  'Global': 'bg-blue-100 text-blue-700',
  'China': 'bg-red-100 text-red-700',
  'Middle East': 'bg-yellow-100 text-yellow-800',
  'Russia': 'bg-purple-100 text-purple-700',
}

export default function PlatformSync() {
  const [configs, setConfigs] = useState(syncConfigs)
  const { toast } = useToast()

  const activeCount = configs.filter(c => c.status === 'active').length
  const avgSuccessRate = (configs.reduce((s, c) => s + c.successRate, 0) / configs.length).toFixed(1)
  const webhookCount = configs.filter(c => c.webhookEnabled).length

  const handleSyncNow = (id) => {
    setConfigs(prev => prev.map(c => c.id === id ? { ...c, lastSync: 'Just now', status: 'active' } : c))
    toast({ title: 'Manual Sync Triggered' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-100 border border-indigo-200">
            <RefreshCw className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Platform Sync</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Auto Sync, Webhook & Logs Setup for All Platforms</p>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={() => toast({ title: 'Syncing All Platforms...' })}>
          <Zap className="h-4 w-4 mr-2" />Sync All Now
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">Active Syncs</p>
          <p className="text-2xl font-bold text-green-600">{activeCount}/{configs.length}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">Avg Success Rate</p>
          <p className="text-2xl font-bold text-blue-600">{avgSuccessRate}%</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">Webhook Enabled</p>
          <p className="text-2xl font-bold">{webhookCount}/{configs.length}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground">Recent Events (24h)</p>
          <p className="text-2xl font-bold">{webhookLogs.length}</p>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sync Config Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="h-4 w-4" />Sync Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left p-3 font-medium">Platform</th>
                      <th className="text-left p-3 font-medium">Zone</th>
                      <th className="text-left p-3 font-medium">Interval</th>
                      <th className="text-left p-3 font-medium">Sync Types</th>
                      <th className="text-left p-3 font-medium">Webhook</th>
                      <th className="text-right p-3 font-medium">Success Rate</th>
                      <th className="text-left p-3 font-medium">Last / Next</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {configs.map(c => {
                      const sc = statusConfig[c.status] || statusConfig.active
                      const StatusIcon = sc.icon
                      return (
                        <tr key={c.id} className="border-b hover:bg-muted/20">
                          <td className="p-3 font-medium">{c.platform}</td>
                          <td className="p-3"><Badge className={`text-xs ${zoneColors[c.zone]}`}>{c.zone}</Badge></td>
                          <td className="p-3 text-muted-foreground">{c.interval}</td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {c.syncTypes.map(t => <span key={t} className="text-xs bg-indigo-50 text-indigo-700 rounded px-1.5 py-0.5">{t}</span>)}
                            </div>
                          </td>
                          <td className="p-3">
                            {c.webhookEnabled
                              ? <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle className="h-3 w-3" />On</span>
                              : <span className="text-xs text-gray-400 flex items-center gap-1"><XCircle className="h-3 w-3" />Off</span>}
                          </td>
                          <td className="p-3 text-right">
                            <span className={`font-medium ${c.successRate >= 99 ? 'text-green-600' : c.successRate >= 95 ? 'text-blue-600' : 'text-yellow-600'}`}>
                              {c.successRate}%
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="text-xs text-muted-foreground">{c.lastSync}</div>
                            <div className="text-xs text-blue-600">Next: {c.nextSync}</div>
                          </td>
                          <td className="p-3">
                            <Badge className={`text-xs ${sc.color}`}><StatusIcon className="h-3 w-3 mr-1" />{sc.label}</Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleSyncNow(c.id)}>
                                <RefreshCw className="h-3 w-3 mr-1" />Now
                              </Button>
                              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => toast({ title: 'Platform Config', description: 'Platform settings page opened' })}>
                                <Settings className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Webhook Logs */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4" />Webhook Event Logs (Recent)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left p-3 font-medium">Platform</th>
                    <th className="text-left p-3 font-medium">Event</th>
                    <th className="text-left p-3 font-medium">Order ID</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {webhookLogs.map(log => (
                    <tr key={log.id} className="border-b hover:bg-muted/20">
                      <td className="p-3 font-medium">{log.platform}</td>
                      <td className="p-3 font-mono text-xs text-blue-700">{log.event}</td>
                      <td className="p-3 font-mono text-xs">{log.orderId}</td>
                      <td className="p-3">
                        {log.status === 'success'
                          ? <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Success</span>
                          : <span className="text-xs text-red-600 flex items-center gap-1"><XCircle className="h-3 w-3" />Failed</span>}
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
