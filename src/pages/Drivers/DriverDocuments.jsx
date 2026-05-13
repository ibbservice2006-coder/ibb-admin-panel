import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Eye,
  Upload,
  Trash2,
  Pencil
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

function calcDaysLeft(expiryDate) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  return Math.round((expiry - today) / (1000 * 60 * 60 * 24))
}

function autoStatus(daysLeft) {
  if (daysLeft < 0) return 'expired'
  if (daysLeft <= 90) return 'expiring-soon'
  return 'valid'
}

export default function DriverDocuments() {
  const { toast } = useToast()
  const [drivers, setDrivers] = useState(driverDocumentsData)

  // View dialog
  const [showDocDialog, setShowDocDialog] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState(null)

  // Edit dialog
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editTarget, setEditTarget] = useState(null) // { driverId, docIndex }
  const [editForm, setEditForm] = useState({ number: '', expiryDate: '', status: 'valid' })

  // Delete dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null) // { driverId, docIndex, docType }

  // Export dialog
  const [showExportDialog, setShowExportDialog] = useState(false)

  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsRefreshing(false)
    toast({ title: 'Data Refreshed', description: 'Document status has been updated.' })
  }

  const handleOpenEdit = (driverId, docIndex, doc) => {
    setEditTarget({ driverId, docIndex })
    setEditForm({ number: doc.number, expiryDate: doc.expiryDate, status: doc.status })
    setShowEditDialog(true)
  }

  const handleSaveEdit = () => {
    const daysLeft = calcDaysLeft(editForm.expiryDate)
    const autoSt = autoStatus(daysLeft)
    setDrivers(prev => prev.map(driver => {
      if (driver.id !== editTarget.driverId) return driver
      const docs = driver.documents.map((doc, idx) => {
        if (idx !== editTarget.docIndex) return doc
        return {
          ...doc,
          number: editForm.number,
          expiryDate: editForm.expiryDate,
          status: autoSt,
          daysLeft
        }
      })
      return { ...driver, documents: docs }
    }))
    setShowEditDialog(false)
    toast({ title: 'Document Updated', description: `Document saved successfully.` })
  }

  const handleOpenDelete = (driverId, docIndex, docType) => {
    setDeleteTarget({ driverId, docIndex, docType })
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    setDrivers(prev => prev.map(driver => {
      if (driver.id !== deleteTarget.driverId) return driver
      return {
        ...driver,
        documents: driver.documents.filter((_, idx) => idx !== deleteTarget.docIndex)
      }
    }))
    setShowDeleteDialog(false)
    toast({ title: 'Document Deleted', description: `${deleteTarget.docType} has been removed.`, variant: 'destructive' })
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
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
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
                {driver.documents.map((doc, idx) => (
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
                      <Button variant="outline" size="sm" onClick={() => handleOpenEdit(driver.id, idx, doc)}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => { const input = document.createElement('input'); input.type = 'file'; input.onchange = (e) => { if (e.target.files[0]) toast({ title: 'File Selected', description: e.target.files[0].name }) }; input.click() }}>
                        <Upload className="h-4 w-4 mr-1" />
                        Upload
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleOpenDelete(driver.id, idx, doc.type)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
                {driver.documents.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No documents for this driver.</p>
                )}
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

      {/* View Dialog */}
      <Dialog open={showDocDialog} onOpenChange={setShowDocDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
            <DialogDescription>{selectedDoc?.type}</DialogDescription>
          </DialogHeader>
          {selectedDoc && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-muted-foreground">Document Type</p><p className="font-medium">{selectedDoc.type}</p></div>
              <div><p className="text-muted-foreground">Status</p><p className="font-medium capitalize">{selectedDoc.status}</p></div>
              <div><p className="text-muted-foreground">Expiry Date</p><p className="font-medium">{selectedDoc.expiryDate || 'N/A'}</p></div>
              <div><p className="text-muted-foreground">Days Left</p><p className="font-medium">{selectedDoc.daysLeft < 0 ? `${Math.abs(selectedDoc.daysLeft)} days expired` : `${selectedDoc.daysLeft} days`}</p></div>
              <div><p className="text-muted-foreground">Document No.</p><p className="font-medium">{selectedDoc.number || 'N/A'}</p></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDocDialog(false)}>Close</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setShowDocDialog(false); toast({ title: 'Approved', description: 'Document has been approved.' }) }}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>Update document information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Document Number</Label>
              <Input
                value={editForm.number}
                onChange={e => setEditForm({ ...editForm, number: e.target.value })}
                placeholder="e.g. DL-123456"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Expiry Date</Label>
              <Input
                type="date"
                value={editForm.expiryDate}
                onChange={e => setEditForm({ ...editForm, expiryDate: e.target.value })}
              />
              {editForm.expiryDate && (
                <p className="text-xs text-muted-foreground">
                  {(() => {
                    const d = calcDaysLeft(editForm.expiryDate)
                    if (d < 0) return <span className="text-red-600">{Math.abs(d)} days expired — status will be set to Expired</span>
                    if (d <= 90) return <span className="text-yellow-600">{d} days left — status will be set to Expiring Soon</span>
                    return <span className="text-green-600">{d} days left — status will be set to Valid</span>
                  })()}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button
              size="sm"
              className="bg-gray-700 hover:bg-gray-600 text-white"
              onClick={handleSaveEdit}
              disabled={!editForm.number || !editForm.expiryDate}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the <strong>{deleteTarget?.docType}</strong> document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={handleConfirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
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
