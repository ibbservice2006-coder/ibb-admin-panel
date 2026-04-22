import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import './App.css'

// Layout Components
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import CommandPalette from './components/CommandPalette'

// Page Components — IBB Shuttle specific
import Login from './pages/Login'
import GenericPage from '@/pages/GenericPage'

// Dashboard
import DashboardOverview from './pages/DashboardOverview'
import KPIMetrics from './pages/KPIMetrics'
import LiveOperations from './pages/Dashboard/LiveOperations'
import SystemAlerts from './pages/Dashboard/SystemAlerts'
import DashboardBuilderPage from './pages/Dashboard/DashboardBuilder'
import SavedFiltersPage from './pages/Dashboard/SavedFilters'

// Bookings
import AllBookings from '@/pages/Bookings/AllBookings'
import PendingBookings from '@/pages/Bookings/PendingBookings'
import CompletedBookings from '@/pages/Bookings/CompletedBookings'
import ConfirmedBookings from '@/pages/Bookings/ConfirmedBookings'
import AssignedBookings from '@/pages/Bookings/AssignedBookings'
import InProgressBookings from '@/pages/Bookings/InProgressBookings'
import CancelledBookings from '@/pages/Bookings/CancelledBookings'
import BookingCalendar from '@/pages/Bookings/BookingCalendar'

// Fleet Management
import AllVehicles from '@/pages/Fleet/AllVehicles'
import VehicleTypes from '@/pages/Fleet/VehicleTypes'
import Maintenance from '@/pages/Fleet/Maintenance'
import Insurance from '@/pages/Fleet/Insurance'
import Fuel from '@/pages/Fleet/Fuel'
import VehicleStatus from '@/pages/Fleet/VehicleStatus'

// Drivers
import AllDrivers from '@/pages/Drivers/AllDrivers'
import DriverPerformance from '@/pages/Drivers/DriverPerformance'
import DriverEarnings from '@/pages/Drivers/DriverEarnings'
import DriverStatus from '@/pages/Drivers/DriverStatus'
import DriverDocuments from '@/pages/Drivers/DriverDocuments'
import DriverComplaints from '@/pages/Drivers/DriverComplaints'

// Customers
import AllCustomers from '@/pages/Customers/AllCustomers'
import CustomerProfiles from '@/pages/Customers/CustomerProfiles'
import Addresses from '@/pages/Customers/Addresses'
import Favorites from '@/pages/Customers/Favorites'

// Route Management
import AllRoutes from '@/pages/RoutesAndPricing/AllRoutes'
import RouteZones from '@/pages/RoutesAndPricing/RouteZones'
import RouteAnalytics from '@/pages/RoutesAndPricing/RouteAnalytics'

// Pricing Management
import ZonePricing from '@/pages/Pricing/ZonePricing'
import CarPricing from '@/pages/Pricing/CarPricing'
import VanPricing from '@/pages/Pricing/VanPricing'
import BusPricing from '@/pages/Pricing/BusPricing'
import FestivalPricing from '@/pages/Pricing/FestivalPricing'
import MembershipPricing from '@/pages/Pricing/MembershipPricing'
import HourlyPeriodRates from '@/pages/Pricing/HourlyPeriodRates'
import PricingAnalytics from '@/pages/Pricing/PricingAnalytics'

// Currency & Exchange Rate
import CurrencyList from '@/pages/Currency/CurrencyList'
import ExchangeRates from '@/pages/Currency/ExchangeRates'
import CurrencyMargins from '@/pages/Currency/CurrencyMargins'
import RateHistory from '@/pages/Currency/RateHistory'
import RateSync from '@/pages/Currency/RateSync'

// Membership
import MembershipLevels from '@/pages/Membership/MembershipLevels'
import GeneralMembers from '@/pages/Membership/GeneralMembers'
import VIPMembers from '@/pages/Membership/VIPMembers'
import VVIPMembers from '@/pages/Membership/VVIPMembers'
import BusinessPartnerMembers from '@/pages/Membership/BusinessPartnerMembers'
import MembershipBenefits from '@/pages/Membership/MembershipBenefits'
import MembershipAnalytics from '@/pages/Membership/MembershipAnalytics'

// Wallet & Payments
import WalletTransactions from '@/pages/Wallet/WalletTransactions'
import WalletTopup from '@/pages/Wallet/WalletTopup'
import PaymentMethods from '@/pages/Wallet/PaymentMethods'
import PaymentProcessing from '@/pages/Wallet/PaymentProcessing'
import PaymentRefunds from '@/pages/Wallet/PaymentRefunds'
import PaymentGateways from '@/pages/Wallet/PaymentGateways'
import PaymentReports from '@/pages/Wallet/PaymentReports'

