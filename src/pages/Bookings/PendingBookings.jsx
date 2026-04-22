import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Search, Filter, Download, RefreshCw, Phone, MapPin, Clock, AlertCircle, CheckCircle2, Zap, User, MessageSquare, Eye, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const pendingBookingsData = [
  { id: 'BK-2024-004', customer: 'Emma Wilson', phone: '+66-8-4567-8901', pickup: 'Airport Terminal 3', dropoff: 'City Center', passengers: 3, fare: '฿520', bookingTime: '2024-03-22 16:30', waitTime: '8 min', priority: 'normal', notes: 'Customer waiting at terminal' },
  { id: 'BK-2024-006', customer: 'Lisa Anderson', phone: '+66-8-6789-0123', pickup: 'Hospital', dropoff: 'Residential Area', passengers: 2, fare: '฿380', bookingTime: '2024-03-22 17:15', waitTime: '12 min', priority: 'vip', notes: 'VIP Member - Priority' },
  { id: 'BK-2024-007', customer: 'Robert Taylor', phone: '+66-8-7890-1234', pickup: 'Shopping Center', dropoff: 'Hotel', passengers: 4, fare: '฿450', bookingTime: '2024-03-22 17:45', waitTime: '15 min', priority: 'normal', notes: 'Large group' },
]

const availableDrivers = [
  { id: 'D001', name: 'Somchai Panya', vehicle: 'IBB-VAN-012', rating: 4.9, trips: 1842 },
  { id: 'D002', name: 'Preecha Wongkham', vehicle: 'IBB-VAN-008', rating: 4.8, trips: 1654 },
  { id: 'D003', name: 'Krit Thongchai', vehicle: 'IBB-VAN-005', rating: 4.7, trips: 1230 },
  { id: 'D004', name: 'Arthit Sombat', vehicle: 'IBB-VAN-015', rating: 4.9, trips: 2100 },
]

