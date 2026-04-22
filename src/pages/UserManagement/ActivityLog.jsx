import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Activity, User, FileText, Settings, AlertCircle, Download, Search, Clock } from 'lucide-react'

const logs = [
  { id: 1, timestamp: '2026-03-25 09:45:23', user: { name: 'Somchai Rattanakul', email: 'somchai@ibb.co.th' }, action: 'Login', module: 'Authentication', details: 'Super Admin logged in successfully', ip: '203.150.12.45', status: 'success' },
  { id: 2, timestamp: '2026-03-25 09:42:15', user: { name: 'Nattaya Wongprasert', email: 'nattaya@ibb.co.th' }, action: 'Edit', module: 'Bookings', details: 'Updated booking IBB-2026-4521 status to Confirmed', ip: '203.150.12.46', status: 'success' },
  { id: 3, timestamp: '2026-03-25 09:38:47', user: { name: 'Prayuth Siriporn', email: 'prayuth@ibb.co.th' }, action: 'Export', module: 'Reports', details: 'Exported Financial Report Q1 2026', ip: '203.150.12.47', status: 'success' },
  { id: 4, timestamp: '2026-03-25 09:35:12', user: { name: 'Wanida Khamchan', email: 'wanida@ibb.co.th' }, action: 'Create', module: 'Vouchers', details: 'Created voucher SONGKRAN2026 — 15% discount', ip: '203.150.12.48', status: 'success' },
  { id: 5, timestamp: '2026-03-25 09:30:05', user: { name: 'Thanakorn Bunsong', email: 'thanakorn@ibb.co.th' }, action: 'Edit', module: 'Fleet', details: 'Updated maintenance schedule for IBB-VAN-012', ip: '203.150.12.49', status: 'success' },
  { id: 6, timestamp: '2026-03-25 09:25:33', user: { name: 'Siriporn Charoenwong', email: 'siriporn@ibb.co.th' }, action: 'Login', module: 'Authentication', details: 'Failed login attempt — incorrect password', ip: '203.150.12.50', status: 'failed' },
  { id: 7, timestamp: '2026-03-25 09:20:18', user: { name: 'Krit Thongchai', email: 'krit@ibb.co.th' }, action: 'Create', module: 'Drivers', details: 'Added new driver Somjit Kaewprasert (DRV-2026-089)', ip: '203.150.12.51', status: 'success' },
  { id: 8, timestamp: '2026-03-25 09:15:42', user: { name: 'Malee Petcharat', email: 'malee@ibb.co.th' }, action: 'Edit', module: 'Customers', details: 'Updated customer profile — Membership upgraded to Gold', ip: '203.150.12.52', status: 'success' },
  { id: 9, timestamp: '2026-03-25 09:10:27', user: { name: 'Arthit Suwannarat', email: 'arthit@ibb.co.th' }, action: 'Delete', module: 'Settings', details: 'Removed deprecated API key IBB-API-OLD-001', ip: '203.150.12.53', status: 'success' },
  { id: 10, timestamp: '2026-03-25 09:05:51', user: { name: 'Somchai Rattanakul', email: 'somchai@ibb.co.th' }, action: 'Edit', module: 'Pricing', details: 'Updated peak season surcharge +20% for Songkran 2026', ip: '203.150.12.45', status: 'success' },
  { id: 11, timestamp: '2026-03-25 09:00:14', user: { name: 'Nattaya Wongprasert', email: 'nattaya@ibb.co.th' }, action: 'Create', module: 'Bookings', details: 'Created group booking IBB-2026-4522 (12 passengers)', ip: '203.150.12.46', status: 'success' },
  { id: 12, timestamp: '2026-03-25 08:55:30', user: { name: 'Prayuth Siriporn', email: 'prayuth@ibb.co.th' }, action: 'Edit', module: 'Currency', details: 'Updated THB/CNY exchange rate to 0.2087', ip: '203.150.12.47', status: 'success' },
  { id: 13, timestamp: '2026-03-25 08:50:22', user: { name: 'Wanida Khamchan', email: 'wanida@ibb.co.th' }, action: 'Login', module: 'Authentication', details: 'Customer Support Lead logged in', ip: '203.150.12.48', status: 'success' },
  { id: 14, timestamp: '2026-03-25 08:45:11', user: { name: 'Malee Petcharat', email: 'malee@ibb.co.th' }, action: 'Export', module: 'Customers', details: 'Exported customer list — 1,240 records', ip: '203.150.12.52', status: 'success' },
  { id: 15, timestamp: '2026-03-25 08:40:05', user: { name: 'Arthit Suwannarat', email: 'arthit@ibb.co.th' }, action: 'Edit', module: 'Settings', details: 'Updated 2FA policy — mandatory for all Super Admins', ip: '203.150.12.53', status: 'success' },
]

