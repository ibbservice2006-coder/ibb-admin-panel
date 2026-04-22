import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, Search, ThumbsUp, ThumbsDown, MessageSquare, TrendingUp, Download, Eye } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { useToast } from "@/hooks/use-toast"

const feedbackData = [
  { id: "FB-2026-0098", customer: "Wang Wei", avatar: "WW", avatarColor: "bg-blue-500", nationality: "CN", rating: 5, category: "Driver", route: "Suvarnabhumi → Pattaya", bookingRef: "IBB-2026-4510", date: "2026-03-24", channel: "App", comment: "Excellent service! Driver was very professional and on time. The van was clean and comfortable. Will definitely book again.", tags: ["punctual", "clean", "professional"], status: "published", helpful: 12, nps: 10 },
  { id: "FB-2026-0097", customer: "Sarah Johnson", avatar: "SJ", avatarColor: "bg-green-500", nationality: "US", rating: 4, category: "Overall", route: "Don Mueang → Hua Hin", bookingRef: "IBB-2026-4505", date: "2026-03-24", channel: "Email", comment: "Good service overall. The driver was friendly and the ride was comfortable. Only minor issue was the pickup was 10 minutes late.", tags: ["friendly", "comfortable"], status: "published", helpful: 8, nps: 8 },
  { id: "FB-2026-0096", customer: "Tanaka Hiroshi", avatar: "TH", avatarColor: "bg-purple-500", nationality: "JP", rating: 2, category: "Vehicle", route: "Suvarnabhumi → Bangkok City", bookingRef: "IBB-2026-4498", date: "2026-03-23", channel: "App", comment: "The air conditioning was not working properly. It was very hot inside the van for the entire 2-hour journey. Very uncomfortable.", tags: ["hot", "ac-issue"], status: "pending", helpful: 3, nps: 4 },
  { id: "FB-2026-0094", customer: "Michael Brown", avatar: "MB", avatarColor: "bg-red-500", nationality: "GB", rating: 1, category: "Driver", route: "Suvarnabhumi → Hua Hin", bookingRef: "IBB-2026-4485", date: "2026-03-22", channel: "Website", comment: "Terrible experience. Driver was rude and drove dangerously. I felt unsafe the entire trip. Will never use this service again.", tags: ["rude", "unsafe", "dangerous"], status: "flagged", helpful: 2, nps: 0 },
  { id: "FB-2026-0093", customer: "Li Mingzhu", avatar: "LM", avatarColor: "bg-teal-500", nationality: "CN", rating: 4, category: "Overall", route: "Suvarnabhumi → Pattaya", bookingRef: "IBB-2026-4480", date: "2026-03-22", channel: "WeChat", comment: "Good service. The driver spoke some Mandarin which was very helpful. The vehicle was clean. Would recommend to friends.", tags: ["multilingual", "clean", "recommend"], status: "published", helpful: 9, nps: 8 },
  { id: "FB-2026-0092", customer: "Nattaya Wongprasert", avatar: "NW", avatarColor: "bg-pink-500", nationality: "TH", rating: 5, category: "Driver", route: "Don Mueang → Hua Hin", bookingRef: "IBB-2026-4475", date: "2026-03-21", channel: "App", comment: "Drivers are very polite, vehicles clean and punctual, reasonable prices. Will use again.", tags: ["polite", "clean", "punctual"], status: "published", helpful: 7, nps: 9 },
  { id: "FB-2026-0091", customer: "Chen Xiaoming", avatar: "CX", avatarColor: "bg-indigo-500", nationality: "CN", rating: 3, category: "Vehicle", route: "Suvarnabhumi → Bangkok City", bookingRef: "IBB-2026-4470", date: "2026-03-21", channel: "App", comment: "The service was okay but the van was a bit old and the seats were not very comfortable for a long journey.", tags: ["old-vehicle", "uncomfortable"], status: "published", helpful: 4, nps: 6 },
]

