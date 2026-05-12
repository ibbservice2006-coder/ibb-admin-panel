import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * ApiErrorBanner — แสดงเมื่อ API ไม่ตอบสนอง
 * ใช้แทน silent fallback: ห้ามแสดง mock data เงียบๆ ใน production
 *
 * Usage:
 *   if (isError) return <ApiErrorBanner onRetry={refetch} />
 */
export function ApiErrorBanner({ onRetry, message }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 flex items-center gap-3">
      <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-red-800">
          ไม่สามารถเชื่อมต่อ API ได้
        </p>
        <p className="text-xs text-red-600 mt-0.5">
          {message ?? 'ข้อมูลที่แสดงอาจไม่ใช่ข้อมูลจริง กรุณา Refresh หรือตรวจสอบการเชื่อมต่อ'}
        </p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="border-red-300 text-red-700 hover:bg-red-100 shrink-0"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Retry
        </Button>
      )}
    </div>
  )
}

/**
 * ApiEmptyState — แสดงเมื่อ API ตอบ 200 แต่ไม่มีข้อมูล
 * ต่างจาก error: DB ว่างจริง ≠ API พัง
 */
export function ApiEmptyState({ message }) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <p className="text-sm">{message ?? 'ไม่มีข้อมูล'}</p>
    </div>
  )
}
