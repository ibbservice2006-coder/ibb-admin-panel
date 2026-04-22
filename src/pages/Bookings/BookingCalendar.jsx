import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  User,
  DollarSign,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

// Mock bookings data
const bookingsData = [
  { id: 'BK-001', date: '2024-03-22', time: '09:00', customer: 'John Doe', pickup: 'Siam', dropoff: 'Airport', fare: '฿450', status: 'completed' },
  { id: 'BK-002', date: '2024-03-22', time: '10:40', customer: 'Sarah J.', pickup: 'Central', dropoff: 'Hotel', fare: '฿320', status: 'completed' },
  { id: 'BK-003', date: '2024-03-22', time: '14:00', customer: 'Mike Chen', pickup: 'Mall', dropoff: 'Beach', fare: '฿680', status: 'confirmed' },
  { id: 'BK-004', date: '2024-03-22', time: '18:00', customer: 'David M.', pickup: 'Paragon', dropoff: 'Airport', fare: '฿550', status: 'assigned' },
  { id: 'BK-005', date: '2024-03-23', time: '08:30', customer: 'Anna Smith', pickup: 'Office', dropoff: 'Park', fare: '฿250', status: 'pending' },
  { id: 'BK-006', date: '2024-03-23', time: '15:00', customer: 'Peter P.', pickup: 'Palace', dropoff: 'Temple', fare: '฿420', status: 'in-progress' },
  { id: 'BK-007', date: '2024-03-24', time: '11:00', customer: 'Linda G.', pickup: 'Station', dropoff: 'Airport', fare: '฿380', status: 'pending' },
  { id: 'BK-008', date: '2024-03-25', time: '09:15', customer: 'Tom Wilson', pickup: 'Hospital', dropoff: 'Home', fare: '฿280', status: 'cancelled' }
]

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  confirmed: { color: 'bg-blue-100 text-blue-800', label: 'Confirmed' },
  assigned: { color: 'bg-purple-100 text-purple-800', label: 'Assigned' },
  'in-progress': { color: 'bg-green-100 text-green-800', label: 'In Progress' },
  completed: { color: 'bg-slate-100 text-slate-800', label: 'Completed' },
  cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
}

export default function BookingCalendar() {
  const { toast } = useToast()
  const [currentDate, setCurrentDate] = useState(new Date(2024, 2, 22))
  const [selectedDate, setSelectedDate] = useState('2024-03-22')
  const [view, setView] = useState('month') // month, week, day
  const [selectedBookingDetail, setSelectedBookingDetail] = useState(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const getBookingsForDate = (dateStr) => {
    return bookingsData.filter(b => b.date === dateStr)
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleDateClick = (day) => {
    const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(dateStr)
  }

  const selectedBookings = getBookingsForDate(selectedDate)

  // Calendar Grid
  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const calendarDays = []

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  const monthName = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Booking Calendar</h1>
          <p className="text-muted-foreground mt-1">View and manage bookings by calendar date</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => { toast({ title: 'Refreshed', description: 'Calendar data updated.' }) }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setShowExportDialog(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button
          variant={view === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('month')}
        >
          Month
        </Button>
        <Button
          variant={view === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('week')}
        >
          Week
        </Button>
        <Button
          variant={view === 'day' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('day')}
        >
          Day
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{monthName}</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-bold text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, idx) => {
                const dateStr = day ? formatDate(currentDate.getFullYear(), currentDate.getMonth(), day) : null
                const dayBookings = dateStr ? getBookingsForDate(dateStr) : []
                const isSelected = dateStr === selectedDate
                const isToday = dateStr === '2024-03-22'

                return (
                  <div
                    key={idx}
                    onClick={() => day && handleDateClick(day)}
                    className={`
                      p-2 rounded-lg border-2 text-center cursor-pointer transition-all min-h-20 flex flex-col
                      ${!day ? 'bg-slate-50 border-transparent' : ''}
                      ${isSelected ? 'border-orange-600 bg-orange-50' : 'border-slate-200 hover:border-slate-300'}
                      ${isToday && !isSelected ? 'bg-blue-50 border-blue-200' : ''}
                    `}
                  >
                    {day && (
                      <>
                        <span className={`text-sm font-bold ${isToday ? 'text-blue-600' : ''}`}>
                          {day}
                        </span>
                        {dayBookings.length > 0 && (
                          <div className="mt-1 flex-1 flex flex-col justify-center">
                            <span className="text-xs font-bold text-orange-600">
                              {dayBookings.length} booking{dayBookings.length > 1 ? 's' : ''}
                            </span>
                            <div className="flex gap-1 justify-center mt-1 flex-wrap">
                              {dayBookings.slice(0, 3).map((b, i) => (
                                <div
                                  key={i}
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    statusConfig[b.status]?.color.split(' ')[0]
                                  }`}
                                ></div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Bookings */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedBookings.length > 0 ? (
              selectedBookings.map(booking => (
                <div key={booking.id} className="p-3 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-sm font-bold">{booking.id}</span>
                    <Badge className={statusConfig[booking.status]?.color}>
                      {statusConfig[booking.status]?.label}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {booking.time}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-3 w-3" />
                      {booking.customer}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {booking.pickup} → {booking.dropoff}
                    </div>
                    <div className="flex items-center gap-2 text-orange-600 font-bold">
                      <DollarSign className="h-3 w-3" />
                      {booking.fare}
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => { setSelectedBookingDetail(booking); setShowDetailDialog(true) }}>
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">No bookings on this date</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {Object.entries(statusConfig).map(([status, config]) => (
              <div key={status} className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${config.color.split(' ')[0]}`}></div>
                <span className="text-sm text-muted-foreground">{config.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Booking Details</DialogTitle><DialogDescription>{selectedBookingDetail?.id}</DialogDescription></DialogHeader>
          {selectedBookingDetail && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-muted-foreground">Customer</p><p className="font-medium">{selectedBookingDetail.customer}</p></div>
              <div><p className="text-muted-foreground">Time</p><p className="font-medium">{selectedBookingDetail.date} {selectedBookingDetail.time}</p></div>
              <div><p className="text-muted-foreground">Pickup</p><p className="font-medium">{selectedBookingDetail.pickup}</p></div>
              <div><p className="text-muted-foreground">Dropoff</p><p className="font-medium">{selectedBookingDetail.dropoff}</p></div>
              <div><p className="text-muted-foreground">Fare</p><p className="font-medium text-orange-600">{selectedBookingDetail.fare}</p></div>
              <div><p className="text-muted-foreground">Status</p><Badge className={statusConfig[selectedBookingDetail.status]?.color}>{statusConfig[selectedBookingDetail.status]?.label}</Badge></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setShowDetailDialog(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Export Calendar</DialogTitle><DialogDescription>Choose export format</DialogDescription></DialogHeader>
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
