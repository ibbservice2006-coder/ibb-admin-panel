import { useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function GenericPage() {
  const location = useLocation()
  
  // Convert path to title
  const pathParts = location.pathname.split('/').filter(Boolean)
  const title = pathParts
    .map(part => part.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))
    .join(' > ')
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-2">Page for {location.pathname}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Area</CardTitle>
          <CardDescription>This page is ready for content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This is a placeholder page for <code className="bg-muted px-2 py-1 rounded">{location.pathname}</code>
            </p>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium mb-2">Page Details:</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>Route: <code className="text-foreground">{location.pathname}</code></li>
                <li>Page Title: <code className="text-foreground">{title}</code></li>
                <li>Status: Active</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
