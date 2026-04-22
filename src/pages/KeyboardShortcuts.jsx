import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  Keyboard, 
  Search, 
  Command,
  Zap,
  Info,
  Home,
  Package,
  Users,
  ShoppingBag,
  Settings,
  FileText,
  BarChart3,
  HelpCircle
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function KeyboardShortcuts() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false)
  const [shortcutsEnabled, setShortcutsEnabled] = useState(
    localStorage.getItem('shortcuts-enabled') !== 'false'
  )

  const shortcuts = [
    {
      category: 'Navigation',
      icon: Home,
      items: [
        { keys: ['G', 'D'], description: 'Go to Dashboard', action: () => navigate('/dashboard') },
        { keys: ['G', 'P'], description: 'Go to Products', action: () => navigate('/products') },
        { keys: ['G', 'C'], description: 'Go to Customers', action: () => navigate('/customers') },
        { keys: ['G', 'O'], description: 'Go to Orders', action: () => navigate('/orders') },
        { keys: ['G', 'S'], description: 'Go to Settings', action: () => navigate('/settings') },
        { keys: ['G', 'R'], description: 'Go to Reports', action: () => navigate('/reports/sales') }
      ]
    },
    {
      category: 'Actions',
      icon: Zap,
      items: [
        { keys: ['N'], description: 'Create New (context-aware)', action: () => toast({ title: 'Create New', description: 'Context-aware creation' }) },
        { keys: ['E'], description: 'Edit Selected', action: () => toast({ title: 'Edit', description: 'Edit selected item' }) },
        { keys: ['Delete'], description: 'Delete Selected', action: () => toast({ title: 'Delete', description: 'Delete selected item' }) },
        { keys: ['Ctrl', 'S'], description: 'Save Changes', action: () => toast({ title: 'Saved', description: 'Changes saved successfully' }) },
        { keys: ['Ctrl', 'Z'], description: 'Undo', action: () => toast({ title: 'Undo', description: 'Action undone' }) },
        { keys: ['Ctrl', 'Y'], description: 'Redo', action: () => toast({ title: 'Redo', description: 'Action redone' }) }
      ]
    },
    {
      category: 'Search & Filter',
      icon: Search,
      items: [
        { keys: ['/', 'Ctrl', 'K'], description: 'Global Search', action: () => toast({ title: 'Search', description: 'Global search opened' }) },
        { keys: ['F'], description: 'Filter Current View', action: () => toast({ title: 'Filter', description: 'Filter panel opened' }) },
        { keys: ['Ctrl', 'F'], description: 'Find in Page', action: () => toast({ title: 'Find', description: 'Find in page' }) },
        { keys: ['Esc'], description: 'Clear Search/Close Dialog', action: () => setIsHelpDialogOpen(false) }
      ]
    },
    {
      category: 'View Controls',
      icon: FileText,
      items: [
        { keys: ['V', 'G'], description: 'Grid View', action: () => toast({ title: 'View', description: 'Switched to grid view' }) },
        { keys: ['V', 'L'], description: 'List View', action: () => toast({ title: 'View', description: 'Switched to list view' }) },
        { keys: ['V', 'T'], description: 'Table View', action: () => toast({ title: 'View', description: 'Switched to table view' }) },
        { keys: ['["], description: "Previous Page", action: () => toast({ title: "Navigation", description: 'Previous page" }) },
        { keys: [']'], description: 'Next Page', action: () => toast({ title: 'Navigation', description: 'Next page' }) }
      ]
    },
    {
      category: 'Interface',
      icon: Settings,
      items: [
        { keys: ['B'], description: 'Toggle Sidebar', action: () => toast({ title: 'Sidebar', description: 'Sidebar toggled' }) },
        { keys: ['T'], description: 'Toggle Theme', action: () => toast({ title: 'Theme', description: 'Theme toggled' }) },
        { keys: ['?'], description: 'Show Keyboard Shortcuts', action: () => setIsHelpDialogOpen(true) },
        { keys: ['Ctrl', ',"], description: 'Open Settings", action: () => navigate('/settings') }
      ]
    },
    {
      category: 'Quick Actions',
      icon: Command,
      items: [
        { keys: ['Ctrl', 'P'], description: 'Command Palette', action: () => toast({ title: 'Command Palette', description: 'Coming soon!' }) },
        { keys: ['Ctrl', 'B'], description: 'Toggle Bold (in editors)', action: () => toast({ title: 'Format', description: 'Bold toggled' }) },
        { keys: ['Ctrl', 'I'], description: 'Toggle Italic (in editors)', action: () => toast({ title: 'Format', description: 'Italic toggled' }) },
        { keys: ['Ctrl', 'Enter'], description: 'Submit Form', action: () => toast({ title: 'Submit', description: 'Form submitted' }) }
      ]
    }
  ]

  // Filter shortcuts
  const filteredShortcuts = shortcuts.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keys.some(key => key.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(category => category.items.length > 0)

  // Keyboard event handler
  useEffect(() => {
    if (!shortcutsEnabled) return

    const handleKeyDown = (e) => {
      // Ignore if typing in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        // Allow Ctrl+S, Ctrl+K even in inputs
        if (!(e.ctrlKey && (e.key === 's' || e.key === 'k'))) {
          return
        }
      }

      // Navigation shortcuts (G + key)
      if (e.key === 'g' || e.key === 'G') {
        const nextKey = new Promise((resolve) => {
          const handler = (event) => {
            resolve(event.key.toLowerCase())
            window.removeEventListener('keydown', handler)
          }
          window.addEventListener('keydown', handler)
          setTimeout(() => {
            window.removeEventListener('keydown', handler)
            resolve(null)
          }, 1000)
        })

        nextKey.then(key => {
          switch (key) {
            case 'd': navigate('/dashboard'); break
            case 'p': navigate('/products'); break
            case 'c': navigate('/customers'); break
            case 'o': navigate('/orders'); break
            case 's': navigate('/settings'); break
            case 'r': navigate('/reports/sales'); break
          }
        })
        return
      }

      // View shortcuts (V + key)
      if (e.key === 'v' || e.key === 'V') {
        const nextKey = new Promise((resolve) => {
          const handler = (event) => {
            resolve(event.key.toLowerCase())
            window.removeEventListener('keydown', handler)
          }
          window.addEventListener('keydown', handler)
          setTimeout(() => {
            window.removeEventListener('keydown', handler)
            resolve(null)
          }, 1000)
        })

        nextKey.then(key => {
          if (key) {
            toast({
              title: 'View Changed',
              description: `Switched to ${key === 'g' ? 'grid' : key === 'l' ? 'list' : 'table'} view`
            })
          }
        })
        return
      }

      // Help dialog
      if (e.key === '?' && !e.shiftKey) {
        e.preventDefault()
        setIsHelpDialogOpen(true)
        return
      }

      // Global search
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && !e.shiftKey) {
        e.preventDefault()
        toast({
          title: 'Global Search',
          description: 'Search functionality would open here'
        })
        return
      }

      // Settings
      if (e.ctrlKey && e.key === ',') {
        e.preventDefault()
        navigate('/settings')
        return
      }

      // Save
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        toast({
          title: 'Saved',
          description: 'Changes saved successfully'
        })
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate, shortcutsEnabled])

  // Toggle shortcuts
  const handleToggleShortcuts = (enabled) => {
    setShortcutsEnabled(enabled)
    localStorage.setItem('shortcuts-enabled', enabled.toString())
    toast({
      title: enabled ? 'Shortcuts Enabled' : 'Shortcuts Disabled',
      description: enabled ? 'Keyboard shortcuts are now active' : 'Keyboard shortcuts are now disabled'
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Keyboard className="h-8 w-8" />
            Keyboard Shortcuts
          </h1>
          <p className="text-muted-foreground mt-1">
            Master keyboard shortcuts to boost your productivity
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="shortcuts-toggle">Enable Shortcuts</Label>
            <Switch 
              id="shortcuts-toggle"
              checked={shortcutsEnabled} 
              onCheckedChange={handleToggleShortcuts} 
            />
          </div>
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setIsHelpDialogOpen(true)}>
            <HelpCircle className="h-4 w-4 mr-2" />
            Quick Reference
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card className={shortcutsEnabled ? 'border-green-500' : 'border-muted'}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${shortcutsEnabled ? 'bg-green-500 animate-pulse' : 'bg-muted'}`} />
              <div>
                <p className="font-medium">
                  Keyboard Shortcuts are {shortcutsEnabled ? 'Active' : 'Disabled'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {shortcutsEnabled 
                    ? 'Press ? to view all available shortcuts' 
                    : 'Enable shortcuts to use keyboard navigation'}
                </p>
              </div>
            </div>
            <Badge variant={shortcutsEnabled ? 'default' : 'secondary'} className="text-lg px-4 py-2">
              {shortcutsEnabled ? 'ON' : 'OFF'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search shortcuts..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Shortcuts List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Shortcuts</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="tips">Pro Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredShortcuts.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <category.icon className="h-5 w-5" />
                  {category.category}
                  <Badge variant="secondary" className="ml-2">{category.items.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Shortcut</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {category.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex gap-1">
                            {item.keys.map((key, i) => (
                              <span key={i}>
                                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                                  {key}
                                </kbd>
                                {i < item.keys.length - 1 && (
                                  <span className="mx-1 text-muted-foreground">+</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={item.action}
                            disabled={!shortcutsEnabled}
                          >
                            Try it
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="navigation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Navigation Shortcuts
              </CardTitle>
              <CardDescription>Quickly navigate between different sections</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shortcut</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shortcuts.find(c => c.category === 'Navigation')?.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex gap-1">
                          {item.keys.map((key, i) => (
                            <span key={i}>
                              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                                {key}
                              </kbd>
                              {i < item.keys.length - 1 && (
                                <span className="mx-1 text-muted-foreground">then</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{item.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Action Shortcuts
              </CardTitle>
              <CardDescription>Perform common actions quickly</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shortcut</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shortcuts.find(c => c.category === 'Actions')?.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex gap-1">
                          {item.keys.map((key, i) => (
                            <span key={i}>
                              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                                {key}
                              </kbd>
                              {i < item.keys.length - 1 && (
                                <span className="mx-1 text-muted-foreground">+</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{item.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                  <p className="text-sm">Use <kbd className="px-1 py-0.5 text-xs bg-muted rounded">G</kbd> followed by another key for quick navigation</p>
                </div>
                <div className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                  <p className="text-sm">Press <kbd className="px-1 py-0.5 text-xs bg-muted rounded">?</kbd> anytime to see all shortcuts</p>
                </div>
                <div className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                  <p className="text-sm">Most shortcuts work across all pages for consistency</p>
                </div>
                <div className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                  <p className="text-sm">Shortcuts are disabled when typing in input fields</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Power User Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2" />
                  <p className="text-sm">Combine shortcuts for advanced workflows</p>
                </div>
                <div className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2" />
                  <p className="text-sm">Use <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Ctrl+K</kbd> for global search (coming soon)</p>
                </div>
                <div className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2" />
                  <p className="text-sm">Customize shortcuts in Settings (coming soon)</p>
                </div>
                <div className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2" />
                  <p className="text-sm">Export and share your shortcut preferences</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Reference Dialog */}
      <Dialog open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Quick Reference
            </DialogTitle>
            <DialogDescription>
              Most commonly used keyboard shortcuts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {shortcuts.slice(0, 3).map((category) => (
              <div key={category.category}>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <category.icon className="h-4 w-4" />
                  {category.category}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {category.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <span className="text-sm">{item.description}</span>
                      <div className="flex gap-1">
                        {item.keys.map((key, i) => (
                          <span key={i}>
                            <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-background border rounded">
                              {key}
                            </kbd>
                            {i < item.keys.length - 1 && (
                              <span className="mx-0.5 text-xs text-muted-foreground">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {category !== shortcuts[2] && <Separator className="my-3" />}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
