import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Tag, Edit, Trash2, Search, Palette } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

export default function ProductAttributes() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingAttribute, setEditingAttribute] = useState(null)
  const [deletingAttributeId, setDeletingAttributeId] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    values: ''
  })

  const [attributes, setAttributes] = useState([
    {
      id: 1,
      name: 'Color',
      type: 'select',
      values: ['Red', 'Blue', 'Green', 'Black', 'White'],
      products: 45,
      status: 'active'
    },
    {
      id: 2,
      name: 'Size',
      type: 'select',
      values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      products: 89,
      status: 'active'
    },
    {
      id: 3,
      name: 'Material',
      type: 'select',
      values: ['Cotton', 'Polyester', 'Silk', 'Leather'],
      products: 32,
      status: 'active'
    },
    {
      id: 4,
      name: 'Storage',
      type: 'select',
      values: ['64GB', '128GB', '256GB', '512GB', '1TB'],
      products: 28,
      status: 'active'
    },
    {
      id: 5,
      name: 'Style',
      type: 'text',
      values: ['Casual', 'Formal', 'Sport', 'Vintage'],
      products: 56,
      status: 'active'
    }
  ])

  const filteredAttributes = attributes.filter(attr =>
    attr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attr.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenDialog = (attribute = null) => {
    if (attribute) {
      setEditingAttribute(attribute)
      setFormData({
        name: attribute.name,
        type: attribute.type,
        values: attribute.values.join(', ')
      })
    } else {
      setEditingAttribute(null)
      setFormData({ name: '', type: '', values: '' })
    }
    setIsDialogOpen(true)
  }

  const handleSaveAttribute = () => {
    if (editingAttribute) {
      setAttributes(attributes.map(a => 
        a.id === editingAttribute.id 
          ? {
              ...a,
              name: formData.name,
              type: formData.type,
              values: formData.values.split(',').map(v => v.trim())
            }
          : a
      ))
    } else {
      const newAttribute = {
        id: Math.max(...attributes.map(a => a.id)) + 1,
        name: formData.name,
        type: formData.type,
        values: formData.values.split(',').map(v => v.trim()),
        products: 0,
        status: 'active'
      }
      setAttributes([...attributes, newAttribute])
    }
    setIsDialogOpen(false)
    setFormData({ name: '', type: '', values: '' })
  }

  const handleDeleteClick = (attributeId) => {
    setDeletingAttributeId(attributeId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    setAttributes(attributes.filter(a => a.id !== deletingAttributeId))
    setIsDeleteDialogOpen(false)
    setDeletingAttributeId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Attributes</h1>
          <p className="text-muted-foreground mt-2">
            Manage product attributes like size, color, and material
          </p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white gap-2" onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4" />
          Add Attribute
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attributes</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attributes.length}</div>
            <p className="text-xs text-muted-foreground">Active attributes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Values</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attributes.reduce((sum, a) => sum + a.values.length, 0)}</div>
            <p className="text-xs text-muted-foreground">Attribute values</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attributes.reduce((sum, a) => sum + a.products, 0)}</div>
            <p className="text-xs text-muted-foreground">Using attributes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Values</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(attributes.reduce((sum, a) => sum + a.values.length, 0) / attributes.length).toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Per attribute</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Attributes</CardTitle>
              <CardDescription>Manage product attributes and their values</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search attributes..."
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
                <TableHead>Attribute Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Values</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttributes.map((attribute) => (
                <TableRow key={attribute.id}>
                  <TableCell className="font-medium">{attribute.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{attribute.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {attribute.values.slice(0, 3).map((value, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {value}
                        </Badge>
                      ))}
                      {attribute.values.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{attribute.values.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{attribute.products}</TableCell>
                  <TableCell>
                    <Badge variant={attribute.status === 'active' ? 'default' : 'secondary'}>
                      {attribute.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(attribute)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(attribute.id)}>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingAttribute ? 'Edit Attribute' : 'Create Attribute'}</DialogTitle>
            <DialogDescription>
              {editingAttribute ? 'Update attribute details' : 'Define a new product attribute'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="attr-name">Attribute Name</Label>
              <Input 
                id="attr-name" 
                placeholder="e.g., Color, Size, Material" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="attr-type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger id="attr-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="select">Select (Dropdown)</SelectItem>
                  <SelectItem value="text">Text Input</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="color">Color Picker</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="attr-values">Values (comma-separated)</Label>
              <Input 
                id="attr-values" 
                placeholder="e.g., Red, Blue, Green" 
                value={formData.values}
                onChange={(e) => setFormData({...formData, values: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple values with commas
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveAttribute}>{editingAttribute ? 'Update Attribute' : 'Create Attribute'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the attribute.
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
