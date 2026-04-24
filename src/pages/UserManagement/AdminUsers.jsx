import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Users, Plus, Edit, Trash2, Search, Shield, UserCheck, UserX, Key, Clock, Activity
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const avatarColors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-cyan-500', 'bg-orange-500', 'bg-teal-500']

const roleColors = {
  'Super Admin': 'bg-red-100 text-red-800',
  'Operations Manager': 'bg-blue-100 text-blue-800',
  'Finance Manager': 'bg-green-100 text-green-800',
  'Customer Support Lead': 'bg-yellow-100 text-yellow-800',
  'Fleet Manager': 'bg-orange-100 text-orange-800',
  'Marketing Manager': 'bg-purple-100 text-purple-800',
  'Driver Coordinator': 'bg-cyan-100 text-cyan-800',
  'Booking Agent': 'bg-indigo-100 text-indigo-800',
  'IT Administrator': 'bg-gray-100 text-gray-800',
}

const initialUsers = [
  { id: 'ADM-001', name: 'Somchai Rattanakul', email: 'somchai@ibb.co.th', phone: '+66812345678', role: 'Super Admin', department: 'Management', status: 'active', lastLogin: '2 min ago', loginCount: 1842, createdAt: '2023-01-15', twoFA: true, ipLock: false },
  { id: 'ADM-002', name: 'Nattaya Wongprasert', email: 'nattaya@ibb.co.th', phone: '+66823456789', role: 'Operations Manager', department: 'Operations', status: 'active', lastLogin: '15 min ago', loginCount: 1240, createdAt: '2023-02-10', twoFA: true, ipLock: true },
  { id: 'ADM-003', name: 'Prayuth Siriporn', email: 'prayuth@ibb.co.th', phone: '+66834567890', role: 'Finance Manager', department: 'Finance', status: 'active', lastLogin: '1 hr ago', loginCount: 986, createdAt: '2023-03-05', twoFA: true, ipLock: true },
  { id: 'ADM-004', name: 'Wanida Khamchan', email: 'wanida@ibb.co.th', phone: '+66845678901', role: 'Customer Support Lead', department: 'Support', status: 'active', lastLogin: '30 min ago', loginCount: 2140, createdAt: '2023-04-20', twoFA: false, ipLock: false },
  { id: 'ADM-005', name: 'Thanakorn Bunsong', email: 'thanakorn@ibb.co.th', phone: '+66856789012', role: 'Fleet Manager', department: 'Fleet', status: 'active', lastLogin: '2 hr ago', loginCount: 742, createdAt: '2023-05-12', twoFA: true, ipLock: false },
  { id: 'ADM-006', name: 'Siriporn Charoenwong', email: 'siriporn@ibb.co.th', phone: '+66867890123', role: 'Marketing Manager', department: 'Marketing', status: 'active', lastLogin: '3 hr ago', loginCount: 624, createdAt: '2023-06-08', twoFA: false, ipLock: false },
  { id: 'ADM-007', name: 'Krit Thongchai', email: 'krit@ibb.co.th', phone: '+66878901234', role: 'Driver Coordinator', department: 'Operations', status: 'active', lastLogin: '45 min ago', loginCount: 1580, createdAt: '2023-07-22', twoFA: true, ipLock: false },
  { id: 'ADM-008', name: 'Malee Petcharat', email: 'malee@ibb.co.th', phone: '+66889012345', role: 'Booking Agent', department: 'Operations', status: 'active', lastLogin: '10 min ago', loginCount: 3240, createdAt: '2023-08-14', twoFA: false, ipLock: false },
  { id: 'ADM-009', name: 'Arthit Suwannarat', email: 'arthit@ibb.co.th', phone: '+66890123456', role: 'IT Administrator', department: 'IT', status: 'active', lastLogin: '5 hr ago', loginCount: 428, createdAt: '2023-09-01', twoFA: true, ipLock: true },
  { id: 'ADM-010', name: 'Pornpan Limcharoen', email: 'pornpan@ibb.co.th', phone: '+66801234567', role: 'Booking Agent', department: 'Operations', status: 'inactive', lastLogin: '15 days ago', loginCount: 842, createdAt: '2023-10-18', twoFA: false, ipLock: false },
]

const roles = ['Super Admin', 'Operations Manager', 'Finance Manager', 'Customer Support Lead', 'Fleet Manager', 'Marketing Manager', 'Driver Coordinator', 'Booking Agent', 'IT Administrator']
const departments = ['Management', 'Operations', 'Finance', 'Support', 'Fleet', 'Marketing', 'IT']

