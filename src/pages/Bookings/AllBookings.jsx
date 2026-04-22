import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Search, Download, Eye, Edit, Trash2, Plus, Calendar,
  MapPin, Users, DollarSign, Clock, TrendingUp, TrendingDown, RefreshCw, Phone
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const bookingsData = [
  { id: 'IBB-2026-4521', customer: 'Wang Wei', phone: '+86-138-0013-8000', pickup: 'BKK Suvarnabhumi Airport', dropoff: 'Pattaya Beach Hotel', status: 'confirmed', date: '2026-03-25', time: '10:00', driver: 'Somchai P.', vehicle: 'IBB-VAN-012', passengers: 3, fare: 2400, currency: 'THB', duration: '90 min', rating: null, source: 'Direct' },
  { id: 'IBB-2026-4520', customer: 'Tanaka Hiroshi', phone: '+81-90-1234-5678', pickup: 'Hua Hin Town', dropoff: 'BKK Suvarnabhumi Airport', status: 'in_progress', date: '2026-03-25', time: '09:30', driver: 'Preecha W.', vehicle: 'IBB-VAN-008', passengers: 2, fare: 3200, currency: 'THB', duration: '180 min', rating: null, source: 'Agoda' },
  { id: 'IBB-2026-4519', customer: 'Sarah Johnson', phone: '+1-310-555-0192', pickup: 'Pattaya Hilton', dropoff: 'BKK Suvarnabhumi Airport', status: 'completed', date: '2026-03-25', time: '08:15', driver: 'Krit T.', vehicle: 'IBB-VAN-005', passengers: 1, fare: 2800, currency: 'THB', duration: '90 min', rating: 5.0, source: 'Klook' },
  { id: 'IBB-2026-4518', customer: 'Li Mingzhu', phone: '+86-139-0013-9000', pickup: 'BKK Don Mueang Airport', dropoff: 'Hua Hin Marriott', status: 'confirmed', date: '2026-03-25', time: '08:00', driver: 'Arthit S.', vehicle: 'IBB-VAN-015', passengers: 4, fare: 4500, currency: 'THB', duration: '180 min', rating: null, source: 'WeChat' },
  { id: 'IBB-2026-4517', customer: 'Somchai Rattana', phone: '+66-81-234-5678', pickup: 'Phuket Airport', dropoff: 'Krabi Ao Nang', status: 'pending', date: '2026-03-25', time: '07:45', driver: 'Unassigned', vehicle: 'TBD', passengers: 2, fare: 1800, currency: 'THB', duration: '120 min', rating: null, source: 'Direct' },
  { id: 'IBB-2026-4516', customer: 'Park Jiyeon', phone: '+82-10-1234-5678', pickup: 'BKK Suvarnabhumi Airport', dropoff: 'Pattaya Dusit Thani', status: 'completed', date: '2026-03-24', time: '20:30', driver: 'Nattapong K.', vehicle: 'IBB-VAN-003', passengers: 2, fare: 2400, currency: 'THB', duration: '90 min', rating: 4.8, source: 'Booking.com' },
  { id: 'IBB-2026-4515', customer: 'Michael Brown', phone: '+44-7700-900123', pickup: 'Hua Hin Sheraton', dropoff: 'BKK Suvarnabhumi Airport', status: 'cancelled', date: '2026-03-24', time: '15:00', driver: 'N/A', vehicle: 'N/A', passengers: 3, fare: 3200, currency: 'THB', duration: '180 min', rating: null, source: 'Direct' },
  { id: 'IBB-2026-4514', customer: 'Chen Xiaoming', phone: '+86-137-0013-7000', pickup: 'BKK Suvarnabhumi Airport', dropoff: 'Pattaya Grand Hotel', status: 'completed', date: '2026-03-24', time: '14:00', driver: 'Somchai P.', vehicle: 'IBB-VAN-012', passengers: 6, fare: 4800, currency: 'THB', duration: '90 min', rating: 4.9, source: 'Ctrip' },
  { id: 'IBB-2026-4513', customer: 'Yuki Tanaka', phone: '+81-80-9876-5432', pickup: 'Pattaya Centara', dropoff: 'BKK Don Mueang Airport', status: 'completed', date: '2026-03-24', time: '06:00', driver: 'Preecha W.', vehicle: 'IBB-VAN-008', passengers: 2, fare: 2600, currency: 'THB', duration: '90 min', rating: 5.0, source: 'Klook' },
  { id: 'IBB-2026-4512', customer: 'Nattaya Wongprasert', phone: '+66-89-876-5432', pickup: 'BKK Suvarnabhumi Airport', dropoff: 'Hua Hin Anantara', status: 'completed', date: '2026-03-23', time: '22:00', driver: 'Arthit S.', vehicle: 'IBB-VAN-015', passengers: 4, fare: 4500, currency: 'THB', duration: '180 min', rating: 4.7, source: 'Direct' },
]

