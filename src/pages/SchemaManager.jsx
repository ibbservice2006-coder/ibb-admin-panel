import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Settings,
  Database,
  Table as TableIcon,
  Columns,
  Key,
  Link,
  FileText,
  Code,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Layers,
  GitBranch,
  History,
  Hash,
  ToggleLeft,
  Calendar
} from 'lucide-react'
import { apiService } from '../services/apiService'

// Field types for database schema
const fieldTypes = [
  { id: 'varchar', name: 'VARCHAR', description: 'Variable length string', icon: FileText },
  { id: 'text', name: 'TEXT', description: 'Long text field', icon: FileText },
  { id: 'int', name: 'INTEGER', description: 'Whole numbers', icon: Hash },
  { id: 'decimal', name: 'DECIMAL', description: 'Decimal numbers', icon: Hash },
  { id: 'boolean', name: 'BOOLEAN', description: 'True/false values', icon: ToggleLeft },
  { id: 'date', name: 'DATE', description: 'Date values', icon: Calendar },
  { id: 'datetime', name: 'DATETIME', description: 'Date and time', icon: Clock },
  { id: 'json', name: 'JSON', description: 'JSON data', icon: Code }
]

function SchemaField({ field, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [fieldData, setFieldData] = useState(field)

  const handleSave = () => {
    onUpdate(fieldData)
    setIsEditing(false)
  }

  const fieldTypeConfig = fieldTypes.find(type => type.id === field.type)

  return (
    <div className="border rounded-lg p-4 bg-card hover-lift transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {fieldTypeConfig && <fieldTypeConfig.icon className="h-4 w-4 text-primary" />}
          <span className="font-medium">{field.name}</span>
          <Badge variant="secondary" className="text-xs">
            {fieldTypeConfig?.name}
          </Badge>
          {field.isPrimary && (
            <Badge className="text-xs bg-yellow-100 text-yellow-800">
              <Key className="h-3 w-3 mr-1" />
              Primary
            </Badge>
          )}
          {field.isRequired && (
            <Badge variant="destructive" className="text-xs">
              Required
            </Badge>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(field.id)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name">Field Name</Label>
              <Input
                id="name"
                value={fieldData.name}
                onChange={(e) => setFieldData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={fieldData.type}
                onValueChange={(value) => setFieldData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fieldTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {(fieldData.type === 'varchar' || fieldData.type === 'decimal') && (
            <div>
              <Label htmlFor="length">Length/Precision</Label>
              <Input
                id="length"
                type="number"
                value={fieldData.length || ''}
                onChange={(e) => setFieldData(prev => ({ ...prev, length: e.target.value }))}
                placeholder="e.g., 255"
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="defaultValue">Default Value</Label>
            <Input
              id="defaultValue"
              value={fieldData.defaultValue || ''}
              onChange={(e) => setFieldData(prev => ({ ...prev, defaultValue: e.target.value }))}
              placeholder="Default value (optional)"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={fieldData.isRequired || false}
                onCheckedChange={(checked) => setFieldData(prev => ({ ...prev, isRequired: checked }))}
              />
              <Label htmlFor="required">Required</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="unique"
                checked={fieldData.isUnique || false}
                onCheckedChange={(checked) => setFieldData(prev => ({ ...prev, isUnique: checked }))}
              />
              <Label htmlFor="unique">Unique</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="indexed"
                checked={fieldData.isIndexed || false}
                onCheckedChange={(checked) => setFieldData(prev => ({ ...prev, isIndexed: checked }))}
              />
              <Label htmlFor="indexed">Indexed</Label>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSave}>Save</Button>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Type: {fieldTypeConfig?.name} {field.length && `(${field.length})`}</p>
          {field.defaultValue && <p>Default: {field.defaultValue}</p>}
          <div className="flex gap-2 flex-wrap">
            {field.isUnique && <Badge variant="outline" className="text-xs">Unique</Badge>}
            {field.isIndexed && <Badge variant="outline" className="text-xs">Indexed</Badge>}
          </div>
        </div>
      )}
    </div>
  )
}

function TableSchema({ table, onUpdate }) {
  const [tableData, setTableData] = useState(table || {
    name: '',
    description: '',
    fields: []
  })

  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState(false)

  const handleAddField = (fieldData) => {
    const newField = {
      id: Date.now(),
      ...fieldData
    }
    
    const updatedTable = {
      ...tableData,
      fields: [...tableData.fields, newField]
    }
    
    setTableData(updatedTable)
    onUpdate(updatedTable)
    setIsFieldDialogOpen(false)
  }

  const handleUpdateField = (fieldData) => {
    const updatedFields = tableData.fields.map(field => 
      field.id === fieldData.id ? fieldData : field
    )
    
    const updatedTable = {
      ...tableData,
      fields: updatedFields
    }
    
    setTableData(updatedTable)
    onUpdate(updatedTable)
  }

  const handleDeleteField = (fieldId) => {
    const updatedFields = tableData.fields.filter(field => field.id !== fieldId)
    const updatedTable = {
      ...tableData,
      fields: updatedFields
    }
    
    setTableData(updatedTable)
    onUpdate(updatedTable)
  }

  return (
    <div className="space-y-6">
      {/* Table Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Table Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tableName">Table Name</Label>
              <Input
                id="tableName"
                value={tableData.name}
                onChange={(e) => {
                  const updated = { ...tableData, name: e.target.value }
                  setTableData(updated)
                  onUpdate(updated)
                }}
                placeholder="Enter table name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={tableData.description}
                onChange={(e) => {
                  const updated = { ...tableData, description: e.target.value }
                  setTableData(updated)
                  onUpdate(updated)
                }}
                placeholder="Table description"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fields */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Fields</CardTitle>
            <Dialog open={isFieldDialogOpen} onOpenChange={setIsFieldDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Field</DialogTitle>
                  <DialogDescription>
                    Create a new field for this table
                  </DialogDescription>
                </DialogHeader>
                <FieldDialog onSubmit={handleAddField} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {tableData.fields && tableData.fields.length > 0 ? (
            <div className="space-y-4">
              {tableData.fields.map((field) => (
                <SchemaField
                  key={field.id}
                  field={field}
                  onUpdate={handleUpdateField}
                  onDelete={handleDeleteField}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Columns className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Fields Added</h3>
              <p className="text-muted-foreground mb-4">
                Add fields to define the structure of this table
              </p>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setIsFieldDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Field
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function FieldDialog({ onSubmit, field }) {
  const [fieldData, setFieldData] = useState(field || {
    name: '',
    type: 'varchar',
    length: '',
    defaultValue: '',
    isRequired: false,
    isUnique: false,
    isPrimary: false,
    isIndexed: false
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(fieldData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fieldName">Field Name</Label>
          <Input
            id="fieldName"
            value={fieldData.name}
            onChange={(e) => setFieldData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter field name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fieldType">Field Type</Label>
          <Select
            value={fieldData.type}
            onValueChange={(value) => setFieldData(prev => ({ ...prev, type: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fieldTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  <div className="flex items-center gap-2">
                    <type.icon className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{type.name}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {(fieldData.type === 'varchar' || fieldData.type === 'decimal') && (
        <div className="space-y-2">
          <Label htmlFor="length">Length/Precision</Label>
          <Input
            id="length"
            type="number"
            value={fieldData.length}
            onChange={(e) => setFieldData(prev => ({ ...prev, length: e.target.value }))}
            placeholder="e.g., 255"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="defaultValue">Default Value</Label>
        <Input
          id="defaultValue"
          value={fieldData.defaultValue}
          onChange={(e) => setFieldData(prev => ({ ...prev, defaultValue: e.target.value }))}
          placeholder="Default value (optional)"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="required"
            checked={fieldData.isRequired}
            onCheckedChange={(checked) => setFieldData(prev => ({ ...prev, isRequired: checked }))}
          />
          <Label htmlFor="required">Required</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="unique"
            checked={fieldData.isUnique}
            onCheckedChange={(checked) => setFieldData(prev => ({ ...prev, isUnique: checked }))}
          />
          <Label htmlFor="unique">Unique</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="primary"
            checked={fieldData.isPrimary}
            onCheckedChange={(checked) => setFieldData(prev => ({ ...prev, isPrimary: checked }))}
          />
          <Label htmlFor="primary">Primary Key</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="indexed"
            checked={fieldData.isIndexed}
            onCheckedChange={(checked) => setFieldData(prev => ({ ...prev, isIndexed: checked }))}
          />
          <Label htmlFor="indexed">Indexed</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button size="sm" type="submit" className="bg-gray-700 hover:bg-gray-600 text-white" disabled={!fieldData.name || !fieldData.type}>
          {field ? 'Update' : 'Add'} Field
        </Button>
      </div>
    </form>
  )
}

export default function SchemaManager() {
  const [selectedTable, setSelectedTable] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('tables')

  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Mock data for tables
  const mockTables = [
    {
      id: 1,
      name: 'custom_products',
      description: 'Extended product information',
      status: 'active',
      fields: [
        { id: 1, name: 'id', type: 'int', isPrimary: true, isRequired: true, isIndexed: true },
        { id: 2, name: 'custom_field_1', type: 'varchar', length: '255', isRequired: false },
        { id: 3, name: 'metadata', type: 'json', isRequired: false }
      ],
      recordCount: 1250,
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'user_preferences',
      description: 'User customization settings',
      status: 'active',
      fields: [
        { id: 1, name: 'user_id', type: 'int', isPrimary: true, isRequired: true, isIndexed: true },
        { id: 2, name: 'theme', type: 'varchar', length: '50', defaultValue: 'light' },
        { id: 3, name: 'notifications', type: 'boolean', defaultValue: 'true' }
      ],
      recordCount: 890,
      created_at: '2024-01-10T14:20:00Z'
    }
  ]

  const { data: tables, isLoading } = useQuery({
    queryKey: ['tables', { search: searchTerm }],
    queryFn: () => {
      let filtered = mockTables
      if (searchTerm) {
        filtered = filtered.filter(table => 
          table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          table.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      return Promise.resolve({ items: filtered, total: filtered.length })
    }
  })

  const createTableMutation = useMutation({
    mutationFn: (tableData) => {
      return Promise.resolve({ id: Date.now(), ...tableData, fields: [], recordCount: 0 })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tables'])
      toast({ title: 'Table created successfully' })
      setIsDialogOpen(false)
    }
  })

  const handleCreateTable = (tableData) => {
    createTableMutation.mutate(tableData)
  }

  const handleUpdateTable = (tableData) => {
    setSelectedTable(tableData)
    toast({ title: 'Table updated' })
  }

  return (
    <div className="space-y-6 animate-slide-in-top">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Schema Manager
          </h1>
          <p className="text-muted-foreground">
            Manage database schema dynamically
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white hover-lift">
              <Plus className="h-4 w-4 mr-2" />
              Create Table
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Table</DialogTitle>
              <DialogDescription>
                Define a new database table schema
              </DialogDescription>
            </DialogHeader>
            <NewTableDialog onSubmit={handleCreateTable} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tables" className="flex items-center gap-2">
            <TableIcon className="h-4 w-4" />
            Tables
          </TabsTrigger>
          <TabsTrigger value="designer" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Designer
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Integration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Schema Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search tables..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tables Table */}
          <Card>
            <CardHeader>
              <CardTitle>Database Tables ({tables?.total || 0})</CardTitle>
              <CardDescription>
                Manage your custom database tables and schemas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Fields</TableHead>
                      <TableHead>Records</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tables?.items?.map((table) => (
                      <TableRow key={table.id}>
                        <TableCell className="font-medium font-mono">{table.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {table.description}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              table.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {table.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{table.fields?.length || 0}</TableCell>
                        <TableCell>{table.recordCount?.toLocaleString()}</TableCell>
                        <TableCell>
                          {new Date(table.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedTable(table)
                                setActiveTab('designer')
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}
                              variant="ghost"
                              size="icon"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => toast({ title: 'Download Started', description: 'Downloading file...' })}
                              variant="ghost"
                              size="icon"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="designer" className="space-y-6">
          {selectedTable ? (
            <TableSchema 
              table={selectedTable} 
              onUpdate={handleUpdateTable}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Database className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Table Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Select a table from the Tables tab or create a new one to start designing
                </p>
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setActiveTab('tables')}>
                  Go to Tables
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Integration Options
              </CardTitle>
              <CardDescription>
                Connect with external systems and manage schema migrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Integration with the existing dynamic schema manager system
                </p>
                <div className="bg-muted/50 rounded-lg p-4 border-2 border-dashed">
                  <iframe
                    src="https://9yhyi3cpxq6l.manus.space/dynamic-schema-manager"
                    className="w-full h-96 border rounded-lg"
                    title="Schema Manager Integration"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function NewTableDialog({ onSubmit }) {
  const [tableData, setTableData] = useState({
    name: '',
    description: '',
    status: 'active'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(tableData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Table Name</Label>
        <Input
          id="name"
          value={tableData.name}
          onChange={(e) => setTableData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter table name (e.g., custom_products)"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={tableData.description}
          onChange={(e) => setTableData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the purpose of this table"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={tableData.status}
          onValueChange={(value) => setTableData(prev => ({ ...prev, status: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button size="sm" type="submit" className="bg-gray-700 hover:bg-gray-600 text-white">Create Table</Button>
      </div>
    </form>
  )
}
