import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ComposedChart, Treemap,
  XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { BarChart2, TrendingUp, PieChart as PieIcon, Activity } from 'lucide-react'

const revenueVsBookings = [
  { month: 'Oct', revenue: 1820000, bookings: 522, avgValue: 3487 },
  { month: 'Nov', revenue: 2150000, bookings: 588, avgValue: 3656 },
  { month: 'Dec', revenue: 3240000, bookings: 725, avgValue: 4469 },
  { month: 'Jan', revenue: 2480000, bookings: 643, avgValue: 3858 },
  { month: 'Feb', revenue: 2760000, bookings: 690, avgValue: 4000 },
  { month: 'Mar', revenue: 3120000, bookings: 766, avgValue: 4073 },
]

const heatmapData = [
  { day: 'Mon', h6: 12, h9: 42, h12: 28, h15: 35, h18: 58, h21: 22 },
  { day: 'Tue', h6: 15, h9: 45, h12: 30, h15: 38, h18: 62, h21: 25 },
  { day: 'Wed', h6: 18, h9: 48, h12: 32, h15: 40, h18: 65, h21: 28 },
  { day: 'Thu', h6: 14, h9: 44, h12: 29, h15: 37, h18: 60, h21: 24 },
  { day: 'Fri', h6: 20, h9: 52, h12: 35, h15: 45, h18: 72, h21: 32 },
  { day: 'Sat', h6: 25, h9: 68, h12: 55, h15: 62, h18: 80, h21: 45 },
  { day: 'Sun', h6: 22, h9: 60, h12: 48, h15: 55, h18: 74, h21: 38 },
]

const scatterData = [
  { trips: 45, rating: 4.2, earnings: 8500, driver: 'A' },
  { trips: 52, rating: 4.7, earnings: 9800, driver: 'B' },
  { trips: 38, rating: 3.9, earnings: 7200, driver: 'C' },
  { trips: 68, rating: 4.9, earnings: 13500, driver: 'D' },
  { trips: 48, rating: 4.5, earnings: 9100, driver: 'E' },
  { trips: 72, rating: 4.8, earnings: 14200, driver: 'F' },
  { trips: 35, rating: 3.8, earnings: 6800, driver: 'G' },
  { trips: 58, rating: 4.6, earnings: 11200, driver: 'H' },
  { trips: 42, rating: 4.1, earnings: 8000, driver: 'I' },
  { trips: 65, rating: 4.7, earnings: 12800, driver: 'J' },
]

const treemapData = [
  { name: 'BKK→Pattaya', size: 2840000, fill: '#6366f1' },
  { name: 'BKK→Hua Hin', size: 2210000, fill: '#8b5cf6' },
  { name: 'BKK→Kanchanaburi', size: 1680000, fill: '#3b82f6' },
  { name: 'BKK→Ayutthaya', size: 1450000, fill: '#06b6d4' },
  { name: 'Pattaya→Airport', size: 1320000, fill: '#10b981' },
  { name: 'BKK→Chiang Mai', size: 980000, fill: '#f59e0b' },
  { name: 'Hua Hin→Airport', size: 760000, fill: '#f97316' },
  { name: 'Others', size: 1210000, fill: '#94a3b8' },
]

const radarComparison = [
  { metric: 'Revenue', oct: 56, mar: 96 },
  { metric: 'Bookings', oct: 68, mar: 100 },
  { metric: 'Customers', oct: 72, mar: 100 },
  { metric: 'Satisfaction', oct: 88, mar: 96 },
  { metric: 'On-Time', oct: 94, mar: 96 },
  { metric: 'Utilization', oct: 74, mar: 88 },
]

const channelGrowth = [
  { month: 'Oct', direct: 320, shopee: 82, lazada: 64, line: 56 },
  { month: 'Nov', direct: 368, shopee: 98, lazada: 74, line: 62 },
  { month: 'Dec', direct: 456, shopee: 124, lazada: 92, line: 78 },
  { month: 'Jan', direct: 402, shopee: 108, lazada: 82, line: 68 },
  { month: 'Feb', direct: 428, shopee: 116, lazada: 88, line: 72 },
  { month: 'Mar', direct: 484, shopee: 132, lazada: 96, line: 80 },
]

const CustomTreemapContent = ({ x, y, width, height, name, size, fill }) => {
  if (width < 30 || height < 20) return null
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} stroke="#fff" strokeWidth={2} rx={4} />
      {width > 60 && height > 30 && (
        <>
          <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle" fill="#fff" fontSize={10} fontWeight="bold">
            {name}
          </text>
          <text x={x + width / 2} y={y + height / 2 + 8} textAnchor="middle" fill="#fff" fontSize={9} opacity={0.9}>
            ฿{(size / 1000000).toFixed(1)}M
          </text>
        </>
      )}
    </g>
  )
}

