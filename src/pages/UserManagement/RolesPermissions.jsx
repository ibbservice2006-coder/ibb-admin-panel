import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Shield, Plus, Edit, Trash2, Search, Lock, Users, Settings } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const permissionGroups = [
  { name: 'Dashboard', permissions: ['view_dashboard', 'export_dashboard'] },
  { name: 'Bookings', permissions: ['view_bookings', 'create_bookings', 'edit_bookings', 'delete_bookings'] },
  { name: 'Fleet & Vehicles', permissions: ['view_fleet', 'create_fleet', 'edit_fleet', 'delete_fleet'] },
  { name: 'Drivers', permissions: ['view_drivers', 'create_drivers', 'edit_drivers', 'delete_drivers'] },
  { name: 'Customers', permissions: ['view_customers', 'create_customers', 'edit_customers', 'delete_customers'] },
  { name: 'Routes', permissions: ['view_routes', 'create_routes', 'edit_routes', 'delete_routes'] },
  { name: 'Pricing', permissions: ['view_pricing', 'create_pricing', 'edit_pricing', 'delete_pricing'] },
  { name: 'Currency & FX', permissions: ['view_currency', 'edit_currency'] },
  { name: 'Membership', permissions: ['view_membership', 'create_membership', 'edit_membership', 'delete_membership'] },
  { name: 'Wallet & Payments', permissions: ['view_wallet', 'process_payments', 'refund_payments'] },
  { name: 'Vouchers & Promotions', permissions: ['view_vouchers', 'create_vouchers', 'edit_vouchers', 'delete_vouchers'] },
  { name: 'External Platforms', permissions: ['view_platforms', 'manage_platforms'] },
  { name: 'GPS Tracking', permissions: ['view_gps', 'manage_gps'] },
  { name: 'Partners & Affiliates', permissions: ['view_partners', 'create_partners', 'edit_partners', 'delete_partners'] },
  { name: 'Reports & Analytics', permissions: ['view_reports', 'export_reports', 'view_advanced_analytics'] },
  { name: 'Notifications', permissions: ['view_notifications', 'send_notifications', 'manage_notification_rules'] },
  { name: 'Support', permissions: ['view_support', 'manage_support'] },
  { name: 'User Management', permissions: ['view_users', 'create_users', 'edit_users', 'delete_users'] },
  { name: 'Roles & Permissions', permissions: ['view_roles', 'manage_roles'] },
  { name: 'Activity Logs', permissions: ['view_logs', 'export_logs'] },
  { name: 'Audit Trail', permissions: ['view_audit'] },
  { name: 'Settings', permissions: ['view_settings', 'edit_settings'] },
  { name: 'System & Security', permissions: ['manage_security', 'manage_integrations', 'manage_api_keys'] },
]

const allPermissions = permissionGroups.flatMap(g => g.permissions)

const initialRoles = [
  { id: 1, name: 'Super Admin', description: 'Full system access with all permissions', userCount: 2, permissions: allPermissions, isSystem: true, createdAt: '2023-01-01' },
  { id: 2, name: 'Operations Manager', description: 'Manage bookings, fleet, drivers, and routes', userCount: 3, permissions: ['view_dashboard','view_bookings','create_bookings','edit_bookings','view_fleet','edit_fleet','view_drivers','edit_drivers','view_routes','edit_routes','view_gps','view_reports','export_reports','view_notifications'], isSystem: true, createdAt: '2023-01-01' },
  { id: 3, name: 'Finance Manager', description: 'Manage pricing, payments, and financial reports', userCount: 2, permissions: ['view_dashboard','view_pricing','create_pricing','edit_pricing','view_currency','edit_currency','view_wallet','process_payments','refund_payments','view_reports','export_reports','view_advanced_analytics'], isSystem: true, createdAt: '2023-01-01' },
  { id: 4, name: 'Customer Support Lead', description: 'Handle customer issues, bookings, and refunds', userCount: 4, permissions: ['view_dashboard','view_bookings','edit_bookings','view_customers','edit_customers','view_wallet','refund_payments','view_vouchers','view_support','manage_support','view_notifications'], isSystem: false, createdAt: '2023-03-15' },
  { id: 5, name: 'Fleet Manager', description: 'Manage vehicles, maintenance, and GPS tracking', userCount: 2, permissions: ['view_dashboard','view_fleet','create_fleet','edit_fleet','delete_fleet','view_drivers','view_gps','manage_gps','view_reports'], isSystem: false, createdAt: '2023-04-20' },
  { id: 6, name: 'Marketing Manager', description: 'Manage promotions, vouchers, and partners', userCount: 2, permissions: ['view_dashboard','view_vouchers','create_vouchers','edit_vouchers','delete_vouchers','view_partners','create_partners','edit_partners','view_membership','view_reports','view_notifications','send_notifications'], isSystem: false, createdAt: '2023-05-10' },
  { id: 7, name: 'Booking Agent', description: 'Create and manage bookings only', userCount: 8, permissions: ['view_dashboard','view_bookings','create_bookings','edit_bookings','view_customers','view_routes','view_pricing','view_vouchers'], isSystem: false, createdAt: '2023-06-01' },
  { id: 8, name: 'Driver Coordinator', description: 'Assign drivers and monitor GPS', userCount: 3, permissions: ['view_dashboard','view_bookings','view_drivers','edit_drivers','view_gps','manage_gps','view_routes'], isSystem: false, createdAt: '2023-07-15' },
  { id: 9, name: 'IT Administrator', description: 'System settings, security, and integrations', userCount: 1, permissions: ['view_dashboard','view_settings','edit_settings','manage_security','manage_integrations','manage_api_keys','view_logs','export_logs','view_audit','view_users','create_users','edit_users','delete_users','view_roles','manage_roles'], isSystem: false, createdAt: '2023-08-01' },
]

