import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Link2,
  Link2Off,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  ShoppingCart,
  AlertCircle,
  Settings,
  Eye,
  Activity,
  Grid3x3,
  List,
  Download,
  Upload,
  CheckSquare,
  Square,
  Zap
} from 'lucide-react'

// Helper function to load custom platforms from localStorage
const loadCustomPlatforms = () => {
  try {
    const stored = localStorage.getItem('customPlatforms')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    return []
  }
}

// Helper function to save custom platforms to localStorage
const saveCustomPlatforms = (platforms) => {
  try {
    localStorage.setItem('customPlatforms', JSON.stringify(platforms))
  } catch (error) {
    console.error('Failed to save custom platforms:', error)
  }
}

function AddPlatformTypeDialog({ isOpen, onClose, onAdd, editingPlatform = null }) {
  const [formData, setFormData] = useState({
    label: '',
    color: 'bg-blue-500',
    customFields: []
  })
  const [newField, setNewField] = useState({
    name: '',
    label: '',
    type: 'text',
    required: false
  })
  const { toast } = useToast()

  // Load data when editing
  useEffect(() => {
    if (editingPlatform) {
      setFormData({
        label: editingPlatform.label || '',
        color: editingPlatform.color || 'bg-blue-500',
        customFields: editingPlatform.customFields || []
      })
    } else {
      setFormData({
        label: '',
        color: 'bg-blue-500',
        customFields: []
      })
    }
  }, [editingPlatform, isOpen])

  const colorOptions = [
    { value: 'bg-orange-500', label: 'Orange', preview: '#f97316' },
    { value: 'bg-blue-500', label: 'Blue', preview: '#3b82f6' },
    { value: 'bg-green-500', label: 'Green', preview: '#22c55e' },
    { value: 'bg-yellow-500', label: 'Yellow', preview: '#eab308' },
    { value: 'bg-red-500', label: 'Red', preview: '#ef4444' },
    { value: 'bg-purple-500', label: 'Purple', preview: '#a855f7' },
    { value: 'bg-pink-500', label: 'Pink', preview: '#ec4899' },
    { value: 'bg-indigo-500', label: 'Indigo', preview: '#6366f1' },
    { value: 'bg-teal-500', label: 'Teal', preview: '#14b8a6' },
    { value: 'bg-cyan-500', label: 'Cyan', preview: '#06b6d4' },
    { value: 'bg-gray-700', label: 'Gray', preview: '#374151' },
    { value: 'bg-black', label: 'Black', preview: '#000000' }
  ]

  const handleAddField = () => {
    if (!newField.name.trim() || !newField.label.trim()) {
      toast({
        title: 'Error',
        description: 'Field name and label are required',
        variant: 'destructive'
      })
      return
    }

    // Check duplicate field name
    if (formData.customFields.some(f => f.name === newField.name)) {
      toast({
        title: 'Error',
        description: 'Field name already exists',
        variant: 'destructive'
      })
      return
    }

    setFormData({
      ...formData,
      customFields: [...formData.customFields, { ...newField }]
    })
    setNewField({ name: '', label: '', type: 'text', required: false })
  }

  const handleRemoveField = (index) => {
    setFormData({
      ...formData,
      customFields: formData.customFields.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.label.trim()) {
      toast({ 
        title: 'Error', 
        description: 'Platform name is required',
        variant: 'destructive'
      })
      return
    }

    // Generate or keep existing value
    const value = editingPlatform?.value || formData.label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
    
    const platformData = {
      value,
      label: formData.label,
      color: formData.color,
      customFields: formData.customFields,
      isCustom: true
    }

    onAdd(platformData, editingPlatform)
    toast({ 
      title: 'Success', 
      description: editingPlatform 
        ? `Platform type "${formData.label}" updated successfully`
        : `Platform type "${formData.label}" added successfully` 
    })
    
    setFormData({ label: '', color: 'bg-blue-500', customFields: [] })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingPlatform ? 'Edit Platform Type' : 'Add New Platform Type'}</DialogTitle>
          <DialogDescription>
            {editingPlatform ? 'Update platform type settings' : 'Create a custom platform type for your integration'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="fields">Custom Fields</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div>
                <Label>Platform Name *</Label>
                <Input
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g., Tokopedia, eBay, Etsy"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the name of the platform you want to add
                </p>
              </div>

              <div>
                <Label>Brand Color *</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`h-10 rounded-md border-2 transition-all ${
                        formData.color === color.value ? 'border-primary scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.preview }}
                      title={color.label}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Select a color that represents the platform's brand
                </p>
              </div>
            </TabsContent>

            <TabsContent value="fields" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-3">Define Custom Fields</h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Add custom fields that will be shown when connecting this platform. 
                    For example: Partner ID, API Key, Shop ID, etc.
                  </p>
                </div>

                {/* Add New Field Form */}
                <div className="border rounded-lg p-4 space-y-3 bg-muted/50">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Field Name *</Label>
                      <Input
                        value={newField.name}
                        onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                        placeholder="e.g., partner_id"
                        className="h-9"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Internal name (lowercase, no spaces)
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs">Field Label *</Label>
                      <Input
                        value={newField.label}
                        onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                        placeholder="e.g., Partner ID"
                        className="h-9"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Display name shown to users
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Field Type</Label>
                      <Select value={newField.type} onValueChange={(value) => setNewField({ ...newField, type: value })}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="password">Password</SelectItem>
                          <SelectItem value="textarea">Textarea</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Switch
                        checked={newField.required}
                        onCheckedChange={(checked) => setNewField({ ...newField, required: checked })}
                      />
                      <Label className="text-xs">Required field</Label>
                    </div>
                  </div>
                  <Button type="button" size="sm" onClick={handleAddField} className="bg-gray-700 hover:bg-gray-600 text-white w-full">
                    <Plus className="h-3 w-3 mr-2" />
                    Add Field
                  </Button>
                </div>

                {/* Custom Fields List */}
                {formData.customFields.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs">Custom Fields ({formData.customFields.length})</Label>
                    <div className="space-y-2">
                      {formData.customFields.map((field, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-background">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{field.label}</span>
                              {field.required && (
                                <Badge variant="secondary" className="text-xs">Required</Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {field.name} • {field.type}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveField(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {formData.customFields.length === 0 && (
                  <div className="text-center py-8 text-sm text-muted-foreground border rounded-lg border-dashed">
                    No custom fields added yet. Add fields above to customize the connection form.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 mt-4 border-t">
            <Button size="sm" type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" type="submit" className="bg-gray-700 hover:bg-gray-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              {editingPlatform ? 'Update Platform Type' : 'Add Platform Type'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function PlatformFormDialog({ platform, isOpen, onClose, customPlatforms = [] }) {
  const [formData, setFormData] = useState({
    name: platform?.name || '',
    type: platform?.type || 'shopee',
    api_key: platform?.api_key || '',
    api_secret: platform?.api_secret || '',
    shop_id: platform?.shop_id || '',
    access_token: platform?.access_token || '',
    refresh_token: platform?.refresh_token || '',
    webhook_url: platform?.webhook_url || '',
    auto_sync: platform?.auto_sync ?? true,
    sync_interval: platform?.sync_interval || '15',
    sync_products: platform?.sync_products ?? true,
    sync_orders: platform?.sync_orders ?? true,
    sync_inventory: platform?.sync_inventory ?? true,
    is_active: platform?.is_active ?? true,
    custom_data: platform?.custom_data || {}
  })

  // Get custom fields for selected platform
  const getCustomFields = () => {
    const selectedPlatformType = customPlatforms.find(p => p.value === formData.type)
    return selectedPlatformType?.customFields || []
  }

  const { toast } = useToast()
  const queryClient = useQueryClient()

  const saveMutation = useMutation({
    mutationFn: (data) => Promise.resolve(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['platforms'])
      toast({ title: platform ? 'Platform updated' : 'Platform connected' })
      onClose()
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    saveMutation.mutate(formData)
  }

  const defaultPlatformTypes = [
    { value: 'shopee', label: 'Shopee', color: 'bg-orange-500' },
    { value: 'lazada', label: 'Lazada', color: 'bg-blue-500' },
    { value: 'amazon', label: 'Amazon', color: 'bg-yellow-600' },
    { value: 'line_myshop', label: 'Line MyShop', color: 'bg-green-500' },
    { value: 'facebook_shop', label: 'Facebook Shop', color: 'bg-blue-600' },
    { value: 'tiktok_shop', label: 'TikTok Shop', color: 'bg-black' },
    { value: 'instagram_shop', label: 'Instagram Shop', color: 'bg-pink-500' }
  ]

  const platformTypes = [...defaultPlatformTypes, ...customPlatforms]

  const selectedPlatform = platformTypes.find(p => p.value === formData.type)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{platform ? 'Edit Platform Connection' : 'Connect Platform'}</DialogTitle>
          <DialogDescription>
            Configure your platform integration settings and API credentials
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="credentials" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="credentials">Credentials</TabsTrigger>
              <TabsTrigger value="sync">Sync Settings</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="credentials" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <Label>Platform Type *</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {platformTypes.map(p => (
                        <SelectItem key={p.value} value={p.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${p.color}`}></div>
                            {p.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Connection Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={`My ${selectedPlatform?.label} Store`}
                    required
                  />
                </div>

                {/* Render custom fields if available */}
                {getCustomFields().length > 0 ? (
                  <>
                    {getCustomFields().map((field) => (
                      <div key={field.name}>
                        <Label>{field.label} {field.required && '*'}</Label>
                        {field.type === 'textarea' ? (
                          <Textarea
                            value={formData.custom_data[field.name] || ''}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              custom_data: { ...formData.custom_data, [field.name]: e.target.value }
                            })}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            required={field.required}
                            rows={3}
                          />
                        ) : (
                          <Input
                            type={field.type}
                            value={formData.custom_data[field.name] || ''}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              custom_data: { ...formData.custom_data, [field.name]: e.target.value }
                            })}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            required={field.required}
                          />
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {/* Default fields for platforms without custom fields */}
                    <div>
                      <Label>Shop ID / Store ID *</Label>
                      <Input
                        value={formData.shop_id}
                        onChange={(e) => setFormData({ ...formData, shop_id: e.target.value })}
                        placeholder="Enter your shop/store ID"
                        required
                      />
                    </div>

                    <div>
                      <Label>API Key *</Label>
                      <Input
                        type="password"
                        value={formData.api_key}
                        onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                        placeholder="Enter API key"
                        required
                      />
                    </div>

                    <div>
                      <Label>API Secret *</Label>
                      <Input
                        type="password"
                        value={formData.api_secret}
                        onChange={(e) => setFormData({ ...formData, api_secret: e.target.value })}
                        placeholder="Enter API secret"
                        required
                      />
                    </div>

                    <div>
                      <Label>Access Token</Label>
                      <Textarea
                        value={formData.access_token}
                        onChange={(e) => setFormData({ ...formData, access_token: e.target.value })}
                        placeholder="Enter access token (if required)"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Refresh Token</Label>
                      <Input
                        type="password"
                        value={formData.refresh_token}
                        onChange={(e) => setFormData({ ...formData, refresh_token: e.target.value })}
                        placeholder="Enter refresh token (optional)"
                      />
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="sync" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Sync</Label>
                    <p className="text-sm text-muted-foreground">Automatically sync data at regular intervals</p>
                  </div>
                  <Switch
                    checked={formData.auto_sync}
                    onCheckedChange={(checked) => setFormData({ ...formData, auto_sync: checked })}
                  />
                </div>

                {formData.auto_sync && (
                  <div>
                    <Label>Sync Interval (minutes)</Label>
                    <Select value={formData.sync_interval} onValueChange={(v) => setFormData({ ...formData, sync_interval: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">Every 5 minutes</SelectItem>
                        <SelectItem value="15">Every 15 minutes</SelectItem>
                        <SelectItem value="30">Every 30 minutes</SelectItem>
                        <SelectItem value="60">Every hour</SelectItem>
                        <SelectItem value="180">Every 3 hours</SelectItem>
                        <SelectItem value="360">Every 6 hours</SelectItem>
                        <SelectItem value="1440">Once daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-3 pt-4 border-t">
                  <Label>Sync Options</Label>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Sync Products</p>
                      <p className="text-xs text-muted-foreground">Sync product catalog and details</p>
                    </div>
                    <Switch
                      checked={formData.sync_products}
                      onCheckedChange={(checked) => setFormData({ ...formData, sync_products: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Sync Orders</p>
                      <p className="text-xs text-muted-foreground">Sync order data and status</p>
                    </div>
                    <Switch
                      checked={formData.sync_orders}
                      onCheckedChange={(checked) => setFormData({ ...formData, sync_orders: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Sync Inventory</p>
                      <p className="text-xs text-muted-foreground">Sync stock levels and availability</p>
                    </div>
                    <Switch
                      checked={formData.sync_inventory}
                      onCheckedChange={(checked) => setFormData({ ...formData, sync_inventory: checked })}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <Label>Webhook URL</Label>
                  <Input
                    value={formData.webhook_url}
                    onChange={(e) => setFormData({ ...formData, webhook_url: e.target.value })}
                    placeholder="https://your-domain.com/webhook"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    URL to receive real-time updates from the platform
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <Label>Active</Label>
                    <p className="text-sm text-muted-foreground">Enable this platform connection</p>
                  </div>
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6">
            <Button size="sm" type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button size="sm" type="submit" className="bg-gray-700 hover:bg-gray-600 text-white">{platform ? 'Update' : 'Connect'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function SyncLogsDialog({ platform, isOpen, onClose }) {
  const mockLogs = [
    {
      id: 1,
      type: 'products',
      status: 'success',
      message: 'Synced 150 products successfully',
      details: '150 products updated, 0 errors',
      timestamp: '2024-10-02T09:30:00Z'
    },
    {
      id: 2,
      type: 'orders',
      status: 'success',
      message: 'Synced 23 orders successfully',
      details: '23 new orders imported',
      timestamp: '2024-10-02T09:15:00Z'
    },
    {
      id: 3,
      type: 'inventory',
      status: 'warning',
      message: 'Inventory sync completed with warnings',
      details: '145 items synced, 5 items out of stock',
      timestamp: '2024-10-02T09:00:00Z'
    },
    {
      id: 4,
      type: 'products',
      status: 'error',
      message: 'Product sync failed',
      details: 'API rate limit exceeded. Retry in 15 minutes.',
      timestamp: '2024-10-02T08:45:00Z'
    }
  ]

  // Bulk Actions Handlers
  const handleSelectAll = () => {
    if (selectedPlatforms.size === paginatedPlatforms.length) {
      setSelectedPlatforms(new Set())
    } else {
      setSelectedPlatforms(new Set(paginatedPlatforms.map(p => p.id)))
    }
  }

  const handleSelectPlatform = (id) => {
    const newSelected = new Set(selectedPlatforms)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedPlatforms(newSelected)
  }

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedPlatforms.size} selected platforms?`)) {
      selectedPlatforms.forEach(id => deleteMutation.mutate(id))
      setSelectedPlatforms(new Set())
      toast({ title: `Deleted ${selectedPlatforms.size} platforms` })
    }
  }

  const handleBulkSync = () => {
    selectedPlatforms.forEach(id => syncNowMutation.mutate(id))
    setSelectedPlatforms(new Set())
    toast({ title: `Syncing ${selectedPlatforms.size} platforms` })
  }

  // Quick Actions Handlers
  const handleSyncAll = () => {
    if (confirm('Sync all platforms?')) {
      platforms?.items.forEach(p => syncNowMutation.mutate(p.id))
      toast({ title: 'Syncing all platforms' })
    }
  }

  const handleTestAll = () => {
    if (confirm('Test all platform connections?')) {
      platforms?.items.forEach(p => testConnectionMutation.mutate(p.id))
      toast({ title: 'Testing all connections' })
    }
  }

  // Export/Import Handlers
  const handleExport = () => {
    const csv = [
      ['Name', 'Type', 'Status', 'Products', 'Orders', 'Last Sync'].join(','),
      ...platforms.items.map(p => 
        [p.name, p.type, p.status, p.products_synced, p.orders_synced, p.last_sync].join(',')
      )
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `platforms-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    toast({ title: 'Platforms exported successfully' })
  }

  const handleImport = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        // Parse CSV and import (simplified)
        toast({ title: 'Import feature coming soon' })
      }
      reader.readAsText(file)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sync Logs - {platform?.name}</DialogTitle>
          <DialogDescription>
            View synchronization history and status
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {mockLogs.map(log => (
            <Card key={log.id}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  {getStatusIcon(log.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{log.message}</p>
                      <Badge className={getStatusColor(log.status)}>
                        {log.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{log.details}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Badge variant="outline">{log.type}</Badge>
                      <span>•</span>
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function Platforms() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPlatform, setEditingPlatform] = useState(null)
  const [logsDialogOpen, setLogsDialogOpen] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState(null)
  const [isAddPlatformTypeOpen, setIsAddPlatformTypeOpen] = useState(false)
  const [editingPlatformType, setEditingPlatformType] = useState(null)
  const [customPlatforms, setCustomPlatforms] = useState([])
  const [syncingPlatforms, setSyncingPlatforms] = useState(new Set())
  const [testingPlatforms, setTestingPlatforms] = useState(new Set())
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // New states for additional features
  const [selectedPlatforms, setSelectedPlatforms] = useState(new Set())
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [platformTypeFilter, setPlatformTypeFilter] = useState('all')
  const [syncIntervalFilter, setSyncIntervalFilter] = useState('all')
  const [successRateFilter, setSuccessRateFilter] = useState('all')
  const [isOpen, setIsOpen] = useState(false)

  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Load custom platforms from localStorage on mount
  useEffect(() => {
    const loaded = loadCustomPlatforms()
    setCustomPlatforms(loaded)
  }, [])

  // Handle adding/updating platform type
  const handleAddPlatformType = (platformData, editingPlatform) => {
    let updated
    if (editingPlatform) {
      // Update existing
      updated = customPlatforms.map(p => 
        p.value === editingPlatform.value ? platformData : p
      )
    } else {
      // Add new
      updated = [...customPlatforms, platformData]
    }
    setCustomPlatforms(updated)
    saveCustomPlatforms(updated)
  }

  // Handle deleting platform type
  const handleDeletePlatformType = (platformValue) => {
    if (confirm('Delete this platform type? This cannot be undone.')) {
      const updated = customPlatforms.filter(p => p.value !== platformValue)
      setCustomPlatforms(updated)
      saveCustomPlatforms(updated)
      toast({ title: 'Platform type deleted successfully' })
    }
  }

  // Mock data
  const mockPlatforms = [
    {
      id: 1,
      name: 'My Shopee Store',
      type: 'shopee',
      shop_id: 'SHOP123456',
      status: 'connected',
      is_active: true,
      auto_sync: true,
      sync_interval: 15,
      last_sync: '2024-10-02T09:30:00Z',
      products_synced: 150,
      orders_synced: 234,
      sync_products: true,
      sync_orders: true,
      sync_inventory: true,
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      name: 'Lazada Official Store',
      type: 'lazada',
      shop_id: 'LAZ789012',
      status: 'connected',
      is_active: true,
      auto_sync: true,
      sync_interval: 30,
      last_sync: '2024-10-02T09:00:00Z',
      products_synced: 120,
      orders_synced: 189,
      sync_products: true,
      sync_orders: true,
      sync_inventory: true,
      created_at: '2024-01-20T10:00:00Z'
    },
    {
      id: 3,
      name: 'Amazon Seller',
      type: 'amazon',
      shop_id: 'AMZ345678',
      status: 'error',
      is_active: true,
      auto_sync: true,
      sync_interval: 60,
      last_sync: '2024-10-01T15:30:00Z',
      products_synced: 89,
      orders_synced: 156,
      sync_products: true,
      sync_orders: true,
      sync_inventory: false,
      created_at: '2024-02-01T10:00:00Z'
    },
    {
      id: 4,
      name: 'Line MyShop',
      type: 'line_myshop',
      shop_id: 'LINE901234',
      status: 'connected',
      is_active: false,
      auto_sync: false,
      sync_interval: 60,
      last_sync: '2024-09-30T10:00:00Z',
      products_synced: 45,
      orders_synced: 67,
      sync_products: true,
      sync_orders: true,
      sync_inventory: true,
      created_at: '2024-03-10T10:00:00Z'
    }
  ]

  const { data: platforms, isLoading } = useQuery({
    queryKey: ['platforms', { search: searchTerm, status: statusFilter }],
    queryFn: () => {
      let filtered = mockPlatforms
      
      if (searchTerm) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.type.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      if (statusFilter !== 'all') {
        filtered = filtered.filter(p => p.status === statusFilter)
      }
      
      return Promise.resolve({ items: filtered, total: filtered.length })
    }
  })

  const testConnectionMutation = useMutation({
    mutationFn: (id) => Promise.resolve(),
    onSuccess: () => {
      toast({ title: 'Connection test successful', description: 'Platform is connected and working properly' })
    }
  })

  const syncNowMutation = useMutation({
    mutationFn: (id) => Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries(['platforms'])
      toast({ title: 'Sync started', description: 'Syncing data from platform...' })
    }
  })

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, is_active }) => Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries(['platforms'])
      toast({ title: 'Platform status updated' })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries(['platforms'])
      toast({ title: 'Platform disconnected' })
    }
  })

  const handleEdit = (platform) => {
    setEditingPlatform(platform)
    setIsFormOpen(true)
  }

  const handleTestConnection = (platform) => {
    setTestingPlatforms(prev => new Set(prev).add(platform.id))
    testConnectionMutation.mutate(platform.id, {
      onSettled: () => {
        setTestingPlatforms(prev => {
          const next = new Set(prev)
          next.delete(platform.id)
          return next
        })
      }
    })
  }

  const handleSyncNow = (platform) => {
    setSyncingPlatforms(prev => new Set(prev).add(platform.id))
    syncNowMutation.mutate(platform.id, {
      onSettled: () => {
        setSyncingPlatforms(prev => {
          const next = new Set(prev)
          next.delete(platform.id)
          return next
        })
      }
    })
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    queryClient.invalidateQueries(['platforms'])
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleToggleActive = (platform) => {
    toggleActiveMutation.mutate({ id: platform.id, is_active: !platform.is_active })
  }

  const handleDelete = (platform) => {
    if (confirm(`Disconnect "${platform.name}"?`)) {
      deleteMutation.mutate(platform.id)
    }
  }

  const handleViewLogs = (platform) => {
    setSelectedPlatform(platform)
    setLogsDialogOpen(true)
  }

  const getPlatformColor = (type) => {
    const defaultColors = {
      shopee: 'bg-orange-500',
      lazada: 'bg-blue-500',
      amazon: 'bg-yellow-600',
      line_myshop: 'bg-green-500',
      facebook_shop: 'bg-blue-600',
      tiktok_shop: 'bg-black',
      instagram_shop: 'bg-pink-500'
    }
    
    // Check custom platforms
    const customPlatform = customPlatforms.find(p => p.value === type)
    if (customPlatform) return customPlatform.color
    
    return defaultColors[type] || 'bg-gray-500'
  }

  const getPlatformLabel = (type) => {
    const defaultLabels = {
      shopee: 'Shopee',
      lazada: 'Lazada',
      amazon: 'Amazon',
      line_myshop: 'Line MyShop',
      facebook_shop: 'Facebook Shop',
      tiktok_shop: 'TikTok Shop',
      instagram_shop: 'Instagram Shop'
    }
    
    // Check custom platforms
    const customPlatform = customPlatforms.find(p => p.value === type)
    if (customPlatform) return customPlatform.label
    
    return defaultLabels[type] || type
  }

  // Bulk Actions Handlers
  const handleSelectAll = () => {
    if (selectedPlatforms.size === paginatedPlatforms.length) {
      setSelectedPlatforms(new Set())
    } else {
      setSelectedPlatforms(new Set(paginatedPlatforms.map(p => p.id)))
    }
  }

  const handleSelectPlatform = (id) => {
    const newSelected = new Set(selectedPlatforms)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedPlatforms(newSelected)
  }

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedPlatforms.size} selected platforms?`)) {
      selectedPlatforms.forEach(id => deleteMutation.mutate(id))
      setSelectedPlatforms(new Set())
      toast({ title: `Deleted ${selectedPlatforms.size} platforms` })
    }
  }

  const handleBulkSync = () => {
    selectedPlatforms.forEach(id => syncNowMutation.mutate(id))
    setSelectedPlatforms(new Set())
    toast({ title: `Syncing ${selectedPlatforms.size} platforms` })
  }

  // Quick Actions Handlers
  const handleSyncAll = () => {
    if (confirm('Sync all platforms?')) {
      platforms?.items.forEach(p => syncNowMutation.mutate(p.id))
      toast({ title: 'Syncing all platforms' })
    }
  }

  const handleTestAll = () => {
    if (confirm('Test all platform connections?')) {
      platforms?.items.forEach(p => testConnectionMutation.mutate(p.id))
      toast({ title: 'Testing all connections' })
    }
  }

  // Export/Import Handlers
  const handleExport = () => {
    const csv = [
      ['Name', 'Type', 'Status', 'Products', 'Orders', 'Last Sync'].join(','),
      ...platforms.items.map(p => 
        [p.name, p.type, p.status, p.products_synced, p.orders_synced, p.last_sync].join(',')
      )
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `platforms-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    toast({ title: 'Platforms exported successfully' })
  }

  const handleImport = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        // Parse CSV and import (simplified)
        toast({ title: 'Import feature coming soon' })
      }
      reader.readAsText(file)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800'
      case 'disconnected': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Apply additional filters
  let filteredPlatforms = platforms?.items || []
  
  // Filter by platform type
  if (platformTypeFilter !== 'all') {
    filteredPlatforms = filteredPlatforms.filter(p => p.type === platformTypeFilter)
  }
  
  // Filter by sync interval
  if (syncIntervalFilter !== 'all') {
    const interval = parseInt(syncIntervalFilter)
    filteredPlatforms = filteredPlatforms.filter(p => p.sync_interval === interval)
  }
  
  // Filter by success rate
  if (successRateFilter !== 'all') {
    // Mock success rate filter (in real app, would check actual success rate)
    filteredPlatforms = filteredPlatforms.filter(p => p.status === 'connected')
  }
  
  // Sort platforms
  const sortedPlatforms = [...filteredPlatforms].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'status':
        return a.status.localeCompare(b.status)
      case 'lastSync':
        return new Date(b.last_sync || 0) - new Date(a.last_sync || 0)
      default:
        return 0
    }
  })

  // Pagination
  const totalItems = sortedPlatforms.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPlatforms = sortedPlatforms.slice(startIndex, endIndex)

  const totalPlatforms = platforms?.total || 0
  const connectedPlatforms = platforms?.items?.filter(p => p.status === 'connected').length || 0
  const totalProducts = platforms?.items?.reduce((sum, p) => sum + p.products_synced, 0) || 0
  const totalOrders = platforms?.items?.reduce((sum, p) => sum + p.orders_synced, 0) || 0

  // Check if empty
  const isEmpty = !isLoading && totalPlatforms === 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        {/* Row 1: Title */}
        <div>
          <h1 className="text-3xl font-bold">Platform Integrations</h1>
          <p className="text-muted-foreground">
            Connect and manage your e-commerce platforms
          </p>
        </div>

        {/* Row 2: All Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                <Zap className="h-4 w-4 mr-2" />
                Quick Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleSyncAll}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync All Platforms
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTestAll}>
                <Activity className="h-4 w-4 mr-2" />
                Test All Connections
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Toggle */}
          <div className="flex border rounded-md">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Export/Import */}
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" asChild>
            <label className="cursor-pointer flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Import
              <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
            </label>
          </Button>

          <Button 
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          {/* Main Actions - Right Side */}
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setIsAddPlatformTypeOpen(true)}
            className="ml-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Platform Type
          </Button>
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { setEditingPlatform(null); setIsFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Connect Platform
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Platforms</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlatforms}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedPlatforms}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Synced</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Synced</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search platforms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="connected">Connected</SelectItem>
                <SelectItem value="disconnected">Disconnected</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>

            <Select value={platformTypeFilter} onValueChange={setPlatformTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Platform Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="shopee">Shopee</SelectItem>
                <SelectItem value="lazada">Lazada</SelectItem>
                <SelectItem value="amazon">Amazon</SelectItem>
                <SelectItem value="line_myshop">Line MyShop</SelectItem>
                {customPlatforms.map(p => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={syncIntervalFilter} onValueChange={setSyncIntervalFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sync Interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Intervals</SelectItem>
                <SelectItem value="15">Every 15 min</SelectItem>
                <SelectItem value="30">Every 30 min</SelectItem>
                <SelectItem value="60">Every 60 min</SelectItem>
              </SelectContent>
            </Select>

            <Select value={successRateFilter} onValueChange={setSuccessRateFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Success Rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rates</SelectItem>
                <SelectItem value="high">High (&gt;95%)</SelectItem>
                <SelectItem value="medium">Medium (80-95%)</SelectItem>
                <SelectItem value="low">Low (&lt;80%)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="lastSync">Last Sync</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Help Link */}
      <div className="flex items-center justify-between text-sm">
        <a 
          href="https://docs.example.com/platforms" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline flex items-center gap-1"
        >
          <AlertCircle className="h-4 w-4" />
          Need help? View platform integration documentation
        </a>
        <span className="text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} platforms
        </span>
      </div>

      {/* Custom Platform Types Management */}
      {customPlatforms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Custom Platform Types</CardTitle>
            <CardDescription>Manage your custom platform types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {customPlatforms.map((platform) => (
                <div key={platform.value} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded ${platform.color} flex items-center justify-center text-white font-bold text-sm`}>
                      {platform.label.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{platform.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {platform.customFields?.length || 0} custom fields
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingPlatformType(platform)
                        setIsAddPlatformTypeOpen(true)
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePlatformType(platform.value)}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {isEmpty && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Link2Off className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No platforms connected yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Connect your first platform to start syncing products, orders, and inventory across your e-commerce channels.
            </p>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Connect Platform
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions Bar */}
      {selectedPlatforms.size > 0 && (
        <Card className="bg-primary/10 border-primary">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-primary" />
                <span className="font-medium">{selectedPlatforms.size} platform(s) selected</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleBulkSync}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Selected
                </Button>
                <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Platforms Grid */}
      {!isEmpty && (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))
          ) : (
            paginatedPlatforms.map((platform) => (
            <Card key={platform.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* Checkbox for bulk selection */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleSelectPlatform(platform.id)}
                    >
                      {selectedPlatforms.has(platform.id) ? (
                        <CheckSquare className="h-5 w-5 text-primary" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </Button>
                    
                    <div className={`w-12 h-12 rounded-lg ${getPlatformColor(platform.type)} flex items-center justify-center text-white font-bold relative`}>
                      {getPlatformLabel(platform.type).substring(0, 2).toUpperCase()}
                      {/* Status Indicator */}
                      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        platform.status === 'connected' ? 'bg-green-500' : 
                        platform.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{platform.name}</CardTitle>
                      <CardDescription>{getPlatformLabel(platform.type)}</CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => toast({ title: 'Updated', description: 'Data updated successfully' })}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(platform)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleTestConnection(platform)}
                        disabled={testingPlatforms.has(platform.id)}
                      >
                        <Activity className={`h-4 w-4 mr-2 ${testingPlatforms.has(platform.id) ? 'animate-pulse' : ''}`} />
                        {testingPlatforms.has(platform.id) ? 'Testing...' : 'Test Connection'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleSyncNow(platform)}
                        disabled={syncingPlatforms.has(platform.id)}
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${syncingPlatforms.has(platform.id) ? 'animate-spin' : ''}`} />
                        {syncingPlatforms.has(platform.id) ? 'Syncing...' : 'Sync Now'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewLogs(platform)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Logs
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(platform)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Disconnect
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={getStatusColor(platform.status)}>
                    {platform.status === 'connected' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {platform.status === 'error' && <XCircle className="h-3 w-3 mr-1" />}
                    {platform.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active</span>
                  <Switch
                    checked={platform.is_active}
                    onCheckedChange={() => handleToggleActive(platform)}
                  />
                </div>

                <div className="pt-3 border-t space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Products Synced</span>
                    <span className="font-medium">{platform.products_synced}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Orders Synced</span>
                    <span className="font-medium">{platform.orders_synced}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Sync</span>
                    <span className="font-medium">
                      {platform.last_sync ? new Date(platform.last_sync).toLocaleString() : 'Never'}
                    </span>
                  </div>
                  
                  {/* Last Activity */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      Last Activity
                    </span>
                    <span className="font-medium text-xs">
                      {platform.last_sync 
                        ? `Synced ${Math.floor((Date.now() - new Date(platform.last_sync)) / 60000)} min ago`
                        : 'No activity yet'
                      }
                    </span>
                  </div>
                </div>

                {platform.auto_sync && (
                  <div className="pt-3 border-t space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" />
                        Auto-sync interval
                      </span>
                      <span className="font-medium">Every {platform.sync_interval} min</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Next sync
                      </span>
                      <span className="font-medium">
                        {platform.last_sync 
                          ? new Date(new Date(platform.last_sync).getTime() + platform.sync_interval * 60000).toLocaleTimeString()
                          : 'Soon'
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Success rate
                      </span>
                      <span className="font-medium text-green-600">98%</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
        </div>
      )}

      {/* Pagination */}
      {!isEmpty && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-10"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Add Platform Type Dialog */}
      <AddPlatformTypeDialog
        isOpen={isAddPlatformTypeOpen}
        onClose={() => {
          setIsAddPlatformTypeOpen(false)
          setEditingPlatformType(null)
        }}
        onAdd={handleAddPlatformType}
        editingPlatform={editingPlatformType}
      />

      {/* Form Dialog */}
      <PlatformFormDialog
        platform={editingPlatform}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingPlatform(null)
        }}
        customPlatforms={customPlatforms}
      />

      {/* Sync Logs Dialog */}
      <SyncLogsDialog
        platform={selectedPlatform}
        isOpen={logsDialogOpen}
        onClose={() => {
          setLogsDialogOpen(false)
          setSelectedPlatform(null)
        }}
      />
    </div>
  )
}
