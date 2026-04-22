import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Mail, 
  Database, 
  FileText, 
  Send, 
  Eye, 
  Save, 
  Upload,
  Download,
  Plus,
  Trash2,
  Copy,
  CheckCircle,
  AlertCircle,
  Users,
  Filter,
  Play
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function MailMerge() {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Welcome Email',
      subject: 'Welcome to {{company_name}}!',
      body: 'Hi {{first_name}},\n\nWelcome to {{company_name}}! We\'re excited to have you on board.\n\nBest regards,\n{{sender_name}}',
      createdAt: '2024-10-01'
    },
    {
      id: 2,
      name: 'Order Confirmation',
      subject: 'Order #{{order_id}} Confirmed',
      body: 'Dear {{customer_name}},\n\nYour order #{{order_id}} has been confirmed.\nTotal: ${{order_total}}\n\nThank you for your purchase!',
      createdAt: '2024-10-02'
    }
  ])

  const [currentTemplate, setCurrentTemplate] = useState({
    name: '',
    subject: '',
    body: '',
    fromName: '',
    fromEmail: '',
    replyTo: ''
  })

  const [dataSource, setDataSource] = useState('customers')
  const [selectedFields, setSelectedFields] = useState([])
  const [previewData, setPreviewData] = useState(null)
  const [recipients, setRecipients] = useState([])

  // Sample data sources
  const dataSources = {
    customers: {
      label: 'Customers',
      fields: ['first_name', 'last_name', 'email', 'phone', 'company_name', 'customer_id'],
      sampleData: [
        { first_name: 'John', last_name: 'Doe', email: 'john@example.com', phone: '555-0100', company_name: 'Acme Corp', customer_id: 'C001' },
        { first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', phone: '555-0101', company_name: 'Tech Inc', customer_id: 'C002' }
      ]
    },
    orders: {
      label: 'Orders',
      fields: ['order_id', 'customer_name', 'order_total', 'order_date', 'status', 'email'],
      sampleData: [
        { order_id: 'ORD001', customer_name: 'John Doe', order_total: '299.99', order_date: '2024-10-01', status: 'Shipped', email: 'john@example.com' },
        { order_id: 'ORD002', customer_name: 'Jane Smith', order_total: '149.99', order_date: '2024-10-02', status: 'Processing', email: 'jane@example.com' }
      ]
    },
    vendors: {
      label: 'Vendors',
      fields: ['vendor_name', 'contact_person', 'email', 'phone', 'vendor_id', 'category'],
      sampleData: [
        { vendor_name: 'Supplier Co', contact_person: 'Bob Wilson', email: 'bob@supplier.com', phone: '555-0200', vendor_id: 'V001', category: 'Electronics' }
      ]
    }
  }

  const availableVariables = [
    '{{first_name}}', '{{last_name}}', '{{email}}', '{{company_name}}',
    '{{order_id}}', '{{order_total}}', '{{customer_name}}', '{{phone}}',
    '{{sender_name}}', '{{date}}', '{{customer_id}}'
  ]

  const handleInsertVariable = (variable) => {
    setCurrentTemplate(prev => ({
      ...prev,
      body: prev.body + ' ' + variable
    }))
  }

  const handleSaveTemplate = () => {
    if (!currentTemplate.name || !currentTemplate.subject || !currentTemplate.body) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    const newTemplate = {
      id: templates.length + 1,
      ...currentTemplate,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setTemplates([...templates, newTemplate])
    setCurrentTemplate({
      name: '',
      subject: '',
      body: '',
      fromName: '',
      fromEmail: '',
      replyTo: ''
    })

    toast({
      title: 'Success',
      description: 'Template saved successfully'
    })
  }

  const handleLoadTemplate = (template) => {
    setCurrentTemplate({
      name: template.name,
      subject: template.subject,
      body: template.body,
      fromName: template.fromName || '',
      fromEmail: template.fromEmail || '',
      replyTo: template.replyTo || ''
    })
  }

  const handleDeleteTemplate = (id) => {
    setTemplates(templates.filter(t => t.id !== id))
    toast({
      title: 'Success',
      description: 'Template deleted successfully'
    })
  }

  const handlePreview = () => {
    const sampleData = dataSources[dataSource].sampleData[0]
    let previewSubject = currentTemplate.subject
    let previewBody = currentTemplate.body

    // Replace variables with sample data
    Object.keys(sampleData).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      previewSubject = previewSubject.replace(regex, sampleData[key])
      previewBody = previewBody.replace(regex, sampleData[key])
    })

    // Replace common variables
    previewSubject = previewSubject.replace(/{{sender_name}}/g, currentTemplate.fromName || 'Your Name')
    previewBody = previewBody.replace(/{{sender_name}}/g, currentTemplate.fromName || 'Your Name')
    previewBody = previewBody.replace(/{{date}}/g, new Date().toLocaleDateString())

    setPreviewData({
      subject: previewSubject,
      body: previewBody,
      from: `${currentTemplate.fromName} <${currentTemplate.fromEmail}>`,
      to: sampleData.email
    })
  }

  const handleSendEmails = () => {
    const count = dataSources[dataSource].sampleData.length
    toast({
      title: 'Emails Queued',
      description: `${count} emails have been queued for sending`,
    })
  }

  const handleLoadRecipients = () => {
    const data = dataSources[dataSource].sampleData
    setRecipients(data)
    toast({
      title: 'Recipients Loaded',
      description: `${data.length} recipients loaded from ${dataSources[dataSource].label}`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mail Merge</h1>
        <p className="text-muted-foreground">
          Create email templates and send personalized bulk emails
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
            <p className="text-xs text-muted-foreground">Saved templates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recipients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recipients.length}</div>
            <p className="text-xs text-muted-foreground">Loaded recipients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(dataSources).length}</div>
            <p className="text-xs text-muted-foreground">Available sources</p>
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
      <Tabs defaultValue="compose" className="space-y-4">
        <TabsList>
          <TabsTrigger value="compose">
            <Mail className="h-4 w-4 mr-2" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="recipients">
            <Users className="h-4 w-4 mr-2" />
            Recipients
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
        </TabsList>

        {/* Compose Tab */}
        <TabsContent value="compose" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Template Editor */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Email Template</CardTitle>
                  <CardDescription>Create your email template with merge fields</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      placeholder="e.g., Welcome Email"
                      value={currentTemplate.name}
                      onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="from-name">From Name</Label>
                      <Input
                        id="from-name"
                        placeholder="Your Name"
                        value={currentTemplate.fromName}
                        onChange={(e) => setCurrentTemplate({ ...currentTemplate, fromName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="from-email">From Email</Label>
                      <Input
                        id="from-email"
                        type="email"
                        placeholder="you@company.com"
                        value={currentTemplate.fromEmail}
                        onChange={(e) => setCurrentTemplate({ ...currentTemplate, fromEmail: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reply-to">Reply-To Email</Label>
                    <Input
                      id="reply-to"
                      type="email"
                      placeholder="reply@company.com"
                      value={currentTemplate.replyTo}
                      onChange={(e) => setCurrentTemplate({ ...currentTemplate, replyTo: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject Line</Label>
                    <Input
                      id="subject"
                      placeholder="Use {{variable}} for merge fields"
                      value={currentTemplate.subject}
                      onChange={(e) => setCurrentTemplate({ ...currentTemplate, subject: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="body">Email Body</Label>
                    <Textarea
                      id="body"
                      placeholder="Write your email content here. Use {{variable}} for merge fields."
                      className="min-h-[300px] font-mono"
                      value={currentTemplate.body}
                      onChange={(e) => setCurrentTemplate({ ...currentTemplate, body: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveTemplate}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Template
                    </Button>
                    <Button size="sm" variant="outline" onClick={handlePreview}>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Data Source Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Source</CardTitle>
                  <CardDescription>Select where to get recipient data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Source</Label>
                    <Select value={dataSource} onValueChange={setDataSource}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(dataSources).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white w-full" onClick={handleLoadRecipients} variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Load Recipients
                  </Button>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {dataSources[dataSource].sampleData.length} records available
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Merge Fields */}
              <Card>
                <CardHeader>
                  <CardTitle>Merge Fields</CardTitle>
                  <CardDescription>Click to insert into template</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {dataSources[dataSource].fields.map((field) => (
                        <Button
                          key={field}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => handleInsertVariable(`{{${field}}}`)}
                        >
                          <Copy className="h-3 w-3 mr-2" />
                          {`{{${field}}}`}
                        </Button>
                      ))}
                      <Separator className="my-2" />
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleInsertVariable('{{date}}')}
                      >
                        <Copy className="h-3 w-3 mr-2" />
                        {'{{date}}'}
                      </Button>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Templates</CardTitle>
              <CardDescription>Manage your email templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{template.name}</h3>
                        <Badge variant="secondary">{template.createdAt}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.subject}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLoadTemplate(template)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Load
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recipients Tab */}
        <TabsContent value="recipients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recipients</CardTitle>
              <CardDescription>
                {recipients.length} recipients loaded from {dataSources[dataSource].label}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recipients.length > 0 ? (
                <div className="space-y-2">
                  {recipients.map((recipient, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{recipient.email}</p>
                        <p className="text-sm text-muted-foreground">
                          {Object.entries(recipient).slice(0, 3).map(([key, value]) => `${key}: ${value}`).join(' • ')}
                        </p>
                      </div>
                      <Badge variant="outline">Ready</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No recipients loaded. Go to Compose tab and click "Load Recipients"
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Preview</CardTitle>
              <CardDescription>Preview how your email will look with sample data</CardDescription>
            </CardHeader>
            <CardContent>
              {previewData ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">From:</span>
                      <span className="font-medium">{previewData.from}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">To:</span>
                      <span className="font-medium">{previewData.to}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subject:</span>
                      <span className="font-medium">{previewData.subject}</span>
                    </div>
                  </div>

                  <div className="p-6 border rounded-lg bg-white">
                    <div className="whitespace-pre-wrap">{previewData.body}</div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSendEmails}>
                      <Send className="h-4 w-4 mr-2" />
                      Send Emails
                    </Button>
                    <Button size="sm" variant="outline" onClick={handlePreview}>
                      <Play className="h-4 w-4 mr-2" />
                      Refresh Preview
                    </Button>
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No preview available. Go to Compose tab and click "Preview" button
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
