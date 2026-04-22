import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CreditCard, DollarSign, RefreshCw, Shield, Save, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PaymentSettings() {
  const { toast } = useToast()

  const [gateways, setGateways] = useState([
    { id: "stripe", name: "Stripe", logo: "💳", enabled: true, mode: "live", currencies: ["USD","EUR","GBP","THB"], fee: "2.9% + $0.30" },
    { id: "omise", name: "Omise", logo: "🏦", enabled: true, mode: "live", currencies: ["THB","JPY","SGD"], fee: "3.65%" },
    { id: "paypal", name: "PayPal", logo: "🅿️", enabled: true, mode: "live", currencies: ["USD","EUR","GBP"], fee: "3.49% + fixed" },
    { id: "promptpay", name: "PromptPay (QR)", logo: "📱", enabled: true, mode: "live", currencies: ["THB"], fee: "0%" },
    { id: "truemoney", name: "TrueMoney Wallet", logo: "💚", enabled: false, mode: "test", currencies: ["THB"], fee: "1.5%" },
    { id: "alipay", name: "Alipay", logo: "🔵", enabled: true, mode: "live", currencies: ["CNY","USD"], fee: "0.55%" },
    { id: "wechatpay", name: "WeChat Pay", logo: "🟢", enabled: true, mode: "live", currencies: ["CNY"], fee: "0.6%" },
    { id: "cash", name: "Cash on Pickup", logo: "💵", enabled: true, mode: "live", currencies: ["THB","USD"], fee: "0%" },
  ])

  const [refund, setRefund] = useState({
    autoRefundEnabled: true,
    refundProcessingDays: "5",
    partialRefundAllowed: true,
    refundToOriginalMethod: true,
    walletRefundEnabled: true,
    refundReasonRequired: true,
  })

  const [invoice, setInvoice] = useState({
    invoicePrefix: "IBB",
    invoiceStartNumber: "10001",
    taxIncluded: true,
    taxRate: "7",
    showTaxBreakdown: true,
    invoiceLanguage: "both",
    paymentTermsDays: "0",
    lateFeePercent: "0",
    sendInvoiceEmail: true,
    invoiceFooter: "Thank you for choosing IBB Shuttle Service.",
  })

  const [security, setSecurity] = useState({
    require3DS: true,
    fraudDetection: true,
    maxFailedAttempts: "3",
    blockAfterFailures: true,
    cvvRequired: true,
    addressVerification: false,
    pciCompliant: true,
    sslEnabled: true,
  })

  const toggleGateway = (id) => {
    setGateways(gateways.map(g => g.id === id ? {...g, enabled: !g.enabled} : g))
  }

  const handleSave = (section) => {
    toast({ title: "Saved", description: section + " settings updated successfully." })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payment Settings</h1>
          <p className="text-muted-foreground">Payment gateways, refunds, invoicing, and security</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          <Shield className="h-4 w-4" />
          <span>PCI DSS Compliant</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Active Gateways", value: gateways.filter(g => g.enabled).length + " / " + gateways.length, icon: CreditCard, bg: "bg-blue-100", ic: "text-blue-600" },
          { label: "Currencies", value: "12 supported", icon: DollarSign, bg: "bg-green-100", ic: "text-green-600" },
          { label: "Refund Policy", value: "5 business days", icon: RefreshCw, bg: "bg-yellow-100", ic: "text-yellow-600" },
          { label: "Security", value: "3DS + Fraud", icon: Shield, bg: "bg-purple-100", ic: "text-purple-600" },
        ].map(s => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
              <div className={"p-2 rounded-lg " + s.bg}><s.icon className={"h-4 w-4 " + s.ic} /></div>
            </CardHeader>
            <CardContent><div className="text-lg font-bold">{s.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="gateways">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="gateways">Payment Gateways</TabsTrigger>
          <TabsTrigger value="refunds">Refund Policy</TabsTrigger>
          <TabsTrigger value="invoice">Invoicing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="gateways" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" /> Payment Gateways</CardTitle>
              <CardDescription>Enable or disable payment methods for customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gateways.map(g => (
                  <div key={g.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{g.logo}</span>
                      <div>
                        <p className="font-medium">{g.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{g.fee}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{g.currencies.join(", ")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={g.mode === "live" ? "default" : "secondary"} className="text-xs">
                        {g.mode === "live" ? "Live" : "Test"}
                      </Badge>
                      {g.enabled
                        ? <CheckCircle className="h-4 w-4 text-green-500" />
                        : <XCircle className="h-4 w-4 text-muted-foreground" />
                      }
                      <Switch checked={g.enabled} onCheckedChange={() => toggleGateway(g.id)} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={() => handleSave("Payment Gateways")}><Save />Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refunds" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><RefreshCw className="h-5 w-5" /> Refund Policy</CardTitle>
              <CardDescription>Configure how refunds are processed and communicated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Refund Processing Time (business days)</Label>
                  <Input type="number" value={refund.refundProcessingDays} onChange={e => setRefund({...refund, refundProcessingDays: e.target.value})} />
                </div>
              </div>
              <div className="space-y-3 pt-2">
                {[
                  { key: "autoRefundEnabled", label: "Auto Refund on Cancellation", desc: "Automatically process refund when booking is cancelled" },
                  { key: "partialRefundAllowed", label: "Allow Partial Refunds", desc: "Enable partial refund based on cancellation policy" },
                  { key: "refundToOriginalMethod", label: "Refund to Original Payment Method", desc: "Return funds to the original payment method used" },
                  { key: "walletRefundEnabled", label: "Refund to IBB Wallet", desc: "Allow refund to customer's IBB Wallet (instant)" },
                  { key: "refundReasonRequired", label: "Require Refund Reason", desc: "Admin must provide reason when processing manual refunds" },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch checked={refund[item.key]} onCheckedChange={v => setRefund({...refund, [item.key]: v})} />
                  </div>
                ))}
              </div>
              <div className="flex justify-end"><Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={() => handleSave("Refund Policy")}><Save />Save Changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoice" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5" /> Invoicing</CardTitle>
              <CardDescription>Invoice numbering, tax, and document settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Invoice Prefix</Label>
                  <Input value={invoice.invoicePrefix} onChange={e => setInvoice({...invoice, invoicePrefix: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Starting Invoice Number</Label>
                  <Input type="number" value={invoice.invoiceStartNumber} onChange={e => setInvoice({...invoice, invoiceStartNumber: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Tax Rate (%)</Label>
                  <Input type="number" value={invoice.taxRate} onChange={e => setInvoice({...invoice, taxRate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Invoice Language</Label>
                  <Select value={invoice.invoiceLanguage} onValueChange={v => setInvoice({...invoice, invoiceLanguage: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English only</SelectItem>
                      <SelectItem value="th">Thai only</SelectItem>
                      <SelectItem value="both">Both (EN + TH)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Payment Terms (days)</Label>
                  <Input type="number" value={invoice.paymentTermsDays} onChange={e => setInvoice({...invoice, paymentTermsDays: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Late Fee (%)</Label>
                  <Input type="number" value={invoice.lateFeePercent} onChange={e => setInvoice({...invoice, lateFeePercent: e.target.value})} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Invoice Footer Text</Label>
                  <Input value={invoice.invoiceFooter} onChange={e => setInvoice({...invoice, invoiceFooter: e.target.value})} />
                </div>
              </div>
              <div className="space-y-3 pt-2">
                {[
                  { key: "taxIncluded", label: "Tax Included in Price", desc: "Display prices as tax-inclusive" },
                  { key: "showTaxBreakdown", label: "Show Tax Breakdown", desc: "Show separate tax line on invoices" },
                  { key: "sendInvoiceEmail", label: "Auto-send Invoice Email", desc: "Email invoice to customer after payment" },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch checked={invoice[item.key]} onCheckedChange={v => setInvoice({...invoice, [item.key]: v})} />
                  </div>
                ))}
              </div>
              <div className="flex justify-end"><Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={() => handleSave("Invoicing")}><Save />Save Changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Payment Security</CardTitle>
              <CardDescription>Fraud prevention and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Max Failed Payment Attempts</Label>
                  <Input type="number" value={security.maxFailedAttempts} onChange={e => setSecurity({...security, maxFailedAttempts: e.target.value})} />
                </div>
              </div>
              <div className="space-y-3 pt-2">
                {[
                  { key: "require3DS", label: "Require 3D Secure (3DS)", desc: "Enforce 3DS authentication for card payments" },
                  { key: "fraudDetection", label: "Fraud Detection", desc: "AI-powered fraud scoring on all transactions" },
                  { key: "blockAfterFailures", label: "Block Card After Max Failures", desc: "Temporarily block card after too many failed attempts" },
                  { key: "cvvRequired", label: "Require CVV", desc: "Always require CVV for card payments" },
                  { key: "addressVerification", label: "Address Verification (AVS)", desc: "Verify billing address matches card records" },
                  { key: "pciCompliant", label: "PCI DSS Compliance Mode", desc: "Enforce PCI DSS standards for card data handling" },
                  { key: "sslEnabled", label: "SSL/TLS Enforced", desc: "All payment pages served over HTTPS" },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch checked={security[item.key]} onCheckedChange={v => setSecurity({...security, [item.key]: v})} />
                  </div>
                ))}
              </div>
              <div className="flex justify-end"><Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={() => handleSave("Security")}><Save />Save Changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
