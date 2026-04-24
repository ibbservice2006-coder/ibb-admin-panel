import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { User, Building2, Globe, Phone, Mail, Calendar, FileText, TrendingUp, DollarSign, Star, ChevronRight } from 'lucide-react'

const partnerProfile = {
  id: 'P002',
  name: 'Amazing Thailand Tours Co., Ltd.',
  type: 'company',
  category: 'Tour Company',
  status: 'active',
  tier: 'Gold',
  joinDate: '2023-08-20',
  contractExpiry: '2025-08-19',
  feeRate: '5%',
  feeType: 'commission',
  rating: 4.9,
  totalReferrals: 312,
  totalRevenue: 1560000,
  paidCommission: 62400,
  pendingCommission: 78000,
  contact: {
    name: 'Khun Sommai, very good',
    phone: '+66-2-123-4567',
    email: 'info@amazingthaitours.com',
    lineId: '@amazingthaitours',
    address: '123 Sukhumvit Rd, Bangkok 10110',
  },
  topRoutes: [
    { route: 'BKK → Pattaya', bookings: 142, revenue: 710000 },
    { route: 'BKK → Hua Hin', bookings: 98, revenue: 490000 },
    { route: 'DMK → Pattaya', bookings: 72, revenue: 360000 },
  ],
  recentBookings: [
    { ref: 'IBB-2024-0891', date: '2024-03-24', route: 'BKK → Pattaya', amount: 5000, status: 'completed' },
    { ref: 'IBB-2024-0882', date: '2024-03-23', route: 'BKK → Hua Hin', amount: 7000, status: 'completed' },
    { ref: 'IBB-2024-0875', date: '2024-03-22', route: 'DMK → Pattaya', amount: 4500, status: 'completed' },
    { ref: 'IBB-2024-0868', date: '2024-03-21', route: 'BKK → Kanchanaburi', amount: 6500, status: 'completed' },
    { ref: 'IBB-2024-0860', date: '2024-03-20', route: 'BKK → Pattaya', amount: 5000, status: 'cancelled' },
  ],
  monthlyRevenue: [
    { month: 'Oct', revenue: 95000 }, { month: 'Nov', revenue: 112000 }, { month: 'Dec', revenue: 145000 },
    { month: 'Jan', revenue: 128000 }, { month: 'Feb', revenue: 138000 }, { month: 'Mar', revenue: 162000 },
  ],
}

const statusColor = {
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
}

const tierColor = {
  Bronze: 'bg-amber-100 text-amber-700',
  Silver: 'bg-gray-100 text-gray-600',
  Gold: 'bg-yellow-100 text-yellow-700',
  Platinum: 'bg-purple-100 text-purple-700',
}

