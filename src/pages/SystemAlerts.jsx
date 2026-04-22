import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, AlertCircle, CheckCircle, Info } from 'lucide-react'

export default function SystemAlerts() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Alerts</h1>
        <p className="text-muted-foreground mt-2">System alerts and notifications</p>
      </div>

      {/* Alert Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Requires immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warning</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Info</CardTitle>
            <Info className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Informational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
          <CardDescription>Current system alerts and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start justify-between p-4 border rounded-lg bg-red-50">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">Database Connection Failed</p>
                  <p className="text-sm text-red-700">Unable to connect to primary database. Failover activated.</p>
                  <p className="text-xs text-red-600 mt-1">2 min ago</p>
                </div>
              </div>
              <Badge className="bg-red-600">Critical</Badge>
            </div>

            <div className="flex items-start justify-between p-4 border rounded-lg bg-red-50">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">High Memory Usage</p>
                  <p className="text-sm text-red-700">Server memory usage at 92%. Consider scaling up.</p>
                  <p className="text-xs text-red-600 mt-1">5 min ago</p>
                </div>
              </div>
              <Badge className="bg-red-600">Critical</Badge>
            </div>

            <div className="flex items-start justify-between p-4 border rounded-lg bg-orange-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-900">SSL Certificate Expiring</p>
                  <p className="text-sm text-orange-700">Certificate expires in 30 days. Renewal recommended.</p>
                  <p className="text-xs text-orange-600 mt-1">1 hour ago</p>
                </div>
              </div>
              <Badge className="bg-orange-600">Warning</Badge>
            </div>

            <div className="flex items-start justify-between p-4 border rounded-lg bg-orange-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-900">Slow Query Detected</p>
                  <p className="text-sm text-orange-700">Query execution time exceeded threshold. Check logs.</p>
                  <p className="text-xs text-orange-600 mt-1">2 hours ago</p>
                </div>
              </div>
              <Badge className="bg-orange-600">Warning</Badge>
            </div>

            <div className="flex items-start justify-between p-4 border rounded-lg bg-blue-50">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Backup Completed</p>
                  <p className="text-sm text-blue-700">Daily backup completed successfully. 45.2 GB backed up.</p>
                  <p className="text-xs text-blue-600 mt-1">3 hours ago</p>
                </div>
              </div>
              <Badge className="bg-blue-600">Info</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
