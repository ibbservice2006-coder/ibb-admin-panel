import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Car, RefreshCw, AlertTriangle, Navigation, Phone, User, Clock } from 'lucide-react'

// Mock vehicle data with GPS coordinates (Thailand area)
const initialVehicles = [
  {
    id: 'V001', plate: 'AB-1234', driver: 'Somchai Jaidee', phone: '081-234-5678',
    lat: 13.7563, lng: 100.5018, status: 'on_trip',
    customer: 'John Smith', route: 'BKK Airport → Pattaya',
    eta: '14:30', speed: 85, heading: 'SE', lastUpdate: '10s ago',
    booking: 'IBB-2024-0891',
  },
  {
    id: 'V002', plate: 'Balance-5678', driver: 'Vichai Mankong', phone: '082-345-6789',
    lat: 13.8621, lng: 100.6078, status: 'on_trip',
    customer: 'Wang Lei', route: 'Suvarnabhumi → Hua Hin',
    eta: '16:45', speed: 92, heading: 'S', lastUpdate: '15s ago',
    booking: 'IBB-2024-0892',
  },
  {
    id: 'V003', plate: 'JCh-9012', driver: 'Prasit Deengam', phone: '083-456-7890',
    lat: 13.6900, lng: 100.7500, status: 'idle',
    customer: null, route: null,
    eta: null, speed: 0, heading: 'N', lastUpdate: '5s ago',
    booking: null,
  },
  {
    id: 'V004', plate: 'ChS-3456', driver: 'Anan Sukjai', phone: '084-567-8901',
    lat: 13.9200, lng: 100.4800, status: 'on_trip',
    customer: 'Dmitri Volkov', route: 'Don Mueang → Pattaya',
    eta: '15:20', speed: 78, heading: 'E', lastUpdate: '20s ago',
    booking: 'IBB-2024-0893',
  },
  {
    id: 'V005', plate: 'YD-7890', driver: 'Surachai Promdee', phone: '085-678-9012',
    lat: 13.6500, lng: 100.3200, status: 'alert',
    customer: 'Ahmed Al-Rashid', route: 'BKK Airport → Kanchanaburi',
    eta: '17:00', speed: 0, heading: 'W', lastUpdate: '45s ago',
    booking: 'IBB-2024-0894',
    alert: 'Idle over 15 minutes',
  },
  {
    id: 'V006', plate: 'QTH-1122', driver: 'Narong Srisawat', phone: '086-789-0123',
    lat: 14.0100, lng: 100.5500, status: 'offline',
    customer: null, route: null,
    eta: null, speed: 0, heading: 'N', lastUpdate: '5m ago',
    booking: null,
  },
]

