import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  FileText, Search, Download, Shield, CheckCircle,
  AlertTriangle, Clock, User, Database, ArrowRight,
  Filter, Eye, Lock
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const auditRecords = [
  {
    id: 'AUD-20260324-001', timestamp: '2026-03-24 17:08:42', user: 'Somchai R.', role: 'Super Admin',
    module: 'User Management', action: 'UPDATE', entity: 'Admin User ADM-010',
    before: '{ status: "active" }', after: '{ status: "inactive" }',
    reason: 'Employee resignation', ip: '192.168.1.1', hash: 'a3f8c2d1'
  },
  {
    id: 'AUD-20260324-002', timestamp: '2026-03-24 16:42:18', user: 'Prayuth S.', role: 'Finance Manager',
    module: 'Currency & Exchange', action: 'UPDATE', entity: 'Exchange Rate THB/USD',
    before: '{ rate: 35.28 }', after: '{ rate: 35.42 }',
    reason: 'Daily rate update', ip: '192.168.1.8', hash: 'b7e4a9f2'
  },
  {
    id: 'AUD-20260324-003', timestamp: '2026-03-24 15:30:55', user: 'Wanida K.', role: 'Customer Support',
    module: 'Wallet & Payments', action: 'CREATE', entity: 'Refund REF-10234',
    before: null, after: '{ amount: 1200, booking: "BK-10880", status: "approved" }',
    reason: 'Customer complaint — driver late 45 min', ip: '192.168.1.18', hash: 'c2d6b8e1'
  },
  {
    id: 'AUD-20260324-004', timestamp: '2026-03-24 14:15:22', user: 'Somchai R.', role: 'Super Admin',
    module: 'Vouchers & Promos', action: 'DELETE', entity: 'Voucher Batch VCH-2024-Q4',
    before: '{ count: 842, status: "expired" }', after: null,
    reason: 'Cleanup expired vouchers', ip: '192.168.1.1', hash: 'd9a3c7f4'
  },
  {
    id: 'AUD-20260324-005', timestamp: '2026-03-24 13:08:44', user: 'Arthit S.', role: 'IT Administrator',
    module: 'Settings', action: 'UPDATE', entity: 'API Rate Limit Config',
    before: '{ rateLimit: 1000 }', after: '{ rateLimit: 2000 }',
    reason: 'Increased for Songkran peak traffic', ip: '192.168.1.5', hash: 'e4f1b2a8'
  },
  {
    id: 'AUD-20260324-006', timestamp: '2026-03-24 11:42:30', user: 'Siriporn C.', role: 'Marketing Manager',
    module: 'Vouchers & Promos', action: 'CREATE', entity: 'Campaign SONGKRAN2026',
    before: null, after: '{ discount: 20, code: "SONGKRAN20", expiry: "2026-04-15" }',
    reason: 'Songkran holiday promotion', ip: '192.168.1.22', hash: 'f6c3d9b7'
  },
  {
    id: 'AUD-20260324-007', timestamp: '2026-03-24 10:20:15', user: 'Nattaya W.', role: 'Operations Manager',
    module: 'Pricing Management', action: 'UPDATE', entity: 'Van Price — Airport Route',
    before: '{ basePrice: 1200 }', after: '{ basePrice: 1350 }',
    reason: 'Fuel cost adjustment Q1 2026', ip: '192.168.1.12', hash: 'a8b2e5c4'
  },
  {
    id: 'AUD-20260324-008', timestamp: '2026-03-24 09:05:38', user: 'Thanakorn B.', role: 'Fleet Manager',
    module: 'Fleet Management', action: 'CREATE', entity: 'Vehicle VAN-058',
    before: null, after: '{ type: "Van", plate: "AB 5678", capacity: 9 }',
    reason: 'New vehicle acquisition', ip: '192.168.1.15', hash: 'b3f7a1d6'
  },
]

const actionColor = {
  CREATE: 'bg-green-100 text-green-700',
  UPDATE: 'bg-yellow-100 text-yellow-700',
  DELETE: 'bg-red-100 text-red-700',
  VIEW: 'bg-blue-100 text-blue-700',
}

export default function AuditTrail() {
  const [search, setSearch] = useState('')
  const [filterAction, setFilterAction] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
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

  const filtered = auditRecords.filter(r => {
    const matchSearch = r.user.toLowerCase().includes(search.toLowerCase()) ||
      r.entity.toLowerCase().includes(search.toLowerCase()) ||
      r.module.toLowerCase().includes(search.toLowerCase())
    const matchAction = filterAction === 'all' || r.action === filterAction
    return matchSearch && matchAction
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gray-100 border border-gray-200">
            <FileText className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Audit Trail</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Log key data changes — Before/After, Hash Verification</p>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={handleExport} className="gap-1.5">
          <Download className="h-3.5 w-3.5" />Export
        </Button>
      </div>

      {/* Compliance Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-3 pb-3">
          <div className="flex items-start gap-3">
            <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-blue-700">Immutable Audit Log</p>
              <p className="text-xs text-blue-600 mt-0.5">
                Each item has SHA-256 hash for tamper detection · SaveKeep for 7 years per PDPA · 
                Cannot edit or delete audit records, even Super Admin
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search user, module, entity..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-8 text-sm" />
        </div>
        <div className="flex gap-1">
          {['all', 'CREATE', 'UPDATE', 'DELETE'].map(a => (
            <Button key={a} size="sm" variant={filterAction === a ? 'default' : 'outline'}
              onClick={() => setFilterAction(a)} className="text-xs h-8">{a}</Button>
          ))}
        </div>
      </div>

      {/* Audit Records */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base">Audit Records ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filtered.map(record => (
              <div key={record.id} className="px-4 py-3 hover:bg-gray-50">
                <div className="flex items-start gap-3 cursor-pointer" onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge className={`text-xs ${actionColor[record.action]}`}>{record.action}</Badge>
                      <span className="text-xs font-bold">{record.entity}</span>
                      <span className="text-xs text-muted-foreground">in {record.module}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-0.5"><User className="h-3 w-3" />{record.user} ({record.role})</span>
                      <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{record.timestamp}</span>
                      <span className="font-mono text-xs">{record.ip}</span>
                      <span className="font-mono text-xs text-gray-400">#{record.hash}</span>
                    </div>
                  </div>
                  <Eye className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-1" />
                </div>

                {/* Expanded: Before/After */}
                {expandedId === record.id && (
                  <div className="mt-3 pt-3 border-t space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {record.before && (
                        <div>
                          <p className="text-xs font-bold text-red-600 mb-1">Before</p>
                          <pre className="text-xs bg-red-50 border border-red-100 rounded p-2 overflow-x-auto">{record.before}</pre>
                        </div>
                      )}
                      {record.after && (
                        <div>
                          <p className="text-xs font-bold text-green-600 mb-1">After</p>
                          <pre className="text-xs bg-green-50 border border-green-100 rounded p-2 overflow-x-auto">{record.after}</pre>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      <span>Reason: {record.reason}</span>
                      <span>·</span>
                      <span className="font-mono">Audit ID: {record.id}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
