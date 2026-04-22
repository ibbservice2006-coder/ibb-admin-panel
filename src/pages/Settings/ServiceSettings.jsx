import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sliders, Clock, Users, MapPin, Save, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ServiceSettings() {
  const { toast } = useToast()

  const [booking, setBooking] = useState({
    advanceBookingDays: "90",
    minAdvanceHours: "4",
    maxPassengers: "12",
    allowSameDay: true,
    allowInstantBook: false,
    requireConfirmation: true,
    autoCancelHours: "24",
    maxCancellationHours: "12",
    cancellationFeePercent: "20",
    allowReschedule: true,
    rescheduleHours: "6",
  })

  const [operations, setOperations] = useState({
    operatingHoursStart: "05:00",
    operatingHoursEnd: "23:00",
    timezone: "Asia/Bangkok",
    pickupBufferMins: "15",
    dropoffBufferMins: "10",
    maxRouteStops: "8",
    driverAssignmentMode: "auto",
    vehicleAssignmentMode: "auto",
    gpsTrackingEnabled: true,
    liveTrackingEnabled: true,
    etaUpdateIntervalSecs: "30",
  })

  const [capacity, setCapacity] = useState({
    sedan: { max: "3", default: "3" },
    van: { max: "9", default: "9" },
    minibus: { max: "16", default: "16" },
    bus: { max: "45", default: "45" },
    luggagePerPax: "2",
    maxLuggageKg: "30",
    childSeatAvailable: true,
    wheelchairAccessible: true,
  })

  const [notifications, setNotifications] = useState({
    sendBookingConfirmation: true,
    sendDriverAssigned: true,
    sendPickupReminder: true,
    reminderHoursBefore: "2",
    sendTripStarted: true,
    sendTripCompleted: true,
    sendCancellationNotice: true,
    feedbackRequestDelay: "30",
  })

  const handleSave = (section) => {
    toast({ title: "Saved", description: section + " settings updated successfully." })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Service Settings</h1>
          <p className="text-muted-foreground">Booking rules, operations, capacity, and notification preferences</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
          <AlertTriangle className="h-4 w-4" />
          <span>Changes affect live bookings</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Advance Booking", value: "90 days", icon: Clock, bg: "bg-blue-100", ic: "text-blue-600" },
          { label: "Min. Notice", value: "4 hours", icon: AlertTriangle, bg: "bg-yellow-100", ic: "text-yellow-600" },
          { label: "Max Passengers", value: "12 pax", icon: Users, bg: "bg-green-100", ic: "text-green-600" },
          { label: "Service Hours", value: "05:00–23:00", icon: MapPin, bg: "bg-purple-100", ic: "text-purple-600" },
        ].map(s => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
              <div className={"p-2 rounded-lg " + s.bg}><s.icon className={"h-4 w-4 " + s.ic} /></div>
            </CardHeader>
            <CardContent><div className="text-lg font-bold">{s.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="booking">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="booking">Booking Rules</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="capacity">Capacity</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="booking" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Booking Rules</CardTitle>
              <CardDescription>Control how customers can make, modify, and cancel bookings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Max Advance Booking (days)</Label>
                  <Input type="number" value={booking.advanceBookingDays} onChange={e => setBooking({...booking, advanceBookingDays: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Min. Advance Notice (hours)</Label>
                  <Input type="number" value={booking.minAdvanceHours} onChange={e => setBooking({...booking, minAdvanceHours: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Max Passengers per Booking</Label>
                  <Input type="number" value={booking.maxPassengers} onChange={e => setBooking({...booking, maxPassengers: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Auto-Cancel if Unpaid (hours)</Label>
                  <Input type="number" value={booking.autoCancelHours} onChange={e => setBooking({...booking, autoCancelHours: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Free Cancellation Window (hours before)</Label>
                  <Input type="number" value={booking.maxCancellationHours} onChange={e => setBooking({...booking, maxCancellationHours: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Cancellation Fee (%)</Label>
                  <Input type="number" value={booking.cancellationFeePercent} onChange={e => setBooking({...booking, cancellationFeePercent: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Min. Reschedule Notice (hours)</Label>
                  <Input type="number" value={booking.rescheduleHours} onChange={e => setBooking({...booking, rescheduleHours: e.target.value})} />
                </div>
              </div>
              <div className="space-y-3 pt-2">
                {[
                  { key: "allowSameDay", label: "Allow Same-Day Booking", desc: "Customers can book for today (subject to min. notice)" },
                  { key: "allowInstantBook", label: "Instant Book (No Confirmation)", desc: "Skip manual confirmation step" },
                  { key: "requireConfirmation", label: "Require Admin Confirmation", desc: "All bookings need manual approval" },
                  { key: "allowReschedule", label: "Allow Reschedule", desc: "Customers can change booking date/time" },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch checked={booking[item.key]} onCheckedChange={v => setBooking({...booking, [item.key]: v})} />
                  </div>
                ))}
              </div>
              <div className="flex justify-end"><Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={() => handleSave("Booking Rules")}><Save />Save Changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Sliders className="h-5 w-5" /> Operations</CardTitle>
              <CardDescription>Operating hours, timezone, and assignment modes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Operating Hours Start</Label>
                  <Input type="time" value={operations.operatingHoursStart} onChange={e => setOperations({...operations, operatingHoursStart: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Operating Hours End</Label>
                  <Input type="time" value={operations.operatingHoursEnd} onChange={e => setOperations({...operations, operatingHoursEnd: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={operations.timezone} onValueChange={v => setOperations({...operations, timezone: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Asia/Bangkok","Asia/Singapore","Asia/Tokyo","Asia/Shanghai","UTC"].map(tz => (
                        <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Pickup Buffer (mins)</Label>
                  <Input type="number" value={operations.pickupBufferMins} onChange={e => setOperations({...operations, pickupBufferMins: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Max Route Stops</Label>
                  <Input type="number" value={operations.maxRouteStops} onChange={e => setOperations({...operations, maxRouteStops: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>GPS Update Interval (secs)</Label>
                  <Input type="number" value={operations.etaUpdateIntervalSecs} onChange={e => setOperations({...operations, etaUpdateIntervalSecs: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Driver Assignment Mode</Label>
                  <Select value={operations.driverAssignmentMode} onValueChange={v => setOperations({...operations, driverAssignmentMode: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto (Nearest Available)</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="round-robin">Round Robin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Vehicle Assignment Mode</Label>
                  <Select value={operations.vehicleAssignmentMode} onValueChange={v => setOperations({...operations, vehicleAssignmentMode: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto (Best Match)</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-3 pt-2">
                {[
                  { key: "gpsTrackingEnabled", label: "GPS Tracking", desc: "Enable real-time GPS tracking for all vehicles" },
                  { key: "liveTrackingEnabled", label: "Live Tracking for Customers", desc: "Allow customers to track their ride in real-time" },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch checked={operations[item.key]} onCheckedChange={v => setOperations({...operations, [item.key]: v})} />
                  </div>
                ))}
              </div>
              <div className="flex justify-end"><Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={() => handleSave("Operations")}><Save />Save Changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capacity" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Vehicle Capacity</CardTitle>
              <CardDescription>Default and maximum passenger capacity per vehicle type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { key: "sedan", label: "Sedan", icon: "🚗" },
                  { key: "van", label: "Van / MPV", icon: "🚐" },
                  { key: "minibus", label: "Minibus", icon: "🚌" },
                  { key: "bus", label: "Bus", icon: "🚍" },
                ].map(v => (
                  <div key={v.key} className="flex items-center gap-4 p-3 border rounded-lg">
                    <span className="text-2xl">{v.icon}</span>
                    <div className="flex-1 font-medium">{v.label}</div>
                    <div className="flex items-center gap-3">
                      <div className="space-y-1 text-center">
                        <Label className="text-xs">Default</Label>
                        <Input className="w-20 text-center" type="number" value={capacity[v.key].default}
                          onChange={e => setCapacity({...capacity, [v.key]: {...capacity[v.key], default: e.target.value}})} />
                      </div>
                      <div className="space-y-1 text-center">
                        <Label className="text-xs">Max</Label>
                        <Input className="w-20 text-center" type="number" value={capacity[v.key].max}
                          onChange={e => setCapacity({...capacity, [v.key]: {...capacity[v.key], max: e.target.value}})} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label>Luggage per Passenger (bags)</Label>
                  <Input type="number" value={capacity.luggagePerPax} onChange={e => setCapacity({...capacity, luggagePerPax: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Max Luggage Weight (kg)</Label>
                  <Input type="number" value={capacity.maxLuggageKg} onChange={e => setCapacity({...capacity, maxLuggageKg: e.target.value})} />
                </div>
              </div>
              <div className="space-y-3 pt-2">
                {[
                  { key: "childSeatAvailable", label: "Child Seat Available", desc: "Offer child seat option on booking" },
                  { key: "wheelchairAccessible", label: "Wheelchair Accessible Vehicles", desc: "Mark vehicles as wheelchair accessible" },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch checked={capacity[item.key]} onCheckedChange={v => setCapacity({...capacity, [item.key]: v})} />
                  </div>
                ))}
              </div>
              <div className="flex justify-end"><Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={() => handleSave("Capacity")}><Save />Save Changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Sliders className="h-5 w-5" /> Notification Triggers</CardTitle>
              <CardDescription>Control which events trigger customer notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { key: "sendBookingConfirmation", label: "Booking Confirmation", desc: "Send when booking is confirmed" },
                  { key: "sendDriverAssigned", label: "Driver Assigned", desc: "Send when driver is assigned to booking" },
                  { key: "sendPickupReminder", label: "Pickup Reminder", desc: "Send reminder before pickup time" },
                  { key: "sendTripStarted", label: "Trip Started", desc: "Send when driver starts the trip" },
                  { key: "sendTripCompleted", label: "Trip Completed", desc: "Send when trip is completed" },
                  { key: "sendCancellationNotice", label: "Cancellation Notice", desc: "Send when booking is cancelled" },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch checked={notifications[item.key]} onCheckedChange={v => setNotifications({...notifications, [item.key]: v})} />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label>Pickup Reminder (hours before)</Label>
                  <Input type="number" value={notifications.reminderHoursBefore} onChange={e => setNotifications({...notifications, reminderHoursBefore: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Feedback Request Delay (mins after trip)</Label>
                  <Input type="number" value={notifications.feedbackRequestDelay} onChange={e => setNotifications({...notifications, feedbackRequestDelay: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end"><Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={() => handleSave("Notifications")}><Save />Save Changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
