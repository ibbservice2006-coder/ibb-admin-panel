import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Building2, MapPin, Phone, FileText, Globe, Save, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function BusinessSettings() {
  const { toast } = useToast()
  const [company, setCompany] = useState({
    companyName: "IBB Shuttle Service Co., Ltd.",
    companyNameTh: "IBB Shuttle Service Co., Ltd.",
    taxId: "0105565012345",
    registrationNo: "0105565012345",
    vatRegistered: true,
    vatRate: "7",
    website: "https://ibbshuttle.com",
    email: "info@ibbshuttle.com",
    phone: "+66 2 123 4567",
    phoneAlt: "+66 81 234 5678",
    lineId: "@ibbshuttle",
    whatsapp: "+66 81 234 5678",
  })
  const [address, setAddress] = useState({
    addressLine1: "123 Sukhumvit Road",
    addressLine2: "Khlong Toei",
    district: "Khlong Toei",
    province: "Bangkok",
    postalCode: "10110",
    country: "Thailand",
    mapUrl: "https://maps.google.com/?q=IBB+Shuttle",
    serviceAreas: "Bangkok, Pattaya, Hua Hin, Phuket, Chiang Mai, Koh Samui",
  })
  const [legal, setLegal] = useState({
    businessLicense: "BKK-2024-12345",
    tourLicense: "11/05678",
    insurancePolicy: "INS-2024-99887",
    insuranceExpiry: "2025-12-31",
    termsVersion: "v3.2",
    privacyVersion: "v2.1",
    gdprCompliant: true,
    pdpaCompliant: true,
  })
  const [branding, setBranding] = useState({
    primaryColor: "#1a56db",
    secondaryColor: "#7e3af2",
    tagline: "Your Trusted Shuttle Partner in Thailand",
    taglineTh: "Trusted shuttle partners in Thailand",
    socialFacebook: "https://facebook.com/ibbshuttle",
    socialInstagram: "https://instagram.com/ibbshuttle",
    socialLine: "https://line.me/ti/p/@ibbshuttle",
  })
  const handleSave = (section) => {
    toast({ title: "Saved", description: section + " settings updated successfully." })
  }
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Business Settings</h1>
          <p className="text-muted-foreground">Company information, legal details, and branding</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span>VAT Registered</span>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Company Name", value: "IBB Shuttle Service", icon: Building2, bg: "bg-blue-100", ic: "text-blue-600" },
          { label: "Tax ID", value: "0105565012345", icon: FileText, bg: "bg-green-100", ic: "text-green-600" },
          { label: "Service Areas", value: "6 Regions", icon: MapPin, bg: "bg-purple-100", ic: "text-purple-600" },
          { label: "Contact", value: "+66 2 123 4567", icon: Phone, bg: "bg-orange-100", ic: "text-orange-600" },
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
      <Tabs defaultValue="company">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company">Company Info</TabsTrigger>
          <TabsTrigger value="address">Address & Areas</TabsTrigger>
          <TabsTrigger value="legal">Legal & Compliance</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>
        <TabsContent value="company" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> Company Information</CardTitle>
              <CardDescription>Official company details for invoices and legal documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Company Name (English)</Label><Input value={company.companyName} onChange={e => setCompany({...company, companyName: e.target.value})} /></div>
                <div className="space-y-2"><Label>Company Name (Thai)</Label><Input value={company.companyNameTh} onChange={e => setCompany({...company, companyNameTh: e.target.value})} /></div>
                <div className="space-y-2"><Label>Tax ID</Label><Input value={company.taxId} onChange={e => setCompany({...company, taxId: e.target.value})} /></div>
                <div className="space-y-2"><Label>Registration Number</Label><Input value={company.registrationNo} onChange={e => setCompany({...company, registrationNo: e.target.value})} /></div>
                <div className="space-y-2"><Label>Phone</Label><Input value={company.phone} onChange={e => setCompany({...company, phone: e.target.value})} /></div>
                <div className="space-y-2"><Label>Phone (Alternative)</Label><Input value={company.phoneAlt} onChange={e => setCompany({...company, phoneAlt: e.target.value})} /></div>
                <div className="space-y-2"><Label>LINE ID</Label><Input value={company.lineId} onChange={e => setCompany({...company, lineId: e.target.value})} /></div>
                <div className="space-y-2"><Label>WhatsApp</Label><Input value={company.whatsapp} onChange={e => setCompany({...company, whatsapp: e.target.value})} /></div>
              </div>
              <div className="flex items-center justify-between py-2 border-t">
                <div><p className="text-sm font-medium">VAT Registered</p><p className="text-xs text-muted-foreground">Enable VAT on invoices (7%)</p></div>
                <div className="flex items-center gap-3">
                  <Switch checked={company.vatRegistered} onCheckedChange={v => setCompany({...company, vatRegistered: v})} />
                  {company.vatRegistered && <div className="flex items-center gap-2"><Label className="text-xs">Rate %</Label><Input className="w-20" value={company.vatRate} onChange={e => setCompany({...company, vatRate: e.target.value})} /></div>}
                </div>
              </div>
              <div className="flex justify-end"><Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={() => handleSave("Company")}><Save />Save Changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="address" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Address & Service Areas</CardTitle>
              <CardDescription>Company address and regions where service is available</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2"><Label>Address Line 1</Label><Input value={address.addressLine1} onChange={e => setAddress({...address, addressLine1: e.target.value})} /></div>
                <div className="space-y-2 col-span-2"><Label>Address Line 2</Label><Input value={address.addressLine2} onChange={e => setAddress({...address, addressLine2: e.target.value})} /></div>
                <div className="space-y-2"><Label>District</Label><Input value={address.district} onChange={e => setAddress({...address, district: e.target.value})} /></div>
                <div className="space-y-2"><Label>Province</Label>
                  <Select value={address.province} onValueChange={v => setAddress({...address, province: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Bangkok","Chiang Mai","Phuket","Chonburi","Surat Thani","Prachuap Khiri Khan"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Postal Code</Label><Input value={address.postalCode} onChange={e => setAddress({...address, postalCode: e.target.value})} /></div>
                <div className="space-y-2"><Label>Country</Label><Input value={address.country} disabled /></div>
                <div className="space-y-2 col-span-2"><Label>Google Maps URL</Label><Input value={address.mapUrl} onChange={e => setAddress({...address, mapUrl: e.target.value})} /></div>
                <div className="space-y-2 col-span-2"><Label>Service Areas (comma separated)</Label><Input value={address.serviceAreas} onChange={e => setAddress({...address, serviceAreas: e.target.value})} /></div>
              </div>
              <div className="flex justify-end"><Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={() => handleSave("Address")}><Save />Save Changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="legal" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Legal & Compliance</CardTitle>
              <CardDescription>Licenses, insurance, and regulatory compliance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Business License No.</Label><Input value={legal.businessLicense} onChange={e => setLegal({...legal, businessLicense: e.target.value})} /></div>
                <div className="space-y-2"><Label>Tour Operator License No.</Label><Input value={legal.tourLicense} onChange={e => setLegal({...legal, tourLicense: e.target.value})} /></div>
                <div className="space-y-2"><Label>Insurance Policy No.</Label><Input value={legal.insurancePolicy} onChange={e => setLegal({...legal, insurancePolicy: e.target.value})} /></div>
                <div className="space-y-2"><Label>Insurance Expiry Date</Label><Input type="date" value={legal.insuranceExpiry} onChange={e => setLegal({...legal, insuranceExpiry: e.target.value})} /></div>
                <div className="space-y-2"><Label>Terms of Service Version</Label><Input value={legal.termsVersion} onChange={e => setLegal({...legal, termsVersion: e.target.value})} /></div>
                <div className="space-y-2"><Label>Privacy Policy Version</Label><Input value={legal.privacyVersion} onChange={e => setLegal({...legal, privacyVersion: e.target.value})} /></div>
              </div>
              <div className="space-y-3 pt-2">
                {[
                  { key: "gdprCompliant", label: "GDPR Compliant", desc: "EU General Data Protection Regulation" },
                  { key: "pdpaCompliant", label: "PDPA Compliant", desc: "Thailand Personal Data Protection Act" },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch checked={legal[item.key]} onCheckedChange={v => setLegal({...legal, [item.key]: v})} />
                  </div>
                ))}
              </div>
              <div className="flex justify-end"><Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={() => handleSave("Legal")}><Save />Save Changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="branding" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> Branding & Social Media</CardTitle>
              <CardDescription>Brand colors, taglines, and social media links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Primary Color</Label>
                  <div className="flex gap-2"><input type="color" value={branding.primaryColor} onChange={e => setBranding({...branding, primaryColor: e.target.value})} className="h-10 w-16 rounded border cursor-pointer" /><Input value={branding.primaryColor} onChange={e => setBranding({...branding, primaryColor: e.target.value})} /></div>
                </div>
                <div className="space-y-2"><Label>Secondary Color</Label>
                  <div className="flex gap-2"><input type="color" value={branding.secondaryColor} onChange={e => setBranding({...branding, secondaryColor: e.target.value})} className="h-10 w-16 rounded border cursor-pointer" /><Input value={branding.secondaryColor} onChange={e => setBranding({...branding, secondaryColor: e.target.value})} /></div>
                </div>
                <div className="space-y-2 col-span-2"><Label>Tagline (English)</Label><Input value={branding.tagline} onChange={e => setBranding({...branding, tagline: e.target.value})} /></div>
                <div className="space-y-2 col-span-2"><Label>Tagline (Thai)</Label><Input value={branding.taglineTh} onChange={e => setBranding({...branding, taglineTh: e.target.value})} /></div>
                <div className="space-y-2"><Label>Facebook URL</Label><Input value={branding.socialFacebook} onChange={e => setBranding({...branding, socialFacebook: e.target.value})} /></div>
                <div className="space-y-2"><Label>Instagram URL</Label><Input value={branding.socialInstagram} onChange={e => setBranding({...branding, socialInstagram: e.target.value})} /></div>
                <div className="space-y-2"><Label>LINE Official URL</Label><Input value={branding.socialLine} onChange={e => setBranding({...branding, socialLine: e.target.value})} /></div>
              </div>
              <div className="flex justify-end"><Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white"  onClick={() => handleSave("Branding")}><Save />Save Changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