export default function PartnerProfiles() {
  const { toast } = useToast()
  const [isContractOpen, setIsContractOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    name: partnerProfile.name,
    category: partnerProfile.category,
    tier: partnerProfile.tier,
    feeRate: partnerProfile.feeRate,
    contactName: partnerProfile.contact.name,
    phone: partnerProfile.contact.phone,
    email: partnerProfile.contact.email,
  })
  const p = partnerProfile

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-100 border border-purple-200">
            <Building2 className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Partner Profile</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Partner Booking details and history</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsContractOpen(true)}>
            <FileText className="h-3.5 w-3.5 mr-1" />ViewContract
          </Button>
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setIsEditOpen(true)}>Edit Information</Button>
        </div>
      </div>

      {/* Profile Header */}
      <Card className="border-purple-100">
        <CardContent className="pt-5 pb-5">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{p.name}</h2>
                <p className="text-muted-foreground text-sm">{p.category}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`text-xs ${tierColor[p.tier]}`}>{p.tier} Partner</Badge>
                  <Badge className="text-xs bg-green-100 text-green-700">{p.status}</Badge>
                  <span className="flex items-center gap-1 text-xs text-yellow-600">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />{p.rating}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Total Bookings', value: p.totalReferrals, color: 'text-gray-700', bg: 'bg-gray-50' },
                { label: 'Total Revenue', value: `฿${(p.totalRevenue / 1000).toFixed(0)}K`, color: 'text-green-700', bg: 'bg-green-50' },
                { label: 'Paid Commission', value: `฿${(p.paidCommission / 1000).toFixed(0)}K`, color: 'text-blue-700', bg: 'bg-blue-50' },
                { label: 'Pending', value: `฿${(p.pendingCommission / 1000).toFixed(0)}K`, color: 'text-red-700', bg: 'bg-red-50' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
                  <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info */}
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-purple-600" />Contact info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{p.contact.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{p.contact.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs">{p.contact.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{p.contact.lineId}</span>
            </div>
            <div className="pt-2 border-t text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Contract</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>Start: {p.joinDate}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-3 w-3" />
                <span>Expired: {p.contractExpiry}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <DollarSign className="h-3 w-3" />
                <span>Commission Rate: {p.feeRate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Routes */}
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />RouteTotalPopular
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {p.topRoutes.map((r, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                  <div>
                    <p className="font-medium text-xs">{r.route}</p>
                    <p className="text-xs text-muted-foreground">{r.bookings} bookings</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-green-700">฿{(r.revenue / 1000).toFixed(0)}K</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />Revenue 6 Last month
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {p.monthlyRevenue.map((m, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="w-8 text-muted-foreground">{m.month}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${(m.revenue / Math.max(...p.monthlyRevenue.map(x => x.revenue))) * 100}%` }}
                  />
                </div>
                <span className="w-16 text-right font-medium">฿{(m.revenue / 1000).toFixed(0)}K</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-600" />Bookings Latest
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="text-left py-2 font-medium">Booking Ref</th>
                  <th className="text-left py-2 font-medium">Date</th>
                  <th className="text-left py-2 font-medium">Route</th>
                  <th className="text-right py-2 font-medium">Total</th>
                  <th className="text-right py-2 font-medium">Commission (5%)</th>
                  <th className="text-right py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {p.recentBookings.map(b => (
                  <tr key={b.ref} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-mono text-xs">{b.ref}</td>
                    <td className="py-2 text-xs text-muted-foreground">{b.date}</td>
                    <td className="py-2 text-xs">{b.route}</td>
                    <td className="py-2 text-right text-xs font-medium">฿{b.amount.toLocaleString()}</td>
                    <td className="py-2 text-right text-xs font-medium text-green-700">
                      {b.status === 'completed' ? `฿${(b.amount * 0.05).toLocaleString()}` : '—'}
                    </td>
                    <td className="py-2 text-right">
                      <Badge className={`text-xs ${statusColor[b.status]}`}>{b.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {/* Contract Dialog */}
      <Dialog open={isContractOpen} onOpenChange={setIsContractOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Partner Contract</DialogTitle>
            <DialogDescription>{p.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-muted-foreground text-xs">Contract Number</Label><p className="font-medium">IBB-CON-{p.id}-2023</p></div>
              <div><Label className="text-muted-foreground text-xs">Type</Label><p className="font-medium">Commission Agreement</p></div>
              <div><Label className="text-muted-foreground text-xs">Start Date</Label><p className="font-medium">{p.joinDate}</p></div>
              <div><Label className="text-muted-foreground text-xs">Expiration Date</Label><p className="font-medium text-orange-600">{p.contractExpiry}</p></div>
              <div><Label className="text-muted-foreground text-xs">Commission Rate</Label><p className="font-medium">{p.feeRate}</p></div>
              <div><Label className="text-muted-foreground text-xs">Type</Label><p className="font-medium capitalize">{p.feeType}</p></div>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Terms &amp; Conditions</p>
              <p className="text-xs mt-1">Contract parties agree on commission {p.feeRate} From total sales of all successful bookings, paid monthly. This contract covers bookings via all channels of IBB Shuttle</p>
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button size="sm" variant="outline" onClick={() => setIsContractOpen(false)}>Close</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
              const contractNo = `IBB-CON-${p.id}-2024`
              const printWin = window.open('', '_blank', 'width=800,height=600')
              if (printWin) {
                printWin.document.write(`<html><head><title>${contractNo}</title><style>body{font-family:sans-serif;padding:40px;max-width:700px;margin:0 auto}h2{color:#1a1a2e}.header{border-bottom:2px solid #333;padding-bottom:20px;margin-bottom:20px}.row{display:flex;justify-content:space-between;margin:8px 0;font-size:14px}.terms{background:#f5f5f5;padding:16px;border-radius:8px;margin-top:20px;font-size:13px}@media print{button{display:none}}</style></head><body><div class='header'><h2>IBB Shuttle Service</h2><p>Partner Contract: ${contractNo}</p></div><div class='row'><b>Partner Name:</b><span>${p.name}</span></div><div class='row'><b>Category:</b><span>${p.category}</span></div><div class='row'><b>Tier:</b><span>${p.tier}</span></div><div class='row'><b>Fee Rate:</b><span>${p.feeRate}</span></div><div class='row'><b>Contract Start:</b><span>${p.joinDate}</span></div><div class='row'><b>Contract Expiry:</b><span>${p.contractExpiry}</span></div><div class='terms'><b>Terms &amp; Conditions</b><br/><br/>Contract parties agree on commission ${p.feeRate} From total sales of all successful bookings, paid monthly. This contract covers bookings via all channels of IBB Shuttle</div><script>window.onload=function(){window.print();window.close()}<\/script></body></html>`)
                printWin.document.close()
              }
              toast({ title: 'Open Print Dialog', description: `Select "Save as PDF" to save ${contractNo}` })
              setIsContractOpen(false)
            }}>Download PDF</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Partner Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Information Partner</DialogTitle>
            <DialogDescription>Update data {p.name}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Company/Partner name</Label>
              <Input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Business type</Label>
              <Input value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Partner Tier</Label>
              <Select value={editForm.tier} onValueChange={v => setEditForm({...editForm, tier: v})}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bronze">Bronze</SelectItem>
                  <SelectItem value="Silver">Silver</SelectItem>
                  <SelectItem value="Gold">Gold</SelectItem>
                  <SelectItem value="Platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Commission Rate</Label>
              <Input placeholder="5%" value={editForm.feeRate} onChange={e => setEditForm({...editForm, feeRate: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Contact name</Label>
              <Input value={editForm.contactName} onChange={e => setEditForm({...editForm, contactName: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label>Email</Label>
              <Input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="mt-1" />
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
              setIsEditOpen(false)
              toast({ title: 'Partner Updated', description: `${editForm.name} updated successfully` })
            }}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
