import React, { useState } from 'react';
import { Upload, Download, FileText, Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ImportExport() {
  const [importFile, setImportFile] = useState(null);
  const [importFormat, setImportFormat] = useState('csv');
  const [exportFormat, setExportFormat] = useState('csv');
  const [selectedTables, setSelectedTables] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [exportProgress, setExportProgress] = useState(0);
  const [importResult, setImportResult] = useState(null);
  const [exportResult, setExportResult] = useState(null);

  const tables = [
    { id: 'products', name: 'Products', records: 1250 },
    { id: 'orders', name: 'Orders', records: 3420 },
    { id: 'customers', name: 'Customers', records: 890 },
    { id: 'categories', name: 'Categories', records: 45 },
    { id: 'inventory', name: 'Inventory', records: 2100 },
    { id: 'payments', name: 'Payments', records: 3200 },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImportFile(file);
    setImportResult(null);
  };

  const handleImport = async () => {
    if (!importFile) return;
    
    setIsImporting(true);
    setImportProgress(0);
    setImportResult(null);

    // Simulate import process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setImportProgress(i);
    }

    setIsImporting(false);
    setImportResult({
      success: true,
      imported: 1250,
      updated: 320,
      failed: 5,
      duration: '2.3s'
    });
  };

  const handleExport = async () => {
    if (selectedTables.length === 0) return;
    
    setIsExporting(true);
    setExportProgress(0);
    setExportResult(null);

    // Simulate export process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setExportProgress(i);
    }

    setIsExporting(false);
    setExportResult({
      success: true,
      tables: selectedTables.length,
      records: selectedTables.reduce((sum, id) => {
        const table = tables.find(t => t.id === id);
        return sum + (table?.records || 0);
      }, 0),
      fileSize: '2.4 MB',
      duration: '1.8s'
    });
  };

  const toggleTable = (tableId) => {
    setSelectedTables(prev =>
      prev.includes(tableId)
        ? prev.filter(id => id !== tableId)
        : [...prev, tableId]
    );
    setExportResult(null);
  };

  const selectAllTables = () => {
    setSelectedTables(tables.map(t => t.id));
    setExportResult(null);
  };

  const deselectAllTables = () => {
    setSelectedTables([]);
    setExportResult(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Import / Export</h1>
        <p className="text-muted-foreground mt-2">
          Import data from external sources or export your database to various formats
        </p>
      </div>

      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="import">
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </TabsTrigger>
          <TabsTrigger value="export">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </TabsTrigger>
        </TabsList>

        {/* Import Tab */}
        <TabsContent value="import" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Import Data</CardTitle>
              <CardDescription>
                Upload a file to import data into your database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="import-format">File Format</Label>
                  <Select value={importFormat} onValueChange={setImportFormat}>
                    <SelectTrigger id="import-format" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV (Comma Separated Values)</SelectItem>
                      <SelectItem value="json">JSON (JavaScript Object Notation)</SelectItem>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                      <SelectItem value="xml">XML (Extensible Markup Language)</SelectItem>
                      <SelectItem value="sql">SQL (Database Dump)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="import-file">Select File</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <input
                      id="import-file"
                      type="file"
                      onChange={handleFileChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                      accept={`.${importFormat}`}
                    />
                  </div>
                  {importFile && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected: {importFile.name} ({(importFile.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="validate" />
                  <Label htmlFor="validate" className="text-sm font-normal">
                    Validate data before importing
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="skip-duplicates" />
                  <Label htmlFor="skip-duplicates" className="text-sm font-normal">
                    Skip duplicate records
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="update-existing" />
                  <Label htmlFor="update-existing" className="text-sm font-normal">
                    Update existing records
                  </Label>
                </div>
              </div>

              {isImporting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Importing data...</span>
                    <span>{importProgress}%</span>
                  </div>
                  <Progress value={importProgress} />
                </div>
              )}

              {importResult && (
                <Alert className={importResult.success ? "border-green-500" : "border-red-500"}>
                  {importResult.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <AlertDescription>
                    {importResult.success ? (
                      <div className="space-y-1">
                        <p className="font-semibold">Import completed successfully!</p>
                        <p className="text-sm">
                          Imported: {importResult.imported} records | 
                          Updated: {importResult.updated} records | 
                          Failed: {importResult.failed} records
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Duration: {importResult.duration}
                        </p>
                      </div>
                    ) : (
                      <p>Import failed. Please check your file and try again.</p>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <Button size="sm" 
                onClick={handleImport} 
                disabled={!importFile || isImporting}
                className="bg-gray-700 hover:bg-gray-600 text-white w-full"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Start Import
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>
                Export your database tables to a file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="export-format">Export Format</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger id="export-format" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV (Comma Separated Values)</SelectItem>
                      <SelectItem value="json">JSON (JavaScript Object Notation)</SelectItem>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                      <SelectItem value="xml">XML (Extensible Markup Language)</SelectItem>
                      <SelectItem value="sql">SQL (Database Dump)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>Select Tables to Export</Label>
                    <div className="space-x-2">
                      <Button variant="ghost" size="sm" onClick={selectAllTables}>
                        Select All
                      </Button>
                      <Button variant="ghost" size="sm" onClick={deselectAllTables}>
                        Deselect All
                      </Button>
                    </div>
                  </div>
                  <div className="border rounded-lg divide-y">
                    {tables.map((table) => (
                      <div
                        key={table.id}
                        className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer"
                        onClick={() => toggleTable(table.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={selectedTables.includes(table.id)}
                            onCheckedChange={() => toggleTable(table.id)}
                          />
                          <div>
                            <p className="font-medium">{table.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {table.records.toLocaleString()} records
                            </p>
                          </div>
                        </div>
                        <Database className="w-5 h-5 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="include-schema" defaultChecked />
                  <Label htmlFor="include-schema" className="text-sm font-normal">
                    Include table schema
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="compress" />
                  <Label htmlFor="compress" className="text-sm font-normal">
                    Compress export file (ZIP)
                  </Label>
                </div>
              </div>

              {isExporting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Exporting data...</span>
                    <span>{exportProgress}%</span>
                  </div>
                  <Progress value={exportProgress} />
                </div>
              )}

              {exportResult && (
                <Alert className="border-green-500">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-semibold">Export completed successfully!</p>
                      <p className="text-sm">
                        Exported {exportResult.tables} tables with {exportResult.records.toLocaleString()} total records
                      </p>
                      <p className="text-sm text-muted-foreground">
                        File size: {exportResult.fileSize} | Duration: {exportResult.duration}
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <Button size="sm" 
                onClick={handleExport} 
                disabled={selectedTables.length === 0 || isExporting}
                className="bg-gray-700 hover:bg-gray-600 text-white w-full"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export Data ({selectedTables.length} tables)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
