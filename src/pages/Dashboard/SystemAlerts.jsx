import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  Trash2,
  Archive,
  RefreshCw,
  Download,
  Clock,
  Zap,
  Shield,
  Wrench
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Mock data for alerts
const criticalAlerts = [
  {
    id: 'ALERT-001',
    type: 'gps-offline',
    title: 'GPS Offline - VAN-12',
    description: 'Vehicle GPS has been offline for 8 minutes. Driver may be in a dead zone.',
    severity: 'critical',
    timestamp: '2 minutes ago',
    vehicle: 'VAN-12',
    driver: 'Somchai P.'
  },
  {
    id: 'ALERT-002',
    type: 'accident-detected',
    title: 'Potential Accident - CAR-08',
    description: 'Sudden deceleration detected. Driver may have encountered an accident.',
    severity: 'critical',
    timestamp: '5 minutes ago',
    vehicle: 'CAR-08',
    driver: 'Arun K.'
  }
]

const warningAlerts = [
  {
    id: 'ALERT-003',
    type: 'surge-pricing',
    title: 'High Surge Pricing Active',
    description: 'Surge pricing is now 1.8x due to high demand in downtown area.',
    severity: 'warning',
    timestamp: '10 minutes ago',
    zone: 'Downtown'
  },
  {
    id: 'ALERT-004',
    type: 'low-fuel',
    title: 'Low Fuel Level - BUS-03',
    description: 'Vehicle fuel level is below 20%. Recommend refueling soon.',
    severity: 'warning',
    timestamp: '15 minutes ago',
    vehicle: 'BUS-03',
    fuelLevel: '18%'
  },
  {
    id: 'ALERT-005',
    type: 'maintenance-due',
    title: 'Maintenance Reminder - BUS-05',
    description: 'Vehicle is due for scheduled maintenance in 500 km.',
    severity: 'warning',
    timestamp: '1 hour ago',
    vehicle: 'BUS-05',
    nextMaintenance: '500 km'
  }
]

const infoAlerts = [
  {
    id: 'ALERT-006',
    type: 'system-update',
    title: 'System Update Available',
    description: 'A new version of the admin panel is available. Update recommended.',
    severity: 'info',
    timestamp: '3 hours ago',
    version: 'v2.1.0'
  },
  {
    id: 'ALERT-007',
    type: 'new-feature',
    title: 'New Feature: Real-time Analytics',
    description: 'Real-time analytics dashboard is now available for all users.',
    severity: 'info',
    timestamp: '5 hours ago'
  }
]

const getSeverityIcon = (severity) => {
  switch (severity) {
    case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />
    case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />
    case 'info': return <Info className="h-5 w-5 text-blue-600" />
    default: return <CheckCircle2 className="h-5 w-5 text-green-600" />
  }
}

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'critical': return 'border-l-red-500 bg-red-50'
    case 'warning': return 'border-l-yellow-500 bg-yellow-50'
    case 'info': return 'border-l-blue-500 bg-blue-50'
    default: return 'border-l-green-500 bg-green-50'
  }
}

const getSeverityBadge = (severity) => {
  switch (severity) {
    case 'critical': return <Badge className="bg-red-100 text-red-800 border-none">Critical</Badge>
    case 'warning': return <Badge className="bg-yellow-100 text-yellow-800 border-none">Warning</Badge>
    case 'info': return <Badge className="bg-blue-100 text-blue-800 border-none">Info</Badge>
    default: return <Badge className="bg-green-100 text-green-800 border-none">Resolved</Badge>
  }
}

const AlertCard = ({ alert }) => (
  <div className={`border-l-4 ${getSeverityColor(alert.severity)} p-4 rounded-lg hover:shadow-sm transition-shadow`}>
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex-shrink-0">
        {getSeverityIcon(alert.severity)}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-bold text-sm">{alert.title}</h4>
          {getSeverityBadge(alert.severity)}
        </div>
        <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {alert.timestamp}
          </span>
          {alert.vehicle && <span>Vehicle: <span className="font-medium">{alert.vehicle}</span></span>}
          {alert.driver && <span>Driver: <span className="font-medium">{alert.driver}</span></span>}
          {alert.zone && <span>Zone: <span className="font-medium">{alert.zone}</span></span>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-100" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
          <AlertCircle className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" className="text-slate-400 hover:bg-slate-100" onClick={() => toast({ title: 'Archived', description: 'Archived successfully' })}>
          <Archive className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
)

export default function SystemAlerts() {
  const { toast } = useToast()
  const handleExport = () => {
    const rows = [['#', 'Data', 'Value', 'Date']]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ibb_export.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: 'Exported', description: 'CSV downloaded successfully' })
  }
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast({ title: 'Alerts Updated', description: 'Latest alerts have been loaded.' })
  }

  const handleClearAll = () => {
    toast({ title: 'Alerts Cleared', description: 'All alerts have been archived.' })
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
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
                <h3 className="text-2xl font-bold mt-1">{criticalAlerts.length}</h3>
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
                <h3 className="text-2xl font-bold mt-1">{warningAlerts.length}</h3>
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
                <h3 className="text-2xl font-bold mt-1">{infoAlerts.length}</h3>
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
                <h3 className="text-2xl font-bold mt-1">{criticalAlerts.length + warningAlerts.length + infoAlerts.length}</h3>
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
            <Info className="h-4 w-4" />
            Info ({infoAlerts.length})
          </TabsTrigger>
        </TabsList>

        {/* Critical Alerts */}
        <TabsContent value="critical" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Critical Alerts</CardTitle>
                <CardDescription>Urgent alerts requiring immediate attention</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleClearAll}>Clear All</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {criticalAlerts.length > 0 ? (
                criticalAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No critical alerts at the moment</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Warning Alerts */}
        <TabsContent value="warning" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Warning Alerts</CardTitle>
                <CardDescription>Alerts that need attention but not critical</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleClearAll}>Clear All</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {warningAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Info Alerts */}
        <TabsContent value="info" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Information Alerts</CardTitle>
                <CardDescription>System notifications and updates</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleClearAll}>Clear All</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {infoAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
