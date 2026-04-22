import React, { useState } from 'react';
import { Webhook, Plus, Edit, Trash2, Play, Copy, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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

export default function Webhooks() {
  const [webhooks, setWebhooks] = useState([
    {
      id: 1,
      name: 'Order Created Notification',
      url: 'https://api.example.com/webhooks/order-created',
      event: 'order.created',
      method: 'POST',
      status: 'active',
      lastTriggered: '2025-10-06 16:45:00',
      successRate: 98.5,
      totalCalls: 1250
    },
    {
      id: 2,
      name: 'Payment Received',
      url: 'https://api.example.com/webhooks/payment',
      event: 'payment.received',
      method: 'POST',
      status: 'active',
      lastTriggered: '2025-10-06 16:30:00',
      successRate: 99.2,
      totalCalls: 890
    },
    {
      id: 3,
      name: 'Customer Registration',
      url: 'https://api.example.com/webhooks/customer',
      event: 'customer.created',
      method: 'POST',
      status: 'active',
      lastTriggered: '2025-10-06 15:20:00',
      successRate: 97.8,
      totalCalls: 450
    },
    {
      id: 4,
      name: 'Inventory Low Stock',
      url: 'https://api.example.com/webhooks/inventory',
      event: 'inventory.low',
      method: 'POST',
      status: 'paused',
      lastTriggered: '2025-10-05 14:00:00',
      successRate: 95.0,
      totalCalls: 120
    }
  ]);

  const [webhookLogs, setWebhookLogs] = useState([
    {
      id: 1,
      webhook: 'Order Created Notification',
      timestamp: '2025-10-06 16:45:23',
      status: 'success',
      statusCode: 200,
      responseTime: '245ms',
      payload: { order_id: 'ORD-1234', total: 299.99 }
    },
    {
      id: 2,
      webhook: 'Payment Received',
      timestamp: '2025-10-06 16:30:15',
      status: 'success',
      statusCode: 200,
      responseTime: '180ms',
      payload: { payment_id: 'PAY-5678', amount: 299.99 }
    },
    {
      id: 3,
      webhook: 'Order Created Notification',
      timestamp: '2025-10-06 16:20:45',
      status: 'failed',
      statusCode: 500,
      responseTime: '5000ms',
      payload: { order_id: 'ORD-1235', total: 149.99 },
      error: 'Internal Server Error'
    },
    {
      id: 4,
      webhook: 'Customer Registration',
      timestamp: '2025-10-06 15:20:30',
      status: 'success',
      statusCode: 201,
      responseTime: '320ms',
      payload: { customer_id: 'CST-9012', email: 'user@example.com' }
    }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState(null);
  const [webhookToDelete, setWebhookToDelete] = useState(null);
  const [webhookToTest, setWebhookToTest] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    event: '',
    method: 'POST',
    headers: '',
    payload: ''
  });

  const events = [
    'order.created',
    'order.updated',
    'order.cancelled',
    'payment.received',
    'payment.failed',
    'customer.created',
    'customer.updated',
    'product.created',
    'product.updated',
    'inventory.low'
  ];

  const handleCreateWebhook = () => {
    setEditingWebhook(null);
    setFormData({
      name: '',
      url: '',
      event: '',
      method: 'POST',
      headers: '',
      payload: ''
    });
    setDialogOpen(true);
  };

  const handleEditWebhook = (webhook) => {
    setEditingWebhook(webhook);
    setFormData({
      name: webhook.name,
      url: webhook.url,
      event: webhook.event,
      method: webhook.method,
      headers: '',
      payload: ''
    });
    setDialogOpen(true);
  };

  const handleSaveWebhook = () => {
    if (editingWebhook) {
      setWebhooks(webhooks.map(w => 
        w.id === editingWebhook.id 
          ? { ...w, ...formData, status: 'active' }
          : w
      ));
    } else {
      const newWebhook = {
        id: webhooks.length + 1,
        ...formData,
        status: 'active',
        lastTriggered: 'Never',
        successRate: 0,
        totalCalls: 0
      };
      setWebhooks([...webhooks, newWebhook]);
    }
    setDialogOpen(false);
  };

  const handleDeleteWebhook = (webhook) => {
    setWebhookToDelete(webhook);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteWebhook = () => {
    if (webhookToDelete) {
      setWebhooks(webhooks.filter(w => w.id !== webhookToDelete.id));
      setDeleteDialogOpen(false);
      setWebhookToDelete(null);
    }
  };

  const handleTestWebhook = (webhook) => {
    setWebhookToTest(webhook);
    setTestDialogOpen(true);
  };

  const confirmTestWebhook = () => {
    // Simulate webhook test
    const newLog = {
      id: webhookLogs.length + 1,
      webhook: webhookToTest.name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'success',
      statusCode: 200,
      responseTime: `${Math.floor(Math.random() * 300) + 100}ms`,
      payload: { test: true }
    };
    setWebhookLogs([newLog, ...webhookLogs]);
    setTestDialogOpen(false);
    setWebhookToTest(null);
  };

  const handleToggleStatus = (webhookId) => {
    setWebhooks(webhooks.map(w => 
      w.id === webhookId 
        ? { ...w, status: w.status === 'active' ? 'paused' : 'active' }
        : w
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getLogStatusColor = (status) => {
    return status === 'success' ? 'bg-green-500' : 'bg-red-500';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Webhooks</h1>
          <p className="text-muted-foreground mt-2">
            Configure webhooks to send real-time notifications to external services
          </p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleCreateWebhook}>
          <Plus className="w-4 h-4 mr-2" />
          Create Webhook
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Webhooks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{webhooks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {webhooks.filter(w => w.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {webhooks.reduce((sum, w) => sum + w.totalCalls, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {(webhooks.reduce((sum, w) => sum + w.successRate, 0) / webhooks.length).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Webhooks List */}
      <Card>
        <CardHeader>
          <CardTitle>Configured Webhooks</CardTitle>
          <CardDescription>Manage your webhook endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <div
                key={webhook.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <Webhook className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">{webhook.name}</h3>
                      <Badge className={getStatusColor(webhook.status)}>
                        {webhook.status}
                      </Badge>
                      <Badge variant="outline">{webhook.event}</Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <code className="bg-muted px-2 py-1 rounded">{webhook.method}</code>
                      <span>{webhook.url}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Last Triggered</p>
                        <p className="font-medium">{webhook.lastTriggered}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Calls</p>
                        <p className="font-medium">{webhook.totalCalls.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Success Rate</p>
                        <p className="font-medium text-green-600">{webhook.successRate}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={webhook.status === 'active'}
                        onCheckedChange={() => handleToggleStatus(webhook.id)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {webhook.status === 'active' ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestWebhook(webhook)}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditWebhook(webhook)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteWebhook(webhook)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Webhook Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Webhook Calls</CardTitle>
          <CardDescription>Monitor webhook execution history</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Webhook</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Status Code</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Payload</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhookLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.webhook}</TableCell>
                  <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                  <TableCell>
                    <Badge className={getLogStatusColor(log.status)}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.statusCode}</Badge>
                  </TableCell>
                  <TableCell>{log.responseTime}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {JSON.stringify(log.payload)}
                    </code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Webhook Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingWebhook ? 'Edit Webhook' : 'Create New Webhook'}</DialogTitle>
            <DialogDescription>
              Configure webhook endpoint and event trigger
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="webhook-name">Webhook Name</Label>
              <Input
                id="webhook-name"
                placeholder="e.g., Order Created Notification"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="webhook-url">Endpoint URL</Label>
              <Input
                id="webhook-url"
                placeholder="https://api.example.com/webhooks/endpoint"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="webhook-event">Event</Label>
                <Select
                  value={formData.event}
                  onValueChange={(value) => setFormData({ ...formData, event: value })}
                >
                  <SelectTrigger id="webhook-event" className="mt-2">
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map(event => (
                      <SelectItem key={event} value={event}>{event}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="webhook-method">HTTP Method</Label>
                <Select
                  value={formData.method}
                  onValueChange={(value) => setFormData({ ...formData, method: value })}
                >
                  <SelectTrigger id="webhook-method" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="webhook-headers">Custom Headers (JSON)</Label>
              <Textarea
                id="webhook-headers"
                placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                value={formData.headers}
                onChange={(e) => setFormData({ ...formData, headers: e.target.value })}
                className="mt-2 font-mono text-sm"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="webhook-payload">Custom Payload Template (JSON)</Label>
              <Textarea
                id="webhook-payload"
                placeholder='{"event": "{{event}}", "data": "{{data}}"}'
                value={formData.payload}
                onChange={(e) => setFormData({ ...formData, payload: e.target.value })}
                className="mt-2 font-mono text-sm"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveWebhook}>
              {editingWebhook ? 'Save Changes' : 'Create Webhook'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Webhook?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this webhook? This action cannot be undone.
              {webhookToDelete && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="font-semibold">{webhookToDelete.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {webhookToDelete.url}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteWebhook}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Webhook
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Test Webhook Dialog */}
      <AlertDialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Test Webhook</AlertDialogTitle>
            <AlertDialogDescription>
              Send a test request to this webhook endpoint to verify it's working correctly.
              {webhookToTest && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="font-semibold">{webhookToTest.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {webhookToTest.url}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmTestWebhook}>
              Send Test Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
