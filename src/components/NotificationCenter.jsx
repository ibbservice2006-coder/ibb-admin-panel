import { useState } from 'react'
import { Bell, Check, CheckCheck, X, AlertCircle, Info, CheckCircle, AlertTriangle, Package, ShoppingCart, Users, TrendingUp, Settings, Trash2, Filter } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: 'success',
    title: 'Order Completed',
    message: 'Order #ORD-001 has been successfully completed',
    time: '2 minutes ago',
    read: false,
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Low Stock Alert',
    message: 'iPhone 15 Pro stock is running low (5 units remaining)',
    time: '15 minutes ago',
    read: false,
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    id: 3,
    type: 'info',
    title: 'New Customer',
    message: 'John Smith has registered as a new customer',
    time: '1 hour ago',
    read: false,
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 4,
    type: 'error',
    title: 'Payment Failed',
    message: 'Payment for Order #ORD-002 has failed',
    time: '2 hours ago',
    read: true,
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    id: 5,
    type: 'info',
    title: 'Shipment Update',
    message: 'Order #ORD-003 has been shipped',
    time: '3 hours ago',
    read: true,
    icon: Package,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 6,
    type: 'success',
    title: 'Revenue Milestone',
    message: 'Monthly revenue has reached ฿1,000,000',
    time: '5 hours ago',
    read: true,
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 7,
    type: 'info',
    title: 'System Update',
    message: 'System maintenance scheduled for tonight at 2 AM',
    time: '1 day ago',
    read: true,
    icon: Settings,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 8,
    type: 'warning',
    title: 'Pending Orders',
    message: 'You have 5 pending orders waiting for approval',
    time: '1 day ago',
    read: true,
    icon: ShoppingCart,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  }
]

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeTab, setActiveTab] = useState('all')
  const [filterType, setFilterType] = useState('all')

  const unreadCount = notifications.filter(n => !n.read).length

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread' && notification.read) return false
    if (filterType !== 'all' && notification.type !== filterType) return false
    return true
  })

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const getTypeLabel = (type) => {
    const labels = {
      success: 'Success',
      warning: 'Warning',
      error: 'Error',
      info: 'Info'
    }
    return labels[type] || type
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[420px] p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-semibold text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">
                You have {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
              </p>
            )}
          </div>
          {notifications.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterType('all')}>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('success')}>
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Success
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('warning')}>
                  <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
                  Warning
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('error')}>
                  <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
                  Error
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('info')}>
                  <Info className="h-4 w-4 mr-2 text-blue-600" />
                  Info
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Tabs */}
        {notifications.length > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-4 pt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">
                  All ({notifications.length})
                </TabsTrigger>
                <TabsTrigger value="unread">
                  Unread ({unreadCount})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="m-0">
              <ScrollArea className="h-[400px]">
                <div className="p-2">
                  {filteredNotifications.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No notifications</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredNotifications.map((notification) => {
                        const Icon = notification.icon
                        return (
                          <div
                            key={notification.id}
                            className={`group relative p-3 rounded-lg hover:bg-muted/50 transition-colors ${
                              !notification.read ? 'bg-muted/30' : ''
                            }`}
                          >
                            <div className="flex gap-3">
                              {/* Icon */}
                              <div className={`flex-shrink-0 w-10 h-10 rounded-full ${notification.bgColor} flex items-center justify-center`}>
                                <Icon className={`h-5 w-5 ${notification.color}`} />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h4 className="font-medium text-sm">
                                    {notification.title}
                                  </h4>
                                  {!notification.read && (
                                    <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-xs text-muted-foreground">
                                    {notification.time}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {getTypeLabel(notification.type)}
                                  </Badge>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => deleteNotification(notification.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="unread" className="m-0">
              <ScrollArea className="h-[400px]">
                <div className="p-2">
                  {filteredNotifications.filter(n => !n.read).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCheck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No unread notifications</p>
                      <p className="text-sm mt-1">You're all caught up!</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredNotifications.filter(n => !n.read).map((notification) => {
                        const Icon = notification.icon
                        return (
                          <div
                            key={notification.id}
                            className="group relative p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex gap-3">
                              <div className={`flex-shrink-0 w-10 h-10 rounded-full ${notification.bgColor} flex items-center justify-center`}>
                                <Icon className={`h-5 w-5 ${notification.color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h4 className="font-medium text-sm">
                                    {notification.title}
                                  </h4>
                                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1" />
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-xs text-muted-foreground">
                                    {notification.time}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {getTypeLabel(notification.type)}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => deleteNotification(notification.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}

        {/* Empty State */}
        {notifications.length === 0 && (
          <div className="text-center py-12 px-4">
            <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-1">No notifications</h3>
            <p className="text-sm text-muted-foreground">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        )}

        {/* Footer Actions */}
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2 flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={markAllAsRead}
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark all as read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={clearAll}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear all
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
