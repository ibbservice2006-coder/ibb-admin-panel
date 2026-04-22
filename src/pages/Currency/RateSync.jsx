import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, CheckCircle, XCircle, Clock, Settings, Play, AlertTriangle, Wifi, WifiOff } from 'lucide-react'

const syncSources = [
  { id: 1, name: 'Open Exchange Rates', url: 'https://openexchangerates.org/api', status: 'active', priority: 1, lastSync: '2026-03-24 08:00', nextSync: '2026-03-24 14:00', success: true, latency: 245 },
  { id: 2, name: 'Exchange Rate API',   url: 'https://v6.exchangerate-api.com',   status: 'active', priority: 2, lastSync: '2026-03-24 08:00', nextSync: '2026-03-24 14:00', success: true, latency: 312 },
  { id: 3, name: 'Fixer.io',            url: 'https://data.fixer.io/api',          status: 'standby',priority: 3, lastSync: '2026-03-23 08:00', nextSync: '-',               success: true, latency: 0 },
]

const syncSchedules = [
  { id: 1, label: 'Every 6 hours',  value: '6h',  active: true },
  { id: 2, label: 'Every 12 hours', value: '12h', active: false },
  { id: 3, label: 'Every 24 hours', value: '24h', active: false },
  { id: 4, label: 'Manual only',    value: 'manual', active: false },
]

const recentSyncs = [
  { id: 1, time: '2026-03-24 08:00', source: 'Open Exchange Rates', currencies: 13, status: 'success', duration: 245 },
  { id: 2, time: '2026-03-24 02:00', source: 'Open Exchange Rates', currencies: 13, status: 'success', duration: 231 },
  { id: 3, time: '2026-03-23 20:00', source: 'Open Exchange Rates', currencies: 13, status: 'success', duration: 289 },
  { id: 4, time: '2026-03-23 14:00', source: 'Open Exchange Rates', currencies: 13, status: 'failed',  duration: 0 },
  { id: 5, time: '2026-03-23 14:05', source: 'Exchange Rate API',   currencies: 13, status: 'success', duration: 312 },
  { id: 6, time: '2026-03-23 08:00', source: 'Open Exchange Rates', currencies: 13, status: 'success', duration: 198 },
]

export default function RateSync() {
  const { toast } = useToast()
  const [sources, setSources] = useState(syncSources)
  const [schedules, setSchedules] = useState(syncSchedules)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [apiKey, setApiKey] = useState('••••••••••••••••••••••••')
  const [showKey, setShowKey] = useState(false)

  const handleSaveConfig = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast({ title: 'Configuration Saved', description: 'API Key and settings saved successfully' })
    }, 700)
  }

  const handleManualSync = () => {
    setIsSyncing(true)
    setTimeout(() => setIsSyncing(false), 2000)
  }

  const handleSetActiveSchedule = (id) => {
    setSchedules(prev => prev.map(s => ({ ...s, active: s.id === id })))
  }

  const stats = {
    successRate: Math.round((recentSyncs.filter(s => s.status === 'success').length / recentSyncs.length) * 100),
    avgLatency: Math.round(recentSyncs.filter(s => s.status === 'success').reduce((a, b) => a + b.duration, 0) / recentSyncs.filter(s => s.status === 'success').length),
    lastSync: recentSyncs[0].time,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rate Sync</h1>
          <p className="text-muted-foreground text-sm mt-1">Set auto Sync exchange rates from External API</p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white gap-2" onClick={handleManualSync} disabled={isSyncing}>
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50"><CheckCircle className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{stats.successRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50"><Clock className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Latency</p>
                <p className="text-2xl font-bold">{stats.avgLatency}<span className="text-sm font-normal ml-1">ms</span></p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50"><RefreshCw className="h-5 w-5 text-purple-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Last Sync</p>
                <p className="text-sm font-bold">{stats.lastSync}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sync Sources */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Wifi className="h-4 w-4 text-blue-500" />
              Sync Sources
            </CardTitle>
            <CardDescription>Exchange rate sources (by priority)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sources.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                <div className={`p-1.5 rounded-full ${s.success ? 'bg-green-100' : 'bg-red-100'}`}>
                  {s.success ? <Wifi className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{s.name}</p>
                    <Badge variant={s.status === 'active' ? 'default' : 'secondary'} className="text-xs shrink-0">
                      {s.status === 'active' ? 'Active' : 'Standby'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{s.url}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Last: {s.lastSync} {s.latency > 0 && `· ${s.latency}ms`}
                  </p>
                </div>
                <div className="text-xs font-medium text-muted-foreground shrink-0">
                  P{s.priority}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Sync Schedule */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" />
                Sync Schedule
              </CardTitle>
              <CardDescription>Exchange rate Sync frequency</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {schedules.map(s => (
                <button key={s.id} onClick={() => handleSetActiveSchedule(s.id)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors text-left ${s.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-muted/50'}`}>
                  {s.active && <CheckCircle className="h-3.5 w-3.5 mb-1" />}
                  {s.label}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="h-4 w-4 text-gray-500" />
                API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Primary API Key</label>
                <div className="flex gap-2">
                  <Input type={showKey ? 'text' : 'password'} value={apiKey}
                    onChange={e => setApiKey(e.target.value)} className="font-mono text-sm" />
                  <Button variant="outline" size="sm" onClick={() => setShowKey(!showKey)} className="shrink-0">
                    {showKey ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Base Currency</label>
                <Input value="THB (Thai Baht)" disabled className="bg-muted/50 text-sm" />
              </div>
              <Button variant="outline" size="sm" className="w-full gap-2" onClick={handleSaveConfig} disabled={isSaving}>
                <Settings className={`h-4 w-4 ${isSaving ? 'animate-spin' : ''}`} /> {isSaving ? 'Saving...' : 'Save Configuration'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Sync Log */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Sync Log</CardTitle>
          <CardDescription>Last Sync History</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Time</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Source</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Currencies</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Duration</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSyncs.map(s => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.time}</td>
                    <td className="px-4 py-3 text-sm">{s.source}</td>
                    <td className="px-4 py-3 text-center text-sm">{s.currencies}</td>
                    <td className="px-4 py-3 text-right text-sm font-mono">
                      {s.status === 'success' ? `${s.duration}ms` : '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {s.status === 'success'
                        ? <span className="flex items-center justify-center gap-1 text-xs text-green-600"><CheckCircle className="h-3.5 w-3.5" /> Success</span>
                        : <span className="flex items-center justify-center gap-1 text-xs text-red-500"><XCircle className="h-3.5 w-3.5" /> Failed</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
