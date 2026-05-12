import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fleetApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

// ─── Drivers ──────────────────────────────────────────────────────────────────
export function useDrivers(params = {}) {
  return useQuery({
    queryKey: ['drivers', params],
    queryFn:  () => fleetApi.drivers(params).then(r => r.data),
    staleTime: 30_000,
  })
}

export function useCreateDriver() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (data) => fleetApi.createDriver(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['drivers'] })
      toast({ title: 'Driver added' })
    },
    onError: () => toast({ title: 'Failed to add driver', variant: 'destructive' }),
  })
}

export function useUpdateDriver() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, ...data }) => fleetApi.updateDriver(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['drivers'] })
      toast({ title: 'Driver updated' })
    },
  })
}

// ─── Vehicles ─────────────────────────────────────────────────────────────────
export function useVehicles(params = {}) {
  return useQuery({
    queryKey: ['vehicles', params],
    queryFn:  () => fleetApi.vehicles(params).then(r => r.data),
    staleTime: 30_000,
  })
}

export function useCreateVehicle() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (data) => fleetApi.createVehicle(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vehicles'] })
      toast({ title: 'Vehicle added' })
    },
  })
}

export function useUpdateVehicle() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, ...data }) => fleetApi.updateVehicle(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vehicles'] })
      toast({ title: 'Vehicle updated' })
    },
  })
}