const ratingDistribution = [
  { stars: "5 Stars", count: 3, color: "#22c55e" },
  { stars: "4 Stars", count: 2, color: "#84cc16" },
  { stars: "3 Stars", count: 1, color: "#eab308" },
  { stars: "2 Stars", count: 1, color: "#f97316" },
  { stars: "1 Star", count: 1, color: "#ef4444" },
]

const npsData = [
  { month: "Oct", nps: 62 }, { month: "Nov", nps: 65 }, { month: "Dec", nps: 68 },
  { month: "Jan", nps: 71 }, { month: "Feb", nps: 69 }, { month: "Mar", nps: 74 },
]

const categoryData = [
  { name: "Driver", value: 35, color: "#3b82f6" },
  { name: "Vehicle", value: 25, color: "#8b5cf6" },
  { name: "Overall", value: 25, color: "#22c55e" },
  { name: "Booking", value: 15, color: "#f59e0b" },
]

const statusColors = { published: "bg-green-100 text-green-800", pending: "bg-yellow-100 text-yellow-800", flagged: "bg-red-100 text-red-800" }

function StarRating({ rating, size = "sm" }) {
  const sz = size === "sm" ? "h-3 w-3" : "h-4 w-4"
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={sz + " " + (i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} />
      ))}
    </div>
  )
}

