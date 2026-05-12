import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pricingApi, currencyApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

// ─── Zone Prices ──────────────────────────────────────────────────────────────
export function usePrices(routeId) {
  return useQuery({
    queryKey: ['prices', routeId],
    queryFn:  () => pricingApi.list(routeId ? { routeId } : {}).then(r => r.data),
    staleTime: 60_000,
  })
}

export function useUpdatePrice() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, basePriceThb }) => pricingApi.update(id, { basePriceThb }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['prices'] })
      toast({ title: 'Price updated' })
    },
    onError: () => toast({ title: 'Update failed', variant: 'destructive' }),
  })
}

// ─── Festival Rules ───────────────────────────────────────────────────────────
export function useFestivals() {
  return useQuery({
    queryKey: ['festivals'],
    queryFn:  () => pricingApi.festivals().then(r => r.data),
    staleTime: 60_000,
  })
}

export function useCreateFestival() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (data) => pricingApi.createFest(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['festivals'] })
      toast({ title: 'Festival rule created' })
    },
  })
}

export function useUpdateFestival() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, ...data }) => pricingApi.updateFest(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['festivals'] })
      toast({ title: 'Festival rule updated' })
    },
  })
}

export function useDeleteFestival() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (id) => pricingApi.deleteFest(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['festivals'] })
      toast({ title: 'Festival rule deleted' })
    },
  })
}

// ─── Currencies ───────────────────────────────────────────────────────────────
export function useCurrencies() {
  return useQuery({
    queryKey: ['currencies'],
    queryFn:  () => currencyApi.list().then(r => r.data),
    staleTime: 60_000,
  })
}

export function useUpdateCurrencyRate() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ code, ...data }) => currencyApi.updateRate(code, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['currencies'] })
      toast({ title: 'Rate updated' })
    },
  })
}
