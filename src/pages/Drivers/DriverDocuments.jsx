import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Calendar,
  Eye,
  Upload,
  Trash2
} from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

// Mock driver documents data
const driverDocumentsData = [
  {
    id: 'DRV-001',
    name: 'Somchai P.',
    documents: [
      { type: 'License', number: 'DL-123456', expiryDate: '2025-12-15', status: 'valid', daysLeft: 267 },
      { type: 'Insurance', number: 'INS-789012', expiryDate: '2024-06-30', status: 'expiring-soon', daysLeft: 100 },
      { type: 'ID Card', number: 'ID-345678', expiryDate: '2026-08-20', status: 'valid', daysLeft: 515 },
      { type: 'Medical Certificate', number: 'MED-901234', expiryDate: '2024-05-15', status: 'expired', daysLeft: -37 }
    ]
  },
  {
    id: 'DRV-002',
    name: 'Arun K.',
    documents: [
      { type: 'License', number: 'DL-234567', expiryDate: '2025-08-10', status: 'valid', daysLeft: 141 },
      { type: 'Insurance', number: 'INS-890123', expiryDate: '2024-08-15', status: 'valid', daysLeft: 145 },
      { type: 'ID Card', number: 'ID-456789', expiryDate: '2027-03-25', status: 'valid', daysLeft: 733 },
      { type: 'Medical Certificate', number: 'MED-012345', expiryDate: '2024-12-01', status: 'valid', daysLeft: 254 }
    ]
  },
  {
    id: 'DRV-003',
    name: 'Niran T.',
    documents: [
      { type: 'License', number: 'DL-345678', expiryDate: '2024-04-20', status: 'expired', daysLeft: -63 },
      { type: 'Insurance', number: 'INS-901234', expiryDate: '2024-07-10', status: 'expiring-soon', daysLeft: 110 },
      { type: 'ID Card', number: 'ID-567890', expiryDate: '2025-11-30', status: 'valid', daysLeft: 253 },
      { type: 'Medical Certificate', number: 'MED-123456', expiryDate: '2024-09-15', status: 'valid', daysLeft: 176 }
    ]
  }
]

const statusConfig = {
  'valid': { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Valid' },
  'expiring-soon': { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Expiring Soon' },
  'expired': { color: 'bg-red-100 text-red-800', icon: AlertTriangle, label: 'Expired' }
}

export default function DriverDocuments() {
  const { toast } = useToast()
  const [drivers, setDrivers] = useState(driverDocumentsData)
  const [showDocDialog, setShowDocDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState(null)

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast({ title: 'Data Refreshed', description: 'Document status has been updated.' })
  }

  // Statistics
  const allDocuments = drivers.flatMap(d => d.documents)
  const expiredCount = allDocuments.filter(d => d.status === 'expired').length
  const expiringCount = allDocuments.filter(d => d.status === 'expiring-soon').length
  const validCount = allDocuments.filter(d => d.status === 'valid').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Driver Documents</h1>
          <p className="text-muted-foreground mt-1">Manage and track driver documentation and expiry dates</p>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                <h3 className="text-2xl font-bold mt-1">{allDocuments.length}</h3>
              </div>
              <div className="p-2 rounded-lg bg-slate-50">
                <FileText className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valid</p>
                <h3 className="text-2xl font-bold mt-1 text-green-600">{validCount}</h3>
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
                <p className="text-sm font-medium text-muted-foreground">Expiring Soon</p>
                <h3 className="text-2xl font-bold mt-1 text-yellow-600">{expiringCount}</h3>
              </div>
              <div className="p-2 rounded-lg bg-yellow-50">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expired</p>
                <h3 className="text-2xl font-bold mt-1 text-red-600">{expiredCount}</h3>
              </div>
              <div className="p-2 rounded-lg bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Driver Documents */}
      <div className="space-y-4">
        {drivers.map(driver => (
          <Card key={driver.id} className="border-none shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{driver.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {driver.documents.map((doc, idx) => {
                  const StatusIcon = statusConfig[doc.status]?.icon
                  return (
                    <div key={idx} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="h-4 w-4 text-slate-400" />
                          <span className="font-bold text-sm">{doc.type}</span>
                          <Badge className={statusConfig[doc.status]?.color}>
                            {statusConfig[doc.status]?.label}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
                          <div>
                            <p className="text-muted-foreground">Document Number</p>
                            <p className="font-medium text-slate-700">{doc.number}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Expiry Date</p>
                            <p className="font-medium text-slate-700">{new Date(doc.expiryDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Days Left</p>
                            <p className={`font-bold ${
                              doc.daysLeft < 0 ? 'text-red-600' :
                              doc.daysLeft < 90 ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {doc.daysLeft < 0 ? `${Math.abs(doc.daysLeft)} days expired` : `${doc.daysLeft} days`}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button variant="outline" size="sm" onClick={() => { setSelectedDoc(doc); setShowDocDialog(true) }}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => { const input = document.createElement('input'); input.type = 'file'; input.onchange = (e) => { if (e.target.files[0]) toast({ title: 'File Selected', description: e.target.files[0].name }) }; input.click() }}>
                          <Upload className="h-4 w-4 mr-1" />
                          Upload
                        </Button>
                        {doc.status === 'expired' && (
                          <Button variant="outline" size="sm" className="text-red-600 border-red-200" onClick={() => toast({ title: 'Added', description: 'Data added successfully' })}>
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Renew
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Legend */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Document Status Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Valid</p>
                <p className="text-xs text-muted-foreground">Document is current and valid</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-50">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Expiring Soon</p>
                <p className="text-xs text-muted-foreground">Document expires within 90 days</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Expired</p>
                <p className="text-xs text-muted-foreground">Document has expired and needs renewal</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog open={showDocDialog} onOpenChange={setShowDocDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Document Details</DialogTitle><DialogDescription>{selectedDoc?.type} - {selectedDoc?.driverName}</DialogDescription></DialogHeader>
          {selectedDoc && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-muted-foreground">Driver</p><p className="font-bold">{selectedDoc.driverName}</p></div>
              <div><p className="text-muted-foreground">Document Type</p><p className="font-medium">{selectedDoc.type}</p></div>
              <div><p className="text-muted-foreground">Status</p><p className="font-medium capitalize">{selectedDoc.status}</p></div>
              <div><p className="text-muted-foreground">Expiry Date</p><p className="font-medium">{selectedDoc.expiry || 'N/A'}</p></div>
              <div><p className="text-muted-foreground">Submitted</p><p className="font-medium">{selectedDoc.submitted || 'N/A'}</p></div>
              <div><p className="text-muted-foreground">Document No.</p><p className="font-medium">{selectedDoc.docNo || 'N/A'}</p></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDocDialog(false)}>Close</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setShowDocDialog(false); toast({ title: 'Approved', description: 'Document has been approved.' }) }}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Export Documents</DialogTitle><DialogDescription>Choose export format</DialogDescription></DialogHeader>
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