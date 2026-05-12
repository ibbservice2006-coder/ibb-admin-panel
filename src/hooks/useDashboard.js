import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn:  () => dashboardApi.stats().then(r => r.data),
    refetchInterval: 30_000, // polling ทุก 30 วินาที
    staleTime: 10_000,
  })
}
