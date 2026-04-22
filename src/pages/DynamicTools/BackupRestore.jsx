import React, { useState } from 'react';
import { Database, Download, Upload, Clock, HardDrive, CheckCircle, AlertCircle, Trash2, Calendar, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function BackupRestore() {
  const [backupName, setBackupName] = useState('');
  const [backupType, setBackupType] = useState('full');
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [backupResult, setBackupResult] = useState(null);
  const [restoreResult, setRestoreResult] = useState(null);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [backupToDelete, setBackupToDelete] = useState(null);
  const [restoreSource, setRestoreSource] = useState('existing'); // 'existing' or 'upload'
  const [uploadedBackupFile, setUploadedBackupFile] = useState(null);

  const [backups, setBackups] = useState([
    {
      id: 1,
      name: 'Daily Backup - Oct 6, 2025',
      type: 'full',
      size: '245 MB',
      date: '2025-10-06 02:00:00',
      status: 'completed',
      duration: '3m 24s',
      tables: 12,
      records: 15420
    },
    {
      id: 2,
      name: 'Pre-Migration Backup',
      type: 'full',
      size: '238 MB',
      date: '2025-10-05 14:30:00',
      status: 'completed',
      duration: '3m 18s',
      tables: 12,
      records: 14890
    },
    {
      id: 3,
      name: 'Weekly Backup - Oct 1',
      type: 'full',
      size: '220 MB',
      date: '2025-10-01 02:00:00',
      status: 'completed',
      duration: '3m 05s',
      tables: 12,
      records: 13250
    },
    {
      id: 4,
      name: 'Incremental Backup',
      type: 'incremental',
      size: '45 MB',
      date: '2025-09-30 18:00:00',
      status: 'completed',
      duration: '45s',
      tables: 5,
      records: 2340
    },
  ]);

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    setBackupProgress(0);
    setBackupResult(null);

    // Simulate backup process
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setBackupProgress(i);
    }

    const newBackup = {
      id: backups.length + 1,
      name: backupName || `Backup - ${new Date().toLocaleString()}`,
      type: backupType,
      size: backupType === 'full' ? '248 MB' : '52 MB',
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'completed',
      duration: backupType === 'full' ? '3m 28s' : '58s',
      tables: backupType === 'full' ? 12 : 5,
      records: backupType === 'full' ? 15680 : 2580
    };

    setBackups([newBackup, ...backups]);
    setIsCreatingBackup(false);
    setBackupResult({
      success: true,
      ...newBackup
    });
    setBackupName('');
  };

  const handleRestore = async () => {
    if (restoreSource === 'existing' && !selectedBackup) return;
    if (restoreSource === 'upload' && !uploadedBackupFile) return;

    setIsRestoring(true);
    setRestoreProgress(0);
    setRestoreResult(null);

    // Simulate restore process
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 250));
      setRestoreProgress(i);
    }

    setIsRestoring(false);
    
    if (restoreSource === 'existing') {
      setRestoreResult({
        success: true,
        backup: selectedBackup,
        restoredTables: selectedBackup.tables,
        restoredRecords: selectedBackup.records,
        duration: '4m 12s'
      });
    } else {
      setRestoreResult({
        success: true,
        backup: { name: uploadedBackupFile.name },
        restoredTables: 12,
        restoredRecords: 15000,
        duration: '4m 18s'
      });
    }
  };

  const handleBackupFileChange = (e) => {
    const file = e.target.files[0];
    setUploadedBackupFile(file);
    setRestoreResult(null);
  };

  const handleDeleteBackup = (backup) => {
    setBackupToDelete(backup);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteBackup = () => {
    if (backupToDelete) {
      setBackups(backups.filter(b => b.id !== backupToDelete.id));
      if (selectedBackup?.id === backupToDelete.id) {
        setSelectedBackup(null);
      }
      setDeleteDialogOpen(false);
      setBackupToDelete(null);
    }
  };

  const handleDownloadBackup = (backup) => {
    // Simulate download
    alert(`Downloading backup: ${backup.name}`);
  };

  const getBackupTypeColor = (type) => {
    switch (type) {
      case 'full':
        return 'bg-blue-500';
      case 'incremental':
        return 'bg-green-500';
      case 'differential':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Backup & Restore</h1>
        <p className="text-muted-foreground mt-2">
          Create backups of your database and restore from previous backups
        </p>
      </div>

      <Tabs defaultValue="backup" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="backup">
            <Database className="w-4 h-4 mr-2" />
            Create Backup
          </TabsTrigger>
          <TabsTrigger value="restore">
            <Upload className="w-4 h-4 mr-2" />
            Restore Backup
          </TabsTrigger>
        </TabsList>

        {/* Create Backup Tab */}
        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Backup</CardTitle>
              <CardDescription>
                Create a backup of your database to protect your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="backup-name">Backup Name (Optional)</Label>
                  <Input
                    id="backup-name"
                    placeholder="e.g., Pre-Update Backup"
                    value={backupName}
                    onChange={(e) => setBackupName(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="backup-type">Backup Type</Label>
                  <Select value={backupType} onValueChange={setBackupType}>
                    <SelectTrigger id="backup-type" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Backup (All data)</SelectItem>
                      <SelectItem value="incremental">Incremental Backup (Changes only)</SelectItem>
                      <SelectItem value="differential">Differential Backup (Since last full)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-2">
                    {backupType === 'full' && 'Creates a complete backup of all database tables and records'}
                    {backupType === 'incremental' && 'Backs up only data changed since the last backup'}
                    {backupType === 'differential' && 'Backs up data changed since the last full backup'}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="compress-backup" defaultChecked />
                  <Label htmlFor="compress-backup" className="text-sm font-normal">
                    Compress backup file
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="verify-backup" defaultChecked />
                  <Label htmlFor="verify-backup" className="text-sm font-normal">
                    Verify backup integrity after creation
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="auto-download" />
                  <Label htmlFor="auto-download" className="text-sm font-normal">
                    Automatically download backup file
                  </Label>
                </div>
              </div>

              {isCreatingBackup && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Creating backup...</span>
                    <span>{backupProgress}%</span>
                  </div>
                  <Progress value={backupProgress} />
                </div>
              )}

              {backupResult && (
                <Alert className="border-green-500">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-semibold">Backup created successfully!</p>
                      <p className="text-sm">
                        Name: {backupResult.name}
                      </p>
                      <p className="text-sm">
                        Size: {backupResult.size} | 
                        Tables: {backupResult.tables} | 
                        Records: {backupResult.records.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Duration: {backupResult.duration}
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <Button size="sm" 
                onClick={handleCreateBackup} 
                disabled={isCreatingBackup}
                className="bg-gray-700 hover:bg-gray-600 text-white w-full"
              >
                {isCreatingBackup ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Backup...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 mr-2" />
                    Create Backup
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Backup History */}
          <Card>
            <CardHeader>
              <CardTitle>Backup History</CardTitle>
              <CardDescription>
                View and manage your previous backups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {backups.map((backup) => (
                  <div
                    key={backup.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{backup.name}</h3>
                          <Badge className={getBackupTypeColor(backup.type)}>
                            {backup.type}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {backup.date}
                          </div>
                          <div className="flex items-center gap-2">
                            <HardDrive className="w-4 h-4" />
                            {backup.size}
                          </div>
                          <div className="flex items-center gap-2">
                            <Database className="w-4 h-4" />
                            {backup.tables} tables, {backup.records.toLocaleString()} records
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {backup.duration}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadBackup(backup)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBackup(backup)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Restore Backup Tab */}
        <TabsContent value="restore" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Restore from Backup</CardTitle>
              <CardDescription>
                Select a backup to restore your database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warning:</strong> Restoring a backup will replace your current database. 
                  Make sure to create a backup of your current data before proceeding.
                </AlertDescription>
              </Alert>

              <div>
                <Label>Restore Source</Label>
                <Tabs value={restoreSource} onValueChange={setRestoreSource} className="mt-2">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="existing">Existing Backups</TabsTrigger>
                    <TabsTrigger value="upload">Upload Backup File</TabsTrigger>
                  </TabsList>

                  <TabsContent value="existing" className="mt-4">
                    <div>
                      <Label>Select Backup to Restore</Label>
                <div className="mt-2 space-y-2">
                  {backups.map((backup) => (
                    <div
                      key={backup.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedBackup?.id === backup.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedBackup(backup)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{backup.name}</h3>
                            <Badge className={getBackupTypeColor(backup.type)}>
                              {backup.type}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {backup.date}
                            </div>
                            <div className="flex items-center gap-2">
                              <HardDrive className="w-4 h-4" />
                              {backup.size}
                            </div>
                            <div className="flex items-center gap-2">
                              <Database className="w-4 h-4" />
                              {backup.tables} tables, {backup.records.toLocaleString()} records
                            </div>
                          </div>
                        </div>
                        {selectedBackup?.id === backup.id && (
                          <CheckCircle className="w-5 h-5 text-primary ml-4" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="upload" className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="backup-file">Select Backup File</Label>
                        <div className="mt-2">
                          <input
                            id="backup-file"
                            type="file"
                            onChange={handleBackupFileChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                            accept=".sql,.zip,.gz,.bak"
                          />
                        </div>
                        {uploadedBackupFile && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Selected: {uploadedBackupFile.name} ({(uploadedBackupFile.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        )}
                      </div>
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Supported formats: SQL, ZIP, GZ, BAK
                        </AlertDescription>
                      </Alert>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="backup-before-restore" defaultChecked />
                <Label htmlFor="backup-before-restore" className="text-sm font-normal">
                  Create backup before restoring
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="verify-restore" defaultChecked />
                <Label htmlFor="verify-restore" className="text-sm font-normal">
                  Verify data integrity after restore
                </Label>
              </div>

              {isRestoring && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Restoring backup...</span>
                    <span>{restoreProgress}%</span>
                  </div>
                  <Progress value={restoreProgress} />
                </div>
              )}

              {restoreResult && (
                <Alert className="border-green-500">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-semibold">Restore completed successfully!</p>
                      <p className="text-sm">
                        Restored {restoreResult.restoredTables} tables with {restoreResult.restoredRecords.toLocaleString()} records
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Duration: {restoreResult.duration}
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <Button size="sm" 
                onClick={handleRestore} 
                disabled={(restoreSource === 'existing' && !selectedBackup) || (restoreSource === 'upload' && !uploadedBackupFile) || isRestoring}
                className="w-full"
                variant="destructive"
              >
                {isRestoring ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Restoring...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Restore Selected Backup
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Backup?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this backup? This action cannot be undone.
              {backupToDelete && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="font-semibold">{backupToDelete.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Size: {backupToDelete.size} | Created: {backupToDelete.date}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteBackup}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Backup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
