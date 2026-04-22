import React, { useState } from 'react';
import { Layers, Play, Upload, Download, Trash2, Edit, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function BulkOperations() {
  const [operation, setOperation] = useState('update');
  const [targetTable, setTargetTable] = useState('products');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);

  const [updateFields, setUpdateFields] = useState({
    field: '',
    value: ''
  });

  const [deleteCondition, setDeleteCondition] = useState('');

  const tables = ['products', 'orders', 'customers', 'categories', 'inventory'];

  const sampleRecords = [
    { id: 1, name: 'Product A', price: 99.99, stock: 50, category: 'Electronics' },
    { id: 2, name: 'Product B', price: 149.99, stock: 30, category: 'Electronics' },
    { id: 3, name: 'Product C', price: 79.99, stock: 100, category: 'Clothing' },
    { id: 4, name: 'Product D', price: 199.99, stock: 20, category: 'Electronics' },
    { id: 5, name: 'Product E', price: 59.99, stock: 75, category: 'Clothing' }
  ];

  const [operationHistory, setOperationHistory] = useState([
    {
      id: 1,
      date: '2025-10-06 15:30:00',
      operation: 'Update',
      table: 'products',
      records: 150,
      status: 'completed',
      duration: '2.5s'
    },
    {
      id: 2,
      date: '2025-10-06 14:15:00',
      operation: 'Delete',
      table: 'orders',
      records: 25,
      status: 'completed',
      duration: '1.2s'
    },
    {
      id: 3,
      date: '2025-10-06 13:00:00',
      operation: 'Import',
      table: 'customers',
      records: 500,
      status: 'completed',
      duration: '8.7s'
    },
    {
      id: 4,
      date: '2025-10-06 11:45:00',
      operation: 'Update',
      table: 'inventory',
      records: 300,
      status: 'failed',
      duration: '3.1s',
      error: 'Invalid data format'
    }
  ]);

  const toggleRecord = (id) => {
    setSelectedRecords(prev =>
      prev.includes(id)
        ? prev.filter(r => r !== id)
        : [...prev, id]
    );
  };

  const selectAllRecords = () => {
    setSelectedRecords(sampleRecords.map(r => r.id));
  };

  const deselectAllRecords = () => {
    setSelectedRecords([]);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setUploadedFile(file);
    setResult(null);
  };

  const handleExecute = async () => {
    setIsProcessing(true);
    setProgress(0);
    setResult(null);

    // Simulate processing
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setProgress(i);
    }

    const recordCount = operation === 'import' 
      ? Math.floor(Math.random() * 500) + 100
      : selectedRecords.length;

    const newOperation = {
      id: operationHistory.length + 1,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      operation: operation.charAt(0).toUpperCase() + operation.slice(1),
      table: targetTable,
      records: recordCount,
      status: 'completed',
      duration: `${(Math.random() * 5 + 1).toFixed(1)}s`
    };

    setOperationHistory([newOperation, ...operationHistory]);
    setIsProcessing(false);
    setResult({
      success: true,
      operation: operation,
      records: recordCount,
      duration: newOperation.duration
    });
  };

  const getOperationIcon = (op) => {
    switch (op.toLowerCase()) {
      case 'update':
        return <Edit className="w-4 h-4" />;
      case 'delete':
        return <Trash2 className="w-4 h-4" />;
      case 'import':
        return <Upload className="w-4 h-4" />;
      case 'export':
        return <Download className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    return status === 'completed' ? 'bg-green-500' : 'bg-red-500';
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bulk Operations</h1>
        <p className="text-muted-foreground mt-2">
          Perform operations on multiple records at once
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operationHistory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {operationHistory.filter(o => o.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {operationHistory.filter(o => o.status === 'failed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Records Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {operationHistory.reduce((sum, o) => sum + o.records, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operation Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configure Bulk Operation</CardTitle>
          <CardDescription>Select operation type and configure settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Operation Type</Label>
              <Select value={operation} onValueChange={setOperation}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="update">Bulk Update</SelectItem>
                  <SelectItem value="delete">Bulk Delete</SelectItem>
                  <SelectItem value="import">Bulk Import</SelectItem>
                  <SelectItem value="export">Bulk Export</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Target Table</Label>
              <Select value={targetTable} onValueChange={setTargetTable}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tables.map(table => (
                    <SelectItem key={table} value={table}>
                      {table.charAt(0).toUpperCase() + table.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Update Fields */}
          {operation === 'update' && (
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold">Update Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Field to Update</Label>
                  <Input
                    placeholder="e.g., price"
                    value={updateFields.field}
                    onChange={(e) => setUpdateFields({ ...updateFields, field: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>New Value</Label>
                  <Input
                    placeholder="e.g., 99.99"
                    value={updateFields.value}
                    onChange={(e) => setUpdateFields({ ...updateFields, value: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Delete Condition */}
          {operation === 'delete' && (
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold">Delete Configuration</h3>
              <Alert className="border-red-500">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription>
                  <strong>Warning:</strong> This operation cannot be undone. Make sure to backup your data first.
                </AlertDescription>
              </Alert>
              <div>
                <Label>Delete Condition (SQL WHERE clause)</Label>
                <Textarea
                  placeholder="e.g., stock = 0 AND created_at < '2024-01-01'"
                  value={deleteCondition}
                  onChange={(e) => setDeleteCondition(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Import File */}
          {operation === 'import' && (
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold">Import Configuration</h3>
              <div>
                <Label>Select File</Label>
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".csv,.xlsx,.json"
                  className="mt-2 cursor-pointer"
                />
                {uploadedFile && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="skip-duplicates" defaultChecked />
                <Label htmlFor="skip-duplicates" className="text-sm font-normal">
                  Skip duplicate records
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="validate-data" defaultChecked />
                <Label htmlFor="validate-data" className="text-sm font-normal">
                  Validate data before import
                </Label>
              </div>
            </div>
          )}

          {/* Export Options */}
          {operation === 'export' && (
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold">Export Configuration</h3>
              <div>
                <Label>Export Format</Label>
                <Select defaultValue="csv">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="xml">XML</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="include-headers" defaultChecked />
                <Label htmlFor="include-headers" className="text-sm font-normal">
                  Include column headers
                </Label>
              </div>
            </div>
          )}

          {/* Record Selection */}
          {(operation === 'update' || operation === 'delete' || operation === 'export') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Select Records ({selectedRecords.length} selected)</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={selectAllRecords}>
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={deselectAllRecords}>
                    Deselect All
                  </Button>
                </div>
              </div>

              {/* Bulk Actions Toolbar */}
              {selectedRecords.length > 0 && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-gray-700 hover:bg-gray-600 text-white text-base px-3 py-1">
                        {selectedRecords.length} {selectedRecords.length === 1 ? 'record' : 'records'} selected
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Choose an action to apply to selected records
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        className="bg-gray-700 hover:bg-gray-600 text-white" 
                        size="sm"
                        onClick={() => {
                          setOperation('update');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Bulk Update
                      </Button>
                      <Button 
                        className="bg-gray-700 hover:bg-gray-600 text-white" 
                        size="sm"
                        onClick={() => {
                          setOperation('export');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Selected
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${selectedRecords.length} records?`)) {
                            setOperation('delete');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Selected
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedRecords.length === sampleRecords.length}
                          onCheckedChange={(checked) => 
                            checked ? selectAllRecords() : deselectAllRecords()
                          }
                        />
                      </TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Category</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedRecords.includes(record.id)}
                            onCheckedChange={() => toggleRecord(record.id)}
                          />
                        </TableCell>
                        <TableCell>{record.id}</TableCell>
                        <TableCell>{record.name}</TableCell>
                        <TableCell>${record.price}</TableCell>
                        <TableCell>{record.stock}</TableCell>
                        <TableCell>{record.category}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Processing {operation}...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {result && (
            <Alert className="border-green-500">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-semibold">Operation completed successfully!</p>
                  <p className="text-sm">
                    {result.operation.charAt(0).toUpperCase() + result.operation.slice(1)}ed {result.records} records
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Duration: {result.duration}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Button size="sm" 
            onClick={handleExecute} 
            disabled={isProcessing || (operation !== 'import' && selectedRecords.length === 0)}
            className="bg-gray-700 hover:bg-gray-600 text-white w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Execute {operation.charAt(0).toUpperCase() + operation.slice(1)}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Operation History */}
      <Card>
        <CardHeader>
          <CardTitle>Operation History</CardTitle>
          <CardDescription>Recent bulk operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {operationHistory.map((op) => (
              <div
                key={op.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      {getOperationIcon(op.operation)}
                      <span className="font-semibold">{op.operation}</span>
                      <Badge variant="outline">{op.table}</Badge>
                      <Badge className={getStatusColor(op.status)}>
                        {op.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {op.records.toLocaleString()} records • {op.duration} • {op.date}
                    </div>
                    {op.error && (
                      <p className="text-sm text-red-500">Error: {op.error}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
