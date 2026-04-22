import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Users, Search, Download, Eye, TrendingUp, Building2, Briefcase, FileText, Globe } from 'lucide-react'

const members = [
  { id: 'BP-0001', name: 'Thai Oil Public Company Limited',     contact: 'Khun Somsak Wongthong',   email: 'corp@thaioil.com',     phone: '02-111-2222', joined: '2022-06-01', bookings: 842, spent: 12480000, status: 'active',   contract: 'Annual', apiAccess: true,  creditLimit: 500000 },
  { id: 'BP-0002', name: 'Grand Hyatt Bangkok Hotel',       contact: 'Khun Wipa Srisombat',    email: 'transport@grandhyatt.com', phone: '02-222-3333', joined: '2022-08-15', bookings: 1240, spent: 18600000, status: 'active',   contract: 'Annual', apiAccess: true,  creditLimit: 800000 },
  { id: 'BP-0003', name: 'CP All Public Company Limited',   contact: 'Khun Prasit Deengam',   email: 'fleet@cpall.co.th',    phone: '02-333-4444', joined: '2022-10-20', bookings: 2180, spent: 32700000, status: 'active',   contract: 'Annual', apiAccess: true,  creditLimit: 1500000 },
  { id: 'BP-0004', name: 'U.S. Embassy in Thailand', contact: 'Mr. John Smith',        email: 'transport@usembassy.th', phone: '02-444-5555', joined: '2023-01-10', bookings: 456, spent: 8240000,  status: 'active',   contract: 'Annual', apiAccess: false, creditLimit: 300000 },
  { id: 'BP-0005', name: 'Bumrungrad International Hospital', contact: 'Khun Napa Raksong',   email: 'vip@bumrungrad.com',   phone: '02-555-6666', joined: '2023-03-05', bookings: 678, spent: 9870000,  status: 'active',   contract: 'Monthly', apiAccess: true,  creditLimit: 400000 },
  { id: 'BP-0006', name: 'PTT Public Company Limited',          contact: 'Khun Thana Charoensuk',      email: 'fleet@ptt.co.th',      phone: '02-666-7777', joined: '2023-05-18', bookings: 1560, spent: 23400000, status: 'active',   contract: 'Annual', apiAccess: true,  creditLimit: 1000000 },
  { id: 'BP-0007', name: 'True Corporation Co., Ltd.',     contact: 'Khun Suda Prasert',     email: 'corp@true.th',         phone: '02-777-8888', joined: '2023-07-22', bookings: 324, spent: 4860000,  status: 'inactive', contract: 'Monthly', apiAccess: false, creditLimit: 200000 },
  { id: 'BP-0008', name: 'Airports of Thailand (AOT)',             contact: 'Khun Chaiwat Deengam',   email: 'transport@airportthai.co.th', phone: '02-888-9999', joined: '2023-09-14', bookings: 2840, spent: 42600000, status: 'active', contract: 'Annual', apiAccess: true,  creditLimit: 2000000 },
]

const contractColors = {
  Annual:  'bg-green-100 text-green-700 border-green-200',
  Monthly: 'bg-blue-100 text-blue-700 border-blue-200',
}

export default function BusinessPartnerMembers() {
  const { toast } = useToast()
  const handleExport = () => {
    const rows = [['#', 'Data', 'Value', 'Date']]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ibb_export.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: 'Exported', description: 'CSV downloaded successfully' })
  }
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = members.filter(m => {
    const matchSearch = m.name.includes(search) || m.email.toLowerCase().includes(search.toLowerCase()) || m.id.includes(search) || m.contact.includes(search)
    const matchStatus = statusFilter === 'all' || m.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = {
    total: members.length,
    active: members.filter(m => m.status === 'active').length,
    totalSpent: members.reduce((s, m) => s + m.spent, 0),
    apiEnabled: members.filter(m => m.apiAccess).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-green-100 border border-green-200">
            <Briefcase className="h-6 w-6 text-green-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Business Partner Members</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Tier 4 — Corporate Rates · Bulk Booking · Custom Contracts · API Access</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>

      {/* Tier Badge */}
      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-green-700" />
          <span className="font-semibold text-green-800">Business Partner</span>
          <Badge className="text-xs bg-green-700 text-white border-0">Tier 4</Badge>
        </div>
        <div className="h-4 w-px bg-green-300" />
        <span className="text-sm text-green-800">Rates: <strong>Corporate</strong></span>
        <div className="h-4 w-px bg-green-300" />
        <span className="text-sm text-green-800">Booking: <strong>Bulk / Custom</strong></span>
        <div className="h-4 w-px bg-green-300" />
        <span className="text-sm text-green-800">Contract: <strong>Custom SLA</strong></span>
        <div className="h-4 w-px bg-green-300" />
        <span className="text-sm text-green-800">API: <strong>Available</strong></span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50"><Building2 className="h-5 w-5 text-green-700" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Total Partners</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50"><TrendingUp className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50"><Globe className="h-5 w-5 text-purple-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">API Enabled</p>
                <p className="text-2xl font-bold">{stats.apiEnabled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50"><FileText className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">฿{(stats.totalSpent / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by company, contact, email or ID..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'inactive'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${statusFilter === s ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Partner ID</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Company / Organization</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Contact Person</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Contract</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Bookings</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Total Spent</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Credit Limit</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">API</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => (
                  <tr key={m.id} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                    <td className="px-4 py-3 font-mono text-xs text-green-700 font-semibold">{m.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{m.contact}</p>
                      <p className="text-xs text-muted-foreground">{m.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${contractColors[m.contract]}`}>
                        {m.contract}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold">{m.bookings.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-mono text-sm">฿{(m.spent / 1000000).toFixed(2)}M</td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-muted-foreground">฿{m.creditLimit.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      {m.apiAccess
                        ? <Badge className="text-xs bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100">Enabled</Badge>
                        : <span className="text-xs text-muted-foreground">—</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={m.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                        {m.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => toast({ title: 'View Details', description: 'Loading details...' })}>
                        <Eye className="h-3.5 w-3.5" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t text-xs text-muted-foreground">
            Showing {filtered.length} of {members.length} partners
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
