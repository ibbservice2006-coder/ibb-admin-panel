import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import {
  Eye, TrendingUp, DollarSign, Users, Award,
  CheckCircle, Star, Zap, Gift, Crown, Briefcase
} from 'lucide-react'

// 4 Tiers According to Business Spec: General / VIP / VVIP / Business Partner
const membershipLevelsData = [
  {
    id: 1,
    name: 'General',
    tier: 'Tier 1',
    color: 'blue',
    monthlyFee: 0,
    annualFee: 0,
    members: 11840,
    activeMembers: 9820,
    monthlyRevenue: 0,
    benefits: [
      'Basic ride booking',
      'Standard pricing',
      'Email support',
      'Trip history',
      'Basic rewards'
    ],
    discounts: [
      '0% discount on rides',
      'No cashback'
    ],
    features: [
      'Unlimited bookings',
      'Standard support',
      'Basic analytics'
    ],
    status: 'active',
    createdDate: '2024-01-01',
    lastUpdated: '2026-03-01'
  },
  {
    id: 2,
    name: 'VIP',
    tier: 'Tier 2',
    color: 'pink',
    monthlyFee: 299,
    annualFee: 2999,
    members: 6890,
    activeMembers: 6120,
    monthlyRevenue: 2060110,
    benefits: [
      'Priority ride booking',
      '5–10% discount on rides',
      'Priority support',
      'Advanced trip analytics',
      '5% cashback on rides'
    ],
    discounts: [
      '5–10% discount on all rides',
      '5% cashback monthly',
      'Birthday bonus ฿500'
    ],
    features: [
      'Priority queue',
      'Phone support',
      'Advanced analytics',
      'Referral program'
    ],
    status: 'active',
    createdDate: '2024-02-01',
    lastUpdated: '2026-03-01'
  },
  {
    id: 3,
    name: 'VVIP',
    tier: 'Tier 3',
    color: 'gold',
    monthlyFee: 999,
    annualFee: 9999,
    members: 580,
    activeMembers: 562,
    monthlyRevenue: 579420,
    benefits: [
      'VVIP exclusive booking',
      '10–15% discount on rides',
      'Concierge service',
      'Premium vehicle access',
      '10% cashback on rides'
    ],
    discounts: [
      '10–15% discount on all rides',
      '10% cashback monthly',
      'Birthday bonus ฿2,000',
      'Free premium services'
    ],
    features: [
      'VVIP exclusive queue',
      'Concierge service',
      'Personal account manager',
      'Premium analytics',
      'Exclusive events & perks',
      'Luxury vehicle selection'
    ],
    status: 'active',
    createdDate: '2024-03-01',
    lastUpdated: '2026-03-01'
  },
  {
    id: 4,
    name: 'Business Partner',
    tier: 'Tier 4',
    color: 'green',
    monthlyFee: 0,
    annualFee: 0,
    members: 74,
    activeMembers: 71,
    monthlyRevenue: 12680000,
    benefits: [
      'Corporate rate pricing',
      'Bulk booking system',
      'Custom contract & SLA',
      'API access for integration',
      'Dedicated account manager'
    ],
    discounts: [
      'Corporate negotiated rates',
      'Volume discount on bulk booking',
      'Custom cashback agreement'
    ],
    features: [
      'Booking API access',
      'Bulk booking dashboard',
      'Custom SLA contract',
      'Monthly invoice & statement',
      'Credit limit system',
      'Priority fleet allocation'
    ],
    status: 'active',
    createdDate: '2024-04-01',
    lastUpdated: '2026-03-01'
  }
]

// ColorPer assigned tier
const colorConfig = {
  blue:   { card: 'border-blue-200',   badge: 'bg-blue-100 text-blue-800 border-blue-200',     icon: 'text-blue-600',   bg: 'bg-blue-50'   },
  pink:   { card: 'border-pink-200',   badge: 'bg-pink-100 text-pink-800 border-pink-200',     icon: 'text-pink-600',   bg: 'bg-pink-50'   },
  gold:   { card: 'border-yellow-300', badge: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: 'text-yellow-600', bg: 'bg-yellow-50' },
  green:  { card: 'border-green-200',  badge: 'bg-green-100 text-green-800 border-green-200',   icon: 'text-green-700',  bg: 'bg-green-50'  },
}

