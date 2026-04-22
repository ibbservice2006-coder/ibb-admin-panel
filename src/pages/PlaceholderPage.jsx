import { useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Generic placeholder page for all sub-menu routes
 * This ensures that all routes are valid and active state highlighting works correctly
 */
export default function PlaceholderPage() {
  const location = useLocation()
  
  // Convert path to readable title
  const pathParts = location.pathname.split('/').filter(Boolean)
  const title = pathParts
    .map(part => part.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))
    .join(' > ')
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-2">Content page for {location.pathname}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page Content</CardTitle>
          <CardDescription>This page is ready for your content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This is a placeholder page. You can add your custom content here.
            </p>
            <div className="p-4 bg-muted rounded-lg border">
              <p className="font-medium text-sm mb-2">Route Information:</p>
              <code className="text-xs bg-background p-2 rounded block">{location.pathname}</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
