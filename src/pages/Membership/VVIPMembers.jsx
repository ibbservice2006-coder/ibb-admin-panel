import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Users, Search, Download, Eye, TrendingUp, Calendar, Crown, ArrowUpCircle, Phone } from 'lucide-react'

const members = [
  { id: 'VV-0001', name: 'Dr. Pichai Rattanamanee',      email: 'pichai@corp.com',     phone: '081-999-0001', joined: '2023-01-05', bookings: 124, spent: 892000,  status: 'active',   lastBooking: '2026-03-24', concierge: true,  upgradeEligible: true  },
  { id: 'VV-0002', name: 'Khun Ying Suwanna Chaisit', email: 'suwanna@elite.com',  phone: '082-999-0002', joined: '2023-02-14', bookings: 98,  spent: 745000,  status: 'active',   lastBooking: '2026-03-23', concierge: true,  upgradeEligible: false },
  { id: 'VV-0003', name: 'Dr. Thanakorn Wichitchai',  email: 'thanakorn@med.com',   phone: '083-999-0003', joined: '2023-03-20', bookings: 87,  spent: 638000,  status: 'active',   lastBooking: '2026-03-22', concierge: false, upgradeEligible: true  },
  { id: 'VV-0004', name: 'Prof. Malinee Suksai', email: 'malinee@uni.ac.th',   phone: '084-999-0004', joined: '2023-04-08', bookings: 72,  spent: 524000,  status: 'active',   lastBooking: '2026-03-20', concierge: false, upgradeEligible: false },
  { id: 'VV-0005', name: 'Pol. Lt. Gen. Wirat Mankong',  email: 'wirat@gov.th',        phone: '085-999-0005', joined: '2023-05-15', bookings: 156, spent: 1124000, status: 'active',   lastBooking: '2026-03-24', concierge: true,  upgradeEligible: true  },
  { id: 'VV-0006', name: 'Ms. Orauma Thongtae',    email: 'onuma@luxury.com',    phone: '086-999-0006', joined: '2023-06-30', bookings: 45,  spent: 328000,  status: 'inactive', lastBooking: '2026-01-05', concierge: false, upgradeEligible: false },
  { id: 'VV-0007', name: 'Ambassador Praphat Siri',  email: 'praphat@diplomat.th', phone: '087-999-0007', joined: '2023-07-22', bookings: 203, spent: 1560000, status: 'active',   lastBooking: '2026-03-24', concierge: true,  upgradeEligible: true  },
]

export default function VVIPMembers() {
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
          <div className="p-2.5 rounded-xl bg-yellow-100 border border-yellow-300">
            <Crown className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">VVIP Members</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Tier 3 — Premium Vehicles · 10–15% Discount · Concierge Service</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>

      {/* Tier Badge */}
      <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-600" />
          <span className="font-semibold text-yellow-800">VVIP Member</span>
          <Badge className="text-xs bg-yellow-500 text-white border-0">Tier 3</Badge>
        </div>
        <div className="h-4 w-px bg-yellow-300" />
        <span className="text-sm text-yellow-800">Discount: <strong>10–15%</strong></span>
        <div className="h-4 w-px bg-yellow-300" />
        <span className="text-sm text-yellow-800">Cashback: <strong>10%</strong></span>
        <div className="h-4 w-px bg-yellow-300" />
        <span className="text-sm text-yellow-800">Support: <strong>Concierge</strong></span>
        <div className="h-4 w-px bg-yellow-300" />
        <span className="text-sm text-yellow-800">Vehicles: <strong>Premium Access</strong></span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-50"><Users className="h-5 w-5 text-yellow-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Total VVIP</p>
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
                <p className="text-xs text-muted-foreground">BP Eligible</p>
                <p className="text-2xl font-bold">{stats.upgradeEligible}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-50"><Crown className="h-5 w-5 text-yellow-600" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">฿{(stats.totalSpent / 1000000).toFixed(2)}M</p>
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
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${statusFilter === s ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
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
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Concierge</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">BP Eligible</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => (
                  <tr key={m.id} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                    <td className="px-4 py-3 font-mono text-xs text-yellow-700 font-semibold">{m.id}</td>
                    <td className="px-4 py-3 font-medium">{m.name}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                      <p className="text-xs text-muted-foreground">{m.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-muted-foreground">{m.joined}</td>
                    <td className="px-4 py-3 text-center font-semibold">{m.bookings}</td>
                    <td className="px-4 py-3 text-right font-mono text-sm">฿{m.spent.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      {m.concierge
                        ? <Badge className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-100 gap-1"><Phone className="h-2.5 w-2.5" />Active</Badge>
                        : <span className="text-xs text-muted-foreground">—</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-center">
                      {m.upgradeEligible
                        ? <Badge className="text-xs bg-green-100 text-green-700 border-green-200 hover:bg-green-100">Eligible</Badge>
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
