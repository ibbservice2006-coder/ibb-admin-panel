import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  GripVertical,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Eye,
  BarChart3,
  TrendingUp,
  Users,
  MapPin,
  Clock,
  DollarSign
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { usePreference } from '@/hooks/usePreference'

// Available widgets catalog
const availableWidgets = [
  { id: 'revenue',     name: 'Revenue Chart',   icon: DollarSign, category: 'Financial',  description: 'Display revenue trends' },
  { id: 'bookings',    name: 'Bookings Stats',   icon: Clock,      category: 'Operations', description: 'Show booking statistics' },
  { id: 'drivers',     name: 'Drivers Online',   icon: Users,      category: 'Fleet',      description: 'Active drivers count' },
  { id: 'locations',   name: 'Top Locations',    icon: MapPin,     category: 'Analytics',  description: 'Popular pickup/dropoff' },
  { id: 'growth',      name: 'Growth Trend',     icon: TrendingUp, category: 'Analytics',  description: 'Monthly growth rate' },
  { id: 'performance', name: 'Performance',      icon: BarChart3,  category: 'Operations', description: 'System performance' },
]

const defaultLayout = [
  { id: 'widget-1', name: 'Revenue Chart',  size: 'large',  position: 1 },
  { id: 'widget-2', name: 'Bookings Stats', size: 'medium', position: 2 },
  { id: 'widget-3', name: 'Drivers Online', size: 'medium', position: 3 },
]

export default function DashboardBuilder() {
  const { toast } = useToast()
  const [isPreview, setIsPreview] = useState(false)

  // Synced to DB via usePreference
  const { value: widgets, setValue: saveWidgets, isLoading, isSaving } = usePreference(
    'dashboard_layout',
    defaultLayout
  )

  // Local editable copy — changes are staged until Save is clicked
  const [staged, setStaged] = useState(null)
  const current = staged ?? widgets

  const handleAddWidget = (widget) => {
    const updated = [...current, {
      id:       `widget-${Date.now()}`,
      name:     widget.name,
      size:     'medium',
      position: current.length + 1,
    }]
    setStaged(updated)
    toast({ title: 'Widget Added', description: `${widget.name} added. Click Save to persist.` })
  }

  const handleRemoveWidget = (id) => {
    setStaged(current.filter(w => w.id !== id))
  }

  const handleSave = () => {
    saveWidgets(current)
    setStaged(null)
    toast({ title: 'Layout Saved', description: 'Dashboard layout saved to your account.' })
  }

  const handleReset = () => {
    saveWidgets(defaultLayout)
    setStaged(null)
    toast({ title: 'Dashboard Reset', description: 'Dashboard has been reset to default layout.' })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
        Loading your dashboard layout...
      </div>
    )
  }

  const hasUnsaved = staged !== null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Builder</h1>
          <p className="text-muted-foreground mt-1">
            Customize your dashboard layout — changes sync to your account
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsPreview(!isPreview)}>
            <Eye className="h-4 w-4 mr-2" />
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset} disabled={isSaving}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            size="sm"
            className="bg-gray-700 hover:bg-gray-600 text-white"
            onClick={handleSave}
            disabled={!hasUnsaved || isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : hasUnsaved ? 'Save *' : 'Saved'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Available Widgets Sidebar */}
        <Card className="border-none shadow-sm lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Available Widgets</CardTitle>
            <CardDescription>Click + to add to layout</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {availableWidgets.map(widget => (
              <div
                key={widget.id}
                className="p-3 border rounded-lg hover:bg-slate-50 transition-colors cursor-default group"
              >
                <div className="flex items-start gap-2">
                  <widget.icon className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{widget.name}</p>
                    <p className="text-xs text-muted-foreground">{widget.category}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleAddWidget(widget)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Current Layout */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Current Layout</CardTitle>
              <CardDescription>
                {current.length} active widget{current.length !== 1 ? 's' : ''}
                {hasUnsaved && <span className="ml-2 text-yellow-600 font-medium">• Unsaved changes</span>}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {current.length > 0 ? (
                current.map((widget, idx) => (
                  <div
                    key={widget.id}
                    className="border rounded-lg p-4 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <GripVertical className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-sm">{widget.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {widget.size === 'large' ? 'Large' : 'Medium'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Position: #{widget.position}</p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <select
                          className="text-xs border rounded px-2 py-1 bg-white"
                          value={widget.size}
                          onChange={(e) => {
                            const updated = current.map((w, i) =>
                              i === idx ? { ...w, size: e.target.value } : w
                            )
                            setStaged(updated)
                          }}
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleRemoveWidget(widget.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-muted-foreground">No widgets added yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Add widgets from the sidebar to get started</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          {isPreview && (
            <Card className="border-none shadow-sm bg-slate-50">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Preview</CardTitle>
                <CardDescription>How your dashboard will look</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {current.map(widget => (
                    <div
                      key={widget.id}
                      className={`bg-white rounded-lg p-6 border border-slate-200 ${
                        widget.size === 'large' ? 'md:col-span-2' : ''
                      }`}
                    >
                      <div className="h-40 bg-slate-100 rounded flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">{widget.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
