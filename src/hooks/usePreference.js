import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { preferencesApi } from '@/lib/api'

/**
 * usePreference(key, defaultValue)
 *
 * Reads/writes a per-admin preference stored in the DB.
 * Falls back to `defaultValue` when no preference has been saved yet.
 *
 * Returns:
 *   value       — current value (defaultValue if not yet saved)
 *   setValue    — async function to persist a new value
 *   isLoading   — true on initial load
 */
export function usePreference(key, defaultValue) {
  const queryClient = useQueryClient()
  const queryKey    = ['preferences', key]

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn:   () => preferencesApi.get(key).then(r => r.data),
    staleTime: Infinity, // preferences don't change unless we update them
    retry:     false,
  })

  const value = data?.value ?? defaultValue

  const mutation = useMutation({
    mutationFn: (newValue) => preferencesApi.set(key, newValue),
    onSuccess: (_res, newValue) => {
      // Update cache immediately for snappy UI
      queryClient.setQueryData(queryKey, { value: newValue })
    },
  })

  return {
    value,
    setValue:  mutation.mutate,
    isLoading,
    isSaving:  mutation.isPending,
  }
}
