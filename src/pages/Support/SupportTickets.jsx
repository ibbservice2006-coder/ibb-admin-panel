import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessageSquare, Plus, Eye, Reply, Trash2, Search, AlertTriangle, CheckCircle, Clock, Download } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const ticketsData = [
  { id: 'TKT-2026-0142', subject: 'Driver did not arrive at pickup location', category: 'Operations', priority: 'critical', status: 'open', customer: 'Wang Wei', email: 'wangwei@email.com', phone: '+86-138-0013-8000', bookingRef: 'IBB-2026-4518', created: '2026-03-25 09:15', updated: '2026-03-25 09:15', messages: 1, assignedTo: 'Unassigned', description: 'I booked a shuttle from Don Mueang to Hua Hin at 08:00 but the driver never showed up. I have been waiting for 45 minutes. Please help urgently.' },
  { id: 'TKT-2026-0141', subject: 'Refund not received after cancellation', category: 'Billing', priority: 'high', status: 'in_progress', customer: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1-310-555-0192', bookingRef: 'IBB-2026-4480', created: '2026-03-24 14:30', updated: '2026-03-25 08:00', messages: 4, assignedTo: 'Finance Team', description: "I cancelled booking IBB-2026-4480 on March 20; refund expected in 3-5 business days. It's been 5 days and I haven't received my ฿2,800 refund." },
  { id: 'TKT-2026-0140', subject: 'App not showing booking confirmation', category: 'Technical', priority: 'medium', status: 'in_progress', customer: 'Tanaka Hiroshi', email: 'tanaka.h@email.com', phone: '+81-90-1234-5678', bookingRef: 'IBB-2026-4520', created: '2026-03-24 11:00', updated: '2026-03-24 16:45', messages: 3, assignedTo: 'Tech Support', description: 'After completing payment for booking IBB-2026-4520, the app shows a blank screen instead of booking confirmation. I received email confirmation but the app does not update.' },
  { id: 'TKT-2026-0139', subject: 'Request for corporate invoice', category: 'Billing', priority: 'low', status: 'resolved', customer: 'Li Mingzhu', email: 'li.mz@company.com', phone: '+86-139-0013-9000', bookingRef: 'IBB-2026-4510', created: '2026-03-23 09:00', updated: '2026-03-23 14:30', messages: 2, assignedTo: 'Finance Team', description: 'Please provide a formal VAT invoice for booking IBB-2026-4510 for our company expense report.' },
  { id: 'TKT-2026-0138', subject: 'Driver was rude and drove unsafely', category: 'Complaint', priority: 'high', status: 'in_progress', customer: 'Michael Brown', email: 'michael.b@email.com', phone: '+44-7700-900123', bookingRef: 'IBB-2026-4505', created: '2026-03-22 20:00', updated: '2026-03-23 10:00', messages: 5, assignedTo: 'Operations', description: 'The driver (Vehicle IBB-VAN-007) was speeding, using his phone while driving, and was rude when I asked him to slow down. This is a serious safety issue.' },
  { id: 'TKT-2026-0137', subject: 'Cannot apply voucher code SONGKRAN26', category: 'Technical', priority: 'medium', status: 'resolved', customer: 'Park Jiyeon', email: 'park.jy@email.com', phone: '+82-10-1234-5678', bookingRef: 'N/A', created: '2026-03-22 15:00', updated: '2026-03-22 17:00', messages: 3, assignedTo: 'Tech Support', description: 'I am trying to apply voucher code SONGKRAN26 but the system says "Invalid voucher code".' },
  { id: 'TKT-2026-0136', subject: 'Request to change pickup time', category: 'Booking', priority: 'low', status: 'resolved', customer: 'Nattaya Wongprasert', email: 'nattaya.w@email.com', phone: '+66-89-876-5432', bookingRef: 'IBB-2026-4512', created: '2026-03-22 10:00', updated: '2026-03-22 11:30', messages: 2, assignedTo: 'Booking Team', description: 'I need to change my pickup time for booking IBB-2026-4512 from 22:00 to 23:30 as my flight has been delayed.' },
  { id: 'TKT-2026-0135', subject: 'Wallet top-up not reflecting in balance', category: 'Technical', priority: 'high', status: 'closed', customer: 'Chen Xiaoming', email: 'chen.xm@email.com', phone: '+86-137-0013-7000', bookingRef: 'N/A', created: '2026-03-21 14:00', updated: '2026-03-21 18:00', messages: 6, assignedTo: 'Finance Team', description: 'I topped up my IBB Wallet with ฿5,000 via bank transfer 3 hrs ago but balance still shows ฿0.' },
]

const priorityColors = { critical: 'bg-red-100 text-red-800', high: 'bg-orange-100 text-orange-800', medium: 'bg-yellow-100 text-yellow-800', low: 'bg-gray-100 text-gray-800' }
const statusColors = { open: 'bg-blue-100 text-blue-800', in_progress: 'bg-yellow-100 text-yellow-800', resolved: 'bg-green-100 text-green-800', closed: 'bg-gray-100 text-gray-800' }
const avatarColors = ['bg-blue-500','bg-green-500','bg-purple-500','bg-orange-500','bg-pink-500','bg-cyan-500','bg-red-500','bg-teal-500']

export default function SupportTickets() {
  const [tickets, setTickets] = useState(ticketsData)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isReplyOpen, setIsReplyOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replyStatus, setReplyStatus] = useState('in_progress')
  const [isNewOpen, setIsNewOpen] = useState(false)
  const [newForm, setNewForm] = useState({ subject: '', customer: '', email: '', phone: '', bookingRef: '', category: 'Booking', priority: 'medium', description: '' })
  const { toast } = useToast()

  const filtered = tickets.filter(t => {
    const matchSearch = t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.customer.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter
    const matchCat = categoryFilter === 'all' || t.category === categoryFilter
    return matchSearch && matchStatus && matchPriority && matchCat
  })

  const stats = [
    { title: 'Open Tickets', value: tickets.filter(t => t.status === 'open').length, icon: MessageSquare, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    { title: 'Critical', value: tickets.filter(t => t.priority === 'critical').length, icon: AlertTriangle, bgColor: 'bg-red-100', iconColor: 'text-red-600' },
    { title: 'In Progress', value: tickets.filter(t => t.status === 'in_progress').length, icon: Clock, bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { title: 'Resolved Today', value: 1, icon: CheckCircle, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
  ]

  const handleReply = () => {
    if (!replyText.trim()) return
    setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, messages: t.messages + 1, status: replyStatus, updated: '2026-03-25 ' + new Date().toTimeString().slice(0,5) } : t))
    setIsReplyOpen(false)
    setReplyText('')
    toast({ title: 'Reply Sent', description: `Reply sent to ${selectedTicket.customer}` })
  }

  const handleDelete = () => {
    setTickets(tickets.filter(t => t.id !== selectedTicket.id))
    setIsDeleteOpen(false)
    toast({ title: 'Ticket Deleted', description: `Ticket ${selectedTicket.id} has been deleted.`, variant: 'destructive' })
  }

  const handleExport = () => {
    const csv = [
      ['ID','Subject','Customer','Category','Priority','Status','Created','Assigned To'],
      ...filtered.map(t => [t.id, t.subject, t.customer, t.category, t.priority, t.status, t.created, t.assignedTo])
    ].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'support_tickets.csv'; a.click()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground">Manage Customer Tickets — Reply & Track Status</p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setIsNewOpen(true)}><Plus className="mr-2 h-4 w-4" />New Ticket</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}><stat.icon className={`h-4 w-4 ${stat.iconColor}`} /></div>
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{stat.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Ticket List</CardTitle>
              <CardDescription>Click View for details — Click Reply to respond</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Export CSV</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tickets..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[130px]"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Booking">Booking</SelectItem>
                <SelectItem value="Billing">Billing</SelectItem>
                <SelectItem value="Technical">Technical</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Complaint">Complaint</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Msgs</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={10} className="text-center py-8 text-muted-foreground">No tickets found</TableCell></TableRow>
                ) : filtered.map((ticket, idx) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium text-sm">{ticket.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className={`${avatarColors[idx % avatarColors.length]} text-white text-xs font-bold`}>
                            {ticket.customer.split(' ').map(n => n[0]).join('').slice(0,2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{ticket.customer}</div>
                          <div className="text-xs text-muted-foreground">{ticket.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm max-w-[180px] truncate">{ticket.subject}</p>
                      {ticket.bookingRef !== 'N/A' && <p className="text-xs text-muted-foreground">{ticket.bookingRef}</p>}
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{ticket.category}</Badge></TableCell>
                    <TableCell><Badge className={`text-xs ${priorityColors[ticket.priority]}`} variant="outline">{ticket.priority}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{ticket.assignedTo}</TableCell>
                    <TableCell className="text-sm text-center">{ticket.messages}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{ticket.updated}</TableCell>
                    <TableCell><Badge className={`text-xs ${statusColors[ticket.status]}`} variant="outline">{ticket.status.replace('_',' ')}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedTicket(ticket); setIsViewOpen(true) }}>
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedTicket(ticket); setReplyStatus(ticket.status); setIsReplyOpen(true) }} disabled={ticket.status === 'closed'}>
                          <Reply className={`h-4 w-4 ${ticket.status === 'closed' ? 'text-gray-300' : 'text-green-600'}`} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedTicket(ticket); setIsDeleteOpen(true) }}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-sm text-muted-foreground mt-3">Showing {filtered.length} of {tickets.length} tickets</p>
        </CardContent>
      </Card>

      {/* New Ticket Dialog */}
      <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Support Ticket</DialogTitle>
            <DialogDescription>Create new Support Ticket from Admin side</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Subject *</Label>
              <Input placeholder="e.g. Driver did not arrive at pickup" value={newForm.subject} onChange={e => setNewForm({...newForm, subject: e.target.value})} className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Customer Name *</Label>
                <Input placeholder="Full name" value={newForm.customer} onChange={e => setNewForm({...newForm, customer: e.target.value})} className="mt-1" /></div>
              <div><Label>Email</Label>
                <Input placeholder="customer@email.com" value={newForm.email} onChange={e => setNewForm({...newForm, email: e.target.value})} className="mt-1" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Phone</Label>
                <Input placeholder="+66-8x-xxx-xxxx" value={newForm.phone} onChange={e => setNewForm({...newForm, phone: e.target.value})} className="mt-1" /></div>
              <div><Label>Booking Ref</Label>
                <Input placeholder="IBB-2026-XXXX" value={newForm.bookingRef} onChange={e => setNewForm({...newForm, bookingRef: e.target.value})} className="mt-1" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Category</Label>
                <Select value={newForm.category} onValueChange={v => setNewForm({...newForm, category: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Booking">Booking</SelectItem>
                    <SelectItem value="Billing">Billing</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Complaint">Complaint</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Priority</Label>
                <Select value={newForm.priority} onValueChange={v => setNewForm({...newForm, priority: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Description *</Label>
              <Textarea placeholder="Describe the issue in detail..." value={newForm.description} onChange={e => setNewForm({...newForm, description: e.target.value})} className="mt-1" rows={4} /></div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsNewOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
              if (!newForm.subject || !newForm.customer || !newForm.description) {
                toast({ title: 'Error', description: 'Subject, Customer, and Description are required', variant: 'destructive' }); return
              }
              const newTicket = {
                id: `TKT-2026-${String(tickets.length + 143).padStart(4,'0')}`,
                subject: newForm.subject, customer: newForm.customer, email: newForm.email || 'N/A',
                phone: newForm.phone || 'N/A', bookingRef: newForm.bookingRef || 'N/A',
                category: newForm.category, priority: newForm.priority, status: 'open',
                created: new Date().toISOString().slice(0,16).replace('T',' '),
                updated: new Date().toISOString().slice(0,16).replace('T',' '),
                messages: 0, assignedTo: 'Unassigned', description: newForm.description
              }
              setTickets(prev => [newTicket, ...prev])
              setIsNewOpen(false)
              setNewForm({ subject: '', customer: '', email: '', phone: '', bookingRef: '', category: 'Booking', priority: 'medium', description: '' })
              toast({ title: 'Ticket Created', description: `${newTicket.id} created successfully` })
            }}>Create Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedTicket?.id}</DialogTitle>
            <DialogDescription>
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge className={`text-xs ${priorityColors[selectedTicket?.priority]}`} variant="outline">{selectedTicket?.priority}</Badge>
                <Badge className={`text-xs ${statusColors[selectedTicket?.status]}`} variant="outline">{selectedTicket?.status?.replace('_',' ')}</Badge>
                <Badge variant="outline" className="text-xs">{selectedTicket?.category}</Badge>
              </div>
            </DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div><Label className="text-muted-foreground text-xs">Subject</Label><p className="font-medium mt-1">{selectedTicket.subject}</p></div>
              <div><Label className="text-muted-foreground text-xs">Description</Label><p className="text-sm mt-1 leading-relaxed bg-muted p-3 rounded-md">{selectedTicket.description}</p></div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><Label className="text-muted-foreground text-xs">Customer</Label><p className="font-medium">{selectedTicket.customer}</p></div>
                <div><Label className="text-muted-foreground text-xs">Email</Label><p className="font-medium">{selectedTicket.email}</p></div>
                <div><Label className="text-muted-foreground text-xs">Phone</Label><p className="font-medium">{selectedTicket.phone}</p></div>
                <div><Label className="text-muted-foreground text-xs">Booking Ref</Label><p className="font-medium">{selectedTicket.bookingRef}</p></div>
                <div><Label className="text-muted-foreground text-xs">Assigned To</Label><p className="font-medium">{selectedTicket.assignedTo}</p></div>
                <div><Label className="text-muted-foreground text-xs">Messages</Label><p className="font-medium">{selectedTicket.messages}</p></div>
                <div><Label className="text-muted-foreground text-xs">Created</Label><p className="font-medium">{selectedTicket.created}</p></div>
                <div><Label className="text-muted-foreground text-xs">Last Updated</Label><p className="font-medium">{selectedTicket.updated}</p></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
            {selectedTicket?.status !== 'closed' && (
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setIsViewOpen(false); setReplyStatus(selectedTicket.status); setIsReplyOpen(true) }}>Reply</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Reply to Ticket</DialogTitle>
            <DialogDescription>{selectedTicket?.id} — {selectedTicket?.subject}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-md text-sm">
              <p className="text-muted-foreground text-xs mb-1">Customer message:</p>
              <p>{selectedTicket?.description}</p>
            </div>
            <div className="space-y-2">
              <Label>Your Reply</Label>
              <Textarea placeholder="Type your reply..." value={replyText} onChange={e => setReplyText(e.target.value)} rows={4} />
            </div>
            <div className="space-y-2">
              <Label>Update Status</Label>
              <Select value={replyStatus} onValueChange={setReplyStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsReplyOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleReply} disabled={!replyText.trim()}>Send Reply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Ticket?</AlertDialogTitle>
            <AlertDialogDescription>Delete Ticket {selectedTicket?.id} Log out? This action is irreversible</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
