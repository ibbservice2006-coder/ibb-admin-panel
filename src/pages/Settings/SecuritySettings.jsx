import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Eye, AlertTriangle, Save, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SecuritySettings() {
  const { toast } = useToast()

  const [auth, setAuth] = useState({
    mfaRequired: true,
    mfaMethod: "totp",
    sessionTimeoutMins: "60",
    maxActiveSessions: "3",
    rememberDeviceDays: "30",
    passwordMinLength: "8",
    passwordRequireUppercase: true,
    passwordRequireNumber: true,
    passwordRequireSymbol: true,
    passwordExpiryDays: "90",
    maxLoginAttempts: "5",
    lockoutDurationMins: "30",
  })

  const [audit, setAudit] = useState({
    logAllActions: true,
    logLoginAttempts: true,
    logDataExports: true,
    logPaymentActions: true,
    retentionDays: "365",
    alertOnSuspiciousLogin: true,
    alertOnBulkExport: true,
  })

  const [ip, setIp] = useState({
    ipWhitelistEnabled: false,
    allowedIPs: "203.0.113.0/24\n198.51.100.0/24",
    blockTorExits: true,
    blockVPNs: false,
    geoBlockEnabled: false,
    allowedCountries: "TH,SG,MY,JP,CN,US,GB",
  })

  const recentActivity = [
    { action: "Login", user: "admin@ibb.com", ip: "203.0.113.1", time: "2 mins ago", status: "success" },
    { action: "Export Bookings CSV", user: "manager@ibb.com", ip: "203.0.113.5", time: "1 hour ago", status: "success" },
    { action: "Failed Login", user: "unknown", ip: "45.33.32.156", time: "3 hours ago", status: "failed" },
    { action: "Password Changed", user: "staff@ibb.com", ip: "203.0.113.10", time: "1 day ago", status: "success" },
    { action: "2FA Disabled", user: "ops@ibb.com", ip: "203.0.113.8", time: "2 days ago", status: "warning" },
  ]

  const handleSave = (s) => toast({ title: "Saved", description: s + " settings updated." })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Settings</h1>
        <p className="text-muted-foreground">Authentication, audit logs, and access control</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "MFA Status", value: "Enabled", icon: Shield, bg: "bg-green-100", ic: "text-green-600" },
          { label: "Session Timeout", value: "60 mins", icon: Clock, bg: "bg-blue-100", ic: "text-blue-600" },
          { label: "Password Policy", value: "Strong", icon: Lock, bg: "bg-purple-100", ic: "text-purple-600" },
          { label: "Audit Log", value: "365 days", icon: Eye, bg: "bg-yellow-100", ic: "text-yellow-600" },
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5" /> Authentication</CardTitle>
            <CardDescription>Login security and session management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Session Timeout (mins)</Label>
                <Input type="number" value={auth.sessionTimeoutMins} onChange={e => setAuth({...auth, sessionTimeoutMins: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Max Active Sessions</Label>
                <Input type="number" value={auth.maxActiveSessions} onChange={e => setAuth({...auth, maxActiveSessions: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Remember Device (days)</Label>
                <Input type="number" value={auth.rememberDeviceDays} onChange={e => setAuth({...auth, rememberDeviceDays: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>MFA Method</Label>
                <Select value={auth.mfaMethod} onValueChange={v => setAuth({...auth, mfaMethod: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="totp">TOTP (Google Auth)</SelectItem>
                    <SelectItem value="sms">SMS OTP</SelectItem>
                    <SelectItem value="email">Email OTP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Max Login Attempts</Label>
                <Input type="number" value={auth.maxLoginAttempts} onChange={e => setAuth({...auth, maxLoginAttempts: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Lockout Duration (mins)</Label>
                <Input type="number" value={auth.lockoutDurationMins} onChange={e => setAuth({...auth, lockoutDurationMins: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between py-2 border-b">
                <div><p className="text-sm font-medium">Require MFA for All Admins</p><p className="text-xs text-muted-foreground">All admin accounts must use 2FA</p></div>
                <Switch checked={auth.mfaRequired} onCheckedChange={v => setAuth({...auth, mfaRequired: v})} />
              </div>
            </div>
            <div className="flex justify-end"><Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={() => handleSave("Authentication")}><Save />Save</Button></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5" /> Password Policy</CardTitle>
            <CardDescription>Password strength requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Min. Password Length</Label>
                <Input type="number" value={auth.passwordMinLength} onChange={e => setAuth({...auth, passwordMinLength: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Password Expiry (days)</Label>
                <Input type="number" value={auth.passwordExpiryDays} onChange={e => setAuth({...auth, passwordExpiryDays: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              {[
                { key: "passwordRequireUppercase", label: "Require Uppercase Letter" },
                { key: "passwordRequireNumber", label: "Require Number" },
                { key: "passwordRequireSymbol", label: "Require Special Symbol" },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-2 border-b last:border-0">
                  <p className="text-sm font-medium">{item.label}</p>
                  <Switch checked={auth[item.key]} onCheckedChange={v => setAuth({...auth, [item.key]: v})} />
                </div>
              ))}
            </div>
            <div className="flex justify-end"><Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={() => handleSave("Password Policy")}><Save />Save</Button></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5" /> Audit Logs</CardTitle>
            <CardDescription>What actions are logged and for how long</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Log Retention (days)</Label>
              <Input type="number" value={audit.retentionDays} onChange={e => setAudit({...audit, retentionDays: e.target.value})} />
            </div>
            <div className="space-y-2">
              {[
                { key: "logAllActions", label: "Log All Admin Actions" },
                { key: "logLoginAttempts", label: "Log Login Attempts" },
                { key: "logDataExports", label: "Log Data Exports" },
                { key: "logPaymentActions", label: "Log Payment Actions" },
                { key: "alertOnSuspiciousLogin", label: "Alert on Suspicious Login" },
                { key: "alertOnBulkExport", label: "Alert on Bulk Export" },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-1.5 border-b last:border-0">
                  <p className="text-sm font-medium">{item.label}</p>
                  <Switch checked={audit[item.key]} onCheckedChange={v => setAudit({...audit, [item.key]: v})} />
                </div>
              ))}
            </div>
            <div className="flex justify-end"><Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={() => handleSave("Audit Logs")}><Save />Save</Button></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> IP & Access Control</CardTitle>
            <CardDescription>IP whitelist and geo-blocking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {[
                { key: "ipWhitelistEnabled", label: "Enable IP Whitelist", desc: "Only allow listed IPs" },
                { key: "blockTorExits", label: "Block Tor Exit Nodes", desc: "Block anonymous Tor traffic" },
                { key: "blockVPNs", label: "Block VPN Traffic", desc: "Block known VPN IP ranges" },
                { key: "geoBlockEnabled", label: "Enable Geo-Blocking", desc: "Restrict access by country" },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-1.5 border-b last:border-0">
                  <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                  <Switch checked={ip[item.key]} onCheckedChange={v => setIp({...ip, [item.key]: v})} />
                </div>
              ))}
            </div>
            {ip.ipWhitelistEnabled && (
              <div className="space-y-2">
                <Label>Allowed IPs / CIDR Ranges</Label>
                <textarea className="w-full h-24 text-sm border rounded-md p-2 font-mono resize-none"
                  value={ip.allowedIPs} onChange={e => setIp({...ip, allowedIPs: e.target.value})} />
              </div>
            )}
            <div className="flex justify-end"><Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={() => handleSave("IP Control")}><Save />Save</Button></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Security Activity</CardTitle>
          <CardDescription>Last 5 security-related events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <Badge variant={a.status === "success" ? "default" : a.status === "failed" ? "destructive" : "secondary"}>
                    {a.status}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">{a.action}</p>
                    <p className="text-xs text-muted-foreground">{a.user} · {a.ip}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
