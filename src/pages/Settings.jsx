import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import {
  Save,
  Building2,
  Bell,
  Shield,
  Database,
  CreditCard,
  FileText,
  RotateCcw,
  AlertCircle
} from 'lucide-react'

export default function Settings() {
  const { toast } = useToast()
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    storeName: 'E-commerce Pro',
    storeEmail: 'admin@ecommerce-pro.com',
    storePhone: '+66 2 123 4567',
    timezone: 'Asia/Bangkok',
    currency: 'THB',
    language: 'en'
  })
  const [generalErrors, setGeneralErrors] = useState({})

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderNotifications: true,
    inventoryNotifications: true,
    marketingEmails: false
  })

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    ipWhitelist: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [securityErrors, setSecurityErrors] = useState({})

  // Integration Settings
  const [integrationSettings, setIntegrationSettings] = useState({
    autoSync: true,
    syncInterval: '15',
    webhookEnabled: true,
    webhookUrl: ''
  })
  const [integrationErrors, setIntegrationErrors] = useState({})

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    creditCard: true,
    paypal: true,
    bankTransfer: true,
    promptpay: true,
    taxRate: '7'
  })
  const [paymentErrors, setPaymentErrors] = useState({})

  // Invoice Settings
  const [invoiceSettings, setInvoiceSettings] = useState({
    companyNameTh: 'E-Commerce Pro Company Limited',
    companyNameEn: 'E-commerce Pro Co., Ltd.',
    taxId: '0123456789012',
    branch: 'Headquarters',
    addressTh: '123 Sukhumvit Rd, Khlong Toei Subdistrict, Khlong Toei District, Bangkok 10110',
    addressEn: '123 Sukhumvit Road, Khlong Toei, Bangkok 10110',
    invoicePrefix: 'INV',
    invoiceStart: '1',
    taxInvoicePrefix: 'TIV',
    taxInvoiceStart: '1',
    invoiceNotes: 'Thank you for your business!',
    paymentTerms: '7',
    autoInvoice: true,
    includeLogo: true
  })
  const [invoiceErrors, setInvoiceErrors] = useState({})

  // Default values for reset
  const defaultSettings = {
    general: {
      storeName: 'E-commerce Pro',
      storeEmail: 'admin@ecommerce-pro.com',
      storePhone: '+66 2 123 4567',
      timezone: 'Asia/Bangkok',
      currency: 'THB',
      language: 'en'
    },
    notification: {
      emailNotifications: true,
      orderNotifications: true,
      inventoryNotifications: true,
      marketingEmails: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      ipWhitelist: false,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    integration: {
      autoSync: true,
      syncInterval: '15',
      webhookEnabled: true,
      webhookUrl: ''
    },
    payment: {
      creditCard: true,
      paypal: true,
      bankTransfer: true,
      promptpay: true,
      taxRate: '7'
    },
    invoice: {
      companyNameTh: 'E-Commerce Pro Company Limited',
      companyNameEn: 'E-commerce Pro Co., Ltd.',
      taxId: '0123456789012',
      branch: 'Headquarters',
      addressTh: '123 Sukhumvit Rd, Khlong Toei Subdistrict, Khlong Toei District, Bangkok 10110',
      addressEn: '123 Sukhumvit Road, Khlong Toei, Bangkok 10110',
      invoicePrefix: 'INV',
      invoiceStart: '1',
      taxInvoicePrefix: 'TIV',
      taxInvoiceStart: '1',
      invoiceNotes: 'Thank you for your business!',
      paymentTerms: '7',
      autoInvoice: true,
      includeLogo: true
    }
  }

  // Warn before leaving if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePhone = (phone) => {
    const re = /^[+]?[\d\s-()]+$/
    return re.test(phone) && phone.replace(/\D/g, '').length >= 9
  }

  const validateUrl = (url) => {
    if (!url) return true // Optional field
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const validateTaxId = (taxId) => {
    return /^\d{13}$/.test(taxId)
  }

  // Validate General Settings
  const validateGeneralSettings = () => {
    const errors = {}
    if (!generalSettings.storeName.trim()) {
      errors.storeName = 'Store name is required'
    }
    if (!validateEmail(generalSettings.storeEmail)) {
      errors.storeEmail = 'Invalid email format'
    }
    if (!validatePhone(generalSettings.storePhone)) {
      errors.storePhone = 'Invalid phone format'
    }
    setGeneralErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Validate Security Settings
  const validateSecuritySettings = () => {
    const errors = {}
    if (securitySettings.newPassword) {
      if (!securitySettings.currentPassword) {
        errors.currentPassword = 'Current password is required'
      }
      if (securitySettings.newPassword.length < 8) {
        errors.newPassword = 'Password must be at least 8 characters'
      }
      if (securitySettings.newPassword !== securitySettings.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
      }
    }
    setSecurityErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Validate Integration Settings
  const validateIntegrationSettings = () => {
    const errors = {}
    if (integrationSettings.webhookEnabled && integrationSettings.webhookUrl) {
      if (!validateUrl(integrationSettings.webhookUrl)) {
        errors.webhookUrl = 'Invalid URL format'
      }
    }
    setIntegrationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Validate Payment Settings
  const validatePaymentSettings = () => {
    const errors = {}
    const taxRate = parseFloat(paymentSettings.taxRate)
    if (isNaN(taxRate) || taxRate < 0 || taxRate > 100) {
      errors.taxRate = 'Tax rate must be between 0 and 100'
    }
    setPaymentErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Validate Invoice Settings
  const validateInvoiceSettings = () => {
    const errors = {}
    if (!invoiceSettings.companyNameTh.trim()) {
      errors.companyNameTh = 'Company name (Thai) is required'
    }
    if (!invoiceSettings.companyNameEn.trim()) {
      errors.companyNameEn = 'Company name (English) is required'
    }
    if (!validateTaxId(invoiceSettings.taxId)) {
      errors.taxId = 'Tax ID must be 13 digits'
    }
    setInvoiceErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Save handlers
  const handleSaveGeneral = () => {
    if (!validateGeneralSettings()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before saving',
        variant: 'destructive'
      })
      return
    }
    toast({
      title: 'Settings saved',
      description: 'General settings have been updated successfully'
    })
    setHasUnsavedChanges(false)
  }

  const handleSaveNotifications = () => {
    toast({
      title: 'Settings saved',
      description: 'Notification settings have been updated successfully'
    })
    setHasUnsavedChanges(false)
  }

  const handleSaveSecurity = () => {
    if (!validateSecuritySettings()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before saving',
        variant: 'destructive'
      })
      return
    }
    toast({
      title: 'Settings saved',
      description: 'Security settings have been updated successfully'
    })
    setHasUnsavedChanges(false)
    // Clear password fields after save
    setSecuritySettings(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }))
  }

  const handleSaveIntegrations = () => {
    if (!validateIntegrationSettings()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before saving',
        variant: 'destructive'
      })
      return
    }
    toast({
      title: 'Settings saved',
      description: 'Integration settings have been updated successfully'
    })
    setHasUnsavedChanges(false)
  }

  const handleSavePayment = () => {
    if (!validatePaymentSettings()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before saving',
        variant: 'destructive'
      })
      return
    }
    toast({
      title: 'Settings saved',
      description: 'Payment settings have been updated successfully'
    })
    setHasUnsavedChanges(false)
  }

  const handleSaveInvoice = () => {
    if (!validateInvoiceSettings()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before saving',
        variant: 'destructive'
      })
      return
    }
    toast({
      title: 'Settings saved',
      description: 'Invoice settings have been updated successfully'
    })
    setHasUnsavedChanges(false)
  }

  // Reset handlers
  const handleResetGeneral = () => {
    setGeneralSettings(defaultSettings.general)
    setGeneralErrors({})
    setHasUnsavedChanges(true)
    toast({
      title: 'Settings reset',
      description: 'General settings have been reset to default values'
    })
  }

  const handleResetNotifications = () => {
    setNotificationSettings(defaultSettings.notification)
    setHasUnsavedChanges(true)
    toast({
      title: 'Settings reset',
      description: 'Notification settings have been reset to default values'
    })
  }

  const handleResetSecurity = () => {
    setSecuritySettings(defaultSettings.security)
    setSecurityErrors({})
    setHasUnsavedChanges(true)
    toast({
      title: 'Settings reset',
      description: 'Security settings have been reset to default values'
    })
  }

  const handleResetIntegrations = () => {
    setIntegrationSettings(defaultSettings.integration)
    setIntegrationErrors({})
    setHasUnsavedChanges(true)
    toast({
      title: 'Settings reset',
      description: 'Integration settings have been reset to default values'
    })
  }

  const handleResetPayment = () => {
    setPaymentSettings(defaultSettings.payment)
    setPaymentErrors({})
    setHasUnsavedChanges(true)
    toast({
      title: 'Settings reset',
      description: 'Payment settings have been reset to default values'
    })
  }

  const handleResetInvoice = () => {
    setInvoiceSettings(defaultSettings.invoice)
    setInvoiceErrors({})
    setHasUnsavedChanges(true)
    toast({
      title: 'Settings reset',
      description: 'Invoice settings have been reset to default values'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your store settings and preferences
        </p>
      </div>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            You have unsaved changes. Don't forget to save your settings.
          </p>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">
            <Building2 className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Database className="h-4 w-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="invoice">
            <FileText className="h-4 w-4 mr-2" />
            Invoice
          </TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic information about your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Store Name *</Label>
                  <Input
                    id="store-name"
                    value={generalSettings.storeName}
                    onChange={(e) => {
                      setGeneralSettings(prev => ({ ...prev, storeName: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                    className={generalErrors.storeName ? 'border-red-500' : ''}
                  />
                  {generalErrors.storeName && (
                    <p className="text-sm text-red-500">{generalErrors.storeName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-email">Store Email *</Label>
                  <Input
                    id="store-email"
                    type="email"
                    value={generalSettings.storeEmail}
                    onChange={(e) => {
                      setGeneralSettings(prev => ({ ...prev, storeEmail: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                    className={generalErrors.storeEmail ? 'border-red-500' : ''}
                  />
                  {generalErrors.storeEmail && (
                    <p className="text-sm text-red-500">{generalErrors.storeEmail}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-phone">Store Phone *</Label>
                  <Input
                    id="store-phone"
                    value={generalSettings.storePhone}
                    onChange={(e) => {
                      setGeneralSettings(prev => ({ ...prev, storePhone: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                    className={generalErrors.storePhone ? 'border-red-500' : ''}
                  />
                  {generalErrors.storePhone && (
                    <p className="text-sm text-red-500">{generalErrors.storePhone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={generalSettings.timezone} 
                    onValueChange={(value) => {
                      setGeneralSettings(prev => ({ ...prev, timezone: value }))
                      setHasUnsavedChanges(true)
                    }}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Bangkok">Asia/Bangkok (GMT+7)</SelectItem>
                      <SelectItem value="Asia/Singapore">Asia/Singapore (GMT+8)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                      <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={generalSettings.currency} 
                    onValueChange={(value) => {
                      setGeneralSettings(prev => ({ ...prev, currency: value }))
                      setHasUnsavedChanges(true)
                    }}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="THB">THB - Thai Baht</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="SGD">SGD - Singapore Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={generalSettings.language} 
                    onValueChange={(value) => {
                      setGeneralSettings(prev => ({ ...prev, language: value }))
                      setHasUnsavedChanges(true)
                    }}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="th">Thai (Thai)</SelectItem>
                      <SelectItem value="zh">中文 (Chinese)</SelectItem>
                      <SelectItem value="ja">日本語 (Japanese)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between">
                <Button size="sm" variant="outline" onClick={handleResetGeneral}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveGeneral}>
                  <Save className="h-4 w-4 mr-2" />
                  Save General Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => {
                    setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                    setHasUnsavedChanges(true)
                  }}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Order Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new orders
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.orderNotifications}
                  onCheckedChange={(checked) => {
                    setNotificationSettings(prev => ({ ...prev, orderNotifications: checked }))
                    setHasUnsavedChanges(true)
                  }}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Inventory Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Alerts for low stock and out of stock items
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.inventoryNotifications}
                  onCheckedChange={(checked) => {
                    setNotificationSettings(prev => ({ ...prev, inventoryNotifications: checked }))
                    setHasUnsavedChanges(true)
                  }}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates and marketing content
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.marketingEmails}
                  onCheckedChange={(checked) => {
                    setNotificationSettings(prev => ({ ...prev, marketingEmails: checked }))
                    setHasUnsavedChanges(true)
                  }}
                />
              </div>
              <Separator />
              <div className="flex justify-between">
                <Button size="sm" variant="outline" onClick={handleResetNotifications}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveNotifications}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage security and access control
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) => {
                    setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))
                    setHasUnsavedChanges(true)
                  }}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout</Label>
                <Select 
                  value={securitySettings.sessionTimeout} 
                  onValueChange={(value) => {
                    setSecuritySettings(prev => ({ ...prev, sessionTimeout: value }))
                    setHasUnsavedChanges(true)
                  }}
                >
                  <SelectTrigger id="session-timeout">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="0">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>IP Whitelist</Label>
                  <p className="text-sm text-muted-foreground">
                    Restrict access to specific IP addresses
                  </p>
                </div>
                <Switch
                  checked={securitySettings.ipWhitelist}
                  onCheckedChange={(checked) => {
                    setSecuritySettings(prev => ({ ...prev, ipWhitelist: checked }))
                    setHasUnsavedChanges(true)
                  }}
                />
              </div>
              <Separator />
              <div className="space-y-4">
                <Label>Change Password</Label>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Current password"
                    value={securitySettings.currentPassword}
                    onChange={(e) => {
                      setSecuritySettings(prev => ({ ...prev, currentPassword: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                    className={securityErrors.currentPassword ? 'border-red-500' : ''}
                  />
                  {securityErrors.currentPassword && (
                    <p className="text-sm text-red-500">{securityErrors.currentPassword}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="New password (min 8 characters)"
                    value={securitySettings.newPassword}
                    onChange={(e) => {
                      setSecuritySettings(prev => ({ ...prev, newPassword: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                    className={securityErrors.newPassword ? 'border-red-500' : ''}
                  />
                  {securityErrors.newPassword && (
                    <p className="text-sm text-red-500">{securityErrors.newPassword}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={securitySettings.confirmPassword}
                    onChange={(e) => {
                      setSecuritySettings(prev => ({ ...prev, confirmPassword: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                    className={securityErrors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {securityErrors.confirmPassword && (
                    <p className="text-sm text-red-500">{securityErrors.confirmPassword}</p>
                  )}
                </div>
              </div>
              <Separator />
              <div className="flex justify-between">
                <Button size="sm" variant="outline" onClick={handleResetSecurity}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveSecurity}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integration Settings Tab */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>
                Configure platform integrations and sync settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Sync</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync data with connected platforms
                  </p>
                </div>
                <Switch
                  checked={integrationSettings.autoSync}
                  onCheckedChange={(checked) => {
                    setIntegrationSettings(prev => ({ ...prev, autoSync: checked }))
                    setHasUnsavedChanges(true)
                  }}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="sync-interval">Sync Interval</Label>
                <Select 
                  value={integrationSettings.syncInterval} 
                  onValueChange={(value) => {
                    setIntegrationSettings(prev => ({ ...prev, syncInterval: value }))
                    setHasUnsavedChanges(true)
                  }}
                >
                  <SelectTrigger id="sync-interval">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Webhook Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send webhook notifications for events
                  </p>
                </div>
                <Switch
                  checked={integrationSettings.webhookEnabled}
                  onCheckedChange={(checked) => {
                    setIntegrationSettings(prev => ({ ...prev, webhookEnabled: checked }))
                    setHasUnsavedChanges(true)
                  }}
                />
              </div>
              {integrationSettings.webhookEnabled && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input
                      id="webhook-url"
                      placeholder="https://your-domain.com/webhook"
                      value={integrationSettings.webhookUrl}
                      onChange={(e) => {
                        setIntegrationSettings(prev => ({ ...prev, webhookUrl: e.target.value }))
                        setHasUnsavedChanges(true)
                      }}
                      className={integrationErrors.webhookUrl ? 'border-red-500' : ''}
                    />
                    {integrationErrors.webhookUrl && (
                      <p className="text-sm text-red-500">{integrationErrors.webhookUrl}</p>
                    )}
                  </div>
                </>
              )}
              <Separator />
              <div className="flex justify-between">
                <Button size="sm" variant="outline" onClick={handleResetIntegrations}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveIntegrations}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Integration Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings Tab */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Configure payment methods and processing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Accepted Payment Methods</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="credit-card" 
                      checked={paymentSettings.creditCard}
                      onCheckedChange={(checked) => {
                        setPaymentSettings(prev => ({ ...prev, creditCard: checked }))
                        setHasUnsavedChanges(true)
                      }}
                    />
                    <Label htmlFor="credit-card">Credit/Debit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="paypal" 
                      checked={paymentSettings.paypal}
                      onCheckedChange={(checked) => {
                        setPaymentSettings(prev => ({ ...prev, paypal: checked }))
                        setHasUnsavedChanges(true)
                      }}
                    />
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="bank-transfer" 
                      checked={paymentSettings.bankTransfer}
                      onCheckedChange={(checked) => {
                        setPaymentSettings(prev => ({ ...prev, bankTransfer: checked }))
                        setHasUnsavedChanges(true)
                      }}
                    />
                    <Label htmlFor="bank-transfer">Bank Transfer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="promptpay" 
                      checked={paymentSettings.promptpay}
                      onCheckedChange={(checked) => {
                        setPaymentSettings(prev => ({ ...prev, promptpay: checked }))
                        setHasUnsavedChanges(true)
                      }}
                    />
                    <Label htmlFor="promptpay">PromptPay</Label>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                <Input
                  id="tax-rate"
                  type="number"
                  placeholder="7"
                  value={paymentSettings.taxRate}
                  onChange={(e) => {
                    setPaymentSettings(prev => ({ ...prev, taxRate: e.target.value }))
                    setHasUnsavedChanges(true)
                  }}
                  className={paymentErrors.taxRate ? 'border-red-500' : ''}
                />
                {paymentErrors.taxRate && (
                  <p className="text-sm text-red-500">{paymentErrors.taxRate}</p>
                )}
              </div>
              <Separator />
              <div className="flex justify-between">
                <Button size="sm" variant="outline" onClick={handleResetPayment}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSavePayment}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Payment Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoice Settings Tab */}
        <TabsContent value="invoice">
          <Card>
            <CardHeader>
              <CardTitle>Invoice & Tax Settings</CardTitle>
              <CardDescription>
                Configure invoice and tax document information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name-th">Company Name (Thai) *</Label>
                  <Input
                    id="company-name-th"
                    placeholder="E-Commerce Pro Company Limited"
                    value={invoiceSettings.companyNameTh}
                    onChange={(e) => {
                      setInvoiceSettings(prev => ({ ...prev, companyNameTh: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                    className={invoiceErrors.companyNameTh ? 'border-red-500' : ''}
                  />
                  {invoiceErrors.companyNameTh && (
                    <p className="text-sm text-red-500">{invoiceErrors.companyNameTh}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-name-en">Company Name (English) *</Label>
                  <Input
                    id="company-name-en"
                    placeholder="E-commerce Pro Co., Ltd."
                    value={invoiceSettings.companyNameEn}
                    onChange={(e) => {
                      setInvoiceSettings(prev => ({ ...prev, companyNameEn: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                    className={invoiceErrors.companyNameEn ? 'border-red-500' : ''}
                  />
                  {invoiceErrors.companyNameEn && (
                    <p className="text-sm text-red-500">{invoiceErrors.companyNameEn}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-id">Tax ID (13 digits) *</Label>
                  <Input
                    id="tax-id"
                    placeholder="0123456789012"
                    value={invoiceSettings.taxId}
                    onChange={(e) => {
                      setInvoiceSettings(prev => ({ ...prev, taxId: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                    className={invoiceErrors.taxId ? 'border-red-500' : ''}
                  />
                  {invoiceErrors.taxId && (
                    <p className="text-sm text-red-500">{invoiceErrors.taxId}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    placeholder="Headquarters"
                    value={invoiceSettings.branch}
                    onChange={(e) => {
                      setInvoiceSettings(prev => ({ ...prev, branch: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address-th">Address (Thai)</Label>
                  <Input
                    id="address-th"
                    placeholder="123 Sukhumvit Rd, Khlong Toei Subdistrict, Khlong Toei District, Bangkok 10110"
                    value={invoiceSettings.addressTh}
                    onChange={(e) => {
                      setInvoiceSettings(prev => ({ ...prev, addressTh: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address-en">Address (English)</Label>
                  <Input
                    id="address-en"
                    placeholder="123 Sukhumvit Road, Khlong Toei, Bangkok 10110"
                    value={invoiceSettings.addressEn}
                    onChange={(e) => {
                      setInvoiceSettings(prev => ({ ...prev, addressEn: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoice-prefix">Invoice Number Prefix</Label>
                  <Input
                    id="invoice-prefix"
                    placeholder="INV"
                    value={invoiceSettings.invoicePrefix}
                    onChange={(e) => {
                      setInvoiceSettings(prev => ({ ...prev, invoicePrefix: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice-start">Starting Number</Label>
                  <Input
                    id="invoice-start"
                    type="number"
                    placeholder="1"
                    value={invoiceSettings.invoiceStart}
                    onChange={(e) => {
                      setInvoiceSettings(prev => ({ ...prev, invoiceStart: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tax-invoice-prefix">Tax Invoice Number Prefix</Label>
                  <Input
                    id="tax-invoice-prefix"
                    placeholder="TIV"
                    value={invoiceSettings.taxInvoicePrefix}
                    onChange={(e) => {
                      setInvoiceSettings(prev => ({ ...prev, taxInvoicePrefix: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-invoice-start">Starting Number</Label>
                  <Input
                    id="tax-invoice-start"
                    type="number"
                    placeholder="1"
                    value={invoiceSettings.taxInvoiceStart}
                    onChange={(e) => {
                      setInvoiceSettings(prev => ({ ...prev, taxInvoiceStart: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="invoice-notes">Default Invoice Notes</Label>
                <Input
                  id="invoice-notes"
                  placeholder="Thank you for your business!"
                  value={invoiceSettings.invoiceNotes}
                  onChange={(e) => {
                    setInvoiceSettings(prev => ({ ...prev, invoiceNotes: e.target.value }))
                    setHasUnsavedChanges(true)
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-terms">Payment Terms</Label>
                <Select 
                  value={invoiceSettings.paymentTerms} 
                  onValueChange={(value) => {
                    setInvoiceSettings(prev => ({ ...prev, paymentTerms: value }))
                    setHasUnsavedChanges(true)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Due on Receipt</SelectItem>
                    <SelectItem value="7">Net 7 Days</SelectItem>
                    <SelectItem value="15">Net 15 Days</SelectItem>
                    <SelectItem value="30">Net 30 Days</SelectItem>
                    <SelectItem value="60">Net 60 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="auto-invoice" 
                  checked={invoiceSettings.autoInvoice}
                  onCheckedChange={(checked) => {
                    setInvoiceSettings(prev => ({ ...prev, autoInvoice: checked }))
                    setHasUnsavedChanges(true)
                  }}
                />
                <Label htmlFor="auto-invoice">Auto-generate invoice number</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="include-logo" 
                  checked={invoiceSettings.includeLogo}
                  onCheckedChange={(checked) => {
                    setInvoiceSettings(prev => ({ ...prev, includeLogo: checked }))
                    setHasUnsavedChanges(true)
                  }}
                />
                <Label htmlFor="include-logo">Include company logo on invoices</Label>
              </div>

              <Separator />
              <div className="flex justify-between">
                <Button size="sm" variant="outline" onClick={handleResetInvoice}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveInvoice}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Invoice Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
