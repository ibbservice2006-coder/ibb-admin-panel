import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Percent, Edit, Trash2, Search, Calculator } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

export default function TaxSettings() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState(null)
  const [deletingRuleId, setDeletingRuleId] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    rate: '',
    country: '',
    region: '',
    applyTo: ''
  })

  // Mock data with state
  const [taxRules, setTaxRules] = useState([
    {
      id: 1,
      name: 'VAT Thailand',
      type: 'VAT',
      rate: 7,
      country: 'Thailand',
      region: 'All',
      status: 'active',
      applyTo: 'All Products'
    },
    {
      id: 2,
      name: 'Singapore GST',
      type: 'GST',
      rate: 8,
      country: 'Singapore',
      region: 'All',
      status: 'active',
      applyTo: 'All Products'
    },
    {
      id: 3,
      name: 'Luxury Tax',
      type: 'Special',
      rate: 15,
      country: 'Thailand',
      region: 'Bangkok',
      status: 'active',
      applyTo: 'Luxury Items'
    }
  ])

  const filteredTaxRules = taxRules.filter(rule =>
    rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.country.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle Add/Edit Rule
  const handleOpenDialog = (rule = null) => {
    if (rule) {
      setEditingRule(rule)
      setFormData({
        name: rule.name,
        type: rule.type,
        rate: rule.rate.toString(),
        country: rule.country,
        region: rule.region,
        applyTo: rule.applyTo
      })
    } else {
      setEditingRule(null)
      setFormData({ name: '', type: '', rate: '', country: '', region: '', applyTo: '' })
    }
    setIsDialogOpen(true)
  }

  const handleSaveRule = () => {
    if (editingRule) {
      // Update existing rule
      setTaxRules(taxRules.map(r => 
        r.id === editingRule.id 
          ? {
              ...r,
              name: formData.name,
              type: formData.type,
              rate: parseFloat(formData.rate),
              country: formData.country,
              region: formData.region,
              applyTo: formData.applyTo
            }
          : r
      ))
    } else {
      // Add new rule
      const newRule = {
        id: Math.max(...taxRules.map(r => r.id)) + 1,
        name: formData.name,
        type: formData.type,
        rate: parseFloat(formData.rate),
        country: formData.country,
        region: formData.region,
        applyTo: formData.applyTo,
        status: 'active'
      }
      setTaxRules([...taxRules, newRule])
    }
    setIsDialogOpen(false)
    setFormData({ name: '', type: '', rate: '', country: '', region: '', applyTo: '' })
  }

  // Handle Delete Rule
  const handleDeleteClick = (ruleId) => {
    setDeletingRuleId(ruleId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    setTaxRules(taxRules.filter(r => r.id !== deletingRuleId))
    setIsDeleteDialogOpen(false)
    setDeletingRuleId(null)
  }

  const totalTaxCollected = 45200
  const avgRate = taxRules.reduce((sum, r) => sum + r.rate, 0) / taxRules.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tax Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure tax rates and rules for different regions and product types
          </p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white gap-2" onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4" />
          Add Tax Rule
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Rules</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taxRules.length}</div>
            <p className="text-xs text-muted-foreground">Active tax rules</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRate.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Average tax rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(taxRules.map(r => r.country)).size}</div>
            <p className="text-xs text-muted-foreground">Countries with tax</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Collected</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{totalTaxCollected.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Tax Rules Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tax Rules</CardTitle>
              <CardDescription>Manage tax rates and regulations</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tax rules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tax Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Apply To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTaxRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{rule.type}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{rule.rate}%</TableCell>
                  <TableCell>{rule.country}</TableCell>
                  <TableCell>{rule.region}</TableCell>
                  <TableCell>{rule.applyTo}</TableCell>
                  <TableCell>
                    <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                      {rule.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(rule)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(rule.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingRule ? 'Edit Tax Rule' : 'Create Tax Rule'}</DialogTitle>
            <DialogDescription>
              {editingRule ? 'Update tax rule details' : 'Define a new tax rule with rates and applicable regions'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tax-name">Tax Name</Label>
              <Input 
                id="tax-name" 
                placeholder="e.g., VAT Thailand" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tax-type">Tax Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger id="tax-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VAT">VAT</SelectItem>
                    <SelectItem value="GST">GST</SelectItem>
                    <SelectItem value="Sales">Sales Tax</SelectItem>
                    <SelectItem value="Special">Special Tax</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                <Input 
                  id="tax-rate" 
                  type="number" 
                  placeholder="0.00" 
                  value={formData.rate}
                  onChange={(e) => setFormData({...formData, rate: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input 
                  id="country" 
                  placeholder="e.g., Thailand" 
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="region">Region</Label>
                <Input 
                  id="region" 
                  placeholder="e.g., All or Bangkok" 
                  value={formData.region}
                  onChange={(e) => setFormData({...formData, region: e.target.value})}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="apply-to">Apply To</Label>
              <Input 
                id="apply-to" 
                placeholder="e.g., All Products or Luxury Items" 
                value={formData.applyTo}
                onChange={(e) => setFormData({...formData, applyTo: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveRule}>{editingRule ? 'Update Rule' : 'Create Rule'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the tax rule.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
