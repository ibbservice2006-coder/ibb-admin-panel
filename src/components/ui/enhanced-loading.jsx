import { cn } from '@/lib/utils'
import { Loader2, Package, ShoppingCart, Users, BarChart3 } from 'lucide-react'

// Enhanced skeleton loader with shimmer effect
export function EnhancedSkeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted relative overflow-hidden",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
        className
      )}
      {...props}
    />
  )
}

// Table skeleton with multiple rows
export function TableSkeleton({ rows = 5, columns = 6 }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <EnhancedSkeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <EnhancedSkeleton 
              key={colIndex} 
              className={cn(
                "h-4",
                colIndex === 0 ? "w-16" : colIndex === columns - 1 ? "w-20" : "w-full"
              )} 
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// Card skeleton for dashboard cards
export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <EnhancedSkeleton className="h-4 w-32" />
        <EnhancedSkeleton className="h-4 w-4 rounded" />
      </div>
      <EnhancedSkeleton className="h-8 w-20" />
      <EnhancedSkeleton className="h-3 w-24" />
    </div>
  )
}

// Form skeleton
export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <EnhancedSkeleton className="h-4 w-20" />
          <EnhancedSkeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <EnhancedSkeleton className="h-4 w-24" />
          <EnhancedSkeleton className="h-10 w-full" />
        </div>
      </div>
      
      <div className="space-y-2">
        <EnhancedSkeleton className="h-4 w-28" />
        <EnhancedSkeleton className="h-20 w-full" />
      </div>
      
      <div className="flex justify-end space-x-2">
        <EnhancedSkeleton className="h-10 w-20" />
        <EnhancedSkeleton className="h-10 w-24" />
      </div>
    </div>
  )
}

// Enhanced loading spinner with context
export function LoadingSpinner({ 
  size = "default", 
  text = "Loading...", 
  icon: Icon = Loader2,
  className 
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  }

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Icon className={cn("animate-spin", sizeClasses[size])} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  )
}

// Page loading with context-aware icons
export function PageLoading({ context = "default" }) {
  const contextConfig = {
    products: { icon: Package, text: "Loading products..." },
    customers: { icon: Users, text: "Loading customers..." },
    orders: { icon: ShoppingCart, text: "Loading orders..." },
    analytics: { icon: BarChart3, text: "Loading analytics..." },
    default: { icon: Loader2, text: "Loading..." }
  }

  const config = contextConfig[context] || contextConfig.default

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <div className="relative">
          <config.icon className="h-12 w-12 animate-spin text-primary mx-auto" />
          <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-primary/20 animate-pulse-glow mx-auto"></div>
        </div>
        <p className="text-muted-foreground font-medium">{config.text}</p>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}

// Full page loading overlay
export function LoadingOverlay({ isVisible, text = "Loading..." }) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card rounded-lg p-8 shadow-lg border animate-fade-in-scale">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  )
}

// Button loading state
export function ButtonLoading({ children, isLoading, loadingText, ...props }) {
  return (
    <button {...props} disabled={isLoading || props.disabled}>
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingText || "Loading..."}
        </div>
      ) : (
        children
      )}
    </button>
  )
}

// Data loading states
export function EmptyState({ 
  icon: Icon = Package, 
  title = "No data found", 
  description = "There are no items to display at the moment.",
  action
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {action}
    </div>
  )
}

// Error state
export function ErrorState({ 
  title = "Something went wrong", 
  description = "We encountered an error while loading the data.",
  onRetry
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-destructive/10 p-6 mb-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
