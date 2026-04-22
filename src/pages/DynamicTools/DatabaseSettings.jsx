import React, { useState } from 'react';
import { Database, Server, HardDrive, Zap, Shield, RefreshCw, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

export default function DatabaseSettings() {
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [connectionSettings, setConnectionSettings] = useState({
    host: 'localhost',
    port: '5432',
    database: 'ecommerce_db',
    username: 'admin',
    maxConnections: 100,
    connectionTimeout: 30,
    idleTimeout: 600
  });

  const [performanceSettings, setPerformanceSettings] = useState({
    cacheEnabled: true,
    cacheSize: 512,
    queryTimeout: 30,
    enableQueryLog: false,
    slowQueryThreshold: 1000,
    enableIndexing: true
  });

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    backupTime: '02:00',
    retentionDays: 30,
    compressionEnabled: true,
    encryptionEnabled: true
  });

  const [maintenanceSettings, setMaintenanceSettings] = useState({
    autoVacuum: true,
    autoAnalyze: true,
    autoOptimize: true,
    maintenanceWindow: 'night',
    reindexFrequency: 'weekly'
  });

  const [dbStats, setDbStats] = useState({
    totalSize: '2.4 GB',
    tableCount: 45,
    indexCount: 128,
    activeConnections: 12,
    cacheHitRate: 98.5,
    avgQueryTime: '45ms',
    uptime: '15 days 8 hours'
  });

  const handleSaveSettings = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestConnection = () => {
    // Simulate connection test
    alert('Connection test successful!');
  };

  const handleOptimizeDatabase = () => {
    // Simulate database optimization
    alert('Database optimization started. This may take a few minutes.');
  };

  const handleReindexDatabase = () => {
    // Simulate reindexing
    alert('Database reindexing started. This may take a few minutes.');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Database Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure database connection, performance, and maintenance settings
          </p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveSettings}>
          <Save className="w-4 h-4 mr-2" />
          Save All Settings
        </Button>
      </div>

      {saveSuccess && (
        <Alert className="border-green-500">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription>
            Settings saved successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Database Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Database Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbStats.totalSize}</div>
            <p className="text-xs text-muted-foreground mt-1">{dbStats.tableCount} tables</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbStats.activeConnections}</div>
            <p className="text-xs text-muted-foreground mt-1">of {connectionSettings.maxConnections} max</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cache Hit Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{dbStats.cacheHitRate}%</div>
            <Progress value={dbStats.cacheHitRate} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Query Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbStats.avgQueryTime}</div>
            <p className="text-xs text-muted-foreground mt-1">Uptime: {dbStats.uptime}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="connection" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="connection">
            <Server className="w-4 h-4 mr-2" />
            Connection
          </TabsTrigger>
          <TabsTrigger value="performance">
            <Zap className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="backup">
            <Shield className="w-4 h-4 mr-2" />
            Backup
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            <RefreshCw className="w-4 h-4 mr-2" />
            Maintenance
          </TabsTrigger>
        </TabsList>

        {/* Connection Settings */}
        <TabsContent value="connection" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connection Configuration</CardTitle>
              <CardDescription>Configure database connection parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="db-host">Host</Label>
                  <Input
                    id="db-host"
                    value={connectionSettings.host}
                    onChange={(e) => setConnectionSettings({ ...connectionSettings, host: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="db-port">Port</Label>
                  <Input
                    id="db-port"
                    value={connectionSettings.port}
                    onChange={(e) => setConnectionSettings({ ...connectionSettings, port: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="db-name">Database Name</Label>
                  <Input
                    id="db-name"
                    value={connectionSettings.database}
                    onChange={(e) => setConnectionSettings({ ...connectionSettings, database: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="db-username">Username</Label>
                  <Input
                    id="db-username"
                    value={connectionSettings.username}
                    onChange={(e) => setConnectionSettings({ ...connectionSettings, username: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Max Connections: {connectionSettings.maxConnections}</Label>
                <Slider
                  value={[connectionSettings.maxConnections]}
                  onValueChange={(value) => setConnectionSettings({ ...connectionSettings, maxConnections: value[0] })}
                  max={500}
                  min={10}
                  step={10}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Maximum number of concurrent database connections
                </p>
              </div>

              <div>
                <Label>Connection Timeout: {connectionSettings.connectionTimeout}s</Label>
                <Slider
                  value={[connectionSettings.connectionTimeout]}
                  onValueChange={(value) => setConnectionSettings({ ...connectionSettings, connectionTimeout: value[0] })}
                  max={120}
                  min={5}
                  step={5}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Idle Timeout: {connectionSettings.idleTimeout}s</Label>
                <Slider
                  value={[connectionSettings.idleTimeout]}
                  onValueChange={(value) => setConnectionSettings({ ...connectionSettings, idleTimeout: value[0] })}
                  max={3600}
                  min={60}
                  step={60}
                  className="mt-2"
                />
              </div>

              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white w-full" onClick={handleTestConnection} variant="outline">
                Test Connection
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Settings */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Optimization</CardTitle>
              <CardDescription>Configure caching and query optimization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Query Cache</Label>
                  <p className="text-sm text-muted-foreground">
                    Cache frequently used query results
                  </p>
                </div>
                <Switch
                  checked={performanceSettings.cacheEnabled}
                  onCheckedChange={(checked) => setPerformanceSettings({ ...performanceSettings, cacheEnabled: checked })}
                />
              </div>

              {performanceSettings.cacheEnabled && (
                <div>
                  <Label>Cache Size: {performanceSettings.cacheSize} MB</Label>
                  <Slider
                    value={[performanceSettings.cacheSize]}
                    onValueChange={(value) => setPerformanceSettings({ ...performanceSettings, cacheSize: value[0] })}
                    max={2048}
                    min={64}
                    step={64}
                    className="mt-2"
                  />
                </div>
              )}

              <div>
                <Label>Query Timeout: {performanceSettings.queryTimeout}s</Label>
                <Slider
                  value={[performanceSettings.queryTimeout]}
                  onValueChange={(value) => setPerformanceSettings({ ...performanceSettings, queryTimeout: value[0] })}
                  max={300}
                  min={5}
                  step={5}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Maximum time allowed for query execution
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Query Logging</Label>
                  <p className="text-sm text-muted-foreground">
                    Log all database queries for debugging
                  </p>
                </div>
                <Switch
                  checked={performanceSettings.enableQueryLog}
                  onCheckedChange={(checked) => setPerformanceSettings({ ...performanceSettings, enableQueryLog: checked })}
                />
              </div>

              {performanceSettings.enableQueryLog && (
                <div>
                  <Label>Slow Query Threshold: {performanceSettings.slowQueryThreshold}ms</Label>
                  <Slider
                    value={[performanceSettings.slowQueryThreshold]}
                    onValueChange={(value) => setPerformanceSettings({ ...performanceSettings, slowQueryThreshold: value[0] })}
                    max={5000}
                    min={100}
                    step={100}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Log queries that take longer than this threshold
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Auto-Indexing</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically create indexes for frequently queried columns
                  </p>
                </div>
                <Switch
                  checked={performanceSettings.enableIndexing}
                  onCheckedChange={(checked) => setPerformanceSettings({ ...performanceSettings, enableIndexing: checked })}
                />
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Note:</strong> Performance settings changes may require database restart to take effect.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup Configuration</CardTitle>
              <CardDescription>Configure automatic backup settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Automatic Backup</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically backup database on schedule
                  </p>
                </div>
                <Switch
                  checked={backupSettings.autoBackup}
                  onCheckedChange={(checked) => setBackupSettings({ ...backupSettings, autoBackup: checked })}
                />
              </div>

              {backupSettings.autoBackup && (
                <>
                  <div>
                    <Label>Backup Frequency</Label>
                    <Select
                      value={backupSettings.backupFrequency}
                      onValueChange={(value) => setBackupSettings({ ...backupSettings, backupFrequency: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Backup Time</Label>
                    <Input
                      type="time"
                      value={backupSettings.backupTime}
                      onChange={(e) => setBackupSettings({ ...backupSettings, backupTime: e.target.value })}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Retention Period: {backupSettings.retentionDays} days</Label>
                    <Slider
                      value={[backupSettings.retentionDays]}
                      onValueChange={(value) => setBackupSettings({ ...backupSettings, retentionDays: value[0] })}
                      max={365}
                      min={7}
                      step={1}
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Backups older than this will be automatically deleted
                    </p>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Compression</Label>
                  <p className="text-sm text-muted-foreground">
                    Compress backup files to save storage space
                  </p>
                </div>
                <Switch
                  checked={backupSettings.compressionEnabled}
                  onCheckedChange={(checked) => setBackupSettings({ ...backupSettings, compressionEnabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Encryption</Label>
                  <p className="text-sm text-muted-foreground">
                    Encrypt backup files for security
                  </p>
                </div>
                <Switch
                  checked={backupSettings.encryptionEnabled}
                  onCheckedChange={(checked) => setBackupSettings({ ...backupSettings, encryptionEnabled: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Settings */}
        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Configuration</CardTitle>
              <CardDescription>Configure automatic maintenance tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Vacuum</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically reclaim storage space
                  </p>
                </div>
                <Switch
                  checked={maintenanceSettings.autoVacuum}
                  onCheckedChange={(checked) => setMaintenanceSettings({ ...maintenanceSettings, autoVacuum: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Analyze</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically update query planner statistics
                  </p>
                </div>
                <Switch
                  checked={maintenanceSettings.autoAnalyze}
                  onCheckedChange={(checked) => setMaintenanceSettings({ ...maintenanceSettings, autoAnalyze: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Optimize</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically optimize tables and indexes
                  </p>
                </div>
                <Switch
                  checked={maintenanceSettings.autoOptimize}
                  onCheckedChange={(checked) => setMaintenanceSettings({ ...maintenanceSettings, autoOptimize: checked })}
                />
              </div>

              <div>
                <Label>Maintenance Window</Label>
                <Select
                  value={maintenanceSettings.maintenanceWindow}
                  onValueChange={(value) => setMaintenanceSettings({ ...maintenanceSettings, maintenanceWindow: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="night">Night (2 AM - 6 AM)</SelectItem>
                    <SelectItem value="morning">Morning (6 AM - 10 AM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (2 PM - 6 PM)</SelectItem>
                    <SelectItem value="evening">Evening (10 PM - 2 AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Reindex Frequency</Label>
                <Select
                  value={maintenanceSettings.reindexFrequency}
                  onValueChange={(value) => setMaintenanceSettings({ ...maintenanceSettings, reindexFrequency: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white flex-1" onClick={handleOptimizeDatabase} variant="outline">
                  <Zap className="w-4 h-4 mr-2" />
                  Optimize Now
                </Button>
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white flex-1" onClick={handleReindexDatabase} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reindex Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
