import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Users, Search, Download, Eye, TrendingUp, Calendar, Star } from 'lucide-react'

const members = [
  { id: 'GM-0001', name: 'Somchai Jaidee',       email: 'somchai@email.com',   phone: '081-234-5678', joined: '2024-01-15', bookings: 12, spent: 18400,  status: 'active',   lastBooking: '2026-03-20' },
  { id: 'GM-0002', name: 'Napa Loves Peace',        email: 'napa@email.com',      phone: '082-345-6789', joined: '2024-02-20', bookings: 5,  spent: 7200,   status: 'active',   lastBooking: '2026-03-15' },
  { id: 'GM-0003', name: 'Vichai Mankong',      email: 'wichai@email.com',    phone: '083-456-7890', joined: '2024-03-10', bookings: 8,  spent: 12600,  status: 'active',   lastBooking: '2026-03-22' },
  { id: 'GM-0004', name: 'Preecha Suksan',   email: 'preecha@email.com',   phone: '084-567-8901', joined: '2024-04-05', bookings: 3,  spent: 4500,   status: 'inactive', lastBooking: '2025-12-10' },
  { id: 'GM-0005', name: 'Malee Wongthong',     email: 'malee@email.com',     phone: '085-678-9012', joined: '2024-05-18', bookings: 21, spent: 31500,  status: 'active',   lastBooking: '2026-03-23' },
  { id: 'GM-0006', name: 'Thana Charoensuk',     email: 'thana@email.com',     phone: '086-789-0123', joined: '2024-06-22', bookings: 7,  spent: 10800,  status: 'active',   lastBooking: '2026-03-18' },
  { id: 'GM-0007', name: 'Suda Prasert',    email: 'suda@email.com',      phone: '087-890-1234', joined: '2024-07-30', bookings: 2,  spent: 3200,   status: 'active',   lastBooking: '2026-02-28' },
  { id: 'GM-0008', name: 'Chaiwat Deengam',   email: 'chaiwat@email.com',   phone: '088-901-2345', joined: '2024-08-14', bookings: 15, spent: 22800,  status: 'active',   lastBooking: '2026-03-21' },
  { id: 'GM-0009', name: 'Ratana Sawangjai',    email: 'rattana@email.com',   phone: '089-012-3456', joined: '2024-09-03', bookings: 4,  spent: 6000,   status: 'inactive', lastBooking: '2026-01-15' },
  { id: 'GM-0010', name: 'Prasit Kaewsai', email: 'prasit@email.com',    phone: '090-123-4567', joined: '2024-10-11', bookings: 9,  spent: 13500,  status: 'active',   lastBooking: '2026-03-19' },
]

export default function GeneralMembers() {
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
    const matchSearch = m.name.includes(search) || m.email.toLowerCase().includes(search.toLowerCase()) || m.id.includes(search)
    const matchStatus = statusFilter === 'all' || m.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = {
    total: members.length,
    active: members.filter(m => m.status === 'active').length,
    totalSpent: members.reduce((s, m) => s + m.spent, 0),
    avgBookings: (members.reduce((s, m) => s + m.bookings, 0) / members.length).toFixed(1),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100 border border-blue-200">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">General Members</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Tier 1 — General Member · Standard Pricing · Basic Booking</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>

      {/* Tier Badge */}
      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-blue-500" />
          <span className="font-semibold text-blue-700">General Member</span>
          <Badge className="text-xs bg-blue-600">Tier 1</Badge>
        </div>
        <div className="h-4 w-px bg-blue-200" />
        <span className="text-sm text-blue-700">Discount: <strong>0%</strong></span>
        <div className="h-4 w-px bg-blue-200" />
        <span className="text-sm text-blue-700">Cashback: <strong>None</strong></span>
        <div className="h-4 w-px bg-blue-200" />
        <span className="text-sm text-blue-700">Support: <strong>Standard</strong></span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100"><Users className="h-5 w-5 text-gray-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50"><TrendingUp className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.active.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50"><Calendar className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Bookings</p>
                <p className="text-2xl font-bold">{stats.avgBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50"><Star className="h-5 w-5 text-purple-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">฿{stats.totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, email or ID..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'inactive'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${statusFilter === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
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
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Member ID</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Contact</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Joined</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Bookings</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Total Spent</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Last Booking</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => (
                  <tr key={m.id} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                    <td className="px-4 py-3 font-mono text-xs text-blue-700 font-semibold">{m.id}</td>
                    <td className="px-4 py-3 font-medium">{m.name}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                      <p className="text-xs text-muted-foreground">{m.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-muted-foreground">{m.joined}</td>
                    <td className="px-4 py-3 text-center font-semibold">{m.bookings}</td>
                    <td className="px-4 py-3 text-right font-mono text-sm">฿{m.spent.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center text-xs text-muted-foreground">{m.lastBooking}</td>
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
            Showing {filtered.length} of {members.length} members
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
