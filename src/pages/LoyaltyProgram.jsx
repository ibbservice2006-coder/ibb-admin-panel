import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Award, Edit, Trash2, Search, Star, Gift } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

export default function LoyaltyProgram() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingReward, setEditingReward] = useState(null)
  const [deletingRewardId, setDeletingRewardId] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    points: '',
    description: '',
    category: ''
  })

  const [rewards, setRewards] = useState([
    {
      id: 1,
      name: '฿50 Discount',
      points: 500,
      description: '฿50 off on your next purchase',
      category: 'Discount',
      claimed: 234,
      status: 'active'
    },
    {
      id: 2,
      name: 'Free Shipping',
      points: 300,
      description: 'Free shipping on any order',
      category: 'Shipping',
      claimed: 567,
      status: 'active'
    },
    {
      id: 3,
      name: '฿100 Discount',
      points: 1000,
      description: '฿100 off on orders over ฿500',
      category: 'Discount',
      claimed: 123,
      status: 'active'
    },
    {
      id: 4,
      name: 'Premium Gift',
      points: 2000,
      description: 'Exclusive premium gift item',
      category: 'Gift',
      claimed: 45,
      status: 'active'
    },
    {
      id: 5,
      name: 'VIP Access',
      points: 5000,
      description: 'Early access to new products',
      category: 'VIP',
      claimed: 12,
      status: 'active'
    }
  ])

  const tiers = [
    { name: 'Bronze', minPoints: 0, members: 1234, color: 'bg-amber-600' },
    { name: 'Silver', minPoints: 1000, members: 567, color: 'bg-gray-400' },
    { name: 'Gold', minPoints: 5000, members: 234, color: 'bg-yellow-500' },
    { name: 'Platinum', minPoints: 10000, members: 89, color: 'bg-purple-600' }
  ]

  const filteredRewards = rewards.filter(reward =>
    reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reward.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenDialog = (reward = null) => {
    if (reward) {
      setEditingReward(reward)
      setFormData({
        name: reward.name,
        points: reward.points.toString(),
        description: reward.description,
        category: reward.category
      })
    } else {
      setEditingReward(null)
      setFormData({ name: '', points: '', description: '', category: '' })
    }
    setIsDialogOpen(true)
  }

  const handleSaveReward = () => {
    if (editingReward) {
      setRewards(rewards.map(r => 
        r.id === editingReward.id 
          ? {
              ...r,
              name: formData.name,
              points: parseInt(formData.points),
              description: formData.description,
              category: formData.category
            }
          : r
      ))
    } else {
      const newReward = {
        id: Math.max(...rewards.map(r => r.id)) + 1,
        name: formData.name,
        points: parseInt(formData.points),
        description: formData.description,
        category: formData.category,
        claimed: 0,
        status: 'active'
      }
      setRewards([...rewards, newReward])
    }
    setIsDialogOpen(false)
    setFormData({ name: '', points: '', description: '', category: '' })
  }

  const handleDeleteClick = (rewardId) => {
    setDeletingRewardId(rewardId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    setRewards(rewards.filter(r => r.id !== deletingRewardId))
    setIsDeleteDialogOpen(false)
    setDeletingRewardId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loyalty Program</h1>
          <p className="text-muted-foreground mt-2">
            Manage rewards, tiers, and customer loyalty benefits
          </p>
        </div>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white gap-2" onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4" />
          Add Reward
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tiers.reduce((sum, t) => sum + t.members, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Loyalty members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rewards</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rewards.length}</div>
            <p className="text-xs text-muted-foreground">Available rewards</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claimed</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rewards.reduce((sum, r) => sum + r.claimed, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total claims</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiers</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tiers.length}</div>
            <p className="text-xs text-muted-foreground">Membership tiers</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rewards" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rewards">Rewards Catalog</TabsTrigger>
          <TabsTrigger value="tiers">Membership Tiers</TabsTrigger>
        </TabsList>

        <TabsContent value="rewards" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Rewards</CardTitle>
                  <CardDescription>Manage loyalty rewards and redemption options</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search rewards..."
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
                    <TableHead>Reward Name</TableHead>
                    <TableHead>Points Required</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Times Claimed</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRewards.map((reward) => (
                    <TableRow key={reward.id}>
                      <TableCell className="font-medium">{reward.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <Star className="h-3 w-3" />
                          {reward.points}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{reward.category}</Badge>
                      </TableCell>
                      <TableCell>{reward.claimed}</TableCell>
                      <TableCell>
                        <Badge variant={reward.status === 'active' ? 'default' : 'secondary'}>
                          {reward.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(reward)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(reward.id)}>
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
        </TabsContent>

        <TabsContent value="tiers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Membership Tiers</CardTitle>
              <CardDescription>View and manage loyalty program tiers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {tiers.map((tier, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded-full ${tier.color}`}></div>
                          <CardTitle className="text-lg">{tier.name}</CardTitle>
                        </div>
                        <Badge variant="outline">{tier.members} members</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Minimum {tier.minPoints.toLocaleString()} points required
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingReward ? 'Edit Reward' : 'Create Reward'}</DialogTitle>
            <DialogDescription>
              {editingReward ? 'Update reward details' : 'Define a new loyalty reward'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reward-name">Reward Name</Label>
              <Input 
                id="reward-name" 
                placeholder="e.g., ฿50 Discount" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="points">Points Required</Label>
                <Input 
                  id="points" 
                  type="number" 
                  placeholder="500" 
                  value={formData.points}
                  onChange={(e) => setFormData({...formData, points: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Discount">Discount</SelectItem>
                    <SelectItem value="Shipping">Shipping</SelectItem>
                    <SelectItem value="Gift">Gift</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the reward" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveReward}>{editingReward ? 'Update Reward' : 'Create Reward'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the reward.
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
