import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { RefreshCw, Edit, Users, Percent, Star } from 'lucide-react'

const tiers = [
  {
    id: 1, tier: 'General', color: 'bg-gray-100 text-gray-700', icon: '👤',
    discount: 0, walletBonus: 0, priorityBooking: false, cryptoPayment: false,
    freeRides: 0, description: 'Standard pricing — no discount',
    minSpend: 0, maxSpend: 9999,
  },
  {
    id: 2, tier: 'VIP', color: 'bg-blue-100 text-blue-700', icon: '⭐',
    discount: 5, walletBonus: 2, priorityBooking: true, cryptoPayment: false,
    freeRides: 1, description: '5% discount on all bookings + 2% wallet bonus',
    minSpend: 10000, maxSpend: 49999,
  },
  {
    id: 3, tier: 'VVIP', color: 'bg-purple-100 text-purple-700', icon: '💎',
    discount: 10, walletBonus: 5, priorityBooking: true, cryptoPayment: true,
    freeRides: 3, description: '10% discount + 5% wallet bonus + Crypto payment',
    minSpend: 50000, maxSpend: 199999,
  },
  {
    id: 4, tier: 'Business Partner', color: 'bg-amber-100 text-amber-700', icon: '🏢',
    discount: 15, walletBonus: 8, priorityBooking: true, cryptoPayment: true,
    freeRides: 5, description: '15% discount + 8% wallet bonus + All perks',
    minSpend: 200000, maxSpend: null,
  },
]

const sampleRoutes = [
  { route: 'Bangkok - Pattaya', basePrice: 2500 },
  { route: 'Bangkok - Hua Hin', basePrice: 3500 },
  { route: 'Bangkok - Chiang Mai', basePrice: 8500 },
  { route: 'Bangkok - Phuket', basePrice: 14500 },
]

export default function MembershipPricing() {
  const [editTier, setEditTier] = useState(null)
  const [previewRoute, setPreviewRoute] = useState(sampleRoutes[0])
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast({ title: 'Refreshed', description: 'Latest data loaded' })
    }, 800)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-600" /> Membership Pricing
          </h1>
          <p className="text-sm text-gray-500 mt-1">Discounts & perks by membership tier — General / VIP / VVIP / Business Partner</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {tiers.map(t => (
          <Card key={t.id} className="relative overflow-hidden">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{t.icon}</span>
                  <Badge className={t.color}>{t.tier}</Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setEditTier(t)}><Edit className="h-4 w-4" /></Button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Discount</span>
                  <span className="font-bold text-green-600">{t.discount > 0 ? `-${t.discount}%` : 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Wallet Bonus</span>
                  <span className="font-bold text-blue-600">{t.walletBonus > 0 ? `+${t.walletBonus}%` : 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Free Rides/mo</span>
                  <span className="font-bold">{t.freeRides}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Priority Booking</span>
                  <span className={t.priorityBooking ? 'text-green-600 font-bold' : 'text-gray-400'}>{t.priorityBooking ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Crypto Payment</span>
                  <span className={t.cryptoPayment ? 'text-green-600 font-bold' : 'text-gray-400'}>{t.cryptoPayment ? 'Yes' : 'No'}</span>
                </div>
                <div className="pt-2 border-t mt-2">
                  <p className="text-xs text-gray-400">{t.description}</p>
                </div>
                <div className="text-xs text-gray-400">
                  Min spend: ฿{t.minSpend.toLocaleString()}{t.maxSpend ? ` – ฿${t.maxSpend.toLocaleString()}` : '+'}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Price Preview */}
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Percent className="h-4 w-4" />Price Preview by Tier</h2>
            <select className="text-sm border rounded px-2 py-1" value={previewRoute.route} onChange={e => setPreviewRoute(sampleRoutes.find(r => r.route === e.target.value))}>
              {sampleRoutes.map(r => <option key={r.route} value={r.route}>{r.route}</option>)}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Tier</th>
                  <th className="text-right px-4 py-2 font-medium text-gray-600">Base Price</th>
                  <th className="text-right px-4 py-2 font-medium text-gray-600">Discount</th>
                  <th className="text-right px-4 py-2 font-medium text-gray-600">Final Price</th>
                  <th className="text-right px-4 py-2 font-medium text-gray-600">Wallet Bonus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tiers.map(t => {
                  const discounted = Math.round(previewRoute.basePrice * (1 - t.discount / 100))
                  const bonus = Math.round(discounted * t.walletBonus / 100)
                  return (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2"><Badge className={t.color}>{t.icon} {t.tier}</Badge></td>
                      <td className="px-4 py-2 text-right text-gray-500">฿{previewRoute.basePrice.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right text-red-500">{t.discount > 0 ? `-฿${(previewRoute.basePrice - discounted).toLocaleString()}` : '—'}</td>
                      <td className="px-4 py-2 text-right font-bold">฿{discounted.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right text-blue-600">{bonus > 0 ? `+฿${bonus.toLocaleString()}` : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editTier && (
        <Dialog open={!!editTier} onOpenChange={() => setEditTier(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Edit {editTier.tier} Pricing</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><label className="text-xs text-gray-500 block mb-1">Discount (%)</label><Input type="number" defaultValue={editTier.discount} /></div>
              <div><label className="text-xs text-gray-500 block mb-1">Wallet Bonus (%)</label><Input type="number" defaultValue={editTier.walletBonus} /></div>
              <div><label className="text-xs text-gray-500 block mb-1">Free Rides per Month</label><Input type="number" defaultValue={editTier.freeRides} /></div>
              <div><label className="text-xs text-gray-500 block mb-1">Min Spend (฿)</label><Input type="number" defaultValue={editTier.minSpend} /></div>
              <div><label className="text-xs text-gray-500 block mb-1">Description</label><Input defaultValue={editTier.description} /></div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white flex-1" onClick={() => { toast({ title: `${editTier.tier} pricing updated` }); setEditTier(null) }}>Save Changes</Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditTier(null)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
