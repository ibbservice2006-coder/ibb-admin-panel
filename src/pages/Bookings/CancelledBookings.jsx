import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Search, Filter, Download, RefreshCw, XCircle, MapPin, Clock, Eye, RotateCcw, Trash2, DollarSign } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const cancelledBookingsData = [
  { id: 'BK-2024-013', customer: 'Alice Brown', phone: '+66-8-3333-4444', pickup: 'Siam Paragon', dropoff: 'Don Mueang Airport', passengers: 2, fare: '฿520', cancelledTime: '2024-03-22 08:30', reason: 'Customer Request', refunded: true },
  { id: 'BK-2024-015', customer: 'Bob Green', phone: '+66-8-5555-6666', pickup: 'MBK Center', dropoff: 'Chatuchak', passengers: 1, fare: '฿180', cancelledTime: '2024-03-22 09:15', reason: 'No Driver Available', refunded: false },
  { id: 'BK-2024-017', customer: 'Carol White', phone: '+66-8-7777-8888', pickup: 'Asiatique', dropoff: 'Silom', passengers: 3, fare: '฿350', cancelledTime: '2024-03-22 11:45', reason: 'Duplicate Booking', refunded: true },
]

export default function CancelledBookings() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [bookings, setBookings] = useState(cancelledBookingsData)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [restoreReason, setRestoreReason] = useState('')

  const filteredBookings = bookings.filter(b =>
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.customer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(r => setTimeout(r, 1000))
    setIsRefreshing(false)
    toast({ title: 'Data Refreshed', description: 'Cancelled bookings have been updated.' })
  }

  const handleRestoreConfirm = () => {
    setBookings(prev => prev.filter(b => b.id !== selectedBooking.id))
    setShowRestoreDialog(false)
    toast({ title: 'Booking Restored', description: `${selectedBooking.id} has been restored to Pending` })
  }

  const handleDeleteConfirm = () => {
    setBookings(prev => prev.filter(b => b.id !== selectedBooking.id))
    setShowDeleteDialog(false)
    toast({ title: 'Booking Deleted', description: `${selectedBooking.id} has been permanently deleted`, variant: 'destructive' })
  }

  const totalLost = bookings.filter(b => !b.refunded).reduce((s, b) => s + parseInt(b.fare.replace('฿', '')), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cancelled Bookings</h1>
          <p className="text-muted-foreground mt-1">Bookings that have been cancelled</p>
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
        <Card className="border-none shadow-sm bg-white"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Total Cancelled</p><h3 className="text-2xl font-bold mt-1">{bookings.length}</h3></div><div className="p-2 rounded-lg bg-red-50"><XCircle className="h-5 w-5 text-red-600" /></div></div></CardContent></Card>
        <Card className="border-none shadow-sm bg-white"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Refunded</p><h3 className="text-2xl font-bold mt-1">{bookings.filter(b => b.refunded).length}</h3></div><div className="p-2 rounded-lg bg-green-50"><RotateCcw className="h-5 w-5 text-green-600" /></div></div></CardContent></Card>
        <Card className="border-none shadow-sm bg-white"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Revenue Lost</p><h3 className="text-2xl font-bold mt-1">฿{totalLost.toLocaleString()}</h3></div><div className="p-2 rounded-lg bg-orange-50"><DollarSign className="h-5 w-5 text-orange-600" /></div></div></CardContent></Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search cancelled bookings..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
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
                    <Badge className="bg-red-100 text-red-800 border-none">Cancelled</Badge>
                    <Badge className={booking.refunded ? 'bg-green-100 text-green-800 border-none' : 'bg-orange-100 text-orange-800 border-none'}>{booking.refunded ? 'Refunded' : 'No Refund'}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div><p className="text-sm font-medium">{booking.customer}</p><p className="text-xs text-muted-foreground">{booking.phone}</p></div>
                    <div><p className="text-sm font-bold text-red-600">{booking.fare}</p><p className="text-xs text-muted-foreground">{booking.passengers} pax</p></div>
                  </div>
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-green-600" /><span className="text-muted-foreground">From: <span className="font-medium">{booking.pickup}</span></span></div>
                    <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-red-600" /><span className="text-muted-foreground">To: <span className="font-medium">{booking.dropoff}</span></span></div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Cancelled: {booking.cancelledTime}</span>
                    <span className="text-red-600">Reason: {booking.reason}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setSelectedBooking(booking); setShowDetailDialog(true) }}><Eye className="h-4 w-4 mr-2" />Details</Button>
                  <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setSelectedBooking(booking); setRestoreReason(''); setShowRestoreDialog(true) }}><RotateCcw className="h-4 w-4 mr-2" />Restore</Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => { setSelectedBooking(booking); setShowDeleteDialog(true) }}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Cancelled Booking Details</DialogTitle><DialogDescription>{selectedBooking?.id}</DialogDescription></DialogHeader>
          {selectedBooking && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-muted-foreground">Customer</p><p className="font-medium">{selectedBooking.customer}</p></div>
              <div><p className="text-muted-foreground">Phone</p><p className="font-medium">{selectedBooking.phone}</p></div>
              <div><p className="text-muted-foreground">Pickup</p><p className="font-medium">{selectedBooking.pickup}</p></div>
              <div><p className="text-muted-foreground">Dropoff</p><p className="font-medium">{selectedBooking.dropoff}</p></div>
              <div><p className="text-muted-foreground">Fare</p><p className="font-medium text-red-600">{selectedBooking.fare}</p></div>
              <div><p className="text-muted-foreground">Passengers</p><p className="font-medium">{selectedBooking.passengers}</p></div>
              <div><p className="text-muted-foreground">Cancelled At</p><p className="font-medium">{selectedBooking.cancelledTime}</p></div>
              <div><p className="text-muted-foreground">Reason</p><p className="font-medium">{selectedBooking.reason}</p></div>
              <div><p className="text-muted-foreground">Refund Status</p><Badge className={selectedBooking.refunded ? 'bg-green-100 text-green-800 border-none' : 'bg-orange-100 text-orange-800 border-none'}>{selectedBooking.refunded ? 'Refunded' : 'No Refund'}</Badge></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setShowDetailDialog(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Restore Booking</DialogTitle><DialogDescription>Restore {selectedBooking?.id} to Pending status?</DialogDescription></DialogHeader>
          <div className="space-y-2">
            <Label>Reason for Restoration</Label>
            <Select onValueChange={setRestoreReason}>
              <SelectTrigger><SelectValue placeholder="Select reason..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="customer_request">Customer Request</SelectItem>
                <SelectItem value="admin_decision">Admin Decision</SelectItem>
                <SelectItem value="system_error">System Error</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleRestoreConfirm} disabled={!restoreReason}><RotateCcw className="h-4 w-4 mr-2" />Restore Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Permanently Delete</AlertDialogTitle><AlertDialogDescription>Delete {selectedBooking?.id} permanently? This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteConfirm}>Delete Permanently</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Export Cancelled Bookings</DialogTitle><DialogDescription>Choose export format</DialogDescription></DialogHeader>
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
