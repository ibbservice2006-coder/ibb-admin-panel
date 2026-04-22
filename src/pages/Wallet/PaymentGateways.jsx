import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Settings, CheckCircle, XCircle, AlertTriangle, Eye, EyeOff, Edit, Zap } from 'lucide-react'

const initialGateways = [
  {
    id: 1, name: 'Stripe', type: 'card', logo: '💳',
    description: 'Credit/Debit Card — Visa, Mastercard, Amex (Global)',
    status: 'active', mode: 'live',
    apiKey: 'sk_live_masked',
    publicKey: 'pk_live_masked',
    webhookSecret: 'whsec_••••••••••••••••••••••••••5678',
    processingFee: 2.9, fixedFee: 30,
    supportedCurrencies: ['THB', 'USD', 'EUR', 'GBP'],
    lastTested: '2026-03-24 06:00', testResult: 'pass',
    tiers: ['General', 'VIP', 'VVIP', 'Business Partner'],
  },
  {
    id: 2, name: 'Omise (Opn Payments)', type: 'card', logo: '💳',
    description: 'Credit/Debit Card — Thai banks, PromptPay (Thailand)',
    status: 'active', mode: 'live',
    apiKey: 'skey_test_masked',
    publicKey: 'pkey_test_••••••••••••••••••••••••••8888',
    webhookSecret: 'whsec_••••••••••••••••••••••••••7777',
    processingFee: 3.65, fixedFee: 0,
    supportedCurrencies: ['THB'],
    lastTested: '2026-03-24 06:00', testResult: 'pass',
    tiers: ['General', 'VIP', 'VVIP', 'Business Partner'],
  },
  {
    id: 3, name: 'Bitkub', type: 'crypto', logo: '₿',
    description: 'Cryptocurrency — USDT, BTC, ETH, BNB (VVIP Only)',
    status: 'active', mode: 'live',
    apiKey: 'bk_live_••••••••••••••••••••••••••3333',
    publicKey: 'bk_pub_••••••••••••••••••••••••••2222',
    webhookSecret: 'bk_wh_••••••••••••••••••••••••••1111',
    processingFee: 0.25, fixedFee: 0,
    supportedCurrencies: ['USDT', 'BTC', 'ETH', 'BNB'],
    lastTested: '2026-03-23 18:00', testResult: 'pass',
    tiers: ['VVIP'],
  },
  {
    id: 4, name: 'Payoneer', type: 'international', logo: '🌐',
    description: 'International Transfer — USD, EUR, GBP, JPY, CNY',
    status: 'active', mode: 'live',
    apiKey: 'pay_live_••••••••••••••••••••••••••6666',
    publicKey: '—',
    webhookSecret: 'pay_wh_••••••••••••••••••••••••••5555',
    processingFee: 1.5, fixedFee: 0,
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY', 'CNY'],
    lastTested: '2026-03-23 12:00', testResult: 'pass',
    tiers: ['VIP', 'VVIP', 'Business Partner'],
  },
  {
    id: 5, name: 'Wise', type: 'international', logo: '🌐',
    description: 'International Transfer — Low fee, real exchange rate',
    status: 'active', mode: 'live',
    apiKey: 'wise_live_••••••••••••••••••••••••••4444',
    publicKey: '—',
    webhookSecret: 'wise_wh_••••••••••••••••••••••••••3333',
    processingFee: 0.5, fixedFee: 0,
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY', 'CNY'],
    lastTested: '2026-03-23 12:00', testResult: 'pass',
    tiers: ['VIP', 'VVIP', 'Business Partner'],
  },
]

const typeColor = {
  card: 'bg-purple-100 text-purple-700',
  crypto: 'bg-yellow-100 text-yellow-700',
  international: 'bg-blue-100 text-blue-700',
}

const tierColor = {
  'General': 'bg-blue-100 text-blue-700',
  'VIP': 'bg-pink-100 text-pink-700',
  'VVIP': 'bg-yellow-100 text-yellow-700',
  'Business Partner': 'bg-green-100 text-green-700',
}

