import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast'
import { Zap, Play, Pause, Trash2, Edit, Plus, Clock, CheckCircle, XCircle, Copy, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

export default function MacrosAutomation() {
  const { toast } = useToast()
  const [macros, setMacros] = useState([
    {
      id: 1,
      name: 'Daily Sales Report',
      description: 'Generate and email daily sales report at 9 AM',
      trigger: 'schedule',
      schedule: 'Daily at 9:00 AM',
      actions: ['Query Database', 'Generate Report', 'Send Email'],
      status: 'active',
      lastRun: '2025-10-06 09:00:00',
      nextRun: '2025-10-07 09:00:00',
      executions: 245,
      successRate: 98.8
    },
    {
      id: 2,
      name: 'Low Stock Alert',
      description: 'Send notification when product stock falls below threshold',
      trigger: 'event',
      event: 'Stock Update',
      actions: ['Check Stock Level', 'Send Notification'],
      status: 'active',
      lastRun: '2025-10-06 14:30:00',
      nextRun: 'On Event',
      executions: 1250,
      successRate: 99.2
    },
    {
      id: 3,
      name: 'Customer Welcome Email',
      description: 'Send welcome email to new customers',
      trigger: 'event',
      event: 'New Customer',
      actions: ['Get Customer Info', 'Send Welcome Email', 'Add to Newsletter'],
      status: 'active',
      lastRun: '2025-10-06 16:45:00',
      nextRun: 'On Event',
      executions: 890,
      successRate: 97.5
    },
    {
      id: 4,
      name: 'Weekly Backup',
      description: 'Create full database backup every Sunday',
      trigger: 'schedule',
      schedule: 'Weekly on Sunday at 2:00 AM',
      actions: ['Create Backup', 'Verify Backup', 'Upload to Cloud'],
      status: 'paused',
      lastRun: '2025-09-29 02:00:00',
      nextRun: 'Paused',
      executions: 52,
      successRate: 100
    }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [macroToDelete, setMacroToDelete] = useState(null);
  const [editingMacro, setEditingMacro] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger: 'schedule',
    schedule: '',
    event: '',
    actions: []
  });

  const handleCreateMacro = () => {
    setEditingMacro(null);
    setFormData({
      name: '',
      description: '',
      trigger: 'schedule',
      schedule: '',
      event: '',
      actions: []
    });
    setDialogOpen(true);
  };

  const handleEditMacro = (macro) => {
    setEditingMacro(macro);
    setFormData({
      name: macro.name,
      description: macro.description,
      trigger: macro.trigger,
      schedule: macro.schedule || '',
      event: macro.event || '',
      actions: macro.actions
    });
    setDialogOpen(true);
  };

  const handleSaveMacro = () => {
    if (editingMacro) {
      setMacros(macros.map(m => 
        m.id === editingMacro.id 
          ? { ...m, ...formData, status: 'active' }
          : m
      ));
    } else {
      const newMacro = {
        id: macros.length + 1,
        ...formData,
        status: 'active',
        lastRun: 'Never',
        nextRun: formData.trigger === 'schedule' ? formData.schedule : 'On Event',
        executions: 0,
        successRate: 0
      };
      setMacros([...macros, newMacro]);
    }
    setDialogOpen(false);
  };

  const handleDeleteMacro = (macro) => {
    setMacroToDelete(macro);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteMacro = () => {
    if (macroToDelete) {
      setMacros(macros.filter(m => m.id !== macroToDelete.id));
      setDeleteDialogOpen(false);
      setMacroToDelete(null);
    }
  };

  const handleToggleStatus = (macroId) => {
    setMacros(macros.map(m => 
      m.id === macroId 
        ? { ...m, status: m.status === 'active' ? 'paused' : 'active' }
        : m
    ));
  };

  const handleDuplicateMacro = (macro) => {
    const newMacro = {
      ...macro,
      id: macros.length + 1,
      name: `${macro.name} (Copy)`,
      executions: 0,
      lastRun: 'Never'
    };
    setMacros([...macros, newMacro]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTriggerIcon = (trigger) => {
    return trigger === 'schedule' ? <Clock className="w-4 h-4" /> : <Zap className="w-4 h-4" />;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Macros & Automation</h1>
          <p className="text-muted-foreground mt-2">
            Create automated workflows to streamline your operations
          </p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleCreateMacro}>
          <Plus className="w-4 h-4 mr-2" />
          Create Macro
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Macros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{macros.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {macros.filter(m => m.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Executions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {macros.reduce((sum, m) => sum + m.executions, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {(macros.reduce((sum, m) => sum + m.successRate, 0) / macros.length).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Macros List with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Automation Workflows</CardTitle>
          <CardDescription>View and manage your automated tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="space-y-4">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
      <div className="space-y-4">
        {macros.map((macro) => (
          <Card key={macro.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getTriggerIcon(macro.trigger)}
                      <h3 className="text-lg font-semibold">{macro.name}</h3>
                    </div>
                    <Badge className={getStatusColor(macro.status)}>
                      {macro.status}
                    </Badge>
                    <Badge variant="outline">
                      {macro.trigger === 'schedule' ? 'Scheduled' : 'Event-based'}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">{macro.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {macro.actions.map((action, index) => (
                      <Badge key={index} variant="secondary">
                        {action}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Last Run</p>
                      <p className="font-medium">{macro.lastRun}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Next Run</p>
                      <p className="font-medium">{macro.nextRun}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Executions</p>
                      <p className="font-medium">{macro.executions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Success Rate</p>
                      <p className="font-medium text-green-600">{macro.successRate}%</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={macro.status === 'active'}
                      onCheckedChange={() => handleToggleStatus(macro.id)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {macro.status === 'active' ? 'Active' : 'Paused'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditMacro(macro)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicateMacro(macro)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteMacro(macro)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-4">
              {/* Calendar View */}
              <div className="space-y-4">
                {/* Calendar Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">October 2025</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>Previous</Button>
                    <Button variant="outline" size="sm" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>Today</Button>
                    <Button variant="outline" size="sm" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>Next</Button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Day Headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-semibold text-sm text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}

                  {/* Calendar Days */}
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 2; // Start from day -2 to show previous month days
                    const isToday = day === 6; // Oct 6 is today
                    const hasScheduled = [6, 7, 13, 14, 20, 21, 27, 28].includes(day); // Days with scheduled tasks
                    
                    return (
                      <div
                        key={i}
                        className={`min-h-[100px] border rounded-lg p-2 ${
                          day < 1 || day > 31 ? 'bg-muted/30' : 'bg-card'
                        } ${isToday ? 'ring-2 ring-primary' : ''} hover:shadow-md transition-shadow`}
                      >
                        <div className={`text-sm font-medium mb-2 ${isToday ? 'text-primary' : ''}`}>
                          {day > 0 && day <= 31 ? day : ''}
                        </div>
                        
                        {hasScheduled && day > 0 && day <= 31 && (
                          <div className="space-y-1">
                            {macros
                              .filter(m => m.status === 'active' && m.trigger === 'schedule')
                              .slice(0, 2)
                              .map((macro, idx) => (
                                <div
                                  key={idx}
                                  className="text-xs bg-primary/10 border border-primary/20 rounded px-2 py-1 truncate cursor-pointer hover:bg-primary/20"
                                  title={macro.name}
                                >
                                  <Clock className="w-3 h-3 inline mr-1" />
                                  {macro.name}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border-2 border-primary"></div>
                    <span>Today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-primary/10 border border-primary/20"></div>
                    <span>Scheduled Tasks</span>
                  </div>
                </div>

                {/* Upcoming Scheduled Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Upcoming Scheduled Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {macros
                        .filter(m => m.status === 'active' && m.trigger === 'schedule')
                        .map((macro) => (
                          <div key={macro.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-primary" />
                              <div>
                                <p className="font-medium">{macro.name}</p>
                                <p className="text-sm text-muted-foreground">{macro.schedule}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{macro.nextRun}</p>
                              <Badge variant="secondary" className="text-xs">
                                {macro.executions} runs
                              </Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Create/Edit Macro Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingMacro ? 'Edit Macro' : 'Create New Macro'}</DialogTitle>
            <DialogDescription>
              Configure your automation workflow
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="macro-name">Macro Name</Label>
              <Input
                id="macro-name"
                placeholder="e.g., Daily Sales Report"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="macro-description">Description</Label>
              <Textarea
                id="macro-description"
                placeholder="Describe what this macro does..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-2"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="trigger-type">Trigger Type</Label>
              <Select
                value={formData.trigger}
                onValueChange={(value) => setFormData({ ...formData, trigger: value })}
              >
                <SelectTrigger id="trigger-type" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="schedule">Schedule (Time-based)</SelectItem>
                  <SelectItem value="event">Event (Action-based)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.trigger === 'schedule' && (
              <div>
                <Label htmlFor="schedule">Schedule</Label>
                <Input
                  id="schedule"
                  placeholder="e.g., Daily at 9:00 AM"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  className="mt-2"
                />
              </div>
            )}

            {formData.trigger === 'event' && (
              <div>
                <Label htmlFor="event">Event</Label>
                <Select
                  value={formData.event}
                  onValueChange={(value) => setFormData({ ...formData, event: value })}
                >
                  <SelectTrigger id="event" className="mt-2">
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New Customer">New Customer</SelectItem>
                    <SelectItem value="New Order">New Order</SelectItem>
                    <SelectItem value="Stock Update">Stock Update</SelectItem>
                    <SelectItem value="Payment Received">Payment Received</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>Actions (comma-separated)</Label>
              <Input
                placeholder="e.g., Query Database, Generate Report, Send Email"
                value={formData.actions.join(', ')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  actions: e.target.value.split(',').map(a => a.trim()).filter(a => a)
                })}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveMacro}>
              {editingMacro ? 'Save Changes' : 'Create Macro'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Macro?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this macro? This action cannot be undone.
              {macroToDelete && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="font-semibold">{macroToDelete.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {macroToDelete.executions} executions | {macroToDelete.successRate}% success rate
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteMacro}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Macro
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
