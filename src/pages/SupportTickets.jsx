import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Search, Plus, Edit, Trash2, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle, Paperclip, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

export default function SupportTickets() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [formData, setFormData] = useState({
    subject: '',
    customer: '',
    priority: 'medium',
    status: 'open',
    description: ''
  })

  const [tickets, setTickets] = useState([
    {
      id: 'TKT-001',
      subject: 'Order not received',
      customer: { name: 'Alice Johnson', email: 'alice@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
      priority: 'high',
      status: 'open',
      assignedTo: 'John Doe',
      createdAt: '2024-10-05 09:30 AM',
      updatedAt: '2024-10-05 09:30 AM',
      description: 'I placed an order 2 weeks ago (Order #12345) but haven\'t received it yet. Can you help?',
      replies: [
        { id: 1, user: 'John Doe', message: 'We\'re looking into this. Can you provide your shipping address?', timestamp: '2024-10-05 10:00 AM', isStaff: true }
      ]
    },
    {
      id: 'TKT-002',
      subject: 'Refund request for damaged item',
      customer: { name: 'Bob Smith', email: 'bob@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
      priority: 'urgent',
      status: 'in_progress',
      assignedTo: 'Sarah Smith',
      createdAt: '2024-10-05 08:15 AM',
      updatedAt: '2024-10-05 09:45 AM',
      description: 'Received a damaged laptop. Need immediate refund.',
      replies: [
        { id: 1, user: 'Sarah Smith', message: 'Sorry about that! Please send photos of the damage.', timestamp: '2024-10-05 08:30 AM', isStaff: true },
        { id: 2, user: 'Bob Smith', message: '[Photos attached]', timestamp: '2024-10-05 09:00 AM', isStaff: false },
        { id: 3, user: 'Sarah Smith', message: 'Refund has been initiated. You\'ll receive it in 3-5 business days.', timestamp: '2024-10-05 09:45 AM', isStaff: true }
      ]
    },
    {
      id: 'TKT-003',
      subject: 'How to track my order?',
      customer: { name: 'Carol White', email: 'carol@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol' },
      priority: 'low',
      status: 'resolved',
      assignedTo: 'Mike Johnson',
      createdAt: '2024-10-04 02:20 PM',
      updatedAt: '2024-10-04 03:15 PM',
      description: 'Can\'t find tracking information for my order.',
      replies: [
        { id: 1, user: 'Mike Johnson', message: 'You can track your order at: https://tracking.example.com/12346', timestamp: '2024-10-04 02:30 PM', isStaff: true },
        { id: 2, user: 'Carol White', message: 'Thank you!', timestamp: '2024-10-04 03:15 PM', isStaff: false }
      ]
    },
    {
      id: 'TKT-004',
      subject: 'Product inquiry',
      customer: { name: 'David Brown', email: 'david@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
      priority: 'medium',
      status: 'open',
      assignedTo: 'Emily Brown',
      createdAt: '2024-10-05 07:00 AM',
      updatedAt: '2024-10-05 07:00 AM',
      description: 'Is the Wireless Headphones compatible with iPhone 15?',
      replies: []
    },
    {
      id: 'TKT-005',
      subject: 'Account access issue',
      customer: { name: 'Eve Davis', email: 'eve@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eve' },
      priority: 'high',
      status: 'closed',
      assignedTo: 'John Doe',
      createdAt: '2024-10-03 11:30 AM',
      updatedAt: '2024-10-03 02:45 PM',
      description: 'Can\'t log in to my account. Password reset not working.',
      replies: [
        { id: 1, user: 'John Doe', message: 'I\'ve reset your password manually. Check your email.', timestamp: '2024-10-03 12:00 PM', isStaff: true },
        { id: 2, user: 'Eve Davis', message: 'Working now! Thanks!', timestamp: '2024-10-03 02:45 PM', isStaff: false }
      ]
    }
  ])

  const stats = [
    {
      title: 'Total Tickets',
      value: tickets.length,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Open Tickets',
      value: tickets.filter(t => t.status === 'open').length,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'In Progress',
      value: tickets.filter(t => t.status === 'in_progress').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Resolved Today',
      value: tickets.filter(t => t.status === 'resolved' && t.updatedAt.startsWith('2024-10-05')).length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ]

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleAddClick = () => {
    setFormData({ subject: '', customer: '', priority: 'medium', status: 'open', description: '' })
    setIsAddDialogOpen(true)
  }

  const handleViewClick = (ticket) => {
    setSelectedTicket(ticket)
    setReplyMessage('')
    setIsViewDialogOpen(true)
  }

  const handleDeleteClick = (ticket) => {
    setSelectedTicket(ticket)
    setIsDeleteDialogOpen(true)
  }

  const handleAdd = () => {
    const newTicket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      ...formData,
      customer: { 
        name: formData.customer, 
        email: `${formData.customer.toLowerCase().replace(' ', '.')}@example.com`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.customer}`
      },
      assignedTo: 'Unassigned',
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      replies: []
    }
    setTickets([...tickets, newTicket])
    setIsAddDialogOpen(false)
  }

  const handleDelete = () => {
    setTickets(tickets.filter(ticket => ticket.id !== selectedTicket.id))
    setIsDeleteDialogOpen(false)
  }

  const handleStatusChange = (ticketId, newStatus) => {
    setTickets(tickets.map(ticket =>
      ticket.id === ticketId 
        ? { ...ticket, status: newStatus, updatedAt: new Date().toLocaleString() }
        : ticket
    ))
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: newStatus })
    }
  }

  const handleSendReply = () => {
    if (!replyMessage.trim()) return
    
    const newReply = {
      id: selectedTicket.replies.length + 1,
      user: 'John Doe',
      message: replyMessage,
      timestamp: new Date().toLocaleString(),
      isStaff: true
    }

    setTickets(tickets.map(ticket =>
      ticket.id === selectedTicket.id
        ? { ...ticket, replies: [...ticket.replies, newReply], updatedAt: new Date().toLocaleString() }
        : ticket
    ))
    
    setSelectedTicket({
      ...selectedTicket,
      replies: [...selectedTicket.replies, newReply]
    })
    
    setReplyMessage('')
  }

  const getStatusBadge = (status) => {
    const badges = {
      'open': { label: 'Open', className: 'bg-orange-100 text-orange-800' },
      'in_progress': { label: 'In Progress', className: 'bg-yellow-100 text-yellow-800' },
      'resolved': { label: 'Resolved', className: 'bg-green-100 text-green-800' },
      'closed': { label: 'Closed', className: 'bg-gray-100 text-gray-800' }
    }
    return badges[status] || badges['open']
  }

  const getPriorityBadge = (priority) => {
    const badges = {
      'low': { label: 'Low', className: 'bg-blue-100 text-blue-800' },
      'medium': { label: 'Medium', className: 'bg-yellow-100 text-yellow-800' },
      'high': { label: 'High', className: 'bg-orange-100 text-orange-800' },
      'urgent': { label: 'Urgent', className: 'bg-red-100 text-red-800' }
    }
    return badges[priority] || badges['medium']
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Support Tickets</h1>
        <p className="text-muted-foreground">Manage customer support requests</p>
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
              <CardTitle>All Tickets</CardTitle>
              <CardDescription>View and manage support tickets</CardDescription>
            </div>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleAddClick}>
              <Plus className="mr-2 h-4 w-4" />
              New Ticket
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No tickets found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTickets.map((ticket) => {
                    const statusBadge = getStatusBadge(ticket.status)
                    const priorityBadge = getPriorityBadge(ticket.priority)
                    return (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.id}</TableCell>
                        <TableCell className="max-w-xs truncate">{ticket.subject}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={ticket.customer.avatar} alt={ticket.customer.name} />
                              <AvatarFallback>{ticket.customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{ticket.customer.name}</div>
                              <div className="text-xs text-muted-foreground">{ticket.customer.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={priorityBadge.className}>
                            {priorityBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={ticket.status} 
                            onValueChange={(value) => handleStatusChange(ticket.id, value)}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">Open</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{ticket.assignedTo}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{ticket.createdAt}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewClick(ticket)}
                            >
                              <MessageSquare className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(ticket)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
            <DialogDescription>Create a support ticket on behalf of a customer</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief description of the issue"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer">Customer Name</Label>
              <Input
                id="customer"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the issue..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleAdd}>Create Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View/Reply Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>{selectedTicket?.id} - {selectedTicket?.subject}</DialogTitle>
                <DialogDescription>
                  Created by {selectedTicket?.customer.name} on {selectedTicket?.createdAt}
                </DialogDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className={getPriorityBadge(selectedTicket?.priority).className}>
                  {getPriorityBadge(selectedTicket?.priority).label}
                </Badge>
                <Badge variant="outline" className={getStatusBadge(selectedTicket?.status).className}>
                  {getStatusBadge(selectedTicket?.status).label}
                </Badge>
              </div>
            </div>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-4">
              {/* Original Message */}
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={selectedTicket.customer.avatar} alt={selectedTicket.customer.name} />
                    <AvatarFallback>{selectedTicket.customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{selectedTicket.customer.name}</div>
                      <div className="text-xs text-muted-foreground">{selectedTicket.createdAt}</div>
                    </div>
                    <p className="text-sm">{selectedTicket.description}</p>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {selectedTicket.replies.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    {selectedTicket.replies.map((reply) => (
                      <div key={reply.id} className={`flex items-start gap-3 ${reply.isStaff ? 'flex-row-reverse' : ''}`}>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.user}`} alt={reply.user} />
                          <AvatarFallback>{reply.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className={`flex-1 ${reply.isStaff ? 'text-right' : ''}`}>
                          <div className="flex items-center gap-2 mb-1" style={{ justifyContent: reply.isStaff ? 'flex-end' : 'flex-start' }}>
                            <div className="font-medium text-sm">{reply.user}</div>
                            {reply.isStaff && <Badge variant="secondary" className="text-xs">Staff</Badge>}
                            <div className="text-xs text-muted-foreground">{reply.timestamp}</div>
                          </div>
                          <div className={`inline-block p-3 rounded-lg text-sm ${reply.isStaff ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            {reply.message}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Reply Form */}
              <Separator />
              <div className="space-y-2">
                <Label>Reply to ticket</Label>
                <Textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your response..."
                  rows={3}
                />
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm" onClick={() => toast({ title: 'Sent', description: 'Data sent successfully' })}>
                    <Paperclip className="h-4 w-4 mr-2" />
                    Attach File
                  </Button>
                  <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSendReply} disabled={!replyMessage.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete ticket
              <strong> {selectedTicket?.id}</strong> and all its replies.
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
