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
import { 
  Palette, 
  Save, 
  Eye, 
  Settings,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Table,
  Filter,
  Play,
  Sparkles
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function ConditionalFormatting() {
  const [rules, setRules] = useState([
    {
      id: 1,
      name: 'Low Stock Alert',
      table: 'products',
      condition: 'stock < 10',
      format: { bgColor: '#fee2e2', textColor: '#991b1b', bold: true },
      createdAt: '2024-10-01'
    },
    {
      id: 2,
      name: 'High Value Orders',
      table: 'orders',
      condition: 'total > 1000',
      format: { bgColor: '#dcfce7', textColor: '#166534', bold: true },
      createdAt: '2024-10-02'
    }
  ])

  const [currentRule, setCurrentRule] = useState({
    name: '',
    table: '',
    column: '',
    operator: 'equals',
    value: '',
    format: {
      bgColor: '#ffffff',
      textColor: '#000000',
      bold: false,
      italic: false,
      underline: false
    }
  })

  const [previewData, setPreviewData] = useState([])

  // Sample tables
  const availableTables = {
    products: {
      label: 'Products',
      columns: ['product_id', 'name', 'sku', 'price', 'stock', 'status'],
      sampleData: [
        { product_id: 1, name: 'Laptop', sku: 'LAP001', price: 999.99, stock: 5, status: 'active' },
        { product_id: 2, name: 'Mouse', sku: 'MOU001', price: 19.99, stock: 150, status: 'active' },
        { product_id: 3, name: 'Keyboard', sku: 'KEY001', price: 49.99, stock: 8, status: 'active' },
        { product_id: 4, name: 'Monitor', sku: 'MON001', price: 299.99, stock: 25, status: 'active' }
      ]
    },
    orders: {
      label: 'Orders',
      columns: ['order_id', 'customer_name', 'total', 'status', 'date'],
      sampleData: [
        { order_id: 'ORD001', customer_name: 'John Doe', total: 1299.99, status: 'completed', date: '2024-10-01' },
        { order_id: 'ORD002', customer_name: 'Jane Smith', total: 49.99, status: 'pending', date: '2024-10-02' },
        { order_id: 'ORD003', customer_name: 'Bob Wilson', total: 2499.99, status: 'completed', date: '2024-10-03' },
        { order_id: 'ORD004', customer_name: 'Alice Brown', total: 99.99, status: 'processing', date: '2024-10-04' }
      ]
    },
    customers: {
      label: 'Customers',
      columns: ['customer_id', 'name', 'email', 'total_orders', 'lifetime_value', 'status'],
      sampleData: [
        { customer_id: 'C001', name: 'John Doe', email: 'john@example.com', total_orders: 15, lifetime_value: 5000, status: 'premium' },
        { customer_id: 'C002', name: 'Jane Smith', email: 'jane@example.com', total_orders: 3, lifetime_value: 300, status: 'regular' },
        { customer_id: 'C003', name: 'Bob Wilson', email: 'bob@example.com', total_orders: 25, lifetime_value: 12000, status: 'premium' },
        { customer_id: 'C004', name: 'Alice Brown', email: 'alice@example.com', total_orders: 1, lifetime_value: 50, status: 'new' }
      ]
    }
  }

  const operators = [
    { value: 'equals', label: 'Equals (=)', symbol: '=' },
    { value: 'not_equals', label: 'Not Equals (≠)', symbol: '!=' },
    { value: 'greater_than', label: 'Greater Than (>)', symbol: '>' },
    { value: 'less_than', label: 'Less Than (<)', symbol: '<' },
    { value: 'greater_or_equal', label: 'Greater or Equal (≥)', symbol: '>=' },
    { value: 'less_or_equal', label: 'Less or Equal (≤)', symbol: '<=' },
    { value: 'contains', label: 'Contains', symbol: 'LIKE' },
    { value: 'starts_with', label: 'Starts With', symbol: 'LIKE' },
    { value: 'ends_with', label: 'Ends With', symbol: 'LIKE' },
    { value: 'between', label: 'Between', symbol: 'BETWEEN' }
  ]

  const colorPresets = [
    { name: 'Red Alert', bg: '#fee2e2', text: '#991b1b', description: 'Critical/Error' },
    { name: 'Orange Warning', bg: '#fed7aa', text: '#9a3412', description: 'Warning' },
    { name: 'Yellow Caution', bg: '#fef3c7', text: '#854d0e', description: 'Caution' },
    { name: 'Green Success', bg: '#dcfce7', text: '#166534', description: 'Success/Positive' },
    { name: 'Blue Info', bg: '#dbeafe', text: '#1e40af', description: 'Information' },
    { name: 'Purple Premium', bg: '#f3e8ff', text: '#6b21a8', description: 'Premium/VIP' },
    { name: 'Gray Inactive', bg: '#f3f4f6', text: '#4b5563', description: 'Inactive/Disabled' }
  ]

  const handleLoadPreview = () => {
    if (!currentRule.table) {
      toast({
        title: 'Error',
        description: 'Please select a table first',
        variant: 'destructive'
      })
      return
    }

    const data = availableTables[currentRule.table]?.sampleData || []
    setPreviewData(data)

    toast({
      title: 'Preview Loaded',
      description: `Loaded ${data.length} records from ${availableTables[currentRule.table]?.label}`
    })
  }

  const handleSaveRule = () => {
    if (!currentRule.name || !currentRule.table || !currentRule.column) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    const condition = `${currentRule.column} ${operators.find(o => o.value === currentRule.operator)?.symbol} ${currentRule.value}`

    const newRule = {
      id: rules.length + 1,
      name: currentRule.name,
      table: currentRule.table,
      condition: condition,
      format: { ...currentRule.format },
      createdAt: new Date().toISOString().split('T')[0]
    }

    setRules([...rules, newRule])
    setCurrentRule({
      name: '',
      table: '',
      column: '',
      operator: 'equals',
      value: '',
      format: {
        bgColor: '#ffffff',
        textColor: '#000000',
        bold: false,
        italic: false,
        underline: false
      }
    })

    toast({
      title: 'Success',
      description: 'Formatting rule saved successfully'
    })
  }

  const handleLoadRule = (rule) => {
    // Parse condition back to components (simplified)
    setCurrentRule({
      name: rule.name,
      table: rule.table,
      column: '',
      operator: 'equals',
      value: '',
      format: { ...rule.format }
    })
  }

  const handleDeleteRule = (id) => {
    setRules(rules.filter(r => r.id !== id))
    toast({
      title: 'Success',
      description: 'Formatting rule deleted successfully'
    })
  }

  const handleApplyPreset = (preset) => {
    setCurrentRule({
      ...currentRule,
      format: {
        ...currentRule.format,
        bgColor: preset.bg,
        textColor: preset.text
      }
    })
    toast({
      title: 'Preset Applied',
      description: `Applied ${preset.name} color scheme`
    })
  }

  const checkCondition = (row, rule) => {
    if (!currentRule.column || !currentRule.value) return false

    const cellValue = row[currentRule.column]
    const compareValue = currentRule.value

    switch (currentRule.operator) {
      case 'equals':
        return String(cellValue) === String(compareValue)
      case 'not_equals':
        return String(cellValue) !== String(compareValue)
      case 'greater_than':
        return Number(cellValue) > Number(compareValue)
      case 'less_than':
        return Number(cellValue) < Number(compareValue)
      case 'greater_or_equal':
        return Number(cellValue) >= Number(compareValue)
      case 'less_or_equal':
        return Number(cellValue) <= Number(compareValue)
      case 'contains':
        return String(cellValue).toLowerCase().includes(String(compareValue).toLowerCase())
      case 'starts_with':
        return String(cellValue).toLowerCase().startsWith(String(compareValue).toLowerCase())
      case 'ends_with':
        return String(cellValue).toLowerCase().endsWith(String(compareValue).toLowerCase())
      default:
        return false
    }
  }

  const getCellStyle = (row) => {
    if (!checkCondition(row)) return {}

    return {
      backgroundColor: currentRule.format.bgColor,
      color: currentRule.format.textColor,
      fontWeight: currentRule.format.bold ? 'bold' : 'normal',
      fontStyle: currentRule.format.italic ? 'italic' : 'normal',
      textDecoration: currentRule.format.underline ? 'underline' : 'none'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conditional Formatting</h1>
        <p className="text-muted-foreground">
          Highlight rows and cells based on conditions with color coding
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rules</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rules.length}</div>
            <p className="text-xs text-muted-foreground">Active rules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tables</CardTitle>
            <Table className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(availableTables).length}</div>
            <p className="text-xs text-muted-foreground">Available tables</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presets</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{colorPresets.length}</div>
            <p className="text-xs text-muted-foreground">Color presets</p>
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
      <Tabs defaultValue="builder" className="space-y-4">
        <TabsList>
          <TabsTrigger value="builder">
            <Settings className="h-4 w-4 mr-2" />
            Rule Builder
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="rules">
            <Filter className="h-4 w-4 mr-2" />
            Saved Rules
          </TabsTrigger>
        </TabsList>

        {/* Builder Tab */}
        <TabsContent value="builder" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Configuration Form */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Formatting Rule</CardTitle>
                  <CardDescription>Define conditions and formatting styles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rule-name">Rule Name *</Label>
                    <Input
                      id="rule-name"
                      placeholder="e.g., Low Stock Alert"
                      value={currentRule.name}
                      onChange={(e) => setCurrentRule({ ...currentRule, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="table">Table *</Label>
                    <Select 
                      value={currentRule.table} 
                      onValueChange={(value) => setCurrentRule({ ...currentRule, table: value, column: '' })}
                    >
                      <SelectTrigger id="table">
                        <SelectValue placeholder="Select table..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(availableTables).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {currentRule.table && (
                    <>
                      <Separator />
                      <h3 className="text-sm font-medium">Condition</h3>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="column">Column *</Label>
                          <Select 
                            value={currentRule.column} 
                            onValueChange={(value) => setCurrentRule({ ...currentRule, column: value })}
                          >
                            <SelectTrigger id="column">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                              {availableTables[currentRule.table]?.columns.map((col) => (
                                <SelectItem key={col} value={col}>
                                  {col}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="operator">Operator *</Label>
                          <Select 
                            value={currentRule.operator} 
                            onValueChange={(value) => setCurrentRule({ ...currentRule, operator: value })}
                          >
                            <SelectTrigger id="operator">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {operators.map((op) => (
                                <SelectItem key={op.value} value={op.value}>
                                  {op.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="value">Value *</Label>
                          <Input
                            id="value"
                            placeholder="Compare value"
                            value={currentRule.value}
                            onChange={(e) => setCurrentRule({ ...currentRule, value: e.target.value })}
                          />
                        </div>
                      </div>

                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Condition: <code className="bg-muted px-2 py-1 rounded">
                            {currentRule.column || 'column'} {operators.find(o => o.value === currentRule.operator)?.symbol} {currentRule.value || 'value'}
                          </code>
                        </AlertDescription>
                      </Alert>
                    </>
                  )}

                  <Separator />
                  <h3 className="text-sm font-medium">Formatting Style</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bg-color">Background Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="bg-color"
                          type="color"
                          value={currentRule.format.bgColor}
                          onChange={(e) => setCurrentRule({ 
                            ...currentRule, 
                            format: { ...currentRule.format, bgColor: e.target.value }
                          })}
                          className="w-20 h-10"
                        />
                        <Input
                          value={currentRule.format.bgColor}
                          onChange={(e) => setCurrentRule({ 
                            ...currentRule, 
                            format: { ...currentRule.format, bgColor: e.target.value }
                          })}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="text-color">Text Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="text-color"
                          type="color"
                          value={currentRule.format.textColor}
                          onChange={(e) => setCurrentRule({ 
                            ...currentRule, 
                            format: { ...currentRule.format, textColor: e.target.value }
                          })}
                          className="w-20 h-10"
                        />
                        <Input
                          value={currentRule.format.textColor}
                          onChange={(e) => setCurrentRule({ 
                            ...currentRule, 
                            format: { ...currentRule.format, textColor: e.target.value }
                          })}
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentRule.format.bold}
                        onChange={(e) => setCurrentRule({ 
                          ...currentRule, 
                          format: { ...currentRule.format, bold: e.target.checked }
                        })}
                      />
                      <span className="font-bold">Bold</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentRule.format.italic}
                        onChange={(e) => setCurrentRule({ 
                          ...currentRule, 
                          format: { ...currentRule.format, italic: e.target.checked }
                        })}
                      />
                      <span className="italic">Italic</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentRule.format.underline}
                        onChange={(e) => setCurrentRule({ 
                          ...currentRule, 
                          format: { ...currentRule.format, underline: e.target.checked }
                        })}
                      />
                      <span className="underline">Underline</span>
                    </label>
                  </div>

                  <div className="p-4 border rounded-lg" style={{
                    backgroundColor: currentRule.format.bgColor,
                    color: currentRule.format.textColor,
                    fontWeight: currentRule.format.bold ? 'bold' : 'normal',
                    fontStyle: currentRule.format.italic ? 'italic' : 'normal',
                    textDecoration: currentRule.format.underline ? 'underline' : 'none'
                  }}>
                    Preview: This is how the formatted text will look
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveRule}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Rule
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleLoadPreview}>
                      <Eye className="h-4 w-4 mr-2" />
                      Load Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Color Presets */}
              <Card>
                <CardHeader>
                  <CardTitle>Color Presets</CardTitle>
                  <CardDescription>Quick color schemes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {colorPresets.map((preset, index) => (
                        <Button size="sm"
                          key={index}
                          variant="outline"
                          className="w-full justify-start h-auto p-3"
                          onClick={() => handleApplyPreset(preset)}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className="flex gap-1">
                              <div 
                                className="w-6 h-6 rounded border"
                                style={{ backgroundColor: preset.bg }}
                              />
                              <div 
                                className="w-6 h-6 rounded border"
                                style={{ backgroundColor: preset.text }}
                              />
                            </div>
                            <div className="text-left">
                              <div className="font-medium text-sm">{preset.name}</div>
                              <div className="text-xs text-muted-foreground">{preset.description}</div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Formatting Preview</CardTitle>
              <CardDescription>
                See how your formatting rule will be applied to data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {previewData.length > 0 && currentRule.table ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        {availableTables[currentRule.table]?.columns.map((col) => (
                          <th key={col} className="p-3 text-left font-medium">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b">
                          {availableTables[currentRule.table]?.columns.map((col) => (
                            <td 
                              key={col} 
                              className="p-3"
                              style={getCellStyle(row)}
                            >
                              {String(row[col])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <Table className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No preview available</p>
                    <p className="text-sm text-muted-foreground">Configure rule and click "Load Preview"</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Saved Rules Tab */}
        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Formatting Rules</CardTitle>
              <CardDescription>Manage your conditional formatting rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{rule.name}</h3>
                        <Badge variant="secondary">{availableTables[rule.table]?.label}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono">
                        Condition: {rule.condition}
                      </p>
                      <div className="flex items-center gap-2">
                        <div 
                          className="px-3 py-1 rounded text-sm"
                          style={{
                            backgroundColor: rule.format.bgColor,
                            color: rule.format.textColor,
                            fontWeight: rule.format.bold ? 'bold' : 'normal'
                          }}
                        >
                          Preview
                        </div>
                        <span className="text-xs text-muted-foreground">Created: {rule.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLoadRule(rule)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteRule(rule.id)}
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
      </Tabs>
    </div>
  )
}
