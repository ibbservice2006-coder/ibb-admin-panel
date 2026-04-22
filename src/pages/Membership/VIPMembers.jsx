import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Users, Search, Download, Eye, TrendingUp, Calendar, Zap, ArrowUpCircle } from 'lucide-react'

const members = [
  { id: 'VP-0001', name: 'Natthapon Wongsuwan',  email: 'nattapon@email.com',  phone: '081-111-2222', joined: '2023-06-10', bookings: 48, spent: 186400, status: 'active',   lastBooking: '2026-03-23', upgradeEligible: true  },
  { id: 'VP-0002', name: 'Kanya Meesuk',         email: 'kanya@email.com',     phone: '082-222-3333', joined: '2023-07-22', bookings: 35, spent: 142000, status: 'active',   lastBooking: '2026-03-22', upgradeEligible: false },
  { id: 'VP-0003', name: 'Theerasak Ployngam',   email: 'theerasak@email.com', phone: '083-333-4444', joined: '2023-08-15', bookings: 62, spent: 248000, status: 'active',   lastBooking: '2026-03-24', upgradeEligible: true  },
  { id: 'VP-0004', name: 'Siriporn Saengthong',       email: 'siriporn@email.com',  phone: '084-444-5555', joined: '2023-09-03', bookings: 29, spent: 115600, status: 'active',   lastBooking: '2026-03-20', upgradeEligible: false },
  { id: 'VP-0005', name: 'Worapong Chaimongkol',      email: 'worapong@email.com',  phone: '085-555-6666', joined: '2023-10-18', bookings: 41, spent: 164000, status: 'active',   lastBooking: '2026-03-21', upgradeEligible: false },
  { id: 'VP-0006', name: 'Piyanuch Thongkam',       email: 'piyanuch@email.com',  phone: '086-666-7777', joined: '2023-11-05', bookings: 18, spent: 72000,  status: 'inactive', lastBooking: '2026-01-10', upgradeEligible: false },
  { id: 'VP-0007', name: 'Anucha Srisombat',     email: 'anucha@email.com',    phone: '087-777-8888', joined: '2023-12-20', bookings: 55, spent: 220000, status: 'active',   lastBooking: '2026-03-23', upgradeEligible: true  },
  { id: 'VP-0008', name: 'Ladda Rungreung',     email: 'ladda@email.com',     phone: '088-888-9999', joined: '2024-01-08', bookings: 33, spent: 132000, status: 'active',   lastBooking: '2026-03-19', upgradeEligible: false },
]

export default function VIPMembers() {
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
    upgradeEligible: members.filter(m => m.upgradeEligible).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-pink-100 border border-pink-200">
            <Zap className="h-6 w-6 text-pink-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">VIP Members</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Tier 2 — Priority Booking · 5–10% Discount · Dedicated Support</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>

      {/* Tier Badge */}
      <div className="flex items-center gap-3 p-4 bg-pink-50 border border-pink-200 rounded-xl">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-pink-500" />
          <span className="font-semibold text-pink-700">VIP Member</span>
          <Badge className="text-xs bg-pink-600">Tier 2</Badge>
        </div>
        <div className="h-4 w-px bg-pink-200" />
        <span className="text-sm text-pink-700">Discount: <strong>5–10%</strong></span>
        <div className="h-4 w-px bg-pink-200" />
        <span className="text-sm text-pink-700">Cashback: <strong>5%</strong></span>
        <div className="h-4 w-px bg-pink-200" />
        <span className="text-sm text-pink-700">Support: <strong>Priority</strong></span>
        <div className="h-4 w-px bg-pink-200" />
        <span className="text-sm text-pink-700">Booking: <strong>Priority Queue</strong></span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-pink-50"><Users className="h-5 w-5 text-pink-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Total VIP</p>
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
              <div className="p-2 rounded-lg bg-orange-50"><ArrowUpCircle className="h-5 w-5 text-orange-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Upgrade Eligible</p>
                <p className="text-2xl font-bold">{stats.upgradeEligible}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50"><Calendar className="h-5 w-5 text-purple-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">฿{(stats.totalSpent / 1000).toFixed(0)}K</p>
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
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${statusFilter === s ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
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
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Upgrade</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => (
                  <tr key={m.id} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                    <td className="px-4 py-3 font-mono text-xs text-pink-700 font-semibold">{m.id}</td>
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
                      {m.upgradeEligible
                        ? <Badge className="text-xs bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100">VVIP Eligible</Badge>
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
            Showing {filtered.length} of {members.length} members
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
