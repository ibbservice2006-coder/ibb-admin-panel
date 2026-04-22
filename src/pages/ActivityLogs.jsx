import { useState } from 'react'
import { Search, Download, Filter, Activity, User, FileText, Settings as SettingsIcon, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function ActivityLogs() {
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [moduleFilter, setModuleFilter] = useState('all')

  const [logs] = useState([
    {
      id: 1,
      timestamp: '2024-10-05 09:45:23',
      user: { name: 'John Doe', email: 'john@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
      action: 'Login',
      module: 'Authentication',
      details: 'User logged in successfully',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome 118.0.0.0',
      status: 'success'
    },
    {
      id: 2,
      timestamp: '2024-10-05 09:42:15',
      user: { name: 'Sarah Smith', email: 'sarah@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
      action: 'Create',
      module: 'Products',
      details: 'Created product "Wireless Headphones"',
      ipAddress: '192.168.1.105',
      userAgent: 'Firefox 119.0',
      status: 'success'
    },
    {
      id: 3,
      timestamp: '2024-10-05 09:38:47',
      user: { name: 'Mike Johnson', email: 'mike@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
      action: 'Edit',
      module: 'Orders',
      details: 'Updated order #ORD-2024-001 status to "Shipped"',
      ipAddress: '192.168.1.110',
      userAgent: 'Safari 17.0',
      status: 'success'
    },
    {
      id: 4,
      timestamp: '2024-10-05 09:35:12',
      user: { name: 'Emily Brown', email: 'emily@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },
      action: 'Delete',
      module: 'Customers',
      details: 'Deleted customer "Test User"',
      ipAddress: '192.168.1.115',
      userAgent: 'Edge 118.0',
      status: 'success'
    },
    {
      id: 5,
      timestamp: '2024-10-05 09:30:05',
      user: { name: 'David Wilson', email: 'david@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
      action: 'Export',
      module: 'Reports',
      details: 'Exported sales report for September 2024',
      ipAddress: '192.168.1.120',
      userAgent: 'Chrome 118.0.0.0',
      status: 'success'
    },
    {
      id: 6,
      timestamp: '2024-10-05 09:25:33',
      user: { name: 'John Doe', email: 'john@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
      action: 'Edit',
      module: 'Settings',
      details: 'Updated shipping zone rates',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome 118.0.0.0',
      status: 'success'
    },
    {
      id: 7,
      timestamp: '2024-10-05 09:20:18',
      user: { name: 'Sarah Smith', email: 'sarah@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
      action: 'Login',
      module: 'Authentication',
      details: 'Failed login attempt - incorrect password',
      ipAddress: '192.168.1.105',
      userAgent: 'Firefox 119.0',
      status: 'failed'
    },
    {
      id: 8,
      timestamp: '2024-10-05 09:15:42',
      user: { name: 'Mike Johnson', email: 'mike@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
      action: 'Create',
      module: 'Marketing',
      details: 'Created coupon "FALL2024" with 20% discount',
      ipAddress: '192.168.1.110',
      userAgent: 'Safari 17.0',
      status: 'success'
    },
    {
      id: 9,
      timestamp: '2024-10-05 09:10:27',
      user: { name: 'Emily Brown', email: 'emily@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },
      action: 'Edit',
      module: 'Products',
      details: 'Updated inventory for "Laptop Pro 15"',
      ipAddress: '192.168.1.115',
      userAgent: 'Edge 118.0',
      status: 'success'
    },
    {
      id: 10,
      timestamp: '2024-10-05 09:05:51',
      user: { name: 'David Wilson', email: 'david@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
      action: 'Logout',
      module: 'Authentication',
      details: 'User logged out',
      ipAddress: '192.168.1.120',
      userAgent: 'Chrome 118.0.0.0',
      status: 'success'
    }
  ])

  const actionTypes = ['Login', 'Logout', 'Create', 'Edit', 'Delete', 'Export']
  const modules = ['Authentication', 'Products', 'Orders', 'Customers', 'Marketing', 'Reports', 'Settings']

  const stats = [
    {
      title: 'Total Activities',
      value: logs.length,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Users',
      value: new Set(logs.map(l => l.user.email)).size,
      icon: User,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Actions Today',
      value: logs.filter(l => l.timestamp.startsWith('2024-10-05')).length,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Failed Actions',
      value: logs.filter(l => l.status === 'failed').length,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ]

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesAction = actionFilter === 'all' || log.action === actionFilter
    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter

    return matchesSearch && matchesAction && matchesModule
  })

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'User', 'Action', 'Module', 'Details', 'IP Address', 'Status'],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.user.name,
        log.action,
        log.module,
        log.details,
        log.ipAddress,
        log.status
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const getActionBadgeColor = (action) => {
    const colors = {
      'Login': 'bg-green-100 text-green-800',
      'Logout': 'bg-gray-100 text-gray-800',
      'Create': 'bg-blue-100 text-blue-800',
      'Edit': 'bg-yellow-100 text-yellow-800',
      'Delete': 'bg-red-100 text-red-800',
      'Export': 'bg-purple-100 text-purple-800'
    }
    return colors[action] || 'bg-gray-100 text-gray-800'
  }

  const getModuleIcon = (module) => {
    const icons = {
      'Authentication': User,
      'Products': FileText,
      'Orders': FileText,
      'Customers': User,
      'Marketing': FileText,
      'Reports': FileText,
      'Settings': SettingsIcon
    }
    return icons[module] || FileText
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Activity Logs</h1>
        <p className="text-muted-foreground">Track all user activities and system events</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
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

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>Complete log of all user actions</CardDescription>
            </div>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {actionTypes.map((action) => (
                  <SelectItem key={action} value={action}>{action}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                {modules.map((module) => (
                  <SelectItem key={module} value={module}>{module}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
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
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No activity logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => {
                    const ModuleIcon = getModuleIcon(log.module)
                    return (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs">
                          {log.timestamp}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={log.user.avatar} alt={log.user.name} />
                              <AvatarFallback>{log.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{log.user.name}</div>
                              <div className="text-xs text-muted-foreground">{log.user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getActionBadgeColor(log.action)}>
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <ModuleIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{log.module}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="text-sm truncate">{log.details}</div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {log.ipAddress}
                        </TableCell>
                        <TableCell>
                          {log.status === 'success' ? (
                            <Badge className="bg-gray-700 hover:bg-gray-600 text-white bg-green-100 text-green-800">
                              Success
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              Failed
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredLogs.length} of {logs.length} activities
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