const actionTypes = ['Login', 'Create', 'Edit', 'Delete', 'Export']
const modules = ['Authentication', 'Bookings', 'Fleet', 'Drivers', 'Customers', 'Routes', 'Pricing', 'Currency', 'Vouchers', 'Reports', 'Settings']

const actionColors = {
  Login: 'bg-green-100 text-green-800',
  Logout: 'bg-gray-100 text-gray-800',
  Create: 'bg-blue-100 text-blue-800',
  Edit: 'bg-yellow-100 text-yellow-800',
  Delete: 'bg-red-100 text-red-800',
  Export: 'bg-purple-100 text-purple-800',
}

const avatarColors = ['bg-red-500','bg-blue-500','bg-green-500','bg-yellow-500','bg-purple-500','bg-pink-500','bg-indigo-500','bg-cyan-500','bg-orange-500','bg-teal-500']

export default function ActivityLog() {
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [moduleFilter, setModuleFilter] = useState('all')

  const filtered = logs.filter(log => {
    const matchSearch =
      log.user.name.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.module.toLowerCase().includes(search.toLowerCase())
    const matchAction = actionFilter === 'all' || log.action === actionFilter
    const matchModule = moduleFilter === 'all' || log.module === moduleFilter
    return matchSearch && matchAction && matchModule
  })

  const stats = [
    { title: 'Total Activities', value: logs.length, icon: Activity, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { title: 'Active Users', value: new Set(logs.map(l => l.user.email)).size, icon: User, color: 'text-green-600', bgColor: 'bg-green-100' },
    { title: 'Actions Today', value: logs.filter(l => l.timestamp.startsWith('2026-03-25')).length, icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { title: 'Failed Actions', value: logs.filter(l => l.status === 'failed').length, icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
  ]

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'User', 'Email', 'Action', 'Module', 'Details', 'IP Address', 'Status'],
      ...filtered.map(l => [l.timestamp, l.user.name, l.user.email, l.action, l.module, l.details, l.ip, l.status])
    ].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Activity Log</h1>
        <p className="text-muted-foreground">Track all Admin actions in IBB Shuttle system in real-time</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>Log all Admin actions — filter and export available</CardDescription>
            </div>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleExport} variant="outline">
              <Download className="mr-2 h-4 w-4" />Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {actionTypes.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                {modules.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No logs found</TableCell>
                  </TableRow>
                ) : filtered.map((log, idx) => (
                  <TableRow key={log.id} className={log.status === 'failed' ? 'bg-red-50' : ''}>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                        <Clock className="h-3 w-3" />{log.timestamp}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className={`${avatarColors[idx % avatarColors.length]} text-white text-xs font-bold`}>
                            {log.user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{log.user.name}</div>
                          <div className="text-xs text-muted-foreground">{log.user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${actionColors[log.action] || 'bg-gray-100 text-gray-800'}`} variant="outline">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{log.module}</TableCell>
                    <TableCell className="text-sm max-w-xs truncate">{log.details}</TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">{log.ip}</TableCell>
                    <TableCell>
                      <Badge variant={log.status === 'success' ? 'default' : 'destructive'} className="text-xs">
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-sm text-muted-foreground mt-3">Showing {filtered.length} of {logs.length} activities</p>
        </CardContent>
      </Card>
    </div>
  )
}