export default function PendingBookings() {
  const { toast } = useToast()
  const [bookings, setBookings] = useState(pendingBookingsData)
  const [searchTerm, setSearchTerm] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [selectedDriver, setSelectedDriver] = useState('')
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showCallDialog, setShowCallDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [cancelReason, setCancelReason] = useState('')

  const filteredBookings = bookings.filter(b =>
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.customer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(r => setTimeout(r, 1000))
    setIsRefreshing(false)
    toast({ title: 'Refreshed', description: 'Pending bookings updated.' })
  }

  const handleAssignConfirm = () => {
    if (!selectedDriver) return
    const driver = availableDrivers.find(d => d.id === selectedDriver)
    setBookings(prev => prev.filter(b => b.id !== selectedBooking.id))
    setShowAssignDialog(false)
    setSelectedDriver('')
    toast({ title: 'Driver Assigned', description: `${driver.name} assigned to ${selectedBooking.id}` })
  }

  const handleCancelConfirm = () => {
    setBookings(prev => prev.filter(b => b.id !== selectedBooking.id))
    setShowCancelDialog(false)
    setCancelReason('')
    toast({ title: 'Booking Cancelled', description: `${selectedBooking.id} has been cancelled`, variant: 'destructive' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pending Bookings</h1>
          <p className="text-muted-foreground mt-1">Bookings waiting for driver assignment</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />Refresh
          </Button>
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setShowExportDialog(true)}>
            <Download className="h-4 w-4 mr-2" />Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-white"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Total Pending</p><h3 className="text-2xl font-bold mt-1">{bookings.length}</h3></div><div className="p-2 rounded-lg bg-yellow-50"><Clock className="h-5 w-5 text-yellow-600" /></div></div></CardContent></Card>
        <Card className="border-none shadow-sm bg-white"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">VIP Bookings</p><h3 className="text-2xl font-bold mt-1">{bookings.filter(b => b.priority === 'vip').length}</h3></div><div className="p-2 rounded-lg bg-purple-50"><Zap className="h-5 w-5 text-purple-600" /></div></div></CardContent></Card>
        <Card className="border-none shadow-sm bg-white"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Avg Wait Time</p><h3 className="text-2xl font-bold mt-1">11 min</h3></div><div className="p-2 rounded-lg bg-blue-50"><AlertCircle className="h-5 w-5 text-blue-600" /></div></div></CardContent></Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by booking ID or customer name..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2"  onClick={() => toast({ title: 'Filter Applied', description: 'Data filtered' })}/>Filter</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filteredBookings.length > 0 ? filteredBookings.map(booking => (
          <Card key={booking.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-bold text-sm">{booking.id}</h3>
                    <Badge className={booking.priority === 'vip' ? 'bg-purple-100 text-purple-800 border-none' : 'bg-slate-100 text-slate-800 border-none'}>{booking.priority === 'vip' ? '⭐ VIP' : 'Normal'}</Badge>
                    <Badge className="bg-yellow-100 text-yellow-800 border-none">Pending</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div><p className="text-sm font-medium">{booking.customer}</p><p className="text-xs text-muted-foreground">{booking.phone}</p></div>
                    <div><p className="text-sm font-bold text-orange-600">{booking.fare}</p><p className="text-xs text-muted-foreground">{booking.passengers} passengers</p></div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-green-600 flex-shrink-0" /><span className="text-muted-foreground">From: <span className="font-medium">{booking.pickup}</span></span></div>
                    <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-red-600 flex-shrink-0" /><span className="text-muted-foreground">To: <span className="font-medium">{booking.dropoff}</span></span></div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Booked: {booking.bookingTime}</span>
                    <span className="flex items-center gap-1 font-bold text-red-600"><AlertCircle className="h-3 w-3" />Waiting: {booking.waitTime}</span>
                  </div>
                  {booking.notes && <div className="bg-blue-50 border-l-2 border-l-blue-500 p-2 rounded text-xs text-blue-900 mb-4">{booking.notes}</div>}
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setSelectedBooking(booking); setSelectedDriver(''); setShowAssignDialog(true) }}>
                    <User className="h-4 w-4 mr-2" />Assign Driver
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { setSelectedBooking(booking); setShowCallDialog(true) }}><Phone className="h-4 w-4 mr-2" />Call</Button>
                  <Button variant="outline" size="sm" onClick={() => { setSelectedBooking(booking); setMessageText(''); setShowMessageDialog(true) }}><MessageSquare className="h-4 w-4 mr-2" />Message</Button>
                  <Button variant="outline" size="sm" onClick={() => { setSelectedBooking(booking); setShowDetailDialog(true) }}><Eye className="h-4 w-4 mr-2" />Details</Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => { setSelectedBooking(booking); setCancelReason(''); setShowCancelDialog(true) }}><X className="h-4 w-4 mr-2" />Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <Card className="border-none shadow-sm"><CardContent className="p-12 text-center"><CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" /><p className="text-muted-foreground">No pending bookings</p></CardContent></Card>
        )}
      </div>

      {/* Assign Driver Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Assign Driver</DialogTitle><DialogDescription>Select a driver for {selectedBooking?.id}</DialogDescription></DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                <p className="font-medium">{selectedBooking.customer}</p>
                <p className="text-muted-foreground">{selectedBooking.pickup} → {selectedBooking.dropoff}</p>
                <p className="text-orange-600 font-bold">{selectedBooking.fare} · {selectedBooking.passengers} pax</p>
              </div>
              <div className="space-y-2">
                <Label>Available Drivers</Label>
                {availableDrivers.map(driver => (
                  <button key={driver.id} className={`w-full p-3 rounded-lg border text-left transition-colors ${selectedDriver === driver.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`} onClick={() => setSelectedDriver(driver.id)}>
                    <div className="flex items-center justify-between">
                      <div><p className="font-medium text-sm">{driver.name}</p><p className="text-xs text-muted-foreground">{driver.vehicle}</p></div>
                      <div className="text-right"><p className="text-xs font-medium">⭐ {driver.rating}</p><p className="text-xs text-muted-foreground">{driver.trips.toLocaleString()} trips</p></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleAssignConfirm} disabled={!selectedDriver}><User className="h-4 w-4 mr-2" />Assign Driver</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Call Dialog */}
      <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Call Customer</DialogTitle><DialogDescription>{selectedBooking?.customer}</DialogDescription></DialogHeader>
          <div className="p-4 bg-green-50 rounded-lg text-center"><Phone className="h-8 w-8 text-green-600 mx-auto mb-2" /><p className="font-bold text-lg">{selectedBooking?.phone}</p></div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCallDialog(false)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => { setShowCallDialog(false); toast({ title: 'Calling...', description: `Connecting to ${selectedBooking?.customer}` }) }}><Phone className="h-4 w-4 mr-2" />Call Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Send Message</DialogTitle><DialogDescription>Send a message to {selectedBooking?.customer}</DialogDescription></DialogHeader>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {['Your driver is being assigned', 'Please wait a moment', 'We will contact you shortly'].map(t => (
                <button key={t} className="text-xs px-2 py-1 rounded-full border border-gray-200 hover:bg-gray-50" onClick={() => setMessageText(t)}>{t}</button>
              ))}
            </div>
            <Textarea placeholder="Type your message..." value={messageText} onChange={e => setMessageText(e.target.value)} rows={3} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setShowMessageDialog(false); toast({ title: 'Message Sent', description: `Message sent to ${selectedBooking?.customer}` }); setMessageText('') }} disabled={!messageText.trim()}><MessageSquare className="h-4 w-4 mr-2" />Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Booking Details</DialogTitle><DialogDescription>{selectedBooking?.id}</DialogDescription></DialogHeader>
          {selectedBooking && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-muted-foreground">Customer</p><p className="font-medium">{selectedBooking.customer}</p></div>
              <div><p className="text-muted-foreground">Phone</p><p className="font-medium">{selectedBooking.phone}</p></div>
              <div><p className="text-muted-foreground">Pickup</p><p className="font-medium">{selectedBooking.pickup}</p></div>
              <div><p className="text-muted-foreground">Dropoff</p><p className="font-medium">{selectedBooking.dropoff}</p></div>
              <div><p className="text-muted-foreground">Fare</p><p className="font-medium text-orange-600">{selectedBooking.fare}</p></div>
              <div><p className="text-muted-foreground">Passengers</p><p className="font-medium">{selectedBooking.passengers}</p></div>
              <div><p className="text-muted-foreground">Booked At</p><p className="font-medium">{selectedBooking.bookingTime}</p></div>
              <div><p className="text-muted-foreground">Waiting</p><p className="font-medium text-red-600">{selectedBooking.waitTime}</p></div>
              {selectedBooking.notes && <div className="col-span-2 p-3 bg-yellow-50 rounded-lg"><p className="font-medium text-yellow-800">Notes</p><p className="text-yellow-700">{selectedBooking.notes}</p></div>}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>Close</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setShowDetailDialog(false); setSelectedDriver(''); setShowAssignDialog(true) }}><User className="h-4 w-4 mr-2" />Assign Driver</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to cancel {selectedBooking?.id} for {selectedBooking?.customer}?</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <Label className="text-sm">Reason for cancellation</Label>
            <Select onValueChange={setCancelReason}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select reason..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="customer_request">Customer Request</SelectItem>
                <SelectItem value="no_driver">No Driver Available</SelectItem>
                <SelectItem value="duplicate">Duplicate Booking</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleCancelConfirm}>Cancel Booking</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Export Pending Bookings</DialogTitle><DialogDescription>Choose export format</DialogDescription></DialogHeader>
          <div className="space-y-2">
            {['CSV', 'Excel (.xlsx)', 'PDF Report'].map(fmt => (
              <button key={fmt} className="w-full p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-left text-sm font-medium" onClick={() => { setShowExportDialog(false); toast({ title: 'Exporting...', description: `Downloading ${fmt} file` }) }}>{fmt}</button>
            ))}
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowExportDialog(false)}>Cancel</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
