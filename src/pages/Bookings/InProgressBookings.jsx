import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Search, Filter, Download, RefreshCw, Navigation, MapPin, Clock, User, Phone, MessageSquare, Eye, CheckCircle2, Zap, Pause } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const inProgressBookingsData = [
  { id: 'BK-2024-002', customer: 'Sarah Johnson', phone: '+66-8-2345-6789', pickup: 'Central World', dropoff: 'Luxury Hotel', driver: 'Arun K.', vehicle: 'CAR-12', passengers: 2, fare: '฿320', startTime: '2024-03-22 10:15', status: 'in-progress', progress: 65, remainingTime: '10 min', remainingDistance: '5.2 km' },
  { id: 'BK-2024-011', customer: 'Peter Parker', phone: '+66-8-1111-2222', pickup: 'Grand Palace', dropoff: 'Wat Arun', driver: 'Niran T.', vehicle: 'VAN-08', passengers: 4, fare: '฿420', startTime: '2024-03-22 10:30', status: 'in-progress', progress: 30, remainingTime: '18 min', remainingDistance: '8.4 km' },
]

export default function InProgressBookings() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [bookings, setBookings] = useState(inProgressBookingsData)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [showCallDialog, setShowCallDialog] = useState(false)
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showPauseDialog, setShowPauseDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [messageText, setMessageText] = useState('')

  const filteredBookings = bookings.filter(b =>
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.driver.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(r => setTimeout(r, 1000))
    setIsRefreshing(false)
    toast({ title: 'Data Refreshed', description: 'In-progress bookings have been updated.' })
  }

  const handleCompleteConfirm = () => {
    setBookings(prev => prev.filter(b => b.id !== selectedBooking.id))
    setShowCompleteDialog(false)
    toast({ title: 'Trip Completed', description: `${selectedBooking.id} has been completed successfully.` })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">In-Progress Bookings</h1>
          <p className="text-muted-foreground mt-1">Trips currently being executed by drivers</p>
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
        <Card className="border-none shadow-sm bg-white"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Active Trips</p><h3 className="text-2xl font-bold mt-1">{bookings.length}</h3></div><div className="p-2 rounded-lg bg-blue-50"><Navigation className="h-5 w-5 text-blue-600" /></div></div></CardContent></Card>
        <Card className="border-none shadow-sm bg-white"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">VIP Trips</p><h3 className="text-2xl font-bold mt-1">0</h3></div><div className="p-2 rounded-lg bg-purple-50"><Zap className="h-5 w-5 text-purple-600" /></div></div></CardContent></Card>
        <Card className="border-none shadow-sm bg-white"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Avg Progress</p><h3 className="text-2xl font-bold mt-1">{bookings.length ? Math.round(bookings.reduce((s,b) => s+b.progress, 0)/bookings.length) : 0}%</h3></div><div className="p-2 rounded-lg bg-green-50"><CheckCircle2 className="h-5 w-5 text-green-600" /></div></div></CardContent></Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search trips..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
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
                    <Badge className="bg-blue-100 text-blue-800 border-none">In Progress</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div><p className="text-sm font-medium">{booking.customer}</p><p className="text-xs text-muted-foreground">{booking.phone}</p></div>
                    <div><p className="text-sm font-bold text-orange-600">{booking.fare}</p><p className="text-xs text-muted-foreground">{booking.passengers} pax</p></div>
                  </div>
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-green-600" /><span className="text-muted-foreground">From: <span className="font-medium">{booking.pickup}</span></span></div>
                    <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-red-600" /><span className="text-muted-foreground">To: <span className="font-medium">{booking.dropoff}</span></span></div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" />{booking.driver} · {booking.vehicle}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{booking.remainingTime} remaining</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs"><span>Progress</span><span className="font-medium">{booking.progress}%</span></div>
                    <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full transition-all" style={{width: `${booking.progress}%`}}></div></div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setSelectedBooking(booking); setShowCompleteDialog(true) }}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />Complete
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { setSelectedBooking(booking); setShowCallDialog(true) }}><Phone className="h-4 w-4 mr-2" />Call</Button>
                  <Button variant="outline" size="sm" onClick={() => { setSelectedBooking(booking); setMessageText(''); setShowMessageDialog(true) }}><MessageSquare className="h-4 w-4 mr-2" />Message</Button>
                  <Button variant="outline" size="sm" onClick={() => { setSelectedBooking(booking); setShowDetailDialog(true) }}><Eye className="h-4 w-4 mr-2" />Details</Button>
                  <Button variant="outline" size="sm" className="text-yellow-600 hover:bg-yellow-50" onClick={() => { setSelectedBooking(booking); setShowPauseDialog(true) }}><Pause className="h-4 w-4 mr-2" />Pause</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <Card className="border-none shadow-sm"><CardContent className="p-12 text-center"><Navigation className="h-12 w-12 text-slate-300 mx-auto mb-3" /><p className="text-muted-foreground">No in-progress trips</p></CardContent></Card>
        )}
      </div>

      <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Complete Trip</AlertDialogTitle><AlertDialogDescription>Mark {selectedBooking?.id} for {selectedBooking?.customer} as completed?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-green-600 hover:bg-green-700" onClick={handleCompleteConfirm}>Complete Trip</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Send Message</DialogTitle><DialogDescription>Message to {selectedBooking?.customer}</DialogDescription></DialogHeader>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {['Driver is on the way', 'Arriving in 5 minutes', 'Please be ready at pickup point'].map(t => (
                <button key={t} className="text-xs px-2 py-1 rounded-full border border-gray-200 hover:bg-gray-50" onClick={() => setMessageText(t)}>{t}</button>
              ))}
            </div>
            <Textarea placeholder="Type your message..." value={messageText} onChange={e => setMessageText(e.target.value)} rows={3} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setShowMessageDialog(false); toast({ title: 'Message Sent' }); setMessageText('') }} disabled={!messageText.trim()}><MessageSquare className="h-4 w-4 mr-2" />Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Trip Details</DialogTitle><DialogDescription>{selectedBooking?.id}</DialogDescription></DialogHeader>
          {selectedBooking && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-muted-foreground">Customer</p><p className="font-medium">{selectedBooking.customer}</p></div>
              <div><p className="text-muted-foreground">Driver</p><p className="font-medium">{selectedBooking.driver}</p></div>
              <div><p className="text-muted-foreground">Vehicle</p><p className="font-medium">{selectedBooking.vehicle}</p></div>
              <div><p className="text-muted-foreground">Fare</p><p className="font-medium text-orange-600">{selectedBooking.fare}</p></div>
              <div><p className="text-muted-foreground">Pickup</p><p className="font-medium">{selectedBooking.pickup}</p></div>
              <div><p className="text-muted-foreground">Dropoff</p><p className="font-medium">{selectedBooking.dropoff}</p></div>
              <div><p className="text-muted-foreground">Remaining</p><p className="font-medium text-blue-600">{selectedBooking.remainingTime} · {selectedBooking.remainingDistance}</p></div>
              <div><p className="text-muted-foreground">Progress</p><p className="font-medium">{selectedBooking.progress}%</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setShowDetailDialog(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showPauseDialog} onOpenChange={setShowPauseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Pause Trip</AlertDialogTitle><AlertDialogDescription>Pause {selectedBooking?.id}? The driver will be notified to wait.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-yellow-600 hover:bg-yellow-700" onClick={() => { setShowPauseDialog(false); toast({ title: 'Trip Paused', description: `${selectedBooking?.id} has been paused` }) }}>Pause Trip</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Export In-Progress Trips</DialogTitle><DialogDescription>Choose export format</DialogDescription></DialogHeader>
          <div className="space-y-2">
            {['CSV', 'Excel (.xlsx)', 'PDF Report'].map(fmt => (
              <button key={fmt} className="w-full p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-left text-sm font-medium" onClick={() => { setShowExportDialog(false); toast({ title: 'Exporting...', description: `Downloading ${fmt}` }) }}>{fmt}</button>
            ))}
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowExportDialog(false)}>Cancel</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
