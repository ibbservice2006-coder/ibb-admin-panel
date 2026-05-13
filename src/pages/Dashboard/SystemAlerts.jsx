import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  RefreshCw,
  Download,
  Clock,
  Zap,
  Wrench,
  Phone
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useSystemAlerts } from '@/hooks/useDashboard'
import { ApiErrorBanner, ApiEmptyState } from '@/components/ApiErrorBanner'

const getSeverityIcon = (severity) => {
  switch (severity) {
    case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />
    case 'warning':  return <AlertCircle className="h-5 w-5 text-yellow-600" />
    case 'info':     return <Info className="h-5 w-5 text-blue-600" />
    default:         return <CheckCircle2 className="h-5 w-5 text-green-600" />
  }
}

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'critical': return 'border-l-red-500 bg-red-50'
    case 'warning':  return 'border-l-yellow-500 bg-yellow-50'
    case 'info':     return 'border-l-blue-500 bg-blue-50'
    default:         return 'border-l-green-500 bg-green-50'
  }
}

const getSeverityBadge = (severity) => {
  switch (severity) {
    case 'critical': return <Badge className="bg-red-100 text-red-800 border-none">Critical</Badge>
    case 'warning':  return <Badge className="bg-yellow-100 text-yellow-800 border-none">Warning</Badge>
    case 'info':     return <Badge className="bg-blue-100 text-blue-800 border-none">Info</Badge>
    default:         return <Badge className="bg-green-100 text-green-800 border-none">OK</Badge>
  }
}

function AlertCard({ alert }) {
  return (
    <div className={`border-l-4 ${getSeverityColor(alert.severity)} p-4 rounded-lg hover:shadow-sm transition-shadow`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{getSeverityIcon(alert.severity)}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-sm">{alert.title}</h4>
            {getSeverityBadge(alert.severity)}
          </div>
          <p className="text-sm text-muted-foreground mb-2">{alert.detail}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            {alert.minutesWaiting != null && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Waiting {alert.minutesWaiting} min
              </span>
            )}
            {alert.minutesOnTrip != null && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                On trip {alert.minutesOnTrip} min
              </span>
            )}
            {alert.phone && (
              <a href={`tel:${alert.phone}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                <Phone className="h-3 w-3" />
                {alert.phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SystemAlerts() {
  const { toast } = useToast()
  const { data, isLoading, isError, refetch, isFetching } = useSystemAlerts()

  const alerts   = data?.alerts  ?? []
  const summary  = data?.summary ?? { total: 0, critical: 0, warning: 0, info: 0 }

  const criticalAlerts = alerts.filter(a => a.severity === 'critical')
  const warningAlerts  = alerts.filter(a => a.severity === 'warning')
  const infoAlerts     = alerts.filter(a => a.severity === 'info')

  const handleExport = () => {
    const rows = [
      ['ID', 'Type', 'Severity', 'Title', 'Detail'],
      ...alerts.map(a => [a.id, a.type, a.severity, a.title, a.detail])
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'system_alerts.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: 'Exported', description: 'CSV downloaded successfully' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Alerts</h1>
          <p className="text-muted-foreground mt-1">System notifications and alerts management</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {isError && <ApiErrorBanner onRetry={refetch} />}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
                <h3 className="text-2xl font-bold mt-1">{isLoading ? '—' : summary.critical}</h3>
              </div>
              <div className="p-2 rounded-lg bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Warnings</p>
                <h3 className="text-2xl font-bold mt-1">{isLoading ? '—' : summary.warning}</h3>
              </div>
              <div className="p-2 rounded-lg bg-yellow-50">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Info Alerts</p>
                <h3 className="text-2xl font-bold mt-1">{isLoading ? '—' : summary.info}</h3>
              </div>
              <div className="p-2 rounded-lg bg-blue-50">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Active</p>
                <h3 className="text-2xl font-bold mt-1">{isLoading ? '—' : summary.total}</h3>
              </div>
              <div className="p-2 rounded-lg bg-slate-50">
                <Zap className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Tabs */}
      <Tabs defaultValue="critical" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="critical" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Critical ({criticalAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="warning" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Warnings ({warningAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="info" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Fleet ({infoAlerts.length})
          </TabsTrigger>
        </TabsList>

        {/* Critical Alerts */}
        <TabsContent value="critical" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Critical Alerts</CardTitle>
              <CardDescription>Pending bookings waiting longer than 30 minutes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {criticalAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No critical alerts</p>
                </div>
              ) : (
                criticalAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Warning Alerts */}
        <TabsContent value="warning" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Warning Alerts</CardTitle>
              <CardDescription>Pending bookings over 20 min, trips running longer than 4 hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {warningAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No warnings</p>
                </div>
              ) : (
                warningAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fleet / Info Alerts */}
        <TabsContent value="info" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Fleet Maintenance</CardTitle>
              <CardDescription>Vehicles currently in maintenance status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {infoAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No fleet alerts</p>
                </div>
              ) : (
                infoAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
