import { useState } from 'react'
import { Search, Bell, BellOff, Check, CheckCheck, Trash2, Mail, Package, ShoppingCart, AlertCircle, Info, CheckCircle } from 'lucide-react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

export default function Notifications() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      title: 'New Order Received',
      message: 'Order #ORD-2024-156 has been placed by John Doe',
      timestamp: '2024-10-05 09:45 AM',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'product',
      title: 'Low Stock Alert',
      message: 'Product "Wireless Mouse" has only 5 units left in stock',
      timestamp: '2024-10-05 09:30 AM',
      read: false,
      priority: 'urgent'
    },
    {
      id: 3,
      type: 'customer',
      title: 'New Customer Registration',
      message: 'Sarah Smith has created a new account',
      timestamp: '2024-10-05 09:15 AM',
      read: true,
      priority: 'normal'
    },
    {
      id: 4,
      type: 'order',
      title: 'Order Shipped',
      message: 'Order #ORD-2024-155 has been shipped via DHL',
      timestamp: '2024-10-05 09:00 AM',
      read: true,
      priority: 'normal'
    },
    {
      id: 5,
      type: 'system',
      title: 'System Update Available',
      message: 'A new system update (v2.5.0) is available for installation',
      timestamp: '2024-10-05 08:45 AM',
      read: false,
      priority: 'normal'
    },
    {
      id: 6,
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of $1,250.00 received for Order #ORD-2024-154',
      timestamp: '2024-10-05 08:30 AM',
      read: true,
      priority: 'high'
    },
    {
      id: 7,
      type: 'review',
      title: 'New Product Review',
      message: 'Mike Johnson left a 5-star review for "Laptop Pro 15"',
      timestamp: '2024-10-05 08:15 AM',
      read: true,
      priority: 'low'
    },
    {
      id: 8,
      type: 'order',
      title: 'Order Cancelled',
      message: 'Order #ORD-2024-153 has been cancelled by customer',
      timestamp: '2024-10-05 08:00 AM',
      read: false,
      priority: 'high'
    },
    {
      id: 9,
      type: 'product',
      title: 'Product Out of Stock',
      message: 'Product "Gaming Keyboard" is now out of stock',
      timestamp: '2024-10-05 07:45 AM',
      read: true,
      priority: 'urgent'
    },
    {
      id: 10,
      type: 'customer',
      title: 'Customer Support Ticket',
      message: 'New support ticket #TKT-006 created by Alice Brown',
      timestamp: '2024-10-05 07:30 AM',
      read: false,
      priority: 'high'
    }
  ])

  const notificationTypes = [
    { value: 'order', label: 'Orders', icon: ShoppingCart },
    { value: 'product', label: 'Products', icon: Package },
    { value: 'customer', label: 'Customers', icon: Mail },
    { value: 'payment', label: 'Payments', icon: CheckCircle },
    { value: 'review', label: 'Reviews', icon: Info },
    { value: 'system', label: 'System', icon: AlertCircle }
  ]

  const stats = [
    {
      title: 'Total Notifications',
      value: notifications.length,
      icon: Bell,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Unread',
      value: notifications.filter(n => !n.read).length,
      icon: BellOff,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'High Priority',
      value: notifications.filter(n => n.priority === 'high' || n.priority === 'urgent').length,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Today',
      value: notifications.filter(n => n.timestamp.startsWith('2024-10-05')).length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ]

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === 'all' || notification.type === typeFilter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'unread' && !notification.read) ||
      (statusFilter === 'read' && notification.read)

    return matchesSearch && matchesType && matchesStatus
  })

  const markAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const deleteAllRead = () => {
    setNotifications(notifications.filter(n => !n.read))
  }

  const getNotificationIcon = (type) => {
    const typeConfig = notificationTypes.find(t => t.value === type)
    return typeConfig ? typeConfig.icon : Info
  }

  const getNotificationColor = (type, priority) => {
    if (priority === 'urgent') return 'text-red-600 bg-red-50'
    if (priority === 'high') return 'text-orange-600 bg-orange-50'
    
    const colors = {
      'order': 'text-blue-600 bg-blue-50',
      'product': 'text-purple-600 bg-purple-50',
      'customer': 'text-green-600 bg-green-50',
      'payment': 'text-emerald-600 bg-emerald-50',
      'review': 'text-yellow-600 bg-yellow-50',
      'system': 'text-gray-600 bg-gray-50'
    }
    return colors[type] || 'text-gray-600 bg-gray-50'
  }

  const getPriorityBadge = (priority) => {
    const badges = {
      'urgent': { label: 'Urgent', className: 'bg-red-100 text-red-800' },
      'high': { label: 'High', className: 'bg-orange-100 text-orange-800' },
      'normal': { label: 'Normal', className: 'bg-blue-100 text-blue-800' },
      'low': { label: 'Low', className: 'bg-gray-100 text-gray-800' }
    }
    return badges[priority] || badges['normal']
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">Stay updated with system notifications and alerts</p>
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
              <CardTitle>All Notifications</CardTitle>
              <CardDescription>View and manage your notifications</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={deleteAllRead}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Read
              </Button>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={markAllAsRead}>
                <CheckCheck className="mr-2 h-4 w-4" />
                Mark All Read
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {notificationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notifications List */}
          <div className="space-y-2">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No notifications found</p>
              </div>
            ) : (
              filteredNotifications.map((notification, index) => {
                const Icon = getNotificationIcon(notification.type)
                const priorityBadge = getPriorityBadge(notification.priority)
                return (
                  <div key={notification.id}>
                    <div className={`p-4 rounded-lg transition-colors ${
                      notification.read ? 'bg-background' : 'bg-muted'
                    } hover:bg-muted/80`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full ${getNotificationColor(notification.type, notification.priority)}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{notification.title}</h4>
                              {!notification.read && (
                                <Badge className="bg-gray-700 hover:bg-gray-600 text-white bg-blue-600">New</Badge>
                              )}
                              <Badge variant="outline" className={priorityBadge.className}>
                                {priorityBadge.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => markAsRead(notification.id)}
                                  title="Mark as read"
                                >
                                  <Check className="h-4 w-4 text-green-600" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteNotification(notification.id)}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{notification.timestamp}</span>
                            <span>•</span>
                            <span className="capitalize">{notification.type}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < filteredNotifications.length - 1 && <Separator className="my-2" />}
                  </div>
                )
              })
            )}
          </div>

          {/* Results Count */}
          {filteredNotifications.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredNotifications.length} of {notifications.length} notifications
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
