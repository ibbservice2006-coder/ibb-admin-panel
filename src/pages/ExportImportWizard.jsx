import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Upload, 
  Download, 
  FileText, 
  Database,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileSpreadsheet,
  FileType,
  Settings,
  Play,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Check
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function ExportImportWizard() {
  // Export Wizard State
  const [exportStep, setExportStep] = useState(1)
  const [exportConfig, setExportConfig] = useState({
    tables: [],
    format: 'csv',
    includeHeaders: true,
    dateFormat: 'YYYY-MM-DD',
    encoding: 'UTF-8',
    delimiter: ',',
    compression: false
  })
  const [exportProgress, setExportProgress] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const [exportResult, setExportResult] = useState(null)

  // Import Wizard State
  const [importStep, setImportStep] = useState(1)
  const [importConfig, setImportConfig] = useState({
    file: null,
    format: 'csv',
    targetTable: '',
    mode: 'insert',
    skipErrors: true,
    validateData: true,
    batchSize: 1000
  })
  const [importProgress, setImportProgress] = useState(0)
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const [importPreview, setImportPreview] = useState(null)

  // Available tables
  const tables = [
    { id: 'products', name: 'Products', records: 1250, columns: 12 },
    { id: 'orders', name: 'Orders', records: 3420, columns: 15 },
    { id: 'customers', name: 'Customers', records: 890, columns: 10 },
    { id: 'categories', name: 'Categories', records: 45, columns: 6 },
    { id: 'inventory', name: 'Inventory', records: 2100, columns: 8 },
    { id: 'payments', name: 'Payments', records: 3200, columns: 9 },
    { id: 'shipments', name: 'Shipments', records: 2800, columns: 11 },
    { id: 'vendors', name: 'Vendors', records: 120, columns: 8 }
  ]

  const formats = [
    { value: 'csv', label: 'CSV', icon: FileText, description: 'Comma-separated values' },
    { value: 'excel', label: 'Excel', icon: FileSpreadsheet, description: 'Microsoft Excel (.xlsx)' },
    { value: 'json', label: 'JSON', icon: FileType, description: 'JavaScript Object Notation' },
    { value: 'xml', label: 'XML', icon: FileType, description: 'Extensible Markup Language' }
  ]

  const importModes = [
    { value: 'insert', label: 'Insert Only', description: 'Add new records only' },
    { value: 'update', label: 'Update Only', description: 'Update existing records' },
    { value: 'upsert', label: 'Insert or Update', description: 'Add new or update existing' },
    { value: 'replace', label: 'Replace All', description: 'Delete all and insert new' }
  ]

  // Export Functions
  const handleExportTableToggle = (tableId) => {
    setExportConfig(prev => ({
      ...prev,
      tables: prev.tables.includes(tableId)
        ? prev.tables.filter(id => id !== tableId)
        : [...prev.tables, tableId]
    }))
  }

  const handleExportSelectAll = () => {
    setExportConfig(prev => ({
      ...prev,
      tables: tables.map(t => t.id)
    }))
  }

  const handleExportDeselectAll = () => {
    setExportConfig(prev => ({
      ...prev,
      tables: []
    }))
  }

  const handleExport = async () => {
    setIsExporting(true)
    setExportProgress(0)
    setExportResult(null)

    // Simulate export process
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setExportProgress(i)
    }

    const totalRecords = exportConfig.tables.reduce((sum, id) => {
      const table = tables.find(t => t.id === id)
      return sum + (table?.records || 0)
    }, 0)

    setIsExporting(false)
    setExportResult({
      success: true,
      tables: exportConfig.tables.length,
      records: totalRecords,
      fileSize: `${(totalRecords * 0.5).toFixed(1)} KB`,
      format: exportConfig.format.toUpperCase(),
      duration: '2.3s',
      filename: `export_${Date.now()}.${exportConfig.format}`
    })

    toast({
      title: 'Export Successful',
      description: `Exported ${totalRecords} records from ${exportConfig.tables.length} tables`
    })
  }

  // Import Functions
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImportConfig(prev => ({ ...prev, file }))
      
      // Simulate file preview
      setImportPreview({
        filename: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        rows: 1250,
        columns: 12,
        sampleData: [
          { id: 1, name: 'Product A', price: 99.99, stock: 50 },
          { id: 2, name: 'Product B', price: 149.99, stock: 30 },
          { id: 3, name: 'Product C', price: 199.99, stock: 20 }
        ]
      })
    }
  }

  const handleImport = async () => {
    setIsImporting(true)
    setImportProgress(0)
    setImportResult(null)

    // Simulate import process
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setImportProgress(i)
    }

    setIsImporting(false)
    setImportResult({
      success: true,
      imported: 1180,
      updated: 65,
      skipped: 5,
      failed: 0,
      duration: '3.2s'
    })

    toast({
      title: 'Import Successful',
      description: `Imported 1180 records, updated 65, skipped 5`
    })
  }

  const resetExportWizard = () => {
    setExportStep(1)
    setExportConfig({
      tables: [],
      format: 'csv',
      includeHeaders: true,
      dateFormat: 'YYYY-MM-DD',
      encoding: 'UTF-8',
      delimiter: ',',
      compression: false
    })
    setExportProgress(0)
    setExportResult(null)
  }

  const resetImportWizard = () => {
    setImportStep(1)
    setImportConfig({
      file: null,
      format: 'csv',
      targetTable: '',
      mode: 'insert',
      skipErrors: true,
      validateData: true,
      batchSize: 1000
    })
    setImportProgress(0)
    setImportResult(null)
    setImportPreview(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Export/Import Wizard</h1>
        <p className="text-muted-foreground">
          Step-by-step wizard for exporting and importing data
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tables</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tables.length}</div>
            <p className="text-xs text-muted-foreground">Available tables</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tables.reduce((sum, t) => sum + t.records, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all tables</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Formats</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formats.length}</div>
            <p className="text-xs text-muted-foreground">Supported formats</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ready</div>
            <p className="text-xs text-muted-foreground">System ready</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="export" className="space-y-4">
        <TabsList>
          <TabsTrigger value="export">
            <Download className="h-4 w-4 mr-2" />
            Export Wizard
          </TabsTrigger>
          <TabsTrigger value="import">
            <Upload className="h-4 w-4 mr-2" />
            Import Wizard
          </TabsTrigger>
        </TabsList>

        {/* Export Wizard */}
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Export Wizard</CardTitle>
                  <CardDescription>Step {exportStep} of 3</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={resetExportWizard}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
              {/* Progress Steps */}
              <div className="flex items-center gap-2 mt-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      exportStep >= step ? 'bg-primary border-primary text-primary-foreground' : 'border-muted'
                    }`}>
                      {exportStep > step ? <Check className="h-4 w-4" /> : step}
                    </div>
                    {step < 3 && (
                      <div className={`flex-1 h-0.5 mx-2 ${
                        exportStep > step ? 'bg-primary' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Select Tables */}
              {exportStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Select Tables to Export</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleExportSelectAll}>
                        Select All
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleExportDeselectAll}>
                        Deselect All
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="h-[400px] border rounded-lg p-4">
                    <div className="space-y-2">
                      {tables.map((table) => (
                        <div
                          key={table.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
                          onClick={() => handleExportTableToggle(table.id)}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={exportConfig.tables.includes(table.id)}
                              onCheckedChange={() => handleExportTableToggle(table.id)}
                            />
                            <div>
                              <p className="font-medium">{table.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {table.records.toLocaleString()} records • {table.columns} columns
                              </p>
                            </div>
                          </div>
                          <Database className="h-5 w-5 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Selected {exportConfig.tables.length} tables with{' '}
                      {exportConfig.tables.reduce((sum, id) => {
                        const table = tables.find(t => t.id === id)
                        return sum + (table?.records || 0)
                      }, 0).toLocaleString()}{' '}
                      total records
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Step 2: Configure Export */}
              {exportStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Configure Export Settings</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="export-format">Export Format</Label>
                      <Select
                        value={exportConfig.format}
                        onValueChange={(value) => setExportConfig({ ...exportConfig, format: value })}
                      >
                        <SelectTrigger id="export-format">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {formats.map((format) => {
                            const Icon = format.icon
                            return (
                              <SelectItem key={format.value} value={format.value}>
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  <div>
                                    <div className="font-medium">{format.label}</div>
                                    <div className="text-xs text-muted-foreground">{format.description}</div>
                                  </div>
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="encoding">Encoding</Label>
                      <Select
                        value={exportConfig.encoding}
                        onValueChange={(value) => setExportConfig({ ...exportConfig, encoding: value })}
                      >
                        <SelectTrigger id="encoding">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTF-8">UTF-8</SelectItem>
                          <SelectItem value="UTF-16">UTF-16</SelectItem>
                          <SelectItem value="ISO-8859-1">ISO-8859-1</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {exportConfig.format === 'csv' && (
                      <div className="space-y-2">
                        <Label htmlFor="delimiter">Delimiter</Label>
                        <Select
                          value={exportConfig.delimiter}
                          onValueChange={(value) => setExportConfig({ ...exportConfig, delimiter: value })}
                        >
                          <SelectTrigger id="delimiter">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value=",">Comma (,)</SelectItem>
                            <SelectItem value=";">Semicolon (;)</SelectItem>
                            <SelectItem value="\t">Tab</SelectItem>
                            <SelectItem value="|">Pipe (|)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="date-format">Date Format</Label>
                      <Select
                        value={exportConfig.dateFormat}
                        onValueChange={(value) => setExportConfig({ ...exportConfig, dateFormat: value })}
                      >
                        <SelectTrigger id="date-format">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="ISO8601">ISO 8601</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="include-headers">Include Column Headers</Label>
                      <Checkbox
                        id="include-headers"
                        checked={exportConfig.includeHeaders}
                        onCheckedChange={(checked) => setExportConfig({ ...exportConfig, includeHeaders: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="compression">Enable Compression (ZIP)</Label>
                      <Checkbox
                        id="compression"
                        checked={exportConfig.compression}
                        onCheckedChange={(checked) => setExportConfig({ ...exportConfig, compression: checked })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review and Export */}
              {exportStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Review and Export</h3>

                  <div className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tables:</span>
                      <span className="font-medium">{exportConfig.tables.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Records:</span>
                      <span className="font-medium">
                        {exportConfig.tables.reduce((sum, id) => {
                          const table = tables.find(t => t.id === id)
                          return sum + (table?.records || 0)
                        }, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Format:</span>
                      <span className="font-medium uppercase">{exportConfig.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Encoding:</span>
                      <span className="font-medium">{exportConfig.encoding}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Headers:</span>
                      <span className="font-medium">{exportConfig.includeHeaders ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Compression:</span>
                      <span className="font-medium">{exportConfig.compression ? 'Yes' : 'No'}</span>
                    </div>
                  </div>

                  {isExporting && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Exporting...</span>
                        <span>{exportProgress}%</span>
                      </div>
                      <Progress value={exportProgress} />
                    </div>
                  )}

                  {exportResult && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Export Successful!</strong>
                        <div className="mt-2 text-sm space-y-1">
                          <div>• Exported {exportResult.records.toLocaleString()} records from {exportResult.tables} tables</div>
                          <div>• File size: {exportResult.fileSize}</div>
                          <div>• Format: {exportResult.format}</div>
                          <div>• Duration: {exportResult.duration}</div>
                          <div className="mt-2">
                            <Button size="sm" variant="outline" onClick={() => toast({ title: 'Export', description: 'Exporting data...' })}>
                              <Download className="h-4 w-4 mr-2" />
                              Download {exportResult.filename}
                            </Button>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {!isExporting && !exportResult && (
                    <Button className="bg-gray-700 hover:bg-gray-600 text-white w-full" onClick={handleExport} size="lg">
                      <Play className="h-4 w-4 mr-2" />
                      Start Export
                    </Button>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button size="sm"
                  variant="outline"
                  onClick={() => setExportStep(Math.max(1, exportStep - 1))}
                  disabled={exportStep === 1 || isExporting}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button className="bg-gray-700 hover:bg-gray-600 text-white" size="sm"
                  onClick={() => setExportStep(Math.min(3, exportStep + 1))}
                  disabled={
                    (exportStep === 1 && exportConfig.tables.length === 0) ||
                    exportStep === 3 ||
                    isExporting
                  }
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Import Wizard */}
        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Import Wizard</CardTitle>
                  <CardDescription>Step {importStep} of 3</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={resetImportWizard}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
              {/* Progress Steps */}
              <div className="flex items-center gap-2 mt-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      importStep >= step ? 'bg-primary border-primary text-primary-foreground' : 'border-muted'
                    }`}>
                      {importStep > step ? <Check className="h-4 w-4" /> : step}
                    </div>
                    {step < 3 && (
                      <div className={`flex-1 h-0.5 mx-2 ${
                        importStep > step ? 'bg-primary' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Upload File */}
              {importStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Upload File</h3>

                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">Choose a file to import</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supported formats: CSV, Excel, JSON, XML
                    </p>
                    <Input
                      type="file"
                      accept=".csv,.xlsx,.xls,.json,.xml"
                      onChange={handleFileChange}
                      className="max-w-xs mx-auto"
                    />
                  </div>

                  {importPreview && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>File Loaded:</strong> {importPreview.filename}
                        <div className="mt-2 text-sm space-y-1">
                          <div>• Size: {importPreview.size}</div>
                          <div>• Rows: {importPreview.rows.toLocaleString()}</div>
                          <div>• Columns: {importPreview.columns}</div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {/* Step 2: Configure Import */}
              {importStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Configure Import Settings</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="target-table">Target Table</Label>
                      <Select
                        value={importConfig.targetTable}
                        onValueChange={(value) => setImportConfig({ ...importConfig, targetTable: value })}
                      >
                        <SelectTrigger id="target-table">
                          <SelectValue placeholder="Select table..." />
                        </SelectTrigger>
                        <SelectContent>
                          {tables.map((table) => (
                            <SelectItem key={table.id} value={table.id}>
                              {table.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="import-mode">Import Mode</Label>
                      <Select
                        value={importConfig.mode}
                        onValueChange={(value) => setImportConfig({ ...importConfig, mode: value })}
                      >
                        <SelectTrigger id="import-mode">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {importModes.map((mode) => (
                            <SelectItem key={mode.value} value={mode.value}>
                              <div>
                                <div className="font-medium">{mode.label}</div>
                                <div className="text-xs text-muted-foreground">{mode.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="batch-size">Batch Size</Label>
                      <Input
                        id="batch-size"
                        type="number"
                        value={importConfig.batchSize}
                        onChange={(e) => setImportConfig({ ...importConfig, batchSize: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="skip-errors">Skip Errors</Label>
                      <Checkbox
                        id="skip-errors"
                        checked={importConfig.skipErrors}
                        onCheckedChange={(checked) => setImportConfig({ ...importConfig, skipErrors: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="validate-data">Validate Data</Label>
                      <Checkbox
                        id="validate-data"
                        checked={importConfig.validateData}
                        onCheckedChange={(checked) => setImportConfig({ ...importConfig, validateData: checked })}
                      />
                    </div>
                  </div>

                  {importPreview && (
                    <div className="space-y-2">
                      <Label>Data Preview</Label>
                      <div className="border rounded-lg overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-muted">
                            <tr>
                              {Object.keys(importPreview.sampleData[0]).map((key) => (
                                <th key={key} className="p-2 text-left text-sm font-medium">
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {importPreview.sampleData.map((row, index) => (
                              <tr key={index} className="border-t">
                                {Object.values(row).map((value, i) => (
                                  <td key={i} className="p-2 text-sm">
                                    {String(value)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Showing first 3 rows of {importPreview.rows} total rows
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Review and Import */}
              {importStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Review and Import</h3>

                  <div className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">File:</span>
                      <span className="font-medium">{importConfig.file?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Target Table:</span>
                      <span className="font-medium">
                        {tables.find(t => t.id === importConfig.targetTable)?.name || 'Not selected'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Import Mode:</span>
                      <span className="font-medium">
                        {importModes.find(m => m.value === importConfig.mode)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Batch Size:</span>
                      <span className="font-medium">{importConfig.batchSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Skip Errors:</span>
                      <span className="font-medium">{importConfig.skipErrors ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Validate Data:</span>
                      <span className="font-medium">{importConfig.validateData ? 'Yes' : 'No'}</span>
                    </div>
                  </div>

                  {isImporting && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Importing...</span>
                        <span>{importProgress}%</span>
                      </div>
                      <Progress value={importProgress} />
                    </div>
                  )}

                  {importResult && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Import Successful!</strong>
                        <div className="mt-2 text-sm space-y-1">
                          <div>• Imported: {importResult.imported.toLocaleString()} records</div>
                          <div>• Updated: {importResult.updated.toLocaleString()} records</div>
                          <div>• Skipped: {importResult.skipped.toLocaleString()} records</div>
                          <div>• Failed: {importResult.failed.toLocaleString()} records</div>
                          <div>• Duration: {importResult.duration}</div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {!isImporting && !importResult && (
                    <Button className="bg-gray-700 hover:bg-gray-600 text-white w-full" onClick={handleImport} size="lg">
                      <Play className="h-4 w-4 mr-2" />
                      Start Import
                    </Button>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button size="sm"
                  variant="outline"
                  onClick={() => setImportStep(Math.max(1, importStep - 1))}
                  disabled={importStep === 1 || isImporting}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button className="bg-gray-700 hover:bg-gray-600 text-white" size="sm"
                  onClick={() => setImportStep(Math.min(3, importStep + 1))}
                  disabled={
                    (importStep === 1 && !importConfig.file) ||
                    (importStep === 2 && !importConfig.targetTable) ||
                    importStep === 3 ||
                    isImporting
                  }
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
