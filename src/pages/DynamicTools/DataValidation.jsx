import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Play, Settings, FileText, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function DataValidation() {
  const [selectedTable, setSelectedTable] = useState('products');
  const [isValidating, setIsValidating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [validationResult, setValidationResult] = useState(null);

  const [validationRules, setValidationRules] = useState({
    products: [
      { id: 1, field: 'name', rule: 'required', enabled: true },
      { id: 2, field: 'price', rule: 'numeric', enabled: true },
      { id: 3, field: 'price', rule: 'min:0', enabled: true },
      { id: 4, field: 'stock', rule: 'integer', enabled: true },
      { id: 5, field: 'email', rule: 'email', enabled: true },
      { id: 6, field: 'sku', rule: 'unique', enabled: true }
    ],
    orders: [
      { id: 1, field: 'order_id', rule: 'required', enabled: true },
      { id: 2, field: 'total', rule: 'numeric', enabled: true },
      { id: 3, field: 'status', rule: 'in:pending,completed,cancelled', enabled: true }
    ],
    customers: [
      { id: 1, field: 'email', rule: 'email', enabled: true },
      { id: 2, field: 'phone', rule: 'phone', enabled: true },
      { id: 3, field: 'name', rule: 'required', enabled: true }
    ]
  });

  const tables = ['products', 'orders', 'customers', 'categories', 'inventory'];

  const [validationHistory, setValidationHistory] = useState([
    {
      id: 1,
      date: '2025-10-06 16:00:00',
      table: 'products',
      totalRecords: 1250,
      validRecords: 1180,
      invalidRecords: 70,
      warnings: 15,
      duration: '3.2s'
    },
    {
      id: 2,
      date: '2025-10-06 14:30:00',
      table: 'orders',
      totalRecords: 3420,
      validRecords: 3400,
      invalidRecords: 20,
      warnings: 5,
      duration: '5.8s'
    },
    {
      id: 3,
      date: '2025-10-06 12:15:00',
      table: 'customers',
      totalRecords: 890,
      validRecords: 875,
      invalidRecords: 15,
      warnings: 8,
      duration: '1.5s'
    }
  ]);

  const sampleIssues = [
    {
      id: 1,
      severity: 'error',
      field: 'price',
      record: 'Product #123',
      issue: 'Invalid value: -10.50',
      rule: 'min:0',
      suggestion: 'Price must be greater than or equal to 0'
    },
    {
      id: 2,
      severity: 'error',
      field: 'email',
      record: 'Customer #456',
      issue: 'Invalid format: user@invalid',
      rule: 'email',
      suggestion: 'Must be a valid email address'
    },
    {
      id: 3,
      severity: 'warning',
      field: 'stock',
      record: 'Product #789',
      issue: 'Low stock: 2',
      rule: 'min:10',
      suggestion: 'Stock level below recommended minimum'
    },
    {
      id: 4,
      severity: 'error',
      field: 'sku',
      record: 'Product #234',
      issue: 'Duplicate value: SKU-001',
      rule: 'unique',
      suggestion: 'SKU must be unique across all products'
    },
    {
      id: 5,
      severity: 'warning',
      field: 'description',
      record: 'Product #567',
      issue: 'Missing value',
      rule: 'recommended',
      suggestion: 'Description is recommended for better SEO'
    }
  ];

  const handleValidate = async () => {
    setIsValidating(true);
    setProgress(0);
    setValidationResult(null);

    // Simulate validation
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setProgress(i);
    }

    const totalRecords = Math.floor(Math.random() * 1000) + 500;
    const invalidRecords = Math.floor(Math.random() * 50) + 10;
    const warnings = Math.floor(Math.random() * 20) + 5;

    const newValidation = {
      id: validationHistory.length + 1,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      table: selectedTable,
      totalRecords: totalRecords,
      validRecords: totalRecords - invalidRecords,
      invalidRecords: invalidRecords,
      warnings: warnings,
      duration: `${(Math.random() * 5 + 1).toFixed(1)}s`
    };

    setValidationHistory([newValidation, ...validationHistory]);
    setIsValidating(false);
    setValidationResult(newValidation);
  };

  const toggleRule = (ruleId) => {
    setValidationRules({
      ...validationRules,
      [selectedTable]: validationRules[selectedTable].map(rule =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    });
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error':
        return <XCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Data Validation</h1>
        <p className="text-muted-foreground mt-2">
          Validate data integrity and quality across your database
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Validations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{validationHistory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valid Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {validationHistory.reduce((sum, v) => sum + v.validRecords, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Invalid Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {validationHistory.reduce((sum, v) => sum + v.invalidRecords, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {validationHistory.reduce((sum, v) => sum + v.warnings, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="validate" className="w-full">
        <TabsList>
          <TabsTrigger value="validate">
            <Play className="w-4 h-4 mr-2" />
            Validate
          </TabsTrigger>
          <TabsTrigger value="rules">
            <Settings className="w-4 h-4 mr-2" />
            Rules
          </TabsTrigger>
          <TabsTrigger value="issues">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Issues
          </TabsTrigger>
        </TabsList>

        {/* Validate Tab */}
        <TabsContent value="validate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Run Validation</CardTitle>
              <CardDescription>Select a table and run validation checks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Select Table</Label>
                <Select value={selectedTable} onValueChange={setSelectedTable}>
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

              <div className="space-y-2">
                <Label>Active Rules ({validationRules[selectedTable]?.filter(r => r.enabled).length || 0})</Label>
                <div className="p-4 border rounded-lg space-y-2">
                  {validationRules[selectedTable]?.map(rule => (
                    <div key={rule.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={rule.enabled}
                          onCheckedChange={() => toggleRule(rule.id)}
                        />
                        <span className="text-sm">
                          <span className="font-medium">{rule.field}</span> - {rule.rule}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {isValidating && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Validating data...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              {validationResult && (
                <div className="p-4 border rounded-lg space-y-3">
                  <h3 className="font-semibold">Validation Results</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Records</p>
                      <p className="text-2xl font-bold">{validationResult.totalRecords.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valid</p>
                      <p className="text-2xl font-bold text-green-600">{validationResult.validRecords.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Invalid</p>
                      <p className="text-2xl font-bold text-red-600">{validationResult.invalidRecords.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Warnings</p>
                      <p className="text-2xl font-bold text-yellow-600">{validationResult.warnings.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Duration: {validationResult.duration}</p>
                </div>
              )}

              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white w-full" onClick={handleValidate} disabled={isValidating}>
                {isValidating ? (
                  <>
                    <Play className="w-4 h-4 mr-2 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Validation
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Validation History */}
          <Card>
            <CardHeader>
              <CardTitle>Validation History</CardTitle>
              <CardDescription>Recent validation runs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {validationHistory.map((validation) => (
                  <div
                    key={validation.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Database className="w-4 h-4" />
                          <span className="font-semibold">{validation.table}</span>
                          <Badge variant="outline">{validation.date}</Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Total</p>
                            <p className="font-medium">{validation.totalRecords.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Valid</p>
                            <p className="font-medium text-green-600">{validation.validRecords.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Invalid</p>
                            <p className="font-medium text-red-600">{validation.invalidRecords.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Warnings</p>
                            <p className="font-medium text-yellow-600">{validation.warnings.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Validation Rules</CardTitle>
              <CardDescription>Configure validation rules for each table</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {tables.map((table) => (
                  <AccordionItem key={table} value={table}>
                    <AccordionTrigger className="capitalize">
                      {table} ({validationRules[table]?.length || 0} rules)
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        {validationRules[table]?.map((rule) => (
                          <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Checkbox checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                              <div>
                                <p className="font-medium">{rule.field}</p>
                                <p className="text-sm text-muted-foreground">{rule.rule}</p>
                              </div>
                            </div>
                            <Badge variant={rule.enabled ? "default" : "secondary"}>
                              {rule.enabled ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        )) || <p className="text-sm text-muted-foreground">No rules configured</p>}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Issues Tab */}
        <TabsContent value="issues">
          <Card>
            <CardHeader>
              <CardTitle>Validation Issues</CardTitle>
              <CardDescription>Current data quality issues found</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Severity</TableHead>
                    <TableHead>Field</TableHead>
                    <TableHead>Record</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Rule</TableHead>
                    <TableHead>Suggestion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell>
                        <Badge className={getSeverityColor(issue.severity)}>
                          <span className="flex items-center gap-1">
                            {getSeverityIcon(issue.severity)}
                            {issue.severity}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{issue.field}</TableCell>
                      <TableCell>{issue.record}</TableCell>
                      <TableCell>{issue.issue}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{issue.rule}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {issue.suggestion}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
