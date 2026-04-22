import React, { useState } from 'react';
import { FileText, Search, Filter, Download, Eye, User, Database, Settings, ShoppingCart, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AuditLog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [logs, setLogs] = useState([
    {
      id: 1,
      timestamp: '2025-10-06 16:45:23',
      user: 'admin@company.com',
      userName: 'Admin User',
      action: 'CREATE',
      resource: 'Product',
      resourceId: 'PRD-1234',
      description: 'Created new product "Premium Laptop"',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      changes: {
        name: 'Premium Laptop',
        price: 1299.99,
        stock: 50,
        category: 'Electronics'
      }
    },
    {
      id: 2,
      timestamp: '2025-10-06 16:30:15',
      user: 'john@company.com',
      userName: 'John Smith',
      action: 'UPDATE',
      resource: 'Order',
      resourceId: 'ORD-5678',
      description: 'Updated order status to "Shipped"',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      changes: {
        status: { old: 'Processing', new: 'Shipped' },
        trackingNumber: 'TRK-ABC123'
      }
    },
    {
      id: 3,
      timestamp: '2025-10-06 16:15:42',
      user: 'sarah@company.com',
      userName: 'Sarah Johnson',
      action: 'DELETE',
      resource: 'Customer',
      resourceId: 'CST-9012',
      description: 'Deleted customer account',
      ipAddress: '192.168.1.110',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      changes: {
        email: 'deleted@example.com',
        reason: 'User requested account deletion'
      }
    },
    {
      id: 4,
      timestamp: '2025-10-06 16:00:30',
      user: 'admin@company.com',
      userName: 'Admin User',
      action: 'UPDATE',
      resource: 'Settings',
      resourceId: 'SET-001',
      description: 'Updated system settings',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      changes: {
        emailNotifications: { old: false, new: true },
        maintenanceMode: { old: true, new: false }
      }
    },
    {
      id: 5,
      timestamp: '2025-10-06 15:45:18',
      user: 'mike@company.com',
      userName: 'Mike Wilson',
      action: 'CREATE',
      resource: 'Order',
      resourceId: 'ORD-5679',
      description: 'Created new order',
      ipAddress: '192.168.1.115',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
      changes: {
        customer: 'customer@example.com',
        total: 599.99,
        items: 3
      }
    },
    {
      id: 6,
      timestamp: '2025-10-06 15:30:05',
      user: 'admin@company.com',
      userName: 'Admin User',
      action: 'UPDATE',
      resource: 'Product',
      resourceId: 'PRD-1235',
      description: 'Updated product inventory',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      changes: {
        stock: { old: 100, new: 85 },
        lastUpdated: new Date().toISOString()
      }
    },
    {
      id: 7,
      timestamp: '2025-10-06 15:15:50',
      user: 'sarah@company.com',
      userName: 'Sarah Johnson',
      action: 'CREATE',
      resource: 'Customer',
      resourceId: 'CST-9013',
      description: 'Created new customer account',
      ipAddress: '192.168.1.110',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      changes: {
        email: 'newcustomer@example.com',
        name: 'New Customer',
        registrationDate: new Date().toISOString()
      }
    },
    {
      id: 8,
      timestamp: '2025-10-06 15:00:35',
      user: 'john@company.com',
      userName: 'John Smith',
      action: 'DELETE',
      resource: 'Product',
      resourceId: 'PRD-1236',
      description: 'Deleted discontinued product',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      changes: {
        name: 'Old Product',
        reason: 'Discontinued'
      }
    }
  ]);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resourceId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesUser = filterUser === 'all' || log.user === filterUser;
    
    return matchesSearch && matchesAction && matchesUser;
  });

  const uniqueUsers = [...new Set(logs.map(log => log.user))];

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setDialogOpen(true);
  };

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Resource ID', 'Description', 'IP Address'],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.user,
        log.action,
        log.resource,
        log.resourceId,
        log.description,
        log.ipAddress
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString()}.csv`;
    a.click();
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-500';
      case 'UPDATE':
        return 'bg-blue-500';
      case 'DELETE':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getResourceIcon = (resource) => {
    switch (resource) {
      case 'Product':
        return <Package className="w-4 h-4" />;
      case 'Order':
        return <ShoppingCart className="w-4 h-4" />;
      case 'Customer':
        return <User className="w-4 h-4" />;
      case 'Settings':
        return <Settings className="w-4 h-4" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audit Log</h1>
          <p className="text-muted-foreground mt-2">
            Track all system activities and changes
          </p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Creates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {logs.filter(l => l.action === 'CREATE').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {logs.filter(l => l.action === 'UPDATE').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Deletes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {logs.filter(l => l.action === 'DELETE').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="action-filter">Action</Label>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger id="action-filter" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="CREATE">Create</SelectItem>
                  <SelectItem value="UPDATE">Update</SelectItem>
                  <SelectItem value="DELETE">Delete</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="user-filter">User</Label>
              <Select value={filterUser} onValueChange={setFilterUser}>
                <SelectTrigger id="user-filter" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map(user => (
                    <SelectItem key={user} value={user}>{user}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            Showing {filteredLogs.length} of {logs.length} events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table" className="space-y-4">
            <TabsList>
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">
                    {log.timestamp}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{log.userName}</p>
                      <p className="text-sm text-muted-foreground">{log.user}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getActionColor(log.action)}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getResourceIcon(log.resource)}
                      <div>
                        <p className="font-medium">{log.resource}</p>
                        <p className="text-sm text-muted-foreground">{log.resourceId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {log.description}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {log.ipAddress}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(log)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No logs found matching your criteria
                </div>
              ) : (
                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary/50 before:to-transparent">
                  {filteredLogs.map((log, index) => (
                    <div key={log.id} className="relative flex items-start gap-6 group">
                      {/* Timeline dot */}
                      <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${getActionColor(log.action)} ring-4 ring-background`}>
                        {getResourceIcon(log.resource)}
                      </div>

                      {/* Timeline content */}
                      <div className="flex-1 bg-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge className={getActionColor(log.action)}>
                              {log.action}
                            </Badge>
                            <span className="font-semibold">{log.resource}</span>
                            <span className="text-sm text-muted-foreground">{log.resourceId}</span>
                          </div>
                          <span className="text-sm text-muted-foreground font-mono">
                            {log.timestamp}
                          </span>
                        </div>

                        <p className="text-sm mb-3">{log.description}</p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{log.userName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Database className="w-3 h-3" />
                            <span className="font-mono">{log.ipAddress}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(log)}
                            className="ml-auto"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                        </div>

                        {/* Changes preview */}
                        {log.changes && Object.keys(log.changes).length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="text-xs text-muted-foreground mb-2">Changes:</div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {Object.entries(log.changes).slice(0, 3).map(([key, value]) => (
                                <div key={key} className="bg-muted/50 rounded px-2 py-1">
                                  <span className="font-semibold">{key}:</span>{' '}
                                  {typeof value === 'object' ? (
                                    <span>
                                      <span className="line-through text-red-600">{value.old}</span>
                                      {' → '}
                                      <span className="text-green-600">{value.new}</span>
                                    </span>
                                  ) : (
                                    <span>{JSON.stringify(value)}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Detailed information about this activity
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Timestamp</Label>
                  <p className="font-mono mt-1">{selectedLog.timestamp}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Action</Label>
                  <div className="mt-1">
                    <Badge className={getActionColor(selectedLog.action)}>
                      {selectedLog.action}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">User</Label>
                  <p className="mt-1">{selectedLog.userName}</p>
                  <p className="text-sm text-muted-foreground">{selectedLog.user}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Resource</Label>
                  <p className="mt-1">{selectedLog.resource}</p>
                  <p className="text-sm text-muted-foreground">{selectedLog.resourceId}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">IP Address</Label>
                  <p className="font-mono mt-1">{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">User Agent</Label>
                  <p className="text-sm mt-1 truncate">{selectedLog.userAgent}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="mt-1">{selectedLog.description}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Changes</Label>
                <div className="mt-2 p-4 bg-muted rounded-lg">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(selectedLog.changes, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
