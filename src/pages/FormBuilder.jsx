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
import { useToast } from '@/hooks/use-toast'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  FileText,
  MousePointer,
  Type,
  CheckSquare,
  Calendar,
  Mail,
  Phone,
  Hash,
  ToggleLeft,
  List,
  Upload,
  Star,
  Copy,
  Download,
  Play,
  Settings,
  Palette,
  Code,
  Layers
} from 'lucide-react'
import { apiService } from '../services/apiService'

// Form field types configuration
const fieldTypes = [
  { id: 'text', name: 'Text Input', icon: Type, description: 'Single line text input' },
  { id: 'textarea', name: 'Text Area', icon: FileText, description: 'Multi-line text input' },
  { id: 'email', name: 'Email', icon: Mail, description: 'Email address input' },
  { id: 'phone', name: 'Phone', icon: Phone, description: 'Phone number input' },
  { id: 'number', name: 'Number', icon: Hash, description: 'Numeric input' },
  { id: 'date', name: 'Date', icon: Calendar, description: 'Date picker' },
  { id: 'checkbox', name: 'Checkbox', icon: CheckSquare, description: 'Single checkbox' },
  { id: 'radio', name: 'Radio Group', icon: MousePointer, description: 'Radio button group' },
  { id: 'select', name: 'Dropdown', icon: List, description: 'Dropdown selection' },
  { id: 'file', name: 'File Upload', icon: Upload, description: 'File upload field' },
  { id: 'rating', name: 'Rating', icon: Star, description: 'Star rating field' }
]

