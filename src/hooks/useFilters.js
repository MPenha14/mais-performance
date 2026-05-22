import { useState, useCallback } from 'react'

export function useFilters(defaults = {}) {
  const [filters, setFilters] = useState({
    period: 'month',
    unidade: 'all',
    ...defaults,
  })

  const setFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const reset = useCallback(() => {
    setFilters({ period: 'month', unidade: 'all', ...defaults })
  }, [])

  return { filters, setFilter, reset }
}
