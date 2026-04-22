import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Zap, Edit, Trash2, Search, Play, Pause } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

export default function Automation() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingWorkflow, setEditingWorkflow] = useState(null)
  const [deletingWorkflowId, setDeletingWorkflowId] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    trigger: '',
    action: '',
    description: ''
  })

  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      name: 'Welcome Email',
      trigger: 'New Customer',
      action: 'Send Email',
      description: 'Send welcome email to new customers',
      status: 'active',
      executions: 1234
    },
    {
      id: 2,
      name: 'Low Stock Alert',
      trigger: 'Stock < 10',
      action: 'Send Notification',
      description: 'Alert when product stock is low',
      status: 'active',
      executions: 456
    },
    {
      id: 3,
      name: 'Order Confirmation',
      trigger: 'Order Placed',
      action: 'Send Email + SMS',
      description: 'Confirm order via email and SMS',
      status: 'active',
      executions: 2345
    },
    {
      id: 4,
      name: 'Abandoned Cart',
      trigger: 'Cart Idle 24h',
      action: 'Send Email',
      description: 'Remind customers about abandoned carts',
      status: 'paused',
      executions: 789
    },
    {
      id: 5,
      name: 'Review Request',
      trigger: 'Order Delivered',
      action: 'Send Email',
      description: 'Request product review after delivery',
      status: 'active',
      executions: 567
    }
  ])

  const filteredWorkflows = workflows.filter(wf =>
    wf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wf.trigger.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenDialog = (workflow = null) => {
    if (workflow) {
      setEditingWorkflow(workflow)
      setFormData({
        name: workflow.name,
        trigger: workflow.trigger,
        action: workflow.action,
        description: workflow.description
      })
    } else {
      setEditingWorkflow(null)
      setFormData({ name: '', trigger: '', action: '', description: '' })
    }
    setIsDialogOpen(true)
  }

  const handleSaveWorkflow = () => {
    if (editingWorkflow) {
      setWorkflows(workflows.map(wf => 
        wf.id === editingWorkflow.id 
          ? {
              ...wf,
              name: formData.name,
              trigger: formData.trigger,
              action: formData.action,
              description: formData.description
            }
          : wf
      ))
    } else {
      const newWorkflow = {
        id: Math.max(...workflows.map(wf => wf.id)) + 1,
        name: formData.name,
        trigger: formData.trigger,
        action: formData.action,
        description: formData.description,
        status: 'active',
        executions: 0
      }
      setWorkflows([...workflows, newWorkflow])
    }
    setIsDialogOpen(false)
    setFormData({ name: '', trigger: '', action: '', description: '' })
  }

  const handleDeleteClick = (workflowId) => {
    setDeletingWorkflowId(workflowId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    setWorkflows(workflows.filter(wf => wf.id !== deletingWorkflowId))
    setIsDeleteDialogOpen(false)
    setDeletingWorkflowId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automation & Workflows</h1>
          <p className="text-muted-foreground mt-2">
            Automate repetitive tasks and create custom workflows
          </p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white gap-2" onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4" />
          Add Workflow
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflows.length}</div>
            <p className="text-xs text-muted-foreground">Active workflows</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Executions</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflows.reduce((sum, wf) => sum + wf.executions, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total executions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflows.filter(wf => wf.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">Running now</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paused</CardTitle>
            <Pause className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflows.filter(wf => wf.status === 'paused').length}</div>
            <p className="text-xs text-muted-foreground">Temporarily stopped</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Workflows</CardTitle>
              <CardDescription>Manage automation workflows and triggers</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workflow Name</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Executions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell className="font-medium">{workflow.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{workflow.trigger}</Badge>
                  </TableCell>
                  <TableCell>{workflow.action}</TableCell>
                  <TableCell>{workflow.executions.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                      {workflow.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(workflow)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(workflow.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingWorkflow ? 'Edit Workflow' : 'Create Workflow'}</DialogTitle>
            <DialogDescription>
              {editingWorkflow ? 'Update workflow configuration' : 'Define a new automation workflow'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="workflow-name">Workflow Name</Label>
              <Input 
                id="workflow-name" 
                placeholder="e.g., Welcome Email" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="trigger">Trigger</Label>
                <Select value={formData.trigger} onValueChange={(value) => setFormData({...formData, trigger: value})}>
                  <SelectTrigger id="trigger">
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New Customer">New Customer</SelectItem>
                    <SelectItem value="Order Placed">Order Placed</SelectItem>
                    <SelectItem value="Order Delivered">Order Delivered</SelectItem>
                    <SelectItem value="Stock < 10">Stock Low</SelectItem>
                    <SelectItem value="Cart Idle 24h">Cart Abandoned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="action">Action</Label>
                <Select value={formData.action} onValueChange={(value) => setFormData({...formData, action: value})}>
                  <SelectTrigger id="action">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Send Email">Send Email</SelectItem>
                    <SelectItem value="Send SMS">Send SMS</SelectItem>
                    <SelectItem value="Send Notification">Send Notification</SelectItem>
                    <SelectItem value="Send Email + SMS">Send Email + SMS</SelectItem>
                    <SelectItem value="Update Status">Update Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe what this workflow does" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveWorkflow}>{editingWorkflow ? 'Update Workflow' : 'Create Workflow'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the workflow.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
