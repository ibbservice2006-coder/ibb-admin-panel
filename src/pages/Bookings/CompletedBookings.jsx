import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Search, Filter, Download, RefreshCw, CheckCircle2, MapPin, Clock, Eye, Star, Receipt, RotateCcw, DollarSign } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const completedBookingsData = [
  { id: 'BK-2024-001', customer: 'John Doe', phone: '+66-8-1234-5678', pickup: 'Airport', dropoff: 'City Center', driver: 'Somchai P.', vehicle: 'VAN-012', passengers: 2, fare: '฿450', completedTime: '2024-03-22 09:45', duration: '35 min', rating: 5, distance: '18.5 km' },
  { id: 'BK-2024-005', customer: 'Jane Smith', phone: '+66-8-5678-9012', pickup: 'Hotel', dropoff: 'Airport', driver: 'Preecha W.', vehicle: 'VAN-008', passengers: 1, fare: '฿380', completedTime: '2024-03-22 11:20', duration: '28 min', rating: 4, distance: '15.2 km' },
  { id: 'BK-2024-009', customer: 'Tom Wilson', phone: '+66-8-9012-3456', pickup: 'Office', dropoff: 'Mall', driver: 'Krit T.', vehicle: 'CAR-005', passengers: 3, fare: '฿280', completedTime: '2024-03-22 13:10', duration: '22 min', rating: 5, distance: '11.8 km' },
]