const tierIcons = {
  'General':          <Users className="h-6 w-6" />,
  'VIP':              <Zap className="h-6 w-6" />,
  'VVIP':             <Crown className="h-6 w-6" />,
  'Business Partner': <Briefcase className="h-6 w-6" />,
}

export default function MembershipLevels() {
  const [memberships] = useState(membershipLevelsData)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedMembership, setSelectedMembership] = useState(null)
  const { toast } = useToast()

  const stats = {
    totalMembers: memberships.reduce((sum, m) => sum + m.members, 0),
    activeMembers: memberships.reduce((sum, m) => sum + m.activeMembers, 0),
    totalMonthlyRevenue: memberships.reduce((sum, m) => sum + m.monthlyRevenue, 0),
    conversionRate: Math.round(
      (memberships.reduce((sum, m) => sum + m.activeMembers, 0) /
       memberships.reduce((sum, m) => sum + m.members, 0)) * 100
    )
  }

  const handleViewDetails = (membership) => {
    setSelectedMembership(membership)
    setIsDetailsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Membership Levels</h1>
        <p className="text-muted-foreground mt-2">Manage and monitor all membership tiers</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All 4 tiers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeMembers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">฿{(stats.totalMonthlyRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Membership fees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Active/Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Membership Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {memberships.map((membership) => {
          const cfg = colorConfig[membership.color]
          return (
            <Card key={membership.id} className={`border-2 ${cfg.card}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 ${cfg.icon}`}>
                    {tierIcons[membership.name]}
                    <CardTitle className="text-lg">{membership.name}</CardTitle>
                  </div>
                  <Badge className={`text-xs ${cfg.badge}`}>{membership.tier}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`rounded-lg p-2 ${cfg.bg}`}>
                  <p className={`text-xs font-medium text-center ${cfg.icon}`}>
                    {membership.name === 'Business Partner' ? 'Corporate Pricing' : `Monthly ฿${membership.monthlyFee} / Annual ฿${membership.annualFee}`}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Members</p>
                    <p className="font-bold">{membership.members.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Active</p>
                    <p className="font-bold text-green-600">{membership.activeMembers.toLocaleString()}</p>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <p className="text-xs text-muted-foreground mb-1">Monthly Revenue</p>
                  <p className="font-bold text-lg">
                    {membership.monthlyRevenue >= 1000000
                      ? `฿${(membership.monthlyRevenue / 1000000).toFixed(2)}M`
                      : `฿${(membership.monthlyRevenue / 1000).toFixed(0)}K`}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleViewDetails(membership)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Details Dialog */}
      {selectedMembership && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedMembership.name} — {selectedMembership.tier}</DialogTitle>
              <DialogDescription>Complete membership details and benefits</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Membership Level</Label>
                  <p className="font-medium">{selectedMembership.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge className={colorConfig[selectedMembership.color].badge}>Active</Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Monthly Fee</Label>
                  <p className="font-bold text-lg">
                    {selectedMembership.name === 'Business Partner' ? 'Corporate' : `฿${selectedMembership.monthlyFee}`}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Annual Fee</Label>
                  <p className="font-bold text-lg">
                    {selectedMembership.name === 'Business Partner' ? 'Custom Contract' : `฿${selectedMembership.annualFee}`}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Total Members</Label>
                  <p className="font-medium">{selectedMembership.members.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Active Members</Label>
                  <p className="font-medium text-green-600">{selectedMembership.activeMembers.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Monthly Revenue</Label>
                  <p className="font-bold">฿{selectedMembership.monthlyRevenue.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Conversion Rate</Label>
                  <p className="font-medium">{Math.round((selectedMembership.activeMembers / selectedMembership.members) * 100)}%</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Benefits</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedMembership.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Discounts & Rewards</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedMembership.discounts.map((discount, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Gift className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{discount}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedMembership.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Created Date</Label>
                  <p className="font-medium">{selectedMembership.createdDate}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Updated</Label>
                  <p className="font-medium">{selectedMembership.lastUpdated}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
