import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingsApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

// Normalize API response → shape ที่ UI คาดหวัง
const normalizeBooking = (b) => ({
  _uuid:      b.id,                              // UUID สำหรับ API call
  id:         b.public_id,                       // IBB-YYYYMMDD-XXXXXX
  customer:   b.customer_name  ?? '-',
  phone:      b.customer_phone ?? '-',
  pickup:     b.pickup_location  ?? b.pickup_datetime,
  dropoff:    b.dropoff_location ?? '-',
  status:     b.status,
  date:       b.pickup_datetime?.split('T')[0] ?? '-',
  time:       b.pickup_datetime?.split('T')[1]?.slice(0, 5) ?? '-',
  fare:       parseFloat(b.final_price_thb ?? 0),
  finalPrice: parseFloat(b.final_price ?? 0),
  currency:   b.currency_code?.trim() ?? 'THB',
  routeName:  b.route_name ?? '-',
  vehicleType:b.vehicle_type_name ?? '-',
  passengers: b.passenger_count ?? '-',
  driver:     'Unassigned',   // Phase 2
  vehicle:    '-',            // Phase 2
  duration:   '-',            // Phase 2
  rating:     null,           // Phase 2
  source:     'Direct',       // Phase 2
  createdAt:  b.created_at,
})

export function useBookings(params = {}) {
  return useQuery({
    queryKey: ['bookings', params],
    queryFn:  () => bookingsApi.list(params).then(r => ({
      ...r.data,
      data: (r.data.data ?? []).map(normalizeBooking),
    })),
    staleTime: 15_000,
  })
}

export function useBooking(id) {
  return useQuery({
    queryKey: ['bookings', id],
    queryFn:  () => bookingsApi.get(id).then(r => r.data),
    enabled:  !!id,
  })
}

export function useConfirmBooking() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (id) => bookingsApi.confirm(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] })
      toast({ title: 'Booking confirmed' })
    },
    onError: () => toast({ title: 'Failed to confirm', variant: 'destructive' }),
  })
}

export function useCancelBooking() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, reason }) => bookingsApi.cancel(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] })
      toast({ title: 'Booking cancelled' })
    },
    onError: () => toast({ title: 'Failed to cancel', variant: 'destructive' }),
  })
}

export function useDeleteBooking() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (id) => bookingsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] })
      toast({ title: 'Booking deleted', description: 'Permanently deleted', variant: 'destructive' })
    },
    onError: () => toast({ title: 'Failed to delete', variant: 'destructive' }),
  })
}
