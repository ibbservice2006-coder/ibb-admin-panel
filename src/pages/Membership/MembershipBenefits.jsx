import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { CheckCircle, XCircle, Edit, Save, X, Star, Zap, Crown, Briefcase, Gift } from 'lucide-react'

const tierConfig = {
  general:  { label: 'General',          icon: Star,     color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700',   level: 1 },
  vip:      { label: 'VIP',              icon: Zap,      color: 'text-pink-600',   bg: 'bg-pink-50',   border: 'border-pink-200',   badge: 'bg-pink-100 text-pink-700',   level: 2 },
  vvip:     { label: 'VVIP',             icon: Crown,    color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700', level: 3 },
  business: { label: 'Business Partner', icon: Briefcase,color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200',  badge: 'bg-green-100 text-green-700', level: 4 },
}

const initialBenefits = [
  {
    category: 'Pricing & Discount',
    benefits: [
      { id: 'b1', name: 'Ride Discount',         general: '0%',     vip: '5–10%',   vvip: '10–15%',  business: 'Corporate Rate' },
      { id: 'b2', name: 'Cashback on Rides',     general: 'None',   vip: '5%',      vvip: '10%',     business: 'Custom' },
      { id: 'b3', name: 'Bulk Booking Discount', general: 'None',   vip: 'None',    vvip: 'None',    business: 'Yes' },
      { id: 'b4', name: 'Festival Surcharge',    general: 'Full',   vip: 'Reduced', vvip: 'Waived',  business: 'Negotiable' },
    ]
  },
  {
    category: 'Booking Privileges',
    benefits: [
      { id: 'b5', name: 'Priority Booking Queue',  general: false,  vip: true,   vvip: true,   business: true  },
      { id: 'b6', name: 'Advance Booking (days)',  general: '7',    vip: '30',   vvip: '60',   business: 'Unlimited' },
      { id: 'b7', name: 'Free Cancellation',       general: false,  vip: true,   vvip: true,   business: true  },
      { id: 'b8', name: 'Instant Confirmation',    general: false,  vip: true,   vvip: true,   business: true  },
      { id: 'b9', name: 'Custom Booking API',      general: false,  vip: false,  vvip: false,  business: true  },
    ]
  },
  {
    category: 'Vehicle Access',
    benefits: [
      { id: 'b10', name: 'Standard Car & SUV',     general: true,   vip: true,   vvip: true,   business: true  },
      { id: 'b11', name: 'MPV / Van',              general: true,   vip: true,   vvip: true,   business: true  },
      { id: 'b12', name: 'Bus / Coach',            general: true,   vip: true,   vvip: true,   business: true  },
      { id: 'b13', name: 'Limousine / Premium',    general: false,  vip: true,   vvip: true,   business: true  },
      { id: 'b14', name: 'Luxury Class',           general: false,  vip: false,  vvip: true,   business: true  },
    ]
  },
  {
    category: 'Support & Service',
    benefits: [
      { id: 'b15', name: 'Support Channel',        general: 'Email', vip: 'Priority', vvip: 'Concierge', business: 'Dedicated AM' },
      { id: 'b16', name: '24/7 Support',           general: false,  vip: true,   vvip: true,   business: true  },
      { id: 'b17', name: 'Dedicated Account Manager', general: false, vip: false, vvip: false, business: true  },
      { id: 'b18', name: 'Monthly Statement',      general: false,  vip: false,  vvip: true,   business: true  },
      { id: 'b19', name: 'Custom SLA Contract',    general: false,  vip: false,  vvip: false,  business: true  },
    ]
  },
  {
    category: 'Loyalty & Rewards',
    benefits: [
      { id: 'b20', name: 'Loyalty Points Earn',    general: '1x',   vip: '2x',   vvip: '3x',   business: 'Custom' },
      { id: 'b21', name: 'Points Redemption',      general: true,   vip: true,   vvip: true,   business: true  },
      { id: 'b22', name: 'Birthday Bonus',         general: false,  vip: true,   vvip: true,   business: false },
      { id: 'b23', name: 'Referral Bonus',         general: true,   vip: true,   vvip: true,   business: false },
    ]
  },
]

const renderValue = (val) => {
  if (val === true)  return <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
  if (val === false) return <XCircle className="h-4 w-4 text-gray-300 mx-auto" />
  return <span className="text-xs font-medium">{val}</span>
}

export default function MembershipBenefits() {
  const [benefits, setBenefits] = useState(initialBenefits)
  const [editId, setEditId] = useState(null)
  const [editVals, setEditVals] = useState({})

  const startEdit = (b) => {
    setEditId(b.id)
    setEditVals({ general: b.general, vip: b.vip, vvip: b.vvip, business: b.business })
  }

  const saveEdit = (catIdx, bIdx) => {
    setBenefits(prev => prev.map((cat, ci) => ci !== catIdx ? cat : {
      ...cat,
      benefits: cat.benefits.map((b, bi) => bi !== bIdx ? b : { ...b, ...editVals })
    }))
    setEditId(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-100 border border-purple-200">
            <Gift className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Membership Benefits</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Compare benefits of all 4 membership levels</p>
          </div>
        </div>
      </div>

      {/* Tier Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(tierConfig).map(([key, t]) => {
          const Icon = t.icon
          return (
            <Card key={key} className={`border-2 ${t.border}`}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-5 w-5 ${t.color}`} />
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t.badge}`}>{t.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">Tier {t.level}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Benefits Matrix */}
      {benefits.map((cat, catIdx) => (
        <Card key={cat.category}>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{cat.category}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground w-56">Benefit</th>
                    {Object.entries(tierConfig).map(([key, t]) => {
                      const Icon = t.icon
                      return (
                        <th key={key} className={`text-center px-4 py-2.5 font-medium ${t.color}`}>
                          <div className="flex items-center justify-center gap-1">
                            <Icon className="h-3.5 w-3.5" />
                            {t.label}
                          </div>
                        </th>
                      )
                    })}
                    <th className="text-center px-4 py-2.5 font-medium text-muted-foreground w-16">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.benefits.map((b, bIdx) => (
                    <tr key={b.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-2.5 font-medium text-sm">{b.name}</td>
                      {['general', 'vip', 'vvip', 'business'].map(tier => (
                        <td key={tier} className="px-4 py-2.5 text-center">
                          {editId === b.id ? (
                            <Input
                              value={editVals[tier] === true ? 'true' : editVals[tier] === false ? 'false' : editVals[tier]}
                              onChange={e => {
                                const v = e.target.value
                                setEditVals(prev => ({ ...prev, [tier]: v === 'true' ? true : v === 'false' ? false : v }))
                              }}
                              className="w-24 h-6 text-xs text-center mx-auto"
                            />
                          ) : renderValue(b[tier])}
                        </td>
                      ))}
                      <td className="px-4 py-2.5 text-center">
                        {editId === b.id ? (
                          <div className="flex gap-1 justify-center">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => saveEdit(catIdx, bIdx)}>
                              <Save className="h-3 w-3 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setEditId(null)}>
                              <X className="h-3 w-3 text-red-500" />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => startEdit(b)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
