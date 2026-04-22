import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  Smartphone, 
  Download, 
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trash2,
  Info,
  Zap,
  Globe,
  HardDrive
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function PWASettings() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [swRegistration, setSwRegistration] = useState(null)
  const [cacheSize, setCacheSize] = useState(0)

  useEffect(() => {
    // Check if app is installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Get service worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        setSwRegistration(registration)
      })
    }

    // Estimate cache size
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then((estimate) => {
        setCacheSize(Math.round((estimate.usage || 0) / 1024 / 1024 * 100) / 100)
      })
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) {
      toast({
        title: 'Already Installed',
        description: 'The app is already installed or not installable',
        variant: 'default'
      })
      return
    }

    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    
    if (outcome === 'accepted') {
      setIsInstalled(true)
      toast({
        title: 'App Installed',
        description: 'The app has been installed successfully'
      })
    }
    
    setInstallPrompt(null)
  }

  const handleUpdateServiceWorker = async () => {
    if (!swRegistration) {
      toast({
        title: 'No Service Worker',
        description: 'Service worker is not registered',
        variant: 'destructive'
      })
      return
    }

    try {
      await swRegistration.update()
      toast({
        title: 'Updated',
        description: 'Service worker has been updated'
      })
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const handleClearCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map(name => caches.delete(name)))
      setCacheSize(0)
      toast({
        title: 'Cache Cleared',
        description: 'All cached data has been removed'
      })
    }
  }

  const features = [
    {
      icon: Download,
      title: 'Installable',
      description: 'Install the app on your device for quick access',
      status: isInstalled || installPrompt ? 'available' : 'unavailable'
    },
    {
      icon: WifiOff,
      title: 'Offline Support',
      description: 'Access cached content even without internet',
      status: swRegistration ? 'available' : 'unavailable'
    },
    {
      icon: Zap,
      title: 'Fast Loading',
      description: 'Cached resources load instantly',
      status: swRegistration ? 'available' : 'unavailable'
    },
    {
      icon: Smartphone,
      title: 'Native Experience',
      description: 'App-like experience on mobile devices',
      status: 'available'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Smartphone className="h-8 w-8" />
            Progressive Web App
          </h1>
          <p className="text-muted-foreground mt-1">
            Install and manage the app on your device
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Badge className="bg-gray-700 hover:bg-gray-600 text-white gap-1">
              <Wifi className="h-3 w-3" />
              Online
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1">
              <WifiOff className="h-3 w-3" />
              Offline
            </Badge>
          )}
        </div>
      </div>

      {/* Installation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isInstalled ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Download className="h-5 w-5" />
            )}
            Installation Status
          </CardTitle>
          <CardDescription>
            {isInstalled 
              ? 'The app is installed on your device' 
              : 'Install the app for a better experience'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isInstalled ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>App Installed</AlertTitle>
              <AlertDescription>
                You can access this app from your device's home screen or app drawer.
              </AlertDescription>
            </Alert>
          ) : installPrompt ? (
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Ready to Install</AlertTitle>
                <AlertDescription>
                  Install this app on your device for quick access and offline support.
                </AlertDescription>
              </Alert>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white w-full" onClick={handleInstall}>
                <Download className="h-4 w-4 mr-2" />
                Install App
              </Button>
            </div>
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Installation Not Available</AlertTitle>
              <AlertDescription>
                The app may already be installed, or your browser doesn't support installation.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {feature.description}
                    </CardDescription>
                  </div>
                </div>
                {feature.status === 'available' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Service Worker Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Service Worker
          </CardTitle>
          <CardDescription>
            Manage background services and caching
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Status</p>
              <p className="text-sm text-muted-foreground">
                {swRegistration ? 'Active and running' : 'Not registered'}
              </p>
            </div>
            <Badge variant={swRegistration ? 'default' : 'secondary'}>
              {swRegistration ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Cache Size</p>
              <p className="text-sm text-muted-foreground">
                Estimated storage usage
              </p>
            </div>
            <Badge variant="secondary">
              <HardDrive className="h-3 w-3 mr-1" />
              {cacheSize} MB
            </Badge>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button size="sm" 
              variant="outline" 
              onClick={handleUpdateServiceWorker}
              disabled={!swRegistration}
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Update
            </Button>
            <Button size="sm" 
              variant="outline" 
              onClick={handleClearCache}
              className="flex-1"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cache
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>PWA Benefits</CardTitle>
          <CardDescription>
            Why you should install this app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Instant Loading</p>
                <p className="text-sm text-muted-foreground">
                  Cached resources load instantly without network delay
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Offline Access</p>
                <p className="text-sm text-muted-foreground">
                  Continue working even without internet connection
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Native Experience</p>
                <p className="text-sm text-muted-foreground">
                  Feels like a native app with full-screen mode
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Quick Access</p>
                <p className="text-sm text-muted-foreground">
                  Launch directly from your home screen or app drawer
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Automatic Updates</p>
                <p className="text-sm text-muted-foreground">
                  Always get the latest version automatically
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