export default function AdminUsers() {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [filterDept, setFilterDept] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: '', department: '', status: 'active', twoFA: false })
  const { toast } = useToast()

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
    const matchDept = filterDept === 'all' || u.department === filterDept
    const matchStatus = filterStatus === 'all' || u.status === filterStatus
    return matchSearch && matchDept && matchStatus
  })

  const stats = [
    { title: 'Total Admins', value: users.length, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { title: 'Active Admins', value: users.filter(u => u.status === 'active').length, icon: UserCheck, color: 'text-green-600', bgColor: 'bg-green-100' },
    { title: '2FA Enabled', value: users.filter(u => u.twoFA).length, icon: Shield, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { title: 'Inactive', value: users.filter(u => u.status === 'inactive').length, icon: UserX, color: 'text-red-600', bgColor: 'bg-red-100' },
  ]

  const handleAdd = () => {
    const newUser = {
      ...formData,
      id: `ADM-${String(users.length + 1).padStart(3, '0')}`,
      lastLogin: 'Never',
      loginCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      ipLock: false,
    }
    setUsers([...users, newUser])
    setIsAddOpen(false)
    toast({ title: 'Admin Added', description: `${formData.name} has been added successfully.` })
  }

  const handleEdit = () => {
    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...formData } : u))
    setIsEditOpen(false)
    toast({ title: 'Admin Updated', description: `${formData.name} has been updated.` })
  }

  const handleDelete = () => {
    setUsers(users.filter(u => u.id !== selectedUser.id))
    setIsDeleteOpen(false)
    toast({ title: 'Admin Removed', description: `${selectedUser.name} has been removed.`, variant: 'destructive' })
  }

  const toggleStatus = (userId) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u))
  }

  const openEdit = (user) => {
    setSelectedUser(user)
    setFormData({ name: user.name, email: user.email, phone: user.phone, role: user.role, department: user.department, status: user.status, twoFA: user.twoFA })
    setIsEditOpen(true)
  }

  const openDelete = (user) => {
    setSelectedUser(user)
    setIsDeleteOpen(true)
  }

  const openAdd = () => {
    setFormData({ name: '', email: '', phone: '', role: '', department: '', status: 'active', twoFA: false })
    setIsAddOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Users</h1>
        <p className="text-muted-foreground">Manage IBB Shuttle Admins — Permissions, Departments & Security</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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

      {/* Main Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Admins</CardTitle>
              <CardDescription>All Admin records in IBB Shuttle system</CardDescription>
            </div>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={openAdd}>
              <Plus className="mr-2 h-4 w-4" />Invite Admin
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search admins..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={filterDept} onValueChange={setFilterDept}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Login Count</TableHead>
                  <TableHead>2FA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No admins found</TableCell>
                  </TableRow>
                ) : filtered.map((user, idx) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className={`${avatarColors[idx % avatarColors.length]} text-white text-xs font-bold`}>
                            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${roleColors[user.role] || 'bg-gray-100 text-gray-800'}`}>{user.role}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.department}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />{user.lastLogin}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{user.loginCount.toLocaleString()}</TableCell>
                    <TableCell>
                      {user.twoFA
                        ? <Shield className="h-4 w-4 text-green-500" />
                        : <Shield className="h-4 w-4 text-gray-300" />
                      }
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>{user.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => toggleStatus(user.id)} title={user.status === 'active' ? 'Deactivate' : 'Activate'}>
                          {user.status === 'active'
                            ? <UserX className="h-4 w-4 text-orange-500" />
                            : <UserCheck className="h-4 w-4 text-green-500" />
                          }
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(user)}>
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDelete(user)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-sm text-muted-foreground mt-3">Showing {filtered.length} of {users.length} admins</p>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite New Admin</DialogTitle>
            <DialogDescription>Add New Admin to IBB Admin Panel</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Somchai Rattanakul" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="admin@ibb.co.th" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+66812345678" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={formData.role} onValueChange={v => setFormData({ ...formData, role: v })}>
                  <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>{roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={formData.department} onValueChange={v => setFormData({ ...formData, department: v })}>
                  <SelectTrigger><SelectValue placeholder="Select dept" /></SelectTrigger>
                  <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleAdd} disabled={!formData.name || !formData.email || !formData.role}>Invite Admin</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
            <DialogDescription>Edit Information {selectedUser?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={formData.role} onValueChange={v => setFormData({ ...formData, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={formData.department} onValueChange={v => setFormData({ ...formData, department: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Admin?</AlertDialogTitle>
            <AlertDialogDescription>
              Deletion <strong>{selectedUser?.name}</strong> Will revoke All system access immediately, cannot cancel
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Remove Admin</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