export default function CustomerFeedback() {
  const [feedbacks, setFeedbacks] = useState(feedbackData)
  const [search, setSearch] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const { toast } = useToast()

  const filtered = feedbacks.filter(f => {
    const matchSearch = f.customer.toLowerCase().includes(search.toLowerCase()) ||
      f.comment.toLowerCase().includes(search.toLowerCase()) ||
      f.bookingRef.toLowerCase().includes(search.toLowerCase())
    const matchRating = ratingFilter === "all" || f.rating === parseInt(ratingFilter)
    const matchCat = categoryFilter === "all" || f.category === categoryFilter
    const matchStatus = statusFilter === "all" || f.status === statusFilter
    return matchSearch && matchRating && matchCat && matchStatus
  })

  const avgRating = (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
  const npsScore = Math.round((feedbacks.filter(f => f.nps >= 9).length - feedbacks.filter(f => f.nps <= 6).length) / feedbacks.length * 100)

  const stats = [
    { title: "Average Rating", value: avgRating + " / 5.0", icon: Star, bgColor: "bg-yellow-100", iconColor: "text-yellow-600", sub: feedbacks.length + " reviews" },
    { title: "NPS Score", value: npsScore, icon: TrendingUp, bgColor: "bg-blue-100", iconColor: "text-blue-600", sub: "Net Promoter Score" },
    { title: "Positive Reviews", value: feedbacks.filter(f => f.rating >= 4).length, icon: ThumbsUp, bgColor: "bg-green-100", iconColor: "text-green-600", sub: Math.round(feedbacks.filter(f => f.rating >= 4).length / feedbacks.length * 100) + "% of total" },
    { title: "Flagged Reviews", value: feedbacks.filter(f => f.status === "flagged").length, icon: ThumbsDown, bgColor: "bg-red-100", iconColor: "text-red-600", sub: "Needs attention" },
  ]

  const handlePublish = (id) => {
    setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, status: "published" } : f))
    toast({ title: "Review Published", description: "The review is now visible to the public." })
  }

  const handleFlag = (id) => {
    setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, status: "flagged" } : f))
    toast({ title: "Review Flagged", description: "Review has been flagged for review.", variant: "destructive" })
  }

  const handleExport = () => {
    const csv = [
      ["ID","Customer","Nationality","Rating","Category","Route","Date","Channel","Status","NPS","Comment"],
      ...filtered.map(f => [f.id, f.customer, f.nationality, f.rating, f.category, f.route, f.date, f.channel, f.status, f.nps, JSON.stringify(f.comment)])
    ].map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = "customer_feedback.csv"; a.click()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Feedback</h1>
          <p className="text-muted-foreground">Rating, Review & NPS Score from All Customer Channels</p>
        </div>
        <Button size="sm" variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Export CSV</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={"p-2 rounded-lg " + stat.bgColor}><stat.icon className={"h-4 w-4 " + stat.iconColor} /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-sm">Rating Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={ratingDistribution} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="stars" width={55} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" radius={4}>
                  {ratingDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">NPS Trend (6 Months)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={npsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[50, 90]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="nps" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Feedback by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" label={({ name, value }) => name + " " + value + "%"} labelLine={false} fontSize={10}>
                  {categoryData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
          <CardDescription>Click View for Details — Publish or Flag Review Instantly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search reviews..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[130px]"><SelectValue placeholder="Rating" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[130px]"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Driver">Driver</SelectItem>
                <SelectItem value="Vehicle">Vehicle</SelectItem>
                <SelectItem value="Overall">Overall</SelectItem>
                <SelectItem value="Booking">Booking</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>NPS</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={10} className="text-center py-8 text-muted-foreground">No feedback found</TableCell></TableRow>
                ) : filtered.map((fb, idx) => (
                  <TableRow key={fb.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className={fb.avatarColor + " text-white text-xs font-bold"}>{fb.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{fb.customer}</div>
                          <div className="text-xs text-muted-foreground">{fb.nationality} · {fb.bookingRef}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><StarRating rating={fb.rating} /></TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{fb.category}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate">{fb.route}</TableCell>
                    <TableCell className="max-w-[200px]">
                      <p className="text-xs truncate">{fb.comment}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {fb.tags.slice(0,2).map(tag => (
                          <span key={tag} className="text-xs bg-muted px-1.5 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{fb.date}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{fb.channel}</Badge></TableCell>
                    <TableCell>
                      <span className={"text-sm font-bold " + (fb.nps >= 9 ? "text-green-600" : fb.nps >= 7 ? "text-yellow-600" : "text-red-600")}>{fb.nps}</span>
                    </TableCell>
                    <TableCell><Badge className={"text-xs " + statusColors[fb.status]} variant="outline">{fb.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedFeedback(fb); setIsViewOpen(true) }}>
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                        {fb.status === "pending" && (
                          <Button variant="ghost" size="icon" onClick={() => handlePublish(fb.id)}>
                            <ThumbsUp className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                        {fb.status !== "flagged" && (
                          <Button variant="ghost" size="icon" onClick={() => handleFlag(fb.id)}>
                            <ThumbsDown className="h-4 w-4 text-red-600" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-sm text-muted-foreground mt-3">Showing {filtered.length} of {feedbacks.length} reviews</p>
        </CardContent>
      </Card>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Detail</DialogTitle>
            <DialogDescription>{selectedFeedback?.id} · {selectedFeedback?.date}</DialogDescription>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={selectedFeedback.avatarColor + " text-white font-bold"}>{selectedFeedback.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedFeedback.customer}</p>
                  <p className="text-sm text-muted-foreground">{selectedFeedback.nationality} · via {selectedFeedback.channel}</p>
                </div>
                <div className="ml-auto text-right">
                  <StarRating rating={selectedFeedback.rating} size="md" />
                  <p className="text-xs text-muted-foreground mt-1">NPS: <span className={"font-bold " + (selectedFeedback.nps >= 9 ? "text-green-600" : selectedFeedback.nps >= 7 ? "text-yellow-600" : "text-red-600")}>{selectedFeedback.nps}/10</span></p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-muted-foreground">Booking</p><p className="font-medium">{selectedFeedback.bookingRef}</p></div>
                <div><p className="text-xs text-muted-foreground">Category</p><p className="font-medium">{selectedFeedback.category}</p></div>
                <div className="col-span-2"><p className="text-xs text-muted-foreground">Route</p><p className="font-medium">{selectedFeedback.route}</p></div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Review</p>
                <p className="text-sm bg-muted p-3 rounded-md leading-relaxed">{selectedFeedback.comment}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {selectedFeedback.tags.map(tag => (
                    <span key={tag} className="text-xs bg-muted px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Helpful: {selectedFeedback.helpful} people</span>
                <Badge className={"text-xs " + statusColors[selectedFeedback.status]} variant="outline">{selectedFeedback.status}</Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
            {selectedFeedback?.status === "pending" && (
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => { handlePublish(selectedFeedback.id); setIsViewOpen(false) }}>Publish</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
