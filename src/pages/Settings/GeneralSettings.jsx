import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Settings, Globe, Clock, Bell, Shield, Save, RefreshCw, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function GeneralSettings() {
  const { toast } = useToast()
  const [saved, setSaved] = useState(false)

  const [general, setGeneral] = useState({
    siteName: "IBB Shuttle Service",
    siteUrl: "https://ibbshuttle.com",
    adminEmail: "admin@ibbshuttle.com",
    supportEmail: "support@ibbshuttle.com",
    timezone: "Asia/Bangkok",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    defaultLanguage: "th",
    defaultCurrency: "THB",
    itemsPerPage: "20",
  })

  const [notifications, setNotifications] = useState({
    emailBookingConfirm: true,
    emailBookingCancel: true,
    emailDriverAssign: true,
    smsBookingConfirm: true,
    smsDriverArrival: true,
    pushNewBooking: true,
    pushPaymentReceived: true,
    adminDailyReport: true,
    adminWeeklyReport: true,
  })

  const [security, setSecurity] = useState({
    sessionTimeout: "60",
    maxLoginAttempts: "5",
    twoFactorRequired: false,
    ipWhitelist: false,
    passwordMinLength: "8",
    passwordExpiry: "90",
    auditLogRetention: "365",
  })

  const [maintenance, setMaintenance] = useState({
    maintenanceMode: false,
    maintenanceMessage: "We are currently performing scheduled maintenance. We will be back shortly.",
    debugMode: false,
    cacheEnabled: true,
    logLevel: "error",
  })

  const handleSave = (section) => {
    setSaved(true)
    toast({ title: "Settings Saved", description: section + " settings have been updated successfully." })
    setTimeout(() => setSaved(false), 3000)
  }

  const stats = [
    { title: "System Version", value: "v2.4.1", icon: Settings, bgColor: "bg-blue-100", iconColor: "text-blue-600" },
    { title: "Timezone", value: "UTC+7", icon: Clock, bgColor: "bg-green-100", iconColor: "text-green-600" },
    { title: "Active Sessions", value: "8", icon: Shield, bgColor: "bg-purple-100", iconColor: "text-purple-600" },
    { title: "Notifications", value: "Enabled", icon: Bell, bgColor: "bg-orange-100", iconColor: "text-orange-600" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">General Settings</h1>
          <p className="text-muted-foreground">System-wide configuration and preferences</p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
          <CheckCircle className="mr-1 h-3 w-3" /> System Online
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={"p-2 rounded-lg " + stat.bgColor}><stat.icon className={"h-4 w-4 " + stat.iconColor} /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> Site Configuration</CardTitle>
              <CardDescription>Basic site information and regional settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Site Name</Label>
                  <Input value={general.siteName} onChange={e => setGeneral({...general, siteName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Site URL</Label>
                  <Input value={general.siteUrl} onChange={e => setGeneral({...general, siteUrl: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Admin Email</Label>
                  <Input value={general.adminEmail} onChange={e => setGeneral({...general, adminEmail: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input value={general.supportEmail} onChange={e => setGeneral({...general, supportEmail: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={general.timezone} onValueChange={v => setGeneral({...general, timezone: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Bangkok">Asia/Bangkok (UTC+7)</SelectItem>
                      <SelectItem value="Asia/Singapore">Asia/Singapore (UTC+8)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo (UTC+9)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (UTC+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select value={general.dateFormat} onValueChange={v => setGeneral({...general, dateFormat: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default Language</Label>
                  <Select value={general.defaultLanguage} onValueChange={v => setGeneral({...general, defaultLanguage: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="th">Thai</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                      <SelectItem value="ko">한국어</SelectItem>
                      <SelectItem value="ru">Русский</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Select value={general.defaultCurrency} onValueChange={v => setGeneral({...general, defaultCurrency: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="THB">THB — Thai Baht</SelectItem>
                      <SelectItem value="USD">USD — US Dollar</SelectItem>
                      <SelectItem value="CNY">CNY — Chinese Yuan</SelectItem>
                      <SelectItem value="EUR">EUR — Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Items Per Page</Label>
                  <Select value={general.itemsPerPage} onValueChange={v => setGeneral({...general, itemsPerPage: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={() => handleSave("General")}><Save />Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> Notification Preferences</CardTitle>
              <CardDescription>Configure when and how notifications are sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">Email Notifications</h4>
                <div className="space-y-3">
                  {[
                    { key: "emailBookingConfirm", label: "Booking Confirmation", desc: "Send email when booking is confirmed" },
                    { key: "emailBookingCancel", label: "Booking Cancellation", desc: "Send email when booking is cancelled" },
                    { key: "emailDriverAssign", label: "Driver Assignment", desc: "Send email when driver is assigned" },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch checked={notifications[item.key]} onCheckedChange={v => setNotifications({...notifications, [item.key]: v})} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">SMS Notifications</h4>
                <div className="space-y-3">
                  {[
                    { key: "smsBookingConfirm", label: "Booking Confirmation SMS", desc: "Send SMS when booking is confirmed" },
                    { key: "smsDriverArrival", label: "Driver Arrival Alert", desc: "Send SMS when driver is 5 min away" },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch checked={notifications[item.key]} onCheckedChange={v => setNotifications({...notifications, [item.key]: v})} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">Admin Reports</h4>
                <div className="space-y-3">
                  {[
                    { key: "adminDailyReport", label: "Daily Summary Report", desc: "Receive daily booking & revenue summary" },
                    { key: "adminWeeklyReport", label: "Weekly Analytics Report", desc: "Receive weekly performance analytics" },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch checked={notifications[item.key]} onCheckedChange={v => setNotifications({...notifications, [item.key]: v})} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={() => handleSave("Notification")}><Save />Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Security Configuration</CardTitle>
              <CardDescription>Authentication, session, and access control settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input type="number" value={security.sessionTimeout} onChange={e => setSecurity({...security, sessionTimeout: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Max Login Attempts</Label>
                  <Input type="number" value={security.maxLoginAttempts} onChange={e => setSecurity({...security, maxLoginAttempts: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Min Password Length</Label>
                  <Input type="number" value={security.passwordMinLength} onChange={e => setSecurity({...security, passwordMinLength: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Password Expiry (days)</Label>
                  <Input type="number" value={security.passwordExpiry} onChange={e => setSecurity({...security, passwordExpiry: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Audit Log Retention (days)</Label>
                  <Input type="number" value={security.auditLogRetention} onChange={e => setSecurity({...security, auditLogRetention: e.target.value})} />
                </div>
              </div>
              <div className="space-y-3 pt-2">
                {[
                  { key: "twoFactorRequired", label: "Require Two-Factor Authentication", desc: "All admin users must enable 2FA" },
                  { key: "ipWhitelist", label: "IP Whitelist", desc: "Restrict admin access to specific IP addresses" },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch checked={security[item.key]} onCheckedChange={v => setSecurity({...security, [item.key]: v})} />
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={() => handleSave("Security")}><Save />Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><RefreshCw className="h-5 w-5" /> Maintenance & System</CardTitle>
              <CardDescription>System maintenance mode and developer options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { key: "maintenanceMode", label: "Maintenance Mode", desc: "Show maintenance page to all visitors", danger: true },
                  { key: "debugMode", label: "Debug Mode", desc: "Enable detailed error logging (not for production)", danger: true },
                  { key: "cacheEnabled", label: "Cache Enabled", desc: "Enable system-wide caching for better performance" },
                ].map(item => (
                  <div key={item.key} className={"flex items-center justify-between py-3 px-4 rounded-lg border " + (item.danger && maintenance[item.key] ? "border-red-200 bg-red-50" : "border-border")}>
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch checked={maintenance[item.key]} onCheckedChange={v => setMaintenance({...maintenance, [item.key]: v})} />
                  </div>
                ))}
              </div>
              {maintenance.maintenanceMode && (
                <div className="space-y-2">
                  <Label>Maintenance Message</Label>
                  <textarea
                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={maintenance.maintenanceMessage}
                    onChange={e => setMaintenance({...maintenance, maintenanceMessage: e.target.value})}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>Log Level</Label>
                <Select value={maintenance.logLevel} onValueChange={v => setMaintenance({...maintenance, logLevel: v})}>
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debug">Debug (Verbose)</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => handleSave("Maintenance")} variant={maintenance.maintenanceMode ? "destructive" : "default"}>
                  <Save className="mr-2 h-4 w-4" />Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