const statusConfig = {
  on_trip: { label: 'On Trip', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500', markerColor: '#22c55e' },
  idle: { label: 'Idle', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500', markerColor: '#3b82f6' },
  alert: { label: 'Alert', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500 animate-pulse', markerColor: '#ef4444' },
  offline: { label: 'Offline', color: 'bg-gray-100 text-gray-500 border-gray-200', dot: 'bg-gray-400', markerColor: '#9ca3af' },
}

export default function LiveMap() {
  const [vehicles, setVehicles] = useState(initialVehicles)
  const [selected, setSelected] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef({})

  const stats = {
    total: vehicles.length,
    onTrip: vehicles.filter(v => v.status === 'on_trip').length,
    idle: vehicles.filter(v => v.status === 'idle').length,
    alert: vehicles.filter(v => v.status === 'alert').length,
    offline: vehicles.filter(v => v.status === 'offline').length,
  }

  // Simulate position updates
  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(v => {
        if (v.status === 'on_trip') {
          return {
            ...v,
            lat: v.lat + (Math.random() - 0.5) * 0.002,
            lng: v.lng + (Math.random() - 0.5) * 0.002,
            speed: Math.max(60, Math.min(120, v.speed + (Math.random() - 0.5) * 10)),
            lastUpdate: 'just now',
          }
        }
        return v
      }))
      setLastRefresh(new Date())
    }, 15000)
    return () => clearInterval(interval)
  }, [autoRefresh])

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    import('leaflet').then(L => {
      // Fix default icon
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: true })
        .setView([13.7563, 100.5018], 10)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map)

      mapInstanceRef.current = map

      // Add markers
      vehicles.forEach(v => {
        const color = statusConfig[v.status].markerColor
        const icon = L.divIcon({
          html: `<div style="background:${color};width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M5 11l1.5-4.5h11L19 11M17 16a1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1 1 1 0 011 1m-9 0a1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1 1 1 0 011 1M3 11h18v6H3z"/></svg>
          </div>`,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        })

        const marker = L.marker([v.lat, v.lng], { icon })
          .addTo(map)
          .bindPopup(`<b>${v.plate}</b><br/>${v.driver}<br/><span style="color:${color}">${statusConfig[v.status].label}</span>${v.route ? `<br/>${v.route}` : ''}`)

        marker.on('click', () => setSelected(v))
        markersRef.current[v.id] = marker
      })
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update marker positions
  useEffect(() => {
    if (!mapInstanceRef.current) return
    import('leaflet').then(L => {
      vehicles.forEach(v => {
        const marker = markersRef.current[v.id]
        if (marker) {
          marker.setLatLng([v.lat, v.lng])
        }
      })
    })
  }, [vehicles])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-green-100 border border-green-200">
            <MapPin className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Live Map</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Real-time Vehicle Tracking — Updates Every 15 Seconds</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Last: {lastRefresh.toLocaleTimeString('th-TH')}</span>
          <Button variant="outline" size="sm" onClick={() => setAutoRefresh(p => !p)}
            className={autoRefresh ? 'text-green-600 border-green-200' : ''}>
            <RefreshCw className={`h-3.5 w-3.5 mr-1 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto ON' : 'Auto OFF'}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Vehicles', value: stats.total, color: 'text-gray-700', bg: 'bg-gray-50' },
          { label: 'On Trip', value: stats.onTrip, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Idle', value: stats.idle, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Alert', value: stats.alert, color: 'text-red-700', bg: 'bg-red-50' },
          { label: 'Offline', value: stats.offline, color: 'text-gray-500', bg: 'bg-gray-50' },
        ].map(s => (
          <Card key={s.label} className={`${s.bg} border-0`}>
            <CardContent className="pt-3 pb-3 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alert Banner */}
      {stats.alert > 0 && (
        <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <div className="text-sm text-red-800">
            <span className="font-semibold">{stats.alert} Vehicle has notifications:</span>
            {vehicles.filter(v => v.status === 'alert').map(v => (
              <span key={v.id} className="ml-2">{v.plate} — {v.alert}</span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0 overflow-hidden rounded-xl">
              {/* Leaflet CSS */}
              <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
              <div ref={mapRef} style={{ height: '500px', width: '100%' }} />
            </CardContent>
          </Card>
        </div>

        {/* Vehicle List */}
        <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
          {vehicles.map(v => {
            const cfg = statusConfig[v.status]
            return (
              <Card key={v.id}
                className={`cursor-pointer transition-all border ${selected?.id === v.id ? 'border-blue-400 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => setSelected(v)}>
                <CardContent className="pt-3 pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                      <span className="font-semibold text-sm">{v.plate}</span>
                    </div>
                    <Badge className={`text-xs ${cfg.color}`}>{cfg.label}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" />{v.driver}
                  </p>
                  {v.route && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Navigation className="h-3 w-3" />{v.route}
                    </p>
                  )}
                  {v.eta && (
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" />ETA: {v.eta} · {Math.round(v.speed)} km/h
                    </p>
                  )}
                  {v.alert && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />{v.alert}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">Updated: {v.lastUpdate}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Selected Vehicle Detail */}
      {selected && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Car className="h-4 w-4 text-blue-600" />
              Details — {selected.plate}
              <Button variant="ghost" size="sm" className="ml-auto h-6 px-2 text-xs" onClick={() => setSelected(null)}>✕</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><p className="text-muted-foreground text-xs"> >Driver</p><p className="font-medium">{selected.driver}</p></div>
              <div><p className="text-muted-foreground text-xs">Phone number</p>
                <p className="font-medium flex items-center gap-1"><Phone className="h-3 w-3" />{selected.phone}</p>
              </div>
              <div><p className="text-muted-foreground text-xs">Customer</p><p className="font-medium">{selected.customer || '—'}</p></div>
              <div><p className="text-muted-foreground text-xs">Booking Ref</p><p className="font-medium">{selected.booking || '—'}</p></div>
              <div><p className="text-muted-foreground text-xs">Route</p><p className="font-medium">{selected.route || '—'}</p></div>
              <div><p className="text-muted-foreground text-xs">ETA</p><p className="font-medium">{selected.eta || '—'}</p></div>
              <div><p className="text-muted-foreground text-xs">Speed</p><p className="font-medium">{Math.round(selected.speed)} km/h</p></div>
              <div><p className="text-muted-foreground text-xs">Coordinates</p><p className="font-medium text-xs">{selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}</p></div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
