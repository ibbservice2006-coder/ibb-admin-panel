import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageCircle, Search, Users, Clock, CheckCircle, Send, Circle } from 'lucide-react'

const chatsData = [
  { id: 'CHT-001', customer: 'Wang Wei', avatar: 'WW', avatarColor: 'bg-blue-500', status: 'active', channel: 'LINE', lastMsg: 'How long until my driver arrives?', time: '2 min ago', unread: 2, agent: 'Somchai K.', topic: 'Booking inquiry', lang: 'ZH', messages: [
    { from: 'customer', text: 'Hello, I have a booking for today at 14:00 from Suvarnabhumi to Pattaya.', time: '14:05' },
    { from: 'agent', text: 'Hello Wang Wei! Yes, I can see your booking IBB-2026-4521. Your driver Somkid will arrive at Gate 4 by 14:00.', time: '14:06' },
    { from: 'customer', text: 'How long until my driver arrives?', time: '14:08' },
  ]},
  { id: 'CHT-002', customer: 'Sarah Johnson', avatar: 'SJ', avatarColor: 'bg-green-500', status: 'active', channel: 'Website', lastMsg: 'Can I add an extra stop?', time: '5 min ago', unread: 1, agent: 'Nattaya P.', topic: 'Route change', lang: 'EN', messages: [
    { from: 'customer', text: 'Hi, I need to add an extra stop to my booking.', time: '13:55' },
    { from: 'agent', text: 'Of course! Which booking and where would you like to add the stop?', time: '13:56' },
    { from: 'customer', text: 'Can I add an extra stop at Central Pattaya before the final destination?', time: '14:03' },
  ]},
  { id: 'CHT-003', customer: 'Tanaka Hiroshi', avatar: 'TH', avatarColor: 'bg-purple-500', status: 'waiting', channel: 'LINE', lastMsg: 'Waiting for agent...', time: '8 min ago', unread: 0, agent: 'Unassigned', topic: 'Payment issue', lang: 'JA', messages: [
    { from: 'customer', text: 'My payment was deducted but I did not receive booking confirmation.', time: '14:00' },
  ]},
  { id: 'CHT-004', customer: 'Park Jiyeon', avatar: 'PJ', avatarColor: 'bg-orange-500', status: 'active', channel: 'App', lastMsg: 'Thank you so much!', time: '12 min ago', unread: 0, agent: 'Somchai K.', topic: 'General inquiry', lang: 'KO', messages: [
    { from: 'customer', text: 'Is there a shuttle from Don Mueang to Hua Hin tomorrow morning?', time: '13:45' },
    { from: 'agent', text: 'Yes! We have departures at 07:00, 09:00, and 11:00. Would you like to book?', time: '13:46' },
    { from: 'customer', text: 'The 09:00 one please. How do I book?', time: '13:48' },
    { from: 'agent', text: 'You can book directly on our website or I can help you here. How many passengers?', time: '13:49' },
    { from: 'customer', text: 'Thank you so much!', time: '13:52' },
  ]},
  { id: 'CHT-005', customer: 'Li Mingzhu', avatar: 'LM', avatarColor: 'bg-red-500', status: 'resolved', channel: 'WeChat', lastMsg: 'Issue resolved', time: '25 min ago', unread: 0, agent: 'Nattaya P.', topic: 'Refund request', lang: 'ZH', messages: [
    { from: 'customer', text: 'I need to cancel my booking and get a refund.', time: '13:20' },
    { from: 'agent', text: 'Your cancellation is processed. Refund of ฿2,800 within 3-5 business days.', time: '13:25' },
    { from: 'customer', text: 'Thank you!', time: '13:26' },
  ]},
  { id: 'CHT-006', customer: 'Michael Brown', avatar: 'MB', avatarColor: 'bg-teal-500', status: 'waiting', channel: 'Website', lastMsg: 'Waiting for agent...', time: '3 min ago', unread: 0, agent: 'Unassigned', topic: 'Lost item', lang: 'EN', messages: [
    { from: 'customer', text: 'I left my laptop bag in the shuttle. Vehicle plate IBB-VAN-007. Please help!', time: '14:10' },
  ]},
]

const statusColors = { active: 'bg-green-500', waiting: 'bg-yellow-500', resolved: 'bg-gray-400' }
const statusBadge = { active: 'bg-green-100 text-green-800', waiting: 'bg-yellow-100 text-yellow-800', resolved: 'bg-gray-100 text-gray-800' }
const channelColors = { LINE: 'bg-green-100 text-green-800', Website: 'bg-blue-100 text-blue-800', App: 'bg-purple-100 text-purple-800', WeChat: 'bg-emerald-100 text-emerald-800' }