export default function PaymentGateways() {
  const [gateways, setGateways] = useState(initialGateways)
  const [editGateway, setEditGateway] = useState(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [showKeys, setShowKeys] = useState({})
  const { toast } = useToast()

  const toggleShowKey = (id) => setShowKeys(prev => ({ ...prev, [id]: !prev[id] }))

  const handleTest = async (id) => {
    toast({ title: 'Testing...', description: 'Sending test request to gateway...' })
    await new Promise(r => setTimeout(r, 1500))
    toast({ title: 'Test Passed ✅', description: 'Gateway responded successfully.' })
  }

  const handleSave = () => {
    setGateways(prev => prev.map(g => g.id === editGateway.id ? editGateway : g))
    toast({ title: 'Saved', description: `${editGateway.name} configuration updated.` })
    setIsEditOpen(false)
  }

  const handleToggle = (id) => {
    setGateways(prev => prev.map(g => g.id === id ? { ...g, status: g.status === 'active' ? 'inactive' : 'active' } : g))
    const gw = gateways.find(g => g.id === id)
    toast({ title: gw.status === 'active' ? 'Gateway Disabled' : 'Gateway Enabled', description: `${gw.name} ${gw.status === 'active' ? 'disabled' : 'enabled'}.` })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gray-100 border border-gray-200">
          <Settings className="h-6 w-6 text-gray-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payment Gateways</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Configure API Keys and manage all Payment Gateways</p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-red-800">
          <p className="font-semibold">Security Warning</p>
          <p className="mt-0.5">These API Keys are confidential. Do not disclose externally. Changing them may affect all payment systems. Please verify before saving.</p>
        </div>
      </div>

      <div className="space-y-4">
        {gateways.map(gw => (
          <Card key={gw.id} className={`border ${gw.status === 'active' ? 'border-gray-200' : 'border-gray-200 opacity-60'}`}>
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start gap-4">
                <div className="text-3xl flex-shrink-0">{gw.logo}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base">{gw.name}</h3>
                    <Badge className={`text-xs ${typeColor[gw.type]}`}>{gw.type}</Badge>
                    <Badge className={`text-xs ${gw.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {gw.status === 'active' ? '● Active' : '○ Inactive'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">{gw.mode.toUpperCase()}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{gw.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-24">Secret Key:</span>
                        <code className="text-xs font-mono bg-muted px-2 py-0.5 rounded flex-1 truncate">
                          {showKeys[gw.id] ? gw.apiKey : gw.apiKey}
                        </code>
                      </div>
                      {gw.publicKey !== '—' && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-24">Public Key:</span>
                          <code className="text-xs font-mono bg-muted px-2 py-0.5 rounded flex-1 truncate">{gw.publicKey}</code>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-24">Webhook:</span>
                        <code className="text-xs font-mono bg-muted px-2 py-0.5 rounded flex-1 truncate">{gw.webhookSecret}</code>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div><span className="text-muted-foreground text-xs">Fee: </span><span className="font-medium">{gw.processingFee}%{gw.fixedFee > 0 ? ` + ฿${gw.fixedFee}` : ''}</span></div>
                      <div><span className="text-muted-foreground text-xs">Currencies: </span><span className="font-medium text-xs">{gw.supportedCurrencies.join(', ')}</span></div>
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-muted-foreground text-xs">Tiers: </span>
                        {gw.tiers.map(t => <Badge key={t} className={`text-xs ${tierColor[t]}`}>{t}</Badge>)}
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">Last Test: </span>
                        <span className="text-xs">{gw.lastTested}</span>
                        {gw.testResult === 'pass'
                          ? <CheckCircle className="h-3.5 w-3.5 text-green-500 inline ml-1" />
                          : <XCircle className="h-3.5 w-3.5 text-red-500 inline ml-1" />}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => { setEditGateway({ ...gw }); setIsEditOpen(true) }}>
                    <Edit className="h-3.5 w-3.5 mr-1" />Edit
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => handleTest(gw.id)}>
                    <Zap className="h-3.5 w-3.5 mr-1" />Test
                  </Button>
                  <Button variant="outline" size="sm" className={`h-8 text-xs ${gw.status === 'active' ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'}`}
                    onClick={() => handleToggle(gw.id)}>
                    {gw.status === 'active' ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editGateway && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Gateway — {editGateway.name}</DialogTitle>
              <DialogDescription>Edit API Keys and fees</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Secret Key</Label>
                <Input className="mt-1 font-mono text-xs" value={editGateway.apiKey}
                  onChange={e => setEditGateway(p => ({ ...p, apiKey: e.target.value }))} />
              </div>
              {editGateway.publicKey !== '—' && (
                <div>
                  <Label>Public Key</Label>
                  <Input className="mt-1 font-mono text-xs" value={editGateway.publicKey}
                    onChange={e => setEditGateway(p => ({ ...p, publicKey: e.target.value }))} />
                </div>
              )}
              <div>
                <Label>Webhook Secret</Label>
                <Input className="mt-1 font-mono text-xs" value={editGateway.webhookSecret}
                  onChange={e => setEditGateway(p => ({ ...p, webhookSecret: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Processing Fee (%)</Label>
                  <Input type="number" step="0.01" className="mt-1" value={editGateway.processingFee}
                    onChange={e => setEditGateway(p => ({ ...p, processingFee: parseFloat(e.target.value) || 0 }))} />
                </div>
                <div>
                  <Label>Fixed Fee (฿)</Label>
                  <Input type="number" className="mt-1" value={editGateway.fixedFee}
                    onChange={e => setEditGateway(p => ({ ...p, fixedFee: parseInt(e.target.value) || 0 }))} />
                </div>
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
