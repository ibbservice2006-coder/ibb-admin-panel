import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast'
import { Key, Plus, Copy, Eye, EyeOff, RefreshCw, Trash2, BarChart3, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

export default function APIManagement() {
  const { toast } = useToast()
  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: 'Production API Key',
      key: 'sk_live_masked',
      environment: 'production',
      permissions: ['read', 'write'],
      rateLimit: 1000,
      status: 'active',
      createdAt: '2025-09-15',
      lastUsed: '2025-10-06 16:45:00',
      requestCount: 45230
    },
    {
      id: 2,
      name: 'Development API Key',
      key: 'sk_test_masked',
      environment: 'development',
      permissions: ['read', 'write', 'delete'],
      rateLimit: 100,
      status: 'active',
      createdAt: '2025-09-20',
      lastUsed: '2025-10-06 15:30:00',
      requestCount: 8920
    },
    {
      id: 3,
      name: 'Mobile App API Key',
      key: 'sk_live_masked',
      environment: 'production',
      permissions: ['read'],
      rateLimit: 500,
      status: 'active',
      createdAt: '2025-10-01',
      lastUsed: '2025-10-06 16:20:00',
      requestCount: 12450
    },
    {
      id: 4,
      name: 'Legacy Integration',
      key: 'sk_live_masked',
      environment: 'production',
      permissions: ['read'],
      rateLimit: 100,
      status: 'revoked',
      createdAt: '2025-08-10',
      lastUsed: '2025-09-30 10:00:00',
      requestCount: 98760
    }
  ]);

  const [apiLogs, setApiLogs] = useState([
    {
      id: 1,
      timestamp: '2025-10-06 16:45:23',
      endpoint: '/api/v1/products',
      method: 'GET',
      status: 200,
      responseTime: '45ms',
      apiKey: 'Production API Key',
      ip: '192.168.1.100'
    },
    {
      id: 2,
      timestamp: '2025-10-06 16:45:20',
      endpoint: '/api/v1/orders',
      method: 'POST',
      status: 201,
      responseTime: '120ms',
      apiKey: 'Production API Key',
      ip: '192.168.1.100'
    },
    {
      id: 3,
      timestamp: '2025-10-06 16:45:15',
      endpoint: '/api/v1/customers',
      method: 'GET',
      status: 200,
      responseTime: '38ms',
      apiKey: 'Mobile App API Key',
      ip: '10.0.0.50'
    },
    {
      id: 4,
      timestamp: '2025-10-06 16:45:10',
      endpoint: '/api/v1/products/123',
      method: 'PUT',
      status: 403,
      responseTime: '12ms',
      apiKey: 'Mobile App API Key',
      ip: '10.0.0.50',
      error: 'Insufficient permissions'
    }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState(null);
  const [showKey, setShowKey] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    environment: 'development',
    permissions: [],
    rateLimit: 100
  });

  const [rateLimitSettings, setRateLimitSettings] = useState({
    enabled: true,
    defaultLimit: 1000,
    burstLimit: 1500,
    timeWindow: 60
  });

  const handleCreateAPIKey = () => {
    setFormData({
      name: '',
      environment: 'development',
      permissions: [],
      rateLimit: 100
    });
    setDialogOpen(true);
  };

  const handleSaveAPIKey = () => {
    const newKey = {
      id: apiKeys.length + 1,
      ...formData,
      key: `sk_${formData.environment === 'production' ? 'live' : 'test'}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      requestCount: 0
    };
    setApiKeys([...apiKeys, newKey]);
    setDialogOpen(false);
  };

  const handleDeleteAPIKey = (key) => {
    setKeyToDelete(key);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteAPIKey = () => {
    if (keyToDelete) {
      setApiKeys(apiKeys.filter(k => k.id !== keyToDelete.id));
      setDeleteDialogOpen(false);
      setKeyToDelete(null);
    }
  };

  const handleRevokeAPIKey = (keyId) => {
    setApiKeys(apiKeys.map(k => 
      k.id === keyId ? { ...k, status: 'revoked' } : k
    ));
  };

  const handleRegenerateAPIKey = (keyId) => {
    setApiKeys(apiKeys.map(k => 
      k.id === keyId 
        ? { 
            ...k, 
            key: `sk_${k.environment === 'production' ? 'live' : 'test'}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
          }
        : k
    ));
  };

  const toggleShowKey = (keyId) => {
    setShowKey({ ...showKey, [keyId]: !showKey[keyId] });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('API Key copied to clipboard!');
  };

  const maskKey = (key) => {
    return key.substring(0, 12) + '•'.repeat(20);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'revoked':
        return 'bg-red-500';
      case 'expired':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-500';
      case 'POST':
        return 'bg-green-500';
      case 'PUT':
        return 'bg-yellow-500';
      case 'DELETE':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusCodeColor = (status) => {
    if (status >= 200 && status < 300) return 'bg-green-500';
    if (status >= 400 && status < 500) return 'bg-yellow-500';
    if (status >= 500) return 'bg-red-500';
    return 'bg-gray-500';
  };

  const togglePermission = (permission) => {
    if (formData.permissions.includes(permission)) {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter(p => p !== permission)
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permission]
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage API keys, rate limiting, and monitor API usage
          </p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleCreateAPIKey}>
          <Plus className="w-4 h-4 mr-2" />
          Create API Key
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total API Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiKeys.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {apiKeys.filter(k => k.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apiKeys.reduce((sum, k) => sum + k.requestCount, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rate Limit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rateLimitSettings.defaultLimit}/min</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="keys" className="w-full">
        <TabsList>
          <TabsTrigger value="keys">
            <Key className="w-4 h-4 mr-2" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="logs">
            <BarChart3 className="w-4 h-4 mr-2" />
            API Logs
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Clock className="w-4 h-4 mr-2" />
            Rate Limiting
          </TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API authentication keys</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div
                    key={apiKey.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <Key className="w-5 h-5" />
                          <h3 className="text-lg font-semibold">{apiKey.name}</h3>
                          <Badge className={getStatusColor(apiKey.status)}>
                            {apiKey.status}
                          </Badge>
                          <Badge variant="outline">
                            {apiKey.environment}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          <code className="bg-muted px-3 py-1 rounded font-mono text-sm">
                            {showKey[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleShowKey(apiKey.id)}
                          >
                            {showKey[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(apiKey.key)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Permissions</p>
                            <div className="flex gap-1 mt-1">
                              {apiKey.permissions.map(perm => (
                                <Badge key={perm} variant="secondary" className="text-xs">
                                  {perm}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Rate Limit</p>
                            <p className="font-medium">{apiKey.rateLimit}/min</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Last Used</p>
                            <p className="font-medium">{apiKey.lastUsed}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Total Requests</p>
                            <p className="font-medium">{apiKey.requestCount.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        {apiKey.status === 'active' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRegenerateAPIKey(apiKey.id)}
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRevokeAPIKey(apiKey.id)}
                            >
                              Revoke
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAPIKey(apiKey)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Logs Tab */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>API Request Logs</CardTitle>
              <CardDescription>Monitor API usage and requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>API Key</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                      <TableCell className="font-mono text-sm">{log.endpoint}</TableCell>
                      <TableCell>
                        <Badge className={getMethodColor(log.method)}>
                          {log.method}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusCodeColor(log.status)}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.responseTime}</TableCell>
                      <TableCell>{log.apiKey}</TableCell>
                      <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rate Limiting Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rate Limiting Configuration</CardTitle>
              <CardDescription>Configure API rate limiting and throttling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Rate Limiting</Label>
                  <p className="text-sm text-muted-foreground">
                    Protect your API from abuse and overuse
                  </p>
                </div>
                <Switch
                  checked={rateLimitSettings.enabled}
                  onCheckedChange={(checked) => setRateLimitSettings({ ...rateLimitSettings, enabled: checked })}
                />
              </div>

              {rateLimitSettings.enabled && (
                <>
                  <div>
                    <Label>Default Rate Limit: {rateLimitSettings.defaultLimit} requests/min</Label>
                    <Slider
                      value={[rateLimitSettings.defaultLimit]}
                      onValueChange={(value) => setRateLimitSettings({ ...rateLimitSettings, defaultLimit: value[0] })}
                      max={5000}
                      min={10}
                      step={10}
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Default rate limit for new API keys
                    </p>
                  </div>

                  <div>
                    <Label>Burst Limit: {rateLimitSettings.burstLimit} requests</Label>
                    <Slider
                      value={[rateLimitSettings.burstLimit]}
                      onValueChange={(value) => setRateLimitSettings({ ...rateLimitSettings, burstLimit: value[0] })}
                      max={10000}
                      min={100}
                      step={100}
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Maximum burst of requests allowed
                    </p>
                  </div>

                  <div>
                    <Label>Time Window: {rateLimitSettings.timeWindow} seconds</Label>
                    <Slider
                      value={[rateLimitSettings.timeWindow]}
                      onValueChange={(value) => setRateLimitSettings({ ...rateLimitSettings, timeWindow: value[0] })}
                      max={3600}
                      min={10}
                      step={10}
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Time window for rate limit calculation
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-semibold mb-2">Current Configuration</h4>
                    <div className="space-y-1 text-sm">
                      <p>• Maximum {rateLimitSettings.defaultLimit} requests per minute</p>
                      <p>• Burst limit of {rateLimitSettings.burstLimit} requests</p>
                      <p>• Calculated over {rateLimitSettings.timeWindow} second window</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>Access API documentation and examples</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Base URL</h4>
                <code className="bg-muted px-3 py-1 rounded font-mono text-sm">
                  https://api.example.com/v1
                </code>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Authentication</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Include your API key in the Authorization header:
                </p>
                <code className="bg-muted px-3 py-1 rounded font-mono text-sm block">
                  Authorization: Bearer YOUR_API_KEY
                </code>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Example Request</h4>
                <pre className="bg-muted p-3 rounded font-mono text-xs overflow-x-auto">
{`curl -X GET "https://api.example.com/v1/products" \\
  -H "Authorization: Bearer sk_live_masked" \\
  -H "Content-Type: application/json"`}
                </pre>
              </div>

              <Button size="sm" variant="outline" className="w-full" onClick={() => toast({ title: 'View Details', description: 'Loading details...' })}>
                View Full Documentation
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create API Key Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
            <DialogDescription>
              Generate a new API key for your application
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="key-name">API Key Name</Label>
              <Input
                id="key-name"
                placeholder="e.g., Production API Key"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="key-environment">Environment</Label>
              <Select
                value={formData.environment}
                onValueChange={(value) => setFormData({ ...formData, environment: value })}
              >
                <SelectTrigger id="key-environment" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Permissions</Label>
              <div className="space-y-2 mt-2">
                {['read', 'write', 'delete'].map(permission => (
                  <div key={permission} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`perm-${permission}`}
                      checked={formData.permissions.includes(permission)}
                      onChange={() => togglePermission(permission)}
                      className="rounded"
                    />
                    <Label htmlFor={`perm-${permission}`} className="text-sm font-normal capitalize">
                      {permission}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Rate Limit: {formData.rateLimit} requests/min</Label>
              <Slider
                value={[formData.rateLimit]}
                onValueChange={(value) => setFormData({ ...formData, rateLimit: value[0] })}
                max={5000}
                min={10}
                step={10}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveAPIKey}>
              Create API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete API Key?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this API key? This action cannot be undone and will immediately revoke access.
              {keyToDelete && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="font-semibold">{keyToDelete.name}</p>
                  <p className="text-sm text-muted-foreground mt-1 font-mono">
                    {maskKey(keyToDelete.key)}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAPIKey}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete API Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