function FormFieldEditor({ field, onUpdate, onDelete }) {
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
          <span className="font-medium">{field.label}</span>
          <Badge variant="secondary" className="text-xs">
            {fieldTypeConfig?.name}
          </Badge>
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
          <div>
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={fieldData.label}
              onChange={(e) => setFieldData(prev => ({ ...prev, label: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              value={fieldData.placeholder || ''}
              onChange={(e) => setFieldData(prev => ({ ...prev, placeholder: e.target.value }))}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="required"
              checked={fieldData.required || false}
              onChange={(e) => setFieldData(prev => ({ ...prev, required: e.target.checked }))}
            />
            <Label htmlFor="required">Required</Label>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSave}>Save</Button>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          <p>Placeholder: {field.placeholder || 'None'}</p>
          <p>Required: {field.required ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  )
}

function FormPreview({ form }) {
  return (
    <div className="space-y-4 p-6 bg-muted/30 rounded-lg border-2 border-dashed">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">{form.name}</h3>
        <p className="text-sm text-muted-foreground">{form.description}</p>
      </div>
      
      {form.fields?.map((field) => {
        const fieldTypeConfig = fieldTypes.find(type => type.id === field.type)
        
        return (
          <div key={field.id} className="space-y-2">
            <Label className="flex items-center gap-2">
              {fieldTypeConfig && <fieldTypeConfig.icon className="h-4 w-4" />}
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            
            {field.type === 'textarea' ? (
              <Textarea placeholder={field.placeholder} disabled />
            ) : field.type === 'select' ? (
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder={field.placeholder || 'Select an option'} />
                </SelectTrigger>
              </Select>
            ) : field.type === 'checkbox' ? (
              <div className="flex items-center space-x-2">
                <input type="checkbox" disabled />
                <span className="text-sm">{field.placeholder || 'Checkbox option'}</span>
              </div>
            ) : field.type === 'radio' ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="radio" disabled />
                  <span className="text-sm">Option 1</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" disabled />
                  <span className="text-sm">Option 2</span>
                </div>
              </div>
            ) : (
              <Input 
                type={field.type} 
                placeholder={field.placeholder} 
                disabled 
              />
            )}
          </div>
        )
      })}
      
      <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white w-full mt-6" disabled onClick={() => toast({ title: 'Submitted', description: 'Data sent successfully' })}>
        Submit Form
      </Button>
    </div>
  )
}

export default function FormBuilder() {
  const [selectedForm, setSelectedForm] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('forms')

  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Mock data for forms
  const mockForms = [
    {
      id: 1,
      name: 'Customer Feedback Form',
      description: 'Collect customer feedback and ratings',
      status: 'published',
      fields: [
        { id: 1, type: 'text', label: 'Full Name', placeholder: 'Enter your full name', required: true },
        { id: 2, type: 'email', label: 'Email Address', placeholder: 'Enter your email', required: true },
        { id: 3, type: 'rating', label: 'Overall Rating', required: true },
        { id: 4, type: 'textarea', label: 'Comments', placeholder: 'Share your feedback', required: false }
      ],
      submissions: 45,
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'Product Registration',
      description: 'Register new products in the system',
      status: 'draft',
      fields: [
        { id: 1, type: 'text', label: 'Product Name', placeholder: 'Enter product name', required: true },
        { id: 2, type: 'textarea', label: 'Description', placeholder: 'Product description', required: true },
        { id: 3, type: 'number', label: 'Price', placeholder: '0.00', required: true },
        { id: 4, type: 'select', label: 'Category', required: true },
        { id: 5, type: 'file', label: 'Product Images', required: false }
      ],
      submissions: 0,
      created_at: '2024-01-10T14:20:00Z'
    }
  ]

  const { data: forms, isLoading } = useQuery({
    queryKey: ['forms', { search: searchTerm }],
    queryFn: () => {
      let filtered = mockForms
      if (searchTerm) {
        filtered = filtered.filter(form => 
          form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          form.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      return Promise.resolve({ items: filtered, total: filtered.length })
    }
  })

  const createFormMutation = useMutation({
    mutationFn: (formData) => {
      return Promise.resolve({ id: Date.now(), ...formData, fields: [], submissions: 0 })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['forms'])
      toast({ title: 'Form created successfully' })
      setIsDialogOpen(false)
    }
  })

  const handleCreateForm = (formData) => {
    createFormMutation.mutate(formData)
  }

  const handleAddField = (form, fieldType) => {
    const newField = {
      id: Date.now(),
      type: fieldType.id,
      label: `New ${fieldType.name}`,
      placeholder: '',
      required: false
    }
    
    const updatedForm = {
      ...form,
      fields: [...(form.fields || []), newField]
    }
    
    setSelectedForm(updatedForm)
    toast({ title: `${fieldType.name} field added` })
  }

  const handleUpdateField = (fieldData) => {
    if (!selectedForm) return
    
    const updatedFields = selectedForm.fields.map(field => 
      field.id === fieldData.id ? fieldData : field
    )
    
    setSelectedForm({
      ...selectedForm,
      fields: updatedFields
    })
  }

  const handleDeleteField = (fieldId) => {
    if (!selectedForm) return
    
    const updatedFields = selectedForm.fields.filter(field => field.id !== fieldId)
    setSelectedForm({
      ...selectedForm,
      fields: updatedFields
    })
    
    toast({ title: 'Field deleted' })
  }

  return (
    <div className="space-y-6 animate-slide-in-top">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Form Builder
          </h1>
          <p className="text-muted-foreground">
            Create dynamic forms with drag-and-drop interface
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white hover-lift">
              <Plus className="h-4 w-4 mr-2" />
              Create Form
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Form</DialogTitle>
              <DialogDescription>
                Start building a new dynamic form
              </DialogDescription>
            </DialogHeader>
            <NewFormDialog onSubmit={handleCreateForm} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forms" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Forms
          </TabsTrigger>
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Builder
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Integration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Form Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search forms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Forms Table */}
          <Card>
            <CardHeader>
              <CardTitle>Forms ({forms?.total || 0})</CardTitle>
              <CardDescription>
                Manage your dynamic forms and view submissions
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
                      <TableHead>Submissions</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {forms?.items?.map((form) => (
                      <TableRow key={form.id}>
                        <TableCell className="font-medium">{form.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {form.description}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              form.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {form.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{form.fields?.length || 0}</TableCell>
                        <TableCell>{form.submissions}</TableCell>
                        <TableCell>
                          {new Date(form.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedForm(form)
                                setActiveTab('builder')
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
                            <Button onClick={() => { navigator.clipboard.writeText(window.location.href).then(() => toast({ title: 'Copied', description: 'Link copied' })) }}
                              variant="ghost"
                              size="icon"
                            >
                              <Copy className="h-4 w-4" />
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

        <TabsContent value="builder" className="space-y-6">
          {selectedForm ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form Builder */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="h-5 w-5" />
                      Form Builder
                    </CardTitle>
                    <CardDescription>
                      Drag and drop fields to build your form
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Field Types */}
                    <div>
                      <h4 className="font-medium mb-3">Field Types</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {fieldTypes.map((fieldType) => (
                          <Button
                            key={fieldType.id}
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddField(selectedForm, fieldType)}
                            className="justify-start gap-2 h-auto p-3 hover-lift"
                          >
                            <fieldType.icon className="h-4 w-4" />
                            <div className="text-left">
                              <div className="font-medium text-xs">{fieldType.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {fieldType.description}
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div>
                      <h4 className="font-medium mb-3">Form Fields</h4>
                      <div className="space-y-3">
                        {selectedForm.fields?.map((field) => (
                          <FormFieldEditor
                            key={field.id}
                            field={field}
                            onUpdate={handleUpdateField}
                            onDelete={handleDeleteField}
                          />
                        ))}
                        {(!selectedForm.fields || selectedForm.fields.length === 0) && (
                          <div className="text-center py-8 text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No fields added yet</p>
                            <p className="text-sm">Click on field types above to add them</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Form Preview */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Live Preview
                    </CardTitle>
                    <CardDescription>
                      See how your form will look to users
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormPreview form={selectedForm} />
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Form Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Select a form from the Forms tab or create a new one to start building
                </p>
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setActiveTab('forms')}>
                  Go to Forms
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
                Embed forms and integrate with external systems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Integration with the existing dynamic form builder system
                </p>
                <div className="bg-muted/50 rounded-lg p-4 border-2 border-dashed">
                  <iframe
                    src="https://9yhyi3cpxq6l.manus.space/visual-form-builder"
                    className="w-full h-96 border rounded-lg"
                    title="Form Builder Integration"
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

function NewFormDialog({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'draft'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Form Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter form name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the purpose of this form"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button size="sm" type="submit" className="bg-gray-700 hover:bg-gray-600 text-white">Create Form</Button>
      </div>
    </form>
  )
}
