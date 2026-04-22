import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { Download, User, Users, Star, TrendingUp, Clock, Award, AlertTriangle, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Mock driver report data
const driverPerformanceData = [
  { name: 'Somchai P.', trips: 45, rating: 4.2, earnings: 8500, complaints: 2 },
  { name: 'Arun K.', trips: 52, rating: 4.7, earnings: 9800, complaints: 0 },
  { name: 'Niran T.', trips: 38, rating: 3.9, earnings: 7200, complaints: 3 },
  { name: 'Wichai S.', trips: 48, rating: 4.5, earnings: 9100, complaints: 1 },
  { name: 'Pattaya M.', trips: 41, rating: 4.3, earnings: 7800, complaints: 1 }
]

const earningsData = [
  { date: 'Mar 15', earnings: 12500 },
  { date: 'Mar 16', earnings: 14200 },
  { date: 'Mar 17', earnings: 13100 },
  { date: 'Mar 18', earnings: 15800 },
  { date: 'Mar 19', earnings: 14500 },
  { date: 'Mar 20', earnings: 16900 },
  { date: 'Mar 22', earnings: 15100 }
]

const ratingDistribution = [
  { rating: '5 Stars', drivers: 8, percentage: 32 },
  { rating: '4 Stars', drivers: 12, percentage: 48 },
  { rating: '3 Stars', drivers: 4, percentage: 16 },
  { rating: '2 Stars', drivers: 1, percentage: 4 }
]

export default function DriversReport() {
  const { toast } = useToast()
  const handleExport = () => {
    const rows = [['#', 'Data', 'Value', 'Date']]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ibb_export.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: 'Exported', description: 'CSV downloaded successfully' })
  }

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast({ title: 'Data Refreshed', description: 'Driver report data has been updated.' })
  }

  // Statistics
  const totalDrivers = 25
  const avgRating = 4.3
  const totalEarnings = 105000
  const avgTripsPerDriver = Math.round(driverPerformanceData.reduce((sum, d) => sum + d.trips, 0) / driverPerformanceData.length)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Drivers Report</h1>
          <p className="text-muted-foreground mt-1">Performance metrics and analytics for all drivers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Drivers</p>
                <h3 className="text-2xl font-bold mt-1">{totalDrivers}</h3>
              </div>
              <div className="p-2 rounded-lg bg-slate-50">
                <Users className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                <h3 className="text-2xl font-bold mt-1 text-yellow-600">{avgRating} ⭐</h3>
              </div>
              <div className="p-2 rounded-lg bg-yellow-50">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                <h3 className="text-2xl font-bold mt-1 text-green-600">฿{totalEarnings.toLocaleString()}</h3>
              </div>
              <div className="p-2 rounded-lg bg-green-50">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Trips/Driver</p>
                <h3 className="text-2xl font-bold mt-1 text-blue-600">{avgTripsPerDriver}</h3>
              </div>
              <div className="p-2 rounded-lg bg-blue-50">
                <Award className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Driver Performance */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Driver Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={driverPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }} />
                <Legend />
                <Bar dataKey="trips" fill="#3b82f6" name="Trips" />
                <Bar dataKey="earnings" fill="#10b981" name="Earnings (฿)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Earnings Trend */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Total Earnings Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }} />
                <Line type="monotone" dataKey="earnings" stroke="#f59e0b" strokeWidth={2} name="Daily Earnings" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ratingDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">{item.rating}</p>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-bold">{item.drivers} drivers</p>
                  <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {driverPerformanceData.sort((a, b) => b.rating - a.rating).slice(0, 3).map((driver, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{driver.name}</p>
                  <p className="text-xs text-muted-foreground">{driver.trips} trips • {driver.rating} ⭐</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">฿{driver.earnings.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{driver.complaints === 0 ? 'No complaints' : `${driver.complaints} complaint${driver.complaints > 1 ? 's' : ''}`}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
