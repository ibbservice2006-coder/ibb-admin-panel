import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Link2, Copy, Plus, TrendingUp, MousePointer, ShoppingCart, DollarSign, Search, ExternalLink } from 'lucide-react'

const affiliateLinks = [
  { id: 'AFL001', partnerId: 'P001', partnerName: 'Somsak Wongdee', type: 'individual',
    code: 'SOMSAK2024', url: 'https://ibbservice.com/?ref=SOMSAK2024',
    clicks: 248, conversions: 48, revenue: 240000, convRate: 19.4,
    createdDate: '2024-01-15', lastClick: '2024-03-24', status: 'active' },
  { id: 'AFL002', partnerId: 'P002', partnerName: 'Amazing Thailand Tours', type: 'company',
    code: 'AMAZINGTOUR', url: 'https://ibbservice.com/?ref=AMAZINGTOUR',
    clicks: 1560, conversions: 312, revenue: 1560000, convRate: 20.0,
    createdDate: '2023-08-20', lastClick: '2024-03-24', status: 'active' },
  { id: 'AFL003', partnerId: 'P003', partnerName: 'Napa Loves Traveling', type: 'individual',
    code: 'NAPA_TRAVEL', url: 'https://ibbservice.com/?ref=NAPA_TRAVEL',
    clicks: 892, conversions: 22, revenue: 110000, convRate: 2.5,
    createdDate: '2024-02-10', lastClick: '2024-03-23', status: 'active' },
  { id: 'AFL004', partnerId: 'P004', partnerName: 'Pattaya Beach Hotel Group', type: 'company',
    code: 'PATTAYABCH', url: 'https://ibbservice.com/?ref=PATTAYABCH',
    clicks: 742, conversions: 198, revenue: 990000, convRate: 26.7,
    createdDate: '2023-11-05', lastClick: '2024-03-24', status: 'active' },
  { id: 'AFL005', partnerId: 'P007', partnerName: 'Hua Hin Travel Agency', type: 'company',
    code: 'HUAHINTRV', url: 'https://ibbservice.com/?ref=HUAHINTRV',
    clicks: 435, conversions: 87, revenue: 435000, convRate: 20.0,
    createdDate: '2023-09-15', lastClick: '2024-03-22', status: 'active' },
]

const platformAffiliates = [
  { platform: 'Shopee', logo: 'https://www.google.com/s2/favicons?domain=shopee.co.th&sz=32',
    status: 'active', clicks: 8420, conversions: 542, revenue: 2710000, note: 'Managed via Shopee Affiliate Dashboard' },
  { platform: 'Lazada', logo: 'https://www.google.com/s2/favicons?domain=lazada.co.th&sz=32',
    status: 'active', clicks: 4870, conversions: 287, revenue: 1435000, note: 'Managed via Lazada Affiliate Dashboard' },
  { platform: 'Amazon', logo: 'https://www.google.com/s2/favicons?domain=amazon.com&sz=32',
    status: 'pending', clicks: 120, conversions: 8, revenue: 40000, note: 'Awaiting approval from Amazon Associates' },
]

const typeColor = {
  individual: 'bg-blue-100 text-blue-700',
  company: 'bg-purple-100 text-purple-700',
}

