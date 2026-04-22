import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageSquare,
  User,
  Calendar,
  Eye,
  Reply,
  Trash2
} from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

// Mock complaints data
const complaintsData = [
  {
    id: 'CMP-001',
    complaintId: 'CMP-2024-001',
    driver: 'Somchai P.',
    customer: 'John Doe',
    date: '2024-03-20',
    category: 'Rude Behavior',
    description: 'Driver was rude and impatient during the trip',
    status: 'investigating',
    severity: 'high',
    rating: 1,
    resolution: null
  },
  {
    id: 'CMP-002',
    complaintId: 'CMP-2024-002',
    driver: 'Arun K.',
    customer: 'Sarah J.',
    date: '2024-03-18',
    category: 'Vehicle Condition',
    description: 'Vehicle was dirty and smelled bad',
    status: 'resolved',
    severity: 'medium',
    rating: 2,
    resolution: 'Driver has been instructed to maintain vehicle cleanliness'
  },
  {
    id: 'CMP-003',
    complaintId: 'CMP-2024-003',
    driver: 'Niran T.',
    customer: 'Mike Chen',
    date: '2024-03-19',
    category: 'Route/Navigation',
    description: 'Driver took a much longer route than necessary',
    status: 'pending',
    severity: 'low',
    rating: 3,
    resolution: null
  },
  {
    id: 'CMP-004',
    complaintId: 'CMP-2024-004',
    driver: 'Wichai S.',
    customer: 'Anna Smith',
    date: '2024-03-17',
    category: 'Safety',
    description: 'Driver was speeding and driving recklessly',
    status: 'investigating',
    severity: 'high',
    rating: 1,
    resolution: null
  },
  {
    id: 'CMP-005',
    complaintId: 'CMP-2024-005',
    driver: 'Pattaya M.',
    customer: 'Peter P.',
    date: '2024-03-16',
    category: 'Communication',
    description: 'Driver did not respond to customer calls',
    status: 'resolved',
    severity: 'medium',
    rating: 2,
    resolution: 'Driver has been reminded of communication protocols'
  }
]

const statusConfig = {
  'pending': { color: 'bg-slate-100 text-slate-800', label: 'Pending', icon: Clock },
  'investigating': { color: 'bg-yellow-100 text-yellow-800', label: 'Investigating', icon: AlertTriangle },
  'resolved': { color: 'bg-green-100 text-green-800', label: 'Resolved', icon: CheckCircle }
}