export default function ChartsReport() {
  const [activeChart, setActiveChart] = useState('all')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-100 border border-violet-200">
            <BarChart2 className="h-6 w-6 text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Charts & Visualization</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Comprehensive business graphs & visualizations</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['all', 'revenue', 'ops', 'compare'].map(c => (
            <Button key={c} size="sm" variant={activeChart === c ? 'default' : 'outline'}
              onClick={() => setActiveChart(c)} className="text-xs h-7 capitalize">{c}</Button>
          ))}
        </div>
      </div>

      {/* Revenue vs Bookings Combo */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />Revenue vs Bookings — Composite Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={revenueVsBookings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={v => `฿${(v / 1000000).toFixed(1)}M`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v, n) => n === 'revenue' ? `฿${v.toLocaleString()}` : v} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue (฿)" fill="#6366f120" stroke="#6366f1" strokeWidth={2} />
              <Bar yAxisId="right" dataKey="bookings" name="Bookings" fill="#10b981" radius={[4, 4, 0, 0]} opacity={0.8} />
              <Line yAxisId="right" type="monotone" dataKey="avgValue" name="Avg Value (฿)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Route Revenue Treemap */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base flex items-center gap-2">
            <PieIcon className="h-4 w-4 text-indigo-500" />Route Revenue Treemap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <Treemap data={treemapData} dataKey="size" content={<CustomTreemapContent />} />
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Driver Scatter Plot */}
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base">Driver: Trips vs Earnings Scatter</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="trips" name="Trips" tick={{ fontSize: 11 }} label={{ value: 'Trips', position: 'insideBottom', offset: -5, fontSize: 11 }} />
                <YAxis dataKey="earnings" name="Earnings" tick={{ fontSize: 11 }} tickFormatter={v => `฿${(v / 1000).toFixed(0)}K`} />
                <ZAxis dataKey="rating" range={[40, 200]} name="Rating" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(v, n) => n === 'Earnings' ? `฿${v.toLocaleString()}` : v} />
                <Scatter name="Drivers" data={scatterData} fill="#6366f1" opacity={0.8} />
              </ScatterChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-1">Bubble size = Rating score</p>
          </CardContent>
        </Card>

        {/* Radar Comparison Oct vs Mar */}
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base">Business Performance: Oct vs Mar 2026</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarComparison}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 8 }} />
                <Radar name="Oct 2025" dataKey="oct" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.2} />
                <Radar name="Mar 2026" dataKey="mar" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `${v}/100`} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Channel Growth Stacked Area */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-500" />Booking Channel Growth — Stacked Area
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={channelGrowth}>
              <defs>
                {[
                  { id: 'direct', color: '#6366f1' },
                  { id: 'shopee', color: '#f97316' },
                  { id: 'lazada', color: '#3b82f6' },
                  { id: 'line', color: '#10b981' },
                ].map(g => (
                  <linearGradient key={g.id} id={`grad_${g.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={g.color} stopOpacity={0.6} />
                    <stop offset="95%" stopColor={g.color} stopOpacity={0.1} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="direct" name="Direct" stackId="1" stroke="#6366f1" fill="url(#grad_direct)" />
              <Area type="monotone" dataKey="shopee" name="Shopee" stackId="1" stroke="#f97316" fill="url(#grad_shopee)" />
              <Area type="monotone" dataKey="lazada" name="Lazada" stackId="1" stroke="#3b82f6" fill="url(#grad_lazada)" />
              <Area type="monotone" dataKey="line" name="LINE OA" stackId="1" stroke="#10b981" fill="url(#grad_line)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Booking Heatmap (simplified as bar groups) */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base">Booking Volume Heatmap — Day × Hour</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="text-left py-1 pr-3 font-medium">Day</th>
                  {['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map(h => (
                    <th key={h} className="text-center py-1 px-2 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapData.map(row => {
                  const values = [row.h6, row.h9, row.h12, row.h15, row.h18, row.h21]
                  const max = Math.max(...values)
                  return (
                    <tr key={row.day}>
                      <td className="py-1 pr-3 font-medium">{row.day}</td>
                      {values.map((v, i) => {
                        const intensity = v / max
                        const bg = `rgba(99, 102, 241, ${0.1 + intensity * 0.8})`
                        const textColor = intensity > 0.6 ? 'text-white' : 'text-gray-700'
                        return (
                          <td key={i} className="py-1 px-2 text-center">
                            <div className={`rounded px-2 py-1 font-medium ${textColor}`} style={{ backgroundColor: bg }}>
                              {v}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-2">Average bookings per time slot — darker = higher volume</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
