import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn:  () => dashboardApi.stats().then(r => r.data),
    refetchInterval: 30_000,
    staleTime: 10_000,
  })
}

export function useLiveOperations() {
  return useQuery({
    queryKey: ['dashboard', 'live'],
    queryFn:  () => dashboardApi.live().then(r => r.data),
    refetchInterval: 15_000, // live data polls every 15s
    staleTime: 5_000,
  })
}

export function useKPIMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'kpi'],
    queryFn:  () => dashboardApi.kpi().then(r => r.data),
    refetchInterval: 60_000, // KPI refreshes every 60s
    staleTime: 30_000,
  })
}

export function useSystemAlerts() {
  return useQuery({
    queryKey: ['dashboard', 'alerts'],
    queryFn:  () => dashboardApi.alerts().then(r => r.data),
    refetchInterval: 30_000, // alerts poll every 30s
    staleTime: 10_000,
  })
}