const severityConfig = {
  'low': { color: 'bg-blue-100 text-blue-800', label: 'Low' },
  'medium': { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
  'high': { color: 'bg-red-100 text-red-800', label: 'High' }
}

export default function DriverComplaints() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [complaints, setComplaints] = useState(complaintsData)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState(null)

  const filteredComplaints = complaints.filter(complaint =>
    complaint.complaintId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.customer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast({ title: 'Data Refreshed', description: 'Complaint data has been updated.' })
  }

  // Statistics
  const statusStats = {
    'pending': complaints.filter(c => c.status === 'pending').length,
    'investigating': complaints.filter(c => c.status === 'investigating').length,
    'resolved': complaints.filter(c => c.status === 'resolved').length
  }

  const severityStats = {
    'high': complaints.filter(c => c.severity === 'high').length,
    'medium': complaints.filter(c => c.severity === 'medium').length,
    'low': complaints.filter(c => c.severity === 'low').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Driver Complaints</h1>
          <p className="text-muted-foreground mt-1">Manage and track customer complaints against drivers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setShowExportDialog(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <h3 className="text-2xl font-bold mt-1">{complaints.length}</h3>
              </div>
              <div className="p-2 rounded-lg bg-slate-50">
                <MessageSquare className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <h3 className="text-2xl font-bold mt-1 text-slate-600">{statusStats.pending}</h3>
              </div>
              <div className="p-2 rounded-lg bg-slate-50">
                <Clock className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Investigating</p>
                <h3 className="text-2xl font-bold mt-1 text-yellow-600">{statusStats.investigating}</h3>
              </div>
              <div className="p-2 rounded-lg bg-yellow-50">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <h3 className="text-2xl font-bold mt-1 text-green-600">{statusStats.resolved}</h3>
              </div>
              <div className="p-2 rounded-lg bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Severity</p>
                <h3 className="text-2xl font-bold mt-1 text-red-600">{severityStats.high}</h3>
              </div>
              <div className="p-2 rounded-lg bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolution Rate</p>
                <h3 className="text-2xl font-bold mt-1 text-blue-600">{Math.round((statusStats.resolved / complaints.length) * 100)}%</h3>
              </div>
              <div className="p-2 rounded-lg bg-blue-50">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by complaint ID, driver or customer..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => toast({ title: 'Filter Applied', description: 'Data filtered' })}>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Complaints List */}
      <div className="space-y-3">
        {filteredComplaints.map(complaint => (
          <Card key={complaint.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-sm">{complaint.complaintId}</h3>
                    <Badge className={statusConfig[complaint.status]?.color}>
                      {statusConfig[complaint.status]?.label}
                    </Badge>
                    <Badge className={severityConfig[complaint.severity]?.color}>
                      {severityConfig[complaint.severity]?.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{complaint.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{new Date(complaint.date).toLocaleDateString()}</p>
                  <div className="flex items-center gap-1 mt-1 justify-end">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < complaint.rating ? 'text-yellow-400' : 'text-slate-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-200">
                <div>
                  <p className="text-xs text-muted-foreground">Driver</p>
                  <p className="text-sm font-medium">{complaint.driver}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="text-sm font-medium">{complaint.customer}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-1">Complaint Description</p>
                <p className="text-sm text-slate-700">{complaint.description}</p>
              </div>

              {complaint.resolution && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-muted-foreground mb-1">Resolution</p>
                  <p className="text-sm text-slate-700">{complaint.resolution}</p>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => { setSelectedComplaint(complaint); setShowDetailDialog(true) }}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                {complaint.status !== 'resolved' && (
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                    <Reply className="h-4 w-4 mr-2" />
                    Respond
                  </Button>
                )}
                <Button variant="outline" size="sm" className="text-red-600 border-red-200" onClick={() => toast({ title: 'Deleted', description: 'Data deleted successfully', variant: 'destructive' })}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Complaint Details</DialogTitle><DialogDescription>Complaint #{selectedComplaint?.id}</DialogDescription></DialogHeader>
          {selectedComplaint && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-muted-foreground">Driver</p><p className="font-bold">{selectedComplaint.driverName}</p></div>
                <div><p className="text-muted-foreground">Customer</p><p className="font-medium">{selectedComplaint.customerName || 'N/A'}</p></div>
                <div><p className="text-muted-foreground">Category</p><p className="font-medium">{selectedComplaint.category}</p></div>
                <div><p className="text-muted-foreground">Status</p><p className="font-medium capitalize">{selectedComplaint.status}</p></div>
                <div><p className="text-muted-foreground">Date</p><p className="font-medium">{selectedComplaint.date}</p></div>
                <div><p className="text-muted-foreground">Priority</p><p className="font-medium capitalize">{selectedComplaint.priority || 'Normal'}</p></div>
              </div>
              <div><p className="text-muted-foreground mb-1">Description</p><p className="p-3 bg-gray-50 rounded-lg">{selectedComplaint.description || 'No description provided.'}</p></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>Close</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setShowDetailDialog(false); toast({ title: 'Resolved', description: 'Complaint marked as resolved.' }) }}>Mark Resolved</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Export Complaints</DialogTitle><DialogDescription>Choose export format</DialogDescription></DialogHeader>
          <div className="space-y-2">
            {['CSV', 'Excel (.xlsx)', 'PDF Report'].map(fmt => (
              <button key={fmt} className="w-full p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-left text-sm font-medium" onClick={() => { setShowExportDialog(false); toast({ title: 'Exporting...', description: `Downloading ${fmt}` }) }}>{fmt}</button>
            ))}
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowExportDialog(false)}>Cancel</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}