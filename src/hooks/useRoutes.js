import { useQuery } from '@tanstack/react-query'
import { routesApi } from '@/lib/api'

export function useRoutes(params = {}) {
  return useQuery({
    queryKey: ['routes', params],
    queryFn:  () => routesApi.list(params).then(r => r.data),
    staleTime: 300_000, // routes ไม่เปลี่ยนบ่อย — cache 5 นาที
  })
}

export function useRoute(id) {
  return useQuery({
    queryKey: ['routes', id],
    queryFn:  () => routesApi.get(id).then(r => r.data),
    enabled:  !!id,
    staleTime: 300_000,
  })
}
