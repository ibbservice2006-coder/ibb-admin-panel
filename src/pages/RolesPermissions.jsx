import { useState } from 'react'
import { Search, Plus, Edit, Trash2, Shield, Lock, Users, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function RolesPermissions() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  })

  const permissionGroups = [
    {
      name: 'Products',
      permissions: ['view_products', 'create_products', 'edit_products', 'delete_products']
    },
    {
      name: 'Orders',
      permissions: ['view_orders', 'create_orders', 'edit_orders', 'delete_orders']
    },
    {
      name: 'Customers',
      permissions: ['view_customers', 'create_customers', 'edit_customers', 'delete_customers']
    },
    {
      name: 'Marketing',
      permissions: ['view_marketing', 'create_marketing', 'edit_marketing', 'delete_marketing']
    },
    {
      name: 'Reports',
      permissions: ['view_reports', 'export_reports']
    },
    {
      name: 'Settings',
      permissions: ['view_settings', 'edit_settings']
    },
    {
      name: 'Users',
      permissions: ['view_users', 'create_users', 'edit_users', 'delete_users']
    }
  ]

  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      userCount: 2,
      permissions: permissionGroups.flatMap(g => g.permissions),
      isSystem: true,
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      name: 'Admin',
      description: 'Administrative access with most permissions',
      userCount: 5,
      permissions: [
        'view_products', 'create_products', 'edit_products', 'delete_products',
        'view_orders', 'create_orders', 'edit_orders',
        'view_customers', 'edit_customers',
        'view_marketing', 'create_marketing', 'edit_marketing',
        'view_reports', 'export_reports',
        'view_settings'
      ],
      isSystem: true,
      createdAt: '2024-01-01'
    },
    {
      id: 3,
      name: 'Manager',
      description: 'Can manage products and orders',
      userCount: 8,
      permissions: [
        'view_products', 'create_products', 'edit_products',
        'view_orders', 'edit_orders',
        'view_customers',
        'view_reports'
      ],
      isSystem: false,
      createdAt: '2024-02-15'
    },
    {
      id: 4,
      name: 'Staff',
      description: 'Basic access for daily operations',
      userCount: 15,
      permissions: [
        'view_products', 'edit_products',
        'view_orders', 'edit_orders',
        'view_customers'
      ],
      isSystem: false,
      createdAt: '2024-03-10'
    },
    {
      id: 5,
      name: 'Viewer',
      description: 'Read-only access to view data',
      userCount: 3,
      permissions: [
        'view_products',
        'view_orders',
        'view_customers',
        'view_reports'
      ],
      isSystem: false,
      createdAt: '2024-04-05'
    }
  ])

  const stats = [
    {
      title: 'Total Roles',
      value: roles.length,
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Permissions',
      value: permissionGroups.reduce((acc, g) => acc + g.permissions.length, 0),
      icon: Lock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Active Roles',
      value: roles.filter(r => r.userCount > 0).length,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Custom Roles',
      value: roles.filter(r => !r.isSystem).length,
      icon: Settings,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddClick = () => {
    setFormData({ name: '', description: '', permissions: [] })
    setIsAddDialogOpen(true)
  }

  const handleEditClick = (role) => {
    setSelectedRole(role)
    setFormData({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions]
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (role) => {
    setSelectedRole(role)
    setIsDeleteDialogOpen(true)
  }

  const handleAdd = () => {
    const newRole = {
      id: roles.length + 1,
      ...formData,
      userCount: 0,
      isSystem: false,
      createdAt: new Date().toISOString().split('T')[0]
    }
    setRoles([...roles, newRole])
    setIsAddDialogOpen(false)
  }

  const handleSave = () => {
    setRoles(roles.map(role =>
      role.id === selectedRole.id ? { ...role, ...formData } : role
    ))
    setIsEditDialogOpen(false)
  }

  const handleDelete = () => {
    setRoles(roles.filter(role => role.id !== selectedRole.id))
    setIsDeleteDialogOpen(false)
  }

  const togglePermission = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  const toggleAllInGroup = (group) => {
    const allSelected = group.permissions.every(p => formData.permissions.includes(p))
    setFormData(prev => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter(p => !group.permissions.includes(p))
        : [...new Set([...prev.permissions, ...group.permissions])]
    }))
  }

  const formatPermissionName = (permission) => {
    return permission.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Roles & Permissions</h1>
        <p className="text-muted-foreground">Manage user roles and access permissions</p>
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
              <CardTitle>All Roles</CardTitle>
              <CardDescription>Manage roles and their permissions</CardDescription>
            </div>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleAddClick}>
              <Plus className="mr-2 h-4 w-4" />
              Add Role
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
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
                {filteredRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No roles found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          <div className="font-medium">{role.name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="text-sm text-muted-foreground truncate">
                          {role.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{role.userCount} users</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{role.permissions.length} permissions</Badge>
                      </TableCell>
                      <TableCell>
                        {role.isSystem ? (
                          <Badge className="bg-gray-700 hover:bg-gray-600 text-white">System</Badge>
                        ) : (
                          <Badge variant="outline">Custom</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(role)}
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(role)}
                            disabled={role.isSystem}
                          >
                            <Trash2 className={`h-4 w-4 ${role.isSystem ? 'text-gray-400' : 'text-red-600'}`} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        setIsAddDialogOpen(false)
        setIsEditDialogOpen(false)
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isAddDialogOpen ? 'Add New Role' : 'Edit Role'}</DialogTitle>
            <DialogDescription>
              {isAddDialogOpen ? 'Create a new role with specific permissions' : 'Update role information and permissions'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Content Manager"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the role and its responsibilities"
                rows={3}
              />
            </div>
            <div className="space-y-4">
              <Label>Permissions</Label>
              <div className="border rounded-lg p-4 space-y-4">
                {permissionGroups.map((group) => (
                  <div key={group.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={group.permissions.every(p => formData.permissions.includes(p))}
                          onCheckedChange={() => toggleAllInGroup(group)}
                        />
                        <Label className="font-semibold">{group.name}</Label>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {formData.permissions.filter(p => group.permissions.includes(p)).length}/{group.permissions.length}
                      </Badge>
                    </div>
                    <div className="ml-6 grid grid-cols-2 gap-2">
                      {group.permissions.map((permission) => (
                        <div key={permission} className="flex items-center gap-2">
                          <Checkbox
                            checked={formData.permissions.includes(permission)}
                            onCheckedChange={() => togglePermission(permission)}
                          />
                          <Label className="text-sm font-normal cursor-pointer">
                            {formatPermissionName(permission)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Selected: {formData.permissions.length} permissions
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => {
              setIsAddDialogOpen(false)
              setIsEditDialogOpen(false)
            }}>
              Cancel
            </Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={isAddDialogOpen ? handleAdd : handleSave}>
              {isAddDialogOpen ? 'Add Role' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the role
              <strong> {selectedRole?.name}</strong> and remove it from all users.
              {selectedRole?.userCount > 0 && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                  ⚠️ This role is currently assigned to {selectedRole.userCount} user(s).
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
