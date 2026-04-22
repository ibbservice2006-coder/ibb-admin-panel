import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { Download, Truck, Wrench, Fuel, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const fleetUtilization = [
  { month: 'Oct', car: 72.4, van9: 84.2, van12: 78.6, minibus: 65.8, bus: 58.2 },
  { month: 'Nov', car: 74.8, van9: 86.5, van12: 80.2, minibus: 68.4, bus: 60.5 },
  { month: 'Dec', car: 82.1, van9: 92.4, van12: 88.5, minibus: 76.2, bus: 68.8 },
  { month: 'Jan', car: 70.2, van9: 82.8, van12: 76.4, minibus: 64.2, bus: 56.8 },
  { month: 'Feb', car: 75.6, van9: 87.2, van12: 81.8, minibus: 70.4, bus: 62.2 },
  { month: 'Mar', car: 78.4, van9: 89.6, van12: 84.2, minibus: 72.8, bus: 64.5 },
]

const vehicleStatus = [
  { status: 'Active', count: 48, color: '#10b981' },
  { status: 'On Trip', count: 18, color: '#3b82f6' },
  { status: 'Maintenance', count: 7, color: '#f59e0b' },
  { status: 'Inactive', count: 4, color: '#94a3b8' },
]

const maintenanceCosts = [
  { month: 'Oct', scheduled: 28500, unscheduled: 12400 },
  { month: 'Nov', scheduled: 31200, unscheduled: 8600 },
  { month: 'Dec', scheduled: 26800, unscheduled: 15200 },
  { month: 'Jan', scheduled: 29400, unscheduled: 9800 },
  { month: 'Feb', scheduled: 32100, unscheduled: 7400 },
  { month: 'Mar', scheduled: 28900, unscheduled: 6200 },
]

const fuelConsumption = [
  { month: 'Oct', total: 18420, avgPerTrip: 10.1, cost: 1105200 },
  { month: 'Nov', total: 20650, avgPerTrip: 10.1, cost: 1239000 },
  { month: 'Dec', total: 26480, avgPerTrip: 10.0, cost: 1588800 },
  { month: 'Jan', total: 21840, avgPerTrip: 10.0, cost: 1310400 },
  { month: 'Feb', total: 24210, avgPerTrip: 10.0, cost: 1452600 },
  { month: 'Mar', total: 27640, avgPerTrip: 10.0, cost: 1658400 },
]

const vehicleFleet = [
  { type: 'Car 4 Seats', total: 18, active: 16, maintenance: 2, utilization: 78.4, avgAge: 2.4 },
  { type: 'Van 9 Seats', total: 24, active: 22, maintenance: 2, utilization: 89.6, avgAge: 2.1 },
  { type: 'Van 12 Seats', total: 16, active: 14, maintenance: 2, utilization: 84.2, avgAge: 2.8 },
  { type: 'Minibus 20', total: 10, active: 9, maintenance: 1, utilization: 72.8, avgAge: 3.2 },
  { type: 'Bus 40+', total: 9, active: 8, maintenance: 1, utilization: 64.5, avgAge: 4.1 },
]

const upcomingMaintenance = [
  { vehicle: 'VAN-009', type: 'Van 9 Seats', service: 'Oil Change + Inspection', due: 'Mar 28', priority: 'normal' },
  { vehicle: 'CAR-014', type: 'Car 4 Seats', service: 'Brake Pads Replacement', due: 'Mar 30', priority: 'high' },
  { vehicle: 'BUS-003', type: 'Bus 40+', service: 'Annual Safety Inspection', due: 'Apr 2', priority: 'high' },
  { vehicle: 'VAN12-007', type: 'Van 12 Seats', service: 'Tire Rotation', due: 'Apr 5', priority: 'normal' },
  { vehicle: 'MINI-004', type: 'Minibus 20', service: 'AC System Service', due: 'Apr 8', priority: 'low' },
]

const priorityColor = {
  high: 'bg-red-100 text-red-700',
  normal: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
}

export default function FleetReport() {
  const [period, setPeriod] = useState('6m')
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

  const totalVehicles = vehicleFleet.reduce((a, v) => a + v.total, 0)
  const activeVehicles = vehicleFleet.reduce((a, v) => a + v.active, 0)
  const totalMaintCost = maintenanceCosts.reduce((a, m) => a + m.scheduled + m.unscheduled, 0)
  const totalFuelCost = fuelConsumption.reduce((a, m) => a + m.cost, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
            <Truck className="h-6 w-6 text-slate-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Fleet Report</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Vehicle Status, Usage, Maintenance & Fuel</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['1m', '3m', '6m', '1y'].map(p => (
            <Button key={p} size="sm" variant={period === p ? 'default' : 'outline'}
              onClick={() => setPeriod(p)} className="text-xs h-7">{p.toUpperCase()}</Button>
          ))}
          <Button size="sm" variant="outline" onClick={handleExport} className="gap-1.5 ml-2">
            <Download className="h-3.5 w-3.5" />Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Fleet', value: totalVehicles.toString(), sub: `${activeVehicles} active`, color: 'text-slate-700', bg: 'bg-slate-50', icon: Truck },
          { label: 'Avg Utilization', value: '77.9%', sub: 'All vehicle types', color: 'text-blue-700', bg: 'bg-blue-50', icon: TrendingUp },
          { label: 'Maintenance Cost (6M)', value: `฿${(totalMaintCost / 1000).toFixed(0)}K`, sub: 'Scheduled + Unscheduled', color: 'text-yellow-700', bg: 'bg-yellow-50', icon: Wrench },
          { label: 'Fuel Cost (6M)', value: `฿${(totalFuelCost / 1000000).toFixed(1)}M`, sub: 'All vehicles', color: 'text-red-700', bg: 'bg-red-50', icon: Fuel },
        ].map(s => (
          <Card key={s.label} className={`${s.bg} border-0`}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
                </div>
                <s.icon className={`h-6 w-6 ${s.color} opacity-60`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Fleet Utilization by Type */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base">Fleet Utilization by Vehicle Type (%)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={fleetUtilization}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[50, 100]} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="van9" name="Van 9 Seats" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="van12" name="Van 12 Seats" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="car" name="Car 4 Seats" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="minibus" name="Minibus 20" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="bus" name="Bus 40+" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Costs */}
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Wrench className="h-4 w-4 text-yellow-500" />Maintenance Costs (฿)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={maintenanceCosts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `฿${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v) => `฿${v.toLocaleString()}`} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="scheduled" name="Scheduled" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="unscheduled" name="Unscheduled" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vehicle Status Distribution */}
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base">Vehicle Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="45%" height={180}>
                <PieChart>
                  <Pie data={vehicleStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="count">
                    {vehicleStatus.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {vehicleStatus.map(s => (
                  <div key={s.status} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="font-medium">{s.status}</span>
                    </div>
                    <span className="font-bold">{s.count} vehicles</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fleet Summary Table */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base">Fleet Summary by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="text-left py-2 font-medium">Vehicle Type</th>
                <th className="text-right py-2 font-medium">Total</th>
                <th className="text-right py-2 font-medium">Active</th>
                <th className="text-right py-2 font-medium">Maintenance</th>
                <th className="text-right py-2 font-medium">Utilization</th>
                <th className="text-right py-2 font-medium">Avg Age (yrs)</th>
              </tr>
            </thead>
            <tbody>
              {vehicleFleet.map(v => (
                <tr key={v.type} className="border-b hover:bg-gray-50">
                  <td className="py-2.5 text-xs font-medium">{v.type}</td>
                  <td className="py-2.5 text-right text-xs font-bold">{v.total}</td>
                  <td className="py-2.5 text-right">
                    <Badge className="text-xs bg-green-100 text-green-700">{v.active}</Badge>
                  </td>
                  <td className="py-2.5 text-right">
                    <Badge className="text-xs bg-yellow-100 text-yellow-700">{v.maintenance}</Badge>
                  </td>
                  <td className="py-2.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-gray-100 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${v.utilization}%` }} />
                      </div>
                      <span className="text-xs font-medium">{v.utilization}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-right text-xs text-muted-foreground">{v.avgAge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Upcoming Maintenance */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />Upcoming Maintenance Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="text-left py-2 font-medium">Vehicle ID</th>
                <th className="text-left py-2 font-medium">Type</th>
                <th className="text-left py-2 font-medium">Service</th>
                <th className="text-right py-2 font-medium">Due Date</th>
                <th className="text-left py-2 font-medium pl-4">Priority</th>
              </tr>
            </thead>
            <tbody>
              {upcomingMaintenance.map(m => (
                <tr key={m.vehicle} className="border-b hover:bg-gray-50">
                  <td className="py-2.5 text-xs font-mono font-bold">{m.vehicle}</td>
                  <td className="py-2.5 text-xs text-muted-foreground">{m.type}</td>
                  <td className="py-2.5 text-xs">{m.service}</td>
                  <td className="py-2.5 text-right text-xs font-medium">{m.due}</td>
                  <td className="py-2.5 pl-4">
                    <Badge className={`text-xs ${priorityColor[m.priority]}`}>{m.priority}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