export default function AffiliateLinks() {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({ partnerName: '', type: 'individual', code: '' })

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const filtered = affiliateLinks.filter(l =>
    l.partnerName.toLowerCase().includes(search.toLowerCase()) ||
    l.code.toLowerCase().includes(search.toLowerCase())
  )

  const totalClicks = affiliateLinks.reduce((a, l) => a + l.clicks, 0)
  const totalConversions = affiliateLinks.reduce((a, l) => a + l.conversions, 0)
  const totalRevenue = affiliateLinks.reduce((a, l) => a + l.revenue, 0)
  const avgConvRate = (totalConversions / totalClicks * 100).toFixed(1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-green-100 border border-green-200">
            <Link2 className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Affiliate Links</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Manage Tracking Links & monitor each Partner's Conversion</p>
          </div>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-3.5 w-3.5 mr-1" />Create new link
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Clicks', value: totalClicks.toLocaleString(), icon: MousePointer, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Conversions', value: totalConversions.toLocaleString(), icon: ShoppingCart, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Revenue', value: `฿${(totalRevenue / 1000000).toFixed(1)}M`, icon: DollarSign, color: 'text-purple-700', bg: 'bg-purple-50' },
          { label: 'Avg Conv. Rate', value: `${avgConvRate}%`, icon: TrendingUp, color: 'text-orange-700', bg: 'bg-orange-50' },
        ].map(s => (
          <Card key={s.label} className={`${s.bg} border-0`}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
                <s.icon className={`h-6 w-6 ${s.color} opacity-60`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* IBB Partner Links */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Link2 className="h-4 w-4 text-green-600" />IBB Partner Affiliate Links
            </CardTitle>
            <div className="relative w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input className="pl-8 h-8 text-xs" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="text-left py-2 font-medium">Partner</th>
                  <th className="text-left py-2 font-medium">Code / URL</th>
                  <th className="text-right py-2 font-medium">Clicks</th>
                  <th className="text-right py-2 font-medium">Conversions</th>
                  <th className="text-right py-2 font-medium">Conv. Rate</th>
                  <th className="text-right py-2 font-medium">Revenue</th>
                  <th className="text-right py-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(link => (
                  <tr key={link.id} className="border-b hover:bg-gray-50">
                    <td className="py-2.5">
                      <div>
                        <p className="font-medium text-xs">{link.partnerName}</p>
                        <Badge className={`text-xs mt-0.5 ${typeColor[link.type]}`}>{link.type}</Badge>
                      </div>
                    </td>
                    <td className="py-2.5">
                      <div>
                        <p className="font-mono text-xs font-bold text-green-700">{link.code}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-48">{link.url}</p>
                      </div>
                    </td>
                    <td className="py-2.5 text-right text-xs font-medium">{link.clicks.toLocaleString()}</td>
                    <td className="py-2.5 text-right text-xs font-medium text-green-700">{link.conversions}</td>
                    <td className="py-2.5 text-right text-xs">
                      <span className={`font-medium ${link.convRate > 15 ? 'text-green-700' : link.convRate > 5 ? 'text-yellow-700' : 'text-red-600'}`}>
                        {link.convRate}%
                      </span>
                    </td>
                    <td className="py-2.5 text-right text-xs font-bold">฿{(link.revenue / 1000).toFixed(0)}K</td>
                    <td className="py-2.5 text-right">
                      <Button
                        variant="outline" size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => handleCopy(link.url, link.id)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        {copied === link.id ? 'Copied!' : 'Copy'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Public Platform Affiliates */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-orange-600" />Public Platform Affiliates
            <Badge className="text-xs bg-orange-100 text-orange-700 ml-1">Managed by Platform</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-4">IBB does not run Affiliate system for these platforms — manage via each platform’s dashboard</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {platformAffiliates.map(pf => (
              <div key={pf.platform} className="border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <img src={pf.logo} alt={pf.platform} className="w-6 h-6 rounded" onError={e => e.target.style.display = 'none'} />
                  <span className="font-semibold text-sm">{pf.platform}</span>
                  <Badge className={`text-xs ml-auto ${pf.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {pf.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-center mb-2">
                  <div className="bg-blue-50 rounded p-1.5">
                    <p className="font-bold text-blue-700">{(pf.clicks / 1000).toFixed(1)}K</p>
                    <p className="text-muted-foreground">Clicks</p>
                  </div>
                  <div className="bg-green-50 rounded p-1.5">
                    <p className="font-bold text-green-700">{pf.conversions}</p>
                    <p className="text-muted-foreground">Conv.</p>
                  </div>
                  <div className="bg-purple-50 rounded p-1.5">
                    <p className="font-bold text-purple-700">฿{(pf.revenue / 1000000).toFixed(1)}M</p>
                    <p className="text-muted-foreground">Revenue</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{pf.note}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Add Affiliate Link Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create new Affiliate Link</DialogTitle>
            <DialogDescription>Create Tracking Link for Partner</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Partner Name *</Label>
              <Input placeholder="Partner or Company Name" value={addForm.partnerName}
                onChange={e => setAddForm({...addForm, partnerName: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={addForm.type} onValueChange={v => setAddForm({...addForm, type: v})}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Referral Code *</Label>
              <Input placeholder="e.g. PARTNER2024" value={addForm.code}
                onChange={e => setAddForm({...addForm, code: e.target.value.toUpperCase()})} className="mt-1" />
              <p className="text-xs text-muted-foreground mt-1">URL: https://ibbservice.com/?ref={addForm.code || 'CODE'}</p>
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => {
              if (!addForm.partnerName || !addForm.code) { toast({ title: 'Error', description: 'Partner name and code are required', variant: 'destructive' }); return }
              setIsAddOpen(false)
              setAddForm({ partnerName: '', type: 'individual', code: '' })
              toast({ title: 'Affiliate Link Created', description: `https://ibbservice.com/?ref=${addForm.code}` })
            }}>Create Link</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
