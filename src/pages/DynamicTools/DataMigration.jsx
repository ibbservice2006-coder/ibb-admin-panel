import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast'
import { Database, ArrowRight, Play, CheckCircle, AlertCircle, Loader2, Settings, FileText, Table } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function DataMigration() {
  const { toast } = useToast()
  const handleConfig = (name) => {
    toast({ title: `Configure ${name || 'Platform'}`, description: 'Settings page opened' })
  }

  const [sourceType, setSourceType] = useState('mysql');
  const [targetType, setTargetType] = useState('postgresql');
  const [selectedTables, setSelectedTables] = useState([]);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [migrationResult, setMigrationResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const [sourceConfig, setSourceConfig] = useState({
    host: '',
    port: '',
    database: '',
    username: '',
    password: ''
  });

  const [targetConfig, setTargetConfig] = useState({
    host: '',
    port: '',
    database: '',
    username: '',
    password: ''
  });

  const [migrationHistory, setMigrationHistory] = useState([
    {
      id: 1,
      date: '2025-10-05 14:30:00',
      source: 'MySQL',
      target: 'PostgreSQL',
      tables: 8,
      records: 125000,
      status: 'completed',
      duration: '12m 34s'
    },
    {
      id: 2,
      date: '2025-09-28 10:15:00',
      source: 'MongoDB',
      target: 'MySQL',
      tables: 5,
      records: 85000,
      status: 'completed',
      duration: '8m 45s'
    },
    {
      id: 3,
      date: '2025-09-20 16:45:00',
      source: 'SQLite',
      target: 'PostgreSQL',
      tables: 12,
      records: 45000,
      status: 'failed',
      duration: '3m 12s',
      error: 'Connection timeout'
    }
  ]);

  const availableTables = [
    { name: 'products', records: 1250, size: '2.4 MB' },
    { name: 'orders', records: 3420, size: '5.8 MB' },
    { name: 'customers', records: 890, size: '1.2 MB' },
    { name: 'categories', records: 45, size: '128 KB' },
    { name: 'inventory', records: 2100, size: '3.1 MB' },
    { name: 'payments', records: 3200, size: '4.5 MB' },
    { name: 'shipments', records: 2800, size: '3.9 MB' },
    { name: 'reviews', records: 1560, size: '2.1 MB' }
  ];

  const databaseTypes = [
    { value: 'mysql', label: 'MySQL', port: '3306' },
    { value: 'postgresql', label: 'PostgreSQL', port: '5432' },
    { value: 'mongodb', label: 'MongoDB', port: '27017' },
    { value: 'sqlserver', label: 'SQL Server', port: '1433' },
    { value: 'oracle', label: 'Oracle', port: '1521' },
    { value: 'sqlite', label: 'SQLite', port: 'N/A' }
  ];

  const handleSourceTypeChange = (value) => {
    setSourceType(value);
    const dbType = databaseTypes.find(db => db.value === value);
    setSourceConfig({ ...sourceConfig, port: dbType.port });
  };

  const handleTargetTypeChange = (value) => {
    setTargetType(value);
    const dbType = databaseTypes.find(db => db.value === value);
    setTargetConfig({ ...targetConfig, port: dbType.port });
  };

  const toggleTable = (tableName) => {
    setSelectedTables(prev =>
      prev.includes(tableName)
        ? prev.filter(t => t !== tableName)
        : [...prev, tableName]
    );
  };

  const selectAllTables = () => {
    setSelectedTables(availableTables.map(t => t.name));
  };

  const deselectAllTables = () => {
    setSelectedTables([]);
  };

  const handleStartMigration = async () => {
    setIsMigrating(true);
    setMigrationProgress(0);
    setMigrationResult(null);

    // Simulate migration process
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setMigrationProgress(i);
    }

    const totalRecords = selectedTables.reduce((sum, tableName) => {
      const table = availableTables.find(t => t.name === tableName);
      return sum + (table?.records || 0);
    }, 0);

    const newMigration = {
      id: migrationHistory.length + 1,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      source: databaseTypes.find(db => db.value === sourceType).label,
      target: databaseTypes.find(db => db.value === targetType).label,
      tables: selectedTables.length,
      records: totalRecords,
      status: 'completed',
      duration: '10m 25s'
    };

    setMigrationHistory([newMigration, ...migrationHistory]);
    setIsMigrating(false);
    setMigrationResult({
      success: true,
      tables: selectedTables.length,
      records: totalRecords,
      duration: '10m 25s'
    });
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToStep2 = sourceConfig.host && sourceConfig.database && targetConfig.host && targetConfig.database;
  const canProceedToStep3 = selectedTables.length > 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Data Migration</h1>
        <p className="text-muted-foreground mt-2">
          Migrate data between different database systems
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep === step 
                  ? 'bg-primary text-primary-foreground' 
                  : currentStep > step 
                    ? 'bg-green-500 text-white' 
                    : 'bg-muted text-muted-foreground'
              }`}>
                {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
              </div>
              <span className="text-sm font-medium">
                {step === 1 && 'Configure'}
                {step === 2 && 'Select Data'}
                {step === 3 && 'Migrate'}
              </span>
            </div>
            {step < 3 && <ArrowRight className="w-5 h-5 text-muted-foreground" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Configure Connections */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source Database */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Source Database
                </CardTitle>
                <CardDescription>Configure source database connection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Database Type</Label>
                  <Select value={sourceType} onValueChange={handleSourceTypeChange}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {databaseTypes.map(db => (
                        <SelectItem key={db.value} value={db.value}>{db.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Host</Label>
                  <Input
                    placeholder="localhost"
                    value={sourceConfig.host}
                    onChange={(e) => setSourceConfig({ ...sourceConfig, host: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Port</Label>
                  <Input
                    placeholder="3306"
                    value={sourceConfig.port}
                    onChange={(e) => setSourceConfig({ ...sourceConfig, port: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Database Name</Label>
                  <Input
                    placeholder="my_database"
                    value={sourceConfig.database}
                    onChange={(e) => setSourceConfig({ ...sourceConfig, database: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Username</Label>
                  <Input
                    placeholder="root"
                    value={sourceConfig.username}
                    onChange={(e) => setSourceConfig({ ...sourceConfig, username: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={sourceConfig.password}
                    onChange={(e) => setSourceConfig({ ...sourceConfig, password: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <Button size="sm" variant="outline" className="w-full" onClick={() => handleConfig('Platform')}>Test Connection</Button>
              </CardContent>
            </Card>

            {/* Target Database */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Target Database
                </CardTitle>
                <CardDescription>Configure target database connection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Database Type</Label>
                  <Select value={targetType} onValueChange={handleTargetTypeChange}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {databaseTypes.map(db => (
                        <SelectItem key={db.value} value={db.value}>{db.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Host</Label>
                  <Input
                    placeholder="localhost"
                    value={targetConfig.host}
                    onChange={(e) => setTargetConfig({ ...targetConfig, host: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Port</Label>
                  <Input
                    placeholder="5432"
                    value={targetConfig.port}
                    onChange={(e) => setTargetConfig({ ...targetConfig, port: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Database Name</Label>
                  <Input
                    placeholder="target_database"
                    value={targetConfig.database}
                    onChange={(e) => setTargetConfig({ ...targetConfig, database: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Username</Label>
                  <Input
                    placeholder="postgres"
                    value={targetConfig.username}
                    onChange={(e) => setTargetConfig({ ...targetConfig, username: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={targetConfig.password}
                    onChange={(e) => setTargetConfig({ ...targetConfig, password: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <Button size="sm" variant="outline" className="w-full" onClick={() => handleConfig('Platform')}>Test Connection</Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleNextStep} disabled={!canProceedToStep2}>
              Next: Select Data
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Select Tables */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Select Tables to Migrate</CardTitle>
                  <CardDescription>Choose which tables to migrate from source to target</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={selectAllTables}>
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={deselectAllTables}>
                    Deselect All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg divide-y">
                {availableTables.map((table) => (
                  <div
                    key={table.name}
                    className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleTable(table.name)}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedTables.includes(table.name)}
                        onCheckedChange={() => toggleTable(table.name)}
                      />
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          <Table className="w-4 h-4" />
                          {table.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {table.records.toLocaleString()} records • {table.size}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{table.size}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button size="sm" variant="outline" onClick={handlePrevStep}>
              Back
            </Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleNextStep} disabled={!canProceedToStep3}>
              Next: Review & Migrate
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Migrate */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Migration Settings</CardTitle>
              <CardDescription>Verify your configuration before starting migration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-muted-foreground">Source Database</Label>
                  <p className="mt-1 font-medium">
                    {databaseTypes.find(db => db.value === sourceType).label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {sourceConfig.host}:{sourceConfig.port}/{sourceConfig.database}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Target Database</Label>
                  <p className="mt-1 font-medium">
                    {databaseTypes.find(db => db.value === targetType).label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {targetConfig.host}:{targetConfig.port}/{targetConfig.database}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Selected Tables ({selectedTables.length})</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedTables.map(tableName => (
                    <Badge key={tableName} variant="secondary">{tableName}</Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="create-backup" defaultChecked />
                  <Label htmlFor="create-backup" className="text-sm font-normal">
                    Create backup before migration
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="preserve-ids" defaultChecked />
                  <Label htmlFor="preserve-ids" className="text-sm font-normal">
                    Preserve record IDs
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="validate-data" defaultChecked />
                  <Label htmlFor="validate-data" className="text-sm font-normal">
                    Validate data after migration
                  </Label>
                </div>
              </div>

              {isMigrating && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Migrating data...</span>
                    <span>{migrationProgress}%</span>
                  </div>
                  <Progress value={migrationProgress} />
                </div>
              )}

              {migrationResult && (
                <Alert className="border-green-500">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-semibold">Migration completed successfully!</p>
                      <p className="text-sm">
                        Migrated {migrationResult.tables} tables with {migrationResult.records.toLocaleString()} total records
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Duration: {migrationResult.duration}
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button size="sm" variant="outline" onClick={handlePrevStep} disabled={isMigrating}>
              Back
            </Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleStartMigration} disabled={isMigrating}>
              {isMigrating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Migrating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Migration
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Migration History */}
      <Card>
        <CardHeader>
          <CardTitle>Migration History</CardTitle>
          <CardDescription>Previous migration operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {migrationHistory.map((migration) => (
              <div
                key={migration.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={migration.status === 'completed' ? 'bg-green-500' : 'bg-red-500'}>
                        {migration.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{migration.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{migration.source}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{migration.target}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {migration.tables} tables • {migration.records.toLocaleString()} records • {migration.duration}
                    </div>
                    {migration.error && (
                      <p className="text-sm text-red-500">Error: {migration.error}</p>
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
