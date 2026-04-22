import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  Settings,
  BarChart3,
  FileText,
  Tag,
  MessageSquare,
  Palette,
  Keyboard,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Copy,
  Sun,
  Moon,
  Monitor,
  Home,
  FolderTree,
  Star,
  MapPin,
  ShoppingCart,
  CreditCard,
  Truck,
  Ticket,
  Mail,
  Globe,
  Database,
  Zap,
  HelpCircle
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { toast } from '@/hooks/use-toast'

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  // Toggle command palette with Ctrl+K or Cmd+K
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = useCallback((command) => {
    setOpen(false)
    command()
  }, [])

  // Navigation commands
  const navigationCommands = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      shortcut: 'G D',
      action: () => navigate('/dashboard')
    },
    {
      icon: Package,
      label: 'Products',
      shortcut: 'G P',
      action: () => navigate('/products')
    },
    {
      icon: FolderTree,
      label: 'Categories',
      action: () => navigate('/categories')
    },
    {
      icon: Users,
      label: 'Customers',
      shortcut: 'G C',
      action: () => navigate('/customers')
    },
    {
      icon: ShoppingBag,
      label: 'Orders',
      shortcut: 'G O',
      action: () => navigate('/orders')
    },
    {
      icon: CreditCard,
      label: 'Payments',
      action: () => navigate('/payments')
    },
    {
      icon: Truck,
      label: 'Shipments',
      action: () => navigate('/shipments')
    },
    {
      icon: BarChart3,
      label: 'Sales Report',
      action: () => navigate('/reports/sales')
    },
    {
      icon: MessageSquare,
      label: 'Notes & Comments',
      action: () => navigate('/content/notes')
    },
    {
      icon: Tag,
      label: 'Tags & Labels',
      action: () => navigate('/content/tags')
    },
    {
      icon: Settings,
      label: 'Settings',
      shortcut: 'G S',
      action: () => navigate('/settings')
    },
    {
      icon: Palette,
      label: 'Theme Customizer',
      action: () => navigate('/settings/theme')
    },
    {
      icon: Keyboard,
      label: 'Keyboard Shortcuts',
      shortcut: '?',
      action: () => navigate('/settings/shortcuts')
    }
  ]

  // Action commands
  const actionCommands = [
    {
      icon: Plus,
      label: 'Create New',
      shortcut: 'N',
      action: () => toast({ title: 'Create New', description: 'Context-aware creation' })
    },
    {
      icon: Edit,
      label: 'Edit Selected',
      shortcut: 'E',
      action: () => toast({ title: 'Edit', description: 'Edit selected item' })
    },
    {
      icon: Trash2,
      label: 'Delete Selected',
      shortcut: 'Del',
      action: () => toast({ title: 'Delete', description: 'Delete selected item' })
    },
    {
      icon: Copy,
      label: 'Duplicate',
      shortcut: 'Ctrl D',
      action: () => toast({ title: 'Duplicated', description: 'Item duplicated successfully' })
    },
    {
      icon: Download,
      label: 'Export Data',
      action: () => toast({ title: 'Export', description: 'Exporting data...' })
    },
    {
      icon: Upload,
      label: 'Import Data',
      action: () => toast({ title: 'Import', description: 'Import dialog opened' })
    }
  ]

  // Theme commands
  const themeCommands = [
    {
      icon: Sun,
      label: 'Light Theme',
      badge: theme === 'light' ? 'Active' : null,
      action: () => {
        setTheme('light')
        toast({ title: 'Theme Changed', description: 'Switched to light theme' })
      }
    },
    {
      icon: Moon,
      label: 'Dark Theme',
      badge: theme === 'dark' ? 'Active' : null,
      action: () => {
        setTheme('dark')
        toast({ title: 'Theme Changed', description: 'Switched to dark theme' })
      }
    },
    {
      icon: Monitor,
      label: 'System Theme',
      badge: theme === 'system' ? 'Active' : null,
      action: () => {
        setTheme('system')
        toast({ title: 'Theme Changed', description: 'Using system theme' })
      }
    }
  ]

  // Quick actions
  const quickActions = [
    {
      icon: Search,
      label: 'Global Search',
      shortcut: '/',
      action: () => toast({ title: 'Search', description: 'Global search opened' })
    },
    {
      icon: HelpCircle,
      label: 'Help & Documentation',
      action: () => toast({ title: 'Help', description: 'Documentation opened' })
    },
    {
      icon: Zap,
      label: 'Quick Actions',
      action: () => toast({ title: 'Quick Actions', description: 'Quick actions panel' })
    }
  ]

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          {navigationCommands.map((cmd, index) => (
            <CommandItem
              key={index}
              onSelect={() => runCommand(cmd.action)}
            >
              <cmd.icon className="mr-2 h-4 w-4" />
              <span>{cmd.label}</span>
              {cmd.shortcut && (
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  {cmd.shortcut}
                </kbd>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          {actionCommands.map((cmd, index) => (
            <CommandItem
              key={index}
              onSelect={() => runCommand(cmd.action)}
            >
              <cmd.icon className="mr-2 h-4 w-4" />
              <span>{cmd.label}</span>
              {cmd.shortcut && (
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  {cmd.shortcut}
                </kbd>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Theme">
          {themeCommands.map((cmd, index) => (
            <CommandItem
              key={index}
              onSelect={() => runCommand(cmd.action)}
            >
              <cmd.icon className="mr-2 h-4 w-4" />
              <span>{cmd.label}</span>
              {cmd.badge && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {cmd.badge}
                </Badge>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          {quickActions.map((cmd, index) => (
            <CommandItem
              key={index}
              onSelect={() => runCommand(cmd.action)}
            >
              <cmd.icon className="mr-2 h-4 w-4" />
              <span>{cmd.label}</span>
              {cmd.shortcut && (
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  {cmd.shortcut}
                </kbd>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
