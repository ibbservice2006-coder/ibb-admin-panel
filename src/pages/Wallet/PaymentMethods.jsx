import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { CreditCard, Edit, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react'
import PlatformLogo from '@/components/PlatformLogo'

const initialMethods = [
  {
    id: 1, key: 'bank_thb', name: 'Thai Bank Transfer (THB)', category: 'bank',
    provider: 'PromptPay / SCB / KBank / BBL', feePct: 0,
    currencies: ['THB'], tiers: ['General', 'VIP', 'VVIP', 'Business Partner'],
    isActive: true, note: 'For domestic customers, transfer via PromptPay or bank account',
    logoKey: 'promptpay', bg: 'bg-blue-50', border: 'border-blue-200',
  },
  {
    id: 2, key: 'payoneer', name: 'Payoneer', category: 'international',
    provider: 'Payoneer Inc.', feePct: 1.5,
    currencies: ['USD', 'EUR', 'GBP', 'JPY', 'CNY'], tiers: ['VIP', 'VVIP', 'Business Partner'],
    isActive: true, note: 'For international customers, supports USD, EUR, GBP, JPY, CNY',
    logoKey: 'payoneer', bg: 'bg-orange-50', border: 'border-orange-200',
  },
  {
    id: 3, key: 'wise', name: 'Wise (TransferWise)', category: 'international',
    provider: 'Wise Payments Ltd.', feePct: 0.5,
    currencies: ['USD', 'EUR', 'GBP', 'JPY', 'CNY'], tiers: ['VIP', 'VVIP', 'Business Partner'],
    isActive: true, note: 'Low-fee international transfers',
    logoKey: 'wise', bg: 'bg-green-50', border: 'border-green-200',
  },
  {
    id: 4, key: 'stripe', name: 'Credit / Debit Card (Stripe)', category: 'card',
    provider: 'Stripe', feePct: 2.9,
    currencies: ['THB', 'USD', 'EUR', 'GBP'], tiers: ['General', 'VIP', 'VVIP', 'Business Partner'],
    isActive: true, note: 'Visa / Mastercard / Amex via Stripe Payment Gateway',
    logoKey: 'stripe', bg: 'bg-purple-50', border: 'border-purple-200',
  },
  {
    id: 5, key: 'omise', name: 'Credit / Debit Card (Omise)', category: 'card',
    provider: 'Omise (Opn Payments)', feePct: 3.65,
    currencies: ['THB'], tiers: ['General', 'VIP', 'VVIP', 'Business Partner'],
    isActive: true, note: 'Credit/Debit card via Omise for domestic customers',
    logoKey: 'omise', bg: 'bg-indigo-50', border: 'border-indigo-200',
  },
  {
    id: 8, key: 'alipay', name: 'Alipay (支付宝)', category: 'ewallet',
    provider: 'Ant Group (Alibaba)', feePct: 1.0,
    currencies: ['CNY', 'THB', 'USD'], tiers: ['General', 'VIP', 'VVIP', 'Business Partner'],
    isActive: true, note: 'Popular Chinese E-Wallet for Tourists in Thailand — Connects with Taobao/Tmall/Fliggy',
    logoKey: 'alipay', bg: 'bg-blue-50', border: 'border-blue-200',
  },
  {
    id: 9, key: 'wechat_pay', name: 'WeChat Pay (微信支付)', category: 'ewallet',
    provider: 'Tencent Holdings', feePct: 1.0,
    currencies: ['CNY', 'THB'], tiers: ['General', 'VIP', 'VVIP', 'Business Partner'],
    isActive: true, note: 'Tencent e-wallet — Chinese customers pay via WeChat Mini Program or QR Code',
    logoKey: 'wechat_pay', bg: 'bg-green-50', border: 'border-green-200',
  },
  {
    id: 6, key: 'crypto', name: 'Cryptocurrency (Bitkub)', category: 'crypto',
    provider: 'Bitkub Exchange', feePct: 0.25,
    currencies: ['USDT', 'BTC', 'ETH', 'BNB'], tiers: ['VVIP'],
    isActive: true, note: 'VVIP members only — USDT, BTC, ETH, BNB via Bitkub',
    logoKey: 'bitkub', bg: 'bg-yellow-50', border: 'border-yellow-300',
  },
  {
    id: 7, key: 'platform', name: 'External Platform Payment', category: 'platform',
    provider: 'Shopee / Lazada / Amazon / eBay / Coupang', feePct: 0,
    currencies: ['THB', 'USD', 'EUR', 'CNY', 'JPY'], tiers: ['General', 'VIP', 'VVIP', 'Business Partner'],
    isActive: true, note: 'Pay via External Platform, IBB receives notification & creates Booking',
    logoKey: 'shopee', bg: 'bg-rose-50', border: 'border-rose-200',
  },
]

const categoryLabel = {
  bank: 'Bank Transfer', international: 'International Transfer',
  card: 'Card Payment', ewallet: 'E-Wallet', crypto: 'Cryptocurrency', platform: 'External Platform',
}

const tierColor = {
  'General': 'bg-blue-100 text-blue-700',
  'VIP': 'bg-pink-100 text-pink-700',
  'VVIP': 'bg-yellow-100 text-yellow-700',
  'Business Partner': 'bg-green-100 text-green-700',
}

export default function PaymentMethods() {
  const [methods, setMethods] = useState(initialMethods)
  const [editMethod, setEditMethod] = useState(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const { toast } = useToast()

  const handleToggle = (id) => {
    const method = methods.find(m => m.id === id)
    setMethods(prev => prev.map(m => m.id === id ? { ...m, isActive: !m.isActive } : m))
    toast({ title: method.isActive ? 'Disabled' : 'Enabled', description: `${method.name} has been ${method.isActive ? 'disabled' : 'enabled'}.` })
  }

  const handleEdit = (method) => {
    setEditMethod({ ...method })
    setIsEditOpen(true)
  }

  const handleSave = () => {
    setMethods(prev => prev.map(m => m.id === editMethod.id ? editMethod : m))
    toast({ title: 'Saved', description: `${editMethod.name} updated successfully.` })
    setIsEditOpen(false)
  }

  const activeCount = methods.filter(m => m.isActive).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-100 border border-purple-200">
            <CreditCard className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Payment Methods</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Manage Payment Channels by Membership Tier</p>
          </div>
        </div>
        <Badge className="bg-green-100 text-green-700 text-sm px-3 py-1">{activeCount} / {methods.length} Active</Badge>
      </div>

      {/* Crypto Notice */}
      <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-yellow-800">
          <p className="font-semibold">Crypto Payment — VVIP Only</p>
          <p className="mt-0.5">Crypto payments (USDT/BTC/ETH/BNB) via Bitkub exclusive to VVIP members only</p>
        </div>
      </div>

      {/* Method Cards */}
      <div className="grid grid-cols-1 gap-4">
        {methods.map(method => (
          <Card key={method.id} className={`border ${method.isActive ? method.border : 'border-gray-200 opacity-60'}`}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-xl ${method.isActive ? method.bg : 'bg-gray-100'} flex-shrink-0`}>
                  <PlatformLogo platform={method.logoKey} size={36} fallback={method.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-base">{method.name}</h3>
                    <Badge variant="outline" className="text-xs">{categoryLabel[method.category]}</Badge>
                    {!method.isActive && <Badge className="text-xs bg-gray-100 text-gray-600">Disabled</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Provider: {method.provider}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{method.note}</p>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <div className="text-xs">
                      <span className="text-muted-foreground">Fee: </span>
                      <span className="font-medium">{method.feePct > 0 ? `${method.feePct}%` : 'Free'}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Currencies: </span>
                      <span className="font-medium">{method.currencies.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs flex-wrap">
                      <span className="text-muted-foreground">Available for: </span>
                      {method.tiers.map(t => (
                        <Badge key={t} className={`text-xs ${tierColor[t]}`}>{t}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" className="h-8 px-3" onClick={() => handleEdit(method)}>
                    <Edit className="h-3.5 w-3.5 mr-1" />Edit
                  </Button>
                  <Button variant="outline" size="sm"
                    className={`h-8 px-3 ${method.isActive ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'}`}
                    onClick={() => handleToggle(method.id)}>
                    {method.isActive
                      ? <><ToggleRight className="h-3.5 w-3.5 mr-1" />Disable</>
                      : <><ToggleLeft className="h-3.5 w-3.5 mr-1" />Enable</>}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editMethod && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit — {editMethod.name}</DialogTitle>
              <DialogDescription>Edit fees and details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Processing Fee (%)</Label>
                <Input type="number" step="0.01" min="0" max="10" className="mt-1"
                  value={editMethod.feePct}
                  onChange={e => setEditMethod(prev => ({ ...prev, feePct: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div>
                <Label>Note / Description</Label>
                <Input className="mt-1" value={editMethod.note}
                  onChange={e => setEditMethod(prev => ({ ...prev, note: e.target.value }))} />
              </div>
              <div className="flex gap-3 pt-2">
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white flex-1" onClick={handleSave}>Save Changes</Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
