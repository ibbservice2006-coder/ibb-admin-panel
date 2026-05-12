import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customersApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

export function useCustomers(params = {}) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn:  () => customersApi.list(params).then(r => r.data),
    staleTime: 30_000,
  })
}

export function useCustomer(id) {
  return useQuery({
    queryKey: ['customers', id],
    queryFn:  () => customersApi.get(id).then(r => r.data),
    enabled:  !!id,
  })
}

export function useUpdateCustomer() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, data }) => customersApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] })
      toast({ title: 'Customer updated' })
    },
    onError: () => toast({ title: 'Update failed', variant: 'destructive' }),
  })
}
