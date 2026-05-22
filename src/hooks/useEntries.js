import { useEffect, useMemo, useState } from 'react'
import {
  subscribeToEntries,
  subscribeToCollaboratorEntries,
  createEntry,
  updateEntry,
  deleteEntry,
} from '@/services/entryService'
import { getDateRangeForPeriod } from '@/utils/dateRange'
import toast from 'react-hot-toast'

/**
 * Hook para entradas dentro de um período (day/week/month).
 * Retorna o array bruto + um mapa agregado por collaboratorId.
 */
export function useEntries(period = 'month') {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const range = useMemo(() => getDateRangeForPeriod(period), [period])

  useEffect(() => {
    setLoading(true)
    const unsub = subscribeToEntries(range, data => {
      setEntries(data)
      setLoading(false)
    })
    return unsub
  }, [range.fromDateKey, range.toDateKey])

  // Agrega por colaborador dentro do período
  const aggregated = useMemo(() => {
    const map = {}
    entries.forEach(e => {
      if (!map[e.collaboratorId]) {
        map[e.collaboratorId] = { valorVendido: 0, agendamentos: 0, cancelamentos: 0, count: 0 }
      }
      map[e.collaboratorId].valorVendido += e.valorVendido ?? 0
      map[e.collaboratorId].agendamentos += e.agendamentos ?? 0
      map[e.collaboratorId].cancelamentos += e.cancelamentos ?? 0
      map[e.collaboratorId].count += 1
    })
    return map
  }, [entries])

  const add = async (data) => {
    await createEntry(data)
    toast.success('Lançamento adicionado!')
  }

  const edit = async (id, data) => {
    await updateEntry(id, data)
    toast.success('Lançamento atualizado!')
  }

  const remove = async (id) => {
    await deleteEntry(id)
    toast.success('Lançamento removido.')
  }

  return { entries, aggregated, range, loading, add, edit, remove }
}

/**
 * Hook para entradas de um colaborador específico (todas)
 */
export function useCollaboratorEntries(collaboratorId) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!collaboratorId) return
    const unsub = subscribeToCollaboratorEntries(collaboratorId, data => {
      setEntries(data)
      setLoading(false)
    })
    return unsub
  }, [collaboratorId])

  return { entries, loading }
}