export default function CompletedBookings() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [bookings] = useState(completedBookingsData)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showRatingDialog, setShowRatingDialog] = useState(false)
  const [showReceiptDialog, setShowReceiptDialog] = useState(false)
  const [showRefundDialog, setShowRefundDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [refundReason, setRefundReason] = useState('')
  const [hoverRating, setHoverRating] = useState(0)
  const [newRating, setNewRating] = useState(0)

  const filteredBookings = bookings.filter(b =>
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.customer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(r => setTimeout(r, 1000))
    setIsRefreshing(false)
    toast({ title: 'Data Refreshed', description: 'Completed bookings have been updated.' })
  }

  const totalRevenue = bookings.reduce((s, b) => s + parseInt(b.fare.replace('฿', '')), 0)
  const avgRating = bookings.length ? (bookings.reduce((s, b) => s + b.rating, 0) / bookings.length).toFixed(1) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Completed Bookings</h1>
          <p className="text-muted-foreground mt-1">Successfully completed trips</p>
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
        <Card className="border-none shadow-sm bg-white"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Total Completed</p><h3 className="text-2xl font-bold mt-1">{bookings.length}</h3></div><div className="p-2 rounded-lg bg-green-50"><CheckCircle2 className="h-5 w-5 text-green-600" /></div></div></CardContent></Card>
        <Card className="border-none shadow-sm bg-white"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Total Revenue</p><h3 className="text-2xl font-bold mt-1">฿{totalRevenue.toLocaleString()}</h3></div><div className="p-2 rounded-lg bg-blue-50"><DollarSign className="h-5 w-5 text-blue-600" /></div></div></CardContent></Card>
        <Card className="border-none shadow-sm bg-white"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Avg Rating</p><h3 className="text-2xl font-bold mt-1">⭐ {avgRating}</h3></div><div className="p-2 rounded-lg bg-yellow-50"><Star className="h-5 w-5 text-yellow-600" /></div></div></CardContent></Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search completed bookings..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2"  onClick={() => toast({ title: 'Filter Applied', description: 'Data filtered' })}/>Filter</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filteredBookings.map(booking => (
          <Card key={booking.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-bold text-sm">{booking.id}</h3>
                    <Badge className="bg-green-100 text-green-800 border-none">Completed</Badge>
                    <span className="text-xs">{'⭐'.repeat(booking.rating)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div><p className="text-sm font-medium">{booking.customer}</p><p className="text-xs text-muted-foreground">Driver: {booking.driver}</p></div>
                    <div><p className="text-sm font-bold text-green-600">{booking.fare}</p><p className="text-xs text-muted-foreground">{booking.distance} · {booking.duration}</p></div>
                  </div>
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-green-600" /><span className="text-muted-foreground">From: <span className="font-medium">{booking.pickup}</span></span></div>
                    <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-red-600" /><span className="text-muted-foreground">To: <span className="font-medium">{booking.dropoff}</span></span></div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />Completed: {booking.completedTime}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setSelectedBooking(booking); setShowDetailDialog(true) }}><Eye className="h-4 w-4 mr-2" />Details</Button>
                  <Button variant="outline" size="sm" onClick={() => { setSelectedBooking(booking); setShowReceiptDialog(true) }}><Receipt className="h-4 w-4 mr-2" />Receipt</Button>
                  <Button variant="outline" size="sm" onClick={() => { setSelectedBooking(booking); setNewRating(booking.rating); setShowRatingDialog(true) }}><Star className="h-4 w-4 mr-2" />Rating</Button>
                  <Button variant="outline" size="sm" className="text-orange-600 hover:bg-orange-50" onClick={() => { setSelectedBooking(booking); setRefundReason(''); setShowRefundDialog(true) }}><RotateCcw className="h-4 w-4 mr-2" />Refund</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Trip Details</DialogTitle><DialogDescription>{selectedBooking?.id}</DialogDescription></DialogHeader>
          {selectedBooking && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-muted-foreground">Customer</p><p className="font-medium">{selectedBooking.customer}</p></div>
              <div><p className="text-muted-foreground">Driver</p><p className="font-medium">{selectedBooking.driver}</p></div>
              <div><p className="text-muted-foreground">Vehicle</p><p className="font-medium">{selectedBooking.vehicle}</p></div>
              <div><p className="text-muted-foreground">Fare</p><p className="font-medium text-green-600">{selectedBooking.fare}</p></div>
              <div><p className="text-muted-foreground">Distance</p><p className="font-medium">{selectedBooking.distance}</p></div>
              <div><p className="text-muted-foreground">Duration</p><p className="font-medium">{selectedBooking.duration}</p></div>
              <div><p className="text-muted-foreground">Completed At</p><p className="font-medium">{selectedBooking.completedTime}</p></div>
              <div><p className="text-muted-foreground">Rating</p><p className="font-medium">{'⭐'.repeat(selectedBooking.rating)} ({selectedBooking.rating}/5)</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setShowDetailDialog(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Trip Receipt</DialogTitle><DialogDescription>{selectedBooking?.id}</DialogDescription></DialogHeader>
          {selectedBooking && (
            <div className="space-y-3 text-sm">
              <div className="text-center border-b pb-3"><p className="font-bold text-lg">IBB Shuttle</p><p className="text-muted-foreground">Official Receipt</p></div>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span className="font-medium">{selectedBooking.customer}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Route</span><span className="font-medium text-right">{selectedBooking.pickup} → {selectedBooking.dropoff}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Distance</span><span>{selectedBooking.distance}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span>{selectedBooking.duration}</span></div>
                <div className="flex justify-between border-t pt-2 font-bold"><span>Total</span><span className="text-green-600">{selectedBooking.fare}</span></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReceiptDialog(false)}>Close</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setShowReceiptDialog(false); toast({ title: 'Receipt Sent', description: 'Receipt sent to customer email' }) }}><Receipt className="h-4 w-4 mr-2" />Send to Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Edit Rating</DialogTitle><DialogDescription>{selectedBooking?.id} - {selectedBooking?.driver}</DialogDescription></DialogHeader>
          <div className="flex justify-center gap-2 py-4">
            {[1,2,3,4,5].map(star => (
              <button key={star} className="text-3xl transition-transform hover:scale-110" onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => setNewRating(star)}>
                <span className={(hoverRating || newRating) >= star ? 'text-yellow-400' : 'text-gray-300'}>⭐</span>
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">Selected: {newRating}/5</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRatingDialog(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setShowRatingDialog(false); toast({ title: 'Rating Updated', description: `Rating updated to ${newRating}/5` }) }}><Star className="h-4 w-4 mr-2" />Save Rating</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Process Refund</DialogTitle><DialogDescription>Refund for {selectedBooking?.id} - {selectedBooking?.fare}</DialogDescription></DialogHeader>
          <div className="space-y-3">
            <div className="p-3 bg-orange-50 rounded-lg text-sm"><p className="font-medium text-orange-800">Refund Amount: {selectedBooking?.fare}</p><p className="text-orange-700">This action cannot be undone</p></div>
            <div><Label>Reason for Refund</Label><Textarea className="mt-1" placeholder="Enter refund reason..." value={refundReason} onChange={e => setRefundReason(e.target.value)} rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefundDialog(false)}>Cancel</Button>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => { setShowRefundDialog(false); toast({ title: 'Refund Processed', description: `${selectedBooking?.fare} refunded for ${selectedBooking?.id}` }) }} disabled={!refundReason.trim()}><RotateCcw className="h-4 w-4 mr-2" />Process Refund</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Export Completed Bookings</DialogTitle><DialogDescription>Choose export format</DialogDescription></DialogHeader>
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