const formatPermName = (p) => p.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

export default function RolesPermissions() {
  const [roles, setRoles] = useState(initialRoles)
  const [search, setSearch] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '', permissions: [] })
  const { toast } = useToast()

  const filtered = roles.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase())
  )

  const stats = [
    { title: 'Total Roles', value: roles.length, icon: Shield, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { title: 'Total Permissions', value: allPermissions.length, icon: Lock, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { title: 'Active Roles', value: roles.filter(r => r.userCount > 0).length, icon: Users, color: 'text-green-600', bgColor: 'bg-green-100' },
    { title: 'Custom Roles', value: roles.filter(r => !r.isSystem).length, icon: Settings, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  ]

  const togglePermission = (perm) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }))
  }

  const toggleGroup = (group) => {
    const allSelected = group.permissions.every(p => formData.permissions.includes(p))
    setFormData(prev => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter(p => !group.permissions.includes(p))
        : [...new Set([...prev.permissions, ...group.permissions])]
    }))
  }

  const handleAdd = () => {
    const newRole = { id: roles.length + 1, ...formData, userCount: 0, isSystem: false, createdAt: new Date().toISOString().split('T')[0] }
    setRoles([...roles, newRole])
    setIsAddOpen(false)
    toast({ title: 'Role Created', description: `Role "${formData.name}" has been created.` })
  }

  const handleEdit = () => {
    setRoles(roles.map(r => r.id === selectedRole.id ? { ...r, ...formData } : r))
    setIsEditOpen(false)
    toast({ title: 'Role Updated', description: `Role "${formData.name}" has been updated.` })
  }

  const handleDelete = () => {
    setRoles(roles.filter(r => r.id !== selectedRole.id))
    setIsDeleteOpen(false)
    toast({ title: 'Role Deleted', description: `Role "${selectedRole.name}" has been removed.`, variant: 'destructive' })
  }

  const openEdit = (role) => {
    setSelectedRole(role)
    setFormData({ name: role.name, description: role.description, permissions: [...role.permissions] })
    setIsEditOpen(true)
  }

  const openDelete = (role) => { setSelectedRole(role); setIsDeleteOpen(true) }
  const openAdd = () => { setFormData({ name: '', description: '', permissions: [] }); setIsAddOpen(true) }

  const PermissionForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Role Name</Label>
        <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Route Planner" />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the role and its responsibilities" rows={2} />
      </div>
      <div className="space-y-2">
        <Label>Permissions <span className="text-muted-foreground text-xs">({formData.permissions.length} selected)</span></Label>
        <div className="border rounded-lg p-3 max-h-80 overflow-y-auto space-y-4">
          {permissionGroups.map(group => {
            const allSelected = group.permissions.every(p => formData.permissions.includes(p))
            const count = group.permissions.filter(p => formData.permissions.includes(p)).length
            return (
              <div key={group.name}>
                <div className="flex items-center gap-2 mb-2">
                  <Checkbox checked={allSelected} onCheckedChange={() => toggleGroup(group)} />
                  <span className="font-medium text-sm">{group.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{count}/{group.permissions.length}</span>
                </div>
                <div className="grid grid-cols-2 gap-1 ml-6">
                  {group.permissions.map(perm => (
                    <div key={perm} className="flex items-center gap-2">
                      <Checkbox checked={formData.permissions.includes(perm)} onCheckedChange={() => togglePermission(perm)} />
                      <span className="text-xs text-muted-foreground">{formatPermName(perm)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Roles & Permissions</h1>
        <p className="text-muted-foreground">Manage Roles and Access Rights for all 23 IBB Shuttle modules</p>
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
              <CardTitle>All Roles</CardTitle>
              <CardDescription>Manage roles and permissions for IBB Admin Panel</CardDescription>
            </div>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={openAdd}><Plus />Add Role</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search roles..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(role => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="font-medium">{role.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{role.description}</TableCell>
                    <TableCell className="text-sm">{role.userCount} users</TableCell>
                    <TableCell className="text-sm">{role.permissions.length} permissions</TableCell>
                    <TableCell>
                      <Badge variant={role.isSystem ? 'default' : 'outline'}>{role.isSystem ? 'System' : 'Custom'}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(role)}>
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDelete(role)} disabled={role.isSystem}>
                          <Trash2 className={`h-4 w-4 ${role.isSystem ? 'text-gray-300' : 'text-red-600'}`} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>Create new role with desired permissions</DialogDescription>
          </DialogHeader>
          <PermissionForm />
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleAdd} disabled={!formData.name}>Add Role {formData.permissions.length > 0 && `(${formData.permissions.length} perms)`}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Edit role: {selectedRole?.name}</DialogDescription>
          </DialogHeader>
          <PermissionForm />
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role?</AlertDialogTitle>
            <AlertDialogDescription>
              Deletion role <strong>{selectedRole?.name}</strong> Will affect all admins with this role ({selectedRole?.userCount} users)
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete Role</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
