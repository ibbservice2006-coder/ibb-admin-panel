import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  LayoutDashboard,
  Package,
  FolderTree,
  Star,
  Users,
  MapPin,
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  Truck,
  RotateCcw,
  Ticket,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Store,
  Sparkles,
  Plus,
  Plug,
  Wallet,
  PackageSearch,
  LineChart,
  Sliders,
  Building2,
  Palette,
  TrendingUp,
  Zap,
  Award,
  UserCog,
  Shield,
  Activity,
  MessageSquare,
  Bell,
  Globe,
  Image,
  Database,
  Layers,
  CheckCircle,
  Webhook,
  Key,
  Mail,
  Clock,
  CheckCircle2,
  X,
  Calendar,
  Wrench,
  Map,
  DollarSign,
  Percent,
  Share2,
  Radio,
  AlertCircle,
  Download,
  MessageCircle,
  AlertTriangle,
  Lock,
  Target,
  Gift,
  Code,
  Tag,
  RefreshCw,
  Banknote,
  ArrowLeftRight
} from 'lucide-react'

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600',
    description: 'System overview & KPIs',
    items: [
      { title: 'Overview', href: '/dashboard', icon: LayoutDashboard, description: 'Main dashboard' },
      { title: 'Live Operations', href: '/dashboard/live-operations', icon: Activity, description: 'Real-time metrics' },
      { title: 'KPI Metrics', href: '/dashboard/kpi-metrics', icon: TrendingUp, description: 'Key performance indicators' },
	      { title: 'System Alerts', href: '/dashboard/system-alerts', icon: Bell, description: 'System alerts & notifications' },
	      { title: 'Dashboard Builder', href: '/dashboard/dashboard-builder', icon: Palette, description: 'Customize dashboard layout' },
	      { title: 'Saved Filters', href: '/dashboard/saved-filters', icon: Star, description: 'Saved filter views' }
    ]
  },
  {
    title: 'Bookings',
    icon: ShoppingBag,
    color: 'text-orange-600',
    gradient: 'from-orange-500 to-orange-600',
    description: 'Booking management',
    items: [
      { title: 'All Bookings', href: '/bookings/all', icon: ShoppingBag, description: 'All bookings' },
      { title: 'Pending Bookings', href: '/bookings/pending', icon: Clock, description: 'Pending confirmation' },
      { title: 'Confirmed Bookings', href: '/bookings/confirmed', icon: CheckCircle2, description: 'Confirmed bookings' },
      { title: 'Assigned Trips', href: '/bookings/assigned', icon: Truck, description: 'Driver assigned' },
      { title: 'In-Progress Trips', href: '/bookings/in-progress', icon: Activity, description: 'Active trips' },
      { title: 'Completed Trips', href: '/bookings/completed', icon: CheckCircle, description: 'Completed trips' },
      { title: 'Cancelled Bookings', href: '/bookings/cancelled', icon: X, description: 'Cancelled trips' },
      { title: 'Booking Calendar', href: '/bookings/calendar', icon: Calendar, description: 'Calendar view' }
    ]
  },
  {
    title: 'Fleet Management',
    icon: Truck,
    color: 'text-green-600',
    gradient: 'from-green-500 to-green-600',
    description: 'Vehicle management',
    items: [
      { title: 'All Vehicles', href: '/fleet/vehicles', icon: Truck, description: 'Vehicle catalog' },
      { title: 'Vehicle Types', href: '/fleet/types', icon: Package, description: 'Vehicle categories' },
      { title: 'Vehicle Status', href: '/fleet/status', icon: Activity, description: 'Current status' },
      { title: 'Maintenance Records', href: '/fleet/maintenance', icon: Wrench, description: 'Service history' },
      { title: 'Insurance & Documents', href: '/fleet/insurance', icon: FileText, description: 'Vehicle docs' },
      { title: 'Fuel Management', href: '/fleet/fuel', icon: Zap, description: 'Fuel tracking' }
    ]
  },
  {
    title: 'Drivers',
    icon: Users,
    color: 'text-purple-600',
    gradient: 'from-purple-500 to-purple-600',
    description: 'Driver management',
    items: [
      { title: 'All Drivers', href: '/drivers/all', icon: Users, description: 'Driver database' },
      { title: 'Driver Status', href: '/drivers/status', icon: Activity, description: 'Online/Offline' },
      { title: 'Driver Documents', href: '/drivers/documents', icon: FileText, description: 'License & permits' },
      { title: 'Driver Performance', href: '/drivers/performance', icon: TrendingUp, description: 'Ratings & reviews' },
      { title: 'Driver Earnings', href: '/drivers/earnings', icon: DollarSign, description: 'Payment history' },
      { title: 'Driver Complaints', href: '/drivers/complaints', icon: AlertTriangle, description: 'Issues & complaints' }
    ]
  },
  {
    title: 'Customers',
    icon: Users,
    color: 'text-indigo-600',
    gradient: 'from-indigo-500 to-indigo-600',
    description: 'Customer management',
    items: [
      { title: 'All Customers', href: '/customers/all', icon: Users, description: 'Customer database' },
      { title: 'Customer Profiles', href: '/customers/profiles', icon: Users, description: 'Detailed profiles' },
      { title: 'Addresses', href: '/customers/addresses', icon: MapPin, description: 'Saved addresses' },
      { title: 'Favorites', href: '/customers/favorites', icon: Star, description: 'Favorite routes' }
    ]
  },
  {
    title: 'Route Management',
    icon: MapPin,
    color: 'text-cyan-600',
    gradient: 'from-cyan-500 to-cyan-600',
    description: 'Route and zone management',
    items: [
      { title: 'All Routes', href: '/routes/all', icon: MapPin, description: 'Route management' },
      { title: 'Route Zones', href: '/routes/zones', icon: Map, description: 'Geographic zones' },
      { title: 'Route Analytics', href: '/routes/analytics', icon: BarChart3, description: 'Route insights' }
    ]
  },
  {
    title: 'Pricing Management',
    icon: Tag,
    color: 'text-lime-600',
    gradient: 'from-lime-500 to-lime-600',
    description: 'Pricing & fare management',
    items: [
      { title: 'Zone Pricing', href: '/pricing/zones', icon: MapPin, description: 'Zone-based fare setup' },
      { title: 'Car Pricing', href: '/pricing/car', icon: Truck, description: 'Car & SUV fare table' },
      { title: 'Van Pricing', href: '/pricing/van', icon: Truck, description: 'Van fare table' },
      { title: 'Bus Pricing', href: '/pricing/bus', icon: Truck, description: 'Bus fare table' },
      { title: 'Festival Pricing', href: '/pricing/festival', icon: Sparkles, description: 'Songkran, New Year, CNY' },
      { title: 'Membership Pricing', href: '/pricing/membership', icon: Award, description: 'Pricing by membership tier' },
      { title: 'Hourly & Period Rates', href: '/pricing/hourly-period', icon: Clock, description: 'Hourly & multi-day rates' },
      { title: 'Pricing Analytics', href: '/pricing/analytics', icon: BarChart3, description: 'Pricing insights' }
    ]
  },
  {
    title: 'Currency & Exchange Rate',
    icon: ArrowLeftRight,
    color: 'text-sky-600',
    gradient: 'from-sky-500 to-sky-600',
    description: 'Multi-currency management',
    items: [
      { title: 'Currency List', href: '/currency/list', icon: Banknote, description: 'Supported currencies (14)' },
      { title: 'Exchange Rates', href: '/currency/rates', icon: ArrowLeftRight, description: 'Live & manual rates' },
      { title: 'Currency Margins', href: '/currency/margins', icon: Percent, description: 'Margin per currency' },
      { title: 'Rate History', href: '/currency/history', icon: Clock, description: 'Historical rate log' },
      { title: 'Rate Sync', href: '/currency/sync', icon: RefreshCw, description: 'Auto-sync exchange rates' }
    ]
  },
  {
    title: 'Membership',
    icon: Award,
    color: 'text-rose-600',
    gradient: 'from-rose-500 to-rose-600',
    description: 'Membership management',
    items: [
      { title: 'Membership Levels', href: '/membership/levels', icon: Award, description: 'Tier management' },
      { title: 'General Members', href: '/membership/general', icon: Users, description: 'General tier' },
      { title: 'VIP Members', href: '/membership/vip', icon: Award, description: 'VIP tier' },
      { title: 'VVIP Members', href: '/membership/vvip', icon: Award, description: 'VVIP tier' },
      { title: 'Business Partner Members', href: '/membership/business-partner', icon: Building2, description: 'Business partner tier' },
      { title: 'Benefits & Perks', href: '/membership/benefits', icon: Gift, description: 'Member benefits' },
      { title: 'Membership Analytics', href: '/membership/analytics', icon: BarChart3, description: 'Member insights' }
    ]
  },
  {
    title: 'Wallet & Payments',
    icon: Wallet,
    color: 'text-emerald-600',
    gradient: 'from-emerald-500 to-emerald-600',
    description: 'Payment management',
    items: [
      { title: 'Wallet Transactions', href: '/wallet/transactions', icon: Wallet, description: 'Transaction history' },
      { title: 'Top-up History', href: '/wallet/topup', icon: Plus, description: 'Wallet top-ups' },
      { title: 'Payment Methods', href: '/wallet/methods', icon: CreditCard, description: 'Saved cards' },
      { title: 'Payment Processing', href: '/wallet/processing', icon: Zap, description: 'Process payments' },
      { title: 'Refunds', href: '/wallet/refunds', icon: RotateCcw, description: 'Refund processing' },
      { title: 'Payment Gateways', href: '/wallet/gateways', icon: Plug, description: 'Payment providers' },
      { title: 'Transaction Reports', href: '/wallet/reports', icon: BarChart3, description: 'Payment analytics' }
    ]
  },
  {
    title: 'Vouchers & Promotions',
    icon: Ticket,
    color: 'text-pink-600',
    gradient: 'from-pink-500 to-pink-600',
    description: 'Voucher management',
    items: [
      { title: 'Voucher Catalog', href: '/vouchers/catalog', icon: Ticket, description: 'All vouchers' },
      { title: 'Voucher Campaigns', href: '/vouchers/campaigns', icon: Target, description: 'Active campaigns' },
      { title: 'Voucher Codes', href: '/vouchers/codes', icon: Code, description: 'Coupon codes' },
      { title: 'Voucher Redemption', href: '/vouchers/redemption', icon: CheckCircle, description: 'Redeemed vouchers' },
      { title: 'Voucher Analytics', href: '/vouchers/analytics', icon: BarChart3, description: 'Voucher insights' },
      { title: 'Promotions', href: '/vouchers/promotions', icon: Sparkles, description: 'Special offers' },
      { title: 'Discount Rules', href: '/vouchers/rules', icon: Percent, description: 'Discount setup' }
    ]
  },
  {
    title: 'External Platforms',
    icon: Globe,
    color: 'text-amber-600',
    gradient: 'from-amber-500 to-amber-600',
    description: 'Marketplace integration',
    items: [
      { title: 'Platform Integrations', href: '/platforms/integrations', icon: Globe, description: 'All platforms' },
      { title: 'Southeast Asia', href: '/platforms/southeast-asia', icon: Globe, description: 'Shopee, Lazada, etc' },
      { title: 'Global Platforms', href: '/platforms/global', icon: Globe, description: 'Amazon, eBay, etc' },
      { title: 'China Platforms', href: '/platforms/china', icon: Globe, description: 'Alibaba, JD, etc' },
      { title: 'Middle East', href: '/platforms/middle-east', icon: Globe, description: 'Noon, Namshi, etc' },
      { title: 'Russia & CIS', href: '/platforms/russia', icon: Globe, description: 'Wildberries, Ozon, etc' },
      { title: 'Store Management', href: '/platforms/stores', icon: Store, description: 'Store profiles' },
      { title: 'Platform Orders', href: '/platforms/orders', icon: ShoppingBag, description: 'Marketplace orders' },
      { title: 'Sync Logs', href: '/platforms/sync', icon: Activity, description: 'Integration logs' }
    ]
  },
  {
    title: 'GPS Tracking',
    icon: MapPin,
    color: 'text-red-600',
    gradient: 'from-red-500 to-red-600',
    description: 'Real-time tracking',
    items: [
      { title: 'Live Map', href: '/gps/map', icon: Map, description: 'Real-time map' },
      { title: 'Active Trips', href: '/gps/active', icon: Activity, description: 'Current trips' },
      { title: 'Trip History', href: '/gps/history', icon: Clock, description: 'Past trips' },
      { title: 'Geofencing', href: '/gps/geofencing', icon: MapPin, description: 'Zone management' },
      { title: 'Route Optimization', href: '/gps/optimization', icon: TrendingUp, description: 'Optimize routes' }
    ]
  },
  {
    title: 'Partners & Affiliates',
    icon: Share2,
    color: 'text-indigo-600',
    gradient: 'from-indigo-500 to-indigo-600',
    description: 'Partner management',
    items: [
      { title: 'All Partners', href: '/partners/all', icon: Users, description: 'Partner list' },
      { title: 'Partner Profiles', href: '/partners/profiles', icon: Users, description: 'Detailed profiles' },
      { title: 'Affiliate Links', href: '/partners/affiliate', icon: Share2, description: 'Referral links' },
      { title: 'Commission Tracking', href: '/partners/commission', icon: DollarSign, description: 'Earnings' },
      { title: 'Partner Analytics', href: '/partners/analytics', icon: BarChart3, description: 'Performance' }
    ]
  },
  {
    title: 'Reports & Analytics',
    icon: BarChart3,
    color: 'text-teal-600',
    gradient: 'from-teal-500 to-teal-600',
    description: 'Analytics & insights',
    items: [
      { title: 'Revenue Reports', href: '/reports/revenue', icon: BarChart3, description: 'Revenue analytics' },
      { title: 'Booking Reports', href: '/reports/bookings', icon: ShoppingBag, description: 'Booking insights' },
      { title: 'Customer Reports', href: '/reports/customers', icon: Users, description: 'Customer analytics' },
      { title: 'Driver Reports', href: '/reports/drivers', icon: Users, description: 'Driver insights' },
      { title: 'Fleet Reports', href: '/reports/fleet', icon: Truck, description: 'Vehicle analytics' },
      { title: 'Financial Reports', href: '/reports/financial', icon: BarChart3, description: 'Financial overview' },
      { title: 'Chart Builder', href: '/reports/charts', icon: BarChart3, description: 'Custom charts' },
      { title: 'Advanced Analytics', href: '/reports/advanced', icon: LineChart, description: 'Deep insights' }
    ]
  },
  {
    title: 'Notifications',
    icon: Bell,
    color: 'text-yellow-600',
    gradient: 'from-yellow-500 to-yellow-600',
    description: 'Notification management',
    items: [
      { title: 'All Notifications', href: '/notifications/all', icon: Bell, description: 'Notification center' },
      { title: 'Email Templates', href: '/notifications/email', icon: Mail, description: 'Email designs' },
      { title: 'SMS Templates', href: '/notifications/sms', icon: MessageSquare, description: 'SMS designs' },
      { title: 'Push Notifications', href: '/notifications/push', icon: Bell, description: 'App notifications' },
      { title: 'Notification Rules', href: '/notifications/rules', icon: Sliders, description: 'Trigger setup' }
    ]
  },
  {
    title: 'User Management',
    icon: Users,
    color: 'text-cyan-600',
    gradient: 'from-cyan-500 to-cyan-600',
    description: 'Users & permissions',
    items: [
      { title: 'Users & Admins', href: '/users/admins', icon: Users, description: 'Manage users' },
      { title: 'Roles & Permissions', href: '/users/roles', icon: Lock, description: 'Access control' },
      { title: 'Activity Logs', href: '/users/activity', icon: Activity, description: 'User activity' },
      { title: 'User Permissions', href: '/users/permissions', icon: Lock, description: 'Role management' },
      { title: 'Audit Log', href: '/users/audit', icon: FileText, description: 'Activity tracking' }
    ]
  },
  {
    title: 'Content',
    icon: Globe,
    color: 'text-emerald-600',
    gradient: 'from-emerald-500 to-emerald-600',
    description: 'Website content',
    items: [
      { title: 'Pages', href: '/content/pages', icon: FileText, description: 'Content pages' },
      { title: 'Files & Media', href: '/content/media', icon: Image, description: 'All file types' },
      { title: 'Notes & Comments', href: '/content/notes', icon: MessageSquare, description: 'Notes and discussions' },
      { title: 'Tags & Labels', href: '/content/tags', icon: Star, description: 'Organize with tags' }
    ]
  },
  {
    title: 'Support & Help',
    icon: MessageSquare,
    color: 'text-amber-600',
    gradient: 'from-amber-500 to-amber-600',
    description: 'Customer support',
    items: [
      { title: 'Support Tickets', href: '/support/tickets', icon: MessageSquare, description: 'Help desk' },
      { title: 'FAQ Management', href: '/support/faq', icon: MessageCircle, description: 'FAQ database' },
      { title: 'Knowledge Base', href: '/support/knowledge', icon: FileText, description: 'Help articles' },
      { title: 'Live Chat', href: '/support/chat', icon: MessageSquare, description: 'Chat support' },
      { title: 'Customer Feedback', href: '/support/feedback', icon: Star, description: 'Rating & Reviews' }
    ]
  },
  {
    title: 'Settings',
    icon: Settings,
    color: 'text-slate-600',
    gradient: 'from-slate-500 to-slate-600',
    description: 'System configuration',
    items: [
      { title: 'General Settings', href: '/settings/general', icon: Settings, description: 'System settings' },
      { title: 'Business Settings', href: '/settings/business', icon: Building2, description: 'Business info' },
      { title: 'Service Settings', href: '/settings/service', icon: Sliders, description: 'Service config' },
      { title: 'Payment Settings', href: '/settings/payment', icon: CreditCard, description: 'Payment setup' },
      { title: 'Theme Customizer', href: '/settings/theme', icon: Palette, description: 'Customize appearance' },
      { title: 'Keyboard Shortcuts', href: '/settings/shortcuts', icon: Key, description: 'Shortcut keys' },
      { title: 'Progressive Web App', href: '/settings/pwa', icon: Plug, description: 'Install & PWA settings' }
    ]
  },
  {
    title: 'Integrations',
    icon: Plug,
    color: 'text-violet-600',
    gradient: 'from-violet-500 to-violet-600',
    description: 'Third-party integrations',
    items: [
      { title: 'API Management', href: '/integrations/api', icon: Key, description: 'API keys & limits' },
      { title: 'Webhooks', href: '/integrations/webhooks', icon: Webhook, description: 'Event notifications' },
      { title: 'Third-party Services', href: '/integrations/services', icon: Plug, description: 'Service integrations' }
    ]
  },
  {
    title: 'Database Tools',
    icon: Database,
    color: 'text-indigo-600',
    gradient: 'from-indigo-500 to-indigo-600',
    description: 'Database management',
    items: [
      { title: 'Dynamic DB Management', href: '/dynamic-tools/db-management', icon: Database, description: 'MS Access-like DB tool' },
      { title: 'Relationships Designer', href: '/dynamic-tools/relationships-designer', icon: Settings, description: 'Visual ERD diagram' },
      { title: 'Query Builder', href: '/dynamic-tools/query-builder', icon: Settings, description: 'Visual query designer' },
      { title: 'Lookup Wizard', href: '/dynamic-tools/lookup-wizard', icon: Settings, description: 'Create dropdown lookups' },
      { title: 'Conditional Formatting', href: '/dynamic-tools/conditional-formatting', icon: Palette, description: 'Color-code data' },
      { title: 'Database Settings', href: '/dynamic-tools/database-settings', icon: Database, description: 'DB configuration' }
    ]
  },
  {
    title: 'Data Management',
    icon: Layers,
    color: 'text-purple-600',
    gradient: 'from-purple-500 to-purple-600',
    description: 'Data operations',
    items: [
      { title: 'Export/Import Wizard', href: '/dynamic-tools/export-import-wizard', icon: FileText, description: 'Step-by-step data transfer' },
      { title: 'Import / Export', href: '/dynamic-tools/import-export', icon: FileText, description: 'Data import/export' },
      { title: 'Backup & Restore', href: '/dynamic-tools/backup-restore', icon: Shield, description: 'Database backup' },
      { title: 'Data Migration', href: '/dynamic-tools/data-migration', icon: Database, description: 'Database migration' },
      { title: 'Bulk Operations', href: '/dynamic-tools/bulk-operations', icon: Layers, description: 'Batch processing' },
      { title: 'Data Validation', href: '/dynamic-tools/data-validation', icon: CheckCircle, description: 'Data quality checks' }
    ]
  },
  {
    title: 'System & Security',
    icon: Shield,
    color: 'text-red-600',
    gradient: 'from-red-500 to-red-600',
    description: 'System settings',
    items: [
      { title: 'User Permissions', href: '/dynamic-tools/user-permissions', icon: Shield, description: 'Role management' },
      { title: 'Audit Log', href: '/dynamic-tools/audit-log', icon: Activity, description: 'Activity tracking' },
      { title: 'API Management', href: '/dynamic-tools/api-management', icon: Key, description: 'API keys & limits' },
      { title: 'Webhooks', href: '/dynamic-tools/webhooks', icon: Webhook, description: 'Event notifications' },
      { title: 'Macros & Automation', href: '/dynamic-tools/macros-automation', icon: Zap, description: 'Automated workflows' },
      { title: 'Security Settings', href: '/dynamic-tools/security-settings', icon: Shield, description: 'Security configuration' }
    ]
  }
]