const statusColors = {
  confirmed: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  pending: 'bg-gray-100 text-gray-800',
}

const avatarColors = ['bg-blue-500','bg-green-500','bg-purple-500','bg-orange-500','bg-pink-500','bg-cyan-500','bg-red-500','bg-teal-500','bg-indigo-500','bg-yellow-500']

const emptyNewBooking = {
  customer: '', phone: '', email: '',
  pickup: '', dropoff: '',
  date: '', time: '',
  passengers: '1', vehicleType: 'van',
  source: 'Direct', notes: '', fare: ''
}

export default function AllBookings() {
  const [bookings, setBookings] = useState(bookingsData)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isNewOpen, setIsNewOpen] = useState(false)
  const [newBooking, setNewBooking] = useState(emptyNewBooking)
  const { toast } = useToast()

  const filtered = bookings.filter(b => {
    const matchSearch = b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.customer.toLowerCase().includes(search.toLowerCase()) ||
      b.pickup.toLowerCase().includes(search.toLowerCase()) ||
      b.dropoff.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || b.status === statusFilter
    const matchSource = sourceFilter === 'all' || b.source === sourceFilter
    return matchSearch && matchStatus && matchSource
  })

  const stats = [
    { title: 'Total Bookings', value: bookings.length, icon: Calendar, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    { title: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, icon: TrendingUp, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
    { title: 'In Progress', value: bookings.filter(b => b.status === 'in_progress').length, icon: Clock, bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { title: 'Revenue Today', value: '฿' + bookings.filter(b => b.date === '2026-03-25').reduce((sum, b) => sum + b.fare, 0).toLocaleString(), icon: DollarSign, bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
  ]

  const handleDelete = () => {
    setBookings(bookings.filter(b => b.id !== selectedBooking.id))
    setIsDeleteOpen(false)
    toast({ title: 'Booking Cancelled', description: `Booking ${selectedBooking.id} has been cancelled.`, variant: 'destructive' })
  }

  const handleExport = () => {
    const csv = [
      ['ID', 'Customer', 'Pickup', 'Dropoff', 'Status', 'Date', 'Time', 'Driver', 'Fare', 'Source'],
      ...filtered.map(b => [b.id, b.customer, b.pickup, b.dropoff, b.status, b.date, b.time, b.driver, b.fare, b.source])
    ].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'bookings.csv'; a.click()
  }

  const handleCreateBooking = () => {
    if (!newBooking.customer || !newBooking.pickup || !newBooking.dropoff || !newBooking.date) {
      toast({ title: 'Please Complete All Fields', description: 'Customer Name, Pickup, Drop-off, and Date Required', variant: 'destructive' })
      return
    }
    const newId = `IBB-2026-${4522 + bookings.length - 10}`
    const created = {
      id: newId,
      customer: newBooking.customer,
      phone: newBooking.phone || '-',
      pickup: newBooking.pickup,
      dropoff: newBooking.dropoff,
      status: 'pending',
      date: newBooking.date,
      time: newBooking.time || '00:00',
      driver: 'Unassigned',
      vehicle: 'TBD',
      passengers: parseInt(newBooking.passengers) || 1,
      fare: parseInt(newBooking.fare) || 0,
      currency: 'THB',
      duration: '-',
      rating: null,
      source: newBooking.source,
    }
    setBookings([created, ...bookings])
    setIsNewOpen(false)
    setNewBooking(emptyNewBooking)
    toast({ title: 'Booking Created!', description: `Booking ${newId} created successfully` })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Bookings</h1>
          <p className="text-muted-foreground">Manage all bookings of IBB Shuttle Service</p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setIsNewOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />New Booking
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{stat.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Booking List</CardTitle>
              <CardDescription>Bookings All — click View for details</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Export CSV</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search bookings..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Source" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Direct">Direct</SelectItem>
                <SelectItem value="Agoda">Agoda</SelectItem>
                <SelectItem value="Klook">Klook</SelectItem>
                <SelectItem value="Booking.com">Booking.com</SelectItem>
                <SelectItem value="Ctrip">Ctrip</SelectItem>
                <SelectItem value="WeChat">WeChat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Fare</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No bookings found</TableCell></TableRow>
                ) : filtered.map((b, idx) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium text-sm">{b.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className={`${avatarColors[idx % avatarColors.length]} text-white text-xs font-bold`}>
                            {b.customer.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{b.customer}</div>
                          <div className="text-xs text-muted-foreground">{b.passengers} pax</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <div className="flex items-center gap-1"><MapPin className="h-3 w-3 text-green-500" />{b.pickup.length > 20 ? b.pickup.slice(0,20)+'...' : b.pickup}</div>
                        <div className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3 text-red-500" />{b.dropoff.length > 20 ? b.dropoff.slice(0,20)+'...' : b.dropoff}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>{b.date}</div>
                      <div className="text-muted-foreground text-xs">{b.time} · {b.duration}</div>
                    </TableCell>
                    <TableCell className="text-sm">{b.driver}</TableCell>
                    <TableCell className="font-medium text-sm">฿{b.fare.toLocaleString()}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{b.source}</Badge></TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${statusColors[b.status]}`} variant="outline">
                        {b.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedBooking(b); setIsViewOpen(true) }}>
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedBooking(b); setIsEditOpen(true) }}>
                          <Edit className="h-4 w-4 text-yellow-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedBooking(b); setIsDeleteOpen(true) }} disabled={b.status === 'completed'}>
                          <Trash2 className={`h-4 w-4 ${b.status === 'completed' ? 'text-gray-300' : 'text-red-600'}`} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-sm text-muted-foreground mt-3">Showing {filtered.length} of {bookings.length} bookings</p>
        </CardContent>
      </Card>

      {/* ===== NEW BOOKING DIALOG ===== */}
      <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Create new booking
            </DialogTitle>
            <DialogDescription>Enter IBB Shuttle Service booking details</DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Customer Info */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wide">Customer Data</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Customer name <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="e.g. Wang Wei"
                    value={newBooking.customer}
                    onChange={e => setNewBooking({...newBooking, customer: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone Number</Label>
                  <Input
                    placeholder="+66-81-234-5678"
                    value={newBooking.phone}
                    onChange={e => setNewBooking({...newBooking, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <Label>Email</Label>
                  <Input
                    placeholder="customer@email.com"
                    type="email"
                    value={newBooking.email}
                    onChange={e => setNewBooking({...newBooking, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Route */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wide">Route</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-green-500" />Pickup Point <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="e.g. BKK Suvarnabhumi Airport"
                    value={newBooking.pickup}
                    onChange={e => setNewBooking({...newBooking, pickup: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-red-500" />Dropoff Point <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="e.g. Pattaya Beach Hotel"
                    value={newBooking.dropoff}
                    onChange={e => setNewBooking({...newBooking, dropoff: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wide">Date & Details</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Date <span className="text-red-500">*</span></Label>
                  <Input
                    type="date"
                    value={newBooking.date}
                    onChange={e => setNewBooking({...newBooking, date: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Pickup time</Label>
                  <Input
                    type="time"
                    value={newBooking.time}
                    onChange={e => setNewBooking({...newBooking, time: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Number of Passengers</Label>
                  <Select value={newBooking.passengers} onValueChange={v => setNewBooking({...newBooking, passengers: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <SelectItem key={n} value={String(n)}>{n} pax</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Vehicle type</Label>
                  <Select value={newBooking.vehicleType} onValueChange={v => setNewBooking({...newBooking, vehicleType: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car (Standard/Executive)</SelectItem>
                      <SelectItem value="van">Van (Standard/Executive)</SelectItem>
                      <SelectItem value="bus">Bus (Minibus/Group)</SelectItem>
                      <SelectItem value="limo">Limousine (Premium/Luxury)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Price (THB)</Label>
                  <Input
                    type="number"
                    placeholder="2400"
                    value={newBooking.fare}
                    onChange={e => setNewBooking({...newBooking, fare: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Source</Label>
                  <Select value={newBooking.source} onValueChange={v => setNewBooking({...newBooking, source: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Direct">Direct</SelectItem>
                      <SelectItem value="Agoda">Agoda</SelectItem>
                      <SelectItem value="Klook">Klook</SelectItem>
                      <SelectItem value="Booking.com">Booking.com</SelectItem>
                      <SelectItem value="Ctrip">Ctrip</SelectItem>
                      <SelectItem value="WeChat">WeChat</SelectItem>
                      <SelectItem value="Line">Line</SelectItem>
                      <SelectItem value="Phone">Phone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label>Note</Label>
              <Textarea
                placeholder="Additional info e.g. child seat, flight number, etc."
                rows={2}
                value={newBooking.notes}
                onChange={e => setNewBooking({...newBooking, notes: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button size="sm" variant="outline" onClick={() => { setIsNewOpen(false); setNewBooking(emptyNewBooking) }}>
              Cancel
            </Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleCreateBooking}>
              <Plus className="h-4 w-4 mr-2" />
              Create Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>{selectedBooking?.id}</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><Label className="text-muted-foreground">Customer</Label><p className="font-medium">{selectedBooking.customer}</p></div>
                <div><Label className="text-muted-foreground">Phone</Label><p className="font-medium">{selectedBooking.phone}</p></div>
                <div><Label className="text-muted-foreground">Pickup</Label><p className="font-medium">{selectedBooking.pickup}</p></div>
                <div><Label className="text-muted-foreground">Dropoff</Label><p className="font-medium">{selectedBooking.dropoff}</p></div>
                <div><Label className="text-muted-foreground">Date & Time</Label><p className="font-medium">{selectedBooking.date} {selectedBooking.time}</p></div>
                <div><Label className="text-muted-foreground">Duration</Label><p className="font-medium">{selectedBooking.duration}</p></div>
                <div><Label className="text-muted-foreground">Driver</Label><p className="font-medium">{selectedBooking.driver}</p></div>
                <div><Label className="text-muted-foreground">Vehicle</Label><p className="font-medium">{selectedBooking.vehicle}</p></div>
                <div><Label className="text-muted-foreground">Passengers</Label><p className="font-medium">{selectedBooking.passengers} pax</p></div>
                <div><Label className="text-muted-foreground">Fare</Label><p className="font-medium text-green-600">฿{selectedBooking.fare.toLocaleString()}</p></div>
                <div><Label className="text-muted-foreground">Source</Label><p className="font-medium">{selectedBooking.source}</p></div>
                <div><Label className="text-muted-foreground">Rating</Label><p className="font-medium">{selectedBooking.rating ? `${selectedBooking.rating} ★` : 'N/A'}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-muted-foreground">Status</Label>
                <Badge className={`${statusColors[selectedBooking.status]}`} variant="outline">{selectedBooking.status.replace('_', ' ')}</Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogDescription>Edit Information Booking {selectedBooking?.id}</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Status</Label>
                  <Select defaultValue={selectedBooking.status}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Driver</Label><Input defaultValue={selectedBooking.driver} /></div>
                <div className="space-y-2"><Label>Vehicle</Label><Input defaultValue={selectedBooking.vehicle} /></div>
                <div className="space-y-2"><Label>Fare (THB)</Label><Input type="number" defaultValue={selectedBooking.fare} /></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setIsEditOpen(false); toast({ title: 'Booking Updated', description: `${selectedBooking?.id} has been updated.` }) }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              ConfirmCancel Booking <strong>{selectedBooking?.id}</strong> of {selectedBooking?.customer}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Cancel Booking</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
