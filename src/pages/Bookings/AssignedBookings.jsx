import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import {
  Search, Filter, Download, RefreshCw, Users, MapPin, Clock, DollarSign,
  User, Phone, MessageSquare, Eye, CheckCircle2, Car, Navigation
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const assignedBookingsData = [
  { id: 'BK-2024-009', customer: 'David Miller', phone: '+66-8-9012-3456', pickup: 'Siam Paragon', dropoff: 'Don Mueang Airport', driver: 'Wichai S.', driverPhone: '+66-8-1234-5678', vehicle: 'VAN-32', passengers: 5, fare: '฿550', bookingTime: '2024-03-22 18:00', status: 'assigned', eta: '12 min', notes: 'Passenger has extra luggage' },
  { id: 'BK-2024-010', customer: 'Linda Green', phone: '+66-8-0123-4567', pickup: 'Sukhumvit Soi 11', dropoff: 'Asok Junction', driver: 'Somchai P.', driverPhone: '+66-8-2345-6789', vehicle: 'CAR-05', passengers: 1, fare: '฿180', bookingTime: '2024-03-22 18:30', status: 'assigned', eta: '5 min', notes: '' },
  { id: 'BK-2024-011', customer: 'Robert Chen', phone: '+66-8-1234-5670', pickup: 'Central World', dropoff: 'Chatuchak Market', driver: 'Niran T.', driverPhone: '+66-8-3456-7890', vehicle: 'BUS-08', passengers: 12, fare: '฿1,200', bookingTime: '2024-03-22 19:00', status: 'assigned', eta: '20 min', notes: 'Group booking - corporate event' }
]

export default function AssignedBookings() {
  const { toast } = useToast()
  const [bookings, setBookings] = useState(assignedBookingsData)
  const [searchQuery, setSearchQuery] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showCallDialog, setShowCallDialog] = useState(false)
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [showStartTripDialog, setShowStartTripDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [callTarget, setCallTarget] = useState('customer')

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => { setIsRefreshing(false); toast({ title: 'Refreshed', description: 'Assigned bookings updated' }) }, 1000)
  }

  const filteredBookings = bookings.filter(b =>
    b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.driver.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assigned Bookings</h1>
          <p className="text-muted-foreground mt-1">Bookings with assigned drivers waiting to start trip</p>
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
        <Card className="border-none shadow-sm bg-white"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Total Assigned</p><h3 className="text-2xl font-bold mt-1">{bookings.length}</h3></div><div className="p-2 rounded-lg bg-purple-50"><Users className="h-5 w-5 text-purple-600" /></div></div></CardContent></Card>
        <Card className="border-none shadow-sm bg-white"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Average ETA</p><h3 className="text-2xl font-bold mt-1">12 min</h3></div><div className="p-2 rounded-lg bg-blue-50"><Clock className="h-5 w-5 text-blue-600" /></div></div></CardContent></Card>
        <Card className="border-none shadow-sm bg-white"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Assigned Drivers</p><h3 className="text-2xl font-bold mt-1">{bookings.length}</h3></div><div className="p-2 rounded-lg bg-green-50"><User className="h-5 w-5 text-green-600" /></div></div></CardContent></Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by booking ID, customer or driver name..." className="pl-10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
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
                    <Badge className="bg-purple-100 text-purple-800 border-none">Assigned</Badge>
                    <span className="text-xs font-bold text-blue-600 ml-auto flex items-center gap-1"><Clock className="h-3 w-3" />ETA: {booking.eta}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div><p className="text-xs text-muted-foreground">Customer</p><p className="text-sm font-medium">{booking.customer}</p><p className="text-xs text-muted-foreground">{booking.phone}</p></div>
                    <div><p className="text-xs text-muted-foreground">Driver</p><p className="text-sm font-medium">{booking.driver}</p><p className="text-xs text-muted-foreground">{booking.vehicle}</p></div>
                    <div><p className="text-sm font-bold text-orange-600">{booking.fare}</p><p className="text-xs text-muted-foreground">{booking.passengers} passengers</p></div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-green-600 flex-shrink-0" /><span className="text-muted-foreground">{booking.pickup}</span></div>
                    <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-red-600 flex-shrink-0" /><span className="text-muted-foreground">{booking.dropoff}</span></div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Booked: {booking.bookingTime}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => { setSelectedBooking(booking); setShowStartTripDialog(true) }}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />Start Trip
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => { setSelectedBooking(booking); setCallTarget('customer'); setShowCallDialog(true) }}><Phone className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => { setSelectedBooking(booking); setMessageText(''); setShowMessageDialog(true) }}><MessageSquare className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => { setSelectedBooking(booking); setShowDetailDialog(true) }}><Eye className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <Card className="border-none shadow-sm"><CardContent className="p-12 text-center"><Users className="h-12 w-12 text-slate-300 mx-auto mb-3" /><p className="text-muted-foreground">No assigned bookings found</p></CardContent></Card>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Booking Details</DialogTitle><DialogDescription>{selectedBooking?.id}</DialogDescription></DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">Customer</p><p className="font-medium">{selectedBooking.customer}</p></div>
                <div><p className="text-muted-foreground">Phone</p><p className="font-medium">{selectedBooking.phone}</p></div>
                <div><p className="text-muted-foreground">Driver</p><p className="font-medium">{selectedBooking.driver}</p></div>
                <div><p className="text-muted-foreground">Vehicle</p><p className="font-medium">{selectedBooking.vehicle}</p></div>
                <div><p className="text-muted-foreground">Pickup</p><p className="font-medium">{selectedBooking.pickup}</p></div>
                <div><p className="text-muted-foreground">Dropoff</p><p className="font-medium">{selectedBooking.dropoff}</p></div>
                <div><p className="text-muted-foreground">Passengers</p><p className="font-medium">{selectedBooking.passengers}</p></div>
                <div><p className="text-muted-foreground">Fare</p><p className="font-medium">{selectedBooking.fare}</p></div>
                <div><p className="text-muted-foreground">ETA</p><p className="font-medium">{selectedBooking.eta}</p></div>
                <div><p className="text-muted-foreground">Booked At</p><p className="font-medium">{selectedBooking.bookingTime}</p></div>
              </div>
              {selectedBooking.notes && <div className="p-3 bg-yellow-50 rounded-lg text-sm"><p className="font-medium text-yellow-800">Notes</p><p className="text-yellow-700">{selectedBooking.notes}</p></div>}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>Close</Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => { setShowDetailDialog(false); setShowStartTripDialog(true) }}><CheckCircle2 className="h-4 w-4 mr-2" />Start Trip</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Call Dialog */}
      <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Make a Call</DialogTitle><DialogDescription>Select who to call for {selectedBooking?.id}</DialogDescription></DialogHeader>
          {selectedBooking && (
            <div className="space-y-3">
              <button className={`w-full p-3 rounded-lg border text-left transition-colors ${callTarget === 'customer' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`} onClick={() => setCallTarget('customer')}>
                <p className="font-medium">{selectedBooking.customer}</p><p className="text-sm text-muted-foreground">{selectedBooking.phone} · Customer</p>
              </button>
              <button className={`w-full p-3 rounded-lg border text-left transition-colors ${callTarget === 'driver' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`} onClick={() => setCallTarget('driver')}>
                <p className="font-medium">{selectedBooking.driver}</p><p className="text-sm text-muted-foreground">{selectedBooking.driverPhone} · Driver</p>
              </button>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCallDialog(false)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => { setShowCallDialog(false); toast({ title: 'Calling...', description: `Connecting to ${callTarget === 'customer' ? selectedBooking?.customer : selectedBooking?.driver}` }) }}><Phone className="h-4 w-4 mr-2" />Call Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Send Message</DialogTitle><DialogDescription>Send a message to {selectedBooking?.customer}</DialogDescription></DialogHeader>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {['Driver is on the way', 'Please be ready', 'Slight delay, sorry'].map(t => (
                <button key={t} className="text-xs px-2 py-1 rounded-full border border-gray-200 hover:bg-gray-50" onClick={() => setMessageText(t)}>{t}</button>
              ))}
            </div>
            <Textarea placeholder="Type your message..." value={messageText} onChange={e => setMessageText(e.target.value)} rows={3} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>Cancel</Button>
            <Button className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setShowMessageDialog(false); toast({ title: 'Message Sent', description: `Message sent to ${selectedBooking?.customer}` }); setMessageText('') }} disabled={!messageText.trim()}><MessageSquare className="h-4 w-4 mr-2" />Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Start Trip Confirm Dialog */}
      <Dialog open={showStartTripDialog} onOpenChange={setShowStartTripDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Start Trip</DialogTitle><DialogDescription>Confirm starting trip for {selectedBooking?.id}</DialogDescription></DialogHeader>
          {selectedBooking && (
            <div className="p-4 bg-green-50 rounded-lg text-sm space-y-1">
              <p><span className="text-muted-foreground">Customer:</span> <span className="font-medium">{selectedBooking.customer}</span></p>
              <p><span className="text-muted-foreground">Driver:</span> <span className="font-medium">{selectedBooking.driver} · {selectedBooking.vehicle}</span></p>
              <p><span className="text-muted-foreground">Route:</span> <span className="font-medium">{selectedBooking.pickup} → {selectedBooking.dropoff}</span></p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStartTripDialog(false)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => { setBookings(prev => prev.filter(b => b.id !== selectedBooking.id)); setShowStartTripDialog(false); toast({ title: 'Trip Started', description: `${selectedBooking.id} is now in progress` }) }}><Navigation className="h-4 w-4 mr-2" />Confirm Start</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Export Assigned Bookings</DialogTitle><DialogDescription>Choose export format</DialogDescription></DialogHeader>
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