function MenuItem({ item, isOpen, level = 0, searchQuery = '' }) {
  const location = useLocation()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  const hasChildren = item.items && item.items.length > 0
  const isActive = item.href === location.pathname
  const hasActiveChild = hasChildren && item.items.some(child => child.href === location.pathname)
  // Base width is 240px. For nested items (level > 0), we must subtract the parent's padding (pl-4 = 16px)
  // to ensure the highlight ends at exactly the same 240px point as the parent menu.
  const itemWidth = isOpen ? (level > 0 ? 'w-[224px]' : 'w-[240px]') : 'w-full';
  const itemBaseClass = cn(
    'flex box-border min-w-0 transition-all duration-200',
    itemWidth
  )
  
  // Check if any child matches search query (partial match)
  const hasMatchingChild = hasChildren && searchQuery.trim() !== '' && item.items.some(child =>
    child.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    child.description.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Auto-expand if has active child or matching search result
  useEffect(() => {
    if (hasActiveChild || hasMatchingChild) {
      setIsExpanded(true)
    }
  }, [hasActiveChild, hasMatchingChild])
  
  if (hasChildren) {
    return (
      <div className="space-y-1">
        <Button
          variant="ghost"
          className={cn(
            itemBaseClass,
            "justify-start gap-3 h-11 px-3 transition-all duration-200 hover-lift group relative overflow-hidden",
            level > 0 && "pl-4 h-9",
            (hasActiveChild || isExpanded) && "bg-accent/50 text-accent-foreground shadow-sm",
            isOpen && "hover:bg-accent/70"
          )}
          onClick={() => setIsExpanded(!isExpanded)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Gradient background on hover */}
          {isOpen && isHovered && (
            <div className={cn(
              "absolute inset-0 bg-gradient-to-r opacity-10 transition-opacity duration-200",
              item.gradient
            )} />
          )}
          
          <div className="relative flex min-w-0 items-center gap-3 w-full">
            <div className={cn(
              "p-1.5 rounded-lg transition-all duration-200",
              isHovered && isOpen && "bg-white/20 shadow-sm"
            )}>
              <item.icon className={cn("h-4 w-4 transition-colors duration-200", item.color)} />
            </div>
            
            {isOpen && (
              <>
                <div className="flex-1 min-w-0 text-left">
                  <div className="font-medium text-sm truncate">{item.title}</div>
                  {item.description && level === 0 && (
                    <div className="text-xs text-muted-foreground opacity-70 truncate">
                      {item.description}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <Badge 
                      className={cn(
                        "text-xs px-1.5 py-0.5 text-white border-0 animate-fade-in-scale",
                        item.badge.color
                      )}
                    >
                      {item.badge.text}
                    </Badge>
                  )}
                  
                  <div className={cn(
                    "transition-transform duration-200",
                    isExpanded && "rotate-90"
                  )}>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </>
            )}
          </div>
        </Button>
        
        {isExpanded && isOpen && (
          <div className="space-y-1 pl-4 pt-1 animate-slide-in-top overflow-hidden">
            {item.items
              .filter(child => {
                // If no search query, show all items
                if (!searchQuery.trim()) return true
                // If parent matches search query, show ALL sub-items (don't filter)
                const query = searchQuery.toLowerCase()
                const parentMatches = item.title.toLowerCase().includes(query) || 
                                     item.description.toLowerCase().includes(query)
                if (parentMatches) return true
                // If parent doesn't match, only show matching sub-items
                return child.title.toLowerCase().includes(query) ||
                       child.description.toLowerCase().includes(query)
              })
              .map((child, index) => (
              <MenuItem 
                key={index} 
                item={child} 
                isOpen={isOpen} 
                level={level + 1}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        )}
      </div>
    )
  }
  
  return (
    <Button
      variant="ghost"
      className={cn(
        itemBaseClass,
        "justify-start gap-3 h-10 px-3 transition-all duration-200 hover-lift group relative overflow-hidden",
        level > 0 && "pl-4 h-9",
        isActive && "bg-primary/10 text-primary font-medium shadow-sm border border-primary/20",
        !isActive && isOpen && "hover:bg-accent/50"
      )}
      asChild
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={item.href}>
        {/* Active indicator */}
        {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
        )}
        
        {/* Gradient background on hover */}
        {isHovered && isOpen && !isActive && (
          <div className={cn(
            "absolute inset-0 bg-gradient-to-r opacity-5 transition-opacity duration-200",
            item.gradient || "from-gray-500 to-gray-600"
          )} />
        )}
        
        <div className="relative flex min-w-0 items-center gap-3 w-full">
          <div className={cn(
            "p-1.5 rounded-lg transition-all duration-200",
            isActive && "bg-primary/20 shadow-sm",
            isHovered && isOpen && !isActive && "bg-white/10"
          )}>
            <item.icon className={cn(
              "h-4 w-4 transition-colors duration-200", 
              isActive ? "text-primary" : (item.color || "text-muted-foreground")
            )} />
          </div>
          
          {isOpen && (
            <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{item.title}</div>
                {item.description && level > 0 && (
                  <div className="text-xs text-muted-foreground opacity-70 truncate">
                    {item.description}
                  </div>
                )}
              </div>
              
              {item.badge && (
                <Badge 
                  className={cn(
                    "text-xs px-1.5 py-0.5 text-white border-0 animate-fade-in-scale",
                    item.badge.color
                  )}
                >
                  {item.badge.text}
                </Badge>
              )}
            </div>
          )}
        </div>
      </Link>
    </Button>
  )
}

export default function Sidebar({ isOpen, onToggle }) {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Filter menus based on search query
  const filteredMenuItems = searchQuery.trim() === '' 
    ? menuItems 
    : menuItems.map(menu => {
        const query = searchQuery.toLowerCase()
        const parentMatches = menu.title.toLowerCase().includes(query) || 
                             menu.description.toLowerCase().includes(query)
        
        // If parent matches, show parent with ALL sub-menus
        if (parentMatches) {
          return menu
        }
        
        // If parent doesn't match, check if any sub-menus match
        if (menu.items && menu.items.length > 0) {
          const matchingItems = menu.items.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
          )
          
          // If any sub-menus match, show parent with only matching sub-menus
          if (matchingItems.length > 0) {
            return {
              ...menu,
              items: matchingItems
            }
          }
        }
        
        // If neither parent nor sub-menus match, exclude this menu
        return null
      }).filter(menu => menu !== null)
  
  return (
      <div className={cn(
      "bg-card/95 backdrop-blur-sm border-r border-border/50 transition-all duration-300 ease-in-out shadow-lg relative flex flex-col h-screen",
      "before:absolute before:inset-0 before:bg-gradient-to-b before:from-background/50 before:to-transparent before:pointer-events-none",
      isOpen ? "w-72" : "w-16",
      mounted && "animate-slide-in-left"
    )}>
      <div className="flex flex-col relative z-10 flex-1 overflow-y-auto">
        <div className="flex h-16 items-center border-b border-border/50 px-4 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg transition-all duration-300 hover-scale",
              "relative overflow-hidden group"
            )}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Truck className="h-5 w-5 relative z-10" />
              <Sparkles className="h-3 w-3 absolute top-1 right-1 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            {isOpen && (
              <div className="flex flex-col animate-fade-in-scale">
                <span className="text-sm font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  IBB Shuttle
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Admin Dashboard
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Search Menu */}
        {isOpen && (
          <div className="px-3 py-4 border-b border-border/50">
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        )}
        
        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-6 custom-scrollbar">
          <nav className="space-y-3">
            {filteredMenuItems.map((item, index) => (
              <div 
                key={index}
                className="animate-slide-in-left"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <MenuItem item={item} isOpen={isOpen} searchQuery={searchQuery} />
              </div>
            ))}
          </nav>
          

        </ScrollArea>
        
        {/* Footer */}
        <div className="border-t border-border/50 p-4 bg-card/30 backdrop-blur-sm">
          {isOpen ? (
            <div className="space-y-2 animate-fade-in-scale">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span>System Online</span>
              </div>
              <div className="text-xs text-muted-foreground/70">
                <p className="font-medium">Version 2.1.0</p>
                <p>© 2024 IBB Shuttle</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