// Vouchers & Promotions
import VoucherCatalog from '@/pages/Vouchers/VoucherCatalog'
import VoucherCampaigns from '@/pages/Vouchers/VoucherCampaigns'
import VoucherCodes from '@/pages/Vouchers/VoucherCodes'
import VoucherRedemption from '@/pages/Vouchers/VoucherRedemption'
import VoucherAnalytics from '@/pages/Vouchers/VoucherAnalytics'
import VoucherPromotions from '@/pages/Vouchers/VoucherPromotions'
import VoucherRules from '@/pages/Vouchers/VoucherRules'

// External Platforms
import PlatformIntegrations from '@/pages/Platforms/PlatformIntegrations'
import SEAsiaPlatforms from '@/pages/Platforms/SEAsiaPlatforms'
import GlobalPlatforms from '@/pages/Platforms/GlobalPlatforms'
import ChinaPlatforms from '@/pages/Platforms/ChinaPlatforms'
import MiddleEastPlatforms from '@/pages/Platforms/MiddleEastPlatforms'
import RussiaPlatforms from '@/pages/Platforms/RussiaPlatforms'
import PlatformStores from '@/pages/Platforms/PlatformStores'
import PlatformOrders from '@/pages/Platforms/PlatformOrders'
import PlatformSync from '@/pages/Platforms/PlatformSync'

// Partners & Affiliates
import AllPartners from '@/pages/Partners/AllPartners'
import PartnerProfiles from '@/pages/Partners/PartnerProfiles'
import AffiliateLinks from '@/pages/Partners/AffiliateLinks'
import CommissionManagement from '@/pages/Partners/CommissionManagement'
import PartnerAnalytics from '@/pages/Partners/PartnerAnalytics'

// GPS Tracking
import LiveMap from '@/pages/GPSTracking/LiveMap'
import ActiveTrips from '@/pages/GPSTracking/ActiveTrips'
import TripHistory from '@/pages/GPSTracking/TripHistory'
import Geofencing from '@/pages/GPSTracking/Geofencing'
import RouteOptimization from '@/pages/GPSTracking/RouteOptimization'

// User Management
import AdminUsers from '@/pages/UserManagement/AdminUsers'
import RolesPermissions from '@/pages/UserManagement/RolesPermissions'
import ActivityLog from '@/pages/UserManagement/ActivityLog'
import AuditTrail from '@/pages/UserManagement/AuditTrail'

// Notifications
import AllNotifications from '@/pages/Notifications/AllNotifications'
import EmailNotifications from '@/pages/Notifications/EmailNotifications'
import SMSNotifications from '@/pages/Notifications/SMSNotifications'
import PushNotifications from '@/pages/Notifications/PushNotifications'
import NotificationRules from '@/pages/Notifications/NotificationRules'

// Reports
import BookingsReport from '@/pages/Reports/BookingsReport'
import DriversReport from '@/pages/Reports/DriversReport'
import RevenueReport from '@/pages/Reports/RevenueReport'
import CustomersReport from '@/pages/Reports/CustomersReport'
import FleetReport from '@/pages/Reports/FleetReport'
import FinancialReport from '@/pages/Reports/FinancialReport'
import ChartsReport from '@/pages/Reports/ChartsReport'
import AdvancedAnalytics from '@/pages/Reports/AdvancedAnalytics'

// Support
import SupportTickets from '@/pages/Support/SupportTickets'
import FAQManagement from '@/pages/Support/FAQManagement'
import KnowledgeBase from '@/pages/Support/KnowledgeBase'
import LiveChat from '@/pages/Support/LiveChat'
import CustomerFeedback from '@/pages/Support/CustomerFeedback'

// Settings
import SystemSettings from '@/pages/Settings/SystemSettings'
import GeneralSettings from '@/pages/Settings/GeneralSettings'
import BusinessSettings from '@/pages/Settings/BusinessSettings'
import ServiceSettings from '@/pages/Settings/ServiceSettings'
import PaymentSettings from '@/pages/Settings/PaymentSettings'
import ThemeCustomizer from '@/pages/Settings/ThemeCustomizer'
import KeyboardShortcuts from '@/pages/Settings/KeyboardShortcuts'
import PWASettings from '@/pages/Settings/PWASettings'
import SecuritySettings from '@/pages/Settings/SecuritySettings'
import IntegrationSettings from '@/pages/Settings/IntegrationSettings'
import IntegrationsAPI from '@/pages/Integrations/IntegrationsAPI'
import IntegrationsWebhooks from '@/pages/Integrations/IntegrationsWebhooks'
import ThirdPartyServices from '@/pages/Integrations/ThirdPartyServices'