export default function LiveChat() {
  const [chats, setChats] = useState(chatsData)
  const [selectedChat, setSelectedChat] = useState(chatsData[0])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [newMsg, setNewMsg] = useState('')

  const filtered = chats.filter(c => {
    const matchSearch = c.customer.toLowerCase().includes(search.toLowerCase()) || c.topic.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = [
    { title: 'Active Chats', value: chats.filter(c => c.status === 'active').length, icon: MessageCircle, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
    { title: 'Waiting', value: chats.filter(c => c.status === 'waiting').length, icon: Clock, bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { title: 'Agents Online', value: 2, icon: Users, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    { title: 'Resolved Today', value: chats.filter(c => c.status === 'resolved').length, icon: CheckCircle, bgColor: 'bg-gray-100', iconColor: 'text-gray-600' },
  ]

  const handleSend = () => {
    if (!newMsg.trim()) return
    const updatedChats = chats.map(c => c.id === selectedChat.id ? {
      ...c,
      messages: [...c.messages, { from: 'agent', text: newMsg, time: new Date().toTimeString().slice(0,5) }],
      lastMsg: newMsg,
      time: 'just now',
      status: 'active'
    } : c)
    setChats(updatedChats)
    setSelectedChat(updatedChats.find(c => c.id === selectedChat.id))
    setNewMsg('')
  }

  const handleResolve = () => {
    const updatedChats = chats.map(c => c.id === selectedChat.id ? { ...c, status: 'resolved' } : c)
    setChats(updatedChats)
    setSelectedChat(updatedChats.find(c => c.id === selectedChat.id))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live Chat</h1>
          <p className="text-muted-foreground">Manage Real-time Chat from All Channels — LINE, Website, App, WeChat</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}><stat.icon className={`h-4 w-4 ${stat.iconColor}`} /></div>
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{stat.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
        {/* Chat List */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="pb-3 flex-shrink-0">
            <CardTitle className="text-base">Conversations</CardTitle>
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 h-8 text-sm" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="All Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            {filtered.map(chat => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`flex items-start gap-3 p-3 cursor-pointer border-b hover:bg-muted/50 transition-colors ${selectedChat?.id === chat.id ? 'bg-muted' : ''}`}
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className={`${chat.avatarColor} text-white text-xs font-bold`}>{chat.avatar}</AvatarFallback>
                  </Avatar>
                  <Circle className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-current ${statusColors[chat.status]} text-white rounded-full`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{chat.customer}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-1">{chat.time}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Badge className={`text-xs px-1 py-0 ${channelColors[chat.channel]}`} variant="outline">{chat.channel}</Badge>
                    <Badge className={`text-xs px-1 py-0 ${statusBadge[chat.status]}`} variant="outline">{chat.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{chat.lastMsg}</p>
                </div>
                {chat.unread > 0 && (
                  <span className="flex-shrink-0 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{chat.unread}</span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2 flex flex-col overflow-hidden">
          {selectedChat ? (
            <>
              <CardHeader className="pb-3 flex-shrink-0 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className={`${selectedChat.avatarColor} text-white text-sm font-bold`}>{selectedChat.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{selectedChat.customer}</span>
                        <Badge className={`text-xs ${channelColors[selectedChat.channel]}`} variant="outline">{selectedChat.channel}</Badge>
                        <Badge variant="secondary" className="text-xs">{selectedChat.lang}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Topic: {selectedChat.topic} · Agent: {selectedChat.agent}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {selectedChat.status !== 'resolved' && (
                      <Button variant="outline" size="sm" onClick={handleResolve} className="text-green-600 border-green-200">
                        <CheckCircle className="h-4 w-4 mr-1" />Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedChat.messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.from === 'agent' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${msg.from === 'agent' ? 'bg-blue-600 text-white' : 'bg-muted text-foreground'}`}>
                      <p>{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.from === 'agent' ? 'text-blue-200' : 'text-muted-foreground'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
                {selectedChat.status === 'waiting' && (
                  <div className="text-center text-xs text-muted-foreground py-2">
                    <Clock className="h-4 w-4 inline mr-1" />Customer is waiting for a response...
                  </div>
                )}
              </CardContent>

              {/* Input */}
              {selectedChat.status !== 'resolved' ? (
                <div className="p-4 border-t flex-shrink-0">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMsg}
                      onChange={e => setNewMsg(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSend()}
                      className="flex-1"
                    />
                    <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSend} disabled={!newMsg.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 border-t flex-shrink-0 text-center text-sm text-muted-foreground bg-muted/30">
                  <CheckCircle className="h-4 w-4 inline mr-1 text-green-500" />This conversation has been resolved
                </div>
              )}
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Select a conversation to start chatting</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
