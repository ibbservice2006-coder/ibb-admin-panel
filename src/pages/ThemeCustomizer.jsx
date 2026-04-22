import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Palette, 
  Sun, 
  Moon, 
  Monitor, 
  Type,
  Layout,
  Zap,
  Check,
  RotateCcw,
  Download,
  Upload,
  Eye,
  Sparkles
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { toast } from '@/hooks/use-toast'

export default function ThemeCustomizer() {
  const { theme, setTheme } = useTheme()
  
  // Theme settings
  const [accentColor, setAccentColor] = useState(localStorage.getItem('accent-color') || 'blue')
  const [fontSize, setFontSize] = useState(parseInt(localStorage.getItem('font-size') || '16'))
  const [borderRadius, setBorderRadius] = useState(parseInt(localStorage.getItem('border-radius') || '8'))
  const [sidebarWidth, setSidebarWidth] = useState(parseInt(localStorage.getItem('sidebar-width') || '280'))
  const [compactMode, setCompactMode] = useState(localStorage.getItem('compact-mode') === 'true')
  const [animations, setAnimations] = useState(localStorage.getItem('animations') !== 'false')
  const [highContrast, setHighContrast] = useState(localStorage.getItem('high-contrast') === 'true')

  const accentColors = [
    { name: 'blue', value: '#3b82f6', label: 'Blue' },
    { name: 'purple', value: '#a855f7', label: 'Purple' },
    { name: 'pink', value: '#ec4899', label: 'Pink' },
    { name: 'green', value: '#22c55e', label: 'Green' },
    { name: 'orange', value: '#f97316', label: 'Orange' },
    { name: 'red', value: '#ef4444', label: 'Red' },
    { name: 'teal', value: '#14b8a6', label: 'Teal' },
    { name: 'indigo', value: '#6366f1', label: 'Indigo' }
  ]

  const presets = [
    { 
      name: 'Default', 
      theme: 'system', 
      accent: 'blue', 
      fontSize: 16, 
      borderRadius: 8,
      compact: false,
      animations: true,
      highContrast: false
    },
    { 
      name: 'Dark Pro', 
      theme: 'dark', 
      accent: 'purple', 
      fontSize: 15, 
      borderRadius: 12,
      compact: true,
      animations: true,
      highContrast: false
    },
    { 
      name: 'Light & Airy', 
      theme: 'light', 
      accent: 'teal', 
      fontSize: 16, 
      borderRadius: 16,
      compact: false,
      animations: true,
      highContrast: false
    },
    { 
      name: 'High Contrast', 
      theme: 'light', 
      accent: 'blue', 
      fontSize: 18, 
      borderRadius: 4,
      compact: false,
      animations: false,
      highContrast: true
    }
  ]

  // Apply settings
  useEffect(() => {
    const root = document.documentElement
    
    // Accent color
    const colorValue = accentColors.find(c => c.name === accentColor)?.value || '#3b82f6'
    root.style.setProperty('--accent-color', colorValue)
    localStorage.setItem('accent-color', accentColor)
    
    // Font size
    root.style.setProperty('--base-font-size', `${fontSize}px`)
    localStorage.setItem('font-size', fontSize.toString())
    
    // Border radius
    root.style.setProperty('--border-radius', `${borderRadius}px`)
    localStorage.setItem('border-radius', borderRadius.toString())
    
    // Sidebar width
    root.style.setProperty('--sidebar-width', `${sidebarWidth}px`)
    localStorage.setItem('sidebar-width', sidebarWidth.toString())
    
    // Compact mode
    if (compactMode) {
      root.classList.add('compact-mode')
    } else {
      root.classList.remove('compact-mode')
    }
    localStorage.setItem('compact-mode', compactMode.toString())
    
    // Animations
    if (!animations) {
      root.classList.add('no-animations')
    } else {
      root.classList.remove('no-animations')
    }
    localStorage.setItem('animations', animations.toString())
    
    // High contrast
    if (highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
    localStorage.setItem('high-contrast', highContrast.toString())
  }, [accentColor, fontSize, borderRadius, sidebarWidth, compactMode, animations, highContrast])

  const handleReset = () => {
    setTheme('system')
    setAccentColor('blue')
    setFontSize(16)
    setBorderRadius(8)
    setSidebarWidth(280)
    setCompactMode(false)
    setAnimations(true)
    setHighContrast(false)
    
    toast({
      title: 'Settings Reset',
      description: 'All theme settings have been reset to defaults'
    })
  }

  const handleApplyPreset = (preset) => {
    setTheme(preset.theme)
    setAccentColor(preset.accent)
    setFontSize(preset.fontSize)
    setBorderRadius(preset.borderRadius)
    setCompactMode(preset.compact)
    setAnimations(preset.animations)
    setHighContrast(preset.highContrast)
    
    toast({
      title: 'Preset Applied',
      description: `"${preset.name}" theme preset has been applied`
    })
  }

  const handleExport = () => {
    const settings = {
      theme,
      accentColor,
      fontSize,
      borderRadius,
      sidebarWidth,
      compactMode,
      animations,
      highContrast
    }
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'theme-settings.json'
    a.click()
    URL.revokeObjectURL(url)
    
    toast({
      title: 'Settings Exported',
      description: 'Theme settings have been exported successfully'
    })
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const settings = JSON.parse(event.target.result)
            setTheme(settings.theme || 'system')
            setAccentColor(settings.accentColor || 'blue')
            setFontSize(settings.fontSize || 16)
            setBorderRadius(settings.borderRadius || 8)
            setSidebarWidth(settings.sidebarWidth || 280)
            setCompactMode(settings.compactMode || false)
            setAnimations(settings.animations !== false)
            setHighContrast(settings.highContrast || false)
            
            toast({
              title: 'Settings Imported',
              description: 'Theme settings have been imported successfully'
            })
          } catch (error) {
            toast({
              title: 'Import Failed',
              description: 'Invalid settings file',
              variant: 'destructive'
            })
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Palette className="h-8 w-8" />
            Theme Customizer
          </h1>
          <p className="text-muted-foreground mt-1">
            Personalize your admin panel appearance and behavior
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button size="sm" variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="appearance" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="presets">Presets</TabsTrigger>
            </TabsList>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-4">
              {/* Theme Mode */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Theme Mode
                  </CardTitle>
                  <CardDescription>Choose your preferred color scheme</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-3 gap-4">
                    <div>
                      <RadioGroupItem value="light" id="light" className="peer sr-only" />
                      <Label
                        htmlFor="light"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <Sun className="mb-3 h-6 w-6" />
                        Light
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                      <Label
                        htmlFor="dark"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <Moon className="mb-3 h-6 w-6" />
                        Dark
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="system" id="system" className="peer sr-only" />
                      <Label
                        htmlFor="system"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <Monitor className="mb-3 h-6 w-6" />
                        System
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Accent Color */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Accent Color
                  </CardTitle>
                  <CardDescription>Choose your primary accent color</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-8 gap-3">
                    {accentColors.map(color => (
                      <button
                        key={color.name}
                        className={`h-12 w-12 rounded-lg border-2 transition-all hover:scale-110 ${
                          accentColor === color.name ? 'border-foreground ring-2 ring-offset-2' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => setAccentColor(color.name)}
                        title={color.label}
                      >
                        {accentColor === color.name && (
                          <Check className="h-6 w-6 mx-auto text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Typography */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Type className="h-5 w-5" />
                    Typography
                  </CardTitle>
                  <CardDescription>Adjust text size and readability</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Font Size</Label>
                      <span className="text-sm text-muted-foreground">{fontSize}px</span>
                    </div>
                    <Slider
                      value={[fontSize]}
                      onValueChange={(value) => setFontSize(value[0])}
                      min={12}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Advanced Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>High Contrast Mode</Label>
                      <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                    </div>
                    <Switch checked={highContrast} onCheckedChange={setHighContrast} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Animations</Label>
                      <p className="text-sm text-muted-foreground">Enable smooth transitions and effects</p>
                    </div>
                    <Switch checked={animations} onCheckedChange={setAnimations} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Layout Tab */}
            <TabsContent value="layout" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Layout className="h-5 w-5" />
                    Layout Settings
                  </CardTitle>
                  <CardDescription>Customize spacing and dimensions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Border Radius</Label>
                      <span className="text-sm text-muted-foreground">{borderRadius}px</span>
                    </div>
                    <Slider
                      value={[borderRadius]}
                      onValueChange={(value) => setBorderRadius(value[0])}
                      min={0}
                      max={20}
                      step={2}
                      className="w-full"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Sidebar Width</Label>
                      <span className="text-sm text-muted-foreground">{sidebarWidth}px</span>
                    </div>
                    <Slider
                      value={[sidebarWidth]}
                      onValueChange={(value) => setSidebarWidth(value[0])}
                      min={240}
                      max={360}
                      step={20}
                      className="w-full"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Reduce spacing for more content</p>
                    </div>
                    <Switch checked={compactMode} onCheckedChange={setCompactMode} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Presets Tab */}
            <TabsContent value="presets" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Presets
                  </CardTitle>
                  <CardDescription>Apply pre-configured theme settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {presets.map((preset) => (
                      <Card key={preset.name} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleApplyPreset(preset)}>
                        <CardHeader>
                          <CardTitle className="text-base">{preset.name}</CardTitle>
                          <div className="flex gap-2 pt-2">
                            <Badge variant="secondary">{preset.theme}</Badge>
                            <Badge 
                              className="text-white"
                              style={{ backgroundColor: accentColors.find(c => c.name === preset.accent)?.value }}
                            >
                              {preset.accent}
                            </Badge>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
              <CardDescription>See your changes in real-time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Settings</Label>
                <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Theme:</span>
                    <Badge variant="secondary">{theme}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Accent:</span>
                    <Badge 
                      className="text-white"
                      style={{ backgroundColor: accentColors.find(c => c.name === accentColor)?.value }}
                    >
                      {accentColor}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Font Size:</span>
                    <span>{fontSize}px</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Border Radius:</span>
                    <span>{borderRadius}px</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Compact:</span>
                    <span>{compactMode ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Sample Components</Label>
                <div className="space-y-3">
                  <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white w-full" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>Primary Button</Button>
                  <Button size="sm" variant="outline" className="w-full" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>Outline Button</Button>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Sample Card</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                      This is how cards will look with your current settings.
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