// Content
import Pages from './pages/Pages'
import MediaLibrary from './pages/MediaLibrary'
import Notes from './pages/Notes'
import Tags from './pages/Tags'

// Dynamic Tools
import DynamicDBManagement from './pages/DynamicTools/DynamicDBManagement'
import RelationshipsDesigner from './pages/DynamicTools/RelationshipsDesigner'
import QueryBuilder from './pages/DynamicTools/QueryBuilder'
import LookupWizard from './pages/LookupWizard'
import ConditionalFormatting from './pages/ConditionalFormatting'
import ExportImportWizard from './pages/ExportImportWizard'
import ImportExport from './pages/DynamicTools/ImportExport'
import BackupRestore from './pages/DynamicTools/BackupRestore'
import DataMigration from './pages/DynamicTools/DataMigration'
import BulkOperations from './pages/DynamicTools/BulkOperations'
import DataValidation from './pages/DynamicTools/DataValidation'
import MacrosAutomation from './pages/DynamicTools/MacrosAutomation'
import DynamicSecuritySettings from './pages/DynamicTools/SecuritySettings'
import AuditLog from './pages/DynamicTools/AuditLog'
import UserPermissions from './pages/DynamicTools/UserPermissions'
import Webhooks from './pages/DynamicTools/Webhooks'
import DatabaseSettings from './pages/DynamicTools/DatabaseSettings'
import APIManagement from './pages/DynamicTools/APIManagement'

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Main Layout Component
function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  return (
    <div className="flex h-screen bg-background">
      <CommandPalette />
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted/50 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

// App Routes Component
function AppRoutes() {
  const { user, loading } = useAuth()

  // Wait for auth state to resolve before deciding to redirect
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }
  
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardOverview />} />
        <Route path="/dashboard/overview" element={<DashboardOverview />} />
        <Route path="/dashboard/live-operations" element={<LiveOperations />} />
        <Route path="/dashboard/kpi-metrics" element={<KPIMetrics />} />
        <Route path="/dashboard/system-alerts" element={<SystemAlerts />} />
        <Route path="/dashboard/dashboard-builder" element={<DashboardBuilderPage />} />
        <Route path="/dashboard/saved-filters" element={<SavedFiltersPage />} />

        {/* Bookings */}
        <Route path="/bookings/all" element={<AllBookings />} />
        <Route path="/bookings/pending" element={<PendingBookings />} />
        <Route path="/bookings/confirmed" element={<ConfirmedBookings />} />
        <Route path="/bookings/assigned" element={<AssignedBookings />} />
        <Route path="/bookings/in-progress" element={<InProgressBookings />} />
        <Route path="/bookings/completed" element={<CompletedBookings />} />
        <Route path="/bookings/cancelled" element={<CancelledBookings />} />
        <Route path="/bookings/calendar" element={<BookingCalendar />} />

        {/* Fleet Management */}
        <Route path="/fleet/vehicles" element={<AllVehicles />} />
        <Route path="/fleet/types" element={<VehicleTypes />} />
        <Route path="/fleet/status" element={<VehicleStatus />} />
        <Route path="/fleet/maintenance" element={<Maintenance />} />
        <Route path="/fleet/insurance" element={<Insurance />} />
        <Route path="/fleet/fuel" element={<Fuel />} />

        {/* Drivers */}
        <Route path="/drivers/all" element={<AllDrivers />} />
        <Route path="/drivers/status" element={<DriverStatus />} />
        <Route path="/drivers/performance" element={<DriverPerformance />} />
        <Route path="/drivers/earnings" element={<DriverEarnings />} />
        <Route path="/drivers/documents" element={<DriverDocuments />} />
        <Route path="/drivers/complaints" element={<DriverComplaints />} />

        {/* Customers */}
        <Route path="/customers/all" element={<AllCustomers />} />
        <Route path="/customers/profiles" element={<CustomerProfiles />} />
        <Route path="/customers/addresses" element={<Addresses />} />
        <Route path="/customers/favorites" element={<Favorites />} />

        {/* Route Management */}
        <Route path="/routes/all" element={<AllRoutes />} />
        <Route path="/routes/zones" element={<RouteZones />} />
        <Route path="/routes/analytics" element={<RouteAnalytics />} />

        {/* Pricing Management */}
        <Route path="/pricing/zones" element={<ZonePricing />} />
        <Route path="/pricing/car" element={<CarPricing />} />
        <Route path="/pricing/van" element={<VanPricing />} />
        <Route path="/pricing/bus" element={<BusPricing />} />
        <Route path="/pricing/festival" element={<FestivalPricing />} />
        <Route path="/pricing/membership" element={<MembershipPricing />} />
        <Route path="/pricing/hourly-period" element={<HourlyPeriodRates />} />
        <Route path="/pricing/analytics" element={<PricingAnalytics />} />

        {/* Currency & Exchange Rate */}
        <Route path="/currency/list" element={<CurrencyList />} />
        <Route path="/currency/rates" element={<ExchangeRates />} />
        <Route path="/currency/margins" element={<CurrencyMargins />} />
        <Route path="/currency/history" element={<RateHistory />} />
        <Route path="/currency/sync" element={<RateSync />} />

        {/* Membership */}
        <Route path="/membership/levels" element={<MembershipLevels />} />
        <Route path="/membership/general" element={<GeneralMembers />} />
        <Route path="/membership/vip" element={<VIPMembers />} />
        <Route path="/membership/vvip" element={<VVIPMembers />} />
        <Route path="/membership/business-partner" element={<BusinessPartnerMembers />} />
        <Route path="/membership/benefits" element={<MembershipBenefits />} />
        <Route path="/membership/analytics" element={<MembershipAnalytics />} />

        {/* Wallet & Payments */}
        <Route path="/wallet/transactions" element={<WalletTransactions />} />
        <Route path="/wallet/topup" element={<WalletTopup />} />
        <Route path="/wallet/methods" element={<PaymentMethods />} />
        <Route path="/wallet/processing" element={<PaymentProcessing />} />
        <Route path="/wallet/refunds" element={<PaymentRefunds />} />
        <Route path="/wallet/gateways" element={<PaymentGateways />} />
        <Route path="/wallet/reports" element={<PaymentReports />} />

        {/* Vouchers & Promotions */}
        <Route path="/vouchers/catalog" element={<VoucherCatalog />} />
        <Route path="/vouchers/campaigns" element={<VoucherCampaigns />} />
        <Route path="/vouchers/codes" element={<VoucherCodes />} />
        <Route path="/vouchers/redemption" element={<VoucherRedemption />} />
        <Route path="/vouchers/analytics" element={<VoucherAnalytics />} />
        <Route path="/vouchers/promotions" element={<VoucherPromotions />} />
        <Route path="/vouchers/rules" element={<VoucherRules />} />

        {/* External Platforms */}
        <Route path="/platforms/integrations" element={<PlatformIntegrations />} />
        <Route path="/platforms/southeast-asia" element={<SEAsiaPlatforms />} />
        <Route path="/platforms/global" element={<GlobalPlatforms />} />
        <Route path="/platforms/china" element={<ChinaPlatforms />} />
        <Route path="/platforms/middle-east" element={<MiddleEastPlatforms />} />
        <Route path="/platforms/russia" element={<RussiaPlatforms />} />
        <Route path="/platforms/stores" element={<PlatformStores />} />
        <Route path="/platforms/orders" element={<PlatformOrders />} />
        <Route path="/platforms/sync" element={<PlatformSync />} />

        {/* GPS Tracking */}
        <Route path="/gps/map" element={<LiveMap />} />
        <Route path="/gps/active" element={<ActiveTrips />} />
        <Route path="/gps/history" element={<TripHistory />} />
        <Route path="/gps/geofencing" element={<Geofencing />} />
        <Route path="/gps/optimization" element={<RouteOptimization />} />

        {/* Partners & Affiliates */}
        <Route path="/partners/all" element={<AllPartners />} />
        <Route path="/partners/profiles" element={<PartnerProfiles />} />
        <Route path="/partners/affiliate" element={<AffiliateLinks />} />
        <Route path="/partners/commission" element={<CommissionManagement />} />
        <Route path="/partners/analytics" element={<PartnerAnalytics />} />

        {/* Reports & Analytics */}
        <Route path="/reports/revenue" element={<RevenueReport />} />
        <Route path="/reports/bookings" element={<BookingsReport />} />
        <Route path="/reports/customers" element={<CustomersReport />} />
        <Route path="/reports/drivers" element={<DriversReport />} />
        <Route path="/reports/fleet" element={<FleetReport />} />
        <Route path="/reports/financial" element={<FinancialReport />} />
        <Route path="/reports/charts" element={<ChartsReport />} />
        <Route path="/reports/advanced" element={<AdvancedAnalytics />} />

        {/* Notifications */}
        <Route path="/notifications/all" element={<AllNotifications />} />
        <Route path="/notifications/email" element={<EmailNotifications />} />
        <Route path="/notifications/sms" element={<SMSNotifications />} />
        <Route path="/notifications/push" element={<PushNotifications />} />
        <Route path="/notifications/rules" element={<NotificationRules />} />

        {/* User Management */}
        <Route path="/users/admins" element={<AdminUsers />} />
        <Route path="/users/roles" element={<RolesPermissions />} />
        <Route path="/users/permissions" element={<RolesPermissions />} />
        <Route path="/users/activity" element={<ActivityLog />} />
        <Route path="/users/audit" element={<AuditTrail />} />

        {/* Content */}
        <Route path="/content/pages" element={<Pages />} />
        <Route path="/content/media" element={<MediaLibrary />} />
        <Route path="/content/notes" element={<Notes />} />
        <Route path="/content/tags" element={<Tags />} />

        {/* Support & Help */}
        <Route path="/support/tickets" element={<SupportTickets />} />
        <Route path="/support/faq" element={<FAQManagement />} />
        <Route path="/support/knowledge" element={<KnowledgeBase />} />
        <Route path="/support/chat" element={<LiveChat />} />
        <Route path="/support/feedback" element={<CustomerFeedback />} />

        {/* Settings */}
        <Route path="/settings" element={<Navigate to="/settings/general" replace />} />
        <Route path="/settings/general" element={<GeneralSettings />} />
        <Route path="/settings/business" element={<BusinessSettings />} />
        <Route path="/settings/service" element={<ServiceSettings />} />
        <Route path="/settings/payment" element={<PaymentSettings />} />
        <Route path="/settings/theme" element={<ThemeCustomizer />} />
        <Route path="/settings/shortcuts" element={<KeyboardShortcuts />} />
        <Route path="/settings/pwa" element={<PWASettings />} />
        <Route path="/settings/system" element={<SystemSettings />} />

        {/* Integrations (redirect to settings) */}
        <Route path="/integrations/api" element={<IntegrationsAPI />} />
        <Route path="/integrations/webhooks" element={<IntegrationsWebhooks />} />
        <Route path="/integrations/services" element={<ThirdPartyServices />} />

        {/* Database Tools */}
        <Route path="/dynamic-tools/db-management" element={<DynamicDBManagement />} />
        <Route path="/dynamic-tools/relationships-designer" element={<RelationshipsDesigner />} />
        <Route path="/dynamic-tools/query-builder" element={<QueryBuilder />} />
        <Route path="/dynamic-tools/lookup-wizard" element={<LookupWizard />} />
        <Route path="/dynamic-tools/conditional-formatting" element={<ConditionalFormatting />} />
        <Route path="/dynamic-tools/database-settings" element={<DatabaseSettings />} />

        {/* Data Management */}
        <Route path="/dynamic-tools/export-import-wizard" element={<ExportImportWizard />} />
        <Route path="/dynamic-tools/import-export" element={<ImportExport />} />
        <Route path="/dynamic-tools/backup-restore" element={<BackupRestore />} />
        <Route path="/dynamic-tools/data-migration" element={<DataMigration />} />
        <Route path="/dynamic-tools/bulk-operations" element={<BulkOperations />} />
        <Route path="/dynamic-tools/data-validation" element={<DataValidation />} />

        {/* System & Security */}
        <Route path="/dynamic-tools/user-permissions" element={<UserPermissions />} />
        <Route path="/dynamic-tools/audit-log" element={<AuditLog />} />
        <Route path="/dynamic-tools/api-management" element={<APIManagement />} />
        <Route path="/dynamic-tools/webhooks" element={<Webhooks />} />
        <Route path="/dynamic-tools/macros-automation" element={<MacrosAutomation />} />
        <Route path="/dynamic-tools/security-settings" element={<DynamicSecuritySettings />} />
        <Route path="/dynamic-tools/security" element={<SecuritySettings />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </MainLayout>
  )
}

// Main App Component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="admin-ui-theme">
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background font-sans antialiased">
              <AppRoutes />
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
